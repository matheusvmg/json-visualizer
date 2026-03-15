import type { Node, Edge } from 'reactflow';
import dagre from 'dagre';

const nodeWidth = 220;
const nodeHeight = 150;

export const generateGraph = (data: any, collapsedNodes: string[] = []): { nodes: Node[]; edges: Edge[] } => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const traverse = (val: any, parentId: string | null = null, name: string = 'root') => {
    const id = parentId ? `${parentId}-${name}` : 'root';
    const isCollapsed = collapsedNodes.includes(id);
    
    if (val !== null && typeof val === 'object') {
      const isArray = Array.isArray(val);
      const props: any[] = [];
      const children: { key: string; value: any }[] = [];

      Object.entries(val).forEach(([key, value]) => {
        if (value !== null && typeof value === 'object') {
          children.push({ key, value });
        } else {
          props.push({ key, value });
        }
      });

      nodes.push({
        id,
        type: 'jsonNode',
        data: { 
          label: isArray ? `Array [${val.length}]` : name, 
          properties: props, 
          isArray,
          isCollapsed,
          hasChildren: children.length > 0
        },
        position: { x: 0, y: 0 },
      });

      if (parentId) {
        edges.push({
          id: `e-${parentId}-${id}`,
          source: parentId,
          target: id,
          animated: true,
          style: { stroke: 'var(--border)' },
          type: 'smoothstep',
        });
      }

      if (!isCollapsed) {
        children.forEach((child) => {
          traverse(child.value, id, child.key);
        });
      }
    } else {
      // Primitive values
      nodes.push({
        id,
        type: 'jsonNode',
        data: { label: name, properties: [{ key: name, value: val }] },
        position: { x: 0, y: 0 },
      });
    }
  };

  traverse(data);
  return getLayoutedElements(nodes, edges);
};

export const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ 
    rankdir: 'LR', 
    nodesep: 50, // Reduced for a tighter, more justified look
    ranksep: 140,
    ranker: 'network-simplex', // More robust for aligning nodes of same rank
    marginx: 20,
    marginy: 20
  });

  nodes.forEach((node) => {
    const isCollapsed = node.data?.isCollapsed;
    const height = isCollapsed ? 40 : nodeHeight;
    dagreGraph.setNode(node.id, { width: nodeWidth, height });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const isCollapsed = node.data?.isCollapsed;
    const height = isCollapsed ? 40 : nodeHeight;
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2 + (nodeHeight - height) / 2,
      },
    };
  });

  return { nodes: newNodes, edges };
};
