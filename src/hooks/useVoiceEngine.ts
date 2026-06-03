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

/**
 * Explicit high-fidelity prebuilt neural voice profile mapping for Gemini TTS (server-side synchronous)
 */
export const neuralVoiceProfiles: Record<IndianLanguageCode, string> = {
  "en-IN": "Kore",     // Polished, highly clear English (warm feminine)
  "hi-IN": "Kore",     // Soft, incredibly natural Hindi flow (warm feminine)
  "te-IN": "Zephyr",   // Vibrant, distinct Telugu articulation (clear feminine)
  "ta-IN": "Zephyr",   // High clarity, crisp Tamil representation (clear feminine)
  "mr-IN": "Puck",     // Energetic and rhythmic Marathi delivery (warm masculine)
  "bn-IN": "Puck",     // Warm, pleasant Bengali tone (warm masculine)
  "kn-IN": "Charon",   // Deep, resonance-rich Kannada posture (deep masculine)
  "gu-IN": "Fenrir",   // Clear, bright Gujarati presentation (bright masculine)
  "ml-IN": "Charon"    // Flowing, professional Malayalam tone (deep masculine)
};

/**
 * Highly optimized, slice-based base64-to-blob converter.
 * This completely avoids main-thread freezes or stack overflow errors by processing
 * base64 content in memory-friendly blocks of 1024 bytes.
 * Handles prepended data-uris, spaces, line breaks, and incorrect padding gracefully.
 */
