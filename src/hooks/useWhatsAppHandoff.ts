/**
 * useWhatsAppHandoff.ts
 * Listens for client-side LeadHot events, gracefully speaks a warm transaction transition,
 * and executes a webhook payload delivery to dispatch official WhatsApp assets.
 */

import { useEffect, useState, useRef } from "react";

export interface WhatsAppStatus {
  isSending: boolean;
  delivered: boolean;
  phoneNumber?: string;
}

export function useWhatsAppHandoff(speakFn: (text: string) => void) {
  const [status, setStatus] = useState<WhatsAppStatus>({
    isSending: false,
    delivered: false,
  });

  const speakFnRef = useRef(speakFn);

  // Keep referential tracking updated without triggering effect cycle
  useEffect(() => {
    speakFnRef.current = speakFn;
  }, [speakFn]);

  useEffect(() => {
    const handleLeadHot = async (event: Event) => {
      const customEvent = event as CustomEvent;
      const { score, triggers, transcript, budgetDetected } = customEvent.detail;

      console.log("🟢 [useWhatsAppHandoff] Intercepted LeadHot event! Score:", score);

      // 1. Gracefully interrupt or speak the handoff reassurance script
      speakFnRef.current("I see you are highly interested. I am sending the official RERA-compliant brochure and a VIP site-visit calendar link to your WhatsApp right now.");

      // 2. Mock or call the server-side WhatsApp trigger endpoint
      setStatus({ isSending: true, delivered: false });
      
      try {
        const response = await fetch("/api/whatsapp-handoff", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            score,
            triggers,
            transcript,
            budgetDetected,
            phone: "919876543210", // Default or parsed target
          }),
        });
        
        const resData = await response.json();
        if (resData.success) {
          setStatus({ isSending: false, delivered: true, phoneNumber: "98765-43210" });
          
          // Toast or dispatch UI notification
          if (typeof window !== "undefined") {
            const notifyEv = new CustomEvent("WhatsAppDelivered", {
              detail: { phone: "98765-43210", brochure: "Official RERA Brochure" }
            });
            window.dispatchEvent(notifyEv);
          }
        } else {
          setStatus({ isSending: false, delivered: false });
        }
      } catch (err) {
        console.error("Failed to send WhatsApp dispatch:", err);
        setStatus({ isSending: false, delivered: false });
      }
    };

    window.addEventListener("LeadHot", handleLeadHot);
    return () => {
      window.removeEventListener("LeadHot", handleLeadHot);
    };
  }, []);

  return {
    status,
    triggerManualHandoff: () => {
      window.dispatchEvent(new CustomEvent("LeadHot", {
        detail: { score: 95, triggers: ["MANUAL_TRIGGER"], transcript: "Send me files on whatsapp" }
      }));
    }
  };
}
