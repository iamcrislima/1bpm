import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NovaAutomacaoPage.css';

function Ico({ icon, style }: { icon: string; style?: React.CSSProperties }) {
  return (
    <span
      dangerouslySetInnerHTML={{ __html: `<i class="${icon}"></i>` }}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, flexShrink: 0, ...style }}
    />
  );
}

// ── Types ─────────────────────────────────────────────────────

interface TriggerItem {
  id: string;
  label: string;
  icon: string;
  hasConfig?: boolean;
  configType?: 'days' | 'sla-days' | 'recurrence';
  beta?: boolean;
}

interface TriggerCategory {
  id: string;
  label: string;
  icon: string;
  items: TriggerItem[];
}

interface ConditionItem {
  id: string;
  label: string;
  icon: string;
  inputType: 'select' | 'number' | 'text';
  placeholder: string;
  options?: string[];
}

interface ActionItem {
  id: string;
  label: string;
  icon: string;
  beta?: boolean;
  configType: 'email' | 'stage' | 'simple' | 'ai' | 'webhook';
}

interface ActionCategory {
  id: string;
  label: string;
  icon: string;
  items: ActionItem[];
}

// ── Data ─────────────────────────────────────────────────────

const TRIGGER_CATEGORIES: TriggerCategory[] = [
  {
    id: 'processo',
    label: 'Eventos de Processo',
    icon: 'fa-regular fa-diagram-project',
    items: [
      { id: 'process-created',       label: 'Um processo for criado',                         icon: 'fa-regular fa-circle-plus' },
      { id: 'process-entered-stage', label: 'Um processo entrar em uma etapa',                 icon: 'fa-regular fa-arrow-right-to-bracket' },
      { id: 'stage-stalled',         label: 'Uma etapa ficar parada por mais de X dias',       icon: 'fa-regular fa-hourglass-half', hasConfig: true, configType: 'days' },
      { id: 'approval-granted',      label: 'Uma aprovação for concedida',                     icon: 'fa-regular fa-circle-check' },
      { id: 'approval-rejected',     label: 'Uma aprovação for rejeitada',                     icon: 'fa-regular fa-circle-xmark' },
      { id: 'process-archived',      label: 'Um processo for arquivado ou cancelado',          icon: 'fa-regular fa-box-archive' },
    ],
  },
  {
    id: 'prazo',
    label: 'Eventos de Prazo',
    icon: 'fa-regular fa-clock',
    items: [
      { id: 'sla-expiring',     label: 'Um SLA estiver prestes a vencer',        icon: 'fa-regular fa-triangle-exclamation', hasConfig: true, configType: 'sla-days' },
      { id: 'deadline-exceeded', label: 'Um prazo for ultrapassado',              icon: 'fa-regular fa-calendar-xmark' },
      { id: 'specific-date',    label: 'Uma data específica for atingida',        icon: 'fa-regular fa-calendar-day' },
      { id: 'recurrence',       label: 'Uma recorrência for acionada',            icon: 'fa-regular fa-rotate', hasConfig: true, configType: 'recurrence' },
    ],
  },
  {
    id: 'cidadao',
    label: 'Eventos do Cidadão',
    icon: 'fa-regular fa-user',
    items: [
      { id: 'form-submitted',  label: 'Um formulário for submetido pelo cidadão',       icon: 'fa-regular fa-clipboard-check' },
      { id: 'document-sent',   label: 'Um documento for enviado pelo cidadão',          icon: 'fa-regular fa-file-arrow-up' },
      { id: 'portal-reply',    label: 'Uma resposta for recebida via portal',           icon: 'fa-regular fa-comment-dots' },
      { id: 'email-received',  label: 'Um e-mail for recebido em caixa monitorada',    icon: 'fa-regular fa-envelope' },
    ],
  },
  {
    id: 'integracoes',
    label: 'Integrações Externas',
    icon: 'fa-regular fa-plug',
    items: [
      { id: 'signature-done',   label: 'Uma assinatura digital for concluída',                         icon: 'fa-regular fa-signature' },
      { id: 'external-query',   label: 'Uma consulta a sistema externo retornar resultado',            icon: 'fa-regular fa-server' },
      { id: 'webhook-received', label: 'Uma requisição HTTP for recebida',                             icon: 'fa-regular fa-webhook', beta: true },
    ],
  },
];

