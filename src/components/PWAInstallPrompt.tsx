import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const PWAInstallPrompt = ({ onDismiss }: { onDismiss: () => void }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed) { onDismiss(); return; }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // Show anyway after 2s for iOS/browsers that don't fire the event
    const timer = setTimeout(() => {
      if (!dismissed) setShow(true);
    }, 2000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      clearTimeout(timer);
    };
  }, [onDismiss]);

  const handleInstall = async () => {
    if (deferredPrompt) {
      setInstalling(true);
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
          localStorage.setItem("pwa-install-dismissed", "installed");
        }
      } catch (err) {
        console.error("Install prompt error:", err);
      }
      setDeferredPrompt(null);
      setInstalling(false);
      dismiss();
    } else {
      // iOS fallback - redirect to install page for instructions
      dismiss();
      window.location.href = "/install";
    }
  };

  const dismiss = () => {
    localStorage.setItem("pwa-install-dismissed", "true");
    setShow(false);
    setTimeout(onDismiss, 400);
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            onClick={dismiss}
          />
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[61] p-4 md:p-6"
          >
            <div className="max-w-md mx-auto bg-card rounded-3xl shadow-2xl border border-border overflow-hidden">
              {/* Decorative top bar */}
              <div className="h-1.5 bg-gradient-brand" />
              
              <div className="p-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-20 h-20 mx-auto mb-4 bg-gradient-brand rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <Smartphone className="h-10 w-10 text-white" />
                </motion.div>
                
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl font-bold text-foreground mb-2"
                >
                  ثبّت التطبيق على جهازك
                </motion.h3>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm text-muted-foreground mb-6 leading-relaxed"
                >
                  احصل على تجربة أفضل! ثبّت التطبيق على شاشتك الرئيسية للوصول السريع والاستخدام بدون إنترنت
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex gap-3"
                >
                  <Button
                    onClick={handleInstall}
                    className="flex-1 bg-gradient-brand font-bold h-12 rounded-xl shadow-lg text-base"
                    disabled={installing}
                  >
                    <Download className="ml-2 h-5 w-5" />
                    {installing ? "جاري التثبيت..." : "تثبيت الآن"}
                  </Button>
                  <Button
                    onClick={dismiss}
                    variant="outline"
                    className="h-12 rounded-xl px-5"
                  >
                    ليس الآن
                  </Button>
                </motion.div>

                {/* iOS hint */}
                {!deferredPrompt && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-xs text-muted-foreground mt-4"
                  >
                    على iPhone: اضغط على زر المشاركة ↑ ثم "إضافة إلى الشاشة الرئيسية"
                  </motion.p>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PWAInstallPrompt;
