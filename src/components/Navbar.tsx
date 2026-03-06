import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Shield, User, Bell, BookOpen, Handshake, GraduationCap, MessageSquare, Check } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import logoImg from "@/assets/logo.png";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getReadNotifs = (): Set<string> => {
  try { return new Set(JSON.parse(localStorage.getItem("read-notifs") || "[]")); } catch { return new Set(); }
};
const saveReadNotifs = (s: Set<string>) => localStorage.setItem("read-notifs", JSON.stringify([...s]));

const typeIcon: Record<string, string> = {
  general: "📢", activity: "🎯", warning: "⚠️", success: "✅", info: "ℹ️",
  volunteer: "🤝", campaign: "📣",
};

// ─── NotifBell: shared dropdown component ─────────────────────────────────────
const NotifBell = ({
  notifications, unreadCount, onMarkAll, onMarkOne, onClose, isMobile
}: {
  notifications: any[]; unreadCount: number; onMarkAll: () => void;
  onMarkOne: (id: string) => void; onClose: () => void; isMobile?: boolean;
}) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      transition={{ duration: 0.18 }}
      className={`absolute top-full mt-2 bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col ${isMobile ? "left-0 w-72" : "left-0 w-[340px]"}`}
      style={{ maxHeight: "420px" }}
    >
      {/* Header */}
      <div className="p-3 border-b border-border flex items-center justify-between bg-gradient-to-r from-primary/5 to-transparent shrink-0">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          <span className="font-bold text-sm text-foreground">الإشعارات</span>
          {unreadCount > 0 && (
            <span className="bg-primary/10 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount} جديد</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button onClick={onMarkAll} className="text-xs text-primary hover:text-primary/80 flex items-center gap-0.5 transition-colors px-1.5 py-0.5 rounded-lg hover:bg-primary/10">
              <Check className="h-3 w-3" /> الكل مقروء
            </button>
          )}
          <button
            onClick={() => { onClose(); navigate("/profile"); }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors px-1.5 py-0.5 rounded-lg hover:bg-accent"
          >
            عرض الكل
          </button>
        </div>
      </div>

      {/* List */}
      <div className="overflow-y-auto flex-1">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
            <p className="text-sm">لا توجد إشعارات</p>
          </div>
        ) : notifications.map(n => {
          const isRead = getReadNotifs().has(n.id);
          const images = n.image_urls ? n.image_urls.split("|||").filter(Boolean) : [];
          return (
            <div
              key={n.id}
              onClick={() => onMarkOne(n.id)}
              className={`px-3 py-2.5 border-b border-border/50 last:border-0 transition-colors cursor-pointer hover:bg-accent/30 ${!isRead ? "bg-primary/3" : ""}`}
            >
              <div className="flex gap-2.5 items-start">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm ${!isRead ? "bg-primary/10" : "bg-muted"}`}>
                  {typeIcon[n.type] || "📢"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-1.5">
                    <p className={`text-xs leading-tight flex-1 ${!isRead ? "font-bold text-foreground" : "text-foreground"}`}>{n.title}</p>
                    {!isRead && <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1" />}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{n.message}</p>
                  {images.length > 0 && (
                    <div className="flex gap-1 mt-1.5">
                      {images.slice(0, 3).map((url: string, i: number) => (
                        <img key={i} src={url} alt="" className="w-10 h-10 rounded-lg object-cover border border-border" />
                      ))}
                      {images.length > 3 && <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-[10px] text-muted-foreground font-bold border border-border">+{images.length - 3}</div>}
                    </div>
                  )}
                  <p className="text-[10px] text-muted-foreground mt-1">{new Date(n.created_at).toLocaleDateString("ar-EG", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

// ─── Main Navbar ──────────────────────────────────────────────────────────────
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [readNotifs, setReadNotifs] = useState<Set<string>>(getReadNotifs);
  const location = useLocation();
  const { user } = useAuth();
  const bellRef = useRef<HTMLDivElement>(null);
  const mobileBellRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { name: "الرئيسية", path: "/" },
    { name: "من نحن", path: "/about" },
    { name: "الأنشطة", path: "/activities" },
    { name: "المكتبة", path: "/library" },
    { name: "المنتدى", path: "/forum" },
    { name: "ميثاق السلوك", path: "/code-of-conduct" },
    { name: "اعرف حقوقك", path: "/know-your-rights" },
    { name: "التوعية الرقمية", path: "/digital-awareness" },
    { name: "دليل الطالب", path: "/student-guide" },
    { name: "الشركاء", path: "/partners" },
    { name: "المتطوعين", path: "/volunteers" },
    { name: "الأسئلة الشائعة", path: "/faq" },
  ];
  const desktopLinks = navLinks.slice(0, 8);
  const mobileIcons = [
    { icon: BookOpen, path: "/digital-awareness", label: "التوعية" },
    { icon: Handshake, path: "/partners", label: "الشركاء" },
    { icon: GraduationCap, path: "/student-guide", label: "الدليل" },
    { icon: MessageSquare, path: "/forum", label: "المنتدى" },
  ];

  const isActive = (path: string) => location.pathname === path;
  const unreadCount = notifications.filter(n => !readNotifs.has(n.id)).length;

  // Fetch notifications + realtime
  useEffect(() => {
    const fetchNotifs = async () => {
      const { data } = await supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(20);
      setNotifications((data as any[]) || []);
    };
    fetchNotifs();
    const channel = supabase.channel("navbar-notifs-v2")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, (payload) => {
        setNotifications(prev => [payload.new as any, ...prev.slice(0, 19)]);
      }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!showNotifs) return;
    const handler = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node) &&
        mobileBellRef.current && !mobileBellRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showNotifs]);

  // Close dropdown on route change
  useEffect(() => { setShowNotifs(false); setIsOpen(false); }, [location.pathname]);

  const markOne = (id: string) => {
    const updated = new Set(readNotifs);
    updated.add(id);
    setReadNotifs(updated);
    saveReadNotifs(updated);
  };

  const markAll = () => {
    const updated = new Set(notifications.map(n => n.id));
    setReadNotifs(updated);
    saveReadNotifs(updated);
  };

  return (
    <nav className="fixed w-full z-50 bg-card/80 backdrop-blur-md border-b border-primary/10 shadow-sm">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logoImg} alt="شعار الوحدة" className="h-16 w-auto object-contain" />
            <div className="hidden md:flex flex-col text-right">
              <span className="text-sm font-bold text-primary">جامعة بني سويف التكنولوجية</span>
              <span className="text-xs text-muted-foreground">وحدة مناهضة العنف ضد المرأة</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-4">
            {desktopLinks.map((link) => (
              <Link key={link.path} to={link.path} className={`text-sm font-medium transition-colors hover:text-primary ${isActive(link.path) ? "text-primary font-bold" : "text-muted-foreground"}`}>
                {link.name}
              </Link>
            ))}

            {/* Bell - desktop */}
            <div className="relative" ref={bellRef}>
              <motion.button
                onClick={() => setShowNotifs(v => !v)}
                className="relative text-muted-foreground hover:text-primary p-2 rounded-xl hover:bg-accent transition-colors"
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  animate={unreadCount > 0 ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Bell className={`h-5 w-5 ${unreadCount > 0 ? "text-primary" : ""}`} />
                </motion.div>
                <AnimatePresence>
                  {unreadCount > 0 && (
                    <motion.span
                      key="badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-destructive text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5"
                    >
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
              <AnimatePresence>
                {showNotifs && (
                  <NotifBell
                    notifications={notifications}
                    unreadCount={unreadCount}
                    onMarkAll={markAll}
                    onMarkOne={markOne}
                    onClose={() => setShowNotifs(false)}
                  />
                )}
              </AnimatePresence>
            </div>

            <Link to="/report">
              <Button variant="default" size="sm" className="bg-gradient-brand shadow-lg hover:shadow-xl transition-all duration-300">
                <Shield className="ml-1 h-4 w-4" /> إبلاغ سري
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" size="sm">لوحة التحكم</Button>
            </Link>
            {user ? (
              <Link to="/profile">
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" size="sm">تسجيل الدخول</Button>
              </Link>
            )}
          </div>

          {/* Mobile header */}
          <div className="md:hidden flex items-center gap-1">
            {mobileIcons.map((item) => (
              <Link
                key={item.path} to={item.path} title={item.label}
                className={`p-2 rounded-lg transition-colors ${isActive(item.path) ? "text-primary bg-accent" : "text-muted-foreground hover:text-primary"}`}
              >
                <item.icon className="h-4 w-4" />
              </Link>
            ))}

            {/* Bell - mobile */}
            <div className="relative" ref={mobileBellRef}>
              <motion.button
                onClick={() => setShowNotifs(v => !v)}
                className="relative p-2 rounded-lg text-muted-foreground hover:text-primary transition-colors"
                whileTap={{ scale: 0.9 }}
              >
                <Bell className={`h-4 w-4 ${unreadCount > 0 ? "text-primary" : ""}`} />
                <AnimatePresence>
                  {unreadCount > 0 && (
                    <motion.span
                      key="mbadge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute top-0.5 right-0.5 min-w-[12px] h-3 bg-destructive text-white text-[8px] font-bold rounded-full flex items-center justify-center"
                    >
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
              <AnimatePresence>
                {showNotifs && (
                  <NotifBell
                    notifications={notifications}
                    unreadCount={unreadCount}
                    onMarkAll={markAll}
                    onMarkOne={markOne}
                    onClose={() => setShowNotifs(false)}
                    isMobile
                  />
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-muted-foreground hover:text-primary transition-colors"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border overflow-hidden"
            >
              <div className="py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path} to={link.path}
                    className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive(link.path) ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="flex gap-2 flex-wrap pt-2 px-4">
                  <Link to="/report" className="flex-1">
                    <Button className="w-full bg-gradient-brand" size="sm"><Shield className="ml-1 h-4 w-4" /> إبلاغ سري</Button>
                  </Link>
                  <Link to="/dashboard" className="flex-1">
                    <Button variant="outline" className="w-full" size="sm">لوحة التحكم</Button>
                  </Link>
                  {user ? (
                    <Link to="/profile" className="flex-1">
                      <Button variant="ghost" className="w-full" size="sm"><User className="ml-1 h-4 w-4" /> حسابي</Button>
                    </Link>
                  ) : (
                    <Link to="/auth" className="flex-1">
                      <Button variant="ghost" className="w-full" size="sm">تسجيل الدخول</Button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
