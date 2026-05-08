import React, { useState, useEffect } from 'react';
import { Handle, Position, NodeToolbar, useReactFlow, MarkerType } from '@xyflow/react';
import type { NodeProps, Node } from '@xyflow/react';
import type { NodeData } from '../../../types/bpmTypes';

// ── Gerador de IDs por módulo ────────────────────────────────
// Não é um estado de componente: é um contador de módulo estável.
// Evitamos variável mutável "solta" no escopo global usando módulo ES.
let _nodeCounterModule = 1000;
const genId = () => `node_${_nodeCounterModule++}`;

// ── Helper: handles nos 4 lados (source + target) ───────────
function NodeHandles() {
  return (
    <>
      {/* Primários — sempre visíveis */}
      <Handle type="target" position={Position.Top}    id="target-top"    className="bpm-handle" />
      <Handle type="source" position={Position.Bottom} id="source-bottom" className="bpm-handle" />
      {/* Laterais — visíveis no hover */}
      <Handle type="source" position={Position.Right}  id="source-right"  className="bpm-handle bpm-handle--side" />
      <Handle type="target" position={Position.Left}   id="target-left"   className="bpm-handle bpm-handle--side" />
      <Handle type="source" position={Position.Left}   id="source-left"   className="bpm-handle bpm-handle--side" />
      <Handle type="target" position={Position.Right}  id="target-right"  className="bpm-handle bpm-handle--side" />
      <Handle type="source" position={Position.Top}    id="source-top"    className="bpm-handle bpm-handle--side" />
      <Handle type="target" position={Position.Bottom} id="target-bottom" className="bpm-handle bpm-handle--side" />
    </>
  );
}

// ── Tipos disponíveis no picker ──────────────────────────────
const ADD_TYPES = [
  { type: 'task',         label: 'Tarefa de Usuário',    icon: 'fa-regular fa-user',        color: 'var(--bpm-node-task)',        bg: 'var(--bpm-node-task-light)' },
  { type: 'gateway',      label: 'Gateway Exclusivo',    icon: 'fa-regular fa-code-branch',  color: 'var(--bpm-node-gateway-xor)', bg: 'var(--bpm-node-gateway-xor-light)' },
  { type: 'end',          label: 'Evento de Fim',        icon: 'fa-regular fa-stop',         color: 'var(--bpm-node-end)',         bg: 'var(--bpm-node-end-light)' },
  { type: 'intermediate', label: 'Evento Intermediário', icon: 'fa-regular fa-circle-dot',   color: 'var(--bpm-node-intermediate)', bg: 'var(--bpm-node-intermediate-light)' },
  { type: 'task-email',   label: 'Tarefa de Envio',      icon: 'fa-regular fa-envelope',     color: 'var(--bpm-node-task-email)', bg: 'var(--bpm-node-task-email-light)' },
];

type Dir = 'top' | 'right' | 'bottom' | 'left';

const DIRS: Array<{ dir: Dir; pos: Position }> = [
  { dir: 'top',    pos: Position.Top    },
  { dir: 'right',  pos: Position.Right  },
  { dir: 'bottom', pos: Position.Bottom },
  { dir: 'left',   pos: Position.Left   },
];

const DIR_HANDLES: Record<Dir, { sourceHandle: string; targetHandle: string }> = {
  right:  { sourceHandle: 'source-right',  targetHandle: 'target-left'   },
  left:   { sourceHandle: 'source-left',   targetHandle: 'target-right'  },
  bottom: { sourceHandle: 'source-bottom', targetHandle: 'target-top'    },
  top:    { sourceHandle: 'source-top',    targetHandle: 'target-bottom' },
};

