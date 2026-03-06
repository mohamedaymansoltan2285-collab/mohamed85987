import { motion } from "framer-motion";
import { ScrollReveal } from "@/hooks/useScrollAnimation";
import { Award, GraduationCap, Heart, Globe } from "lucide-react";
import drGhada from "@/assets/dr-ghada.jpg";

const DrGhadaSection = () => {
  return (
    <section className="py-20 bg-card relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-secondary/5 to-transparent rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal direction="right">
            <div className="relative flex justify-center">
              <div className="absolute -inset-4 bg-gradient-brand opacity-10 rounded-3xl blur-2xl" />
              <div className="relative">
                <div className="absolute -top-3 -right-3 w-24 h-24 border-t-4 border-r-4 border-primary/30 rounded-tr-3xl" />
                <div className="absolute -bottom-3 -left-3 w-24 h-24 border-b-4 border-l-4 border-secondary/30 rounded-bl-3xl" />
                <img src={drGhada} alt="د. غادة طوسون - رئيسة الوحدة" className="relative w-72 h-80 md:w-80 md:h-96 object-cover rounded-2xl shadow-2xl z-10 border-4 border-white dark:border-border" />
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gradient-brand text-white px-6 py-2.5 rounded-full shadow-xl z-20 whitespace-nowrap">
                  <p className="text-sm font-bold">د. غادة طوسون</p>
                </motion.div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="left" delay={0.2}>
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 text-primary font-bold mb-2"><Award className="h-5 w-5" /><span>رئيسة الوحدة</span></div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">الدكتورة <span className="text-gradient-brand">غادة طوسون</span></h2>
                <p className="text-muted-foreground leading-relaxed">رئيسة وحدة تكافؤ الفرص ومناهضة العنف ضد المرأة بجامعة بني سويف التكنولوجية، ورئيسة مركز UICC. أستاذة متميزة تُدرّس اللغة الإنجليزية وتؤمن بقوة التعليم في تغيير المجتمعات.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: GraduationCap, title: "أكاديمية متميزة", desc: "تدرّس اللغة الإنجليزية وتُلهم طلابها بالعلم والمعرفة", color: "text-primary bg-accent" },
                  { icon: Globe, title: "رئيسة مركز UICC", desc: "تقود مركز التعاون الدولي في الجامعة", color: "text-blue-600 bg-blue-100" },
                  { icon: Heart, title: "قائدة ملهمة", desc: "تساعد الطلاب وتدعمهم وتشجعهم على التطوع والعطاء", color: "text-secondary bg-pink-100" },
                  { icon: Award, title: "ريادة المرأة", desc: "تسعى لتمكين المرأة في المجتمع الأكاديمي والعملي", color: "text-amber-600 bg-amber-100" },
                ].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.1 }} className="bg-muted/30 border border-border rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center mb-2`}><item.icon className="h-5 w-5" /></div>
                    <h4 className="font-bold text-foreground text-sm mb-1">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </motion.div>
                ))}
              </div>

              <blockquote className="border-r-4 border-primary pr-4 py-2 bg-accent/50 rounded-l-xl">
                <p className="text-sm text-foreground italic leading-relaxed">"إيمانًا بأن التعليم والتوعية هما أساس التغيير، نعمل جميعًا من أجل بيئة جامعية آمنة وعادلة تدعم الجميع."</p>
                <p className="text-xs text-muted-foreground mt-1">— د. غادة طوسون</p>
              </blockquote>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default DrGhadaSection;
