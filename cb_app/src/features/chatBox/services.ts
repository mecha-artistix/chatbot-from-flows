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

const URL_PHONE = import.meta.env.VITE_NODE_BASE_API + '/phone';
// const URL_PHONE_SERVER = import.meta.env.VITE_SERVER_IP + '/phone';

type TMakeCall = (numberToCall: string) => Promise<{ [key: string]: any }>;
export const makeCall: TMakeCall = async (numberToCall) => {
  try {
    const response = await axios.post(URL_PHONE, { numberToCall }, { withCredentials: true });
    const data = await response.data;
    return data;
  } catch (error: any) {
    return error;
  }
};

type TAbortCall = (callSid: string) => Promise<{ [key: string]: any }>;
export const abortCall: TAbortCall = async (callSid) => {
  try {
    // const response = await axios.post(URL_PHONE_SERVER + '/abort-call', { callSid }, { withCredentials: true });
    const response = await axios.post(URL_PHONE + '/abort-call', { callSid }, { withCredentials: true });
    const data = response.data;
    return data;
  } catch (error: any) {
    console.log(error);
  }
};