const CONDITIONS: ConditionItem[] = [
  { id: 'process-type', label: 'O tipo do processo for igual a',   icon: 'fa-regular fa-diagram-project', inputType: 'select',  placeholder: 'Selecione o tipo', options: ['Licenciamento Ambiental', 'Aprovação de Compras', 'Atendimento ao Cidadão', 'Gestão de Contratos', 'Admissão de Servidores'] },
  { id: 'area',         label: 'A área responsável for',           icon: 'fa-regular fa-building',        inputType: 'select',  placeholder: 'Selecione a área',  options: ['Atendimento', 'Meio Ambiente', 'Administrativo', 'Jurídico', 'RH', 'Financeiro', 'TI'] },
  { id: 'field-value',  label: 'O valor do campo for maior que',   icon: 'fa-regular fa-hashtag',         inputType: 'number',  placeholder: 'Ex: 5000' },
  { id: 'tag',          label: 'O processo tiver a tag',           icon: 'fa-regular fa-tag',             inputType: 'select',  placeholder: 'Selecione a tag',   options: ['Urgente', 'Prioritário', 'Pendente de Documentação', 'Aguardando Terceiros'] },
  { id: 'responsible',  label: 'O responsável for',                icon: 'fa-regular fa-user',            inputType: 'text',    placeholder: 'Nome do responsável' },
];

const ACTION_CATEGORIES: ActionCategory[] = [
  {
    id: 'comunicacao',
    label: 'Comunicação',
    icon: 'fa-regular fa-bell',
    items: [
      { id: 'notify-citizen-email', label: 'Notificar o cidadão por e-mail',                 icon: 'fa-regular fa-envelope',    configType: 'email' },
      { id: 'notify-citizen-sms',   label: 'Notificar o cidadão por SMS',                    icon: 'fa-regular fa-message-sms', configType: 'simple' },
      { id: 'alert-responsible',    label: 'Enviar alerta interno para o responsável',        icon: 'fa-regular fa-bell',        configType: 'simple' },
      { id: 'notify-manager',       label: 'Notificar o gestor da área',                     icon: 'fa-regular fa-user-tie',    configType: 'simple' },
      { id: 'send-email-template',  label: 'Enviar e-mail com template configurável',         icon: 'fa-regular fa-file-lines',  configType: 'email' },
    ],
  },
  {
    id: 'processo',
    label: 'Processo',
    icon: 'fa-regular fa-diagram-project',
    items: [
      { id: 'move-stage',         label: 'Mover para a próxima etapa automaticamente', icon: 'fa-regular fa-arrow-right',      configType: 'stage' },
      { id: 'assign-responsible', label: 'Atribuir responsável por regra',              icon: 'fa-regular fa-user-plus',        configType: 'simple' },
      { id: 'create-subprocess',  label: 'Criar um sub-processo vinculado',             icon: 'fa-regular fa-diagram-subtask',  configType: 'simple' },
      { id: 'escalate',           label: 'Escalar para o nível superior',               icon: 'fa-regular fa-arrow-up',         configType: 'simple' },
      { id: 'archive',            label: 'Arquivar ou encerrar o processo',             icon: 'fa-regular fa-box-archive',      configType: 'simple' },
      { id: 'generate-protocol',  label: 'Gerar protocolo automático',                  icon: 'fa-regular fa-barcode',          configType: 'simple' },
    ],
  },
  {
    id: 'integracoes-gov',
    label: 'Integrações Gov',
    icon: 'fa-regular fa-landmark',
    items: [
      { id: 'publish-diario', label: 'Publicar no Diário Oficial',                     icon: 'fa-regular fa-newspaper',  beta: true,  configType: 'simple' },
      { id: 'sign-digital',   label: 'Acionar assinatura digital',                     icon: 'fa-regular fa-signature',              configType: 'simple' },
      { id: 'webhook',        label: 'Enviar para sistema externo via webhook',         icon: 'fa-regular fa-webhook',    beta: true,  configType: 'webhook' },
      { id: 'tributos',       label: 'Registrar em sistema de tributos',                icon: 'fa-regular fa-receipt',    beta: true,  configType: 'simple' },
      { id: 'consult-cpf',    label: 'Consultar CPF ou CNPJ em base de dados',         icon: 'fa-regular fa-id-card',                configType: 'simple' },
    ],
  },
  {
    id: 'ia',
    label: 'Inteligência Artificial',
    icon: 'fa-regular fa-sparkles',
    items: [
      { id: 'ai-analyze-doc',   label: 'Pedir para a IA analisar documento anexado',              icon: 'fa-regular fa-file-magnifying-glass', configType: 'ai' },
      { id: 'ai-classify',      label: 'Pedir para a IA classificar o tipo de solicitação',       icon: 'fa-regular fa-tags',                  configType: 'ai' },
      { id: 'ai-suggest-stage', label: 'Pedir para a IA sugerir a próxima etapa',                 icon: 'fa-regular fa-lightbulb',             configType: 'ai' },
      { id: 'ai-draft-reply',   label: 'Pedir para a IA redigir uma resposta ao cidadão',         icon: 'fa-regular fa-pen-to-square',         configType: 'ai' },
    ],
  },
];

