# Voice-First Aura Real Estate Agent (V-FAREA)

An edge-native, voice-first real estate pre-sales engine designed to capture, qualify, and convert premium leads in real time. **Built for the Google Agentic Premier League and engineered to secure immediate buy-in from India’s top-tier developers & leasers** (e.g., DLF, Prestige Group, Macrotech/Lodha, Godrej Properties, and Brigade).

---

## 🏆 Why V-FAREA Wins the Google Agentic Premier League

Most real estate platforms are passive catalogs with static contact forms. **V-FAREA represents the transition from conversational interfaces to proactive Agentic actions:**

1. **Edge-Native Low Latency voice engine**: Leverages browser-native Speech Synthesis (TTS) and Recognition (STT) coupled with backend orchestration, minimizing API transport costs and ensuring ultra-fast responses that mimic natural speech.
2. **"LeadHot" Real-Time Interrogator Event System**: Continuously scores client interest based on behavioral triggers (e.g., viewing premium floor plans, downloading brochures, modifying unit configurations) and auto-triggers agentic voice responses like: *"I see you are highly interested! Let me dispatch our official RERA-compliant brochure directly to your WhatsApp."*
3. **CFO, Vastu & FEMA Localized Intelligence Engine**: Resolves the friction points that delay top-tier luxury acquisitions:
   - **CFO Desk**: Localized stamp duty, GST, and registration math customized dynamically for Maharashtra (MMR/Thane), Karnataka (Bengaluru), and Haryana (Gurugram/Noida).
   - **Vastu Compliance Evaluator**: Immediate astronomical path compliance check (North-East, South-East Agni alignments) with remedial advice.
   - **NRI FEMA Desk**: Instantly adapts UI guidelines to foreign remittance accounts (NRE/NRO/Direct Remit) to speed up international transactions.

---

## 🏢 Securing Indian Real Estate Developer Buy-In

To get buy-in from leading Indian developers and commercial leasers, we solve their most expensive problem: **Lead Dilution and High Cost-Per-Lead (CPL)**.

Currently, premium real estate leads take **4 to 24 hours** to receive a callback, resulting in a **70% drop in engagement**. V-FAREA engages users **within 3 seconds** while they are looking at the page:

* **Eliminate Callback Latency**: Turns website visits into live voice consultations.
* **Instant RERA Transparency**: Pre-loads RERA registration IDs, possession states, and exact tax breakdowns (GST standard versus possession-ready exemptions).
* **Frictionless VIP Scheduling**: Integrates interactive calendar booking on the spot.

---

## 🚀 Interactive Feature Walkthrough

### 🎤 1. Low-Latency Voice-Bot Widget
Engage with an intelligent agent via speech. Toggle the microphone to converse about real-estate configurations, possession timelines, and VIP bookings.

### 📊 2. Real-Time Lead Monitor
View behavioral telemetry in a specialized executive dashboard. Tracks lead score multipliers, live active sessions, and direct call-to-action metrics (such as `LeadHot` events).

### 📐 3. CFO & Vastu Suite
* **CFO Finance Desk**: Performs exact EMI breakdowns based on current SBI/HDFC interest rates (7.5% - 11.0%) and includes mandatory **Section 194-IA 1% TDS deductions** for properties valued above ₹50 Lakh.
* **Vastu Compliance Scorer**: Allows users to select entrance/kitchen orientations and gives compliance ratings with traditional brass and copper pyramid remediation strategies.
* **NRI Desk**: Handles FEMA-ready compliance declarations and repatriation checks.

### 📱 4. Automated WhatsApp VIP Handoff
Proactively launches a customized WhatsApp confirmation script with official RERA documents and meeting invites when user activity crosses the high-commitment scoring threshold.

---

## 🛠️ GitHub Push Instructions

Follow these instructions to push this codebase directly to your own GitHub repository:

### Step 1: Open the Terminal & Initialize Git
In your local command line, navigate to this project's root folder:
```bash
git init
```

### Step 2: Add Your Remote GitHub URL
Create a new blank repository on [github.com](https://github.com). Copy the remote repository URL and run:
```bash
git remote add origin git@github.com:iammohith/Voice-First-Aura-Real-Estate-Agent-V-FAREA.git
```

### Step 3: Add Files & Make Your First Commit
```bash
git add .
git commit -m "feat: complete V-FAREA Agentic voice-first real estate suite"
```

### Step 4: Rename Branch & Push
```bash
git branch -M main
git push -u origin main
```

---

## 🏗️ Technical Architecture & Environment Configuration

The workspace is configured as a full-stack, production-ready build:
* **Frontend**: React 18+ (bundled with Vite), styled using custom Tailwind utility classes, utilizing premium layout transitions via Framer Motion.
* **Backend**: Express container server configured on Port `3000` to bind to `0.0.0.0`, serving Vite middleware in development and compiling cleanly to `dist/server.cjs` for lightning-fast container cold-starts.
* **TypeScript Quality**: Configured with strict compiler parameters: `tsc --noEmit`.

To compile the application locally:
```bash
# Install NPM dependencies
npm install

# Run the Development server
npm run dev

# Bundle and Compile production artifacts
npm run build

# Start production server
npm start
```
