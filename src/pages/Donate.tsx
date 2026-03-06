import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Heart, CheckCircle, Clock, Shirt, BookOpen, Laptop, Gift, HandHeart, Users } from "lucide-react";
import { motion } from "framer-motion";

const donationTypes = [
  { id: "time", label: "وقت وتطوع", icon: Clock, desc: "تطوع بوقتك لمساعدة الوحدة", color: "text-blue-600 bg-blue-100" },
  { id: "clothes", label: "ملابس", icon: Shirt, desc: "تبرع بملابس نظيفة", color: "text-pink-600 bg-pink-100" },
  { id: "books", label: "كتب ومراجع", icon: BookOpen, desc: "كتب أو مواد تعليمية", color: "text-green-600 bg-green-100" },
  { id: "electronics", label: "أجهزة إلكترونية", icon: Laptop, desc: "لابتوب، تابلت، أو هاتف", color: "text-purple-600 bg-purple-100" },
  { id: "supplies", label: "مستلزمات دراسية", icon: Gift, desc: "أدوات مكتبية ومستلزمات", color: "text-amber-600 bg-amber-100" },
  { id: "other", label: "تبرع آخر", icon: HandHeart, desc: "أي نوع تبرع آخر", color: "text-secondary bg-pink-50" },
];

const Donate = () => {
  const [donorName, setDonorName] = useState("");
  const [donationType, setDonationType] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [availability, setAvailability] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donationType) {
      toast.error("يرجى اختيار نوع التبرع");
      return;
    }
    if (!description.trim()) {
      toast.error("يرجى وصف التبرع");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("donations").insert({
      donor_name: donorName || null,
      donation_type: donationType,
      description: description.trim(),
      quantity: quantity || null,
      availability: availability || null,
      phone: phone || null,
      email: email || null,
      message: message || null,
    } as any);

    if (error) {
      toast.error("حدث خطأ، يرجى المحاولة لاحقاً");
      console.error(error);
    } else {
      setSuccess(true);
      toast.success("شكراً لتبرعك الكريم!");
    }
    setSubmitting(false);
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-lg text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-6">
          <CheckCircle className="h-10 w-10" />
        </motion.div>
        <h2 className="text-3xl font-bold text-foreground mb-4">شكراً لك!</h2>
        <p className="text-muted-foreground mb-2">تم تسجيل تبرعك بنجاح. سيتم التواصل معك لتنسيق عملية الاستلام.</p>
        <p className="text-sm text-muted-foreground mb-8">نقدر مساهمتك الكريمة في دعم أنشطة الوحدة 💜</p>
        <Button onClick={() => { setSuccess(false); setDonationType(""); setDescription(""); setQuantity(""); setAvailability(""); }} variant="outline">تبرع مرة أخرى</Button>
      </div>
    );
  }

  const selectedType = donationTypes.find(t => t.id === donationType);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-100 text-secondary mb-4">
          <Heart className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-3">ساهم معنا</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          مساهمتك تساعدنا في تنظيم الأنشطة التوعوية وتقديم الدعم للمحتاجين. اختر نوع التبرع المناسب لك.
        </p>
      </div>

      {/* Donation type selection */}
      {!donationType ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {donationTypes.map((type) => (
              <motion.button
                key={type.id}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setDonationType(type.id)}
                className="bg-card p-6 rounded-2xl border border-border hover:border-primary/30 hover:shadow-md transition-all text-center group"
              >
                <div className={`w-14 h-14 rounded-xl ${type.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                  <type.icon className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-foreground mb-1">{type.label}</h3>
                <p className="text-xs text-muted-foreground">{type.desc}</p>
              </motion.button>
            ))}
          </div>

          {/* Info section */}
          <div className="bg-accent/50 rounded-2xl p-6 border border-primary/10 text-center">
            <Users className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-bold text-foreground mb-2">كيف تصل تبرعاتك؟</h3>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              بعد تسجيل تبرعك، سيتواصل معك فريق الوحدة لتنسيق موعد ومكان الاستلام.
              جميع التبرعات توزع على الطلاب المحتاجين بسرية تامة.
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
          {/* Selected type header */}
          <button onClick={() => setDonationType("")} className="flex items-center gap-3 mb-6 text-primary hover:underline text-sm font-bold">
            ← اختيار نوع آخر
          </button>

          <div className="bg-card rounded-2xl shadow-sm border border-border p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              {selectedType && (
                <div className={`w-12 h-12 rounded-xl ${selectedType.color} flex items-center justify-center`}>
                  <selectedType.icon className="h-6 w-6" />
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold text-foreground">{selectedType?.label}</h2>
                <p className="text-sm text-muted-foreground">{selectedType?.desc}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>وصف التبرع *</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={donationType === "time" ? "مثال: أستطيع المساعدة في تنظيم الفعاليات يومي الثلاثاء والخميس" : "صف ما تريد التبرع به بالتفصيل..."}
                  className="min-h-[80px]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {donationType !== "time" && (
                  <div className="space-y-2">
                    <Label>الكمية</Label>
                    <Input value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="مثال: 5 قطع" />
                  </div>
                )}
                <div className="space-y-2">
                  <Label>{donationType === "time" ? "الأوقات المتاحة" : "موعد التسليم المفضل"}</Label>
                  <Input value={availability} onChange={(e) => setAvailability(e.target.value)} placeholder={donationType === "time" ? "مثال: أيام الأسبوع بعد 2 ظهراً" : "مثال: أي يوم من 10 ص إلى 3 م"} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الاسم (اختياري)</Label>
                  <Input value={donorName} onChange={(e) => setDonorName(e.target.value)} placeholder="اسمك الكريم" />
                </div>
                <div className="space-y-2">
                  <Label>رقم الهاتف</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01xxxxxxxxx" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>البريد الإلكتروني (اختياري)</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@email.com" />
              </div>

              <div className="space-y-2">
                <Label>رسالة إضافية (اختياري)</Label>
                <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="أي ملاحظات إضافية..." className="min-h-[60px]" />
              </div>

              <Button type="submit" className="w-full bg-gradient-brand font-bold text-lg h-12" disabled={submitting}>
                {submitting ? (
                  <motion.div className="flex items-center gap-2">
                    <motion.div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                    <span>جاري الإرسال...</span>
                  </motion.div>
                ) : "تأكيد التبرع"}
              </Button>
            </form>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Donate;
