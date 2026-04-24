import React, { useCallback, useRef, useState } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  Background,
  BackgroundVariant,
  MarkerType,
} from '@xyflow/react';
import type { Connection, Edge, Node } from '@xyflow/react';

import {
  StartNode, EndNode, TaskNode, GatewayNode,
  IntermediateNode, TaskSystemNode, TaskServiceNode,
  TaskScriptNode, TaskEmailNode, GatewayInclusivoNode,
  MsgNode, NotificationNode, ChatbotNode,
} from '../nodes/CustomNodes';
import '../nodes/nodes.css';

const nodeTypes = {
  start:              StartNode,
  end:                EndNode,
  task:               TaskNode,
  'task-system':      TaskSystemNode,
  'task-service':     TaskServiceNode,
  'task-script':      TaskScriptNode,
  'task-email':       TaskEmailNode,
  gateway:            GatewayNode,
  'gateway-paralelo': GatewayNode,
  'gateway-inclusivo':GatewayInclusivoNode,
  intermediate:       IntermediateNode,
  msg:                MsgNode,
  notification:       NotificationNode,
  chatbot:            ChatbotNode,
  'wait-response':    MsgNode,
};

let idCounter = 100;
const getId = () => `node_${idCounter++}`;

interface BpmCanvasProps {
  onNodeSelect: (node: Node | null) => void;
  onNodesUpdate?: (nodes: Node[]) => void;
  initialNodes?: Node[];
  initialEdges?: Edge[];
}

export default function BpmCanvas({
  onNodeSelect,
  onNodesUpdate,
  initialNodes = [],
  initialEdges = [],
}: BpmCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { screenToFlowPosition, zoomIn, zoomOut, fitView } = useReactFlow();
  const [zoom, setZoom] = useState(100);
  const [mode, setMode] = useState<'simples' | 'avancado'>('simples');

  const onConnect = useCallback((params: Connection | Edge) => {
    setEdges(eds => addEdge({
      ...params,
      animated: true,
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#0058db', width: 16, height: 16 },
      style: { stroke: '#0058db', strokeWidth: 2 },
    } as any, eds));
  }, [setEdges]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();

    const type  = event.dataTransfer.getData('application/reactflow');
    const label = event.dataTransfer.getData('application/reactflow-label');
    const icon  = event.dataTransfer.getData('application/reactflow-icon');
    const color = event.dataTransfer.getData('application/reactflow-color');
    const bg    = event.dataTransfer.getData('application/reactflow-bg');

    if (!type) return;

    const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });

    const newNode: Node = {
      id: getId(),
      type,
      position,
      data: { label, icon, color, bg, responsavel: '', prazo: 3 },
    };

    setNodes(nds => {
      const updated = [...nds, newNode];
      onNodesUpdate?.(updated);
      return updated;
    });
  }, [screenToFlowPosition, setNodes, onNodesUpdate]);

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    onNodeSelect(node);
  };

  const onPaneClick = () => {
    onNodeSelect(null);
  };

  const handleZoomIn = () => { zoomIn(); setZoom(z => Math.min(z + 10, 200)); };
  const handleZoomOut = () => { zoomOut(); setZoom(z => Math.max(z - 10, 30)); };
  const handleFitView = () => { fitView({ padding: 0.2 }); setZoom(100); };

  return (
    <div
      className="reactflow-wrapper"
      ref={reactFlowWrapper}
      style={{ flex: 1, height: '100%', minWidth: 0, position: 'relative' }}
    >
      {/* Toolbar flutuante */}
      <div className="canvas-toolbar">
        <div className="canvas-toolbar-group">
          <button className={`canvas-tool-btn ${mode === 'simples' ? 'active' : ''}`} onClick={() => setMode('simples')} title="Modo simples">
            <i className="fa-regular fa-square" />
            <span>Simples</span>
          </button>
          <button className={`canvas-tool-btn ${mode === 'avancado' ? 'active' : ''}`} onClick={() => setMode('avancado')} title="Modo avançado">
            <i className="fa-regular fa-sliders" />
            <span>Avançado</span>
          </button>
        </div>

        <div className="canvas-toolbar-sep" />

        <div className="canvas-toolbar-group">
          <button className="canvas-tool-btn" onClick={handleZoomOut} title="Reduzir zoom">
            <i className="fa-regular fa-minus" />
          </button>
          <span className="canvas-tool-zoom">{zoom}%</span>
          <button className="canvas-tool-btn" onClick={handleZoomIn} title="Aumentar zoom">
            <i className="fa-regular fa-plus" />
          </button>
          <button className="canvas-tool-btn" onClick={handleFitView} title="Ajustar ao canvas">
            <i className="fa-regular fa-expand" />
          </button>
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.25, minZoom: 0.4, maxZoom: 1.5 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1.5}
          color="var(--border-medium)"
        />
      </ReactFlow>
    </div>
  );
}
