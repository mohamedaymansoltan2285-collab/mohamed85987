import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// Label removed - using inline labels
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Heart, Send, Plus, Clock, User, ChevronDown, ChevronUp, Trash2, Share2, Sparkles, HelpCircle, Lightbulb, BookOpen, Shield as ShieldIcon, MessageCircle, Image as ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { ScrollReveal } from "@/hooks/useScrollAnimation";
import { Skeleton } from "@/components/ui/skeleton";

const categoryLabels: Record<string, string> = {
  general: "عام", awareness: "توعية", rights: "حقوق",
  experience: "تجارب", question: "سؤال", suggestion: "اقتراح",
};

const categoryIcons: Record<string, any> = {
  general: MessageSquare, awareness: Lightbulb, rights: ShieldIcon,
  experience: BookOpen, question: HelpCircle, suggestion: Sparkles,
};

const categoryColors: Record<string, string> = {
  general: "bg-muted text-muted-foreground",
  awareness: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  rights: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  experience: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  question: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  suggestion: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
};

const categoryFields: Record<string, { label: string; placeholder: string; field: string }[]> = {
  question: [
    { label: "تفاصيل السؤال", placeholder: "اشرح سؤالك بالتفصيل...", field: "content" },
    { label: "ما الذي جربته؟", placeholder: "هل حاولت إيجاد الإجابة؟", field: "extra_context" },
  ],
  awareness: [
    { label: "محتوى التوعية", placeholder: "اكتب المحتوى التوعوي...", field: "content" },
    { label: "المصدر (اختياري)", placeholder: "مصدر المعلومة", field: "extra_context" },
  ],
  experience: [
    { label: "تجربتك", placeholder: "شاركنا تجربتك...", field: "content" },
    { label: "الدروس المستفادة", placeholder: "ما تعلمته من التجربة", field: "extra_context" },
  ],
  suggestion: [
    { label: "الاقتراح", placeholder: "اكتب اقتراحك...", field: "content" },
    { label: "الفائدة المتوقعة", placeholder: "كيف سيستفيد المجتمع؟", field: "extra_context" },
  ],
};

const reactions = [
  { type: "like", emoji: "👍", label: "إعجاب" },
  { type: "love", emoji: "❤️", label: "أحببته" },
  { type: "sad", emoji: "😢", label: "حزين" },
  { type: "happy", emoji: "😊", label: "سعيد" },
  { type: "angry", emoji: "😡", label: "أغضبني" },
  { type: "dislike", emoji: "👎", label: "لم يعجبني" },
];

