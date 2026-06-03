/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Loader2,
  Play,
  Square,
  Sparkles,
  Info,
  Server,
  Cpu,
  BookOpen,
} from "lucide-react";
import { useVoiceEngine } from "../hooks/useVoiceEngine";
import { retrieveContext } from "../data";
import { auditPreSalesOutput } from "../utils/guardrails";
import { Project, Message, AssistantEngine } from "../types";
import { analyzeLeadIntent } from "../utils/LeadScorer";
import { useWhatsAppHandoff } from "../hooks/useWhatsAppHandoff";

// Constants for precise booking intent classification and keyword/phrase similarity matching
const BOOKING_PHRASES = [
  "book a site visit",
  "book site visit",
  "schedule a site visit",
  "schedule site visit",
  "book a tour",
  "schedule a tour",
  "schedule tour",
  "book virtual tour",
  "book showroom tour",
  "schedule an appointment",
  "book an appointment",
  "schedule appointment",
  "reserve a slot",
  "reserve slot",
  "private visit",
  "guided tour",
  "vip tour",
  "register a visit",
  "coordinate a visit",
  "book a flat",
  "form design",
  "site visit booking",
  "arrange a visit",
  "schedule a v-i-p tour",
  "schedule a vip tour"
];

const BOOKING_STEMS = ["book", "schedule", "reserve", "appointment"];

const INFORMATIONAL_WORDS = [
  "how many", "how much", "what is", "what are", "is there", "are there", "do you have", "does it have",
  "available", "availability", "price", "pricing", "cost", "tariff", "bhk", "carpet area", "amenities", "features",
  "specifications", "rera", "developer", "builder", "brochure", "location", "address", "information", "info", "details",
  "photos", "images"
];

function isBookingIntent(text: string, previousOfferSent: boolean): boolean {
  const norm = text.toLowerCase().trim();

  // 1. Direct explicit overrides (e.g. how/where can I book/schedule)
  const isHowToBookQuestion = 
    (norm.includes("how") || norm.includes("where") || norm.includes("can i") || norm.includes("want to") || norm.includes("like to")) &&
    (norm.includes("book") || norm.includes("schedule") || norm.includes("reserve") || norm.includes("appointment"));
  
  if (isHowToBookQuestion && !norm.includes("how many") && !norm.includes("how much")) {
    return true;
  }

  // 2. Identify informational check indicators.
  const hasInformationalKeywords = INFORMATIONAL_WORDS.some(word => norm.includes(word));
  const isQuestion = norm.includes("?") || norm.startsWith("what") || norm.startsWith("how") || norm.startsWith("why") || norm.startsWith("where") || norm.startsWith("when");

  // 3. Affirmation check under a previous assistant offer
  if (previousOfferSent) {
    const isAffirmative = /\b(yes|sure|ok|okay|yeah|yep|absolutely|schedule it|book it|go ahead|please|agree)\b/i.test(norm);
    if (isAffirmative && !hasInformationalKeywords) {
      return true;
    }
  }

  // 4. Exclude queries with informational words if they are questions or have no explicit site visit context
  if ((isQuestion && hasInformationalKeywords) || (hasInformationalKeywords && !norm.includes("site visit") && !norm.includes("book"))) {
    return false;
  }

  // 5. Compute token similarity against specific booking phrases
  const matchedPhase = BOOKING_PHRASES.some(phrase => {
    if (norm.includes(phrase)) return true;
    
    // Check Jaccard similarity / word-overlap
    const normWords = norm.split(/[^a-zA-Z0-9]+/).filter(Boolean);
    const phraseWords = phrase.split(/[^a-zA-Z0-9]+/).filter(Boolean);
    
    if (phraseWords.length === 0) return false;
    
    const intersection = normWords.filter(w => phraseWords.includes(w));
    // For phrase matching, we consider highly similar if at least 65% of the phrase words are present
    return (intersection.length / phraseWords.length) >= 0.65;
  });

  if (matchedPhase) {
    return true;
  }

  // 6. Check general booking key terms
  const hasBookingKeywords = BOOKING_STEMS.some(stem => norm.includes(stem)) || norm.includes("tour") || (norm.includes("visit") && !norm.includes("visitor"));
  
  if (hasBookingKeywords) {
    // Make sure it is not masked by informational keywords like "available" or "how many".
    const isInfoCheck = norm.includes("available") || norm.includes("how many") || norm.includes("what are") || norm.includes("what is") || norm.includes("cost of");
    if (isInfoCheck) {
      return false;
    }
    return true;
  }

  return false;
}