// ── Toolbar direcional com 4 botões "+" ──────────────────────
function NodeActionToolbar({ nodeId, selected }: { nodeId: string; selected: boolean }) {
  const [openDir, setOpenDir] = useState<Dir | null>(null);
  const { getNode, setNodes, setEdges } = useReactFlow();

  useEffect(() => { if (!selected) setOpenDir(null); }, [selected]);

  useEffect(() => {
    if (!openDir) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest('.node-dir-menu') && !t.closest('.node-plus-btn')) setOpenDir(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openDir]);

  const addNode = (type: string, label: string, icon: string, color: string, bg: string, dir: Dir) => {
    const current = getNode(nodeId);
    if (!current) return;
    const w = (current as any).measured?.width  ?? 210;
    const h = (current as any).measured?.height ?? 90;
    const newId = genId();

    const offsets: Record<Dir, { x: number; y: number }> = {
      right:  { x: w + 60,    y: 0         },
      left:   { x: -(w + 60), y: 0         },
      bottom: { x: 0,         y: h + 70    },
      top:    { x: 0,         y: -(h + 70) },
    };

    const off = offsets[dir];
    const hdl = DIR_HANDLES[dir];
    const edgeColor = 'var(--bpm-edge-color)';

    setNodes(nds => [...nds, {
      id: newId, type,
      position: { x: current.position.x + off.x, y: current.position.y + off.y },
      data: { label, icon, color, bg, responsavel: '', prazo: 3 },
    }]);
    setEdges(eds => [...eds, {
      id: `e-${nodeId}-${newId}`,
      source: nodeId, target: newId,
      sourceHandle: hdl.sourceHandle,
      targetHandle: hdl.targetHandle,
      type: 'labeled', label: '', animated: false,
      markerEnd: { type: MarkerType.ArrowClosed, color: edgeColor, width: 16, height: 16 },
      style: { stroke: edgeColor, strokeWidth: 2 },
    }]);
    setOpenDir(null);
  };

  return (
    <>
      {DIRS.map(({ dir, pos }) => (
        <NodeToolbar key={dir} isVisible={selected} position={pos} offset={10}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <button
              className="node-plus-btn"
              onClick={e => { e.stopPropagation(); setOpenDir(v => v === dir ? null : dir); }}
              title={`Adicionar ${dir === 'top' ? 'acima' : dir === 'bottom' ? 'abaixo' : dir === 'left' ? 'à esquerda' : 'à direita'}`}
            >
              <i className="fa-regular fa-plus" />
            </button>

            {openDir === dir && (
              <div className={`node-dir-menu node-dir-menu--${dir}`}>
                <div className="node-action-group">Adicionar elemento</div>
                {ADD_TYPES.map(o => (
                  <button
                    key={o.type}
                    className="node-action-item"
                    onClick={e => { e.stopPropagation(); addNode(o.type, o.label, o.icon, o.color, o.bg, dir); }}
                  >
                    <div className="node-action-item-icon" style={{ background: o.bg, color: o.color }}>
                      <i className={o.icon} />
                    </div>
                    {o.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </NodeToolbar>
      ))}
    </>
  );
}

// ── Wrapper genérico ─────────────────────────────────────────
function NodeWrapper({
  id, children, selected, className,
}: {
  id: string; children: React.ReactNode; selected: boolean; className: string;
}) {
  return (
    <div className={`bpm-node ${className} ${selected ? 'bpm-node--selected' : ''}`}>
      {children}
      <NodeActionToolbar nodeId={id} selected={selected} />
    </div>
  );
}

// ── START ────────────────────────────────────────────────────
export function StartNode({ id, data, selected }: NodeProps<Node<NodeData>>) {
  return (
    <NodeWrapper id={id} className="bpm-node--start" selected={selected}>
      <NodeHandles />
      <div className="bpm-node-event-circle" style={{ background: 'var(--bpm-node-start)', boxShadow: '0 0 0 4px var(--bpm-node-start-light)' }}>
        <i className="fa-solid fa-play" style={{ fontSize: 10, color: 'var(--text-white)', marginLeft: 2 }} />
      </div>
      <div className="bpm-node-event-label">{data.label || 'Início'}</div>
    </NodeWrapper>
  );
}

// ── END ──────────────────────────────────────────────────────
export function EndNode({ id, data, selected }: NodeProps<Node<NodeData>>) {
  return (
    <NodeWrapper id={id} className="bpm-node--end" selected={selected}>
      <NodeHandles />
      <div className="bpm-node-event-circle" style={{ background: 'var(--bpm-node-end)', boxShadow: '0 0 0 4px var(--bpm-node-end-light)' }}>
        <i className="fa-solid fa-stop" style={{ fontSize: 10, color: 'var(--text-white)' }} />
      </div>
      <div className="bpm-node-event-label">{data.label || 'Fim'}</div>
    </NodeWrapper>
  );
}

// ── INTERMEDIATE ─────────────────────────────────────────────
export function IntermediateNode({ id, data, selected }: NodeProps<Node<NodeData>>) {
  return (
    <NodeWrapper id={id} className="bpm-node--intermediate" selected={selected}>
      <NodeHandles />
      <div className="bpm-node-event-circle" style={{ background: 'var(--bpm-node-intermediate)', boxShadow: '0 0 0 4px var(--bpm-node-intermediate-light)', border: '3px solid var(--bg-white)' }}>
        <i className="fa-regular fa-circle-dot" style={{ fontSize: 10, color: 'var(--text-white)' }} />
      </div>
      <div className="bpm-node-event-label">{data.label || 'Intermediário'}</div>
    </NodeWrapper>
  );
}

// ── TASK (Humana) ────────────────────────────────────────────
export function TaskNode({ id, data, selected }: NodeProps<Node<NodeData>>) {
  return (
    <NodeWrapper id={id} className="bpm-node--task" selected={selected}>
      <NodeHandles />
      <div className="bpm-node-header bpm-node-header--task">
        <div className="bpm-node-icon bpm-node-icon--task">
          <i className="fa-regular fa-user" />
        </div>
        <span className="bpm-node-type-label bpm-node-type-label--task">Tarefa de Usuário</span>
        {data.ator && <span className="bpm-node-badge">{data.ator}</span>}
      </div>
      <div className="bpm-node-body">
        <div className="bpm-node-title">{data.label || 'Nova Tarefa'}</div>
        {data.descricao && <div className="bpm-node-desc">{data.descricao}</div>}
        {(data.responsavel || (data.prazo && data.prazoTipo !== 'sem-prazo')) && (
          <div className="bpm-node-meta">
            {data.responsavel && (
              <span className="bpm-node-meta-item"><i className="fa-regular fa-user" />{data.responsavel}</span>
            )}
            {data.prazo && data.prazoTipo !== 'sem-prazo' && (
              <span className="bpm-node-meta-item"><i className="fa-regular fa-clock" />{data.prazo}d</span>
            )}
          </div>
        )}
      </div>
    </NodeWrapper>
  );
}

// ── TASK SYSTEM ──────────────────────────────────────────────
export function TaskSystemNode({ id, data, selected }: NodeProps<Node<NodeData>>) {
  return (
    <NodeWrapper id={id} className="bpm-node--task" selected={selected}>
      <NodeHandles />
      <div className="bpm-node-header bpm-node-header--system">
        <div className="bpm-node-icon bpm-node-icon--system">
          <i className="fa-regular fa-gear" />
        </div>
        <span className="bpm-node-type-label bpm-node-type-label--system">Sistema</span>
      </div>
      <div className="bpm-node-body">
        <div className="bpm-node-title">{data.label || 'Tarefa de Sistema'}</div>
        {data.descricao && <div className="bpm-node-desc">{data.descricao}</div>}
      </div>
    </NodeWrapper>
  );
}

// ── TASK SERVICE ─────────────────────────────────────────────
export function TaskServiceNode({ id, data, selected }: NodeProps<Node<NodeData>>) {
  return (
    <NodeWrapper id={id} className="bpm-node--task" selected={selected}>
      <NodeHandles />
      <div className="bpm-node-header bpm-node-header--service">
        <div className="bpm-node-icon bpm-node-icon--service">
          <i className="fa-regular fa-server" />
        </div>
        <span className="bpm-node-type-label bpm-node-type-label--service">Tarefa de Serviço</span>
      </div>
      <div className="bpm-node-body">
        <div className="bpm-node-title">{data.label || 'Tarefa de Serviço'}</div>
        {data.descricao && <div className="bpm-node-desc">{data.descricao}</div>}
      </div>
    </NodeWrapper>
  );
}

// ── TASK SCRIPT ──────────────────────────────────────────────
export function TaskScriptNode({ id, data, selected }: NodeProps<Node<NodeData>>) {
  return (
    <NodeWrapper id={id} className="bpm-node--task" selected={selected}>
      <NodeHandles />
      <div className="bpm-node-header bpm-node-header--script">
        <div className="bpm-node-icon bpm-node-icon--script">
          <i className="fa-regular fa-code" />
        </div>
        <span className="bpm-node-type-label bpm-node-type-label--script">Script</span>
      </div>
      <div className="bpm-node-body">
        <div className="bpm-node-title">{data.label || 'Script'}</div>
        {data.descricao && <div className="bpm-node-desc">{data.descricao}</div>}
      </div>
    </NodeWrapper>
  );
}

// ── TASK EMAIL ───────────────────────────────────────────────
export function TaskEmailNode({ id, data, selected }: NodeProps<Node<NodeData>>) {
  return (
    <NodeWrapper id={id} className="bpm-node--task" selected={selected}>
      <NodeHandles />
      <div className="bpm-node-header bpm-node-header--email">
        <div className="bpm-node-icon bpm-node-icon--email">
          <i className="fa-regular fa-envelope" />
        </div>
        <span className="bpm-node-type-label bpm-node-type-label--email">Tarefa de Envio</span>
      </div>
      <div className="bpm-node-body">
        <div className="bpm-node-title">{data.label || 'Enviar E-mail'}</div>
        {data.descricao && <div className="bpm-node-desc">{data.descricao}</div>}
      </div>
    </NodeWrapper>
  );
}

// ── GATEWAY (XOR/Paralelo) ───────────────────────────────────
export function GatewayNode({ id, data, selected }: NodeProps<Node<NodeData>>) {
  const isParallel = data.type === 'paralelo';
  const colorVar = isParallel ? 'var(--bpm-node-gateway-par)' : 'var(--bpm-node-gateway-xor)';
  const icon = isParallel ? 'fa-regular fa-arrows-split-up-and-left' : 'fa-regular fa-code-branch';
  const label = isParallel ? 'Gateway Paralelo' : 'Gateway Exclusivo';

  return (
    <NodeWrapper id={id} className="bpm-node--gateway" selected={selected}>
      <Handle type="target" position={Position.Top}    id="target-top"    className="bpm-handle" />
      <Handle type="source" position={Position.Bottom} id="source-bottom" className="bpm-handle" />
      <Handle type="source" position={Position.Left}   id="source-left"   className="bpm-handle" />
      <Handle type="source" position={Position.Right}  id="source-right"  className="bpm-handle" />
      <Handle type="target" position={Position.Left}   id="target-left"   className="bpm-handle bpm-handle--side" />
      <Handle type="target" position={Position.Right}  id="target-right"  className="bpm-handle bpm-handle--side" />
      <div className="bpm-node-gateway-diamond" style={{ borderColor: colorVar }}>
        <div className="bpm-node-gateway-icon" style={{ color: colorVar }}>
          <i className={icon} />
        </div>
      </div>
      <div className="bpm-node-gateway-label" style={{ color: colorVar }}>
        {data.label || label}
      </div>
    </NodeWrapper>
  );
}

// ── GATEWAY INCLUSIVO (OR) ───────────────────────────────────
export function GatewayInclusivoNode({ id, data, selected }: NodeProps<Node<NodeData>>) {
  return (
    <NodeWrapper id={id} className="bpm-node--gateway" selected={selected}>
      <Handle type="target" position={Position.Top}    id="target-top"    className="bpm-handle" />
      <Handle type="source" position={Position.Bottom} id="source-bottom" className="bpm-handle" />
      <Handle type="source" position={Position.Left}   id="source-left"   className="bpm-handle" />
      <Handle type="source" position={Position.Right}  id="source-right"  className="bpm-handle" />
      <Handle type="target" position={Position.Left}   id="target-left"   className="bpm-handle bpm-handle--side" />
      <Handle type="target" position={Position.Right}  id="target-right"  className="bpm-handle bpm-handle--side" />
      <div className="bpm-node-gateway-diamond" style={{ borderColor: 'var(--bpm-node-gateway-inc)' }}>
        <div className="bpm-node-gateway-icon" style={{ color: 'var(--bpm-node-gateway-inc)' }}>
          <i className="fa-regular fa-circle-nodes" />
        </div>
      </div>
      <div className="bpm-node-gateway-label" style={{ color: 'var(--bpm-node-gateway-inc)' }}>
        {data.label || 'Gateway Inclusivo'}
      </div>
    </NodeWrapper>
  );
}

// ── MENSAGEM ─────────────────────────────────────────────────
export function MsgNode({ id, data, selected }: NodeProps<Node<NodeData>>) {
  return (
    <NodeWrapper id={id} className="bpm-node--task" selected={selected}>
      <NodeHandles />
      <div className="bpm-node-header bpm-node-header--msg">
        <div className="bpm-node-icon bpm-node-icon--msg">
          <i className="fa-regular fa-message" />
        </div>
        <span className="bpm-node-type-label bpm-node-type-label--msg">Mensagem</span>
      </div>
      <div className="bpm-node-body">
        <div className="bpm-node-title">{data.label || 'Enviar Mensagem'}</div>
      </div>
    </NodeWrapper>
  );
}

// ── NOTIFICAÇÃO ──────────────────────────────────────────────
export function NotificationNode({ id, data, selected }: NodeProps<Node<NodeData>>) {
  return (
    <NodeWrapper id={id} className="bpm-node--task" selected={selected}>
      <NodeHandles />
      <div className="bpm-node-header bpm-node-header--notification">
        <div className="bpm-node-icon bpm-node-icon--notification">
          <i className="fa-regular fa-bell" />
        </div>
        <span className="bpm-node-type-label bpm-node-type-label--notification">Notificação</span>
      </div>
      <div className="bpm-node-body">
        <div className="bpm-node-title">{data.label || 'Notificar'}</div>
      </div>
    </NodeWrapper>
  );
}

// ── CHATBOT ──────────────────────────────────────────────────
export function ChatbotNode({ id, data, selected }: NodeProps<Node<NodeData>>) {
  return (
    <NodeWrapper id={id} className="bpm-node--task" selected={selected}>
      <NodeHandles />
      <div className="bpm-node-header bpm-node-header--chatbot">
        <div className="bpm-node-icon bpm-node-icon--chatbot">
          <i className="fa-regular fa-robot" />
        </div>
        <span className="bpm-node-type-label bpm-node-type-label--chatbot">Chatbot</span>
      </div>
      <div className="bpm-node-body">
        <div className="bpm-node-title">{data.label || 'Interação Chatbot'}</div>
      </div>
    </NodeWrapper>
  );
}
