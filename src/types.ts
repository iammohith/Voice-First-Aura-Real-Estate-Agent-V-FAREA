/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UnitConfig {
  type: string;          // e.g., "2 BHK Luxury", "3 BHK Premium"
  carpetArea: string;    // e.g., "820 sq.ft.", "1150 sq.ft."
  priceRange: string;    // e.g., "₹1.20 Cr - ₹1.35 Cr", "₹1.75 Cr - ₹1.95 Cr"
  numericPriceMin: number; // in Lakhs/Crores for guardrail check, e.g. 1.2 * 10000000
  numericPriceMax: number;
  availability: "Available" | "Last Few Units" | "Sold Out";
}

export interface Project {
  id: string;
  name: string;
  developer: string;
  location: string;
  subLocation: string; // e.g. "Whitefield", "Gurugram Sector 65"
  reraId: string;      // RERA registration number
  totalAcres: string;
  possessionDate: string;
  amenities: string[];
  unitConfigs: UnitConfig[];
  description: string;
  highlights: string[];
  image: string;       // Generated or placeholder hero banner
}

export interface BookingSession {
  id: string;
  name: string;
  phone: string;
  email: string;
  projectId: string;
  projectName: string;
  preferredDate: string;
  preferredTime: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

export interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  isVoiceInput?: boolean;
  isRerouteDisclaimer?: boolean;
  chunks?: string[]; // retrieved RAG fragments
}

export type AssistantEngine = "gemini_cloud" | "local_gguf";

export interface SpeechEngineState {
  micPermission: "prompt" | "granted" | "denied";
  isListening: boolean;
  isSpeaking: boolean;
  activeLanguage: "en-IN" | "hi-IN"; // English (Indian) or Hindi
  selectedEngine: AssistantEngine;
  localGgufLoadingProgress: number; // 0 - 100
  localGgufLoaded: boolean;
  conversationalFillerActive: boolean;
}
