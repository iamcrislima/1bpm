import type { Edge, Node } from '@xyflow/react';
import { MarkerType } from '@xyflow/react';

export const defaultEdgeOptions = {
  type: 'labeled',
  animated: false,
  markerEnd: { type: MarkerType.ArrowClosed, color: '#0058db', width: 16, height: 16 },
  style: { stroke: '#0058db', strokeWidth: 2 },
};

// ── Licenciamento Ambiental ──────────────────────────────────────
export const licenciamentoNodes: Node[] = [
  { id: 'start',   type: 'start',       position: { x: 400, y: 50   }, data: { label: 'Protocolo da Solicitação' } },
  { id: 't1',      type: 'task',        position: { x: 400, y: 200  }, data: { label: 'Análise Documental', responsavel: 'Setor de Licenciamento', prazo: 5 } },
  { id: 'g1',      type: 'gateway',     position: { x: 400, y: 370  }, data: { label: 'Documentação Completa?', type: 'exclusivo' } },
  { id: 't2_neg',  type: 'task',        position: { x: 180, y: 510  }, data: { label: 'Solicitar Complementação', responsavel: 'Solicitante', prazo: 10 } },
  { id: 't2_pos',  type: 'task',        position: { x: 620, y: 510  }, data: { label: 'Vistoria Técnica', responsavel: 'Equipe de Campo', prazo: 15 } },
  { id: 't3',      type: 'task',        position: { x: 400, y: 680  }, data: { label: 'Emissão de Parecer', responsavel: 'Setor de Licenciamento', prazo: 7 } },
  { id: 'g2',      type: 'gateway',     position: { x: 400, y: 840  }, data: { label: 'Licença Aprovada?', type: 'exclusivo' } },
  { id: 't4_sim',  type: 'task-system', position: { x: 620, y: 990  }, data: { label: 'Emitir Licença', responsavel: 'Sistema', prazo: 2, isAuto: true } },
  { id: 't4_nao',  type: 'msg',         position: { x: 180, y: 990  }, data: { label: 'Notificação de Indeferimento', responsavel: 'Sistema', prazo: 1 } },
  { id: 'end1',    type: 'end',         position: { x: 620, y: 1140 }, data: { label: 'Licença Emitida' } },
  { id: 'end2',    type: 'end',         position: { x: 180, y: 1140 }, data: { label: 'Processo Indeferido' } },
];
export const licenciamentoEdges: Edge[] = [
  { id: 'e-s-t1',     source: 'start',  target: 't1',     ...defaultEdgeOptions },
  { id: 'e-t1-g1',    source: 't1',     target: 'g1',     ...defaultEdgeOptions },
  { id: 'e-g1-neg',   source: 'g1',     target: 't2_neg', label: 'Não', sourceHandle: 'source-left',  ...defaultEdgeOptions },
  { id: 'e-g1-pos',   source: 'g1',     target: 't2_pos', label: 'Sim', sourceHandle: 'source-right', ...defaultEdgeOptions },
  { id: 'e-neg-t1',   source: 't2_neg', target: 't1',     ...defaultEdgeOptions },
  { id: 'e-pos-t3',   source: 't2_pos', target: 't3',     ...defaultEdgeOptions },
  { id: 'e-t3-g2',    source: 't3',     target: 'g2',     ...defaultEdgeOptions },
  { id: 'e-g2-sim',   source: 'g2',     target: 't4_sim', label: 'Aprovado', sourceHandle: 'source-right', ...defaultEdgeOptions },
  { id: 'e-g2-nao',   source: 'g2',     target: 't4_nao', label: 'Reprovado', sourceHandle: 'source-left', ...defaultEdgeOptions },
  { id: 'e-sim-end1', source: 't4_sim', target: 'end1',   ...defaultEdgeOptions },
  { id: 'e-nao-end2', source: 't4_nao', target: 'end2',   ...defaultEdgeOptions },
];

