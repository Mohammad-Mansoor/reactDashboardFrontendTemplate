import agent from "../agent";

export const getPlatformUserSessions = async (userId: string) => {
  return await agent.get("/platfrom-users-sessions", {
    params: { user_id: userId },
  });
};

export const revokePlatformUserSession = async (
  sessionId: string,
  reason?: string
) => {
  return await agent.delete(`/platfrom-users-sessions/${sessionId}`, {
    params: { reason },
  });
};
