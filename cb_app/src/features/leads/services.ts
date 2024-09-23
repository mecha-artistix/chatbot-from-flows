import axios from 'axios';

const URL = import.meta.env.VITE_NODE_BASE_API + '/leads';

// &sort=${sort.sortBy}${sort.key}

export const getLeads = async (page, limit) => {
  try {
    const response = await axios.get(URL + `?page=${page}&limit=${limit}`, {
      withCredentials: true,
    });
    const data = await response.data;
    console.log(data);
    const leads = data.data.data;
    console.log('leads', leads);
    return leads;
  } catch (error) {
    throw new Error(error);
  }
};

export const uploadLeadsData = async (file) => {
  const formData = new FormData();
  formData.append('csvFile', file);
  try {
    const response = await axios.post(URL + '/data', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    const data = response.data;
    return data;
  } catch (error) {
    return { error };
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
