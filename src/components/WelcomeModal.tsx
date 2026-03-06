import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Code, ExternalLink, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import developerPhoto from "@/assets/developer-photo.png";

const WelcomeModal = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("welcome-modal-seen");
    if (!seen) setShow(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem("welcome-modal-seen", "true");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70]"
            onClick={dismiss}
          />
          {/* Modal — centred on all screen sizes, capped so it never overflows */}
          <div className="fixed inset-0 z-[71] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="pointer-events-auto w-full max-w-lg bg-card rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col"
              style={{ maxHeight: "min(calc(100dvh - 2rem), 600px)" }}
            >
              {/* Header with photo */}
              <div className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 px-5 py-4 flex items-center gap-4 shrink-0">
                <button
                  onClick={dismiss}
                  className="absolute top-3 left-3 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <div className="relative shrink-0">
                  <img
                    src={developerPhoto}
                    alt="محمد أيمن - المطور"
                    className="w-16 h-16 rounded-xl object-cover border-2 border-white/30 shadow-lg"
                  />
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="absolute -top-1 -left-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-card"
                  >
                    <Code className="h-2.5 w-2.5 text-white" />
                  </motion.div>
                </div>
                <div className="text-white min-w-0">
                  <h2 className="text-base md:text-lg font-bold leading-tight">محمد أيمن محمد سلطان</h2>
                  <p className="text-white/80 text-[11px] md:text-xs mt-0.5">Full-Stack Developer & IT Specialist</p>
                  {/* Professional details */}
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5">
                    <span className="flex items-center gap-1 text-[10px] text-white/70">
                      <Briefcase className="h-2.5 w-2.5 shrink-0" />
                      مطور ويب لدى MaxMedia · القاهرة
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-white/70">
                      <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                      Freelancer
                    </span>
                  </div>
                </div>
              </div>

              {/* Content — scrollable so it never pushes outside viewport */}
              <div className="px-5 py-4 space-y-3 overflow-y-auto flex-1">
                <p className="text-sm text-foreground leading-relaxed">
                  أنا الطالب <strong>محمد أيمن محمد سلطان</strong>، قسم تكنولوجيا المعلومات والاتصالات.
                  تطوعت بوقتي وجهدي وعلمي لبناء هذا النظام الرقمي المتكامل لوحدة تكافؤ الفرص ومناهضة العنف ضد المرأة
                  بجامعة بني سويف التكنولوجية، إيمانًا مني بأهمية هذه القضية النبيلة — قضية المرأة.
                </p>

                <p className="text-sm text-foreground leading-relaxed">
                  بنيت هذا النظام بمنهجية <strong>الهندسة التجميعية (Engineering Assembly)</strong>، حيث جمعت أفضل المكتبات والأدوات مفتوحة المصدر المتاحة على الإنترنت وربطتها وكيّفتها مع قواعد البيانات لتعمل كمنظومة واحدة متكاملة:
                </p>

                <div className="text-xs text-muted-foreground leading-relaxed space-y-1">
                  <p>• <strong>الواجهة:</strong> React + TypeScript + Tailwind CSS + Framer Motion</p>
                  <p>• <strong>قاعدة البيانات:</strong> PostgreSQL + Row Level Security + Realtime</p>
                  <p>• <strong>البنية:</strong> Edge Functions + Auth + Storage + PWA</p>
                  <p>• <strong>الذكاء الاصطناعي:</strong> Chatbot ذكي متكامل للدعم والمساعدة</p>
                </div>

                {/* CTA buttons */}
                <div className="space-y-2 pt-1">
                  <Button
                    onClick={dismiss}
                    className="w-full bg-gradient-brand font-bold h-10 rounded-xl text-sm"
                  >
                    ابدأ الاستكشاف
                  </Button>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full h-9 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-accent transition-all"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    زيارة موقعي الشخصي
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WelcomeModal;
