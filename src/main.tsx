import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// ─── DevTools Console Signature ─────────────────────────────────────────────
const ART = `
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

console.log(
  `%c${ART}`,
  "font-family:monospace;font-size:8px;line-height:1.3;color:#6B3A99;font-weight:bold;"
);
console.log(
  "%c  مرحباً أيها المبرمج الفضولي، أنت رائع  ",
  [
    "background:linear-gradient(135deg,#6B3A99,#D63384)",
    "color:#fff",
    "font-size:15px",
    "font-weight:bold",
    "padding:10px 28px",
    "border-radius:999px",
    "font-family:Cairo,sans-serif",
    "letter-spacing:1px",
  ].join(";")
);
console.log(
  "%c  Bani Swief Technological University · Anti-Violence Unit  ",
  [
    "background:#1a1a2e",
    "color:#c084fc",
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
