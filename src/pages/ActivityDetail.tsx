import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Phone, ArrowRight, Target, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const typeLabels: Record<string, string> = {
  seminar: "ندوة",
  workshop: "ورشة عمل",
  campaign: "حملة توعوية",
  training: "تدريب",
  conference: "مؤتمر",
  other: "أخرى",
};

const statusLabels: Record<string, string> = {
  upcoming: "قادم",
  ongoing: "جاري",
  completed: "منتهي",
  cancelled: "ملغي",
};

const statusColors: Record<string, string> = {
  upcoming: "bg-blue-100 text-blue-800",
  ongoing: "bg-green-100 text-green-800",
  completed: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
};

const ActivityDetail = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      const { data } = await supabase.from("activities").select("*").eq("id", id).single();
      setActivity(data);
      setLoading(false);
    };
    if (id) fetchActivity();
  }, [id]);

  if (loading) return <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">جاري التحميل...</div>;
  if (!activity) return <div className="container mx-auto px-4 py-20 text-center"><h2 className="text-2xl font-bold text-foreground mb-4">لم يتم العثور على النشاط</h2><Link to="/activities"><Button>العودة للأنشطة</Button></Link></div>;

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent z-10" />
        <img
          src={activity.image_url || "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80"}
          alt={activity.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-12">
          <div className="container mx-auto">
            <Link to="/activities" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4 gap-1">
              <ArrowRight className="h-4 w-4" /> العودة للأنشطة
            </Link>
            <div className="flex flex-wrap gap-2 mb-3">
              {activity.type && <Badge className="bg-primary/90 text-primary-foreground">{typeLabels[activity.type] || activity.type}</Badge>}
              {activity.status && <Badge className={statusColors[activity.status] || ""}>{statusLabels[activity.status] || activity.status}</Badge>}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">{activity.title}</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">عن النشاط</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-lg">{activity.description}</p>
            </div>
            {activity.notes && (
              <div className="bg-accent/50 rounded-2xl p-6 border border-primary/10">
                <h3 className="font-bold text-foreground mb-2">ملاحظات إضافية</h3>
                <p className="text-muted-foreground whitespace-pre-line">{activity.notes}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm space-y-5">
              <h3 className="text-lg font-bold text-foreground border-b border-border pb-3">تفاصيل النشاط</h3>
              {activity.date && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-primary"><Calendar className="h-5 w-5" /></div>
                  <div><p className="text-xs text-muted-foreground">التاريخ</p><p className="font-medium text-foreground">{new Date(activity.date).toLocaleDateString("ar-EG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p><p className="text-xs text-muted-foreground">{new Date(activity.date).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}</p></div>
                </div>
              )}
              {activity.location && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-primary"><MapPin className="h-5 w-5" /></div>
                  <div><p className="text-xs text-muted-foreground">المكان</p><p className="font-medium text-foreground">{activity.location}</p></div>
                </div>
              )}
              {activity.organizer && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-primary"><Building2 className="h-5 w-5" /></div>
                  <div><p className="text-xs text-muted-foreground">الجهة المنظمة</p><p className="font-medium text-foreground">{activity.organizer}</p></div>
                </div>
              )}
              {activity.target_audience && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-primary"><Target className="h-5 w-5" /></div>
                  <div><p className="text-xs text-muted-foreground">الفئة المستهدفة</p><p className="font-medium text-foreground">{activity.target_audience}</p></div>
                </div>
              )}
              {activity.max_attendees && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-primary"><Users className="h-5 w-5" /></div>
                  <div><p className="text-xs text-muted-foreground">الحد الأقصى للحضور</p><p className="font-medium text-foreground">{activity.max_attendees} شخص</p></div>
                </div>
              )}
              {activity.contact_info && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-primary"><Phone className="h-5 w-5" /></div>
                  <div><p className="text-xs text-muted-foreground">التواصل</p><p className="font-medium text-foreground">{activity.contact_info}</p></div>
                </div>
              )}
            </div>

            <Link to="/volunteer">
              <Button className="w-full bg-gradient-brand" size="lg">تطوع معنا في الأنشطة القادمة</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetail;
