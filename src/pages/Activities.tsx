import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const typeLabels: Record<string, string> = {
  seminar: "ندوة", workshop: "ورشة عمل", campaign: "حملة توعوية", training: "تدريب", conference: "مؤتمر", other: "أخرى",
};

const statusLabels: Record<string, string> = { upcoming: "قادم", ongoing: "جاري", completed: "منتهي", cancelled: "ملغي" };
const statusColors: Record<string, string> = { upcoming: "bg-blue-100 text-blue-800", ongoing: "bg-green-100 text-green-800", completed: "bg-gray-100 text-gray-800", cancelled: "bg-red-100 text-red-800" };

const Activities = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("activities").select("*").order("created_at", { ascending: false });
      setActivities(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = filter === "all" ? activities : activities.filter(a => a.type === filter);
  const types = [...new Set(activities.map(a => a.type).filter(Boolean))];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">الأنشطة والفعاليات</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          نحرص على تنظيم ندوات وورش عمل وحملات توعوية بشكل دوري لرفع الوعي وبناء بيئة جامعية آمنة.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-10">
        <Button variant={filter === "all" ? "default" : "outline"} className="rounded-full" onClick={() => setFilter("all")}>الكل</Button>
        {types.map((t) => (
          <Button key={t} variant={filter === t ? "default" : "outline"} className="rounded-full" onClick={() => setFilter(t)}>
            {typeLabels[t] || t}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3].map(i => <div key={i} className="bg-card rounded-2xl h-80 animate-pulse border border-border" />)}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center py-20 text-muted-foreground">لا توجد أنشطة حالياً. يتم إضافة الأنشطة من لوحة التحكم.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((activity) => (
            <Link key={activity.id} to={`/activity/${activity.id}`} className="group">
              <div className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-border flex flex-col h-full">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={activity.image_url || "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80"}
                    alt={activity.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute top-4 right-4 flex gap-2">
                    {activity.type && (
                      <Badge className="bg-card/90 backdrop-blur-sm text-primary text-xs">{typeLabels[activity.type] || activity.type}</Badge>
                    )}
                    {activity.status && (
                      <Badge className={`${statusColors[activity.status] || ""} text-xs`}>{statusLabels[activity.status] || activity.status}</Badge>
                    )}
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{activity.title}</h3>
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    {activity.date && (
                      <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-secondary" /><span>{new Date(activity.date).toLocaleDateString("ar-EG")}</span></div>
                    )}
                    {activity.location && (
                      <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-secondary" /><span>{activity.location}</span></div>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-grow">{activity.description}</p>
                  <div className="flex items-center text-primary font-bold text-sm gap-1 group-hover:gap-2 transition-all">
                    عرض التفاصيل <ArrowLeft className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Activities;
