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
    ultimaAtualizacao: '2024-02-15',
    descricao: 'Processo para análise e emissão de licenças ambientais para atividades que utilizem recursos naturais ou que possam causar impacto ao meio ambiente.',
    cor: '#1A56DB',
    icone: 'leaf',
    versao: 'v3',
    atrasados: 3,
    otimizaveis: 2,
    templateKey: 'licenciamento',
  },
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
    ultimaAtualizacao: '2024-03-01',
    descricao: 'Fluxo de solicitação, aprovação e aquisição de materiais e serviços para o órgão.',
    cor: '#7C3AED',
    icone: 'shopping-cart',
    versao: 'v2',
    atrasados: 0,
    otimizaveis: 1,
    templateKey: 'compras',
  },
  {
    id: 'contratos',
    nome: 'Gestão de Contratos',
    area: 'Jurídico',
    status: 'publicado',
    instanciasAtivas: 32,
    tempoMedio: 40,
    percentualSLA: 65,
    taxaConclusao: 72,
    responsavel: 'Carlos Mota',
    setor: 'Secretaria de Finanças',
    ultimaAtualizacao: '2024-01-20',
    descricao: 'Elaboração, revisão, assinatura e gestão do ciclo de vida de contratos administrativos.',
    cor: '#0D9948',
    icone: 'file-contract',
    versao: 'v4',
    atrasados: 5,
    otimizaveis: 3,
    templateKey: 'contratos',
  },
  {
    id: 'atendimento-cidadao',
    nome: 'Atendimento ao Cidadão',
    area: 'Atendimento',
    status: 'publicado',
    instanciasAtivas: 280,
    tempoMedio: 5,
    percentualSLA: 95,
    taxaConclusao: 98,
    responsavel: 'Mariana Costa',
    setor: 'Secretaria de Atendimento',
    ultimaAtualizacao: '2024-03-10',
    descricao: 'Recebimento, triagem e resolução de demandas dos cidadãos via portal, presencial ou telefone.',
    cor: '#D97706',
    icone: 'users',
    versao: 'v1',
    atrasados: 1,
    otimizaveis: 0,
    templateKey: 'atendimento',
  },
  {
    id: 'admissao-servidores',
    nome: 'Admissão de Servidores',
    area: 'RH',
    status: 'publicado',
    instanciasAtivas: 8,
    tempoMedio: 30,
    percentualSLA: 82,
    taxaConclusao: 90,
    responsavel: 'João Ferreira',
    setor: 'Recursos Humanos',
    ultimaAtualizacao: '2024-02-28',
    descricao: 'Processo de seleção, documentação, integração e registro de novos servidores públicos.',
    cor: '#0284C7',
    icone: 'user-plus',
    versao: 'v2',
    atrasados: 0,
    otimizaveis: 1,
    templateKey: 'admissao',
  },
  {
    id: 'aprovacao-compras',
    nome: 'Aprovação de Compras',
    area: 'Administrativo',
    status: 'rascunho',
    instanciasAtivas: 0,
    tempoMedio: 10,
    percentualSLA: 0,
    taxaConclusao: 0,
    responsavel: 'Ana Paula',
    setor: 'Secretaria de Administração',
    ultimaAtualizacao: '2024-03-15',
    descricao: 'Fluxo simplificado de aprovação de compras de baixo valor sem licitação.',
    cor: '#7C3AED',
    icone: 'check-circle',
    versao: 'v1',
    atrasados: 0,
    otimizaveis: 0,
    templateKey: 'compras',
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
      { id: 'inicio', nome: 'Início', tipo: 'inicio', responsavel: '', prazo: 0, x: 60, y: 160, proximas: ['analisar'] },
      { id: 'analisar', nome: 'Analisar solicitação', tipo: 'tarefa', responsavel: 'Analista de Meio Ambiente', prazo: 3, x: 200, y: 130, proximas: ['revisar', 'solicitar'] },
      { id: 'solicitar', nome: 'Solicitar correção', tipo: 'tarefa', responsavel: 'Analista de Meio Ambiente', prazo: 2, x: 200, y: 220, proximas: ['analisar'] },
      { id: 'revisar', nome: 'Emitir taxa', tipo: 'tarefa', responsavel: 'Setor de Taxas', prazo: 2, x: 380, y: 100, proximas: ['aguardar'] },
      { id: 'aguardar', nome: 'Aguardar pagamento', tipo: 'tarefa', responsavel: 'Sistema', prazo: 10, x: 380, y: 180, proximas: ['emitir'] },
      { id: 'emitir', nome: 'Emitir licença', tipo: 'tarefa', responsavel: 'Diretor de Meio Ambiente', prazo: 5, x: 560, y: 160, proximas: ['fim'] },
      { id: 'fim', nome: 'Fim', tipo: 'fim', responsavel: '', prazo: 0, x: 720, y: 160, proximas: [] },
    ]
  }
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
    { numero: 'v3', data: '15/02/2024', autor: 'Filipe Reis', descricao: 'Adicionado passo "Solicitar correção" e ajuste nos SLAs', ativa: true },
    { numero: 'v2', data: '10/11/2023', autor: 'Carlos Mota', descricao: 'Revisão dos responsáveis por etapa', ativa: false },
    { numero: 'v1', data: '01/06/2023', autor: 'Admin', descricao: 'Versão inicial do processo', ativa: false },
  ]
};

export interface RegraAutomacao {
  id: string;
  descricao: string;
  acao: string;
  ativa: boolean;
}

export const regras: Record<string, RegraAutomacao[]> = {
  'licenciamento-ambiental': [
    { id: '1', descricao: 'Se o valor da taxa for maior que R$ 500, enviar para aprovação da Diretoria', acao: 'Redirecionar etapa', ativa: true },
    { id: '2', descricao: 'Se o status "Emitir taxa" demorar mais de 3 dias, gerar alerta automático', acao: 'Enviar notificação', ativa: true },
    { id: '3', descricao: 'Se o prazo total ultrapassar 60 dias, notificar o gestor', acao: 'Enviar e-mail', ativa: false },
    { id: '4', descricao: 'Quando o pagamento for confirmado, mover processo para a próxima etapa', acao: 'Avançar etapa', ativa: true },
  ]
};

export const dashboard = {
  totalProcessos: processos.length,
  instanciasAtivas: processos.reduce((acc, p) => acc + p.instanciasAtivas, 0),
  atrasados: processos.reduce((acc, p) => acc + p.atrasados, 0),
  otimizaveis: processos.reduce((acc, p) => acc + p.otimizaveis, 0),
  publicados: processos.filter(p => p.status === 'publicado').length,
};