// ── Compras e Suprimentos ────────────────────────────────────────
export const comprasNodes: Node[] = [
  { id: 'start', type: 'start',       position: { x: 400, y: 50  }, data: { label: 'Solicitação de Compra' } },
  { id: 't1',    type: 'task',        position: { x: 400, y: 200 }, data: { label: 'Análise da Requisição', responsavel: 'Setor de Compras', prazo: 2 } },
  { id: 'g1',    type: 'gateway',     position: { x: 400, y: 370 }, data: { label: 'Valor > R$ 10.000?', type: 'exclusivo' } },
  { id: 't2_1',  type: 'task',        position: { x: 180, y: 510 }, data: { label: 'Cotação de Fornecedores', responsavel: 'Setor de Compras', prazo: 10 } },
  { id: 't2_2',  type: 'task',        position: { x: 620, y: 510 }, data: { label: 'Aprovação do Secretário', responsavel: 'Secretário', prazo: 3 } },
  { id: 't3',    type: 'task',        position: { x: 400, y: 680 }, data: { label: 'Aprovação da Cotação', responsavel: 'Gestor', prazo: 3 } },
  { id: 't4',    type: 'task-system', position: { x: 400, y: 830 }, data: { label: 'Emissão de Ordem de Compra', responsavel: 'Sistema', prazo: 1, isAuto: true } },
  { id: 't5',    type: 'task',        position: { x: 400, y: 980 }, data: { label: 'Recebimento e Conferência', responsavel: 'Almoxarifado', prazo: 5 } },
  { id: 'end',   type: 'end',         position: { x: 400, y: 1130 }, data: { label: 'Compra Concluída' } },
];
export const comprasEdges: Edge[] = [
  { id: 'e-s-t1',   source: 'start', target: 't1',   ...defaultEdgeOptions },
  { id: 'e-t1-g1',  source: 't1',   target: 'g1',   ...defaultEdgeOptions },
  { id: 'e-g1-t21', source: 'g1',   target: 't2_1', label: 'Não', sourceHandle: 'source-left',  ...defaultEdgeOptions },
  { id: 'e-g1-t22', source: 'g1',   target: 't2_2', label: 'Sim', sourceHandle: 'source-right', ...defaultEdgeOptions },
  { id: 'e-t21-t3', source: 't2_1', target: 't3',   ...defaultEdgeOptions },
  { id: 'e-t22-t3', source: 't2_2', target: 't3',   ...defaultEdgeOptions },
  { id: 'e-t3-t4',  source: 't3',   target: 't4',   ...defaultEdgeOptions },
  { id: 'e-t4-t5',  source: 't4',   target: 't5',   ...defaultEdgeOptions },
  { id: 'e-t5-end', source: 't5',   target: 'end',  ...defaultEdgeOptions },
];

// ── Gestão de Contratos ──────────────────────────────────────────
export const contratosNodes: Node[] = [
  { id: 'start', type: 'start',   position: { x: 400, y: 50  }, data: { label: 'Minuta de Contrato' } },
  { id: 't1',    type: 'task',    position: { x: 400, y: 200 }, data: { label: 'Análise Jurídica', responsavel: 'Diretoria Jurídica', prazo: 5 } },
  { id: 'g1',    type: 'gateway', position: { x: 400, y: 370 }, data: { label: 'Aprovado?', type: 'exclusivo' } },
  { id: 't2_1',  type: 'task',    position: { x: 180, y: 510 }, data: { label: 'Revisão pelo Requerente', responsavel: 'Requerente', prazo: 2 } },
  { id: 't2_2',  type: 'task',    position: { x: 620, y: 510 }, data: { label: 'Coleta de Assinaturas', responsavel: 'Partes', prazo: 3 } },
  { id: 't3',    type: 'task-system', position: { x: 620, y: 660 }, data: { label: 'Publicação no Diário Oficial', responsavel: 'Sistema', prazo: 1, isAuto: true } },
  { id: 'end',   type: 'end',     position: { x: 620, y: 810 }, data: { label: 'Contrato Ativo' } },
];
export const contratosEdges: Edge[] = [
  { id: 'e-s-t1',   source: 'start', target: 't1',   ...defaultEdgeOptions },
  { id: 'e-t1-g1',  source: 't1',   target: 'g1',   ...defaultEdgeOptions },
  { id: 'e-g1-t21', source: 'g1',   target: 't2_1', label: 'Não', sourceHandle: 'source-left',  ...defaultEdgeOptions },
  { id: 'e-t21-t1', source: 't2_1', target: 't1',   ...defaultEdgeOptions },
  { id: 'e-g1-t22', source: 'g1',   target: 't2_2', label: 'Sim', sourceHandle: 'source-right', ...defaultEdgeOptions },
  { id: 'e-t22-t3', source: 't2_2', target: 't3',   ...defaultEdgeOptions },
  { id: 'e-t3-end', source: 't3',   target: 'end',  ...defaultEdgeOptions },
];

