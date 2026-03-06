import { FileText, Shield, Users, AlertTriangle, Scale, Ban, CheckCircle, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const SECTIONS = [
  {
    icon: FileText,
    title: "القبول بالشروط",
    content: [
      "مرحباً بك في المنصة الرقمية لوحدة تكافؤ الفرص ومناهضة العنف ضد المرأة بجامعة بني سويف التكنولوجية.",
      "باستخدامك لهذه المنصة، سواء كان ذلك بالتسجيل، أو تصفح المحتوى، أو الاستفادة من أي خدمة مقدمة، فإنك توافق صراحةً على الالتزام بهذه الشروط والأحكام كاملةً.",
      "إذا كنت تمثل جهةً ما، فإنك تقرّ بأن لديك الصلاحية الكاملة لقبول هذه الشروط باسم تلك الجهة.",
      "إذا كنت لا توافق على أي من هذه البنود، يُرجى التوقف عن استخدام المنصة فوراً.",
      "تحتفظ الوحدة بحق تعديل هذه الشروط في أي وقت مع إخطار المستخدمين بالتغييرات الجوهرية عبر إشعار على المنصة.",
    ],
  },
  {
    icon: CheckCircle,
    title: "أهلية الاستخدام",
    content: [
      "يُشترط أن يكون المستخدم طالباً أو موظفاً أو عضو هيئة تدريس في إحدى الجامعات المصرية، أو مدنياً مهتماً بالقضايا المطروحة.",
      "يجب أن يكون عمر المستخدم 16 سنة على الأقل لإنشاء حساب على المنصة. من هم دون سن 18 يحتاجون إلى موافقة ولي الأمر.",
      "يُحظر إنشاء أكثر من حساب واحد لنفس الشخص. اكتشاف الحسابات المكررة قد يؤدي إلى إيقاف الحسابات جميعها.",
      "يلتزم المستخدم بتقديم معلومات صحيحة ودقيقة عند التسجيل، والمحافظة على تحديثها باستمرار.",
    ],
  },
  {
    icon: Users,
    title: "قواعد السلوك والاستخدام المقبول",
    content: [
      "يلتزم المستخدم باحترام جميع أعضاء المجتمع الجامعي، بصرف النظر عن جنسهم أو ديانتهم أو قومياتهم أو توجهاتهم.",
      "يُحظر نشر أي محتوى مسيء، تحريضي، مضلل، إباحي، أو يتضمن خطاب كراهية بأي شكل من الأشكال.",
      "يُمنع استخدام المنصة للتحرش بالآخرين أو ترهيبهم أو التشهير بهم أو انتهاك خصوصيتهم.",
      "يُحظر نشر معلومات كاذبة أو مضللة تتعلق بالوحدة أو بأعضائها أو بالجامعة.",
      "يُمنع استخدام المنصة لأغراض تجارية، دعائية، أو ترويجية دون الحصول على إذن كتابي مسبق.",
      "يلتزم المستخدم بحماية سرية بيانات تسجيل دخوله وعدم مشاركة كلمة مروره مع أي طرف آخر.",
    ],
  },
  {
    icon: Shield,
    title: "الاستخدام السليم لخاصية الإبلاغ السري",
    content: [
      "خاصية الإبلاغ السري مخصصة حصراً للحالات الحقيقية المتعلقة بالتحرش أو العنف أو انتهاك حقوق المرأة.",
      "يُعدّ تقديم بلاغات كيدية أو ملفقة أو كاذبة جريمة أخلاقية وقانونية، وقد تترتب عليه عواقب قانونية وفق التشريعات المصرية المعمول بها.",
      "تُعالَج جميع البلاغات بسرية تامة، ولا تُكشف هوية المُبلّغ إلا بموافقته الصريحة أو بأمر قضائي.",
      "تحتفظ الوحدة بحق إحالة البلاغات الجادة إلى الجهات المختصة (إدارة الجامعة، النيابة العامة) عند الاقتضاء.",
    ],
  },
  {
    icon: FileText,
    title: "الملكية الفكرية والمحتوى",
    content: [
      "جميع المحتويات المنشورة على المنصة (نصوص، صور، تصاميم، أيقونات، كود برمجي) هي ملك حصري للوحدة أو مرخصة لها، وتخضع لقوانين حماية الملكية الفكرية.",
      "يُمنع إعادة نشر أو نسخ أو توزيع أي محتوى من المنصة لأغراض تجارية دون إذن كتابي مسبق.",
      "المحتوى الذي يُنشره المستخدمون في المنتدى أو التعليقات يبقى ملكيتهم الفكرية، غير أنهم يمنحون الوحدة ترخيصاً غير حصري لعرضه وتخزينه وتوزيعه على المنصة.",
      "للوحدة الحق في حذف أي محتوى ينتهك هذه الشروط أو يمس سمعة المنصة دون سابق إنذار.",
      "للأغراض التعليمية والتوعوية غير التجارية، يُسمح بالاقتباس من محتوى المنصة مع الإشارة إلى المصدر.",
    ],
  },
  {
    icon: Ban,
    title: "الإجراءات التأديبية وإيقاف الحسابات",
    content: [
      "تحتفظ الوحدة بالحق الكامل في تحذير المستخدم أو تعليق حسابه مؤقتاً أو إلغائه نهائياً في حال مخالفة هذه الشروط.",
      "التصعيد التدريجي للإجراءات: إنذار كتابي، تعليق مؤقت (3-30 يوماً)، ثم الإلغاء الدائم في حالة التكرار.",
      "الانتهاكات الجسيمة (التحرش، النشر الإباحي، التهديد، الاختراق) تستوجب الإلغاء الفوري دون إنذار مسبق.",
      "يحق للمستخدم الطعن في قرار الإيقاف خلال 14 يوماً عبر مراسلة الوحدة رسمياً.",
      "الحسابات الملغاة لأسباب تتعلق بانتهاكات جسيمة لن تُستعاد تحت أي ظرف.",
    ],
  },
  {
    icon: AlertTriangle,
    title: "إخلاء المسؤولية وحدود الالتزام",
    content: [
      "تُقدَّم المنصة وخدماتها «كما هي» دون ضمانات ضمنية أو صريحة تتعلق بالتوافر المستمر أو الخلو التام من الأخطاء.",
      "لا تتحمل الوحدة مسؤولية أي أضرار مباشرة أو غير مباشرة ناجمة عن استخدام المنصة أو عدم القدرة على استخدامها.",
      "لا نضمن دقة أو اكتمال المعلومات المنشورة من قِبل المستخدمين في المنتدى والتعليقات، وهي تعبّر عن آراء أصحابها فقط.",
      "في حال وقوع اختراق أمني خارج نطاق سيطرتنا، سنبذل قصارى جهدنا للتعامل معه سريعاً وإخطار المستخدمين المتضررين.",
      "محتوى المنصة ذو طابع توعوي وإرشادي، ولا يُعدّ بديلاً عن الاستشارة القانونية أو النفسية المتخصصة.",
    ],
  },
  {
    icon: Scale,
    title: "القانون المُطبّق وحل النزاعات",
    content: [
      "تخضع هذه الشروط وتُفسَّر وفقاً للتشريعات المعمول بها في جمهورية مصر العربية.",
      "في حال نشوء أي نزاع، يُسعى أولاً إلى تسويته بالطريق الودي عبر التفاوض المباشر مع الوحدة.",
      "إذا فشلت التسوية الودية خلال 30 يوماً، تُحال النزاعات إلى المحاكم المختصة في محافظة بني سويف.",
      "بطلان أي بند من بنود هذه الشروط لا يُلغي باقي البنود التي تبقى سارية المفعول.",
    ],
  },
  {
    icon: Mail,
    title: "التواصل والشكاوى",
    content: [
      "لأي استفسار أو شكوى تتعلق بهذه الشروط أو باستخدام المنصة، يُرجى التواصل معنا عبر:",
      "البريد الإلكتروني: legal@safe-unit.edu.eg",
      "العنوان: وحدة تكافؤ الفرص ومناهضة العنف ضد المرأة، المبنى الإداري، جامعة بني سويف التكنولوجية، بني سويف، جمهورية مصر العربية.",
      "ساعات العمل: الأحد – الخميس من 9:00 صباحاً حتى 3:00 مساءً.",
      "سيتم الرد على جميع الاستفسارات الرسمية خلال 5 أيام عمل على الأكثر.",
    ],
  },
];

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-br from-secondary/10 via-background to-primary/5 border-b border-border">
        <div className="container mx-auto px-4 md:px-6 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary/10 text-secondary mb-6">
              <Scale className="h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              شروط الاستخدام
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
              يُرجى قراءة هذه الشروط بعناية قبل استخدام المنصة. استخدامك للمنصة يُعدّ موافقةً صريحةً على جميع هذه البنود.
            </p>
            <div className="inline-flex items-center gap-2 mt-5 px-4 py-2 bg-card border border-border rounded-full text-sm text-muted-foreground">
              <FileText className="h-4 w-4 text-secondary" />
              آخر تحديث: مارس 2026
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 py-14 max-w-4xl">
        <div className="space-y-10">
          {SECTIONS.map((section, idx) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-card border border-border rounded-2xl overflow-hidden"
              >
                <div className="flex items-center gap-3 px-6 py-4 bg-accent/40 border-b border-border">
                  <div className="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-4.5 w-4.5 text-secondary" />
                  </div>
                  <h2 className="text-base font-bold text-foreground">
                    {idx + 1}. {section.title}
                  </h2>
                </div>
                <div className="px-6 py-5">
                  <ul className="space-y-3">
                    {section.content.map((item, i) => (
                      <li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary/60 shrink-0 mt-2" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="mt-12 p-6 bg-secondary/5 border border-secondary/20 rounded-2xl text-center">
          <Scale className="h-8 w-8 text-secondary mx-auto mb-3" />
          <h3 className="font-bold text-foreground mb-2">الإطار القانوني</h3>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
            هذه الشروط تُمثّل الاتفاقية الكاملة بينك وبين الوحدة فيما يتعلق باستخدام المنصة، وتحلّ محل أي اتفاقيات أو تفاهمات سابقة.
          </p>
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            <Link to="/privacy" className="text-sm text-secondary hover:underline font-medium">
              سياسة الخصوصية
            </Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/" className="text-sm text-secondary hover:underline font-medium">
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
