// Mock data for all BPM processes
export interface Processo {
  id: string;
  nome: string;
  area: string;
  status: 'publicado' | 'rascunho' | 'arquivado';
  instanciasAtivas: number;
  tempoMedio: number; // dias
  percentualSLA: number;
  taxaConclusao: number;
  responsavel: string;
  setor: string;
  ultimaAtualizacao: string;
  descricao: string;
  cor: string;
  icone: string;
  versao: string;
  atrasados: number;
  otimizaveis: number;
  /** Chave do template em flowMocks.processTemplates (quando existir) */
  templateKey?: string;
}

export const processos: Processo[] = [
  // ── Meio Ambiente ───────────────────────────────────────────
  {
    id: 'licenciamento-ambiental',
    nome: 'Licenciamento Ambiental',
    area: 'Meio Ambiente',
    status: 'publicado',
    instanciasAtivas: 120,
    tempoMedio: 52,
    percentualSLA: 78,
    taxaConclusao: 84,
    responsavel: 'Filipe Reis',
    setor: 'Secretaria de Meio Ambiente',
    ultimaAtualizacao: '2026-02-15',
    descricao: 'Processo para análise e emissão de licenças ambientais para atividades que utilizem recursos naturais ou que possam causar impacto ao meio ambiente.',
    cor: '#0D9948',
    icone: 'leaf',
    versao: 'v3',
    atrasados: 3,
    otimizaveis: 2,
    templateKey: 'licenciamento',
  },

  // ── Administrativo ──────────────────────────────────────────
  {
    id: 'compras-suprimentos',
    nome: 'Compras e Suprimentos',
    area: 'Administrativo',
    status: 'publicado',
    instanciasAtivas: 45,
    tempoMedio: 18,
    percentualSLA: 91,
    taxaConclusao: 96,
    responsavel: 'Ana Paula',
    setor: 'Secretaria de Administração',
    ultimaAtualizacao: '2026-03-01',
    descricao: 'Fluxo de solicitação, aprovação e aquisição de materiais e serviços para o órgão, com gateway por valor e cotação de fornecedores.',
    cor: '#7C3AED',
    icone: 'shopping-cart',
    versao: 'v2',
    atrasados: 0,
    otimizaveis: 1,
    templateKey: 'compras',
  },
  {
    id: 'gestao-contratos',
    nome: 'Gestão de Contratos',
    area: 'Administrativo',
    status: 'publicado',
    instanciasAtivas: 32,
    tempoMedio: 45,
    percentualSLA: 85,
    taxaConclusao: 91,
    responsavel: 'Carlos Mendes',
    setor: 'Diretoria Jurídica',
    ultimaAtualizacao: '2026-01-20',
    descricao: 'Controle do ciclo de vida de contratos com fornecedores e prestadores de serviço, desde a minuta até o encerramento.',
    cor: '#6366F1',
    icone: 'file-contract',
    versao: 'v1',
    atrasados: 0,
    otimizaveis: 0,
    templateKey: 'contratos',
  },

  // ── Recursos Humanos ────────────────────────────────────────
  {
    id: 'admissao-servidores',
    nome: 'Admissão de Servidores',
    area: 'Recursos Humanos',
    status: 'publicado',
    instanciasAtivas: 8,
    tempoMedio: 30,
    percentualSLA: 95,
    taxaConclusao: 98,
    responsavel: 'Mariana Costa',
    setor: 'Secretaria de Gestão de Pessoas',
    ultimaAtualizacao: '2026-02-28',
    descricao: 'Processo de integração e formalização de novos servidores públicos aprovados em concurso, do recebimento de documentos à posse.',
    cor: '#0284C7',
    icone: 'user-plus',
    versao: 'v2',
    atrasados: 0,
    otimizaveis: 0,
    templateKey: 'admissao',
  },
  {
    id: 'ferias',
    nome: 'Solicitação de Férias',
    area: 'Recursos Humanos',
    status: 'publicado',
    instanciasAtivas: 28,
    tempoMedio: 5,
    percentualSLA: 99,
    taxaConclusao: 100,
    responsavel: 'Mariana Costa',
    setor: 'Secretaria de Gestão de Pessoas',
    ultimaAtualizacao: '2026-03-10',
    descricao: 'Solicitação, aprovação e publicação de férias de servidores públicos, com controle de períodos aquisitivos e opção de abono pecuniário.',
    cor: '#0891b2',
    icone: 'calendar-alt',
    versao: 'v1',
    atrasados: 0,
    otimizaveis: 0,
    templateKey: 'ferias',
  },

  // ── Atendimento ao Cidadão ──────────────────────────────────
  {
    id: 'ouvidoria',
    nome: 'Ouvidoria',
    area: 'Atendimento ao Cidadão',
    status: 'publicado',
    instanciasAtivas: 280,
    tempoMedio: 15,
    percentualSLA: 72,
    taxaConclusao: 89,
    responsavel: 'Roberto Alves',
    setor: 'Ouvidoria Municipal',
    ultimaAtualizacao: '2026-03-15',
    descricao: 'Registro e tratamento de manifestações dos cidadãos: elogios, reclamações, denúncias e sugestões, com encaminhamento ao setor responsável e resposta ao cidadão.',
    cor: '#D97706',
    icone: 'megaphone',
    versao: 'v4',
    atrasados: 9,
    otimizaveis: 0,
    templateKey: 'ouvidoria',
  },
  {
    id: 'alvara-funcionamento',
    nome: 'Alvará de Funcionamento',
    area: 'Atendimento ao Cidadão',
    status: 'publicado',
    instanciasAtivas: 67,
    tempoMedio: 25,
    percentualSLA: 80,
    taxaConclusao: 87,
    responsavel: 'Pedro Souza',
    setor: 'Secretaria de Desenvolvimento Econômico',
    ultimaAtualizacao: '2026-02-20',
    descricao: 'Concessão de alvará para abertura e funcionamento de estabelecimentos comerciais, incluindo análise documental, vistoria e emissão digital do documento.',
    cor: '#EA580C',
    icone: 'store',
    versao: 'v2',
    atrasados: 0,
    otimizaveis: 0,
    templateKey: 'alvara',
  },

  // ── Jurídico ────────────────────────────────────────────────
  {
    id: 'licitacao-simplificada',
    nome: 'Licitação Simplificada',
    area: 'Jurídico',
    status: 'rascunho',
    instanciasAtivas: 0,
    tempoMedio: 0,
    percentualSLA: 0,
    taxaConclusao: 0,
    responsavel: 'Fernanda Lima',
    setor: 'Diretoria Jurídica',
    ultimaAtualizacao: '2026-03-20',
    descricao: 'Processo de licitação para contratações de menor valor conforme legislação vigente (Lei 14.133/2021), com dispensa ou inexigibilidade de licitação.',
    cor: '#9333ea',
    icone: 'gavel',
    versao: 'v1',
    atrasados: 0,
    otimizaveis: 0,
  },
];

