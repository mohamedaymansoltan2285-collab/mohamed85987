import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, Lock, Eye, ShieldAlert, Wifi, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const tips = [
  {
    icon: Lock,
    title: "كلمات المرور القوية",
    description: "استخدمي كلمات مرور مختلفة لكل حساب، واجعليها طويلة تحتوي أرقام ورموز. استخدمي مدير كلمات مرور مثل Bitwarden.",
  },
  {
    icon: Eye,
    title: "الخصوصية على السوشيال ميديا",
    description: "اجعلي حساباتك خاصة، لا تشاركي موقعك الحالي، ولا تقبلي طلبات صداقة من غرباء. راجعي إعدادات الخصوصية دورياً.",
  },
  {
    icon: ShieldAlert,
    title: "التحرش الإلكتروني",
    description: "لا تردي على الرسائل المسيئة. وثّقي كل شيء بـ Screenshots. بلّغي المنصة واحظري المُتحرش. تواصلي معنا للدعم.",
  },
  {
    icon: Smartphone,
    title: "حماية هاتفك",
    description: "فعّلي قفل الشاشة ببصمة أو رمز. لا تحمّلي تطبيقات من مصادر غير موثوقة. حدّثي نظام التشغيل باستمرار.",
  },
  {
    icon: Wifi,
    title: "شبكات WiFi العامة",
    description: "تجنبي إدخال كلمات مرور أو بيانات حساسة على شبكات WiFi المفتوحة. استخدمي VPN إذا اضطررت.",
  },
  {
    icon: MessageSquare,
    title: "الابتزاز الإلكتروني",
    description: "لا تستجيبي لأي محاولة ابتزاز. لا ترسلي أموالاً أو صوراً. بلّغي الشرطة فوراً على 108 وتواصلي مع الوحدة.",
  },
];

const DigitalAwareness = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent text-primary mb-4">
          <Smartphone className="h-8 w-8" />
        </motion.div>
        <h1 className="text-3xl font-bold text-foreground mb-3">التوعية الرقمية</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          نصائح وإرشادات لحماية نفسك في العالم الرقمي والتعامل مع التهديدات الإلكترونية
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tips.map((tip, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-primary shrink-0">
                    <tip.icon className="h-5 w-5" />
                  </div>
                  {tip.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{tip.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 bg-destructive/10 rounded-2xl p-8 text-center">
        <ShieldAlert className="h-10 w-10 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-2">هل تتعرضين لابتزاز أو تحرش إلكتروني؟</h2>
        <p className="text-muted-foreground mb-1">خط نجدة المرأة: <span className="font-bold font-mono text-foreground">15115</span></p>
        <p className="text-muted-foreground">مباحث الإنترنت: <span className="font-bold font-mono text-foreground">108</span></p>
      </div>
    </div>
  );
};

export default DigitalAwareness;
