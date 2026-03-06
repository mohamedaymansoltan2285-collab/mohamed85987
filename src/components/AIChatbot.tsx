import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Maximize2, Minimize2, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import chatAvatar from "@/assets/chat-avatar.png";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;

const AIChatbot = () => {
  const [open, setOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  // Speech recognition setup
  const toggleVoice = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = "ar-EG";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.onresult = (e: any) => {
      const transcript = Array.from(e.results).map((r: any) => r[0].transcript).join("");
      setInput(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Msg = { role: "user", content: text };
    const allMsgs = [...messages, userMsg];
    setMessages(allMsgs);
    setInput("");
    setLoading(true);

    let assistantSoFar = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: allMsgs }),
      });

      if (!resp.ok || !resp.body) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(errorData.error || "فشل الاتصال");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantSoFar += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
                }
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (e: any) {
      setMessages(prev => [...prev, { role: "assistant", content: `⚠️ ${e.message || "حدث خطأ، حاول مرة أخرى"}` }]);
    }
    setLoading(false);
  };

  const chatWindowClass = fullscreen
    ? "fixed inset-0 z-50 bg-card flex flex-col"
    : "fixed bottom-36 md:bottom-24 left-4 md:left-6 z-50 w-[calc(100%-2rem)] max-w-sm bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col";

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!fullscreen && (
          <motion.button
            onClick={() => setOpen(!open)}
            className="fixed bottom-20 md:bottom-6 left-4 md:left-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform overflow-hidden border-2 border-primary/30"
            whileTap={{ scale: 0.9 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            {open ? (
              <div className="w-full h-full bg-gradient-brand flex items-center justify-center">
                <X className="h-6 w-6 text-white" />
              </div>
            ) : (
              <img src={chatAvatar} alt="مساعد ذكي" className="w-full h-full object-cover" />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: fullscreen ? 0 : 20, scale: fullscreen ? 1 : 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: fullscreen ? 0 : 20, scale: fullscreen ? 1 : 0.9 }}
            transition={{ type: "spring", damping: 25 }}
            className={chatWindowClass}
            style={fullscreen ? {} : { maxHeight: "70vh" }}
          >
            {/* Header */}
            <div className="bg-gradient-brand p-4 text-white flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30 shrink-0">
                <img src={chatAvatar} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm">صديقك الذكي</h3>
                <p className="text-white/70 text-xs">اسألني عن أي شيء 🤝</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setFullscreen(!fullscreen)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                  {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </button>
                <button onClick={() => { setOpen(false); setFullscreen(false); }} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className={`flex-1 overflow-y-auto p-4 space-y-3 ${fullscreen ? "" : "min-h-[200px] max-h-[50vh]"}`}>
              {messages.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <img src={chatAvatar} alt="" className="w-16 h-16 mx-auto mb-3 rounded-full opacity-60" />
                  <p className="text-sm font-bold mb-1">مرحبًا! أنا صديقك الذكي 👋</p>
                  <p className="text-xs text-muted-foreground mb-3">كيف يمكنني مساعدتك اليوم؟</p>
                  <div className="space-y-1.5 max-w-xs mx-auto">
                    {["ما هي خدمات الوحدة؟", "كيف أقدم بلاغ سري؟", "ما هي حقوقي؟"].map(q => (
                      <button key={q} onClick={() => { setInput(q); }} className="block w-full text-xs bg-accent hover:bg-accent/80 text-foreground rounded-lg px-3 py-2 transition-colors">
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-2`}>
                  {msg.role === "assistant" && (
                    <img src={chatAvatar} alt="" className="w-7 h-7 rounded-full shrink-0 mt-1" />
                  )}
                  <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-br-md" : "bg-muted text-foreground rounded-bl-md"}`}>
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm max-w-none dark:prose-invert [&>p]:mb-1 [&>p]:last:mb-0">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : msg.content}
                  </div>
                </div>
              ))}
              {loading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex justify-start gap-2">
                  <img src={chatAvatar} alt="" className="w-7 h-7 rounded-full shrink-0 mt-1" />
                  <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      <motion.div className="w-2 h-2 bg-muted-foreground/40 rounded-full" animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                      <motion.div className="w-2 h-2 bg-muted-foreground/40 rounded-full" animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                      <motion.div className="w-2 h-2 bg-muted-foreground/40 rounded-full" animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border flex gap-2 shrink-0">
              <button
                onClick={toggleVoice}
                className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center transition-colors ${listening ? "bg-red-500 text-white animate-pulse" : "bg-muted text-muted-foreground hover:bg-accent"}`}
              >
                {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="اكتب أو تحدث..."
                className="flex-1 h-10 text-sm"
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                disabled={loading}
              />
              <Button size="icon" onClick={sendMessage} disabled={loading || !input.trim()} className="bg-gradient-brand h-10 w-10 shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;