// ── Admissão de Servidores ───────────────────────────────────────
export const admissaoNodes: Node[] = [
  { id: 'start', type: 'start',          position: { x: 400, y: 50  }, data: { label: 'Convocação do Servidor' } },
  { id: 't1',    type: 'task',           position: { x: 400, y: 200 }, data: { label: 'Entrega de Documentos', responsavel: 'RH', prazo: 5 } },
  { id: 't2',    type: 'task',           position: { x: 400, y: 370 }, data: { label: 'Análise Documental', responsavel: 'Jurídico', prazo: 7 } },
  { id: 'pg',    type: 'gateway-paralelo', position: { x: 400, y: 540 }, data: { label: 'Ações Simultâneas', type: 'paralelo' } },
  { id: 't3_1',  type: 'task',           position: { x: 180, y: 690 }, data: { label: 'Exame Médico Admissional', responsavel: 'Saúde Ocupacional', prazo: 5 } },
  { id: 't3_2',  type: 'task-system',    position: { x: 620, y: 690 }, data: { label: 'Cadastro nos Sistemas', responsavel: 'TI', prazo: 1, isAuto: true } },
  { id: 't4',    type: 'task',           position: { x: 400, y: 860 }, data: { label: 'Posse e Assinatura do Termo', responsavel: 'Chefia Imediata', prazo: 1 } },
  { id: 't5',    type: 'task-system',    position: { x: 400, y: 1010 }, data: { label: 'Liberação de Acessos', responsavel: 'Sistema', prazo: 1, isAuto: true } },
  { id: 'end',   type: 'end',            position: { x: 400, y: 1160 }, data: { label: 'Servidor Integrado' } },
];
export const admissaoEdges: Edge[] = [
  { id: 'e-s-t1',  source: 'start', target: 't1',  ...defaultEdgeOptions },
  { id: 'e-t1-t2', source: 't1',   target: 't2',  ...defaultEdgeOptions },
  { id: 'e-t2-pg', source: 't2',   target: 'pg',  ...defaultEdgeOptions },
  { id: 'e-pg-31', source: 'pg',   target: 't3_1', sourceHandle: 'source-left',  ...defaultEdgeOptions },
  { id: 'e-pg-32', source: 'pg',   target: 't3_2', sourceHandle: 'source-right', ...defaultEdgeOptions },
  { id: 'e-31-t4', source: 't3_1', target: 't4',  ...defaultEdgeOptions },
  { id: 'e-32-t4', source: 't3_2', target: 't4',  ...defaultEdgeOptions },
  { id: 'e-t4-t5', source: 't4',   target: 't5',  ...defaultEdgeOptions },
  { id: 'e-t5-end', source: 't5',  target: 'end', ...defaultEdgeOptions },
];

// ── Solicitação de Férias ────────────────────────────────────────
export const feriasNodes: Node[] = [
  { id: 'start', type: 'start',       position: { x: 400, y: 50  }, data: { label: 'Solicitação de Férias' } },
  { id: 't1',    type: 'task',        position: { x: 400, y: 200 }, data: { label: 'Análise pelo RH', responsavel: 'Secretaria de Gestão de Pessoas', prazo: 2 } },
  { id: 'g1',    type: 'gateway',     position: { x: 400, y: 370 }, data: { label: 'Período disponível?', type: 'exclusivo' } },
  { id: 't2_1',  type: 'msg',         position: { x: 180, y: 510 }, data: { label: 'Notificação de Indeferimento', responsavel: 'Sistema', prazo: 1 } },
  { id: 't2_2',  type: 'task',        position: { x: 620, y: 510 }, data: { label: 'Aprovação da Chefia', responsavel: 'Chefe Imediato', prazo: 1 } },
  { id: 't3',    type: 'task-system', position: { x: 620, y: 660 }, data: { label: 'Publicação em Portaria', responsavel: 'Sistema', prazo: 1, isAuto: true } },
  { id: 'end1',  type: 'end',         position: { x: 620, y: 810 }, data: { label: 'Férias Aprovadas' } },
  { id: 'end2',  type: 'end',         position: { x: 180, y: 660 }, data: { label: 'Indeferido' } },
];
export const feriasEdges: Edge[] = [
  { id: 'e-s-t1',   source: 'start', target: 't1',   ...defaultEdgeOptions },
  { id: 'e-t1-g1',  source: 't1',   target: 'g1',   ...defaultEdgeOptions },
  { id: 'e-g1-t21', source: 'g1',   target: 't2_1', label: 'Não',  sourceHandle: 'source-left',  ...defaultEdgeOptions },
  { id: 'e-g1-t22', source: 'g1',   target: 't2_2', label: 'Sim',  sourceHandle: 'source-right', ...defaultEdgeOptions },
  { id: 'e-t21-e2', source: 't2_1', target: 'end2', ...defaultEdgeOptions },
  { id: 'e-t22-t3', source: 't2_2', target: 't3',   ...defaultEdgeOptions },
  { id: 'e-t3-e1',  source: 't3',   target: 'end1', ...defaultEdgeOptions },
];

