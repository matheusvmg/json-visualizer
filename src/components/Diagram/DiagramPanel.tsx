import React, { useEffect } from 'react';
import ReactFlow, { 
  Background, 
  useNodesState, 
  useEdgesState,
  ReactFlowProvider
} from 'reactflow';
import 'reactflow/dist/style.css';
import { JsonNode } from './JsonNode';
import { generateGraph } from './diagramUtils';
import { DiagramToolbar } from '../Toolbar/DiagramToolbar';

const nodeTypes = {
  jsonNode: JsonNode,
};

interface DiagramPanelProps {
  data: any;
  tabName: string;
  collapsedNodes: string[];
  onToggleCollapse: (nodeId: string) => void;
}

const Flow: React.FC<DiagramPanelProps> = ({ data, tabName, collapsedNodes, onToggleCollapse }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (data) {
      const { nodes: layoutedNodes, edges: layoutedEdges } = generateGraph(data, collapsedNodes);
      
      // Add onToggleCollapse to each node's data
      const nodesWithAction = layoutedNodes.map(node => ({
        ...node,
        data: { ...node.data, onToggleCollapse }
      }));

      setNodes(nodesWithAction);
      setEdges(layoutedEdges);
    }
  }, [data, collapsedNodes, onToggleCollapse, setNodes, setEdges]);

  return (
    <div className="diagram-panel" id="diagram-container">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={4}
        deleteKeyCode={null}
        nodesConnectable={false}
        edgesFocusable={false}
        edgesUpdatable={false}
        elementsSelectable={true}
      >
        <Background color="var(--border)" gap={20} />
        <DiagramToolbar tabName={tabName} />
      </ReactFlow>
    </div>
  );
};

export const DiagramPanel: React.FC<DiagramPanelProps> = (props) => (
  <ReactFlowProvider>
    <Flow {...props} />
  </ReactFlowProvider>
);
