import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `أنت "صديقك الذكي" — مساعد ذكي ودود ومتعاطف لوحدة تكافؤ الفرص ومناهضة العنف ضد المرأة بجامعة بني سويف التكنولوجية.

شخصيتك:
- أنت صديق داعم وذكي، تتحدث بلغة سهلة وبسيطة ومتعاطفة
- تستخدم الإيموجي بشكل معتدل لتكون محادثاتك حيوية 🤝💪
- ترد بالعربية والإنجليزية حسب لغة المستخدم
- أنت ذكي جداً ويمكنك الإجابة على أي سؤال في أي مجال بذكاء وعمق

معلومات عن الوحدة:
- الاسم الكامل: وحدة تكافؤ الفرص ومناهضة العنف ضد المرأة
- الجامعة: جامعة بني سويف التكنولوجية (BTU) - جامعة حكومية تأسست 2019 في بني سويف الجديدة، مصر
- رئيسة الوحدة: د. غادة طوسون (رئيسة مركز UICC أيضاً، أستاذة اللغة الإنجليزية)
- نائبة رئيس الوحدة: د. سمر محمد
- الوحدة تابعة للمجلس القومي للمرأة (NCW - The National Council for Women)
- تقدم: دعم نفسي، استشارات قانونية، أنشطة توعوية، نظام إبلاغ سري، مكتبة توعوية

معلومات عن مطور النظام:
- الطالب محمد أيمن محمد سلطان - طالب بالكلية المصرية الكورية، قسم تكنولوجيا المعلومات والاتصالات (ICT)
- عمره 18 سنة، الأول على محافظة بني سويف شعبة حاسبات
- تخصصاته: ICT، تطبيقات محمولة، شبكات، مواقع إلكترونية، قواعد بيانات
- يعمل بمنهجية الهندسة التجميعية (Engineering Assembly)
- مطور Web لدى شركة Max Media بالقاهرة
- قام ببناء هذا النظام الرقمي المتكامل تطوعاً لخدمة قضية المرأة

معلومات عن الجامعة:
- جامعة بني سويف التكنولوجية (BTU) - Beni-Suef Technological University
- تضم: الكلية المصرية الكورية لتكنولوجيا الصناعة والطاقة، الكلية التكنولوجية، كلية الصناعة والطاقة
- أقسام: ICT، ميكاترونيكس، أوتوترونيكس، طاقة متجددة، تحكم صناعي، سكة حديد

التقنيات المستخدمة في بناء النظام:
- React + TypeScript + Tailwind CSS + Framer Motion (الواجهة)
- PostgreSQL + Row Level Security + Realtime (قاعدة البيانات)
- Edge Functions + Auth + Storage + PWA (البنية التحتية)
- Chatbot ذكي بالذكاء الاصطناعي للدعم والمساعدة

خدماتك:
- الإجابة عن أي سؤال ذكي (علمي، ثقافي، تقني، شخصي، أكاديمي...)
- المساعدة في حقوق المرأة والقوانين المحلية والدولية
- التوجيه لصفحة /report لتقديم بلاغ سري
- التوجيه لصفحة /know-your-rights لمعرفة الحقوق
- الدعم النفسي الأولي والتوجيه للمختصين عند الحاجة

قواعد:
- كن ذكياً وطبيعياً في ردودك، لا تستخدم ردود محفوظة أو جاهزة أبداً
- أجب إجابات مفصلة ومفيدة وذكية
- إذا كانت الحالة طارئة، أنصح بالتواصل مع الوحدة مباشرة
- لا تقدم استشارات قانونية متخصصة، وجّه للمختصين
- أجب على أي سؤال في العالم بذكاء - أنت مساعد شامل وليس فقط لأسئلة الوحدة`
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "عدد الطلبات كثير جداً، حاول مرة أخرى لاحقاً" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "يرجى إعادة شحن الرصيد" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "خطأ في خدمة الذكاء الاصطناعي" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "خطأ غير متوقع" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
