# Move ONN Frontend Architecture & Development Standards
**Permanent Project Directive & Architectural Governance**

---

## 1. Core Engineering Principles

### 1.1 Thorough Root-Cause Investigation
- **Deep Code Tracing Before Action:** Always trace the exact DOM structure, CSS cascade inheritance, specificity conflicts, and JavaScript event bindings prior to making code modifications.
- **Strict Prohibition of Visual Quick-Hacks:** Under no circumstances should bugs be patched using superficial hacks such as `display: none !important`, `position: absolute`, hardcoded pixel shifts, arbitrary `z-index: 99999999`, or negative margins to conceal layout errors.
- **Architectural Cleanup:** Cleanly eliminate or replace legacy, dead, or conflicting CSS/JS structures rather than layering compensatory overrides on top of existing broken code.

### 1.2 Zero Regression Policy
- **Cross-Form-Factor Invariance:** A fix or optimization introduced for mobile viewports (320px–425px) must NEVER degrade or break tablet (768px–1024px) or desktop (1280px–1440px+) layouts, and vice versa.
- **State Integrity:** Interactions in one authentication state (logged in vs. logged out) must remain completely isolated and must never cause layout collapse or element leaking in the other state.
- **Continuous Viewport Verification:** All UI modules must be systematically verified across standard responsive breakpoints:
  - Small Mobile: `320px`
  - Standard Mobile: `375px`
  - Large Mobile: `425px`
  - Tablet Portrait: `768px`
  - Tablet Landscape / Small Desktop: `1024px`
  - Desktop / Widescreen: `1440px`

### 1.3 Proactive Autonomous Thinking (Principal Frontend Architect Standard)
- **Proactive Edge-Case Anticipation:** Act with the mindset of a Principal Frontend Architect. Anticipate edge cases across all viewports without needing explicit prompting for every screen size.
- **Touch Targets & Accessibility:** Ensure all mobile interactive elements have a minimum touch target area of `44x44px` with adequate touch padding (`pointer-events: auto`).
- **Layout Stability & CLS:** Prevent Cumulative Layout Shift (CLS). Reserve explicit dimensions for logos, headers, banners, cards, and modal dialogs so that async scripts or dynamic content do not cause jarring page jumps.

---

## 2. Client Technical Constraints & Modular Architecture

### 2.1 Modular File Structure
- **No Monolithic Stylesheets:** Do NOT dump all CSS into a single catch-all file. Maintain dedicated, neatly structured CSS and JS files for each page:
  - `css/common.css`: Shared design tokens, reset, typography, utilities, and modal system.
  - `css/header.css`: Single unified responsive navigation bar.
  - `css/footer.css`: Shared universal footer.
  - `css/homepage.css`: Home page specific components (hero, search, trending categories).
  - `css/jobs.html`, `css/companies.css`, `css/salaries.css`, `css/hire.css`: Respective page styles.
  - Corresponding modular JS scripts matching the same page separation.

### 2.2 Single Unified Responsive Navbar
- **No Duplicated Navigation Elements:** Strictly avoid maintaining two separate navigations (e.g. one for desktop and a separate duplicated one for mobile).
- **Unified Navigation Component:** Maintain a single, robust responsive navbar that adapts seamlessly from mobile hamburger drawer/accordion to desktop horizontal link row using standard responsive CSS.

### 2.3 Local Offline Bootstrap Structure
- **Local CSS Architecture:** Use local, offline Bootstrap styling structures, utility classes, and layout grid paradigms rather than fragile inline style overrides or unstable external CDN dependencies.

### 2.4 Responsive Authentication Popup Modal
- **Modal-Based Auth Flow:** Instead of navigating away to heavy standalone sign-in/sign-up pages, implement user authentication via a smooth, accessible, responsive popup modal that functions flawlessly on both mobile and desktop.

