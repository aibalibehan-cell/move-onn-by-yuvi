# Move ONN — Design System & Engineering Architecture

> **Platform:** Move ONN (Next-Generation Career, Hiring & Talent Ecosystem)  
> **Engineering Model:** 100% Ground-Up Custom Implementation (Zero external framework dependencies, zero template residue)  
> **Author & Design Lead:** Yuvi  
> **Revision:** 2026 Enterprise Edition  

---

## 1. Architectural Philosophy & Principles

Move ONN is architected from absolute scratch to deliver an enterprise-grade, high-velocity career platform and hiring ecosystem. Unlike generic templates or monolithic frameworks, every layout, interaction model, state layer, and visual component in Move ONN was engineered specifically for low-latency performance, pixel-precise touch responsiveness, and bulletproof multi-device stability.

### Core Engineering Directives:
1. **Zero Template / Zero Framework Bloat:**  
   Every style rule, responsive breakpoint, modal manager, drawer animation, and data synchronization pipeline is built with pure, modern vanilla web standards (HTML5, CSS3, modern ES6+ JavaScript).
2. **Deterministic Layout Stability (Zero Cumulative Layout Shift / Zero FOUC):**  
   Pre-paint state hydration executes synchronously in the document `<head>` to compute user authentication, avatar geometry, active workspace views, and navigation drawers prior to first paint.
3. **Extreme Viewport Resilience (250px - 4K displays):**  
   The entire interface is fluidly responsive across extreme narrow mobile screens (`250px x 554px`) up to ultra-wide desktop monitors, guaranteeing zero text clipping, zero button overflow, and zero unwanted horizontal scroll sliding.
4. **Professional SaaS Visual Standard:**  
   Strict zero-emoji policy across all interfaces, crisp scalable vector iconography (SVGs), single authoritative currency formatting (Indian Rupee `₹`), and enterprise color hierarchy.

---

## 2. Design Tokens & Visual Hierarchy

### 2.1 Color Palette
```
Primary Brand Blue:     #0f5acf  (Dynamic primary actions, headers, active tabs)
Cyan Accent Gradient:   #0ccbe8  (Interactive accents, glow states, modern visual highlights)
Deep Navy Neutral:      #0a3d91  (Hero backdrops, high-contrast containers)
Background Surface:     #f8fafc  (Workspace backgrounds, subtle surface tint)
Card Surface:           #ffffff  (Elevated cards, dialog modals, interactive drawers)
Dark Slate Text:        #0f172a  (Primary typography, section headings, card titles)
Muted Secondary Text:   #64748b  (Metadata, timestamps, subtle subtitles)
Border Subtle:          #e2e8f0  (Card borders, dividers, form element outlines)

Status Tokens:
- Active / Verified:    #10b981  (Active jobs, verified profiles, active recruiter tags)
- Attention / Boost:    #f59e0b  (Sponsorship badges, high-visibility alerts)
- Destructive / Alert:  #ef4444  (Remove recruiter, withdraw requisition, delete actions)
```

### 2.2 Typography Hierarchy
- **Primary Typeface:** Move ONN Sans (`font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;`)
- **Scale:**
  - Hero Display: `32px` - `42px` (Font-weight: 800, line-height: 1.15)
  - Section Headings: `22px` - `26px` (Font-weight: 800)
  - Card Titles / View Headers: `16px` - `18px` (Font-weight: 700)
  - Body Copy: `14px` - `15px` (Font-weight: 400 - 500, line-height: 1.5)
  - Metadata / Pills / Form Labels: `11px` - `12px` (Font-weight: 700, letter-spacing: 0.3px)

---

## 3. Modular Platform Architecture

