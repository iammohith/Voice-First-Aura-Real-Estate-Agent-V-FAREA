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

  // General Real Estate glossary
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
  },

  // --- USER SPECIFIED KNOWLEDGE DESK GUIDES ---
  {
    projectId: "general",
    projectName: "EMI & Finance",
    category: "general",
    text: "EMI & Finance Guide:\n- Debt Underwriting: Fixed Obligation to Income Ratio (FOIR Ratios) specifies that all monthly EMI obligations (including the new home loan) should not cross 40% to 50% of your household's net disposable monthly salary.\n- Down Payments: Under RERA rules, a standard booking token is 10% of total cost, while developers usually require 10% to 20% down payments as buyer equity, with bank programs funding the remaining 80% core asset value.\n- Financial Advice: Maintain a healthy CIBIL score (750+) before initiating home loan pre-approvals to qualify for direct processing waivers.",
    keywords: ["emi & finance", "foir ratios", "down payments", "foir", "down payment", "finance", "calculation"]
  },
  {
    projectId: "general",
    projectName: "Vastu Shastra",
    category: "general",
    text: "Vastu Shastra Spatial Compliance Guide:\n- Cardinal Gate Alignments: The main entrance/cardinal gate should exclusively face East, North, or North-East to channel auspicious solar energy and positive Prana frequencies.\n- Kitchen Alignments: Always align the kitchen in the South-East quadrant (Agni fire corner). Avoid placing kitchens directly in the North-East.\n- Master Bedroom Alignments: Position the master bedroom strictly in the South-West quadrant (Nairutya corner) to facilitate familial stability, security, power, and prosperity.",
    keywords: ["vastu shastra", "vastu", "shastra", "cardinal gate", "kitchen", "master bedroom alignments"]
  },
  {
    projectId: "general",
    projectName: "NRI FEMA Guide",
    category: "general",
    text: "NRI FEMA Regulatory Desk Guidance:\n- FEMA Eligibility: NRIs, PIOs, and OCIs hold general permission to purchase residential or commercial real estate in India using standard banking channels.\n- Agricultural Restrictions: FEMA rules strictly enforce agricultural restrictions, preventing NRIs and foreign passport holders from buying agricultural lands, plantations, or farmhouses unless acquired through legal inheritance.\n- Capital Repatriation & Taxes: Capital repatriation of original investment sale proceeds can be routed abroad for up to two residential flat properties. Rental inflows are subject to standard 30% TDS, fully repatriable after normal income tax return filings under dual tax (DTAA) treaties, adjusting overall tax gains/TDS.",
    keywords: ["nri fema guide", "nri", "fema", "agricultural restrictions", "capital repatriation", "tax gains/tds"]
  },
  {
    projectId: "general",
    projectName: "NRI Property Buying Guide – Rules, Taxes & FAQs",
    category: "general",
    text: "NRI Property Buying Guide – Rules, Taxes & FAQs:\n- Rules & FEMA: Under standard FEMA rules, foreign remittances via NRE, NRO, or FCNR are fully accepted. Direct cash payments are strongly forbidden.\n- Agricultural Restrictions: NRIs have zero authorization to acquire farm lands or plantations. Only inheritance transfers are valid under agricultural restrictions.\n- Taxes & Repatriation: Capital repatriation is permitted back overseas for up to two flats. Any rental earnings are subject to 30% TDS, but tax gains/TDS can be optimized via global DTAA relief protocols after tax return submissions.",
    keywords: ["nri property buying guide", "rules", "taxes", "faqs", "agricultural restrictions", "capital repatriation", "tax gains/tds", "nri property buying guide – rules, taxes & faqs"]
  },
  {
    projectId: "general",
    projectName: "Choosing the Right Property – A Complete Guide",
    category: "general",
    text: "Choosing the Right Property – A Complete Guide:\n- Transit Coordinates: Carefully analyze transit coordinates, including travel times to work hubs, local metro lanes, suburban highways, and airport accessibility limits.\n- Configuration Choices: Configuration choices (such as 2 BHK vs 3 BHK configurations) should align with future family expansion, offering better resale value and rental yields.\n- Green Space Densities: Opt for properties guaranteeing 70% to 80% open spaces, providing massive green space densities, modern landscaped play fields, senior nature walking trails, and EV charge setups.",
    keywords: ["choosing the right property", "complete guide", "transit coordinates", "configuration choices", "green space densities", "choosing the right property – a complete guide"]
  },
  {
    projectId: "general",
    projectName: "Construction Quality in Real Estate – A Complete Buyer's Guide",
    category: "general",
    text: "Construction Quality in Real Estate – A Complete Buyer's Guide:\n- Advanced Formwork: Insist on projects using monolithic Mivan aluminum formwork (rather than standard brick mortar jointing) to provide seamless, durable concrete structures and prevent damp cracks.\n- Hard Evidence: Audit independent third-party soil check analyses and official seismic ratings (earthquake resistance designs).\n- Material Standards: Verify use of high-strength Fe 500 steel (rust-resistant grade) and premium grade cement.\n- Civil Inspections: Perform rigorous civil inspections on-site, measuring paint plaster symmetry, joint tiling alignment, structural pillars, and check for outline leakage signs under balcony doors.",
    keywords: ["construction quality in real estate", "complete buyer's guide", "mivan aluminum formwork", "seismic ratings", "fe 500 steel", "civil inspections", "construction quality in real estate – a complete buyer's guide"]
  },
  {
    projectId: "general",
    projectName: "Property Pricing Guide – Cost Breakup, Taxes & Hidden Charges",
    category: "general",
    text: "Property Pricing Guide – Cost Breakup, Taxes & Hidden Charges:\n- Extra charges: Total transaction costs include Floor Rise charges (added per floor in high-rises), Preferential Location Charges [PLC] for park/lake views, clubhouse enrollment fee, and parking slot assignments.\n- Statutory Dues: Fact-check statutory rates: stamp duties (5-7% of property cost depending on state location), sub-registrar registration fees (1%), and GST (5% for under-construction homes).\n- Upkeep Assets: Budget for the physical corpus fund deposit (security capital buffer) and advance building maintenance funds to settle long-term community service bills.",
    keywords: ["property pricing guide", "cost breakup", "taxes", "hidden charges", "floor rise", "preferential location charges", "stamp duties", "building maintenance funds", "property pricing guide – cost breakup, taxes & hidden charges"]
  },
  {
    projectId: "general",
    projectName: "Home Booking & Registration Guide – Documents, RERA Rules & Buyer Rights",
    category: "general",
    text: "Home Booking & Registration Guide – Documents, RERA Rules & Buyer Rights:\n- Documents Checklist: Inspect the official Commencement Certificate [CC], municipal approved layout blueprints, Kaveri/Dharani Online title encumbrances, the registered physical Sale Deed, and get a copy of the final Occupancy Certificate [OC].\n- Financial Mandates: Escrow compliance requires developers to keep 70% of buyer collections in a dedicated local account to protect progress.\n- Buyer Rights: Under RERA Section 14(3), the developer is legally bound to 5-year structural defect liabilities post possession, requiring them to repair structural or workmanship flaws for free.",
    keywords: ["home booking & registration guide", "documents", "rera rules", "buyer rights", "commencement certificate", "occupancy certificate", "encumbrances", "escrow compliance", "5-year structural defect liabilities", "home booking & registration guide – documents, rera rules & buyer rights"]
  },
  {
    projectId: "general",
    projectName: "Complete Home Loan Guide – Eligibility, EMI, Subvention & Tax Benefits",
    category: "general",
    text: "Complete Home Loan Guide – Eligibility, EMI, Subvention & Tax Benefits:\n- Debt Underwriting: Banks use Fixed Obligation to Income Ratio (FOIR) models to limit loan limits, meaning EMIs must rank under 45% to 55% of take-home salary.\n- Bureau check: A stellar CIBIL rating of 750+ secures lower mortgage margins and fast pre-approvals.\n- Funding structures: Subvention structures let developers pay loan interest during building milestones (saving rent+EMI stress). Pre-EMI accounts for interest-only sums during building phases, while full EMI starts post-possession.\n- Tax Benefits: Section 80C & Section 24(b) joint deductions let you save up to ₹1.5 Lakhs (principal) and ₹2 Lakhs (interest) annually, which are doubled if co-borrowing spouses register jointly under banks or bank programs.",
    keywords: ["complete home loan guide", "eligibility", "emi", "subvention", "tax benefits", "section 80c & section 24(b) joint deductions", "subvention structures", "bank programs", "complete home loan guide – eligibility, emi, subvention & tax benefits"]
  },
  {
    projectId: "general",
    projectName: "Mortgage Underwriting & FOIR Thresholds",
    category: "general",
    text: "Mortgage Underwriting & FOIR Thresholds:\n- FOIR Caps: Banks restrict total monthly obligations (new EMI + existing EMIs) using the Fixed Obligation to Income Ratio (FOIR). For net income under ₹50k, FOIR is capped at 50%. For net income between ₹50k and ₹1 Lakh, FOIR is capped at 50%. For net income between ₹1 Lakh and ₹2 Lakhs, the ceiling is 55%, and for high-earning individuals with over ₹2 Lakhs monthly income, the FOIR ceiling increases to 60%, allowing higher debt leverage.\n- Net EMI Capacity: The net monthly budget for a new EMI is calculated as: Gross Monthly Salary multiplied by FOIR Percentage, minus existing active monthly liabilities.",
    keywords: ["foir", "foir thresholds", "debt underwriting", "debt limit", "income ratio", "underwriting limit", "borrowing capacity"]
  },
  {
    projectId: "general",
    projectName: "CIBIL Bureau Ratings & Interest ROI Adjustments",
    category: "general",
    text: "CIBIL Bureau Ratings & Interest ROI Adjustments:\n- Super Prime Elite (Score >= 800): Qualifies for a rate discount of -20 basis points (-0.20% APR discount) on standard prime home loans and a 10% eligibility booster (1.10x multiplier) on maximum borrowing capacity.\n- Standard Prime (Score 750 to 799): Standard prime ROI applies (no premium or discount); full standard prime borrowing capacity (1.00x multiplier).\n- Marginal Prime (Score 700 to 749): Subject to a risk premium of +25 basis points (+0.25% APR premium) and a 10% safety haircut (0.90x multiplier) on dynamic loan eligibility.\n- Subprime Tier-2 (Score 650 to 699): Premium surcharge of +65 basis points (+0.65% APR premium) and a 30% safety haircut (0.70x multiplier) on borrowing size capacity.\n- Rejection Threshold: Any credit score under 650 is immediately declined by Tier-1 institutions and credit underwriters, disqualifying the applicant from standard home loan programs.",
    keywords: ["cibil", "cibil score", "credit score", "interest rate", "rate discount", "haircut", "booster", "multiplier", "rejection", "subprime", "prime rate"]
  },
  {
    projectId: "general",
    projectName: "Loan-To-Value (LTV) Downpayment Formula",
    category: "general",
    text: "Loan-To-Value (LTV) Downpayment Formula:\n- Standard Quota: Tier-1 lenders enforce an 80% Loan-To-Value (LTV) standard funding limit on residential real estate purchases. This triggers a base required downpayment of 20% on the property price.\n- Capacity Ceiling Cap: If the standard 80% LTV requested loan amount exceeds the applicant's maximum underwritten loan capacity (governed by FOIR and CIBIL outputs), the actual approved loan is capped at that ceiling limit. This requires the buyer to bridge the gap with an additional downpayment cash buffer in order to secure the home purchase.",
    keywords: ["ltv", "downpayment", "loan-to-value", "required downpayment", "cash buffer", "funding limit", "approved loan"]
  },
  {
    projectId: "prestige-solitaire",
    projectName: "Prestige Solitaire",
    category: "pricing",
    text: "Prestige Solitaire Approved Lenders & Loan Eligibility Details:\n- Principal Banks Approved: State Bank of India (SBI), HDFC Bank, ICICI Bank, Axis Bank, and LIC Housing Finance are fully tied up as official pre-approved partners.\n- Fast-track approvals: The project has a pre-approved RERA file status with national banks, reducing mortgage processing times to under 5-7 business days.\n- Standard Terms: Buyers with a CIBIL score of 750+ can qualify for a standard Loan-To-Value (LTV) of up to 80% with zero processing fees. Spouses of dual income can apply for joint loans under Section 80C and Section 24b of IT Act, which doubles standard loan eligibility thresholds up to 55% to 60% FOIR ceiling allocations.",
    keywords: ["loan", "eligibility", "loan eligibility", "bank approval", "sbi", "hdfc", "prestige solitaire bank partners", "pre-approval", "co-borrower"]
  },
  {
    projectId: "dlf-horizon",
    projectName: "DLF Horizon Residences",
    category: "pricing",
    text: "DLF Horizon Approved Lenders & Luxury Home Loan Eligibility Details:\n- Elite Bank Partners: Approved by HDFC Wealth Mortgages, SBI Retail Commercial, ICICI Wealth branch, Axis Wealth, and Standard Chartered.\n- Underwriting Criteria: Because it is a high-ticket luxury project, lenders strictly require a credit score of 750+ for prime rates. If CIBIL score is Super Prime >= 800, buyers unlock a premium -20 bps (0.20% APR discount) ROI discount and 1.10x borrowing capacity multiplier.\n- Loan-To-Value limits: Standard LTV is strictly 80% of registry value. Any valuation gap or preferential charges must be financed via downpayment cash resources. High-net-worth individuals can register joint applications, leveraging a maximum 60% FOIR ceiling allocation.",
    keywords: ["loan", "eligibility", "luxury loan", "bank approval", "cibil discount", "hdfc wealth", "sbi commercial", "hni mortgage"]
  },
  {
    projectId: "lodha-marina",
    projectName: "Lodha Splendora Marina",
    category: "pricing",
    text: "Lodha Splendora Marina Approved Lenders & Ready Possession Mortgage Eligibility Details:\n- Registered Lending Houses: ICICI Bank, State Bank of India (SBI), HDFC Bank, Axis Bank, Kotak Mahindra, and Union Bank.\n- Immediate funding advantages: Since Lodha Splendora Marina is completely Ready-To-Move-In with active Occupancy Certificates, buyers enjoy 0% GST (Zero GST). This increases overall borrowing efficiency and loan security since there is zero under-construction risk.\n- Ready Disbursal timelines: Sanction to disbursal takes only 3 to 5 business days since physical title checking is pre-vetted. Up to 80% LTV of agreement value is fully covered by SBI/ICICI programs for standard prime applicants.",
    keywords: ["loan", "ready possession loan", "bank approval", "gst saving", "disbursal timeline", "oc available", "icici mortgage", "sbi home loan"]
  },
  {
    projectId: "myhome-legend",
    projectName: "My Home Legend",
    category: "pricing",
    text: "My Home Legend Approved Lenders & Under-Construction Mortgage Eligibility Details:\n- Primary Bank Tie-ups: SBI Retail, HDFC Capital, ICICI Elite Mortgage, Union Bank of India, and Canara Bank.\n- Special subvention structures: Pre-approved for flexible 10:90 bank programs. Under builder subvention facilities, the builder handles mortgage interest payments until the possession date in March 2029, alleviating dual pressure of current rent and home loan EMIs.\n- Enhanced Joint Capability: Co-borrowing with a spouse enables a combined 60% FOIR cap and double tax deductions, maximizing borrowing boundaries for luxury sky villas starting from 2.90 Crores.",
    keywords: ["loan", "eligibility", "subvention program", "10:90 plan", "co-borrowing", "hyderabad sbi loan", "my home legend bank approvals"]
  }
];