// Custom lightweight parser to dynamically format Markdown outputs in chat history (headings, bolds, lists, and links)
const renderMessageText = (text: string) => {
  if (!text) return null;

  // Split message text by line breaks to handle headers, lists, and normal block formatting
  const lines = text.split("\n");
  
  return lines.map((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      // Empty line is rendered as a clean spacing gap
      return <div key={idx} className="h-1.5" />;
    }

    // Check for standard Bullet Lists (- item or * item)
    const isBulletItem = trimmed.startsWith("- ") || trimmed.startsWith("* ");
    let contentToParse = trimmed;
    if (isBulletItem) {
      contentToParse = trimmed.substring(2);
    }

    // Parse double asterisks (**bold**) into strong visual tags
    const boldRegex = /\*\*(.*?)\*\*/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(contentToParse)) !== null) {
      const matchIndex = match.index;
      if (matchIndex > lastIndex) {
        parts.push(contentToParse.substring(lastIndex, matchIndex));
      }
      parts.push(
        <strong key={matchIndex} className="font-bold text-white drop-shadow-sm">
          {match[1]}
        </strong>
      );
      lastIndex = boldRegex.lastIndex;
    }

    if (lastIndex < contentToParse.length) {
      parts.push(contentToParse.substring(lastIndex));
    }

    const parsedContent = parts.length > 0 ? parts : contentToParse;

    // Check for standard Markdown Headings (# or ##)
    let headerLevel = 0;
    let cleanHeaderContent = parsedContent;

    if (typeof parsedContent === "string") {
      if (parsedContent.startsWith("### ")) {
        headerLevel = 3;
        cleanHeaderContent = parsedContent.substring(4);
      } else if (parsedContent.startsWith("## ")) {
        headerLevel = 2;
        cleanHeaderContent = parsedContent.substring(3);
      } else if (parsedContent.startsWith("# ")) {
        headerLevel = 1;
        cleanHeaderContent = parsedContent.substring(2);
      }
    } else if (Array.isArray(parsedContent) && parsedContent.length > 0 && typeof parsedContent[0] === "string") {
      const firstStr = parsedContent[0];
      if (firstStr.startsWith("### ")) {
        headerLevel = 3;
        parsedContent[0] = firstStr.substring(4);
      } else if (firstStr.startsWith("## ")) {
        headerLevel = 2;
        parsedContent[0] = firstStr.substring(3);
      } else if (firstStr.startsWith("# ")) {
        headerLevel = 1;
        parsedContent[0] = firstStr.substring(2);
      }
    }

    // Render formatted block types accordingly
    if (headerLevel > 0) {
      return (
        <span key={idx} className="block font-bold text-blue-400 mt-2 mb-1.5 text-xs tracking-wide uppercase font-mono">
          {cleanHeaderContent}
        </span>
      );
    }

    if (isBulletItem) {
      return (
        <span key={idx} className="flex items-start gap-2 pl-2.5 my-1.5 leading-relaxed">
          <span className="text-blue-500 font-bold select-none text-[9px] mt-1">•</span>
          <span className="flex-1 text-[#e0e0e0] font-medium">{parsedContent}</span>
        </span>
      );
    }

    return (
      <span key={idx} className="block leading-relaxed my-0.5 text-[#e0e0e0] font-medium">
        {parsedContent}
      </span>
    );
  });
};

