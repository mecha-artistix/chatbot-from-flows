import type { Node, NodeProps, Connection, DefaultEdgeOptions, EdgeChange, NodeChange } from '@xyflow/react';

export interface IFlowchartSlice {
  flowcharts: [];
  status: '' | 'loading' | 'failed' | 'success';
  error?: string;
  addFlowcharts: () => Promise<void>;
  deleteFlowchart: (id: string) => Promise<void>;
}

export interface IFlowBoardSlice {
  id: string;
  name: string;
  status: '' | 'loading' | 'failed' | 'success';
  error?: string;
  nodes: INode[];
  edges: Edge[];
  edgeTypes?: EdgeTypes;
  onNodesChange?: (changes: NodeChange[]) => void;
  onEdgesChange?: (changes: EdgeChange[]) => void;
  onConnect?: (connection: Connection) => void;
  defaultEdgeOptions?: DefaultEdgeOptions;
  setName?: (name: string) => Promise<void>;
  setFlowBoard?: (id: string) => Promise<void>;
  setNodes?: (nodes: INode[]) => void;
  setEdges?: (nodes: Edge[]) => void;
}

export interface INodeSlice {
  id?: number;
  nodeDrawerOpen: boolean;
  dataLabel?: string;
  currentNode?: null | INodeData;
  nextNodeId?: number;
  nodeTypes?: Record<String, React.ComponentType<NodeProps>>;
  addNode?: (node: INode) => void;
  addEdge?: (edge: EDGE) => void;
  setNodeDrawer?: (open: boolean) => void;
  setDataLabel?: (text: string) => void;
}

export interface INodeData {
  label?: string;
  texts?: string[];
  [key: string]: unknown;
}

export interface INode extends Node<INodeData> {
  type?: 'start_node' | 'response_node' | 'action_node' | 'custom_node';
}

interface IFlowStore extends INodeSlice, IFlowBoardSlice, IFlowchartSlice {}

export interface IEdge extends Document {
  source: string;
  sourceHandle?: string;
  target: string;
  targetHandle?: string | null;
  type?: string;
  data?: EdgeData;
  style?: EdgeStyle;
  markerEnd?: MarkerEnd;
  id: string;
}

interface EdgeData {
  label: string;
  inputs: string[];
}

interface EdgeStyle {
  stroke: string;
  strokeWidth: number;
}

interface MarkerEnd {
  type: string;
  width: number;
  height: number;
  color: string;
}

interface IPosition {
  x: number;
  y: number;
}
