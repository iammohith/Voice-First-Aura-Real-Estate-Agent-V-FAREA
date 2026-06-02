/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project } from "./types";

export const SAMPLE_PROJECTS: Project[] = [
  {
    id: "prestige-solitaire",
    name: "Prestige Solitaire",
    developer: "Prestige Estates Projects Ltd",
    location: "Whitefield, Bengaluru",
    subLocation: "Whitefield",
    reraId: "PRM/KA/RERA/1251/446/PR/310526/006452",
    totalAcres: "12 Acres",
    possessionDate: "December 2028",
    description: "Experience the pinnacle of luxury living in Bengaluru's most sought-after tech corridor. Prestige Solitaire offers exquisite smart homes with panoramic view decks, set amidst 80% open landscaped green spaces.",
    highlights: [
      "Signature 50,000 sq.ft. multi-level clubhouse with infinity pool.",
      "Smart-home automation with hands-free voice controls and smart locks.",
      "Strategic location: 5 mins from Hope Farm Metro and ITPL gate.",
      "High-rise tower design offering premium double-height private balconies."
    ],
    amenities: [
      "Infinity edge temperature-controlled pool",
      "Indoor badminton and squash courts",
      "Mini-theatre & amphitheater",
      "Jogging track & reflexology pathway",
      "Executive coworking lounge with conference rooms",
      "EV Charging Stations at multiple levels"
    ],
    unitConfigs: [
      {
        type: "2 BHK Luxury",
        carpetArea: "1,120 sq.ft.",
        priceRange: "₹1.45 Cr - ₹1.60 Cr",
        numericPriceMin: 14500000,
        numericPriceMax: 16000000,
        availability: "Last Few Units"
      },
      {
        type: "3 BHK Premium",
        carpetArea: "1,580 sq.ft.",
        priceRange: "₹2.10 Cr - ₹2.35 Cr",
        numericPriceMin: 21000000,
        numericPriceMax: 23500000,
        availability: "Available"
      },
      {
        type: "4 BHK Presidential",
        carpetArea: "2,240 sq.ft.",
        priceRange: "₹3.10 Cr - ₹3.40 Cr",
        numericPriceMin: 31000000,
        numericPriceMax: 34000000,
        availability: "Available"
      }
    ],
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: "dlf-horizon",
    name: "DLF Horizon Residences",
    developer: "DLF Group",
    location: "Sector 65, Golf Course Road Ext, Gurugram",
    subLocation: "Sector 65",
    reraId: "RC/REP/HARERA/GGM/2026/782",
    totalAcres: "15.4 Acres",
    possessionDate: "October 2029",
    description: "The crown jewel of Gurugram's skyline. DLF Horizon Residences represents the next generation in high-rise masterplanning, featuring ultra-spacious presidential wings and private air-lounges.",
    highlights: [
      "Ultra-low density community with only 2 residences per floor.",
      "Triple-height grand entrance lobby designed by award-winning global architects.",
      "Premium imported Greek marble flooring and VRF central air-conditioning.",
      "Located directly on Southern Peripheral Road, offering rapid airport access."
    ],
    amenities: [
      "Rooftop observatory & stargazing deck",
      "State-of-the-art health club and cardio studio",
      "Private banquet lawn & party deck",
      "Olympic-size pool with sunbeds",
      "Concierge desk & 5-tier biometric security",
      "Premium wine cellar and cigar lounge"
    ],
    unitConfigs: [
      {
        type: "3 BHK Ultra-Luxury",
        carpetArea: "2,150 sq.ft.",
        priceRange: "₹3.80 Cr - ₹4.10 Cr",
        numericPriceMin: 38000000,
        numericPriceMax: 41000000,
        availability: "Available"
      },
      {
        type: "4 BHK Imperial Suite",
        carpetArea: "2,850 sq.ft.",
        priceRange: "₹5.20 Cr - ₹5.60 Cr",
        numericPriceMin: 52000000,
        numericPriceMax: 56000000,
        availability: "Last Few Units"
      },
      {
        type: "5 BHK Penthouse",
        carpetArea: "4,100 sq.ft.",
        priceRange: "₹8.50 Cr - ₹9.00 Cr",
        numericPriceMin: 85000000,
        numericPriceMax: 90000000,
        availability: "Available"
      }
    ],
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: "lodha-marina",
    name: "Lodha Splendora Marina",
    developer: "Lodha Group",
    location: "Thane West, Mumbai MMR",
    subLocation: "Thane West",
    reraId: "P51700021432",
    totalAcres: "40 Acres",
    possessionDate: "Ready to Move In",
    description: "Welcome to a riverfront paradise. Lodha Splendora Marina is a massive 40-acre resort estate featuring direct waterfront walkways, a private yacht pontoon, and standard-setting family entertainment zones.",
    highlights: [
      "Ready-to-move-in luxury apartments - Zero GST applicable.",
      "A massive masterplan with 15 acres of dedicated private forest parks.",
      "Overlooks the serene Ulhas River with infinite sunset vistas.",
      "20-minute drive to Thane Junction and Viviana Mall, supreme connectivity."
    ],
    amenities: [
      "Riverfront clubhouse & boardwalk path",
      "Forest treehouse & nature walking trails",
      "Cricket pitch & football arena",
      "Water cascade pool & jacuzzi",
      "Fully loaded children's play arena & creche",
      "Organic organic farms with greenhouse café"
    ],
    unitConfigs: [
      {
        type: "1 BHK Executive",
        carpetArea: "530 sq.ft.",
        priceRange: "₹85 Lakh - ₹95 Lakh",
        numericPriceMin: 8500000,
        numericPriceMax: 9500000,
        availability: "Available"
      },
      {
        type: "2 BHK Premium",
        carpetArea: "780 sq.ft.",
        priceRange: "₹1.25 Cr - ₹1.40 Cr",
        numericPriceMin: 12500000,
        numericPriceMax: 14000000,
        availability: "Available"
      },
      {
        type: "3 BHK Waterfront Grande",
        carpetArea: "1,150 sq.ft.",
        priceRange: "₹1.90 Cr - ₹2.10 Cr",
        numericPriceMin: 19000000,
        numericPriceMax: 21000000,
        availability: "Last Few Units"
      }
    ],
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: "myhome-legend",
    name: "My Home Legend",
    developer: "My Home Constructions Pvt Ltd",
    location: "Kokapet, Golden Mile IT Corridor, Hyderabad",
    subLocation: "Kokapet",
    reraId: "P02400007821",
    totalAcres: "10.5 Acres",
    possessionDate: "March 2029",
    description: "A majestic architectural masterwork raising a new standard of ultra-luxury Sky Condominiums in Hyderabad's premier Golden Mile Corridor. Enjoy triple-height private sky decks, 11-foot high ceilings, and 270-degree lakescape views.",
    highlights: [
      "Signature 60,000 sq.ft. sky clubhouse with glass infinity pool.",
      "11-foot floor-to-ceiling height with built-in VRF and luxury Italian marble.",
      "Close to Outer Ring Road (ORR) and 20 mins from Rajiv Gandhi Int'l Airport.",
      "IGBC Gold Certified sustainable residential engineering."
    ],
    amenities: [
      "Rooftop glass-bottom infinity pool",
      "Multi-sport indoor sports arena",
      "Digital golf simulator and luxury private theater",
      "Advanced EV fast charging points at premium parking levels",
      "Pet-friendly zones and senior citizen wellness garden",
      "Grand double-height foyer with 24/7 dedicated butler service"
    ],
    unitConfigs: [
      {
        type: "3 BHK Luxury",
        carpetArea: "2,180 sq.ft.",
        priceRange: "₹2.90 Cr - ₹3.15 Cr",
        numericPriceMin: 29000000,
        numericPriceMax: 31500000,
        availability: "Available"
      },
      {
        type: "4 BHK Sky Condo",
        carpetArea: "3,120 sq.ft.",
        priceRange: "₹4.50 Cr - ₹4.80 Cr",
        numericPriceMin: 45000000,
        numericPriceMax: 48000000,
        availability: "Last Few Units"
      },
      {
        type: "5 BHK Palatial Duplex",
        carpetArea: "4,850 sq.ft.",
        priceRange: "₹7.80 Cr - ₹8.30 Cr",
        numericPriceMin: 78000000,
        numericPriceMax: 83030000,
        availability: "Available"
      }
    ],
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000"
  }
];

