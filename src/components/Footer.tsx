import { useState } from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Award, Code2, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ncwLogo from "@/assets/ncw-logo.png";
import btuLogo from "@/assets/btu-logo.png";

const Footer = () => {
  const [glowing, setGlowing] = useState(false);

  return (
    <footer className="bg-slate-50 border-t border-purple-100 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">

        {/* Partner logos bar */}
        <div className="flex flex-wrap items-center justify-center gap-8 mb-12 pb-8 border-b border-border">
          <img src={btuLogo} alt="جامعة بني سويف التكنولوجية" className="h-16 w-auto object-contain" />
          <img src={ncwLogo} alt="المجلس القومي للمرأة" className="h-16 w-auto object-contain" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src="/src/assets/logo.png" alt="شعار الوحدة" className="h-12 w-auto" />
              <span className="font-bold text-lg text-primary">وحدة مناهضة العنف</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              بيئة جامعية آمنة تدعم الجميع. نحن هنا لتقديم الدعم والمساعدة لكل من يحتاجها داخل الحرم الجامعي بسرية تامة.
            </p>
            <div className="bg-white rounded-xl p-3 border border-purple-100 mb-4 space-y-1.5">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-primary shrink-0" />
                <span className="text-xs text-gray-700"><strong>رئيسة الوحدة:</strong> د. غادة طوسون</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-secondary shrink-0" />
                <span className="text-xs text-gray-700"><strong>نائب الرئيس:</strong> د. سمر محمد</span>
              </div>
            </div>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-white shadow-sm border border-border flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-bold text-base mb-4 text-gray-800 relative inline-block after:content-[''] after:absolute after:-bottom-1.5 after:right-0 after:w-10 after:h-0.5 after:bg-secondary after:rounded-full">
              روابط سريعة
            </h3>
            <ul className="space-y-2.5">
              {[
                { to: "/about", label: "من نحن" },
                { to: "/activities", label: "الأنشطة والفعاليات" },
                { to: "/library", label: "المكتبة التوعوية" },
                { to: "/safe-map", label: "خريطة الأمان" },
                { to: "/volunteer", label: "تطوع معنا" },
                { to: "/forum", label: "المنتدى" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-gray-600 hover:text-primary transition-colors text-sm">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-base mb-4 text-gray-800 relative inline-block after:content-[''] after:absolute after:-bottom-1.5 after:right-0 after:w-10 after:h-0.5 after:bg-secondary after:rounded-full">
              خدماتنا
            </h3>
            <ul className="space-y-2.5">
              {[
                { to: "/report", label: "الإبلاغ السري" },
                { to: "/quiz", label: "اختبر وعيك" },
                { to: "/know-your-rights", label: "اعرف حقوقك" },
                { to: "/student-guide", label: "دليل الطالب" },
                { to: "/install", label: "تثبيت التطبيق" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-gray-600 hover:text-primary transition-colors text-sm">
                    {label}
                  </Link>
                </li>
              ))}
              {/* Legal links — visible on desktop here */}
              <li className="hidden md:block pt-1 border-t border-gray-100">
                <Link to="/privacy" className="text-gray-600 hover:text-primary transition-colors text-sm">
                  سياسة الخصوصية
                </Link>
              </li>
              <li className="hidden md:block">
                <Link to="/terms" className="text-gray-600 hover:text-primary transition-colors text-sm">
                  شروط الاستخدام
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-base mb-4 text-gray-800 relative inline-block after:content-[''] after:absolute after:-bottom-1.5 after:right-0 after:w-10 after:h-0.5 after:bg-secondary after:rounded-full">
              تواصل معنا
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-600">
                <MapPin className="text-secondary shrink-0 mt-0.5" size={16} />
                <span>جامعة بني سويف التكنولوجية، المبنى الإداري</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <Phone className="text-secondary shrink-0" size={16} />
                <span dir="ltr">+20 123 456 7890</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <Mail className="text-secondary shrink-0" size={16} />
                <span>contact@safe-unit.edu.eg</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile-only legal links */}
        <div className="flex md:hidden justify-center gap-6 mb-6 pb-6 border-b border-gray-100">
          <Link to="/privacy" className="text-sm text-gray-500 hover:text-primary transition-colors font-medium">
            سياسة الخصوصية
          </Link>
          <Link to="/terms" className="text-sm text-gray-500 hover:text-primary transition-colors font-medium">
            شروط الاستخدام
          </Link>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-200 pt-8 flex flex-col items-center gap-4">
          <p className="text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} وحدة تكافؤ الفرص ومناهضة العنف ضد المرأة · جامعة بني سويف التكنولوجية. جميع الحقوق محفوظة.
          </p>

          {/* Developer credit with glow toggle */}
          <button
            onClick={() => setGlowing(g => !g)}
            className="group flex items-center gap-2 focus:outline-none select-none"
            aria-label="توهيج توقيع المطور"
          >
            <Code2 size={14} className={`transition-colors ${glowing ? "text-secondary" : "text-gray-400 group-hover:text-primary"}`} />
            <motion.span
              animate={glowing ? {
                textShadow: [
                  "0 0 6px hsl(326,68%,55%,0.6)",
                  "0 0 18px hsl(262,52%,47%,0.9)",
                  "0 0 6px hsl(326,68%,55%,0.6)",
                ],
                color: ["hsl(326,68%,55%)", "hsl(262,52%,47%)", "hsl(326,68%,55%)"],
              } : { textShadow: "none", color: "hsl(240,3.8%,46.1%)" }}
              transition={{ duration: 2, repeat: glowing ? Infinity : 0, ease: "easeInOut" }}
              className="text-xs font-medium font-mono tracking-wide"
            >
              بواسطة محمد أيمن محمد سلطان
            </motion.span>
            <AnimatePresence>
              {glowing && (
                <motion.span
                  key="sparkle"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  className="text-xs"
                >
                  ✦
                </motion.span>
              )}
            </AnimatePresence>
            <ExternalLink size={12} className={`transition-colors ${glowing ? "text-primary" : "text-gray-300 group-hover:text-gray-400"}`} />
          </button>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
