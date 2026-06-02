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
  budgetDetected?: string; // e.g. "Crore-Tier", "Lakh-Tier"
}

// Memory of dispatch to prevent firing multiple events per page session
let leadHotDispatched = false;

export function resetLeadScorerSession() {
  leadHotDispatched = false;
}

/**
 * High-performance client-side NLP intent scorer. Runs in micro-seconds.
 * Features highly granular, predictive compounding weights updated for Vastu & NRI RAG compliance.
 */
export function analyzeLeadIntent(text: string): LeadIntentReport {
  const norm = text.toLowerCase();
  let score = 0;
  const triggers: string[] = [];
  let budgetDetected: string | undefined = undefined;

  // 1. Transaction & Scheduling Intent (Up to 35 Points)
  const visitStems = ["visit", "tour", "callback", "call me back", "meet", "schedule", "appointment", "showing", "show flat", "office", "site visit", "book a vip", "drive-through", "chauffeur"];
  const bookingStems = ["book", "reserve", "token money", "down payment", "buying", "purchase", "interested to buy", "eoi", "sign agreement", "booking amount"];
  
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
  const financeKeywords = ["loan", "pre-approved", "approved", "sbi", "hdfc", "axis", "mortgage", "downpayment", "finance", "emi", "bank", "interest", "tenure"];
  const immediateBudget = ["crore", "crores", "cr", "lakhs", "lakh", "l", "budget", "pricing", "cost", "price"];

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
  const urgentTimelineKeywords = ["ready to move", "ready-to-move", "immediate possession", "soon", "next month", "moving", "oc received", "ready", "rtmi", "right away", "completed"];
  const gradualTimelineKeywords = ["possession", "timeline", "when", "construction stage", "delivery", "handover", "complet", "year"];

  const hasUrgentTimeline = urgentTimelineKeywords.some(s => norm.includes(s));
  const hasGradualTimeline = gradualTimelineKeywords.some(s => norm.includes(s));

  if (hasUrgentTimeline) {
    score += 20;
    triggers.push("IMMEDIATE_URGENCY");
  } else if (hasGradualTimeline) {
    score += 10;
    triggers.push("PLANNING_TIMELINE_INQUIRY");
  }

  // 4. Cultural & High-Value Segment Triggers with Compounding Advanced Phrase-Weighting
  // Implementing micro-targeted scoring multipliers based on linguistic specificity
  
  // A. VASTU HIERARCHICAL ANALYSIS
  const vastuGeneral = ["vastu", "shastra", "facing", "direction", " शास्त्र", "वास्तु", "दिशा"];
  const vastuCompass = ["east-facing", "east facing", "north facing", "north-facing", "north-east", "northeast", "e-facing", "ne-facing"];
  const vastuMicroLayout = ["pooja", "agni", "kitchen", "south-west", "southwest", "master bedroom", "entrance door", "quadrant", "agni corner", "brahmasthan", "placement", "entrance gating"];

  const matchesVastuGeneral = vastuGeneral.some(s => norm.includes(s));
  const matchesVastuCompass = vastuCompass.some(s => norm.includes(s));
  const matchesVastuMicroLayout = vastuMicroLayout.some(s => norm.includes(s));

  if (matchesVastuGeneral) {
    score += 10;
    triggers.push("VASTU_THEME_DETECTION");
  }
  if (matchesVastuCompass) {
    score += 15;
    triggers.push("VASTU_COMPASS_SPECIFIC");
  }
  if (matchesVastuMicroLayout) {
    score += 20;
    triggers.push("VASTU_ANCIENT_MICRO_LAYOUT");
  }

  // B. NRI HIERARCHICAL ANALYSIS
  const nriBasic = ["nri", "abroad", "foreign", "overseas", "non resident", "non-resident", "foreign citizen", "passport", "एनआरआई"];
  const nriRemittance = ["remit", "remittance", "nre", "nro", "wire transfer", "outward remittance", "repatriate", "repatriation", "repatriable"];
  const nriRegulatory = ["fema", "fema compliance", "double taxation", "dtaa", "tax exemption", "repatriation act", "rbi approval", "फेమా"];

  const matchesNriBasic = nriBasic.some(s => norm.includes(s));
  const matchesNriRemittance = nriRemittance.some(s => norm.includes(s));
  const matchesNriRegulatory = nriRegulatory.some(s => norm.includes(s));

  if (matchesNriBasic) {
    score += 15;
    triggers.push("NRI_BASIC_STATUS");
  }
  if (matchesNriRemittance) {
    score += 20;
    triggers.push("NRI_FINANCIAL_REMITTANCE");
  }
  if (matchesNriRegulatory) {
    score += 25;
    triggers.push("NRI_REGULATORY_COMPLIANCE");
  }

  // C. STANDARDS & TARGET OVERLAYS
  const reraKeywords = [
    "rera", "approved", "registration", "p02400007821", "p51700021432", "license", "legal",
    "clearance", "government approval", "prm/ka/rera", "harera"
  ];
  const projectKeywords = [
    "prestige", "solitaire", "dlf", "horizon", "lodha", "marina", "splendora", "myhome", "legend", "kokapet"
  ];

  const hasRera = reraKeywords.some(s => norm.includes(s));
  const hasProjectSpec = projectKeywords.some(s => norm.includes(s));

  if (hasRera) {
    score += 15;
    triggers.push("RERA_COMPLIANCE_INQUIRY");
  }

  if (hasProjectSpec) {
    score += 5;
    triggers.push("SPECIFIC_PROJECT_INQUIRY");
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
          budgetDetected: budgetDetected || "Not Specified"
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
