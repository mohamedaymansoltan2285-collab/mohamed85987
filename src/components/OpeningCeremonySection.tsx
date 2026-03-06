import { motion } from "framer-motion";
import { ScrollReveal } from "@/hooks/useScrollAnimation";
import { Camera, Star, Sparkles } from "lucide-react";
import opening1 from "@/assets/opening-1.png";
import opening2 from "@/assets/opening-2.png";
import opening3 from "@/assets/opening-3.png";
import opening4 from "@/assets/opening-4.png";

const images = [
  { src: opening1, alt: "فريق العمل" },
  { src: opening2, alt: "حفل الافتتاح" },
  { src: opening3, alt: "المسؤولون والضيوف" },
  { src: opening4, alt: "فريق المتطوعين" },
];

const OpeningCeremonySection = () => {
  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-white dark:from-purple-950/20 dark:via-pink-950/10 dark:to-background">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-secondary/10 to-primary/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-14">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="w-16 h-16 bg-gradient-brand rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              <Camera className="h-8 w-8 text-white" />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              ذكرى <span className="text-gradient-brand">افتتاح الوحدة</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              لحظات خالدة من حفل افتتاح وحدة تكافؤ الفرص ومناهضة العنف ضد المرأة بجامعة بني سويف التكنولوجية، بحضور محافظ بني سويف ورئيس الجامعة وأعضاء هيئة التدريس والطلاب.
            </p>
          </div>
        </ScrollReveal>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mb-10">
          {images.map((img, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative group rounded-2xl overflow-hidden shadow-lg border border-border aspect-[4/3]"
              >
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-xs font-bold">{img.alt}</p>
                </div>
                {/* Corner sparkle */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  viewport={{ once: true }}
                  className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow-md"
                >
                  <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                </motion.div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* Bottom decorative text */}
        <ScrollReveal>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-6 py-3 shadow-sm">
              <Sparkles className="h-4 w-4 text-secondary" />
              <p className="text-sm text-muted-foreground font-medium">
                يوم لا يُنسى في مسيرة دعم المرأة بالجامعة
              </p>
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default OpeningCeremonySection;
