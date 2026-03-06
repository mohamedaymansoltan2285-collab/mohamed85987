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
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border flex items-center justify-around md:hidden z-50">
      {links.map((link) => {
        const active = isActive(link.path);
        return (
          <Link
            key={link.path}
            to={link.path}
            className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
              active ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <link.icon
              size={20}
              strokeWidth={active ? 2.5 : 1.8}
            />
            <span className={`text-[10px] font-medium ${active ? "font-bold" : ""}`}>
              {link.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
