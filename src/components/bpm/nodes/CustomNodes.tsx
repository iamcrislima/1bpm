import React from 'react';
import { Handle, Position } from '@xyflow/react';

// ── Wrapper genérico para todos os nós ───────────────────────
function NodeWrapper({
  children,
  selected,
  className,
}: {
  children: React.ReactNode;
  selected: boolean;
  className: string;
}) {
  return (
    <div className={`bpm-node ${className} ${selected ? 'bpm-node--selected' : ''}`}>
      {children}
    </div>
  );
}

// ── START ────────────────────────────────────────────────────
export function StartNode({ data, selected }: { data: any; selected: boolean }) {
  return (
    <NodeWrapper className="bpm-node--start" selected={selected}>
      <div className="bpm-node-event-circle" style={{ background: '#22c55e', boxShadow: '0 0 0 4px #dcfce7' }}>
        <i className="fa-solid fa-play" style={{ fontSize: 10, color: '#fff', marginLeft: 2 }} />
      </div>
      <div className="bpm-node-event-label">{data.label || 'Início'}</div>
      <Handle type="source" position={Position.Bottom} id="source" className="bpm-handle" />
    </NodeWrapper>
  );
}

// ── END ──────────────────────────────────────────────────────
export function EndNode({ data, selected }: { data: any; selected: boolean }) {
  return (
    <NodeWrapper className="bpm-node--end" selected={selected}>
      <Handle type="target" position={Position.Top} id="target" className="bpm-handle" />
      <div className="bpm-node-event-circle" style={{ background: '#ef4444', boxShadow: '0 0 0 4px #fee2e2' }}>
        <i className="fa-solid fa-stop" style={{ fontSize: 10, color: '#fff' }} />
      </div>
      <div className="bpm-node-event-label">{data.label || 'Fim'}</div>
    </NodeWrapper>
  );
}

// ── INTERMEDIATE ─────────────────────────────────────────────
export function IntermediateNode({ data, selected }: { data: any; selected: boolean }) {
  return (
    <NodeWrapper className="bpm-node--intermediate" selected={selected}>
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
export function TaskNode({ data, selected }: { data: any; selected: boolean }) {
  return (
    <NodeWrapper className="bpm-node--task" selected={selected}>
      <Handle type="target" position={Position.Top} id="target" className="bpm-handle" />
      <div className="bpm-node-header" style={{ background: '#0058db18', borderBottom: '1px solid #0058db22' }}>
        <div className="bpm-node-icon" style={{ background: '#dce6f5', color: '#0058db' }}>
          <i className="fa-regular fa-user" />
        </div>
        <span className="bpm-node-type-label" style={{ color: '#0058db' }}>Tarefa Humana</span>
        {data.responsavel && <span className="bpm-node-badge">{data.responsavel}</span>}
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
            {data.prazo !== undefined && (
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
export function TaskSystemNode({ data, selected }: { data: any; selected: boolean }) {
  return (
    <NodeWrapper className="bpm-node--task" selected={selected}>
      <Handle type="target" position={Position.Top} id="target" className="bpm-handle" />
      <div className="bpm-node-header" style={{ background: '#6366f118', borderBottom: '1px solid #6366f122' }}>
        <div className="bpm-node-icon" style={{ background: '#ede9fe', color: '#6366f1' }}>
          <i className="fa-regular fa-gear" />
        </div>
        <span className="bpm-node-type-label" style={{ color: '#6366f1' }}>Tarefa de Sistema</span>
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
export function TaskServiceNode({ data, selected }: { data: any; selected: boolean }) {
  return (
    <NodeWrapper className="bpm-node--task" selected={selected}>
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
export function TaskScriptNode({ data, selected }: { data: any; selected: boolean }) {
  return (
    <NodeWrapper className="bpm-node--task" selected={selected}>
      <Handle type="target" position={Position.Top} id="target" className="bpm-handle" />
      <div className="bpm-node-header" style={{ background: '#7c3aed18', borderBottom: '1px solid #7c3aed22' }}>
        <div className="bpm-node-icon" style={{ background: '#ede9fe', color: '#7c3aed' }}>
          <i className="fa-regular fa-code" />
        </div>
        <span className="bpm-node-type-label" style={{ color: '#7c3aed' }}>Tarefa de Script</span>
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
export function TaskEmailNode({ data, selected }: { data: any; selected: boolean }) {
  return (
    <NodeWrapper className="bpm-node--task" selected={selected}>
      <Handle type="target" position={Position.Top} id="target" className="bpm-handle" />
      <div className="bpm-node-header" style={{ background: '#ea580c18', borderBottom: '1px solid #ea580c22' }}>
        <div className="bpm-node-icon" style={{ background: '#ffedd5', color: '#ea580c' }}>
          <i className="fa-regular fa-envelope" />
        </div>
        <span className="bpm-node-type-label" style={{ color: '#ea580c' }}>Tarefa de E-mail</span>
      </div>
      <div className="bpm-node-body">
        <div className="bpm-node-title">{data.label || 'Enviar E-mail'}</div>
        {data.descricao && <div className="bpm-node-desc">{data.descricao}</div>}
      </div>
      <Handle type="source" position={Position.Bottom} id="source" className="bpm-handle" />
    </NodeWrapper>
  );
}

// ── GATEWAY (XOR/Exclusivo) ──────────────────────────────────
export function GatewayNode({ data, selected }: { data: any; selected: boolean }) {
  const isParallel = data.type === 'paralelo';
  const color = isParallel ? '#0ea5e9' : '#9333ea';
  const _bg   = isParallel ? '#e0f2fe'  : '#f3e8ff'; void _bg;
  const icon  = isParallel ? 'fa-regular fa-arrows-split-up-and-left' : 'fa-regular fa-code-branch';
  const label = isParallel ? 'Gateway Paralelo' : 'Gateway Exclusivo';

  return (
    <NodeWrapper className="bpm-node--gateway" selected={selected}>
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
export function GatewayInclusivoNode({ data, selected }: { data: any; selected: boolean }) {
  return (
    <NodeWrapper className="bpm-node--gateway" selected={selected}>
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
export function MsgNode({ data, selected }: { data: any; selected: boolean }) {
  return (
    <NodeWrapper className="bpm-node--task" selected={selected}>
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
export function NotificationNode({ data, selected }: { data: any; selected: boolean }) {
  return (
    <NodeWrapper className="bpm-node--task" selected={selected}>
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
export function ChatbotNode({ data, selected }: { data: any; selected: boolean }) {
  return (
    <NodeWrapper className="bpm-node--task" selected={selected}>
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
