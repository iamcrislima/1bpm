// ── Catálogo completo de tipos de campo do Form Builder ───────

export interface FormFieldData {
  id: string;
  type: string;
  titulo: string;
  nome: string;
  colunas: 1 | 2 | 3;
  obrigatorio: boolean;
  desabilitado: boolean;
  somenteLeitura: boolean;
  valorPadrao: string;
  placeholder: string;
  textoAjuda: string;
  posicaoAjuda: 'direita' | 'abaixo';
  tamanhoAjuda: string;
  // Seleção / opções
  opcoes: string[];
  // Texto com máscara
  mascara: string;
  // Arquivo
  aceitarTipos: string;
  maxArquivos: number;
  maxTamanhoMb: number;
  // Título / layout
  nivelTitulo: 1 | 2 | 3 | 4;
  textoFixo: string;
  // Alerta
  alertaTipo: 'info' | 'aviso' | 'erro' | 'sucesso';
  // Imagem / Link
  srcImagem: string;
  altImagem: string;
  urlLink: string;
  textoLink: string;
  // Botão
  labelBotao: string;
  tipoBotao: 'submit' | 'reset' | 'button';
  estilobotao: 'primario' | 'secundario' | 'perigo';
  // Avançado
  validacaoCustom: string;
  condicaoExibir: string;
  // Container / grid
  filhos: FormFieldData[];
}

export type FormField = FormFieldData;

export interface FieldTypeDef {
  type: string;
  label: string;
  icon: string;
  categoria: string;
  color: string;
  bg: string;
  descricao: string;
}

