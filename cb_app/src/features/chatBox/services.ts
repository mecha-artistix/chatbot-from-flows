import axios from 'axios';

const URL_BOTS = import.meta.env.VITE_NODE_BASE_API + '/bots';

type TGetBot = (id: string) => Promise<{ [key: string]: any }>;
interface IBotBody {
  name: string;
  promptText: string;
  source: string;
}
interface IPatchBody {
  modal?: string;
  identity?: string;
  instructions?: string;
}
type TCreateBot = (body: IBotBody) => Promise<{ [key: string]: any }>;
type TPatchBot = (id: string, body: IPatchBody) => Promise<{ [key: string]: any }>;

export const getBot: TGetBot = async (id) => {
  try {
    const response = await axios.get(URL_BOTS + `/${id}`, { withCredentials: true });
    const data = await response.data;
    const bot = data;
    return bot;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const createBot: TCreateBot = async (body) => {
  try {
    const response = await axios.post(URL_BOTS, body, { withCredentials: true });
    const data = response.data;
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const patchBot: TPatchBot = async (id, body) => {
  try {
    const response = await axios.patch(URL_BOTS + `/${id}`, body, { withCredentials: true });
    const data = response.data;
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};