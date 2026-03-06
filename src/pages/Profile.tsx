import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { User, Phone, GraduationCap, Save, LogOut, Camera, MessageSquare, Send, Bell, Edit3, X, Check, ExternalLink } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const collegeLabels: Record<string, string> = {
  egyptian_korean: "الكلية المصرية الكورية",
  technology: "الكلية التكنولوجية",
  industry: "كلية الصناعة والطاقة",
  other: "أخرى",
};

const ekcDepartments = [
  { value: "ict", label: "تكنولوجيا المعلومات والاتصالات (ICT)" },
  { value: "mechatronics", label: "الميكاترونيكس" },
  { value: "autotronics", label: "الأوتوترونيكس" },
  { value: "renewable_energy", label: "الطاقة المتجددة" },
  { value: "industrial_control", label: "التحكم في العمليات الصناعية" },
  { value: "railway", label: "السكة الحديد" },
  { value: "marketing", label: "التسويق" },
];

const Profile = () => {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const avatarRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<any[]>([]);
  const [chatMsg, setChatMsg] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [readNotifs, setReadNotifs] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem("read-notifs") || "[]")); } catch { return new Set(); }
  });

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setPhone(profile.phone || "");
      setCollege(profile.college || "");
      setDepartment((profile as any).department || "");
      setAvatarUrl((profile as any).avatar_url || "");
    }
  }, [profile]);

  useEffect(() => {
    if (!user) navigate("/auth");
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchChat = async () => {
      const { data } = await supabase.from("chat_messages").select("*").eq("sender_id", user.id).order("created_at", { ascending: true });
      setMessages((data as any[]) || []);
    };
    fetchChat();
    const channel = supabase.channel("user-chat").on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" }, (payload) => {
      const msg = payload.new as any;
      if (msg.sender_id === user.id || (msg.is_admin && msg.receiver_id === user.id)) {
        setMessages(prev => [...prev, msg]);
      }
    }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data } = await supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(30);
      setNotifications((data as any[]) || []);
    };
    fetchNotifications();
  }, []);

  const markAsRead = (id: string) => {
    const updated = new Set(readNotifs);
    updated.add(id);
    setReadNotifs(updated);
    localStorage.setItem("read-notifs", JSON.stringify([...updated]));
  };

  const markAllRead = () => {
    const allIds = new Set(notifications.map(n => n.id));
    setReadNotifs(allIds);
    localStorage.setItem("read-notifs", JSON.stringify([...allIds]));
    toast.success("تم تحديد جميع الإشعارات كمقروءة");
  };

  const unreadCount = notifications.filter(n => !readNotifs.has(n.id)).length;

  const handleAvatarUpload = async (file: File) => {
    if (!user) return;
    setUploading(true);
    const fileName = `${user.id}-${Date.now()}.${file.name.split('.').pop()}`;
    const { data, error } = await supabase.storage.from("avatars").upload(fileName, file, { upsert: true });
    if (error) { toast.error("خطأ في رفع الصورة"); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(data.path);
    setAvatarUrl(urlData.publicUrl);
    await supabase.from("profiles").update({ avatar_url: urlData.publicUrl } as any).eq("user_id", user.id);
    await refreshProfile();
    toast.success("تم تحديث الصورة");
    setUploading(false);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, phone, college, department, updated_at: new Date().toISOString() } as any)
      .eq("user_id", user.id);
    if (error) { toast.error("خطأ في حفظ البيانات"); }
    else { toast.success("تم حفظ البيانات بنجاح"); await refreshProfile(); setEditing(false); }
    setSaving(false);
  };

  const sendMessage = async () => {
    if (!user || !chatMsg.trim()) return;
    setSendingMsg(true);
    await supabase.from("chat_messages").insert({ sender_id: user.id, message: chatMsg.trim(), is_admin: false } as any);
    setChatMsg("");
    setSendingMsg(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
    toast.success("تم تسجيل الخروج");
  };

  if (!user) return null;

  const deptLabel = ekcDepartments.find(d => d.value === department)?.label || department;

  const notifTypeIcons: Record<string, string> = {
    general: "📢", activity: "🎯", warning: "⚠️", success: "✅", info: "ℹ️",
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Profile Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm mb-6">
        <div className="h-28 md:h-36 bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] opacity-30" />
        </div>
        <div className="px-6 pb-6 -mt-12 relative">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="relative shrink-0">
              {avatarUrl ? (
                <img src={avatarUrl} alt="الصورة الشخصية" className="w-24 h-24 rounded-2xl object-cover border-4 border-card shadow-lg" />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-brand flex items-center justify-center border-4 border-card shadow-lg">
                  <User className="h-12 w-12 text-white" />
                </div>
              )}
              <button onClick={() => avatarRef.current?.click()} className="absolute -bottom-1 -left-1 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform" disabled={uploading}>
                <Camera className="h-4 w-4" />
              </button>
              <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])} />
            </div>
            <div className="flex-1 pt-2">
              <h1 className="text-2xl font-bold text-foreground">{fullName || "مستخدم جديد"}</h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              {college && <p className="text-xs text-primary mt-1 font-medium">{collegeLabels[college] || college}{department && ` • ${deptLabel}`}</p>}
              {phone && <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1"><Phone className="h-3 w-3" /> {phone}</p>}
            </div>
            <div className="flex gap-2 shrink-0">
              {!editing && (
                <Button size="sm" variant="outline" onClick={() => setEditing(true)} className="gap-1">
                  <Edit3 className="h-3.5 w-3.5" /> تعديل
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={handleLogout} className="text-destructive border-destructive/30 hover:bg-destructive/10 gap-1">
                <LogOut className="h-3.5 w-3.5" /> خروج
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Edit Form */}
      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-6 overflow-hidden">
            <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-foreground">تعديل البيانات</h3>
                <button onClick={() => setEditing(false)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1 text-xs"><User size={12} /> الاسم الكامل</Label>
                  <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="الاسم الكامل" />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1 text-xs"><Phone size={12} /> رقم الهاتف</Label>
                  <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="01xxxxxxxxx" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1 text-xs"><GraduationCap size={12} /> الكلية</Label>
                  <Select value={college} onValueChange={v => { setCollege(v); setDepartment(""); }}>
                    <SelectTrigger><SelectValue placeholder="اختر الكلية" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="egyptian_korean">الكلية المصرية الكورية</SelectItem>
                      <SelectItem value="technology">الكلية التكنولوجية</SelectItem>
                      <SelectItem value="industry">كلية الصناعة والطاقة</SelectItem>
                      <SelectItem value="other">أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {college === "egyptian_korean" && (
                  <div className="space-y-2">
                    <Label className="text-xs">القسم</Label>
                    <Select value={department} onValueChange={setDepartment}>
                      <SelectTrigger><SelectValue placeholder="اختر القسم" /></SelectTrigger>
                      <SelectContent>
                        {ekcDepartments.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <Button onClick={handleSave} className="w-full bg-gradient-brand font-bold" disabled={saving}>
                <Save className="ml-2 h-4 w-4" /> {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notifications" className="relative">
            <Bell className="h-4 w-4 ml-1" /> الإشعارات
            {unreadCount > 0 && (
              <span className="absolute -top-1 -left-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-[10px] flex items-center justify-center font-bold">{unreadCount}</span>
            )}
          </TabsTrigger>
          <TabsTrigger value="chat"><MessageSquare className="h-4 w-4 ml-1" /> المراسلات</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications">
          <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
            {/* Notification Header */}
            <div className="p-4 border-b border-border flex items-center justify-between bg-accent/30">
              <div>
                <h3 className="font-bold text-foreground text-sm">الإشعارات</h3>
                <p className="text-xs text-muted-foreground">{unreadCount > 0 ? `${unreadCount} إشعار جديد` : "لا توجد إشعارات جديدة"}</p>
              </div>
              {unreadCount > 0 && (
                <Button size="sm" variant="ghost" onClick={markAllRead} className="text-xs gap-1">
                  <Check className="h-3 w-3" /> تحديد الكل كمقروء
                </Button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Bell className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">لا توجد إشعارات حالياً</p>
              </div>
            ) : (
              <div className="divide-y divide-border max-h-[500px] overflow-y-auto">
                {notifications.map((n, i) => {
                  const isRead = readNotifs.has(n.id);
                  return (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => markAsRead(n.id)}
                      className={`flex gap-3 p-4 cursor-pointer transition-colors hover:bg-accent/30 ${!isRead ? "bg-primary/5" : ""}`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg ${!isRead ? "bg-primary/10" : "bg-muted"}`}>
                        {notifTypeIcons[n.type] || "📢"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm ${!isRead ? "font-bold text-foreground" : "text-foreground"}`}>{n.title}</p>
                          {!isRead && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{n.message}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{new Date(n.created_at).toLocaleDateString("ar-EG", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                        {n.link && (
                          <Link to={n.link} className="inline-flex items-center gap-1 text-[10px] text-primary mt-1 hover:underline">
                            <ExternalLink className="h-2.5 w-2.5" /> عرض
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="chat">
          <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className="p-4 border-b border-border bg-accent/30">
              <h3 className="font-bold text-foreground">محادثة مع إدارة الوحدة</h3>
              <p className="text-xs text-muted-foreground">أرسل رسالتك وسيتم الرد عليك في أقرب وقت</p>
            </div>
            <div className="h-[350px] overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && <p className="text-center text-muted-foreground text-sm py-10">لا توجد رسائل بعد. أرسل رسالتك الأولى!</p>}
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.is_admin ? "justify-start" : "justify-end"}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.is_admin ? "bg-muted text-foreground rounded-tl-none" : "bg-primary text-primary-foreground rounded-tr-none"}`}>
                    {msg.message}
                    <p className={`text-[10px] mt-1 ${msg.is_admin ? "text-muted-foreground" : "text-primary-foreground/70"}`}>
                      {new Date(msg.created_at).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-border flex gap-2">
              <Input value={chatMsg} onChange={e => setChatMsg(e.target.value)} placeholder="اكتب رسالتك..." className="flex-1" onKeyDown={e => e.key === "Enter" && sendMessage()} />
              <Button onClick={sendMessage} size="icon" className="bg-gradient-brand shrink-0" disabled={sendingMsg}><Send className="h-4 w-4" /></Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
