import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Users, FileText, AlertCircle, CheckCircle, Plus, Trash2, Heart, Upload,
  Image, Video, BookOpen, Send, Bell, User, ShieldCheck, Lock, MessageSquare,
  LayoutDashboard, ChevronRight, ImageIcon,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole, roleLabels, rolePermissions, type AppRole } from "@/hooks/useUserRole";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// ─── Constants ───────────────────────────────────────────────────────────────
const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  investigating: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  resolved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  closed: "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300",
};
const statusLabels: Record<string, string> = {
  pending: "قيد الانتظار", investigating: "قيد التحقيق", resolved: "تم الحل", closed: "مغلق",
};
const collegeLabels: Record<string, string> = {
  egyptian_korean: "الكلية المصرية الكورية", technology: "الكلية التكنولوجية",
  industry: "كلية الصناعة والطاقة", other: "أخرى",
};
const deptLabels: Record<string, string> = {
  ict: "تكنولوجيا المعلومات", mechatronics: "الميكاترونيكس", autotronics: "الأوتوترونيكس",
  renewable_energy: "الطاقة المتجددة", industrial_control: "التحكم الصناعي",
  railway: "السكة الحديد", marketing: "التسويق",
};

const callDashboardApi = async (action: string, body?: any) => {
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/dashboard-api?action=${action}`;
  const options: RequestInit = {
    method: body ? "POST" : "GET",
    headers: { "Content-Type": "application/json", "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
  };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(url, options);
  if (!res.ok) { const err = await res.json(); throw new Error(err.error || "خطأ في الخادم"); }
  return res.json();
};

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, color }: { label: string; value: number; icon: any; color: string }) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardContent className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground mb-1">{label}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </CardContent>
  </Card>
);

// ─── Main Component ──────────────────────────────────────────────────────────
const Dashboard = () => {
  const { user } = useAuth();
  const { role, loading: roleLoading, hasPermission, canAccessDashboard } = useUserRole();
  const navigate = useNavigate();

  const [reports, setReports] = useState<any[]>([]);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [libraryItems, setLibraryItems] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [surveys, setSurveys] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [userRoles, setUserRoles] = useState<any[]>([]);
  const [forumPosts, setForumPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("");

  // Activity form
  const [actForm, setActForm] = useState({ title: "", description: "", type: "seminar", location: "", date: "", organizer: "", target_audience: "", notes: "", max_attendees: "", contact_info: "", status: "upcoming" });
  const [actDialog, setActDialog] = useState(false);
  const [actImage, setActImage] = useState<File | null>(null);
  const [actUploading, setActUploading] = useState(false);
  const actImageRef = useRef<HTMLInputElement>(null);

  // Library
  const [articleDialog, setArticleDialog] = useState(false);
  const [videoDialog, setVideoDialog] = useState(false);
  const [pdfDialog, setPdfDialog] = useState(false);
  const [infographicDialog, setInfographicDialog] = useState(false);
  const [libForm, setLibForm] = useState({ title: "", description: "", type: "article", category: "", url: "", duration: "", read_time: "", thumbnail_url: "", content: "" });
  const [libVideo, setLibVideo] = useState<File | null>(null);
  const [libPdf, setLibPdf] = useState<File | null>(null);
  const [libInfographic, setLibInfographic] = useState<File | null>(null);
  const [libUploading, setLibUploading] = useState(false);
  const libVideoRef = useRef<HTMLInputElement>(null);
  const libPdfRef = useRef<HTMLInputElement>(null);
  const libInfographicRef = useRef<HTMLInputElement>(null);

  // Chat
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [adminReply, setAdminReply] = useState("");

  // Notifications
  const [notifDialog, setNotifDialog] = useState(false);
  const [notifForm, setNotifForm] = useState({ title: "", message: "", type: "general", link: "" });
  const [notifImages, setNotifImages] = useState<File[]>([]);
  const [notifUploading, setNotifUploading] = useState(false);
  const notifImageRef = useRef<HTMLInputElement>(null);

  // Role management
  const [roleDialog, setRoleDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("user");

  // Forum
  const [forumPostDialog, setForumPostDialog] = useState(false);
  const [forumForm, setForumForm] = useState({ title: "", content: "", category: "general" });

  const fetchAll = async () => {
    try {
      const [dashData, rolesData, forumData] = await Promise.all([
        callDashboardApi("fetch"),
        supabase.from("user_roles").select("*"),
        supabase.from("forum_posts").select("*").order("created_at", { ascending: false }),
      ]);
      setReports(dashData.reports || []);
      setVolunteers(dashData.volunteers || []);
      setActivities(dashData.activities || []);
      setLibraryItems(dashData.library || []);
      setDonations(dashData.donations || []);
      setSurveys(dashData.surveys || []);
      setProfiles(dashData.profiles || []);
      setChatMessages(dashData.chatMessages || []);
      setUserRoles((rolesData.data as any[]) || []);
      setForumPosts((forumData.data as any[]) || []);
    } catch (e: any) { toast.error("خطأ في تحميل البيانات: " + e.message); }
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  // Access guards
  if (roleLoading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-muted-foreground text-sm">جاري التحقق من الصلاحيات...</p>
      </motion.div>
    </div>
  );

  if (!user) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-sm space-y-5 p-8">
        <div className="w-20 h-20 bg-accent rounded-3xl flex items-center justify-center mx-auto"><Lock className="h-10 w-10 text-primary" /></div>
        <h2 className="text-2xl font-bold">تسجيل الدخول مطلوب</h2>
        <p className="text-muted-foreground text-sm">يجب تسجيل الدخول للوصول إلى لوحة التحكم</p>
        <Button onClick={() => navigate("/auth")} className="bg-gradient-brand w-full">تسجيل الدخول</Button>
      </motion.div>
    </div>
  );

  if (!canAccessDashboard) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-sm space-y-5 p-8">
        <div className="w-20 h-20 bg-destructive/10 rounded-3xl flex items-center justify-center mx-auto"><ShieldCheck className="h-10 w-10 text-destructive" /></div>
        <h2 className="text-2xl font-bold">ليس لديك صلاحية</h2>
        <p className="text-muted-foreground text-sm">عذراً، تواصل مع المدير لمنحك الصلاحية المناسبة.</p>
        <Button onClick={() => navigate("/")} variant="outline" className="w-full">العودة للرئيسية</Button>
      </motion.div>
    </div>
  );

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const updateReportStatus = async (id: string, status: string) => {
    try { await callDashboardApi("update-report-status", { id, status }); toast.success("تم التحديث"); fetchAll(); } catch { toast.error("خطأ في التحديث"); }
  };

  const addActivity = async () => {
    if (!actForm.title || !actForm.description) { toast.error("يرجى ملء العنوان والوصف"); return; }
    setActUploading(true);
    try {
      let image_url = null;
      if (actImage) {
        const fn = `${Date.now()}-${actImage.name}`;
        const { data, error } = await supabase.storage.from("activity-images").upload(fn, actImage);
        if (error) throw error;
        const { data: u } = supabase.storage.from("activity-images").getPublicUrl(data.path);
        image_url = u.publicUrl;
      }
      await callDashboardApi("add-activity", {
        title: actForm.title, description: actForm.description,
        date: actForm.date ? new Date(actForm.date).toISOString() : null,
        image_url, location: actForm.location || null, type: actForm.type || null,
        organizer: actForm.organizer || null, target_audience: actForm.target_audience || null,
        notes: actForm.notes || null,
        max_attendees: actForm.max_attendees ? parseInt(actForm.max_attendees) : null,
        contact_info: actForm.contact_info || null, status: actForm.status || "upcoming",
      });
      toast.success("تمت إضافة النشاط");
      setActDialog(false);
      setActForm({ title: "", description: "", type: "seminar", location: "", date: "", organizer: "", target_audience: "", notes: "", max_attendees: "", contact_info: "", status: "upcoming" });
      setActImage(null); fetchAll();
    } catch (e: any) { toast.error("خطأ: " + e.message); }
    setActUploading(false);
  };

  const deleteActivity = async (id: string) => {
    try { await callDashboardApi("delete-activity", { id }); toast.success("تم الحذف"); fetchAll(); } catch { toast.error("خطأ"); }
  };

  const addLibraryItem = async (type: string) => {
    if (!libForm.title) { toast.error("يرجى إدخال العنوان"); return; }
    setLibUploading(true);
    try {
      let url = libForm.url || null;
      if (type === "video" && libVideo) {
        const fn = `${Date.now()}-${libVideo.name}`;
        const { data, error } = await supabase.storage.from("library-videos").upload(fn, libVideo);
        if (error) throw error;
        const { data: u } = supabase.storage.from("library-videos").getPublicUrl(data.path);
        url = u.publicUrl;
      }
      if ((type === "pdf" || type === "infographic") && (libPdf || libInfographic)) {
        const file = libPdf || libInfographic!;
        const fn = `${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage.from("library-files").upload(fn, file);
        if (error) throw error;
        const { data: u } = supabase.storage.from("library-files").getPublicUrl(data.path);
        url = u.publicUrl;
      }
      await callDashboardApi("add-library", {
        title: libForm.title, description: libForm.description || null, type,
        category: libForm.category || null, url, duration: libForm.duration || null,
        read_time: libForm.read_time || null, thumbnail_url: libForm.thumbnail_url || null,
        content: libForm.content || null,
      });
      toast.success("تمت الإضافة");
      setArticleDialog(false); setVideoDialog(false); setPdfDialog(false); setInfographicDialog(false);
      setLibForm({ title: "", description: "", type: "article", category: "", url: "", duration: "", read_time: "", thumbnail_url: "", content: "" });
      setLibVideo(null); setLibPdf(null); setLibInfographic(null); fetchAll();
    } catch (e: any) { toast.error("خطأ: " + e.message); }
    setLibUploading(false);
  };

  const deleteLibraryItem = async (id: string) => {
    try { await callDashboardApi("delete-library", { id }); toast.success("تم الحذف"); fetchAll(); } catch { toast.error("خطأ"); }
  };

  const approveVolunteer = async (id: string) => {
    try { await callDashboardApi("update-volunteer", { id, status: "approved", is_approved: true }); toast.success("تم قبول المتطوع"); fetchAll(); } catch { toast.error("خطأ"); }
  };

  const sendAdminReply = async () => {
    if (!selectedChat || !adminReply.trim()) return;
    try {
      await callDashboardApi("send-admin-reply", { sender_id: selectedChat, message: adminReply.trim() });
      setAdminReply(""); fetchAll(); toast.success("تم إرسال الرد");
    } catch { toast.error("خطأ في الإرسال"); }
  };

  const addNotification = async () => {
    if (!notifForm.title || !notifForm.message) { toast.error("يرجى ملء العنوان والرسالة"); return; }
    setNotifUploading(true);
    try {
      const imageUrls: string[] = [];
      for (const img of notifImages.slice(0, 3)) {
        const fn = `notif/${Date.now()}-${Math.random().toString(36).slice(2)}-${img.name}`;
        const { data, error } = await supabase.storage.from("activity-images").upload(fn, img);
        if (!error && data) {
          const { data: u } = supabase.storage.from("activity-images").getPublicUrl(data.path);
          imageUrls.push(u.publicUrl);
        }
      }
      await callDashboardApi("add-notification", {
        ...notifForm,
        image_urls: imageUrls.length > 0 ? imageUrls.join("|||") : null,
      });
      toast.success("تم إرسال الإشعار");
      setNotifDialog(false);
      setNotifForm({ title: "", message: "", type: "general", link: "" });
      setNotifImages([]);
    } catch { toast.error("خطأ"); }
    setNotifUploading(false);
  };

  const assignRole = async () => {
    if (!selectedUserId || !selectedRole) { toast.error("يرجى اختيار المستخدم والصلاحية"); return; }
    try {
      await supabase.from("user_roles").delete().eq("user_id", selectedUserId);
      if (selectedRole !== "remove") {
        await supabase.from("user_roles").insert({ user_id: selectedUserId, role: selectedRole } as any);
      }
      toast.success("تم تحديث الصلاحية");
      setRoleDialog(false); setSelectedUserId(""); setSelectedRole("user"); fetchAll();
    } catch (e: any) { toast.error("خطأ: " + e.message); }
  };

  const deleteForumPost = async (id: string) => {
    try {
      await supabase.from("forum_comments").delete().eq("post_id", id);
      await supabase.from("forum_likes").delete().eq("post_id", id);
      await supabase.from("forum_posts").delete().eq("id", id);
      toast.success("تم حذف المنشور"); fetchAll();
    } catch { toast.error("خطأ في الحذف"); }
  };

  const addForumPostAsUnit = async () => {
    if (!forumForm.title || !forumForm.content || !user) { toast.error("يرجى ملء العنوان والمحتوى"); return; }
    try {
      await supabase.from("forum_posts").insert({
        user_id: user.id, title: `🏛️ ${forumForm.title}`,
        content: forumForm.content, category: forumForm.category,
      } as any);
      toast.success("تم نشر المنشور باسم الوحدة");
      setForumPostDialog(false); setForumForm({ title: "", content: "", category: "general" }); fetchAll();
    } catch { toast.error("خطأ في النشر"); }
  };

  // ─── Tab config ────────────────────────────────────────────────────────────
  const allTabs = [
    { id: "reports",    label: "البلاغات",      icon: AlertCircle,    perm: "manage_reports",    count: reports.length },
    { id: "volunteers", label: "المتطوعين",     icon: Users,          perm: "manage_volunteers", count: volunteers.length },
    { id: "activities", label: "الأنشطة",       icon: FileText,       perm: "manage_activities", count: activities.length },
    { id: "library",    label: "المكتبة",       icon: BookOpen,       perm: "manage_library",    count: libraryItems.length },
    { id: "users",      label: "المستخدمين",    icon: User,           perm: "manage_reports",    count: profiles.length },
    { id: "roles",      label: "الصلاحيات",     icon: ShieldCheck,    perm: "manage_roles",      count: userRoles.length },
    { id: "chat",       label: "المراسلات",     icon: MessageSquare,  perm: "manage_chat",       count: chatMessages.filter((m: any) => !m.is_admin).length },
    { id: "donations",  label: "التبرعات",      icon: Heart,          perm: "manage_donations",  count: donations.length },
    { id: "surveys",    label: "الاستبيانات",   icon: CheckCircle,    perm: "manage_surveys",    count: surveys.length },
    { id: "forum",      label: "المنتدى",       icon: MessageSquare,  perm: "manage_reports",    count: forumPosts.length },
  ].filter(t => hasPermission(t.perm) || (t.id === "users" && hasPermission("manage_reports")) || (t.id !== "roles" && role === "viewer"));

  const safetyIndex = surveys.length > 0 ? Math.round((surveys.filter((s: any) => s.feels_safe).length / surveys.length) * 100) : 0;
  const chatSenders = [...new Set(chatMessages.filter((m: any) => !m.is_admin).map((m: any) => m.sender_id))];
  const getProfileByUserId = (uid: string) => profiles.find((p: any) => p.user_id === uid);
  const getChatForUser = (uid: string) => chatMessages.filter((m: any) => m.sender_id === uid || (m.is_admin && m.receiver_id === uid));
  const getUserRole = (uid: string) => userRoles.find((r: any) => r.user_id === uid);

  const currentTab = activeTab || allTabs[0]?.id || "";

  const stats = [
    { label: "البلاغات",    value: reports.length,    icon: AlertCircle, color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" },
    { label: "المتطوعين",   value: volunteers.length,  icon: Users,       color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
    { label: "الأنشطة",    value: activities.length,  icon: FileText,    color: "bg-primary/10 text-primary" },
    { label: "المستخدمين", value: profiles.length,    icon: User,        color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" },
    { label: "التبرعات",   value: donations.length,   icon: Heart,       color: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400" },
    { label: "منشورات المنتدى", value: forumPosts.length, icon: MessageSquare, color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
  ];

  // ─── Tab content renderer ───────────────────────────────────────────────────
  const renderTabContent = () => {
    switch (currentTab) {

      // REPORTS
      case "reports": return (
        <div className="space-y-3">
          {reports.length === 0 ? <EmptyState label="لا توجد بلاغات حالياً" /> : reports.map((r: any) => (
            <div key={r.id} className="bg-card border border-border rounded-2xl p-5 space-y-3">
              <div className="flex flex-wrap justify-between items-start gap-3">
                <div>
                  <p className="font-bold text-foreground">{r.is_anonymous ? "بلاغ مجهول" : r.reporter_name || "بدون اسم"}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {collegeLabels[r.college] || r.college} &bull; {new Date(r.created_at).toLocaleDateString("ar-EG")}
                  </p>
                </div>
                <Badge className={statusColors[r.status] || ""}>{statusLabels[r.status] || r.status}</Badge>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{r.description}</p>
              {r.contact_info && <p className="text-xs text-muted-foreground">وسيلة تواصل: {r.contact_info}</p>}
              {hasPermission("manage_reports") && (
                <div className="flex gap-2 flex-wrap pt-1">
                  {["pending", "investigating", "resolved", "closed"].map(s => (
                    <Button key={s} size="sm" variant={r.status === s ? "default" : "outline"} onClick={() => updateReportStatus(r.id, s)} className="text-xs h-7">{statusLabels[s]}</Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      );

      // VOLUNTEERS
      case "volunteers": return (
        <div className="space-y-3">
          {volunteers.length === 0 ? <EmptyState label="لا توجد طلبات تطوع حالياً" /> : volunteers.map((v: any) => (
            <div key={v.id} className="bg-card border border-border rounded-2xl p-5">
              <div className="flex gap-4 items-start">
                {v.photo_url ? (
                  <img src={v.photo_url} alt={v.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-primary/20 shrink-0" />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center shrink-0 border-2 border-primary/20">
                    <span className="text-xl font-bold text-primary">{v.name?.charAt(0)}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-foreground text-base">{v.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{collegeLabels[v.college] || v.college}{v.department && ` • ${deptLabels[v.department] || v.department}`}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge className={v.status === "approved" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"}>
                        {v.status === "approved" ? "مقبول" : "قيد المراجعة"}
                      </Badge>
                      {v.status !== "approved" && hasPermission("manage_volunteers") && (
                        <Button size="sm" onClick={() => approveVolunteer(v.id)} className="bg-green-600 hover:bg-green-700 text-white text-xs h-7">قبول</Button>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-2">
                    {v.phone && <span>{v.phone}</span>}
                    {v.email && <span>{v.email}</span>}
                    {v.gender && <span>{v.gender === "male" ? "ذكر" : "أنثى"}</span>}
                    {v.role_title && <span className="text-primary font-medium">{v.role_title}</span>}
                    {v.volunteer_section && <span>{v.volunteer_section}</span>}
                  </div>
                  {v.skills && <p className="text-xs text-foreground mt-1.5">المهارات: {v.skills}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      );

      // ACTIVITIES
      case "activities": return (
        <div className="space-y-3">
          <div className="flex justify-end">
            {hasPermission("manage_activities") && (
              <Dialog open={actDialog} onOpenChange={setActDialog}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-gradient-brand gap-1"><Plus className="h-4 w-4" /> إضافة نشاط</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader><DialogTitle>إضافة نشاط جديد</DialogTitle><DialogDescription>أضف نشاطاً أو فعالية جديدة</DialogDescription></DialogHeader>
                  <div className="space-y-4 mt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>العنوان *</Label><Input value={actForm.title} onChange={e => setActForm({ ...actForm, title: e.target.value })} placeholder="اسم النشاط" /></div>
                      <div className="space-y-2"><Label>نوع النشاط</Label>
                        <Select value={actForm.type} onValueChange={v => setActForm({ ...actForm, type: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="seminar">ندوة</SelectItem><SelectItem value="workshop">ورشة عمل</SelectItem>
                            <SelectItem value="campaign">حملة توعوية</SelectItem><SelectItem value="training">تدريب</SelectItem>
                            <SelectItem value="conference">مؤتمر</SelectItem><SelectItem value="other">أخرى</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2"><Label>الوصف *</Label><Textarea value={actForm.description} onChange={e => setActForm({ ...actForm, description: e.target.value })} className="min-h-[100px]" /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>المكان</Label><Input value={actForm.location} onChange={e => setActForm({ ...actForm, location: e.target.value })} /></div>
                      <div className="space-y-2"><Label>التاريخ</Label><Input type="datetime-local" value={actForm.date} onChange={e => setActForm({ ...actForm, date: e.target.value })} /></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>المنظم</Label><Input value={actForm.organizer} onChange={e => setActForm({ ...actForm, organizer: e.target.value })} /></div>
                      <div className="space-y-2"><Label>الفئة المستهدفة</Label><Input value={actForm.target_audience} onChange={e => setActForm({ ...actForm, target_audience: e.target.value })} /></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>الحد الأقصى للحضور</Label><Input type="number" value={actForm.max_attendees} onChange={e => setActForm({ ...actForm, max_attendees: e.target.value })} /></div>
                      <div className="space-y-2"><Label>وسيلة التواصل</Label><Input value={actForm.contact_info} onChange={e => setActForm({ ...actForm, contact_info: e.target.value })} /></div>
                    </div>
                    <div className="space-y-2"><Label>الحالة</Label>
                      <Select value={actForm.status} onValueChange={v => setActForm({ ...actForm, status: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="upcoming">قادم</SelectItem><SelectItem value="ongoing">جاري</SelectItem>
                          <SelectItem value="completed">منتهي</SelectItem><SelectItem value="cancelled">ملغي</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2"><Label>ملاحظات</Label><Textarea value={actForm.notes} onChange={e => setActForm({ ...actForm, notes: e.target.value })} /></div>
                    <div className="space-y-2">
                      <Label>صورة النشاط</Label>
                      <div className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors" onClick={() => actImageRef.current?.click()}>
                        {actImage ? (<div className="space-y-2"><img src={URL.createObjectURL(actImage)} alt="preview" className="w-32 h-32 object-cover rounded-lg mx-auto" /><p className="text-sm text-muted-foreground">{actImage.name}</p></div>)
                          : (<><Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" /><p className="text-sm text-muted-foreground">اضغط لرفع صورة</p></>)}
                      </div>
                      <input ref={actImageRef} type="file" accept="image/*" className="hidden" onChange={e => setActImage(e.target.files?.[0] || null)} />
                    </div>
                    <Button onClick={addActivity} className="w-full bg-gradient-brand" disabled={actUploading}>{actUploading ? "جاري الرفع..." : "إضافة النشاط"}</Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
          {activities.length === 0 ? <EmptyState label="لا توجد أنشطة" /> : activities.map((a: any) => (
            <div key={a.id} className="bg-card border border-border rounded-2xl p-4 flex gap-4 items-start">
              {a.image_url && <img src={a.image_url} alt={a.title} className="w-16 h-16 rounded-xl object-cover shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-foreground">{a.title}</p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  {a.type && <Badge variant="secondary" className="text-xs">{a.type}</Badge>}
                  {a.location && <span className="text-xs text-muted-foreground">{a.location}</span>}
                  {a.date && <span className="text-xs text-muted-foreground">{new Date(a.date).toLocaleDateString("ar-EG")}</span>}
                </div>
              </div>
              {hasPermission("manage_activities") && (
                <Button size="icon" variant="ghost" className="text-destructive shrink-0" onClick={() => deleteActivity(a.id)}><Trash2 className="h-4 w-4" /></Button>
              )}
            </div>
          ))}
        </div>
      );

      // LIBRARY
      case "library": return (
        <div className="space-y-3">
          {hasPermission("manage_library") && (
            <div className="flex flex-wrap gap-2 justify-end">
              {[
                { label: "مقال", icon: BookOpen, open: articleDialog, setOpen: setArticleDialog, type: "article" },
                { label: "فيديو", icon: Video, open: videoDialog, setOpen: setVideoDialog, type: "video" },
                { label: "PDF", icon: FileText, open: pdfDialog, setOpen: setPdfDialog, type: "pdf" },
                { label: "إنفوجرافيك", icon: Image, open: infographicDialog, setOpen: setInfographicDialog, type: "infographic" },
              ].map(item => (
                <Dialog key={item.type} open={item.open} onOpenChange={item.setOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="gap-1"><item.icon className="h-3.5 w-3.5" /> {item.label}</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>إضافة {item.label}</DialogTitle></DialogHeader>
                    <div className="space-y-4 mt-2">
                      <div className="space-y-2"><Label>العنوان *</Label><Input value={libForm.title} onChange={e => setLibForm({ ...libForm, title: e.target.value })} /></div>
                      <div className="space-y-2"><Label>الوصف</Label><Textarea value={libForm.description} onChange={e => setLibForm({ ...libForm, description: e.target.value })} className="min-h-[60px]" /></div>
                      {item.type === "article" && <><div className="space-y-2"><Label>محتوى المقال الكامل</Label><Textarea value={libForm.content} onChange={e => setLibForm({ ...libForm, content: e.target.value })} className="min-h-[180px]" /></div></>}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>التصنيف</Label><Input value={libForm.category} onChange={e => setLibForm({ ...libForm, category: e.target.value })} placeholder="حقوق، أمان..." /></div>
                        {item.type === "article" && <div className="space-y-2"><Label>وقت القراءة</Label><Input value={libForm.read_time} onChange={e => setLibForm({ ...libForm, read_time: e.target.value })} placeholder="5 دقائق" /></div>}
                        {item.type === "video" && <div className="space-y-2"><Label>المدة</Label><Input value={libForm.duration} onChange={e => setLibForm({ ...libForm, duration: e.target.value })} placeholder="10:30" /></div>}
                      </div>
                      {item.type === "video" && (
                        <div className="space-y-2"><Label>رفع الفيديو</Label>
                          <div className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors" onClick={() => libVideoRef.current?.click()}>
                            {libVideo ? <p className="text-sm text-primary font-medium">{libVideo.name}</p> : <><Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" /><p className="text-sm">اضغط لرفع الفيديو</p></>}
                          </div>
                          <input ref={libVideoRef} type="file" accept="video/*" className="hidden" onChange={e => setLibVideo(e.target.files?.[0] || null)} />
                        </div>
                      )}
                      {item.type === "pdf" && (
                        <div className="space-y-2"><Label>رفع ملف PDF</Label>
                          <div className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors" onClick={() => libPdfRef.current?.click()}>
                            {libPdf ? <p className="text-sm text-primary font-medium">{libPdf.name}</p> : <><Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" /><p className="text-sm">اضغط لرفع PDF</p></>}
                          </div>
                          <input ref={libPdfRef} type="file" accept=".pdf" className="hidden" onChange={e => setLibPdf(e.target.files?.[0] || null)} />
                        </div>
                      )}
                      {item.type === "infographic" && (
                        <div className="space-y-2"><Label>رفع الصورة</Label>
                          <div className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors" onClick={() => libInfographicRef.current?.click()}>
                            {libInfographic ? <img src={URL.createObjectURL(libInfographic)} alt="preview" className="w-28 h-28 object-cover rounded-lg mx-auto" /> : <><Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" /><p className="text-sm">اضغط لرفع صورة</p></>}
                          </div>
                          <input ref={libInfographicRef} type="file" accept="image/*" className="hidden" onChange={e => setLibInfographic(e.target.files?.[0] || null)} />
                        </div>
                      )}
                      <Button onClick={() => addLibraryItem(item.type)} className="w-full bg-gradient-brand" disabled={libUploading}>{libUploading ? "جاري الرفع..." : `إضافة ${item.label}`}</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          )}
          {libraryItems.length === 0 ? <EmptyState label="لا يوجد محتوى في المكتبة" /> : libraryItems.map((item: any) => (
            <div key={item.id} className="bg-card border border-border rounded-2xl p-4 flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="text-xs">
                    {item.type === "article" ? "مقال" : item.type === "video" ? "فيديو" : item.type === "infographic" ? "إنفوجرافيك" : "PDF"}
                  </Badge>
                  {item.category && <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{item.category}</span>}
                </div>
                <p className="font-bold text-foreground text-sm">{item.title}</p>
                {item.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{item.description}</p>}
              </div>
              {hasPermission("manage_library") && (
                <Button size="icon" variant="ghost" className="text-destructive shrink-0" onClick={() => deleteLibraryItem(item.id)}><Trash2 className="h-4 w-4" /></Button>
              )}
            </div>
          ))}
        </div>
      );

      // USERS
      case "users": return (
        <div className="space-y-3">
          {profiles.length === 0 ? <EmptyState label="لا يوجد مستخدمون" /> : profiles.map((p: any) => {
            const ur = getUserRole(p.user_id);
            return (
              <div key={p.id} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4">
                {p.avatar_url ? (
                  <img src={p.avatar_url} alt={p.full_name} className="w-12 h-12 rounded-xl object-cover border border-border shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0"><User className="h-6 w-6 text-primary" /></div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-foreground text-sm">{p.full_name || "بدون اسم"}</p>
                  <p className="text-xs text-muted-foreground">{p.email}</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground mt-1">
                    {p.college && <span>{collegeLabels[p.college] || p.college}</span>}
                    {p.phone && <span>{p.phone}</span>}
                    <span>{new Date(p.created_at).toLocaleDateString("ar-EG")}</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs shrink-0">{ur ? roleLabels[ur.role as AppRole] || ur.role : "مستخدم"}</Badge>
              </div>
            );
          })}
        </div>
      );

      // ROLES
      case "roles": return (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Dialog open={roleDialog} onOpenChange={setRoleDialog}>
              <DialogTrigger asChild><Button size="sm" className="bg-gradient-brand gap-1"><ShieldCheck className="h-4 w-4" /> تعيين صلاحية</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>تعيين صلاحية لمستخدم</DialogTitle></DialogHeader>
                <div className="space-y-4 mt-2">
                  <div className="space-y-2"><Label>المستخدم</Label>
                    <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                      <SelectTrigger><SelectValue placeholder="اختر مستخدم" /></SelectTrigger>
                      <SelectContent>{profiles.map((p: any) => <SelectItem key={p.user_id} value={p.user_id}>{p.full_name || p.email}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>الصلاحية</Label>
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="super_admin">مدير عام</SelectItem><SelectItem value="admin">مدير</SelectItem>
                        <SelectItem value="moderator">مشرف</SelectItem><SelectItem value="editor">محرر</SelectItem>
                        <SelectItem value="viewer">مشاهد</SelectItem><SelectItem value="remove">إزالة الصلاحية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {selectedRole && selectedRole !== "remove" && (
                    <div className="bg-accent/50 rounded-xl p-3">
                      <p className="text-xs font-bold text-foreground mb-2">الصلاحيات:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(rolePermissions[selectedRole as AppRole] || []).map(p => (
                          <Badge key={p} variant="secondary" className="text-xs">{p === "all" ? "كل الصلاحيات" : p.replace("manage_", "")}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <Button onClick={assignRole} className="w-full bg-gradient-brand">تطبيق الصلاحية</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(Object.entries(roleLabels) as [AppRole, string][]).filter(([k]) => k !== "user").map(([key, label]) => (
              <div key={key} className="bg-card border border-border rounded-2xl p-4">
                <p className="font-bold text-foreground text-sm mb-2">{label}</p>
                <div className="flex flex-wrap gap-1">
                  {rolePermissions[key].slice(0, 5).map(p => (
                    <span key={p} className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded">{p === "all" ? "الكل" : p.replace("manage_", "")}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div>
            <h4 className="font-bold text-foreground text-sm mb-3">المستخدمون ذوو صلاحيات ({userRoles.length})</h4>
            {userRoles.length === 0 ? <EmptyState label="لا توجد صلاحيات معينة" /> : (
              <div className="space-y-2">
                {userRoles.map((ur: any) => {
                  const prof = getProfileByUserId(ur.user_id);
                  return (
                    <div key={ur.id} className="bg-card border border-border rounded-xl p-3 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-foreground text-sm">{prof?.full_name || "مستخدم"}</p>
                        <p className="text-xs text-muted-foreground">{prof?.email}</p>
                      </div>
                      <Badge className="bg-primary/10 text-primary text-xs">{roleLabels[ur.role as AppRole] || ur.role}</Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      );

      // CHAT
      case "chat": return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[500px]">
          {/* Sidebar */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col">
            <div className="p-3 border-b border-border bg-accent/30">
              <p className="font-bold text-foreground text-sm">المحادثات ({chatSenders.length})</p>
            </div>
            <div className="flex-1 overflow-y-auto">
              {chatSenders.length === 0 ? <p className="p-4 text-sm text-muted-foreground text-center">لا توجد محادثات</p> : chatSenders.map(uid => {
                const prof = getProfileByUserId(uid);
                const lastMsg = chatMessages.filter((m: any) => m.sender_id === uid || (m.is_admin && m.receiver_id === uid)).slice(-1)[0];
                return (
                  <button key={uid} onClick={() => setSelectedChat(uid)} className={`w-full p-3 text-right border-b border-border last:border-0 hover:bg-accent/30 transition-colors ${selectedChat === uid ? "bg-accent" : ""}`}>
                    <p className="font-bold text-foreground text-sm">{prof?.full_name || "مستخدم"}</p>
                    <p className="text-xs text-muted-foreground truncate">{lastMsg?.message}</p>
                  </button>
                );
              })}
            </div>
          </div>
          {/* Chat area */}
          <div className="md:col-span-2 bg-card border border-border rounded-2xl overflow-hidden flex flex-col">
            {selectedChat ? (
              <>
                <div className="p-3 border-b border-border bg-accent/30 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center"><User className="h-4 w-4 text-white" /></div>
                  <p className="font-bold text-foreground text-sm">{getProfileByUserId(selectedChat)?.full_name || "مستخدم"}</p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {getChatForUser(selectedChat).map((msg: any) => (
                    <div key={msg.id} className={`flex ${msg.is_admin ? "justify-start" : "justify-end"}`}>
                      <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${msg.is_admin ? "bg-primary text-primary-foreground rounded-tl-none" : "bg-muted text-foreground rounded-tr-none"}`}>
                        {msg.message}
                        <p className={`text-[10px] mt-1 ${msg.is_admin ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                          {new Date(msg.created_at).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {hasPermission("manage_chat") && (
                  <div className="p-3 border-t border-border flex gap-2">
                    <Input value={adminReply} onChange={e => setAdminReply(e.target.value)} placeholder="اكتب الرد..." className="flex-1" onKeyDown={e => e.key === "Enter" && sendAdminReply()} />
                    <Button size="icon" onClick={sendAdminReply} className="bg-gradient-brand shrink-0"><Send className="h-4 w-4" /></Button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground flex-col gap-3">
                <MessageSquare className="h-12 w-12 opacity-20" />
                <p className="text-sm">اختر محادثة لعرضها</p>
              </div>
            )}
          </div>
        </div>
      );

      // DONATIONS
      case "donations": return (
        <div className="space-y-3">
          {donations.length === 0 ? <EmptyState label="لا توجد تبرعات" /> : donations.map((d: any) => (
            <div key={d.id} className="bg-card border border-border rounded-2xl p-4 space-y-1">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <p className="font-bold text-foreground">{d.donor_name || "متبرع مجهول"}</p>
                  <p className="text-xs text-muted-foreground">{d.phone && `${d.phone} • `}{new Date(d.created_at).toLocaleDateString("ar-EG")}</p>
                </div>
                <Badge className={d.status === "confirmed" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : "bg-yellow-100 text-yellow-800"}>{d.status === "confirmed" ? "مؤكد" : "قيد المراجعة"}</Badge>
              </div>
              <p className="text-sm text-primary font-medium">{d.donation_type}</p>
              {d.description && <p className="text-sm text-muted-foreground">{d.description}</p>}
              {d.quantity && <p className="text-xs text-muted-foreground">الكمية: {d.quantity}</p>}
            </div>
          ))}
        </div>
      );

      // SURVEYS
      case "surveys": return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-2xl p-6 text-center">
              <p className="text-4xl font-bold text-primary">{safetyIndex}%</p>
              <p className="text-sm text-muted-foreground mt-2">يشعرون بالأمان</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 text-center">
              <p className="text-4xl font-bold text-primary">{surveys.length > 0 ? Math.round((surveys.filter((s: any) => s.knows_rights).length / surveys.length) * 100) : 0}%</p>
              <p className="text-sm text-muted-foreground mt-2">يعرفون حقوقهم</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 text-center">
              <p className="text-4xl font-bold text-secondary">{surveys.length > 0 ? Math.round((surveys.filter((s: any) => s.harassed).length / surveys.length) * 100) : 0}%</p>
              <p className="text-sm text-muted-foreground mt-2">تعرضوا لمضايقات</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4">
            <p className="font-bold text-foreground text-sm mb-1">إجمالي المشاركات</p>
            <p className="text-3xl font-bold text-primary">{surveys.length}</p>
          </div>
        </div>
      );

      // FORUM
      case "forum": return (
        <div className="space-y-3">
          <div className="flex justify-end">
            <Dialog open={forumPostDialog} onOpenChange={setForumPostDialog}>
              <DialogTrigger asChild><Button size="sm" className="bg-gradient-brand gap-1"><Plus className="h-4 w-4" /> نشر باسم الوحدة</Button></DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader><DialogTitle>نشر منشور باسم الوحدة</DialogTitle></DialogHeader>
                <div className="space-y-4 mt-2">
                  <div className="space-y-2"><Label>العنوان *</Label><Input value={forumForm.title} onChange={e => setForumForm({ ...forumForm, title: e.target.value })} /></div>
                  <div className="space-y-2"><Label>المحتوى *</Label><Textarea value={forumForm.content} onChange={e => setForumForm({ ...forumForm, content: e.target.value })} className="min-h-[120px]" /></div>
                  <div className="space-y-2"><Label>التصنيف</Label>
                    <Select value={forumForm.category} onValueChange={v => setForumForm({ ...forumForm, category: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">عام</SelectItem><SelectItem value="awareness">توعية</SelectItem>
                        <SelectItem value="rights">حقوق</SelectItem><SelectItem value="experience">تجارب</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={addForumPostAsUnit} className="w-full bg-gradient-brand">نشر المنشور</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          {forumPosts.length === 0 ? <EmptyState label="لا توجد منشورات في المنتدى" /> : forumPosts.map((p: any) => {
            const prof = profiles.find((pr: any) => pr.user_id === p.user_id);
            return (
              <div key={p.id} className="bg-card border border-border rounded-2xl p-4 flex gap-3 items-start">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="text-xs">{p.category || "عام"}</Badge>
                    <span className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString("ar-EG")}</span>
                  </div>
                  <p className="font-bold text-foreground text-sm">{p.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{p.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">{prof?.full_name || "مستخدم"} &bull; {p.likes_count || 0} إعجاب &bull; {p.comments_count || 0} تعليق</p>
                </div>
                <Button size="icon" variant="ghost" className="text-destructive shrink-0" onClick={() => deleteForumPost(p.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            );
          })}
        </div>
      );

      default: return <EmptyState label="اختر تبويباً من القائمة" />;
    }
  };

  const currentTabLabel = allTabs.find(t => t.id === currentTab)?.label || "لوحة التحكم";

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-brand rounded-2xl flex items-center justify-center shadow-lg">
              <LayoutDashboard className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">لوحة التحكم</h1>
              <p className="text-xs text-muted-foreground">صلاحيتك: <Badge variant="outline" className="text-xs">{roleLabels[role as AppRole] || role}</Badge></p>
            </div>
          </div>
          {hasPermission("manage_notifications") && (
            <Dialog open={notifDialog} onOpenChange={setNotifDialog}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-gradient-brand gap-1.5 shadow-md">
                  <Bell className="h-4 w-4" /> إرسال إشعار
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader><DialogTitle>إرسال إشعار للمستخدمين</DialogTitle></DialogHeader>
                <div className="space-y-4 mt-2">
                  <div className="space-y-2"><Label>العنوان *</Label><Input value={notifForm.title} onChange={e => setNotifForm({ ...notifForm, title: e.target.value })} placeholder="عنوان الإشعار" /></div>
                  <div className="space-y-2"><Label>الرسالة *</Label><Textarea value={notifForm.message} onChange={e => setNotifForm({ ...notifForm, message: e.target.value })} className="min-h-[80px]" placeholder="نص الإشعار..." /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>النوع</Label>
                      <Select value={notifForm.type} onValueChange={v => setNotifForm({ ...notifForm, type: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">عام</SelectItem><SelectItem value="activity">نشاط</SelectItem>
                          <SelectItem value="volunteer">تطوع</SelectItem><SelectItem value="campaign">حملة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2"><Label>رابط (اختياري)</Label><Input value={notifForm.link} onChange={e => setNotifForm({ ...notifForm, link: e.target.value })} placeholder="/activities" /></div>
                  </div>
                  {/* Image upload */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1"><ImageIcon className="h-4 w-4" /> صور مرفقة (حتى 3)</Label>
                    <button onClick={() => notifImageRef.current?.click()} className="w-full border-2 border-dashed border-border rounded-xl p-4 text-center hover:border-primary/50 transition-colors text-sm text-muted-foreground">
                      اضغط لإضافة صور
                    </button>
                    <input ref={notifImageRef} type="file" accept="image/*" multiple className="hidden" onChange={e => {
                      if (e.target.files) setNotifImages(prev => [...prev, ...Array.from(e.target.files!)].slice(0, 3));
                    }} />
                    {notifImages.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {notifImages.map((f, i) => (
                          <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-border">
                            <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                            <button onClick={() => setNotifImages(prev => prev.filter((_, j) => j !== i))} className="absolute top-0 right-0 w-4 h-4 bg-destructive text-white text-[9px] flex items-center justify-center rounded-bl">x</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button onClick={addNotification} className="w-full bg-gradient-brand" disabled={notifUploading}>{notifUploading ? "جاري الإرسال..." : "إرسال الإشعار"}</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </motion.div>

        {/* Stats grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {[...Array(6)].map((_, i) => <Card key={i}><CardContent className="p-5"><div className="h-12 bg-muted animate-pulse rounded-xl" /></CardContent></Card>)}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {stats.map(s => <StatCard key={s.label} {...s} />)}
          </motion.div>
        )}

        {/* Main layout: sidebar tabs + content */}
        {!loading && (
          <div className="flex flex-col lg:flex-row gap-6">

            {/* Sidebar navigation (desktop) */}
            <nav className="hidden lg:flex flex-col w-56 shrink-0 gap-1">
              {allTabs.map(tab => {
                const Icon = tab.icon;
                const isActive = (currentTab || allTabs[0]?.id) === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-right ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1">{tab.label}</span>
                    {tab.count > 0 && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${isActive ? "bg-white/20" : "bg-muted text-muted-foreground"}`}>
                        {tab.count}
                      </span>
                    )}
                    {isActive && <ChevronRight className="h-3 w-3 opacity-60 shrink-0" />}
                  </button>
                );
              })}
            </nav>

            {/* Mobile horizontal scroll tabs */}
            <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {allTabs.map(tab => {
                const Icon = tab.icon;
                const isActive = (currentTab || allTabs[0]?.id) === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap shrink-0 transition-all ${
                      isActive ? "bg-primary text-primary-foreground shadow-sm" : "bg-card border border-border text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {tab.label}
                    {tab.count > 0 && (
                      <span className={`text-[10px] font-bold ${isActive ? "opacity-70" : "text-muted-foreground"}`}>({tab.count})</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Content area */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground">{currentTabLabel}</h2>
                <span className="text-xs text-muted-foreground">{allTabs.find(t => t.id === currentTab)?.count || 0} عنصر</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                >
                  {renderTabContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Empty State ─────────────────────────────────────────────────────────────
const EmptyState = ({ label }: { label: string }) => (
  <div className="text-center py-16 text-muted-foreground">
    <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
      <FileText className="h-8 w-8 opacity-40" />
    </div>
    <p className="text-sm">{label}</p>
  </div>
);

export default Dashboard;
