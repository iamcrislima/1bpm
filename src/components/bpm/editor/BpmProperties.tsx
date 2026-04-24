import React, { useState } from 'react';
import FormBuilderModal, { type FormField } from '../formBuilder/FormBuilderModal';
import AutomationBuilderModal, { type AutomationRule } from '../formBuilder/AutomationBuilderModal';

// ── Seção colapsável ─────────────────────────────────────────
function PropSection({
  title,
  icon,
  defaultOpen = true,
  children,
}: {
  title: string;
  icon: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="prop-section">
      <button className="prop-section-header" onClick={() => setOpen(o => !o)}>
        <div className="prop-section-header-left">
          <i className={icon} />
          <span>{title}</span>
        </div>
        <i className={`fa-regular fa-chevron-${open ? 'up' : 'down'} prop-section-chevron`} />
      </button>
      {open && <div className="prop-section-body">{children}</div>}
    </div>
  );
}

// ── Componente principal ─────────────────────────────────────
export default function BpmProperties({
  selectedNode,
  updateNodeData,
}: {
  selectedNode: any;
  updateNodeData: (id: string, data: any) => void;
}) {
  const [isFormBuilderOpen, setIsFormBuilderOpen] = useState(false);
  const [isAutomationBuilderOpen, setIsAutomationBuilderOpen] = useState(false);

  if (!selectedNode) {
    return (
      <aside className="bpm-editor-properties empty">
        <div className="prop-empty-icon">
          <i className="fa-regular fa-arrow-pointer" />
        </div>
        <h3 className="prop-empty-title">Nenhum elemento selecionado</h3>
        <p className="prop-empty-desc">
          Selecione um elemento para editar suas propriedades
        </p>
      </aside>
    );
  }

  const data = selectedNode.data || {};
  const isTask = selectedNode.type?.startsWith('task') || false;
  const formFields: FormField[] = data.formFields || [];
  const automations: AutomationRule[] = data.automations || [];

  const update = (patch: Record<string, any>) => {
    updateNodeData(selectedNode.id, { ...data, ...patch });
  };

  const handleSaveForm = (fields: FormField[]) => {
    update({ formFields: fields });
    setIsFormBuilderOpen(false);
  };

  const handleSaveAutomation = (rule: AutomationRule) => {
    update({ automations: [...automations, rule] });
    setIsAutomationBuilderOpen(false);
  };

  // Badge de tipo do nó
  const typeLabels: Record<string, string> = {
    start: 'Evento de Início',
    end: 'Evento de Fim',
    intermediate: 'Evento Intermediário',
    task: 'Tarefa Humana',
    'task-system': 'Tarefa de Sistema',
    'task-service': 'Tarefa de Serviço',
    'task-script': 'Tarefa de Script',
    'task-email': 'Tarefa de E-mail',
    gateway: 'Gateway Exclusivo',
    'gateway-paralelo': 'Gateway Paralelo',
    'gateway-inclusivo': 'Gateway Inclusivo',
    msg: 'Mensagem',
    notification: 'Notificação',
    chatbot: 'Chatbot',
  };

  return (
    <aside className="bpm-editor-properties">
      {/* Cabeçalho do painel */}
      <div className="properties-header">
        <div className="prop-header-node">
          <div
            className="prop-header-icon"
            style={{ background: data.bg || '#dce6f5', color: data.color || '#0058db' }}
          >
            <i className={data.icon || 'fa-regular fa-square'} />
          </div>
          <div className="prop-header-info">
            <span className="prop-header-type">{typeLabels[selectedNode.type] || selectedNode.type}</span>
            <h3 className="prop-header-name">{data.label || 'Elemento'}</h3>
          </div>
        </div>
      </div>

      {/* Corpo do painel */}
      <div className="properties-body">

        {/* Seção 1: Identificação */}
        <PropSection title="Identificação" icon="fa-regular fa-tag">
          <div className="prop-field">
            <label className="prop-label">Nome</label>
            <input
              type="text"
              className="input prop-input"
              value={data.label || ''}
              onChange={e => update({ label: e.target.value })}
              placeholder="Nome do elemento..."
            />
          </div>
          <div className="prop-field">
            <label className="prop-label">Descrição</label>
            <textarea
              className="input prop-textarea"
              value={data.descricao || ''}
              onChange={e => update({ descricao: e.target.value })}
              placeholder="Descreva o propósito deste elemento..."
              rows={3}
            />
          </div>
        </PropSection>

        {/* Seção 2: Responsável e Prazo (só para tarefas) */}
        {isTask && (
          <PropSection title="Responsável e Prazo" icon="fa-regular fa-user-clock">
            <div className="prop-field">
              <label className="prop-label">Setor / Papel responsável</label>
              <select
                className="input select prop-input"
                value={data.responsavel || ''}
                onChange={e => update({ responsavel: e.target.value })}
              >
                <option value="">Selecione...</option>
                <option value="Solicitante">Solicitante (Autor)</option>
                <option value="Protocolo">Setor de Protocolo</option>
                <option value="RH">Setor de Recursos Humanos</option>
                <option value="Compras">Setor de Compras</option>
                <option value="Diretor Financeiro">Diretor Financeiro</option>
                <option value="Financeiro">Financeiro</option>
                <option value="TI">Tecnologia (TI)</option>
                <option value="Licitações">Licitações</option>
                <option value="Sistema">Ação Automática (Sistema)</option>
                <option value="Meio Ambiente">Setor de Meio Ambiente</option>
              </select>
            </div>
            <div className="prop-field">
              <label className="prop-label">Prazo (SLA)</label>
              <div className="prop-row">
                <input
                  type="number"
                  className="input prop-input"
                  style={{ width: 80 }}
                  value={data.prazo ?? 3}
                  min={1}
                  onChange={e => update({ prazo: parseInt(e.target.value) || 1 })}
                />
                <span className="prop-unit">dias úteis</span>
              </div>
            </div>
            <div className="prop-sla-hint">
              <i className="fa-regular fa-bell" />
              <span>Responsáveis serão notificados 1 dia antes do vencimento</span>
            </div>
          </PropSection>
        )}

        {/* Seção 3: Formulário vinculado (só para tarefas humanas) */}
        {selectedNode.type === 'task' && (
          <PropSection title="Formulário vinculado" icon="fa-regular fa-clipboard-list" defaultOpen={false}>
            <div className="prop-form-preview">
              {formFields.length === 0 ? (
                <div className="prop-form-empty">
                  <i className="fa-regular fa-file-lines" />
                  <span>Nenhum campo configurado</span>
                </div>
              ) : (
                <div className="prop-fields-list">
                  {formFields.map(f => (
                    <div key={f.id} className="prop-field-item">
                      {f.required && <i className="fa-solid fa-asterisk" style={{ fontSize: 8, color: 'var(--danger)' }} />}
                      <span>{f.label}</span>
                      <span className="badge badge-neutral" style={{ marginLeft: 'auto', fontSize: 10 }}>
                        {f.type === 'texto-curto' ? 'Texto' : f.type === 'data' ? 'Data' : f.type === 'anexo' ? 'Arquivo' : f.type}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <button
                className="btn btn-primary btn-sm"
                style={{ width: '100%', marginTop: 12, justifyContent: 'center' }}
                onClick={() => setIsFormBuilderOpen(true)}
              >
                <i className="fa-regular fa-pen-to-square" />
                {formFields.length > 0 ? 'Editar formulário' : 'Criar formulário'}
              </button>
            </div>
          </PropSection>
        )}

        {/* Seção 4: Regras de automação */}
        {isTask && (
          <PropSection title="Regras de automação" icon="fa-regular fa-bolt" defaultOpen={false}>
            {automations.length === 0 ? (
              <div className="prop-form-empty">
                <i className="fa-regular fa-bolt" />
                <span>Nenhuma automação configurada</span>
              </div>
            ) : (
              <div className="prop-fields-list">
                {automations.map(auto => (
                  <div key={auto.id} className="prop-auto-item">
                    <span className="prop-auto-trigger">Quando: {auto.trigger}</span>
                    <span className="prop-auto-action">→ {auto.action}</span>
                  </div>
                ))}
              </div>
            )}
            <button
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', marginTop: 12, justifyContent: 'center' }}
              onClick={() => setIsAutomationBuilderOpen(true)}
            >
              <i className="fa-regular fa-plus" />
              Nova automação
            </button>
          </PropSection>
        )}

        {/* Seção 5: Gateway — condições (só para gateways) */}
        {selectedNode.type?.startsWith('gateway') && (
          <PropSection title="Condições de decisão" icon="fa-regular fa-code-branch" defaultOpen>
            <p className="prop-hint-text">
              Conecte as saídas deste gateway aos próximos elementos e rotule cada conexão com a condição correspondente.
            </p>
            <div className="prop-gateway-tip">
              <i className="fa-regular fa-lightbulb" />
              <span>Clique em uma conexão para adicionar label de condição</span>
            </div>
          </PropSection>
        )}
      </div>

      <FormBuilderModal
        isOpen={isFormBuilderOpen}
        onClose={() => setIsFormBuilderOpen(false)}
        initialFields={formFields}
        onSave={handleSaveForm}
        taskName={data.label || 'Nova Etapa'}
      />

      <AutomationBuilderModal
        isOpen={isAutomationBuilderOpen}
        onClose={() => setIsAutomationBuilderOpen(false)}
        onSave={handleSaveAutomation}
        taskName={data.label || 'Nova Etapa'}
      />
    </aside>
  );
}
