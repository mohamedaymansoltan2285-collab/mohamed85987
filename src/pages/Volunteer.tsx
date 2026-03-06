import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Users, Sparkles, CheckCircle, GraduationCap, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";

// ─── University → Colleges map ────────────────────────────────────────────────
const UNIVERSITIES: { value: string; label: string; colleges: { value: string; label: string; departments?: { value: string; label: string }[] }[] }[] = [
  {
    value: "bst",
    label: "جامعة بني سويف التكنولوجية",
    colleges: [
      {
        value: "egyptian_korean",
        label: "الكلية المصرية الكورية للتكنولوجيا التطبيقية",
        departments: [
          { value: "ict", label: "تكنولوجيا المعلومات والاتصالات (ICT)" },
          { value: "mechatronics", label: "الميكاترونيكس (Mechatronics)" },
          { value: "autotronics", label: "الأوتوترونيكس (Autotronics)" },
          { value: "renewable_energy", label: "الطاقة المتجددة" },
          { value: "industrial_control", label: "التحكم في العمليات الصناعية" },
          { value: "railway", label: "السكة الحديد" },
          { value: "marketing", label: "التسويق" },
        ],
      },
      { value: "industry_energy", label: "كلية الصناعة والطاقة" },
      { value: "technology", label: "الكلية التكنولوجية" },
    ],
  },
  {
    value: "bsa",
    label: "جامعة بني سويف الأهلية",
    colleges: [
      { value: "eng_tech", label: "كلية الهندسة والتكنولوجيا" },
      { value: "business", label: "كلية الأعمال والإدارة" },
      { value: "computers", label: "كلية الحاسبات والمعلومات" },
      { value: "media", label: "كلية الإعلام والفنون التطبيقية" },
    ],
  },
  {
    value: "nahda",
    label: "جامعة النهضة",
    colleges: [
      { value: "eng", label: "كلية الهندسة" },
      { value: "pharmacy", label: "كلية الصيدلة" },
      { value: "dentistry", label: "كلية طب الأسنان" },
      { value: "commerce", label: "كلية التجارة" },
      { value: "law", label: "كلية الحقوق" },
    ],
  },
  {
    value: "bsu",
    label: "جامعة بني سويف",
    colleges: [
      { value: "eng", label: "كلية الهندسة" },
      { value: "science", label: "كلية العلوم" },
      { value: "commerce", label: "كلية التجارة" },
      { value: "arts", label: "كلية الآداب" },
      { value: "law", label: "كلية الحقوق" },
      { value: "medicine", label: "كلية الطب" },
      { value: "education", label: "كلية التربية" },
      { value: "computers", label: "كلية الحاسبات والذكاء الاصطناعي" },
      { value: "physical_ed", label: "كلية التربية البدنية" },
    ],
  },
];

const AVAILABILITY_OPTIONS = [
  { value: "daily", label: "يومياً" },
  { value: "weekends", label: "أيام الإجازات والعطلات فقط" },
  { value: "evenings", label: "المساء فقط" },
  { value: "flexible", label: "مرن حسب الفعاليات" },
  { value: "weekdays", label: "أيام الدراسة" },
];

// ─────────────────────────────────────────────────────────────────────────────

