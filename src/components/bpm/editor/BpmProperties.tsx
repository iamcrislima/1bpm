import { useState } from 'react';
import FormBuilderPage from '../formBuilder/FormBuilderPage';
import type { FormFieldData } from '../formBuilder/fieldTypes';

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
  { value: 'gateway',           label: 'Decisão — uma saída (XOR)',     icon: 'fa-regular fa-code-branch',               color: '#9333ea', bg: '#f3e8ff' },
  { value: 'gateway-paralelo',  label: 'Divisão paralela — todas (AND)',icon: 'fa-regular fa-arrows-split-up-and-left',  color: '#0ea5e9', bg: '#e0f2fe' },
  { value: 'gateway-inclusivo', label: 'Divisão inclusiva — várias (OR)',icon: 'fa-regular fa-circle-nodes',             color: '#10b981', bg: '#d1fae5' },
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

// ── Variáveis de processo disponíveis para mapeamento ────────
const VARIAVEIS_PROCESSO = [
  { key: 'FD.respForm',        label: 'Resposta do formulário' },
  { key: 'CPA.cdProcesso',     label: 'Código do processo' },
  { key: 'login',              label: 'Login do usuário' },
  { key: 'nomeDocVist',        label: 'Nome do documento de vistoria' },
  { key: 'CPA.nmProcesso',     label: 'Nome do processo' },
  { key: 'CPA.dtAbertura',     label: 'Data de abertura' },
  { key: 'CPA.cdSolicitante',  label: 'Código do solicitante' },
  { key: 'CPA.nmSolicitante',  label: 'Nome do solicitante' },
  { key: 'CPA.emailResponsavel', label: 'E-mail do responsável' },
];

// ── Mock de formulários cadastrados no sistema ────────────────
const FORMULARIOS_MOCK = [
  '[SEMA] Realizar Parte Técnica da Solicitação (v.2)',
  '[RH] Avaliação de Desempenho (v.1)',
  '[LICIT] Solicitação de Licitação (v.3)',
  '[PROTO] Abertura de Processo Administrativo (v.1)',
  '[FISC] Relatório de Vistoria (v.2)',
  '[JUR] Parecer Jurídico Simplificado (v.1)',
  '[TI] Solicitação de Acesso a Sistema (v.4)',
  '[COMPRAS] Requisição de Material (v.2)',
];

// Campos típicos de formulário para mapeamento
const CAMPOS_FORM_MOCK = [
  { key: 'nomeRequerente',    label: 'Nome do requerente' },
  { key: 'cpfCnpj',          label: 'CPF / CNPJ' },
  { key: 'emailContato',     label: 'E-mail de contato' },
  { key: 'descricao',        label: 'Descrição / Justificativa' },
  { key: 'parecerTecnico',   label: 'Parecer técnico' },
  { key: 'dataVencimento',   label: 'Data de vencimento' },
  { key: 'valorSolicitado',  label: 'Valor solicitado' },
  { key: 'answerId',         label: 'ID da resposta do formulário' },
  { key: 'tac',              label: 'TAC' },
  { key: 'infoTac',          label: 'Info TAC' },
  { key: 'info',             label: 'Informações adicionais' },
];

// ── Catálogo de executáveis com nomes amigáveis ───────────────
interface ExecParam { key: string; label: string; obrigatorio?: boolean }
interface ExecDef {
  value: string;
  label: string;
  descricao: string;
  icon: string;
  cor: string;
  categoria: string;
  entradas: ExecParam[];
  saidas: ExecParam[];
}

