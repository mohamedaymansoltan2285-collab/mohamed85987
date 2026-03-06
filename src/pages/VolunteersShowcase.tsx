import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Heart, Star, Award, Briefcase, GraduationCap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const VolunteersShowcase = () => {
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVolunteers = async () => {
      const { data } = await supabase
        .from("volunteers")
        .select("*")
        .eq("is_approved", true)
        .order("created_at", { ascending: false });
      setVolunteers(data || []);
      setLoading(false);
    };
    fetchVolunteers();
  }, []);

  const departmentLabels: Record<string, string> = {
    ict: "تكنولوجيا المعلومات",
    mechatronics: "ميكاترونيكس",
    autotronics: "أوتوترونيكس",
    renewable_energy: "طاقة متجددة",
    industrial_control: "تحكم صناعي",
    railway: "سكة حديد",
    marketing: "تسويق",
  };

  const collegeLabels: Record<string, string> = {
    egyptian_korean: "الكلية المصرية الكورية",
    technology: "الكلية التكنولوجية",
    industry: "كلية الصناعة والطاقة",
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-900/90 via-purple-800/80 to-rose-900/70" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm mb-6">
              <Users className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">فريق المتطوعين</h1>
            <p className="text-lg text-pink-100 max-w-2xl mx-auto mb-8 leading-relaxed">
              أبطال التغيير الإيجابي — فريق من الطلاب المتميزين الذين يعملون بشغف لخلق بيئة جامعية أكثر أماناً ووعياً
            </p>
            <Link to="/volunteer">
              <Button size="lg" className="bg-white text-pink-900 hover:bg-gray-100 font-bold">
                <Heart className="ml-2 h-5 w-5" /> انضم لفريق المتطوعين
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { icon: Users, label: "متطوع نشط", value: volunteers.length, color: "text-primary" },
            { icon: Star, label: "ساعة تطوعية", value: `${volunteers.length * 50}+`, color: "text-amber-500" },
            { icon: Award, label: "فعالية منظمة", value: `${Math.max(10, volunteers.length * 3)}+`, color: "text-green-500" },
            { icon: Heart, label: "طالب مستفيد", value: `${Math.max(100, volunteers.length * 20)}+`, color: "text-pink-500" },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl border border-border p-6 text-center hover:shadow-md transition-shadow">
              <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-2`} />
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Volunteer Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card rounded-2xl border border-border p-6 animate-pulse">
                <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4" />
                <div className="h-5 bg-muted rounded w-3/4 mx-auto mb-2" />
                <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        ) : volunteers.length === 0 ? (
          <div className="text-center py-20">
            <Users className="h-20 w-20 text-muted-foreground/20 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-foreground mb-3">قريباً — فريق المتطوعين</h3>
            <p className="text-muted-foreground mb-6">سيتم عرض المتطوعين المعتمدين هنا قريباً. كن أول المنضمين!</p>
            <Link to="/volunteer"><Button className="bg-gradient-brand font-bold">سجل كمتطوع الآن</Button></Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {volunteers.map((v, i) => (
              <motion.div key={v.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all group">
                <div className="relative h-16 bg-gradient-brand">
                  <div className="absolute -bottom-10 right-1/2 translate-x-1/2">
                    {v.photo_url ? (
                      <img src={v.photo_url} alt={v.name} className="w-20 h-20 rounded-full border-4 border-card object-cover shadow-lg" />
                    ) : (
                      <div className="w-20 h-20 rounded-full border-4 border-card bg-accent flex items-center justify-center shadow-lg">
                        <span className="text-2xl font-bold text-primary">{v.name?.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="pt-14 pb-6 px-6 text-center">
                  <h3 className="text-lg font-bold text-foreground mb-1">{v.name}</h3>
                  {v.role_title && (
                    <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full mb-3">{v.role_title}</span>
                  )}
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {v.college && (
                      <p className="flex items-center justify-center gap-1">
                        <GraduationCap className="h-4 w-4" />
                        {collegeLabels[v.college] || v.college}
                      </p>
                    )}
                    {v.department && (
                      <p className="flex items-center justify-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {departmentLabels[v.department] || v.department}
                      </p>
                    )}
                    {v.volunteer_section && (
                      <p className="flex items-center justify-center gap-1">
                        <Star className="h-4 w-4 text-amber-500" />
                        {v.volunteer_section}
                      </p>
                    )}
                  </div>
                  {v.skills && (
                    <div className="mt-4 flex flex-wrap justify-center gap-1">
                      {v.skills.split(",").slice(0, 3).map((skill: string, j: number) => (
                        <span key={j} className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">{skill.trim()}</span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="mt-16 bg-gradient-brand rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <div className="relative z-10">
            <Heart className="h-10 w-10 mx-auto mb-4 opacity-80" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">كن جزءاً من التغيير</h2>
            <p className="text-purple-100 mb-6 max-w-xl mx-auto">انضم لفريق المتطوعين وساهم في بناء بيئة جامعية أكثر أماناً. نحتاج طاقتك وأفكارك!</p>
            <Link to="/volunteer">
              <Button size="lg" className="bg-white text-purple-900 hover:bg-gray-100 font-bold">
                سجل كمتطوع الآن
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VolunteersShowcase;
