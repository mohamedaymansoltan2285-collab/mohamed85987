import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, Scale, Users, Heart, Eye, EyeOff, FileText, ChevronDown, ChevronUp, Download, HandHeart, Ban, Gavel, BookOpen, MessageCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const ExpandableSection = ({ title, icon: Icon, children, color = "primary" }: { title: string; icon: any; children: React.ReactNode; color?: string }) => {
  const [open, setOpen] = useState(true);
  return (
    <motion.div variants={fadeIn} className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-6 text-right">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color === "destructive" ? "bg-red-100 text-red-600" : color === "warning" ? "bg-amber-100 text-amber-600" : color === "success" ? "bg-green-100 text-green-600" : color === "blue" ? "bg-blue-100 text-blue-600" : "bg-accent text-primary"}`}>
            <Icon className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-foreground">{title}</h3>
        </div>
        {open ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
      </button>
      {open && <div className="px-6 pb-6">{children}</div>}
    </motion.div>
  );
};

const BehaviorCard = ({ title, items, icon: Icon, color }: { title: string; items: string[]; icon: any; color: string }) => (
  <div className={`rounded-xl p-5 border ${color}`}>
    <div className="flex items-center gap-2 mb-3">
      <Icon className="h-5 w-5" />
      <h4 className="font-bold text-foreground">{title}</h4>
    </div>
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
          <Ban className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

const PenaltyLevel = ({ level, color, icon, items }: { level: string; color: string; icon: string; items: string[] }) => (
  <div className={`rounded-xl p-5 border-2 ${color}`}>
    <div className="flex items-center gap-2 mb-3">
      <span className="text-2xl">{icon}</span>
      <h4 className="font-bold text-foreground">{level}</h4>
    </div>
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
          <Gavel className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

const ExampleCard = ({ scenario, classification }: { scenario: string; classification: string }) => (
  <div className="bg-muted/50 rounded-xl p-4 border border-border">
    <p className="text-sm text-foreground mb-2">📌 <span className="font-medium">{scenario}</span></p>
    <p className="text-xs text-primary font-bold bg-accent inline-block px-3 py-1 rounded-full">← {classification}</p>
  </div>
);

const CodeOfConduct = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-purple-800/80 to-pink-900/70" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm mb-6">
              <Scale className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">ميثاق السلوك الجامعي</h1>
            <p className="text-lg text-purple-100 max-w-3xl mx-auto mb-8 leading-relaxed">
              الدستور الأخلاقي لجامعة بني سويف التكنولوجية — يحدد معايير السلوك المقبول وغير المقبول داخل الحرم الجامعي ويضمن بيئة تعليمية آمنة وعادلة للجميع.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-white text-purple-900 hover:bg-gray-100 font-bold">
                <Download className="ml-2 h-5 w-5" /> تحميل الميثاق PDF
              </Button>
              <Link to="/report">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-bold">
                  <Shield className="ml-2 h-5 w-5" /> إبلاغ سري
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 space-y-8 max-w-5xl">
        {/* Introduction */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8 border border-primary/10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center shrink-0">
              <BookOpen className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-3">المقدمة</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                تلتزم جامعة بني سويف التكنولوجية بتوفير بيئة تعليمية آمنة وعادلة خالية من جميع أشكال التمييز والعنف. ويهدف هذا الميثاق إلى تحديد معايير السلوك المقبول داخل الحرم الجامعي وضمان احترام حقوق جميع أفراده من طلاب وأعضاء هيئة تدريس وعاملين.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                يُعد هذا الميثاق بمثابة عقد اجتماعي بين جميع منتسبي الجامعة، يلتزم بموجبه الجميع بقيم الاحترام المتبادل والتسامح والعدالة. وقد تم إعداد هذا الميثاق بالتعاون مع وحدة مناهضة العنف ضد المرأة بالجامعة، وفقاً للقوانين واللوائح الجامعية المعمول بها والمواثيق الدولية لحقوق الإنسان.
              </p>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { icon: Shield, text: "حماية الطلاب والطالبات" },
                  { icon: Ban, text: "منع العنف والتمييز" },
                  { icon: Scale, text: "العدالة والمساواة" },
                  { icon: Heart, text: "بيئة تعليمية محترمة" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-card p-3 rounded-xl border border-border">
                    <item.icon className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-sm font-medium text-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Prohibited Behaviors */}
        <ExpandableSection title="السلوكيات المرفوضة" icon={Ban} color="destructive">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BehaviorCard
              title="أولاً: التحرش"
              icon={AlertTriangle}
              color="border-red-200 bg-red-50/50"
              items={[
                "التحرش اللفظي: استخدام ألفاظ أو تعليقات جنسية أو مسيئة أو مُهينة تجاه أي شخص داخل الحرم الجامعي.",
                "التحرش الجسدي: أي لمس أو اتصال جسدي غير مرغوب فيه بأي شكل من الأشكال، سواء كان مباشراً أو غير مباشر.",
                "التحرش الإلكتروني: إرسال رسائل أو صور أو مقاطع فيديو ذات محتوى جنسي أو مسيء عبر وسائل التواصل الاجتماعي أو البريد الإلكتروني أو أي وسيلة رقمية.",
                "إرسال رسائل غير لائقة: إرسال رسائل متكررة غير مرغوب فيها أو ذات طابع تهديدي أو ابتزازي.",
                "التلصص والمراقبة: تتبع أو مراقبة شخص ما بدون موافقته أو علمه بشكل يُشعره بالتهديد أو عدم الأمان.",
                "التصوير بدون إذن: تصوير أي شخص بدون موافقته الصريحة ونشر أو تداول هذه الصور أو الفيديوهات.",
              ]}
            />
            <BehaviorCard
              title="ثانياً: التمييز"
              icon={Users}
              color="border-orange-200 bg-orange-50/50"
              items={[
                "التمييز بسبب الجنس: أي معاملة تفضيلية أو تمييزية على أساس النوع الاجتماعي في الأنشطة الأكاديمية أو الاجتماعية.",
                "التمييز بسبب الخلفية الاجتماعية: التقليل من شأن أي شخص بسبب مستواه الاقتصادي أو الاجتماعي أو خلفيته الثقافية.",
                "التمييز الديني أو الفكري: أي تمييز أو إقصاء بسبب المعتقدات الدينية أو الأفكار الشخصية أو التوجهات الفكرية.",
                "التمييز الأكاديمي: التفرقة في المعاملة بين الطلاب في التقييم الأكاديمي على أساس غير موضوعي.",
                "التمييز بسبب الإعاقة: أي إقصاء أو تهميش لذوي الاحتياجات الخاصة أو عدم توفير التسهيلات اللازمة لهم.",
                "التمييز العرقي أو الجغرافي: التفرقة بين الطلاب بسبب محافظاتهم أو أصولهم الجغرافية.",
              ]}
            />
            <BehaviorCard
              title="ثالثاً: العنف"
              icon={AlertTriangle}
              color="border-red-300 bg-red-50/50"
              items={[
                "العنف الجسدي: أي اعتداء جسدي بأي شكل من الأشكال، بما في ذلك الضرب أو الدفع أو أي فعل يسبب أذى بدنياً.",
                "التهديد: أي تهديد بالإيذاء الجسدي أو النفسي أو الأكاديمي، سواء كان شفهياً أو كتابياً أو عبر وسائل التواصل.",
                "التنمر: السخرية المتكررة أو الإهانة أو الإذلال أو الإقصاء المتعمد لشخص ما بهدف إيذائه نفسياً.",
                "التشهير: نشر معلومات شخصية أو صور أو مقاطع فيديو خاصة بشخص ما بهدف الإضرار بسمعته أو ابتزازه.",
                "العنف اللفظي: استخدام الألفاظ النابية أو الشتائم أو الكلمات الجارحة التي تمس الكرامة الشخصية.",
                "العنف النفسي: أي سلوك يهدف إلى السيطرة النفسية أو الإذلال أو التخويف أو العزل الاجتماعي المتعمد.",
              ]}
            />
            <BehaviorCard
              title="رابعاً: إساءة استخدام السلطة"
              icon={Scale}
              color="border-purple-200 bg-purple-50/50"
              items={[
                "استغلال النفوذ: استخدام المنصب أو السلطة الأكاديمية أو الإدارية للحصول على مكاسب شخصية أو لممارسة ضغوط غير مشروعة.",
                "الضغط غير الأكاديمي: ممارسة ضغوط على الطلاب خارج نطاق العملية التعليمية مثل الإجبار على حضور أحداث خاصة.",
                "الابتزاز: ربط التقييم الأكاديمي أو أي قرار إداري بمطالب شخصية غير مشروعة.",
                "التقييم التعسفي: إعطاء درجات أو تقييمات غير عادلة بناءً على عوامل شخصية بعيداً عن المعايير الأكاديمية.",
                "المحسوبية: تقديم امتيازات غير مستحقة لبعض الطلاب على حساب آخرين بناءً على العلاقات الشخصية.",
                "إخفاء المعلومات: حجب معلومات أكاديمية مهمة عن بعض الطلاب بشكل متعمد وانتقائي.",
              ]}
            />
          </div>
        </ExpandableSection>

        {/* Penalties */}
        <ExpandableSection title="العقوبات التدريجية" icon={Gavel} color="warning">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <PenaltyLevel
              level="مخالفة بسيطة"
              color="border-yellow-300 bg-yellow-50/30"
              icon="🟡"
              items={[
                "إنذار شفهي رسمي من المسؤول المباشر مع توثيق المخالفة في سجل الطالب.",
                "تعهد كتابي بعدم تكرار السلوك المخالف مع إقرار بالعلم بالعقوبات المترتبة.",
                "حضور جلسة توعوية إلزامية مع متخصصين في الوحدة.",
                "الاعتذار الرسمي للمتضرر (إن وُجد) بشكل مباشر أو من خلال الوحدة.",
              ]}
            />
            <PenaltyLevel
              level="مخالفة متوسطة"
              color="border-orange-300 bg-orange-50/30"
              icon="🟠"
              items={[
                "إنذار رسمي مكتوب يُحفظ في ملف الطالب الأكاديمي ويؤثر على تقييم السلوك.",
                "الحرمان المؤقت من المشاركة في الأنشطة والفعاليات الجامعية لمدة فصل دراسي.",
                "خصم درجات السلوك المؤثرة في التقدير العام حسب لائحة الجامعة.",
                "إلزام الطالب ببرنامج إعادة تأهيل سلوكي تحت إشراف متخصصين.",
                "إبلاغ ولي الأمر رسمياً بالمخالفة والإجراءات المتخذة.",
              ]}
            />
            <PenaltyLevel
              level="مخالفة جسيمة"
              color="border-red-400 bg-red-50/30"
              icon="🔴"
              items={[
                "الإيقاف المؤقت عن الدراسة لمدة تتراوح بين أسبوع وفصل دراسي كامل.",
                "التحويل إلى مجلس تأديبي رسمي للنظر في المخالفة واتخاذ القرار المناسب.",
                "الفصل النهائي من الجامعة في حالات العنف الجسيمة أو التكرار (وفقاً للوائح).",
                "تحويل الملف إلى الجهات القانونية المختصة في حالة ارتكاب جرائم يعاقب عليها القانون.",
                "الحرمان الدائم من جميع الامتيازات والأنشطة الطلابية.",
              ]}
            />
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm text-amber-800 font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>جميع العقوبات تُطبق وفقاً للوائح جامعة بني سويف التكنولوجية والقوانين المنظمة للتعليم العالي في جمهورية مصر العربية. يحق لكل طرف التظلم من القرارات التأديبية وفقاً للإجراءات القانونية المعمول بها.</span>
            </p>
          </div>
        </ExpandableSection>

        {/* Student Obligations */}
        <ExpandableSection title="التزامات الطلاب" icon={HandHeart} color="success">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Heart, title: "احترام الجميع", desc: "احترام جميع الزملاء والزميلات وأعضاء هيئة التدريس والعاملين بالجامعة دون أي تمييز، والتعامل بلطف ومودة في جميع المواقف والتفاعلات اليومية." },
              { icon: BookOpen, title: "الالتزام بالقيم الأخلاقية", desc: "التحلي بالقيم الأخلاقية والمبادئ السامية التي تعكس صورة إيجابية عن الجامعة ومنتسبيها، والحفاظ على السلوك القويم في جميع الأوقات." },
              { icon: Shield, title: "الإبلاغ عن المخالفات", desc: "الإبلاغ الفوري عن أي سلوك مخالف أو مشبوه يهدد أمن وسلامة أي فرد داخل الحرم الجامعي، سواء كنت شاهداً أو متضرراً." },
              { icon: Users, title: "التعاون مع لجان التحقيق", desc: "التعاون الكامل والصادق مع لجان التحقيق في حالة الاستدعاء، وتقديم الشهادات والمعلومات الصحيحة التي تساعد في كشف الحقيقة." },
              { icon: Lock, title: "الحفاظ على السرية", desc: "الحفاظ على سرية الإجراءات التأديبية والتحقيقات وعدم نشر أي معلومات عنها، حمايةً لخصوصية جميع الأطراف المعنية." },
              { icon: Scale, title: "احترام اللوائح", desc: "الالتزام بجميع القوانين واللوائح الجامعية المعمول بها والتعرف عليها بشكل دوري، والمشاركة في البرامج التوعوية التي تنظمها الوحدة." },
            ].map((item, i) => (
              <div key={i} className="bg-green-50/50 border border-green-200 rounded-xl p-5">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mb-3">
                  <item.icon className="h-5 w-5 text-green-600" />
                </div>
                <h4 className="font-bold text-foreground mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </ExpandableSection>

        {/* Rights */}
        <ExpandableSection title="حقوق المشتكي والمتهم" icon={Scale} color="blue">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-600" /> حقوق المشتكي (المتضرر)
              </h4>
              {[
                { title: "السرية التامة", desc: "ضمان سرية جميع المعلومات الشخصية والبيانات المتعلقة بالشكوى وعدم الكشف عنها لأي جهة غير مخولة." },
                { title: "الحماية من الانتقام", desc: "توفير حماية كاملة من أي محاولة انتقامية أو تهديدية قد يتعرض لها المشتكي نتيجة تقديم البلاغ." },
                { title: "المتابعة الدورية", desc: "الحق في الاطلاع على سير التحقيق ومراحل معالجة الشكوى والحصول على تحديثات منتظمة." },
                { title: "الدعم النفسي والقانوني", desc: "الحصول على الدعم النفسي والمشورة القانونية المجانية طوال فترة التحقيق وبعدها." },
                { title: "حق التمثيل", desc: "الحق في الاستعانة بممثل أو مستشار خلال جلسات التحقيق والاستماع." },
                { title: "حق الطعن", desc: "الحق في التظلم من القرارات الصادرة إذا رأى المشتكي أنها غير عادلة أو غير كافية." },
              ].map((item, i) => (
                <div key={i} className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
                  <h5 className="font-bold text-foreground text-sm mb-1">{item.title}</h5>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-foreground flex items-center gap-2">
                <EyeOff className="h-5 w-5 text-purple-600" /> حقوق المتهم
              </h4>
              {[
                { title: "افتراض البراءة", desc: "يُعامل المتهم على أنه بريء حتى تثبت إدانته بشكل قاطع من خلال تحقيق عادل ومحايد وشفاف." },
                { title: "حق الدفاع", desc: "الحق الكامل في الدفاع عن نفسه وتقديم شهوده وأدلته والرد على جميع الاتهامات الموجهة إليه." },
                { title: "تحقيق عادل ومحايد", desc: "ضمان إجراء تحقيق عادل ومحايد بعيداً عن أي تحيز أو ضغوط خارجية، مع الالتزام بمبادئ العدالة الطبيعية." },
                { title: "السرية", desc: "حماية هوية المتهم وعدم الكشف عنها قبل صدور قرار نهائي، حفاظاً على سمعته وكرامته." },
                { title: "حق التمثيل القانوني", desc: "الحق في الاستعانة بمستشار أو محامٍ خلال إجراءات التحقيق والمحاكمة التأديبية." },
                { title: "حق الاستئناف", desc: "الحق في الطعن على القرارات التأديبية الصادرة ضده أمام الجهات المختصة وفقاً للإجراءات المعمول بها." },
              ].map((item, i) => (
                <div key={i} className="bg-purple-50/50 border border-purple-100 rounded-xl p-4">
                  <h5 className="font-bold text-foreground text-sm mb-1">{item.title}</h5>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </ExpandableSection>

        {/* Anonymous Reporting Policy */}
        <ExpandableSection title="سياسة الإبلاغ المجهول" icon={EyeOff} color="primary">
          <div className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              تؤمن جامعة بني سويف التكنولوجية بأهمية تشجيع الإبلاغ عن أي مخالفات أو انتهاكات داخل الحرم الجامعي. لذلك، توفر الجامعة نظاماً متكاملاً للإبلاغ المجهول يضمن:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: EyeOff, title: "بدون ذكر الاسم", desc: "يمكن تقديم بلاغ كامل بدون الكشف عن هوية المبلِّغ. النظام مصمم لحماية الخصوصية التامة." },
                { icon: Shield, title: "التعامل بجدية", desc: "جميع البلاغات المجهولة تُعامل بنفس الجدية والاهتمام التي تحظى بها البلاغات العادية." },
                { icon: Lock, title: "لا مساءلة للمبلِّغ", desc: "لا توجد أي مساءلة قانونية أو إدارية للمبلِّغ بحسن نية، حتى لو تبين عدم صحة البلاغ." },
                { icon: MessageCircle, title: "متابعة آمنة", desc: "يحصل المبلِّغ على رقم مرجعي سري لمتابعة حالة البلاغ دون الكشف عن هويته." },
                { icon: FileText, title: "توثيق آمن", desc: "جميع البلاغات توثَّق في نظام إلكتروني مشفر لا يمكن الوصول إليه إلا من قبل المختصين." },
                { icon: Heart, title: "دعم متواصل", desc: "يتوفر دعم نفسي واجتماعي للمبلِّغين حتى بعد تقديم البلاغ وخلال فترة التحقيق." },
              ].map((item, i) => (
                <div key={i} className="bg-accent rounded-xl p-4 border border-primary/10">
                  <item.icon className="h-6 w-6 text-primary mb-2" />
                  <h5 className="font-bold text-foreground text-sm mb-1">{item.title}</h5>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </ExpandableSection>

        {/* Illustrative Examples */}
        <ExpandableSection title="أمثلة توضيحية" icon={BookOpen} color="primary">
          <p className="text-muted-foreground mb-4 leading-relaxed">
            لمساعدة الطلاب على فهم أنواع المخالفات وتصنيفاتها، نقدم الأمثلة التوضيحية التالية. هذه الأمثلة ليست حصرية وإنما استرشادية لتوضيح المفاهيم:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <ExampleCard scenario="طالب أرسل رسائل متكررة غير مرغوبة عبر فيسبوك لزميلته رغم طلبها التوقف" classification="يُعد تحرشاً إلكترونياً — مخالفة متوسطة إلى جسيمة" />
            <ExampleCard scenario="أستاذ جامعي يمنح درجات أعلى لطلاب معينين بناءً على علاقات شخصية" classification="يُعد تمييزاً أكاديمياً وإساءة استخدام سلطة" />
            <ExampleCard scenario="مجموعة طلاب تسخر بشكل متكرر من زميل بسبب لهجته أو محافظته" classification="يُعد تنمراً وتمييزاً — مخالفة بسيطة إلى متوسطة" />
            <ExampleCard scenario="طالب يصوّر زميلته بدون علمها وينشر الصور في مجموعات واتساب" classification="يُعد تحرشاً وتشهيراً — مخالفة جسيمة" />
            <ExampleCard scenario="موظف يربط تسهيل إجراءات إدارية بطلبات شخصية من طالبة" classification="يُعد ابتزازاً وإساءة استخدام سلطة — مخالفة جسيمة" />
            <ExampleCard scenario="طالب يتعمد عزل زميل من المجموعات الدراسية ويحرضّ الآخرين على مقاطعته" classification="يُعد عنفاً نفسياً وتنمراً — مخالفة متوسطة" />
            <ExampleCard scenario="نشر شائعات كاذبة عن طالبة عبر حسابات مجهولة على وسائل التواصل الاجتماعي" classification="يُعد تشهيراً إلكترونياً — مخالفة جسيمة" />
            <ExampleCard scenario="أستاذ يُلزم طلابه بحضور فعاليات خاصة خارج نطاق المقرر ويخصم درجات لمن لا يحضر" classification="يُعد ضغطاً غير أكاديمي — مخالفة متوسطة" />
          </div>
        </ExpandableSection>

        {/* CTA */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ duration: 0.5 }}
          className="bg-gradient-brand rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <div className="relative z-10">
            <Scale className="h-12 w-12 mx-auto mb-4 opacity-80" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">التزامك بالميثاق يحمينا جميعاً</h2>
            <p className="text-purple-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              بتوقيعك على ميثاق السلوك، أنت تساهم في بناء بيئة جامعية آمنة ومحترمة. إذا شهدت أي مخالفة أو تعرضت لها، لا تتردد في الإبلاغ — نحن هنا لحمايتك.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/report">
                <Button size="lg" className="bg-white text-purple-900 hover:bg-gray-100 font-bold">
                  <Shield className="ml-2 h-5 w-5" /> قدم بلاغاً سرياً
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-bold">
                <Download className="ml-2 h-5 w-5" /> تحميل الميثاق PDF
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CodeOfConduct;
