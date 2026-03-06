import { Card, CardContent } from "@/components/ui/card";
import { Handshake, Building2, GraduationCap, Heart } from "lucide-react";
import { motion } from "framer-motion";

const partners = [
  { name: "المجلس القومي للمرأة", type: "حكومي", description: "شريك استراتيجي في دعم حقوق المرأة وتنفيذ البرامج التوعوية والتدريبية." },
  { name: "هيئة الأمم المتحدة للمرأة", type: "دولي", description: "دعم تقني وتدريبي لتعزيز قدرات الوحدة وتنفيذ المبادرات المشتركة." },
  { name: "وزارة التعليم العالي", type: "حكومي", description: "الإطار التنظيمي والدعم المؤسسي لوحدات مناهضة العنف بالجامعات." },
  { name: "صندوق الأمم المتحدة للسكان", type: "دولي", description: "شراكة في مجال الصحة الإنجابية والتوعية بالعنف القائم على النوع الاجتماعي." },
  { name: "منظمات المجتمع المدني المحلية", type: "محلي", description: "تعاون في تنفيذ الأنشطة الميدانية والحملات التوعوية بمحافظة بني سويف." },
  { name: "إدارة جامعة بني سويف التكنولوجية", type: "جامعي", description: "الداعم الرئيسي للوحدة وتوفير الموارد والبنية التحتية اللازمة." },
];

const typeIcons: Record<string, typeof Building2> = {
  "حكومي": Building2,
  "دولي": Handshake,
  "جامعي": GraduationCap,
  "محلي": Heart,
};

const Partners = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent text-primary mb-4">
          <Handshake className="h-8 w-8" />
        </motion.div>
        <h1 className="text-3xl font-bold text-foreground mb-3">شركاؤنا</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          نعمل مع شبكة واسعة من الشركاء المحليين والدوليين لتحقيق رسالتنا في بناء مجتمع جامعي آمن وعادل
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map((partner, i) => {
          const Icon = typeIcons[partner.type] || Building2;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-primary shrink-0">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">{partner.name}</h3>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{partner.type}</span>
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{partner.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-12 bg-accent rounded-2xl p-8 text-center">
        <h2 className="text-xl font-bold text-foreground mb-2">هل ترغب في الشراكة معنا؟</h2>
        <p className="text-muted-foreground">نرحب بالتعاون مع المؤسسات والمنظمات التي تشاركنا رسالتنا. تواصلوا معنا عبر البريد الإلكتروني للجامعة.</p>
      </div>
    </div>
  );
};

export default Partners;