// ── Ouvidoria ────────────────────────────────────────────────────
export const ouvidoriaNodes: Node[] = [
  { id: 'start', type: 'start',       position: { x: 400, y: 50   }, data: { label: 'Registro da Manifestação' } },
  { id: 't1',    type: 'task-system', position: { x: 400, y: 200  }, data: { label: 'Protocolo Automático', responsavel: 'Sistema', prazo: 0, isAuto: true } },
  { id: 't2',    type: 'task',        position: { x: 400, y: 370  }, data: { label: 'Triagem e Classificação', responsavel: 'Ouvidoria', prazo: 2 } },
  { id: 't3',    type: 'task-system', position: { x: 400, y: 540  }, data: { label: 'Encaminhamento ao Setor', responsavel: 'Sistema', prazo: 0, isAuto: true } },
  { id: 't4',    type: 'task',        position: { x: 400, y: 710  }, data: { label: 'Análise e Resposta', responsavel: 'Setor Responsável', prazo: 10 } },
  { id: 't5',    type: 'task',        position: { x: 400, y: 880  }, data: { label: 'Validação da Resposta', responsavel: 'Ouvidoria', prazo: 2 } },
  { id: 't6',    type: 'msg',         position: { x: 400, y: 1050 }, data: { label: 'Resposta ao Cidadão', responsavel: 'Sistema', prazo: 0 } },
  { id: 'end',   type: 'end',         position: { x: 400, y: 1200 }, data: { label: 'Manifestação Encerrada' } },
];
export const ouvidoriaEdges: Edge[] = [
  { id: 'e-s-t1',  source: 'start', target: 't1',  ...defaultEdgeOptions },
  { id: 'e-t1-t2', source: 't1',   target: 't2',  ...defaultEdgeOptions },
  { id: 'e-t2-t3', source: 't2',   target: 't3',  ...defaultEdgeOptions },
  { id: 'e-t3-t4', source: 't3',   target: 't4',  ...defaultEdgeOptions },
  { id: 'e-t4-t5', source: 't4',   target: 't5',  ...defaultEdgeOptions },
  { id: 'e-t5-t6', source: 't5',   target: 't6',  ...defaultEdgeOptions },
  { id: 'e-t6-end', source: 't6',  target: 'end', ...defaultEdgeOptions },
];

// ── Alvará de Funcionamento ──────────────────────────────────────
export const alvaraNodes: Node[] = [
  { id: 'start',  type: 'start',       position: { x: 400, y: 50   }, data: { label: 'Protocolo do Requerimento' } },
  { id: 't1',     type: 'task',        position: { x: 400, y: 200  }, data: { label: 'Análise Documental', responsavel: 'Secretaria de Desenvolvimento Econômico', prazo: 5 } },
  { id: 'g1',     type: 'gateway',     position: { x: 400, y: 370  }, data: { label: 'Documentação OK?', type: 'exclusivo' } },
  { id: 't2_neg', type: 'msg',         position: { x: 150, y: 510  }, data: { label: 'Notificação de Pendência', responsavel: 'Sistema', prazo: 1 } },
  { id: 't2_pos', type: 'task',        position: { x: 650, y: 510  }, data: { label: 'Vistoria Sanitária e Técnica', responsavel: 'Equipe de Vistoria', prazo: 10 } },
  { id: 't3',     type: 'task',        position: { x: 400, y: 680  }, data: { label: 'Parecer Final', responsavel: 'Gestor', prazo: 3 } },
  { id: 'g2',     type: 'gateway',     position: { x: 400, y: 840  }, data: { label: 'Aprovado?', type: 'exclusivo' } },
  { id: 't4_sim', type: 'task-system', position: { x: 650, y: 990  }, data: { label: 'Emissão Digital do Alvará', responsavel: 'Sistema', prazo: 1, isAuto: true } },
  { id: 't4_nao', type: 'msg',         position: { x: 150, y: 990  }, data: { label: 'Notificação de Indeferimento', responsavel: 'Sistema', prazo: 1 } },
  { id: 'end1',   type: 'end',         position: { x: 650, y: 1140 }, data: { label: 'Alvará Emitido' } },
  { id: 'end2',   type: 'end',         position: { x: 150, y: 1140 }, data: { label: 'Indeferido' } },
];
export const alvaraEdges: Edge[] = [
  { id: 'e-s-t1',    source: 'start',  target: 't1',     ...defaultEdgeOptions },
  { id: 'e-t1-g1',   source: 't1',     target: 'g1',     ...defaultEdgeOptions },
  { id: 'e-g1-neg',  source: 'g1',     target: 't2_neg', label: 'Não', sourceHandle: 'source-left',  ...defaultEdgeOptions },
  { id: 'e-g1-pos',  source: 'g1',     target: 't2_pos', label: 'Sim', sourceHandle: 'source-right', ...defaultEdgeOptions },
  { id: 'e-neg-t1',  source: 't2_neg', target: 't1',     ...defaultEdgeOptions },
  { id: 'e-pos-t3',  source: 't2_pos', target: 't3',     ...defaultEdgeOptions },
  { id: 'e-t3-g2',   source: 't3',     target: 'g2',     ...defaultEdgeOptions },
  { id: 'e-g2-sim',  source: 'g2',     target: 't4_sim', label: 'Aprovado',  sourceHandle: 'source-right', ...defaultEdgeOptions },
  { id: 'e-g2-nao',  source: 'g2',     target: 't4_nao', label: 'Reprovado', sourceHandle: 'source-left',  ...defaultEdgeOptions },
  { id: 'e-sim-e1',  source: 't4_sim', target: 'end1',   ...defaultEdgeOptions },
  { id: 'e-nao-e2',  source: 't4_nao', target: 'end2',   ...defaultEdgeOptions },
];