/**
 * Searches property database chunks using highly precise TF-IDF and Cosine Similarity (Edge RAG / Local Grounding).
 * Always prioritizes project-specific assets over general knowledge based on query alignment.
 */
export function retrieveContextLexical(query: string, projectId?: string): string[] {
  const normalizedQuery = query.toLowerCase();

  // Basic filtering candidates: filter out other projects to avoid cross-contamination
  let candidates = RAG_DATA_CHUNKS;
  if (projectId) {
    const mentionsOtherProject = RAG_DATA_CHUNKS.some(chunk => 
      chunk.projectId !== projectId && 
      chunk.projectId !== "general" && 
      (normalizedQuery.includes(chunk.projectName.toLowerCase()) || 
       normalizedQuery.includes(chunk.projectId.toLowerCase()) || 
       normalizedQuery.includes("solitaire") || 
       normalizedQuery.includes("prestige") || 
       normalizedQuery.includes("horizon") || 
       normalizedQuery.includes("dlf") || 
       normalizedQuery.includes("splendora") || 
       normalizedQuery.includes("marina") || 
       normalizedQuery.includes("lodha") || 
       normalizedQuery.includes("legend") || 
       normalizedQuery.includes("my home") || 
       normalizedQuery.includes("myhome"))
    );
    
    if (!mentionsOtherProject) {
      candidates = RAG_DATA_CHUNKS.filter(chunk => chunk.projectId === projectId || chunk.projectId === "general");
    }
  }

  // Tokenization helper with list of common English stop words
  const STOP_WORDS = new Set([
    "the", "and", "a", "of", "to", "in", "is", "for", "on", "with", "at", "by", "an", "this", "it", "from", 
    "that", "as", "are", "be", "or", "your", "our", "us", "about", "how", "what", "where", "who", "which",
    "can", "will", "would", "should", "could", "all", "any", "no", "not", "some", "other"
  ]);

  function tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .split(/[^a-zA-Z0-9\-\u0c00-\u0c7f\u0900-\u097f]/) // Support English and Indian regional characters
      .map(t => t.trim())
      .filter(t => t.length > 1 && !STOP_WORDS.has(t));
  }

  // Segment query tokens
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) {
    // Standard default selection if query resolves entirely to stop words
    if (projectId) {
      return RAG_DATA_CHUNKS.filter(c => c.projectId === projectId).slice(0, 3).map(c => c.text);
    }
    return [];
  }

  // Corpora size constant
  const N = RAG_DATA_CHUNKS.length;

  // 1. Build Document Frequency map across all corpus documents
  const dfMap: Record<string, number> = {};
  RAG_DATA_CHUNKS.forEach(chunk => {
    const uniqueTokens = new Set<string>();
    
    // Process text
    tokenize(chunk.text).forEach(t => uniqueTokens.add(t));
    // Process keywords
    chunk.keywords.forEach(kw => {
      tokenize(kw).forEach(t => uniqueTokens.add(t));
    });
    // Process title name
    tokenize(chunk.projectName).forEach(t => uniqueTokens.add(t));

    uniqueTokens.forEach(t => {
      dfMap[t] = (dfMap[t] || 0) + 1;
    });
  });

  // 2. Pre-generate Inverse Document Frequency (IDF) weights for query tokens
  const idfMap: Record<string, number> = {};
  queryTokens.forEach(token => {
    const df = dfMap[token] || 0;
    idfMap[token] = Math.log(1 + N / (1 + df));
  });

  // 3. Compute Cosine Similarity scores over all compatible candidates
  const scoredCandidates = candidates.map(chunk => {
    const chunkTf: Record<string, number> = {};
    
    // Add text tokens (std weight = 1.0)
    tokenize(chunk.text).forEach(t => {
      chunkTf[t] = (chunkTf[t] || 0) + 1.0;
    });

    // Add keywords (boosted weight = 5.0 for high matching precision)
    chunk.keywords.forEach(kw => {
      tokenize(kw).forEach(t => {
        chunkTf[t] = (chunkTf[t] || 0) + 5.0;
      });
    });

    // Add project/manual title name (extremely high weight = 8.0)
    tokenize(chunk.projectName).forEach(t => {
      chunkTf[t] = (chunkTf[t] || 0) + 8.0;
    });

    // Query TF calculation
    const queryTf: Record<string, number> = {};
    queryTokens.forEach(t => {
      queryTf[t] = (queryTf[t] || 0) + 1.0;
    });

    // Cosine similarity computation
    let dotProduct = 0;
    let queryNormSq = 0;
    let docNormSq = 0;

    const uniqueQueryTokens = Array.from(new Set(queryTokens));
    uniqueQueryTokens.forEach(token => {
      const idf = idfMap[token] || 1.0;
      const qWeight = queryTf[token] * idf;
      const dWeight = (chunkTf[token] || 0) * idf;

      dotProduct += qWeight * dWeight;
      queryNormSq += qWeight * qWeight;
    });

    // Calculate document magnitude
    const allDocTokens = Object.keys(chunkTf);
    allDocTokens.forEach(token => {
      const df = dfMap[token] || 0;
      const idf = Math.log(1 + N / (1 + df));
      const dWeight = chunkTf[token] * idf;
      docNormSq += dWeight * dWeight;
    });

    const queryNorm = Math.sqrt(queryNormSq);
    const docNorm = Math.sqrt(docNormSq);

    let similarity = 0;
    if (queryNorm > 0 && docNorm > 0) {
      similarity = dotProduct / (queryNorm * docNorm);
    }

    // --- STRATEGIC BOOSTING LAYERS ---
    let finalScore = similarity;

    // Detect if query is explicitly searching for general glossary/guide topics
    const isVastuQuery = normalizedQuery.includes("vastu") || normalizedQuery.includes("shastra") || normalizedQuery.includes("gate") || normalizedQuery.includes("cardinal") || normalizedQuery.includes("kitchen") || normalizedQuery.includes("bedroom") || normalizedQuery.includes("alignment") || normalizedQuery.includes("facing") || normalizedQuery.includes("agni") || normalizedQuery.includes("nairutya") || normalizedQuery.includes("brahmasthan");
    const isNriQuery = normalizedQuery.includes("nri") || normalizedQuery.includes("fema") || normalizedQuery.includes("abroad") || normalizedQuery.includes("overseas") || normalizedQuery.includes("repatriat") || normalizedQuery.includes("agricultural") || normalizedQuery.includes("tds") || normalizedQuery.includes("tax") || normalizedQuery.includes("dtaa") || normalizedQuery.includes("remit") || normalizedQuery.includes("remittance");
    const isConstructionQuery = normalizedQuery.includes("construction") || normalizedQuery.includes("quality") || normalizedQuery.includes("mivan") || normalizedQuery.includes("formwork") || normalizedQuery.includes("seismic") || normalizedQuery.includes("steel") || normalizedQuery.includes("civil") || normalizedQuery.includes("inspection");
    const isFinanceQuery = normalizedQuery.includes("foir") || normalizedQuery.includes("down payment") || (normalizedQuery.includes("emi") && !normalizedQuery.includes("home loan")) || normalizedQuery.includes("finance");
    const isPricingGuideQuery = normalizedQuery.includes("pricing guide") || normalizedQuery.includes("cost breakup") || normalizedQuery.includes("hidden charges") || normalizedQuery.includes("floor rise") || normalizedQuery.includes("plc") || normalizedQuery.includes("preferential") || normalizedQuery.includes("stamp dut") || normalizedQuery.includes("maintenance fund");
    const isBookingGuideQuery = normalizedQuery.includes("booking") || normalizedQuery.includes("registration guide") || normalizedQuery.includes("commencement") || normalizedQuery.includes("cc") || normalizedQuery.includes("occupancy") || normalizedQuery.includes("oc") || normalizedQuery.includes("encumbrance") || normalizedQuery.includes("escrow") || normalizedQuery.includes("defect liabilit");
    const isHomeLoanQuery = normalizedQuery.includes("home loan") || normalizedQuery.includes("eligibility") || normalizedQuery.includes("subvention") || normalizedQuery.includes("80c") || normalizedQuery.includes("24b") || normalizedQuery.includes("joint deduction") || normalizedQuery.includes("bank program");

    const queryHasGeneralTopic = isVastuQuery || isNriQuery || isConstructionQuery || isFinanceQuery || isPricingGuideQuery || isBookingGuideQuery || isHomeLoanQuery;

    // Prioritize project-specific chunks over general guide pages
    if (chunk.projectId !== "general") {
      if (projectId && chunk.projectId === projectId) {
        // High boost for active project-specific details
        finalScore *= 5.0;
      } else {
        // Moderate boost for other project listings
        finalScore *= 2.5;
      }
    } else {
      if (queryHasGeneralTopic) {
        // Boost generic glossary chunks if they are the direct target of the user query
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
          finalScore *= 3.0;
        } else {
          finalScore *= 1.2;
        }
      } else {
        // Heavy penalty to prevent generic guides from polluting project-specific inquiries
        finalScore *= 0.05;
      }
    }

    // Category exact word matchmaking boosters
    if (chunk.category === "pricing" && (normalizedQuery.includes("price") || normalizedQuery.includes("cost") || normalizedQuery.includes("bhk") || normalizedQuery.includes("pricing") || normalizedQuery.includes("pricing guide") || normalizedQuery.includes("buying") || normalizedQuery.includes("crore") || normalizedQuery.includes("lakh") || normalizedQuery.includes("breakup"))) {
      finalScore *= 1.4;
    }
    if (chunk.category === "rera" && (normalizedQuery.includes("rera") || normalizedQuery.includes("licens") || normalizedQuery.includes("approv") || normalizedQuery.includes("rights") || normalizedQuery.includes("registration"))) {
      finalScore *= 1.4;
    }
    if (chunk.category === "possession" && (normalizedQuery.includes("possession") || normalizedQuery.includes("handover") || normalizedQuery.includes("timeline") || normalizedQuery.includes("ready") || normalizedQuery.includes("when"))) {
      finalScore *= 1.4;
    }

    return { chunk, score: finalScore };
  });

  // Sort and filter chunks that are genuinely relevant using rigid partitioning
  let prioritizedMatches = scoredCandidates.filter(match => match.score > 0.01);

  if (projectId) {
    const activeMatches = prioritizedMatches.filter(m => m.chunk.projectId === projectId);
    const generalMatches = prioritizedMatches.filter(m => m.chunk.projectId === "general");
    const otherMatches = prioritizedMatches.filter(m => m.chunk.projectId !== projectId && m.chunk.projectId !== "general");

    // Sort partitions individually by score
    activeMatches.sort((a, b) => b.score - a.score);
    generalMatches.sort((a, b) => b.score - a.score);
    otherMatches.sort((a, b) => b.score - a.score);

    // Reassemble matches: active project-specific details are given absolute dominance at the top
    prioritizedMatches = [...activeMatches, ...generalMatches, ...otherMatches];
  } else {
    prioritizedMatches.sort((a, b) => b.score - a.score);
  }

  if (prioritizedMatches.length > 0) {
    return prioritizedMatches.map(match => match.chunk.text).slice(0, 3);
  }

  // --- FAILS-SAFE PRESERVATION FALLBACK ---
  if (projectId) {
    const projectChunks = RAG_DATA_CHUNKS.filter(chunk => chunk.projectId === projectId);
    if (projectChunks.length > 0) {
      const categoryPriority: Record<string, number> = { "pricing": 1, "rera": 2, "location": 3, "possession": 4, "amenities": 5 };
      const sortedProjectChunks = [...projectChunks].sort((a, b) => {
        const priorityA = categoryPriority[a.category] || 99;
        const priorityB = categoryPriority[b.category] || 99;
        return priorityA - priorityB;
      });
      return sortedProjectChunks.slice(0, 3).map(chunk => chunk.text);
    }
  }

  return [];
}

/**
 * Primary asynchronous semantic similarity retriever.
 * Invokes the server-side transformer-based semantic similarity scoring system (all-MiniLM-L6-v2) for rich query matches.
 * Strictly guarantees that active project-specific details take strict primacy over general glossary guides.
 */
export async function retrieveContext(query: string, projectId?: string): Promise<string[]> {
  try {
    const response = await fetch("/api/semantic-retrieve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, projectId }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && !data.useFallback && Array.isArray(data.results)) {
        console.log("🧬 Transformer-based Semantic Similarity search yielded:", data.results.length, "hits");
        return data.results;
      }
    }
  } catch (err) {
    console.warn("⚠️ Client failed to reach semantic retrieve API, falling back to local priority-partitioned search:", err);
  }

  // Fallback to purely client-side priority-partitioned engine
  console.log("🪵 Semantic API unavailable, executing client-side priority-partitioned fallback.");
  return retrieveContextLexical(query, projectId);
}
