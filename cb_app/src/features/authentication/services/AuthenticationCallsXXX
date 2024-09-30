const URL: string = import.meta.env.VITE_NODE_BASE_API + '/users';

interface Credentials {
  username: string;
  password: string;
}

interface User {
  username: string;
  _id: string;
}

interface LoginResponse {
  status?: number;
  message?: string;
}
// Login
export const login = async (creds: Credentials): Promise<LoginResponse> => {
  try {
    const response = await fetch(URL + '/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(creds),
      credentials: 'include',
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'response not ok');
    const user = data.data.user;
    if (response.status === 200) {
      return { status: response.status };
    }
    return {};
  } catch (error) {
    return { message: error.message };
  }
};

const logoutPost = async () => {
  try {
    const response = await fetch(URL + '/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (!response.ok) throw new Error(response);

    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};
