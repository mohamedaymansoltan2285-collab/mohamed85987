import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Users, Sparkles, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";

const ekcDepartments = [
  { value: "ict", label: "تكنولوجيا المعلومات والاتصالات (ICT)" },
  { value: "mechatronics", label: "الميكاترونيكس (Mechatronics)" },
  { value: "autotronics", label: "الأوتوترونيكس (Autotronics)" },
  { value: "renewable_energy", label: "الطاقة المتجددة" },
  { value: "industrial_control", label: "التحكم في العمليات الصناعية" },
  { value: "railway", label: "السكة الحديد" },
  { value: "marketing", label: "التسويق" },
];

const Volunteer = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("");
  const [skills, setSkills] = useState("");
  const [reason, setReason] = useState("");
  const [gender, setGender] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Calculate birth date and age from national ID
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
      toast.error("يرجى ملء الحقول المطلوبة (الاسم، الكلية، النوع)");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("volunteers").insert({
      name,
      phone: phone || null,
      email: email || null,
      college,
      department: department || null,
      skills: skills || null,
      reason: reason || null,
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
    setSuccess(false); setName(""); setPhone(""); setEmail(""); setCollege(""); setDepartment(""); setSkills(""); setReason(""); setGender(""); setNationalId("");
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-lg text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-6">
          <CheckCircle className="h-10 w-10" />
        </motion.div>
        <h2 className="text-3xl font-bold text-foreground mb-4">شكراً لك!</h2>
        <p className="text-muted-foreground mb-8">تم تسجيل طلبك بنجاح. سيتواصل معك فريق الوحدة قريباً.</p>
        <Button onClick={resetForm} variant="outline">تقديم طلب آخر</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
        <div>
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-pink-100 text-secondary mb-6"><Heart className="h-6 w-6" /></div>
          <h1 className="text-4xl font-bold text-foreground mb-6">تطوع معنا</h1>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">كن جزءاً من التغيير! انضمامك لفريق المتطوعين يعني مساهمتك المباشرة في خلق بيئة جامعية أكثر أماناً ووعياً.</p>
          <div className="space-y-6">
            <div className="flex gap-4"><div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-primary shrink-0 mt-1"><Users className="h-5 w-5" /></div><div><h3 className="font-bold text-foreground mb-1">المشاركة المجتمعية</h3><p className="text-sm text-muted-foreground">المشاركة في تنظيم الفعاليات والحملات داخل الجامعة.</p></div></div>
            <div className="flex gap-4"><div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-primary shrink-0 mt-1"><Sparkles className="h-5 w-5" /></div><div><h3 className="font-bold text-foreground mb-1">تطوير المهارات</h3><p className="text-sm text-muted-foreground">الحصول على تدريبات خاصة وشهادات خبرة في العمل التطوعي.</p></div></div>
          </div>
        </div>

        <div className="bg-card rounded-2xl shadow-lg border border-border p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">استمارة التطوع</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>الاسم بالكامل <span className="text-destructive">*</span></Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="الاسم رباعي" required /></div>
              <div className="space-y-2">
                <Label>النوع <span className="text-destructive">*</span></Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger><SelectValue placeholder="اختر النوع" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">ذكر</SelectItem>
                    <SelectItem value="female">أنثى</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>الرقم القومي</Label>
              <Input value={nationalId} onChange={(e) => setNationalId(e.target.value.replace(/\D/g, "").slice(0, 14))} placeholder="أدخل الرقم القومي (14 رقم)" maxLength={14} />
              {birthInfo && (
                <div className="flex gap-4 text-sm text-primary bg-accent p-2 rounded-lg">
                  <span>📅 تاريخ الميلاد: {new Date(birthInfo.birthDate).toLocaleDateString("ar-EG")}</span>
                  <span>🎂 العمر: {birthInfo.age} سنة</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>رقم الهاتف</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01xxxxxxxxx" /></div>
              <div className="space-y-2"><Label>البريد الإلكتروني</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@edu.eg" /></div>
            </div>

            <div className="space-y-2">
              <Label>الكلية <span className="text-destructive">*</span></Label>
              <Select value={college} onValueChange={(v) => { setCollege(v); setDepartment(""); }}>
                <SelectTrigger><SelectValue placeholder="اختر الكلية" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="egyptian_korean">الكلية المصرية الكورية</SelectItem>
                  <SelectItem value="technology">الكلية التكنولوجية</SelectItem>
                  <SelectItem value="industry">كلية الصناعة والطاقة</SelectItem>
                  <SelectItem value="other">أخرى</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {college === "egyptian_korean" && (
              <div className="space-y-2">
                <Label>القسم</Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger><SelectValue placeholder="اختر القسم" /></SelectTrigger>
                  <SelectContent>
                    {ekcDepartments.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2"><Label>مهاراتك</Label><Textarea value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="تصميم، تنظيم، تصوير، كتابة محتوى..." /></div>
            <div className="space-y-2"><Label>لماذا تريد التطوع معنا؟</Label><Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="حدثنا عن دافعك..." /></div>
            <Button type="submit" size="lg" className="w-full bg-gradient-brand font-bold mt-4" disabled={submitting}>
              {submitting ? "جاري الإرسال..." : "إرسال طلب الانضمام"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Volunteer;
