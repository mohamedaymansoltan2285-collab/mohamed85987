import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// ─── DevTools Console Signature ─────────────────────────────────────────────

// English ASCII banner (kept as-is, small)
const EN_ART = `
███╗   ███╗ ██████╗ ██╗  ██╗ █████╗ ███╗   ███╗███╗   ███╗███████╗██████╗
████╗ ████║██╔═══██╗██║  ██║██╔══██╗████╗ ████║████╗ ████║██╔════╝██╔══██╗
██╔████╔██║██║   ██║███████║███████║██╔████╔██║██╔████╔██║█████╗  ██║  ██║
██║╚██╔╝██║██║   ██║██╔══██║██╔══██║██║╚██╔╝██║██║╚██╔╝██║██╔══╝  ██║  ██║
██║ ╚═╝ ██║╚██████╔╝██║  ██║██║  ██║██║ ╚═╝ ██║██║ ╚═╝ ██║███████╗██████╔╝
╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝     ╚═╝╚══════╝╚═════╝
 █████╗ ██╗   ██╗███╗   ███╗ █████╗ ███╗   ██╗
██╔══██╗╚██╗ ██╔╝████╗ ████║██╔══██╗████╗  ██║
███████║ ╚████╔╝ ██╔████╔██║███████║██╔██╗ ██║
██╔══██║  ╚██╔╝  ██║╚██╔╝██║██╔══██║██║╚██╗██║
██║  ██║   ██║   ██║ ╚═╝ ██║██║  ██║██║ ╚████║
╚═╝  ╚═╝   ╚═╝   ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝`;

// Arabic name — very large, light violet so it's clearly readable
const AR_NAME = "محمد أيمن محمد سلطان";

console.log(
  `%c${EN_ART}`,
  [
    "font-family:monospace",
    "font-size:8px",
    "line-height:1.3",
    "color:#c084fc",        // light violet — easy on the eyes
    "font-weight:bold",
    "text-shadow: 0 0 8px #a855f7",
  ].join(";")
);

// Arabic name — very large, gradient-ish via background trick isn't supported in console,
// so use a bright pastel colour with a big font size
console.log(
  `%c${AR_NAME}`,
  [
    "font-family:'Cairo','Segoe UI',sans-serif",
    "font-size:36px",
    "font-weight:900",
    "color:#e879f9",          // bright fuchsia-pink — visible & beautiful
    "letter-spacing:4px",
    "text-shadow:0 2px 12px #a21caf",
    "line-height:1.6",
    "padding:4px 0",
    "display:block",
  ].join(";")
);

// Tagline badge
console.log(
  "%c  مطور ويب · MaxMedia Cairo · Freelancer  ",
  [
    "background:#581c87",
    "color:#f0abfc",
    "font-size:13px",
    "font-weight:700",
    "padding:8px 24px",
    "border-radius:999px",
    "font-family:'Cairo',sans-serif",
    "letter-spacing:2px",
  ].join(";")
);

// Sub-badge
console.log(
  "%c  جامعة بني سويف التكنولوجية · وحدة تكافؤ الفرص  ",
  [
    "background:#0f172a",
    "color:#a78bfa",
    "font-size:11px",
    "font-weight:600",
    "padding:5px 18px",
    "border-radius:999px",
    "font-family:monospace",
    "letter-spacing:2px",
  ].join(";")
);

// ────────────────────────────────────────────────────────────────────────────

createRoot(document.getElementById("root")!).render(<App />);
