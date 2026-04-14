import agent from "../agent";

export const getAllSubscriptions = async (filters: any = {}) => {
  try {
    const defaultFilters = {
      sortBy: "createdAt",
      order: "DESC",
      lang: "en",
    };
    const queryFilters = { ...defaultFilters, ...filters };
    const params = new URLSearchParams(queryFilters).toString();
    const endpoint = `${import.meta.env.VITE_API_URL}/platform/subscriptions?${params}`;
    const res = await agent.get(endpoint);
    return res;
  } catch (error) {
    throw error;
  }
};

export const deleteSubscription = async (id: string) => {
  try {
    const endpoint = `${import.meta.env.VITE_API_URL}/platform/subscriptions/${id}`;
    const res = await agent.delete(endpoint);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const getSubscriptionById = async (id: string) => {
  try {
    const endpoint = `${import.meta.env.VITE_API_URL}/platform/subscriptions/${id}`;
    const res = await agent.get(endpoint);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const createSubscription = async (data: any) => {
  try {
    const endpoint = `${import.meta.env.VITE_API_URL}/platform/subscriptions`;
    const res = await agent.post(endpoint, data);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const updateSubscription = async (id: string, data: any) => {
  try {
    const endpoint = `${import.meta.env.VITE_API_URL}/platform/subscriptions/${id}`;
    const res = await agent.patch(endpoint, data);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const activateSubscription = async (id: string) => {
  try {
    const endpoint = `${import.meta.env.VITE_API_URL}/platform/subscriptions/${id}/activate`;
    const res = await agent.post(endpoint);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const suspendSubscription = async (id: string) => {
  try {
    const endpoint = `${import.meta.env.VITE_API_URL}/platform/subscriptions/${id}/suspend`;
    const res = await agent.post(endpoint);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const cancelSubscription = async (id: string, cancelReason: string) => {
  try {
    const endpoint = `${import.meta.env.VITE_API_URL}/platform/subscriptions/${id}/cancel`;
    const res = await agent.post(endpoint, { cancelReason });
    return res.data;
  } catch (error: any) {
    throw error;
  }
};
