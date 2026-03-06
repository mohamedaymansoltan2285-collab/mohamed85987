import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Smartphone, Share, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const isIOS = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

const isInStandaloneMode = () =>
  ("standalone" in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true) ||
  window.matchMedia("(display-mode: standalone)").matches;

const PWAInstallPrompt = ({ onDismiss }: { onDismiss: () => void }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    // Already installed as PWA — don't show
    if (isInStandaloneMode()) { onDismiss(); return; }

    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed) { onDismiss(); return; }

    const isIosDevice = isIOS();
    setIos(isIosDevice);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // On iOS, show the prompt after a short delay since `beforeinstallprompt` never fires
    let timer: NodeJS.Timeout | undefined;
    if (isIosDevice) {
      timer = setTimeout(() => setShow(true), 2500);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      if (timer) clearTimeout(timer);
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
          setDeferredPrompt(null);
          setInstalling(false);
          dismiss();
          return;
        }
      } catch (err) {
        console.error("Install prompt error:", err);
      }
      setDeferredPrompt(null);
      setInstalling(false);
      dismiss();
    }
    // iOS: the prompt is already showing iOS instructions inline — no redirect needed
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
                  className="text-sm text-muted-foreground mb-5 leading-relaxed"
                >
                  احصل على تجربة أفضل! ثبّت التطبيق على شاشتك الرئيسية للوصول السريع والاستخدام بدون إنترنت
                </motion.p>

                {/* iOS inline instructions */}
                {ios && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="bg-muted/60 rounded-2xl px-4 py-3 mb-5 text-right space-y-2"
                  >
                    <p className="text-xs font-bold text-foreground mb-1">خطوات التثبيت على iPhone / iPad:</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Share className="h-4 w-4 shrink-0 text-primary" />
                      <span>اضغط على زر المشاركة في شريط المتصفح</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MoreVertical className="h-4 w-4 shrink-0 text-primary" />
                      <span>اختر "إضافة إلى الشاشة الرئيسية"</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Download className="h-4 w-4 shrink-0 text-primary" />
                      <span>اضغط "إضافة" وسيظهر التطبيق فوراً</span>
                    </div>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex gap-3"
                >
                  {!ios && (
                    <Button
                      onClick={handleInstall}
                      className="flex-1 bg-gradient-brand font-bold h-12 rounded-xl shadow-lg text-base"
                      disabled={installing}
                    >
                      <Download className="ml-2 h-5 w-5" />
                      {installing ? "جاري التثبيت..." : "تثبيت الآن"}
                    </Button>
                  )}
                  <Button
                    onClick={dismiss}
                    variant="outline"
                    className={`h-12 rounded-xl ${ios ? "flex-1" : "px-5"}`}
                  >
                    {ios ? "حسناً، فهمت" : "ليس الآن"}
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PWAInstallPrompt;
