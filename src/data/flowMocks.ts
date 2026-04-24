import type { Edge, Node } from '@xyflow/react';

export const defaultEdgeOptions = { type: 'smoothstep', style: { stroke: '#94A3B8', strokeWidth: 2 } };

export const comprasNodes: Node[] = [
  { id: 'start', type: 'start', position: { x: 400, y: 50 }, data: { label: 'Solicitação de Compra' } },
  { id: 't1', type: 'task', position: { x: 400, y: 200 }, data: { label: 'Analisar Requisição', responsavel: 'Compras', prazo: 2, icon: '📋' } },
  { id: 'g1', type: 'gateway', position: { x: 400, y: 350 }, data: { label: 'Valor > R$ 5.000?', type: 'exclusivo' } },
  
  // R$ <= 5.000 path
  { id: 't2_1', type: 'task', position: { x: 200, y: 500 }, data: { label: 'Cotação Automática', responsavel: 'Sistema', prazo: 0, isAuto: true, integra: 'TCE-SC' } },
  
  // R$ > 5.000 path
  { id: 't2_2', type: 'task', position: { x: 600, y: 500 }, data: { label: 'Aprovação Diretoria', responsavel: 'Diretor Financeiro', prazo: 3, icon: '👤' } },
  { id: 't3_2', type: 'task', position: { x: 600, y: 650 }, data: { label: 'Concorrência Pública', responsavel: 'Licitações', prazo: 15, icon: '⚖️' } },

  { id: 't4', type: 'task', position: { x: 400, y: 800 }, data: { label: 'Empenho Financeiro', responsavel: 'Financeiro', prazo: 1, icon: '💰' } },
  { id: 'end', type: 'end', position: { x: 400, y: 950 }, data: { label: 'Pedido Concluído' } },
];
export const comprasEdges: Edge[] = [
  { id: 'e-start-t1', source: 'start', target: 't1', ...defaultEdgeOptions },
  { id: 'e-t1-g1', source: 't1', target: 'g1', ...defaultEdgeOptions },
  
  { id: 'e-g1-t2_1', source: 'g1', target: 't2_1', label: 'Não', sourceHandle: 'source-left', ...defaultEdgeOptions },
  { id: 'e-g1-t2_2', source: 'g1', target: 't2_2', label: 'Sim', sourceHandle: 'source-right', ...defaultEdgeOptions },
  
  { id: 'e-t2_1-t4', source: 't2_1', target: 't4', ...defaultEdgeOptions },
  { id: 'e-t2_2-t3_2', source: 't2_2', target: 't3_2', ...defaultEdgeOptions },
  { id: 'e-t3_2-t4', source: 't3_2', target: 't4', ...defaultEdgeOptions },
  
  { id: 'e-t4-end', source: 't4', target: 'end', ...defaultEdgeOptions },
];

export const admissaoNodes: Node[] = [
  { id: 'start', type: 'start', position: { x: 400, y: 50 }, data: { label: 'Novo Colaborador' } },
  { id: 't1', type: 'task', position: { x: 400, y: 200 }, data: { label: 'Envio de Documentos', responsavel: 'Candidato', prazo: 5, icon: '📄' } },
  { id: 'pg', type: 'gateway', position: { x: 400, y: 350 }, data: { label: 'Ações Paralelas', type: 'paralelo' } },
  
  { id: 't2_1', type: 'task', position: { x: 100, y: 500 }, data: { label: 'Configurar Sistema', responsavel: 'TI', prazo: 1, icon: '💻' } },
  { id: 't2_2', type: 'task', position: { x: 400, y: 500 }, data: { label: 'Conta Bancária', responsavel: 'Financeiro', prazo: 2, icon: '🏦' } },
  { id: 't2_3', type: 'task', position: { x: 700, y: 500 }, data: { label: 'Exame Admissional', responsavel: 'RH', prazo: 3, icon: '🩺' } },
  
  { id: 't3', type: 'task', position: { x: 400, y: 680 }, data: { label: 'Assinatura Contrato', responsavel: 'Sistema', prazo: 0, isAuto: true, integra: '1Doc Sign' } },
  { id: 'end', type: 'end', position: { x: 400, y: 830 }, data: { label: 'Apto' } },
];
export const admissaoEdges: Edge[] = [
  { id: 'e-start-t1', source: 'start', target: 't1', ...defaultEdgeOptions },
  { id: 'e-t1-pg', source: 't1', target: 'pg', ...defaultEdgeOptions },
  
  { id: 'e-pg-t2_1', source: 'pg', target: 't2_1', sourceHandle: 'source-left', ...defaultEdgeOptions },
  { id: 'e-pg-t2_2', source: 'pg', target: 't2_2', sourceHandle: 'source-bottom', ...defaultEdgeOptions },
  { id: 'e-pg-t2_3', source: 'pg', target: 't2_3', sourceHandle: 'source-right', ...defaultEdgeOptions },
  
  { id: 'e-t2_1-t3', source: 't2_1', target: 't3', ...defaultEdgeOptions },
  { id: 'e-t2_2-t3', source: 't2_2', target: 't3', ...defaultEdgeOptions },
  { id: 'e-t2_3-t3', source: 't2_3', target: 't3', ...defaultEdgeOptions },
  
  { id: 'e-t3-end', source: 't3', target: 'end', ...defaultEdgeOptions },
];