// ── Catálogo ────────────────────────────────────────────────
export const FIELD_CATALOG: FieldTypeDef[] = [
  // Texto
  { type: 'text',      label: 'Texto',               icon: 'fa-regular fa-font',             categoria: 'Entrada de texto', color: '#0058db', bg: '#dce6f5', descricao: 'Campo de texto curto, linha única' },
  { type: 'textarea',  label: 'Caixa de texto',       icon: 'fa-regular fa-align-left',       categoria: 'Entrada de texto', color: '#0058db', bg: '#dce6f5', descricao: 'Área de texto multilinha' },
  { type: 'mask',      label: 'Máscara',              icon: 'fa-regular fa-input-numeric',    categoria: 'Entrada de texto', color: '#0058db', bg: '#dce6f5', descricao: 'Texto com formato personalizado' },
  { type: 'password',  label: 'Senha',                icon: 'fa-regular fa-lock',             categoria: 'Entrada de texto', color: '#0058db', bg: '#dce6f5', descricao: 'Campo com texto oculto' },
  { type: 'hidden',    label: 'Campo oculto',         icon: 'fa-regular fa-eye-slash',        categoria: 'Entrada de texto', color: '#7d7d7d', bg: '#f4f4f4', descricao: 'Campo invisível para o usuário' },

  // Numérico
  { type: 'number',    label: 'Número',               icon: 'fa-regular fa-hashtag',          categoria: 'Numérico',         color: '#0891b2', bg: '#cffafe', descricao: 'Campo numérico com validação' },
  { type: 'currency',  label: 'Moeda',                icon: 'fa-regular fa-circle-dollar',    categoria: 'Numérico',         color: '#0891b2', bg: '#cffafe', descricao: 'Valor em R$ com formatação automática' },
  { type: 'percent',   label: 'Porcentagem',          icon: 'fa-regular fa-percent',          categoria: 'Numérico',         color: '#0891b2', bg: '#cffafe', descricao: 'Valor percentual 0–100%' },

  // Data e hora
  { type: 'date',      label: 'Data',                 icon: 'fa-regular fa-calendar',         categoria: 'Data e hora',      color: '#d97706', bg: '#fef3c7', descricao: 'Seletor de data (dia/mês/ano)' },
  { type: 'time',      label: 'Hora',                 icon: 'fa-regular fa-clock',            categoria: 'Data e hora',      color: '#d97706', bg: '#fef3c7', descricao: 'Seletor de horário' },
  { type: 'datetime',  label: 'Data e hora',          icon: 'fa-regular fa-calendar-clock',   categoria: 'Data e hora',      color: '#d97706', bg: '#fef3c7', descricao: 'Data completa com horário' },

  // Documentos
  { type: 'cpf',       label: 'CPF',                  icon: 'fa-regular fa-id-card',          categoria: 'Documentos',       color: '#7c3aed', bg: '#ede9fe', descricao: 'CPF com validação e máscara' },
  { type: 'cnpj',      label: 'CNPJ',                 icon: 'fa-regular fa-building',         categoria: 'Documentos',       color: '#7c3aed', bg: '#ede9fe', descricao: 'CNPJ com validação e máscara' },
  { type: 'cep',       label: 'CEP',                  icon: 'fa-regular fa-map-pin',          categoria: 'Documentos',       color: '#7c3aed', bg: '#ede9fe', descricao: 'CEP com preenchimento automático de endereço' },
  { type: 'phone',     label: 'Telefone',             icon: 'fa-regular fa-phone',            categoria: 'Documentos',       color: '#7c3aed', bg: '#ede9fe', descricao: 'Telefone com DDD e máscara' },

  // Seleção
  { type: 'select',    label: 'Seleção',              icon: 'fa-regular fa-list-dropdown',    categoria: 'Seleção',          color: '#10b981', bg: '#d1fae5', descricao: 'Dropdown com uma opção' },
  { type: 'combobox',  label: 'Input select',         icon: 'fa-regular fa-magnifying-glass', categoria: 'Seleção',          color: '#10b981', bg: '#d1fae5', descricao: 'Seleção com busca por digitação' },
  { type: 'radio',     label: 'Opção única',          icon: 'fa-regular fa-circle-dot',       categoria: 'Seleção',          color: '#10b981', bg: '#d1fae5', descricao: 'Radio buttons — escolha uma opção' },
  { type: 'checkbox',  label: 'Múltipla escolha',     icon: 'fa-regular fa-square-check',     categoria: 'Seleção',          color: '#10b981', bg: '#d1fae5', descricao: 'Checkboxes — escolha várias opções' },
  { type: 'toggle',    label: 'Sim / Não',            icon: 'fa-regular fa-toggle-large-on',  categoria: 'Seleção',          color: '#10b981', bg: '#d1fae5', descricao: 'Interruptor liga/desliga' },
  { type: 'rating',    label: 'Avaliação',            icon: 'fa-regular fa-star',             categoria: 'Seleção',          color: '#10b981', bg: '#d1fae5', descricao: 'Estrelas de 1 a 5' },

  // Arquivo
  { type: 'file',      label: 'Arquivo',              icon: 'fa-regular fa-file-arrow-up',    categoria: 'Arquivo',          color: '#ea580c', bg: '#ffedd5', descricao: 'Upload de um arquivo' },
  { type: 'files',     label: 'Múltiplos arquivos',   icon: 'fa-regular fa-files',            categoria: 'Arquivo',          color: '#ea580c', bg: '#ffedd5', descricao: 'Upload de vários arquivos' },
  { type: 'signature', label: 'Assinatura',           icon: 'fa-regular fa-signature',        categoria: 'Arquivo',          color: '#ea580c', bg: '#ffedd5', descricao: 'Área de assinatura digital' },

  // Layout
  { type: 'heading',   label: 'Título',               icon: 'fa-regular fa-heading',          categoria: 'Layout',           color: '#6366f1', bg: '#ede9fe', descricao: 'Título de seção (H1–H4)' },
  { type: 'paragraph', label: 'Parágrafo',            icon: 'fa-regular fa-paragraph',        categoria: 'Layout',           color: '#6366f1', bg: '#ede9fe', descricao: 'Bloco de texto informativo fixo' },
  { type: 'divider',   label: 'Divisor',              icon: 'fa-regular fa-horizontal-rule',  categoria: 'Layout',           color: '#6366f1', bg: '#ede9fe', descricao: 'Linha separadora entre seções' },
  { type: 'spacer',    label: 'Espaçador',            icon: 'fa-regular fa-arrows-up-down',   categoria: 'Layout',           color: '#6366f1', bg: '#ede9fe', descricao: 'Espaço vazio entre campos' },
  { type: 'image',     label: 'Imagem',               icon: 'fa-regular fa-image',            categoria: 'Layout',           color: '#6366f1', bg: '#ede9fe', descricao: 'Imagem estática no formulário' },
  { type: 'link',      label: 'Link',                 icon: 'fa-regular fa-link',             categoria: 'Layout',           color: '#6366f1', bg: '#ede9fe', descricao: 'Hiperlink clicável' },
  { type: 'alert',     label: 'Alerta',               icon: 'fa-regular fa-triangle-exclamation', categoria: 'Layout',      color: '#6366f1', bg: '#ede9fe', descricao: 'Mensagem de alerta ou informação' },
  { type: 'container', label: 'Linha de campos',      icon: 'fa-regular fa-table-columns',    categoria: 'Layout',           color: '#6366f1', bg: '#ede9fe', descricao: 'Agrupa campos lado a lado em colunas' },

  // Especial
  { type: 'map',       label: 'Mapa',                 icon: 'fa-regular fa-map',              categoria: 'Especial',         color: '#0f6b3e', bg: '#dcfce7', descricao: 'Seleção de localização no mapa' },
  { type: 'terms',     label: 'Aceite de termos',     icon: 'fa-regular fa-file-signature',   categoria: 'Especial',         color: '#0f6b3e', bg: '#dcfce7', descricao: 'Checkbox com texto de termos de uso' },
  { type: 'lgpd',      label: 'Conformidade LGPD',    icon: 'fa-regular fa-shield-check',     categoria: 'Especial',         color: '#0f6b3e', bg: '#dcfce7', descricao: 'Declaração de consentimento LGPD' },
  { type: 'table',     label: 'Tabela editável',      icon: 'fa-regular fa-table',            categoria: 'Especial',         color: '#0f6b3e', bg: '#dcfce7', descricao: 'Tabela com linhas editáveis' },
  { type: 'subform',   label: 'Sub-formulário',       icon: 'fa-regular fa-layer-group',      categoria: 'Especial',         color: '#0f6b3e', bg: '#dcfce7', descricao: 'Incorpora outro formulário existente' },
  { type: 'button',    label: 'Botão',                icon: 'fa-regular fa-rectangle-wide',   categoria: 'Especial',         color: '#0f6b3e', bg: '#dcfce7', descricao: 'Botão de ação customizável' },
];

