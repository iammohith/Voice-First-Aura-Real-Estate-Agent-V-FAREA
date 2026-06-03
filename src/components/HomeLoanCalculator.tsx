/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Project, UnitConfig } from "../types";
import { SAMPLE_PROJECTS } from "../data";
import { 
  Building, 
  Percent, 
  TrendingUp, 
  ShieldCheck, 
  AlertOctagon, 
  Info, 
  HelpCircle,
  FileCheck,
  CheckCircle,
  XCircle,
  Coins,
  ArrowRight,
  Home,
  Check,
  Briefcase,
  Layers,
  ChevronDown,
  Info as InfoIcon
} from "lucide-react";

interface HomeLoanCalculatorProps {
  selectedProject?: Project;
  onClose?: () => void;
}

export default function HomeLoanCalculator({ selectedProject, onClose }: HomeLoanCalculatorProps) {
  // 1. Projects and Price Variants State Management
  const [activeProject, setActiveProject] = useState<Project>(selectedProject || SAMPLE_PROJECTS[0]);
  const [activeUnitConfig, setActiveUnitConfig] = useState<UnitConfig>(
    (selectedProject || SAMPLE_PROJECTS[0]).unitConfigs[0]
  );
  // Custom slider value bounded between numericPriceMin and numericPriceMax
  const [customPrice, setCustomPrice] = useState<number>(
    (selectedProject || SAMPLE_PROJECTS[0]).unitConfigs[0].numericPriceMin
  );

  // Sync activeProject if the parent prop changes
  useEffect(() => {
    if (selectedProject) {
      setActiveProject(selectedProject);
    }
  }, [selectedProject?.id]);

  // Sync activeUnitConfig and customPrice when activeProject changes
  useEffect(() => {
    if (activeProject && activeProject.unitConfigs && activeProject.unitConfigs.length > 0) {
      const defaultUnit = activeProject.unitConfigs[0];
      setActiveUnitConfig(defaultUnit);
      setCustomPrice(defaultUnit.numericPriceMin);
    }
  }, [activeProject?.id]);

  // Sync customPrice when activeUnitConfig changes
  useEffect(() => {
    if (activeUnitConfig) {
      setCustomPrice(activeUnitConfig.numericPriceMin);
    }
  }, [activeUnitConfig?.type, activeUnitConfig?.numericPriceMin]);

  // Income and bureau inputs
  const [monthlySalary, setMonthlySalary] = useState<number>(120000); // Default: 1.2 Lakhs
  const [monthlyLiabilities, setMonthlyLiabilities] = useState<number>(15000); // Default: 15k EMIs
  const [cibilScore, setCibilScore] = useState<number>(760); // Default: 760
  const [tenureYears, setTenureYears] = useState<number>(20); // Default: 20 Years
  const [baseInterestRate, setBaseInterestRate] = useState<number>(8.5); // Default: 8.5%
  const [showAmortizationTip, setShowAmortizationTip] = useState<boolean>(false);

  // 2. Calculations
  // Calculate FOIR (Fixed Obligation to Income Ratio)
  let foirPercent = 45;
  if (monthlySalary > 200000) {
    foirPercent = 60;
  } else if (monthlySalary > 100000) {
    foirPercent = 55;
  } else if (monthlySalary > 50000) {
    foirPercent = 50;
  }

  // Max Allowed monthly obligations for total EMIs (new + existing)
  const allowedTotalObligation = Math.round((monthlySalary * foirPercent) / 100);
  
  // Net remaining monthly capacity for the new home loan EMI
  const netEmiCapacity = Math.max(0, allowedTotalObligation - monthlyLiabilities);

  // CIBIL Bureau underwriting offsets
  let cibilRatingGroup = "POOR";
  let rateAdjustment = 0;
  let eligibilityMultiplier = 0.0;
  let statusColor = "text-rose-400 bg-rose-950/40 border-rose-800/30";
  let statusLabel = "Below Score Cut-off";

  if (cibilScore >= 800) {
    cibilRatingGroup = "EXCELLENT";
    rateAdjustment = -0.20; // 20 bps discount
    eligibilityMultiplier = 1.10; // 10% booster
    statusColor = "text-emerald-400 bg-emerald-950/40 border-emerald-800/25";
    statusLabel = "Super Prime Elite";
  } else if (cibilScore >= 750) {
    cibilRatingGroup = "GOOD";
    rateAdjustment = 0.0; // Prime rate
    eligibilityMultiplier = 1.00; // Standard prime
    statusColor = "text-teal-400 bg-teal-950/40 border-teal-800/25";
    statusLabel = "Standard Prime";
  } else if (cibilScore >= 700) {
    cibilRatingGroup = "AVERAGE";
    rateAdjustment = 0.25; // 25 bps premium
    eligibilityMultiplier = 0.90; // 10% safety haircut
    statusColor = "text-amber-400 bg-amber-950/40 border-amber-800/25";
    statusLabel = "Marginal Prime";
  } else if (cibilScore >= 650) {
    cibilRatingGroup = "FAIR";
    rateAdjustment = 0.65; // 65 bps premium
    eligibilityMultiplier = 0.70; // 30% safety haircut
    statusColor = "text-orange-400 bg-orange-950/40 border-orange-800/25";
    statusLabel = "Subprime Tier-2";
  } else {
    cibilRatingGroup = "POOR";
    rateAdjustment = 2.0; // Penalty rating
    eligibilityMultiplier = 0.0; // Rejected
    statusColor = "text-rose-400 bg-rose-950/40 border-rose-800/30";
    statusLabel = "Bureau Rejected (< 650)";
  }

  const adjustedInterestRate = parseFloat((baseInterestRate + rateAdjustment).toFixed(2));
  const r = adjustedInterestRate / 12 / 100; // Monthly constant
  const n = tenureYears * 12; // Monthly installments

  // Calculate Maximum Borrowing Capacity (Standard banking inverse NPV)
  let maxLoanEligible = 0;
  if (r > 0 && n > 0 && netEmiCapacity > 0 && cibilScore >= 650) {
    const numerator = Math.pow(1 + r, n) - 1;
    const denominator = r * Math.pow(1 + r, n);
    const baseLoan = netEmiCapacity * (numerator / denominator);
    maxLoanEligible = Math.round(baseLoan * eligibilityMultiplier);
  }

  // 3. Asset-Specific Underwriting Mechanics For Chosen Variant & Price
  const standardLtvRatio = 80; // Standard 80% LTV bank quota
  const requiredLoanAmount = Math.round(customPrice * (standardLtvRatio / 100));
  const standardDownpayment = customPrice - requiredLoanAmount;

  // Actual sanctioned loan amount capped by theoretical capacity
  const approvedLoanAmount = cibilScore >= 650 ? Math.min(maxLoanEligible, requiredLoanAmount) : 0;
  const actualDownpaymentRequired = customPrice - approvedLoanAmount;
  const additionalDownpaymentNeeded = Math.max(0, actualDownpaymentRequired - standardDownpayment);

  // Calculate dynamic actual EMI for the approved loan
  let actualMonthlyEmi = 0;
  if (approvedLoanAmount > 0 && r > 0 && n > 0) {
    actualMonthlyEmi = Math.round(
      (approvedLoanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    );
  }

  // Underwriting Verdict categorization
  let verdictStatus: "APPROVED" | "ACTION_REQUIRED" | "DECLINED" = "APPROVED";
  let verdictTitle = "Qualified & Approved";
  let verdictMessage = "";
  let verdictSubtext = "";
  let verdictBadgeColor = "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
  let verdictGlowColor = "shadow-[0_0_20px_rgba(16,185,129,0.06)]";

  if (cibilScore < 650) {
    verdictStatus = "DECLINED";
    verdictTitle = "Underwriting Rejected";
    verdictMessage = "Bureau Credit Score below standard compliance threshold of 650.";
    verdictSubtext = "No financial institute can underwrite a home loan under current bureau scores.";
    verdictBadgeColor = "bg-rose-500/10 border-rose-500/30 text-rose-400";
    verdictGlowColor = "shadow-[0_0_20px_rgba(239,68,68,0.06)]";
  } else if (approvedLoanAmount < requiredLoanAmount) {
    verdictStatus = "ACTION_REQUIRED";
    verdictTitle = "Requires Additional Capital";
    verdictMessage = "Approved for a partial loan, but your income capacity caps the borrowing power.";
    verdictSubtext = `Requires an extra cash buffer of ${formatINR(additionalDownpaymentNeeded)} to close the loan gap.`;
    verdictBadgeColor = "bg-amber-500/10 border-amber-500/30 text-amber-400";
    verdictGlowColor = "shadow-[0_0_20px_rgba(245,158,11,0.06)]";
  } else {
    verdictStatus = "APPROVED";
    verdictTitle = "Fully Pre-Approved!";
    verdictMessage = "Your income leverage and credit report qualify for maximum 80% LTV funding.";
    verdictSubtext = `Perfect fit. Standard downpayment of ${formatINR(standardDownpayment)} is completely sufficient.`;
    verdictBadgeColor = "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
    verdictGlowColor = "shadow-[0_0_20px_rgba(16,185,129,0.06)]";
  }

  // Helper formatting function
  function formatINR(num: number) {
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Cr`;
    } else if (num >= 100000) {
      return `₹${(num / 100000).toFixed(1)} Lakh`;
    } else {
      return `₹${num.toLocaleString("en-IN")}`;
    }
  }

  // Render a visual progress/match meter
  const approvalPercent = requiredLoanAmount > 0 
    ? Math.min(100, Math.round((approvedLoanAmount / requiredLoanAmount) * 100)) 
    : 0;

  // Amortization bank quotes
  const sbiRateCalculated = parseFloat((8.40 + rateAdjustment).toFixed(2));
  const hdfcRateCalculated = parseFloat((8.50 + rateAdjustment).toFixed(2));
  const iciciRateCalculated = parseFloat((8.65 + rateAdjustment).toFixed(2));
  const licRateCalculated = parseFloat((8.45 + rateAdjustment).toFixed(2));

  const estimateEmiForBank = (rate: number) => {
    if (approvedLoanAmount <= 0) return 0;
    const rateMonthly = rate / 12 / 100;
    return Math.round((approvedLoanAmount * rateMonthly * Math.pow(1 + rateMonthly, n)) / (Math.pow(1 + rateMonthly, n) - 1));
  };

  const sbiEmi = estimateEmiForBank(sbiRateCalculated);
  const hdfcEmi = estimateEmiForBank(hdfcRateCalculated);
  const iciciEmi = estimateEmiForBank(iciciRateCalculated);
  const licEmi = estimateEmiForBank(licRateCalculated);

  const bankQuotations = [
    {
      name: "State Bank of India",
      role: "Sovereign Tier-1 Lender",
      adjustedRate: sbiRateCalculated,
      processingFee: "Flat ₹5,000 + GST",
      estimatedEmi: sbiEmi,
      approvedStatus: cibilScore >= 750 ? "Optimal Pricing" : cibilScore >= 650 ? "Permitted" : "Declined",
      brandColor: "border-sky-500/20 bg-sky-950/5",
      bulletColor: "bg-sky-400"
    },
    {
      name: "HDFC Private Finance Ltd",
      role: "Prime Private Underwriter",
      adjustedRate: hdfcRateCalculated,
      processingFee: "0.50% of Loan Amount",
      estimatedEmi: hdfcEmi,
      approvedStatus: cibilScore >= 750 ? "Optimal Pricing" : cibilScore >= 650 ? "Permitted" : "Declined",
      brandColor: "border-indigo-500/20 bg-indigo-950/5",
      bulletColor: "bg-indigo-400"
    },
    {
      name: "ICICI Bank Finance",
      role: "Structured Retail Desk",
      adjustedRate: iciciRateCalculated,
      processingFee: "0.40% Processing Tariff",
      estimatedEmi: iciciEmi,
      approvedStatus: cibilScore >= 700 ? "Highly Allowed" : cibilScore >= 650 ? "Standard" : "Declined",
      brandColor: "border-amber-500/20 bg-amber-950/5",
      bulletColor: "bg-amber-400"
    },
    {
      name: "LIC Housing Board",
      role: "Public Institutional Mortgage",
      adjustedRate: licRateCalculated,
      processingFee: "Flat ₹10,000 Processing",
      estimatedEmi: licEmi,
      approvedStatus: cibilScore >= 650 ? "Standard Approved" : "Declined",
      brandColor: "border-rose-500/20 bg-rose-950/5",
      bulletColor: "bg-rose-400"
    }
  ];

  return (
    <div className="bg-[#0b0b0e] border border-[#1f1f25] rounded-xl overflow-hidden shadow-2xl" id="loan-eligibility-calculator-view">
      
      {/* Visual Ambient Header Strip */}
      <div className="h-[2px] bg-gradient-to-r from-teal-500 via-indigo-500 to-amber-500 animate-pulse" />

      {/* Primary Context Header Bar */}
      <div className="px-5 py-4 bg-[#0e0e12] border-b border-[#1f1f25] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1 px-1.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-900/30">
            <Coins className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold uppercase text-white tracking-widest flex items-center gap-1.5">
              Mortgage & Underwriting Desk <span className="text-[10px] text-slate-500 font-normal">// LTV_STABILITY_ENGINE</span>
            </h3>
            <p className="text-[10px] font-mono text-[#6c6c73] mt-0.5 uppercase">
              Selected project: {activeProject.name} • {activeProject.location}
            </p>
          </div>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white px-3 py-1.5 text-[10px] font-mono border border-[#1f1f25] hover:bg-[#15151b] rounded transition-all cursor-pointer bg-[#0f0f13] hover:border-slate-700 uppercase"
          >
            Close Planner
          </button>
        )}
      </div>

      <div className="p-5 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ==================== LEFT SIDEBAR: ASSET AND CRITICAL PROFILE UNDERWRITING ==================== */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* STEP 1: Core Selection Dropdowns */}
          <div className="space-y-3 bg-[#0d0d12] border border-[#1f1f25] p-4 rounded-lg relative overflow-hidden">
            <div className="absolute right-0 top-0 w-24 h-24 bg-indigo-500/5 blur-xl pointer-events-none rounded-full" />
            
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono font-bold text-sky-400">
              <Building className="w-3.5 h-3.5" /> 1. Selected Asset Allocation
            </div>
            
            {/* Project dropdown selection */}
            <div className="space-y-1">
              <label className="text-[9.5px] font-mono text-slate-400 uppercase tracking-wider block">Target Real Estate Project</label>
              <div className="relative">
                <select
                  value={activeProject.id}
                  onChange={(e) => {
                    const found = SAMPLE_PROJECTS.find(p => p.id === e.target.value);
                    if (found) setActiveProject(found);
                  }}
                  className="w-full bg-[#0a0a0d] border border-[#1f1f25] text-slate-200 text-xs font-mono px-3 py-2.5 rounded focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all appearance-none cursor-pointer"
                >
                  {SAMPLE_PROJECTS.map(proj => (
                    <option key={proj.id} value={proj.id}>
                      {proj.name} ({proj.developer.split(" ")[0]})
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Dynamic Dropdown for all Property Price Variants */}
            <div className="space-y-1">
              <label className="text-[9.5px] font-mono text-slate-400 uppercase tracking-wider block">Price & Config Variant Descriptor</label>
              <div className="relative">
                <select
                  value={activeUnitConfig.type}
                  onChange={(e) => {
                    const found = activeProject.unitConfigs.find(uc => uc.type === e.target.value);
                    if (found) {
                      setActiveUnitConfig(found);
                    }
                  }}
                  className="w-full bg-[#0a0a0d] border border-[#1f1f25] text-slate-200 text-xs font-mono px-3 py-2.5 rounded focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all appearance-none cursor-pointer"
                >
                  {activeProject.unitConfigs.map(uc => (
                    <option key={uc.type} value={uc.type}>
                      {uc.type} ({uc.carpetArea}) • {uc.priceRange} [{uc.availability}]
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Price Tuning Slider per configuration */}
            {activeUnitConfig.numericPriceMin !== activeUnitConfig.numericPriceMax && (
              <div className="space-y-1 bg-[#111116] border border-[#1f1f25]/50 p-2.5 rounded mt-2">
                <div className="flex justify-between items-center text-[9.5px] font-mono">
                  <span className="text-slate-400 uppercase font-medium">Fine-tune Unit Pricing:</span>
                  <span className="text-white font-bold">{formatINR(customPrice)}</span>
                </div>
                <input
                  type="range"
                  min={activeUnitConfig.numericPriceMin}
                  max={activeUnitConfig.numericPriceMax}
                  step={50000}
                  value={customPrice}
                  onChange={(e) => setCustomPrice(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 h-1 bg-[#191921] rounded cursor-pointer mt-1"
                />
                <div className="flex justify-between text-[8px] font-mono text-[#5f5f69] mt-0.5">
                  <span>Base: {formatINR(activeUnitConfig.numericPriceMin)}</span>
                  <span>Max Limit: {formatINR(activeUnitConfig.numericPriceMax)}</span>
                </div>
              </div>
            )}
          </div>

          {/* STEP 2: Client Profile Constraints (Income, obligations, credit scoring) */}
          <div className="space-y-4 bg-[#0d0d12] border border-[#1f1f25] p-4 rounded-lg relative overflow-hidden">
            <div className="absolute right-0 bottom-0 w-24 h-24 bg-emerald-500/5 blur-xl pointer-events-none rounded-full" />
            
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono font-bold text-emerald-400">
              <Briefcase className="w-3.5 h-3.5" /> 2. Personal Income & Bureau Profile
            </div>

            {/* Monthly salary take-home */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-slate-400 uppercase">Monthly Net Income:</span>
                <span className="text-white font-extrabold">{formatINR(monthlySalary)}</span>
              </div>
              <input
                type="range"
                min="35000"
                max="500000"
                step="5000"
                value={monthlySalary}
                onChange={(e) => setMonthlySalary(parseInt(e.target.value))}
                className="w-full accent-emerald-500 h-1.2 bg-[#191921] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[8px] font-mono text-[#5f5f69]">
                <span>₹35k (Entry level)</span>
                <span>₹5 Lakh / mo (Executive)</span>
              </div>
            </div>

            {/* Existing monthly liabilities */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-slate-400 uppercase font-medium">Existing Financial EMIs / Debts:</span>
                <span className="text-amber-400 font-extrabold">{formatINR(monthlyLiabilities)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="150000"
                step="2500"
                value={monthlyLiabilities}
                onChange={(e) => setMonthlyLiabilities(parseInt(e.target.value))}
                className="w-full accent-amber-500 h-1.2 bg-[#191921] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[8px] font-mono text-[#5f5f69]">
                <span>₹0 (Debt Free)</span>
                <span>₹1.5 Lakh / mo</span>
              </div>
            </div>

            {/* Bureau record CIBIL */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-slate-400 uppercase font-medium">CIBIL Bureau Credit score:</span>
                <span className="text-sky-400 font-extrabold">{cibilScore}</span>
              </div>
              <input
                type="range"
                min="300"
                max="900"
                step="5"
                value={cibilScore}
                onChange={(e) => setCibilScore(parseInt(e.target.value))}
                className="w-full accent-sky-500 h-1.2 bg-[#191921] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[8px] font-mono text-[#5f5f69] pb-0.5">
                <span>300 (Subprime Bad)</span>
                <span>900 (Excellent Grade)</span>
              </div>
              
              <div className="flex justify-between items-center bg-[#13131a] p-2 rounded border border-[#1f1f25] mt-1.5">
                <span className="text-[9px] text-[#555] font-mono uppercase font-bold">Credit Tier Status:</span>
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded border font-semibold ${statusColor}`}>
                  {statusLabel}
                </span>
              </div>
            </div>

            {/* Loan Tenure years slider */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-slate-400 uppercase">Amortization tenure:</span>
                <span className="text-teal-400 font-extrabold">{tenureYears} Years</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                step="5"
                value={tenureYears}
                onChange={(e) => setTenureYears(parseInt(e.target.value))}
                className="w-full accent-teal-500 h-1.2 bg-[#191921] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[8px] font-mono text-[#5f5f69]">
                <span>5 Years (Low Interest)</span>
                <span>30 Years (Low Monthly EMI)</span>
              </div>
            </div>

          </div>

        </div>

        {/* ==================== RIGHT CONTENT: DETAILED FINANCIAL ANALYSIS & TRANS-BUDGET LOG ==================== */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* CRITICAL BLOCK: THE RECONCILED UNDERWRITING VERDICT CARD (HIGHLY IMPROVED UI/UX) */}
          <div className={`p-4 rounded-lg border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${verdictBadgeColor} ${verdictGlowColor}`}>
            <div className="space-y-1.5 flex-1 select-none">
              <div className="flex items-center gap-1.5">
                {verdictStatus === "APPROVED" ? (
                  <div className="p-1 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-400">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                  </div>
                ) : verdictStatus === "ACTION_REQUIRED" ? (
                  <div className="p-1 rounded-full bg-amber-500/15 border border-amber-500/20 text-amber-400">
                    <AlertOctagon className="w-4 h-4 shrink-0" />
                  </div>
                ) : (
                  <div className="p-1 rounded-full bg-rose-500/15 border border-rose-500/20 text-rose-400">
                    <XCircle className="w-4 h-4 shrink-0" />
                  </div>
                )}
                <span className="text-xs uppercase font-mono font-bold tracking-wider">{verdictTitle}</span>
              </div>
              <p className="text-[12px] font-sans font-medium text-white/90 leading-snug">
                {verdictMessage}
              </p>
              <p className="text-[10px] font-mono text-slate-300">
                {verdictSubtext}
              </p>
            </div>
            
            {/* Short visual summary circle inside the card */}
            <div className="flex flex-col items-center justify-center min-w-[120px] p-2 bg-[#000]/25 rounded text-center border border-white/5 font-mono">
              <span className="text-[8.5px] uppercase text-slate-400">Lender Match</span>
              <span className="text-lg font-extrabold mt-0.5">
                {verdictStatus === "DECLINED" ? "0%" : `${approvalPercent}%`}
              </span>
              <span className="text-[8px] text-slate-400 mt-1 uppercase">
                {verdictStatus === "APPROVED" ? "Fully Funded" : verdictStatus === "ACTION_REQUIRED" ? "Leverage Capped" : "Rejected"}
              </span>
            </div>
          </div>

          {/* DYNAMIC FUNDING SPECTRUM AND LOAN MATCH GAUGE (UX MASTERCLASS) */}
          <div className="bg-[#0d0d12] border border-[#1f1f25] p-4 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono font-bold text-sky-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> 3. Funding Allocations & Leverage Profile
              </span>
              <span className="text-[9.5px] font-mono text-[#5f5f69] uppercase font-semibold">
                LTV: {standardLtvRatio}% Approved Limit
              </span>
            </div>

            {/* Price configuration description headers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="bg-[#070709] border border-[#1f1f25] p-2.5 rounded text-center">
                <span className="text-[8.5px] font-mono text-[#5f5f69] uppercase font-bold block">Property Price</span>
                <strong className="text-sm font-mono text-white mt-0.5 block">{formatINR(customPrice)}</strong>
              </div>
              <div className="bg-[#070709] border border-[#1f1f25] p-2.5 rounded text-center">
                <span className="text-[8.5px] font-mono text-[#5f5f69] uppercase font-bold block">Maximum Loan Approved</span>
                <strong className={`text-sm font-mono mt-0.5 block ${approvedLoanAmount > 0 ? "text-emerald-400" : "text-rose-500"}`}>
                  {formatINR(approvedLoanAmount)}
                </strong>
              </div>
              <div className="bg-[#070709] border border-[#1f1f25] p-2.5 rounded text-center col-span-1">
                <span className="text-[8.5px] font-mono text-[#5f5f69] uppercase font-bold block">Cash Required on Hand</span>
                <strong className={`text-sm font-mono mt-0.5 block ${additionalDownpaymentNeeded > 0 ? "text-amber-400" : "text-white"}`}>
                  {formatINR(actualDownpaymentRequired)}
                </strong>
              </div>
            </div>

            {/* High-Fidelity Funding Bar Component */}
            <div className="space-y-1">
              <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden flex border border-[#1a1a22]">
                {approvedLoanAmount > 0 ? (
                  <>
                    <div 
                      style={{ width: `${(approvedLoanAmount / customPrice) * 100}%` }} 
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300"
                    />
                    <div 
                      style={{ width: `${((styleDownpayment: number) => (styleDownpayment / customPrice) * 100)(actualDownpaymentRequired)}%` }} 
                      className={`h-full transition-all duration-300 ${additionalDownpaymentNeeded > 0 ? "bg-amber-500" : "bg-sky-500"}`}
                    />
                  </>
                ) : (
                  <div className="w-full bg-rose-600/30 h-full" />
                )}
              </div>
              
              <div className="flex justify-between text-[9px] font-mono pt-1 text-[#5c5c64]">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                  <span>Approved Loan: {Math.max(0, approvalPercent)}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full inline-block ${additionalDownpaymentNeeded > 0 ? "bg-amber-500" : "bg-sky-400"}`} />
                  <span>Downpayment Needed: {approvedLoanAmount > 0 ? 100 - approvalPercent : 100}%</span>
                </div>
              </div>
            </div>

            {/* Informational notification on exact cash components */}
            {approvedLoanAmount > 0 && (
              <div className="p-3 bg-[#000]/10 rounded border border-[#1f1f25] text-[10.5px] text-[#8c8c9a] leading-relaxed flex items-start gap-2 select-none">
                <InfoIcon className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-300 block mb-0.5 uppercase tracking-wide text-[9px] font-mono">Cash Flow Breakup & Downpayment Advice</strong>
                  Requires a base downpayment of <strong className="text-white">{formatINR(standardDownpayment)}</strong> (20%). 
                  {additionalDownpaymentNeeded > 0 ? (
                    <span> Your borrowing power are limited by financial inputs. You need an <strong className="text-amber-400">additional {formatINR(additionalDownpaymentNeeded)} cash buffer</strong> to compensate, making total downpayment <strong className="text-white">{formatINR(actualDownpaymentRequired)}</strong>.</span>
                  ) : (
                    <span> Your credit and income profile are incredibly sound. Standard cash reserves are completely matched for immediate booking.</span>
                  )}{" "}
                  We recommend accounting for approximately <strong>5% extra</strong> for stamp duties, RERA registration fees, and legal documentation costs.
                </div>
              </div>
            )}
          </div>

          {/* CRUCIAL COMPUTATION MATRIX FOR TRANSPARENCY */}
          <div className="bg-[#0d0d12] border border-[#1f1f25] rounded-lg overflow-x-auto">
            <table className="w-full text-left text-xs font-mono min-w-[500px] sm:min-w-0">
              <thead>
                <tr className="bg-[#0e0e13] border-b border-[#23232a] text-[#55555d] uppercase text-[9px] font-bold tracking-wider select-none">
                  <th className="px-4 py-2.5">Bureau and Income Assessment Parameters</th>
                  <th className="px-4 py-2.5 text-right w-[180px]">Underwritten Ratio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e24] text-[#8c8c9a]">
                <tr>
                  <td className="px-4 py-2.5 text-slate-300">
                    Gross Monthly Net Income (Form-16)
                  </td>
                  <td className="px-4 py-2.5 text-right font-semibold text-white">{formatINR(monthlySalary)}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 text-slate-300">
                    Allowed Fixed Obligation to Income Ratio (FOIR)
                  </td>
                  <td className="px-4 py-2.5 text-right text-sky-400 font-bold">{foirPercent}%</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 text-slate-300">
                    Gross Permissible Institutional Debt Obligations
                  </td>
                  <td className="px-4 py-2.5 text-right text-white">{formatINR(allowedTotalObligation)}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 text-slate-300">
                    Less: Declared Outgoing Unregulated Debts
                  </td>
                  <td className="px-4 py-2.5 text-right text-amber-500">- {formatINR(monthlyLiabilities)}</td>
                </tr>
                <tr className="bg-[#0f1411]">
                  <td className="px-4 py-2.5 font-bold text-slate-300 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Maximum Permissible EMI Outflow
                  </td>
                  <td className="px-4 py-2.5 text-right text-emerald-400 font-extrabold">{formatINR(netEmiCapacity)} / mo</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 text-slate-300">
                    Target Property Selected Variant Pricing
                  </td>
                  <td className="px-4 py-2.5 text-right text-white font-bold">{formatINR(customPrice)}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 text-slate-300">
                    CIBIL Score Rate Adjustment Impact
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    {rateAdjustment < 0 ? (
                      <span className="text-emerald-400 font-bold">Premium Saving: -{Math.abs(rateAdjustment * 100)} bps</span>
                    ) : rateAdjustment === 0 ? (
                      <span className="text-[#666]">Standard Prime ROI</span>
                    ) : (
                      <span className="text-rose-400 font-bold">Risk Premium: +{rateAdjustment * 100} bps</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 text-slate-300">
                    CIBIL Bureau Funding Booster Multiplier
                  </td>
                  <td className="px-4 py-2.5 text-right text-sky-400 font-bold">
                    {eligibilityMultiplier > 1.0 ? `+${Math.round((eligibilityMultiplier - 1.0) * 100)}% Boost` : 
                     eligibilityMultiplier === 1.0 ? "Standard" : 
                     `${Math.round((1.0 - eligibilityMultiplier) * 100)}% Haircut`}
                  </td>
                </tr>
                <tr className="bg-[#0f1115]">
                  <td className="px-4 py-2.5 text-slate-300 font-bold">
                    Dynamic Projected EMI (Approved Loan Size)
                  </td>
                  <td className="px-4 py-2.5 text-right text-white font-black">{formatINR(actualMonthlyEmi)} / mo</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Underwriting Tip Toggle */}
          <div className="text-[10px] bg-[#0d0d12] border border-[#1f1f25] p-3 rounded font-mono">
            <span 
              onClick={() => setShowAmortizationTip(!showAmortizationTip)}
              className="text-slate-400 hover:text-indigo-400 cursor-pointer flex items-center gap-1.5 underline decoration-dotted transition-colors select-none"
            >
              <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              {showAmortizationTip ? "Hide underwriting mathematical formulation log" : "How does the underwriting engine calculate dynamic eligibility?"}
            </span>
            {showAmortizationTip && (
              <p className="text-[#6b6b75] mt-2 leading-relaxed animate-fade-in pr-2 select-none">
                The banking engine computes maximum sanctioned loan limit by establishing the client's <strong>Net Available EMI Cushion</strong> under FOIR regulations. Using CIBIL metrics, it adjusts the base interest rate (adding premium margins or offering premium discounts) and applies standard loan multiplier ratios. It solves present value for maximum possible loan size over selected years. If your chosen unit configuration falls below this ceiling, you are <strong>Fully Approved</strong>. Otherwise, the loan is capped at the maximum possible value, and you require a <strong>Higher Downpayment</strong> to close the gap.
              </p>
            )}
          </div>

        </div>
      </div>

      {/* ==================== TIER-1 INSTITUTIONS MATRIX (DYNAMIC BASED ON PROJECT VARIANT DETAILED ROI) ==================== */}
      <div className="p-5 bg-[#07070a] border-t border-[#1f1f25]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 mb-4">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
              Tier-1 Nationalized & Private Institutional Matrix
            </span>
            <p className="text-[10px] text-slate-500 font-mono">
              Quotas calculated for custom price: {formatINR(customPrice)} over {tenureYears} Years Amortization.
            </p>
          </div>
          <span className="text-[9px] font-mono px-2 py-0.5 self-start sm:self-auto bg-[#131317] border border-[#1f1f25] text-indigo-400 rounded">
            ROIs include Bureau Credit score margin Adjustments
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {bankQuotations.map((bank, idx) => {
            const isBankApproved = cibilScore >= 650;
            return (
              <div 
                key={idx} 
                className={`p-3.5 rounded border font-mono flex flex-col justify-between transition-all ${
                  isBankApproved 
                    ? `${bank.brandColor} border-[#25252e] hover:border-[#383842]` 
                    : "bg-[#0c0609] border-rose-950/20 opacity-60"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-900">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${bank.bulletColor}`} />
                      <span className="text-[11px] font-bold text-white tracking-tight">
                        {bank.name.split(" ")[0]} {bank.name.split(" ")[1] || ""}
                      </span>
                    </div>
                    <span className="text-[8px] uppercase text-[#61616c] font-black">{bank.role.split(" ")[0]}</span>
                  </div>

                  <div className="space-y-1.5 text-[10px]">
                    <div className="flex justify-between text-[#8c8c9a]">
                      <span>Effective ROI:</span>
                      <strong className="text-white font-bold">{isBankApproved ? `${bank.adjustedRate}%` : "—"}</strong>
                    </div>
                    <div className="flex justify-between text-[#8c8c9a]">
                      <span>Processing charge:</span>
                      <strong className="text-slate-300 font-semibold truncate max-w-[110px]" title={bank.processingFee}>
                        {bank.processingFee}
                      </strong>
                    </div>
                    <div className="flex justify-between text-[#8c8c9a]">
                      <span>Mortgage EMI:</span>
                      <strong className="text-sky-400 font-black">{isBankApproved && bank.estimatedEmi > 0 ? `${formatINR(bank.estimatedEmi)}/mo` : "—"}</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-[#1f1f25] flex items-center justify-between text-[10px]">
                  <span className="text-[#555] text-[8.5px] uppercase font-bold">STATUS</span>
                  {isBankApproved ? (
                    <strong className="text-emerald-400 font-extrabold text-[9.5px] uppercase">{bank.approvedStatus}</strong>
                  ) : (
                    <span className="text-rose-500 font-bold flex items-center gap-0.5 text-[9.5px] uppercase">
                      Declined
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
