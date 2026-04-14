import agent from "../agent";

export const getAllInvoices = async (filters: any = {}) => {
  try {
    const defaultFilters = {
      page: 1,
      limit: 20,
      sortBy: "createdAt",
      order: "DESC",
      lang: "en",
    };
    const queryFilters = { ...defaultFilters, ...filters };
    const params = new URLSearchParams(queryFilters).toString();
    const endpoint = `${import.meta.env.VITE_API_URL}/platform/invoices?${params}`;
    const res = await agent.get(endpoint);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getInvoiceById = async (id: string) => {
  try {
    const endpoint = `${import.meta.env.VITE_API_URL}/platform/invoices/${id}`;
    const res = await agent.get(endpoint);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const createInvoice = async (data: any) => {
  try {
    const endpoint = `${import.meta.env.VITE_API_URL}/platform/invoices`;
    const res = await agent.post(endpoint, data);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const updateInvoice = async (id: string, data: any) => {
  try {
    const endpoint = `${import.meta.env.VITE_API_URL}/platform/invoices/${id}`;
    const res = await agent.patch(endpoint, data);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const deleteInvoice = async (id: string) => {
  try {
    const endpoint = `${import.meta.env.VITE_API_URL}/platform/invoices/${id}`;
    const res = await agent.delete(endpoint);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};
