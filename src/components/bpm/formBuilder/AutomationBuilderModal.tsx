import { useState } from 'react';
import './AutomationBuilderModal.css';

export interface AutomationRule {
  id: string;
  trigger: string;
  triggerConfig?: any;
  action: string;
  actionConfig?: any;
}

const TRIGGERS = [
  { id: 'enter_phase', label: 'Um card entrar em uma fase', icon: '📥' },
  { id: 'field_updated', label: 'Um campo for atualizado', icon: '🔄' },
  { id: 'card_created', label: 'Um card for criado', icon: '📝' },
  { id: 'time_alert', label: 'Um alerta de tempo for acionado (SLA)', icon: '⏰' },
  { id: 'email_received', label: 'Um email for recebido', icon: '✉️' },
  { id: 'webhook_received', label: 'Uma resposta de Webhook for recebida', icon: '🌐' },
];

const ACTIONS = [
  { id: 'create_task', label: 'Envie uma tarefa / Crie um card', icon: '📋' },
  { id: 'move_card', label: 'Mova um card para outra fase', icon: '➡️' },
  { id: 'update_field', label: 'Atualize um campo no card', icon: '✍️' },
  { id: 'send_email', label: 'Envie um template de email', icon: '📧' },
  { id: 'http_request', label: 'Faça uma requisição HTTP (Integração)', icon: '🔗' },
  { id: 'distribute_responsibles', label: 'Distribua responsáveis (Round-robin)', icon: '👥' },
];

export default function AutomationBuilderModal({ 
  isOpen, 
  onClose, 
  onSave, 
  taskName 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (rule: AutomationRule) => void;
  taskName: string;
}) {
  const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!selectedTrigger || !selectedAction) return;
    
    onSave({
      id: `auto_${Date.now()}`,
      trigger: selectedTrigger,
      action: selectedAction
    });
    
    // Reset state for next open
    setSelectedTrigger(null);
    setSelectedAction(null);
  };

  const activeTrigger = TRIGGERS.find(t => t.id === selectedTrigger);
  const activeAction = ACTIONS.find(a => a.id === selectedAction);

  return (
    <div className="automation-builder-overlay animate-fade-in">
      <div className="automation-builder-modal animate-slide-in">
        
        {/* Header */}
        <header className="automation-header">
          <div>
            <h2>Nova Automação</h2>
            <p>Escolha um evento no 1Doc BPM e a ação que ele irá desencadear. Etapa atual: <strong>{taskName}</strong>.</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button 
              className="btn btn-primary" 
              onClick={handleSave}
              disabled={!selectedTrigger || !selectedAction}
            >
              Criar automação
            </button>
          </div>
        </header>

        {/* Builder Area */}
        <div className="automation-body">
          
          {/* Trigger Panel */}
          <div className={`automation-panel ${selectedTrigger ? 'selected-mode' : ''}`}>
             <div className="panel-title">Sempre que...</div>
             
             {!selectedTrigger ? (
               <div className="automation-list">
                 {TRIGGERS.map(t => (
                   <div key={t.id} className="automation-item card-hover" onClick={() => setSelectedTrigger(t.id)}>
                     <span className="auto-icon">{t.icon}</span>
                     <span className="auto-label">{t.label}</span>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="automation-configured">
                  <div className="configured-header">
                     <span className="auto-icon">{activeTrigger?.icon}</span>
                     <h4>{activeTrigger?.label}</h4>
                     <button className="btn-icon" onClick={() => setSelectedTrigger(null)}>✖️</button>
                  </div>
                  <div className="configured-body">
                     <div className="prop-group">
                        <label>No Processo</label>
                        <select className="input select"><option>Processo Atual</option></select>
                     </div>
                     <div className="prop-group">
                        <label>Para a fase</label>
                        <select className="input select"><option>{taskName}</option></select>
                     </div>
                     <button className="btn btn-ghost btn-sm" style={{color:'var(--primary-pure)'}}>+ Adicionar condição extra</button>
                  </div>
               </div>
             )}
          </div>

          {/* Connection Line */}
          <div className="automation-connection">
             <div className="connection-line"></div>
             <div className="connection-dot"></div>
          </div>

          {/* Action Panel */}
          <div className={`automation-panel ${selectedAction ? 'selected-mode' : ''}`}>
             <div className="panel-title">Faça isso...</div>
             
             {!selectedAction ? (
               <div className="automation-list">
                 {ACTIONS.map(a => (
                   <div key={a.id} className="automation-item card-hover" onClick={() => setSelectedAction(a.id)}>
                     <span className="auto-icon">{a.icon}</span>
                     <span className="auto-label">{a.label}</span>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="automation-configured">
                  <div className="configured-header">
                     <span className="auto-icon">{activeAction?.icon}</span>
                     <h4>{activeAction?.label}</h4>
                     <button className="btn-icon" onClick={() => setSelectedAction(null)}>✖️</button>
                  </div>
                  <div className="configured-body">
                     <div className="prop-group">
                        <label>Configuração da Ação</label>
                        <input type="text" className="input" placeholder="Defina o título / valor" />
                     </div>
                     <div className="prop-group">
                        <label>Destinatário / Target</label>
                        <select className="input select">
                           <option>Selecione uma opção...</option>
                           <option>Solicitante</option>
                           <option>Setor de RH</option>
                        </select>
                     </div>
                     
                     <div className="modern-warning-box" style={{marginTop: 16}}>
                        <span style={{fontSize: 16}}>💡</span>
                        <div>
                           <strong>Dica:</strong>
                           <p>Use "Campos Dinâmicos" (ex: @NomeDoSolicitante) para preencher essas informações com dados do formulário.</p>
                        </div>
                     </div>
                  </div>
               </div>
             )}
          </div>

        </div>
      </div>
    </div>
  );
}