export const atendimentoNodes: Node[] = [
  { id: 'start', type: 'start', position: { x: 400, y: 50 }, data: { label: 'Nova Solicitação' } },
  { id: 't1', type: 'task', position: { x: 400, y: 200 }, data: { label: 'Triagem Inicial', responsavel: 'Atendimento', prazo: 1, icon: '🔍' } },
  { id: 'g1', type: 'gateway', position: { x: 400, y: 350 }, data: { label: 'Tipo de Demanda', type: 'exclusivo' } },
  
  { id: 't2_1', type: 'task', position: { x: 200, y: 500 }, data: { label: 'Resposta Padrão', responsavel: 'Sistema', prazo: 0, isAuto: true, integra: 'Base de Conhecimento' } },
  { id: 't2_2', type: 'task', position: { x: 600, y: 500 }, data: { label: 'Análise Técnica', responsavel: 'Especialista', prazo: 3, icon: '⚙️' } },

  { id: 'end1', type: 'end', position: { x: 200, y: 650 }, data: { label: 'Resolvido (Auto)' } },
  { id: 'end2', type: 'end', position: { x: 600, y: 650 }, data: { label: 'Resolvido (Manual)' } },
];
export const atendimentoEdges: Edge[] = [
  { id: 'e-start-t1', source: 'start', target: 't1', ...defaultEdgeOptions },
  { id: 'e-t1-g1', source: 't1', target: 'g1', ...defaultEdgeOptions },
  { id: 'e-g1-t2_1', source: 'g1', target: 't2_1', label: 'Simples', sourceHandle: 'source-left', ...defaultEdgeOptions },
  { id: 'e-g1-t2_2', source: 'g1', target: 't2_2', label: 'Complexa', sourceHandle: 'source-right', ...defaultEdgeOptions },
  { id: 'e-t2_1-end1', source: 't2_1', target: 'end1', ...defaultEdgeOptions },
  { id: 'e-t2_2-end2', source: 't2_2', target: 'end2', ...defaultEdgeOptions },
];

export const contratosNodes: Node[] = [
  { id: 'start', type: 'start', position: { x: 400, y: 50 }, data: { label: 'Minuta de Contrato' } },
  { id: 't1', type: 'task', position: { x: 400, y: 200 }, data: { label: 'Análise Jurídica', responsavel: 'Advogado', prazo: 5, icon: '⚖️' } },
  { id: 'g1', type: 'gateway', position: { x: 400, y: 350 }, data: { label: 'Aprovado?', type: 'exclusivo' } },
  
  { id: 't2_1', type: 'task', position: { x: 200, y: 500 }, data: { label: 'Revisão', responsavel: 'Requerente', prazo: 2, icon: '✍️' } },
  { id: 't2_2', type: 'task', position: { x: 600, y: 500 }, data: { label: 'Assinatura', responsavel: 'Partes', prazo: 3, icon: '✒️' } },

  { id: 'end', type: 'end', position: { x: 600, y: 650 }, data: { label: 'Contrato Ativo' } },
];
export const contratosEdges: Edge[] = [
  { id: 'e-start-t1', source: 'start', target: 't1', ...defaultEdgeOptions },
  { id: 'e-t1-g1', source: 't1', target: 'g1', ...defaultEdgeOptions },
  { id: 'e-g1-t2_1', source: 'g1', target: 't2_1', label: 'Não', sourceHandle: 'source-left', ...defaultEdgeOptions },
  { id: 'e-t2_1-t1', source: 't2_1', target: 't1', ...defaultEdgeOptions },
  { id: 'e-g1-t2_2', source: 'g1', target: 't2_2', label: 'Sim', sourceHandle: 'source-right', ...defaultEdgeOptions },
  { id: 'e-t2_2-end', source: 't2_2', target: 'end', ...defaultEdgeOptions },
];