// ── Atendimento ao Cidadão (legado) ─────────────────────────────
export const atendimentoNodes: Node[] = [
  { id: 'start', type: 'start',   position: { x: 400, y: 50  }, data: { label: 'Nova Solicitação' } },
  { id: 't1',    type: 'task',    position: { x: 400, y: 200 }, data: { label: 'Triagem Inicial', responsavel: 'Atendimento', prazo: 1 } },
  { id: 'g1',    type: 'gateway', position: { x: 400, y: 350 }, data: { label: 'Tipo de Demanda', type: 'exclusivo' } },
  { id: 't2_1',  type: 'task-system', position: { x: 200, y: 500 }, data: { label: 'Resposta Automática', responsavel: 'Sistema', prazo: 0, isAuto: true } },
  { id: 't2_2',  type: 'task',    position: { x: 600, y: 500 }, data: { label: 'Análise Técnica', responsavel: 'Especialista', prazo: 3 } },
  { id: 'end1',  type: 'end',     position: { x: 200, y: 650 }, data: { label: 'Resolvido (Auto)' } },
  { id: 'end2',  type: 'end',     position: { x: 600, y: 650 }, data: { label: 'Resolvido (Manual)' } },
];
export const atendimentoEdges: Edge[] = [
  { id: 'e-s-t1',   source: 'start', target: 't1',   ...defaultEdgeOptions },
  { id: 'e-t1-g1',  source: 't1',   target: 'g1',   ...defaultEdgeOptions },
  { id: 'e-g1-t21', source: 'g1',   target: 't2_1', label: 'Simples',  sourceHandle: 'source-left',  ...defaultEdgeOptions },
  { id: 'e-g1-t22', source: 'g1',   target: 't2_2', label: 'Complexa', sourceHandle: 'source-right', ...defaultEdgeOptions },
  { id: 'e-t21-e1', source: 't2_1', target: 'end1', ...defaultEdgeOptions },
  { id: 'e-t22-e2', source: 't2_2', target: 'end2', ...defaultEdgeOptions },
];

// ── Mapa de templates disponíveis ────────────────────────────────
export const processTemplates: Record<string, { nodes: Node[], edges: Edge[], title: string }> = {
  'licenciamento': { nodes: licenciamentoNodes, edges: licenciamentoEdges, title: 'Licenciamento Ambiental' },
  'compras':       { nodes: comprasNodes,       edges: comprasEdges,       title: 'Compras e Suprimentos' },
  'contratos':     { nodes: contratosNodes,     edges: contratosEdges,     title: 'Gestão de Contratos' },
  'admissao':      { nodes: admissaoNodes,      edges: admissaoEdges,      title: 'Admissão de Servidores' },
  'ferias':        { nodes: feriasNodes,        edges: feriasEdges,        title: 'Solicitação de Férias' },
  'ouvidoria':     { nodes: ouvidoriaNodes,     edges: ouvidoriaEdges,     title: 'Ouvidoria' },
  'alvara':        { nodes: alvaraNodes,        edges: alvaraEdges,        title: 'Alvará de Funcionamento' },
  'atendimento':   { nodes: atendimentoNodes,   edges: atendimentoEdges,   title: 'Atendimento ao Cidadão' },
};