const EMAIL_VARIABLES = ['{nome_cidadao}', '{numero_protocolo}', '{nome_processo}', '{prazo}'];

// ── Component ─────────────────────────────────────────────────

export default function NovaAutomacaoPage() {
  const navigate = useNavigate();

  const [name,            setName]            = useState('Nova automação');
  const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null);
  const [stalledDays,     setStalledDays]     = useState(3);
  const [slaDays,         setSlaDays]         = useState(2);
  const [recurrenceType,  setRecurrenceType]  = useState('diaria');
  const [selectedCond,    setSelectedCond]    = useState<string | null>(null);
  const [condSkipped,     setCondSkipped]     = useState(false);
  const [condValue,       setCondValue]       = useState('');
  const [selectedAction,  setSelectedAction]  = useState<string | null>(null);
  const [configOpen,      setConfigOpen]      = useState(false);
  const [emailSubject,    setEmailSubject]    = useState('');
  const [emailBody,       setEmailBody]       = useState('');
  const [targetStage,     setTargetStage]     = useState('');
  const [webhookUrl,      setWebhookUrl]      = useState('');

  const canSave = selectedTrigger !== null && selectedAction !== null;
  const panelsUnlocked = selectedTrigger !== null;

  const handleTriggerClick = (id: string) => {
    try {
      setSelectedTrigger(prev => (prev === id ? null : id));
      setSelectedAction(null);
      setConfigOpen(false);
    } catch (e) {
      console.error('[NovaAutomacao] handleTriggerClick', e);
    }
  };

  const handleConditionClick = (id: string) => {
    try {
      setCondSkipped(false);
      setSelectedCond(prev => (prev === id ? null : id));
      setCondValue('');
    } catch (e) {
      console.error('[NovaAutomacao] handleConditionClick', e);
    }
  };

  const handleSkipCondition = () => {
    try {
      setSelectedCond(null);
      setCondSkipped(true);
    } catch (e) {
      console.error('[NovaAutomacao] handleSkipCondition', e);
    }
  };

  const handleActionClick = (id: string) => {
    try {
      if (selectedAction === id) {
        setSelectedAction(null);
        setConfigOpen(false);
      } else {
        setSelectedAction(id);
        setConfigOpen(false);
      }
    } catch (e) {
      console.error('[NovaAutomacao] handleActionClick', e);
    }
  };

  const handleSave = () => {
    navigate('/processos?tab=automacoes');
  };

  const selectedTriggerItem = TRIGGER_CATEGORIES.flatMap(c => c.items).find(i => i.id === selectedTrigger);
  const selectedCondItem    = CONDITIONS.find(c => c.id === selectedCond);
  const selectedActionItem  = ACTION_CATEGORIES.flatMap(c => c.items).find(i => i.id === selectedAction);

  return (
    <div className="na-page">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="na-header">
        <div className="na-breadcrumb">
          <span
            className="na-breadcrumb-link"
            onClick={() => navigate('/processos?tab=automacoes')}
          >
            Automações
          </span>
          <Ico icon="fa-regular fa-chevron-right" style={{ fontSize: 10, color: 'var(--text-tertiary)' }} />
          <span style={{ color: 'var(--text-secondary)' }}>Nova Automação</span>
        </div>
        <h1 className="na-title">Nova Automação</h1>
        <p className="na-subtitle">
          Defina quando e o que acontece automaticamente nos seus processos.
        </p>
      </div>

      {/* ── Name field ─────────────────────────────────────── */}
      <div className="na-name-row">
        <label className="na-name-label" htmlFor="na-name">Nome da automação</label>
        <input
          id="na-name"
          className="input na-name-input"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Ex: Alerta de prazo vencendo"
        />
      </div>

      {/* ── Builder body ───────────────────────────────────── */}
      <div className="na-body">
        <div className="na-builder">

          {/* ── Panel 1: Trigger ─────────────────────────── */}
          <div className="na-panel na-panel--trigger">
            <div className="na-panel-header">
              <div className="na-panel-badge">1</div>
              <div>
                <div className="na-panel-title">Sempre que...</div>
                <div className="na-panel-subtitle">Escolha o que dispara a automação</div>
              </div>
            </div>
            <div className="na-panel-body">
              {TRIGGER_CATEGORIES.map(cat => (
                <div key={cat.id} className="na-category">
                  <div className="na-category-label">
                    <Ico icon={cat.icon} />
                    {cat.label}
                  </div>
                  {cat.items.map(item => (
                    <div key={item.id}>
                      <button
                        className={`na-option ${selectedTrigger === item.id ? 'na-option--selected' : ''}`}
                        onClick={() => handleTriggerClick(item.id)}
                      >
                        <div className={`na-option-icon ${selectedTrigger === item.id ? 'na-option-icon--active' : ''}`}>
                          <Ico icon={item.icon} />
                        </div>
                        <span className="na-option-label">{item.label}</span>
                        {item.beta ? <span className="na-badge-beta">Beta</span> : null}
                        {selectedTrigger === item.id ? (
                          <Ico icon="fa-solid fa-check" style={{ fontSize: 11, color: 'var(--primary-pure)' }} />
                        ) : null}
                      </button>

                      {/* Inline trigger config */}
                      {selectedTrigger === item.id && item.hasConfig === true ? (
                        <div className="na-inline-config animate-fade-in">
                          {item.configType === 'days' && (
                            <div className="na-config-row">
                              <label>Dias parada:</label>
                              <input
                                type="number"
                                className="na-config-input"
                                value={stalledDays}
                                min={1}
                                max={90}
                                onChange={e => setStalledDays(Number(e.target.value))}
                              />
                              <span>dias</span>
                            </div>
                          )}
                          {item.configType === 'sla-days' && (
                            <div className="na-config-row">
                              <label>Avisar com antecedência de:</label>
                              <select
                                className="na-config-select"
                                value={slaDays}
                                onChange={e => setSlaDays(Number(e.target.value))}
                              >
                                <option value={1}>1 dia</option>
                                <option value={2}>2 dias</option>
                                <option value={5}>5 dias</option>
                              </select>
                            </div>
                          )}
                          {item.configType === 'recurrence' && (
                            <div className="na-config-row">
                              <label>Frequência:</label>
                              <select
                                className="na-config-select"
                                value={recurrenceType}
                                onChange={e => setRecurrenceType(e.target.value)}
                              >
                                <option value="diaria">Diária</option>
                                <option value="semanal">Semanal</option>
                                <option value="mensal">Mensal</option>
                              </select>
                            </div>
                          )}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* ── Arrow 1 ──────────────────────────────────── */}
          <div className="na-arrow">
            <Ico icon="fa-solid fa-chevron-right" style={{ fontSize: 14, color: 'var(--border-dark)' }} />
          </div>

          {/* ── Panel 2: Condition ───────────────────────── */}
          <div className={`na-panel na-panel--condition ${!panelsUnlocked ? 'na-panel--locked' : ''}`}>
            <div className="na-panel-header">
              <div className="na-panel-badge na-panel-badge--optional">2</div>
              <div>
                <div className="na-panel-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  Se...
                  <span className="na-badge-optional">Opcional</span>
                </div>
                <div className="na-panel-subtitle">Refine quando a automação dispara</div>
              </div>
            </div>

            {!panelsUnlocked ? (
              <div className="na-locked-msg">
                <Ico icon="fa-regular fa-lock" />
                <span>Selecione um gatilho primeiro</span>
              </div>
            ) : (
              <div className="na-panel-body animate-fade-in">
                <button
                  className={`na-skip-btn ${condSkipped ? 'na-skip-btn--active' : ''}`}
                  onClick={handleSkipCondition}
                >
                  <Ico icon="fa-regular fa-forward" />
                  Sem condição — sempre executar
                </button>

                <div className="na-divider-label">ou adicione uma condição</div>

                {CONDITIONS.map(cond => (
                  <div key={cond.id}>
                    <button
                      className={`na-option ${selectedCond === cond.id ? 'na-option--selected' : ''}`}
                      onClick={() => handleConditionClick(cond.id)}
                    >
                      <div className={`na-option-icon ${selectedCond === cond.id ? 'na-option-icon--active' : ''}`}>
                        <Ico icon={cond.icon} />
                      </div>
                      <span className="na-option-label">{cond.label}</span>
                      {selectedCond === cond.id ? (
                        <Ico icon="fa-solid fa-check" style={{ fontSize: 11, color: 'var(--primary-pure)' }} />
                      ) : null}
                    </button>

                    {selectedCond === cond.id && (
                      <div className="na-inline-config animate-fade-in">
                        {cond.inputType === 'select' && (
                          <select
                            className="na-config-select"
                            value={condValue}
                            onChange={e => setCondValue(e.target.value)}
                          >
                            <option value="">Selecione...</option>
                            {cond.options?.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        )}
                        {cond.inputType === 'number' && (
                          <input
                            type="number"
                            className="na-config-input"
                            placeholder={cond.placeholder}
                            value={condValue}
                            onChange={e => setCondValue(e.target.value)}
                          />
                        )}
                        {cond.inputType === 'text' && (
                          <input
                            type="text"
                            className="na-config-input"
                            placeholder={cond.placeholder}
                            value={condValue}
                            onChange={e => setCondValue(e.target.value)}
                          />
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Arrow 2 ──────────────────────────────────── */}
          <div className="na-arrow">
            <Ico icon="fa-solid fa-chevron-right" style={{ fontSize: 14, color: 'var(--border-dark)' }} />
          </div>

          {/* ── Panel 3: Action ──────────────────────────── */}
          <div className={`na-panel na-panel--action ${!panelsUnlocked ? 'na-panel--locked' : ''}`}>
            <div className="na-panel-header">
              <div className="na-panel-badge">3</div>
              <div>
                <div className="na-panel-title">Faça isso...</div>
                <div className="na-panel-subtitle">Escolha a ação que será executada</div>
              </div>
            </div>

            {!panelsUnlocked ? (
              <div className="na-locked-msg">
                <Ico icon="fa-regular fa-lock" />
                <span>Selecione um gatilho primeiro</span>
              </div>
            ) : (
              <div className="na-panel-body animate-fade-in">
                {ACTION_CATEGORIES.map(cat => (
                  <div key={cat.id} className="na-category">
                    <div className="na-category-label">
                      <Ico icon={cat.icon} />
                      {cat.label}
                    </div>
                    {cat.items.map(item => (
                      <div key={item.id}>
                        <button
                          className={`na-option ${selectedAction === item.id ? 'na-option--selected' : ''}`}
                          onClick={() => handleActionClick(item.id)}
                        >
                          <div className={`na-option-icon ${selectedAction === item.id ? 'na-option-icon--active' : ''}`}>
                            <Ico icon={item.icon} />
                          </div>
                          <span className="na-option-label">{item.label}</span>
                          {item.beta ? <span className="na-badge-beta">Beta</span> : null}
                          {selectedAction === item.id ? (
                            <Ico icon="fa-solid fa-check" style={{ fontSize: 11, color: 'var(--primary-pure)' }} />
                          ) : null}
                        </button>

                        {/* Action config expansion */}
                        {selectedAction === item.id && (
                          <div className="na-action-config animate-fade-in">
                            {!configOpen ? (
                              <button className="na-config-btn" onClick={() => setConfigOpen(true)}>
                                <Ico icon="fa-regular fa-sliders" />
                                Configurar ação
                              </button>
                            ) : (
                              <div className="na-config-form">
                                <button
                                  className="na-config-close"
                                  onClick={() => setConfigOpen(false)}
                                >
                                  <Ico icon="fa-regular fa-xmark" />
                                  Fechar
                                </button>

                                {item.configType === 'email' && (
                                  <>
                                    <div className="na-config-field">
                                      <label className="na-config-label">Assunto do e-mail</label>
                                      <input
                                        className="input"
                                        placeholder="Ex: Seu processo foi atualizado"
                                        value={emailSubject}
                                        onChange={e => setEmailSubject(e.target.value)}
                                      />
                                    </div>
                                    <div className="na-config-field">
                                      <label className="na-config-label">Corpo da mensagem</label>
                                      <textarea
                                        className="na-config-textarea"
                                        placeholder={'Olá, {nome_cidadao}.\n\nSeu processo {nome_processo} foi atualizado.'}
                                        rows={4}
                                        value={emailBody}
                                        onChange={e => setEmailBody(e.target.value)}
                                      />
                                      <div className="na-variables-hint">
                                        <span className="na-variables-label">Inserir variável:</span>
                                        {EMAIL_VARIABLES.map(v => (
                                          <button
                                            key={v}
                                            className="na-variable-chip"
                                            onClick={() => setEmailBody(prev => prev + v)}
                                          >
                                            {v}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  </>
                                )}

                                {item.configType === 'stage' && (
                                  <div className="na-config-field">
                                    <label className="na-config-label">Etapa de destino</label>
                                    <select
                                      className="input select"
                                      value={targetStage}
                                      onChange={e => setTargetStage(e.target.value)}
                                    >
                                      <option value="">Selecione a etapa...</option>
                                      <option value="triagem">Triagem Inicial</option>
                                      <option value="analise">Análise Técnica</option>
                                      <option value="aprovacao">Aprovação</option>
                                      <option value="execucao">Execução</option>
                                      <option value="conclusao">Conclusão</option>
                                    </select>
                                  </div>
                                )}

                                {item.configType === 'webhook' && (
                                  <div className="na-config-field">
                                    <label className="na-config-label">URL do endpoint</label>
                                    <input
                                      className="input"
                                      type="url"
                                      placeholder="https://sistema.municipio.gov.br/webhook/..."
                                      value={webhookUrl}
                                      onChange={e => setWebhookUrl(e.target.value)}
                                    />
                                  </div>
                                )}

                                {item.configType === 'ai' && (
                                  <div className="na-config-info">
                                    <Ico icon="fa-regular fa-sparkles" style={{ color: 'var(--bpm-purple)', marginTop: 2 }} />
                                    <span>
                                      A IA processará automaticamente usando o modelo configurado
                                      para o seu ambiente. Nenhuma configuração adicional necessária.
                                    </span>
                                  </div>
                                )}

                                {item.configType === 'simple' && (
                                  <div className="na-config-info">
                                    <Ico icon="fa-regular fa-circle-check" style={{ color: 'var(--success)', marginTop: 2 }} />
                                    <span>
                                      Esta ação será executada automaticamente sem configurações adicionais.
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Summary preview ──────────────────────────────── */}
        {canSave && (
          <div className="na-summary animate-fade-in">
            <Ico icon="fa-regular fa-eye" style={{ color: 'var(--primary-pure)', fontSize: 15 }} />
            <span>
              <strong>Resumo:</strong>{' '}
              Sempre que{' '}
              <em>{selectedTriggerItem?.label.toLowerCase()}</em>
              {selectedCond && condValue && selectedCondItem && (
                <> e {selectedCondItem.label.toLowerCase()} <em>{condValue}</em></>
              )}
              {' → '}
              <em>{selectedActionItem?.label.toLowerCase()}</em>
            </span>
          </div>
        )}
      </div>

      {/* ── Footer ─────────────────────────────────────────── */}
      <div className="na-footer">
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/processos?tab=automacoes')}
        >
          Cancelar
        </button>
        <button
          className="btn btn-primary"
          disabled={!canSave}
          onClick={handleSave}
        >
          <Ico icon="fa-regular fa-floppy-disk" />
          Salvar automação
        </button>
      </div>
    </div>
  );
}
