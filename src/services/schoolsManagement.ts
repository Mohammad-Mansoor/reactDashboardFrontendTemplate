import agent from "../agent";

export const getAllSchools = async (filters: any = {}) => {
  try {
    const params = new URLSearchParams(filters).toString();
    const endpoint = `/schools?${params}`;
    const res = await agent.get(endpoint);
    return res;
  } catch (error) {
    throw error;
  }
};

export const createSchool = async (data: any) => {
  try {
    const endpoint = `/schools/register`;
    const res = await agent.post(endpoint, data);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const updateSchool = async (schoolId: string, data: any) => {
  try {
    const endpoint = `/schools/${schoolId}`;
    const res = await agent.patch(endpoint, data);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const getSchoolById = async (schoolId: string) => {
  try {
    const endpoint = `/schools/${schoolId}`;
    const res = await agent.get(endpoint);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const deleteSchool = async (schoolId: string) => {
  try {
    const endpoint = `/schools/${schoolId}`;
    const res = await agent.delete(endpoint);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const updateSchoolStatus = async (schoolId: string, status: string) => {
  try {
    const endpoint = `/schools/${schoolId}/status`;
    const res = await agent.patch(endpoint, { status });
    return res.data;
  } catch (error: any) {
    throw error;
  }
};
