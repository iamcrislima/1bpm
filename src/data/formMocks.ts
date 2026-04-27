import type { FormFieldData } from '../components/bpm/formBuilder/fieldTypes';

export interface Formulario {
  id: string;
  templateId: string;
  nome: string;
  descricao: string;
  categoria: string;
  icon: string;
  color: string;
  bg: string;
  campos: FormFieldData[];
  processos: number;
  atualizadoEm: string;
}

// Helper — preenche todos os defaults obrigatórios do FormFieldData
function f(overrides: Partial<FormFieldData> & Pick<FormFieldData, 'id' | 'type' | 'titulo'>): FormFieldData {
  return {
    nome: overrides.titulo.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''),
    colunas: 1,
    obrigatorio: false,
    desabilitado: false,
    somenteLeitura: false,
    valorPadrao: '',
    placeholder: '',
    textoAjuda: '',
    posicaoAjuda: 'abaixo',
    tamanhoAjuda: '',
    opcoes: [],
    mascara: '',
    aceitarTipos: '',
    maxArquivos: 5,
    maxTamanhoMb: 10,
    nivelTitulo: 2,
    textoFixo: '',
    alertaTipo: 'info',
    srcImagem: '',
    altImagem: '',
    urlLink: '',
    textoLink: '',
    labelBotao: '',
    tipoBotao: 'button',
    estilobotao: 'primario',
    validacaoCustom: '',
    condicaoExibir: '',
    filhos: [],
    filhos2: [],
    proporcao: '1/2+1/2',
    ...overrides,
  };
}

// ── 1. Requerimento de Alvará de Funcionamento ──────────────
const camposAlvara: FormFieldData[] = [
  f({ id: 'alv-h1', type: 'heading', titulo: 'Dados do Estabelecimento', nivelTitulo: 2 }),
  f({ id: 'alv-1', type: 'text',    titulo: 'Nome do estabelecimento',   obrigatorio: true,  placeholder: 'Razão social ou nome fantasia' }),
  f({ id: 'alv-2', type: 'mask',    titulo: 'CNPJ',                      obrigatorio: true,  mascara: '99.999.999/9999-99', placeholder: '00.000.000/0001-00' }),
  f({ id: 'alv-3', type: 'text',    titulo: 'Atividade econômica (CNAE)', obrigatorio: true,  placeholder: 'Ex.: 47.11-3-02 — Comércio varejista' }),
  f({ id: 'alv-4', type: 'select',  titulo: 'Tipo de alvará',            obrigatorio: true,  opcoes: ['Novo', 'Renovação', 'Alteração de endereço', 'Alteração de atividade'] }),
  f({
    id: 'alv-c1', type: 'container', titulo: 'Horário de funcionamento',
    proporcao: '1/2+1/2',
    filhos:  [f({ id: 'alv-c1a', type: 'time', titulo: 'Abertura', obrigatorio: true })],
    filhos2: [f({ id: 'alv-c1b', type: 'time', titulo: 'Fechamento', obrigatorio: true })],
  }),
  f({ id: 'alv-5', type: 'text',    titulo: 'Nome do responsável legal',  obrigatorio: true }),
  f({ id: 'alv-6', type: 'mask',    titulo: 'CPF do responsável',         obrigatorio: true,  mascara: '999.999.999-99' }),
  f({ id: 'alv-7', type: 'mask',    titulo: 'Telefone de contato',        obrigatorio: true,  mascara: '(99) 99999-9999' }),
  f({ id: 'alv-8', type: 'textarea',titulo: 'Observações adicionais',     placeholder: 'Informações complementares para análise...' }),
];

