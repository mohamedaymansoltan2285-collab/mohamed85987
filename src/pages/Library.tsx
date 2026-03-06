import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, ThumbsUp, Smile, Download, ChevronDown, ChevronUp, BookOpen, FileText, Video, BarChart3, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

const getSessionId = () => {
  let id = sessionStorage.getItem("session_id");
  if (!id) { id = crypto.randomUUID(); sessionStorage.setItem("session_id", id); }
  return id;
};

const reactionIcons: Record<string, { icon: any; label: string; color: string }> = {
  like: { icon: ThumbsUp, label: "إعجاب", color: "text-blue-500" },
  love: { icon: Heart, label: "أحببته", color: "text-red-500" },
  smile: { icon: Smile, label: "مفيد", color: "text-yellow-500" },
};

const typeIcons: Record<string, { icon: any; color: string; bg: string }> = {
  article: { icon: BookOpen, color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/30" },
  pdf: { icon: FileText, color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/30" },
  video: { icon: Video, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30" },
  infographic: { icon: BarChart3, color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/30" },
};

const Library = () => {
  const [items, setItems] = useState<any[]>([]);
  const [reactions, setReactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);
  const sessionId = getSessionId();

  const fetchData = async () => {
    const [itemsRes, reactionsRes] = await Promise.all([
      supabase.from("library_content").select("*").order("created_at", { ascending: false }),
      supabase.from("content_reactions").select("*"),
    ]);
    setItems(itemsRes.data || []);
    setReactions(reactionsRes.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const toggleReaction = async (contentId: string, type: string) => {
    const existing = reactions.find(r => r.content_id === contentId && r.reaction_type === type && r.session_id === sessionId);
    if (existing) {
      await supabase.from("content_reactions").delete().eq("id", existing.id);
    } else {
      await supabase.from("content_reactions").insert({ content_id: contentId, reaction_type: type, session_id: sessionId, content_type: "library" } as any);
    }
    fetchData();
  };

  const getReactionCount = (contentId: string, type: string) => reactions.filter(r => r.content_id === contentId && r.reaction_type === type).length;
  const hasReacted = (contentId: string, type: string) => reactions.some(r => r.content_id === contentId && r.reaction_type === type && r.session_id === sessionId);

  const filtered = items.filter(i => {
    if (filter !== "all" && i.type !== filter) return false;
    if (search && !i.title.includes(search) && !(i.description || "").includes(search)) return false;
    return true;
  });

  const counts = { all: items.length, article: items.filter(i => i.type === "article").length, pdf: items.filter(i => i.type === "pdf").length, video: items.filter(i => i.type === "video").length, infographic: items.filter(i => i.type === "infographic").length };

  const ReactionButtons = ({ itemId }: { itemId: string }) => (
    <div className="flex gap-1 mt-3">
      {Object.entries(reactionIcons).map(([key, { icon: Icon, color }]) => {
        const count = getReactionCount(itemId, key);
        const reacted = hasReacted(itemId, key);
        return (
          <button key={key} onClick={(e) => { e.stopPropagation(); toggleReaction(itemId, key); }} className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs transition-all ${reacted ? "bg-accent border border-primary/30 font-bold" : "bg-muted hover:bg-accent border border-transparent"}`}>
            <Icon className={`h-3.5 w-3.5 ${reacted ? color : "text-muted-foreground"}`} />
            {count > 0 && <span className={reacted ? color : "text-muted-foreground"}>{count}</span>}
          </button>
        );
      })}
    </div>
  );

  if (loading) return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-12">
        <Skeleton className="h-10 w-64 mx-auto mb-4" />
        <Skeleton className="h-5 w-96 mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <div className="p-5 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold mb-3">
          <BookOpen className="h-4 w-4" /> المكتبة التوعوية
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">مصدرك الموثوق للمعرفة</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">مقالات، فيديوهات، ملفات PDF، وإنفوجرافيك حول حقوقك والأمان الرقمي والصحة النفسية.</p>
      </motion.div>

      {/* Search + Filters */}
      <div className="mb-8 space-y-4">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="ابحث في المكتبة..." className="pr-10 h-11 rounded-xl" />
        </div>
        <div className="flex gap-2 flex-wrap justify-center">
          {([
            { key: "all", label: "الكل", icon: BookOpen },
            { key: "article", label: "مقالات", icon: BookOpen },
            { key: "pdf", label: "ملفات PDF", icon: FileText },
            { key: "video", label: "فيديوهات", icon: Video },
            { key: "infographic", label: "إنفوجرافيك", icon: BarChart3 },
          ] as const).map(f => (
            <Button
              key={f.key}
              size="sm"
              variant={filter === f.key ? "default" : "outline"}
              onClick={() => setFilter(f.key)}
              className="rounded-full text-xs h-9 gap-1"
            >
              <f.icon className="h-3.5 w-3.5" />
              {f.label} ({counts[f.key]})
            </Button>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>لا يوجد محتوى مطابق</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => {
              const typeInfo = typeIcons[item.type] || typeIcons.article;
              const TypeIcon = typeInfo.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  layout
                  className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all group"
                >
                  {/* Media/Thumbnail */}
                  {item.type === "video" && item.url ? (
                    <div className="aspect-video bg-muted relative">
                      <video src={item.url} controls className="w-full h-full object-cover" preload="metadata" />
                      {item.duration && <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">{item.duration}</span>}
                    </div>
                  ) : item.type === "infographic" && item.url ? (
                    <img src={item.url} alt={item.title} className="w-full aspect-[4/3] object-cover" />
                  ) : (
                    <div className={`h-3 ${item.type === "article" ? "bg-gradient-to-r from-purple-500 to-pink-500" : item.type === "pdf" ? "bg-gradient-to-r from-red-500 to-orange-500" : "bg-gradient-to-r from-blue-500 to-cyan-500"}`} />
                  )}

                  <div className="p-5">
                    <div className="flex items-start gap-3">
                      <div className={`${typeInfo.bg} p-2.5 rounded-xl shrink-0 group-hover:scale-110 transition-transform`}>
                        <TypeIcon className={`h-5 w-5 ${typeInfo.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-foreground text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors">{item.title}</h3>
                        <div className="flex gap-2 text-[10px] text-muted-foreground">
                          {item.category && <span className="bg-muted px-2 py-0.5 rounded">{item.category}</span>}
                          {item.read_time && <span>{item.read_time}</span>}
                          <span>{new Date(item.created_at).toLocaleDateString("ar-EG")}</span>
                        </div>
                      </div>
                    </div>

                    {item.description && <p className="text-xs text-muted-foreground mt-3 line-clamp-2">{item.description}</p>}

                    {/* Article content expand */}
                    {item.type === "article" && item.content && (
                      <div className="mt-3">
                        <button onClick={() => setExpandedArticle(expandedArticle === item.id ? null : item.id)} className="flex items-center gap-1 text-xs text-primary font-bold hover:underline">
                          {expandedArticle === item.id ? "إخفاء" : "قراءة المقال"}
                          {expandedArticle === item.id ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        </button>
                        <AnimatePresence>
                          {expandedArticle === item.id && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                              <div className="mt-2 p-3 bg-muted/30 rounded-xl border border-border">
                                <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">{item.content}</p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* PDF download */}
                    {item.type === "pdf" && item.url && (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-3">
                        <Button size="sm" variant="outline" className="text-xs h-8 gap-1">
                          <Download className="h-3.5 w-3.5" /> تحميل PDF
                        </Button>
                      </a>
                    )}

                    <ReactionButtons itemId={item.id} />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Library;
