import agent from "../agent";

// Country Services
export const listAllCountries = async (filters: any = {}) => {
  try {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== "") {
            params.append(key, filters[key]);
        }
    });
    const endpoint = `${import.meta.env.VITE_API_URL}/countries?${params.toString()}`;
    const res = await agent.get(endpoint);
    return res;
  } catch (error) {
    throw error;
  }
};

export const createCountry = async (data: any) => {
  try {
    const res = await agent.post(`${import.meta.env.VITE_API_URL}/countries`, data);
    return res;
  } catch (error) {
    throw error;
  }
};

export const updateCountry = async (id: string, data: any) => {
  try {
    const res = await agent.patch(`${import.meta.env.VITE_API_URL}/countries/${id}`, data);
    return res;
  } catch (error) {
    throw error;
  }
};

export const deleteCountry = async (id: string) => {
  try {
    const res = await agent.delete(`${import.meta.env.VITE_API_URL}/countries/${id}`);
    return res;
  } catch (error) {
    throw error;
  }
};

// Province Services
export const listAllProvinces = async (filters: any = {}) => {
  try {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== "") {
            params.append(key, filters[key]);
        }
    });
    const endpoint = `${import.meta.env.VITE_API_URL}/provinces?${params.toString()}`;
    const res = await agent.get(endpoint);
    return res;
  } catch (error) {
    throw error;
  }
};

export const createProvince = async (data: any) => {
  try {
    const res = await agent.post(`${import.meta.env.VITE_API_URL}/provinces`, data);
    return res;
  } catch (error) {
    throw error;
  }
};

export const updateProvince = async (id: string, data: any) => {
  try {
    const res = await agent.patch(`${import.meta.env.VITE_API_URL}/provinces/${id}`, data);
    return res;
  } catch (error) {
    throw error;
  }
};

export const deleteProvince = async (id: string) => {
  try {
    const res = await agent.delete(`${import.meta.env.VITE_API_URL}/provinces/${id}`);
    return res;
  } catch (error) {
    throw error;
  }
};

// District Services
export const listAllDistricts = async (filters: any = {}) => {
  try {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== "") {
            params.append(key, filters[key]);
        }
    });
    const endpoint = `${import.meta.env.VITE_API_URL}/districts?${params.toString()}`;
    const res = await agent.get(endpoint);
    return res;
  } catch (error) {
    throw error;
  }
};

export const createDistrict = async (data: any) => {
  try {
    const res = await agent.post(`${import.meta.env.VITE_API_URL}/districts`, data);
    return res;
  } catch (error) {
    throw error;
  }
};

export const updateDistrict = async (id: string, data: any) => {
  try {
    const res = await agent.patch(`${import.meta.env.VITE_API_URL}/districts/${id}`, data);
    return res;
  } catch (error) {
    throw error;
  }
};

export const deleteDistrict = async (id: string) => {
  try {
    const res = await agent.delete(`${import.meta.env.VITE_API_URL}/districts/${id}`);
    return res;
  } catch (error) {
    throw error;
  }
};