export const licenciamentoNodes: Node[] = [
  { id: 'start',  type: 'start',        position: { x: 400, y: 50  }, data: { label: 'Protocolo da Solicitação' } },
  { id: 't1',     type: 'task',         position: { x: 400, y: 200 }, data: { label: 'Análise Prévia', responsavel: 'Meio Ambiente', prazo: 5 } },
  { id: 'g1',     type: 'gateway',      position: { x: 400, y: 370 }, data: { label: 'Documentação Completa?', type: 'exclusivo' } },
  { id: 't2_neg', type: 'task',         position: { x: 180, y: 510 }, data: { label: 'Corrigir Documentos', responsavel: 'Solicitante', prazo: 10 } },
  { id: 't2_pos', type: 'task',         position: { x: 620, y: 510 }, data: { label: 'Vistoria Técnica', responsavel: 'Técnico de Campo', prazo: 15 } },
  { id: 't3',     type: 'task',         position: { x: 400, y: 680 }, data: { label: 'Emissão de Parecer', responsavel: 'Meio Ambiente', prazo: 7 } },
  { id: 'g2',     type: 'gateway',      position: { x: 400, y: 840 }, data: { label: 'Licença Aprovada?', type: 'exclusivo' } },
  { id: 't4_sim', type: 'task-system',  position: { x: 620, y: 990 }, data: { label: 'Emitir Licença', responsavel: 'Sistema', prazo: 0 } },
  { id: 't4_nao', type: 'task-email',   position: { x: 180, y: 990 }, data: { label: 'Notificar Indeferimento', responsavel: 'Sistema', prazo: 0 } },
  { id: 'end1',   type: 'end',          position: { x: 620, y: 1140 }, data: { label: 'Licença Emitida' } },
  { id: 'end2',   type: 'end',          position: { x: 180, y: 1140 }, data: { label: 'Indeferido' } },
];
export const licenciamentoEdges: Edge[] = [
  { id: 'e-s-t1',      source: 'start',  target: 't1',     ...defaultEdgeOptions },
  { id: 'e-t1-g1',     source: 't1',     target: 'g1',     ...defaultEdgeOptions },
  { id: 'e-g1-neg',    source: 'g1',     target: 't2_neg', label: 'Não', sourceHandle: 'source-left',   ...defaultEdgeOptions },
  { id: 'e-g1-pos',    source: 'g1',     target: 't2_pos', label: 'Sim', sourceHandle: 'source-right',  ...defaultEdgeOptions },
  { id: 'e-neg-t1',    source: 't2_neg', target: 't1',     ...defaultEdgeOptions },
  { id: 'e-pos-t3',    source: 't2_pos', target: 't3',     ...defaultEdgeOptions },
  { id: 'e-t3-g2',     source: 't3',     target: 'g2',     ...defaultEdgeOptions },
  { id: 'e-g2-sim',    source: 'g2',     target: 't4_sim', label: 'Sim', sourceHandle: 'source-right',  ...defaultEdgeOptions },
  { id: 'e-g2-nao',    source: 'g2',     target: 't4_nao', label: 'Não', sourceHandle: 'source-left',   ...defaultEdgeOptions },
  { id: 'e-sim-end1',  source: 't4_sim', target: 'end1',   ...defaultEdgeOptions },
  { id: 'e-nao-end2',  source: 't4_nao', target: 'end2',   ...defaultEdgeOptions },
];

export const processTemplates: Record<string, { nodes: Node[], edges: Edge[], title: string }> = {
  'licenciamento': { nodes: licenciamentoNodes, edges: licenciamentoEdges, title: 'Licenciamento Ambiental' },
  'compras':       { nodes: comprasNodes,       edges: comprasEdges,       title: 'Aprovação de Compras' },
  'admissao':      { nodes: admissaoNodes,      edges: admissaoEdges,      title: 'Admissão de Funcionários' },
  'atendimento':   { nodes: atendimentoNodes,   edges: atendimentoEdges,   title: 'Atendimento ao Cidadão' },
  'contratos':     { nodes: contratosNodes,     edges: contratosEdges,     title: 'Gestão de Contratos' },
};
