/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import ProjectList from "./components/ProjectList";
import VoiceBotWidget from "./components/VoiceBotWidget";
import SiteVisitBooking from "./components/SiteVisitBooking";
import LeadActivityMonitor from "./components/LeadActivityMonitor";
import CfoVastuSuite from "./components/CfoVastuSuite";
import HomeLoanCalculator from "./components/HomeLoanCalculator";
import { Project } from "./types";
import { SAMPLE_PROJECTS } from "./data";
import { 
  Compass, 
  Clock, 
  HelpCircle, 
  User, 
  Plus, 
  X,
  PhoneCall,
  CheckCircle,
  Building,
  Sparkles,
  Calculator,
  Globe,
  Coins
} from "lucide-react";

export default function App() {
  const [selectedProject, setSelectedProject] = useState<Project>(SAMPLE_PROJECTS[0]);
  const [bookingProject, setBookingProject] = useState<Project | null>(null);
  const [refreshLeadsTrigger, setRefreshLeadsTrigger] = useState(0);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [timeStr, setTimeStr] = useState("");
  const [activeSuiteTab, setActiveSuiteTab] = useState<"finance" | "vastu" | "nri">("finance");
  const [nriStatus, setNriStatus] = useState<boolean>(false);
  const [activeSuiteModal, setActiveSuiteModal] = useState<"finance" | "vastu" | "nri" | "loan_eligibility" | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const optionsStr = now.toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      });
      setTimeStr(`${optionsStr} IST`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Callback when a lead is booked
  const handleBookingSuccess = (booking: any) => {
    setRefreshLeadsTrigger((prev) => prev + 1);
    // Auto close modal slightly after confirmation
    setTimeout(() => {
      setBookingProject(null);
    }, 1200);
  };

  const handleBookingDetected = (projectName: string) => {
    // Audio trigger booking dialog focus
    const matchProj = SAMPLE_PROJECTS.find(p => p.name === projectName);
    if (matchProj) {
      setBookingProject(matchProj);
    }
  };

  const currentLocalTimeStr = () => {
    const now = new Date();
    const datePart = now.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
    const timePart = now.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });
    return `${datePart} • ${timePart} IST`;
  };

  return (
    <div className="min-h-screen bg-[#050506] text-[#e0e0e0] flex flex-col font-sans select-none antialiased selection:bg-blue-500 selection:text-white">
      
      {/* Background Ambient Glow Sprites */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(59,130,246,0.05)_0%,_transparent_50%)] pointer-events-none z-0" />

      {/* Main Luxury Header Navigation conforming to Immersive UI */}
      <header className="h-16 border-b border-[#1f1f23] bg-[#0a0a0c] flex items-center justify-between px-6 sticky top-0 z-40 select-none">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6] shrink-0"></div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-blue-400 font-mono font-bold tracking-widest uppercase">
                PRE-SALES CLIENT CONCIERGE
              </span>
            </div>
            <h1 className="text-sm font-semibold tracking-tight text-white uppercase leading-none mt-1">
              SIGNATURE ESTATES AI
            </h1>
          </div>
        </div>

        {/* Dynamic Uptime & Metrics Header */}
        <div className="flex gap-4 md:gap-8 text-[11px] font-mono tracking-tighter shrink-0">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[#666] text-[9px]">ENVIRONMENT</span>
            <span className="text-blue-300">PRODUCTION</span>
          </div>
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[#666] text-[9px]">DURABILITY</span>
            <span className="text-emerald-400">99.998%</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[#666] text-[9px]">LOCAL_TIME</span>
            <span className="text-white">{timeStr || "16:20:00 IST"}</span>
          </div>
          <button
            onClick={() => setShowFaqModal(true)}
            className="p-1.5 bg-[#111115] hover:bg-[#16161c] rounded border border-[#1f1f23] text-blue-400 hover:text-blue-300 transition-colors shrink-0 cursor-pointer self-center"
            title="System Specifications"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Grid Workspace */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Left Side: Property Listings Column (70% space) */}
        <section className="lg:col-span-8 space-y-8">
          
          {/* Active target showcase header banner conforming to Immersive UI */}
          {selectedProject && (
            <div className="p-5 bg-[#0a0a0c] border border-[#1f1f23] rounded-xl flex flex-col gap-4 shadow-xl select-none animate-fade-in relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest block font-extrabold flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    EXECUTIVE PORTFOLIO TARGET
                  </span>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_6px_#3b82f6]"></div>
                    {selectedProject.name}
                  </h2>
                  <p className="text-xs text-[#888] max-w-xl line-clamp-1">
                    Developer: {selectedProject.developer} — RERA Registration {selectedProject.reraId}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                  <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold uppercase rounded flex items-center gap-1.5 shadow-[0_0_8px_rgba(16,185,129,0.1)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    {selectedProject.location.toLowerCase().includes("hyderabad") ? "TS-RERA REGULATED" :
                     selectedProject.location.toLowerCase().includes("bengaluru") ? "KA-RERA REGULATED" :
                     selectedProject.location.toLowerCase().includes("gurugram") ? "HARERA REGULATED" : "MahaRERA REGULATED"}
                  </span>
                </div>
              </div>

              {/* Direct interactive access to Enterprise Decision suite popups */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#1f1f23]/60 select-none text-xs">
                <span className="text-[10.5px] font-mono font-bold text-blue-400 uppercase tracking-wide flex items-center gap-1.5 mr-1 font-extrabold">
                  Consultation Suites :
                </span>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    id="trigger-popup-emi"
                    onClick={() => {
                      setActiveSuiteTab("finance");
                      setActiveSuiteModal("finance");
                    }}
                    className="px-3 py-1.5 bg-blue-950/20 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 hover:border-blue-500/50 rounded font-semibold transition-all cursor-pointer flex items-center gap-1.5 hover:shadow-[0_0_10px_rgba(59,130,246,0.15)] font-mono text-[11px]"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    EMI & Finance
                  </button>
                  <button
                    id="trigger-popup-vastu"
                    onClick={() => {
                      setActiveSuiteTab("vastu");
                      setActiveSuiteModal("vastu");
                    }}
                    className="px-3 py-1.5 bg-amber-950/20 hover:bg-amber-600/20 text-amber-400 border border-amber-500/20 hover:border-amber-500/50 rounded font-semibold transition-all cursor-pointer flex items-center gap-1.5 hover:shadow-[0_0_10px_rgba(245,158,11,0.15)] font-mono text-[11px]"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    Vastu Shastra
                  </button>
                  <button
                    id="trigger-popup-nri"
                    onClick={() => {
                      setActiveSuiteTab("nri");
                      setNriStatus(true);
                      setActiveSuiteModal("nri");
                    }}
                    className="px-3 py-1.5 bg-emerald-950/20 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/50 rounded font-semibold transition-all cursor-pointer flex items-center gap-1.5 hover:shadow-[0_0_10px_rgba(16,185,129,0.15)] font-mono text-[11px]"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    NRI FEMA Guide
                  </button>
                  <button
                    id="trigger-popup-loan"
                    onClick={() => {
                      setActiveSuiteModal("loan_eligibility");
                    }}
                    className="px-3 py-1.5 bg-sky-950/20 hover:bg-sky-600/20 text-sky-400 border border-sky-500/20 hover:border-sky-500/50 rounded font-semibold transition-all cursor-pointer flex items-center gap-1.5 hover:shadow-[0_0_10px_rgba(14,165,233,0.15)] font-mono text-[11px] font-bold"
                  >
                    <Coins className="w-3.5 h-3.5 text-emerald-400" />
                    Loan Eligibility Calculator
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Core scrollable Project grid */}
          <ProjectList 
            onSelectProject={(proj) => setSelectedProject(proj)} 
            selectedProjectId={selectedProject?.id}
            onOpenBooking={(proj) => setBookingProject(proj)}
          />

          {/* Interactive CFO / Vastu Shastra Compliance and NRI Desk Suite */}
          <CfoVastuSuite 
            selectedProject={selectedProject} 
            activeTab={activeSuiteTab}
            onTabChange={(tab) => setActiveSuiteTab(tab)}
            nriStatus={nriStatus}
            onNriStatusChange={(status) => setNriStatus(status)}
          />
        </section>

        {/* Right Side: Voice Bot & Real-Time leads Sync Feed (30% space) */}
        <section className="lg:col-span-4 space-y-6">
          
          {/* Main pulsing voice-widget controller */}
          <VoiceBotWidget 
            activeProject={selectedProject}
            onBookingDetected={handleBookingDetected}
            onLeadAdded={() => setRefreshLeadsTrigger(prev => prev + 1)}
            onActionDetected={(action) => {
              if (action === "finance") {
                setActiveSuiteTab("finance");
                setActiveSuiteModal("finance");
              } else if (action === "vastu") {
                setActiveSuiteTab("vastu");
                setActiveSuiteModal("vastu");
              } else if (action === "nri") {
                setActiveSuiteTab("nri");
                setNriStatus(true);
                setActiveSuiteModal("nri");
              } else if (action === "loan_eligibility") {
                setActiveSuiteModal("loan_eligibility");
              }
              // Wait for render cycle, then scroll cleanly
              setTimeout(() => {
                const el = document.getElementById("cfo-vastu-suite-dashboard") || document.getElementById("loan-eligibility-calculator-view");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "center" });
                }
              }, 100);
            }}
          />

          {/* Lead sync log crm monitoring box */}
          <LeadActivityMonitor refreshTrigger={refreshLeadsTrigger} />
        </section>
      </main>

      {/* FOOTER */}
      <footer className="py-6 border-t border-slate-900 bg-slate-950 text-center select-none z-10 flex flex-col sm:flex-row items-center justify-between px-6 max-w-7xl mx-auto w-full text-slate-500 text-[11px] gap-2">
        <span>© 2026 Signature Estates AI. All rights reserved.</span>
        <div className="flex items-center gap-3">
          <span className="text-slate-600">Privacy Compliant (DPDPA)</span>
          <span className="text-slate-700 font-bold">•</span>
          <span className="text-slate-600">RERA Registration Guarantee</span>
        </div>
      </footer>

      {/* SITE VISIT BOOKING MODAL */}
      {bookingProject && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-md animate-fade-in">
            <button
              onClick={() => setBookingProject(null)}
              className="absolute right-4 top-4 p-1.5 bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg border border-slate-850 hover:border-slate-800 transition-colors z-10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <SiteVisitBooking 
              project={bookingProject} 
              onSuccess={handleBookingSuccess}
              onCancel={() => setBookingProject(null)}
            />
          </div>
        </div>
      )}

      {/* CFO / VASTU / NRI / LOAN ELIGIBILITY SUITE MODAL POPUP */}
      {activeSuiteModal && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-5xl bg-[#0b0c10] border border-slate-850 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveSuiteModal(null)}
              className="absolute right-4 top-4 sm:right-6 sm:top-6 p-1.5 bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg border border-slate-800 hover:border-slate-750 transition-colors z-10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mb-6 pr-12">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-full font-mono text-[10px] uppercase tracking-wider font-bold">
                <Sparkles className="w-3 h-3 animate-spin duration-10000" />
                Live Subsystem Popup
              </span>
              <h2 className="text-2xl font-bold font-sans text-white mt-2 flex items-center gap-2">
                <span>Enterprise Decision Suite</span>
                <span className="text-slate-500 font-normal">/</span> 
                <span className="text-amber-500 font-bold uppercase">
                  {activeSuiteModal === "finance" 
                    ? "EMI & CFO Planner" 
                    : activeSuiteModal === "vastu" 
                    ? "Vastu Direction Compliance" 
                    : activeSuiteModal === "nri"
                    ? "NRI Compliance Desk"
                    : "Home Loan Underwriter Eligibility Assessment"}
                </span>
              </h2>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                {activeSuiteModal === "loan_eligibility" 
                  ? "Real-time client income, FOIR capacity and credit underwriting check variables."
                  : `Loaded with real-time financial, vastu-spatial patterns, and FEMA legal directives for ${selectedProject?.name}. Adjust values below.`}
              </p>
            </div>
            
            {activeSuiteModal === "loan_eligibility" ? (
              <HomeLoanCalculator 
                selectedProject={selectedProject} 
                onClose={() => setActiveSuiteModal(null)} 
              />
            ) : (
              <CfoVastuSuite 
                selectedProject={selectedProject} 
                activeTab={activeSuiteModal}
                onTabChange={(tab) => {
                  setActiveSuiteModal(tab);
                  setActiveSuiteTab(tab);
                }}
                nriStatus={nriStatus}
                onNriStatusChange={(status) => setNriStatus(status)}
              />
            )}
          </div>
        </div>
      )}

      {/* RERA CHEATSHEET ACCORDION FAQ MODAL */}
      {showFaqModal && (
        <div className="fixed inset-0 bg-[#050506]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a0a0c] border border-[#1f1f23] max-w-lg w-full rounded-xl p-4 sm:p-6 shadow-2xl relative select-none animate-fade-in max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setShowFaqModal(false)}
              className="absolute right-4 top-4 p-1.5 bg-[#050506] border border-[#1f1f23] text-slate-400 hover:text-[#fff] rounded hover:border-blue-500/50 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-blue-400 font-mono font-bold uppercase text-xs">
              <Sparkles className="w-4 h-4 text-blue-500" />
              SYSTEM_COMPLIANCE // INFRASTRUCTURE
            </div>

            <h3 className="text-lg font-bold font-mono tracking-tight text-white mt-1.5">Compliance Cheat Sheet</h3>
            <p className="text-xs text-[#888] mt-0.5">Learn more about the Indian Real Estate Regulatory Authority rules mapped in this layout.</p>

            <div className="space-y-4 mt-5">
              <div className="p-3.5 bg-[#050506] rounded border border-[#1f1f23]">
                <h4 className="text-xs font-bold text-white flex items-center gap-2 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  1. PRICE QUOTE VERIFICATION CHECK
                </h4>
                <p className="text-[11px] text-[#888] mt-1 leading-relaxed">
                  Real Estate developers cannot advertise pricing outside approved ranges. Our client-side Price Guardrail scans chatbot speech; if a price is hallucinated or typed outside official limits, the system dynamically rewrites it to refer to the official price index.
                </p>
              </div>

              <div className="p-3.5 bg-[#050506] rounded border border-[#1f1f23]">
                <h4 className="text-xs font-bold text-white flex items-center gap-2 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  2. MANDATORY RERA NUMBERS
                </h4>
                <p className="text-[11px] text-[#888] mt-1 leading-relaxed">
                  It is a penal offense to discuss real estate attributes without stating approved RERA approval IDs. The bot automatically monitors output and dynamically appends RERA numbers if a project is under review.
                </p>
              </div>

              <div className="p-3.5 bg-[#050506] rounded border border-[#1f1f23]">
                <h4 className="text-xs font-bold text-white flex items-center gap-2 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  3. ABSOLUTE PRIVACY (DPDPA COMPLIANT)
                </h4>
                <p className="text-[11px] text-[#888] mt-1 leading-relaxed">
                  Under the new Digital Personal Data Protection Act, user voice structures must remain client-side. Edge STT converts sound safely in-browser, preventing private streams from leaking to server clusters.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowFaqModal(false)}
              className="mt-6 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold rounded text-xs transition-colors cursor-pointer shadow-[0_0_15px_rgba(59,130,246,0.2)]"
            >
              UNDERSTAND COMPLIANCE SYSTEM
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
