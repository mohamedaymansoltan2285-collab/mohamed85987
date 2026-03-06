import { motion } from "framer-motion";
import { Download, Smartphone, WifiOff, Zap, Shield, Share2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) setIsInstalled(true);
    const handler = (e: Event) => { e.preventDefault(); setDeferredPrompt(e as BeforeInstallPromptEvent); };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  const features = [
    { icon: Zap, title: "أداء سريع", desc: "تحميل فوري وتجربة سلسة" },
    { icon: WifiOff, title: "بدون إنترنت", desc: "يعمل حتى بدون اتصال" },
    { icon: Shield, title: "آمن وموثوق", desc: "حماية كاملة لبياناتك" },
    { icon: Smartphone, title: "كتطبيق حقيقي", desc: "على شاشتك الرئيسية" },
  ];

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-24 h-24 mx-auto mb-6 bg-gradient-brand rounded-3xl flex items-center justify-center shadow-xl"
        >
          <Smartphone className="h-12 w-12 text-white" />
        </motion.div>
        <h1 className="text-3xl font-bold text-foreground mb-3">ثبّت التطبيق</h1>
        <p className="text-muted-foreground">احصل على تجربة تطبيق كاملة مباشرة من هاتفك</p>
      </motion.div>

      {isInstalled ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center bg-green-50 dark:bg-green-950/30 p-8 rounded-2xl border border-green-200 dark:border-green-800">
          <p className="text-lg font-bold text-green-700 dark:text-green-400">✅ التطبيق مثبّت بالفعل!</p>
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 mb-10">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
                className="bg-card p-5 rounded-2xl border border-border text-center">
                <f.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-bold text-sm text-foreground">{f.title}</h3>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>

          {deferredPrompt ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Button onClick={handleInstall} className="w-full bg-gradient-brand font-bold h-14 rounded-xl text-lg shadow-lg">
                <Download className="ml-2 h-6 w-6" /> تثبيت التطبيق الآن
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {/* Android */}
              <div className="bg-card p-6 rounded-2xl border border-border">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-primary" /> Android
                </h3>
                <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                  <li>افتح الموقع في متصفح Chrome</li>
                  <li>اضغط على قائمة النقاط الثلاث ⋮</li>
                  <li>اختر "إضافة إلى الشاشة الرئيسية"</li>
                  <li>اضغط "إضافة" للتأكيد</li>
                </ol>
              </div>
              {/* iOS */}
              <div className="bg-card p-6 rounded-2xl border border-border">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-primary" /> iPhone / iPad
                </h3>
                <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                  <li>افتح الموقع في متصفح Safari</li>
                  <li>اضغط على زر المشاركة <Share2 className="inline h-4 w-4" /></li>
                  <li>مرر لأسفل واختر "إضافة إلى الشاشة الرئيسية" <Plus className="inline h-4 w-4" /></li>
                  <li>اضغط "إضافة" للتأكيد</li>
                </ol>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Install;
