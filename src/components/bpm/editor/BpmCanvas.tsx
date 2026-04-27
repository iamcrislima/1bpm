import React, { useCallback, useRef, useState, useEffect, useLayoutEffect } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  Background,
  BackgroundVariant,
  MarkerType,
  EdgeLabelRenderer,
  BaseEdge,
  getSmoothStepPath,
} from '@xyflow/react';
import type { Connection, Edge, Node, EdgeProps } from '@xyflow/react';

import {
  StartNode, EndNode, TaskNode, GatewayNode,
  IntermediateNode, TaskSystemNode, TaskServiceNode,
  TaskScriptNode, TaskEmailNode, GatewayInclusivoNode,
  MsgNode, NotificationNode, ChatbotNode,
} from '../nodes/CustomNodes';
import '../nodes/nodes.css';

// ── Aresta com label editável + token de simulação ──────────
function LabeledEdge({
  id,
  sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition,
  style, markerEnd, selected,
  label, data,
}: EdgeProps) {
  const { setEdges } = useReactFlow();
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(String(label ?? ''));

  useEffect(() => { setText(String(label ?? '')); }, [label]);

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
  });

  const commit = useCallback(() => {
    setEdges(eds => eds.map(e => e.id === id ? { ...e, label: text } : e));
    setEditing(false);
  }, [id, text, setEdges]);

  const hasText = text.trim().length > 0;
  const isSimulating = Boolean((data as any)?.simulating);
  const simKey = (data as any)?.simKey ?? 0;

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />

      {/* Bolinha animada de simulação — percorre a aresta via animateMotion */}
      {isSimulating && (
        <g key={`tok-${id}-${simKey}`} style={{ pointerEvents: 'none' }}>
          {/* Anel externo branco (halo) */}
          <circle r="11" fill="white" opacity="0.85">
            <animateMotion
              dur="0.85s" repeatCount="1" fill="freeze" path={edgePath}
              calcMode="spline" keyTimes="0;1" keySplines="0.42 0 0.58 1"
            />
          </circle>
          {/* Bolinha verde */}
          <circle r="7" fill="#22c55e">
            <animateMotion
              dur="0.85s" repeatCount="1" fill="freeze" path={edgePath}
              calcMode="spline" keyTimes="0;1" keySplines="0.42 0 0.58 1"
            />
          </circle>
          {/* Brilho interno */}
          <circle r="3" fill="white" opacity="0.7">
            <animateMotion
              dur="0.85s" repeatCount="1" fill="freeze" path={edgePath}
              calcMode="spline" keyTimes="0;1" keySplines="0.42 0 0.58 1"
            />
          </circle>
        </g>
      )}

      <EdgeLabelRenderer>
        <div
          className="nodrag nopan"
          style={{
            position: 'absolute',
            transform: `translate(-50%,-50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
        >
          {editing ? (
            <input
              className="edge-label-input"
              value={text}
              onChange={e => setText(e.target.value)}
              onBlur={commit}
              onKeyDown={e => {
                if (e.key === 'Enter')  commit();
                if (e.key === 'Escape') { setText(String(label ?? '')); setEditing(false); }
              }}
              autoFocus
              placeholder="Ex: Sim, Não, Valor > 5000"
            />
          ) : (
            <div
              className={`edge-label-pill${hasText ? ' has-text' : ''}${selected ? ' selected' : ''}`}
              onClick={e => { e.stopPropagation(); setEditing(true); }}
              title={hasText ? 'Clique para editar a condição' : 'Clique para adicionar uma condição'}
            >
              {hasText ? text : selected ? 'condição' : null}
            </div>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

// ── Tipos de nó e aresta ─────────────────────────────────────
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

const edgeTypes = {
  labeled: LabeledEdge,
};

let idCounter = 100;
const getId = () => `node_${idCounter++}`;

interface NodePatch {
  id: string;
  data: Record<string, any>;
  ts: number;
}

interface BpmCanvasProps {
  onNodeSelect: (node: Node | null) => void;
  onNodesUpdate?: (nodes: Node[]) => void;
  onEdgesUpdate?: (edges: Edge[]) => void;
  initialNodes?: Node[];
  initialEdges?: Edge[];
  nodeUpdate?: NodePatch | null;
  simAtivos?: Set<string>;
  simConcluidos?: Set<string>;
  simTokenEdges?: Set<string>;
  simTokenKey?: number;
}

export default function BpmCanvas({
  onNodeSelect,
  onNodesUpdate,
  onEdgesUpdate,
  initialNodes = [],
  initialEdges = [],
  nodeUpdate = null,
  simAtivos,
  simConcluidos,
  simTokenEdges,
  simTokenKey = 0,
}: BpmCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { screenToFlowPosition, zoomIn, zoomOut, fitView } = useReactFlow();
  const [zoom, setZoom] = useState(100);
  const [mode, setMode] = useState<'simples' | 'avancado'>('simples');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Aplica patches de dados vindos do painel de propriedades em tempo real
  useLayoutEffect(() => {
    if (!nodeUpdate) return;
    setNodes(nds =>
      nds.map(n => n.id === nodeUpdate.id ? { ...n, data: nodeUpdate.data } : n)
    );
  }, [nodeUpdate, setNodes]);

  // Aplica classNames de simulação nos nós
  useLayoutEffect(() => {
    setNodes(nds => nds.map(n => ({
      ...n,
      className: simAtivos?.has(n.id)
        ? 'sim-ativo'
        : simConcluidos?.has(n.id)
          ? 'sim-concluido'
          : '',
    })));
  }, [simAtivos, simConcluidos, setNodes]);

  // Marca arestas com token de simulação (aciona a bolinha animada)
  useLayoutEffect(() => {
    setEdges(eds => eds.map(e => ({
      ...e,
      data: {
        ...((e.data as any) ?? {}),
        simulating: simTokenEdges?.has(e.id) ?? false,
        simKey: simTokenKey,
      },
    })));
  }, [simTokenEdges, simTokenKey, setEdges]);

  // Notifica o pai quando as arestas mudam (para lógica de simulação)
  useLayoutEffect(() => {
    onEdgesUpdate?.(edges);
  }, [edges, onEdgesUpdate]);

  // Helper para criar aresta com o tipo correto
  const makeEdge = useCallback((params: Connection | Edge, extra?: Partial<Edge>): Edge => ({
    ...params,
    id: `e-${params.source}-${params.target}-${Date.now()}`,
    animated: false,
    type: 'labeled',
    label: '',
    markerEnd: { type: MarkerType.ArrowClosed, color: '#0058db', width: 16, height: 16 },
    style: { stroke: '#0058db', strokeWidth: 2 },
    ...extra,
  } as Edge), []);

  const onConnect = useCallback((params: Connection | Edge) => {
    setEdges(eds => addEdge(makeEdge(params), eds));
  }, [setEdges, makeEdge]);

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

  // Delete key — remove selected node + connected edges
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Delete' && e.key !== 'Backspace') return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;
      if (!selectedNodeId) return;
      setNodes(nds => nds.filter(n => n.id !== selectedNodeId));
      setEdges(eds => eds.filter(e => e.source !== selectedNodeId && e.target !== selectedNodeId));
      setSelectedNodeId(null);
      onNodeSelect(null);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [selectedNodeId, setNodes, setEdges, onNodeSelect]);

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    onNodeSelect(node);
    setSelectedNodeId(node.id);
  };

  const onPaneClick = () => {
    onNodeSelect(null);
    setSelectedNodeId(null);
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
        edgeTypes={edgeTypes}
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