// ── 2. Solicitação de Compra ─────────────────────────────────
const camposCompras: FormFieldData[] = [
  f({ id: 'cmp-h1', type: 'heading',  titulo: 'Dados da Solicitação', nivelTitulo: 2 }),
  f({ id: 'cmp-1',  type: 'text',     titulo: 'Item ou serviço',        obrigatorio: true, placeholder: 'Descrição resumida do bem ou serviço' }),
  f({ id: 'cmp-2',  type: 'textarea', titulo: 'Justificativa da compra',obrigatorio: true, placeholder: 'Descreva a necessidade e o impacto para a secretaria...' }),
  f({ id: 'cmp-3',  type: 'number',   titulo: 'Quantidade',             obrigatorio: true, placeholder: '1' }),
  f({ id: 'cmp-4',  type: 'currency', titulo: 'Valor unitário estimado',obrigatorio: true, placeholder: 'R$ 0,00' }),
  f({
    id: 'cmp-5', type: 'select', titulo: 'Secretaria solicitante', obrigatorio: true,
    opcoes: [
      'Secretaria de Administração',
      'Secretaria de Meio Ambiente',
      'Secretaria de Saúde',
      'Secretaria de Educação',
      'Secretaria de Obras',
      'Secretaria de Finanças',
      'Ouvidoria Municipal',
    ],
  }),
  f({ id: 'cmp-6',  type: 'select',   titulo: 'Modalidade de aquisição', obrigatorio: true, opcoes: ['Dispensa de licitação', 'Inexigibilidade', 'Pregão eletrônico', 'Concorrência'] }),
  f({ id: 'cmp-7',  type: 'date',     titulo: 'Prazo máximo para entrega', obrigatorio: true }),
  f({ id: 'cmp-8',  type: 'text',     titulo: 'Fornecedor sugerido',     placeholder: 'Nome do fornecedor (opcional)' }),
  f({ id: 'cmp-9',  type: 'file',     titulo: 'Documentos de suporte',   textoAjuda: 'Anexe orçamentos, notas técnicas ou outros documentos', aceitarTipos: '.pdf,.docx,.xlsx', maxArquivos: 5, maxTamanhoMb: 20 }),
];

// ── 3. Manifestação de Ouvidoria ─────────────────────────────
const camposOuvidoria: FormFieldData[] = [
  f({ id: 'ouv-h1', type: 'heading',  titulo: 'Registre sua Manifestação', nivelTitulo: 2 }),
  f({ id: 'ouv-1',  type: 'select',   titulo: 'Tipo de manifestação',   obrigatorio: true, opcoes: ['Reclamação', 'Denúncia', 'Sugestão', 'Elogio', 'Solicitação de informação'] }),
  f({ id: 'ouv-2',  type: 'textarea', titulo: 'Descrição da manifestação', obrigatorio: true, placeholder: 'Descreva detalhadamente o ocorrido, incluindo datas, locais e pessoas envolvidas...' }),
  f({ id: 'ouv-3',  type: 'text',     titulo: 'Nome completo',          obrigatorio: true }),
  f({ id: 'ouv-4',  type: 'mask',     titulo: 'CPF (opcional)',         mascara: '999.999.999-99', textoAjuda: 'O CPF não é obrigatório para manifestações anônimas' }),
  f({ id: 'ouv-5',  type: 'mask',     titulo: 'Telefone para contato',  mascara: '(99) 99999-9999', placeholder: '(48) 00000-0000' }),
  f({ id: 'ouv-6',  type: 'text',     titulo: 'E-mail',                 obrigatorio: true, placeholder: 'seuemail@exemplo.com.br' }),
  f({
    id: 'ouv-7', type: 'select', titulo: 'Secretaria envolvida', obrigatorio: true,
    opcoes: [
      'Não sei informar',
      'Secretaria de Administração',
      'Secretaria de Meio Ambiente',
      'Secretaria de Saúde',
      'Secretaria de Educação',
      'Secretaria de Obras',
      'Ouvidoria Municipal',
    ],
  }),
  f({ id: 'ouv-8',  type: 'select',   titulo: 'Como prefere ser atendido?', opcoes: ['E-mail', 'Telefone', 'Presencial', 'Sem preferência'] }),
  f({ id: 'ouv-9',  type: 'file',     titulo: 'Evidências (opcional)',   textoAjuda: 'Fotos, vídeos ou documentos que comprovem o relato', aceitarTipos: '.pdf,.jpg,.jpeg,.png,.mp4', maxArquivos: 10, maxTamanhoMb: 50 }),
  f({ id: 'ouv-10', type: 'lgpd',     titulo: 'Consentimento LGPD',     obrigatorio: true, textoFixo: 'Autorizo o tratamento dos meus dados pessoais para fins de atendimento desta manifestação, conforme a Lei nº 13.709/2018 (LGPD).' }),
];