const Forum = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  const [likes, setLikes] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostDialog, setNewPostDialog] = useState(false);
  const [postForm, setPostForm] = useState({ title: "", content: "", category: "general", extra_context: "" });
  const [postImages, setPostImages] = useState<File[]>([]);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState("all");
  const [reactionPickerPost, setReactionPickerPost] = useState<string | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    const [postsRes, likesRes, commentsRes, profilesRes] = await Promise.all([
      supabase.from("forum_posts").select("*").order("created_at", { ascending: false }),
      supabase.from("forum_likes").select("*"),
      supabase.from("forum_comments").select("*").order("created_at", { ascending: true }),
      supabase.from("profiles").select("user_id, full_name, avatar_url"),
    ]);
    setPosts((postsRes.data as any[]) || []);
    setLikes((likesRes.data as any[]) || []);
    setComments((commentsRes.data as any[]) || []);
    const pMap: Record<string, any> = {};
    (profilesRes.data || []).forEach((p: any) => { pMap[p.user_id] = p; });
    setProfiles(pMap);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const createPost = async () => {
    if (!user) { toast.error("يجب تسجيل الدخول أولاً"); return; }
    if (!postForm.title || !postForm.content) { toast.error("يرجى ملء العنوان والمحتوى"); return; }
    setSubmitting(true);
    
    // Upload multiple images
    const uploadedUrls: string[] = [];
    for (const img of postImages.slice(0, 6)) {
      const fileName = `forum/${Date.now()}-${Math.random().toString(36).slice(2)}-${img.name}`;
      const { data, error } = await supabase.storage.from("activity-images").upload(fileName, img);
      if (!error && data) {
        const { data: urlData } = supabase.storage.from("activity-images").getPublicUrl(data.path);
        uploadedUrls.push(urlData.publicUrl);
      }
    }

    const image_url = uploadedUrls.length > 0 ? uploadedUrls.join("|||") : null;
    const fullContent = postForm.extra_context ? `${postForm.content}\n\n---\n${postForm.extra_context}` : postForm.content;
    const { error } = await supabase.from("forum_posts").insert({
      user_id: user.id, title: postForm.title, content: fullContent,
      category: postForm.category, image_url,
    } as any);
    if (error) { toast.error("خطأ في النشر"); console.error(error); }
    else {
      toast.success("تم نشر المنشور بنجاح!");
      setNewPostDialog(false);
      setPostForm({ title: "", content: "", category: "general", extra_context: "" });
      setPostImages([]);
      fetchData();
    }
    setSubmitting(false);
  };

  const toggleLike = async (postId: string) => {
    if (!user) { toast.error("يجب تسجيل الدخول أولاً"); return; }
    const existing = likes.find(l => l.post_id === postId && l.user_id === user.id);
    if (existing) { await supabase.from("forum_likes").delete().eq("id", existing.id); }
    else { await supabase.from("forum_likes").insert({ post_id: postId, user_id: user.id } as any); }
    fetchData();
  };

  const addComment = async (postId: string) => {
    if (!user) { toast.error("يجب تسجيل الدخول أولاً"); return; }
    const text = commentText[postId]?.trim();
    if (!text) return;
    const { error } = await supabase.from("forum_comments").insert({ post_id: postId, user_id: user.id, content: text } as any);
    if (error) { toast.error("خطأ في إضافة التعليق"); }
    else { setCommentText({ ...commentText, [postId]: "" }); fetchData(); }
  };

  const deletePost = async (postId: string) => { await supabase.from("forum_posts").delete().eq("id", postId); fetchData(); toast.success("تم حذف المنشور"); };
  const deleteComment = async (commentId: string) => { await supabase.from("forum_comments").delete().eq("id", commentId); fetchData(); };
  const sharePost = (postId: string) => { navigator.clipboard.writeText(`${window.location.origin}/forum#${postId}`); toast.success("تم نسخ رابط المنشور"); };

  const handleLongPressStart = (postId: string) => {
    longPressTimer.current = setTimeout(() => setReactionPickerPost(postId), 250);
  };
  const handleLongPressEnd = () => { if (longPressTimer.current) clearTimeout(longPressTimer.current); };

  const filteredPosts = filter === "all" ? posts : posts.filter(p => p.category === filter);
  const getPostComments = (postId: string) => comments.filter(c => c.post_id === postId);
  const hasLiked = (postId: string) => user ? likes.some(l => l.post_id === postId && l.user_id === user.id) : false;
  const getLikeCount = (postId: string) => likes.filter(l => l.post_id === postId).length;
  const getProfileName = (userId: string) => profiles[userId]?.full_name || "مستخدم";
  const getProfileAvatar = (userId: string) => profiles[userId]?.avatar_url;

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "الآن";
    if (mins < 60) return `منذ ${mins} دقيقة`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;
    return `منذ ${Math.floor(hours / 24)} يوم`;
  };

  const isQuestion = (category: string) => category === "question";
  const getCommentLabel = (category: string) => isQuestion(category) ? "إجابة" : "تعليق";

  const getFormFields = () => {
    const fields = categoryFields[postForm.category];
    if (fields) return fields;
    return [{ label: "المحتوى *", placeholder: "اكتب ما تريد مشاركته...", field: "content" }];
  };

  if (loading) return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>
      <div className="flex gap-2 mb-6">
        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-8 w-16 rounded-full" />)}
      </div>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border p-5 space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-1.5 flex-1"><Skeleton className="h-4 w-24" /><Skeleton className="h-3 w-16" /></div>
            </div>
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-brand rounded-xl flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            المنتدى
          </h1>
          <p className="text-sm text-muted-foreground mt-1">شارك أفكارك وتجاربك مع مجتمع الجامعة</p>
        </div>
        {user ? (
          <Dialog open={newPostDialog} onOpenChange={setNewPostDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-brand font-bold"><Plus className="ml-1 h-4 w-4" /> منشور جديد</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader><DialogTitle className="flex items-center gap-2 text-base"><Sparkles className="h-4 w-4 text-primary" /> منشور جديد</DialogTitle></DialogHeader>
              <div className="space-y-3 mt-2">
                {/* Category */}
                <div className="grid grid-cols-3 gap-1.5">
                  {Object.entries(categoryLabels).map(([k, v]) => {
                    const Icon = categoryIcons[k] || MessageSquare;
                    return (
                      <button
                        key={k}
                        onClick={() => setPostForm({ ...postForm, category: k, content: "", extra_context: "" })}
                        className={`p-2 rounded-lg border text-center transition-all text-xs ${postForm.category === k ? "border-primary bg-primary/10" : "border-border hover:border-primary/30"}`}
                      >
                        <Icon className={`h-4 w-4 mx-auto mb-0.5 ${postForm.category === k ? "text-primary" : "text-muted-foreground"}`} />
                        <span className={`font-bold ${postForm.category === k ? "text-primary" : "text-muted-foreground"}`}>{v}</span>
                      </button>
                    );
                  })}
                </div>

                <Input
                  value={postForm.title}
                  onChange={e => setPostForm({ ...postForm, title: e.target.value })}
                  placeholder={isQuestion(postForm.category) ? "ما هو سؤالك؟" : "عنوان المنشور"}
                  className="h-10 text-sm"
                />

                {getFormFields().map((field, i) => (
                  <Textarea
                    key={i}
                    value={field.field === "content" ? postForm.content : postForm.extra_context}
                    onChange={e => setPostForm({ ...postForm, [field.field === "content" ? "content" : "extra_context"]: e.target.value })}
                    className="min-h-[60px] text-sm"
                    placeholder={field.placeholder}
                  />
                ))}

                {!categoryFields[postForm.category] && (
                  <Textarea
                    value={postForm.content}
                    onChange={e => setPostForm({ ...postForm, content: e.target.value })}
                    className="min-h-[80px] text-sm"
                    placeholder="اكتب ما تريد مشاركته..."
                  />
                )}

                {/* Image upload - up to 6 */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <button onClick={() => imageRef.current?.click()} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors border border-border rounded-lg px-3 py-2">
                      <ImageIcon className="h-4 w-4" /> إضافة صور (حتى 6)
                    </button>
                    <span className="text-xs text-muted-foreground">{postImages.length}/6</span>
                    <input ref={imageRef} type="file" accept="image/*" multiple className="hidden" onChange={e => {
                      if (e.target.files) {
                        const newFiles = Array.from(e.target.files).slice(0, 6 - postImages.length);
                        setPostImages(prev => [...prev, ...newFiles].slice(0, 6));
                      }
                    }} />
                  </div>
                  {postImages.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap">
                      {postImages.map((f, i) => (
                        <div key={i} className="relative w-14 h-14 rounded-lg overflow-hidden border border-border">
                          <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                          <button onClick={() => setPostImages(prev => prev.filter((_, j) => j !== i))} className="absolute top-0 right-0 w-4 h-4 bg-destructive text-white text-[8px] flex items-center justify-center rounded-bl">✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button onClick={createPost} className="w-full bg-gradient-brand h-10 font-bold text-sm" disabled={submitting}>
                  {submitting ? (
                    <motion.div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                  ) : (
                    <span className="flex items-center gap-1"><Send className="h-4 w-4" /> {isQuestion(postForm.category) ? "نشر السؤال" : "نشر"}</span>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <Link to="/auth"><Button variant="outline" size="sm">سجل دخولك</Button></Link>
        )}
      </motion.div>

      {/* Filters */}
      <div className="flex gap-1.5 flex-wrap mb-6">
        <Button size="sm" variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")} className="rounded-full text-xs h-8">الكل</Button>
        {Object.entries(categoryLabels).map(([k, v]) => (
          <Button key={k} size="sm" variant={filter === k ? "default" : "outline"} onClick={() => setFilter(k)} className="rounded-full text-xs h-8">{v}</Button>
        ))}
      </div>

      {/* Posts */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>لا توجد منشورات بعد. كن أول من ينشر!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post, index) => {
            const postComments = getPostComments(post.id);
            const isExpanded = expandedPost === post.id;
            const PostIcon = categoryIcons[post.category] || MessageSquare;
            return (
              <ScrollReveal key={post.id} delay={index * 0.03}>
                <motion.div layout className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition-all">
                  <div className="p-5">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-3">
                      {getProfileAvatar(post.user_id) ? (
                        <img src={getProfileAvatar(post.user_id)} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-primary/10" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-foreground text-sm">{getProfileName(post.user_id)}</p>
                        <p className="text-xs text-muted-foreground"><Clock className="h-3 w-3 inline ml-1" />{timeAgo(post.created_at)}</p>
                      </div>
                      <Badge className={`rounded-full text-[10px] px-2 py-0.5 ${categoryColors[post.category] || "bg-muted"}`}>
                        <PostIcon className="h-3 w-3 ml-0.5" />{categoryLabels[post.category] || post.category}
                      </Badge>
                    </div>

                    {isQuestion(post.category) && (
                      <div className="mb-2 flex items-center gap-1 text-amber-600 dark:text-amber-400 text-xs font-bold">
                        <HelpCircle className="h-3.5 w-3.5" /> سؤال يبحث عن إجابة
                      </div>
                    )}

                    <h3 className="text-base font-bold text-foreground mb-1.5">{post.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{post.content}</p>

                    {/* Post images - responsive */}
                    {post.image_url && (() => {
                      const urls = post.image_url.split("|||").filter(Boolean);
                      if (urls.length === 1) return (
                        <div className="mt-3 rounded-xl overflow-hidden border border-border max-w-full">
                          <img src={urls[0]} alt="" className="w-full max-h-[400px] object-contain bg-muted/30" />
                        </div>
                      );
                      return (
                        <div className={`mt-3 grid gap-1.5 ${urls.length === 2 ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3"}`}>
                          {urls.slice(0, 6).map((url: string, i: number) => (
                            <div key={i} className="rounded-xl overflow-hidden border border-border aspect-square">
                              <img src={url} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" loading="lazy" />
                            </div>
                          ))}
                        </div>
                      );
                    })()}

                    {/* Actions with reaction picker */}
                    <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border relative">
                      <div
                        className="relative group/reaction"
                        onMouseEnter={() => { setReactionPickerPost(post.id); }}
                        onMouseLeave={() => { setTimeout(() => setReactionPickerPost(prev => prev === post.id ? null : prev), 100); }}
                      >
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleLike(post.id)}
                          onTouchStart={() => handleLongPressStart(post.id)}
                          onTouchEnd={handleLongPressEnd}
                          className={`flex items-center gap-1 text-sm transition-colors ${hasLiked(post.id) ? "text-red-500 font-bold" : "text-muted-foreground hover:text-red-500"}`}
                        >
                          <motion.div animate={hasLiked(post.id) ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.3 }}>
                            <Heart className={`h-5 w-5 ${hasLiked(post.id) ? "fill-red-500" : ""}`} />
                          </motion.div>
                          <span>{getLikeCount(post.id)}</span>
                        </motion.button>

                        {/* Reaction picker - hover on desktop, long press mobile */}
                        <AnimatePresence>
                          {reactionPickerPost === post.id && (
                            <motion.div
                              initial={{ opacity: 0, y: 8, scale: 0.8 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 8, scale: 0.8 }}
                              transition={{ duration: 0.15 }}
                              className="absolute bottom-full mb-2 right-0 bg-card border border-border rounded-2xl shadow-xl p-1.5 flex gap-0.5 z-20"
                              onMouseEnter={() => setReactionPickerPost(post.id)}
                              onMouseLeave={() => setReactionPickerPost(null)}
                            >
                              {reactions.map((r) => (
                                <motion.button
                                  key={r.type}
                                  whileHover={{ scale: 1.4, y: -4 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={(e) => { e.stopPropagation(); toggleLike(post.id); setReactionPickerPost(null); }}
                                  className="w-9 h-9 rounded-full hover:bg-muted flex items-center justify-center text-lg"
                                  title={r.label}
                                >
                                  {r.emoji}
                                </motion.button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <button onClick={() => setExpandedPost(isExpanded ? null : post.id)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <MessageCircle className="h-5 w-5" />
                        <span>{postComments.length} {getCommentLabel(post.category)}</span>
                        {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </button>
                      <button onClick={() => sharePost(post.id)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <Share2 className="h-4 w-4" />
                      </button>
                      {user?.id === post.user_id && (
                        <button onClick={() => deletePost(post.id)} className="text-destructive hover:text-destructive/80 mr-auto"><Trash2 className="h-4 w-4" /></button>
                      )}
                    </div>
                  </div>

                  {/* Comments */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-border bg-muted/20">
                        <div className="p-5 space-y-3">
                          {isQuestion(post.category) && (
                            <p className="text-xs text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1"><HelpCircle className="h-3.5 w-3.5" /> الإجابات ({postComments.length})</p>
                          )}
                          {postComments.length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-2">
                              {isQuestion(post.category) ? "لا توجد إجابات بعد" : "لا توجد تعليقات بعد"}
                            </p>
                          )}
                          {postComments.map(comment => (
                            <motion.div key={comment.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-2">
                              <div className="w-8 h-8 rounded-full shrink-0 overflow-hidden">
                                {getProfileAvatar(comment.user_id) ? (
                                  <img src={getProfileAvatar(comment.user_id)} alt="" className="w-8 h-8 rounded-full object-cover" />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center"><User className="h-4 w-4 text-primary" /></div>
                                )}
                              </div>
                              <div className="flex-1 bg-card p-2.5 rounded-xl border border-border">
                                <div className="flex justify-between items-center mb-0.5">
                                  <span className="text-xs font-bold text-foreground">{getProfileName(comment.user_id)}</span>
                                  <div className="flex items-center gap-1">
                                    <span className="text-[10px] text-muted-foreground">{timeAgo(comment.created_at)}</span>
                                    {user?.id === comment.user_id && (
                                      <button onClick={() => deleteComment(comment.id)} className="text-destructive hover:text-destructive/80"><Trash2 className="h-3 w-3" /></button>
                                    )}
                                  </div>
                                </div>
                                <p className="text-xs text-muted-foreground">{comment.content}</p>
                              </div>
                            </motion.div>
                          ))}
                          {user && (
                            <div className="flex gap-2 items-center">
                              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0"><User className="h-4 w-4 text-primary" /></div>
                              <Input
                                value={commentText[post.id] || ""}
                                onChange={e => setCommentText({ ...commentText, [post.id]: e.target.value })}
                                placeholder={isQuestion(post.category) ? "اكتب إجابتك..." : "أضف تعليقاً..."}
                                className="flex-1 h-9 text-sm"
                                onKeyDown={e => e.key === "Enter" && addComment(post.id)}
                              />
                              <Button size="icon" onClick={() => addComment(post.id)} className="bg-gradient-brand h-9 w-9 shrink-0"><Send className="h-3.5 w-3.5" /></Button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>
      )}

      {reactionPickerPost && (
        <div className="fixed inset-0 z-10 md:hidden" onClick={() => setReactionPickerPost(null)} />
      )}
    </div>
  );
};

export default Forum;
