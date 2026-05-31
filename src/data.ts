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
  }
];

/**
 * Searches property database chunks for match similarity (Edge RAG / Local Grounding).
 * A perfect, lightweight, free keyword scoring similarity algorithm.
 */
export function retrieveContext(query: string, projectId?: string): string[] {
  const normalizedQuery = query.toLowerCase();
  
  // Filter by projectId first if specified
  let candidates = RAG_DATA_CHUNKS;
  if (projectId) {
    candidates = RAG_DATA_CHUNKS.filter(chunk => chunk.projectId === projectId);
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