// ── 4. Ficha de Admissão de Servidor ────────────────────────
const camposAdmissao: FormFieldData[] = [
  f({ id: 'adm-h1', type: 'heading',  titulo: 'Dados Pessoais', nivelTitulo: 2 }),
  f({ id: 'adm-1',  type: 'text',     titulo: 'Nome completo',          obrigatorio: true }),
  f({ id: 'adm-2',  type: 'mask',     titulo: 'CPF',                    obrigatorio: true, mascara: '999.999.999-99' }),
  f({ id: 'adm-3',  type: 'date',     titulo: 'Data de nascimento',     obrigatorio: true }),
  f({ id: 'adm-4',  type: 'text',     titulo: 'Cargo concursado',       obrigatorio: true, placeholder: 'Ex.: Auditor Fiscal Municipal' }),
  f({
    id: 'adm-c1', type: 'container', titulo: 'Documento de identidade',
    proporcao: '1/3+2/3',
    filhos:  [f({ id: 'adm-c1a', type: 'text',  titulo: 'Nº RG', obrigatorio: true })],
    filhos2: [f({ id: 'adm-c1b', type: 'text',  titulo: 'Órgão emissor / UF', obrigatorio: true, placeholder: 'Ex.: SSP/SC' })],
  }),
  f({ id: 'adm-h2', type: 'heading',  titulo: 'Contato e Dados Bancários', nivelTitulo: 2 }),
  f({ id: 'adm-5',  type: 'text',     titulo: 'E-mail institucional',   obrigatorio: true }),
  f({ id: 'adm-6',  type: 'mask',     titulo: 'Telefone celular',       obrigatorio: true, mascara: '(99) 99999-9999' }),
  f({
    id: 'adm-c2', type: 'container', titulo: 'Dados bancários',
    proporcao: '1/2+1/2',
    filhos:  [f({ id: 'adm-c2a', type: 'text', titulo: 'Banco',    obrigatorio: true, placeholder: 'Ex.: Banco do Brasil' })],
    filhos2: [f({ id: 'adm-c2b', type: 'text', titulo: 'Agência / Conta', obrigatorio: true, placeholder: 'Ex.: 1234-5 / 00001-6' })],
  }),
  f({ id: 'adm-7',  type: 'file',     titulo: 'Documentos obrigatórios', obrigatorio: true, textoAjuda: 'RG, CPF, Diploma, certidões negativas e laudo médico admissional', aceitarTipos: '.pdf,.jpg,.png', maxArquivos: 15, maxTamanhoMb: 50 }),
  f({ id: 'adm-8',  type: 'textarea', titulo: 'Observações do RH',      somenteLeitura: false, placeholder: 'Uso interno — preencher apenas se necessário' }),
];