// Agrupa por categoria
export const FIELD_CATEGORIES = Array.from(new Set(FIELD_CATALOG.map(f => f.categoria)));

// Cria um novo campo com valores padrão baseado no tipo
export function createField(type: string, overrides: Partial<FormFieldData> = {}): FormFieldData {
  const def = FIELD_CATALOG.find(f => f.type === type);
  const id  = `field_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

  const base: FormFieldData = {
    id,
    type,
    titulo:          def?.label ?? 'Campo',
    nome:            `${type}_${id.slice(-4)}`,
    colunas:         3,
    obrigatorio:     false,
    desabilitado:    false,
    somenteLeitura:  false,
    valorPadrao:     '',
    placeholder:     '',
    textoAjuda:      '',
    posicaoAjuda:    'abaixo',
    tamanhoAjuda:    '',
    opcoes:          type === 'radio' || type === 'checkbox' || type === 'select' || type === 'combobox'
                       ? ['Opção 1', 'Opção 2', 'Opção 3']
                       : [],
    mascara:         type === 'mask' ? '##/##/####' : '',
    aceitarTipos:    '',
    maxArquivos:     5,
    maxTamanhoMb:    10,
    nivelTitulo:     2,
    textoFixo:       type === 'paragraph' ? 'Texto informativo para o preenchedor do formulário.'
                   : type === 'heading'   ? 'Título da seção'
                   : type === 'terms'     ? 'Li e concordo com os termos e condições desta solicitação.'
                   : type === 'lgpd'      ? 'Autorizo o uso dos meus dados pessoais conforme a Lei 13.709/2018 (LGPD), para os fins desta solicitação.'
                   : '',
    alertaTipo:      'info',
    srcImagem:       '',
    altImagem:       '',
    urlLink:         '',
    textoLink:       'Clique aqui',
    labelBotao:      'Enviar',
    tipoBotao:       'submit',
    estilobotao:     'primario',
    validacaoCustom: '',
    condicaoExibir:  '',
    filhos:          [],
  };

  // Defaults por tipo
  const typeDefaults: Partial<FormFieldData> = {};
  if (type === 'cpf')      typeDefaults.mascara = '###.###.###-##';
  if (type === 'cnpj')     typeDefaults.mascara = '##.###.###/####-##';
  if (type === 'cep')      typeDefaults.mascara = '#####-###';
  if (type === 'phone')    typeDefaults.mascara = '(##) #####-####';
  if (type === 'currency') typeDefaults.placeholder = 'R$ 0,00';
  if (type === 'date')     typeDefaults.placeholder = 'DD/MM/AAAA';
  if (type === 'file' || type === 'files') typeDefaults.aceitarTipos = '.pdf,.doc,.docx';

  return { ...base, ...typeDefaults, ...overrides };
}

// ── Templates de formulário ────────────────────────────────
export interface FormTemplate {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  icon: string;
  fields: FormFieldData[];
}

export const FORM_TEMPLATES: FormTemplate[] = [
  {
    id: 'solicitacao-simples',
    nome: 'Solicitação simples',
    descricao: 'Formulário básico de solicitação com dados do requerente',
    categoria: 'Geral',
    icon: 'fa-regular fa-file-lines',
    fields: [
      createField('heading',  { id: 'h1', textoFixo: 'Dados do requerente', nivelTitulo: 2 }),
      createField('text',     { id: 'f1', titulo: 'Nome completo', nome: 'nomeCompleto', obrigatorio: true, colunas: 3 }),
      createField('cpf',      { id: 'f2', titulo: 'CPF', nome: 'cpf', obrigatorio: true, colunas: 1 }),
      createField('phone',    { id: 'f3', titulo: 'Telefone', nome: 'telefone', colunas: 1 }),
      createField('text',     { id: 'f4', titulo: 'E-mail', nome: 'email', obrigatorio: true, colunas: 1 }),
      createField('divider',  { id: 'd1' }),
      createField('heading',  { id: 'h2', textoFixo: 'Detalhes da solicitação', nivelTitulo: 2 }),
      createField('textarea', { id: 'f5', titulo: 'Descrição', nome: 'descricao', obrigatorio: true, colunas: 3, placeholder: 'Descreva sua solicitação em detalhes...' }),
      createField('file',     { id: 'f6', titulo: 'Documentos comprobatórios', nome: 'anexos', colunas: 3 }),
      createField('lgpd',     { id: 'lgpd1' }),
      createField('terms',    { id: 'terms1' }),
    ],
  },
  {
    id: 'cadastro-empresa',
    nome: 'Cadastro de empresa',
    descricao: 'Dados cadastrais de pessoa jurídica',
    categoria: 'Cadastro',
    icon: 'fa-regular fa-building',
    fields: [
      createField('heading',  { id: 'h1', textoFixo: 'Dados da empresa', nivelTitulo: 2 }),
      createField('text',     { id: 'f1', titulo: 'Razão social', nome: 'razaoSocial', obrigatorio: true, colunas: 2 }),
      createField('text',     { id: 'f2', titulo: 'Nome fantasia', nome: 'nomeFantasia', colunas: 1 }),
      createField('cnpj',     { id: 'f3', titulo: 'CNPJ', nome: 'cnpj', obrigatorio: true, colunas: 1 }),
      createField('select',   { id: 'f4', titulo: 'Porte da empresa', nome: 'porte', colunas: 1, opcoes: ['MEI', 'Microempresa', 'Pequena', 'Média', 'Grande'] }),
      createField('phone',    { id: 'f5', titulo: 'Telefone comercial', nome: 'telefone', colunas: 1 }),
      createField('divider',  { id: 'd1' }),
      createField('heading',  { id: 'h2', textoFixo: 'Endereço', nivelTitulo: 2 }),
      createField('cep',      { id: 'f6', titulo: 'CEP', nome: 'cep', colunas: 1 }),
      createField('text',     { id: 'f7', titulo: 'Logradouro', nome: 'logradouro', colunas: 2 }),
      createField('text',     { id: 'f8', titulo: 'Número', nome: 'numero', colunas: 1 }),
      createField('text',     { id: 'f9', titulo: 'Bairro', nome: 'bairro', colunas: 1 }),
      createField('text',     { id: 'f10', titulo: 'Cidade', nome: 'cidade', colunas: 1 }),
    ],
  },
  {
    id: 'parecer-tecnico',
    nome: 'Parecer técnico',
    descricao: 'Modelo para análise e parecer de servidor técnico',
    categoria: 'Análise',
    icon: 'fa-regular fa-file-check',
    fields: [
      createField('heading',   { id: 'h1', textoFixo: 'Parecer Técnico', nivelTitulo: 1 }),
      createField('alert',     { id: 'al1', textoFixo: 'Preencha todos os campos obrigatórios antes de assinar.', alertaTipo: 'info' }),
      createField('text',      { id: 'f1', titulo: 'Número do processo', nome: 'numeroProcesso', obrigatorio: true, colunas: 1 }),
      createField('date',      { id: 'f2', titulo: 'Data da análise', nome: 'dataAnalise', obrigatorio: true, colunas: 1 }),
      createField('text',      { id: 'f3', titulo: 'Servidor responsável', nome: 'servidor', obrigatorio: true, colunas: 1 }),
      createField('divider',   { id: 'd1' }),
      createField('textarea',  { id: 'f4', titulo: 'Análise técnica', nome: 'analise', obrigatorio: true, colunas: 3, placeholder: 'Descreva a análise técnica realizada...' }),
      createField('radio',     { id: 'f5', titulo: 'Parecer', nome: 'parecer', obrigatorio: true, colunas: 3, opcoes: ['Favorável', 'Favorável com ressalvas', 'Desfavorável'] }),
      createField('textarea',  { id: 'f6', titulo: 'Ressalvas / Observações', nome: 'ressalvas', colunas: 3, placeholder: 'Descreva ressalvas caso existam...' }),
      createField('signature', { id: 'sig1', titulo: 'Assinatura do servidor', nome: 'assinatura', colunas: 3 }),
    ],
  },
];
