import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { ShieldCheck, RefreshCcw, ArrowLeft, Loader2, RefreshCw, Shield } from "lucide-react";
import { motion } from "framer-motion";

import { AuthLayout } from "../components/AuthLayout";
import { OtpInput } from "../components/OtpInput";
import Button from "../../components/Ui/Ftth/Button";
import { verifyOtp, requestOtp } from "../services/authApi";
import { setOtpVerified } from "../store/resetPasswordSlice";
import { useResetFlowGuard } from "../hooks/useResetFlowGuard";

const VerifyOtp = () => {
  useResetFlowGuard();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { email, channel } = useSelector((state) => state.resetPassword);

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(600);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [resendTimer, setResendTimer] = useState(60);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let interval;
    if (resendDisabled) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setResendDisabled(false);
            clearInterval(interval);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendDisabled]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const verifyMutation = useMutation({
    mutationFn: (otpValue) => verifyOtp(email, channel, otpValue),
    onSuccess: (data) => {
      dispatch(
        setOtpVerified({
          verified: true,
          resetToken: data.data.resetToken,
          expiresAt: data.data.expiresAt,
        })
      );
      navigate("/reset-password");
    },
  });

  const resendMutation = useMutation({
    mutationFn: () => requestOtp(email, channel),
    onSuccess: () => {
      setResendDisabled(true);
      setResendTimer(60);
      setOtp("");
    },
  });

  const handleVerify = () => {
    if (otp.length === 6) verifyMutation.mutate(otp);
  };

  /* ── LEFT PANEL CONTENT ────────────────────────────────────────────────── */
  const Steps = () => (
    <div className="space-y-6">
      {[
        { step: 1, title: "Identify Account", active: true, done: true },
        { step: 2, title: "Verify Identity", active: true, done: false },
        { step: 3, title: "Restore Access", active: false, done: false },
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
      title={t("auth.verifyOtp")}
      subtitle="Enter the high-security protocol code sent to your verified device for bridge authorization."
      step={2}
      error={verifyMutation.isError ? (verifyMutation.error?.response?.data?.message || "Standard Mismatch: Identity synthesis failed.") : null}
    >
      <div className="space-y-8 text-center">
        <div className="flex flex-col items-center">
          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="mb-8 relative"
          >
             <div className="absolute inset-0 bg-blue-light-500 blur-2xl opacity-20 animate-pulse" />
             <div className="w-14 h-14 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/20 flex items-center justify-center shadow-xl">
               <ShieldCheck size={32} className="text-blue-light-600" />
             </div>
          </motion.div>

          <label className="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.4em] mb-6">
            Authorization Pin
          </label>
          
          <div className="relative group">
            <div className="absolute -inset-4 bg-blue-light-500/5 rounded-[40px] blur-xl group-focus-within:bg-blue-light-500/10 transition-all duration-700 pointer-events-none" />
            <OtpInput
              value={otp}
              onChange={setOtp}
            />
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-10 py-2.5 px-5 rounded-2xl bg-white/40 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 shadow-sm inline-flex items-center gap-3 backdrop-blur-md"
          >
            <div className="relative flex items-center justify-center">
               <div className="w-2.5 h-2.5 rounded-full bg-blue-light-500/30 animate-ping absolute" />
               <div className="w-1.5 h-1.5 rounded-full bg-blue-light-600 relative" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-white/40">
              {t("auth.expiresIn")}: <span className="text-blue-light-600 tabular-nums">{formatTime(timer)}</span>
            </p>
          </motion.div>
        </div>

        <div className="space-y-6">
          <Button
            onClick={handleVerify}
            isLoading={verifyMutation.isPending}
            disabled={otp.length !== 6 || timer === 0}
            width="w-full"
            height="h-13"
            className="!rounded-[20px] border-none bg-gradient-to-tr from-blue-light-600 via-indigo-600 to-indigo-700 hover:brightness-110 shadow-[0_20px_40px_-10px_rgba(var(--blue-light-600),0.4)] active:scale-[0.98] transition-all duration-500"
            label={
              <div className="flex items-center justify-center gap-3">
                <span className="text-[13px] font-black uppercase tracking-[0.2em]">{t("auth.verifyCode")}</span>
                <ShieldCheck size={20} />
              </div>
            }
          />

          <div className="flex flex-col items-center gap-4 pt-2">
            <button
              onClick={() => !resendDisabled && resendMutation.mutate()}
              disabled={resendDisabled || resendMutation.isPending}
              className={`flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-300
                ${resendDisabled
                  ? "text-slate-300 dark:text-white/10 cursor-not-allowed"
                  : "text-orange-500 hover:text-orange-600 hover:scale-105 active:scale-95"
                }`}
            >
              {resendMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <RefreshCcw size={14} />}
              <span>{t("auth.resend")}</span>
              {resendDisabled && <span className="opacity-40 tracking-tighter">[{resendTimer}s]</span>}
            </button>
            
            <button
              onClick={() => navigate("/forgot-password")}
              className="group flex items-center gap-2 text-[9px] font-black text-slate-400 hover:text-blue-light-600 dark:hover:text-blue-light-400 transition-all duration-300 uppercase tracking-[0.3em]"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1.5 transition-transform" />
              {t("auth.changeMethod")}
            </button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default VerifyOtp;
