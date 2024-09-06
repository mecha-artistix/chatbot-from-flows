import { INode } from '../../../types/flowchart';

const URL: string = import.meta.env.VITE_NODE_BASE_API + '/flowcharts';

type CreateFlowchart = (name: string, nodes: INode[]) => Promise<any>;
type GetAllFlowcharts = (name: string, nodes: INode[]) => Promise<any>;
type DeleteFlowchart = (id: string) => Promise<any>;
type GetFlowchart = (id: string) => Promise<any>;

export const createFlowchart: CreateFlowchart = async (name, nodes) => {
  let obj;
  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name,
        nodes: nodes,
      }),
      credentials: 'include',
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'response not ok');
    // console.log(response);
    obj = data.data;
    return obj;
  } catch (error) {
    obj = { status: 'failed', error: (error as Error).message };
    return obj;
  }
};

export const getAllFlowcharts: GetAllFlowcharts = async () => {
  let obj;
  try {
    const response = await fetch(URL, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'response not ok');
    obj = data.data;
    return obj;
  } catch (error) {
    obj = { status: 'failed', error: (error as Error).message };
    return obj;
  }
};

export const getFlowchart: GetFlowchart = async (id) => {
  let obj;
  try {
    const response = await fetch(URL + `/${id}`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'response not ok');
    obj = data.data;
    return obj;
  } catch (error) {
    obj = { status: 'failed', error: (error as Error).message };
    return obj;
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

export const updateFlowchart = async function (id, body) {
  let obj;
  try {
    const response = await fetch(URL + `/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
      credentials: 'include',
    });
    if (!response.ok) return new Error('error occured while updating');
    const data = await response.json();
    obj = data.data;
    return obj;
  } catch (error) {
    obj = { status: 'failed', error: (error as Error).message };
    return obj;
  }
};
