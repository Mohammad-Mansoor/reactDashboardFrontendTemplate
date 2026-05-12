import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Mail, MessageCircle, Send, ArrowLeft, Loader2, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";

import { AuthLayout } from "../components/AuthLayout";
import { InputElement } from "../../components/Ui/Ftth/inputs";
import Button from "../../components/Ui/Ftth/Button";
import { requestOtp } from "../services/authApi";
import { setResetEmailAndChannel } from "../store/resetPasswordSlice";

// Validation Schema using Zod
const schema = z.object({
  email: z.string().email("auth.errors.invalid_email").min(1, "auth.errors.email_required"),
  channel: z.string().min(1, "auth.errors.channel_required"),
});

const ForgotPassword = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", channel: "email" },
  });

  const selectedChannel = watch("channel");

  const mutation = useMutation({
    mutationFn: ({ email, channel }) => requestOtp(email, channel),
    onSuccess: (data, variables) => {
      dispatch(setResetEmailAndChannel(variables));
      navigate("/verify-otp");
    },
    onError:(error)=>{
      console.log("forgto password errror",error)
    }
  });

  const onSubmit = (data) => mutation.mutate(data);

  const channels = [
    { id: "email", label: "Protocol: Email", icon: <Mail size={18} />, color: "blue-light" },
    { id: "whatsapp", label: "Secure: WhatsApp", icon: <MessageCircle size={18} />, color: "success" },
    { id: "telegram", label: "Secure: Telegram", icon: <Send size={18} />, color: "indigo" },
  ];

  return (
    <AuthLayout
      title={t("auth.login.forgot_password")}
      subtitle="Select your preferred synchronization bridge to authorize the identity restoration protocol."
      step={1}
      // error={mutation.isError ? JSON.stringify(mutation.error?.message) : null}
      error={mutation.isError ? (mutation.error?.response?.data?.message || t("auth.locked")) : null}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="relative group">
          <InputElement
            label={t("auth.email")}
            placeholder={t("auth.login.email_placeholder")}
            type="email"
            {...register("email")}
            error={t(errors.email?.message)}
            leftIcon={<Mail size={18} className="text-blue-light-600" />}
            className="h-14 rounded-2xl bg-white/40 dark:bg-white/5 border-white/20 dark:border-white/5 text-slate-800 dark:text-white placeholder:text-gray-400 group-focus-within:border-blue-light-600/40 group-focus-within:ring-4 group-focus-within:ring-blue-light-500/5 transition-all duration-500"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
             <label className="text-[10px] font-black text-gray-400 dark:text-white/20 uppercase tracking-[0.3em]">
               Protocol Bridge
             </label>
             <div className="w-1.5 h-1.5 rounded-full bg-blue-light-600 animate-pulse" />
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {channels.map((ch) => (
              <motion.label
                key={ch.id}
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center justify-between p-4 rounded-[24px] border-2 transition-all duration-500 cursor-pointer relative overflow-hidden
                  ${selectedChannel === ch.id
                    ? "border-blue-light-500/50 bg-white dark:bg-blue-light-500/10 shadow-[0_15px_30px_-10px_rgba(var(--blue-light-500),0.2)]"
                    : "border-white/20 dark:border-white/5 bg-white/20 dark:bg-white/5 hover:border-blue-light-500/20"
                  }`}
              >
                <div className="flex items-center gap-4 relative z-10">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-500
                    ${selectedChannel === ch.id ? "bg-blue-light-600 text-white shadow-lg" : "bg-white/40 dark:bg-white/10 text-gray-400"}`}>
                    {ch.icon}
                  </div>
                  <div>
                    <span className={`block font-black text-[13px] uppercase tracking-tighter transition-colors
                      ${selectedChannel === ch.id ? "text-gray-900 dark:text-white" : "text-gray-500"}`}>
                      {ch.label.split(":")[1].trim()}
                    </span>
                    <span className="text-[9px] font-bold text-gray-400 dark:text-white/20 uppercase tracking-tighter">
                      Secure Medical Connection
                    </span>
                  </div>
                </div>

                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500
                  ${selectedChannel === ch.id ? "border-blue-light-600 bg-blue-light-600/10" : "border-gray-200 dark:border-white/10"}`}>
                  {selectedChannel === ch.id && (
                    <motion.div 
                      layoutId="uniqueCheck"
                      className="w-3 h-3 rounded-full bg-blue-light-600 shadow-[0_0_10px_rgba(var(--blue-light-600),0.5)]"
                    />
                  )}
                </div>
                <input type="radio" value={ch.id} {...register("channel")} className="sr-only" />
              </motion.label>
            ))}
          </div>
        </div>

        <div className="pt-4 flex flex-col items-center gap-6">
          <Button
            type="submit"
            isLoading={mutation.isPending}
            width="w-full"
            height="h-14"
            className="!rounded-2xl border-none bg-gradient-to-tr from-blue-light-600 via-indigo-600 to-indigo-700 hover:brightness-110 shadow-[0_20px_40px_-10px_rgba(var(--blue-light-600),0.4)] active:scale-[0.98] transition-all duration-500 relative overflow-hidden group"
            label={
              <div className="flex items-center justify-center gap-3 relative z-10">
                <span className="text-[14px] font-black uppercase tracking-[0.2em]">{t("auth.sendOtp")}</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </div>
            }
          />

          <Link
            to="/signin"
            className="group flex items-center gap-2.5 text-[11px] font-black text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-300 uppercase tracking-[0.2em]"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>{t("auth.backToLogin")}</span>
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
