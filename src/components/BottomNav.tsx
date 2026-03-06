import { Link, useLocation } from "react-router-dom";
import { Home, Shield, BookOpen, User, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

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
    <div
      className="fixed bottom-0 left-0 right-0 md:hidden"
      style={{ zIndex: 100 }}
    >
      {/* Frosted glass card */}
      <div className="mx-2 mb-2 rounded-2xl bg-card/90 backdrop-blur-xl border border-border shadow-2xl overflow-hidden">
        <div className="flex justify-around items-center h-16 px-1">
          {links.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className="relative flex flex-col items-center justify-center gap-0.5 flex-1 py-1 rounded-xl"
              >
                {active && (
                  <motion.div
                    layoutId="bottom-nav-pill"
                    className="absolute inset-0 bg-primary/10 rounded-xl"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.4 }}
                  />
                )}
                <link.icon
                  size={20}
                  strokeWidth={active ? 2.5 : 1.5}
                  className={`relative z-10 transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}
                />
                <span
                  className={`relative z-10 text-[10px] font-medium transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}
                >
                  {link.label}
                </span>
                {active && (
                  <motion.div
                    layoutId="bottom-nav-dot"
                    className="absolute -top-0.5 w-4 h-0.5 bg-primary rounded-full"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.4 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