export interface RAGChunk {
  projectId: string;
  projectName: string;
  category: "pricing" | "rera" | "possession" | "location" | "amenities" | "general";
  text: string;
  keywords: string[];
}

export const RAG_DATA_CHUNKS: RAGChunk[] = [
  // Prestige Solitaire
  {
    projectId: "prestige-solitaire",
    projectName: "Prestige Solitaire",
    category: "rera",
    text: "Prestige Solitaire is fully approved by Karnataka RERA with registration number PRM/KA/RERA/1251/446/PR/310526/006452. The development complies strictly with Karnataka Real Estate Regulatory Authority rules, ensuring zero risk of completion delays.",
    keywords: ["rera", "registration", "approval", "karnataka", "solitaire"]
  },
  {
    projectId: "prestige-solitaire",
    projectName: "Prestige Solitaire",
    category: "pricing",
    text: "Prestige Solitaire configuration sizing and prices: a 2 BHK Luxury flat with carpet area of 1,120 sq.ft is priced from ₹1.45 Cr up to ₹1.60 Cr; a 3 BHK Premium flat of 1,580 sq.ft is from ₹2.10 Cr to ₹2.35 Cr; and the elite 4 BHK Presidential option with 2,240 sq.ft spans ₹3.10 Cr to ₹3.40 Cr. All prices exclude booking registration charges.",
    keywords: ["price", "cost", "pricing", "bhk", "rates", "rate", "2bhk", "3bhk", "4bhk", "size", "carpet", "sqft", "sq.ft."]
  },
  {
    projectId: "prestige-solitaire",
    projectName: "Prestige Solitaire",
    category: "possession",
    text: "The estimated possession timeline and completion date for Prestige Solitaire in Whitefield is December 2028. Construction is actively running on milestones ahead of schedule.",
    keywords: ["possession", "completion", "timeline", "ready", "construction", "when", "date"]
  },
  {
    projectId: "prestige-solitaire",
    projectName: "Prestige Solitaire",
    category: "location",
    text: "Located strategically in Whitefield, Bengaluru near major employment hubs. The project is just 5 minutes away from ITPL Gate and the Hope Farm Junction Metro Station, offering excellent connectivity to Outer Ring Road and Marathahalli.",
    keywords: ["location", "metro", "connectivity", "where", "itpl", "whitefield", "bengaluru", "distance", "road"]
  },
  {
    projectId: "prestige-solitaire",
    projectName: "Prestige Solitaire",
    category: "amenities",
    text: "Solitaire features premium amenities including a massive 50,000 sq.ft multi-level clubhouse, infinity edge swimming pool (temperature-controlled), squash/badminton courts, executive co-working lounge, children play area, and multiple EV charging points.",
    keywords: ["amenities", "clubhouse", "pool", "gym", "play", "parking", "ev", "squash", "badminton"]
  },

  // DLF Horizon
  {
    projectId: "dlf-horizon",
    projectName: "DLF Horizon Residences",
    category: "rera",
    text: "DLF Horizon Residences in Sector 65 Gurugram is completely certified under Haryana RERA, bearing the standard registration number RC/REP/HARERA/GGM/2026/782, representing a transparent and high-security investment.",
    keywords: ["rera", "registration", "approval", "harera", "gurugram", "dlf"]
  },
  {
    projectId: "dlf-horizon",
    projectName: "DLF Horizon Residences",
    category: "pricing",
    text: "DLF Horizon pricing models are: 3 BHK Ultra-Luxury apartments (2,150 sq.ft.) start at ₹3.80 Cr up to ₹4.10 Cr; 4 BHK Imperial Suites (2,850 sq.ft.) have a pricing range between ₹5.20 Cr and ₹5.60 Cr; and the elite 5 BHK Penthouse of 4,100 sq.ft with panoramic skyline decks is priced from ₹8.50 Cr to ₹9.00 Cr.",
    keywords: ["price", "cost", "pricing", "bhk", "rates", "rate", "3bhk", "4bhk", "5bhk", "penthouse", "size", "carpet"]
  },
  {
    projectId: "dlf-horizon",
    projectName: "DLF Horizon Residences",
    category: "possession",
    text: "Possession of Gurugram's DLF Horizon Residences will commence in October 2029. Fully certified layout plans are clear and active in civil execution.",
    keywords: ["possession", "completion", "timeline", "ready", "construction", "when", "date", "gurugram"]
  },
  {
    projectId: "dlf-horizon",
    projectName: "DLF Horizon Residences",
    category: "location",
    text: "DLF Horizon occupies a landmark corner plot on Golf Course Road Extension in Sector 65, Gurugram. It provides direct, signal-free corridor access to Delhi IGI Airport, cyber-hubs, and luxury golf fields.",
    keywords: ["location", "highway", "where", "gurugram", "delhi", "airport", "golf", "sector 65"]
  },

  // Lodha Splendora Marina
  {
    projectId: "lodha-marina",
    projectName: "Lodha Splendora Marina",
    category: "rera",
    text: "Lodha Splendora Marina in Thane West, Mumbai is registered under MahaRERA with RERA registration certificate P51700021432. It is a completely ready-to-move-in development with absolute legal clearances.",
    keywords: ["rera", "maharera", "registration", "approval", "mumbai", "thane", "lodha"]
  },
  {
    projectId: "lodha-marina",
    projectName: "Lodha Splendora Marina",
    category: "pricing",
    text: "Lodha Splendora configuration sizing and pricing plans: 1 BHK Executive (530 sq.ft.) stands between ₹85 Lakh and ₹95 Lakh; 2 BHK Premium (780 sq.ft.) is between ₹1.25 Cr and ₹1.40 Cr; and the premium 3 BHK Waterfront Grande (1,150 sq.ft.) spans from ₹1.90 Cr to ₹2.10 Cr. Zero GST applies since the building has received its Occupancy Certificate (OC).",
    keywords: ["price", "cost", "pricing", "bhk", "rates", "rate", "1bhk", "2bhk", "3bhk", "size", "carpet", "gst", "oc", "occupancy"]
  },
  {
    projectId: "lodha-marina",
    projectName: "Lodha Splendora Marina",
    category: "possession",
    text: "Lodha Splendora Marina is completely 'Ready to Move In' with full Occupancy Certificate. Buyers can complete the registration and move in within 30 days of standard purchase intent.",
    keywords: ["possession", "completion", "timeline", "ready", "ready-to-move", "moving", "when"]
  },
  // Vastu Shastra and orientation compliance mappings
  {
    projectId: "prestige-solitaire",
    projectName: "Prestige Solitaire",
    category: "general",
    text: "Prestige Solitaire structures are fully compliant with traditional Vastu Shastra principles. Apartments are laid out with East-facing or North-East facing grand entrance doorways to optimize celestial energy flow and solar intake. The kitchens are meticulously situated in the South-East (Agni corner) and the master bedrooms in the South-West to guarantee peace, prosperity, and perfect cosmic alignment check.",
    keywords: ["vastu", "shastra", "compliance", "entrance", "facing", "north-east", "east", "kitchen", "remedy"]
  },
  {
    projectId: "dlf-horizon",
    projectName: "DLF Horizon Residences",
    category: "general",
    text: "DLF Horizon Residences boast premium Vastu compliant engineering layouts. Designed under renowned cosmic consultants, homes feature main entry doors facing the highly-prosperous North-East or North direction vector. Kitchen structures are placed in the South-East Agni fire zone or North-West windy quadrant, safeguarding the owner's wealth and health.",
    keywords: ["vastu", "shastra", "direction", "facing", "entrance", "north-east", "east", "kitchen", "bedroom"]
  },
  {
    projectId: "lodha-marina",
    projectName: "Lodha Splendora Marina",
    category: "general",
    text: "Lodha Splendora Marina features beautiful riverside layouts that follow supreme Vastu requirements. Main entrance gates and private lobby entrances face East to capture the early morning sun. Master bedrooms are designed in the heavy South-West quadrant, maintaining perfect terrestrial stability, while kitchens align with South-East Agni placements.",
    keywords: ["vastu", "shastra", "direction", "entrance", "facing", "east", "south-east", "kitchen"]
  },
  // NRI and FEMA legal banking guidelines
  {
    projectId: "prestige-solitaire",
    projectName: "Prestige Solitaire",
    category: "general",
    text: "Prestige Solitaire offers specialized NRI Assistance desks for smooth global capital inward transactions. Non-Resident Indians can seamlessly acquire luxury smart-homes under standard FEMA regulatory provisions. Property purchases can be funded from NRE or NRO remittance bank accounts, with full direct outward repatriation of capital permitted for up to two properties.",
    keywords: ["nri", "fema", "repatriation", "repatriable", "nre", "nro", "foreign", "abroad", "account", "banking", "overseas"]
  },
  {
    projectId: "dlf-horizon",
    projectName: "DLF Horizon Residences",
    category: "general",
    text: "DLF Horizon Residences provides an elite NRI Customer Relationship Desk for international investors. Under current FEMA provisions, overseas citizens of India (OCI) can safely purchase these homes using standard banking channels. Remittances processed via NRE or NRO accounts are verified for compliance, and dual tax guidelines under DTAA are fully facilitated.",
    keywords: ["nri", "fema", "repatriation", "repatriable", "nre", "nro", "foreign", "abroad", "banking", "assistance", "tax", "dtaa"]
  },
  {
    projectId: "lodha-marina",
    projectName: "Lodha Splendora Marina",
    category: "general",
    text: "Lodha Splendora Marina boasts ready-to-move-in legal clearances making it highly lucrative for NRI investors under FEMA rules. Purchases completed via foreign bank remissions, NRE, or NRO accounts are eligible for instant registry, with repatriation of sale proceeds in foreign currencies structurally approved for up to two flats.",
    keywords: ["nri", "fema", "repatriation", "repatriable", "nre", "nro", "foreign", "abroad", "remit", "investment", "currency"]
  },
  // My Home Legend (Hyderabad) specifiche
  {
    projectId: "myhome-legend",
    projectName: "My Home Legend",
    category: "rera",
    text: "My Home Legend is fully registered under Telangana RERA with license number P02400007821. Under RERA Telangana directives, the builder enforces complete price transparency, carpet area based sales disclosures, and secure 70% funds deposit in an escrow account, mitigating any project schedule delay risk.",
    keywords: ["rera", "registration", "approval", "telangana", "hyderabad", "license", "escrow", "my home", "legend"]
  },
  {
    projectId: "myhome-legend",
    projectName: "My Home Legend",
    category: "pricing",
    text: "My Home Legend configuration options and premium pricing breakdown: 3 BHK Luxury units (2,180 sq.ft. carpet area) are priced from ₹2.90 Cr up to ₹3.15 Cr; 4 BHK Ultra-luxury Sky Condominiums (3,120 sq.ft. carpet area) are priced between ₹4.50 Cr and ₹4.80 Cr; and the grand 5 BHK Palatial Duplexes (4,850 sq.ft. carpet area) range from ₹7.80 Cr to ₹8.30 Cr. A 10% booking token is standard, and GST is only 5% since it is under active construction. No GST will apply post-possession.",
    keywords: ["price", "cost", "pricing", "bhk", "rates", "rate", "3bhk", "4bhk", "5bhk", "duplex", "size", "carpet", "gst", "booking", "downpayment"]
  },
  {
    projectId: "myhome-legend",
    projectName: "My Home Legend",
    category: "possession",
    text: "The estimated possession date and handover timeline for My Home Legend in Kokapet, Hyderabad is March 2029. Construction has launched using advanced high-durability Mivan shuttering technology for seismic resilience and swift completion.",
    keywords: ["possession", "completion", "timeline", "ready", "construction", "when", "date", "mivan", "delay"]
  },
  {
    projectId: "myhome-legend",
    projectName: "My Home Legend",
    category: "location",
    text: "My Home Legend occupies a premium locus in Kokapet, Golden Mile IT Corridor, Hyderabad. Kokapet is Hyderabad's highest-performing luxury corridor in 2025/2026, offering super-convenient connectivity to Outer Ring Road (ORR), HITEC City, Gachibowli IT zones, and Rajiv Gandhi International Airport in Shamshabad (20-minute drive). It offers incredible investment ROI due to high resale demand.",
    keywords: ["location", "metro", "connectivity", "where", "hyderabad", "gachibowli", "hitec city", "kokapet", "airport", "orr", "roi", "road"]
  },
  {
    projectId: "myhome-legend",
    projectName: "My Home Legend",
    category: "amenities",
    text: "My Home Legend hosts a signature 60,000 sq.ft. elevated sky clubhouse featuring a transparent glass-bottom infinity pool, multi-sport indoor arena, virtual digital golf simulator, private mini-theater, dedicated pet park zones, barrier-free access pathways for senior citizens, and pre-allocated EV fast-charging stations at multiple indoor parking levels.",
    keywords: ["amenities", "clubhouse", "pool", "gym", "play", "parking", "ev", "golf", "theater", "pet", "disabled", "senior"]
  },
  {
    projectId: "myhome-legend",
    projectName: "My Home Legend",
    category: "general",
    text: "My Home Legend units are structurally configured for strict, traditional Vastu Shastra compliance. Entrance doors face auspicious East or North-East directions to channels celestial morning solar energy. Kitchen structures are aligned in the South-East (Agni fire quadrant), while the master bedrooms are positioned in the South-West (Earth quadrant) to guarantee family stability, peace, and abundance.",
    keywords: ["vastu", "shastra", "compliance", "entrance", "facing", "north-east", "east", "kitchen", "south-east", "bedroom"]
  },
  {
    projectId: "myhome-legend",
    projectName: "My Home Legend",
    category: "general",
    text: "My Home Legend provides a dedicated NRI Investment Deck. Real estate purchases under FEMA allow Non-Resident Indians, PIOs, and OCIs to acquire premium residential residential properties using standard banking accounts (NRE or NRO). Complete outward repatriation of property sale proceeds in foreign currencies is fully supported for up to two residential units, with streamlined double taxation (DTAA) filings.",
    keywords: ["nri", "fema", "repatriation", "repatriable", "nre", "nro", "foreign", "abroad", "account", "banking", "overseas", "dtaa", "tax"]
  },

  // General Real Estate Glossary Chunks
  {
    projectId: "general",
    projectName: "RERA and Areas",
    category: "general",
    text: "RERA (Real Estate Regulation & Development Act, 2016) mandates transparent pricing, carpet area disclosures, and consumer protection. It requires developers to register residential/commercial projects and offer compensation for execution delays. Under RERA:\n- Carpet Area is the actual usable floor space inside your home walls, excluding external walls, balconies, or My-common elements.\n- Built-Up Area includes carpet area plus internal/external walls and balcony space (typically 10-20% larger than carpet area).\n- Super Built-Up Area (Saleable Area) includes built-up area and a proportionate share of common facilities like lifts, lobbies, corridors, and club amenities. It includes a loading factor of 25% to 60%.",
    keywords: ["rera", "carpet area", "built-up", "super built-up", "loading factor", "usable floor space", "saleable", "common areas"]
  },
  {
    projectId: "general",
    projectName: "Essential Legal Documents",
    category: "general",
    text: "Principal Legal Documents in Indian Real Estate:\n- Encumbrance Certificate (EC): Prove zero pending legal liabilities or claims on property title; buyers should exhaustively check EC for 13 to 30 years.\n- Commencement Certificate: Official local permit allowing the developer to launch construction after securing all mandatory municipal clearances.\n- Sale Deed: The final legal document on stamp paper transferring ownership from seller to buyer; it must be executed and registered with the Sub-Registrar.\n- Agreement of Sale: Binding contract detailing price, milestones, and delivery dates before the final sale deed.",
    keywords: ["encumbrance certificate", "ec", "commencement certificate", "sale deed", "agreement of sale", "sub-registrar", "stamp paper", "title"]
  },
  {
    projectId: "general",
    projectName: "Ownership & Loan Basics",
    category: "general",
    text: "Property Ownership Models and Key Home Loan Terms:\n- Freehold: Absolute, perpetual ownership of both the land and building structure with unrestricted transfer and selling rights.\n- Leasehold: Ownership is limited to a defined lease period (typically 99 years) after which property returns to the government or original lessor.\n- Home Loan Appraisal: Property evaluation by a neutral surveyor to assess current market value for mortgage eligibility limits.\n- Home Loan Pre-Approval: Sanction of funding capacity by a bank based on income and CIBIL score before choosing a property. Reduces surprises at closing.",
    keywords: ["freehold", "leasehold", "appraisal", "pre-approval", "ownership", "loan eligibility", "cibil"]
  },
  {
    projectId: "general",
    projectName: "Transaction Safeguards & Diligence",
    category: "general",
    text: "Real Estate Diligence Terminology and Safeguards:\n- Caveat Emptor (Buyer Beware): Places responsibility on the home buyer to run comprehensive legal, technical, and quality audits.\n- Escrow: Neutral third-party account holding buyer funds, disbursed only when the builder completes pre-specified milestones. RERA mandates depositing 70% of project collections into local escrow accounts.\n- Benami Transactions: Illegal property transfers where the real owner's identity is masked. Strongly prohibited under the Benami Transactions Prohibition Act with major penalties.\n- Stamp Duty & Registration charges: Compulsory state fees to legally register physical property deeds.\n- Contingency Clauses: Protective clauses in buyer contracts allowing zero-penalty exit if conditions like home inspections or bank advances fail.",
    keywords: ["caveat emptor", "escrow", "benami", "stamp duty", "contingency clause", "re-trade", "gazumping", "diligence"]
  },

  // FAQs and Regional Title Verification
  {
    projectId: "general",
    projectName: "Property Title Verification",
    category: "general",
    text: "How to Verify Clear Property Title by Region:\n- Hyderabad (Telangana): Check Dharani portal or Sub-Registrar records for a 13-30 year Encumbrance Certificate (EC), verify RERA approval on the TS RERA portal, and ensure zero outstanding property tax dues.\n- Bengaluru (Karnataka): Fetch EC from the Kaveri Online portal for 30 years, verify genuine A-Khata/B-Khata certificates, and audit RERA status on the Karnataka RERA website.\n- Gurugram (NCR, Haryana): Verify licenses on Haryana HRERA portal, demand original registry deeds, check registry record mutations, and secure non-encumbrance records from Haryana Land Records (Jamabandi).\n- Mumbai (Maharashtra): Verify MahaRERA registration website, check the Index-II document from the sub-registrar registrar office, and demand the builder's Occupancy Certificate (OC) or Commencement Certificate (CC).",
    keywords: ["verify title", "clear title", "hyderabad", "bengaluru", "gurugram", "mumbai", "dharani", "kaveri", "harera", "maharera", "index-ii", "khata", "ec"]
  },
  {
    projectId: "general",
    projectName: "Regional Stamp Duty & Taxes",
    category: "general",
    text: "Regional Rates for Stamp Duty and Property Registration Charges:\n- Hyderabad (Telangana): Stamp Duty is 4%, GHMC Transfer Duty is 1.5%, and Registration Fee is 0.5% (total approximately 6% of property value).\n- Bengaluru (Karnataka): Stamp Duty is 5.1% for properties priced above ₹45 Lakhs, plus 1% Registration charges and local surcharges.\n- Gurugram (Haryana/NCR): Stamp Duty is 7% for male buyers and 5% for female buyers in urban areas, plus a registration fee depending on slab (up to ₹50,000).\n- Mumbai (Maharashtra): Stamp Duty is 5% to 6% (inclusive of local body tax/metro cess) plus 1% Registration fee (capped at ₹30,000). Only under-construction homes attract GST (5% standard, or 1% affordable); ready-to-move homes enjoy 0% GST.",
    keywords: ["stamp duty", "registration fees", "taxes", "charges", "hyderabad", "bengaluru", "gurugram", "mumbai", "gst", "telangana", "karnataka", "haryana", "maharashtra"]
  },
  {
    projectId: "general",
    projectName: "Sustainable Housing Benefits",
    category: "general",
    text: "Benefits of Green and Sustainable Homes (IGBC, LEED, GRIHA Certified):\n- Sustainable buildings deliver lower monthly utility bills through solar panels, rainwater harvesting, sewage water recycling, and sensor-based LED lighting.\n- Quality of living is higher due to enhanced indoor air ventilation, low VOC toxicity paints, and extensive landscaped open green parks.\n- Certified properties enjoy higher long-term resale demand and better capital appreciation as sustainable living standard grows.",
    keywords: ["green home", "igbc", "leed", "griha", "sustainable", "benefits", "solar", "water", "resale"]
  },
  {
    projectId: "general",
    projectName: "Home Loan Eligibility & CIBIL",
    category: "general",
    text: "How to Calculate Home Loan Eligibility, EMIs and Credit Scores:\n- Banks limit loan eligibility based on monthly net disposable income, where fixed monthly EMIs should ideally occupy only 40% to 50% of monthly income.\n- A high Credit Score (minimum 750+ CIBIL/Experian) ensures fast verification, waiver of processing fees, and lower interest rate margins.\n- RERA-approved project tie-ups facilitate hassle-free bank approvals, cutting down pre-approval timelines. Joint borrowers can double tax saving eligibility under Section 80C and Section 24(b).",
    keywords: ["loan eligibility", "emi", "cibil", "credit score", "joint loan", "tax benefits", "80c", "24b"]
  },

  // NRI and FEMA legal guidelines
  {
    projectId: "general",
    projectName: "NRI FEMA Purchasing Rules",
    category: "general",
    text: "FEMA Eligibility and Rules for NRI Real Estate Purchase:\n- NRIs, PIOs, and OCIs are fully eligible under FEMA to buy any count of residential apartments or commercial office properties in India.\n- Agriculture Restriction: NRIs and foreign citizens are strictly forbidden from purchasing agricultural land, farmhouses, or plantation properties in India. They can only acquire such farm properties via inheritance.\n- Mandatory Documents: Valid Passport, Visa or OCI card, Indian PAN card, foreign address proofs, local Power of Attorney (PoA), and NRE/NRO banking link proofs.",
    keywords: ["nri", "fema", "agricultural land", "plantation", "farmhouse", "passport", "pan card", "overseas", "oci", "pio"]
  },
  {
    projectId: "general",
    projectName: "NRI Banking Remittances & Repatriation",
    category: "general",
    text: "NRI Banking Remittances and Capital Repatriation Rules:\n- Properties must be funded only via inward remittances from abroad or NRE, NRO, or FCNR bank accounts. Cash transactions are illegal.\n- Outward Repatriation: NRIs can legally repatriate sale proceeds of up to two residential properties back abroad, provided they were originally purchased using NRE/FCNR foreign exchange funds, and domestic capital gains taxes are settled.\n- Rental Income is fully taxable at 30% TDS, but can be fully repatriated after filing tax returns under DTAA double tax treaties. Note that NRIs cannot purchase property jointly with foreign nationals unless the partner qualifies as an NRI/OCI/PIO themselves.",
    keywords: ["repatriation", "remittance", "nre", "nro", "fcnr", "dtaa", "tax returns", "tds", "repatriate"]
  },

  // Choosing Property and Construction Quality Guide
  {
    projectId: "general",
    projectName: "Why Invest in Major Indian Cities",
    category: "general",
    text: "Top Investment Corridors in Key Metro Cities for 2025/2026:\n- Hyderabad: Booming luxury market in Kokapet, HITEC City, Gachibowli, Giga-corridors near Outer Ring Road (ORR). High ROI, top connectivity.\n- Bengaluru: Rich IT hubs in Whitefield, Outer Ring Road, and Hebbal due to immense tech job concentration, ORR Metro expansions.\n- Gurugram (NCR): High-status addresses on Golf Course Extension Road, Sector 65, and Dwarka Expressway (fast-evolving commercial corridors).\n- Mumbai MMR: Massive appreciation in Thane West (riverside properties, proposed metro lanes, luxury self-contained townships with world-class clubhouse amenities).",
    keywords: ["invest", "hyderabad", "bengaluru", "gurugram", "mumbai", "roi", "whitefield", "thane", "kokapet", "sector 65", "growth"]
  },
  {
    projectId: "general",
    projectName: "Choosing the Right Home",
    category: "general",
    text: "Shortlisting Projects and Choosing between 2BHK and 3BHK:\n- Shortlist projects considering Location (travel distance to work), Builder Reputation (check RERA records and delivery dates), and open space ratios (60% to 70% in premium societies to ensure green buffer parks).\n- Unit configuration: 3BHKs typically yield higher resale value and serve expanding family needs compared to 2BHKs.\n- Luxury specifications: Look for a floor-to-ceiling clear height of 10 to 12 feet, premium automated smart locks, custom EV charging provision, gated perimeter controls, pet zones, and senior barrier-free walking trails.",
    keywords: ["shortlist", "2bhk", "3bhk", "open space", "ev charging", "smart home", "floor-to-ceiling", "luxury"]
  },
  {
    projectId: "general",
    projectName: "Ready versus Under-Construction",
    category: "general",
    text: "Under-Construction vs Ready-to-Move-In Homes:\n- Under-Construction properties provide a lower entry cost and flexible slab-based payment timelines, but run risk of construction delays and attract a 5% GST tax.\n- Ready-to-Move homes provide immediate possession, what-you-see-is-what-you-get safety, and are completely exempt from GST (0% GST), but require full upfront cost.",
    keywords: ["under-construction", "ready-to-move", "ready", "gst", "delays", "pricing"]
  },

  // Property Pricing and Booking
  {
    projectId: "general",
    projectName: "Construction Quality Diligence",
    category: "general",
    text: "How to Verify Construction Standards on property visits:\n- Demand independent structural design certificates, soil test compliance, and RCC seismic resistance (earthquake proofing) documents.\n- Modern Techniques: Look for monolithic Mivan Shuttering (aluminum formwork yielding seamless concrete walls which completely eliminate brick joint leakage cracks and raise durability) or Precast block builds vs standard brick-and-mortar.\n- Inspect cement grades (OPC/PPC) and rust-free steel (Fe 500/550 with ISI branding), and hire a civil surveyor for final plaster audit.",
    keywords: ["construction quality", "mivan Shuttering", "precast", "seismic", "soil test", "cement", "steel", "durability", "workmanship"]
  },
  {
    projectId: "general",
    projectName: "Detailed Price Breakup",
    category: "general",
    text: "Property Cost Breakup and Booking token:\n- Pricing goes beyond base rate. It includes: Floor Rise charges (extra per sqft for higher floor levels), PLC (Preferential Location Charges for corner/park facing units), clubhouse memberships, car park slots, corpus fund deposit, and advance maintenance charges.\n- Booking Token: Usually 10% of total property value is paid under RERA rules to secure booking, which must be backed by a registered Agreement of Sale.",
    keywords: ["price breakup", "floor rise", "plc", "clubhouse", "corpus fund", "maintenance charges", "booking token"]
  },

  // Home Loan Guides
  {
    projectId: "general",
    projectName: "Registration & RERA protection",
    category: "general",
    text: "Property Registration and RERA Safeguards:\n- Registrations: Under Telangana and Indian RERA acts, the Agreement of Sale must be legally registered within 4 months of booking execution.\n- 5-Year Defect Liability: Builders are strictly legally liable for 5 years post-handover to rectify any structural defect or poor civil work at zero cost within 30 days of filing a complaint.\n- Escrow: Developers must lock 70% of collections inside project-specific escrow accounts, preventing fund diversion to other projects.",
    keywords: ["rera rules", "5-year defect liability", "escrow", "registration timeline", "agreement of sale", "buyer protection"]
  },
  {
    projectId: "general",
    projectName: "Home Finance Schemes",
    category: "general",
    text: "Advanced Home Finance Schemes and EMI/Pre-EMI Modes:\n- Subvention Scheme: Bank-builder contractual scheme where the builder pays interest during construction. The home buyer pays zero EMIs until taking possession, resolving dual-paying pressures (rent + EMI).\n- Pre-EMI: Buyer pays a lower 'interest-only' payment on partially disbursed loan sums during construction. Standard Full EMI starts after possession, covering both interest and principal reduction. Banks like SBI, HDFC, ICICI, Axis, and LIC offer designated subventions on RERA projects.",
    keywords: ["subvention", "pre-emi", "emi", "interest-only", "builder-subvented", "home loan"]
  }
];

