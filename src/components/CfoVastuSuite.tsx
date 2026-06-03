/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Project } from "../types";
import {
  Compass,
  Percent,
  Calculator,
  Shield,
  HelpCircle,
  Globe,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Info
} from "lucide-react";

interface CfoVastuSuiteProps {
  selectedProject: Project;
  activeTab?: "finance" | "vastu" | "nri";
  onTabChange?: (tab: "finance" | "vastu" | "nri") => void;
  nriStatus?: boolean;
  onNriStatusChange?: (status: boolean) => void;
}

export default function CfoVastuSuite({ 
  selectedProject,
  activeTab: controlledActiveTab,
  onTabChange,
  nriStatus: controlledNriStatus,
  onNriStatusChange
}: CfoVastuSuiteProps) {
  // Tabs: "finance", "vastu", "nri"
  const [localActiveTab, setLocalActiveTab] = useState<"finance" | "vastu" | "nri">("finance");
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : localActiveTab;
  const setActiveTab = (tab: "finance" | "vastu" | "nri") => {
    setLocalActiveTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  // State-specific financial calculation settings
  const [selectedConfigIdx, setSelectedConfigIdx] = useState<number>(0);
  const [propertyValuePrice, setPropertyValuePrice] = useState<number>(15000000); // 1.5 Cr default
  const [downpaymentPct, setDownpaymentPct] = useState<number>(20);
  const [tenureYears, setTenureYears] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(8.5); // SBI/HDFC average
  
  // Vastu custom selections
  const [entranceDirection, setEntranceDirection] = useState<string>("North-East");
  const [kitchenDirection, setKitchenDirection] = useState<string>("South-East");
  
  // NRI specific configurations
  const [localNriStatus, setLocalNriStatus] = useState<boolean>(false);
  const nriStatus = controlledNriStatus !== undefined ? controlledNriStatus : localNriStatus;
  const setNriStatus = (val: boolean) => {
    setLocalNriStatus(val);
    if (onNriStatusChange) onNriStatusChange(val);
  };
  const [sourceAccount, setSourceAccount] = useState<"NRE" | "NRO" | "Direct">("NRE");

  // Preload property price whenever user switches selectedProject
  useEffect(() => {
    if (selectedProject && selectedProject.unitConfigs && selectedProject.unitConfigs.length > 0) {
      setSelectedConfigIdx(0);
      // Load first unit config's min price as default
      const minPrice = selectedProject.unitConfigs[0].numericPriceMin;
      setPropertyValuePrice(minPrice);
    }
  }, [selectedProject]);

  // Compute Loan Figures
  const downpaymentAmount = Math.round((propertyValuePrice * downpaymentPct) / 100);
  const loanPrincipal = propertyValuePrice - downpaymentAmount;
  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = tenureYears * 12;
  
  // Standard Amortization Math
  const monthlyEmi = Math.round(
    monthlyRate === 0
      ? loanPrincipal / totalMonths
      : (loanPrincipal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
          (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );

  // Mapped state-specific Stamp Duty, Registration & GST
  // Whitefield Bengaluru (Karnataka), Sector 65 Gurugram (Haryana), Hyderabad (Telangana), Thane West (Maharashtra MMR)
  const getTaxRates = () => {
    const loc = selectedProject.location.toLowerCase();
    const id = selectedProject.id.toLowerCase();
    if (loc.includes("bengaluru") || loc.includes("whitefield") || id.includes("solitaire")) {
      return {
        state: "Karnataka",
        stampDutyRate: 5.1,
        registrationRate: 1,
        gstRate: selectedProject.possessionDate.toLowerCase().includes("ready") ? 0 : 5, // under-construction gets GST
        reraGov: "KA RERA"
      };
    } else if (loc.includes("gurugram") || loc.includes("sector 65") || id.includes("horizon")) {
      return {
        state: "Haryana",
        stampDutyRate: 7.0,
        registrationRate: 1,
        gstRate: selectedProject.possessionDate.toLowerCase().includes("ready") ? 0 : 5,
        reraGov: "HARERA"
      };
    } else if (loc.includes("hyderabad") || loc.includes("telangana") || loc.includes("kokapet") || id.includes("legend")) {
      return {
        state: "Telangana",
        stampDutyRate: 5.5, // 4% Stamp duty + 1.5% GHMC Transfer duty
        registrationRate: 0.5, // 0.5% Registration Fee
        gstRate: selectedProject.possessionDate.toLowerCase().includes("ready") ? 0 : 5,
        reraGov: "TS RERA"
      };
    } else {
      // Default to Maharashtra MMR / Thane
      return {
        state: "Maharashtra",
        stampDutyRate: 6.0,
        registrationRate: 1,
        gstRate: selectedProject.possessionDate.toLowerCase().includes("ready") ? 0 : 5,
        reraGov: "MahaRERA"
      };
    }
  };

  const taxMetrics = getTaxRates();

  // Generate Price Options Dropdown Array
  const getPriceOptions = () => {
    const options: number[] = [];
    if (selectedProject?.unitConfigs && selectedProject.unitConfigs[selectedConfigIdx]) {
      const config = selectedProject.unitConfigs[selectedConfigIdx];
      const min = config.numericPriceMin;
      const max = config.numericPriceMax;
      
      const diff = max - min;
      let step = 500000; // 5 Lakhs default step
      if (diff > 30000000) {
        step = 5000000; // 50 Lakhs step
      } else if (diff > 15000000) {
        step = 2500000; // 25 Lakhs step
      } else if (diff > 5000000) {
        step = 1000000; // 10 Lakhs step
      }
      
      for (let val = min; val < max; val += step) {
        options.push(val);
      }
      if (!options.includes(max)) {
        options.push(max);
      }
    }
    return options;
  };

  const priceOptions = getPriceOptions();

  const stampDutyAmount = Math.round((propertyValuePrice * taxMetrics.stampDutyRate) / 100);
  const registrationAmount = Math.round((propertyValuePrice * taxMetrics.registrationRate) / 100);
  const gstAmount = Math.round((propertyValuePrice * taxMetrics.gstRate) / 100);
  
  // Section 194-IA of Income Tax Act: 1% TDS on property >= 50 Lakhs
  const tdsApplicable = propertyValuePrice >= 5000000;
  const tdsAmount = tdsApplicable ? Math.round(propertyValuePrice * 0.01) : 0;
  
  const totalAcquisitionEstimate = propertyValuePrice + stampDutyAmount + registrationAmount + gstAmount;

  // Format Helper to beautiful Indian currency representation (e.g. 1.5 Cr or 85 Lakhs)
  const formatIndianCurrency = (num: number) => {
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Cr`;
    } else if (num >= 100000) {
      return `₹${(num / 100000).toFixed(2)} Lakh`;
    } else {
      return `₹${num.toLocaleString("en-IN")}`;
    }
  };

  // Vastu Scoring Matrix based on traditional directions
  const getVastuScore = () => {
    let score = 0;
    let description = "";
    let remedy = "";

    // Entrance
    if (entranceDirection === "North-East" || entranceDirection === "East") {
      score += 60;
    } else if (entranceDirection === "North" || entranceDirection === "North-West") {
      score += 45;
    } else {
      score += 15; // South-West, South-East are generally avoided
    }

    // Kitchen
    if (kitchenDirection === "South-East") {
      score += 40;
    } else if (kitchenDirection === "North-West") {
      score += 30;
    } else {
      score += 10;
    }

    if (score >= 90) {
      description = "Celestial Alignment Match. Ideal for prosperity, health, and solar radiance.";
      remedy = "No remediation needed. Highly recommended structure.";
    } else if (score >= 60) {
      description = "Compliant Layout. Good energy flow balancing cosmic vibrations.";
      remedy = "Placing a copper pyramid crystal at the entrance increases flow.";
    } else {
      description = "Low Compliance Warning. South-West entrances lead to ground stress.";
      remedy = "Hang a traditional brass Panchmukhi Hanuman plate above the main frame door.";
    }

    return { score, description, remedy };
  };

  const vastuStats = getVastuScore();

  return (
    <div className="bg-[#0a0a0c] border border-[#1f1f23] rounded-xl overflow-hidden shadow-xl select-none" id="cfo-vastu-suite-dashboard">
      
      {/* Luxury Golden Highlight Accent Line */}
      <div className="h-[2px] bg-gradient-to-r from-blue-500 via-amber-500 to-blue-500" />

      {/* Header Banner */}
      <div className="p-4 bg-[#0d0d10] border-b border-[#1f1f23] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-amber-500" />
          <h3 className="text-xs font-mono font-bold uppercase text-white tracking-widest">
            PROtech Executive Suite // IND_RERA_COMPLIANT
          </h3>
        </div>
        <span className="text-[10px] font-mono font-medium text-[#666] uppercase bg-[#16161c] px-2 py-0.5 rounded border border-[#1f1f23]">
          {taxMetrics.state} Mode
        </span>
      </div>

      {/* Tab Selectors */}
      <div className="grid grid-cols-3 border-b border-[#1f1f23] bg-[#050506]">
        <button
          onClick={() => setActiveTab("finance")}
          className={`py-3 px-1 text-center font-mono text-[10.5px] font-bold uppercase transition-all tracking-wider cursor-pointer border-r border-[#1f1f23] ${
            activeTab === "finance"
              ? "text-blue-400 bg-[#0a0a0c] border-b-2 border-b-blue-500"
              : "text-[#666] hover:text-[#bbb] hover:bg-[#0c0c10]"
          }`}
        >
          <div className="flex items-center justify-center gap-1.5">
            <Calculator className="w-3.5 h-3.5" />
            CFO <span className="hidden sm:inline">Finance</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab("vastu")}
          className={`py-3 px-1 text-center font-mono text-[10.5px] font-bold uppercase transition-all tracking-wider cursor-pointer border-r border-[#1f1f23] ${
            activeTab === "vastu"
              ? "text-amber-400 bg-[#0a0a0c] border-b-2 border-b-amber-500"
              : "text-[#666] hover:text-[#bbb] hover:bg-[#0c0c10]"
          }`}
        >
          <div className="flex items-center justify-center gap-1.5">
            <Compass className="w-3.5 h-3.5 animate-spin-slow" />
            Vastu <span className="hidden sm:inline">Score</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab("nri")}
          className={`py-3 px-1 text-center font-mono text-[10.5px] font-bold uppercase transition-all tracking-wider cursor-pointer ${
            activeTab === "nri"
              ? "text-emerald-400 bg-[#0a0a0c] border-b-2 border-b-emerald-500"
              : "text-[#666] hover:text-[#bbb] hover:bg-[#0c0c10]"
          }`}
        >
          <div className="flex items-center justify-center gap-1.5">
            <Globe className="w-3.5 h-3.5" />
            NRI <span className="hidden sm:inline">FEMA Guide</span>
          </div>
        </button>
      </div>

      {/* Tab Content body */}
      <div className="p-5 min-h-[300px]">
        
        {/* TAB 1: FINANCE MODULE */}
        {activeTab === "finance" && (
          <div className="space-y-4 animate-fade-in">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-mono font-bold text-blue-400">
                Property Valuation & SBI/HDFC Premium Loan Rates
              </span>
              <p className="text-[11px] text-[#888] leading-tight">
                Instantly preloaded with official configuration quotes for <strong className="text-[#ccc]">{selectedProject.name}</strong>.
              </p>
            </div>

            {/* Inputs Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-[#666] uppercase block">Unit Configuration</label>
                <select
                  value={selectedConfigIdx}
                  onChange={(e) => {
                    const idx = parseInt(e.target.value);
                    setSelectedConfigIdx(idx);
                    if (selectedProject.unitConfigs && selectedProject.unitConfigs[idx]) {
                      setPropertyValuePrice(selectedProject.unitConfigs[idx].numericPriceMin);
                    }
                  }}
                  className="w-full bg-[#050506] border border-[#1f1f23] rounded px-2.5 py-1.5 text-xs text-white font-semibold font-mono cursor-pointer focus:border-blue-500 focus:outline-none"
                >
                  {selectedProject.unitConfigs?.map((config, idx) => (
                    <option key={idx} value={idx}>
                      {config.type} ({config.priceRange})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-[#666] uppercase block">Property Value Price</label>
                <select
                  value={propertyValuePrice}
                  onChange={(e) => setPropertyValuePrice(parseInt(e.target.value))}
                  className="w-full bg-[#050506] border border-[#1f1f23] rounded px-2.5 py-1.5 text-xs text-white font-semibold font-mono cursor-pointer focus:border-blue-500 focus:outline-none"
                >
                  {priceOptions.map((price, idx) => (
                    <option key={idx} value={price}>
                      {formatIndianCurrency(price)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price Slider for selecting within the configuration range */}
            {selectedProject.unitConfigs && selectedProject.unitConfigs[selectedConfigIdx] && (
              <div className="space-y-2 bg-[#0d0d10] border border-[#1f1f23] p-3.5 rounded-lg">
                <div className="flex justify-between text-[10px] font-mono font-bold text-[#888]">
                  <span className="uppercase">FINE-TUNE PROPERTY VALUE ({selectedProject.unitConfigs[selectedConfigIdx].type})</span>
                  <span className="text-white">Adjust Quote</span>
                </div>
                <input
                  type="range"
                  min={selectedProject.unitConfigs[selectedConfigIdx].numericPriceMin}
                  max={selectedProject.unitConfigs[selectedConfigIdx].numericPriceMax}
                  step={50000}
                  value={propertyValuePrice}
                  onChange={(e) => setPropertyValuePrice(parseInt(e.target.value))}
                  className="w-full accent-blue-500 h-1 bg-[#1a1a24] rounded-lg cursor-pointer animate-pulse-slow"
                />
                <div className="flex justify-between text-[9px] font-mono text-[#666]">
                  <span>Min: {formatIndianCurrency(selectedProject.unitConfigs[selectedConfigIdx].numericPriceMin)}</span>
                  <span>Max: {formatIndianCurrency(selectedProject.unitConfigs[selectedConfigIdx].numericPriceMax)}</span>
                </div>
              </div>
            )}

            {/* Interactive sliders for micro customization */}
            <div className="space-y-3 bg-[#0d0d10] border border-[#1f1f23] p-3.5 rounded-lg">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono font-bold text-[#888]">
                  <span className="uppercase">Downpayment Percentage</span>
                  <span className="text-white">{downpaymentPct}% ({formatIndianCurrency(downpaymentAmount)})</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="5"
                  value={downpaymentPct}
                  onChange={(e) => setDownpaymentPct(parseInt(e.target.value))}
                  className="w-full accent-blue-500 h-1 bg-[#1a1a24] rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono font-bold text-[#888]">
                  <span className="uppercase">Tenure Limit</span>
                  <span className="text-white">{tenureYears} Years</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="5"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(parseInt(e.target.value))}
                  className="w-full accent-blue-500 h-1 bg-[#1a1a24] rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono font-bold text-[#888]">
                  <span className="uppercase">Interest rate (Annual)</span>
                  <span className="text-white">{interestRate}%</span>
                </div>
                <input
                  type="range"
                  min="7.5"
                  max="11"
                  step="0.05"
                  value={interestRate}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                  className="w-full accent-blue-500 h-1 bg-[#1a1a24] rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Calculations summaries */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-950/10 border border-blue-500/20 rounded-lg p-3 flex flex-col justify-between">
                <span className="text-[10px] font-mono font-bold text-[#666] uppercase">Estimated EMI / Month</span>
                <span className="text-base font-mono font-bold text-blue-400 mt-1">
                  ₹{monthlyEmi.toLocaleString("en-IN")}
                </span>
                <span className="text-[9px] text-[#555] font-mono mt-0.5">SBI/HDFC competitive Tier-1</span>
              </div>

              <div className="bg-[#050506] border border-[#1f1f23] rounded-lg p-3 flex flex-col justify-between">
                <span className="text-[10px] font-mono font-bold text-[#666] uppercase">Total Acquisition</span>
                <span className="text-base font-mono font-bold text-white mt-1">
                  {formatIndianCurrency(totalAcquisitionEstimate)}
                </span>
                <span className="text-[9px] text-[#555] font-mono mt-0.5">Excludes registration variables</span>
              </div>
            </div>

            {/* State Taxes detail pane */}
            <div className="bg-[#050506] border border-[#1f1f23] rounded-lg p-3 text-[10.5px] space-y-1.5 font-mono">
              <div className="flex items-center justify-between text-xs font-bold border-b border-[#1f1f23] pb-1.5 text-white uppercase">
                <span>RERA Metric Breakdowns</span>
                <span className="text-blue-400 underline decoration-dotted">{taxMetrics.state}</span>
              </div>
              <div className="flex justify-between text-[#888]">
                <span>Stamp Duty ({taxMetrics.stampDutyRate}%):</span>
                <span className="text-white">{formatIndianCurrency(stampDutyAmount)}</span>
              </div>
              <div className="flex justify-between text-[#888]">
                <span>Registration Costs (1% Avg):</span>
                <span className="text-white">{formatIndianCurrency(registrationAmount)}</span>
              </div>
              <div className="flex justify-between text-[#888]">
                <span>GST ({taxMetrics.gstRate}%):</span>
                <span className="text-white">{formatIndianCurrency(gstAmount)}</span>
              </div>
              {tdsApplicable && (
                <div className="flex justify-between text-amber-400 font-bold border-t border-[#1f1f23] pt-1.5 mt-1">
                  <span className="flex items-center gap-1 text-[9.5px]">
                    <Shield className="w-3 h-3 text-amber-500" />
                    1% MANDATORY TDS (Section 194-IA):
                  </span>
                  <span>{formatIndianCurrency(tdsAmount)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: VASTU SHASTRA ORIENTATION MODULE */}
        {activeTab === "vastu" && (
          <div className="space-y-4 animate-fade-in">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono font-bold text-amber-400">
                Vastu Shastra Orientation Engine
              </span>
              <p className="text-[11px] text-[#888] leading-tight">
                Verify directional compliance layouts mapped directly against ancient cosmic alignment scripts.
              </p>
            </div>

            {/* Inputs Selection direction */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-[#666] uppercase block">Main Entrance Direction</label>
                <select
                  value={entranceDirection}
                  onChange={(e) => setEntranceDirection(e.target.value)}
                  className="w-full bg-[#050506] border border-[#1f1f23] rounded p-2 text-xs text-[#ccc] font-mono cursor-pointer focus:border-amber-500 focus:outline-none"
                >
                  <option value="North-East">North-East (perfect alignment)</option>
                  <option value="East">East (highly solar ready)</option>
                  <option value="North">North (wealth-creation path)</option>
                  <option value="North-West">North-West (neutral flow)</option>
                  <option value="South-East">South-East (fire domain caution)</option>
                  <option value="South-West">South-West (remedy required)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-[#666] uppercase block">Kitchen Placement</label>
                <select
                  value={kitchenDirection}
                  onChange={(e) => setKitchenDirection(e.target.value)}
                  className="w-full bg-[#050506] border border-[#1f1f23] rounded p-2 text-xs text-[#ccc] font-mono cursor-pointer focus:border-amber-500 focus:outline-none"
                >
                  <option value="South-East">South-East (Agni corner - ideal)</option>
                  <option value="North-West">North-West (wind region - good)</option>
                  <option value="North-East">North-East (water overlap - alert)</option>
                  <option value="South-West">South-West (imbalance risks)</option>
                </select>
              </div>
            </div>

            {/* Celestial Scorer Block */}
            <div className="bg-amber-950/10 border border-amber-500/20 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-mono font-bold text-[#666] uppercase">Vastu Compliance Score</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#888] text-xs font-mono">Rank:</span>
                  <span className={`text-base font-mono font-extrabold ${vastuStats.score >= 90 ? "text-emerald-400" : vastuStats.score >= 60 ? "text-amber-400" : "text-rose-400"}`}>
                    {vastuStats.score}%
                  </span>
                </div>
              </div>

              {/* Progress Bar of Celestial Scoring */}
              <div className="w-full h-1.5 bg-[#050506] border border-[#1f1f23] rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${vastuStats.score >= 90 ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : vastuStats.score >= 60 ? "bg-amber-500" : "bg-rose-500"}`}
                  style={{ width: `${vastuStats.score}%` }}
                />
              </div>

              <p className="text-[11px] text-[#aaa] italic leading-tight">
                "{vastuStats.description}"
              </p>
            </div>

            {/* Recommended Vastu Remedy box */}
            {vastuStats.score < 90 && (
              <div className="bg-[#050506] border border-amber-500/10 rounded p-3 flex gap-2 text-[10px] leading-relaxed text-[#888] font-mono">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-400 block uppercase">Remediation Script:</strong>
                  {vastuStats.remedy}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: NRI FEMA COMPLIANCE GUIDE */}
        {activeTab === "nri" && (
          <div className="space-y-4 animate-fade-in font-mono">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono font-bold text-emerald-400 block">
                FEMA Foreign Exchange Compliance Blueprint
              </span>
              <p className="text-[11px] text-[#888] leading-tight">
                Ensure compliance when acquiring Indian Real Estate assets from international banking channels.
              </p>
            </div>

            {/* Mode Selector */}
            <div className="bg-[#0d0d10] border border-[#1f1f23] p-3 rounded-lg flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs text-[#ccc]">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>Flag NRI (FEMA Rules):</span>
              </div>
              <button 
                onClick={() => setNriStatus(!nriStatus)}
                className={`px-3 py-1 text-[10px] rounded font-bold uppercase transition-all tracking-wider ${nriStatus ? "bg-emerald-600 border border-emerald-500 text-white" : "bg-[#050506] border border-[#1f1f23] text-[#555]"}`}
              >
                {nriStatus ? "CONFIG: ACTIVE" : "CONFIG: INACTIVE"}
              </button>
            </div>

            {nriStatus ? (
              <div className="space-y-3 animate-fade-in text-[10.5px]">
                {/* Account Source Selector */}
                <div className="space-y-1">
                  <span className="text-[#666] text-[9.5px] uppercase">Remittance Account Tier</span>
                  <div className="grid grid-cols-3 gap-2">
                    {["NRE Account", "NRO Account", "Direct Inward Remit"].map((item, id) => (
                      <button 
                        key={id} 
                        onClick={() => setSourceAccount(item.startsWith("NRE") ? "NRE" : item.startsWith("NRO") ? "NRO" : "Direct")}
                        className={`py-1.5 px-0.5 text-center text-[9px] rounded border font-semibold ${sourceAccount === (item.startsWith("NRE") ? "NRE" : item.startsWith("NRO") ? "NRO" : "Direct") ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400" : "bg-[#050506] border-[#1f1f23] text-[#666]"}`}
                      >
                        {item.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* FEMA Guide lists */}
                <div className="bg-[#050506] border border-[#1f1f23] p-3 rounded-lg space-y-2 text-[#888]">
                  <div className="flex items-start gap-1 pb-1 border-b border-[#1f1f23] text-[9.5px] text-[#ccc] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>VERIFIED ELIGIBLE UNDER FEMA ACQUISITION ACT</span>
                  </div>
                  <div className="space-y-1.5 text-[10px]">
                    <div className="flex justify-between">
                      <span>Source Funding Account:</span>
                      <strong className="text-white uppercase">{sourceAccount} Remittance</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Repatriation of Capital:</span>
                      <strong className="text-white uppercase">Allowed (Max 2 Properties)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Rent Repatriability:</span>
                      <strong className="text-white">Subject to NRO 15CA/15CB Forms</strong>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-[#050506] border border-[#1f1f23] rounded-lg text-center space-y-2">
                <Globe className="w-8 h-8 text-[#222] mx-auto" />
                <p className="text-[11px] text-[#666] leading-relaxed">
                  Turn on <strong className="text-[#888]">Flag NRI Mode</strong> above to auto-integrate Indian FEMA guidelines, foreign bank remittance routing checks, and dual Tax declarations.
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
