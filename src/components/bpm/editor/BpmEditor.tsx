import React, { useState, useCallback, useRef, Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';
import { MarkerType } from '@xyflow/react';
import type { NodeData, AiFlowNode, AiFlowEdge, BpmEditorRouteState } from '../../../types/bpmTypes';

// ── Error Boundary para capturar crashes de render ────────────
interface EBState { hasError: boolean; message: string }
class EditorErrorBoundary extends Component<{ children: ReactNode }, EBState> {
  state: EBState = { hasError: false, message: '' };
  static getDerivedStateFromError(err: Error): EBState {
    return { hasError: true, message: err.message };
  }
  componentDidCatch(err: Error, info: ErrorInfo) {
    console.error('[BpmEditor] Render error:', err, info.componentStack);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16, padding: 40 }}>
          <i className="fa-regular fa-triangle-exclamation" style={{ fontSize: 40, color: 'var(--danger)' }} />
          <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>Erro ao renderizar o painel</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 400, textAlign: 'center' }}>{this.state.message}</div>
          <button
            className="btn btn-primary"
            onClick={() => this.setState({ hasError: false, message: '' })}
          >
            Tentar novamente
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
import BpmSidebar from './BpmSidebar';
import BpmCanvas from './BpmCanvas';
import BpmProperties from './BpmProperties';
import { processTemplates } from '../../../data/flowMocks';
import { processos } from '../../../data/mockData';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import './BpmEditor.css';

// ── Conversão de nós gerados pela IA para formato React Flow ──

const AI_TYPE_MAP: Record<string, { rfType: string; icon: string; color: string; bg: string }> = {
  start:             { rfType: 'start',             icon: 'fa-regular fa-play',                    color: 'var(--bpm-node-start)',         bg: 'var(--bpm-node-start-light)' },
  end:               { rfType: 'end',               icon: 'fa-regular fa-stop',                    color: 'var(--bpm-node-end)',           bg: 'var(--bpm-node-end-light)' },
  human_task:        { rfType: 'task',              icon: 'fa-regular fa-user',                    color: 'var(--bpm-node-task)',          bg: 'var(--bpm-node-task-light)' },
  system_task:       { rfType: 'task-system',       icon: 'fa-regular fa-gear',                    color: 'var(--bpm-node-task-system)',   bg: 'var(--bpm-node-task-system-light)' },
  gateway_exclusive: { rfType: 'gateway',           icon: 'fa-regular fa-code-branch',             color: 'var(--bpm-node-gateway-xor)',  bg: 'var(--bpm-node-gateway-xor-light)' },
  gateway_parallel:  { rfType: 'gateway-paralelo',  icon: 'fa-regular fa-arrows-split-up-and-left',color: 'var(--bpm-node-gateway-par)',  bg: 'var(--bpm-node-gateway-par-light)' },
  message:           { rfType: 'msg',               icon: 'fa-regular fa-message',                 color: 'var(--bpm-node-msg)',           bg: 'var(--bpm-node-msg-light)' },
  notification:      { rfType: 'notification',      icon: 'fa-regular fa-bell',                    color: 'var(--bpm-node-notification)',  bg: 'var(--bpm-node-notification-light)' },
  chatbot:           { rfType: 'chatbot',           icon: 'fa-regular fa-robot',                   color: 'var(--bpm-node-chatbot)',       bg: 'var(--bpm-node-chatbot-light)' },
};

function convertAiNodes(flowNodes: AiFlowNode[]): Node<NodeData>[] {
  return flowNodes.map((n) => {
    const meta = AI_TYPE_MAP[n.type] ?? AI_TYPE_MAP['human_task'];
    return {
      id: n.id,
      type: meta.rfType,
      position: n.position ?? { x: 0, y: 0 },
      data: {
        label:       n.label       ?? 'Etapa',
        icon:        meta.icon,
        color:       meta.color,
        bg:          meta.bg,
        responsavel: n.responsible ?? '',
        prazo:       parseInt(n.deadline) || 3,
        descricao:   n.description ?? '',
      },
    };
  });
}

function convertAiEdges(flowEdges: AiFlowEdge[]): Edge[] {
  return flowEdges.map((e) => ({
    id:        e.id,
    source:    e.source,
    target:    e.target,
    label:     e.label ?? '',
    animated:  false,
    type:      'labeled',
    markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--bpm-edge-color)', width: 16, height: 16 },
    style:     { stroke: 'var(--bpm-edge-color)', strokeWidth: 2 },
  }));
}

// ── Componente principal ──────────────────────────────────────

