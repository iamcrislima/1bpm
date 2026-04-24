import React, { useState, useEffect, useRef } from 'react';
import { Handle, Position, NodeToolbar, useReactFlow, MarkerType } from '@xyflow/react';

// ── Gerador de IDs para novos nós ────────────────────────────
let _nodeCounter = 1000;
const genId = () => `node_${_nodeCounter++}`;

// ── Tipos disponíveis no picker ──────────────────────────────
const ADD_TYPES = [
  { type: 'task',         label: 'Tarefa de Usuário',    icon: 'fa-regular fa-user',        color: '#0058db', bg: '#dce6f5' },
  { type: 'gateway',      label: 'Gateway Exclusivo',    icon: 'fa-regular fa-code-branch',  color: '#9333ea', bg: '#f3e8ff' },
  { type: 'end',          label: 'Evento de Fim',        icon: 'fa-regular fa-stop',         color: '#ef4444', bg: '#fee2e2' },
  { type: 'intermediate', label: 'Evento Intermediário', icon: 'fa-regular fa-circle-dot',   color: '#f59e0b', bg: '#fef3c7' },
  { type: 'task-email',   label: 'Tarefa de Envio',      icon: 'fa-regular fa-envelope',     color: '#ea580c', bg: '#ffedd5' },
];

type Dir = 'top' | 'right' | 'bottom' | 'left';

const DIRS: Array<{ dir: Dir; pos: Position }> = [
  { dir: 'top',    pos: Position.Top    },
  { dir: 'right',  pos: Position.Right  },
  { dir: 'bottom', pos: Position.Bottom },
  { dir: 'left',   pos: Position.Left   },
];

