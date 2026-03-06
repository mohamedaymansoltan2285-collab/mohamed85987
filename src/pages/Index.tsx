import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Heart, Users, BookOpen, ChevronLeft, Calendar, Activity, ArrowLeft, Scale, HelpCircle, ChevronDown } from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { ScrollReveal } from "@/hooks/useScrollAnimation";
import OpeningCeremonySection from "@/components/OpeningCeremonySection";
import DrGhadaSection from "@/components/DrGhadaSection";
import TeamSection from "@/components/TeamSection";
import ncwLogo from "@/assets/ncw-logo.png";
import btuLogo from "@/assets/btu-logo.png";

const FAQItem = ({ faq, index }: { faq: { q: string; a: string }; index: number }) => {
  const [open, setOpen] = useState(false);
  return (
    <ScrollReveal delay={index * 0.08}>
      <motion.div
        className={`border rounded-2xl overflow-hidden transition-all ${open ? "border-primary/30 bg-card shadow-md" : "border-border bg-card/50 hover:bg-card"}`}
      >
        <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 p-5 text-right">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${open ? "bg-primary text-primary-foreground" : "bg-accent text-primary"}`}>
            <HelpCircle className="h-5 w-5" />
          </div>
          <span className="flex-1 font-bold text-foreground text-sm md:text-base">{faq.q}</span>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown className={`h-5 w-5 shrink-0 ${open ? "text-primary" : "text-muted-foreground"}`} />
          </motion.div>
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 pr-[4.5rem]">
                <div className="h-px bg-border mb-4" />
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </ScrollReveal>
  );
};
const typeLabels: Record<string, string> = {
  seminar: "ندوة", workshop: "ورشة عمل", campaign: "حملة توعوية", training: "تدريب", conference: "مؤتمر",
};

