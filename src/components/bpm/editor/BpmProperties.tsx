import { useState } from 'react';
import FormBuilderModal, { type FormField } from '../formBuilder/FormBuilderModal';

// ── Tipos de nó disponíveis ──────────────────────────────────
const NODE_TYPES = [
  { value: 'start',             label: 'Evento de Início',              icon: 'fa-regular fa-play',                      color: '#22c55e', bg: '#dcfce7' },
  { value: 'intermediate',      label: 'Evento Intermediário',           icon: 'fa-regular fa-circle-dot',                color: '#f59e0b', bg: '#fef3c7' },
  { value: 'end',               label: 'Evento de Fim',                 icon: 'fa-regular fa-stop',                      color: '#ef4444', bg: '#fee2e2' },
  { value: 'task',              label: 'Tarefa de Usuário',             icon: 'fa-regular fa-user',                      color: '#0058db', bg: '#dce6f5' },
  { value: 'task-email',        label: 'Tarefa de Envio',               icon: 'fa-regular fa-envelope',                  color: '#ea580c', bg: '#ffedd5' },
  { value: 'task-receive',      label: 'Tarefa de Recebimento',         icon: 'fa-regular fa-envelope-open',             color: '#0891b2', bg: '#cffafe' },
  { value: 'task-manual',       label: 'Tarefa Manual',                 icon: 'fa-regular fa-hand',                      color: '#7c3aed', bg: '#ede9fe' },
  { value: 'task-service',      label: 'Tarefa de Serviço',             icon: 'fa-regular fa-server',                    color: '#0891b2', bg: '#cffafe' },
  { value: 'task-script',       label: 'Tarefa de Execução de Script',  icon: 'fa-regular fa-code',                      color: '#7c3aed', bg: '#ede9fe' },
  { value: 'task-system',       label: 'Subprocesso Reutilizável',      icon: 'fa-regular fa-arrows-rotate',             color: '#6366f1', bg: '#ede9fe' },
  { value: 'gateway',           label: 'Gateway Exclusivo',             icon: 'fa-regular fa-code-branch',               color: '#9333ea', bg: '#f3e8ff' },
  { value: 'gateway-paralelo',  label: 'Gateway Paralelo',              icon: 'fa-regular fa-arrows-split-up-and-left',  color: '#0ea5e9', bg: '#e0f2fe' },
  { value: 'gateway-inclusivo', label: 'Gateway Inclusivo',             icon: 'fa-regular fa-circle-nodes',              color: '#10b981', bg: '#d1fae5' },
];

const ATORES = [
  'Solicitante (Autor)',
  'Setor de Protocolo',
  'Setor de Recursos Humanos',
  'Setor de Compras',
  'Diretor Financeiro',
  'Financeiro',
  'Tecnologia (TI)',
  'Licitações',
  'Ação Automática (Sistema)',
  'Setor de Meio Ambiente',
  'Advogado / Jurídico',
  'Usuário para validação',
  'Gestor da Área',
  'Administrador do Sistema',
];

const EXECUTAVEIS_MOCK = [
  'Gerar peça',
  'Enviar e-mail de notificação',
  'Assinar digitalmente',
  'Integrar com TCE-SC',
  'Gerar PDF',
  'Consultar CPF na Receita',
  'Notificar via WhatsApp',
  'Exportar para planilha',
];

// ── Accordion section ────────────────────────────────────────
function Section({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="cfg-section">
      <button className="cfg-section-header" onClick={() => setOpen(o => !o)}>
        <span className="cfg-section-title">{title}</span>
        <i className={`fa-solid fa-chevron-${open ? 'up' : 'down'} cfg-section-chevron`} />
      </button>
      {open && <div className="cfg-section-body">{children}</div>}
    </div>
  );
}

// ── Label de campo ───────────────────────────────────────────
function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="cfg-field-label">{children}</label>;
}

