# SolarSathi — Claude Project Handoff & Context Document

> **Use this file as context when working with Claude.** You can upload this markdown file directly into Claude, attach it to a Claude Project, or copy-paste the starter prompt at the bottom into any chat.

---

## 📌 Project Overview
- **Project Name:** SolarSathi (Smart Renewable Energy Community Support & Solar Decision Dashboard)
- **Nature of App:** Client-side Single Page Application (SPA) designed as an interactive prototype for renewable energy awareness, financial calculations, rooftop assessment, and community support.
- **Target Audience:** Residential homeowners, community energy coordinators, and student project evaluators.
- **Hosting / Environment:** Vite local development server on Windows (can be deployed to Vercel/Netlify/GitHub Pages).

---

## 🛠️ Technology Stack
- **Framework:** React 19 (`react`, `react-dom`)
- **Build Tool:** Vite 8 (`vite`, `@vitejs/plugin-react`)
- **Language:** JavaScript (JSX) / TypeScript configuration
- **Icons:** `lucide-react`
- **Charts:** `recharts` (Area charts, Bar charts, Pie charts)
- **Styling:** Custom CSS Design System (`src/index.css`) featuring modern SaaS aesthetics, forest green palette (`#0f4a2d`, `#1a7a4a`, `#22a862`), glassmorphism, responsive grid cards, and badges.
- **Persistence:** Browser `localStorage` (no external database or paid APIs required).

---

## 📂 Project Structure

```
solarsathi/
├── index.html                   # HTML entry point with Inter Google font
├── package.json                 # Dependencies and build scripts
├── vite.config.js               # Vite bundler configuration
├── tsconfig.json                # TypeScript / JSX configuration
├── public/                      # Static assets
└── src/
    ├── main.jsx                 # React root mount point
    ├── App.jsx                  # Main layout: Sidebar, TopBar & active tab router
    ├── index.css                # Global CSS tokens, layout grid & card styles
    ├── components/
    │   ├── Sidebar.jsx          # Left navigation bar with active page indicator & badges
    │   └── TopBar.jsx           # Top header displaying page title and status badges
    └── pages/
        ├── Overview.jsx         # KPI stats, solar generation charts, recent complaints
        ├── SolarCalculator.jsx  # 6 inputs -> 7 outputs (payback, capacity, CO2, 25-yr savings)
        ├── InstallationAdvisor.jsx # Rooftop assessment & equipment recommendation wizard
        ├── AwarenessCenter.jsx  # Knowledge base, FAQs, and interactive 5-question quiz
        ├── ComplaintsSupport.jsx# Form with validation, ticket generator & localStorage
        ├── CommunitySurveys.jsx # Survey submission, rating widgets & community results
        └── AdminAnalytics.jsx   # Metrics, issue category breakdowns & resolution charts
```

---

## 🧮 Core Business Logic & Formulas

### 1. Solar Calculator (`src/pages/SolarCalculator.jsx`)
Inputs:
- Monthly Consumption (`kWh`, default `300`)
- Tariff Rate (`₹/kWh`, default `₹8`)
- Usable Roof Area (`sq. ft.`, default `500`)
- Total Budget (`₹`, default `₹2,00,000`)
- Daily Sun Hours (`hrs`, default `5`, India average: 4–6)
- Installation Cost per kW (`₹`, default `₹50,000`)

Formulas:
1. **Capacity by Energy Demand:**
   $$\text{Capacity}_{\text{demand}} = \frac{\text{Monthly Consumption}}{\text{Sun Hours} \times 30 \times 0.80}$$
2. **Capacity by Rooftop Area:**
   $$\text{Capacity}_{\text{roof}} = \frac{\text{Roof Area}}{100} \quad \text{(assuming 100 sq ft per kW)}$$
3. **Capped Capacity:**
   $$\text{System kW} = \min(\text{Capacity}_{\text{demand}}, \text{Capacity}_{\text{roof}}, \frac{\text{Budget}}{\text{Cost/kW}})$$
4. **Monthly Generation:**
   $$\text{Gen}_{\text{monthly}} = \text{System kW} \times \text{Sun Hours} \times 30 \times 0.80$$
5. **Monthly & Annual Savings:**
   $$\text{Savings}_{\text{monthly}} = \min(\text{Gen}_{\text{monthly}} \times \text{Tariff}, \text{Current Bill})$$
   $$\text{Savings}_{\text{annual}} = \text{Savings}_{\text{monthly}} \times 12$$
6. **Payback Period:**
   $$\text{Payback (Years)} = \frac{\text{System kW} \times \text{Cost/kW}}{\text{Savings}_{\text{annual}}}$$
7. **$\text{CO}_2$ Reduction (India Grid Factor: 0.82 kg/kWh):**
   $$\text{CO}_2 \text{ (Tonnes/yr)} = \frac{\text{Gen}_{\text{monthly}} \times 12 \times 0.82}{1000}$$

---

### 2. Complaints & Support Logic (`src/pages/ComplaintsSupport.jsx`)
- **Ticket ID Format:** `SS-XXXX` (random 4-digit code)
- **Local Storage Key:** `'ss_complaints'`
- **Validation:** Name required, Location required, Description minimum 10 characters.
- **Photo Handling:** Photos are previewed in-session via `URL.createObjectURL`, but stripped (`photo: null`) prior to serializing into `localStorage` to avoid quota overflow and broken expired blob URLs.
- **Status Types:** `'Open'` (red), `'In Progress'` (yellow), `'Resolved'` (green).

---

## ⚡ How to Run the Project

```bash
# 1. Install dependencies
npm install

# 2. Start local dev server (default: port 5173)
npm run dev

# 3. Production build check
npm run build
```

---

## 💬 Ready-to-Use Prompt to Copy-Paste into Claude

```markdown
Hi Claude! I am working on "SolarSathi", a React 19 + Vite web prototype for a smart community solar dashboard and decision support system.

The project is currently working and builds with zero errors. It features 7 core pages:
1. Overview (KPIs, generation charts)
2. Solar Calculator (system capacity, savings, payback, CO2 estimation)
3. Installation Advisor (rooftop suitability wizard)
4. Awareness Center (educational guides & interactive quiz)
5. Complaints & Support (ticket submission, inline validation, localStorage persistence)
6. Community Surveys (feedback submission & analytics)
7. Admin Analytics (resolution metrics & distribution charts)

Tech Stack: React 19, Vite, Recharts, Lucide-React, Vanilla CSS design system.
Styling: Forest green (#0f4a2d, #1a7a4a) SaaS dashboard theme.

Please review the attached project handoff document and tell me what tasks we can work on next, such as:
1. Adding the PM Surya Ghar Muft Bijli Yojana government subsidy calculator.
2. Generating downloadable PDF / print summary reports for solar calculations.
3. Adding a Dark Mode / Light Mode toggle.
4. Preparing deployment scripts for Vercel or GitHub Pages.
```
