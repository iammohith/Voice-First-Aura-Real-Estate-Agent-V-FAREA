/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { UserCheck, ShieldAlert, Sparkles, RefreshCw } from "lucide-react";

interface BookingLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  projectId: string;
  projectName: string;
  preferredDate: string;
  preferredTime: string;
  createdAt: string;
}

export default function LeadActivityMonitor({ refreshTrigger }: { refreshTrigger: number }) {
  const [leads, setLeads] = useState<BookingLead[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      if (data.bookings) {
        setLeads(data.bookings);
      }
    } catch (e) {
      console.error("Failed to fetch leads from CRM endpoint:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [refreshTrigger]);

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) + " today";
    } catch (e) {
      return "Just now";
    }
  };

  return (
    <div className="bg-[#0a0a0c] border border-[#1f1f23] rounded-xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-blue-400 font-mono font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            CRM INTEGRATION // STREAM
          </div>
          <h3 className="text-base font-bold text-white mt-1">Live Qualification Log</h3>
        </div>
        <button
          onClick={fetchLeads}
          disabled={loading}
          className="p-2 bg-[#111115] hover:bg-[#16161c] disabled:opacity-50 text-[#888] hover:text-white rounded border border-[#1f1f23] transition-colors cursor-pointer"
          title="Force CRM Sync"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-blue-500" : ""}`} />
        </button>
      </div>

      <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1 select-none scrollbar-thin">
        {leads.length === 0 ? (
          <div className="py-10 text-center rounded bg-[#0d0d10] border border-[#1f1f23] border-dashed text-[#555] text-xs">
            <ShieldAlert className="w-8 h-8 text-[#333] mx-auto mb-2" />
            No leads qualified in this session.
            <div className="text-[10px] text-[#444] mt-1 font-mono">
              TALK TO VOICE ASSISTANT TO REGISTER RESERVATIONS.
            </div>
          </div>
        ) : (
          leads.map((lead) => (
            <div
              key={lead.id}
              className="p-3 bg-[#111115] hover:bg-[#16161c] border border-[#1f1f23] hover:border-blue-500/20 rounded transition-all flex items-start gap-3 relative overflow-hidden group animate-fade-in"
            >
              {/* Highlight background strip on hover */}
              <div className="absolute top-0 bottom-0 left-0 w-1 bg-blue-500 shadow-[0_0_8px_#3b82f6] transform origin-left transition-transform scale-y-0 group-hover:scale-y-100" />
              
              <div className="w-8 h-8 rounded bg-[#050506] text-blue-400 border border-[#1f1f23] flex items-center justify-center font-mono font-bold text-xs shrink-0 uppercase shadow-inner">
                {lead.name.substring(0, 2)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-[#e0e0e0] truncate">{lead.name}</h4>
                  <span className="text-[10px] text-[#555] shrink-0 font-mono">
                    {formatDate(lead.createdAt)}
                  </span>
                </div>
                
                <div className="text-[10.5px] text-[#888] mt-0.5 truncate font-mono">
                  Site Visit: <span className="text-blue-300 font-semibold">{lead.projectName.toUpperCase()}</span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 mt-2 text-[10px] font-mono">
                  <span className="px-1.5 py-0.5 rounded bg-[#050506] text-emerald-400 border border-[#1f1f23] flex items-center gap-1">
                    <UserCheck className="w-2.5 h-2.5 text-emerald-500" />
                    QUALIFIED
                  </span>
                  <span className="text-[#333] shrink-0">•</span>
                  <span className="text-[#666] truncate">{lead.phone}</span>
                  <span className="text-[#333] shrink-0">•</span>
                  <span className="text-[#666] truncate max-w-[100px]">{lead.preferredDate}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