export function convertBase64ToBlob(base64: string, mimeType: string): Blob {
  try {
    if (!base64) {
      throw new Error("Empty base64 string provided.");
    }

    // 1. Resolve potential data-uri prefix (e.g. data:audio/mp3;base64,...)
    let rawBase64 = base64;
    if (rawBase64.includes(",")) {
      rawBase64 = rawBase64.split(",")[1];
    }

    // 2. Clear all whitespaces, line-breaks, and non-base64 indices
    let cleanedBase64 = rawBase64.replace(/[^A-Za-z0-9+/=]/g, "");

    // 3. Rectify padding alignment
    while (cleanedBase64.length % 4 !== 0) {
      cleanedBase64 += "=";
    }

    const byteCharacters = window.atob(cleanedBase64);
    const byteArrays: Uint8Array[] = [];
    const sliceSize = 1024; // Highly optimal slice block size
    
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    
    return new Blob(byteArrays, { type: mimeType });
  } catch (error) {
    console.error("💥 convertBase64ToBlob decoding exception, executing fallback array buffer strategy:", error);
    try {
      const sanitized = base64.replace(/\s/g, "");
      const binaryString = window.atob(sanitized.includes(",") ? sanitized.split(",")[1] : sanitized);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return new Blob([bytes], { type: mimeType });
    } catch (fallbackErr) {
      console.error("💥 Bulletproof base64 fallback conversion also failed:", fallbackErr);
      return new Blob([], { type: mimeType });
    }
  }
}

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
  primeAudio: () => void;
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
  const audioRef = useRef<HTMLAudioElement | null>(
    typeof window !== "undefined" ? new Audio() : null
  );
  const activeAudioUrlRef = useRef<string | null>(null);

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
    
    // 2. Select matching high-fidelity local TTS Voice for the active regional language
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const allVoices = window.speechSynthesis.getVoices();
      if (allVoices.length > 0) {
        const langPrefix = activeLanguage.split("-")[0].toLowerCase();
        
        // Exact locale search (e.g. "te-IN", "hi-IN", etc.)
        let bestVoice = allVoices.find(
          (v) => v.lang.toLowerCase().replace("_", "-") === activeLanguage.toLowerCase()
        );
        
        // If not found, fall back to same language prefix search
        if (!bestVoice) {
          bestVoice = allVoices.find((v) => v.lang.toLowerCase().startsWith(langPrefix));
        }
        
        // Custom search terms mapping languages to high-fidelity regional voice profiles/names
        const searchTerms: Record<string, string[]> = {
          "hi": ["kalpana", "hindi", "heera", "google", "india"],
          "te": ["telugu", "india", "google"],
          "ta": ["tamil", "india", "google"],
          "bn": ["bengali", "bangla", "india", "google"],
          "mr": ["marathi", "india", "google"],
          "kn": ["kannada", "india", "google"],
          "gu": ["gujarati", "india", "google"],
          "ml": ["malayalam", "india", "google"],
          "en": ["heera", "india", "en-in", "google", "natural"]
        };

        if (!bestVoice) {
          const terms = searchTerms[langPrefix] || [];
          bestVoice = allVoices.find((v) => 
            terms.some(term => v.name.toLowerCase().includes(term))
          );
        }

        // Final fallback: any voice containing 'india' or matching the language prefix
        if (!bestVoice) {
          bestVoice = allVoices.find((v) => v.name.toLowerCase().includes("india"));
        }

        if (bestVoice) {
          console.log(`🎙️ Voice Engine: Activating high-fidelity local voice profile [${bestVoice.name}] for language [${activeLanguage}]`);
          setSelectedVoice(bestVoice);
        } else {
          console.warn(`⚠️ Voice Engine: No high-fidelity custom local voice found for [${activeLanguage}], defaulting to platform voice selection.`);
        }
      }
    }
  }, [activeLanguage, voices]);

  // Synchronous user-gesture audio priming to pre-authorize browser audio engines
  const primeAudio = () => {
    try {
      if (typeof window === "undefined") return;
      
      console.log("🔊 Actively priming browser audio engines on user gesture...");

      // 1. Prime SpeechSynthesis (Safari/iOS voice wakeup)
      if (window.speechSynthesis) {
        try {
          window.speechSynthesis.resume();
          // Active silent utterance play to pre-authorize and warm up iOS speechSynthesis threads
          const silentUtterance = new SpeechSynthesisUtterance(" ");
          silentUtterance.volume = 0;
          silentUtterance.rate = 1.0;
          window.speechSynthesis.speak(silentUtterance);
        } catch (e) {
          console.warn("SpeechSynthesis silent speech priming skipped:", e);
        }
      }

      // 2. Prime HTMLAudioElement (reusing our persistent audioRef)
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      const audio = audioRef.current;
      
      // Revoke old URL if existing to prevent memory bloat
      if (activeAudioUrlRef.current) {
        try {
          URL.revokeObjectURL(activeAudioUrlRef.current);
        } catch (e) {}
        activeAudioUrlRef.current = null;
      }

      // Use a standard, universally supported 1-second silent MP3 base64 string
      audio.src = "data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGFtZTMuOThyAhgAAAAAAAAAInRleHQAAAAOAAADbWluZHRoZXNoaXNoAAAAAEluZm8AAAAPAAAAAgAAAAYAAC8vLy8vLy8vLy8vLy8vLy8vLy9GcmFtZf8QYAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAgAAAH8AAAD8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABMYW1lMy45OHL/EGAAAAAAAAAAAAAAAAAAAAAAAAAALgAAAAAAAAAAAgAAAH8AAAD8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABMYW1lMy45OHL/EGAAAAAAAAAAAAAAAAAAAAAAAAAALgAAAAAAAAAAAgAAAH8AAAD8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABMYW1lMy45OHI=";
      
      audio.load();
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          audio.pause();
          console.log("🔊 Persistent HTMLAudioElement primed and validated.");
        }).catch((e) => {
          console.warn("Silent audio preload priming skipped/failed:", e);
        });
      }

      // 3. Prime Web Audio Context to unblock any browser engine restrictions and persist state in window
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        let tempCtx = (window as any)._primedAudioContext as AudioContext | null;
        if (!tempCtx || tempCtx.state === "closed") {
          tempCtx = new AudioCtx();
          (window as any)._primedAudioContext = tempCtx;
        }
        
        if (tempCtx.state === "suspended") {
          tempCtx.resume().then(() => {
            try {
              // Warm up with hardware silent buffer play to pre-authorize mixer threads
              const buffer = tempCtx!.createBuffer(1, 24000, 24000); // 1-second silent buffer
              const source = tempCtx!.createBufferSource();
              source.buffer = buffer;
              source.connect(tempCtx!.destination);
              source.start(0);
              console.log("🔊 Persistent Web AudioContext unblocked, running and cached with hardware silent buffer.");
            } catch (bufErr) {
              console.warn("Silent buffer generation failed during context resume:", bufErr);
            }
          }).catch((err) => {
            console.warn("Failed to resume cached AudioContext:", err);
          });
        } else {
          // Already running, play silent buffer anyway to keep hardware channels primed and warm
          try {
            const buffer = tempCtx.createBuffer(1, 12000, 24000); // 0.5-second silent buffer
            const source = tempCtx.createBufferSource();
            source.buffer = buffer;
            source.connect(tempCtx.destination);
            source.start(0);
          } catch (e) {}
        }
      }
    } catch (e) {
      console.warn("Audio priming engine caught error:", e);
    }
  };

  // Aggressively prime audio on very first user interaction anywhere on the document
  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    let primed = false;
    const handleGesture = () => {
      if (primed) return;
      primed = true;
      console.log("🔥 Aggressive document-level gesture captured! Priming audio...");
      primeAudio();
      
      // Clean up event listeners after first interaction
      events.forEach((evt) => {
        document.removeEventListener(evt, handleGesture, { capture: true });
      });
    };

    const events = ["click", "touchstart", "keydown", "mousedown"];
    events.forEach((evt) => {
      document.addEventListener(evt, handleGesture, { once: true, passive: true, capture: true });
    });

    return () => {
      events.forEach((evt) => {
        document.removeEventListener(evt, handleGesture, { capture: true });
      });
    };
  }, []);

  const startListening = () => {
    primeAudio(); // Priming triggers directly on user-initiated microphone click!

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

  // Local standard window.speechSynthesis fallback
  const speakLocalFallback = (cleanText: string, onEndCallback?: () => void) => {
    try {
      if (typeof window === "undefined" || !window.speechSynthesis) {
        setIsSpeaking(false);
        if (onEndCallback) onEndCallback();
        return;
      }

      // Explicitly configure correct ISO code locale on standard utterance
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = activeLanguage; 
      
      // Essential Chrome Garbage Collection fix - anchor it to a persistent window reference
      (window as any)._activeUtterance = utterance;
      utteranceRef.current = utterance;

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      utterance.rate = 0.95; 
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        (window as any)._activeUtterance = null;
        if (onEndCallback) onEndCallback();
      };

      utterance.onerror = (e) => {
        console.error("Local TTS Stream Error:", e);
        setIsSpeaking(false);
        (window as any)._activeUtterance = null;
        if (onEndCallback) onEndCallback();
      };

      try {
        window.speechSynthesis.resume();
      } catch (resumeError) {
        console.warn("Local SpeechSynthesis resume warning:", resumeError);
      }

      speakTimeoutRef.current = window.setTimeout(() => {
        try {
          window.speechSynthesis.speak(utterance);
        } catch (speakErr) {
          console.error("Delayed speak call failure:", speakErr);
          setIsSpeaking(false);
        }
      }, 60);
    } catch (e) {
      console.error("Local SpeechSynthesis fail:", e);
      setIsSpeaking(false);
      if (onEndCallback) onEndCallback();
    }
  };

  // Main Text-To-Speech function utilizing high fidelity server-side AI voice proxy with local fallbacks
  // Main Text-To-Speech function utilizing high fidelity server-side AI voice proxy with dual-engine browser play and local fallbacks
  const speak = async (text: string, onEndCallback?: () => void) => {
    try {
      if (typeof window === "undefined") return;

      // Ensure audio and synthesizers are synchronously primed on the current gesture execution path
      primeAudio();

      if (speakTimeoutRef.current) {
        window.clearTimeout(speakTimeoutRef.current);
        speakTimeoutRef.current = null;
      }

      // Direct speech stop first so we don't conflict
      if (window.speechSynthesis && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      
      // Pause any preceding server-side audio player stream
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.onended = null;
          audioRef.current.onerror = null;
        } catch (e) {}
      }

      // Stop any preceding Web Audio context playback stream
      if ((window as any)._activeAudioContextSource) {
        try {
          (window as any)._activeAudioContextSource.stop();
        } catch (e) {}
        (window as any)._activeAudioContextSource = null;
      }

      setIsSpeaking(false);

      if (!text || text.trim().length === 0) return;

      // Clean typical formatting out to be highly narratable
      const cleanText = text
        .replace(/\*{1,2}/g, "") // remove bold asterisks
        .replace(/RERA ID[:\- ]?/gi, "RERA Registration number")
        .replace(/₹/g, "Rupees ")
        .replace(/\(OC\)/gi, "Occupancy Certificate")
        .replace(/\#+/g, "") // remove hashes
        .replace(/`+/g, "") // remove backticks
        .trim();

      setIsSpeaking(true);

      // Attempt high fidelity server-side neural TTS proxy
      try {
        const mappedNeuralVoice = neuralVoiceProfiles[activeLanguage] || "Kore";
        console.log(`🎙️ Client Voice Engine: Requesting high-fidelity server-side neural voice profile [${mappedNeuralVoice}] for active language [${activeLanguage}]`);
        
        const response = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: cleanText, language: activeLanguage })
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data && data.audio) {
            const detectedMimeType = data.mimeType || "audio/mpeg";
            
            // Stable, memory-slice optimized Base64 conversion to Blob (handled cleanly by our self-healing converter)
            const audioBlob = convertBase64ToBlob(data.audio, detectedMimeType);
            const audioUrl = URL.createObjectURL(audioBlob);
            
            // Revoke prior active blob URL to prevent browser memory leaks
            if (activeAudioUrlRef.current) {
              try {
                URL.revokeObjectURL(activeAudioUrlRef.current);
              } catch (e) {}
            }
            activeAudioUrlRef.current = audioUrl;

            // Dual playback control flow
            let playedViaWebAudio = false;

            const playViaWebAudioContext = async () => {
              try {
                const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
                if (!AudioCtx) throw new Error("Web Audio not supported");

                let ctx = (window as any)._primedAudioContext;
                if (!ctx || ctx.state === "closed") {
                  ctx = new AudioCtx();
                  (window as any)._primedAudioContext = ctx;
                }
                
                if (ctx.state === "suspended") {
                  await ctx.resume();
                }

                // Decode audio data safely utilizing the native arrayBuffer from our stable Blob
                const arrayBuf = await audioBlob.arrayBuffer();

                // Advanced double-fallback decoder wrapper supporting standard and older callback-style Web Audio implementations
                const decodeAudioDataPromise = (context: BaseAudioContext, buffer: ArrayBuffer): Promise<AudioBuffer> => {
                  return new Promise((resolve, reject) => {
                    try {
                      const promise = context.decodeAudioData(
                        buffer,
                        (decoded) => resolve(decoded),
                        (err) => reject(err)
                      );
                      if (promise && typeof promise.then === "function") {
                        promise.catch(reject);
                      }
                    } catch (err) {
                      reject(err);
                    }
                  });
                };

                const decodedBuffer = await decodeAudioDataPromise(ctx, arrayBuf.slice(0));
                
                if ((window as any)._activeAudioContextSource) {
                  try {
                    (window as any)._activeAudioContextSource.stop();
                  } catch (e) {}
                }

                const source = ctx.createBufferSource();
                source.buffer = decodedBuffer;
                source.connect(ctx.destination);
                
                (window as any)._activeAudioContextSource = source;
                
                source.onended = () => {
                  if ((window as any)._activeAudioContextSource === source) {
                    setIsSpeaking(false);
                    (window as any)._activeAudioContextSource = null;
                    if (onEndCallback) onEndCallback();
                  }
                };

                setIsSpeaking(true);
                source.start(0);
                playedViaWebAudio = true;
                console.log("🔊 Low-latency neural TTS playback succeeded via Web Audio Context stable path.");
                return true;
              } catch (webAudioErr) {
                console.error("Web Audio fallback playback failed too:", webAudioErr);
                return false;
              }
            };

            // CRITICAL: Reuse the prebuilt, pre-primed HTMLAudioElement.
            // Creating a 'new Audio()' inside an async callback is blocked by iOS/Safari autoplay rules.
            // Re-using a primed instance of Audio bypasses these limitations completely.
            if (!audioRef.current) {
              audioRef.current = new Audio();
            }
            
            const audio = audioRef.current;
            audio.src = audioUrl;
            audio.load(); // Force browser engine reload and media state transition immediately
            
            audio.onended = () => {
              setIsSpeaking(false);
              audio.onended = null;
              audio.onerror = null;
              if (activeAudioUrlRef.current) {
                try {
                  URL.revokeObjectURL(activeAudioUrlRef.current);
                } catch (e) {}
                activeAudioUrlRef.current = null;
              }
              if (onEndCallback) onEndCallback();
            };
            
            audio.onerror = async (e) => {
              console.warn("HTMLAudioElement playback failed. Transitioning immediately to low-latency Web Audio Context fallback...", e);
              audio.onended = null;
              audio.onerror = null;
              if (activeAudioUrlRef.current) {
                try {
                  URL.revokeObjectURL(activeAudioUrlRef.current);
                } catch (err) {}
                activeAudioUrlRef.current = null;
              }
              const succeeded = await playViaWebAudioContext();
              if (!succeeded) {
                speakLocalFallback(cleanText, onEndCallback);
              }
            };
            
            try {
              await audio.play();
              console.log("🔊 Neural TTS playback succeeded via primed HTMLAudioElement.");
              return; // Successfully played neural output!
            } catch (playErr) {
              console.warn("Autoplay was blocked or failed, falling back locally:", playErr);
              audio.onended = null;
              audio.onerror = null;
              if (activeAudioUrlRef.current) {
                try {
                  URL.revokeObjectURL(activeAudioUrlRef.current);
                } catch (err) {}
                activeAudioUrlRef.current = null;
              }
              const succeeded = await playViaWebAudioContext();
              if (!succeeded) {
                speakLocalFallback(cleanText, onEndCallback);
              }
              return;
            }
          }
        }
      } catch (srvTtsErr) {
        console.warn("Failed to complete server-side neural voice generation, falling back locally:", srvTtsErr);
      }

      // Local standard fallback
      speakLocalFallback(cleanText, onEndCallback);

    } catch (error) {
      console.error("🚨 Bulletproof TTS speech synthesis failure shielded:", error);
      setIsSpeaking(false);
      if (onEndCallback) onEndCallback();
    }
  };

  // Periodic resume during long speak durations to prevent Chrome SpeechSynthesis silent stalling
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    
    let intervalId: any = null;
    // Only engage standard browser resume if we are not currently playing a server stream (holding a blob source)
    const isPlayingServerAudio = (audioRef.current && audioRef.current.src && audioRef.current.src.startsWith("blob:")) ||
                                 (window as any)._activeAudioContextSource;
    if (isSpeaking && !isPlayingServerAudio) {
      intervalId = window.setInterval(() => {
        try {
          if (window.speechSynthesis && window.speechSynthesis.speaking) {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
          }
        } catch (e) {
          console.warn("Safari/Chrome voice heartbeat resume caught:", e);
        }
      }, 4000);
    }
    return () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [isSpeaking]);

  const cancelSpeaking = () => {
    if (speakTimeoutRef.current) {
      window.clearTimeout(speakTimeoutRef.current);
      speakTimeoutRef.current = null;
    }
    
    // Stop server-side audio player stream first
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.onended = null;
        audioRef.current.onerror = null;
        // Do NOT nullify audioRef.current to keep the gesture-primed Audio instance alive
        // Load the silent MP3 payload to cleanly reset state and unblock future playback
        audioRef.current.src = "data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGFtZTMuOThyAhgAAAAAAAAAInRleHQAAAAOAAADbWluZHRoZXNoaXNoAAAAAEluZm8AAAAPAAAAAgAAAAYAAC8vLy8vLy8vLy8vLy8vLy8vLy9GcmFtZf8QYAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAgAAAH8AAAD8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABMYW1lMy45OHL/EGAAAAAAAAAAAAAAAAAAAAAAAAAALgAAAAAAAAAAAgAAAH8AAAD8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABMYW1lMy45OHL/EGAAAAAAAAAAAAAAAAAAAAAAAAAALgAAAAAAAAAAAgAAAH8AAAD8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABMYW1lMy45OHI=";
      } catch (e) {}
    }

    if (activeAudioUrlRef.current) {
      try {
        URL.revokeObjectURL(activeAudioUrlRef.current);
      } catch (e) {}
      activeAudioUrlRef.current = null;
    }

    // Stop and dereference active Web Audio Context sources
    if ((window as any)._activeAudioContextSource) {
      try {
        (window as any)._activeAudioContextSource.stop();
      } catch (e) {}
      (window as any)._activeAudioContextSource = null;
    }

    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      (window as any)._activeUtterance = null;
    }
    setIsSpeaking(false);
  };

  const isSupported = typeof window !== "undefined" && 
                     (!!(window.SpeechRecognition || window.webkitSpeechRecognition) || 
                      !!window.speechSynthesis);

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
    primeAudio,
  };
}