// ── 5. Solicitação de Férias ─────────────────────────────────
const camposFerias: FormFieldData[] = [
  f({ id: 'fer-h1', type: 'heading',  titulo: 'Dados do Servidor', nivelTitulo: 2 }),
  f({ id: 'fer-1',  type: 'text',     titulo: 'Nome completo',         obrigatorio: true }),
  f({ id: 'fer-2',  type: 'mask',     titulo: 'Matrícula funcional',   obrigatorio: true, mascara: '9999999', placeholder: '0000000' }),
  f({ id: 'fer-3',  type: 'select',   titulo: 'Tipo de férias',        obrigatorio: true, opcoes: ['Férias anuais', 'Férias proporcionais', 'Licença-prêmio convertida em férias'] }),
  f({ id: 'fer-h2', type: 'heading',  titulo: 'Período Solicitado', nivelTitulo: 2 }),
  f({
    id: 'fer-c1', type: 'container', titulo: 'Período',
    proporcao: '1/2+1/2',
    filhos:  [f({ id: 'fer-c1a', type: 'date', titulo: 'Início das férias',   obrigatorio: true })],
    filhos2: [f({ id: 'fer-c1b', type: 'date', titulo: 'Término das férias',  obrigatorio: true })],
  }),
  f({ id: 'fer-4',  type: 'number',   titulo: 'Total de dias solicitados', obrigatorio: true, placeholder: '30' }),
  f({ id: 'fer-5',  type: 'checkbox', titulo: 'Solicitar abono pecuniário (1/3 convertido em remuneração)', opcoes: ['Sim, solicito abono pecuniário'] }),
  f({ id: 'fer-6',  type: 'textarea', titulo: 'Observações',            placeholder: 'Informações adicionais relevantes...' }),
];

// ── Catálogo de formulários ──────────────────────────────────
export const FORM_MOCKS: Formulario[] = [
  {
    id: 'form-alvara',
    templateId: 'alvara',
    nome: 'Requerimento de Alvará de Funcionamento',
    descricao: 'Solicitação de alvará para abertura ou renovação de estabelecimentos comerciais no município.',
    categoria: 'Atendimento ao Cidadão',
    icon: 'fa-regular fa-store',
    color: '#EA580C',
    bg: '#FFF7ED',
    campos: camposAlvara,
    processos: 3,
    atualizadoEm: 'há 2 dias',
  },
  {
    id: 'form-compras',
    templateId: 'compras',
    nome: 'Solicitação de Compra',
    descricao: 'Requisição de materiais e serviços com aprovação por valor e encaminhamento ao almoxarifado.',
    categoria: 'Administrativo',
    icon: 'fa-regular fa-cart-shopping',
    color: '#7C3AED',
    bg: '#F5F3FF',
    campos: camposCompras,
    processos: 2,
    atualizadoEm: 'há 1 sem.',
  },
  {
    id: 'form-ouvidoria',
    templateId: 'ouvidoria',
    nome: 'Manifestação de Ouvidoria',
    descricao: 'Registro de elogios, reclamações, denúncias e sugestões dos cidadãos ao município.',
    categoria: 'Atendimento ao Cidadão',
    icon: 'fa-regular fa-megaphone',
    color: '#D97706',
    bg: '#FFFBEB',
    campos: camposOuvidoria,
    processos: 4,
    atualizadoEm: 'há 3 dias',
  },
  {
    id: 'form-admissao',
    templateId: 'admissao',
    nome: 'Ficha de Admissão de Servidor',
    descricao: 'Coleta de dados pessoais, documentais e bancários para posse de novos servidores públicos.',
    categoria: 'Recursos Humanos',
    icon: 'fa-regular fa-user-plus',
    color: '#0284C7',
    bg: '#E0F2FE',
    campos: camposAdmissao,
    processos: 1,
    atualizadoEm: 'há 5 dias',
  },
  {
    id: 'form-ferias',
    templateId: 'ferias',
    nome: 'Solicitação de Férias',
    descricao: 'Pedido de gozo de férias com seleção de período, tipo e opção de abono pecuniário.',
    categoria: 'Recursos Humanos',
    icon: 'fa-regular fa-calendar-alt',
    color: '#0891B2',
    bg: '#ECFEFF',
    campos: camposFerias,
    processos: 1,
    atualizadoEm: 'agora',
  },
];
