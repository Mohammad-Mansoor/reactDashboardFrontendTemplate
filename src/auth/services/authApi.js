import agent from "../../agent";

/**
 * AUTH API SERVICE
 */
export const requestOtp = async (email, channel) => {

  try {
    const response = await agent.post("/auth/forgot-password", { email, channel });
    return response.data;
  } catch (error) {
    throw error
    
  }

};

export const verifyOtp = async (email, channel, otp) => {
  const response = await agent.post("/auth/verify-otp", { email, channel, otp });
  return response.data;
};

export const resetPassword = async (email, resetToken, newPassword) => {
  const response = await agent.post("/auth/reset-password", {
    email,
    resetToken,
    newPassword,
  });
  return response.data;
};

export const getMe = async () => {
  const response = await agent.get("/auth/me");
  return response.data.data;
};

export const getNotificationOptions = async (userId) => {
  const response = await agent.get(`/notification-options/${userId}`);
  return response.data.data;
};
