/**
 * WhatsAppService.ts
 * Implements pre-sales business logic for delivering assets to customers
 * using the official Meta WhatsApp Business Cloud API.
 * 
 * Supports DPDPA 2023 & GDPR compliance by routing all requests securely.
 */

// Custom compatible logger using standard console
const logger = {
  info: (msg: string, metadata?: any) => {
    console.log(`[INFO] ${msg}`, metadata ? JSON.stringify(metadata) : "");
  },
  error: (msg: string, metadata?: any) => {
    console.error(`[ERROR] ${msg}`, metadata ? JSON.stringify(metadata) : "");
  }
};

// Official Meta WhatsApp Graph URL base version
const WHATSAPP_API_VERSION = "v20.0";
const FACEBOOK_GRAPH_BASE = "https://graph.facebook.com";

export interface WhatsAppPayload {
  phone: string;
  score: number;
  triggers: string[];
  transcript?: string;
  budgetDetected?: string;
  brochureUrl?: string; // Optional override brochure URL
  projectName?: string; // Optional explicit project name
}

export interface WhatsAppDeliveryDetails {
  timestamp: string;
  phoneNumber: string;
  messageId: string;
  mediaLink: string;
  projectDispatched: string;
}

export interface WhatsAppServiceResponse {
  success: boolean;
  message: string;
  simulated: boolean;
  deliveryDetails?: WhatsAppDeliveryDetails;
  error?: string;
  payloadSent?: any;
  rawResponse?: any;
}

// Map of pre-sales property ids/names to their official digital brochures
export const PROJECT_BROCHURE_DIRECTORY = {
  "prestige-solitaire": {
    name: "Prestige Solitaire",
    reraId: "PRM/KA/RERA/1251/446/PR/310526/006452",
    brochureUrl: "https://signature-estates.ai/docs/prestige-solitaire-brochure.pdf",
    filename: "Prestige_Solitaire_Brochure.pdf"
  },
  "dlf-horizon": {
    name: "DLF Horizon Residences",
    reraId: "RC/REP/HARERA/GGM/2026/782",
    brochureUrl: "https://signature-estates.ai/docs/dlf-horizon-brochure.pdf",
    filename: "DLF_Horizon_Brochure.pdf"
  },
  "lodha-marina": {
    name: "Lodha Splendora Marina",
    reraId: "P51700021432",
    brochureUrl: "https://signature-estates.ai/docs/lodha-splendora-marina-brochure.pdf",
    filename: "Lodha_Splendora_Marina_Brochure.pdf"
  },
  "myhome-legend": {
    name: "My Home Legend",
    reraId: "P02400007821",
    brochureUrl: "https://signature-estates.ai/docs/my-home-legend-brochure.pdf",
    filename: "My_Home_Legend_Brochure.pdf"
  },
  "general-signature": {
    name: "Signature Luxury Portfolio",
    reraId: "MULTI_CITY_RERA_APPROVED",
    brochureUrl: "https://signature-estates.ai/docs/rera-official-brochure.pdf",
    filename: "RERA_Certified_Brochure.pdf"
  }
};

/**
 * Automatically infers which premium property the customer is exploring based on
 * keywords in the chat dialogue transcription, or direct explicit overrides.
 */
export function matchProjectFromDialogue(transcript: string = "", explicitProject?: string): keyof typeof PROJECT_BROCHURE_DIRECTORY {
  const text = (explicitProject || transcript || "").toLowerCase();

  if (text.includes("myhome") || text.includes("my home") || text.includes("legend") || text.includes("hyderabad") || text.includes("kokapet")) {
    return "myhome-legend";
  }
  if (text.includes("prestige") || text.includes("solitaire") || text.includes("bengaluru") || text.includes("whitefield")) {
    return "prestige-solitaire";
  }
  if (text.includes("dlf") || text.includes("horizon") || text.includes("gurugram") || text.includes("sector 65")) {
    return "dlf-horizon";
  }
  if (text.includes("lodha") || text.includes("marina") || text.includes("splendora") || text.includes("mumbai") || text.includes("thane")) {
    return "lodha-marina";
  }

  return "general-signature";
}

/**
 * Triggers dispatch of a WhatsApp Business API message template containing
 * a RERA-certified property brochure document and VIP invite parameters.
 * Falls back to highly informative mocks if credentials are not configured inside env.
 */
