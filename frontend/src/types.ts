export interface CodeNode {
  id: string;
  name: string;
  type: NodeType;
  loc: number;
  complexity: number;
  content: string;
  imports: string[];
  incomingCount: number;
  heatIndex: number;
  vulnerabilityScore: number;
  isGodObject?: boolean;
}

export interface CodeLink {
  source: string;
  target: string;
  value: number;
  type: 'dependency' | 'structure';
}

export interface GraphData {
  nodes: CodeNode[];
  links: CodeLink[];
}

export type NodeType = 'ui' | 'logic' | 'config' | 'util' | 'folder';
