/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Calendar, Clock, User, Phone, Mail, CheckCircle2 } from "lucide-react";
import { Project } from "../types";

interface SiteVisitBookingProps {
  project: Project;
  onSuccess: (bookingDetail: any) => void;
  onCancel?: () => void;
}

export default function SiteVisitBooking({ project, onSuccess, onCancel }: SiteVisitBookingProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !date || !time) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          projectId: project.id,
          projectName: project.name,
          preferredDate: date,
          preferredTime: time,
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Save to sessionStorage for CRM-voice linkage
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem("user_lead_phone", phone);
          window.sessionStorage.setItem("user_lead_name", name);
        }

        setSuccess(true);
        setResponseMsg(data.message);
        setTimeout(() => {
          onSuccess(data.booking);
        }, 1500);
      } else {
        alert(data.error || "An error occurred during secure booking.");
      }
    } catch (err) {
      console.error(err);
      alert("Unable to connect to the pre-sales database server.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-6 bg-[#0a0a0c] border border-emerald-500/30 rounded flex flex-col items-center text-center space-y-4 animate-fade-in shadow-xl shadow-emerald-950/20">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
          <CheckCircle2 className="w-10 h-10 animate-bounce" />
        </div>
        <h3 className="text-xl font-bold font-mono tracking-tight text-emerald-400">BOOKING SUCCESS // CONFIRMED</h3>
        <p className="text-[#ccc] text-xs max-w-xs">{responseMsg}</p>
        <p className="text-[11px] text-[#666] font-mono">SECURE_DATA_SYNCED: pick-up specifications transmitted.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0c] border border-[#1f1f23] rounded-xl p-6 shadow-2xl w-full max-w-md mx-auto relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-transparent shadow-[0_1px_8px_#3b82f6]"></div>
      <div className="mb-4">
        <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest block font-bold">VIP_PRE_SALES_PORTAL // SECURE_CON</span>
        <h3 className="text-lg font-bold text-white mt-1">Schedule Hosted Site Visit</h3>
        <p className="text-xs text-[#888] mt-0.5">Explore {project.name} on a private guided tour with luxury hospitality.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name input */}
        <div className="space-y-1">
          <label className="text-[11px] font-mono font-bold text-[#888] block uppercase">Full Name *</label>
          <div className="relative">
            <User className="w-4 h-4 text-[#555] absolute left-3 top-3.5" />
            <input
              type="text"
              required
              placeholder="e.g. Anand Murthy"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#050506] border border-[#1f1f23] focus:border-blue-500/50 rounded py-2.5 pl-10 pr-4 text-sm text-[#e0e0e0] outline-none transition-colors"
            />
          </div>
        </div>

        {/* Contact numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-mono font-bold text-[#888] block uppercase">Mobile No. *</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#555] absolute left-3 top-3.5" />
              <input
                type="tel"
                required
                placeholder="e.g. 9845012345"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#050506] border border-[#1f1f23] focus:border-blue-500/50 rounded py-2.5 pl-10 pr-4 text-sm text-[#e0e0e0] outline-none transition-colors font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono font-bold text-[#888] block uppercase">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#555] absolute left-3 top-3.5" />
              <input
                type="email"
                placeholder="e.g. anand@outlook.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#050506] border border-[#1f1f23] focus:border-blue-500/50 rounded py-2.5 pl-10 pr-4 text-sm text-slate-100 outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Date and Time slots */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-mono font-bold text-[#888] block uppercase">Select Date *</label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-[#555] absolute left-3 top-3" />
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#050506] border border-[#1f1f23] focus:border-blue-500/50 rounded py-2 pl-10 pr-3 text-xs text-slate-100 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono font-bold text-[#888] block uppercase">Preferred Time *</label>
            <div className="relative">
              <Clock className="w-4 h-4 text-[#555] absolute left-3 top-3.5" />
              <select
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-[#050506] border border-[#1f1f23] focus:border-blue-500/50 rounded py-2.5 pl-10 pr-4 text-xs text-slate-100 outline-none transition-colors"
              >
                <option value="">Choose Slot</option>
                <option value="10:00 AM - 12:00 PM">Morning (10AM - 12PM)</option>
                <option value="12:00 PM - 02:00 PM">Noon (12PM - 2PM)</option>
                <option value="02:00 PM - 04:00 PM">Afternoon (2PM - 4PM)</option>
                <option value="04:00 PM - 06:00 PM">Evening (4PM - 6PM)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-3 text-sm">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-[#666] hover:text-[#aaa] font-mono text-xs cursor-pointer transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-mono font-semibold rounded text-xs transition-colors shadow-[0_0_15px_rgba(59,130,246,0.2)] cursor-pointer"
          >
            {loading ? "TRANSMITTING..." : "CONFIRM_VIP_TOUR"}
          </button>
        </div>
      </form>
    </div>
  );
}
