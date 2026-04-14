import agent from "../agent";

export const getProfilesList = async (filters: any = {}) => {
  try {
    const params = new URLSearchParams(filters).toString();
    const endpoint = `${import.meta.env.VITE_API_URL}/platform-user-profiles?${params}`;
    const res = await agent.get(endpoint);
    return res;
  } catch (error) {
    throw error;
  }
};

export const getProfileById = async (id: string) => {
  try {
    const query = JSON.stringify({
      relations: ["user.roles.rolePermissions.permission"]
    });
    const endpoint = `${import.meta.env.VITE_API_URL}/platform-user-profiles/${id}?query=${encodeURIComponent(query)}`;
    const res = await agent.get(endpoint);
    return res;
  } catch (error) {
    throw error;
  }
};

export const createProfile = async (data: any) => {
  try {
    const endpoint = `${import.meta.env.VITE_API_URL}/platform-user-profiles`;
    const res = await agent.post(endpoint, data);
    return res;
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (id: string, data: any) => {
  try {
    const endpoint = `${import.meta.env.VITE_API_URL}/platform-user-profiles/${id}`;
    const res = await agent.patch(endpoint, data);
    return res;
  } catch (error) {
    throw error;
  }
};

export const deleteProfile = async (id: string) => {
  try {
    const endpoint = `${import.meta.env.VITE_API_URL}/platform-user-profiles/${id}`;
    const res = await agent.delete(endpoint);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const getAllPlatformUsers = async (filters: any = {}) => {
  try {
    const params = new URLSearchParams(filters).toString();
    const endpoint = `${import.meta.env.VITE_API_URL}/platform-users?${params}`;
    const res = await agent.get(endpoint);
    return res;
  } catch (error) {
    throw error;
  }
};

export const getPlatformUserById = async (id: string) => {
  try {
    const endpoint = `${import.meta.env.VITE_API_URL}/platform-users/${id}`;
    const res = await agent.get(endpoint);
    return res;
  } catch (error) {
    throw error;
  }
};

export const deletePortalUser = async (userId: string) => {
  try {
    const endpoint = `${import.meta.env.VITE_API_URL}/platform-users/${userId}`;
    const res = await agent.delete(endpoint);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const assignRoleToUser = async (userId: string, roleId: string) => {
  try {
    const endpoint = `${import.meta.env.VITE_API_URL}/platform-users/${userId}/roles`;
    const res = await agent.post(endpoint, { roleId });
    return res;
  } catch (error) {
    throw error;
  }
};

export const removeRoleFromUser = async (userId: string, roleId: string) => {
  try {
    const endpoint = `${import.meta.env.VITE_API_URL}/platform-users/${userId}/roles/${roleId}`;
    const res = await agent.delete(endpoint);
    return res;
  } catch (error) {
    throw error;
  }
};
