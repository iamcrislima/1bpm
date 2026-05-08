// ── Tipos compartilhados do editor BPM ──────────────────────────

export interface NodeData {
  label: string;
  icon?: string;
  color?: string;
  bg?: string;
  responsavel?: string;
  prazo?: number;
  prazoTipo?: 'sem-prazo' | 'tempo' | 'expressao';
  prazoUnidade?: 'minutos' | 'horas' | 'dias';
  prazoExpressao?: string;
  descricao?: string;
  ator?: string;
  /** tipo extra do gateway (paralelo/exclusivo) */
  type?: string;
  /** formulário vinculado à tarefa */
  formulario?: string;
  /** executável vinculado à tarefa de sistema */
  executableId?: string;
  /** mapeamento de campos de entrada do executável */
  camposEntrada?: Array<{ campo: string; variavel: string }>;
  /** mapeamento de campos de saída do executável */
  camposSaida?: Array<{ variavel: string; campo: string }>;

  // ── Painel de propriedades: ator / notificação ─────────────────
  notificarEmail?: boolean;
  notificacaoPersonalizada?: boolean;
  emailAssunto?: string;
  emailCorpo?: string;

  // ── Painel de propriedades: prazo aviso ──────────────────────
  avisoTipo?: 'sem-aviso' | 'tempo' | 'expressao';
  aviso?: number;
  avisoUnidade?: 'minutos' | 'horas' | 'dias';
  avisoExpressao?: string;

  // ── Painel de propriedades: formulário ───────────────────────
  formTipo?: 'dinamico' | 'ungp' | 'simulacao' | 'editor-texto';
  formNome?: string;
  formBuilderFields?: unknown[];
  formEntradas?: Array<{ campoForm: string; varProcesso: string }>;
  formSaidas?: Array<{ campoForm: string; varProcesso: string }>;

  // ── Painel de propriedades: executáveis ──────────────────────
  execVinculos?: Array<{
    value: string;
    entradaMap: Record<string, string>;
    saidaMap: Record<string, string>;
  }>;

  // ── Painel de propriedades: customizadas ─────────────────────
  customProps?: Array<{ chave: string; valor: string }>;

  // Index signature required by @xyflow/react Node<T> constraint
  [key: string]: unknown;
}

/** Shape do state de rota passado ao BpmEditor via navigate() */
export interface BpmEditorRouteState {
  flow?: AiFlowData;
  aiGeneratedFlow?: AiFlowData;
}

/** Nó no formato que a IA retorna (antes da conversão para React Flow) */
export interface AiFlowNode {
  id: string;
  type: string;
  label: string;
  responsible: string;
  deadline: string;
  description: string;
  position?: { x: number; y: number };
}

/** Aresta no formato que a IA retorna */
export interface AiFlowEdge {
  id: string;
  source: string;
  target: string;
  label: string;
}

/** Payload completo de um fluxo gerado pela IA */
export interface AiFlowData {
  name: string;
  area: string;
  description: string;
  nodes: AiFlowNode[];
  edges: AiFlowEdge[];
  automations: { trigger: string; action: string }[];
}

/** Config salva de uma automação */
export interface AutomationConfig {
  subject?: string;
  template?: string;
  message?: string;
  days?: number;
  days_before?: number;
  stage_name?: string;
  values?: string[];
  value?: string;
}
