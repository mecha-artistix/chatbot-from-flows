import type {
  Node,
  NodeProps,
  Connection,
  DefaultEdgeOptions,
  EdgeChange,
  NodeChange,
  EdgeProps,
  ReactFlowJsonObject,
  Edge,
  Viewport,
} from '@xyflow/react';

export interface IFlowchart {
  _id: string;
  name: string;
  createdAt: string;
  edges: [];
  nodes: [];
  user: string;
  viewport: Viewport;
}

export interface IFlowchartSlice {
  flowcharts: IFlowchart[];
  addFlowcharts: (flowcharts: IFlowchart[]) => void;
  deleteFlowchart: (id: string) => Promise<void>;
}

// export type Viewport = {
//   x: number;
//   y: number;
//   zoom: number;
// };

export interface IFlowBoardSlice {
  id: string;
  name: string;
  nodes: INode[];
  edges: Edge[];
  clickedNode: INode | null;
  viewport: Viewport;
  nodeTypes?: Record<String, React.ComponentType<NodeProps>>;
  edgeTypes?: Record<String, React.ComponentType<EdgeProps>>;
  defaultEdgeOptions?: DefaultEdgeOptions;

  setFlowboard: (flowchart) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  setNodes: (nodes: INode[]) => void;
  setEdges: (nodes: Edge[]) => void;
  setLayout: () => void;
  onNodeClick: (event, node) => void;
  addNode: (newNode: INode) => void;
  addEdge: (edge: Edge) => void;
  updateNodeData: (id: string, resData: INodeData) => void;
}

export interface INodeData {
  responseLabel?: string;
  responseType?: string;
  responseBot?: string;
  [key: string]: unknown;
}

export type INode = Node & {
  data?: INodeData;
};

interface IFlowStore extends IFlowBoardSlice, IFlowchartSlice {}

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
