import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Code } from "lucide-react";
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
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed z-[71] inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg m-auto max-h-[calc(100vh-2rem)] md:max-h-[85vh] bg-card rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col"
            style={{ maxWidth: "min(calc(100vw - 2rem), 32rem)" }}
          >
            {/* Header with photo */}
            <div className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 px-5 py-4 flex items-center gap-4 shrink-0">
              <button onClick={dismiss} className="absolute top-3 left-3 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                <X className="h-3.5 w-3.5" />
              </button>
              <div className="relative shrink-0">
                <img
                  src={developerPhoto}
                  alt="محمد أيمن - المطور"
                  className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover border-2 border-white/30 shadow-lg"
                />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="absolute -top-1 -left-1 w-5 h-5 md:w-6 md:h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-card"
                >
                  <Code className="h-2.5 w-2.5 md:h-3 md:w-3 text-white" />
                </motion.div>
              </div>
              <div className="text-white">
                <h2 className="text-base md:text-xl font-bold">محمد أيمن محمد سلطان</h2>
                <p className="text-white/80 text-[11px] md:text-sm">Full-Stack Developer & IT Specialist</p>
              </div>
            </div>

            {/* Content */}
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

              <Button onClick={dismiss} className="w-full bg-gradient-brand font-bold h-10 rounded-xl text-sm">
                ابدأ الاستكشاف
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WelcomeModal;