export interface Etapa {
  id: string;
  nome: string;
  tipo: 'inicio' | 'tarefa' | 'decisao' | 'fim' | 'paralelo';
  responsavel: string;
  prazo: number; // dias
  x: number;
  y: number;
  proximas?: string[];
}

export interface Fluxo {
  processoId: string;
  etapas: Etapa[];
}

export const fluxos: Fluxo[] = [
  {
    processoId: 'licenciamento-ambiental',
    etapas: [
      { id: 'inicio',    nome: 'Início',                   tipo: 'inicio',  responsavel: '',                        prazo: 0,  x: 60,  y: 160, proximas: ['protocolo'] },
      { id: 'protocolo', nome: 'Protocolo da solicitação',  tipo: 'tarefa',  responsavel: 'Sistema',                 prazo: 1,  x: 200, y: 160, proximas: ['analise'] },
      { id: 'analise',   nome: 'Análise documental',        tipo: 'tarefa',  responsavel: 'Setor de Licenciamento',  prazo: 5,  x: 380, y: 160, proximas: ['vistoria'] },
      { id: 'vistoria',  nome: 'Vistoria técnica',          tipo: 'tarefa',  responsavel: 'Equipe de Campo',         prazo: 15, x: 560, y: 160, proximas: ['gateway'] },
      { id: 'gateway',   nome: 'Aprovado ou Reprovado?',    tipo: 'decisao', responsavel: '',                        prazo: 0,  x: 740, y: 160, proximas: ['emissao', 'indefere'] },
      { id: 'emissao',   nome: 'Emissão da licença',        tipo: 'tarefa',  responsavel: 'Sistema',                 prazo: 2,  x: 920, y: 100, proximas: ['fim'] },
      { id: 'indefere',  nome: 'Notificação de indeferimento', tipo: 'tarefa', responsavel: 'Sistema',              prazo: 1,  x: 920, y: 230, proximas: ['fim'] },
      { id: 'fim',       nome: 'Fim',                       tipo: 'fim',     responsavel: '',                        prazo: 0,  x: 1100, y: 160 },
    ],
  },
];

