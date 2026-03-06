import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Phone, MapPin, Shield, Heart, Users, GraduationCap, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const sections = [
  {
    icon: Shield,
    title: "حقوقك داخل الجامعة",
    items: [
      "الحق في بيئة تعليمية آمنة وخالية من التحرش والتمييز",
      "الحق في تقديم شكوى سرية دون خوف من الانتقام",
      "الحق في الحصول على الدعم النفسي والقانوني المجاني",
      "الحق في المساواة في الفرص الأكاديمية والأنشطة",
    ],
  },
  {
    icon: AlertTriangle,
    title: "كيف تتعاملين مع المضايقات؟",
    items: [
      "لا تتجاهلي الأمر - كل واقعة مهمة مهما بدت صغيرة",
      "وثّقي ما حدث: التاريخ، الوقت، المكان، الشهود",
      "تحدثي مع شخص تثقين به أو تواصلي مع الوحدة",
      "قدمي بلاغاً سرياً عبر المنصة - هويتك محمية تماماً",
    ],
  },
  {
    icon: Phone,
    title: "أرقام مهمة وجهات دعم",
    items: [
      "وحدة مناهضة العنف ضد المرأة - الجامعة",
      "خط نجدة المرأة: 15115",
      "المجلس القومي للمرأة: 15577",
      "الدعم النفسي بالجامعة - مكتب الإرشاد الأكاديمي",
    ],
  },
  {
    icon: MapPin,
    title: "الأماكن الآمنة في الحرم الجامعي",
    items: [
      "مكتب وحدة مناهضة العنف - المبنى الإداري",
      "مكتب شؤون الطلاب",
      "عيادة الجامعة",
      "بوابات الأمن الجامعي",
    ],
  },
];

const StudentGuide = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent text-primary mb-4">
          <GraduationCap className="h-8 w-8" />
        </motion.div>
        <h1 className="text-3xl font-bold text-foreground mb-3">دليل الطالبة الجديدة</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          كل ما تحتاجين معرفته عن حقوقك وكيفية الحصول على الدعم داخل جامعة بني سويف التكنولوجية
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {sections.map((section, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-primary">
                    <section.icon className="h-5 w-5" />
                  </div>
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {section.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="text-center space-y-4">
        <h2 className="text-xl font-bold text-foreground">هل تحتاجين مساعدة؟</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/report">
            <Button className="bg-gradient-brand"><Shield className="ml-2 h-4 w-4" /> تقديم بلاغ سري</Button>
          </Link>
          <Link to="/volunteer">
            <Button variant="outline"><Users className="ml-2 h-4 w-4" /> انضمي كمتطوعة</Button>
          </Link>
          <Link to="/quiz">
            <Button variant="outline"><BookOpen className="ml-2 h-4 w-4" /> اختبري وعيك</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentGuide;
