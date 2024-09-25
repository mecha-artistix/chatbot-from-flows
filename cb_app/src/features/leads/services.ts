import axios from 'axios';

const URL_LEADS = import.meta.env.VITE_NODE_BASE_API + '/leads';

const URL_LEADS_COLLECTIONS = import.meta.env.VITE_NODE_BASE_API + '/leads/collections';

const URL_SESSIONS = import.meta.env.VITE_NODE_BASE_API + '/leads/sessions';

// &sort=${sort.sortBy}${sort.key}

export const getSessions = async (page, limit) => {
  try {
    const response = await axios.get(URL_LEADS + `/sessions?page=${page}&limit=${limit}`, {
      withCredentials: true,
    });
    const data = await response.data;
    const leads = data.data.data;
    return leads;
  } catch (error) {
    throw new Error(error);
  }
};

export const getSessionsStats = async () => {
  try {
    const response = await axios(URL_LEADS + '/sessions/stats');
    const stats = response.data;
    return stats;
  } catch (error) {
    throw new Error(error);
  }
};

export const uploadLeadsData = async (file) => {
  const formData = new FormData();
  formData.append('csvFile', file);
  try {
    const response = await axios.post(URL_LEADS + '/collections', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    });
    const data = response.data;
    return data;
  } catch (error) {
    return { error };
  }
};

export const getLeadsCollections = async () => {
  try {
    const response = await axios.get(URL_LEADS + '/collections', { withCredentials: true });
    const data = await response.data;
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const getLeads = async (id) => {
  try {
    const response = await axios.get(URL_LEADS + `/collections/${id}`, { withCredentials: true });
    const data = await response.data;
    console.log(data);
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

// const getSorted = async(options)=> {
//     const key = options[0].field;
//     const value = options[0].sort;
//     const sortBy = value == 'asc' ? '' : '-';
//     const { paginationModel } = get();
//     const response = await axios.get(
//       `${URL}?page=${paginationModel.page}&limit=${paginationModel.pageSize}&sort=${sortBy}${key}`,
//     );
// }
