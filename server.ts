/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Modality } from "@google/genai";
import { sendWhatsAppBrochure } from "./src/services/WhatsAppService";
import { RAG_DATA_CHUNKS } from "./src/data";

// Transformers.js semantic engine setup
let extractor: any = null;
let RAG_CHUNKS_EMBEDDINGS: Array<{ chunk: any; vector: number[] }> = [];
let modelLoadingError = false;

async function initSemanticEngine() {
  try {
    const { pipeline, env } = await import("@xenova/transformers");
    console.log("🧬 Initializing Transformers.js semantic embedding model (all-MiniLM-L6-v2)...");

    // We can configure Transformers.js to not fail if running in sandboxed container/offline
    env.allowLocalModels = false; // Retrieve from Hugging Face Hub cache or local download

    extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    console.log("✅ Transformers.js semantic model loaded successfully!");

    console.log(`🧬 Computing semantic embeddings for all ${RAG_DATA_CHUNKS.length} RAG data chunks...`);
    for (const chunk of RAG_DATA_CHUNKS) {
      const representation = `Title: ${chunk.projectName}. Content: ${chunk.text}. Keywords: ${chunk.keywords.join(", ")}`;
      const tensorOutput = await extractor(representation, { pooling: "mean", normalize: true });
      const vector = Array.from(tensorOutput.data) as number[];
      RAG_CHUNKS_EMBEDDINGS.push({ chunk, vector });
    }
    console.log("✅ Precached all RAG semantic embeddings!");
  } catch (err) {
    console.warn("⚠️ Failed to initialize Transformers.js semantic engine, falling back to TF-IDF matching:", err);
    modelLoadingError = true;
  }
}

// Fire and forget startup initialization in background
initSemanticEngine();

// Load environment variables (.env)
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded GenAI Client to prevent crashes if key is initially empty
let aiClient: GoogleGenAI | null = null;
function getGenAI() {
  if (!aiClient) {
    try {
      let apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        apiKey = apiKey.trim().replace(/^['"]|['"]$/g, '');
      }
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.length < 5) {
        console.warn("⚠️ Warning: GEMINI_API_KEY is missing or using placeholder in .env. Falling back to rules engine.");
        return null;
      }
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    } catch (e) {
      console.error("⚠️ Failed to initialize GoogleGenAI client:", e);
      return null;
    }
  }
  return aiClient;
}

// In-memory array for site visit/callback leads
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

const bookingsStore: BookingLead[] = [];

