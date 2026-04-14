import agent from "../agent";

export const getAllPayments = async (filters: any = {}) => {
  try {
    const defaultFilters = {
      sortBy: "createdAt",
      order: "DESC",
      lang: "en",
    };
    const queryFilters = { ...defaultFilters, ...filters };
    
    // Remove empty filters
    Object.keys(queryFilters).forEach(key => {
      if (queryFilters[key] === undefined || queryFilters[key] === null || queryFilters[key] === "") {
        delete queryFilters[key];
      }
    });

    const params = new URLSearchParams(queryFilters).toString();
    const endpoint = `${import.meta.env.VITE_API_URL}/platform/payments?${params}`;
    const res = await agent.get(endpoint);
    return res;
  } catch (error) {
    throw error;
  }
};

export const getPaymentById = async (id: string) => {
  try {
    const endpoint = `${import.meta.env.VITE_API_URL}/platform/payments/${id}`;
    const res = await agent.get(endpoint);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const createPayment = async (data: any) => {
  try {
    const endpoint = `${import.meta.env.VITE_API_URL}/platform/payments`;
    const res = await agent.post(endpoint, data);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const updatePayment = async (id: string, data: any) => {
  try {
    const endpoint = `${import.meta.env.VITE_API_URL}/platform/payments/${id}`;
    const res = await agent.patch(endpoint, data);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};
