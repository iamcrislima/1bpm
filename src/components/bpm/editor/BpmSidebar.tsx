import React from 'react';

// Definição das categorias e elementos da paleta
const PALETTE = [
  {
    category: 'Eventos',
    icon: 'fa-regular fa-circle',
    color: 'var(--bpm-sky)',
    items: [
      { type: 'start',        label: 'Início',         icon: 'fa-regular fa-play',               color: '#22c55e', bg: '#dcfce7' },
      { type: 'end',          label: 'Fim',            icon: 'fa-regular fa-stop',               color: '#ef4444', bg: '#fee2e2' },
      { type: 'intermediate', label: 'Intermediário',  icon: 'fa-regular fa-circle-dot',         color: '#f59e0b', bg: '#fef3c7' },
    ],
  },
  {
    category: 'Tarefas',
    icon: 'fa-regular fa-square',
    color: 'var(--primary-pure)',
    items: [
      { type: 'task',         label: 'Tarefa Humana',    icon: 'fa-regular fa-user',               color: '#0058db', bg: '#dce6f5' },
      { type: 'task-system',  label: 'Tarefa de Sistema',icon: 'fa-regular fa-gear',               color: '#6366f1', bg: '#ede9fe' },
      { type: 'task-service', label: 'Tarefa de Serviço',icon: 'fa-regular fa-server',             color: '#0891b2', bg: '#cffafe' },
      { type: 'task-script',  label: 'Tarefa de Script', icon: 'fa-regular fa-code',               color: '#7c3aed', bg: '#ede9fe' },
      { type: 'task-email',   label: 'Tarefa de E-mail', icon: 'fa-regular fa-envelope',           color: '#ea580c', bg: '#ffedd5' },
    ],
  },
  {
    category: 'Decisões',
    icon: 'fa-regular fa-diamond',
    color: 'var(--bpm-purple)',
    items: [
      { type: 'gateway',           label: 'Decisão exclusiva',  icon: 'fa-regular fa-code-branch',              color: '#9333ea', bg: '#f3e8ff' },
      { type: 'gateway-paralelo',  label: 'Divisão paralela',   icon: 'fa-regular fa-arrows-split-up-and-left', color: '#0ea5e9', bg: '#e0f2fe' },
      { type: 'gateway-inclusivo', label: 'Divisão inclusiva',  icon: 'fa-regular fa-circle-nodes',             color: '#10b981', bg: '#d1fae5' },
    ],
  },
  {
    category: 'Conversacional',
    icon: 'fa-regular fa-message',
    color: 'var(--bpm-indigo)',
    items: [
      { type: 'msg',          label: 'Mensagem',      icon: 'fa-regular fa-message',            color: '#2563eb', bg: '#dbeafe' },
      { type: 'notification', label: 'Notificação',   icon: 'fa-regular fa-bell',               color: '#d97706', bg: '#fef3c7' },
      { type: 'chatbot',        label: 'Chatbot',           icon: 'fa-regular fa-robot',    color: '#7c3aed', bg: '#ede9fe' },
      { type: 'wait-response',  label: 'Aguardar resposta', icon: 'fa-regular fa-comments', color: '#2563eb', bg: '#dbeafe' },
    ],
  },
];

export default function BpmSidebar() {
  const onDragStart = (event: React.DragEvent, item: { type: string; label: string; icon: string; color: string; bg: string }) => {
    event.dataTransfer.setData('application/reactflow', item.type);
    event.dataTransfer.setData('application/reactflow-label', item.label);
    event.dataTransfer.setData('application/reactflow-icon', item.icon);
    event.dataTransfer.setData('application/reactflow-color', item.color);
    event.dataTransfer.setData('application/reactflow-bg', item.bg);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="bpm-editor-sidebar">
      <div className="sidebar-header">
        <span className="sidebar-header-title">Elementos</span>
        <span className="sidebar-header-hint">Arraste para o canvas</span>
      </div>

      {PALETTE.map(cat => (
        <div key={cat.category} className="palette-category">
          <div className="palette-category-title">
            <i className={cat.icon} style={{ color: cat.color, fontSize: 11 }} />
            {cat.category}
          </div>
          <div className="palette-items">
            {cat.items.map(item => (
              <div
                key={item.type}
                className="dndnode"
                draggable
                onDragStart={e => onDragStart(e, item)}
              >
                <div className="dndnode-icon-wrap" style={{ background: item.bg, color: item.color }}>
                  <i className={item.icon} />
                </div>
                <span className="dndnode-label">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}