/**
 * Searches property database chunks for match similarity (Edge RAG / Local Grounding).
 * A perfect, lightweight, free keyword scoring similarity algorithm.
 */
export function retrieveContext(query: string, projectId?: string): string[] {
  const normalizedQuery = query.toLowerCase();
  
  // Filter by projectId first if specified, but if the user query explicitly mentions
  // key terms of another project or compares them, bypass strict filtering so comparative context is matched.
  let candidates = RAG_DATA_CHUNKS;
  if (projectId) {
    const queryLower = normalizedQuery;
    const mentionsOtherProject = RAG_DATA_CHUNKS.some(chunk => 
      chunk.projectId !== projectId && 
      chunk.projectId !== "general" && 
      (queryLower.includes(chunk.projectName.toLowerCase()) || 
       queryLower.includes(chunk.projectId.toLowerCase()) || 
       (chunk.projectId === "prestige" && queryLower.includes("solitaire")) ||
       (chunk.projectId === "dlf" && (queryLower.includes("horizon") || queryLower.includes("sector 65") || queryLower.includes("sector-65"))) ||
       (chunk.projectId === "lodha" && (queryLower.includes("splendora") || queryLower.includes("marina") || queryLower.includes("thane"))) ||
       (chunk.projectId === "myhome" && (queryLower.includes("legend") || queryLower.includes("kokapet") || queryLower.includes("hyderabad"))))
    );
    
    if (!mentionsOtherProject) {
      candidates = RAG_DATA_CHUNKS.filter(chunk => chunk.projectId === projectId || chunk.projectId === "general");
    }
  }

  // Score candidate chunks based on matching tokens/keywords
  const matches = candidates.map(chunk => {
    let score = 0;
    
    // Exact phrase match addition
    if (normalizedQuery.includes(chunk.projectName.toLowerCase())) {
      score += 5;
    }
    
    // Keyword match addition
    chunk.keywords.forEach(keyword => {
      if (normalizedQuery.includes(keyword)) {
        score += 2;
      }
    });

    // Content substring match addition
    if (normalizedQuery.length > 5) {
      const words = normalizedQuery.split(/\s+/);
      words.forEach(word => {
        if (word.length > 3 && chunk.text.toLowerCase().includes(word)) {
          score += 1;
        }
      });
    }

    return { chunk, score };
  });

  // Sort by highest score first and return top 3 chunks with score > 0
  return matches
    .filter(match => match.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(match => match.chunk.text)
    .slice(0, 3);
}
