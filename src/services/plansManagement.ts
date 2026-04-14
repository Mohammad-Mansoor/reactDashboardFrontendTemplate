import agent from "../agent";

export const getAllPlatformPlans = async (filters: any = {}) => {
  try {
    const defaultFilters = {
      sortBy: "sortOrder",
      order: "ASC",
      lang: "en",
    };
    const queryFilters = { ...defaultFilters, ...filters };
    const params = new URLSearchParams(queryFilters).toString();
    const endpoint = `${import.meta.env.VITE_API_URL}/platform/plans?${params}`;
    const res = await agent.get(endpoint);
    return res;
  } catch (error) {
    throw error;
  }
};

export const deletePlatformPlan = async (planId: string) => {
  try {
    const endpoint = `${import.meta.env.VITE_API_URL}/platform/plans/${planId}`;
    const res = await agent.delete(endpoint);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const getPlatformPlanById = async (planId: string) => {
  try {
    const endpoint = `${import.meta.env.VITE_API_URL}/platform/plans/${planId}`;
    const res = await agent.get(endpoint);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const createPlatformPlan = async (data: any) => {
  try {
    const endpoint = `${import.meta.env.VITE_API_URL}/platform/plans`;
    const res = await agent.post(endpoint, data);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const getPlanFeatures = async () => {
  try {
    const endpoint = `${import.meta.env.VITE_API_URL}/platform/plans/features`;
    const res = await agent.get(endpoint);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const updatePlatformPlan = async (planId: string, data: any) => {
  try {
    const endpoint = `${import.meta.env.VITE_API_URL}/platform/plans/${planId}`;
    const res = await agent.patch(endpoint, data);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const activatePlatformPlan = async (planId: string) => {
  try {
    const endpoint = `${import.meta.env.VITE_API_URL}/platform/plans/${planId}/activate`;
    const res = await agent.post(endpoint, {});
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const deactivatePlatformPlan = async (planId: string) => {
  try {
    const endpoint = `${import.meta.env.VITE_API_URL}/platform/plans/${planId}/deactivate`;
    const res = await agent.post(endpoint, {});
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const createPlatformPlanVersion = async (planId: string, data: any) => {
  try {
    const endpoint = `${import.meta.env.VITE_API_URL}/platform/plans/${planId}/versions`;
    const res = await agent.post(endpoint, data);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};
