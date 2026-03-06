import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, FileText, AlertCircle, CheckCircle, Plus, Trash2, Heart, Upload, Image, Video, BookOpen, Send, Bell, User, ShieldCheck, Lock, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole, roleLabels, rolePermissions, type AppRole } from "@/hooks/useUserRole";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  investigating: "bg-blue-100 text-blue-800",
  resolved: "bg-green-100 text-green-800",
  closed: "bg-gray-100 text-gray-800",
};

const statusLabels: Record<string, string> = {
  pending: "قيد الانتظار",
  investigating: "قيد التحقيق",
  resolved: "تم الحل",
  closed: "مغلق",
};

const collegeLabels: Record<string, string> = {
  egyptian_korean: "الكلية المصرية الكورية",
  technology: "الكلية التكنولوجية",
  industry: "كلية الصناعة والطاقة",
  other: "أخرى",
};

const deptLabels: Record<string, string> = {
  ict: "تكنولوجيا المعلومات والاتصالات",
  mechatronics: "الميكاترونيكس",
  autotronics: "الأوتوترونيكس",
  renewable_energy: "الطاقة المتجددة",
  industrial_control: "التحكم في العمليات الصناعية",
  railway: "السكة الحديد",
  marketing: "التسويق",
};

const callDashboardApi = async (action: string, body?: any) => {
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/dashboard-api?action=${action}`;
  const options: RequestInit = {
    method: body ? "POST" : "GET",
    headers: { "Content-Type": "application/json", "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
  };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(url, options);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "خطأ في الخادم");
  }
  return res.json();
};

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

  // Activity form
  const [actForm, setActForm] = useState({ title: "", description: "", type: "seminar", location: "", date: "", organizer: "", target_audience: "", notes: "", max_attendees: "", contact_info: "", status: "upcoming" });
  const [actDialog, setActDialog] = useState(false);
  const [actImage, setActImage] = useState<File | null>(null);
  const [actUploading, setActUploading] = useState(false);
  const actImageRef = useRef<HTMLInputElement>(null);

  // Library forms
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

  // Notification form
  const [notifDialog, setNotifDialog] = useState(false);
  const [notifForm, setNotifForm] = useState({ title: "", message: "", type: "general", link: "" });

  // Role management
  const [roleDialog, setRoleDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("user");

  // Forum post form
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
    } catch (e: any) {
      toast.error("خطأ في تحميل البيانات: " + e.message);
    }
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  // Check access
  if (roleLoading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">جاري التحقق من الصلاحيات...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto space-y-6">
          <div className="w-20 h-20 bg-accent rounded-2xl flex items-center justify-center mx-auto"><Lock className="h-10 w-10 text-primary" /></div>
          <h2 className="text-2xl font-bold text-foreground">تسجيل الدخول مطلوب</h2>
          <p className="text-muted-foreground">يجب تسجيل الدخول للوصول إلى لوحة التحكم</p>
          <Button onClick={() => navigate("/auth")} className="bg-gradient-brand">تسجيل الدخول</Button>
        </motion.div>
      </div>
    );
  }

  if (!canAccessDashboard) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto space-y-6">
          <div className="w-20 h-20 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto"><ShieldCheck className="h-10 w-10 text-destructive" /></div>
          <h2 className="text-2xl font-bold text-foreground">ليس لديك صلاحية</h2>
          <p className="text-muted-foreground">عذراً، ليس لديك الصلاحية للوصول إلى لوحة التحكم. تواصل مع المدير لمنحك الصلاحية المناسبة.</p>
          <Button onClick={() => navigate("/")} variant="outline">العودة للرئيسية</Button>
        </motion.div>
      </div>
    );
  }

  const updateReportStatus = async (id: string, status: string) => {
    try {
      await callDashboardApi("update-report-status", { id, status });
      toast.success("تم التحديث");
      fetchAll();
    } catch { toast.error("خطأ في التحديث"); }
  };

  const addActivity = async () => {
    if (!actForm.title || !actForm.description) { toast.error("يرجى ملء العنوان والوصف"); return; }
    setActUploading(true);
    try {
      let image_url = null;
      if (actImage) {
        const fileName = `${Date.now()}-${actImage.name}`;
        const { data, error } = await supabase.storage.from("activity-images").upload(fileName, actImage);
        if (error) throw error;
        const { data: urlData } = supabase.storage.from("activity-images").getPublicUrl(data.path);
        image_url = urlData.publicUrl;
      }
      await callDashboardApi("add-activity", {
        title: actForm.title, description: actForm.description,
        date: actForm.date ? new Date(actForm.date).toISOString() : null,
        image_url, location: actForm.location || null, type: actForm.type || null,
        organizer: actForm.organizer || null, target_audience: actForm.target_audience || null,
        notes: actForm.notes || null, max_attendees: actForm.max_attendees ? parseInt(actForm.max_attendees) : null,
        contact_info: actForm.contact_info || null, status: actForm.status || "upcoming",
      });
      toast.success("تمت إضافة النشاط بنجاح");
      setActDialog(false);
      setActForm({ title: "", description: "", type: "seminar", location: "", date: "", organizer: "", target_audience: "", notes: "", max_attendees: "", contact_info: "", status: "upcoming" });
      setActImage(null);
      fetchAll();
    } catch (e: any) { toast.error("خطأ: " + e.message); }
    setActUploading(false);
  };

  const deleteActivity = async (id: string) => {
    try { await callDashboardApi("delete-activity", { id }); toast.success("تم الحذف"); fetchAll(); } catch { toast.error("خطأ في الحذف"); }
  };

  const addLibraryItem = async (type: string) => {
    if (!libForm.title) { toast.error("يرجى إدخال العنوان"); return; }
    setLibUploading(true);
    try {
      let url = libForm.url || null;
      if (type === "video" && libVideo) {
        const fileName = `${Date.now()}-${libVideo.name}`;
        const { data, error } = await supabase.storage.from("library-videos").upload(fileName, libVideo);
        if (error) throw error;
        const { data: urlData } = supabase.storage.from("library-videos").getPublicUrl(data.path);
        url = urlData.publicUrl;
      }
      if (type === "pdf" && libPdf) {
        const fileName = `${Date.now()}-${libPdf.name}`;
        const { data, error } = await supabase.storage.from("library-files").upload(fileName, libPdf);
        if (error) throw error;
        const { data: urlData } = supabase.storage.from("library-files").getPublicUrl(data.path);
        url = urlData.publicUrl;
      }
      if (type === "infographic" && libInfographic) {
        const fileName = `${Date.now()}-${libInfographic.name}`;
        const { data, error } = await supabase.storage.from("library-files").upload(fileName, libInfographic);
        if (error) throw error;
        const { data: urlData } = supabase.storage.from("library-files").getPublicUrl(data.path);
        url = urlData.publicUrl;
      }
      await callDashboardApi("add-library", {
        title: libForm.title, description: libForm.description || null, type,
        category: libForm.category || null, url, duration: libForm.duration || null,
        read_time: libForm.read_time || null, thumbnail_url: libForm.thumbnail_url || null,
        content: libForm.content || null,
      });
      toast.success("تمت الإضافة بنجاح");
      setArticleDialog(false); setVideoDialog(false); setPdfDialog(false); setInfographicDialog(false);
      setLibForm({ title: "", description: "", type: "article", category: "", url: "", duration: "", read_time: "", thumbnail_url: "", content: "" });
      setLibVideo(null); setLibPdf(null); setLibInfographic(null);
      fetchAll();
    } catch (e: any) { toast.error("خطأ: " + e.message); }
    setLibUploading(false);
  };

  const deleteLibraryItem = async (id: string) => {
    try { await callDashboardApi("delete-library", { id }); toast.success("تم الحذف"); fetchAll(); } catch { toast.error("خطأ في الحذف"); }
  };

  const approveVolunteer = async (id: string) => {
    try { await callDashboardApi("update-volunteer", { id, status: "approved", is_approved: true }); toast.success("تم قبول المتطوع"); fetchAll(); } catch { toast.error("خطأ"); }
  };

  const sendAdminReply = async () => {
    if (!selectedChat || !adminReply.trim()) return;
    try {
      await callDashboardApi("send-admin-reply", { sender_id: selectedChat, message: adminReply.trim() });
      setAdminReply("");
      fetchAll();
      toast.success("تم إرسال الرد");
    } catch { toast.error("خطأ في الإرسال"); }
  };

  const addNotification = async () => {
    if (!notifForm.title || !notifForm.message) { toast.error("يرجى ملء العنوان والرسالة"); return; }
    try {
      await callDashboardApi("add-notification", notifForm);
      toast.success("تم إرسال الإشعار");
      setNotifDialog(false);
      setNotifForm({ title: "", message: "", type: "general", link: "" });
    } catch { toast.error("خطأ"); }
  };

  const assignRole = async () => {
    if (!selectedUserId || !selectedRole) { toast.error("يرجى اختيار المستخدم والصلاحية"); return; }
    try {
      await supabase.from("user_roles").delete().eq("user_id", selectedUserId);
      if (selectedRole !== "remove") {
        await supabase.from("user_roles").insert({ user_id: selectedUserId, role: selectedRole } as any);
      }
      toast.success("تم تحديث الصلاحية");
      setRoleDialog(false);
      setSelectedUserId("");
      setSelectedRole("user");
      fetchAll();
    } catch (e: any) { toast.error("خطأ: " + e.message); }
  };

  const deleteForumPost = async (id: string) => {
    try {
      await supabase.from("forum_comments").delete().eq("post_id", id);
      await supabase.from("forum_likes").delete().eq("post_id", id);
      await supabase.from("forum_posts").delete().eq("id", id);
      toast.success("تم حذف المنشور");
      fetchAll();
    } catch { toast.error("خطأ في الحذف"); }
  };

  const addForumPostAsUnit = async () => {
    if (!forumForm.title || !forumForm.content || !user) { toast.error("يرجى ملء العنوان والمحتوى"); return; }
    try {
      await supabase.from("forum_posts").insert({
        user_id: user.id,
        title: `🏛️ ${forumForm.title}`,
        content: forumForm.content,
        category: forumForm.category,
      } as any);
      toast.success("تم نشر المنشور باسم الوحدة");
      setForumPostDialog(false);
      setForumForm({ title: "", content: "", category: "general" });
      fetchAll();
    } catch { toast.error("خطأ في النشر"); }
  };

  const safetyIndex = surveys.length > 0 ? Math.round((surveys.filter((s: any) => s.feels_safe).length / surveys.length) * 100) : 0;
  const totalDonations = donations.length;

  // Group chat messages by sender
  const chatSenders = [...new Set(chatMessages.filter((m: any) => !m.is_admin).map((m: any) => m.sender_id))];
  const getProfileByUserId = (uid: string) => profiles.find((p: any) => p.user_id === uid);
  const getChatForUser = (uid: string) => chatMessages.filter((m: any) => m.sender_id === uid || (m.is_admin && m.receiver_id === uid));
  const getUserRole = (uid: string) => userRoles.find((r: any) => r.user_id === uid);

  // Determine visible tabs based on permissions
  const tabs = [
    { id: "reports", label: "البلاغات", perm: "manage_reports" },
    { id: "volunteers", label: "المتطوعين", perm: "manage_volunteers" },
    { id: "activities", label: "الأنشطة", perm: "manage_activities" },
    { id: "library", label: "المكتبة", perm: "manage_library" },
    { id: "users", label: "المستخدمين", perm: "manage_users" },
    { id: "roles", label: "الصلاحيات", perm: "manage_roles" },
    { id: "chat", label: "المراسلات", perm: "manage_chat" },
    { id: "donations", label: "التبرعات", perm: "manage_donations" },
    { id: "surveys", label: "الاستبيانات", perm: "manage_surveys" },
    { id: "forum", label: "المنتدى", perm: "manage_reports" },
  ].filter(t => hasPermission(t.perm) || (t.id === "users" && hasPermission("manage_reports")) || (t.id !== "roles" && role === "viewer"));

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">لوحة التحكم</h1>
          <p className="text-muted-foreground">مرحباً، صلاحيتك: <Badge variant="outline">{roleLabels[role as AppRole] || role}</Badge></p>
        </div>
        <div className="flex gap-2">
          {hasPermission("manage_notifications") && (
            <Dialog open={notifDialog} onOpenChange={setNotifDialog}>
              <DialogTrigger asChild><Button size="sm" variant="outline"><Bell className="ml-1 h-4 w-4" /> إشعار جديد</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>إرسال إشعار للمستخدمين</DialogTitle></DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2"><Label>العنوان *</Label><Input value={notifForm.title} onChange={e => setNotifForm({ ...notifForm, title: e.target.value })} placeholder="عنوان الإشعار" /></div>
                  <div className="space-y-2"><Label>الرسالة *</Label><Textarea value={notifForm.message} onChange={e => setNotifForm({ ...notifForm, message: e.target.value })} placeholder="نص الإشعار..." /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>النوع</Label>
                      <Select value={notifForm.type} onValueChange={v => setNotifForm({ ...notifForm, type: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">عام</SelectItem>
                          <SelectItem value="activity">نشاط</SelectItem>
                          <SelectItem value="volunteer">تطوع</SelectItem>
                          <SelectItem value="campaign">حملة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2"><Label>الرابط (اختياري)</Label><Input value={notifForm.link} onChange={e => setNotifForm({ ...notifForm, link: e.target.value })} placeholder="/activities" /></div>
                  </div>
                  <Button onClick={addNotification} className="w-full bg-gradient-brand">إرسال الإشعار</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          {[...Array(6)].map((_, i) => (
            <Card key={i}><CardContent className="p-6"><div className="h-8 bg-muted animate-pulse rounded" /></CardContent></Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">البلاغات</CardTitle><AlertCircle className="h-4 w-4 text-destructive" /></CardHeader><CardContent><div className="text-2xl font-bold">{reports.length}</div></CardContent></Card>
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">تم حلها</CardTitle><CheckCircle className="h-4 w-4 text-green-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{reports.filter((r: any) => r.status === "resolved").length}</div></CardContent></Card>
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">المتطوعين</CardTitle><Users className="h-4 w-4 text-blue-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{volunteers.length}</div></CardContent></Card>
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">الأنشطة</CardTitle><FileText className="h-4 w-4 text-primary" /></CardHeader><CardContent><div className="text-2xl font-bold">{activities.length}</div></CardContent></Card>
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">المستخدمين</CardTitle><User className="h-4 w-4 text-indigo-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{profiles.length}</div></CardContent></Card>
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">التبرعات</CardTitle><Heart className="h-4 w-4 text-secondary" /></CardHeader><CardContent><div className="text-2xl font-bold">{totalDonations}</div></CardContent></Card>
          </div>

          <Tabs defaultValue={tabs[0]?.id || "reports"} className="space-y-4">
            <TabsList className="flex-wrap">
              {tabs.map(t => <TabsTrigger key={t.id} value={t.id}>{t.label}</TabsTrigger>)}
            </TabsList>

            {/* Reports Tab */}
            <TabsContent value="reports">
              <Card>
                <CardHeader><CardTitle>البلاغات الواردة ({reports.length})</CardTitle></CardHeader>
                <CardContent>
                  {reports.length === 0 ? <p className="text-center py-10 text-muted-foreground">لا توجد بلاغات حالياً</p> : (
                    <div className="space-y-4">
                      {reports.map((r: any) => (
                        <div key={r.id} className="border border-border rounded-xl p-4 space-y-3">
                          <div className="flex justify-between items-start flex-wrap gap-2">
                            <div>
                              <p className="font-bold text-foreground">{r.is_anonymous ? "بلاغ مجهول" : r.reporter_name || "بدون اسم"}</p>
                              <p className="text-sm text-muted-foreground">الكلية: {collegeLabels[r.college] || r.college} • {new Date(r.created_at).toLocaleDateString("ar-EG")}</p>
                            </div>
                            <Badge className={statusColors[r.status] || ""}>{statusLabels[r.status] || r.status}</Badge>
                          </div>
                          <p className="text-sm text-foreground">{r.description}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground"><span>وسيلة تواصل: {r.contact_info}</span></div>
                          {hasPermission("manage_reports") && (
                            <div className="flex gap-2 flex-wrap">
                              {["pending", "investigating", "resolved", "closed"].map((s) => (
                                <Button key={s} size="sm" variant={r.status === s ? "default" : "outline"} onClick={() => updateReportStatus(r.id, s)} className="text-xs">{statusLabels[s]}</Button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Volunteers Tab */}
            <TabsContent value="volunteers">
              <Card>
                <CardHeader><CardTitle>طلبات التطوع ({volunteers.length})</CardTitle></CardHeader>
                <CardContent>
                  {volunteers.length === 0 ? <p className="text-center py-10 text-muted-foreground">لا توجد طلبات حالياً</p> : (
                    <div className="space-y-3">
                      {volunteers.map((v: any) => (
                        <div key={v.id} className="border border-border rounded-xl p-4 space-y-2">
                          <div className="flex justify-between items-start flex-wrap gap-3">
                            <div className="flex gap-4 items-start flex-1">
                              {v.photo_url ? (
                                <img src={v.photo_url} alt={v.name} className="w-14 h-14 rounded-full object-cover border-2 border-primary/20 shrink-0" />
                              ) : (
                                <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center shrink-0 border-2 border-primary/20">
                                  <span className="text-lg font-bold text-primary">{v.name?.charAt(0)}</span>
                                </div>
                              )}
                              <div className="flex-1">
                                <p className="font-bold text-foreground text-lg">{v.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  الكلية: {collegeLabels[v.college] || v.college}
                                  {v.department && ` • القسم: ${deptLabels[v.department] || v.department}`}
                                </p>
                                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-1">
                                  {v.phone && <span>📞 {v.phone}</span>}
                                  {v.email && <span>✉️ {v.email}</span>}
                                  {v.gender && <span>👤 {v.gender === "male" ? "ذكر" : "أنثى"}</span>}
                                  {v.birth_date && <span>🎂 {new Date(v.birth_date).toLocaleDateString("ar-EG")}</span>}
                                  {v.role_title && <span>🏷️ {v.role_title}</span>}
                                  {v.volunteer_section && <span>📂 {v.volunteer_section}</span>}
                                </div>
                                {v.skills && <p className="text-sm text-foreground mt-1">المهارات: {v.skills}</p>}
                                {v.reason && <p className="text-sm text-muted-foreground mt-1">السبب: {v.reason}</p>}
                                {v.national_id && <p className="text-xs text-muted-foreground mt-1">الرقم القومي: {v.national_id}</p>}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge className={v.status === "approved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                                {v.status === "approved" ? "مقبول" : "قيد المراجعة"}
                              </Badge>
                              {v.status !== "approved" && hasPermission("manage_volunteers") && (
                                <Button size="sm" onClick={() => approveVolunteer(v.id)} className="bg-green-600 hover:bg-green-700 text-white text-xs">قبول</Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activities Tab */}
            <TabsContent value="activities">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>الأنشطة والفعاليات ({activities.length})</CardTitle>
                  {hasPermission("manage_activities") && (
                    <Dialog open={actDialog} onOpenChange={setActDialog}>
                      <DialogTrigger asChild><Button size="sm"><Plus className="ml-1 h-4 w-4" /> إضافة نشاط</Button></DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>إضافة نشاط جديد</DialogTitle>
                          <DialogDescription>أضف نشاطاً أو فعالية جديدة</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>العنوان *</Label><Input value={actForm.title} onChange={e => setActForm({ ...actForm, title: e.target.value })} placeholder="اسم النشاط" /></div>
                            <div className="space-y-2"><Label>نوع النشاط</Label>
                              <Select value={actForm.type} onValueChange={v => setActForm({ ...actForm, type: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="seminar">ندوة</SelectItem>
                                  <SelectItem value="workshop">ورشة عمل</SelectItem>
                                  <SelectItem value="campaign">حملة توعوية</SelectItem>
                                  <SelectItem value="training">تدريب</SelectItem>
                                  <SelectItem value="conference">مؤتمر</SelectItem>
                                  <SelectItem value="other">أخرى</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-2"><Label>الوصف *</Label><Textarea value={actForm.description} onChange={e => setActForm({ ...actForm, description: e.target.value })} className="min-h-[100px]" placeholder="وصف تفصيلي..." /></div>
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
                                <SelectItem value="upcoming">قادم</SelectItem>
                                <SelectItem value="ongoing">جاري</SelectItem>
                                <SelectItem value="completed">منتهي</SelectItem>
                                <SelectItem value="cancelled">ملغي</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2"><Label>ملاحظات</Label><Textarea value={actForm.notes} onChange={e => setActForm({ ...actForm, notes: e.target.value })} /></div>
                          <div className="space-y-2">
                            <Label>صورة النشاط</Label>
                            <div className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors" onClick={() => actImageRef.current?.click()}>
                              {actImage ? (
                                <div className="space-y-2">
                                  <img src={URL.createObjectURL(actImage)} alt="preview" className="w-32 h-32 object-cover rounded-lg mx-auto" />
                                  <p className="text-sm text-muted-foreground">{actImage.name}</p>
                                </div>
                              ) : (
                                <><Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" /><p className="text-sm font-medium text-foreground">اضغط لرفع صورة</p></>
                              )}
                            </div>
                            <input ref={actImageRef} type="file" accept="image/*" className="hidden" onChange={e => setActImage(e.target.files?.[0] || null)} />
                          </div>
                          <Button onClick={addActivity} className="w-full bg-gradient-brand" disabled={actUploading}>{actUploading ? "جاري الرفع..." : "إضافة النشاط"}</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </CardHeader>
                <CardContent>
                  {activities.length === 0 ? <p className="text-center py-10 text-muted-foreground">لا توجد أنشطة</p> : (
                    <div className="space-y-3">
                      {activities.map((a: any) => (
                        <div key={a.id} className="border border-border rounded-xl p-4 flex justify-between items-start gap-4">
                          <div className="flex gap-4 items-start flex-1">
                            {a.image_url && <img src={a.image_url} alt={a.title} className="w-16 h-16 rounded-lg object-cover shrink-0" />}
                            <div>
                              <p className="font-bold text-foreground">{a.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {a.type && <span className="bg-accent px-2 py-0.5 rounded text-xs text-primary ml-2">{a.type}</span>}
                                {a.location && ` ${a.location}`}
                                {a.date && ` • ${new Date(a.date).toLocaleDateString("ar-EG")}`}
                              </p>
                            </div>
                          </div>
                          {hasPermission("manage_activities") && <Button size="icon" variant="ghost" className="text-destructive shrink-0" onClick={() => deleteActivity(a.id)}><Trash2 className="h-4 w-4" /></Button>}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Library Tab */}
            <TabsContent value="library">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-3">
                  <CardTitle>المكتبة التوعوية ({libraryItems.length})</CardTitle>
                  {hasPermission("manage_library") && (
                    <div className="flex gap-2 flex-wrap">
                      <Dialog open={articleDialog} onOpenChange={setArticleDialog}>
                        <DialogTrigger asChild><Button size="sm" variant="outline"><BookOpen className="ml-1 h-4 w-4" /> مقال</Button></DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader><DialogTitle>إضافة مقال جديد</DialogTitle></DialogHeader>
                          <div className="space-y-4 mt-4">
                            <div className="space-y-2"><Label>العنوان *</Label><Input value={libForm.title} onChange={e => setLibForm({ ...libForm, title: e.target.value })} /></div>
                            <div className="space-y-2"><Label>وصف مختصر</Label><Textarea value={libForm.description} onChange={e => setLibForm({ ...libForm, description: e.target.value })} className="min-h-[60px]" /></div>
                            <div className="space-y-2"><Label>محتوى المقال الكامل *</Label><Textarea value={libForm.content} onChange={e => setLibForm({ ...libForm, content: e.target.value })} className="min-h-[250px]" placeholder="اكتب المقال كاملاً هنا..." /></div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2"><Label>التصنيف</Label><Input value={libForm.category} onChange={e => setLibForm({ ...libForm, category: e.target.value })} placeholder="حقوق، أمان رقمي..." /></div>
                              <div className="space-y-2"><Label>وقت القراءة</Label><Input value={libForm.read_time} onChange={e => setLibForm({ ...libForm, read_time: e.target.value })} placeholder="5 دقائق" /></div>
                            </div>
                            <Button onClick={() => addLibraryItem("article")} className="w-full bg-gradient-brand" disabled={libUploading}>{libUploading ? "جاري الإضافة..." : "إضافة المقال"}</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Dialog open={videoDialog} onOpenChange={setVideoDialog}>
                        <DialogTrigger asChild><Button size="sm" variant="outline"><Video className="ml-1 h-4 w-4" /> فيديو</Button></DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader><DialogTitle>إضافة فيديو جديد</DialogTitle></DialogHeader>
                          <div className="space-y-4 mt-4">
                            <div className="space-y-2"><Label>العنوان *</Label><Input value={libForm.title} onChange={e => setLibForm({ ...libForm, title: e.target.value })} /></div>
                            <div className="space-y-2"><Label>الوصف</Label><Textarea value={libForm.description} onChange={e => setLibForm({ ...libForm, description: e.target.value })} /></div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2"><Label>التصنيف</Label><Input value={libForm.category} onChange={e => setLibForm({ ...libForm, category: e.target.value })} /></div>
                              <div className="space-y-2"><Label>المدة</Label><Input value={libForm.duration} onChange={e => setLibForm({ ...libForm, duration: e.target.value })} placeholder="10:30" /></div>
                            </div>
                            <div className="space-y-2">
                              <Label>رفع الفيديو</Label>
                              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors" onClick={() => libVideoRef.current?.click()}>
                                {libVideo ? <p className="text-sm text-primary font-medium">✅ {libVideo.name}</p> : <><Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" /><p className="text-sm">اضغط لرفع الفيديو</p></>}
                              </div>
                              <input ref={libVideoRef} type="file" accept="video/*" className="hidden" onChange={e => setLibVideo(e.target.files?.[0] || null)} />
                            </div>
                            <Button onClick={() => addLibraryItem("video")} className="w-full bg-gradient-brand" disabled={libUploading}>{libUploading ? "جاري الرفع..." : "إضافة الفيديو"}</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Dialog open={pdfDialog} onOpenChange={setPdfDialog}>
                        <DialogTrigger asChild><Button size="sm" variant="outline"><FileText className="ml-1 h-4 w-4" /> PDF</Button></DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader><DialogTitle>إضافة ملف PDF</DialogTitle></DialogHeader>
                          <div className="space-y-4 mt-4">
                            <div className="space-y-2"><Label>العنوان *</Label><Input value={libForm.title} onChange={e => setLibForm({ ...libForm, title: e.target.value })} /></div>
                            <div className="space-y-2"><Label>الوصف</Label><Textarea value={libForm.description} onChange={e => setLibForm({ ...libForm, description: e.target.value })} /></div>
                            <div className="space-y-2"><Label>التصنيف</Label><Input value={libForm.category} onChange={e => setLibForm({ ...libForm, category: e.target.value })} /></div>
                            <div className="space-y-2">
                              <Label>رفع ملف PDF</Label>
                              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors" onClick={() => libPdfRef.current?.click()}>
                                {libPdf ? <p className="text-sm text-primary font-medium">✅ {libPdf.name}</p> : <><Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" /><p className="text-sm">اضغط لرفع ملف PDF</p></>}
                              </div>
                              <input ref={libPdfRef} type="file" accept=".pdf" className="hidden" onChange={e => setLibPdf(e.target.files?.[0] || null)} />
                            </div>
                            <Button onClick={() => addLibraryItem("pdf")} className="w-full bg-gradient-brand" disabled={libUploading}>{libUploading ? "جاري الرفع..." : "إضافة الملف"}</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Dialog open={infographicDialog} onOpenChange={setInfographicDialog}>
                        <DialogTrigger asChild><Button size="sm" variant="outline"><Image className="ml-1 h-4 w-4" /> إنفوجرافيك</Button></DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader><DialogTitle>إضافة إنفوجرافيك</DialogTitle></DialogHeader>
                          <div className="space-y-4 mt-4">
                            <div className="space-y-2"><Label>العنوان *</Label><Input value={libForm.title} onChange={e => setLibForm({ ...libForm, title: e.target.value })} /></div>
                            <div className="space-y-2"><Label>الوصف</Label><Textarea value={libForm.description} onChange={e => setLibForm({ ...libForm, description: e.target.value })} /></div>
                            <div className="space-y-2"><Label>التصنيف</Label><Input value={libForm.category} onChange={e => setLibForm({ ...libForm, category: e.target.value })} /></div>
                            <div className="space-y-2">
                              <Label>رفع الصورة</Label>
                              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors" onClick={() => libInfographicRef.current?.click()}>
                                {libInfographic ? (
                                  <div className="space-y-2">
                                    <img src={URL.createObjectURL(libInfographic)} alt="preview" className="w-32 h-32 object-cover rounded-lg mx-auto" />
                                    <p className="text-sm text-muted-foreground">{libInfographic.name}</p>
                                  </div>
                                ) : <><Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" /><p className="text-sm">اضغط لرفع صورة الإنفوجرافيك</p></>}
                              </div>
                              <input ref={libInfographicRef} type="file" accept="image/*" className="hidden" onChange={e => setLibInfographic(e.target.files?.[0] || null)} />
                            </div>
                            <Button onClick={() => addLibraryItem("infographic")} className="w-full bg-gradient-brand" disabled={libUploading}>{libUploading ? "جاري الرفع..." : "إضافة الإنفوجرافيك"}</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  {libraryItems.length === 0 ? <p className="text-center py-10 text-muted-foreground">لا يوجد محتوى</p> : (
                    <div className="space-y-3">
                      {libraryItems.map((item: any) => (
                        <div key={item.id} className="border border-border rounded-xl p-4 flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="secondary" className="text-xs">
                                {item.type === "article" ? "📄 مقال" : item.type === "video" ? "🎬 فيديو" : item.type === "infographic" ? "📊 إنفوجرافيك" : "📋 PDF"}
                              </Badge>
                              {item.category && <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{item.category}</span>}
                            </div>
                            <p className="font-bold text-foreground">{item.title}</p>
                            {item.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{item.description}</p>}
                          </div>
                          {hasPermission("manage_library") && <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteLibraryItem(item.id)}><Trash2 className="h-4 w-4" /></Button>}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users">
              <Card>
                <CardHeader><CardTitle>المستخدمون المسجلون ({profiles.length})</CardTitle></CardHeader>
                <CardContent>
                  {profiles.length === 0 ? <p className="text-center py-10 text-muted-foreground">لا يوجد مستخدمون</p> : (
                    <div className="space-y-3">
                      {profiles.map((p: any) => {
                        const ur = getUserRole(p.user_id);
                        return (
                          <div key={p.id} className="border border-border rounded-xl p-4 flex items-center gap-4">
                            {p.avatar_url ? (
                              <img src={p.avatar_url} alt={p.full_name} className="w-12 h-12 rounded-full object-cover border border-border" />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center"><User className="h-6 w-6 text-primary" /></div>
                            )}
                            <div className="flex-1">
                              <p className="font-bold text-foreground">{p.full_name || "بدون اسم"}</p>
                              <p className="text-sm text-muted-foreground">{p.email}</p>
                              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-1">
                                {p.college && <span>🎓 {collegeLabels[p.college] || p.college}</span>}
                                {p.department && <span>📚 {deptLabels[p.department] || p.department}</span>}
                                {p.phone && <span>📞 {p.phone}</span>}
                                <span>📅 {new Date(p.created_at).toLocaleDateString("ar-EG")}</span>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {ur ? roleLabels[ur.role as AppRole] || ur.role : "مستخدم"}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Roles Tab */}
            <TabsContent value="roles">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>إدارة الصلاحيات</CardTitle>
                    <CardDescription>تعيين وتعديل صلاحيات المستخدمين</CardDescription>
                  </div>
                  <Dialog open={roleDialog} onOpenChange={setRoleDialog}>
                    <DialogTrigger asChild><Button size="sm"><ShieldCheck className="ml-1 h-4 w-4" /> تعيين صلاحية</Button></DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>تعيين صلاحية لمستخدم</DialogTitle></DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label>اختر المستخدم</Label>
                          <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                            <SelectTrigger><SelectValue placeholder="اختر مستخدم" /></SelectTrigger>
                            <SelectContent>
                              {profiles.map((p: any) => (
                                <SelectItem key={p.user_id} value={p.user_id}>{p.full_name || p.email} ({p.email})</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>الصلاحية</Label>
                          <Select value={selectedRole} onValueChange={setSelectedRole}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="super_admin">مدير عام (كل الصلاحيات)</SelectItem>
                              <SelectItem value="admin">مدير (إدارة كل الأقسام)</SelectItem>
                              <SelectItem value="moderator">مشرف (البلاغات، الأنشطة، المراسلات)</SelectItem>
                              <SelectItem value="editor">محرر (الأنشطة، المكتبة)</SelectItem>
                              <SelectItem value="viewer">مشاهد (عرض فقط)</SelectItem>
                              <SelectItem value="remove">إزالة الصلاحية</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="bg-accent/50 rounded-xl p-4">
                          <p className="text-sm font-bold text-foreground mb-2">صلاحيات الدور المختار:</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedRole && selectedRole !== "remove" && (rolePermissions[selectedRole as AppRole] || []).map(p => (
                              <Badge key={p} variant="secondary" className="text-xs">{p === "all" ? "كل الصلاحيات" : p.replace("manage_", "إدارة ")}</Badge>
                            ))}
                            {selectedRole === "remove" && <Badge variant="destructive" className="text-xs">سيتم إزالة جميع الصلاحيات</Badge>}
                          </div>
                        </div>
                        <Button onClick={assignRole} className="w-full bg-gradient-brand">تطبيق الصلاحية</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Role hierarchy explanation */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                      {(Object.entries(roleLabels) as [AppRole, string][]).filter(([k]) => k !== "user").map(([key, label]) => (
                        <div key={key} className="bg-accent/30 rounded-xl p-4 border border-border">
                          <p className="font-bold text-foreground text-sm mb-1">{label}</p>
                          <div className="flex flex-wrap gap-1">
                            {rolePermissions[key].slice(0, 4).map(p => (
                              <span key={p} className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{p === "all" ? "الكل" : p.replace("manage_", "")}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Current roles list */}
                    <h4 className="font-bold text-foreground">المستخدمون ذوو صلاحيات ({userRoles.length})</h4>
                    {userRoles.length === 0 ? <p className="text-muted-foreground text-sm py-4 text-center">لا توجد صلاحيات معينة بعد</p> : (
                      <div className="space-y-2">
                        {userRoles.map((ur: any) => {
                          const prof = getProfileByUserId(ur.user_id);
                          return (
                            <div key={ur.id} className="flex items-center justify-between border border-border rounded-xl p-3">
                              <div>
                                <p className="font-bold text-foreground text-sm">{prof?.full_name || "مستخدم"}</p>
                                <p className="text-xs text-muted-foreground">{prof?.email}</p>
                              </div>
                              <Badge className="bg-primary/10 text-primary">{roleLabels[ur.role as AppRole] || ur.role}</Badge>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Chat Tab */}
            <TabsContent value="chat">
              <Card>
                <CardHeader><CardTitle>المراسلات ({chatSenders.length} محادثة)</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border border-border rounded-xl overflow-hidden">
                      <div className="p-3 bg-accent/30 border-b border-border font-bold text-sm">المحادثات</div>
                      {chatSenders.length === 0 ? <p className="p-4 text-sm text-muted-foreground text-center">لا توجد محادثات</p> : (
                        <div className="max-h-[400px] overflow-y-auto">
                          {chatSenders.map(uid => {
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
                      )}
                    </div>
                    <div className="md:col-span-2 border border-border rounded-xl overflow-hidden">
                      {selectedChat ? (
                        <>
                          <div className="p-3 bg-accent/30 border-b border-border font-bold text-sm">{getProfileByUserId(selectedChat)?.full_name || "مستخدم"}</div>
                          <div className="h-[350px] overflow-y-auto p-4 space-y-3">
                            {getChatForUser(selectedChat).map((msg: any) => (
                              <div key={msg.id} className={`flex ${msg.is_admin ? "justify-start" : "justify-end"}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.is_admin ? "bg-primary text-primary-foreground rounded-tl-none" : "bg-muted text-foreground rounded-tr-none"}`}>
                                  {msg.message}
                                  <p className={`text-[10px] mt-1 ${msg.is_admin ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
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
                        <div className="h-[400px] flex items-center justify-center text-muted-foreground"><p>اختر محادثة لعرضها</p></div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Donations Tab */}
            <TabsContent value="donations">
              <Card>
                <CardHeader><CardTitle>التبرعات ({donations.length})</CardTitle></CardHeader>
                <CardContent>
                  {donations.length === 0 ? <p className="text-center py-10 text-muted-foreground">لا توجد تبرعات</p> : (
                    <div className="space-y-3">
                      {donations.map((d: any) => (
                        <div key={d.id} className="border border-border rounded-xl p-4 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold text-foreground">{d.donor_name || "متبرع مجهول"}</p>
                              <p className="text-sm text-primary font-medium">{d.donation_type === "time" ? "⏰ وقت وتطوع" : d.donation_type === "clothes" ? "👕 ملابس" : d.donation_type === "books" ? "📚 كتب" : d.donation_type === "electronics" ? "💻 أجهزة" : d.donation_type === "supplies" ? "🎒 مستلزمات" : "🎁 أخرى"}</p>
                            </div>
                            <Badge className={d.status === "confirmed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>{d.status === "confirmed" ? "مؤكد" : "قيد المراجعة"}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{d.description}</p>
                          {d.quantity && <p className="text-xs text-muted-foreground">الكمية: {d.quantity}</p>}
                          {d.availability && <p className="text-xs text-muted-foreground">التوفر: {d.availability}</p>}
                          <p className="text-xs text-muted-foreground">{d.phone && `📞 ${d.phone} • `}{new Date(d.created_at).toLocaleDateString("ar-EG")}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Surveys Tab */}
            <TabsContent value="surveys">
              <Card>
                <CardHeader>
                  <CardTitle>نتائج الاستبيانات ({surveys.length} مشاركة)</CardTitle>
                  <CardDescription>مؤشر الأمان الحالي: {safetyIndex}%</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-accent rounded-xl"><p className="text-3xl font-bold text-primary">{safetyIndex}%</p><p className="text-sm text-muted-foreground mt-1">يشعرون بالأمان</p></div>
                    <div className="text-center p-6 bg-accent rounded-xl"><p className="text-3xl font-bold text-primary">{surveys.length > 0 ? Math.round((surveys.filter((s: any) => s.knows_rights).length / surveys.length) * 100) : 0}%</p><p className="text-sm text-muted-foreground mt-1">يعرفون حقوقهم</p></div>
                    <div className="text-center p-6 bg-accent rounded-xl"><p className="text-3xl font-bold text-secondary">{surveys.length > 0 ? Math.round((surveys.filter((s: any) => s.harassed).length / surveys.length) * 100) : 0}%</p><p className="text-sm text-muted-foreground mt-1">تعرضوا لمضايقات</p></div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Forum Tab */}
            <TabsContent value="forum">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>إدارة المنتدى ({forumPosts.length} منشور)</CardTitle>
                  <Dialog open={forumPostDialog} onOpenChange={setForumPostDialog}>
                    <DialogTrigger asChild><Button size="sm"><Plus className="ml-1 h-4 w-4" /> نشر باسم الوحدة</Button></DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader><DialogTitle className="flex items-center gap-2"><MessageSquare className="h-4 w-4 text-primary" /> نشر منشور باسم الوحدة</DialogTitle></DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="space-y-2"><Label>العنوان *</Label><Input value={forumForm.title} onChange={e => setForumForm({ ...forumForm, title: e.target.value })} placeholder="عنوان المنشور" /></div>
                        <div className="space-y-2"><Label>المحتوى *</Label><Textarea value={forumForm.content} onChange={e => setForumForm({ ...forumForm, content: e.target.value })} className="min-h-[120px]" placeholder="اكتب محتوى المنشور..." /></div>
                        <div className="space-y-2"><Label>التصنيف</Label>
                          <Select value={forumForm.category} onValueChange={v => setForumForm({ ...forumForm, category: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">عام</SelectItem>
                              <SelectItem value="awareness">توعية</SelectItem>
                              <SelectItem value="rights">حقوق</SelectItem>
                              <SelectItem value="experience">تجارب</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button onClick={addForumPostAsUnit} className="w-full bg-gradient-brand">نشر المنشور</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {forumPosts.length === 0 ? <p className="text-center py-10 text-muted-foreground">لا توجد منشورات</p> : (
                    <div className="space-y-3">
                      {forumPosts.map((p: any) => {
                        const prof = profiles.find((pr: any) => pr.user_id === p.user_id);
                        return (
                          <div key={p.id} className="border border-border rounded-xl p-4 flex justify-between items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="secondary" className="text-xs">{p.category || "عام"}</Badge>
                                <span className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString("ar-EG")}</span>
                              </div>
                              <p className="font-bold text-foreground text-sm">{p.title}</p>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.content}</p>
                              <p className="text-xs text-muted-foreground mt-1">بواسطة: {prof?.full_name || "مستخدم"} • ❤️ {p.likes_count || 0} • 💬 {p.comments_count || 0}</p>
                            </div>
                            <Button size="icon" variant="ghost" className="text-destructive shrink-0" onClick={() => deleteForumPost(p.id)}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default Dashboard;
