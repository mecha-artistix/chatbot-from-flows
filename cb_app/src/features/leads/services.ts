import axios from "axios";

const URL = import.meta.env.VITE_NODE_BASE_API;

type TGetSessions = (
  page: number,
  limit: number,
  sort?: string,
  filters?: Record<string, any>,
) => Promise<{ [key: string]: any }>;

// ?price[lt]=1000&dateUpdated[asc]
export const getSessions: TGetSessions = async (page, limit, sort, filters) => {
  try {
    const response = await axios.get(`${URL}/sessions`, {
      params: {
        page,
        limit,
        sort,
        ...filters,
      },
      withCredentials: true,
    });
    const data = await response.data;
    const sessions = data;
    return sessions;
  } catch (error: any) {
    throw new Error(error);
  }
};
type TGetSessionsStats = () => Promise<{ [key: string]: any }>;

export const getSessionsStats: TGetSessionsStats = async () => {
  try {
    const response = await axios.get(URL + "/sessions/stats", { withCredentials: true });
    const stats = response.data;
    return stats;
  } catch (error: any) {
    throw new Error(error);
  }
};

type TUploadLeadsData = (file: File) => Promise<{ [key: string]: any }>;

export const uploadLeadsData: TUploadLeadsData = async (file) => {
  const formData = new FormData();
  formData.append("csvFile", file);
  try {
    const response = await axios.post(URL + "/leads/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
    const data = response.data;
    return data;
  } catch (error: any) {
    return { error };
  }
};

type TCreateLeadCollection = (body: Record<string, any>) => Promise<{ [key: string]: any }>;
export const createLeadCollection: TCreateLeadCollection = async (body) => {
  try {
    const response = await axios.post(URL + "/leads/collections", body, { withCredentials: true });
    const data = await response.data;
    return data;
  } catch (error: any) {
    return { error };
  }
};

type TGetLeadsCollection = () => Promise<{ [key: string]: any }>;

export const getLeadsCollections: TGetLeadsCollection = async () => {
  try {
    const response = await axios.get(URL + "/leads/collections", { withCredentials: true });
    const data = await response.data;
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

type TDeleteLeadCollection = (id: string) => Promise<{ [key: string]: any }>;
export const deleteLeadCollection: TDeleteLeadCollection = async (id) => {
  try {
    const response = await axios.delete(URL + `/leads/collections/${id}`, { withCredentials: true });
    const data = response.data;
    return data;
  } catch (error) {
    return { error };
  }
};

interface IBody {
  name: string;
  email: string;
  phone: string;
  leadsCollection: string;
}

type TCreateLead = (body: Record<string, any>) => Promise<{ [key: string]: any }>;
export const createLead: TCreateLead = async (body) => {
  try {
    const response = await axios.post(URL + "/leads", body, { withCredentials: true });
    const data = await response.data;
    return data;
  } catch (error: any) {
    return { error };
  }
};

type TGetLeads = (id: string) => Promise<{ [key: string]: any }>;
export const getLeads: TGetLeads = async (id) => {
  try {
    const response = await axios.get(URL + `/leads/collections/${id}`, { withCredentials: true });
    const data = await response.data;
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};
