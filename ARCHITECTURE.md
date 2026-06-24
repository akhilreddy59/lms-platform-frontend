# Architectural Specification and Design Manifesto

This document establishes the definitive architectural blueprints, data patterns, state lifecycles, and software engineering standards for the LMS Frontend application.

---

## 1. Core Architectural Paradigms

The application architecture relies on three primary software engineering paradigms to ensure strict decoupling, fast performance, and code reuse.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Component-Driven UI Architecture            │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Downstream Props Flow)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Unidirectional Data Pipelines               │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Virtual DOM Mounts)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│              Single Page Application Routing (SPA)          │
└─────────────────────────────────────────────────────────────┘
```

### Component-Driven Architecture (CDA)
The user interface is treated as a composition of isolated, modular, and single-responsibility functional components. Components are designed defensively to encapsulate their internal layout engines while relying on clear, predictable input APIs (Props).

### Unidirectional Data Flow
Data streams down through the system through strict parent-to-child hierarchies. State updates are never shared sideways between siblings. Instead, updates bubble upward via explicit callback events or structured event dispatchers. This makes state transitions highly predictable and easy to debug.

### Single Page Application (SPA) Routing Lifecycle
Client-side path management decouples the browser URL changes from server-side rendering pipelines. The application loads a single HTML shell, and a client router dynamically swaps view containers inside the browser DOM. This completely eliminates full-page reloads and flashes.

---

## 2. Multi-Layered Workspace Directory Architecture

The system segregates the codebase into explicit operational layers to keep presentation components independent from business logic.

```text
src/
├── assets/          # Presentational Assets: Raw styling, design tokens, web fonts, and structural SVGs
├── components/      # Atomic/Molecular UI: Pure, context-agnostic layout blocks completely decoupled from APIs
│   ├── common/      # Core design tokens: Typographies, Buttons, Form Inputs, skeleton loaders
│   └── feedback/    # System response wrappers: Modals, snackbars, and error alerts
├── pages/           # Ecosystem Views: Stateful container layouts tied directly to route path triggers
│   ├── Dashboard/   # Analytics overview grid for aggregated enrollment tracking data
│   ├── Courses/     # Catalog search engines, active lecture players, and syllabus trees
│   └── Profile/     # Settings configurations, identity verification, and earned certificate vaults
├── hooks/           # Business Logic Abstraction: Custom state machines handling re-usable platform workflows
├── services/        # Infrastructure Layer: Network request factories, interceptors, and data transformers
├── context/         # Global Shared State: Context providers mapping app-wide scopes like Auth and Themes
├── App.jsx          # Orchestration Layer: Global state provider nesting, error boundary mounts, and base route configurations
└── main.jsx         # Direct Compilation Entry: Mounts the React virtual DOM onto the root HTML tree node
```

---

## 3. Strict State Stratification Matrix

To prevent performance drops caused by excessive component re-renders, state management is strictly categorized by data scope and lifespan.

| State Category | Domain Scope | Primary Tooling | Operational Lifecycle Rules |
| :--- | :--- | :--- | :--- |
| **Ephemerally Local** | Single isolated component layout toggles. | `useState` | Purged instantly when the component unmounts from the active DOM tree. Used for input forms, dropdown states, and open tabs. |
| **Complex Functional** | Complex multi-stage changes inside a single view. | `useReducer` | Dispatched via structured actions to guarantee atomic, traceable changes. Used for heavy forms or nested data trees. |
| **Globally Pervasive** | App-wide cross-cutting data records. | React Context / Zustand | Maintained in memory throughout the entire active browser tab lifespan. Restrained to core data paths like User Authentication and Theme states. |
| **Server Cached** | Mirror copies of backend database responses. | React Query / SWR | Automated polling, smart stale caching, and lazy revalidation routines to minimize network request overhead. |

---

## 4. Component Lifecycle and Side-Effect Management

> [!IMPORTANT]
> Non-isolated side-effects trigger performance bottleneck vulnerabilities. Always clean up active subscriptions to avoid memory degradation.

Side-effects (such as API communication, timer initializations, and direct window event listeners) must adhere to strict lifestyle isolation policies:

* **Resource Disposal Enforcements:** Any setup inside a `useEffect` hook (such as an active WebSocket channel or window resize listener) **must** return an explicit cleanup function. This prevents memory leaks and background processing lag.
* **Primitive Dependency Arrays:** Dependency tracking arrays must exclusively target primitive types (`strings`, `numbers`, `booleans`). Passing unmemoized object literals or arrays as dependencies is forbidden to prevent endless infinite re-render loops.
* **Isolation of Render Pipelines:** Components must act as pure functions regarding their render output. Computations or data formatting transformations should never run directly within the body of the render pipeline; use `useMemo` or custom data maps instead.

---

## 5. Security and Data Protection Policies

The client-side architecture enforces defense-in-depth principles to safeguard user sessions and prevent layout exploits.

### Cross-Site Scripting (XSS) Sanitization
The application forbids using raw HTML string injection (e.g., `dangerouslySetInnerHTML`) unless text contents are explicitly sanitized via an AST parser like DOMPurify. This ensures user-generated course text cannot execute malicious scripts.

### Secure Token Transmission
Authentication tokens (JWTs) are handled through automated authorization headers managed by network request interceptors. Token payloads are never written directly into unsecured `localStorage` slots if sensitive PII data is present. Instead, they run via short-lived memory scopes or secure cookies.

---

## 6. Build Matrix and Optimization Controls

The compilation pipeline is heavily optimized via Vite and Oxlint to keep build sizes light and hot reload speeds instant.

* **Native ES Module Dev Server:** Vite eliminates server start bottlenecks by serving code directly via browser-native ESM execution blocks, bypassing traditional bundler assembly processes.
* **Production Code Splitting:** Rollup automatically isolates route-level views into separate chunks (dynamic chunk splitting). Users only download the specific visual files needed for the current URL route.
* **Dead Code Pruning (Tree-Shaking):** Static analysis during the `npm run build` lifecycle removes unused functions and modules from production code bundles.
* **Syntax Enforcement:** Oxlint checks the structural Abstract Syntax Tree (AST) before production compilation, catching performance issues, unhandled errors, and syntax anti-patterns.

---

## 7. Motion Systems, Gestures, and Animation Standards

To maintain an enterprise-grade user experience, all visual animations, transitions, and touch gesture interactions must adhere to strict performance and accessibility guidelines.

### Tooling Specification
* **Declarative Motion:** Framer Motion (Leveraged for hardware-accelerated, state-driven UI layout changes, exit/entry animations, and layout tracking).
* **Touch and Pointer Gestures:** `@use-gesture/react` or Framer Motion drag boundaries (Utilized for touch-optimized mobile actions like swipe-to-dismiss, carousel scrubbing, and panel drag handles).
* **Low-Level Transitions:** Standard CSS hardware-accelerated transitions reserved for simple structural states (e.g., hover states, color shifts, background interpolations).

### Execution Matrix and Performance Boundaries

> [!WARNING]
> Triggering browser layout reflows via layout-altering properties impacts frame rendering speed on low-tier mobile hardware.

To avoid triggering heavy browser layout calculations (reflows), motion logic must follow strict execution constraints:

1. **Hardware Acceleration Constraints:** Animations must strictly target compositor-only properties. Only animate `transform` (scale, translate, rotate) and `opacity`. Code must never animate layout-altering primitives like `width`, `height`, `margin`, or `top` unless explicitly bounded.
2. **GPU Ingestion Force:** Complex animated layouts or floating panels must explicitly invoke the system GPU using the CSS property `will-change: transform` or `will-change: opacity` to isolate paint operations to separate graphics layers.
3. **Framerate Degradation Prevention:** Any gesture tracker linked to pointer coordinates must never update raw React component state directly on every pixel change. Gesture updates must be debounced, throttled, or managed via hardware-linked references (such as Framer Motion's `useMotionValue`) to bypass React re-render passes entirely.

### Accessibility Constraints (A11y)

The UI must gracefully degrade for users with motion sensitivities by respecting system-level OS preferences. All complex layout motion sequences must check media queries and stop animations when needed:

```javascript
import { useReducedMotion } from "framer-motion";

// Implementation pattern within standard functional views
const shouldReduceMotion = useReducedMotion();
const animateProps = shouldReduceMotion ? { opacity: 1 } : { x: 100, opacity: 1 };
```

Every complex layout component must respect the CSS `@media (prefers-reduced-motion: reduce)` directive to immediately replace multi-axis scaling or translation sequences with absolute static fades or instant view cuts.