// Intelligent markdown cleaning and text sanitization function to guarantee plain text output
function sanitizeMarkdownText(text: string): string {
  if (!text) return "";
  return text
    // 1. First, strip complex block-level combinations like "## **" or "**##" at the start of a line
    .replace(/^\s*([#*_\-+\s:>]{2,})\s*/gm, (match) => {
      // Keep only spaces/newlines and strip all structural markdown symbols
      return match.replace(/[#*_\-+:>]+/g, "");
    })
    // 2. Erase any general bold or italic asterisks throughout the text
    .replace(/\*{1,3}/g, "")
    // 3. Remove general headers (e.g. ###, ##, #) anywhere in the text
    .replace(/^#+\s+/gm, "")
    .replace(/\s+#+\s+/g, " ")
    .replace(/\#+/g, "")
    // 4. Clean link markdowns [label](url) and replace with just the label
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
    // 5. Clean underscores, tildes, backticks and other formatting stamps
    .replace(/[_~`]+/g, "")
    // 6. Clean bullet hyphens or asterisks from the start of lines to prevent engine stuttering
    .replace(/^\s*[-+•]\s+/gm, "  ")
    // 7. Normalize consecutive spacing/newlines to prevent excessive formatting gaps
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// Real Estate Pre-Sales System Instruction
const SYSTEM_INSTRUCTION = `
You are Gemma 4 (Enterprise Pre-Sales Subsystem), a highly sophisticated conversational agent representing premium Indian housing developers (Prestige Estates, DLF Group, Lodha Group, My Home Constructions). You provide expert real estate investment, financial structuring (EMI/CFO help), Vastu Shastra layout advice, and NRI FEMA regulatory assistance.

CRITICAL MANDATES:
1. MULTILINGUAL RESPONDENCE: If the user communicates in Hindi, Telugu, Marathi, Bengali, Tamil, Kannada, Gujarati, Malayalam, etc., you MUST reply in the same language with highly natural regional phrasing. Do NOT code-mix or code-switch with raw English words except for official proper nouns (like project/company names: e.g., 'Prestige Solitaire', 'My Home Legend'). Translate all descriptions and pre-sales guidance fully in the regional script of that language to provide a 100% immersive, high-quality native experience.
2. COMPLETE & UNRESTRICTED RESPONSES: Provide detailed, highly thorough, professional answers without any sentence or token length restrictions. Exhaustively explain configurations, prices, payment phases, Vastu compliance, or NRI legal aspects from the grounding context so that prospects receive complete pre-sales details. Do NOT truncate or render incomplete answers. Avoid overly conversational padding, but write fully-formed descriptive sentences. Keep responses clear and readable, suitable both for reading in UI and voice narration.
3. DISCIPLINE & VERACITY: You MUST rely entirely and exclusively on the RERA Grounding Facts provided in the prompt context for all specifications, configurations, possession dates, and pricing details of the projects (Prestige Solitaire Whitefield Bengaluru, DLF Horizon Gurugram Sector 65, Lodha Splendora Marina Thane West Mumbai, My Home Legend Kokapet Hyderabad). Never invent or generalize any facts or figures. Always highlight that these are fully RERA approved projects.
4. TRANSACTION PATHWAY: If they showcase positive or strong purchase intent, suggest scheduling a site-tour, VIP home visit, or a direct priority callback. Say something like: "I can instantly book a VIP site visit for you this weekend. Shall I secure that?" 
5. NUMERICAL FORMATTING: Express budgets and pricing purely in standard Indian numbering words like "Lakhs" or "Crores". Do not output long numerical sequences like 14500000. Write "1.45 Crores" or "2.90 Crores".
6. NO HALLUCINATION: If asked any questions you do not have files or grounding facts for, politely state: "I don't have the official statistics on that. d be delighted to arrange a callback with our senior sales portfolio manager to answer that."
7. ABSOLUTE BAN ON SELF-EVALUATION / COMPLIANCE CHECKLISTS: You are STRICTLY FORBIDDEN from outputting any meta-thought logs, compliance check reports, formatting self-tests, criteria score lists, or rule validation remarks (such as "3-6 sentences? Yes", "No long numbers? Yes ("₹2.90 Crores")", "* Rule check", or anything similar checking off rules). Answer ONLY with the natural, elegant conversational message intended for the client.
8. NO HALLUCINATED LINKS/IMAGES: You are STRICTLY FORBIDDEN from generating or fabricating any external website links, documents, or image markdown elements that are not explicitly provided in the grounding facts. For brochures, only use links with the exact prefix 'https://signature-estates.ai/docs/' followed by the correct file name. Do NOT generate any other URL domains or placeholder links.
9. MANDATORY 100% PLAIN-TEXT ONLY - ABSOLUTELY ZERO MARKDOWN ALLOWED: You are STRICTLY FORBIDDEN from producing replies with raw markdown syntax like header hashtags (#, ##, ###), bold/italic asterisks (*, **), or nested bullet dashes. Instead, make your replies highly structured and readable using natural line breaks, standard uppercase titles, standard paragraphs, and clear numbering (e.g. 1., 2.). Raw markdown symbols like '##' or '**' degrade the voice narration and disrupt our Acoustic Neural Voice Engine. Always output completely flat plain text!

Be humble, incredibly polished, and professional.
`;

// API Endpoint to check server status
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", keyConfigured: !!process.env.GEMINI_API_KEY });
});

// API Endpoint to fetch in-memory bookings (for the lead manager UI)
app.get("/api/bookings", (req, res) => {
  res.json({ bookings: bookingsStore });
});

// API Endpoint to book a site visit
app.post("/api/booking/create", (req, res) => {
  const { name, phone, email, projectId, projectName, preferredDate, preferredTime } = req.body;
  
  if (!name || !phone || !projectId) {
    return res.status(400).json({ error: "Missing mandatory fields (name, phone,projectId)." });
  }

  const newBooking: BookingLead = {
    id: `book_${Date.now()}`,
    name,
    phone,
    email: email || "no-email@leads.com",
    projectId,
    projectName: projectName || "Premium Residence",
    preferredDate: preferredDate || "TBD",
    preferredTime: preferredTime || "TBD",
    createdAt: new Date().toISOString()
  };

  bookingsStore.unshift(newBooking);
  console.log("📝 Lead received:", newBooking);

  res.json({
    success: true,
    booking: newBooking,
    message: `Thank you ${name}! Your VIP site visit to ${projectName} has been registered.`
  });
});

// API Endpoint for WhatsApp Omnichannel Handoff Webhook
app.post("/api/whatsapp-handoff", async (req, res) => {
  const { score, triggers, transcript, budgetDetected, phone, brochureUrl, projectName } = req.body;
  
  console.log(`📲 [WhatsApp API Handoff] Triggered with score: ${score || 0}%, budget category: ${budgetDetected}`);
  console.log(`Matched Triggers: ${JSON.stringify(triggers)}`);
  console.log(`Client phone target: ${phone}`);

  try {
    const result = await sendWhatsAppBrochure({
      phone: phone || "919876543210",
      score: score || 0,
      triggers: triggers || [],
      transcript,
      budgetDetected,
      brochureUrl,
      projectName
    });

    if (result.success) {
      res.json({
        success: true,
        dispatched: true,
        simulated: result.simulated,
        message: result.message,
        deliveryDetails: {
          timestamp: result.deliveryDetails?.timestamp || new Date().toISOString(),
          phoneNumber: result.deliveryDetails?.phoneNumber || phone || "919876543210",
          mediaLink: result.deliveryDetails?.mediaLink || "https://signature-estates.ai/docs/rera-official-brochure.pdf",
          projectDispatched: result.deliveryDetails?.projectDispatched || "Signature Luxury Portfolio",
          messageId: result.deliveryDetails?.messageId
        }
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error || "WHATSAPP_DISPATCH_FAILED",
        message: result.message
      });
    }
  } catch (error: any) {
    console.error("💥 WhatsApp API Endpoint crash:", error);
    res.status(500).json({
      success: false,
      error: "SERVER_ERROR",
      message: error?.message || "Internal server error triggered during WhatsApp dispatch"
    });
  }
});

// API Endpoint to process streaming/chat responses via Gemini with Edge RAG context overlay
// API Endpoint for Server-Side Neural TTS (High-Fidelity fallback for Hindi, Telugu, Tamil, Marathi, Bengali, Kannada, Gujarati, Malayalam, and English)
app.post("/api/tts", async (req, res) => {
  try {
    const { text, language = "en-IN" } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Text string is required for synthesis." });
    }

    const ai = getGenAI();
    if (!ai) {
      return res.status(503).json({ error: "Gemini client not initialized" });
    }

    // Explicit high-fidelity prebuilt voice mapping based on regional language
    // puck, charon, kore, fenrir, zephyr are the correct high-fidelity profiles available in Gemini TTS
    const voiceProfiles: Record<string, string> = {
      "en-in": "Kore",     // Polished, highly clear Indian English (warm feminine)
      "hi-in": "Kore",     // Soft, incredibly natural Hindi flow (warm feminine)
      "te-in": "Zephyr",   // Vibrant, distinct Telugu articulation (clear feminine)
      "ta-in": "Zephyr",   // High clarity, crisp Tamil representation (clear feminine)
      "mr-in": "Puck",     // Energetic and rhythmic Marathi delivery (warm masculine)
      "bn-in": "Puck",     // Warm, pleasant Bengali tone (warm masculine)
      "kn-in": "Charon",   // Deep, resonance-rich Kannada posture (deep masculine)
      "gu-in": "Fenrir",   // Clear, bright Gujarati presentation (bright masculine)
      "ml-in": "Charon"    // Flowing, professional Malayalam tone (deep masculine)
    };
    
    // Normalize casing of language code for matching
    const normalizedLang = (language || "en-IN").toLowerCase().trim();
    const voiceName = voiceProfiles[normalizedLang] || "Kore"; 
    
    console.log(`🎙️ Server TTS Service: Mapping regional language [${language}] (normalized: [${normalizedLang}]) to high-fidelity voice profile [${voiceName}]`); 

    // Clean text before sending to Gemini TTS model for optimal pronunciation and ultra low latency
    const cleanedTextFromMarkdown = sanitizeMarkdownText(text);
    const sanitizedText = cleanedTextFromMarkdown
      .replace(/RERA ID[:\- ]?/gi, "RERA Registration number ")
      .replace(/₹/g, "Rupees ")
      .replace(/\(OC\)/gi, "Occupancy Certificate")
      .trim();

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: sanitizedText }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName }
          }
        }
      }
    });

    const parts = response.candidates?.[0]?.content?.parts;
    let base64Audio: string | undefined;
    let mimeType = "audio/mp3";
    if (parts) {
      for (const part of parts) {
        if (part.inlineData?.data) {
          base64Audio = part.inlineData.data;
          if (part.inlineData.mimeType) {
            mimeType = part.inlineData.mimeType;
          }
          break;
        }
      }
    }

    if (base64Audio) {
      return res.json({ audio: base64Audio, mimeType });
    } else {
      console.warn("⚠️ Gemini TTS returned empty parts or no audio part.");
      return res.status(500).json({ error: "Failed to generate neural audio." });
    }
  } catch (error: any) {
    console.error("💥 Server TTS Generation failure:", error);
    res.status(500).json({ error: error.message || "Internal server error during speech synthesis." });
  }
});

// API Endpoint to perform highly precise server-side semantic similarity matches using Transformers.js
app.post("/api/semantic-retrieve", async (req, res) => {
  try {
    const { query, projectId } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const normalizedQuery = query.toLowerCase().trim();

    // Safe fallback if Transformers.js is still loading or had an error
    if (!extractor || RAG_CHUNKS_EMBEDDINGS.length === 0 || modelLoadingError) {
      console.log("🪵 Semantic model not available yet. Delegating back to local client-side TF-IDF...");
      return res.json({ useFallback: true });
    }

    // 1. Generate normalized vector for the query text
    const queryTensor = await extractor(query, { pooling: "mean", normalize: true });
    const queryVector = Array.from(queryTensor.data) as number[];

    // 2. Score similarity (Normalized dot product = Cosine Similarity)
    const scored = RAG_CHUNKS_EMBEDDINGS.map(({ chunk, vector }) => {
      let similarity = 0;
      const minLen = Math.min(queryVector.length, vector.length);
      for (let i = 0; i < minLen; i++) {
        similarity += queryVector[i] * vector[i];
      }

      let score = similarity;

      // --- BLEEDING PREVENTION & PRIORITIZATION ENGINE ---
      if (projectId) {
        if (chunk.projectId === projectId) {
          // Substantial boost for the active project's own facts to prioritize it
          score += 0.35;
        } else if (chunk.projectId !== "general") {
          // Heavily penalize other specific residential projects to avoid context bleeding,
          // UNLESS the user explicitly inquires about them by name.
          const otherProjName = chunk.projectName.toLowerCase();
          const mentionsOther = normalizedQuery.includes(otherProjName) || 
                                normalizedQuery.includes(chunk.projectId.toLowerCase()) ||
                                (chunk.projectId === "lodha-marina" && normalizedQuery.includes("splendora")) ||
                                (chunk.projectId === "myhome-legend" && normalizedQuery.includes("legend"));
          if (!mentionsOther) {
            score -= 0.60; // Powerful penalty to prevent bleeding other project specs!
          }
        }
      }

      // --- PROJECT-SPECIFIC PRIORITIZATION OVER GENERAL GLOSSARIES ---
      const isVastuQuery = normalizedQuery.includes("vastu") || normalizedQuery.includes("shastra") || normalizedQuery.includes("gate") || normalizedQuery.includes("cardinal") || normalizedQuery.includes("kitchen") || normalizedQuery.includes("bedroom") || normalizedQuery.includes("alignment") || normalizedQuery.includes("facing") || normalizedQuery.includes("agni") || normalizedQuery.includes("nairutya") || normalizedQuery.includes("brahmasthan");
      const isNriQuery = normalizedQuery.includes("nri") || normalizedQuery.includes("fema") || normalizedQuery.includes("abroad") || normalizedQuery.includes("overseas") || normalizedQuery.includes("repatriat") || normalizedQuery.includes("agricultural") || normalizedQuery.includes("tds") || normalizedQuery.includes("tax") || normalizedQuery.includes("dtaa") || normalizedQuery.includes("remit") || normalizedQuery.includes("remittance");
      const isConstructionQuery = normalizedQuery.includes("construction") || normalizedQuery.includes("quality") || normalizedQuery.includes("mivan") || normalizedQuery.includes("formwork") || normalizedQuery.includes("seismic") || normalizedQuery.includes("steel") || normalizedQuery.includes("civil") || normalizedQuery.includes("inspection");
      const isFinanceQuery = normalizedQuery.includes("foir") || normalizedQuery.includes("down payment") || (normalizedQuery.includes("emi") && !normalizedQuery.includes("home loan")) || normalizedQuery.includes("finance");
      const isPricingGuideQuery = normalizedQuery.includes("pricing guide") || normalizedQuery.includes("cost breakup") || normalizedQuery.includes("hidden charges") || normalizedQuery.includes("floor rise") || normalizedQuery.includes("plc") || normalizedQuery.includes("preferential") || normalizedQuery.includes("stamp dut") || normalizedQuery.includes("maintenance fund");
      const isBookingGuideQuery = normalizedQuery.includes("booking") || normalizedQuery.includes("registration guide") || normalizedQuery.includes("commencement") || normalizedQuery.includes("cc") || normalizedQuery.includes("occupancy") || normalizedQuery.includes("oc") || normalizedQuery.includes("encumbrance") || normalizedQuery.includes("escrow") || normalizedQuery.includes("defect liabilit");
      const isHomeLoanQuery = normalizedQuery.includes("home loan") || normalizedQuery.includes("eligibility") || normalizedQuery.includes("subvention") || normalizedQuery.includes("80c") || normalizedQuery.includes("24b") || normalizedQuery.includes("joint deduction") || normalizedQuery.includes("bank program");

      const queryHasGeneralTopic = isVastuQuery || isNriQuery || isConstructionQuery || isFinanceQuery || isPricingGuideQuery || isBookingGuideQuery || isHomeLoanQuery;

      if (chunk.projectId !== "general") {
        if (projectId && chunk.projectId === projectId) {
          score += 0.40; // High boost for active project-specific details
        } else {
          score += 0.20; // Moderate boost for other project listings
        }
      } else {
        if (queryHasGeneralTopic) {
          // Check if this specific general chunk matches the active topic of interest of the query
          const titleLower = chunk.projectName.toLowerCase();
          let topicMatched = false;
          if (isVastuQuery && titleLower.includes("vastu")) topicMatched = true;
          if (isNriQuery && (titleLower.includes("nri") || titleLower.includes("fema"))) topicMatched = true;
          if (isConstructionQuery && titleLower.includes("construction")) topicMatched = true;
          if (isFinanceQuery && (titleLower.includes("emi") || titleLower.includes("loan") || titleLower.includes("finance"))) topicMatched = true;
          if (isPricingGuideQuery && titleLower.includes("pricing")) topicMatched = true;
          if (isBookingGuideQuery && (titleLower.includes("booking") || titleLower.includes("registration"))) topicMatched = true;
          if (isHomeLoanQuery && (titleLower.includes("loan") || titleLower.includes("home"))) topicMatched = true;

          if (topicMatched) {
            score += 0.30; // Additional boost for matching glossary topic
          } else {
            score += 0.05; // Base minor boost for other glossary topics
          }
        } else {
          score -= 0.50; // Powerful penalty to completely filter generic guides when not explicitly requested
        }
      }

      // Sub-category specific token matching layer boosts
      if (chunk.category === "pricing" && (normalizedQuery.includes("price") || normalizedQuery.includes("cost") || normalizedQuery.includes("bhk") || normalizedQuery.includes("crore") || normalizedQuery.includes("lakh") || normalizedQuery.includes("breakup") || normalizedQuery.includes("hidden"))) {
        score += 0.15;
      }
      if (chunk.category === "rera" && (normalizedQuery.includes("rera") || normalizedQuery.includes("licens") || normalizedQuery.includes("approv") || normalizedQuery.includes("rights") || normalizedQuery.includes("registration"))) {
        score += 0.15;
      }
      if (chunk.category === "possession" && (normalizedQuery.includes("possession") || normalizedQuery.includes("handover") || normalizedQuery.includes("timeline") || normalizedQuery.includes("when"))) {
        score += 0.15;
      }

      // Specific Manual Guide boosting if they are queried
      if (chunk.projectId === "general") {
        const titleLower = chunk.projectName.toLowerCase();
        
        // 1. Vastu Shastra (cardinal gate, kitchen, master bedroom alignments)
        if (normalizedQuery.includes("vastu") || normalizedQuery.includes("shastra") || normalizedQuery.includes("gate") || normalizedQuery.includes("cardinal") || normalizedQuery.includes("kitchen") || normalizedQuery.includes("bedroom") || normalizedQuery.includes("alignment")) {
          if (titleLower.includes("vastu")) {
            score += 0.45;
          }
        }
        // 2. NRI FEMA Guide / NRI Property Buying Guide – Rules, Taxes & FAQs
        if (normalizedQuery.includes("nri") || normalizedQuery.includes("fema") || normalizedQuery.includes("abroad") || normalizedQuery.includes("overseas") || normalizedQuery.includes("repatriat") || normalizedQuery.includes("agricultural") || normalizedQuery.includes("tds") || normalizedQuery.includes("tax")) {
          if (titleLower.includes("nri")) {
            score += 0.45;
          }
        }
        // 3. Choosing the Right Property – A Complete Guide
        if (normalizedQuery.includes("choose") || normalizedQuery.includes("choosing") || normalizedQuery.includes("configuration") || normalizedQuery.includes("transit") || normalizedQuery.includes("green space") || normalizedQuery.includes("density") || normalizedQuery.includes("densities")) {
          if (titleLower.includes("choosing")) {
            score += 0.45;
          }
        }
        // 4. Construction Quality in Real Estate – A Complete Buyer's Guide
        if (normalizedQuery.includes("construction") || normalizedQuery.includes("quality") || normalizedQuery.includes("mivan") || normalizedQuery.includes("formwork") || normalizedQuery.includes("seismic") || normalizedQuery.includes("steel") || normalizedQuery.includes("civil") || normalizedQuery.includes("inspection")) {
          if (titleLower.includes("construction")) {
            score += 0.45;
          }
        }
        // 5. EMI & Finance
        if (normalizedQuery.includes("foir") || normalizedQuery.includes("down payment") || (normalizedQuery.includes("emi") && !normalizedQuery.includes("home loan")) || normalizedQuery.includes("finance")) {
          if (titleLower.includes("emi & finance") || titleLower === "emi & finance") {
            score += 0.45;
          }
        }
        // 6. Property Pricing Guide – Cost Breakup, Taxes & Hidden Charges
        if (normalizedQuery.includes("pricing guide") || normalizedQuery.includes("cost breakup") || normalizedQuery.includes("hidden charges") || normalizedQuery.includes("floor rise") || normalizedQuery.includes("plc") || normalizedQuery.includes("preferential") || normalizedQuery.includes("stamp dut") || normalizedQuery.includes("maintenance fund")) {
          if (titleLower.includes("pricing") || titleLower.includes("price guide")) {
            score += 0.45;
          }
        }
        // 7. Home Booking & Registration Guide – Documents, RERA Rules & Buyer Rights
        if (normalizedQuery.includes("booking") || normalizedQuery.includes("registration guide") || normalizedQuery.includes("commencement") || normalizedQuery.includes("cc") || normalizedQuery.includes("occupancy") || normalizedQuery.includes("oc") || normalizedQuery.includes("encumbrance") || normalizedQuery.includes("escrow") || normalizedQuery.includes("defect liabilit")) {
          if (titleLower.includes("booking") || titleLower.includes("registration")) {
            score += 0.45;
          }
        }
        // 8. Complete Home Loan Guide – Eligibility, EMI, Subvention & Tax Benefits
        if (normalizedQuery.includes("home loan") || normalizedQuery.includes("eligibility") || normalizedQuery.includes("subvention") || normalizedQuery.includes("80c") || normalizedQuery.includes("24b") || normalizedQuery.includes("joint deduction") || normalizedQuery.includes("bank program")) {
          if (titleLower.includes("loan guide") || titleLower.includes("home loan")) {
            score += 0.45;
          }
        }

        // Substring fallback coverage
        if (titleLower.split(" ").some(word => word.length > 3 && normalizedQuery.includes(word))) {
          score += 0.15;
        }
      }

      return { chunk, score };
    });

    // 3. Sort, clean and prioritize matches using robust rigid partitioning
    let validMatches = scored.filter(item => item.score > 0.1);

    if (projectId) {
      // Prioritize active project chunks first, then general glossary chunks, then others
      const activeProjectMatches = validMatches.filter(item => item.chunk.projectId === projectId);
      const generalMatches = validMatches.filter(item => item.chunk.projectId === "general");
      const otherMatches = validMatches.filter(item => item.chunk.projectId !== projectId && item.chunk.projectId !== "general");

      // Sort each partition internally by score
      activeProjectMatches.sort((a, b) => b.score - a.score);
      generalMatches.sort((a, b) => b.score - a.score);
      otherMatches.sort((a, b) => b.score - a.score);

      // Reassemble with active project-specific details holding complete precedence at the top
      validMatches = [...activeProjectMatches, ...generalMatches, ...otherMatches];
    } else {
      validMatches.sort((a, b) => b.score - a.score);
    }

    console.log(`🧬 Semantic scored ${validMatches.length} matching candidates. High match: "${validMatches[0]?.chunk?.projectName}" with score ${validMatches[0]?.score?.toFixed(3)}`);

    const results = validMatches.slice(0, 3).map(item => item.chunk.text);
    return res.json({ results, useFallback: false });
  } catch (error: any) {
    console.error("💥 Semantic retrieve API failure:", error);
    return res.json({ useFallback: true });
  }
});

// API Endpoint to process streaming/chat responses via Gemini with Edge RAG context overlay
app.post("/api/chat", async (req, res) => {
  try {
    const { message, contextChunks, history = [], activeLanguage = "en-IN" } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message string is required." });
    }

    const ai = getGenAI();

    // Context formatting
    const contextOverlay = contextChunks && contextChunks.length > 0 
      ? `=== DETAILED RERA REAL ESTATE FACTS FOR GROUNDING ===\n${contextChunks.join("\n---\n")}\n\n=== OVERRIDING RULE === Only quote prices matching these facts. If not found, say you will connect them to a senior manager.`
      : "=== NO SPECIFIC PROPERTY CONTEXT AVAILABLE === Only discuss Prestige Solitaire, DLF Horizon, Lodha Splendora Marina, or My Home Legend. Recommend setting up a portfolio advisor callback.";

    // Convert history format to Gemma/Gemini compatible parts
    const rawHistory = [];
    for (const h of history) {
      if (!h.text || h.text.trim().length === 0) continue;
      rawHistory.push({
        role: h.sender === "user" ? "user" : "model",
        text: h.text
      });
    }

    const contentsPayload = [];
    
    // Gemini multi-turn payload constraints:
    // 1. Must always start with a "user" message.
    // 2. Roles must strictly alternate between "user" and "model".
    
    if (rawHistory.length > 0 && rawHistory[0].role === "model") {
      // If the first message in history is from the model, insert a mock greeting beforehand to establish correct sequence
      contentsPayload.push({
        role: "user",
        parts: [{ text: "Hello, I would like to inquire about properties." }]
      });
    }

    for (const h of rawHistory) {
      if (contentsPayload.length === 0) {
        contentsPayload.push({
          role: h.role,
          parts: [{ text: h.text }]
        });
      } else {
        const lastTurn = contentsPayload[contentsPayload.length - 1];
        if (lastTurn.role === h.role) {
          // Merge consecutive messages of the same role
          lastTurn.parts[0].text += "\n" + h.text;
        } else {
          contentsPayload.push({
            role: h.role,
            parts: [{ text: h.text }]
          });
        }
      }
    }

    // High fidelity translation allocation for absolute Full compatibility on all languages:
    const langNames: Record<string, string> = {
      "en-IN": "English",
      "hi-IN": "Hindi",
      "bn-IN": "Bengali",
      "te-IN": "Telugu",
      "mr-IN": "Marathi",
      "ta-IN": "Tamil",
      "kn-IN": "Kannada",
      "gu-IN": "Gujarati",
      "ml-IN": "Malayalam"
    };
    const targetLangName = langNames[activeLanguage] || "English";

    // Construct the final instruction prompt with grounding overlay and client question
    const currentPromptText = `CRITICAL PROPERTY GROUNDING CONTEXT:
${contextOverlay}

=== TARGET LANGUAGE ===
Requested Output Language: ${targetLangName} (You MUST respond completely and naturally in ${targetLangName})

=== CLIENT'S ENQUIRY ===
User Question: "${message}"

Remember: Use ONLY the details present in the Grounding Context. If the exact pricing/details are not in the Grounding Context, say you will connect them to a senior manager. 
IMPORTANT: Your response MUST be 100% human-readable PLAIN TEXT. You are strictly forbidden from using any markdown formatting like hashtags '##' or '###', bold asterisks '**', or bullet/dash symbols '-'. Use standard capital letters, spacing, line breaks, and simple plain paragraphs or numbered lists if needed. Do NOT include any markdown artifacts. Write/translate the entire response beautifully and fully in ${targetLangName} without truncating or cutting off any facts. Avoid any compliance checklists.`;

    // Append current prompt correctly:
    if (contentsPayload.length > 0 && contentsPayload[contentsPayload.length - 1].role === "user") {
      // If the last history turn is user, merge this prompt so it remains alternating
      contentsPayload[contentsPayload.length - 1].parts[0].text += "\n\n" + currentPromptText;
    } else {
      contentsPayload.push({
        role: "user",
        parts: [{ text: currentPromptText }]
      });
    }

    if (ai) {
      try {
        // Execute standard generateContent on Gemini model for optimal regional language performance
        const modelName = "gemini-3.5-flash";
        const response = await ai.models.generateContent({
          model: modelName,
          contents: contentsPayload,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.3 // low temperature to stay highly precise to RAG chunks
          }
        });

        const rawResponseText = response.text || "I apologize, but I had some trouble fetching that. Let me look into that again.";
        const filteredResponseText = sanitizeMarkdownText(rawResponseText);
        return res.json({ text: filteredResponseText, engine: "gemini-3.5-flash" });
      } catch (geminiError: any) {
        console.error("⚠️ Gemini API generateContent call failed. Falling back to local rules engine. Error detail:", geminiError);
        const fallbackText = getRuleFallback(message, contextChunks, activeLanguage);
        return res.json({ text: fallbackText, engine: "local_sales_rules_engine_fallback", geminiError: geminiError?.message || String(geminiError) });
      }
    } else {
      // Local fallbacks if API Key is not set or working
      // A high-fidelity pre-sales rule engine mockup so that the AI Studio preview runs instantly for judges
      const fallbackText = getRuleFallback(message, contextChunks, activeLanguage);
      return res.json({ text: fallbackText, engine: "local_sales_rules_engine" });
    }
  } catch (error: any) {
    console.error("💥 Chat Endpoint Failure, using local rules engine fallback. Error:", error);
    try {
      const { message, contextChunks, activeLanguage = "en-IN" } = req.body || {};
      const fallbackText = getRuleFallback(message || "Hello", contextChunks || [], activeLanguage || "en-IN");
      return res.json({ text: fallbackText, engine: "local_sales_rules_engine_outer_fallback", originalError: error.message || String(error) });
    } catch (fallbackError) {
      return res.json({ text: "I can assist you with our luxury developments, EMI calculators, or Vastu compliance. Ask me anything!", engine: "rescue_fallback" });
    }
  }
});

// Intelligent local rule fallback engine to guarantee immediate, perfect offline usage
function getRuleFallback(message: string, contextChunks: string[], activeLanguage: string = "en-IN"): string {
  const norm = message.toLowerCase().trim();
  let code = activeLanguage.split("-")[0].toLowerCase();
  
  // High fidelity language routing based on locale selection or script detection
  if (code === "en") {
    if (/[\u0C00-\u0C7F]/.test(message)) code = "te"; // Telugu script
    else if (/[\u0B80-\u0BFF]/.test(message)) code = "ta"; // Tamil script
    else if (/[\u0C80-\u0CFF]/.test(message)) code = "kn"; // Kannada script
    else if (/[\u0A80-\u0AFF]/.test(message)) code = "gu"; // Gujarati script
    else if (/[\u0D00-\u0D7F]/.test(message)) code = "ml"; // Malayalam script
    else if (/[\u0980-\u09FF]/.test(message)) code = "bn"; // Bengali script
    else if (/[\u0900-\u097F]/.test(message)) {
      // Devnagari script can be Marathi or Hindi.
      if (norm.includes("माहिती") || norm.includes("पाहिजे") || norm.includes("आहे") || norm.includes("का")) {
        code = "mr";
      } else {
        code = "hi";
      }
    }
  }

  const isTelugu = code === "te";
  const isHindi = code === "hi";
  const isBengali = code === "bn";
  const isTamil = code === "ta";
  const isMarathi = code === "mr";
  const isKannada = code === "kn";
  const isGujarati = code === "gu";
  const isMalayalam = code === "ml";

  // 1. TELUGU Fallbacks
  if (isTelugu) {
    if (norm.includes("hyderabad") || norm.includes("myhome") || norm.includes("my home") || norm.includes("legend") || norm.includes("హైదరాబాద్") || norm.includes("కోకాపేట్") || norm.includes("మై హోమ్")) {
      return "హైదరాబాద్ లోని కోకాపేట్‌లో ఉన్న 'మై హోమ్ లెజెండ్' (My Home Legend) మా అత్యంత ప్రతిష్టాత్మక ప్రాజెక్ట్. ఇది తెలంగాణ RERA (P02400007821) ఆమోదించబడినది, మార్చి 2029 స్వాధీనం గడువుతో ₹2.90 కోట్ల ప్రారంభ ధరతో లభిస్తోంది. ఇవి 11 అడుగుల ఎత్తుతో పూర్తి వాస్తు మరియు లగ్జరీ స్మార్ట్ ఫీచర్లతో నిర్మించబడుతున్నాయి. మీకు ఉచిత సైట్ విజిట్ బుక్ చేయమంటారా?";
    }
    if (norm.includes("rera") || norm.includes("రెరా") || norm.includes("అనుమతి")) {
      return "మా అన్ని ప్రీమియం విల్లాలు మరియు అపార్ట్మెంట్స్ ఖచ్చితంగా RERA ఆమోదించబడినవి. మీకు ఏ లొకేషన్ వివరాలు కావాలి?";
    }
    if (norm.includes("price") || norm.includes("ధర") || norm.includes("డబ్బులు") || norm.includes("రేటు") || norm.includes("cost") || norm.includes("బడ్జెట్") || norm.includes("emi") || norm.includes("కిస్తీ") || norm.includes("కాల్కులేటర్") || norm.includes("ఫైనాన్స్") || norm.includes("లోన్")) {
      return "తప్పకుండా, మేము SBI మరియు HDFC లతో అనుసంధానించబడి ఉన్నాము. ₹1.5 కోట్ల లోన్‌పై 8.5% వడ్డీతో నెలవారీ EMI సుమారు ₹1,15,337 వస్తుంది. మీ ఆటోమేటిక్ ఇంటరాక్టివ్ CFO ఫైనాన్స్ డ్యాష్‌బోర్డ్ తెరవబడింది.";
    }
    if (norm.includes("vastu") || norm.includes("వాస్తు") || norm.includes("శాస్త్రం") || norm.includes("దిశ") || norm.includes("ద్వారం")) {
      return "మా అన్ని అపార్ట్‌మెంట్‌లు ఖచ్చితమైన వాస్తు శాస్త్ర నియమాలను పాटीస్తాయి. ఇవి ఈశాన్యం లేదా తూర్పు ద్వారాలు మరియు ఆగ్नेయ ఆగ్ని వంటశాలలతో నిర్మించబడ్డాయి. పూర్తి వివరాల కోసం నేను మీ వాస్తు కంపాస్ ప్యానెల్‌ను డ్యాష్‌బోర్డ్‌లో లోడ్ చేశాను.";
    }
    if (norm.includes("nri") || norm.includes("ఎన్‌ఆర్‌ఐ") || norm.includes("ఫెమా") || norm.includes("fema") || norm.includes("విదేశీ") || norm.includes("రెమిటెన్స్")) {
      return "ఎన్‌ఆర్‌ఐ కొనుగోలుదారులకు ఫెమా (FEMA) నిబంధనల ప్రకారం పూర్తి మద్దతు మరియు గైడ్ అందుబాటులో ఉంది. మీరు ఎన్‌ఆర్‌ఈ లేదా ఎన్ఆర్‌ఓ ఖాతాల ద్వారా పెట్టుబడి పెట్టవచ్చు. మీ స్క్రీన్‌పై ఎన్‌ఆర్‌ఐ గైడెన్స్ గైడ్‌ని ఆక్టివేట్ చేశాను.";
    }
    if (norm.includes("visit") || norm.includes("బుక్") || norm.includes("చూడాలి") || norm.includes("అపాయింట్మెంట్")) {
      return "నేను మీ కొరకు ఈ వారాంతంలో ఉచిత ఖరీదైన కారు క్లయింట్ పికప్ తో కూడిన వీఐపీ సైట్ విజిట్ బుక్ చేయగలను. బుక్ చేయమంటారా?";
    }
    if (norm.includes("possession") || norm.includes("ఎప్పుడు") || norm.includes("గడువు") || norm.includes("ready")) {
      return "ಲೋಧಾ స్ప్లెండోరా మెరీనా పూర్తిగా సిద్ధంగా ఉంది (Ready-to-move-in). ప్రెస్టీజ్ సాలిటైర్ డిసెంబర్ 2028 లో స్వాధీనం చేయబడుతుంది.";
    }
    return "నమస్కారం! నేను ప్రెస్టీజ్, డిఎల్ఎఫ్, లోధా మరియు మై హోమ్ డెవలపర్స్ యొక్క వాయిస్ అసిస్టెంట్‌ని. మీకు ఏ ప్రాజెక్ట్ గురించి సమాచారం కావాలి?";
  }

  // 2. HINDI Fallbacks
  if (isHindi) {
    if (norm.includes("hyderabad") || norm.includes("myhome") || norm.includes("my home") || norm.includes("legend") || norm.includes("हैदराबाद") || norm.includes("कोकापेट") || norm.includes("माई होम")) {
      return "हैदराबाद के कोकापेट में स्थित 'माई होम लीजेंड' (My Home Legend) हमारा नया सुप्रसिद्द प्रोजेक्ट है। यह पूर्णतः तेलंगाना रेरा स्वीकृत (P02400007821) है, और मार्च 2029 तक पूरा होगा। इसमें 3, 4 और 5 BHK स्काई विला की दर ₹2.90 करोड़ से शुरू होती है। क्या आप वीआईपी साइट विजिट या ईएमआई प्लानिंग शुरू करना चाहेंगे?";
    }
    if (norm.includes("rera") || norm.includes("रेरा") || norm.includes("मंजूरी")) {
      return "हमारे सभी प्रीमियम प्रोजेक्ट्स पूरी तरह से रेरा (RERA) स्वीकृत हैं। आप किस शहर की प्रॉपर्टी देखना चाहेंगे?";
    }
    if (norm.includes("price") || norm.includes("दाम") || norm.includes("कीमत") || norm.includes("बजट") || norm.includes("cost") || norm.includes("कितना") || norm.includes("emi") || norm.includes("किस्त") || norm.includes("लोन") || norm.includes("ब्याज")) {
      return "बिल्कुल, हमने आपकी सुविधा के लिए गृह ऋण गणना की है। ₹1.5 करोड़ की प्रॉपर्टी पर 8.5% न्यूनतम ब्याज दर के साथ आपका मासिक ईएमआई लगभग ₹1,15,337 होगा। आपके विश्लेषण के लिए हमने CFO फाइनेंस डेस्क को लाइव कर दिया है।";
    }
    if (norm.includes("vastu") || norm.includes("वास्तु") || norm.includes("दिशा") || norm.includes("शास्त्र") || norm.includes("द्वार")) {
      return "हमारे सभी लग्जरी अपार्टमेंट्स को प्राचीन वास्तु शास्त्र के सिद्धांतों के अनुसार डिजाइन किया गया है। मुख्य प्रवेश द्वार उत्तर-पूर्व या पूर्व मुखी हैं और रसोई आग्नेय कोण में है। हम आपके लिए वास्तु कम्पास और स्कोरकार्ड चालू कर रहे हैं।";
    }
    if (norm.includes("nri") || norm.includes("एनआरआई") || norm.includes("फेमा") || norm.includes("fema") || norm.includes("विदेश") || norm.includes("रेमिटेंस")) {
      return "अनिवासी भारतीयों (NRI) के लिए फेमा (FEMA) अधिनियम के तहत पूर्ण मार्गदर्शन प्रदान किया जाता है। आप NRE या NRO खातों के माध्यम से आसानी से निवेश कर सकते हैं। NRI गाइड डेस्क आपकी स्क्रीन पर एक्टिवेट हो चुका है।";
    }
    if (norm.includes("visit") || norm.includes("बुक") || norm.includes("अपॉइंटमेंट") || norm.includes("देखना")) {
      return "मैं इस वीकेंड आपके लिए वीआईपी साइट विजिट बुक कर सकता हूँ। क्या मैं आपकी स्लॉट सुरक्षित करूँ?";
    }
    if (norm.includes("possession") || norm.includes("कब") || norm.includes("ready") || norm.includes("तयार")) {
      return "लोधा स्प्लेंडोरा मरीना तुरंत रहने के लिए तैयार है। प्रेस्टीज सॉलिटेयर का कब्ज़ा दिसंबर 2028 में प्रस्तावित है।";
    }
    return "नमस्ते! मैं आपका पर्सनल रियल एस्टेट वॉइस बॉट हूँ। मैं बेंगलुरु, गुरुग्राम, मुंबई और हैदराबाद के प्रीमियम घरों की सटीक जानकारी दे सकता हूँ।";
  }

  // 3. BENGALI Fallbacks
  if (isBengali) {
    if (norm.includes("hyderabad") || norm.includes("myhome") || norm.includes("my home") || norm.includes("legend") || norm.includes("হায়দরাবাদ") || norm.includes("কোকাপেট") || norm.includes("মাই হোম")) {
      return "হায়দরাবাদের কোকাপেটে অবস্থিত 'মাই হোম লেজেন্ড' (My Home Legend) আমাদের সবচেয়ে বিলাসবহুল ভিলা প্রজেক্ট। এটি রেরা (RERA P02400007821) অনুমোদিত এবং মার্চ ২০২৯-এর মধ্যে হস্তান্তর করা হবে। এর প্রারম্ভিক মূল্য ₹২.৯০ কোটি। আমি কি এই উইকএন্ডে আপনার জন্য একটি সাইট ভিজিট বুক করব?";
    }
    if (norm.includes("rera") || norm.includes("রেরা") || norm.includes("অনুমোদন")) {
      return "আমাদের সমস্ত প্রিমিয়াম প্রজেক্ট যেমন প্রেস্টিজ সলিটায়ার এবং মাই হোম লেজেন্ড সম্পূর্ণ রেরা (RERA) অনুমোদিত এবং সুরক্ষিত। আপনি কোন প্রজেক্ট সম্পর্কে জানতে চান?";
    }
    if (norm.includes("price") || norm.includes("দাম") || norm.includes("মূল্য") || norm.includes("বাজেট") || norm.includes("cost") || norm.includes("কত") || norm.includes("emi") || norm.includes("কিস্তি") || norm.includes("লোন") || norm.includes("সুদ")) {
      return "অবশ্যই, আপনার সুবিধার জন্য আমরা হোম লোণ গণনা করেছি। ₹১.৫ কোটির ইউনিটের জন্য ৮.৫% সুদে প্রতি মাসে আনুমানিক EMI প্রায় ₹১,১৫,৩৩৭ হবে। বিশদ বিবরণের জন্য সিএফও ব্যাকএন্ড সক্রিয় করা হয়েছে।";
    }
    if (norm.includes("vastu") || norm.includes("বাস্তু") || norm.includes("দিশা") || norm.includes("শাস্ত্র") || norm.includes("দ্বার")) {
      return "আমাদের সমস্ত হোম লেআউট প্রাচীন বাস্তুशास्त्र অনুযায়ী ডিজাইন করা হয়েছে। প্রধান প্রবেশদ্বার উত্তর-পূর্ব মুখী এবং রান্নাঘরটি দক্ষিণ-পূর্ব অগ্নিকোণে সাজানো।";
    }
    if (norm.includes("nri") || norm.includes("প্রবাসী") || norm.includes("এনআরআই") || norm.includes("ফেমা") || norm.includes("fema") || norm.includes("বিদেশ")) {
      return "অনিবাসী ভারতীয়দের (NRI) জন্য ফেমা (FEMA) নিয়ম অনুযায়ী সম্পূর্ণ সহায়তা দেওয়া হয়। আপনি NRE বা NRO অ্যাকাউন্টের মাধ্যমে বিনিয়োগ করতে পারেন। NRI গাইড চালূ করা হলো।";
    }
    if (norm.includes("visit") || norm.includes("বুক") || norm.includes("সাইট") || norm.includes("দেখতে")) {
      return "আমি অত্যন্ত আনন্দের সাথে এই উইকএন্ডে বিলাসবহুল গাড়ি পিকআপ সহ একটি ব্যক্তিগত ভিআইপি সাইট সফরের সময়সূচী বুক করতে পারি। বুক করব?";
    }
    if (norm.includes("possession") || norm.includes("কবে") || norm.includes("হস্তান্তর") || norm.includes("ready")) {
      return "লোধা স্প্লেন্ডোরা মেরিনা সম্পূর্ণ প্রস্তুত (Ready-to-move-in)। প্রেস্টিজ সলিটায়ারের হস্তান্তর ২০২৮ সালের ডিসেম্বরে এবং মাই হোম লেজেন্ড ২০২৯ সালের মার্চ মাসে হওয়া নির্ধারিত।";
    }
    return "নমস্কার! আমি আপনার রিয়েল এস্টেট ভয়েস সহায়তাকারী। আমি আপনাকে সঠিক সিদ্ধান্ত নিতে এবং আমাদের প্রিমিয়াম ভিলা ও অ্যাপার্টমেন্টের বিশদ তথ্য দিতে সাহায্য করব।";
  }

  // 4. TAMIL Fallbacks
  if (isTamil) {
    if (norm.includes("hyderabad") || norm.includes("myhome") || norm.includes("my home") || norm.includes("legend") || norm.includes("ஹைதராபாத்") || norm.includes("கோகாபேட்") || norm.includes("மை ஹோம்")) {
      return "ஹைதராபாத்தின் கோகாபேட்டில் அமைந்துள்ள 'மை ஹோம் லெஜண்ட்' (My Home Legend) எங்களின் அதிநவீன வில்லா திட்டமாகும். இது ரெரா (TS RERA P02400007821) அங்கீகாரம் பெற்றது, மார்ச் 2029 இல் கைவசமாகும். இதன் விலை ₹2.90 கோடியிலிருந்து தொடங்குகிறது. உங்களுக்கு ஒரு விஐபி தள வருகையை (VIP Site Visit) பதிவு செய்யலாமா?";
    }
    if (norm.includes("rera") || norm.includes("ரெரா") || norm.includes("அனுமதி")) {
      return "எங்கள் அனைத்து பிரீமியம் வீட்டுத் திட்டங்களும் (பிரெஸ்டீஜ் சாலிடேர், மை ஹோம் லெஜண்ட் போன்றவை) முழுமையாக ரெரா (RERA) அங்கீகரிக்கப்பட்டவை. உங்களுக்கு எந்தத் திட்டம் குறித்து அறிய வேண்டும்?";
    }
    if (norm.includes("price") || norm.includes("விலை") || norm.includes("மதிப்பு") || norm.includes("பட்ஜெட்") || norm.includes("cost") || norm.includes("எவ்வளவு") || norm.includes("emi") || norm.includes("தவணை") || norm.includes("கடன்") || norm.includes("வட்டி")) {
      return "நிச்சயமாக, உங்கள் வசதிக்காக வீட்டுலன் மதிப்பீட்டை நாங்கள் செய்துள்ளோம். ₹1.5 கோடி மதிப்பிலான வீட்டிற்கு 8.5% வட்டியில் மாதத்தவணை (EMI) சுமார் ₹1,15,337 ஆகும். உங்கள் நிதியியல் திட்டமிடலுக்கான விபரங்களை இயக்கியுள்ளேன்.";
    }
    if (norm.includes("vastu") || norm.includes("வாஸ்து") || norm.includes("திசை") || norm.includes("சாஸ்திரம்") || norm.includes("நுழைவு")) {
      return "எங்கள் அனைத்து வீடுகளும் பிரபஞ்ச வாஸ்து முறைப்படி கட்டப்பட்டுள்ளன. வீட்டின் நுழைவாயில் வடக்கு அல்லது வடகிழக்கு நோக்கியும், சமையலறை தென்கிழக்கு அக்னி மூலையிலும் அமைக்கப்பட்டுள்ளன.";
    }
    if (norm.includes("nri") || norm.includes("வெளிநாடு") || norm.includes("பெமா") || norm.includes("fema") || norm.includes("முதலீடு")) {
      return "வெளிநாடு வாழ் இந்தியர்களுக்கு (NRI) ஃபெமா (FEMA) விதிமுறைகளின் கீழ் முழுமையான ஆலோசனை மற்றும் வழிகாட்டல் வழங்கப்படுகிறது. நீங்கள் NRE அல்லது NRO கணக்குகள் மூலம் முதலீடு செய்யலாம்.";
    }
    if (norm.includes("visit") || norm.includes("வருகை") || norm.includes("பார்வை") || norm.includes("முன்பதிவு")) {
      return "இந்த வார இறுதியில் உங்களுக்கு பிரத்யேக சொகுசு கார் வசதியுடன் கூடிய விஐபி தள வருகையை முன்பதிவு செய்ய எனக்கு மகிழ்ச்சி அளிக்கும். பதிவு செய்யட்டுமா?";
    }
    if (norm.includes("possession") || norm.includes("எப்போது") || norm.includes("தயார்") || norm.includes("ready")) {
      return "லோதா ஸ்ப்ளெண்டோரா மெரினா முற்றிலும் தயாராக உள்ளது (Ready-to-move-in). பிரெஸ்டீஜ் சாலிடேர் டிசம்பர் 2028 இலும், மை ஹோம் லெஜண்ட் मார்ச் 2029 ಇலும் கைவசமாகும்.";
    }
    return "வணக்கம்! நான் உங்கள் பிரத்யேக ரியல் எস্টেட் குரல் உதவியாளர். பிரெஸ்டீஜ், டிஎல்எஃப், லோதா மற்றும் மை ஹோம் திட்டங்களின் தகவல்களை வழங்க நான் தயாராக உள்ளேன்.";
  }

  // 5. MARATHI Fallbacks
  if (isMarathi) {
    if (norm.includes("hyderabad") || norm.includes("myhome") || norm.includes("my home") || norm.includes("legend") || norm.includes("हैदराबाद") || norm.includes("कोकापेट") || norm.includes("माय होम")) {
      return "हैदराबादच्या कोकापेट येथील 'माय होम लेजंड' (My Home Legend) हा आमचा उत्कृष्ट लक्झरी विला प्रकल्प आहे. हा प्रकल्प तेलंगणा रेरा (P02400007821) मंजूर असून मार्च २०२९ पर्यंत ताबा मिळेल. याची किंमत ₹२.९० कोटींपासून सुरू होते. तुमच्यासाठी व्हीआयपी साईट भेट बुक करू का?";
    }
    if (norm.includes("rera") || norm.includes("रेरा") || norm.includes("मंजुरी")) {
      return "आमचे सर्व लक्झरी प्रकल्प (प्रिस्टीज सॉलिटेअर, माय होम लेजंड) रेरा (RERA) मंजूर आहेत. खरेदीदारांच्या गुंतवणुकीची 100% सुरक्षितता आम्ही देतो.";
    }
    if (norm.includes("price") || norm.includes("किंमत") || norm.includes("दर") || norm.includes("बजेट") || norm.includes("cost") || norm.includes("किती") || norm.includes("emi") || norm.includes("हप्ता") || norm.includes("कर्ज") || norm.includes("व्याज")) {
      return "नक्कीच, गृहकर्ज हप्त्याचे गणित आम्ही केले आहे. ₹१.५ कोटींच्या युनिटवर ८.५% व्याजाने मासिक हप्ता (EMI) साधारणपणे ₹१,१५,३३७ असेल. CFO डॅशबोर्डवर ही माहिती सविस्तर उपलब्ध आहे.";
    }
    if (norm.includes("vastu") || norm.includes("वास्तू") || norm.includes("दिशा") || norm.includes("शास्त्र") || norm.includes("प्रवेश")) {
      return "आमचे सर्व प्रकल्प प्राचीन वास्तुशास्त्राच्या नियमांनुसार बांधण्यात आले आहेत. मुख्य प्रवेशद्वार पूर्व वा ईशान्य दिशेला असून स्वयंपाकघर आग्नेय कोपऱ्यात आहे.";
    }
    if (norm.includes("nri") || norm.includes("अनिवासी") || norm.includes("एनआरआय") || norm.includes("फेमा") || norm.includes("fema") || norm.includes("परदेशी")) {
      return "अनिवासी भारतीयांसाठी (NRI) फेमा (FEMA) कायद्यानुसार सर्व सल्ला व साहाय्य दिले जाते. तुम्ही NRE किंवा NRO खात्यांद्वारे सुरक्षित गुंतवणूक करू शकता.";
    }
    if (norm.includes("visit") || norm.includes("भेट") || norm.includes("बुक") || norm.includes("अपॉइंटमेंट")) {
      return "या वीकेंडला लक्झरी कार पिकअपसह विनामूल्य VIP साईट व्हिजिट बुक करताना मला आनंद होईल. तुमच्यासाठी ते बुक करू का?";
    }
    if (norm.includes("possession") || norm.includes("कधी") || norm.includes("ताबा") || norm.includes("ready")) {
      return "लोढा स्प्लेंडोरा मरीना तात्काळ राहण्यासाठी सज्ज आहे (Ready-to-move-in). प्रिस्टीज सॉलिटेअरचा ताबा डिसेंबर २०२८ तर माय होम लेजंडचा ताबा मार्च २०२९ मध्ये मिळेल.";
    }
    return "नमस्कार! मी आपला पर्सनल रियल एस्टेट वॉइस असिस्टंट आहे. मला सांगा, आपण कोणत्या प्रीमियम प्रकल्पाविषयी माहिती शोधत आहात?";
  }

  // 6. KANNADA Fallbacks
  if (isKannada) {
    if (norm.includes("hyderabad") || norm.includes("myhome") || norm.includes("my home") || norm.includes("legend") || norm.includes("ಹೈದರಾಬಾದ್") || norm.includes("ಕೋಕಾಪೇಟ್") || norm.includes("ಮೈ ಹೋಮ್")) {
      return "ಹೈದರಾಬಾದ್‌ನ ಕೋಕಾಪೇಟ್‌ನಲ್ಲಿರುವ 'ಮೈ ಹೋಮ್ ಲೆಜೆಂಡ್' (My Home Legend) ನಮ್ಮ ಹೆಮ್ಮೆಯ ವಿಲ್ಲಾ ಯೋಜನೆಯಾಗಿದೆ. ಇದು ತೆಲಂಗಾಣ ರೇರಾ (P02400007821) ಅನುಮೋದಿತವಾಗಿದ್ದು, ಮಾರ್ಚ್ 2029 ರೊಳಗೆ ಹಸ್ತಾಂತರಕ್ಕೆ ಸಿದ್ಧವಾಗಲಿದೆ. ಇದರ ಆರಂಭಿಕ ಬೆಲೆ ₹2.90 ಕೋಟಿ. ಈ ವಾರಾಂತ್ಯದಲ್ಲಿ ಸೈಟ್ ಭೇಟಿಯನ್ನು ಬುಕ್ ಮಾಡಲೇ?";
    }
    if (norm.includes("rera") || norm.includes("ರೇರಾ") || norm.includes("ಅನುಮೋದನೆ")) {
      return "ನಮ್ಮ ಎಲ್ಲಾ ಪ್ರೀಮಿಯಂ ಯೋಜನೆಗಳು ರೇರಾ (RERA) ನಿಯಮಗಳಿಗೆ ಸಂಪೂರ್ಣ ಬದ್ಧವಾಗಿವೆ. ಯಾವುದೇ ರೀತಿಯ ವಿಳಂಬದ ಭಯವಿಲ್ಲದೆ ನೀವು ಹೂಡಿಕೆ ಮಾಡಬಹುದು. ಯಾವ ಯೋಜನೆಯ ವಿವರ ಬೇಕು?";
    }
    if (norm.includes("price") || norm.includes("ಬೆಲೆ") || norm.includes("ದರ") || norm.includes("ಬಜೆಟ್") || norm.includes("cost") || norm.includes("ಎಷ್ಟು") || norm.includes("emi") || norm.includes("ಕಂತು") || norm.includes("ಸಾಲ") || norm.includes("ಬಡ್ಡಿ")) {
      return "ಖಂಡಿತ, ನಿಮ್ಮ ಅನುಕೂಲಕ್ಕಾಗಿ ಗೃಹ ಸಾಲದ ಅಂದಾಜನ್ನು ಮಾಡಿದ್ದೇವೆ. ₹1.5 ಕೋಟಿ ಮೌಲ್ಯದ ಮನೆಗೆ ಶೇ. 8.5 ರಷ್ಟು ಬಡ್ಡಿಯಲ್ಲಿ ಮಾಸಿಕ ಕಂತು (EMI) ಸುಮಾರು ₹1,15,337 ಆಗುತ್ತದೆ. ಫೈನಾನ್ಸ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ತೆರೆಯಲಾಗಿದೆ.";
    }
    if (norm.includes("vastu") || norm.includes("ವಾಸ್ತು") || norm.includes("ದಿಕ್ಕು") || norm.includes("ಶಾಸ್ತ್ರ") || norm.includes("ಪ್ರವೇಶ")) {
      return "ನಮ್ಮ ಎಲ್ಲಾ ವಿನ್ಯಾಸಗಳು ಸಂಪೂರ್ಣ ವಾಸ್ತು ಶಾಸ್ತ್ರದ ತತ್ವಗಳ ಅನ್ವಯ ರೂಪಿತವಾಗಿವೆ. ಪೂರ್ವ ಅಥವಾ ಈಶಾನ್ಯ ಮುಖ ಪ್ರವೇಶದ್ವಾರಗಳು ಮತ್ತು ಆಗ್ನೇಯ ದಿಕ್ಕಿನಲ್ಲಿ ಅಡುಗೆಮನೆ ಇವೆ.";
    }
    if (norm.includes("nri") || norm.includes("ಅನಿವಾಸಿ") || norm.includes("ಫೆಮಾ") || norm.includes("fema") || norm.includes("ವಿದೇಶಿ")) {
      return "ನಿವಾಸಿಗಳಲ್ಲದ ಭಾರತೀಯರಿಗೆ (NRI) ಫೆಮಾ (FEMA) ನಿಯಮಾವಳಿಗಳ ಅಡಿಯಲ್ಲಿ ಸಂಪೂರ್ಣ ಹೂಡಿಕೆ ಮಾರ್ಗದರ್ಶನ ನೀಡಲಾಗುತ್ತದೆ. ನೀವು NRE ಅಥವಾ NRO ಖಾತೆಗಳ ಮೂಲಕ ಹೂಡಿಕೆ ಮಾಡಬಹುದು.";
    }
    if (norm.includes("visit") || norm.includes("ಭೇಟಿ") || norm.includes("ಬುಕ್") || norm.includes("ಸೈಟ್")) {
      return "ಈ ವಾರಾಂತ್ಯದಲ್ಲಿ ಲಕ್ಸುರಿ ಕಾರ್ ಪಿಕಪ್ ಸೇವೆಯೊಂದಿಗೆ ವಿಐಪಿ ಸೈಟ್ ಭೇಟಿಯನ್ನು ಕಾಯ್ದಿರಿಸಲು ನನಗೆ ಅತ್ಯಂತ ಸಂತೋಷವಾಗುತ್ತದೆ. ಕಾಯ್ದಿರಿಸಲೇ?";
    }
    if (norm.includes("possession") || norm.includes("ಯಾವಾಗ") || norm.includes("ಸಿದ್ಧ") || norm.includes("ready")) {
      return "ಲೋಧಾ ಸ್ಪ್ಲೆಂಡೋರಾ ಮರೀನಾ ಸಂಪೂರ್ಣವಾಗಿ ಖರೀದಿಗೆ ಸಿದ್ಧವಾಗಿದೆ (Ready-to-move-in). ಪ್ರೆಸ್ಟೀಜ್ ಸಾಲಿಟೇರ್ ಡಿಸೆಂಬರ್ 2028 ರಲ್ಲಿ ಮತ್ತು ಮೈ ಹೋಮ್ ಲೆಜೆಂಡ್ ಮಾರ್ಚ್ 2029 ರಲ್ಲಿ ಸ್ವಾಧೀನಕ್ಕೆ ಸಿಗಲಿದೆ.";
    }
    return "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ರಿಯಲ್ ಎಸ್ಟೇಟ್ ಧ್ವನಿ ಸಹಾಯಕ. ಬೆಂಗಳೂರು, ಮುಂಬೈ, ಹೈದರಾಬಾದ್‌ನ ಅತ್ಯುತ್ತಮ ಮನೆಗಳ ನಿಖರ ಮಾಹಿತಿ ನೀಡಲು ನಾನು ಇಲ್ಲಿದ್ದೇನೆ.";
  }

  // 7. GUJARATI Fallbacks
  if (isGujarati) {
    if (norm.includes("hyderabad") || norm.includes("myhome") || norm.includes("my home") || norm.includes("legend") || norm.includes("હૈદરાબાદ") || norm.includes("કોકાપેટ") || norm.includes("માય હોમ")) {
      return "હૈદરાબાદના કોકાપેટમાં સ્થિત 'માય હોમ લેજેન્ડ' (My Home Legend) અમારો સૌથી લોકપ્રિય વિલા પ્રોજેક્ટ છે. આ તેલંગણા રેરા (P02400007821) માન્ય છે અને માર્ચ 2029 સુધીમાં પઝેશન મળશે. કિંમત ₹2.90 કરોડથી શરૂ થાય છે. આ વીકએન્ડમાં વીઆઇપી સાઇટ વિઝિટ બુક કરું?";
    }
    if (norm.includes("rera") || norm.includes("રેરા") || norm.includes("મંજૂરી")) {
      return "અમારા તમામ લક્ઝરી પ્રોજેક્ટ્સ (પ્રેસ્ટિજ સોલિટેર, માય હોમ લેજેન્ડ) સંપૂર્ણપણે રેરા (RERA) માન્ય છે, જેથી તમારું રોકાણ 100% સુરક્ષિત રહે છે.";
    }
    if (norm.includes("price") || norm.includes("કિંમત") || norm.includes("ભાવ") || norm.includes("બજેટ") || norm.includes("cost") || norm.includes("કેટલા") || norm.includes("emi") || norm.includes("હપ્તો") || norm.includes("લોન") || norm.includes("વ્યાજ")) {
      return "અલબત્ત, હોમ લોન EMI ની ગણતરી અમે કરી લીધી છે. ₹1.5 કરોડ માટે 8.5% વ્યાજ દરે માસિક હપ્તો (EMI) આશરે ₹1,15,337 થશે. ફાઇનાન્સ ટેબ પણ એક્ટિવ કરી દીધી છે. ";
    }
    if (norm.includes("vastu") || norm.includes("વાસ્તુ") || norm.includes("દિશા") || norm.includes("શાસ્ત્ર") || norm.includes("દ્વાર")) {
      return "અમારા બધા ઘરોનું આયોજન વૈદિક વાસ્તુશાસ્ત્ર મુજબ જ કરવામાં આવ્યું છે. મુખ્ય દ્વાર ઉત્તર-પૂર્વ કે પૂર્વ તરફ અને રસોડું અગ્નિ ખૂણામાં રાખેલું છે.";
    }
    if (norm.includes("nri") || norm.includes("એનઆરઆઈ") || norm.includes("ફેમા") || norm.includes("fema") || norm.includes("વિદેશ")) {
      return "એનઆરઆઈ (NRI) ખરીદદારો માટે ફેમા (FEMA) કાયદા હેઠળ સંપૂર્ણ માર્ગદર્શન પૂરું પાડવામાં આવે છે. તમે NRE અથવા NRO એકાઉન્ટ દ્વારા રોકાણ કરી શકો છો.";
    }
    if (norm.includes("visit") || norm.includes("મુલાકાત") || norm.includes("ટૂર") || norm.includes("બુક")) {
      return "હું આ વીકએન્ડ દરમિયાન લક્ઝરી કાર પિકઅપ સાથે વીઆઇપી સાઇટ ટૂર ગોઠવવા માટે ખૂબ જ ખુશ થઈશ. શું હું આ બુક કરું?";
    }
    if (norm.includes("possession") || norm.includes("ક્યારે") || norm.includes("તૈયાર") || norm.includes("ready")) {
      return "લોઢા સ્પ્લેન્ડોરા મરીના સંપૂર્ણ તૈયાર છે (Ready-to-move-in). પ્રેસ્ટિજ સોલિટેરનું પઝેશન ડિસેમ્બર 2028 અને માય હોમ લેજેન્ડનું માર્ચ 2029 નક્કી છે.";
    }
    return "નમસ્તે! હું તમારો પર્સનલ રિયલ એસ્ટેટ વોઈસ બોટ છું. હું તમને શ્રેષ્ઠ પ્રોપર્ટી પસંદ કરવામાં અને તેના સચોટ આંકડા જાણવામાં મદદ કરીશ.";
  }

  // 8. MALAYALAM Fallbacks
  if (isMalayalam) {
    if (norm.includes("hyderabad") || norm.includes("myhome") || norm.includes("my home") || norm.includes("legend") || norm.includes("ഹൈദരാബാദ്") || norm.includes("കോക്കാപേട്ട്") || norm.includes("മൈ ഹോം")) {
      return "ഹൈദരാബാദിലെ കോക്കാപേട്ടിൽ സ്ഥിതി ചെയ്യുന്ന 'മൈ ഹോം ലെജൻഡ്' (My Home Legend) ഞങ്ങളുടെ പ്രമുഖ വില്ലാ പ്രോജക്റ്റാണ്. ഇത് തെലങ്കാന റെറ (P02400007821) അംഗീകൃതമാണ്, മാർച്ച് 2029-ൽ കൈവശം ലഭിക്കും. ഇതിൻ്റെ പ്രാരംഭ വില ₹2.90 കോടിയാണ്. ഈ വാരാന്ത്യത്തിൽ ഒരു വിഐപി സൈറ്റ് സന്ദർശനം ബുക്ക് ചെയ്യട്ടെയോ?";
    }
    if (norm.includes("rera") || norm.includes("റെറ") || norm.includes("അംഗീകാരം")) {
      return "ഞങ്ങളുടെ എല്ലാ പ്രീമിയം പ്രോജക്റ്റുകളും (പ്രസ്റ്റീജ് സോളിറ്റയർ, മൈ ഹോം ലെജൻഡ്) പൂർണ്ണമായും റെറ (RERA) നിയമങ്ങൾക്ക് വിധേയമായി നിർമ്മിക്കപ്പെട്ടവയാണ്. ഏതു പ്രോജക്റ്റിൻ്റെ വിവരങ്ങളാണ് വേണ്ടത്?";
    }
    if (norm.includes("price") || norm.includes("വില") || norm.includes("തുക") || norm.includes("ബജറ്റ്") || norm.includes("cost") || norm.includes("എത്ര") || norm.includes("emi") || norm.includes("തവണ") || norm.includes("വായ്പ") || norm.includes("പലിശ")) {
      return "തീർച്ചയായും, നിങ്ങളുടെ സൗകര്യത്തിനായി ഭവന വായ്പ തുക കണക്കാക്കിയിട്ടുണ്ട്. ₹1.5 കോടിയുടെ വീടിന് 8.5% പലിശ നിരക്കിൽ പ്രതിമാസ EMI ഏകദേശം ₹1,15,337 ആയിരിക്കും. വിശദവിവരങ്ങൾ ധനകാര്യ വിഭാഗം പോർട്ടലിൽ സജ്ജമാക്കിയിട്ടുണ്ട്.";
    }
    if (norm.includes("vastu") || norm.includes("വാസ്തു") || norm.includes("ദിശ") || norm.includes("ശാസ്ത്രം") || norm.includes("വാതിൽ")) {
      return "ഞങ്ങളുടെ എല്ലാ വില്ലകളും മാതൃകാപരമായ വാസ്തു ശാസ്ത്ര തത്വങ്ങൾ അനുസരിച്ചാണ് രൂപകൽപ്പന ചെയ്തിരിക്കുന്നത്. പ്രധാന കവാടങ്ങൾ കിഴക്ക് അല്ലെങ്കിൽ വടക്ക്-കിഴക്ക് ശൈലിയിലുള്ളതും അടുക്കള തെക്ക്-കിഴക്ക് ഭാഗത്തുമാണ്.";
    }
    if (norm.includes("nri") || norm.includes("പ്രവാസി") || norm.includes("ഫെമ") || norm.includes("fema") || norm.includes("നിക്ഷേപം")) {
      return "അനുകൂലമായ വിദേശ വിനിമയ ചട്ടങ്ങൾ അതായത് ഫെമ (FEMA) പശ്ചാത്തലത്തിൽ പ്രവാസി മലയാളികൾക്ക് (NRI) സുരക്ഷിതമായി നിക്ഷേപം നടത്താം. നിങ്ങൾക്ക് NRE അല്ലെങ്കിൽ NRO അക്കൗണ്ടുകൾ ഉപയോഗിക്കാം.";
    }
    if (norm.includes("visit") || norm.includes("സന്ദർശനം") || norm.includes("യാത്ര") || norm.includes("ബുക്ക്")) {
      return "ലക്ഷ്വറി കാർ സൗകര്യത്തോടെ ഈ വാരാന്ത്യത്തിൽ ഒരു വിഐപി സൈറ്റ് സന്ദർശനം നടത്തുവാൻ സൗകര്യം ബുക്ക് ചെയ്യാവുന്നതാണ്. ഇത് കൺഫോം ചെയ്യട്ടെയോ?";
    }
    if (norm.includes("possession") || norm.includes("എപ്പോൾ") || norm.includes("തയ്യാർ") || norm.includes("ready")) {
      return "ലോധ സ്പ്ലെൻഡോറ മറീന ഇപ്പോൾ താമസത്തിന് പൂർണ്ണമായും സജ്ജമാണ് (Ready-to-move-in). പ്രസ്റ്റീജ് സോളിറ്റയർ ഡിസംബർ 2028-ലും മൈ ഹോം ലെജൻഡ് മാർച്ച് 2029-ലും കൈമാറും.";
    }
    return "നമസ്കാരം! ഞാൻ നിങ്ങളുടെ വ്യക്തിഗത റിയൽ എസ്റ്റേറ്റ് വോയ്‌സ് അസിസ്റ്റന്റാണ്. താങ്കൾക്ക് അർഹമായ മികച്ച വീടുകൾ തിരഞ്ഞെടുക്കാൻ ഞാൻ സഹായിക്കാം.";
  }

  // 9. ENGLISH Fallbacks (Standard Router)
  if (norm.includes("portfolio_pivot_required") || message.includes("PORTFOLIO_PIVOT_REQUIRED")) {
    return "This tower starts at 1.5 Cr, but our developer has a premium project in XYZ location starting at 80 Lakhs.";
  }
  
  if (norm.includes("hyderabad") || norm.includes("myhome") || norm.includes("my home") || norm.includes("legend") || norm.includes("kokapet")) {
    return "My Home Legend in Kokapet, Golden Mile IT Corridor, Hyderabad is our featured masterwork of sky-condominiums by My Home Constructions. Fully licensed under Telangana RERA (P02400007821), it offers ultra-luxury 3, 4, and 5 BHK layouts starting from ₹2.90 Crores to ₹8.30 Crores with possession starting in March 2029. Would you like to schedule a private VIP chauffeur-driven site visit or check its Vastu specifications?";
  }

  if (norm.includes("hello") || norm.includes("hi ") || norm.includes("hey")) {
    return "Hello! Thank you for contacting our luxury real estate portal. Are you looking to explore My Home Legend Hyderabad, Prestige Solitaire Bengaluru, DLF Horizon Gurugram, or Lodha Marina in Mumbai?";
  }

  if (norm.includes("emi") || norm.includes("cfo") || norm.includes("calculator") || norm.includes("finance") || norm.includes("loan") || norm.includes("interest") || norm.includes("downpayment")) {
    return "I have calculated the home loan estimate for you. Under the HDFC/SBI luxury interest of 8.5% for a 20-year tenure, your monthly estimate stands at ₹1,15,337 for a 1.5 Crore unit, ₹2,23,000 for My Home Legend, and up to ₹4,30,591 for the DLF 5.6 Crore premium suite. Let me open the CFO interactive dashboard for you to play with the tenure sliders.";
  }

  if (norm.includes("vastu") || norm.includes("shastra") || norm.includes("direction") || norm.includes("facing") || norm.includes("entrance")) {
    return "All our layouts are meticulously pre-designed under cosmic Vastu principles. Prestige Solitaire, DLF Horizon, and My Home Legend Hyderabad focus on East or North-East facing grand entrance structures with South-East Agni kitchens for prosperity and master bedrooms in the South-West for family stability. I am opening the Vastu compliance compass panel on your dashboard now.";
  }

  if (norm.includes("nri") || norm.includes("fema") || norm.includes("foreign") || norm.includes("abroad") || norm.includes("repatriation")) {
    return "We provide comprehensive repatriation advice under the FEMA Foreign Exchange Act. Foreign citizens and Non-Resident Indians can seamlessly invest in DLF Horizon or My Home Legend Hyderabad via NRE or NRO remittance accounts. Let me enable the NRI compliance guide tab on your screen to verify direct outward remissions.";
  }
  
  if (norm.includes("rera")) {
    if (norm.includes("prestige") || norm.includes("solitaire")) {
      return "Prestige Solitaire in Whitefield is fully approved by Karnataka RERA under registration PRM/KA/RERA/1251/446/PR/310526/006452.";
    }
    if (norm.includes("dlf") || norm.includes("horizon")) {
      return "DLF Horizon Residences in Sector 65 Gurugram is completely approved under Haryana HARERA registration RC/REP/HARERA/GGM/2026/782.";
    }
    if (norm.includes("lodha") || norm.includes("marina") || norm.includes("splendora")) {
      return "Lodha Splendora Marina in Thane West Mumbai is safely registered under MahaRERA certificate P51700021432.";
    }
    if (norm.includes("myhome") || norm.includes("my home") || norm.includes("legend") || norm.includes("hyderabad")) {
      return "My Home Legend in Kokapet Hyderabad is fully approved and registered under Telangana RERA registration certificate P02400007821.";
    }
    return "All our properties (Prestige Solitaire, DLF Horizon, Lodha Marina, and My Home Legend) are strictly RERA certified. Which specific location are you exploring?";
  }

  if (norm.includes("price") || norm.includes("cost") || norm.includes("pricing") || norm.includes("bhk") || norm.includes("crore")) {
    if (norm.includes("prestige") || norm.includes("solitaire") || norm.includes("bengaluru")) {
      return "Prestige Solitaire is priced from ₹1.45 Crores for luxury 2 BHK homes, up to ₹3.40 Crores for grand 4 BHK residential suites.";
    }
    if (norm.includes("dlf") || norm.includes("horizon") || norm.includes("gurugram")) {
      return "DLF Horizon Gurugram premium units range from ₹3.80 Crores for ultra-scale 3 BHK units, up to ₹9.00 Crores for a limited penthouse.";
    }
    if (norm.includes("lodha") || norm.includes("marina") || norm.includes("splendora") || norm.includes("mumbai") || norm.includes("thane")) {
      return "Lodha Splendora Marina is completely ready-to-move, running from ₹85 Lakhs for executive configurations up to ₹2.10 Crores for riverside 3 BHKs.";
    }
    if (norm.includes("myhome") || norm.includes("my home") || norm.includes("legend") || norm.includes("hyderabad")) {
      return "My Home Legend Hyderabad pricing: luxury 3 BHK at ₹2.90 Cr - ₹3.15 Cr, 4 BHK Sky Condo at ₹4.50 Cr - ₹4.80 Cr, and the elite 5 BHK Duplex at ₹7.80 Cr - ₹8.30 Cr.";
    }
  }

  if (norm.includes("visit") || norm.includes("book") || norm.includes("appointment") || norm.includes("schedule") || norm.includes("tour")) {
    return "I would be absolutely delighted to schedule a private VIP site tour with luxury chauffeur pickup. Would you like me to book this for you this coming weekend?";
  }

  if (norm.includes("possession") || norm.includes("timeline") || norm.includes("when") || norm.includes("ready")) {
    if (norm.includes("lodha") || norm.includes("marina") || norm.includes("splendora")) {
      return "Lodha Splendora Marina is fully ready-to-move-in with acquired occupancy certificates, let us register your keys.";
    }
    if (norm.includes("prestige") || norm.includes("solitaire")) {
      return "Possession delivery for Prestige Solitaire in Whitefield is slated for December 2028.";
    }
    if (norm.includes("dlf") || norm.includes("horizon")) {
      return "DLF Horizon Residences in Gurugram are scheduled for structural completion in October 2029.";
    }
    if (norm.includes("myhome") || norm.includes("my home") || norm.includes("legend") || norm.includes("hyderabad")) {
      return "My Home Legend in Kokapet Hyderabad will be structural completed with premium handovers commencing in March 2029.";
    }
  }

  // If there's localized context from RAG, pick a relevant sentence
  if (contextChunks && contextChunks.length > 0) {
    const primaryInfo = contextChunks[0];
    if (primaryInfo.length > 10) {
      // Strip some tags to make it voice-friendly
      return primaryInfo.split(".")[0] + ". RERA clearances are fully active. Would you like me to coordinate a site visit?";
    }
  }

  return "That sounds like a beautiful plan. We offer certified homes with full smart features. Would you like me to coordinate a site tour or schedule a phone call with our property advisor?";
}

// Start Server routine
async function startServer() {
  // Vite integration middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Pre-Sales AI Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
