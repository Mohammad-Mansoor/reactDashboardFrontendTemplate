
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  Heart,
  Activity,
  Stethoscope,
  ClipboardList,
  Users,
  Calendar,
  Shield,
  Facebook,
  Github,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { login } from "../../store/slices/authSlice";
import Lottie from "lottie-react";
import doctorAnimation from "../lottieFiles/Doctor.json";

// Components from Ftth
import { InputElement, PasswordInput } from "../Ui/Ftth/inputs";
import Checkbox from "../Ui/Ftth/Checkbox";
import Button from "../Ui/Ftth/Button";
import ThemeTogglerTwo from "../Common/ThemeTogglerTwo";



/* ─── Floating Background Icons ──────────────────────────────────────────── */
const BG_ICONS = [
  { Icon: Activity,    top: "10%",  left: "5%",   delay: 0,    size: 22, color: "text-blue-500/20 dark:text-blue-500/10" },
  { Icon: Heart,       top: "15%",  right: "10%", delay: 0.5,  size: 28, color: "text-red-500/20 dark:text-red-500/10" },
  { Icon: Stethoscope, bottom: "20%", left: "10%", delay: 1,    size: 26, color: "text-emerald-500/20 dark:text-emerald-500/10" },
  { Icon: ClipboardList, bottom: "15%", right: "8%", delay: 1.5, size: 24, color: "text-orange-500/20 dark:text-orange-500/10" },
  { Icon: Shield,      top: "40%",  left: "2%",   delay: 2,    size: 20, color: "text-indigo-500/20 dark:text-indigo-500/10" },
  { Icon: Users,       top: "45%",  right: "2%",  delay: 2.5,  size: 22, color: "text-sky-500/20 dark:text-sky-500/10" },
];

function FloatingIcons() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {BG_ICONS.map(({ Icon, top, left, right, bottom, delay, size, color }, i) => (
        <motion.div
          key={i}
          className={`absolute ${color}`}
          style={{ top, left, right, bottom }}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 10, -10, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay,
          }}
        >
          <Icon size={size} />
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Google Icon SVG ────────────────────────────────────────────────────── */
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
  </svg>
);

/* ─── Social Button ──────────────────────────────────────────────────────── */
const SocialButton = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex-1 flex items-center justify-center p-2.5 rounded-lg bg-white/40 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 hover:bg-white/60 dark:hover:bg-white/10 transition-all active:scale-95 shadow-sm dark:shadow-none"
  >
    {children}
  </button>
);

