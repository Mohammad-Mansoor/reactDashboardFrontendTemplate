import agent from "../agent";

export const getAllRoles = async (filter: Record<string, any> = {}) => {
  try {
    const query = JSON.stringify({
      relations: ["rolePermissions.permission"]
    });
    const params = new URLSearchParams(filter).toString();
    const endpoint = `${import.meta.env.VITE_API_URL}/platform-roles?query=${encodeURIComponent(query)}&${params}`;
    const res = await agent.get(endpoint);
    return res?.data || [];
  } catch (error) {
    throw error;
  }
};

export const getRoleById = async (roleId: string) => {
  try {
    const endpoint = `${import.meta.env.VITE_API_URL}/platform-roles/${roleId}`;
    const res = await agent.get(endpoint);
    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const createRole = async (data: {
  name: string;
  protectedKey?: string;
  isSystemRole?: boolean;
  isEditable?: boolean;
  allowedMemberType?: string;
  permissionIds?: string[];
}) => {
  try {
    const endpoint = `${import.meta.env.VITE_API_URL}/platform-roles`;
    const res = await agent.post(endpoint, data);
    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const updateRole = async (
  roleId: string,
  data: {
    name?: string;
    protectedKey?: string;
    isSystemRole?: boolean;
    isEditable?: boolean;
    allowedMemberType?: string;
  }
) => {
  try {
    const endpoint = `${import.meta.env.VITE_API_URL}/platform-roles/${roleId}`;
    const res = await agent.put(endpoint, data);
    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const deletePortalRole = async (roleId: string) => {
  try {
    const endpoint = `${import.meta.env.VITE_API_URL}/platform-roles/${roleId}`;
    const res = await agent.delete(endpoint);
    return res?.data || [];
  } catch (error) {
    throw error;
  }
};

// ── Permission endpoints ──────────────────────────────────────────────────────

export const getAllPermissions = async (filter: Record<string, any> = {}) => {
  try {
    const params = new URLSearchParams(filter).toString();
    const endpoint = `${import.meta.env.VITE_API_URL}/platform-permissions?${params}`;
    const res = await agent.get(endpoint);
    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const getRolePermissions = async (roleId: string) => {
  try {
    const endpoint = `${import.meta.env.VITE_API_URL}/platform-roles/${roleId}/permissions`;
    const res = await agent.get(endpoint);
    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const assignPermissionsToRole = async (
  roleId: string,
  permissionIds: string[]
) => {
  try {
    const endpoint = `${import.meta.env.VITE_API_URL}/platform-roles/${roleId}/permissions`;
    const res = await agent.post(endpoint, { permissionIds });
    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const removePermissionFromRole = async (
  roleId: string,
  permissionId: string
) => {
  try {
    const endpoint = `${import.meta.env.VITE_API_URL}/platform-roles/${roleId}/permissions/${permissionId}`;
    const res = await agent.delete(endpoint);
    return res?.data;
  } catch (error) {
    throw error;
  }
};
