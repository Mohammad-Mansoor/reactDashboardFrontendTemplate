import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Lock, Eye, EyeOff, ShieldAlert, CheckCircle2, ArrowRight, ShieldCheck, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

import { AuthLayout } from "../components/AuthLayout";
import { PasswordInput } from "../../components/Ui/Ftth/inputs";
import Button from "../../components/Ui/Ftth/Button";
import { resetPassword as resetPasswordApi } from "../services/authApi";
import { resetFlow } from "../store/resetPasswordSlice";
import { useResetFlowGuard } from "../hooks/useResetFlowGuard";

// Validation Schema using Zod
const schema = z.object({
  password: z
    .string()
    .min(1, "auth.errors.password_required")
    .min(8, "auth.errors.password_too_short")
    .regex(/[A-Z]/, "auth.errors.password_no_uppercase")
    .regex(/[0-9]/, "auth.errors.password_no_number"),
  confirmPassword: z.string().min(1, "auth.errors.confirm_password_required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "auth.errors.passwords_must_match",
  path: ["confirmPassword"],
});

const ResetPassword = () => {
  useResetFlowGuard();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { email, resetToken } = useSelector((state) => state.resetPassword);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const password = watch("password", "");

  const calculateStrength = (pwd) => {
    let score = 0;
    if (!pwd) return 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[!@#$%^&*]/.test(pwd)) score += 1;
    return score;
  };

  const strength = calculateStrength(password);
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-500"];

  const mutation = useMutation({
    mutationFn: (data) => resetPasswordApi(email, resetToken, data.password),
    onSuccess: () => {
      window.location.href = "/signin";
    },
  });

  const onSubmit = (data) => mutation.mutate(data);

  /* ── LEFT PANEL CONTENT ────────────────────────────────────────────────── */
  const Steps = () => (
    <div className="space-y-6">
      {[
        { step: 1, title: "Identify Account", active: true, done: true },
        { step: 2, title: "Verify Identity", active: true, done: true },
        { step: 3, title: "Restore Access", active: true, done: false },
      ].map((item, i) => (
        <div key={i} className="flex items-center gap-5">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all
            ${item.active ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30" : "bg-slate-200 dark:bg-white/10 text-slate-400"}`}>
            {item.done ? <ShieldCheck size={16} /> : item.step}
          </div>
          <span className={`text-sm font-bold uppercase tracking-widest ${item.active ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>
            {item.title}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <AuthLayout
      title={t("auth.resetPassword")}
      subtitle="Establish a new high-entropy credential layer to re-establish bridge authorization and unlock medical records."
      step={3}
      error={mutation.isError ? (mutation.error?.response?.data?.message || "Handshake Error: Failed to commit new encryption layer.") : null}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          <div className="relative group">
            <PasswordInput
              label={t("auth.newPassword")}
              placeholder={t("auth.login.password_placeholder")}
              {...register("password")}
              error={t(errors.password?.message)}
              leftIcon={<Lock size={18} className="text-blue-light-600" />}
              className="h-13 rounded-[20px] bg-white/40 dark:bg-white/5 border-slate-200/60 dark:border-white/10 text-slate-800 dark:text-white group-focus-within:border-blue-light-400 transition-all duration-500"
            />
          </div>

          {/* Holographic Strength Indicator */}
          <div className="px-1 space-y-3 pt-1">
            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
              <span>Entropy Synthesis</span>
              <motion.span 
                key={strength}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                className={strength > 0 ? "text-blue-light-600 dark:text-blue-light-400 font-black italic underline decoration-blue-light-500/20 underline-offset-4" : "text-slate-300"}
              >
                {password ? strengthLabels[strength - 1] : "Awaiting Protocol..."}
              </motion.span>
            </div>
            <div className="flex gap-2 h-1.5 overflow-hidden p-[1px]">
              {[1, 2, 3, 4].map((level) => (
                <div key={level} className="flex-1 relative bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden border border-white/5">
                   <motion.div
                     initial={false}
                     animate={{ 
                       width: strength >= level ? "100%" : "0%",
                       backgroundColor: strength >= level ? (strength === 4 ? "#10b981" : strength === 3 ? "#fbbf24" : strength === 2 ? "#fb923c" : "#f87171") : "transparent"
                     }}
                     className="absolute inset-0 shadow-[0_0_10px_rgba(var(--blue-light-600),0.3)]"
                   />
                </div>
              ))}
            </div>
          </div>

          <div className="relative group">
            <PasswordInput
              label={t("auth.confirmPassword")}
              placeholder={t("auth.login.password_placeholder")}
              {...register("confirmPassword")}
              error={t(errors.confirmPassword?.message)}
              leftIcon={<CheckCircle2 size={18} className="text-blue-light-600" />}
              className="h-13 rounded-[20px] bg-white/40 dark:bg-white/5 border-slate-200/60 dark:border-white/10 text-slate-800 dark:text-white group-focus-within:border-blue-light-400 transition-all duration-500"
            />
          </div>
        </div>

        <Button
          type="submit"
          isLoading={mutation.isPending}
          width="w-full"
          height="h-13"
          className="!rounded-[20px] border-none bg-gradient-to-tr from-blue-light-600 via-indigo-600 to-indigo-700 hover:brightness-110 shadow-[0_20px_40px_-10px_rgba(var(--blue-light-600),0.4)] active:scale-[0.98] transition-all duration-500 relative overflow-hidden group"
          label={
            <div className="flex items-center justify-center gap-3 relative z-10">
              <span className="text-[13px] font-black uppercase tracking-[0.2em]">{t("auth.updatePassword")}</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </div>
          }
        />
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
