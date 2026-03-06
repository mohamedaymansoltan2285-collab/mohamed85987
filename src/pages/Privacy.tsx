import { Shield, Lock, Eye, FileText, Users, Bell, Trash2, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const SECTIONS = [
  {
    icon: FileText,
    title: "مقدمة وتعريف",
    content: [
      "تُصدر هذه السياسة عن وحدة تكافؤ الفرص ومناهضة العنف ضد المرأة التابعة لجامعة بني سويف التكنولوجية (يُشار إليها فيما يلي بـ «الوحدة» أو «نحن»).",
      "تُوضح سياسة الخصوصية هذه كيفية جمع المعلومات الشخصية واستخدامها وتخزينها وحمايتها عند استخدام منصتنا الرقمية على الإنترنت.",
      "باستخدامك للمنصة، فإنك تقرّ بأنك قد قرأت هذه السياسة وفهمتها وقبلت بنودها كاملة. إذا كنت لا توافق على أي جزء منها، يُرجى التوقف عن استخدام المنصة.",
      "نحتفظ بالحق في تعديل هذه السياسة في أي وقت، وسيتم إخطارك بأي تغييرات جوهرية عبر إشعار واضح على المنصة.",
    ],
  },
  {
    icon: Eye,
    title: "البيانات التي نجمعها",
    content: [
      "بيانات الهوية: الاسم الكامل، النوع (ذكر/أنثى)، الرقم القومي (اختياري ومُشفّر).",
      "بيانات التواصل: عنوان البريد الإلكتروني، رقم الهاتف المحمول.",
      "البيانات الأكاديمية: الجامعة، الكلية، القسم، السنة الدراسية.",
      "بيانات الاستخدام: الصفحات التي تزورها، مدة الجلسة، نوع المتصفح ونظام التشغيل.",
      "البيانات التي تُدخلها طوعاً: طلبات التطوع، البلاغات السرية، مشاركات المنتدى، تعليقات الأنشطة.",
      "بيانات الموقع الجغرافي العامة: مستوى المدينة فقط، لتحسين خدمات خريطة الأمان.",
    ],
  },
  {
    icon: Shield,
    title: "أغراض استخدام البيانات",
    content: [
      "تقديم خدمات المنصة بشكل كامل وفعّال، بما يشمل: الإبلاغ السري، التطوع، الأنشطة، والمنتدى.",
      "تحسين تجربة المستخدم وتخصيص المحتوى المناسب بناءً على اهتماماتك.",
      "إرسال إشعارات مهمة تتعلق بالأنشطة والفعاليات والتحديثات المتعلقة بالوحدة.",
      "التواصل مع المتطوعين المنضمين للمنصة لتنظيم الفعاليات والحملات.",
      "إجراء تحليلات إحصائية مجمّعة ومُجهّلة الهوية لتطوير الخدمات وتحسينها.",
      "الامتثال للمتطلبات القانونية والتنظيمية المعمول بها في جمهورية مصر العربية.",
      "لن نستخدم بياناتك لأي غرض تجاري أو إعلاني دون الحصول على موافقتك الصريحة.",
    ],
  },
  {
    icon: Lock,
    title: "تخزين البيانات وحمايتها",
    content: [
      "تُحفظ جميع البيانات على خوادم آمنة مزودة بتشفير SSL/TLS من الدرجة الأولى.",
      "نستخدم قواعد بيانات Supabase مع تطبيق سياسات الأمان على مستوى الصف (Row Level Security - RLS)، مما يضمن أن كل مستخدم لا يصل إلا إلى بياناته الشخصية فقط.",
      "يتم تشفير كلمات المرور باستخدام خوارزميات تشفير حديثة ولا يتم تخزينها بصيغة نصية واضحة في أي وقت.",
      "البلاغات السرية تُعامَل بأقصى درجات الحماية؛ لا يمكن الوصول إليها إلا من قِبل المختصين المعتمدين بالوحدة.",
      "نُجري مراجعات دورية لأنظمة الأمان ونُحدّث البنية التحتية باستمرار لمواجهة أي تهديدات محتملة.",
      "نحتفظ بسجلات البيانات للمدة اللازمة لتقديم الخدمات، ثم يتم حذفها أو إخفاء هويتها وفقاً لسياسة الاحتفاظ بالبيانات المعتمدة.",
    ],
  },
  {
    icon: Users,
    title: "مشاركة البيانات مع الأطراف الثالثة",
    content: [
      "لا نبيع بياناتك الشخصية أو نؤجرها أو نتاجر بها مع أي طرف ثالث في أي ظرف من الظروف.",
      "قد نشارك بيانات مُجمّعة ومُجهّلة الهوية مع جهة الرعاية الرسمية (جامعة بني سويف التكنولوجية والمجلس القومي للمرأة) لأغراض التقارير الإحصائية فحسب.",
      "نستخدم خدمات بنية تحتية موثوقة (مثل Supabase لقواعد البيانات) وفقاً لاتفاقيات معالجة بيانات صارمة تضمن سرية معلوماتك.",
      "في حالات نادرة وفقاً لما يقتضيه القانون المصري أو بناءً على أوامر قضائية، قد نُفصح عن بيانات معينة للجهات الحكومية المختصة فقط.",
      "لن نشارك أي بيانات مع جهات خارجية لأغراض تسويقية أو إعلانية.",
    ],
  },
  {
    icon: Bell,
    title: "ملفات تعريف الارتباط (Cookies)",
    content: [
      "نستخدم ملفات تعريف الارتباط الضرورية للحفاظ على جلسة تسجيل الدخول وضمان أمان الاتصال.",
      "تتضمن ملفات الارتباط المُستخدمة: رمز الجلسة الآمن (session token)، وتفضيلات اللغة والواجهة، وإعدادات الإشعارات.",
      "لا نستخدم ملفات تعريف ارتباط من طرف ثالث لأغراض التتبع أو الإعلانات.",
      "يمكنك إدارة ملفات الارتباط من إعدادات متصفحك، غير أن تعطيلها قد يؤثر على بعض وظائف المنصة.",
    ],
  },
  {
    icon: Shield,
    title: "حقوقك كمستخدم",
    content: [
      "الحق في الاطلاع: يمكنك طلب نسخة من جميع بياناتك الشخصية المحفوظة لدينا في أي وقت.",
      "الحق في التصحيح: يمكنك تحديث أو تصحيح بياناتك الشخصية من صفحة الملف الشخصي مباشرة.",
      "الحق في الحذف: يمكنك طلب حذف حسابك وجميع بياناتك المرتبطة به نهائياً، مع التحفظ على البيانات المطلوبة قانوناً.",
      "الحق في الاعتراض: يمكنك الاعتراض على معالجة بياناتك لأغراض معينة عبر التواصل معنا.",
      "الحق في نقل البيانات: يمكنك طلب الحصول على بياناتك بصيغة قابلة للقراءة الآلية.",
      "لممارسة أي من هذه الحقوق، يُرجى التواصل معنا عبر بريدنا الإلكتروني الرسمي.",
    ],
  },
  {
    icon: Trash2,
    title: "حذف البيانات والاحتفاظ بها",
    content: [
      "يتم الاحتفاظ ببيانات الحساب النشط طوال فترة استخدام المنصة.",
      "عند طلب حذف الحساب، يتم حذف البيانات الشخصية خلال 30 يوماً من تاريخ الطلب.",
      "البلاغات السرية المُرسلة تُحفظ للمدة اللازمة للمعالجة والمتابعة القانونية، ثم يتم إخفاء هوية صاحبها.",
      "سجلات الاستخدام الإحصائية المُجهّلة قد تُحتفظ بها لأغراض تحسين الخدمة.",
      "في حال إلغاء تنشيط الحساب لفترة تتجاوز 24 شهراً، قد نتواصل معك لتأكيد استمرار رغبتك في الاحتفاظ بالحساب.",
    ],
  },
  {
    icon: Mail,
    title: "التواصل معنا",
    content: [
      "إذا كان لديك أي استفسار أو طلب يتعلق بسياسة الخصوصية أو بياناتك الشخصية، يُرجى التواصل معنا عبر الوسائل التالية:",
      "البريد الإلكتروني: privacy@safe-unit.edu.eg",
      "العنوان: وحدة تكافؤ الفرص ومناهضة العنف ضد المرأة، المبنى الإداري، جامعة بني سويف التكنولوجية.",
      "سيتم الرد على جميع الاستفسارات المتعلقة بالخصوصية خلال 7 أيام عمل.",
    ],
  },
];

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/5 border-b border-border">
        <div className="container mx-auto px-4 md:px-6 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6">
              <Lock className="h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              سياسة الخصوصية
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
              نلتزم بحماية خصوصيتك وسرية معلوماتك الشخصية. تعرّف على كيفية جمع بياناتك واستخدامها وحمايتها.
            </p>
            <div className="inline-flex items-center gap-2 mt-5 px-4 py-2 bg-card border border-border rounded-full text-sm text-muted-foreground">
              <FileText className="h-4 w-4 text-primary" />
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
                {/* Section header */}
                <div className="flex items-center gap-3 px-6 py-4 bg-accent/40 border-b border-border">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <h2 className="text-base font-bold text-foreground">
                    {idx + 1}. {section.title}
                  </h2>
                </div>
                {/* Section content */}
                <div className="px-6 py-5">
                  <ul className="space-y-3">
                    {section.content.map((item, i) => (
                      <li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0 mt-2" />
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
        <div className="mt-12 p-6 bg-primary/5 border border-primary/20 rounded-2xl text-center">
          <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
          <h3 className="font-bold text-foreground mb-2">التزامنا بخصوصيتك</h3>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
            خصوصيتك ليست مجرد التزام قانوني بالنسبة لنا — بل هي ركيزة أساسية من ركائز ثقتك بنا. نعمل باستمرار على تعزيز معايير حماية البيانات.
          </p>
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            <Link to="/terms" className="text-sm text-primary hover:underline font-medium">
              شروط الاستخدام
            </Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/" className="text-sm text-primary hover:underline font-medium">
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