The platform comprises 8 bespoke modules engineered to operate as a cohesive distributed application:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        MOVE ONN PLATFORM CORE                         │
├──────────────────────────────────┬─────────────────────────────────────┤
│        CANDIDATE SUITE           │           EMPLOYER SUITE            │
├──────────────────────────────────┼─────────────────────────────────────┤
│ 1. index.html   (Hero & Gateway) │ 5. hire.html    (Employer Landing)  │
│ 2. jobs.html    (Search Stream)  │ 6. employer-dashboard.html (SaaS)   │
│ 3. companies.html (Company Hub)  │    ├── Jobs Management Table        │
│ 4. salaries.html (Pay Calculator)│    ├── Multi-Stage ATS Pipeline     │
│ 7. profile.html (Candidate Hub)  │    ├── AI Smart Sourcing Engine     │
│ 8. countries.html (Global Reach) │    ├── Real-Time Recruiter Chat     │
│                                  │    └── Visual Pipeline Analytics    │
└──────────────────────────────────┴─────────────────────────────────────┘
```

### Module Breakdown:

1. **`index.html` (Candidate Gateway):**  
   Unified search capsule (Job Title, Location, Experience level), dynamic category pills, curated featured jobs feed, verified employer showcase, and personalized resume upload state.
2. **`jobs.html` (Job Search & Application Engine):**  
   Instant client-side filter engine, candidate subtab categories, responsive card listings, and 1-Click Quick Apply flow.
3. **`companies.html` (Enterprise Directory):**  
   Filterable employer catalog, corporate culture insights, and open vacancy discovery.
4. **`salaries.html` (Compensation Benchmark Hub):**  
   Role-based compensation calculator, tenure brackets, and transparent pay comparisons.
5. **`hire.html` (Employer Growth & Smart Sourcing):**  
   Recruiter acquisition funnel, interactive ROI calculator, multi-tier pricing plans, and modal-driven job posting flow.
6. **`profile.html` (Candidate Career Workspace):**  
   Profile completion meter, 1:1 aspect ratio avatar cropping tool, 4-stage application tracking system (`Saved`, `Applied`, `Interviews`, `Archived`), and WhatsApp-style Recruiter Chat hub.
7. **`employer-dashboard.html` (Enterprise SaaS Recruiter Workspace):**  
   Full-featured applicant tracking system with 5 interactive views: Open Jobs Requisitions Table, Drag-and-Drop candidate pipeline, AI Talent Sourcing Search, Recruiter Messaging Stream, and Recruitment Velocity Analytics.
8. **`countries.html` (Global Operations Directory):**  
   Multi-national regional routing directory for international expansion.

---

## 4. State Management & Interaction Engine

1. **Client-Side Unified State Layer (`js/common.js`):**  
   Coordinates authentication state (`moveonn_user`), user profile metadata, navigation drawer status, and modal focus traps without requiring bulky runtime libraries.
2. **Synchronous Pre-Hydration Scripts:**  
   Embedded directly into document headers, executing before the browser triggers layout computation:
   - Evaluates active identity.
   - Computes dynamic user initials / silhouette avatar.
   - Restores URL hash and view preferences (`#viewJobs`, `#viewPipeline`, etc.).
   - Prevents flash of unstyled content (FOUC).
3. **Universal Mobile Scroll Locking (`lockBodyScroll` / `unlockBodyScroll`):**  
   Cleanly preserves `window.pageYOffset`, freezes background movement on active modals or slide-out navigation drawers, and restores scroll position cleanly on dismissal.
4. **Mobile Browser History API Integration:**  
   Push-state listeners ensure that hardware / swipe back gestures cleanly dismiss modals and off-canvas drawers without unintentionally closing the application tab.

---

## 5. Mobile & Viewport Optimization Standards

- **Box Containment Guarantee:** No interactive element (buttons, badges, inputs, drop-downs) may exceed or breach the boundaries of its parent card.
- **Auto-Stacking Footers:** On screens `<= 360px` down to `250px`, multi-action footers transition from horizontal flex rows to full-width vertical stacks (`flex-direction: column !important; width: 100% !important; gap: 8px !important;`), ensuring tap targets of 38px+ to 44px+ with comfortable interior margins.
- **Concise Direct Placeholders:** All form inputs employ clear, crisp labels (`Job title`, `Job location`, `Required experience`, `Salary / CTC`) with zero parenthetical examples or extraneous text, guaranteeing 100% readability on compact devices.
- **Dynamic 100dvh Calculation:** Workspace layouts conform to dynamic viewport units (`100dvh`), accommodating mobile address bars without clipping bottom navigation or send message controls.

---

*Move ONN — Designed and Built From Scratch. Confidential & Proprietary.*
