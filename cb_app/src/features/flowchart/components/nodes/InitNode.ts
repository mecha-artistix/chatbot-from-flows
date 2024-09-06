import { INode } from '../../../../types/flowchart';

export const initNodes: INode[] = [
  {
    id: 'node1',
    type: 'start_node',
    position: { x: 0, y: 0 },
    data: { label: '1st Node' },
  },
  {
    id: 'node2',
    type: 'response_node',
    position: { x: 500, y: 250 },
    data: { label: '2nd Node' },
  },
  {
    id: 'node3',
    position: { x: 800, y: 300 },
    data: { label: '3rd node' },
  },
];

export const startNode: INode = {
  id: 'start_node',
  type: 'start_node',
  draggable: false,
  position: {
    x: 200,
    y: 250,
  },
  data: { label: 'Start Here' },
};

export const initialNodes = [
  {
    id: '1',
    data: { label: 'Hello' },
    position: { x: 0, y: 0 },
    type: 'input',
  },
  {
    id: '2',
    data: { label: 'World' },
    position: { x: 100, y: 100 },
  },
];

export const initialEdges = [{ id: '1-2', source: '1', target: '2', label: 'to the', type: 'step' }];