const Volunteer = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("");
  const [skills, setSkills] = useState("");
  const [reason, setReason] = useState("");
  const [gender, setGender] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [availability, setAvailability] = useState("");
  const [previousExperience, setPreviousExperience] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const selectedUniversity = UNIVERSITIES.find((u) => u.value === university);
  const selectedCollege = selectedUniversity?.colleges.find((c) => c.value === college);

  const getBirthInfo = () => {
    if (!nationalId || nationalId.length < 7) return null;
    const century = nationalId[0] === "2" ? "19" : nationalId[0] === "3" ? "20" : null;
    if (!century) return null;
    const year = century + nationalId.substring(1, 3);
    const month = nationalId.substring(3, 5);
    const day = nationalId.substring(5, 7);
    const birthDate = new Date(`${year}-${month}-${day}`);
    if (isNaN(birthDate.getTime())) return null;
    const age = Math.floor((Date.now() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    return { birthDate: birthDate.toISOString().split("T")[0], age };
  };

  const birthInfo = getBirthInfo();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !college || !gender) {
      toast.error("يرجى ملء الحقول المطلوبة: الاسم، الجامعة، الكلية، النوع");
      return;
    }
    setSubmitting(true);

    const collegeLabel = selectedCollege?.label || college;
    const universityLabel = selectedUniversity?.label || university;
    const departmentLabel = selectedCollege?.departments?.find((d) => d.value === department)?.label || department;

    const { error } = await supabase.from("volunteers").insert({
      name,
      phone: phone || null,
      email: email || null,
      college: `${universityLabel} - ${collegeLabel}`,
      department: departmentLabel || null,
      skills: skills || null,
      reason: reason
        ? `${reason}${availability ? ` | أوقات التفرغ: ${AVAILABILITY_OPTIONS.find(o => o.value === availability)?.label}` : ""}${previousExperience ? ` | خبرة سابقة: ${previousExperience}` : ""}`
        : null,
      gender,
      national_id: nationalId || null,
      birth_date: birthInfo?.birthDate || null,
    } as any);

    if (error) {
      toast.error("حدث خطأ، يرجى المحاولة لاحقاً");
      console.error(error);
    } else {
      setSuccess(true);
      toast.success("تم إرسال طلب التطوع بنجاح!");
    }
    setSubmitting(false);
  };

  const resetForm = () => {
    setSuccess(false);
    setName(""); setPhone(""); setEmail(""); setUniversity(""); setCollege(""); setDepartment("");
    setSkills(""); setReason(""); setGender(""); setNationalId(""); setAvailability(""); setPreviousExperience("");
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-lg text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 15 }} className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 text-green-600 mb-6">
          <CheckCircle className="h-12 w-12" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-3xl font-bold text-foreground mb-4">شكراً لك!</h2>
          <p className="text-muted-foreground mb-2 leading-relaxed">تم تسجيل طلبك بنجاح. سيتواصل معك فريق الوحدة قريباً للإجراءات التالية.</p>
          <p className="text-sm text-muted-foreground mb-8">نقدّر تفاعلك وتطوعك في خدمة مجتمعك الجامعي.</p>
          <Button onClick={resetForm} variant="outline" className="rounded-xl px-6">تقديم طلب آخر</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start mb-16">

        {/* Left info panel */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-pink-100 text-secondary mb-5">
              <Heart className="h-6 w-6" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">تطوع معنا</h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              كن جزءاً من التغيير! انضمامك لفريق المتطوعين يعني مساهمتك المباشرة في خلق بيئة جامعية أكثر أماناً ووعياً لجميع الطلاب.
            </p>
          </div>

          <div className="space-y-5">
            {[
              {
                icon: Users,
                title: "المشاركة المجتمعية",
                desc: "المشاركة في تنظيم الفعاليات والحملات التوعوية داخل الجامعة وخارجها.",
              },
              {
                icon: Sparkles,
                title: "تطوير المهارات",
                desc: "الحصول على تدريبات متخصصة وشهادات خبرة معتمدة في مجال العمل التطوعي.",
              },
              {
                icon: GraduationCap,
                title: "مسار أكاديمي مميز",
                desc: "إضافة ساعات تطوع معتمدة تُدرج في سجلك الأكاديمي وتعزز ملفك المهني.",
              },
              {
                icon: Clock,
                title: "مرونة في التوقيت",
                desc: "نراعي جدولك الدراسي ونوفر فرص تطوع تناسب أوقات تفرغك.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-primary shrink-0 mt-0.5">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1 text-sm">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { val: "+120", label: "متطوع نشط" },
              { val: "+30", label: "فعالية منظمة" },
              { val: "4", label: "جامعات شريكة" },
            ].map(({ val, label }) => (
              <div key={label} className="bg-card border border-border rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-primary">{val}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Form panel */}
        <div className="lg:col-span-3 bg-card rounded-2xl shadow-lg border border-border p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center shrink-0">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">استمارة التطوع</h2>
              <p className="text-xs text-muted-foreground">جميع البيانات تُحفظ بسرية تامة</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name + Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold">الاسم بالكامل <span className="text-destructive">*</span></Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="الاسم رباعي" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold">النوع <span className="text-destructive">*</span></Label>
                <Select value={gender} onValueChange={setGender} required>
                  <SelectTrigger><SelectValue placeholder="اختر النوع" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">ذكر</SelectItem>
                    <SelectItem value="female">أنثى</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* National ID */}
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">الرقم القومي</Label>
              <Input
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value.replace(/\D/g, "").slice(0, 14))}
                placeholder="أدخل الرقم القومي (14 رقم)"
                maxLength={14}
              />
              {birthInfo && (
                <div className="flex gap-4 text-sm text-primary bg-accent px-3 py-2 rounded-lg">
                  <span>تاريخ الميلاد: {new Date(birthInfo.birthDate).toLocaleDateString("ar-EG")}</span>
                  <span>العمر: {birthInfo.age} سنة</span>
                </div>
              )}
            </div>

            {/* Phone + Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold">رقم الهاتف</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01xxxxxxxxx" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold">البريد الإلكتروني</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@edu.eg" />
              </div>
            </div>

            {/* University */}
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">الجامعة <span className="text-destructive">*</span></Label>
              <Select value={university} onValueChange={(v) => { setUniversity(v); setCollege(""); setDepartment(""); }} required>
                <SelectTrigger><SelectValue placeholder="اختر الجامعة" /></SelectTrigger>
                <SelectContent>
                  {UNIVERSITIES.map((u) => (
                    <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* College — only shown after university selected */}
            {university && selectedUniversity && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-1.5"
              >
                <Label className="text-sm font-semibold">الكلية <span className="text-destructive">*</span></Label>
                <Select value={college} onValueChange={(v) => { setCollege(v); setDepartment(""); }} required>
                  <SelectTrigger><SelectValue placeholder="اختر الكلية" /></SelectTrigger>
                  <SelectContent>
                    {selectedUniversity.colleges.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>
            )}

            {/* Department — only shown if college has departments */}
            {college && selectedCollege?.departments && selectedCollege.departments.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-1.5"
              >
                <Label className="text-sm font-semibold">القسم / التخصص</Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger><SelectValue placeholder="اختر القسم" /></SelectTrigger>
                  <SelectContent>
                    {selectedCollege.departments.map((d) => (
                      <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>
            )}

            {/* Skills */}
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">مهاراتك وقدراتك</Label>
              <Textarea
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="مثال: تصميم جرافيك، تنظيم فعاليات، تصوير فوتوغرافي، كتابة محتوى، تقديم وإلقاء..."
                className="min-h-[80px] resize-none"
              />
            </div>

            {/* Availability — NEW FIELD 1 */}
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">أوقات التفرغ للتطوع</Label>
              <Select value={availability} onValueChange={setAvailability}>
                <SelectTrigger><SelectValue placeholder="متى يمكنك التطوع؟" /></SelectTrigger>
                <SelectContent>
                  {AVAILABILITY_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Previous Experience — NEW FIELD 2 */}
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">هل سبق لك التطوع من قبل؟</Label>
              <Textarea
                value={previousExperience}
                onChange={(e) => setPreviousExperience(e.target.value)}
                placeholder="إذا كانت لديك تجارب تطوعية سابقة، يرجى ذكرها باختصار... أو اكتب 'لا' إذا كانت هذه أولى تجاربك."
                className="min-h-[70px] resize-none"
              />
            </div>

            {/* Reason */}
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">لماذا تريد التطوع معنا؟</Label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="حدثنا عن دافعك وما الذي تأمل في تحقيقه من خلال تطوعك..."
                className="min-h-[80px] resize-none"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-gradient-brand font-bold mt-2 rounded-xl h-12 text-base"
              disabled={submitting}
            >
              {submitting ? "جاري الإرسال..." : "إرسال طلب الانضمام"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Volunteer;
