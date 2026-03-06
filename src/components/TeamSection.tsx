import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, ChevronLeft, ChevronRight } from "lucide-react";
import { ScrollReveal } from "@/hooks/useScrollAnimation";

import volunteerMahmoud from "@/assets/volunteer-mahmoud.png";
import volunteerAlaa from "@/assets/volunteer-alaa.png";
import volunteerRaat from "@/assets/volunteer-raat.png";
import volunteerSultan from "@/assets/volunteer-sultan.png";
import volunteerAhmed from "@/assets/volunteer-ahmed.png";
import volunteerTarek from "@/assets/volunteer-tarek.png";
import volunteerMona from "@/assets/volunteer-mona.png";
import volunteerRagab from "@/assets/volunteer-ragab.png";
import volunteerAlaaMabrouk from "@/assets/volunteer-alaa-mabrouk.png";

const teamMembers = [
  { name: "محمود رجب", role: "رئيس اتحاد الطلاب", department: "Autotronics", image: volunteerMahmoud },
  { name: "علاء محمود", role: "نائب رئيس اتحاد الطلاب", department: "Autotronics", image: volunteerAlaa },
  { name: "محمد رأفت", role: "مسؤول التنسيق والإشراف", department: "Autotronics", image: volunteerRaat },
  { name: "محمد أيمن سلطان", role: "مطور Web وقواعد بيانات", department: "ICT", image: volunteerSultan },
  { name: "أحمد أيمن", role: "مسؤول العلاقات العامة (PR)", department: "ICT", image: volunteerAhmed },
  { name: "محمد طارق", role: "فريق الإعلام (Media)", department: "ICT", image: volunteerTarek },
  { name: "منة مؤمن", role: "فريق الإعلام (Media)", department: "Autotronics", image: volunteerMona },
  { name: "رجب", role: "فريق الإعلام (Media)", department: "Autotronics", image: volunteerRagab },
  { name: "علاء مبروك", role: "مشرف متطوعين", department: "Autotronics", image: volunteerAlaaMabrouk },
];

const TeamSection = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const autoRef = useRef<NodeJS.Timeout | null>(null);
  const visibleCount = typeof window !== "undefined" && window.innerWidth >= 768 ? 3 : 1;

  const next = () => {
    setDirection(1);
    setCurrent(prev => (prev + 1) % teamMembers.length);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent(prev => (prev - 1 + teamMembers.length) % teamMembers.length);
  };

  useEffect(() => {
    autoRef.current = setInterval(next, 4000);
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, []);

  const pause = () => { if (autoRef.current) clearInterval(autoRef.current); };
  const resume = () => {
    pause();
    autoRef.current = setInterval(next, 4000);
  };

  const getVisibleMembers = () => {
    const members = [];
    for (let i = 0; i < visibleCount; i++) {
      members.push(teamMembers[(current + i) % teamMembers.length]);
    }
    return members;
  };

  const deptColors: Record<string, string> = {
    ICT: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    Autotronics: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/60 via-background to-pink-50/40 dark:from-purple-950/20 dark:to-pink-950/10" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-20 w-56 h-56 bg-secondary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-14">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold mb-4"
            >
              <Users className="h-4 w-4" /> فريق العمل
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              أبطال وحدة تكافؤ الفرص
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              فريق من الطلاب المتميزين الذين يتطوعون بوقتهم وجهدهم لبناء بيئة جامعية أكثر أماناً ووعياً
            </p>
          </div>
        </ScrollReveal>

        {/* Carousel */}
        <div
          className="relative max-w-5xl mx-auto"
          onMouseEnter={pause}
          onMouseLeave={resume}
          onTouchStart={pause}
          onTouchEnd={resume}
        >
          {/* Nav buttons */}
          <button
            onClick={() => { prev(); resume(); }}
            className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-12 z-20 w-10 h-10 rounded-full bg-card border border-border shadow-lg flex items-center justify-center text-foreground hover:bg-accent transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <button
            onClick={() => { next(); resume(); }}
            className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-12 z-20 w-10 h-10 rounded-full bg-card border border-border shadow-lg flex items-center justify-center text-foreground hover:bg-accent transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Cards */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current}
              initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className={`grid gap-6 ${visibleCount === 1 ? "grid-cols-1 max-w-sm mx-auto" : "grid-cols-3"}`}
            >
              {getVisibleMembers().map((member, i) => (
                <motion.div
                  key={member.name + i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group"
                >
                  <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                    {/* Gradient top bar */}
                    <div className="h-2 bg-gradient-brand" />
                    {/* Photo */}
                    <div className="relative pt-6 pb-4 flex justify-center">
                      <div className="relative">
                        <div className="absolute -inset-2 bg-gradient-brand opacity-20 rounded-full blur-md group-hover:opacity-30 transition-opacity" />
                        <img
                          src={member.image}
                          alt={member.name}
                          className="relative w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-card shadow-lg group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>
                    {/* Info */}
                    <div className="px-5 pb-6 text-center">
                      <h3 className="text-lg font-bold text-foreground mb-1">{member.name}</h3>
                      <p className="text-sm text-primary font-medium mb-2">{member.role}</p>
                      <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${deptColors[member.department] || "bg-muted text-muted-foreground"}`}>
                        {member.department}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {teamMembers.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); resume(); }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === current ? "bg-primary w-6" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
