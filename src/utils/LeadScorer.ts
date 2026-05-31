/**
 * LeadScorer.ts
 * Real-time buyer intent scoring engine based on conversational linguistics.
 * Aligns with CXO priorities: prioritizing high-value NRI, Vastu-compliant,
 * pre-approved, and site-visit ready leads for maximum Lead-to-Site-Visit conversions.
 */

export interface LeadIntentReport {
  score: number;        // out of 100
  triggers: string[];   // matched intent descriptors
  isHot: boolean;       // whether score >= 90
  budgetDetected?: string; // e.g. "Crore", "Lakhs"
}

// Memory of dispatch to prevent firing multiple events per page session
let leadHotDispatched = false;

export function resetLeadScorerSession() {
  leadHotDispatched = false;
}

/**
 * High-performance client-side NLP intent scorer. Runs in micro-seconds alongside WebGPU.
 */
export function analyzeLeadIntent(text: string): LeadIntentReport {
  const norm = text.toLowerCase();
  let score = 0;
  const triggers: string[] = [];
  let budgetDetected: string | undefined = undefined;

  // 1. Transaction & Scheduling Intent (Up to 35 Points)
  const visitStems = ["visit", "tour", "callback", "call me back", "meet", "schedule", "appointment", "showing", "show flat", "office", "site visit", "book a vip"];
  const bookingStems = ["book", "reserve", "token money", "down payment", "buying", "purchase", "interested to buy", "eoi"];
  
  const hasVisit = visitStems.some(s => norm.includes(s));
  const hasBooking = bookingStems.some(s => norm.includes(s));
  
  if (hasBooking) {
    score += 35;
    triggers.push("DIRECT_TRANSACTION_INTENT");
  } else if (hasVisit) {
    score += 30;
    triggers.push("SITE_VISIT_INTENT");
  }

  // 2. Financial & Credit Approval Readiness (Up to 30 Points)
  const financeKeywords = ["loan", "pre-approved", "approved", "sbi", "hdfc", "axis", "mortgage", "downpayment", "finance", "emi", "bank"];
  const immediateBudget = ["crore", "crores", "cr", "lakhs", "lakh", "l", "budget"];

  const hasFinance = financeKeywords.some(s => norm.includes(s));
  const hasBudgetSpec = immediateBudget.some(s => norm.includes(s));

  if (hasFinance && hasBudgetSpec) {
    score += 30;
    triggers.push("CREDIT_READY_WITH_BUDGET");
  } else if (hasFinance) {
    score += 20;
    triggers.push("CREDIT_VERIFIED");
  } else if (hasBudgetSpec) {
    score += 15;
    triggers.push("ACTIVE_BUDGET_DELIBERATION");
  }

  // Detect explicit currency unit for analytics
  if (norm.includes("cr") || norm.includes("crore")) {
    budgetDetected = "Crore-Tier";
  } else if (norm.includes("lakh") || norm.includes("l")) {
    budgetDetected = "Lakh-Tier";
  }

  // 3. Readiness Timeline & Move-in Urgency (Up to 20 Points)
  const timingKeywords = ["ready to move", "ready-to-move", "immediate possession", "soon", "next month", "moving", "oc received", "ready", "rtmi"];
  const hasUrgentTimeline = timingKeywords.some(s => norm.includes(s)) || norm.includes("right away");

  if (hasUrgentTimeline) {
    score += 20;
    triggers.push("IMMEDIATE_URGENCY");
  }

  // 4. Cultural & High-Value Segment Triggers (Up to 15 Points)
  const culturalKeywords = ["vastu", "shastra", "east-facing", "east facing", "north facing", "pooja", "north-facing"];
  const nriKeywords = ["nri", "fema", "non resident", "overseas", "abroad", "foreign", "non-resident"];

  const hasCultural = culturalKeywords.some(s => norm.includes(s));
  const hasNri = nriKeywords.some(s => norm.includes(s));

  if (hasNri) {
    score += 15;
    triggers.push("NRI_PROSPECT (HIGH-TICKET)");
  } else if (hasCultural) {
    score += 10;
    triggers.push("VASTU_COMPLIANT_FIT");
  }

  // Cap score at 100
  score = Math.min(score, 100);
  const isHot = score >= 90;

  // Dispatch LeadHot custom event if threshold crossed and not triggered yet
  if (isHot && !leadHotDispatched) {
    leadHotDispatched = true;
    if (typeof window !== "undefined") {
      const gHotEvent = new CustomEvent("LeadHot", {
        detail: {
          score,
          triggers,
          transcript: text,
          timestamp: new Date().toLocaleTimeString("en-IN"),
          budgetDetected: budgetDetected || "Not Specify"
        }
      });
      window.dispatchEvent(gHotEvent);
      console.log("🔥 [LeadScorer] METRIC CROSSINGS EXCEEDED: LeadHot Event Dispatched!", gHotEvent.detail);
    }
  }

  return {
    score,
    triggers,
    isHot,
    budgetDetected
  };
}