const EXECUTAVEIS_CATALOGO: ExecDef[] = [
  {
    value: 'incluir-docs-elaboracao',
    label: 'Adicionar documentos em elaboração',
    descricao: 'Cria novos documentos em modo rascunho vinculados ao processo.',
    icon: 'fa-regular fa-file-plus',
    cor: '#0058db', categoria: 'Documentos',
    entradas: [
      { key: 'cdProcesso',  label: 'Código do processo',    obrigatorio: true },
      { key: 'cdUsuario',   label: 'Usuário responsável',   obrigatorio: true },
      { key: 'nomeDocumento', label: 'Nome do documento' },
    ],
    saidas: [
      { key: 'idDocumento', label: 'ID do documento gerado' },
    ],
  },
  {
    value: 'inserir-pasta-digital',
    label: 'Inserir na pasta digital',
    descricao: 'Salva documentos diretamente na pasta digital do processo.',
    icon: 'fa-regular fa-folder-plus',
    cor: '#0891b2', categoria: 'Documentos',
    entradas: [
      { key: 'answerId',              label: 'ID da resposta do formulário', obrigatorio: true },
      { key: 'cdProcesso',            label: 'Código do processo',           obrigatorio: true },
      { key: 'cdUsuario',             label: 'Usuário responsável',          obrigatorio: true },
      { key: 'nomeDocumentoResposta', label: 'Nome do documento de resposta' },
    ],
    saidas: [],
  },
  {
    value: 'inserir-modelo-anexo',
    label: 'Inserir modelo como anexo',
    descricao: 'Gera um documento a partir de um modelo e o anexa ao processo.',
    icon: 'fa-regular fa-file-import',
    cor: '#7c3aed', categoria: 'Documentos',
    entradas: [
      { key: 'cdModelo',   label: 'Código do modelo',   obrigatorio: true },
      { key: 'cdProcesso', label: 'Código do processo', obrigatorio: true },
    ],
    saidas: [
      { key: 'idAnexo', label: 'ID do anexo gerado' },
    ],
  },
  {
    value: 'mesclar-documentos',
    label: 'Mesclar documentos em PDF',
    descricao: 'Une múltiplos documentos em um único arquivo PDF.',
    icon: 'fa-regular fa-files',
    cor: '#ea580c', categoria: 'Documentos',
    entradas: [
      { key: 'listaIds',  label: 'Lista de IDs dos documentos', obrigatorio: true },
      { key: 'nomeArquivo', label: 'Nome do arquivo final' },
    ],
    saidas: [
      { key: 'idPdf', label: 'ID do PDF gerado' },
    ],
  },
  {
    value: 'vincular-interessado',
    label: 'Vincular interessado ao processo',
    descricao: 'Associa uma pessoa física ou jurídica como interessada no processo.',
    icon: 'fa-regular fa-user-plus',
    cor: '#0f6b3e', categoria: 'Processo',
    entradas: [
      { key: 'cdProcesso',  label: 'Código do processo',    obrigatorio: true },
      { key: 'cdInteressado', label: 'Código do interessado', obrigatorio: true },
    ],
    saidas: [],
  },
  {
    value: 'enviar-email',
    label: 'Enviar e-mail de notificação',
    descricao: 'Dispara uma mensagem de e-mail para os envolvidos no processo.',
    icon: 'fa-regular fa-envelope',
    cor: '#d97706', categoria: 'Comunicação',
    entradas: [
      { key: 'destinatario', label: 'Destinatário (e-mail)',  obrigatorio: true },
      { key: 'assunto',      label: 'Assunto', obrigatorio: true },
      { key: 'corpo',        label: 'Corpo da mensagem' },
    ],
    saidas: [],
  },
  {
    value: 'assinar-digitalmente',
    label: 'Assinar digitalmente',
    descricao: 'Solicita assinatura digital de um documento via certificado.',
    icon: 'fa-regular fa-signature',
    cor: '#7c3aed', categoria: 'Assinatura',
    entradas: [
      { key: 'idDocumento', label: 'ID do documento',  obrigatorio: true },
      { key: 'cdAssinante', label: 'Código do assinante' },
    ],
    saidas: [
      { key: 'idAssinatura', label: 'ID da assinatura' },
      { key: 'dataAssinatura', label: 'Data e hora da assinatura' },
    ],
  },
  {
    value: 'consultar-cpf',
    label: 'Consultar CPF na Receita Federal',
    descricao: 'Verifica a situação cadastral de um CPF junto à Receita Federal.',
    icon: 'fa-regular fa-id-card',
    cor: '#0891b2', categoria: 'Integração',
    entradas: [
      { key: 'cpf', label: 'CPF a consultar', obrigatorio: true },
    ],
    saidas: [
      { key: 'situacao',  label: 'Situação cadastral' },
      { key: 'nomeCompleto', label: 'Nome completo' },
    ],
  },
  {
    value: 'integrar-tce',
    label: 'Enviar dados ao TCE-SC',
    descricao: 'Exporta informações do processo para o sistema do TCE-SC.',
    icon: 'fa-regular fa-cloud-arrow-up',
    cor: '#6366f1', categoria: 'Integração',
    entradas: [
      { key: 'cdProcesso', label: 'Código do processo', obrigatorio: true },
      { key: 'payload',    label: 'Dados a exportar' },
    ],
    saidas: [
      { key: 'protocolo', label: 'Protocolo de envio' },
    ],
  },
  {
    value: 'gerar-pdf',
    label: 'Gerar PDF do processo',
    descricao: 'Cria um PDF consolidado com as informações do processo.',
    icon: 'fa-regular fa-file-pdf',
    cor: '#ef4444', categoria: 'Documentos',
    entradas: [
      { key: 'cdProcesso', label: 'Código do processo', obrigatorio: true },
      { key: 'template',   label: 'Modelo de layout' },
    ],
    saidas: [
      { key: 'idPdf', label: 'ID do PDF gerado' },
      { key: 'urlPdf', label: 'URL de acesso ao PDF' },
    ],
  },
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
interface ExecVinculo {
  value: string;               // chave do executável
  entradaMap: Record<string, string>; // param.key → variavel do processo
  saidaMap:   Record<string, string>; // param.key → variavel do processo
}

function ExecCard({
  vinculo,
  onChange,
  onRemove,
}: {
  vinculo: ExecVinculo;
  onChange: (v: ExecVinculo) => void;
  onRemove: () => void;
}) {
  const [expanded, setExpanded]   = useState(false);
  const [abaAtiva, setAbaAtiva]   = useState<'entradas' | 'saidas'>('entradas');

  const def = EXECUTAVEIS_CATALOGO.find(e => e.value === vinculo.value);
  if (!def) return null;

  const setEntrada = (paramKey: string, varKey: string) =>
    onChange({ ...vinculo, entradaMap: { ...vinculo.entradaMap, [paramKey]: varKey } });

  const setSaida = (paramKey: string, varKey: string) =>
    onChange({ ...vinculo, saidaMap: { ...vinculo.saidaMap, [paramKey]: varKey } });

  const totalMapeados =
    Object.values(vinculo.entradaMap).filter(Boolean).length +
    Object.values(vinculo.saidaMap).filter(Boolean).length;

  return (
    <div className="cfg-exec-card">
      {/* Cabeçalho do card */}
      <div className="cfg-exec-card-header" onClick={() => setExpanded(x => !x)}>
        <div className="cfg-exec-card-icon" style={{ background: def.cor + '18', color: def.cor }}>
          <i className={def.icon} />
        </div>
        <div className="cfg-exec-card-info">
          <span className="cfg-exec-card-label">{def.label}</span>
          <span className="cfg-exec-card-cat">
            {def.categoria}
            {totalMapeados > 0 && (
              <span className="cfg-exec-badge">{totalMapeados} mapeado{totalMapeados !== 1 ? 's' : ''}</span>
            )}
          </span>
        </div>
        <div className="cfg-exec-card-btns" onClick={e => e.stopPropagation()}>
          <button
            className="cfg-icon-btn red"
            title="Remover"
            onClick={onRemove}
          >
            <i className="fa-regular fa-xmark" />
          </button>
        </div>
        <i className={`fa-regular fa-chevron-${expanded ? 'up' : 'down'} cfg-exec-chevron`} />
      </div>

      {/* Painel expansível de mapeamento */}
      {expanded && (
        <div className="cfg-exec-card-body">
          <p className="cfg-exec-desc">{def.descricao}</p>

          {/* Mini tabs */}
          <div className="cfg-exec-tabs">
            <button
              className={`cfg-exec-tab ${abaAtiva === 'entradas' ? 'active' : ''}`}
              onClick={() => setAbaAtiva('entradas')}
            >
              <i className="fa-regular fa-arrow-right-to-bracket" />
              Parâmetros de entrada
              {def.entradas.length > 0 && (
                <span className="cfg-exec-tab-count">{def.entradas.length}</span>
              )}
            </button>
            <button
              className={`cfg-exec-tab ${abaAtiva === 'saidas' ? 'active' : ''}`}
              onClick={() => setAbaAtiva('saidas')}
            >
              <i className="fa-regular fa-arrow-right-from-bracket" />
              Variáveis de retorno
              {def.saidas.length > 0 && (
                <span className="cfg-exec-tab-count">{def.saidas.length}</span>
              )}
            </button>
          </div>

          {/* Mapeamento de entradas */}
          {abaAtiva === 'entradas' && (
            <div className="cfg-exec-map-list">
              {def.entradas.length === 0 ? (
                <p className="cfg-exec-no-params">Este executável não recebe parâmetros.</p>
              ) : def.entradas.map(p => (
                <div key={p.key} className="cfg-exec-map-row">
                  <div className="cfg-exec-map-param">
                    <span className="cfg-exec-param-label">
                      {p.label}
                      {p.obrigatorio && <span className="cfg-exec-required"> *</span>}
                    </span>
                    <span className="cfg-exec-param-key">{p.key}</span>
                  </div>
                  <i className="fa-regular fa-arrow-left cfg-exec-map-arrow" />
                  <select
                    className="cfg-select cfg-exec-map-select"
                    value={vinculo.entradaMap[p.key] || ''}
                    onChange={e => setEntrada(p.key, e.target.value)}
                  >
                    <option value="">Selecione a variável...</option>
                    {VARIAVEIS_PROCESSO.map(v => (
                      <option key={v.key} value={v.key}>{v.label}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}

          {/* Mapeamento de saídas */}
          {abaAtiva === 'saidas' && (
            <div className="cfg-exec-map-list">
              {def.saidas.length === 0 ? (
                <p className="cfg-exec-no-params">Este executável não retorna variáveis.</p>
              ) : def.saidas.map(p => (
                <div key={p.key} className="cfg-exec-map-row">
                  <div className="cfg-exec-map-param">
                    <span className="cfg-exec-param-label">{p.label}</span>
                    <span className="cfg-exec-param-key">{p.key}</span>
                  </div>
                  <i className="fa-regular fa-arrow-right cfg-exec-map-arrow" />
                  <select
                    className="cfg-select cfg-exec-map-select"
                    value={vinculo.saidaMap[p.key] || ''}
                    onChange={e => setSaida(p.key, e.target.value)}
                  >
                    <option value="">Salvar em...</option>
                    {VARIAVEIS_PROCESSO.map(v => (
                      <option key={v.key} value={v.key}>{v.label}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TabExecutaveis({ data, update }: { data: any; update: (patch: any) => void }) {
  const [busca, setBusca]           = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const vinculos: ExecVinculo[]     = data.execVinculos || [];

  const jaAdicionados = new Set(vinculos.map(v => v.value));
  const filtrados = EXECUTAVEIS_CATALOGO.filter(
    e =>
      !jaAdicionados.has(e.value) &&
      (e.label.toLowerCase().includes(busca.toLowerCase()) ||
       e.categoria.toLowerCase().includes(busca.toLowerCase()))
  );

  // Agrupa filtrados por categoria
  const porCategoria = filtrados.reduce<Record<string, ExecDef[]>>((acc, e) => {
    (acc[e.categoria] ??= []).push(e);
    return acc;
  }, {});

  const addExec = (def: ExecDef) => {
    const novo: ExecVinculo = { value: def.value, entradaMap: {}, saidaMap: {} };
    update({ execVinculos: [...vinculos, novo] });
    setBusca('');
    setShowDropdown(false);
  };

  const updateVinculo = (idx: number, v: ExecVinculo) => {
    const next = vinculos.map((x, i) => i === idx ? v : x);
    update({ execVinculos: next });
  };

  const removeVinculo = (idx: number) => {
    update({ execVinculos: vinculos.filter((_, i) => i !== idx) });
  };

  return (
    <Section title="Executáveis vinculados">
      {/* Busca */}
      <div className="cfg-field">
        <FieldLabel>Adicionar executável</FieldLabel>
        <div style={{ position: 'relative' }}>
          <div className="cfg-exec-search-wrap">
            <i className="fa-regular fa-magnifying-glass cfg-exec-search-icon" />
            <input
              type="text"
              className="cfg-input cfg-exec-search-input"
              placeholder="Buscar por nome ou categoria..."
              value={busca}
              onChange={e => { setBusca(e.target.value); setShowDropdown(true); }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 180)}
            />
          </div>
          {showDropdown && (
            <div className="cfg-dropdown cfg-exec-dropdown">
              {Object.keys(porCategoria).length === 0 ? (
                <div className="cfg-dropdown-empty">Nenhum resultado</div>
              ) : Object.entries(porCategoria).map(([cat, items]) => (
                <div key={cat}>
                  <div className="cfg-dropdown-group-label">{cat}</div>
                  {items.map(def => (
                    <button
                      key={def.value}
                      className="cfg-dropdown-item cfg-exec-dropdown-item"
                      onMouseDown={() => addExec(def)}
                    >
                      <span className="cfg-exec-di-icon" style={{ color: def.cor }}>
                        <i className={def.icon} />
                      </span>
                      <span className="cfg-exec-di-label">{def.label}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lista de executáveis vinculados */}
      {vinculos.length === 0 ? (
        <div className="cfg-empty-state">
          <i className="fa-regular fa-cube" />
          <span>Nenhum executável vinculado</span>
        </div>
      ) : (
        <div className="cfg-exec-cards">
          {vinculos.map((v, i) => (
            <ExecCard
              key={v.value}
              vinculo={v}
              onChange={nv => updateVinculo(i, nv)}
              onRemove={() => removeVinculo(i)}
            />
          ))}
        </div>
      )}
    </Section>
  );
}

// ── Aba: Formulário ──────────────────────────────────────────
interface FormVarMap { campoForm: string; varProcesso: string }

const FORM_TIPOS = [
  { value: 'dinamico',      label: 'Dinâmico' },
  { value: 'ungp',          label: 'UNGP' },
  { value: 'simulacao',     label: 'Simulação' },
  { value: 'editor-texto',  label: 'Editor de texto' },
];

function TabFormulario({
  data,
  update,
  taskName,
}: {
  data: any;
  update: (patch: any) => void;
  taskName: string;
}) {
  const formTipo     = data.formTipo     ?? 'dinamico';
  const formNome     = data.formNome     ?? '';
  const formFields: FormFieldData[] = data.formBuilderFields ?? [];
  const formEntradas: FormVarMap[] = data.formEntradas ?? [];
  const formSaidas:   FormVarMap[] = data.formSaidas   ?? [];
  const [abaVar, setAbaVar]     = useState<'entradas' | 'saidas'>('entradas');
  const [builderOpen, setBuilderOpen] = useState(false);

  const addEntrada = () =>
    update({ formEntradas: [...formEntradas, { campoForm: '', varProcesso: '' }] });
  const updateEntrada = (i: number, patch: Partial<FormVarMap>) =>
    update({ formEntradas: formEntradas.map((r, idx) => idx === i ? { ...r, ...patch } : r) });
  const removeEntrada = (i: number) =>
    update({ formEntradas: formEntradas.filter((_, idx) => idx !== i) });

  const addSaida = () =>
    update({ formSaidas: [...formSaidas, { campoForm: '', varProcesso: '' }] });
  const updateSaida = (i: number, patch: Partial<FormVarMap>) =>
    update({ formSaidas: formSaidas.map((r, idx) => idx === i ? { ...r, ...patch } : r) });
  const removeSaida = (i: number) =>
    update({ formSaidas: formSaidas.filter((_, idx) => idx !== i) });

  return (
    <>
      <Section title="Configuração do formulário">
        {/* Tipo */}
        <div className="cfg-field">
          <FieldLabel>Tipo</FieldLabel>
          <div className="cfg-radio-group cfg-radio-group--horizontal">
            {FORM_TIPOS.map(t => (
              <label key={t.value} className="cfg-radio-label">
                <input
                  type="radio"
                  name="formTipo"
                  value={t.value}
                  checked={formTipo === t.value}
                  onChange={() => update({ formTipo: t.value })}
                  className="cfg-radio"
                />
                {t.label}
              </label>
            ))}
          </div>
        </div>

        {/* Formulário selecionado */}
        <div className="cfg-field">
          <FieldLabel>Formulário</FieldLabel>
          <div className="cfg-select-clear">
            <select
              className="cfg-select"
              value={formNome}
              onChange={e => update({ formNome: e.target.value })}
            >
              <option value="">Selecione um formulário...</option>
              {FORMULARIOS_MOCK.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            {formNome && (
              <button className="cfg-clear-btn" title="Limpar" onClick={() => update({ formNome: '' })}>
                <i className="fa-regular fa-xmark" />
              </button>
            )}
          </div>
          {formNome && (
            <button className="cfg-link-btn" style={{ marginTop: 6 }} onClick={() => setBuilderOpen(true)}>
              <i className="fa-regular fa-arrow-up-right-from-square" />
              Abrir formulário
            </button>
          )}
        </div>

        {/* Botão criar formulário */}
        <button className="cfg-btn-full" style={{ marginTop: 4 }} onClick={() => setBuilderOpen(true)}>
          <i className={`fa-regular fa-${formFields.length > 0 ? 'pen-to-square' : 'plus'}`} />
          {formFields.length > 0
            ? `Editar formulário (${formFields.length} campos)`
            : 'Criar formulário'}
        </button>
      </Section>

      {/* Form Builder full-screen overlay */}
      {builderOpen && (
        <FormBuilderPage
          nomeTarefa={taskName}
          initialFields={formFields.length > 0 ? formFields : undefined}
          onClose={() => setBuilderOpen(false)}
          onSave={(fields) => {
            update({ formBuilderFields: fields });
            setBuilderOpen(false);
          }}
        />
      )}

      {/* Seção de variáveis — só exibe se um formulário foi selecionado */}
      {formNome && (
        <Section title="Mapeamento de variáveis">
          {/* Mini tabs */}
          <div className="cfg-exec-tabs" style={{ marginBottom: 12 }}>
            <button
              className={`cfg-exec-tab ${abaVar === 'entradas' ? 'active' : ''}`}
              onClick={() => setAbaVar('entradas')}
            >
              <i className="fa-regular fa-arrow-right-to-bracket" />
              Processo → Formulário
              {formEntradas.length > 0 && (
                <span className="cfg-exec-tab-count">{formEntradas.length}</span>
              )}
            </button>
            <button
              className={`cfg-exec-tab ${abaVar === 'saidas' ? 'active' : ''}`}
              onClick={() => setAbaVar('saidas')}
            >
              <i className="fa-regular fa-arrow-right-from-bracket" />
              Formulário → Processo
              {formSaidas.length > 0 && (
                <span className="cfg-exec-tab-count">{formSaidas.length}</span>
              )}
            </button>
          </div>

          {/* Entradas: variável do processo pré-preenche campo do formulário */}
          {abaVar === 'entradas' && (
            <div className="cfg-form-map-list">
              <p className="cfg-form-map-hint">
                <i className="fa-regular fa-circle-info" />
                Envie dados do processo para pré-preencher campos do formulário.
              </p>
              {formEntradas.map((row, i) => (
                <div key={i} className="cfg-form-map-row">
                  <select
                    className="cfg-select"
                    value={row.varProcesso}
                    onChange={e => updateEntrada(i, { varProcesso: e.target.value })}
                  >
                    <option value="">Variável do processo...</option>
                    {VARIAVEIS_PROCESSO.map(v => (
                      <option key={v.key} value={v.key}>{v.label}</option>
                    ))}
                  </select>
                  <i className="fa-regular fa-arrow-right cfg-form-map-arrow" />
                  <select
                    className="cfg-select"
                    value={row.campoForm}
                    onChange={e => updateEntrada(i, { campoForm: e.target.value })}
                  >
                    <option value="">Campo do formulário...</option>
                    {CAMPOS_FORM_MOCK.map(c => (
                      <option key={c.key} value={c.key}>{c.label}</option>
                    ))}
                  </select>
                  <button className="cfg-icon-btn red" onClick={() => removeEntrada(i)} title="Remover">
                    <i className="fa-regular fa-xmark" />
                  </button>
                </div>
              ))}
              <button className="cfg-add-row-btn" onClick={addEntrada}>
                <i className="fa-regular fa-plus" />
                Adicionar mapeamento
              </button>
            </div>
          )}

          {/* Saídas: campo do formulário salva em variável do processo */}
          {abaVar === 'saidas' && (
            <div className="cfg-form-map-list">
              <p className="cfg-form-map-hint">
                <i className="fa-regular fa-circle-info" />
                Capture respostas do formulário e salve em variáveis do processo.
              </p>
              {formSaidas.map((row, i) => (
                <div key={i} className="cfg-form-map-row">
                  <select
                    className="cfg-select"
                    value={row.campoForm}
                    onChange={e => updateSaida(i, { campoForm: e.target.value })}
                  >
                    <option value="">Campo do formulário...</option>
                    {CAMPOS_FORM_MOCK.map(c => (
                      <option key={c.key} value={c.key}>{c.label}</option>
                    ))}
                  </select>
                  <i className="fa-regular fa-arrow-right cfg-form-map-arrow" />
                  <select
                    className="cfg-select"
                    value={row.varProcesso}
                    onChange={e => updateSaida(i, { varProcesso: e.target.value })}
                  >
                    <option value="">Variável do processo...</option>
                    {VARIAVEIS_PROCESSO.map(v => (
                      <option key={v.key} value={v.key}>{v.label}</option>
                    ))}
                  </select>
                  <button className="cfg-icon-btn red" onClick={() => removeSaida(i)} title="Remover">
                    <i className="fa-regular fa-xmark" />
                  </button>
                </div>
              ))}
              <button className="cfg-add-row-btn" onClick={addSaida}>
                <i className="fa-regular fa-plus" />
                Adicionar mapeamento
              </button>
            </div>
          )}
        </Section>
      )}
    </>
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
