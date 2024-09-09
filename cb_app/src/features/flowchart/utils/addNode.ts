import { INode, INodeData, IPosition } from '../../../types/flowchart';

type UseAddNode = (id: number, type: string, data: INodeData) => INode;

export const useAddNode: UseAddNode = (id, type, data) => {
  return {
    id: id,
    position: { x: 110, y: 0 },
    data: data,
    draggable: true,
    width: 100,
    height: 50,
    type: type,
  };
};
