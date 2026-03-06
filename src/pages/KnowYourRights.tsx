import { motion } from "framer-motion";
import { Shield, BookOpen, Scale, Heart, AlertTriangle, Users, FileText, Gavel, HandHeart, Eye, Lock, Ban, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const RightCard = ({ icon: Icon, title, desc, color }: { icon: any; title: string; desc: string; color: string }) => (
  <motion.div variants={fadeIn} className={`rounded-2xl p-6 border ${color} hover:shadow-md transition-shadow`}>
    <Icon className="h-8 w-8 mb-4" />
    <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
  </motion.div>
);

const KnowYourRights = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-purple-800/80 to-blue-900/70" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm mb-6">
              <BookOpen className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">اعرف حقوقك</h1>
            <p className="text-lg text-blue-100 max-w-3xl mx-auto mb-8 leading-relaxed">
              المعرفة هي خط الدفاع الأول. تعرّف على حقوقك كاملة داخل الجامعة، والقوانين التي تحميك، وآليات الحماية المتاحة لك.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-6xl space-y-16">
        {/* Student Rights */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ staggerChildren: 0.1 }}>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-primary font-bold mb-2"><Shield className="h-5 w-5" /><span>حقوقك الأساسية</span></div>
            <h2 className="text-3xl font-bold text-foreground mb-3">حقوق الطالب والطالبة داخل الجامعة</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">هذه حقوق أساسية مكفولة لكل منتسب للجامعة بموجب اللوائح الجامعية والقوانين المصرية والمواثيق الدولية</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <RightCard icon={Shield} title="الحق في بيئة آمنة" desc="لكل طالب وطالبة الحق في بيئة تعليمية آمنة وخالية من جميع أشكال العنف والتحرش والتمييز والتنمر. هذا حق أساسي وليس امتيازاً. الجامعة ملتزمة بتوفير هذه البيئة وحمايتها واتخاذ جميع الإجراءات اللازمة لمنع أي انتهاك لهذا الحق." color="border-blue-200 bg-blue-50/30 text-blue-600" />
            <RightCard icon={Heart} title="الحق في الكرامة والاحترام" desc="لكل فرد في المجتمع الجامعي الحق في المعاملة بكرامة واحترام كامل بغض النظر عن جنسه أو خلفيته الاجتماعية أو معتقداته أو أي عامل آخر. أي إهانة أو تقليل من شأن أي شخص يُعد مخالفة جسيمة تستوجب المحاسبة." color="border-pink-200 bg-pink-50/30 text-pink-600" />
            <RightCard icon={Scale} title="الحق في التقييم العادل" desc="لكل طالب الحق في تقييم أكاديمي عادل وموضوعي يعتمد على المعايير الأكاديمية فقط. أي تمييز في التقييم بناءً على الجنس أو العلاقات الشخصية أو أي عامل غير أكاديمي يُعد مخالفة خطيرة يحق للطالب الإبلاغ عنها." color="border-amber-200 bg-amber-50/30 text-amber-600" />
            <RightCard icon={Lock} title="الحق في الخصوصية" desc="جميع المعلومات الشخصية والأكاديمية للطالب محمية ولا يجوز الكشف عنها أو استخدامها بدون موافقته الصريحة. يشمل ذلك البيانات الأكاديمية والصحية والنفسية والتأديبية. أي انتهاك للخصوصية يُعد مخالفة تستوجب المحاسبة." color="border-green-200 bg-green-50/30 text-green-600" />
            <RightCard icon={Eye} title="الحق في حرية التعبير" desc="لكل فرد الحق في التعبير عن رأيه بحرية ضمن إطار القانون واللوائح الجامعية وبما لا يمس حقوق الآخرين أو كرامتهم. حرية التعبير تشمل النقد البنّاء والمشاركة في النقاشات الأكاديمية والمبادرات الطلابية." color="border-purple-200 bg-purple-50/30 text-purple-600" />
            <RightCard icon={FileText} title="الحق في الإبلاغ الآمن" desc="لكل شخص الحق في الإبلاغ عن أي مخالفة أو انتهاك بدون خوف من العقاب أو الانتقام. تلتزم الجامعة بحماية المبلِّغين وضمان سرية هويتهم والتحقيق الجاد في جميع البلاغات المقدمة دون تمييز." color="border-indigo-200 bg-indigo-50/30 text-indigo-600" />
          </div>
        </motion.section>

        {/* University Policies */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-primary font-bold mb-2"><Gavel className="h-5 w-5" /><span>سياسات الجامعة</span></div>
            <h2 className="text-3xl font-bold text-foreground mb-3">السياسات والقوانين المنظمة</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "سياسة عدم التسامح مع التحرش", desc: "تتبنى الجامعة سياسة عدم التسامح المطلق مع جميع أشكال التحرش الجنسي واللفظي والجسدي والإلكتروني. أي شكل من أشكال التحرش يُعد مخالفة جسيمة تستوجب عقوبات فورية وصارمة تصل إلى الفصل النهائي والتحويل للنيابة العامة.", icon: Ban, color: "border-red-200" },
              { title: "سياسة مكافحة التمييز", desc: "تحظر الجامعة جميع أشكال التمييز بناءً على الجنس أو الدين أو الخلفية الاجتماعية أو الإعاقة أو أي عامل آخر. تلتزم الجامعة بتكافؤ الفرص والمساواة في الحقوق والواجبات بين جميع منتسبيها وتتخذ إجراءات فورية ضد أي شكل من أشكال التمييز.", icon: Users, color: "border-orange-200" },
              { title: "سياسة حماية المبلِّغين", desc: "تتعهد الجامعة بحماية كل من يتقدم ببلاغ أو شكوى من أي شكل من أشكال الانتقام أو المضايقة. تشمل الحماية السرية التامة للهوية والمعلومات، واتخاذ إجراءات فورية ضد أي محاولة انتقامية، وتوفير الدعم النفسي والقانوني للمبلِّغين.", icon: Shield, color: "border-blue-200" },
              { title: "لائحة التأديب الجامعية", desc: "تتضمن لائحة التأديب الجامعية العقوبات المقررة لمختلف المخالفات بشكل تدريجي ومتناسب. تبدأ العقوبات من الإنذار الشفهي وتصل إلى الفصل النهائي. تضمن اللائحة حقوق المتهم في الدفاع والاستئناف وتكفل إجراءات تحقيق عادلة ومحايدة.", icon: Gavel, color: "border-purple-200" },
            ].map((policy, i) => (
              <div key={i} className={`bg-card rounded-2xl p-6 border ${policy.color} hover:shadow-md transition-shadow`}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0">
                    <policy.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{policy.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{policy.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Types of Violence */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-destructive font-bold mb-2"><AlertTriangle className="h-5 w-5" /><span>تعريفات مهمة</span></div>
            <h2 className="text-3xl font-bold text-foreground mb-3">تعريف العنف وأنواعه</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">فهم أنواع العنف يساعدك في التعرف على المواقف وحماية نفسك والآخرين</p>
          </div>
          <div className="space-y-4">
            {[
              { type: "العنف الجسدي", def: "أي فعل يتضمن استخدام القوة البدنية ضد شخص آخر بشكل يسبب أو قد يسبب أذى جسدياً. يشمل الضرب، الدفع، الركل، الخنق، الحبس، استخدام أدوات حادة أو ثقيلة، أو أي شكل من أشكال الإيذاء البدني.", icon: "🔴", color: "border-r-red-500" },
              { type: "العنف النفسي والعاطفي", def: "أي سلوك يهدف إلى إيذاء الشخص نفسياً أو عاطفياً. يشمل الإهانة المتكررة، التقليل من الشأن، التهديد، الابتزاز العاطفي، العزل الاجتماعي المتعمد، السيطرة والتحكم، نشر الشائعات، وأي فعل يسبب ضرراً نفسياً أو عاطفياً.", icon: "🟡", color: "border-r-yellow-500" },
              { type: "العنف الجنسي والتحرش", def: "أي فعل جنسي أو محاولة جنسية أو تعليق جنسي غير مرغوب فيه. يشمل التحرش اللفظي بالتعليقات الجنسية، التحرش الجسدي باللمس غير المرغوب، التحرش البصري بالنظرات المتعمدة، والتحرش الإلكتروني بإرسال رسائل أو صور ذات طابع جنسي.", icon: "🔴", color: "border-r-red-500" },
              { type: "العنف الرقمي والإلكتروني", def: "استخدام التكنولوجيا ووسائل التواصل الاجتماعي لإيذاء شخص ما. يشمل التحرش الإلكتروني، المطاردة الرقمية، نشر صور أو معلومات خاصة بدون إذن، التشهير الإلكتروني، الابتزاز الرقمي، وانتحال الشخصية الإلكترونية.", icon: "🟠", color: "border-r-orange-500" },
              { type: "العنف الاقتصادي", def: "التحكم في الموارد المالية لشخص ما أو استغلاله مادياً. يشمل سرقة الممتلكات الشخصية، إتلاف الممتلكات عمداً، الابتزاز المادي، وفرض أعباء مالية غير مستحقة.", icon: "🟡", color: "border-r-yellow-500" },
              { type: "التمييز المؤسسي", def: "السياسات أو الممارسات التي تؤدي بشكل منهجي إلى تمييز أو إقصاء مجموعة معينة. يشمل التمييز في القبول، التقييم غير العادل، عدم توفير تسهيلات لذوي الاحتياجات الخاصة، والإقصاء من الأنشطة أو الفرص.", icon: "🟠", color: "border-r-orange-500" },
            ].map((item, i) => (
              <div key={i} className={`bg-card rounded-xl p-6 border border-border border-r-4 ${item.color}`}>
                <div className="flex items-start gap-4">
                  <span className="text-2xl shrink-0">{item.icon}</span>
                  <div>
                    <h3 className="font-bold text-foreground mb-2">{item.type}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.def}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Legal Materials */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-primary font-bold mb-2"><Scale className="h-5 w-5" /><span>الإطار القانوني</span></div>
            <h2 className="text-3xl font-bold text-foreground mb-3">مواد قانونية مختصرة</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">أهم النصوص القانونية المصرية والدولية التي تحمي حقوقك</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "الدستور المصري 2014", articles: ["المادة 11: تكفل الدولة تحقيق المساواة بين المرأة والرجل في جميع الحقوق المدنية والسياسية والاقتصادية والاجتماعية والثقافية.", "المادة 53: المواطنون لدى القانون سواء، وهم متساوون في الحقوق والحريات والواجبات العامة، لا تمييز بينهم.", "المادة 80: تلتزم الدولة برعاية الأطفال والنشء وحمايتهم من جميع أشكال العنف والإساءة."] },
              { title: "قانون العقوبات المصري", articles: ["المادة 306 مكرر (أ): يعاقب بالحبس مدة لا تقل عن 6 أشهر وغرامة لا تقل عن 3000 جنيه كل من تعرض للغير في مكان عام بالقول أو الفعل.", "المادة 309 مكرر: يعاقب بالحبس كل من اعتدى على حرمة الحياة الخاصة للمواطن بالتقاط صور أو تسجيلات بدون إذن.", "قانون مكافحة التحرش 2014: يشدد العقوبات على جرائم التحرش الجنسي بجميع أشكاله."] },
              { title: "قانون مكافحة جرائم تقنية المعلومات", articles: ["المادة 25: يعاقب بالحبس والغرامة كل من اعتدى على المبادئ والقيم الأسرية عبر شبكة المعلومات.", "المادة 26: يعاقب بالحبس والغرامة كل من تعمد استعمال تقنية المعلومات في ربط محتوى منافٍ للآداب بأي شخص.", "المادة 27: يعاقب كل من أنشأ موقعاً أو حساباً خاصاً بهدف ارتكاب جريمة."] },
              { title: "المواثيق الدولية", articles: ["اتفاقية القضاء على جميع أشكال التمييز ضد المرأة (سيداو): صادقت عليها مصر عام 1981.", "الإعلان العالمي لحقوق الإنسان: يكفل الحق في الأمان والكرامة والمساواة للجميع.", "العهد الدولي الخاص بالحقوق المدنية والسياسية: يحظر التمييز ويكفل الحماية المتساوية أمام القانون."] },
            ].map((law, i) => (
              <div key={i} className="bg-card rounded-2xl border border-border p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <Gavel className="h-5 w-5 text-primary" />
                  {law.title}
                </h3>
                <ul className="space-y-3">
                  {law.articles.map((art, j) => (
                    <li key={j} className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      <span>{art}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
          className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <div className="relative z-10">
            <HandHeart className="h-12 w-12 mx-auto mb-4 opacity-80" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">حقوقك محفوظة — نحن هنا لحمايتك</h2>
            <p className="text-indigo-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              إذا تعرضت لأي شكل من أشكال العنف أو التمييز أو شعرت بعدم الأمان، لا تتردد في التواصل معنا. جميع خدماتنا سرية ومجانية.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/report">
                <Button size="lg" className="bg-white text-indigo-900 hover:bg-gray-100 font-bold">
                  <Shield className="ml-2 h-5 w-5" /> قدم بلاغاً سرياً
                </Button>
              </Link>
              <Link to="/faq">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-bold">
                  الأسئلة الشائعة <ChevronLeft className="mr-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default KnowYourRights;
