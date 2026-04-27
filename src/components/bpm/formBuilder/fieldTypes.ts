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
  filhos2: FormFieldData[];
  proporcao: '1/2+1/2' | '1/3+2/3' | '1/4+3/4';
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
    filhos2:         [],
    proporcao:       '1/2+1/2',
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
  color: string;
  bg: string;
  fields: FormFieldData[];
}

export const FORM_TEMPLATES: FormTemplate[] = [

  // ── 1. Solicitação de Compras ───────────────────────────────
  {
    id: 'solicitacao-compras',
    nome: 'Solicitação de Compras',
    descricao: 'Requisição de materiais, serviços ou equipamentos com justificativa e cotação',
    categoria: 'Compras',
    icon: 'fa-regular fa-cart-shopping',
    color: '#0058db',
    bg: '#dce6f5',
    fields: [
      createField('alert',     { id: 'al1', textoFixo: 'Anexe ao menos uma cotação antes de enviar a solicitação.', alertaTipo: 'info' }),
      createField('heading',   { id: 'h1', textoFixo: 'Dados do Solicitante', nivelTitulo: 2 }),
      createField('text',      { id: 'f1', titulo: 'Nome do solicitante', nome: 'nomeSolicitante', obrigatorio: true, colunas: 2 }),
      createField('text',      { id: 'f2', titulo: 'Departamento / Setor', nome: 'departamento', obrigatorio: true, colunas: 1 }),
      createField('text',      { id: 'f3', titulo: 'Centro de custo', nome: 'centroCusto', colunas: 1 }),
      createField('date',      { id: 'f4', titulo: 'Data da solicitação', nome: 'dataSolicitacao', obrigatorio: true, colunas: 1 }),
      createField('select',    { id: 'f5', titulo: 'Urgência', nome: 'urgencia', obrigatorio: true, colunas: 1, opcoes: ['Normal (até 15 dias)', 'Urgente (até 5 dias)', 'Muito urgente (até 48h)'] }),
      createField('divider',   { id: 'd1' }),
      createField('heading',   { id: 'h2', textoFixo: 'Itens Solicitados', nivelTitulo: 2 }),
      createField('select',    { id: 'f6', titulo: 'Categoria', nome: 'categoria', obrigatorio: true, colunas: 1, opcoes: ['Material de escritório', 'Equipamento de TI', 'Mobiliário', 'Serviços terceirizados', 'Outros'] }),
      createField('textarea',  { id: 'f7', titulo: 'Descrição dos itens', nome: 'descricaoItens', obrigatorio: true, colunas: 3, placeholder: 'Informe quantidade, especificação técnica e referências de mercado...' }),
      createField('currency',  { id: 'f8', titulo: 'Valor estimado total', nome: 'valorEstimado', obrigatorio: true, colunas: 1 }),
      createField('divider',   { id: 'd2' }),
      createField('heading',   { id: 'h3', textoFixo: 'Justificativa', nivelTitulo: 2 }),
      createField('textarea',  { id: 'f9', titulo: 'Justificativa da aquisição', nome: 'justificativa', obrigatorio: true, colunas: 3, placeholder: 'Descreva a necessidade e o impacto caso a compra não seja realizada...' }),
      createField('files',     { id: 'f10', titulo: 'Cotações / Orçamentos', nome: 'cotacoes', colunas: 3 }),
      createField('terms',     { id: 'terms1', textoFixo: 'Declaro que as informações prestadas são verdadeiras e que esta solicitação está de acordo com as políticas internas de aquisição.' }),
    ],
  },

  // ── 2. Chamado de TI ────────────────────────────────────────
  {
    id: 'chamado-ti',
    nome: 'Chamado de TI',
    descricao: 'Abertura de ticket para suporte técnico, incidentes e requisições de serviço',
    categoria: 'TI',
    icon: 'fa-regular fa-headset',
    color: '#6366f1',
    bg: '#ede9fe',
    fields: [
      createField('heading',   { id: 'h1', textoFixo: 'Identificação do Solicitante', nivelTitulo: 2 }),
      createField('text',      { id: 'f1', titulo: 'Nome completo', nome: 'nome', obrigatorio: true, colunas: 2 }),
      createField('text',      { id: 'f2', titulo: 'Ramal / Telefone', nome: 'ramal', colunas: 1 }),
      createField('select',    { id: 'f3', titulo: 'Departamento', nome: 'departamento', obrigatorio: true, colunas: 1, opcoes: ['Administração', 'Financeiro', 'RH', 'Jurídico', 'TI', 'Operações', 'Comercial', 'Outros'] }),
      createField('text',      { id: 'f4', titulo: 'E-mail para retorno', nome: 'email', obrigatorio: true, colunas: 1 }),
      createField('datetime',  { id: 'f5', titulo: 'Data e hora do problema', nome: 'dataHoraProblema', obrigatorio: true, colunas: 1 }),
      createField('divider',   { id: 'd1' }),
      createField('heading',   { id: 'h2', textoFixo: 'Detalhes do Chamado', nivelTitulo: 2 }),
      createField('select',    { id: 'f6', titulo: 'Tipo de chamado', nome: 'tipoChamado', obrigatorio: true, colunas: 1, opcoes: ['Incidente (algo parou de funcionar)', 'Requisição (novo recurso/acesso)', 'Dúvida', 'Manutenção preventiva'] }),
      createField('select',    { id: 'f7', titulo: 'Categoria', nome: 'categoria', obrigatorio: true, colunas: 1, opcoes: ['Hardware', 'Software / Sistema', 'Rede / Internet', 'E-mail / Comunicação', 'Impressora', 'Acesso / Senha', 'Outros'] }),
      createField('select',    { id: 'f8', titulo: 'Prioridade', nome: 'prioridade', obrigatorio: true, colunas: 1, opcoes: ['Baixa', 'Média', 'Alta', 'Crítica — sistema parado'] }),
      createField('radio',     { id: 'f9', titulo: 'Equipamento afetado', nome: 'equipamento', colunas: 3, opcoes: ['Desktop', 'Notebook', 'Celular corporativo', 'Servidor', 'Impressora', 'Outros'] }),
      createField('textarea',  { id: 'f10', titulo: 'Descrição detalhada do problema', nome: 'descricao', obrigatorio: true, colunas: 3, placeholder: 'Descreva o que aconteceu, quando começou, mensagens de erro, e o que já foi tentado...' }),
      createField('files',     { id: 'f11', titulo: 'Capturas de tela / evidências', nome: 'evidencias', colunas: 3 }),
    ],
  },

  // ── 3. Admissão de Funcionário ──────────────────────────────
  {
    id: 'admissao-funcionario',
    nome: 'Admissão de Funcionário',
    descricao: 'Coleta de dados pessoais, documentação e informações contratuais para onboarding',
    categoria: 'RH',
    icon: 'fa-regular fa-user-plus',
    color: '#0f6b3e',
    bg: '#dcfce7',
    fields: [
      createField('alert',     { id: 'al1', textoFixo: 'Todos os documentos originais deverão ser apresentados no primeiro dia de trabalho.', alertaTipo: 'aviso' }),
      createField('heading',   { id: 'h1', textoFixo: 'Dados Pessoais', nivelTitulo: 2 }),
      createField('text',      { id: 'f1', titulo: 'Nome completo', nome: 'nomeCompleto', obrigatorio: true, colunas: 3 }),
      createField('cpf',       { id: 'f2', titulo: 'CPF', nome: 'cpf', obrigatorio: true, colunas: 1 }),
      createField('text',      { id: 'f3', titulo: 'RG / Documento de identidade', nome: 'rg', obrigatorio: true, colunas: 1 }),
      createField('date',      { id: 'f4', titulo: 'Data de nascimento', nome: 'dataNascimento', obrigatorio: true, colunas: 1 }),
      createField('select',    { id: 'f5', titulo: 'Estado civil', nome: 'estadoCivil', colunas: 1, opcoes: ['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)', 'União estável'] }),
      createField('select',    { id: 'f6', titulo: 'Escolaridade', nome: 'escolaridade', colunas: 1, opcoes: ['Ensino médio', 'Superior incompleto', 'Superior completo', 'Pós-graduação', 'Mestrado', 'Doutorado'] }),
      createField('phone',     { id: 'f7', titulo: 'Telefone / WhatsApp', nome: 'telefone', obrigatorio: true, colunas: 1 }),
      createField('text',      { id: 'f8', titulo: 'E-mail pessoal', nome: 'emailPessoal', obrigatorio: true, colunas: 1 }),
      createField('divider',   { id: 'd1' }),
      createField('heading',   { id: 'h2', textoFixo: 'Dados Profissionais', nivelTitulo: 2 }),
      createField('text',      { id: 'f9', titulo: 'Cargo / Função', nome: 'cargo', obrigatorio: true, colunas: 1 }),
      createField('text',      { id: 'f10', titulo: 'Departamento', nome: 'departamento', obrigatorio: true, colunas: 1 }),
      createField('date',      { id: 'f11', titulo: 'Data de admissão', nome: 'dataAdmissao', obrigatorio: true, colunas: 1 }),
      createField('select',    { id: 'f12', titulo: 'Tipo de contrato', nome: 'tipoContrato', obrigatorio: true, colunas: 1, opcoes: ['CLT', 'PJ', 'Estágio', 'Temporário', 'Autônomo'] }),
      createField('currency',  { id: 'f13', titulo: 'Salário / Remuneração', nome: 'salario', obrigatorio: true, colunas: 1 }),
      createField('text',      { id: 'f14', titulo: 'Gestor direto', nome: 'gestor', colunas: 1 }),
      createField('divider',   { id: 'd2' }),
      createField('heading',   { id: 'h3', textoFixo: 'Documentos Necessários', nivelTitulo: 2 }),
      createField('files',     { id: 'f15', titulo: 'RG, CPF, Carteira de Trabalho, Comprovante de residência', nome: 'documentos', obrigatorio: true, colunas: 3 }),
      createField('lgpd',      { id: 'lgpd1' }),
    ],
  },

  // ── 4. Relatório de Despesas ────────────────────────────────
  {
    id: 'relatorio-despesas',
    nome: 'Relatório de Despesas',
    descricao: 'Prestação de contas de viagens, refeições e despesas corporativas com comprovantes',
    categoria: 'Financeiro',
    icon: 'fa-regular fa-receipt',
    color: '#d97706',
    bg: '#fef3c7',
    fields: [
      createField('heading',   { id: 'h1', textoFixo: 'Dados do Colaborador', nivelTitulo: 2 }),
      createField('text',      { id: 'f1', titulo: 'Nome do colaborador', nome: 'nomeColaborador', obrigatorio: true, colunas: 2 }),
      createField('text',      { id: 'f2', titulo: 'Departamento', nome: 'departamento', obrigatorio: true, colunas: 1 }),
      createField('text',      { id: 'f3', titulo: 'Projeto / Cliente', nome: 'projeto', colunas: 1 }),
      createField('date',      { id: 'f4', titulo: 'Período — início', nome: 'dataInicio', obrigatorio: true, colunas: 1 }),
      createField('date',      { id: 'f5', titulo: 'Período — fim', nome: 'dataFim', obrigatorio: true, colunas: 1 }),
      createField('divider',   { id: 'd1' }),
      createField('heading',   { id: 'h2', textoFixo: 'Detalhamento das Despesas', nivelTitulo: 2 }),
      createField('alert',     { id: 'al1', textoFixo: 'Informe apenas despesas com comprovante fiscal (NF ou recibo). Despesas sem comprovante não serão reembolsadas.', alertaTipo: 'aviso' }),
      createField('currency',  { id: 'f6', titulo: 'Alimentação / Refeições', nome: 'alimentacao', colunas: 1 }),
      createField('currency',  { id: 'f7', titulo: 'Transporte (taxi, app, combustível)', nome: 'transporte', colunas: 1 }),
      createField('currency',  { id: 'f8', titulo: 'Hospedagem', nome: 'hospedagem', colunas: 1 }),
      createField('currency',  { id: 'f9', titulo: 'Passagens aéreas / rodoviárias', nome: 'passagens', colunas: 1 }),
      createField('currency',  { id: 'f10', titulo: 'Outros (discriminar abaixo)', nome: 'outros', colunas: 1 }),
      createField('textarea',  { id: 'f11', titulo: 'Discriminação de outras despesas', nome: 'discriminacaoOutros', colunas: 3, placeholder: 'Descreva cada item com data, valor e finalidade...' }),
      createField('divider',   { id: 'd2' }),
      createField('heading',   { id: 'h3', textoFixo: 'Comprovantes', nivelTitulo: 2 }),
      createField('files',     { id: 'f12', titulo: 'Notas fiscais e comprovantes', nome: 'comprovantes', obrigatorio: true, colunas: 3 }),
      createField('textarea',  { id: 'f13', titulo: 'Observações adicionais', nome: 'observacoes', colunas: 3, placeholder: 'Contexto da viagem, justificativas especiais...' }),
      createField('terms',     { id: 'terms1', textoFixo: 'Declaro que as despesas informadas são verdadeiras, foram incorridas em benefício da empresa e estão acompanhadas de comprovantes fiscais válidos.' }),
    ],
  },

  // ── 5. Solicitação de Férias ────────────────────────────────
  {
    id: 'solicitacao-ferias',
    nome: 'Solicitação de Férias',
    descricao: 'Pedido de período de férias com aprovação do gestor e confirmação de saldo',
    categoria: 'RH',
    icon: 'fa-regular fa-umbrella-beach',
    color: '#0891b2',
    bg: '#cffafe',
    fields: [
      createField('heading',   { id: 'h1', textoFixo: 'Dados do Colaborador', nivelTitulo: 2 }),
      createField('text',      { id: 'f1', titulo: 'Nome completo', nome: 'nomeCompleto', obrigatorio: true, colunas: 2 }),
      createField('text',      { id: 'f2', titulo: 'Matrícula', nome: 'matricula', obrigatorio: true, colunas: 1 }),
      createField('text',      { id: 'f3', titulo: 'Cargo / Função', nome: 'cargo', obrigatorio: true, colunas: 1 }),
      createField('text',      { id: 'f4', titulo: 'Departamento', nome: 'departamento', obrigatorio: true, colunas: 1 }),
      createField('text',      { id: 'f5', titulo: 'Gestor responsável', nome: 'gestor', obrigatorio: true, colunas: 1 }),
      createField('divider',   { id: 'd1' }),
      createField('heading',   { id: 'h2', textoFixo: 'Período de Férias', nivelTitulo: 2 }),
      createField('radio',     { id: 'f6', titulo: 'Forma de gozo', nome: 'formaGozo', obrigatorio: true, colunas: 3, opcoes: ['30 dias corridos', '20 dias + 10 dias (abono)', '15 dias + 15 dias', '10 dias + 10 dias + 10 dias'] }),
      createField('date',      { id: 'f7', titulo: 'Início do 1º período', nome: 'inicioP1', obrigatorio: true, colunas: 1 }),
      createField('date',      { id: 'f8', titulo: 'Fim do 1º período', nome: 'fimP1', obrigatorio: true, colunas: 1 }),
      createField('number',    { id: 'f9', titulo: 'Total de dias (1º período)', nome: 'diasP1', colunas: 1 }),
      createField('date',      { id: 'f10', titulo: 'Início do 2º período (se houver)', nome: 'inicioP2', colunas: 1 }),
      createField('date',      { id: 'f11', titulo: 'Fim do 2º período (se houver)', nome: 'fimP2', colunas: 1 }),
      createField('textarea',  { id: 'f12', titulo: 'Observações', nome: 'observacoes', colunas: 3, placeholder: 'Informações relevantes para o período de ausência, substituto designado...' }),
      createField('divider',   { id: 'd2' }),
      createField('alert',     { id: 'al1', textoFixo: 'Ao submeter este formulário, confirmo que possuo saldo de férias suficiente e que meu gestor está ciente da solicitação.', alertaTipo: 'info' }),
      createField('terms',     { id: 'terms1', textoFixo: 'Confirmo que meu saldo de férias é suficiente para o período solicitado e que não há pendências críticas que impeçam meu afastamento.' }),
    ],
  },

  // ── 6. Avaliação de Fornecedor ──────────────────────────────
  {
    id: 'avaliacao-fornecedor',
    nome: 'Avaliação de Fornecedor',
    descricao: 'Qualificação e avaliação de desempenho de fornecedores e prestadores de serviço',
    categoria: 'Compras',
    icon: 'fa-regular fa-star-half-stroke',
    color: '#9333ea',
    bg: '#f3e8ff',
    fields: [
      createField('heading',   { id: 'h1', textoFixo: 'Dados do Fornecedor', nivelTitulo: 2 }),
      createField('text',      { id: 'f1', titulo: 'Razão social', nome: 'razaoSocial', obrigatorio: true, colunas: 2 }),
      createField('cnpj',      { id: 'f2', titulo: 'CNPJ', nome: 'cnpj', obrigatorio: true, colunas: 1 }),
      createField('text',      { id: 'f3', titulo: 'Responsável pelo contato', nome: 'responsavel', colunas: 1 }),
      createField('phone',     { id: 'f4', titulo: 'Telefone', nome: 'telefone', colunas: 1 }),
      createField('text',      { id: 'f5', titulo: 'E-mail comercial', nome: 'email', colunas: 1 }),
      createField('select',    { id: 'f6', titulo: 'Segmento', nome: 'segmento', colunas: 1, opcoes: ['Tecnologia', 'Material de escritório', 'Serviços gerais', 'Construção / Obras', 'Saúde', 'Alimentação', 'Transporte', 'Consultoria', 'Outros'] }),
      createField('divider',   { id: 'd1' }),
      createField('heading',   { id: 'h2', textoFixo: 'Critérios de Avaliação', nivelTitulo: 2 }),
      createField('alert',     { id: 'al1', textoFixo: 'Avalie cada critério de 1 (péssimo) a 5 (excelente) com base na experiência mais recente.', alertaTipo: 'info' }),
      createField('rating',    { id: 'f7', titulo: 'Qualidade dos produtos / serviços', nome: 'qualidade', obrigatorio: true, colunas: 3 }),
      createField('rating',    { id: 'f8', titulo: 'Prazo de entrega / execução', nome: 'prazoEntrega', obrigatorio: true, colunas: 3 }),
      createField('rating',    { id: 'f9', titulo: 'Atendimento e suporte pós-venda', nome: 'atendimento', obrigatorio: true, colunas: 3 }),
      createField('rating',    { id: 'f10', titulo: 'Preço e custo-benefício', nome: 'preco', obrigatorio: true, colunas: 3 }),
      createField('rating',    { id: 'f11', titulo: 'Conformidade com especificações', nome: 'conformidade', obrigatorio: true, colunas: 3 }),
      createField('divider',   { id: 'd2' }),
      createField('radio',     { id: 'f12', titulo: 'Recomendaria este fornecedor?', nome: 'recomendacao', obrigatorio: true, colunas: 3, opcoes: ['Sim, sem ressalvas', 'Sim, com ressalvas', 'Não recomendo', 'Fornecedor bloqueado'] }),
      createField('textarea',  { id: 'f13', titulo: 'Pontos positivos', nome: 'pontosPositivos', colunas: 3, placeholder: 'O que o fornecedor faz bem...' }),
      createField('textarea',  { id: 'f14', titulo: 'Pontos de melhoria / ressalvas', nome: 'melhorias', colunas: 3, placeholder: 'O que precisa melhorar ou justificativas de bloqueio...' }),
    ],
  },

  // ── 7. Ouvidoria / Manifestação ─────────────────────────────
  {
    id: 'ouvidoria',
    nome: 'Ouvidoria / Manifestação',
    descricao: 'Canal oficial para reclamações, sugestões, elogios e denúncias',
    categoria: 'Cidadania',
    icon: 'fa-regular fa-megaphone',
    color: '#c0182d',
    bg: '#fee2e2',
    fields: [
      createField('heading',   { id: 'h1', textoFixo: 'Tipo de Manifestação', nivelTitulo: 2 }),
      createField('select',    { id: 'f1', titulo: 'Tipo', nome: 'tipoManifestacao', obrigatorio: true, colunas: 1, opcoes: ['Reclamação', 'Sugestão', 'Elogio', 'Denúncia', 'Solicitação de informação', 'Solicitação de providência'] }),
      createField('select',    { id: 'f2', titulo: 'Área / Setor relacionado', nome: 'area', obrigatorio: true, colunas: 1, opcoes: ['Atendimento ao público', 'Obras e serviços urbanos', 'Saúde', 'Educação', 'Tributação / Finanças', 'Meio ambiente', 'Segurança pública', 'Outros'] }),
      createField('date',      { id: 'f3', titulo: 'Data do fato', nome: 'dataFato', colunas: 1 }),
      createField('divider',   { id: 'd1' }),
      createField('heading',   { id: 'h2', textoFixo: 'Sua Identificação (opcional)', nivelTitulo: 2 }),
      createField('alert',     { id: 'al1', textoFixo: 'A identificação é opcional. Manifestações anônimas serão tratadas, mas não poderemos encaminhar resposta pessoal.', alertaTipo: 'info' }),
      createField('text',      { id: 'f4', titulo: 'Nome completo', nome: 'nome', colunas: 2 }),
      createField('cpf',       { id: 'f5', titulo: 'CPF', nome: 'cpf', colunas: 1 }),
      createField('phone',     { id: 'f6', titulo: 'Telefone para contato', nome: 'telefone', colunas: 1 }),
      createField('text',      { id: 'f7', titulo: 'E-mail para resposta', nome: 'email', colunas: 1 }),
      createField('cep',       { id: 'f8', titulo: 'CEP', nome: 'cep', colunas: 1 }),
      createField('divider',   { id: 'd2' }),
      createField('heading',   { id: 'h3', textoFixo: 'Relato da Manifestação', nivelTitulo: 2 }),
      createField('textarea',  { id: 'f9', titulo: 'Descreva sua manifestação', nome: 'relato', obrigatorio: true, colunas: 3, placeholder: 'Seja o mais detalhado possível: local, data, pessoas envolvidas, o que ocorreu...' }),
      createField('files',     { id: 'f10', titulo: 'Documentos, fotos ou evidências de apoio', nome: 'evidencias', colunas: 3 }),
      createField('lgpd',      { id: 'lgpd1' }),
    ],
  },

  // ── 8. Abertura de Processo Administrativo ──────────────────
  {
    id: 'abertura-processo',
    nome: 'Abertura de Processo',
    descricao: 'Registro de processo administrativo com dados do requerente e documentação inicial',
    categoria: 'Processos',
    icon: 'fa-regular fa-folder-open',
    color: '#0058db',
    bg: '#dce6f5',
    fields: [
      createField('alert',     { id: 'al1', textoFixo: 'Após o envio, você receberá um número de protocolo no e-mail informado. Guarde-o para acompanhar o andamento.', alertaTipo: 'sucesso' }),
      createField('heading',   { id: 'h1', textoFixo: 'Dados do Requerente', nivelTitulo: 2 }),
      createField('radio',     { id: 'f1', titulo: 'Tipo de pessoa', nome: 'tipoPessoa', obrigatorio: true, colunas: 3, opcoes: ['Pessoa física', 'Pessoa jurídica'] }),
      createField('text',      { id: 'f2', titulo: 'Nome completo / Razão social', nome: 'nomeRazao', obrigatorio: true, colunas: 2 }),
      createField('cpf',       { id: 'f3', titulo: 'CPF / CNPJ', nome: 'cpfCnpj', obrigatorio: true, colunas: 1 }),
      createField('phone',     { id: 'f4', titulo: 'Telefone', nome: 'telefone', obrigatorio: true, colunas: 1 }),
      createField('text',      { id: 'f5', titulo: 'E-mail', nome: 'email', obrigatorio: true, colunas: 1 }),
      createField('cep',       { id: 'f6', titulo: 'CEP', nome: 'cep', colunas: 1 }),
      createField('text',      { id: 'f7', titulo: 'Endereço completo', nome: 'endereco', colunas: 2 }),
      createField('divider',   { id: 'd1' }),
      createField('heading',   { id: 'h2', textoFixo: 'Dados do Processo', nivelTitulo: 2 }),
      createField('select',    { id: 'f8', titulo: 'Tipo de processo', nome: 'tipoProcesso', obrigatorio: true, colunas: 1, opcoes: ['Licenciamento', 'Recurso / Impugnação', 'Habilitação', 'Contratação', 'Regularização fiscal', 'Outros'] }),
      createField('text',      { id: 'f9', titulo: 'Assunto / Objeto do pedido', nome: 'assunto', obrigatorio: true, colunas: 2 }),
      createField('divider',   { id: 'd2' }),
      createField('heading',   { id: 'h3', textoFixo: 'Exposição do Pedido', nivelTitulo: 2 }),
      createField('textarea',  { id: 'f10', titulo: 'Descrição detalhada', nome: 'descricao', obrigatorio: true, colunas: 3, placeholder: 'Exponha os fatos, fundamentos e o que está sendo requerido...' }),
      createField('files',     { id: 'f11', titulo: 'Documentos comprobatórios', nome: 'documentos', obrigatorio: true, colunas: 3 }),
      createField('lgpd',      { id: 'lgpd1' }),
      createField('terms',     { id: 'terms1', textoFixo: 'Declaro que as informações prestadas são verdadeiras e que os documentos anexados são autênticos, assumindo responsabilidade legal pelas declarações.' }),
    ],
  },

  // ── 9. Licença de Funcionamento ─────────────────────────────
  {
    id: 'licenca-funcionamento',
    nome: 'Licença de Funcionamento',
    descricao: 'Solicitação de alvará e licença para funcionamento de estabelecimento comercial',
    categoria: 'Cidadania',
    icon: 'fa-regular fa-shop',
    color: '#0f6b3e',
    bg: '#dcfce7',
    fields: [
      createField('heading',   { id: 'h1', textoFixo: 'Dados do Estabelecimento', nivelTitulo: 2 }),
      createField('text',      { id: 'f1', titulo: 'Nome / Razão social', nome: 'razaoSocial', obrigatorio: true, colunas: 2 }),
      createField('text',      { id: 'f2', titulo: 'Nome fantasia', nome: 'nomeFantasia', colunas: 1 }),
      createField('cnpj',      { id: 'f3', titulo: 'CNPJ', nome: 'cnpj', obrigatorio: true, colunas: 1 }),
      createField('text',      { id: 'f4', titulo: 'Responsável legal', nome: 'responsavel', obrigatorio: true, colunas: 1 }),
      createField('cpf',       { id: 'f5', titulo: 'CPF do responsável', nome: 'cpfResponsavel', obrigatorio: true, colunas: 1 }),
      createField('phone',     { id: 'f6', titulo: 'Telefone comercial', nome: 'telefone', obrigatorio: true, colunas: 1 }),
      createField('text',      { id: 'f7', titulo: 'E-mail', nome: 'email', obrigatorio: true, colunas: 1 }),
      createField('divider',   { id: 'd1' }),
      createField('heading',   { id: 'h2', textoFixo: 'Endereço do Estabelecimento', nivelTitulo: 2 }),
      createField('cep',       { id: 'f8', titulo: 'CEP', nome: 'cep', obrigatorio: true, colunas: 1 }),
      createField('text',      { id: 'f9', titulo: 'Logradouro', nome: 'logradouro', obrigatorio: true, colunas: 2 }),
      createField('text',      { id: 'f10', titulo: 'Número', nome: 'numero', obrigatorio: true, colunas: 1 }),
      createField('text',      { id: 'f11', titulo: 'Complemento', nome: 'complemento', colunas: 1 }),
      createField('text',      { id: 'f12', titulo: 'Bairro', nome: 'bairro', obrigatorio: true, colunas: 1 }),
      createField('divider',   { id: 'd2' }),
      createField('heading',   { id: 'h3', textoFixo: 'Atividade Comercial', nivelTitulo: 2 }),
      createField('select',    { id: 'f13', titulo: 'Tipo de atividade', nome: 'tipoAtividade', obrigatorio: true, colunas: 1, opcoes: ['Comércio varejista', 'Comércio atacadista', 'Prestação de serviços', 'Indústria', 'Alimentação', 'Saúde', 'Educação', 'Outros'] }),
      createField('textarea',  { id: 'f14', titulo: 'Descrição da atividade', nome: 'descricaoAtividade', obrigatorio: true, colunas: 3, placeholder: 'Descreva as atividades desenvolvidas no estabelecimento...' }),
      createField('number',    { id: 'f15', titulo: 'Área total do estabelecimento (m²)', nome: 'area', colunas: 1 }),
      createField('number',    { id: 'f16', titulo: 'Número de funcionários', nome: 'numFuncionarios', colunas: 1 }),
      createField('divider',   { id: 'd3' }),
      createField('heading',   { id: 'h4', textoFixo: 'Documentação', nivelTitulo: 2 }),
      createField('alert',     { id: 'al1', textoFixo: 'Documentos necessários: Contrato Social, CNPJ, Comprovante de endereço, Laudo de vistoria (se aplicável).', alertaTipo: 'info' }),
      createField('files',     { id: 'f17', titulo: 'Documentos obrigatórios', nome: 'documentos', obrigatorio: true, colunas: 3 }),
      createField('lgpd',      { id: 'lgpd1' }),
      createField('terms',     { id: 'terms1', textoFixo: 'Declaro que as informações prestadas são verdadeiras e que o estabelecimento atende às normas municipais de funcionamento, saúde, segurança e meio ambiente.' }),
    ],
  },

  // ── 10. Parecer Técnico ─────────────────────────────────────
  {
    id: 'parecer-tecnico',
    nome: 'Parecer Técnico',
    descricao: 'Análise e parecer formal de servidor técnico ou especialista designado',
    categoria: 'Processos',
    icon: 'fa-regular fa-file-certificate',
    color: '#7c3aed',
    bg: '#ede9fe',
    fields: [
      createField('heading',   { id: 'h1', textoFixo: 'Identificação do Parecer', nivelTitulo: 1 }),
      createField('alert',     { id: 'al1', textoFixo: 'Este documento tem validade legal. Preencha com atenção e assine digitalmente ao final.', alertaTipo: 'aviso' }),
      createField('text',      { id: 'f1', titulo: 'Número do processo / protocolo', nome: 'numeroProcesso', obrigatorio: true, colunas: 1 }),
      createField('date',      { id: 'f2', titulo: 'Data da análise', nome: 'dataAnalise', obrigatorio: true, colunas: 1 }),
      createField('text',      { id: 'f3', titulo: 'Servidor / Especialista responsável', nome: 'servidor', obrigatorio: true, colunas: 1 }),
      createField('text',      { id: 'f4', titulo: 'Cargo / Especialidade', nome: 'cargo', obrigatorio: true, colunas: 1 }),
      createField('text',      { id: 'f5', titulo: 'Registro profissional (CREA, CRM, OAB...)', nome: 'registro', colunas: 1 }),
      createField('text',      { id: 'f6', titulo: 'Área / Departamento', nome: 'area', obrigatorio: true, colunas: 1 }),
      createField('divider',   { id: 'd1' }),
      createField('heading',   { id: 'h2', textoFixo: 'Objeto da Análise', nivelTitulo: 2 }),
      createField('textarea',  { id: 'f7', titulo: 'Objeto analisado', nome: 'objeto', obrigatorio: true, colunas: 3, placeholder: 'Identifique o processo, documento ou situação objeto deste parecer...' }),
      createField('divider',   { id: 'd2' }),
      createField('heading',   { id: 'h3', textoFixo: 'Análise Técnica', nivelTitulo: 2 }),
      createField('textarea',  { id: 'f8', titulo: 'Fundamentação e análise', nome: 'analise', obrigatorio: true, colunas: 3, placeholder: 'Descreva os critérios técnicos, normas aplicáveis e análise realizada...' }),
      createField('textarea',  { id: 'f9', titulo: 'Conclusão / Recomendação', nome: 'conclusao', obrigatorio: true, colunas: 3, placeholder: 'Apresente a conclusão técnica de forma clara e objetiva...' }),
      createField('radio',     { id: 'f10', titulo: 'Parecer final', nome: 'parecerFinal', obrigatorio: true, colunas: 3, opcoes: ['Favorável', 'Favorável com ressalvas / condicionantes', 'Desfavorável', 'Pendente de informações complementares'] }),
      createField('textarea',  { id: 'f11', titulo: 'Ressalvas e condicionantes', nome: 'ressalvas', colunas: 3, placeholder: 'Descreva as ressalvas ou condições para a aprovação...' }),
      createField('files',     { id: 'f12', titulo: 'Documentos técnicos de referência', nome: 'documentosTecnicos', colunas: 3 }),
      createField('divider',   { id: 'd3' }),
      createField('signature', { id: 'sig1', titulo: 'Assinatura digital do responsável técnico', nome: 'assinaturaResponsavel', colunas: 3 }),
    ],
  },
];
