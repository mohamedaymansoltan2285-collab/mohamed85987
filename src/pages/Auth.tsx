import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Shield, Eye, EyeOff, Mail, Lock, UserPlus, LogIn, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        let msg = "خطأ في تسجيل الدخول";
        if (error.message?.includes("Invalid login credentials")) msg = "البريد الإلكتروني أو كلمة المرور غير صحيحة";
        else if (error.message?.includes("Email not confirmed")) msg = "لم يتم تأكيد البريد الإلكتروني بعد";
        else if (error.message?.includes("Invalid email")) msg = "البريد الإلكتروني غير صالح";
        toast.error(msg);
      } else {
        toast.success("تم تسجيل الدخول بنجاح");
        navigate("/profile");
      }
    } else {
      if (password.length < 6) {
        toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
        setLoading(false);
        return;
      }
      if (!fullName.trim()) {
        toast.error("يرجى إدخال الاسم الكامل");
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password, fullName);
      if (error) {
        let msg = "خطأ في إنشاء الحساب";
        if (error.message?.includes("already registered")) msg = "هذا البريد الإلكتروني مسجل مسبقاً";
        else if (error.message?.includes("valid email")) msg = "يرجى إدخال بريد إلكتروني صالح";
        else if (error.message?.includes("Password")) msg = "كلمة المرور ضعيفة. استخدم 6 أحرف على الأقل";
        toast.error(msg);
      } else {
        toast.success("تم إنشاء الحساب بنجاح! يمكنك الآن استخدام النظام.");
        navigate("/profile");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 dark:from-purple-950/30 dark:via-background dark:to-pink-950/20" />
        <motion.div
          className="absolute top-20 -right-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 -left-20 w-96 h-96 rounded-full bg-secondary/10 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-accent/40 blur-3xl"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative"
      >
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-brand shadow-lg mb-5"
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.05 }}
            transition={{ duration: 0.5 }}
          >
            <Shield className="h-10 w-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {isLogin ? "مرحباً بعودتك" : "انضم إلينا"}
          </h1>
          <p className="text-muted-foreground">
            {isLogin ? "سجل دخولك للوصول لحسابك" : "أنشئ حسابك للاستفادة من جميع الخدمات"}
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          className="bg-card/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border/50 p-8 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* Decorative corner */}
          <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-brand opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-brand opacity-5 rounded-full translate-x-1/2 translate-y-1/2" />

          <form onSubmit={handleSubmit} className="space-y-5 relative">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2"
                >
                  <Label htmlFor="fullName" className="flex items-center gap-2 text-sm font-medium">
                    <UserPlus size={14} className="text-primary" /> الاسم الكامل
                  </Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="الاسم الثلاثي"
                    required={!isLogin}
                    className="h-12 rounded-xl bg-muted/50 border-border/50 focus:bg-card transition-colors"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                <Mail size={14} className="text-primary" /> البريد الإلكتروني
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@edu.eg"
                required
                className="h-12 rounded-xl bg-muted/50 border-border/50 focus:bg-card transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
                <Lock size={14} className="text-primary" /> كلمة المرور
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-12 rounded-xl bg-muted/50 border-border/50 focus:bg-card transition-colors pl-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <motion.div whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                className="w-full bg-gradient-brand font-bold text-lg h-13 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={loading}
              >
                {loading ? (
                  <motion.div
                    className="flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span>يرجى الانتظار...</span>
                  </motion.div>
                ) : (
                  <span className="flex items-center gap-2">
                    {isLogin ? <LogIn size={20} /> : <Sparkles size={20} />}
                    {isLogin ? "تسجيل الدخول" : "إنشاء الحساب"}
                  </span>
                )}
              </Button>
            </motion.div>
          </form>

          <div className="mt-6 text-center">
            <motion.button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-primary hover:underline font-medium inline-flex items-center gap-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLogin ? "ليس لديك حساب؟ أنشئ حساب جديد" : "لديك حساب بالفعل؟ سجل دخولك"}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Auth;
