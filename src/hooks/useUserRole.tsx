import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type AppRole = "super_admin" | "admin" | "moderator" | "editor" | "viewer" | "user";

const roleHierarchy: AppRole[] = ["super_admin", "admin", "moderator", "editor", "viewer", "user"];

export const roleLabels: Record<AppRole, string> = {
  super_admin: "مدير عام",
  admin: "مدير",
  moderator: "مشرف",
  editor: "محرر",
  viewer: "مشاهد",
  user: "مستخدم",
};

export const rolePermissions: Record<AppRole, string[]> = {
  super_admin: ["all", "manage_roles", "manage_users", "manage_reports", "manage_activities", "manage_library", "manage_volunteers", "manage_chat", "manage_notifications", "manage_donations", "manage_surveys"],
  admin: ["manage_reports", "manage_activities", "manage_library", "manage_volunteers", "manage_chat", "manage_notifications", "manage_donations", "manage_surveys"],
  moderator: ["manage_reports", "manage_activities", "manage_chat", "manage_notifications"],
  editor: ["manage_activities", "manage_library"],
  viewer: ["view_dashboard"],
  user: [],
};

export const useUserRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setRole(null); setLoading(false); return; }
    
    const fetchRole = async () => {
      const { data } = await supabase.rpc("get_user_role", { _user_id: user.id });
      setRole((data as AppRole) || null);
      setLoading(false);
    };
    fetchRole();
  }, [user]);

  const hasPermission = (permission: string): boolean => {
    if (!role) return false;
    const perms = rolePermissions[role];
    return perms.includes("all") || perms.includes(permission);
  };

  const isAdmin = role === "super_admin" || role === "admin";
  const canAccessDashboard = role !== null && role !== "user";

  return { role, loading, hasPermission, isAdmin, canAccessDashboard, roleLabels, roleHierarchy };
};