export default function BpmEditor() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const routeState   = location.state as BpmEditorRouteState | null;
  const stateFlow    = routeState?.flow            ?? null;
  const aiFlow       = routeState?.aiGeneratedFlow ?? null;
  const activeAiFlow = aiFlow ?? stateFlow;   // aiGeneratedFlow tem prioridade

  const templateId = searchParams.get('template');
  const template   = templateId ? processTemplates[templateId] : null;
  const editingProcess = templateId ? processos.find(p => p.templateKey === templateId) : null;

  const [nodes, setNodes] = useState<Node<NodeData>[]>(() => {
    if (activeAiFlow) return convertAiNodes(activeAiFlow.nodes);
    if (template)     return template.nodes as Node<NodeData>[];
    return [];
  });

  const initialEdges: Edge[] = (() => {
    if (activeAiFlow) return convertAiEdges(activeAiFlow.edges);
    if (template)     return template.edges;
    return [];
  })();

  const [showAiBanner, setShowAiBanner] = useState(!!aiFlow);

  const [selectedNode, setSelectedNode] = useState<Node<NodeData> | null>(null);
  const [nodeUpdate, setNodeUpdate] = useState<{ id: string; data: NodeData; ts: number } | null>(null);

  // ── Simulação de fluxo com tokens animados ───────────────────
  const [simulando, setSimulando]         = useState(false);
  const [simAtivos, setSimAtivos]         = useState<Set<string>>(new Set());
  const [simConcluidos, setSimConcluidos] = useState<Set<string>>(new Set());
  const [simTokenEdges, setSimTokenEdges] = useState<Set<string>>(new Set());
  const [simTokenKey, setSimTokenKey]     = useState(0);
  const [simNomeAtual, setSimNomeAtual]   = useState('');
  const [liveEdges, setLiveEdges]         = useState<Edge[]>(initialEdges);

  // flag de abort — evita que timers rodando parem o fluxo após "Parar"
  const simAbortRef = useRef(false);

  const pararSimulacao = useCallback(() => {
    simAbortRef.current = true;
    setSimulando(false);
    setSimAtivos(new Set());
    setSimConcluidos(new Set());
    setSimTokenEdges(new Set());
    setSimNomeAtual('');
  }, []);

  const iniciarSimulacao = useCallback(() => {
    if (simulando) { pararSimulacao(); return; }

    const startNode = nodes.find(n => n.type === 'start');
    if (!startNode) { alert('Adicione um nó de início ao fluxo.'); return; }

    simAbortRef.current = false;
    setSimulando(true);
    setSimAtivos(new Set());
    setSimConcluidos(new Set());
    setSimTokenEdges(new Set());

    const edgesSnap = liveEdges;
    const visited = new Set<string>();

    // dur da animação da bolinha nas arestas (ms) — deve coincidir com dur do animateMotion
    const TOKEN_DUR = 900;
    // tempo que o nó fica "aceso" antes do token sair
    const NODE_DUR  = 500;

    const step = (nodeIds: string[]) => {
      if (simAbortRef.current || nodeIds.length === 0) {
        if (!simAbortRef.current) {
          setTimeout(() => {
            if (!simAbortRef.current) {
              setSimulando(false);
              setSimAtivos(new Set());
              setSimTokenEdges(new Set());
              setSimNomeAtual('');
            }
          }, 600);
        }
        return;
      }

      // 1. Ilumina os nós ativos
      setSimAtivos(new Set(nodeIds));
      const labels = nodeIds
        .map(id => nodes.find(n => n.id === id)?.data?.label ?? '')
        .filter(Boolean);
      setSimNomeAtual(labels.join(' / '));

      setTimeout(() => {
        if (simAbortRef.current) return;

        // 2. Calcula as arestas de saída de cada nó ativo
        const saindaEdgeIds = new Set<string>();
        const nextIds: string[] = [];

        nodeIds.forEach(id => {
          visited.add(id);
          const nexts = edgesSnap.filter(e => e.source === id);
          // gateway exclusivo → só o primeiro caminho
          // gateway paralelo → todos os caminhos (comportamento padrão)
          const nodeType = nodes.find(n => n.id === id)?.type ?? '';
          const take = nodeType === 'gateway' ? nexts.slice(0, 1) : nexts;

          take.forEach(e => {
            saindaEdgeIds.add(e.id);
            if (!visited.has(e.target)) {
              visited.add(e.target);
              nextIds.push(e.target);
            }
          });
        });

        // 3. Marca nós como concluídos e dispara tokens nas arestas
        setSimConcluidos(prev => { const s = new Set(prev); nodeIds.forEach(id => s.add(id)); return s; });
        setSimAtivos(new Set());

        if (saindaEdgeIds.size > 0) {
          setSimTokenEdges(saindaEdgeIds);
          setSimTokenKey(k => k + 1);   // força re-mount do SVG animateMotion

          // 4. Após a bolinha chegar, avança para os próximos nós
          setTimeout(() => {
            if (simAbortRef.current) return;
            setSimTokenEdges(new Set());
            setTimeout(() => step(nextIds), 150);
          }, TOKEN_DUR);
        } else {
          // Fim do fluxo
          setTimeout(() => step([]), 400);
        }
      }, NODE_DUR);
    };

    visited.add(startNode.id);
    step([startNode.id]);
  }, [simulando, nodes, liveEdges, pararSimulacao]);

  // ─────────────────────────────────────────────────────────────

  const nomeParam   = searchParams.get('nome');
  const editorTitle = activeAiFlow?.name ?? template?.title ?? nomeParam ?? 'Novo Processo';
  const editorStatus = editingProcess?.status === 'publicado' ? 'Publicado' : 'Rascunho';
  const editorStatusClass = editingProcess?.status === 'publicado' ? 'badge-success' : 'badge-warning';

  const updateNodeData = useCallback((id: string, data: NodeData) => {
    setNodes(prev => prev.map(n => (n.id === id ? { ...n, data } : n)));
    setSelectedNode(prev => (prev?.id === id ? { ...prev, data } : prev));
    setNodeUpdate({ id, data, ts: Date.now() });
  }, []);

  const changeNodeType = useCallback((id: string, newType: string, newData: Partial<NodeData>) => {
    setNodes(prev =>
      prev.map(n => (n.id === id ? { ...n, type: newType, data: { ...n.data, ...newData } } : n))
    );
    setSelectedNode(prev =>
      prev?.id === id ? { ...prev, type: newType, data: { ...prev.data, ...newData } } : prev
    );
  }, []);

  const handleNodesUpdate = useCallback((updated: Node<NodeData>[]) => {
    setNodes(updated);
  }, []);

  const handleEdgesUpdate = useCallback((updated: Edge[]) => {
    setLiveEdges(updated);
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
          <span className={`badge ${editorStatusClass}`}>
            <i className="fa-regular fa-circle" style={{ fontSize: 7 }} />
            {editorStatus}
          </span>
          {(aiFlow || stateFlow) && (
            <span className="badge badge-primary" style={{ marginLeft: 4 }}>
              <i className="fa-regular fa-sparkles" style={{ fontSize: 10, marginRight: 4 }} />
              Gerado pela IA
            </span>
          )}
        </div>
        <div className="bpm-editor-actions">
          <button
            className={`btn ${simulando ? 'btn-danger' : 'btn-secondary'}`}
            onClick={iniciarSimulacao}
          >
            <i className={`fa-regular fa-${simulando ? 'stop' : 'play'}`} />
            {simulando ? 'Parar' : 'Simular'}
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

      {/* Banner IA */}
      {showAiBanner && (
        <div className="bpm-ai-generated-banner">
          <i className="fa-regular fa-sparkles" style={{ fontSize: 14, color: '#1d4ed8' }} />
          <span>Fluxo gerado pelo assistente de IA — revise e salve quando estiver pronto</span>
          <button
            className="bpm-ai-banner-close"
            onClick={() => setShowAiBanner(false)}
            aria-label="Fechar aviso"
          >
            <i className="fa-regular fa-xmark" />
          </button>
        </div>
      )}

      {/* Workspace: paleta | canvas | propriedades */}
      <div className="bpm-editor-workspace">
        <EditorErrorBoundary>
          <ReactFlowProvider>
            <BpmSidebar />
            <BpmCanvas
              onNodeSelect={setSelectedNode}
              onNodesUpdate={handleNodesUpdate}
              onEdgesUpdate={handleEdgesUpdate}
              initialNodes={nodes}
              initialEdges={initialEdges}
              nodeUpdate={nodeUpdate}
              simAtivos={simAtivos}
              simConcluidos={simConcluidos}
              simTokenEdges={simTokenEdges}
              simTokenKey={simTokenKey}
            />
          </ReactFlowProvider>
        </EditorErrorBoundary>

        {/* HUD de simulação */}
        {simulando && (
          <div className="sim-hud">
            <div className="sim-hud-dot" />
            <div className="sim-hud-info">
              <span className="sim-hud-label">Simulando fluxo</span>
              {simNomeAtual && <span className="sim-hud-step">{simNomeAtual}</span>}
            </div>
            <button className="sim-hud-stop" onClick={pararSimulacao}>
              <i className="fa-regular fa-stop" style={{ fontSize: 10, marginRight: 4 }} />
              Parar
            </button>
          </div>
        )}
        <EditorErrorBoundary>
          <BpmProperties selectedNode={selectedNode} updateNodeData={updateNodeData} changeNodeType={changeNodeType} />
        </EditorErrorBoundary>
      </div>
    </div>
  );
}
