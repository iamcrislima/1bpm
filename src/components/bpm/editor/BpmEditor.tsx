import { useState, useCallback } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';
import { MarkerType } from '@xyflow/react';
import BpmSidebar from './BpmSidebar';
import BpmCanvas from './BpmCanvas';
import BpmProperties from './BpmProperties';
import { processTemplates } from '../../../data/flowMocks';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import './BpmEditor.css';

// ── Conversão de nós gerados pela IA para formato React Flow ──

const AI_TYPE_MAP: Record<string, { rfType: string; icon: string; color: string; bg: string }> = {
  start:             { rfType: 'start',             icon: 'fa-regular fa-play',                         color: '#22c55e', bg: '#dcfce7' },
  end:               { rfType: 'end',               icon: 'fa-regular fa-stop',                         color: '#ef4444', bg: '#fee2e2' },
  human_task:        { rfType: 'task',              icon: 'fa-regular fa-user',                          color: '#0058db', bg: '#dce6f5' },
  system_task:       { rfType: 'task-system',       icon: 'fa-regular fa-gear',                          color: '#6366f1', bg: '#ede9fe' },
  gateway_exclusive: { rfType: 'gateway',           icon: 'fa-regular fa-code-branch',                   color: '#9333ea', bg: '#f3e8ff' },
  gateway_parallel:  { rfType: 'gateway-paralelo',  icon: 'fa-regular fa-arrows-split-up-and-left',      color: '#0ea5e9', bg: '#e0f2fe' },
  message:           { rfType: 'msg',               icon: 'fa-regular fa-message',                       color: '#2563eb', bg: '#dbeafe' },
  notification:      { rfType: 'notification',      icon: 'fa-regular fa-bell',                          color: '#d97706', bg: '#fef3c7' },
  chatbot:           { rfType: 'chatbot',           icon: 'fa-regular fa-robot',                         color: '#7c3aed', bg: '#ede9fe' },
};

function convertAiNodes(flowNodes: any[]): Node[] {
  return (flowNodes || []).map((n: any) => {
    const meta = AI_TYPE_MAP[n.type] ?? AI_TYPE_MAP['human_task'];
    return {
      id: n.id,
      type: meta.rfType,
      position: n.position ?? { x: 0, y: 0 },
      data: {
        label:      n.label       ?? 'Etapa',
        icon:       meta.icon,
        color:      meta.color,
        bg:         meta.bg,
        responsavel: n.responsible ?? '',
        prazo:      parseInt(n.deadline) || 3,
        descricao:  n.description ?? '',
      },
    };
  });
}

function convertAiEdges(flowEdges: any[]): Edge[] {
  return (flowEdges || []).map((e: any) => ({
    id:        e.id,
    source:    e.source,
    target:    e.target,
    label:     e.label ?? '',
    animated:  true,
    type:      'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed, color: '#0058db', width: 16, height: 16 },
    style:     { stroke: '#0058db', strokeWidth: 2 },
  }));
}

// ── Componente principal ──────────────────────────────────────

export default function BpmEditor() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Fluxo gerado pela IA (chega via navigate state do BpmAiAssistant)
  const stateFlow = (location.state as any)?.flow ?? null;

  const templateId = searchParams.get('template');
  const template   = templateId ? processTemplates[templateId] : null;

  // Nós iniciais: IA > template > vazio
  const [nodes, setNodes] = useState<Node[]>(() => {
    if (stateFlow) return convertAiNodes(stateFlow.nodes);
    if (template)  return template.nodes;
    return [];
  });

  // Arestas iniciais: IA > template > vazio
  const initialEdges: Edge[] = (() => {
    if (stateFlow) return convertAiEdges(stateFlow.edges);
    if (template)  return template.edges;
    return [];
  })();

  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // Título exibido no header do editor
  const nomeParam   = searchParams.get('nome');
  const editorTitle = stateFlow?.name ?? template?.title ?? nomeParam ?? 'Novo Processo';

  const updateNodeData = useCallback((id: string, data: any) => {
    setNodes(prev =>
      prev.map(n => (n.id === id ? { ...n, data } : n))
    );
    setSelectedNode(prev => (prev?.id === id ? { ...prev, data } : prev));
  }, []);

  const changeNodeType = useCallback((id: string, newType: string, newData: any) => {
    setNodes(prev =>
      prev.map(n => (n.id === id ? { ...n, type: newType, data: { ...n.data, ...newData } } : n))
    );
    setSelectedNode(prev =>
      prev?.id === id ? { ...prev, type: newType, data: { ...prev.data, ...newData } } : prev
    );
  }, []);

  const handleNodesUpdate = useCallback((updated: Node[]) => {
    setNodes(updated);
  }, []);

  return (
    <div className="bpm-editor-container animate-fade-in">
      {/* Top Header */}
      <div className="bpm-editor-header">
        <div className="bpm-editor-title">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => navigate('/processos/fluxos')}
            style={{ marginRight: 4 }}
          >
            <i className="fa-regular fa-chevron-left" />
            Sair
          </button>
          <div style={{ width: 1, height: 20, background: 'var(--border-light)', margin: '0 4px' }} />
          <h2>{editorTitle}</h2>
          <span className="badge badge-warning">
            <i className="fa-regular fa-circle" style={{ fontSize: 7 }} />
            Rascunho
          </span>
          {stateFlow && (
            <span className="badge badge-primary" style={{ marginLeft: 4 }}>
              <i className="fa-regular fa-sparkles" style={{ fontSize: 10, marginRight: 4 }} />
              Gerado pela IA
            </span>
          )}
        </div>
        <div className="bpm-editor-actions">
          <button className="btn btn-secondary">
            <i className="fa-regular fa-play" />
            Simular
          </button>
          <button className="btn btn-secondary">
            <i className="fa-regular fa-floppy-disk" />
            Salvar
          </button>
          <button className="btn btn-primary">
            <i className="fa-regular fa-rocket" />
            Publicar
          </button>
        </div>
      </div>

      {/* Workspace: paleta | canvas | propriedades */}
      <div className="bpm-editor-workspace">
        <ReactFlowProvider>
          <BpmSidebar />
          <BpmCanvas
            onNodeSelect={setSelectedNode}
            onNodesUpdate={handleNodesUpdate}
            initialNodes={nodes}
            initialEdges={initialEdges}
          />
        </ReactFlowProvider>
        <BpmProperties selectedNode={selectedNode} updateNodeData={updateNodeData} changeNodeType={changeNodeType} />
      </div>
    </div>
  );
}
