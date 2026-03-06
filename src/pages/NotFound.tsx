
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <h1 className="text-9xl font-bold text-gray-200 mb-4">404</h1>
      <h2 className="text-3xl font-bold text-gray-800 mb-4">الصفحة غير موجودة</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        عذراً، الصفحة التي تبحث عنها قد تكون نقلت أو حذفت أو غير موجودة أصلاً.
      </p>
      <Link to="/">
        <Button size="lg" className="bg-gradient-brand">
          العودة للرئيسية
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