// ── Aba: Geral ───────────────────────────────────────────────
function TabGeral({
  node,
  update,
  changeNodeType,
}: {
  node: any;
  update: (patch: any) => void;
  changeNodeType: (id: string, type: string, data: any) => void;
}) {
  const data = node.data || {};
  const currentType = NODE_TYPES.find(t => t.value === node.type) ?? NODE_TYPES[3];
  const prazoTipo = data.prazoTipo ?? 'sem-prazo';

  const handleTypeChange = (newType: string) => {
    const meta = NODE_TYPES.find(t => t.value === newType);
    if (meta) {
      changeNodeType(node.id, newType, {
        icon: meta.icon,
        color: meta.color,
        bg: meta.bg,
      });
    }
  };

  return (
    <>
      <Section title="Configurações gerais">
        <div className="cfg-field">
          <FieldLabel>Tipo</FieldLabel>
          <select
            className="cfg-select"
            value={node.type}
            onChange={e => handleTypeChange(e.target.value)}
          >
            {NODE_TYPES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div className="cfg-field">
          <FieldLabel>Nome</FieldLabel>
          <input
            type="text"
            className="cfg-input"
            value={data.label || ''}
            onChange={e => update({ label: e.target.value })}
            placeholder="Nome do elemento..."
          />
        </div>
        <div className="cfg-field">
          <FieldLabel>Descrição</FieldLabel>
          <textarea
            className="cfg-textarea"
            value={data.descricao || ''}
            onChange={e => update({ descricao: e.target.value })}
            placeholder="Descreva o propósito deste elemento..."
            rows={3}
          />
        </div>
      </Section>

      <Section title="Configurações de prazo">
        {/* ── Prazo ── */}
        <div className="cfg-subsection-label">Prazo</div>
        <div className="cfg-radio-group">
          {[
            { value: 'sem-prazo', label: 'Sem Prazo' },
            { value: 'tempo',     label: 'Tempo' },
            { value: 'expressao', label: 'Expressão' },
          ].map(opt => (
            <label key={opt.value} className="cfg-radio-label">
              <input
                type="radio"
                name={`prazoTipo-${node.id}`}
                value={opt.value}
                checked={prazoTipo === opt.value}
                onChange={() => update({ prazoTipo: opt.value })}
                className="cfg-radio"
              />
              {opt.label}
            </label>
          ))}
        </div>
        {prazoTipo === 'tempo' && (
          <div className="cfg-row" style={{ marginTop: 10 }}>
            <input
              type="number"
              className="cfg-input"
              style={{ width: 80 }}
              value={data.prazo ?? 3}
              min={1}
              onChange={e => update({ prazo: parseInt(e.target.value) || 1 })}
            />
            <select
              className="cfg-select"
              style={{ flex: 1 }}
              value={data.prazoUnidade ?? 'dias'}
              onChange={e => update({ prazoUnidade: e.target.value })}
            >
              <option value="minutos">Minutos</option>
              <option value="horas">Horas</option>
              <option value="dias">Dias úteis</option>
            </select>
          </div>
        )}
        {prazoTipo === 'expressao' && (
          <input
            type="text"
            className="cfg-input"
            style={{ marginTop: 10 }}
            value={data.prazoExpressao || ''}
            onChange={e => update({ prazoExpressao: e.target.value })}
            placeholder="Ex: ${prazoBase + 5}"
          />
        )}

        {/* ── Aviso de vencimento ── */}
        <div className="cfg-subsection-label" style={{ marginTop: 14 }}>Aviso de vencimento</div>
        <div className="cfg-radio-group">
          {[
            { value: 'sem-aviso', label: 'Sem Aviso' },
            { value: 'tempo',     label: 'Tempo' },
            { value: 'expressao', label: 'Expressão' },
          ].map(opt => (
            <label key={opt.value} className="cfg-radio-label">
              <input
                type="radio"
                name={`avisoTipo-${node.id}`}
                value={opt.value}
                checked={(data.avisoTipo ?? 'sem-aviso') === opt.value}
                onChange={() => update({ avisoTipo: opt.value })}
                className="cfg-radio"
              />
              {opt.label}
            </label>
          ))}
        </div>
        {(data.avisoTipo ?? 'sem-aviso') === 'tempo' && (
          <div className="cfg-row" style={{ marginTop: 10 }}>
            <input
              type="number"
              className="cfg-input"
              style={{ width: 80 }}
              value={data.aviso ?? 1}
              min={1}
              onChange={e => update({ aviso: parseInt(e.target.value) || 1 })}
            />
            <select
              className="cfg-select"
              style={{ flex: 1 }}
              value={data.avisoUnidade ?? 'dias'}
              onChange={e => update({ avisoUnidade: e.target.value })}
            >
              <option value="minutos">Minutos antes</option>
              <option value="horas">Horas antes</option>
              <option value="dias">Dias antes</option>
            </select>
          </div>
        )}
        {(data.avisoTipo ?? 'sem-aviso') === 'expressao' && (
          <input
            type="text"
            className="cfg-input"
            style={{ marginTop: 10 }}
            value={data.avisoExpressao || ''}
            onChange={e => update({ avisoExpressao: e.target.value })}
            placeholder="Ex: ${prazo - 2}"
          />
        )}
      </Section>
    </>
  );
}

// ── Aba: Ator ────────────────────────────────────────────────
function TabAtor({ data, update }: { data: any; update: (patch: any) => void }) {
  const ator = data.ator || '';
  const notificarEmail = data.notificarEmail ?? false;
  const notificacaoPersonalizada = data.notificacaoPersonalizada ?? false;

  return (
    <>
      <Section title="Configuração do ator">
        <div className="cfg-field">
          <FieldLabel>Ator</FieldLabel>
          <div className="cfg-select-clear">
            <select
              className="cfg-select"
              value={ator}
              onChange={e => update({ ator: e.target.value })}
            >
              <option value="">Selecione o ator...</option>
              {ATORES.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
            {ator && (
              <button
                className="cfg-clear-btn"
                onClick={() => update({ ator: '' })}
                title="Limpar"
              >
                <i className="fa-regular fa-xmark" />
              </button>
            )}
          </div>
        </div>
      </Section>

      <Section title="Notificação do ator" defaultOpen={false}>
        <div className="cfg-checkbox-group">
          <label className="cfg-checkbox-label">
            <input
              type="checkbox"
              checked={notificarEmail}
              onChange={e => update({ notificarEmail: e.target.checked })}
            />
            Notificar ator por e-mail
          </label>
          <label className="cfg-checkbox-label">
            <input
              type="checkbox"
              checked={notificacaoPersonalizada}
              onChange={e => update({ notificacaoPersonalizada: e.target.checked })}
            />
            Utilizar notificação personalizada
          </label>
        </div>

        {(notificarEmail || notificacaoPersonalizada) && (
          <>
            <div className="cfg-field" style={{ marginTop: 12 }}>
              <FieldLabel>Assunto do e-mail</FieldLabel>
              <input
                type="text"
                className="cfg-input"
                value={data.emailAssunto || ''}
                onChange={e => update({ emailAssunto: e.target.value })}
                placeholder="Assunto da mensagem..."
              />
            </div>
            <div className="cfg-field">
              <FieldLabel>Corpo do e-mail</FieldLabel>
              <textarea
                className="cfg-textarea"
                rows={5}
                value={data.emailCorpo || ''}
                onChange={e => update({ emailCorpo: e.target.value })}
                placeholder="Escreva o corpo da mensagem..."
              />
            </div>
          </>
        )}
      </Section>
    </>
  );
}

// ── Aba: Executáveis ─────────────────────────────────────────
function TabExecutaveis({ data, update }: { data: any; update: (patch: any) => void }) {
  const [busca, setBusca] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const executaveis: string[] = data.executaveis || [];

  const filtrados = EXECUTAVEIS_MOCK.filter(
    e => e.toLowerCase().includes(busca.toLowerCase()) && !executaveis.includes(e)
  );

  const addExec = (exec: string) => {
    update({ executaveis: [...executaveis, exec] });
    setBusca('');
    setShowDropdown(false);
  };

  const removeExec = (exec: string) => {
    update({ executaveis: executaveis.filter(e => e !== exec) });
  };

  return (
    <Section title="Configuração dos executáveis">
      <div className="cfg-field">
        <FieldLabel>Executável</FieldLabel>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            className="cfg-input"
            placeholder="Digite para pesquisar..."
            value={busca}
            onChange={e => { setBusca(e.target.value); setShowDropdown(true); }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          />
          {showDropdown && filtrados.length > 0 && (
            <div className="cfg-dropdown">
              {filtrados.map(e => (
                <button
                  key={e}
                  className="cfg-dropdown-item"
                  onMouseDown={() => addExec(e)}
                >
                  {e}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {executaveis.length > 0 && (
        <div className="cfg-exec-table">
          <div className="cfg-exec-header">
            <span>Nome</span>
            <span>Ações</span>
          </div>
          {executaveis.map(exec => (
            <div key={exec} className="cfg-exec-row">
              <span className="cfg-exec-name">
                <i className="fa-regular fa-grip-dots-vertical" style={{ color: '#999', marginRight: 6 }} />
                {exec}
              </span>
              <div className="cfg-exec-actions">
                <button className="cfg-icon-btn blue" title="Editar">
                  <i className="fa-regular fa-pen" />
                </button>
                <button className="cfg-icon-btn red" title="Remover" onClick={() => removeExec(exec)}>
                  <i className="fa-regular fa-xmark" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {executaveis.length === 0 && (
        <div className="cfg-empty-state">
          <i className="fa-regular fa-cube" />
          <span>Nenhum executável vinculado</span>
        </div>
      )}
    </Section>
  );
}

// ── Aba: Formulário ──────────────────────────────────────────
function TabFormulario({
  data,
  update,
  taskName,
}: {
  data: any;
  update: (patch: any) => void;
  taskName: string;
}) {
  const [open, setOpen] = useState(false);
  const formFields: FormField[] = data.formFields || [];

  return (
    <Section title="Formulário vinculado">
      {formFields.length === 0 ? (
        <div className="cfg-empty-state">
          <i className="fa-regular fa-file-lines" />
          <span>Nenhum campo configurado</span>
        </div>
      ) : (
        <div className="cfg-fields-list">
          {formFields.map(f => (
            <div key={f.id} className="cfg-field-item">
              {f.required && <i className="fa-solid fa-asterisk" style={{ fontSize: 8, color: 'var(--danger)' }} />}
              <span style={{ flex: 1 }}>{f.label}</span>
              <span className="cfg-field-type-badge">
                {f.type === 'texto-curto' ? 'Texto' : f.type === 'data' ? 'Data' : f.type === 'anexo' ? 'Arquivo' : f.type}
              </span>
            </div>
          ))}
        </div>
      )}
      <button
        className="cfg-btn-full"
        onClick={() => setOpen(true)}
      >
        <i className="fa-regular fa-pen-to-square" />
        {formFields.length > 0 ? 'Editar formulário' : 'Criar formulário'}
      </button>

      <FormBuilderModal
        isOpen={open}
        onClose={() => setOpen(false)}
        initialFields={formFields}
        onSave={(fields) => { update({ formFields: fields }); setOpen(false); }}
        taskName={taskName}
      />
    </Section>
  );
}

// ── Aba: Propriedades ────────────────────────────────────────
function TabPropriedades({ data, update }: { data: any; update: (patch: any) => void }) {
  const props: { chave: string; valor: string }[] = data.customProps || [];

  const addProp = () => {
    update({ customProps: [...props, { chave: '', valor: '' }] });
  };

  const removeProp = (idx: number) => {
    update({ customProps: props.filter((_, i) => i !== idx) });
  };

  const updateProp = (idx: number, field: 'chave' | 'valor', value: string) => {
    const next = props.map((p, i) => i === idx ? { ...p, [field]: value } : p);
    update({ customProps: next });
  };

  return (
    <Section title="Propriedades customizadas">
      {props.length === 0 ? (
        <div className="cfg-empty-state">
          <i className="fa-regular fa-list-ul" />
          <span>Nenhuma propriedade configurada</span>
        </div>
      ) : (
        <div className="cfg-props-table">
          <div className="cfg-props-header">
            <span>Chave</span>
            <span>Valor</span>
            <span />
          </div>
          {props.map((p, i) => (
            <div key={i} className="cfg-props-row">
              <input
                type="text"
                className="cfg-input cfg-props-input"
                placeholder="chave"
                value={p.chave}
                onChange={e => updateProp(i, 'chave', e.target.value)}
              />
              <input
                type="text"
                className="cfg-input cfg-props-input"
                placeholder="valor"
                value={p.valor}
                onChange={e => updateProp(i, 'valor', e.target.value)}
              />
              <button className="cfg-icon-btn red" onClick={() => removeProp(i)}>
                <i className="fa-regular fa-xmark" />
              </button>
            </div>
          ))}
        </div>
      )}
      <button className="cfg-btn-secondary" onClick={addProp}>
        <i className="fa-regular fa-plus" />
        Adicionar propriedade
      </button>
    </Section>
  );
}

// ── Componente principal ─────────────────────────────────────

type Tab = 'geral' | 'ator' | 'executaveis' | 'formulario' | 'propriedades';

const TABS: { id: Tab; label: string }[] = [
  { id: 'geral',        label: 'Geral' },
  { id: 'ator',         label: 'Ator' },
  { id: 'executaveis',  label: 'Executáveis' },
  { id: 'formulario',   label: 'Formulário' },
  { id: 'propriedades', label: 'Propriedades' },
];

export default function BpmProperties({
  selectedNode,
  updateNodeData,
  changeNodeType,
}: {
  selectedNode: any;
  updateNodeData: (id: string, data: any) => void;
  changeNodeType: (id: string, type: string, data: any) => void;
}) {
  const [activeTab, setActiveTab] = useState<Tab>('geral');

  if (!selectedNode) {
    return (
      <aside className="bpm-editor-properties empty">
        <div className="prop-empty-icon">
          <i className="fa-regular fa-arrow-pointer" />
        </div>
        <h3 className="prop-empty-title">Nenhum elemento selecionado</h3>
        <p className="prop-empty-desc">
          Clique em um elemento para editar suas propriedades
        </p>
      </aside>
    );
  }

  const data = selectedNode.data || {};
  const isTask = ['task', 'task-email', 'task-receive', 'task-manual', 'task-service', 'task-script', 'task-system', 'msg', 'notification'].includes(selectedNode.type);

  const update = (patch: Record<string, any>) => {
    updateNodeData(selectedNode.id, { ...data, ...patch });
  };

  const currentTypeMeta = NODE_TYPES.find(t => t.value === selectedNode.type);
  const iconColor = currentTypeMeta?.color ?? data.color ?? '#0058db';
  const iconBg    = currentTypeMeta?.bg    ?? data.bg    ?? '#dce6f5';
  const iconClass = currentTypeMeta?.icon  ?? data.icon  ?? 'fa-regular fa-square';

  return (
    <aside className="bpm-editor-properties">

      {/* Cabeçalho CONFIGURAÇÃO */}
      <div className="cfg-header">
        <i className="fa-regular fa-gear cfg-header-icon" />
        <span className="cfg-header-title">CONFIGURAÇÃO</span>
      </div>

      {/* Abas */}
      <div className="cfg-tabs">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`cfg-tab ${activeTab === t.id ? 'cfg-tab--active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Preview do nó selecionado */}
      <div className="cfg-node-preview">
        <div className="cfg-node-preview-icon" style={{ background: iconBg, color: iconColor }}>
          <i className={iconClass} />
        </div>
        <div className="cfg-node-preview-info">
          <span className="cfg-node-preview-type">{currentTypeMeta?.label ?? selectedNode.type}</span>
          <span className="cfg-node-preview-name">{data.label || 'Elemento'}</span>
        </div>
      </div>

      {/* Conteúdo da aba */}
      <div className="cfg-body">
        {activeTab === 'geral' && (
          <TabGeral node={selectedNode} update={update} changeNodeType={changeNodeType} />
        )}
        {activeTab === 'ator' && isTask && (
          <TabAtor data={data} update={update} />
        )}
        {activeTab === 'ator' && !isTask && (
          <div className="cfg-empty-state" style={{ margin: 24 }}>
            <i className="fa-regular fa-user-slash" />
            <span>Configuração de ator não disponível para este tipo de elemento</span>
          </div>
        )}
        {activeTab === 'executaveis' && (
          <TabExecutaveis data={data} update={update} />
        )}
        {activeTab === 'formulario' && selectedNode.type === 'task' && (
          <TabFormulario data={data} update={update} taskName={data.label || 'Nova Etapa'} />
        )}
        {activeTab === 'formulario' && selectedNode.type !== 'task' && (
          <div className="cfg-empty-state" style={{ margin: 24 }}>
            <i className="fa-regular fa-clipboard-list" />
            <span>Formulários só podem ser vinculados a Tarefas de Usuário</span>
          </div>
        )}
        {activeTab === 'propriedades' && (
          <TabPropriedades data={data} update={update} />
        )}
      </div>
    </aside>
  );
}
