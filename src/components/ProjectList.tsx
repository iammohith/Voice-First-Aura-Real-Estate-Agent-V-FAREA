/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Project } from "../types";
import { SAMPLE_PROJECTS } from "../data";
import {
  MapPin,
  Calendar,
  Layers,
  Award,
  Sparkles,
  Building,
  Info,
  Mic,
} from "lucide-react";

interface ProjectListProps {
  onSelectProject: (project: Project) => void;
  selectedProjectId?: string;
  onOpenBooking: (project: Project) => void;
}

export default function ProjectList({
  onSelectProject,
  selectedProjectId,
  onOpenBooking,
}: ProjectListProps) {
  const [filterRegion, setFilterRegion] = useState<string>("all");

  const regions = [
    { value: "all", label: "All Markets" },
    { value: "bengaluru", label: "Bengaluru" },
    { value: "gurugram", label: "Gurugram (NCR)" },
    { value: "mumbai", label: "Mumbai MMR" },
    { value: "hyderabad", label: "Hyderabad" },
  ];

  const filteredProjects = SAMPLE_PROJECTS.filter((proj) => {
    if (filterRegion === "all") return true;
    return proj.location.toLowerCase().includes(filterRegion.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Region filter and stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building className="w-5 h-5 text-blue-500 shadow-[0_0_8px_#3b82f6]" />
            Signature Portfolios
          </h2>
          <p className="text-xs text-[#888] mt-1">
            Explore premium ultra-luxury real estate listings. RERA-approved, secure investments.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 select-none scrollbar-none">
          {regions.map((reg) => (
            <button
              key={reg.value}
              onClick={() => setFilterRegion(reg.value)}
              className={`px-3 py-1.5 rounded text-xs font-mono font-semibold shrink-0 transition-all cursor-pointer border ${
                filterRegion === reg.value
                  ? "bg-blue-600 text-white border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)] animate-pulse"
                  : "bg-[#0d0d10] text-[#888] border-[#1f1f23] hover:bg-[#16161c] hover:border-blue-500/30"
              }`}
            >
              {reg.label.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((proj) => {
          const isFocused = selectedProjectId === proj.id;

          return (
            <div
              key={proj.id}
              onClick={() => onSelectProject(proj)}
              className={`bg-[#0a0a0c] border rounded-xl overflow-hidden transition-all duration-300 flex flex-col hover:translate-y-[-2px] relative group cursor-pointer ${
                isFocused
                  ? "border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.12)]"
                  : "border-[#1f1f23] hover:border-blue-500/30"
              }`}
            >
              {/* Image banner */}
              <div className="h-44 w-full relative overflow-hidden bg-slate-900 group">
                <img
                  src={proj.image}
                  alt={proj.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/40 to-transparent" />
                
                {/* Upper premium tags */}
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#050506]/95 backdrop-blur-md rounded text-[10px] font-mono font-bold text-blue-400 border border-blue-500/30 flex items-center gap-1.5 shadow-[0_0_8px_rgba(59,130,246,0.2)]">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div>
                  RERA APPROVED
                </span>

                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-blue-400 tracking-wider uppercase block">
                      {proj.developer}
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">{proj.name}</h3>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col space-y-4">
                {/* Location and possession */}
                <div className="grid grid-cols-2 gap-3 text-xs text-[#888] font-semibold">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span className="truncate">{proj.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate justify-end font-mono text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>{proj.possessionDate.toUpperCase()}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-[#888] line-clamp-2 leading-relaxed font-normal">
                  {proj.description}
                </p>

                {/* Specs and configs */}
                <div className="bg-[#050506] border border-[#1f1f23] rounded-lg p-3 space-y-2 shadow-inner">
                  <div className="flex items-center justify-between border-b border-[#1f1f23] pb-1.5 text-[10px] font-mono font-bold text-[#666] uppercase tracking-wide">
                    <span>Configurations</span>
                    <span>Starting Price</span>
                  </div>
                  <div className="space-y-1.5">
                    {proj.unitConfigs.map((config, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-[#ccc] flex items-center gap-1">
                          <Layers className="w-3 h-3 text-blue-500/70" />
                          {config.type}
                          <span className="text-[10px] font-mono text-[#555]">({config.carpetArea})</span>
                        </span>
                        <span className="text-white font-mono">{config.priceRange}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* RERA Details */}
                <div className="flex items-center gap-1.5 bg-[#0d0d10] border border-[#1f1f23] rounded p-2.5 text-[10.5px] text-[#888] shrink-0 font-medium">
                  <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span className="truncate font-mono">ID: {proj.reraId}</span>
                </div>

                {/* Highlights bullets list on hover wrapper */}
                <div className="space-y-1 text-[11px] text-[#888] border-t border-[#1f1f23] pt-3 flex-1">
                  <span className="text-[10px] font-mono font-bold text-[#666] uppercase flex items-center gap-1 select-none">
                    <Sparkles className="w-2.5 h-2.5 text-blue-500" />
                    Premium Highlights
                  </span>
                  <div className="space-y-1 mt-1.5">
                    {proj.highlights.slice(0, 2).map((hi, i) => (
                      <div key={i} className="flex items-start gap-1">
                        <span className="text-blue-500 select-none font-bold shrink-0">•</span>
                         <span className="leading-tight truncate">{hi}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Control Action buttons */}
                <div className="flex gap-2.5 pt-2 select-none" onClick={(e) => e.stopPropagation()}>
                  {/* Focus Voice Advisor */}
                  <button
                    onClick={() => onSelectProject(proj)}
                    className={`flex-1 py-2 px-3 border rounded text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isFocused
                        ? "bg-blue-500/10 border-blue-500/50 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.15)]"
                        : "bg-[#0d0d10] hover:bg-[#16161c] border-[#1f1f23] hover:border-blue-500/20 text-[#888] hover:text-[#ccc]"
                    }`}
                  >
                    <Mic className={`w-3.5 h-3.5 ${isFocused ? "text-blue-400 animate-pulse" : "text-[#555]"}`} />
                    {isFocused ? "ACTIVE CONCIERGE" : "ACTIVATE ADVISOR"}
                  </button>

                  {/* Booking form site-tour */}
                  <button
                    onClick={() => onOpenBooking(proj)}
                    className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold rounded text-xs transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:translate-y-[-1px] active:translate-y-0 cursor-pointer shrink-0"
                  >
                    VIP_TOUR
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