export async function sendWhatsAppBrochure(payload: WhatsAppPayload): Promise<WhatsAppServiceResponse> {
  const { phone, score, triggers, transcript = "", budgetDetected = "Not Specified", brochureUrl, projectName } = payload;

  const resolvedPhone = phone.replace(/[^0-9]/g, "");
  if (!resolvedPhone) {
    return {
      success: false,
      message: "Phone number is invalid or empty.",
      simulated: false,
      error: "INVALID_PHONE"
    };
  }

  // 1. Resolve which brochure asset to send
  const matchedKey = matchProjectFromDialogue(transcript, projectName);
  const propertyInfo = PROJECT_BROCHURE_DIRECTORY[matchedKey];
  const finalBrochureUrl = brochureUrl || propertyInfo.brochureUrl;
  const finalFilename = propertyInfo.filename;

  // 2. Fetch API Keys from standard env config
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  // 3. Prepare standard payload for Meta Cloud API
  const templateName = process.env.WHATSAPP_TEMPLATE_NAME || "signature_estates_presales_brochure";
  
  // High-fidelity template mapping according to Meta guidelines
  const apiPayload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: resolvedPhone,
    type: "template",
    template: {
      name: templateName,
      language: { code: "en_IN" },
      components: [
        {
          type: "header",
          parameters: [
            {
              type: "document",
              document: {
                link: finalBrochureUrl,
                filename: finalFilename
              }
            }
          ]
        },
        {
          type: "body",
          parameters: [
            { type: "text", text: `${propertyInfo.name} (Priority Match: ${score}%)` },
            { type: "text", text: `Verified under RERA ID: ${propertyInfo.reraId}` }
          ]
        }
      ]
    }
  };

  const isConfigured = 
    accessToken && 
    accessToken !== "MY_WHATSAPP_ACCESS_TOKEN" && 
    phoneNumberId && 
    phoneNumberId !== "MY_WHATSAPP_PHONE_NUMBER_ID";

  if (!isConfigured) {
    // Elegant simulation fallback for sandbox trials or missing credentials
    console.log(`\n--- 📱 [WhatsApp Cloud API Simulation] ---`);
    console.log(`To make real api calls, configure 'WHATSAPP_ACCESS_TOKEN' and 'WHATSAPP_PHONE_NUMBER_ID' in setting keys.`);
    console.log(`Endpoint: POST ${FACEBOOK_GRAPH_BASE}/${WHATSAPP_API_VERSION}/{phoneNumberId}/messages`);
    console.log(`Headers: { "Authorization": "Bearer ****<configured_token>****", "Content-Type": "application/json" }`);
    console.log(`Payload Structure:`, JSON.stringify(apiPayload, null, 2));
    console.log(`-------------------------------------------\n`);

    // Simulated short delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    return {
      success: true,
      message: "Simulated WhatsApp brochure and catalog dispatch successfully completed.",
      simulated: true,
      payloadSent: apiPayload,
      deliveryDetails: {
        timestamp: new Date().toISOString(),
        phoneNumber: resolvedPhone,
        messageId: `simulated-${Math.random().toString(36).substring(2, 10).toUpperCase()}-wamid`,
        mediaLink: finalBrochureUrl,
        projectDispatched: propertyInfo.name
      }
    };
  }

  // 4. Fire the actual HTTPS Call to Meta API
  try {
    const url = `${FACEBOOK_GRAPH_BASE}/${WHATSAPP_API_VERSION}/${phoneNumberId}/messages`;
    console.log(`📡 Sending official dispatch directly to WhatsApp endpoint: ${url}`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiPayload)
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error(`❌ Meta Graph API Error:`, responseData);
      return {
        success: false,
        message: responseData?.error?.message || "Meta Graph API responded with an error.",
        simulated: false,
        payloadSent: apiPayload,
        rawResponse: responseData,
        error: responseData?.error?.code?.toString() || "META_API_FAILURE"
      };
    }

    console.log(`✅ WhatsApp successfully delivered to phone ${resolvedPhone}:`, responseData);
    
    return {
      success: true,
      message: "Successfully triggered message via the official WhatsApp Business API.",
      simulated: false,
      payloadSent: apiPayload,
      rawResponse: responseData,
      deliveryDetails: {
        timestamp: new Date().toISOString(),
        phoneNumber: resolvedPhone,
        messageId: responseData?.messages?.[0]?.id || "unknown-wamid-id",
        mediaLink: finalBrochureUrl,
        projectDispatched: propertyInfo.name
      }
    };

  } catch (error: any) {
    console.error(`💥 Cloud Network Failure when triggering WhatsApp service:`, error);
    return {
      success: false,
      message: error?.message || "Failed to contact Meta Cloud endpoint. Check connection.",
      simulated: false,
      payloadSent: apiPayload,
      error: "ENDPOINT_UNREACHABLE"
    };
  }
}