const Index = () => {
  const [safetyIndex, setSafetyIndex] = useState(0);
  const [activities, setActivities] = useState<any[]>([]);
  const [_volunteers, setVolunteers] = useState<any[]>([]);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  useEffect(() => {
    const fetchData = async () => {
      const [surveyRes, actRes, volRes] = await Promise.all([
        supabase.from("safety_surveys").select("feels_safe"),
        supabase.from("activities").select("*").order("created_at", { ascending: false }).limit(3),
        supabase.from("volunteers").select("*").eq("is_approved", true).order("created_at", { ascending: false }).limit(4),
      ]);
      if (surveyRes.data && surveyRes.data.length > 0) {
        setSafetyIndex(Math.round((surveyRes.data.filter(s => s.feels_safe).length / surveyRes.data.length) * 100));
      }
      setActivities(actRes.data || []);
      setVolunteers((volRes.data as any[]) || []);
    };
    fetchData();
  }, []);

  const faqs = [
    { q: "هل الشكوى سرية؟", a: "نعم، جميع الشكاوى تُعامل بسرية تامة ولا يتم الكشف عن هوية المشتكي." },
    { q: "هل يتم ذكر اسمي في التحقيق؟", a: "لا، لديك الحق في تقديم بلاغ مجهول بالكامل." },
    { q: "كم يستغرق التحقيق؟", a: "يعتمد على طبيعة القضية، عادة من أسبوع إلى شهر." },
    { q: "هل يمكن التراجع عن الشكوى؟", a: "نعم، يحق لك التراجع في أي مرحلة من مراحل التحقيق." },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Parallax */}
      <section className="relative h-[600px] overflow-hidden flex items-center">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-pink-800/80 z-10" />
          <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80" alt="صورة تعبيرية" className="absolute inset-0 w-full h-full object-cover" />
        </motion.div>
        <motion.div style={{ opacity: heroOpacity }} className="container relative z-20 mx-auto px-4 md:px-6 text-white">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-medium mb-4 border border-white/30"
            >
              وحدة رسمية تابعة لجامعة بني سويف التكنولوجية
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            >
              معاً لبيئة جامعية <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-pink-300">آمنة</motion.span> وتدعم <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }} className="text-purple-300">الجميع</motion.span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-lg md:text-xl text-gray-100 mb-8 max-w-2xl leading-relaxed"
            >
              نعمل على توفير بيئة تعليمية آمنة خالية من العنف والتمييز، وتقديم الدعم النفسي والقانوني والاجتماعي لجميع منتسبي الجامعة بسرية تامة.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/report">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="bg-white text-purple-900 hover:bg-gray-100 font-bold text-lg px-8 h-14"><Shield className="ml-2 h-5 w-5" /> إبلاغ سري</Button>
                </motion.div>
              </Link>
              <Link to="/about">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/40 hover:bg-white/30 hover:text-white font-bold text-lg px-8 h-14">تعرف علينا</Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Safety Index */}
      <ScrollReveal>
        <section className="py-16 bg-card relative overflow-hidden">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-2 text-primary font-bold mb-2"><Activity className="h-5 w-5" /><span>مؤشر الأمان الجامعي</span></div>
                <h2 className="text-3xl font-bold mb-6 text-foreground">هل تشعر بالأمان داخل الحرم الجامعي؟</h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">يساعدنا رأيك في تحسين بيئة الجامعة. شارك في الاستبيان الدوري لنرصد ونحسن مستوى الأمان معاً.</p>
                <div className="bg-accent p-6 rounded-2xl border border-primary/10 mb-8">
                  <div className="flex justify-between items-end mb-2"><span className="text-lg font-bold text-primary">مؤشر الأمان الحالي</span><span className="text-3xl font-bold text-secondary">{safetyIndex}%</span></div>
                  <div className="w-full bg-muted rounded-full h-3"><div className="bg-gradient-brand h-3 rounded-full transition-all duration-1000" style={{ width: `${safetyIndex}%` }}></div></div>
                </div>
                <Link to="/quiz"><Button className="w-full sm:w-auto">شارك في الاستبيان الآن</Button></Link>
              </div>
              <ScrollReveal direction="left" delay={0.2}>
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-brand opacity-10 rounded-full blur-3xl"></div>
                  <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80" alt="طلاب" className="relative rounded-2xl shadow-2xl z-10 w-full object-cover h-[400px]" />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Services */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <ScrollReveal>
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-4">خدمات الوحدة</h2>
              <p className="text-muted-foreground">نقدم مجموعة متكاملة من الخدمات لدعم وتوعية وحماية جميع منتسبي الجامعة</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "نظام الإبلاغ الآمن", desc: "قناة سرية وآمنة للإبلاغ عن أي مضايقات أو عنف، مع ضمان الخصوصية التامة.", link: "/report", linkText: "قدم بلاغ الآن", color: "text-primary bg-accent" },
              { icon: Heart, title: "الدعم النفسي", desc: "جلسات استماع ودعم نفسي مع متخصصين لمساعدة الطلاب على تجاوز الآثار النفسية.", link: "/safe-map", linkText: "مراكز الدعم", color: "text-secondary bg-pink-100" },
              { icon: BookOpen, title: "التوعية والتدريب", desc: "ورش عمل وندوات ومواد تثقيفية لرفع الوعي بحقوق الإنسان وآليات الحماية.", link: "/activities", linkText: "استكشف الأنشطة", color: "text-indigo-600 bg-indigo-100" },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.15}>
                <motion.div whileHover={{ y: -5 }} className="bg-card p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-border group h-full">
                  <div className={`w-14 h-14 ${item.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}><item.icon className="h-7 w-7" /></div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">{item.desc}</p>
                  <Link to={item.link} className="inline-flex items-center font-bold hover:gap-2 transition-all" style={{ color: "inherit" }}>
                    {item.linkText} <ChevronLeft className="h-4 w-4 mr-1" />
                  </Link>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Code of Conduct Section */}
      <ScrollReveal>
        <section className="py-20 bg-card">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-2 text-primary font-bold mb-2"><Scale className="h-5 w-5" /><span>ميثاق السلوك</span></div>
                <h2 className="text-3xl font-bold text-foreground mb-4">الدستور الأخلاقي للحرم الجامعي</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">وثيقة رسمية توضح السلوكيات المقبولة وغير المقبولة داخل الجامعة، والعقوبات المترتبة، والتزامات الطلاب وحقوقهم.</p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {["السلوكيات المرفوضة", "العقوبات التدريجية", "حقوق المشتكي", "الإبلاغ المجهول"].map((item, i) => (
                    <ScrollReveal key={i} delay={i * 0.1}>
                      <div className="flex items-center gap-2 bg-accent p-3 rounded-xl text-sm font-medium text-foreground">
                        <Shield className="h-4 w-4 text-primary shrink-0" />
                        {item}
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
                <Link to="/code-of-conduct"><Button className="bg-gradient-brand font-bold">اطلع على الميثاق الكامل <ChevronLeft className="mr-2 h-4 w-4" /></Button></Link>
              </div>
              <ScrollReveal direction="left" delay={0.2}>
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-brand opacity-5 rounded-3xl blur-2xl" />
                  <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-primary/10">
                    <Scale className="h-16 w-16 text-primary/20 mb-4" />
                    <blockquote className="text-lg font-medium text-foreground leading-relaxed italic">
                      "تلتزم جامعة بني سويف التكنولوجية بتوفير بيئة تعليمية آمنة وعادلة خالية من جميع أشكال التمييز والعنف."
                    </blockquote>
                    <p className="text-sm text-muted-foreground mt-4">— مقدمة ميثاق السلوك الجامعي</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Know Your Rights Section */}
      <ScrollReveal>
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <div className="flex items-center justify-center gap-2 text-primary font-bold mb-2"><BookOpen className="h-5 w-5" /><span>اعرف حقوقك</span></div>
            <h2 className="text-3xl font-bold text-foreground mb-4">المعرفة هي خط الدفاع الأول</h2>
            <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">تعرّف على حقوقك الكاملة داخل الجامعة والقوانين المصرية والدولية التي تحميك</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { icon: Shield, title: "حقوقك الأساسية", desc: "الحق في بيئة آمنة وخالية من العنف والتمييز والتحرش", color: "text-blue-600 bg-blue-100" },
                { icon: Scale, title: "القوانين المحلية", desc: "قانون العقوبات وقانون مكافحة التحرش والجرائم الإلكترونية", color: "text-amber-600 bg-amber-100" },
                { icon: Users, title: "المواثيق الدولية", desc: "اتفاقية سيداو والإعلان العالمي لحقوق الإنسان", color: "text-green-600 bg-green-100" },
              ].map((item, i) => (
                <ScrollReveal key={i} delay={i * 0.15}>
                  <motion.div whileHover={{ y: -3 }} className="bg-card p-6 rounded-2xl border border-border hover:shadow-md transition-shadow text-center">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${item.color} mx-auto mb-4`}>
                      <item.icon className="h-7 w-7" />
                    </div>
                    <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
            <Link to="/know-your-rights"><Button className="bg-gradient-brand font-bold">اعرف حقوقك الكاملة <ChevronLeft className="mr-2 h-4 w-4" /></Button></Link>
          </div>
        </section>
      </ScrollReveal>

      {/* Latest Activities */}
      <ScrollReveal>
        <section className="py-20 bg-card">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex justify-between items-end mb-12">
              <div><h2 className="text-3xl font-bold text-foreground mb-2">أحدث الأنشطة والفعاليات</h2><p className="text-muted-foreground">تابع أخبارنا وشارك في فعالياتنا القادمة</p></div>
              <Link to="/activities"><Button variant="outline" className="hidden md:flex">عرض كل الأنشطة</Button></Link>
            </div>
            {activities.length === 0 ? (
              <p className="text-center py-10 text-muted-foreground">لا توجد أنشطة حالياً.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {activities.map((act, i) => (
                  <ScrollReveal key={act.id} delay={i * 0.1}>
                    <Link to={`/activity/${act.id}`} className="group">
                      <motion.div whileHover={{ y: -5 }} className="rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all">
                        <div className="relative h-48 overflow-hidden">
                          {act.type && <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary z-10">{typeLabels[act.type] || act.type}</div>}
                          <img src={act.image_url || "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80"} alt={act.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="p-6">
                          <div className="flex items-center text-xs text-muted-foreground mb-3 gap-3">
                            {act.date && <span className="flex items-center"><Calendar className="h-3 w-3 ml-1" /> {new Date(act.date).toLocaleDateString("ar-EG")}</span>}
                            {act.location && <span className="flex items-center"><Users className="h-3 w-3 ml-1" /> {act.location}</span>}
                          </div>
                          <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-primary transition-colors">{act.title}</h3>
                          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{act.description}</p>
                          <span className="text-primary text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">عرض التفاصيل <ArrowLeft className="h-4 w-4" /></span>
                        </div>
                      </motion.div>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            )}
            <div className="mt-8 text-center md:hidden"><Link to="/activities"><Button variant="outline" className="w-full">عرض كل الأنشطة</Button></Link></div>
          </div>
        </section>
      </ScrollReveal>

      {/* Opening Ceremony Section */}
      <OpeningCeremonySection />

      {/* Dr. Ghada Section */}
      <DrGhadaSection />

      {/* Team Volunteers Section */}
      <TeamSection />

      {/* Partners Logos Section */}
      <ScrollReveal>
        <section className="py-12 bg-card border-y border-border">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-8">
              <p className="text-sm font-bold text-muted-foreground">تحت رعاية وبالتعاون مع</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
              <img src={btuLogo} alt="جامعة بني سويف التكنولوجية" className="h-16 md:h-20 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity" />
              <img src={ncwLogo} alt="المجلس القومي للمرأة" className="h-16 md:h-20 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* FAQ Section */}
      <ScrollReveal>
        <section className="py-20 relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-background to-pink-50/30 dark:from-purple-950/20 dark:to-pink-950/10" />
          <div className="absolute top-10 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-secondary/5 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 md:px-6 max-w-4xl relative z-10">
            <div className="text-center mb-12">
              <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold mb-3">
                <HelpCircle className="h-4 w-4" /> أسئلة شائعة
              </motion.div>
              <h2 className="text-3xl font-bold text-foreground mb-4">أسئلة يتكرر طرحها</h2>
              <p className="text-muted-foreground">إجابات سريعة على أكثر الأسئلة شيوعًا</p>
            </div>
            <div className="space-y-3 mb-8">
              {faqs.map((faq, i) => (
                <FAQItem key={i} faq={faq} index={i} />
              ))}
            </div>
            <div className="text-center">
              <Link to="/faq"><Button className="bg-gradient-brand font-bold rounded-xl">عرض جميع الأسئلة ({">"}60 سؤال) <ChevronLeft className="mr-2 h-4 w-4" /></Button></Link>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* CTA */}
      <section className="py-20 bg-gradient-brand text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="container mx-auto px-4 relative z-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">هل ترغب في المساهمة معنا؟</h2>
          <p className="text-lg md:text-xl text-purple-100 mb-8 max-w-2xl mx-auto">انضم لفريق المتطوعين وكن جزءاً من التغيير الإيجابي في جامعتنا، أو ساهم بالتبرع لدعم أنشطة الوحدة.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/volunteer"><motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><Button size="lg" className="bg-white text-primary hover:bg-gray-100 w-full sm:w-auto font-bold">سجل كمتطوع</Button></motion.div></Link>
            <Link to="/donate"><motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><Button size="lg" className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/40 hover:bg-white/30 hover:text-white w-full sm:w-auto font-bold">ساهم معنا</Button></motion.div></Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Index;
