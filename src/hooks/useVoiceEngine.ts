/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";

// Declaring speech recognition interfaces for TypeScript compiler safety
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onaudiostart: (() => void) | null;
  onsoundstart: (() => void) | null;
  onspeechstart: (() => void) | null;
  onspeechend: (() => void) | null;
  onsoundend: (() => void) | null;
  onaudioend: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onnomatch: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

// Global declaration
declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export type IndianLanguageCode = "en-IN" | "hi-IN" | "bn-IN" | "te-IN" | "mr-IN" | "ta-IN" | "kn-IN" | "gu-IN" | "ml-IN";

export interface VoiceEngine {
  isSupported: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  micPermission: "prompt" | "granted" | "denied";
  activeLanguage: IndianLanguageCode;
  setLanguage: (lang: IndianLanguageCode) => void;
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string, onEndCallback?: () => void) => void;
  cancelSpeaking: () => void;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  setSelectedVoice: (voice: SpeechSynthesisVoice) => void;
}

export function useVoiceEngine(
  onSpeechResult: (text: string) => void,
  onSpeechEnd?: () => void
): VoiceEngine {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [micPermission, setMicPermission] = useState<"prompt" | "granted" | "denied">("prompt");
  const [activeLanguage, setActiveLanguage] = useState<IndianLanguageCode>("en-IN");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const speakTimeoutRef = useRef<number | null>(null);

  // Initialize Speech Synthesis Voices
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      setVoices(allVoices);

      // Prefer Indian English voice "en-IN", or secondarily a polished standard English female voice
      const indVoice = allVoices.find(
        (v) => v.lang.includes("en-IN") || v.name.toLowerCase().includes("india") || v.name.toLowerCase().includes("heera")
      );
      const enVoice = allVoices.find(
        (v) => v.lang.startsWith("en-") && (v.name.toLowerCase().includes("google") || v.name.toLowerCase().includes("natural"))
      );
      
      setSelectedVoice(indVoice || enVoice || allVoices[0] || null);
    };

    loadVoices();
    if (typeof window.speechSynthesis.addEventListener === "function") {
      window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    } else {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (typeof window.speechSynthesis.removeEventListener === "function") {
        window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      }
    };
  }, []);

  // Check microphone permissions
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices) return;

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        setMicPermission("granted");
        // Release stream right away to prevent recording indicator staying active
        stream.getTracks().forEach((track) => track.stop());
      })
      .catch((err) => {
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          setMicPermission("denied");
        } else {
          setMicPermission("prompt");
        }
      });
  }, []);

  // Setup local speech recognizer
  const initRecognition = () => {
    const SpeechConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechConstructor) return null;

    const recognizer = new SpeechConstructor();
    recognizer.continuous = false;
    recognizer.interimResults = false;
    recognizer.lang = activeLanguage;
    recognizer.maxAlternatives = 1;

    recognizer.onstart = () => {
      setIsListening(true);
      setTranscript("");
    };

    recognizer.onend = () => {
      setIsListening(false);
      if (onSpeechEnd) onSpeechEnd();
    };

    recognizer.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[0]?.[0];
      if (result) {
        const text = result.transcript;
        setTranscript(text);
        onSpeechResult(text);
      }
    };

    recognizer.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("STT Engine Error:", event.error, event.message);
      setIsListening(false);
      if (event.error === "not-allowed") {
        setMicPermission("denied");
      }
    };

    return recognizer;
  };

  // Re-init recognizer and auto-select matching voice when active language selection modifies
  useEffect(() => {
    // 1. Re-initialize STT
    const wasListening = isListening;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
    }
    recognitionRef.current = initRecognition();
    if (wasListening && recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {}
    }
    
    // 2. Select matching TTS Voice for active language
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const allVoices = window.speechSynthesis.getVoices();
      if (allVoices.length > 0) {
        const langPrefix = activeLanguage.split("-")[0].toLowerCase();
        // Look for exact locale (e.g. hi-IN) or same language prefix (e.g. hi)
        let bestVoice = allVoices.find(
          (v) => v.lang.toLowerCase().replace("_", "-") === activeLanguage.toLowerCase()
        );
        if (!bestVoice) {
          bestVoice = allVoices.find((v) => v.lang.toLowerCase().startsWith(langPrefix));
        }
        
        // Custom search terms for specific Indian language names
        if (!bestVoice) {
          const searchTerms: Record<string, string[]> = {
            "hi": ["hindi", "kalpana", "heera", "india"],
            "te": ["telugu", "india"],
            "ta": ["tamil", "india"],
            "bn": ["bengali", "bangla", "india"],
            "mr": ["marathi", "india"],
            "kn": ["kannada", "india"],
            "gu": ["gujarati", "india"],
            "ml": ["malayalam", "india"],
            "en": ["india", "heera"]
          };
          const terms = searchTerms[langPrefix] || [];
          bestVoice = allVoices.find((v) => 
            terms.some(term => v.name.toLowerCase().includes(term))
          );
        }

        if (bestVoice) {
          setSelectedVoice(bestVoice);
        }
      }
    }
  }, [activeLanguage, voices]);

  const startListening = () => {
    if (isSpeaking) {
      cancelSpeaking(); // Barge-in behavior: stop assistant immediately when user speaks!
    }

    if (!recognitionRef.current) {
      recognitionRef.current = initRecognition();
    }

    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("STT Start Error, reinitialising:", e);
        recognitionRef.current = initRecognition();
        recognitionRef.current?.start();
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        recognitionRef.current.abort();
      }
    }
  };

  // Text-To-Speech function
  const speak = (text: string, onEndCallback?: () => void) => {
    try {
      if (typeof window === "undefined" || !window.speechSynthesis) return;

      if (speakTimeoutRef.current) {
        window.clearTimeout(speakTimeoutRef.current);
        speakTimeoutRef.current = null;
      }

      // Direct speech stop first to prevent overlapping issues
      window.speechSynthesis.cancel();
      setIsSpeaking(false);

      if (!text || text.trim().length === 0) return;

      // Strip out typical markdown or RERA/asterisk highlights
      const cleanText = text
        .replace(/\*{1,2}/g, "") // remove bold highlights
        .replace(/RERA ID[:\- ]?/gi, "RERA Registration number")
        .replace(/₹/g, "Rupees ")
        .replace(/\(OC\)/gi, "Occupancy Certificate");

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utteranceRef.current = utterance;

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      // Configure natural speeds and heights
      utterance.rate = 0.95; 
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        if (onEndCallback) onEndCallback();
      };

      utterance.onerror = (e) => {
        console.error("TTS Stream Error:", e);
        setIsSpeaking(false);
        if (onEndCallback) onEndCallback();
      };

      // Resuming synthesis before speaking is a vital mobile Safari / Chrome patch
      try {
        window.speechSynthesis.resume();
      } catch (resumeError) {
        console.warn("SpeechSynthesis resume warning:", resumeError);
      }

      // Execute speak inside a small timeout so that the asynchronous cancel operation
      // completes on the browser's speech thread before we enqueue the new utterance.
      speakTimeoutRef.current = window.setTimeout(() => {
        try {
          window.speechSynthesis.speak(utterance);
        } catch (speakErr) {
          console.error("Delayed speak call failure:", speakErr);
          setIsSpeaking(false);
        }
      }, 60);

    } catch (error) {
      console.error("🚨 Bulletproof TTS speech synthesis failure shielded:", error);
      setIsSpeaking(false);
      if (onEndCallback) onEndCallback();
    }
  };

  const cancelSpeaking = () => {
    if (speakTimeoutRef.current) {
      window.clearTimeout(speakTimeoutRef.current);
      speakTimeoutRef.current = null;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const isSupported = typeof window !== "undefined" && 
                     !!(window.SpeechRecognition || window.webkitSpeechRecognition) && 
                     !!window.speechSynthesis;

  const setLanguage = (lang: IndianLanguageCode) => {
    setActiveLanguage(lang);
  };

  return {
    isSupported,
    isListening,
    isSpeaking,
    transcript,
    micPermission,
    activeLanguage,
    setLanguage,
    startListening,
    stopListening,
    speak,
    cancelSpeaking,
    voices,
    selectedVoice,
    setSelectedVoice,
  };
}