// ── Toolbar direcional com 4 botões "+" ──────────────────────
function NodeActionToolbar({ nodeId, selected }: { nodeId: string; selected: boolean }) {
  const [openDir, setOpenDir] = useState<Dir | null>(null);
  const { getNode, setNodes, setEdges } = useReactFlow();

  useEffect(() => { if (!selected) setOpenDir(null); }, [selected]);

  useEffect(() => {
    if (!openDir) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.node-dir-menu') && !target.closest('.node-plus-btn')) {
        setOpenDir(null);
      }
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
      right:  { x: w + 60,   y: 0        },
      left:   { x: -(w + 60),y: 0        },
      bottom: { x: 0,        y: h + 70   },
      top:    { x: 0,        y: -(h + 70)},
    };

    const off = offsets[dir];
    setNodes(nds => [...nds, {
      id: newId, type,
      position: { x: current.position.x + off.x, y: current.position.y + off.y },
      data: { label, icon, color, bg, responsavel: '', prazo: 3 },
    }]);
    setEdges(eds => [...eds, {
      id: `e-${nodeId}-${newId}`,
      source: nodeId, target: newId,
      type: 'smoothstep', animated: true,
      markerEnd: { type: MarkerType.ArrowClosed, color: '#0058db', width: 16, height: 16 },
      style: { stroke: '#0058db', strokeWidth: 2 },
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

// ── Wrapper genérico para todos os nós ───────────────────────
function NodeWrapper({
  id,
  children,
  selected,
  className,
}: {
  id: string;
  children: React.ReactNode;
  selected: boolean;
  className: string;
}) {
  return (
    <div className={`bpm-node ${className} ${selected ? 'bpm-node--selected' : ''}`}>
      {children}
      <NodeActionToolbar nodeId={id} selected={selected} />
    </div>
  );
}

// ── START ────────────────────────────────────────────────────
export function StartNode({ id, data, selected }: { id: string; data: any; selected: boolean }) {
  return (
    <NodeWrapper id={id} className="bpm-node--start" selected={selected}>
      <div className="bpm-node-event-circle" style={{ background: '#22c55e', boxShadow: '0 0 0 4px #dcfce7' }}>
        <i className="fa-solid fa-play" style={{ fontSize: 10, color: '#fff', marginLeft: 2 }} />
      </div>
      <div className="bpm-node-event-label">{data.label || 'Início'}</div>
      <Handle type="source" position={Position.Bottom} id="source" className="bpm-handle" />
    </NodeWrapper>
  );
}

// ── END ──────────────────────────────────────────────────────
export function EndNode({ id, data, selected }: { id: string; data: any; selected: boolean }) {
  return (
    <NodeWrapper id={id} className="bpm-node--end" selected={selected}>
      <Handle type="target" position={Position.Top} id="target" className="bpm-handle" />
      <div className="bpm-node-event-circle" style={{ background: '#ef4444', boxShadow: '0 0 0 4px #fee2e2' }}>
        <i className="fa-solid fa-stop" style={{ fontSize: 10, color: '#fff' }} />
      </div>
      <div className="bpm-node-event-label">{data.label || 'Fim'}</div>
    </NodeWrapper>
  );
}

// ── INTERMEDIATE ─────────────────────────────────────────────
export function IntermediateNode({ id, data, selected }: { id: string; data: any; selected: boolean }) {
  return (
    <NodeWrapper id={id} className="bpm-node--intermediate" selected={selected}>
      <Handle type="target" position={Position.Top} id="target" className="bpm-handle" />
      <div className="bpm-node-event-circle" style={{ background: '#f59e0b', boxShadow: '0 0 0 4px #fef3c7', border: '3px solid #fff' }}>
        <i className="fa-regular fa-circle-dot" style={{ fontSize: 10, color: '#fff' }} />
      </div>
      <div className="bpm-node-event-label">{data.label || 'Intermediário'}</div>
      <Handle type="source" position={Position.Bottom} id="source" className="bpm-handle" />
    </NodeWrapper>
  );
}

// ── TASK (Humana) ────────────────────────────────────────────
export function TaskNode({ id, data, selected }: { id: string; data: any; selected: boolean }) {
  return (
    <NodeWrapper id={id} className="bpm-node--task" selected={selected}>
      <Handle type="target" position={Position.Top} id="target" className="bpm-handle" />
      <div className="bpm-node-header" style={{ background: '#0058db18', borderBottom: '1px solid #0058db22' }}>
        <div className="bpm-node-icon" style={{ background: '#dce6f5', color: '#0058db' }}>
          <i className="fa-regular fa-user" />
        </div>
        <span className="bpm-node-type-label" style={{ color: '#0058db' }}>Tarefa de Usuário</span>
        {data.ator && <span className="bpm-node-badge">{data.ator}</span>}
      </div>
      <div className="bpm-node-body">
        <div className="bpm-node-title">{data.label || 'Nova Tarefa'}</div>
        {data.descricao && <div className="bpm-node-desc">{data.descricao}</div>}
        {(data.responsavel || data.prazo) && (
          <div className="bpm-node-meta">
            {data.responsavel && (
              <span className="bpm-node-meta-item">
                <i className="fa-regular fa-user" />
                {data.responsavel}
              </span>
            )}
            {data.prazo !== undefined && data.prazoTipo !== 'sem-prazo' && (
              <span className="bpm-node-meta-item">
                <i className="fa-regular fa-clock" />
                {data.prazo}d
              </span>
            )}
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} id="source" className="bpm-handle" />
    </NodeWrapper>
  );
}

// ── TASK SYSTEM ──────────────────────────────────────────────
export function TaskSystemNode({ id, data, selected }: { id: string; data: any; selected: boolean }) {
  return (
    <NodeWrapper id={id} className="bpm-node--task" selected={selected}>
      <Handle type="target" position={Position.Top} id="target" className="bpm-handle" />
      <div className="bpm-node-header" style={{ background: '#6366f118', borderBottom: '1px solid #6366f122' }}>
        <div className="bpm-node-icon" style={{ background: '#ede9fe', color: '#6366f1' }}>
          <i className="fa-regular fa-gear" />
        </div>
        <span className="bpm-node-type-label" style={{ color: '#6366f1' }}>Sistema</span>
      </div>
      <div className="bpm-node-body">
        <div className="bpm-node-title">{data.label || 'Tarefa de Sistema'}</div>
        {data.descricao && <div className="bpm-node-desc">{data.descricao}</div>}
      </div>
      <Handle type="source" position={Position.Bottom} id="source" className="bpm-handle" />
    </NodeWrapper>
  );
}

// ── TASK SERVICE ─────────────────────────────────────────────
export function TaskServiceNode({ id, data, selected }: { id: string; data: any; selected: boolean }) {
  return (
    <NodeWrapper id={id} className="bpm-node--task" selected={selected}>
      <Handle type="target" position={Position.Top} id="target" className="bpm-handle" />
      <div className="bpm-node-header" style={{ background: '#0891b218', borderBottom: '1px solid #0891b222' }}>
        <div className="bpm-node-icon" style={{ background: '#cffafe', color: '#0891b2' }}>
          <i className="fa-regular fa-server" />
        </div>
        <span className="bpm-node-type-label" style={{ color: '#0891b2' }}>Tarefa de Serviço</span>
      </div>
      <div className="bpm-node-body">
        <div className="bpm-node-title">{data.label || 'Tarefa de Serviço'}</div>
        {data.descricao && <div className="bpm-node-desc">{data.descricao}</div>}
      </div>
      <Handle type="source" position={Position.Bottom} id="source" className="bpm-handle" />
    </NodeWrapper>
  );
}

// ── TASK SCRIPT ──────────────────────────────────────────────
export function TaskScriptNode({ id, data, selected }: { id: string; data: any; selected: boolean }) {
  return (
    <NodeWrapper id={id} className="bpm-node--task" selected={selected}>
      <Handle type="target" position={Position.Top} id="target" className="bpm-handle" />
      <div className="bpm-node-header" style={{ background: '#7c3aed18', borderBottom: '1px solid #7c3aed22' }}>
        <div className="bpm-node-icon" style={{ background: '#ede9fe', color: '#7c3aed' }}>
          <i className="fa-regular fa-code" />
        </div>
        <span className="bpm-node-type-label" style={{ color: '#7c3aed' }}>Script</span>
      </div>
      <div className="bpm-node-body">
        <div className="bpm-node-title">{data.label || 'Script'}</div>
        {data.descricao && <div className="bpm-node-desc">{data.descricao}</div>}
      </div>
      <Handle type="source" position={Position.Bottom} id="source" className="bpm-handle" />
    </NodeWrapper>
  );
}

// ── TASK EMAIL ───────────────────────────────────────────────
export function TaskEmailNode({ id, data, selected }: { id: string; data: any; selected: boolean }) {
  return (
    <NodeWrapper id={id} className="bpm-node--task" selected={selected}>
      <Handle type="target" position={Position.Top} id="target" className="bpm-handle" />
      <div className="bpm-node-header" style={{ background: '#ea580c18', borderBottom: '1px solid #ea580c22' }}>
        <div className="bpm-node-icon" style={{ background: '#ffedd5', color: '#ea580c' }}>
          <i className="fa-regular fa-envelope" />
        </div>
        <span className="bpm-node-type-label" style={{ color: '#ea580c' }}>Tarefa de Envio</span>
      </div>
      <div className="bpm-node-body">
        <div className="bpm-node-title">{data.label || 'Enviar E-mail'}</div>
        {data.descricao && <div className="bpm-node-desc">{data.descricao}</div>}
      </div>
      <Handle type="source" position={Position.Bottom} id="source" className="bpm-handle" />
    </NodeWrapper>
  );
}

// ── GATEWAY (XOR/Paralelo) ───────────────────────────────────
export function GatewayNode({ id, data, selected }: { id: string; data: any; selected: boolean }) {
  const isParallel = data.type === 'paralelo';
  const color = isParallel ? '#0ea5e9' : '#9333ea';
  const icon  = isParallel ? 'fa-regular fa-arrows-split-up-and-left' : 'fa-regular fa-code-branch';
  const label = isParallel ? 'Gateway Paralelo' : 'Gateway Exclusivo';

  return (
    <NodeWrapper id={id} className="bpm-node--gateway" selected={selected}>
      <Handle type="target" position={Position.Top}   id="target" className="bpm-handle" />
      <div className="bpm-node-gateway-diamond" style={{ borderColor: color }}>
        <div className="bpm-node-gateway-icon" style={{ color }}>
          <i className={icon} />
        </div>
      </div>
      <div className="bpm-node-gateway-label" style={{ color }}>
        {data.label || label}
      </div>
      <Handle type="source" position={Position.Bottom} id="source-bottom" className="bpm-handle" />
      <Handle type="source" position={Position.Left}   id="source-left"   className="bpm-handle" />
      <Handle type="source" position={Position.Right}  id="source-right"  className="bpm-handle" />
    </NodeWrapper>
  );
}

// ── GATEWAY INCLUSIVO (OR) ────────────────────────────────────
export function GatewayInclusivoNode({ id, data, selected }: { id: string; data: any; selected: boolean }) {
  return (
    <NodeWrapper id={id} className="bpm-node--gateway" selected={selected}>
      <Handle type="target" position={Position.Top}   id="target" className="bpm-handle" />
      <div className="bpm-node-gateway-diamond" style={{ borderColor: '#10b981' }}>
        <div className="bpm-node-gateway-icon" style={{ color: '#10b981' }}>
          <i className="fa-regular fa-circle-nodes" />
        </div>
      </div>
      <div className="bpm-node-gateway-label" style={{ color: '#10b981' }}>
        {data.label || 'Gateway Inclusivo'}
      </div>
      <Handle type="source" position={Position.Bottom} id="source-bottom" className="bpm-handle" />
      <Handle type="source" position={Position.Left}   id="source-left"   className="bpm-handle" />
      <Handle type="source" position={Position.Right}  id="source-right"  className="bpm-handle" />
    </NodeWrapper>
  );
}

// ── MENSAGEM ─────────────────────────────────────────────────
export function MsgNode({ id, data, selected }: { id: string; data: any; selected: boolean }) {
  return (
    <NodeWrapper id={id} className="bpm-node--task" selected={selected}>
      <Handle type="target" position={Position.Top} id="target" className="bpm-handle" />
      <div className="bpm-node-header" style={{ background: '#2563eb18', borderBottom: '1px solid #2563eb22' }}>
        <div className="bpm-node-icon" style={{ background: '#dbeafe', color: '#2563eb' }}>
          <i className="fa-regular fa-message" />
        </div>
        <span className="bpm-node-type-label" style={{ color: '#2563eb' }}>Mensagem</span>
      </div>
      <div className="bpm-node-body">
        <div className="bpm-node-title">{data.label || 'Enviar Mensagem'}</div>
      </div>
      <Handle type="source" position={Position.Bottom} id="source" className="bpm-handle" />
    </NodeWrapper>
  );
}

// ── NOTIFICAÇÃO ──────────────────────────────────────────────
export function NotificationNode({ id, data, selected }: { id: string; data: any; selected: boolean }) {
  return (
    <NodeWrapper id={id} className="bpm-node--task" selected={selected}>
      <Handle type="target" position={Position.Top} id="target" className="bpm-handle" />
      <div className="bpm-node-header" style={{ background: '#d9770618', borderBottom: '1px solid #d9770622' }}>
        <div className="bpm-node-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
          <i className="fa-regular fa-bell" />
        </div>
        <span className="bpm-node-type-label" style={{ color: '#d97706' }}>Notificação</span>
      </div>
      <div className="bpm-node-body">
        <div className="bpm-node-title">{data.label || 'Notificar'}</div>
      </div>
      <Handle type="source" position={Position.Bottom} id="source" className="bpm-handle" />
    </NodeWrapper>
  );
}

// ── CHATBOT ──────────────────────────────────────────────────
export function ChatbotNode({ id, data, selected }: { id: string; data: any; selected: boolean }) {
  return (
    <NodeWrapper id={id} className="bpm-node--task" selected={selected}>
      <Handle type="target" position={Position.Top} id="target" className="bpm-handle" />
      <div className="bpm-node-header" style={{ background: '#7c3aed18', borderBottom: '1px solid #7c3aed22' }}>
        <div className="bpm-node-icon" style={{ background: '#ede9fe', color: '#7c3aed' }}>
          <i className="fa-regular fa-robot" />
        </div>
        <span className="bpm-node-type-label" style={{ color: '#7c3aed' }}>Chatbot</span>
      </div>
      <div className="bpm-node-body">
        <div className="bpm-node-title">{data.label || 'Interação Chatbot'}</div>
      </div>
      <Handle type="source" position={Position.Bottom} id="source" className="bpm-handle" />
    </NodeWrapper>
  );
}
