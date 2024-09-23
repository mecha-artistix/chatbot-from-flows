import axios from 'axios';
import { INode } from '../../../types/flowchart';

const URL: string = import.meta.env.VITE_NODE_BASE_API + '/flowcharts';

type CreateFlowchart = (name: string, nodes: INode[]) => Promise<any>;
type GetAllFlowcharts = (name: string, nodes: INode[]) => Promise<any>;
type DeleteFlowchart = (id: string) => Promise<any>;
type GetFlowchart = (id: string) => Promise<any>;

export const createFlowchart: CreateFlowchart = async (name, nodes) => {
  let data;
  try {
    const response = await axios.post(
      URL,
      { name, nodes },
      { withCredentials: true, headers: { 'Content-Type': 'application/json' } },
    );
    data = await response.data.data;
    return data;
  } catch (error: any) {
    return {
      status: 'failed',
      error,
    };
  }
};

export const getAllFlowcharts: GetAllFlowcharts = async () => {
  try {
    const response = await axios.get(URL, { withCredentials: true });
    const data = response.data.data;
    return data;
  } catch (error) {
    return { status: 'failed', error };
  }
};

export const getFlowchart: GetFlowchart = async (id) => {
  try {
    const response = await axios.get(URL + `/${id}`, { withCredentials: true });
    const data = await response.data.data.data;
    return data;
  } catch (error) {
    return { status: 'failed', error };
  }
};

export const deleteFlowchart: DeleteFlowchart = async (id) => {
  try {
    const response = await fetch(URL + `/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('error occured while making request');
    const isDeleted = response.status === 204;
    if (isDeleted) {
      return { status: 'deleted', message: 'flowchart deleted' };
    }
    return response;
  } catch (error) {
    return { status: 'failed', message: (error as Error).message };
  }
};

export const patchFlowchart = async (id, body) => {
  try {
    const response = await axios.patch(URL + `/${id}`, body, {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.data.data;
    return data;
  } catch (error) {
    return { status: 'fail', error };
  }
};

// export const createFlowchart: CreateFlowchart = async (name, nodes) => {
//   let obj;
//   try {
//     const response = await fetch(URL, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         name: name,
//         nodes: nodes,
//       }),
//       credentials: 'include',
//     });
//     const data = await response.json();
//     if (!response.ok) throw new Error(data.message || 'response not ok');
//     // (response);
//     obj = data.data;
//     return obj;
//   } catch (error) {
//     obj = { status: 'failed', error: (error as Error).message };
//     return obj;
//   }
// };

// export const patchFlowchart = async function (id, body) {
//   let obj;
//   try {
//     const response = await fetch(URL + `/${id}`, {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body,
//       credentials: 'include',
//     });
//     if (!response.ok) return new Error('error occured while updating');
//     const data = await response.json();
//     obj = data.data;
//     return obj;
//   } catch (error) {
//     obj = { status: 'failed', error: (error as Error).message };
//     return obj;
//   }
// };
