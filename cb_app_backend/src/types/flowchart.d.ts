import { Date, Document } from 'mongoose';

export interface IFlowChart extends Document {
  name: string;
  createdAt?: Date;
  nodes?: INode[];
  edges?: IEdge[];
  bot?: Types.ObjectId;
  user: Types.ObjectId;
}

interface Position {
  x: number;
  y: number;
}

interface NodeData {
  id: string;
  label?: string;
  texts?: string[];
}

export interface INode extends Document {
  type?: string;
  position?: Position;
  draggable?: boolean;
  data?: NodeData;
  width?: number;
  height?: number;
  id: string;
  parent?: string;
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

export interface IEdge extends Document {
  source: string;
  sourceHandle?: string;
  target: string;
  targetHandle?: string | null;
  type?: string;
  data: EdgeData;
  style?: EdgeStyle;
  markerEnd?: MarkerEnd;
  id: string;
}