### 2.5 Brand Consistency & Palette
- **Logo Harmony:** Reflect the Move ONN brand identity across all pages derived from the official logo shades:
  - Primary Brand Royal Blue: `#0f5acf` / `#1264e8` (matching the Move arrow and attire)
  - Hover / Dark Blue: `#0c47a4` / `#0a3d8f`
  - Vibrant Cyan Swirl Accent: `#0ccbe8` / `#00b4d8`
  - Warm Accent (Amber / Tan / Orange): `#ea580c` / `#e65100` (matching the walker's portfolio and accents)
  - Clean Off-White / Soft Sky Tint: `#ffffff`, `#f8fafc`, `#ebf5fb`
  - Consistent typography using clean, modern Sans-serif standards.

### 2.6 Zero Data Shift & Zero Stale Data Flash on Refresh Policy
- **Strict Email-Scoped Account Storage:** Never fall back to unscoped global keys (`localStorage.getItem(k)`). All personalized account state (name, title, contact, resume, avatar) MUST be strictly scoped via `key__${email}`.
- **Silhouette-First Avatar Policy:** If the logged-in candidate has not uploaded a custom profile photo, render ONLY the neutral SVG silhouette icon. Never render an `<img>` tag or display someone else's image on page refresh.
- **Zero Cross-User Data Shift:** When refreshing any page, the rendered data must be 100% deterministic and instantaneous. No data may shift, flicker, or rename for even a millisecond.

### 2.7 Multi-Device & Mobile Responsiveness Standard
- **Universal Device Comfort:** All pages—including Candidate Profile Dashboard (`profile.html`), Employer Portal (`hire.html`), and all modal dialogs—must be fluidly responsive across all devices:
  - Small Mobile: `320px–375px`
  - Standard Mobile: `375px–480px`
  - Tablet Portrait & Landscape: `600px–991px`
  - Desktop & Widescreen: `1024px–1440px+`
- **Touch-Friendly Controls:** Ensure all inputs, select boxes, and action buttons have at least `44px` touch targets, responsive text wrapping, zero horizontal scrollbar overflow, and clean responsive paddings.

### 2.8 Strict Clean UI & Button Aesthetics
- **No Unnecessary Ticks or Glyphs:** Primary action buttons (such as "Publish Job Post") must remain clean, modern, and uncluttered without unnecessary tick icons that degrade visual presentation.
- **Zero Dummy "e.g." Placeholders:** All form placeholders must maintain professional, production-grade instructions without "e.g." or "example" prefixes.

### 2.9 Mobile Carousel, Draggable Quick Navigation & Viewport Clipping Prevention
- **Fluid Sliding & Drag Support:** Mobile horizontal tab bars (such as candidate dashboard quick navigation) and category carousels must support frictionless sliding via touch gestures (`touch-action: pan-x pan-y !important;`) and mouse click-and-drag listeners for desktop testing and DevTools.
- **Accessible Slide Navigation:** Provide accessible left & right chevron controls for guaranteed 1-tap horizontal scrolling.
- **Active Element Centering:** When any navigation tab is clicked or selected, it must smoothly scroll into view (`scrollIntoView({ inline: 'center' })`).
- **Zero Viewport Clipping:** All timeline items, resume cards, score boxes, and preference grids must enforce wrapping (`word-break: break-word;`, `flex-direction: column` on mobile) to guarantee that no card borders, text, or buttons are ever pushed off-screen or clipped at the viewport edge.

---

## 3. Collaboration Context & Engineering Workflow

- **Directives from Gemini & User:** The user collaborates directly with Gemini to formulate clear engineering directives.
- **Role of Antigravity:** Act as an exceptionally perceptive, reliable, and rigorous technical executor. Thoroughly analyze the codebase before proposing or writing code, provide clear architectural rationales, protect the codebase from regressions, and await explicit user confirmation before executing changes to application files.

### 3.1 Critical Evaluation & Safety Guardrails for Gemini Prompts
- **Independent Critical Examination:** When the user provides an execution prompt written by Gemini, Antigravity must never execute it blindly. Thoroughly audit every instruction against the active codebase, existing UI stability, and project standards.
- **Zero-Regression Safeguard:** If a prompt contains suggestions that could cause visual regressions, dismantle working dashboards, re-introduce code duplication, or compromise mobile responsiveness, immediately flag the issue, protect the existing code, and execute the clean, architecturally superior approach.
- **Permanent Alignment:** Preserve all validated features (such as Candidate Profile Dashboard, 70/70 integrity test coverage, scoped storage, and modular design) as untouchable baselines unless explicit enhancement is demanded.

### 3.2 Move ONN Recruiter Architecture & Candidate Loop Governance
- **Dynamic Identity Synchronization:** Recruiter portals (`employer-dashboard.html`) and Candidate hubs (`profile.html`) must dynamically reflect the active authenticated user from `localStorage.getItem('moveonn_user')`. Hardcoding dummy enterprise names, fake admins, or disconnected identities is strictly prohibited.
- **No Cluttered Duplicate CTA Buttons:** Primary actions (such as "+ Post a Job") must have a single authoritative placement. Avoid duplicating the same primary CTA 3 times across headers, rails, and table toolbars.
- **Collapsible Rail Navigation:** Desktop recruiter sidebars must support seamless collapsing into a compact 68px icon rail and expanding into a full 240px labeled rail, with state persisted in `localStorage`.
- **Zero Layout Shift / Header Jitter:** Pages with dynamic table filters or tabbed views of varying heights must enforce `scrollbar-gutter: stable;` and 100% width on header containers to eliminate horizontal jitter when switching views.
- **Candidate Messages Hub Standard:** Messages in `profile.html` must feature folder categorization (`Inbox`, `Archive`, `Spam`), real-time `● Online` presence, and full management controls (`Accept Invite`, `Decline`, and `Delete Conversation` with confirmation modal).
- **Move ONN 4-Tabs Application System:** Candidate "My Jobs" must organize requisitions into 4 distinct tabs: `Saved`, `Applied`, `Interviews`, and `Archived`. Users must have real controls to 1-Click Apply, Unsave, Withdraw Applications (with modal confirmation), and join scheduled Google Meet video screenings.

### 3.3 Zero Emojis Policy, Sticky Independent Sidebar Rail & WhatsApp-Style Communication Standard
- **Strict Zero Emojis Policy:** Unicode emojis (such as ✏️, 👥, ⏸️, ▶️, ⭐, ⚡, 🗑️, 📅, 💰, 📍) are strictly prohibited across recruiter workspaces and dashboards. All actions and indicators must utilize clean, professional inline SVG icons and crisp SaaS typography.
- **Independent Sticky Sidebar Rail:** The left navigation rail (`.jt-emp-rail`) must be permanently fixed with `height: 100vh; overflow-y: auto;` while the main work area (`.jt-emp-main-area`) scrolls independently (`height: 100vh; overflow-y: auto;`). Scrolling content inside Jobs, Candidates, Sourcing, or Analytics must NEVER scroll or shift the sidebar rail.
### 3.4 Zero-FOUC Avatar Pre-Hydration, Recruiter Decoupling & Single-Scrollbar Standards
- **Instant Zero-FOUC Avatar Pre-Hydration:** Candidate avatars must be pre-hydrated instantly before DOM paint using both `<head>` pre-hydration and immediate inline scripts at the avatar container. Scoped keys must sanitize email addresses (`.replace(/[^a-z0-9]/g, '_')`) and match across both synchronous inline scripts and async controller engines to eliminate any split-second silhouette flashing on page refresh.
- **Candidate Multi-Email Account Migration Protocol:** When a candidate edits their email address via the profile modal, the system must atomically mirror all profile data, avatar images, and membership tiers to the new scoped identifier, preventing data loss or fallback resets on subsequent visits.
- **Candidate Messages Hub Dynamic Folder Select:** The folder select dropdown pill (`#jtCandFolderSelect`) must dynamically synchronize its option counter (`Inbox (${count})`) whenever conversations are deleted, accepted, or declined, with full state persisted in `localStorage`.
- **Enterprise Recruiter Identity Decoupling:** The Employer Workspace (`employer-dashboard.html`) represents the enterprise hiring team and must feature dedicated recruiter credentials (e.g. Vikram Malhotra, Talent Acquisition Lead, `recruiter@moveonn.com`), strictly decoupled from any candidate job seeker session (`moveonn_user`). Applicants appear exclusively within ATS pipelines and candidate chats.
- **Employer Workspace Single Sleek Scrollbar Standard:** In the recruiter workspace, `html.jt-emp-html` and `body.jt-emp-body` enforce `overflow: hidden !important;`, ensuring that only the main workspace area (`.jt-emp-main-area`) scrolls with a custom 6px sleek scrollbar, completely eliminating nested or double scrollbars.

### 3.5 Universal Modal Headroom, Zero Header Sticking, Complete Background Scroll Lock & Chat Input Integrity Standards
- **Zero Header Sticking & Guaranteed Headroom:** Under NO circumstances may any modal dialog open sticking to, touching, or tucking underneath the top navigation header bar ("header mein chipak kar khulna"). All modal backdrops (`.jt-emp-modal-backdrop`, `.jt-photo-modal-backdrop`, `.jt-edit-prof-backdrop`, `.jt-plans-modal-backdrop`, etc.) must enforce `position: fixed; inset: 0; width: 100vw; height: 100vh; z-index: 100050 !important;` to ensure they sit cleanly above fixed navigation headers (`z-index: 99999 !important;`). Backdrops must enforce flexbox centering with generous padding (`padding: 40px 16px;` on desktop/tablet, `padding: 24px 14px;` on mobile) and `overflow-y: auto; overscroll-behavior: contain;`.
- **Responsive Modal Containment & Internal Scrolling:** Modal dialog cards (`.jt-emp-modal-card`, `.jt-modal-dialog-wrap`) must enforce `margin: auto !important; max-height: calc(100vh - 80px); display: flex; flex-direction: column; overflow: hidden;` with card headers and footers set to `flex-shrink: 0;` and modal bodies (`.jt-emp-modal-body`) set to `overflow-y: auto; flex: 1 1 auto;`. This guarantees that on any screen size (from 320px mobile to 4K widescreen), the modal is vertically centered, has at least 40px of breathing room from the screen edge, and never overflows out of bounds.
- **Universal Strict Background Scroll Locking:** Whenever ANY modal opens (including About Recruiter, Delete Resume, Clear Chat, Delete Conversation, Withdraw Application, and Employer Modals), background page scrolling must be immediately and completely locked on both `document.documentElement` and `document.body` via `lockBodyScroll()` (`overflow: hidden !important; touch-action: none !important; overscroll-behavior: none !important;`). Chaining touch gestures and mouse-wheel events outside the modal card must be prevented. Closing the modal must atomically restore background scrolling via `unlockBodyScroll()`.
- **Chat Input & Circular Send Button Structural Integrity:** Chat input rows across both candidate and employer hubs must enforce non-squishing flex boundaries. Input fields (`.jt-cand-chat-text`, `.jt-chat-input`) must define `flex: 1 1 0%; min-width: 0; max-width: 100%;` so that long continuous unbroken strings cannot expand the container or distort sibling elements. Send action buttons (`.jt-btn-cand-send`, `.jt-btn-chat-send`) must enforce `flex-shrink: 0; width: 38px; height: 38px; min-width: 38px; min-height: 38px; border-radius: 50%;` to permanently preserve their circular geometry and clickable hit targets across all viewports.

### 3.6 Multiline Auto-Expanding Chat Textareas, Mobile Single-Screen Drilldown, "Remove Recruiter" Action & Dedicated Mobile Workspace Header
- **Multiline Auto-Expanding Chat Textarea Standard (Gemini/ChatGPT Standard):**
  Single-line `<input type="text">` elements are strictly forbidden in both Candidate Chat (`profile.html`) and Employer Chat (`employer-dashboard.html`). All chat inputs must use a `<textarea rows="1">` that automatically expands vertically as text is typed or pasted, up to `max-height: 120px`, with a custom sleek 5px scrollbar (`::-webkit-scrollbar`). Input containers must align items to `flex-end` so the circular send button anchors cleanly at the bottom. Pressing `Enter` sends the message immediately; pressing `Shift + Enter` inserts a newline. Upon submission, textarea height immediately resets to its single-line baseline (`auto`).
- **Reciprocal Terminology: "Remove Recruiter" & "Remove Candidate":**
  In candidate messages (`profile.html`), the 3-dot dropdown menu and its confirmation modal must use **"Remove Recruiter"** (never "Delete Conversation"). This provides symmetrical parity with the employer portal's **"Remove Candidate"** action.
- **Mobile Single-Screen Drilldown Chat Standard (< 768px / < 900px):**
  Dual-stacked mobile chat containers (where the conversations thread list and the chat stream are simultaneously squeezed vertically on mobile viewports) are strictly prohibited. Mobile chat MUST operate as a single-screen drilldown:
  1. *State 1 (Default):* Full-width thread conversations list (100% width and height). Chat dialogue panel is hidden.
  2. *State 2 (Active Chat):* When a thread is selected, the container switches to `.mobile-chat-active`, hiding the threads list and presenting the chat dialogue panel at 100% width and height.
  3. A dedicated mobile back button (`#jtCandChatBackBtn`, `#jtEmpChatBackBtn`) appears in the header with a `← Back` icon to return seamlessly to State 1.
- **Dedicated Employer Single Mobile Header (< 900px) & Full-Screen Mobile Drawer:**
  1. On mobile viewports (< 900px), a dedicated top navigation bar (`.jt-emp-mobile-header`) displays the clean Move ONN logo, active view badge (`#jtEmpMobActiveViewBadge`), and hamburger menu toggle (`#jtEmpMobMenuBtn`). The redundant text "Employer Suite", the "+ Post" button, and secondary horizontal sub-navigation tabs (`.jt-emp-mobile-tabs`) are strictly removed to eliminate double-header clutter.
  2. Clicking the hamburger menu opens a **100% full-screen mobile drawer** (`.jt-emp-mob-drawer-panel`: `100vw x 100vh`) with the authenticated user profile card, a prominent **"+ Post a Job"** primary button, workspace view links, and portal switchers.
  3. Modals sit at `z-index: 100050 !important;` with frosted dark backdrop and `padding: 40px 16px; margin: auto !important;` to ensure complete vertical headroom.

### 3.7 Universal Silhouette Avatar Fallback & Zero Box Overflow Standard
- **Strict Universal Silhouette Avatar Fallback (No Initials Policy):**
  When a candidate or recruiter has not uploaded a custom profile picture, initials letters (such as "SC", "AM", "first letter and last letter") are strictly forbidden. The system must render the universal SVG silhouette avatar (`<svg viewBox="0 0 24 24"><path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z" /></svg>`) with neutral circle background (`#e2e8f0`) across both candidate profile and employer dashboard.
- **Strict Zero Box Overflow & Mobile Card Containment (< 768px):**
  On mobile screens (320px - 400px), no buttons, select dropdowns, or metadata chips may ever spill outside the card border ("dibbe ke bahar jana").
  1. In ATS Candidates view, candidate action bars (`.jt-cand-card-actions`) transform to `flex-direction: column; align-items: stretch; gap: 10px;`.
  2. The stage select dropdown (`.jt-cand-stage-select`) expands to 100% width.
  3. Action buttons (`.jt-cand-action-group`) take 100% width, splitting evenly (50%/50%) between Resume and Message buttons.
  4. In Requisitions view, candidate pipeline chips and sourcing search inputs enforce `box-sizing: border-box; max-width: 100%; overflow: hidden;`.
- **Unrestricted Touch & Mouse Chat Scrolling:**
  The messages stream (`.jt-chat-stream`) must never be locked by outer parent `overflow: hidden`. It must enforce `-webkit-overflow-scrolling: touch; overscroll-behavior: contain; overflow-y: auto !important;` so users can seamlessly scroll through message history on any device.

### 3.8 Mobile Viewport 290px Containment, Zero Horizontal Sliding & Zoom Prevention Standard
- **Strict Viewport Containment Down to 290px:**
  All pages and workspaces must remain 100% contained within the viewport without horizontal sliding ("website slide hona bilkul mana hai"). Root elements `html.jt-emp-html, body.jt-emp-body`, `.jt-emp-workspace`, `.jt-emp-main-area`, and view containers enforce `width: 100% !important; max-width: 100vw !important; overflow-x: hidden !important;`.
- **Locked Mobile Zoom:**
  `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">` must be enforced to prevent accidental pinch-zooming and screen stretching.
- **Sub-Header Filter Tabs & Search Fluidity:**
  Requisition filter tabs (`.jt-status-tabs`) and search inputs (`.jt-table-search-wrap`) must flex-shrink evenly (`flex: 1 1 0 !important; min-width: 0 !important;`) on narrow viewports (<= 768px, <= 360px, down to 290px), ensuring every pill ("Active 3 | Paused 1 | Closed 1") fits inside the frame with zero clipping.
- **Accidental Text Selection Suppression on Mobile UI:**
  Mobile interactive containers, navigation bars, drawer panels, status tabs, stage chips, cards, and buttons enforce `-webkit-user-select: none; user-select: none; -webkit-touch-callout: none;` and `touch-action: pan-y;` to eliminate accidental drag highlights and swipe displacement.

### 3.9 Zero-Animation Instant Data Stability & Messages Clutter Elimination Standard
- **Zero-Animation Policy on Initial Paint & Refresh:**
  Data indicators, strength meters, and toggle switches must NEVER animate or shift upon page load, refresh, or tab navigation. An animated meter or toggle gives the false perception that "data badal raha hai".
- **Profile Strength Meter 100% Instant Baseline:**
  `.jt-strength-bar` must define `width: 100%;` and `transition: none !important;` in CSS and synchronous pre-hydration. It must never start at 78% and slide to 100%.
- **Recruiter Search Visibility Toggle Zero-Flash Baseline:**
  `.jt-toggle-slider` must define default active green (`#16a34a`) and knob position (`left: 23px;`) in CSS without transitions on load, accompanied by instant synchronous DOM pre-hydration. The toggle must never flash from OFF (grey) to ON (green) when loading or switching between sections.
- **Elimination of Clutter Folder Dropdown in Candidate Messages:**
  The secondary folder dropdown (`Inbox (3) / Archive / Spam`) is permanently eliminated from the visible Messages & Recruiter Invites card header per explicit client command ("ye cheez hoga hi nahi, dashboard wale section se hata do").

### 3.10 WhatsApp-Style Message Selection, Long-Press Touch & Delete Confirmation Parity Standard
- **Universal Delete Confirmation Enforcement:**
  Selecting messages and clicking the Trash action must NEVER immediately delete messages without confirmation. A dedicated WhatsApp-style confirmation modal (`#jtCandDeleteMsgModal` in `profile.html`, `#jtEmpDeleteMsgModal` in `employer-dashboard.html`) must always be presented.
- **Symmetrical "Delete for Everyone" vs. "Delete for Me":**
  1. *All Outgoing:* If all selected messages were sent by the active user (`sender === 'me'`), the dialog displays both **"Delete for everyone"** (replacing message text with neutral deleted marker and icon) and **"Delete for me"** (removing from user's view).
  2. *Incoming Present:* If any selected message was received from the other party, only **"Delete for me"** is displayed.
- **Mobile Touch Long-Press Standard:**
  Both Candidate and Employer hubs implement 500ms touch-and-hold (`touchstart`, `touchmove`, `touchend`) detection with optional haptic vibration (`navigator.vibrate(40)`) to seamlessly trigger WhatsApp-style message selection on mobile touch devices.

### 3.11 Mobile Drawer Employer Portal Navigation & Search Dropdown Flush-Left Alignment Standard
- **Direct Mobile Access to Employer Portal & Pricing:**
  1. *Mobile Off-Canvas Drawer (`#jtMobileDrawer`):* Both authenticated users and guest visitors must have immediate, prominent 1-tap buttons to access the Employer Portal (`hire.html`) directly inside the top drawer profile/auth card (`.jt-drawer-auth`).
  2. *Navigation Links Parity:* The mobile drawer links (`.jt-drawer-links`) across all pages must explicitly feature both **"Employer Portal"** (`hire.html`) and **"Pricing & Plans"** (`hire.html#pricing`) with distinct chevron icons, guaranteeing that mobile users are never blocked or left searching for pricing and employer features.
  3. *Desktop Header Direct Action:* Desktop navigation actions (`.jt-nav-actions`) must include the persistent `.jt-btn-hire` ("Employers / Post Job") link across all public pages for seamless cross-navigation.
- **Search Experience Level Dropdown Flush-Left Alignment:**
  1. *Flush-Left Alignment on Mobile:* On small screen devices and responsive mobile layouts (<= 992px, <= 768px, <= 480px), all search bar inputs—including the Experience Level selector—must expand to 100% width (`width: 100% !important; max-width: 100% !important;`) and align strictly flush to the left (`justify-content: flex-start !important; text-align: left !important;`).
  2. *Zero-Centering Policy for Dropdowns & Icons:* The Experience selector container, its briefcase SVG icon, and text option label must NEVER float or center horizontally in the search card. They must sit at the exact same left-indent as keyword and location inputs.

### 3.12 Universal Indian Rupee Currency Standard & Non-Editable Fixed Currency Affix Governance
- **Zero Dollar Symbol Policy for Indian CTC & Compensation:**
  Whenever salary, CTC, or pricing is presented in Indian Rupees (`₹`), icons and symbols must exclusively display the Indian Rupee symbol or SVG (`path: M6 3h12M6 8h12M6 13l8.5 8M6 13h3a4.5 4.5 0 0 0 0-9H6`). Dollar signs (`$`) must NEVER be used next to Indian Rupee figures.
- **Non-Editable Fixed Currency Affix Standard in Forms:**
  In candidate and profile edit dialogs (such as Current Annual CTC in `profile.html`), the currency sign (`₹`) must NOT be an editable character within the input field. It must be rendered as a non-editable, un-selectable fixed input-group prefix addon (`.jt-rupee-fixed-addon`). The input field itself contains only the numeric/text amount (e.g. `24 LPA Current CTC`). When persisted, the application automatically sanitizes and prepends the Rupee symbol, preventing accidental symbol corruption or dollar intrusion.

### 3.13 Mobile Drawer Single-Item Pricing & Workspace Direct Routing Standard
- **Direct Workspace Routing for Authenticated Employers:**
  When a logged-in user clicks "Employer Portal" in the mobile drawer profile card (`.btn-jt-employer-drawer`) or desktop user dropdown, it must route DIRECTLY to the SaaS Employer Workspace (`employer-dashboard.html`), bypassing marketing landing pages.
- **Drawer Navigation List De-duplication:**
  The mobile drawer navigation list (`.jt-drawer-links`) must NEVER contain redundant duplicate items. The bottom list features a single dedicated entry for **"Pricing & Plans"** (`hire.html#pricing`), while workspace access is handled via the top user profile card.
- **Single Plus Icon Standard on Workspace CTAs:**
  Workspace drawer buttons (e.g. `#jtDrawerPostJobBtn`) must feature only a single plus indicator (`+ Post a Job`), strictly preventing duplicate glyph stacking (`+ + Post a Job`).

### 3.14 Universal Mobile Scrollability, Viewport Height (100dvh) & Hardware Back Button Integrity Governance
- **Dynamic Viewport Height (`100dvh`) & Bottom Padding Protection:**
  Mobile workspace layouts must utilize `100dvh` (dynamic viewport height) rather than static `100vh` to account for collapsing mobile browser address and navigation bars. The main scroll area (`.jt-emp-main-area`) must include generous bottom padding (`padding-bottom: 96px to 100px`) and `overflow-y: auto !important; -webkit-overflow-scrolling: touch !important; touch-action: pan-y !important;` to ensure every bottom element (e.g. Analytics distribution charts, candidate cards) can be scrolled into view without clipping.
- **Zero Window Touchmove Blocking:**
  Aggressive `window.addEventListener('touchmove', ... e.preventDefault())` listeners that suppress native mobile inertial scrolling are strictly forbidden. Background scroll-locking is managed cleanly via `position: fixed` and `overflow: hidden` on the body when modals are active, permitting all drawers, panels, and modal cards to scroll freely on touch devices.
- **Sourcing Search Input Overflow Containment:**
  Sourcing search bars enforce `overflow: hidden !important; min-width: 0 !important;` on the container, and `flex: 1 1 0% !important; min-width: 0 !important; text-overflow: ellipsis !important; white-space: nowrap !important;` on the `<input>` element to guarantee that search text or placeholders never spill outside the input box boundary on any screen.
- **Mobile Browser & Hardware Back Button Integrity (History State Engine):**
  When mobile users navigate into nested views (e.g. active chat drilldowns, off-canvas drawers, or dialog modals), the application must synchronize with the History API (`history.pushState`). Pressing the phone's physical or gesture back button must smoothly dismiss the modal, close the drawer, or return from chat drilldown to the thread list, rather than ejecting the user from the application or website.

### 3.15 Universal Anti-Scroll-Freeze & Touchmove Architecture Standard (Zero Scroll Interruption)
- **Root-Cause Analysis of Mobile Scroll Jamming:**
  1. *Global Non-Passive Touch Interception:* Calling `e.preventDefault()` inside `window.addEventListener('touchmove', ...)` listeners that evaluate non-backdrop elements fatally crashes Chrome Android momentum gestures. Touchmove cancellation must be restricted strictly to inert translucent backdrop layers (`.jt-modal-backdrop`, `.jt-drawer-backdrop`, `.jt-emp-modal-backdrop`).
  2. *Inner Flex Child Scroll Blocking in Wheel Listeners:* When checking `isAtTop` and `isAtBottom` on an element matched via `e.target.closest()`, passing inner static child containers (such as `.jt-drawer-body` or `.jt-mobile-drawer`) causes `scrollTop + clientHeight >= scrollHeight - 1` to constantly evaluate to `true` (since inner flex children do not have independent scrollbars). This erroneously triggers `e.preventDefault()` on standard downward mouse-wheel scrolls. Inner children must never be in the scrollable element checklist, and wheel listeners should only prevent events on backdrops, allowing modern CSS `overscroll-behavior: contain !important;` to handle boundary isolation.
  3. *Static 100vh vs. Dynamic 100dvh Cut-Offs:* Mobile viewports on Android Chrome and iOS Safari dynamically resize by ~60px to ~80px as browser address and navigation bars collapse. Defining `height: 100vh;` pushes bottom UI elements (e.g. chat input fields, analytics distribution cards, drawer country switchers) below the visible screen. All mobile viewport containers must enforce `100dvh` flex columns with explicit safe-area padding (`padding-bottom: max(16px, env(safe-area-inset-bottom, 16px))` or `padding-bottom: 96px to 100px` for main scroll areas).
- **The 5 Immutable Rules of Mobile Scroll Integrity:**
  1. *Rule 1: Never Call `preventDefault()` on Inner Containers:* Any touch or wheel event originating inside `.jt-drawer-panel`, `.jt-emp-modal-card`, `.jt-chat-stream`, `.jt-cand-chat-messages`, or `.jt-emp-main-area` must NEVER be cancelled by JavaScript event handlers.
  2. *Rule 2: Touch-Action & Momentum Declaration:* All vertically scrollable containers and page root tags must explicitly declare `touch-action: pan-y !important;` and `-webkit-overflow-scrolling: touch !important;`.
  3. *Rule 3: Clean Scroll Lock / Unlock Symmetry:* `lockBodyScroll()` saves the exact `window.pageYOffset` and applies `position: fixed; width: 100%; top: -${scrollY}px; overflow: hidden;`. `unlockBodyScroll()` verifies that no other modals remain active before completely restoring `position`, `top`, `width`, `overflow`, and smoothly restoring the exact scroll position with zero layout shift.
  4. *Rule 4: Drawer Panel Boundary Protection:* Mobile drawers (`.jt-drawer-panel`) must enforce `overflow-y: auto !important; max-height: 100dvh;` with bottom padding (`padding-bottom: 80px to 100px;`) so the final link ("Change country: India") is immediately accessible without requiring extreme force-scrolling.
  5. *Rule 5: Zero Page-Level Overflow Clamping:* Marketing and content pages (such as `hire.html`, `index.html`, `jobs.html`) must enforce `overflow-y: auto !important; height: auto !important; min-height: 100dvh !important;` so that page content can scroll continuously down to the global footer.

### 3.16 Universal Zero-Emoji Policy & Single-Currency Governance
- **Strict Universal Elimination of All Emojis:**
  1. *Zero Emojis Across All User-Facing UI:* Under no circumstances should unicode emojis (e.g. 💻, 📈, 🧠, 🚀, ⚡, 📄, 🌐, 🇮🇳, 🇺🇸, etc.) be embedded in dropdown menus, `<option>` tags, buttons, badges, headings, metadata, or placeholders across any page of the platform. Emojis degrade enterprise SaaS aesthetic and make the application appear "cringe and AI-generated".
  2. *Monochrome & Theme-Aligned SVG Icons:* Whenever visual iconography is required (such as in calculators, role pickers, resume document previews, country selectors, or feature badges), use clean, crisp, theme-aligned vector SVGs (`stroke-width: 2`, matching `currentColor` or brand blues `#004687`/`#2557a7`).
  3. *Zero Emojis in Dynamic Templates & Modals:* JavaScript code generation, toast notifications, country pickers, and dynamic `innerHTML` templates must never inject unicode emojis or flag pictographs. Country badges render standard ISO codes (`IN`, `US`, `GB`) or localized text labels with SVG flags from `assets/flags/`.
- **Single Indian Rupee Symbol Governance (Strict Zero-Duplication Standard):**
  1. *Single Currency Glyph Invariance:* CTC, salary, and compensation displays must render strictly ONE currency symbol. When a UI element utilizes an inline Rupee SVG icon (`path d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3a4.5 4.5 0 0 0 0-9H6"`), the adjacent text element (e.g. `#jtProfCtcText`) MUST NOT prepend a textual `₹` or `$`.
  2. *Defensive Display Sanitization:* All hydration and edit-save routines must explicitly sanitize stored CTC strings with `.replace(/^[₹$\s]+/, '').trim()` before writing to DOM text nodes, guaranteeing that legacy or migrated storage keys never produce duplicate symbols (e.g. `₹ ₹24 LPA Current CTC`).
  3. *Modal Addon Separation:* In edit forms, the currency symbol is permanently fixed in an un-editable addon (`.jt-rupee-fixed-addon`), and the input value itself contains purely numeric and tenure descriptors (`24 LPA Current CTC`).

### 3.17 Universal Mobile Viewport (264px-414px+), Button Containment & Box Cushioning Governance
- **Universal Mobile Device Resilience (Extreme Viewport Support down to 264px):**
  1. *Zero Horizontal Page Overflow:* Across all 8 platform pages (`index.html`, `jobs.html`, `companies.html`, `salaries.html`, `hire.html`, `profile.html`, `employer-dashboard.html`, `countries.html`), in both guest and authenticated states, `document.documentElement.scrollWidth` must never exceed `window.innerWidth`.
  2. *Nested Container Padding Elimination:* Standard `.container` horizontal padding (15px or 16px) nested inside section containers (`.jt-*-section`) compounds on small screens, wasting up to 62px of horizontal space. At `<= 480px`, section container padding must flatten to 0, reclaiming screen real estate while maintaining clean edge clearance via the section boundary.
  3. *Zero Inflexible `min-width` Traps:* Elements like `.btn-jt-upload-resume`, `.jt-app-item-main`, tabs bars, and action containers must NEVER specify wide hardcoded `min-width` (e.g. `min-width: 220px`). All buttons, inputs, and flex children on mobile must enforce `min-width: 0 !important; max-width: 100% !important; word-break: break-word;` with fluid wrapping.
- **Button Placement & Box Cushioning Rules ("Kahin button dibba se bahar na jaye, dabba ke andar chipke na"):**
  1. *Complete Box Containment:* No button, badge, chip, or interactive control may ever overflow, escape, or protrude past its parent card, dialog, or drawer boundary.
  2. *Zero Edge Sticking / Collision:* Buttons must never touch or stick to card borders or adjacent elements. In compact footers or action rows (e.g. `.jt-featured-action-row`, `.jt-cand-action-group`, `.jt-app-item-actions`, `.jt-comp-card-actions`), buttons automatically transition from horizontal flex rows to full-width vertical stacks (`flex-direction: column !important; width: 100% !important; gap: 8px !important;`) on viewports `<= 360px` and `<= 420px`. This guarantees comfortable 44px+ touch targets with clean visual margins on all four sides.
### 3.18 Universal Concise Placeholder Standard & Ultra-Narrow Modal Responsiveness (Zero Truncation & Zero Example Pollutions)
- **Zero Example In Placeholders Policy:**
  1. *No Parenthetical Examples:* Under no circumstances should placeholders contain examples inside parentheses, such as `(Senior Backend Engineer)`, `(5-8 Years)`, `(Bengaluru, India or Remote)`, `(₹25L - ₹32L PA)`, `(City, State)`, `(or Remote)`, or `(comma separated)`. Such verbose strings inevitably truncate and get chopped off on narrow mobile viewports (`250px - 360px`).
  2. *Direct, Crisp Purpose Identification:* Placeholders must directly state what is expected in concise phrases: `Job title`, `Job location`, `Required experience`, `Salary / CTC`, `Full name`, `Mobile number`, `Email address`, `Skill name`. These compact strings fit completely within narrow input boundaries without truncation.
- **Ultra-Narrow Modal Dialog Responsiveness (Down to 250px):**
  1. *Backdrop & Card Padding Scaling:* On viewports `<= 360px` down to `250px`, modal backdrops enforce minimal exterior padding (`padding: 6px 4px !important;`) and modal cards enforce `width: calc(100% - 4px) !important; max-width: 100% !important; border-radius: 8px !important;` to maximize interior usable width (at least 238px on a 250px device).
  2. *Internal Padding Compression:* Modal header and form padding compresses to `10px 8px !important;` to prevent layout starvation.
  3. *Fluid Selects & Inputs:* Form controls enforce `font-size: 12px !important; min-width: 0 !important; width: 100% !important; box-sizing: border-box !important;`, and `<select>` dropdowns enforce `text-overflow: ellipsis !important;` to ensure select options and custom chevron arrows never overlap or stick to borders.
  4. *Vertical Button Stack in Footers:* Modal action buttons reverse into vertical full-width stacks (`flex-direction: column-reverse !important; width: 100% !important; gap: 6px !important;`), guaranteeing comfortable tap targets and zero edge collision.