/* ─── Features List (Left Panel) ─────────────────────────────────────────── */
const Features = () => {
  const items = [
    { icon: <Users className="text-blue-500" />, title: "Patient Management", desc: "Comprehensive patient records & care" },
    { icon: <Calendar className="text-orange-500" />, title: "Smart Scheduling", desc: "Automated appointments & reminders" },
    { icon: <ClipboardList className="text-emerald-500" />, title: "Digital Records", desc: "Secure & accessible health data" },
  ];

  return (
    <div className="space-y-3 mt-6 w-full max-w-sm">
      {items.map((item, i) => (
        <motion.div
           key={i}
           initial={{ opacity: 0, x: -15 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.5 + i * 0.1 }}
           className="flex items-center gap-3 p-3.5 rounded-lg bg-white/60 dark:bg-white/5 border border-white/80 dark:border-white/10 shadow-sm dark:shadow-none backdrop-blur-md"
        >
          <div className="w-9 h-9 rounded-md bg-blue-50/50 dark:bg-white/10 flex items-center justify-center shrink-0">
            {item.icon}
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 dark:text-white text-[13px]">{item.title}</h4>
            <p className="text-slate-500 dark:text-white/50 text-[11px]">{item.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default function SignInForm() {
  const [rememberMe, setRememberMe] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "", password: "" },
  });

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);


  const onSubmit = async (data: any) => {
    const resultAction = await dispatch(login({ email: data.email, password: data.password }));
    if (login.fulfilled.match(resultAction)) navigate("/");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-[#070b14] dark:via-[#070b14] dark:to-[#0b1224] p-4 relative overflow-hidden font-sans transition-colors duration-500">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-200/30 dark:bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-200/30 dark:bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      <FloatingIcons />

      <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center justify-between gap-10 z-10">
        
        {/* ── LEFT PANEL (Desktop) ── */}
        <div className="hidden lg:flex flex-col items-start w-1/2">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2.5 mb-6"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Heart className="text-white" size={20} fill="white" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">HealthCare+</h1>
          </motion.div>

          {/* Lottie Animation for Desktop */}
          {/* <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full max-w-[320px] mb-4 -ml-4"
          >
            {doctorAnimation ? (
              <Lottie animationData={doctorAnimation} loop={true} />
            ) : (
              <div className="w-full h-[240px] flex items-center justify-center rounded-2xl bg-slate-100/50 dark:bg-white/5 backdrop-blur-sm border border-slate-200/50 dark:border-white/10">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500/50" />
              </div>
            )}
          </motion.div> */}

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
              Modern Healthcare<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Management</span>
            </h2>
            <p className="text-slate-600 dark:text-white/60 text-base mt-4 max-w-sm">
              Experience seamless patient care with our advanced healthcare management platform.
            </p>
          </motion.div>

          <Features />
        </div>

        {/* ── RIGHT PANEL (Login Form) ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full lg:w-[410px]"
        >
          <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white dark:border-white/10 rounded-[24px] p-8 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] dark:shadow-2xl relative overflow-hidden transition-colors duration-500">
            
            {/* Form Header */}
            <div className="text-center mb-6">
              {/* Lottie Animation for Mobile (Shows only when Desktop view is hidden) */}
              {/* <div className="lg:hidden w-32 h-32 mx-auto mb-4 scale-125">
                {lottieData && <Lottie animationData={lottieData} loop={true} />}
              </div> */}
              
              <div className="hidden lg:flex w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-blue-500/10 dark:to-orange-500/10 items-center justify-center mx-auto mb-5 border border-white dark:border-white/10 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center shadow-md">
                  <Heart className="text-white" size={20} fill="white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1.5">Welcome Back</h3>
              <p className="text-slate-500 dark:text-white/50 text-xs">Sign in to manage your healthcare</p>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mb-5 p-2.5 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-500 text-[13px] font-medium text-center"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4.5">
              <InputElement
                label="Email Address"
                placeholder="Enter your email"
                type="email"
                {...register("email", { required: "Email is required" })}
                error={errors.email?.message as string}
                leftIcon={<Mail size={16} />}
                className="bg-white/50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/20"
              />

              <div className="space-y-1">
                <PasswordInput
                  label="Password"
                  placeholder="Enter your password"
                  {...register("password", { required: "Password is required" })}
                  error={errors.password?.message as string}
                  leftIcon={<Lock size={16} />}
                  className="bg-white/50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/20"
                />
              </div>

              <div className="flex items-center justify-between py-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <Checkbox 
                    value={rememberMe} 
                    onChange={setRememberMe} 
                    color="primary1"
                    size="sm"
                  />
                  <span className="text-xs text-slate-600 dark:text-white/70 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Remember me</span>
                </label>
                <Link to="/forgot-password" title="Forgot Password" className="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-500 transition-colors font-semibold">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                isLoading={loading}
                width="w-full"
                height="h-11"
                className="!rounded-lg border-none bg-gradient-to-r from-blue-600 to-orange-500 hover:brightness-110 shadow-lg shadow-blue-500/20 active:scale-[0.98] mt-1"
                label={
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="text-sm font-bold">Sign In</span>
                    <ArrowRight size={18} />
                  </div>
                }
              />

              <div className="relative my-6 flex items-center">
                <div className="flex-grow border-t border-slate-200 dark:border-white/10"></div>
                <span className="px-3 text-[10px] text-slate-400 dark:text-white/30 font-bold uppercase tracking-wider">or continue with</span>
                <div className="flex-grow border-t border-slate-200 dark:border-white/10"></div>
              </div>

              <div className="flex gap-3">
                <SocialButton><GoogleIcon /></SocialButton>
                <SocialButton><Facebook className="text-blue-600 dark:text-white" size={18} fill="currentColor" /></SocialButton>
                <SocialButton><Github className="text-slate-800 dark:text-white" size={18} fill="currentColor" /></SocialButton>
              </div>

              <p className="text-center text-xs text-slate-500 dark:text-white/50 pt-3">
                Don't have an account?{" "}
                <Link to="/signup" className="text-orange-600 dark:text-orange-400 font-bold hover:underline">
                  Sign up now
                </Link>
              </p>
            </form>
          </div>

          <div className="mt-6 flex items-center justify-center gap-1.5 text-slate-400 dark:text-white/20">
             <Shield size={12} />
             <span className="text-[10px] font-bold uppercase tracking-[0.15em]">End-to-end encryption</span>
          </div>
        </motion.div>
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <ThemeTogglerTwo />
      </div>
    </div>
  );
}