interface VoiceBotWidgetProps {
  activeProject: Project | null;
  onBookingDetected: (projectName: string) => void;
  onLeadAdded: () => void;
  onActionDetected?: (action: "finance" | "vastu" | "nri" | "loan_eligibility") => void;
}

export default function VoiceBotWidget({
  activeProject,
  onBookingDetected,
  onLeadAdded,
  onActionDetected,
}: VoiceBotWidgetProps) {
  const [engine, setEngine] = useState<AssistantEngine>("gemini_cloud");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "assistant",
      text: "Hello! I am your premium pre-sales luxury real estate advisor. You can talk to me directly by pressing the glowing mic below, or type your enquiry.",
      timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [localProg, setLocalProg] = useState(0);
  const [localLoaded, setLocalLoaded] = useState(false);
  const [activeChunks, setActiveChunks] = useState<string[]>([]);
  const [showRAGLogs, setShowRAGLogs] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Core callback when microphone records complete text
  const handleVoiceInput = (text: string) => {
    if (text && text.trim().length > 0) {
      sendMessage(text);
    }
  };

  // Connect Voice Synthesis & Recognition Hook
  const voiceEngine = useVoiceEngine(handleVoiceInput);

  // States for real-time lead telemetry and scoring
  const [leadReport, setLeadReport] = useState<{ score: number; triggers: string[] }>({ score: 0, triggers: [] });

  // Initialize Predictive WhatsApp Handoff hook with direct synthesis access
  const whatsappHandoff = useWhatsAppHandoff((text: string) => {
    voiceEngine.cancelSpeaking();
    voiceEngine.speak(text);
  });

  // Run lead intent scorer dynamically on user conversation history
  useEffect(() => {
    const userMessages = messages.filter(m => m.sender === "user");
    if (userMessages.length > 0) {
      // Concatenate last few user phrases to analyze compounding context
      const fullConversationContext = userMessages.slice(-3).map(m => m.text).join(" ");
      const report = analyzeLeadIntent(fullConversationContext);
      setLeadReport({ score: report.score, triggers: report.triggers });
    }
  }, [messages]);

  // Auto-scroll transcript list
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle Gemma GGUF Loading Simulation for Local Engine Option
  useEffect(() => {
    if (engine === "local_gguf" && !localLoaded) {
      const interval = setInterval(() => {
        setLocalProg((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setLocalLoaded(true);
            return 100;
          }
          return prev + Math.floor(Math.random() * 15) + 5;
        });
      }, 350);
      return () => clearInterval(interval);
    }
  }, [engine, localLoaded]);

  // Main response processing pipeline
  const sendMessage = async (text: string) => {
    if (!text || text.trim().length === 0) return;

    // Actively prime the audio engines on this direct click gesture BEFORE the async fetch
    voiceEngine.primeAudio();

    // Acknowledge User Message
    const userMsg: Message = {
      id: `msg_${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setLoading(true);

    // Stop listening during processing
    voiceEngine.stopListening();

    // STEP 3.5: Execute Actions and Booking trigger checks IMMEDIATELY on the client-side (zero latency, error-resilient)
    if (onActionDetected) {
      const userText = text.toLowerCase().trim();
      
      // Match explicit direct eligibility check words
      const isEligibilityRequest = 
        userText.includes("eligibility") || 
        userText.includes("eligible") ||
        userText.includes("loan limit") ||
        userText.includes("load eligibility") ||
        userText.includes("loan eligibility") ||
        userText.includes("eligibility check") ||
        userText.includes("cibil") ||
        userText.includes("credit score") ||
        userText.includes("అర్హత") || // Telugu for eligibility
        userText.includes("लोन पात्रता") || // Hindi for loan eligibility
        userText.includes("पात्रता");

      if (isEligibilityRequest) {
        onActionDetected("loan_eligibility");
      } else {
        const hasLaunchIntent = 
          userText.includes("take me") || 
          userText.includes("go to") || 
          userText.includes("navigate") || 
          userText.includes("open") || 
          userText.includes("show") || 
          userText.includes("launch") || 
          userText.includes("popup") || 
          userText.includes("pop-up") || 
          userText.includes("trigger") || 
          userText.includes("view") || 
          userText === "emi calculator" ||
          userText === "vastu compliance" ||
          userText === "nri fema guide" ||
          userText === "vastu compliance score" ||
          userText.includes("ఓపెన్") || 
          userText.includes("తీసుకెళ్ళు") || 
          userText.includes("తీసుకువెళ్ళు") || 
          userText.includes("చూపించు") || 
          userText.includes("खोलें") || 
          userText.includes("ओपन") || 
          userText.includes("दिखाएं") || 
          userText.includes("ले जाएं");

        if (hasLaunchIntent) {
          const isFinance = 
            userText.includes("emi") || 
            userText.includes("cfo") || 
            userText.includes("finance") || 
            userText.includes("interest") || 
            userText.includes("calculate") || 
            userText.includes("calculator") || 
            userText.includes("కిస్తీ") || 
            userText.includes("किस्त") || 
            userText.includes("ब्याज");
            
          const isVastu = 
            userText.includes("vastu") || 
            userText.includes("shastra") || 
            userText.includes("వాస్తు") || 
            userText.includes("దిశ") || 
            userText.includes("दिशा") || 
            userText.includes("वास्तु");
            
          const isNri = 
            userText.includes("nri") || 
            userText.includes("fema") || 
            userText.includes("foreign") || 
            userText.includes("abroad") || 
            userText.includes("repatriat") || 
            userText.includes("ఎన్‌ఆర్‌ఐ") || 
            userText.includes("एनआरआई");

          if (isFinance) {
            onActionDetected("finance");
          } else if (isVastu) {
            onActionDetected("vastu");
          } else if (isNri) {
            onActionDetected("nri");
          }
        }
      }
    }

    // Step 3.6: Instant Site visit schedule checking (from current query if explicit)
    const detectsBooking = isBookingIntent(text, false);
    if (detectsBooking && activeProject) {
      onBookingDetected(activeProject.name);
    }

    // STEP 4 Context Retrieval (Edge RAG matching)
    const contextChunks = await retrieveContext(text, activeProject?.id);
    setActiveChunks(contextChunks);

    // Inspect User Budget to Trigger Graceful Portfolio Cross-Sell / Pivot
    let parsedText = text;
    if (activeProject) {
      const budgetMatch = text.match(/(\d+(?:\.\d+)?)\s*(crores?|cr|lakhs?|l)/i);
      if (budgetMatch) {
        const val = parseFloat(budgetMatch[1]);
        const unit = budgetMatch[2].toLowerCase();
        let absoluteRupees = 0;
        if (unit.startsWith("c")) {
          absoluteRupees = val * 10000000;
        } else if (unit.startsWith("l")) {
          absoluteRupees = val * 100000;
        }

        // Get minimum project pricing configuration
        const minPrice = Math.min(...activeProject.unitConfigs.map(u => u.numericPriceMin));
        if (absoluteRupees < minPrice) {
          console.log(`⚠️ User budget limits (${val} ${unit}) below minimum configuration. Triggering Cross-Sell.`);
          parsedText = `${text} [PORTFOLIO_PIVOT_REQUIRED: True]`;
        }
      }
    }

    try {
      let finalResponseText = "";

      if (engine === "gemini_cloud") {
        // Query server endpoint proxying the Gemini SDK securely
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: parsedText,
            contextChunks,
            projectId: activeProject?.id,
            activeLanguage: voiceEngine.activeLanguage, // Pass the active language
            // Pass recent conversational context
            history: messages.slice(-4), 
          }),
        });

        const chatData = await response.json();
        if (chatData.error) {
          throw new Error(chatData.error);
        }
        finalResponseText = chatData.text;
      } else {
        // Simulate local Gemma WebGPU model running with offline fallbacks
        // Query Express rules endpoint representing Gemma WebGPU pipeline
        await new Promise((res) => setTimeout(res, 900)); // Gemma latency
        
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: parsedText,
            contextChunks,
            projectId: activeProject?.id,
            activeLanguage: voiceEngine.activeLanguage, // Pass the active language
          }),
        });
        const chatData = await response.json();
        finalResponseText = chatData.text;
      }

      // STEP 5: Apply Client-side pricing & RERA Guardrails on response text
      const filteredText = auditPreSalesOutput(finalResponseText, activeProject?.id);

      // Save assistant response
      const assistantMsg: Message = {
        id: `msg_${Date.now()}_ass`,
        sender: "assistant",
        text: filteredText,
        timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, assistantMsg]);

      // Speak final, verified response with deep try-catch safety to prevent bubble-up network errors
      try {
        voiceEngine.speak(filteredText);
      } catch (voiceSynthError) {
        console.warn("Muted main response speech warning:", voiceSynthError);
      }

      // Late check booking intents (if triggered by recommendations)
      const lastMsg = messages.length > 0 ? messages[messages.length - 1] : null;
      const previousAssistantResponseOffer = lastMsg &&
        lastMsg.sender === "assistant" &&
        (lastMsg.text.toLowerCase().includes("site visit") ||
         lastMsg.text.toLowerCase().includes("site tour") ||
         lastMsg.text.toLowerCase().includes("schedule a vip") ||
         lastMsg.text.toLowerCase().includes("coordinate a site"));

      const lateDetectsBooking = isBookingIntent(text, !!previousAssistantResponseOffer);
      if (lateDetectsBooking && activeProject) {
        onBookingDetected(activeProject.name);
      }

    } catch (err: any) {
      console.error(err);
      const errorMsg: Message = {
        id: `msg_${Date.now()}_err`,
        sender: "assistant",
        text: "I encountered a minor network synchronization issue. Kindly try asking that again.",
        timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
      try {
        voiceEngine.speak(errorMsg.text);
      } catch (errSpeak) {}
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") sendMessage(inputText);
  };

  const handleSuggestionClick = (phrase: string) => {
    sendMessage(phrase);
  };

  const cleanSuggestList = () => {
    if (!activeProject) {
      return [
        "Take me to EMI calculator",
        "Check Vastu Shastra compliance",
        "View NRI FEMA Guide",
      ];
    }
    return [
      `What are the configurations for ${activeProject.name}?`,
      `Is ${activeProject.name} RERA approved?`,
      "Take me to EMI calculator",
      "Check Vastu compliance score",
      "View NRI FEMA guide",
    ];
  };

  return (
    <div className="bg-[#0a0a0c] border border-[#1f1f23] rounded-xl flex flex-col h-[580px] overflow-hidden shadow-2xl relative">
      {/* Widget Header Controls */}
      <div className="bg-[#0d0d10] border-b border-[#1f1f23] p-4 shrink-0 flex items-center justify-between gap-4 select-none">
        <div>
          <div className="flex items-center gap-1.5 font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6] animate-pulse" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Acoustic Voice Engine // v1.8
            </h3>
          </div>
          <p className="text-[10px] text-[#666] mt-0.5 font-mono truncate">
            {activeProject 
              ? `TARGET_ID: REF_${activeProject.id.toUpperCase().replace('-', '_')}`
              : "READY // INITIATED PRE-SALES GRAPH_CONTEXT"}
          </p>
        </div>

        {/* Engine and Lang selector */}
        <div className="flex items-center gap-2">
          {/* Language Selection */}
          <select
            value={voiceEngine.activeLanguage}
            onChange={(e) => voiceEngine.setLanguage(e.target.value as any)}
            className="bg-[#111115] border border-[#1f1f23] text-[#888] font-mono text-[10px] px-2 py-1 rounded outline-none cursor-pointer hover:border-blue-500/30"
          >
            <option value="en-IN">ENG (IN)</option>
            <option value="hi-IN">HIN (हिन्दी)</option>
            <option value="bn-IN">BEN (বাংলা)</option>
            <option value="te-IN">TEL (తెలుగు)</option>
            <option value="mr-IN">MAR (मराठी)</option>
            <option value="ta-IN">TAM (தமிழ்)</option>
            <option value="kn-IN">KAN (ಕನ್ನಡ)</option>
            <option value="gu-IN">GUJ (ગુજરાતી)</option>
            <option value="ml-IN">MAL (മലയാളం)</option>
          </select>

          {/* Engine select button */}
          <div className="bg-[#111115] p-0.5 rounded border border-[#1f1f23] flex items-center">
            <button
              onClick={() => {
                setEngine("gemini_cloud");
                voiceEngine.cancelSpeaking();
              }}
              className={`p-1.5 rounded flex items-center gap-1 text-[10px] font-mono font-bold transition-all cursor-pointer ${
                engine === "gemini_cloud"
                  ? "bg-blue-600 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                  : "text-[#555] hover:text-[#888]"
              }`}
              title="Server-side Google Gemma 4 E2B Enterprise Model"
            >
              <Server className="w-3 h-3" />
              <span className="hidden sm:inline">GEMMA 4 E2B</span>
            </button>
            <button
              onClick={() => {
                setEngine("local_gguf");
                voiceEngine.cancelSpeaking();
              }}
              className={`p-1.5 rounded flex items-center gap-1 text-[10px] font-mono font-bold transition-all cursor-pointer ${
                engine === "local_gguf"
                  ? "bg-blue-600 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                  : "text-[#555] hover:text-[#888]"
              }`}
              title="Browser WebGPU Gemma 4 local"
            >
              <Cpu className="w-3 h-3" />
              <span className="hidden sm:inline">OFFLINE</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-Time Lead Scoring & WhatsApp Status Telemetry Strip */}
      <div className="bg-[#09090c] border-b border-[#1f1f23] px-4 py-2 flex items-center justify-between gap-2 shrink-0 select-none font-mono text-[10px]">
        <div className="flex items-center gap-2">
          <span className="text-[#666]">INTENT_SCORE:</span>
          <div className="w-16 bg-[#111115] border border-[#1f1f23] h-2 rounded overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${leadReport.score >= 90 ? "bg-amber-500 shadow-[0_0_8px_#f59e0b]" : leadReport.score >= 50 ? "bg-blue-500" : "bg-[#222]"}`}
              style={{ width: `${leadReport.score}%` }}
            />
          </div>
          <span className={`font-bold ${leadReport.score >= 90 ? "text-amber-400" : "text-blue-400"}`}>{leadReport.score}%</span>
          {leadReport.score >= 90 && (
            <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 px-1 py-0.2 rounded font-bold animate-pulse text-[8px]">
              🔥 HOT LEAD
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-[9.5px]">
          {whatsappHandoff.status.isSending ? (
            <span className="text-[#888] flex items-center gap-1.5 leading-none">
              <Loader2 className="w-2.5 h-2.5 animate-spin text-amber-500" />
              CRM_SYNC // WHATSAPP_DISPATCHING...
            </span>
          ) : whatsappHandoff.status.delivered ? (
            <span className="text-emerald-400 font-bold flex items-center gap-1 leading-none shadow-[0_0_8px_rgba(16,185,129,0.15)] bg-emerald-500/5 px-1.5 py-0.5 rounded border border-emerald-500/25">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block mr-1" />
              📬 WHATSAPP BROCHURE DISPATCHED
            </span>
          ) : (
            <span className="text-[#444] text-[9px] truncate max-w-[130px] sm:max-w-none">CRM_GATEWAY // DISPATCHREADY</span>
          )}
        </div>
      </div>

      {/* Engine Loading Bar for Local option */}
      {engine === "local_gguf" && !localLoaded && (
        <div className="bg-[#0d0d10] border-b border-[#1f1f23] p-3 flex flex-col gap-2 shrink-0 animate-pulse text-xs text-[#888]">
          <div className="flex items-center justify-between font-mono">
            <span className="font-semibold flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
              GMA4 // EXECUTING WEBGPU COMPILE SYSTEM...
            </span>
            <span className="font-bold text-blue-400">{localProg}%</span>
          </div>
          <div className="w-full bg-[#050506] rounded-full h-1 overflow-hidden">
            <div
              className="bg-blue-500 shadow-[0_0_8px_#3b82f6] h-full transition-all duration-300"
              style={{ width: `${localProg}%` }}
            />
          </div>
          <span className="text-[9px] text-[#555] font-mono">
            WEBGPU_ACCELERATION_FLAG: ACTIVE_FALLBACK
          </span>
        </div>
      )}

      {/* Transcript Scrolling Board */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded p-3 text-xs leading-relaxed flex flex-col space-y-1 relative group ${
                    isUser
                      ? "bg-blue-600/90 text-white border border-blue-500/20 rounded-tr-none shadow-[0_2px_12px_rgba(59,130,246,0.15)] font-semibold"
                      : "bg-[#111115] text-[#e0e0e0] border border-[#1f1f23] rounded-tl-none shadow-inner"
                  }`}
                >
                  {isUser ? (
                    <p className="leading-normal pr-6">{msg.text}</p>
                  ) : (
                    <div className="leading-normal pr-6 space-y-0.5">
                      {renderMessageText(msg.text)}
                    </div>
                  )}
                  
                  {!isUser && (
                    <button
                      onClick={() => {
                        voiceEngine.cancelSpeaking();
                        voiceEngine.speak(msg.text);
                      }}
                      className="absolute top-2.5 right-2 px-1 py-0.5 rounded bg-[#16161c] hover:bg-[#1f1f26] text-blue-400 hover:text-blue-300 transition-colors opacity-40 group-hover:opacity-100 cursor-pointer"
                      title="Replay voice response"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  
                  <div
                    className={`text-[9px] mt-1 font-mono flex items-center gap-1 ${
                      isUser ? "text-blue-200 justify-end" : "text-[#555]"
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <>
                        <span>•</span>
                        <span className="uppercase text-[8.5px] font-bold text-blue-400">
                          {engine === "gemini_cloud" ? "GEMMA_4_CLOUD" : "LOCAL_RULES_FALLBACK"}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#111115] border border-[#1f1f23] rounded p-3 flex items-center gap-2.5 text-xs text-[#888] font-mono">
              <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
              <span>COMPILING_VERBAL_RESPONSE_BUFFER...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* RAG Diagnostics Section */}
      {activeChunks.length > 0 && (
        <div className="mx-4 mb-2 p-2 bg-[#050506] border border-[#1f1f23] rounded shrink-0 select-none">
          <button
            onClick={() => setShowRAGLogs(!showRAGLogs)}
            className="w-full flex items-center justify-between text-[10px] text-blue-400 font-mono font-bold uppercase cursor-pointer"
          >
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              RAG_GROUNDING_CHUNKS ({activeChunks.length}_BLOB_SOURCES)
            </span>
            <span>{showRAGLogs ? "HIDE_LOGS" : "MATCH_LOGS.EXE"}</span>
          </button>
          
          {showRAGLogs && (
            <div className="mt-2 text-[9.5px] text-[#666] font-mono space-y-1.5 max-h-[100px] overflow-y-auto pt-1.5 border-t border-[#1f1f23] leading-normal scrollbar-thin">
              {activeChunks.map((chunk, index) => (
                <div key={index} className="p-1 border-b border-[#1f1f23] pb-1">
                  <span className="text-blue-500 font-semibold">[SOURCE_{index + 1}]:</span> {chunk}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Floating suggestion box */}
      <div className="px-4 pb-2 flex items-center gap-1.5 overflow-x-auto select-none shrink-0 scrollbar-none">
        {cleanSuggestList().map((phrase, idx) => (
          <button
            key={idx}
            onClick={() => handleSuggestionClick(phrase)}
            className="px-2.5 py-1.5 bg-[#111115] hover:bg-[#16161c] border border-[#1f1f23] text-blue-400 hover:text-blue-300 rounded text-[10px] font-mono font-semibold shrink-0 transition-colors shadow-inner cursor-pointer"
          >
             &gt; {phrase}
          </button>
        ))}
      </div>

      {/* Bottom Speech Bar Controller */}
      <div className="bg-[#0d0d10] border-t border-[#1f1f23] p-4 shrink-0 flex items-center gap-3">
        {/* Glowing Voice Orb Microphone trigger */}
        <div className="relative group">
          {/* Expanding Pulsing Radial Background active only on listening/speaking */}
          {(voiceEngine.isListening || voiceEngine.isSpeaking) && (
            <div
              className={`absolute inset-[-6px] rounded-full blur-md opacity-70 animate-ping duration-1500 ${
                voiceEngine.isListening ? "bg-blue-500" : "bg-emerald-500"
              }`}
            />
          )}

          <button
            onClick={() => {
              if (voiceEngine.isListening) {
                voiceEngine.stopListening();
              } else {
                voiceEngine.startListening();
              }
            }}
            className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 relative z-10 cursor-pointer ${
              voiceEngine.isListening
                ? "bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_#3b82f6]"
                : voiceEngine.isSpeaking
                ? "bg-emerald-500 border-emerald-400 text-slate-950"
                : "bg-[#050506] hover:bg-[#111115] border-[#1f1f23] hover:border-blue-500/30 text-[#888] hover:text-[#ccc]"
            }`}
            title={voiceEngine.isListening ? "Listening... Click to stop." : "Activate voice microphone loop"}
          >
            {voiceEngine.isListening ? (
              <Square className="w-5 h-5 fill-white text-white animate-pulse" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Text Input area fallback */}
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder={
              voiceEngine.isListening 
                ? "Listening... audio streams dynamically..." 
                : "Ask properties enquiries..."
            }
            value={inputText}
            disabled={voiceEngine.isListening}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full bg-[#050506] border border-[#1f1f23] focus:border-blue-500/50 rounded py-3 pl-4 pr-12 text-xs text-[#e0e0e0] disabled:opacity-50 outline-none font-mono transition-colors shadow-inner"
          />

          <button
            onClick={() => sendMessage(inputText)}
            disabled={!inputText.trim() || voiceEngine.isListening}
            className="p-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-[#111115] text-white disabled:text-[#555] rounded absolute right-1.5 top-1.5 transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Call Volume cancel controls */}
        {voiceEngine.isSpeaking && (
          <button
            onClick={() => voiceEngine.cancelSpeaking()}
            className="p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded transition-all cursor-pointer shadow-lg"
            title="Mute bot voice (Barge-in)"
          >
            <VolumeX className="w-4 h-4 animate-bounce" />
          </button>
        )}
      </div>

      {/* Warning if WebSpeech API is not fully supported in this browser */}
      {!voiceEngine.isSupported && (
        <div className="absolute inset-x-0 top-0 bg-blue-500/5 bg-opacity-95 backdrop-blur-md p-2 flex items-center gap-1.5 border-b border-blue-500/20 text-[9.5px] text-blue-400 font-mono z-50">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></div>
          <span>API_FLAG: WEBSPEECH_MUTED_IN_IFRAME // TEXT_PORTAL_STABLE</span>
        </div>
      )}
    </div>
  );
}
