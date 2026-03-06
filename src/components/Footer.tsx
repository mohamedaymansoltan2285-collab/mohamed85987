import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Award } from "lucide-react";
import ncwLogo from "@/assets/ncw-logo.png";
import btuLogo from "@/assets/btu-logo.png";

const Footer = () => {
  return (
    <footer className="bg-slate-50 border-t border-purple-100 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        {/* Partner logos bar */}
        <div className="flex flex-wrap items-center justify-center gap-8 mb-12 pb-8 border-b border-border">
          <img src={btuLogo} alt="جامعة بني سويف التكنولوجية" className="h-16 w-auto object-contain" />
          <img src={ncwLogo} alt="المجلس القومي للمرأة" className="h-16 w-auto object-contain" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src="/src/assets/logo.png" alt="شعار الوحدة" className="h-12 w-auto" />
              <span className="font-bold text-lg text-primary">وحدة مناهضة العنف</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">بيئة جامعية آمنة تدعم الجميع. نحن هنا لتقديم الدعم والمساعدة لكل من يحتاجها داخل الحرم الجامعي بسرية تامة.</p>
            <div className="bg-white rounded-xl p-3 border border-purple-100 mb-4 space-y-1.5">
              <div className="flex items-center gap-2"><Award className="h-4 w-4 text-primary shrink-0" /><span className="text-xs text-gray-700"><strong>رئيسة الوحدة:</strong> د. غادة طوسون</span></div>
              <div className="flex items-center gap-2"><Award className="h-4 w-4 text-secondary shrink-0" /><span className="text-xs text-gray-700"><strong>نائب الرئيس:</strong> د. سمر محمد</span></div>
            </div>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"><Facebook size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"><Twitter size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"><Instagram size={18} /></a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-800 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:right-0 after:w-12 after:h-1 after:bg-secondary after:rounded-full">روابط سريعة</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-600 hover:text-primary transition-colors text-sm">من نحن</Link></li>
              <li><Link to="/activities" className="text-gray-600 hover:text-primary transition-colors text-sm">الأنشطة والفعاليات</Link></li>
              <li><Link to="/library" className="text-gray-600 hover:text-primary transition-colors text-sm">المكتبة التوعوية</Link></li>
              <li><Link to="/safe-map" className="text-gray-600 hover:text-primary transition-colors text-sm">خريطة الأمان</Link></li>
              <li><Link to="/volunteer" className="text-gray-600 hover:text-primary transition-colors text-sm">تطوع معنا</Link></li>
              <li><Link to="/forum" className="text-gray-600 hover:text-primary transition-colors text-sm">المنتدى</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-800 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:right-0 after:w-12 after:h-1 after:bg-secondary after:rounded-full">خدماتنا</h3>
            <ul className="space-y-3">
              <li><Link to="/report" className="text-gray-600 hover:text-primary transition-colors text-sm">الإبلاغ السري</Link></li>
              <li><Link to="/quiz" className="text-gray-600 hover:text-primary transition-colors text-sm">اختبر وعيك</Link></li>
              <li><Link to="/know-your-rights" className="text-gray-600 hover:text-primary transition-colors text-sm">اعرف حقوقك</Link></li>
              <li><Link to="/student-guide" className="text-gray-600 hover:text-primary transition-colors text-sm">دليل الطالب</Link></li>
              <li><Link to="/install" className="text-gray-600 hover:text-primary transition-colors text-sm">تثبيت التطبيق</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-800 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:right-0 after:w-12 after:h-1 after:bg-secondary after:rounded-full">تواصل معنا</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-gray-600"><MapPin className="text-secondary shrink-0 mt-1" size={18} /><span>جامعة بني سويف التكنولوجية، المبنى الإداري</span></li>
              <li className="flex items-center gap-3 text-sm text-gray-600"><Phone className="text-secondary shrink-0" size={18} /><span dir="ltr">+20 123 456 7890</span></li>
              <li className="flex items-center gap-3 text-sm text-gray-600"><Mail className="text-secondary shrink-0" size={18} /><span>contact@safe-unit.edu.eg</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 text-center md:text-right">© {new Date().getFullYear()} وحدة تكافؤ الفرص ومناهضة العنف ضد المرأة - جامعة بني سويف التكنولوجية. جميع الحقوق محفوظة.</p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link to="/privacy" className="hover:text-primary">سياسة الخصوصية</Link>
            <Link to="/terms" className="hover:text-primary">شروط الاستخدام</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
