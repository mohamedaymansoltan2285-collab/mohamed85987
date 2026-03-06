import { Link, useLocation } from "react-router-dom";
import { Home, Shield, BookOpen, User, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const BottomNav = () => {
  const location = useLocation();
  const { user } = useAuth();

  const links = [
    { path: "/", icon: Home, label: "الرئيسية" },
    { path: "/report", icon: Shield, label: "إبلاغ" },
    { path: "/library", icon: BookOpen, label: "المكتبة" },
    { path: "/donate", icon: Heart, label: "تبرع" },
    { path: user ? "/profile" : "/auth", icon: User, label: user ? "حسابي" : "دخول" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border md:hidden">
      <div className="flex justify-around items-center h-16 px-2">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
              isActive(link.path)
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            <link.icon size={20} strokeWidth={isActive(link.path) ? 2.5 : 1.5} />
            <span className="text-[10px] font-medium">{link.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
