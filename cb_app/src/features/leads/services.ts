import axios from 'axios';

const URL_LEADS = import.meta.env.VITE_NODE_BASE_API + '/leads';

type TGetSessions = (page: number, limit: number) => Promise<{ [key: string]: any }>;

export const getSessions: TGetSessions = async (page, limit) => {
  try {
    const response = await axios.get(URL_LEADS + `/sessions?page=${page}&limit=${limit}`, {
      withCredentials: true,
    });
    const data = await response.data;
    const sessions = data.data.data;
    return sessions;
  } catch (error: any) {
    throw new Error(error);
  }
};
type TGetSessionsStats = () => Promise<{ [key: string]: any }>;

export const getSessionsStats: TGetSessionsStats = async () => {
  try {
    const response = await axios.get(URL_LEADS + '/sessions/stats');
    const stats = response.data;
    return stats;
  } catch (error: any) {
    throw new Error(error);
  }
};

type TUploadLeadsData = (file: File) => Promise<{ [key: string]: any }>;

export const uploadLeadsData: TUploadLeadsData = async (file) => {
  const formData = new FormData();
  formData.append('csvFile', file);
  try {
    const response = await axios.post(URL_LEADS + '/collections', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    });
    const data = response.data;
    return data;
  } catch (error: any) {
    return { error };
  }
};

type TGetLeadsCollection = () => Promise<{ [key: string]: any }>;

export const getLeadsCollections: TGetLeadsCollection = async () => {
  try {
    const response = await axios.get(URL_LEADS + '/collections', { withCredentials: true });
    const data = await response.data;
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

interface IBody {
  name: string;
  email: string;
  phone: string;
  dataSource: string;
}

type TCreateLead = (body: IBody) => Promise<{ [key: string]: any }>;
export const createLead: TCreateLead = async (body) => {
  try {
    const response = await axios.post(URL_LEADS, body, { withCredentials: true });
    const data = await response.data;
    return data;
  } catch (error: any) {
    return error;
  }
};

type TGetLeads = (id: string) => Promise<{ [key: string]: any }>;
export const getLeads: TGetLeads = async (id) => {
  try {
    const response = await axios.get(URL_LEADS + `/collections/${id}`, { withCredentials: true });
    const data = await response.data;
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

const URL_PHONE = import.meta.env.VITE_NODE_BASE_API + '/phone';

type TMakeCall = (numbersToCall: string[]) => Promise<{ [key: string]: any }>;
export const makeCall: TMakeCall = async (numbersToCall) => {
  try {
    const response = await axios.post(URL_PHONE, { numbersToCall }, { withCredentials: true });
    const data = await response.data;
    return data;
  } catch (error: any) {
    return error;
  }
};
