import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    if (action === "fetch") {
      const [reports, volunteers, activities, library, donations, surveys, profiles, chatMessages] = await Promise.all([
        supabase.from("reports").select("*").order("created_at", { ascending: false }),
        supabase.from("volunteers").select("*").order("created_at", { ascending: false }),
        supabase.from("activities").select("*").order("created_at", { ascending: false }),
        supabase.from("library_content").select("*").order("created_at", { ascending: false }),
        supabase.from("donations").select("*").order("created_at", { ascending: false }),
        supabase.from("safety_surveys").select("*"),
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("chat_messages").select("*").order("created_at", { ascending: true }),
      ]);

      return new Response(JSON.stringify({
        reports: reports.data || [],
        volunteers: volunteers.data || [],
        activities: activities.data || [],
        library: library.data || [],
        donations: donations.data || [],
        surveys: surveys.data || [],
        profiles: profiles.data || [],
        chatMessages: chatMessages.data || [],
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "update-report-status") {
      const { id, status } = await req.json();
      const { error } = await supabase.from("reports").update({ status }).eq("id", id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "add-activity") {
      const body = await req.json();
      const { error } = await supabase.from("activities").insert(body);
      if (error) throw error;
      // Create notification
      await supabase.from("notifications").insert({
        title: "نشاط جديد: " + body.title,
        message: body.description?.substring(0, 100) || "تم إضافة نشاط جديد",
        type: "activity",
        link: "/activities",
      });
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "delete-activity") {
      const { id } = await req.json();
      const { error } = await supabase.from("activities").delete().eq("id", id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "add-library") {
      const body = await req.json();
      const { error } = await supabase.from("library_content").insert(body);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "delete-library") {
      const { id } = await req.json();
      const { error } = await supabase.from("library_content").delete().eq("id", id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "update-volunteer") {
      const { id, ...updates } = await req.json();
      const { error } = await supabase.from("volunteers").update(updates).eq("id", id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "send-admin-reply") {
      const { sender_id, message } = await req.json();
      const { error } = await supabase.from("chat_messages").insert({
        sender_id,
        message,
        is_admin: true,
        receiver_id: sender_id,
      });
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "add-notification") {
      const body = await req.json();
      const { error } = await supabase.from("notifications").insert(body);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "assign-role") {
      const { user_id, role } = await req.json();
      await supabase.from("user_roles").delete().eq("user_id", user_id);
      if (role && role !== "remove") {
        const { error } = await supabase.from("user_roles").insert({ user_id, role });
        if (error) throw error;
      }
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