export interface Versao {
  numero: string;
  data: string;
  autor: string;
  descricao: string;
  ativa: boolean;
}

export const versoes: Record<string, Versao[]> = {
  'licenciamento-ambiental': [
    { numero: 'v3', data: '15/02/2026', autor: 'Filipe Reis',  descricao: 'Adicionada vistoria técnica obrigatória e ajuste nos SLAs de análise documental', ativa: true },
    { numero: 'v2', data: '10/11/2025', autor: 'Carlos Mota',  descricao: 'Revisão dos responsáveis por etapa e inclusão de gateway de aprovação', ativa: false },
    { numero: 'v1', data: '01/06/2025', autor: 'Admin',        descricao: 'Versão inicial do processo de licenciamento', ativa: false },
  ],
  'compras-suprimentos': [
    { numero: 'v2', data: '01/03/2026', autor: 'Ana Paula',    descricao: 'Gateway de valor atualizado para R$ 10.000; incluída etapa de recebimento no almoxarifado', ativa: true },
    { numero: 'v1', data: '15/08/2025', autor: 'Admin',        descricao: 'Versão inicial do fluxo de compras', ativa: false },
  ],
  'admissao-servidores': [
    { numero: 'v2', data: '28/02/2026', autor: 'Mariana Costa', descricao: 'Inclusão de gateway paralelo para exame médico e cadastro em sistemas simultâneos', ativa: true },
    { numero: 'v1', data: '01/07/2025', autor: 'Admin',         descricao: 'Versão inicial do processo de admissão', ativa: false },
  ],
  'ouvidoria': [
    { numero: 'v4', data: '15/03/2026', autor: 'Roberto Alves', descricao: 'Inclusão de etapa de validação da resposta pela Ouvidoria antes do envio ao cidadão', ativa: true },
    { numero: 'v3', data: '01/10/2025', autor: 'Roberto Alves', descricao: 'Prazo de resposta reduzido para 15 dias (resolução municipal)', ativa: false },
    { numero: 'v2', data: '01/03/2025', autor: 'Admin',         descricao: 'Adicionado encaminhamento automático ao setor responsável', ativa: false },
    { numero: 'v1', data: '01/06/2024', autor: 'Admin',         descricao: 'Versão inicial do processo de ouvidoria', ativa: false },
  ],
};

export interface RegraAutomacao {
  id: string;
  descricao: string;
  acao: string;
  ativa: boolean;
}

export const regras: Record<string, RegraAutomacao[]> = {
  'licenciamento-ambiental': [
    { id: '1', descricao: 'Se o SLA estiver prestes a vencer (2 dias), notificar o gestor da área', acao: 'Enviar notificação', ativa: true },
    { id: '2', descricao: 'Quando o processo entrar na etapa de vistoria, notificar o solicitante por e-mail', acao: 'Enviar e-mail', ativa: true },
    { id: '3', descricao: 'Se o prazo total ultrapassar 60 dias, escalar para a Secretaria', acao: 'Escalar', ativa: false },
  ],
  'ouvidoria': [
    { id: '1', descricao: 'Confirmar recebimento da manifestação por e-mail ao cidadão', acao: 'Enviar e-mail', ativa: true },
    { id: '2', descricao: 'Se passar de 15 dias sem resposta, notificar o ouvidor', acao: 'Enviar notificação', ativa: true },
  ],
  'compras-suprimentos': [
    { id: '1', descricao: 'Se valor > R$ 10.000, encaminhar automaticamente para aprovação do secretário', acao: 'Redirecionar etapa', ativa: true },
  ],
};

export const dashboard = {
  totalProcessos:  processos.length,
  instanciasAtivas: processos.reduce((acc, p) => acc + p.instanciasAtivas, 0),
  atrasados:       processos.reduce((acc, p) => acc + p.atrasados, 0),
  otimizaveis:     processos.reduce((acc, p) => acc + p.otimizaveis, 0),
  publicados:      processos.filter(p => p.status === 'publicado').length,
};
