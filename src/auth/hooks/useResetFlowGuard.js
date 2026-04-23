import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

export const useResetFlowGuard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, channel, otpVerified, resetToken } = useSelector(
    (state) => state.resetPassword
  );

  useEffect(() => {
    // Flow Step 2: Verify Otp
    if (location.pathname === "/verify-otp") {
      if (!email || !channel) {
        navigate("/forgot-password", { replace: true });
      }
    }

    // Flow Step 3: Reset Password
    if (location.pathname === "/reset-password") {
      if (!otpVerified || !resetToken) {
        navigate("/forgot-password", { replace: true });
      }
    }
  }, [email, channel, otpVerified, resetToken, location.pathname, navigate]);
};
