import axios from 'axios';

const URL: string = import.meta.env.VITE_NODE_BASE_API + '/users';

export const login = async (credentials: any) => {
  try {
    const response = await axios.post(URL + '/login', credentials, { withCredentials: true });
    const data = response.data;
    return data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    }
    throw new Error('An unexpected error occurred.');
  }
};

export const signup = async (body: any) => {
  try {
    const response = await axios.post(URL + '/signup', body, { withCredentials: true });
    if (response.data) return response.data;
    else return response;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    }
    throw new Error('An unexpected error occurred.');
  }
};

export const verify = async () => {
  try {
    const response = await axios.get(URL + '/verify', { withCredentials: true });
    const data = response.data;
    return data;
  } catch (error: any) {
    console.log(error);
    return new Error(error);
  }
};

export const logout = async () => {
  try {
    const response = await axios.post(URL + '/logout', { withCredentials: true });
    const data = response.data;
    return data;
  } catch (error: any) {
    return new Error(error);
  }
};
