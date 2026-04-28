export interface AutomationTrigger {
  type: string;
  label: string;
  config: Record<string, unknown>;
}

export interface AutomationCondition {
  type: string;
  label: string;
  config: Record<string, unknown>;
}

export interface AutomationAction {
  type: string;
  label: string;
  config: Record<string, unknown>;
}

export interface Automation {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  triggerCount: number;
  createdAt: string;
  updatedAt: string;
  trigger: AutomationTrigger;
  condition: AutomationCondition | null;
  action: AutomationAction;
  // Campos flat mantidos para AutomacoesPage e lista
  active: boolean;
  firedCount: number;
  summary: string;
  conditionLabel: string | null;
}

export const AUTOMATION_MOCKS: Automation[] = [
  // ── 1. Alerta de SLA Crítico ────────────────────────────────
  {
    id: 'auto-1',
    name: 'Alerta de SLA Crítico',
    description: 'Notifica o gestor quando um processo ultrapassa o prazo em Licenciamento Ambiental ou Ouvidoria.',
    status: 'active',
    active: true,
    triggerCount: 47,
    firedCount: 47,
    createdAt: '05/03/2026',
    updatedAt: '05/03/2026',
    trigger: {
      type: 'deadline-exceeded',
      label: 'Um prazo for ultrapassado',
      config: {},
    },
    condition: {
      type: 'process-type',
      label: 'O tipo do processo for',
      config: { values: ['Licenciamento Ambiental', 'Ouvidoria'] },
    },
    action: {
      type: 'notify-manager',
      label: 'Notificar o gestor da área',
      config: {
        template: 'O processo {numero_protocolo} de {nome_processo} está com prazo vencido desde {data_vencimento}. Acesse o sistema para tomar providências imediatas.',
        channel: 'internal',
      },
    },
    summary: 'Sempre que um prazo for ultrapassado e o processo for Licenciamento ou Ouvidoria → Notificar o gestor da área',
    conditionLabel: 'O tipo do processo for Licenciamento Ambiental ou Ouvidoria',
  },

  // ── 2. Boas-vindas ao Cidadão ───────────────────────────────
  {
    id: 'auto-2',
    name: 'Boas-vindas ao Cidadão',
    description: 'Envia e-mail de confirmação ao cidadão sempre que um formulário for submetido.',
    status: 'active',
    active: true,
    triggerCount: 312,
    firedCount: 312,
    createdAt: '10/03/2026',
    updatedAt: '10/03/2026',
    trigger: {
      type: 'form-submitted',
      label: 'Um formulário for submetido pelo cidadão',
      config: {},
    },
    condition: null,
    action: {
      type: 'notify-citizen-email',
      label: 'Notificar o cidadão por e-mail',
      config: {
        subject: 'Sua solicitação foi recebida — Protocolo {numero_protocolo}',
        template: 'Olá {nome_cidadao}, recebemos sua solicitação com sucesso. Seu número de protocolo é {numero_protocolo}. Você pode acompanhar o andamento pelo portal da prefeitura em qualquer momento. Qualquer dúvida, entre em contato conosco.',
        channel: 'email',
      },
    },
    summary: 'Sempre que um formulário for submetido → Notificar o cidadão por e-mail',
    conditionLabel: null,
  },

  // ── 3. Escalada Automática por Inatividade ──────────────────
  {
    id: 'auto-3',
    name: 'Escalada Automática por Inatividade',
    description: 'Escala automaticamente para o nível superior quando uma etapa fica parada por mais de 5 dias.',
    status: 'active',
    active: true,
    triggerCount: 12,
    firedCount: 12,
    createdAt: '18/03/2026',
    updatedAt: '18/03/2026',
    trigger: {
      type: 'stage-stalled',
      label: 'Uma etapa ficar parada por mais de X dias',
      config: { days: 5 },
    },
    condition: null,
    action: {
      type: 'escalate',
      label: 'Escalar para o nível superior',
      config: {
        notify_manager: true,
        message: 'O processo {numero_protocolo} está parado na etapa {nome_etapa} há mais de 5 dias sem movimentação. É necessária sua intervenção.',
      },
    },
    summary: 'Sempre que uma etapa ficar parada por mais de 5 dias → Escalar para o nível superior',
    conditionLabel: null,
  },

  // ── 4. Notificação de Conclusão ─────────────────────────────
  {
    id: 'auto-4',
    name: 'Notificação de Conclusão',
    description: 'Notifica o cidadão por e-mail quando seu processo é concluído e arquivado.',
    status: 'active',
    active: true,
    triggerCount: 198,
    firedCount: 198,
    createdAt: '22/03/2026',
    updatedAt: '22/03/2026',
    trigger: {
      type: 'process-archived',
      label: 'Um processo for arquivado ou cancelado',
      config: {},
    },
    condition: null,
    action: {
      type: 'notify-citizen-email',
      label: 'Notificar o cidadão por e-mail',
      config: {
        subject: 'Seu processo foi concluído — {nome_processo}',
        template: 'Olá {nome_cidadao}, informamos que seu processo {numero_protocolo} referente a {nome_processo} foi concluído em {data_conclusao}. Resultado: {resultado}. Para mais informações ou para iniciar um novo processo, acesse o portal da prefeitura.',
        channel: 'email',
      },
    },
    summary: 'Sempre que um processo for arquivado ou cancelado → Notificar o cidadão por e-mail',
    conditionLabel: null,
  },

  // ── 5. Vistoria Agendada — Licenciamento ────────────────────
  {
    id: 'auto-5',
    name: 'Vistoria Agendada — Licenciamento',
    description: 'Notifica o cidadão quando o processo de Licenciamento Ambiental entra na etapa de vistoria.',
    status: 'inactive',
    active: false,
    triggerCount: 0,
    firedCount: 0,
    createdAt: '01/04/2026',
    updatedAt: '01/04/2026',
    trigger: {
      type: 'process-entered-stage',
      label: 'Um processo entrar em uma etapa',
      config: { stage_name: 'Vistoria técnica' },
    },
    condition: {
      type: 'process-type',
      label: 'O tipo do processo for',
      config: { values: ['Licenciamento Ambiental'] },
    },
    action: {
      type: 'notify-citizen-email',
      label: 'Notificar o cidadão por e-mail',
      config: {
        subject: 'Vistoria técnica agendada — {nome_processo}',
        template: 'Olá {nome_cidadao}, sua vistoria técnica referente ao processo {numero_protocolo} foi agendada. Em breve nossa equipe entrará em contato para confirmar a data e horário. Certifique-se de que o local estará disponível para acesso.',
        channel: 'email,sms',
      },
    },
    summary: 'Sempre que um processo entrar na etapa Vistoria técnica e for Licenciamento Ambiental → Notificar o cidadão por e-mail',
    conditionLabel: 'O tipo do processo for Licenciamento Ambiental',
  },

  // ── 6. Aprovação Expressa de Compras ────────────────────────
  {
    id: 'auto-6',
    name: 'Aprovação Expressa de Compras',
    description: 'Move automaticamente para a próxima etapa quando uma compra de baixo valor é aprovada.',
    status: 'active',
    active: true,
    triggerCount: 34,
    firedCount: 34,
    createdAt: '10/04/2026',
    updatedAt: '10/04/2026',
    trigger: {
      type: 'approval-granted',
      label: 'Uma aprovação for concedida',
      config: {},
    },
    condition: {
      type: 'field-value',
      label: 'O valor do campo for menor que',
      config: { field: 'valor_estimado', operator: 'less_than', value: '10000' },
    },
    action: {
      type: 'move-stage',
      label: 'Mover para a próxima etapa automaticamente',
      config: { generate_protocol: true, notify_responsible: true },
    },
    summary: 'Sempre que uma aprovação for concedida e o valor for < R$ 10.000 → Avançar para a próxima etapa',
    conditionLabel: 'O valor da solicitação for menor que R$ 10.000',
  },

  // ── 7. Lembrete de Consulta Agendada ────────────────────────
  {
    id: 'auto-7',
    name: 'Lembrete de Consulta Agendada',
    description: 'Envia SMS ao cidadão 1 dia antes do vencimento do SLA de regulação de saúde.',
    status: 'active',
    active: true,
    triggerCount: 89,
    firedCount: 89,
    createdAt: '15/01/2024',
    updatedAt: '15/01/2024',
    trigger: {
      type: 'sla-expiring',
      label: 'Um SLA estiver prestes a vencer',
      config: { days_before: 1 },
    },
    condition: {
      type: 'process-type',
      label: 'O tipo do processo for',
      config: { values: ['Regulação de Consultas e Exames Especializados'] },
    },
    action: {
      type: 'notify-citizen-sms',
      label: 'Notificar o cidadão por SMS',
      config: {
        template: 'Lembrete: você tem uma consulta agendada amanhã referente ao protocolo {numero_protocolo}. Em caso de impossibilidade, entre em contato com a UBS para reagendamento.',
        channel: 'sms',
      },
    },
    summary: 'Sempre que um SLA estiver prestes a vencer (1 dia) e for Regulação de Saúde → Notificar o cidadão por SMS',
    conditionLabel: 'O tipo do processo for Regulação de Consultas e Exames Especializados',
  },

  // ── 8. Geração Automática de Protocolo ──────────────────────
  {
    id: 'auto-8',
    name: 'Geração Automática de Protocolo',
    description: 'Gera protocolo automaticamente ao criar qualquer novo processo.',
    status: 'active',
    active: true,
    triggerCount: 1240,
    firedCount: 1240,
    createdAt: '10/01/2024',
    updatedAt: '10/01/2024',
    trigger: {
      type: 'process-created',
      label: 'Um processo for criado',
      config: {},
    },
    condition: null,
    action: {
      type: 'generate-protocol',
      label: 'Gerar protocolo automático',
      config: {
        format: 'ANO-SEQUENCIAL',
        notify_requester: true,
        template_email: 'Sua solicitação foi registrada com o protocolo {numero_protocolo}. Guarde este número para acompanhar seu atendimento.',
      },
    },
    summary: 'Sempre que um processo for criado → Gerar protocolo automático',
    conditionLabel: null,
  },

  // ── 9. Alerta de Contrato Vencendo ──────────────────────────
  {
    id: 'auto-9',
    name: 'Alerta de Contrato Vencendo',
    description: 'Alerta o gestor 60 dias antes do vencimento de contratos ativos.',
    status: 'active',
    active: true,
    triggerCount: 8,
    firedCount: 8,
    createdAt: '20/02/2024',
    updatedAt: '20/02/2024',
    trigger: {
      type: 'sla-expiring',
      label: 'Um SLA estiver prestes a vencer',
      config: { days_before: 60 },
    },
    condition: {
      type: 'process-type',
      label: 'O tipo do processo for',
      config: { values: ['Gestão de Contratos de Terceirização', 'Gestão de Contratos'] },
    },
    action: {
      type: 'notify-manager',
      label: 'Notificar o gestor da área',
      config: {
        template: 'Atenção: o contrato {numero_protocolo} com {fornecedor} vencerá em 60 dias. É necessário iniciar o processo de renovação ou encerramento.',
        channel: 'internal,email',
      },
    },
    summary: 'Sempre que um SLA estiver prestes a vencer (60 dias) e for Gestão de Contratos → Notificar o gestor da área',
    conditionLabel: 'O tipo do processo for Gestão de Contratos',
  },

  // ── 10. Distribuição Automática de Demandas ─────────────────
  {
    id: 'auto-10',
    name: 'Distribuição Automática de Demandas',
    description: 'Distribui automaticamente novas demandas de Ouvidoria e Benefício Eventual por round-robin.',
    status: 'active',
    active: true,
    triggerCount: 203,
    firedCount: 203,
    createdAt: '05/03/2024',
    updatedAt: '05/03/2024',
    trigger: {
      type: 'form-submitted',
      label: 'Um formulário for submetido pelo cidadão',
      config: {},
    },
    condition: {
      type: 'process-type',
      label: 'O tipo do processo for',
      config: { values: ['Ouvidoria', 'Concessão de Benefício Eventual'] },
    },
    action: {
      type: 'assign-responsible',
      label: 'Atribuir responsável por regra',
      config: {
        rule: 'round_robin',
        team: 'Equipe de Atendimento',
        notify_assigned: true,
        message: 'Uma nova demanda foi atribuída a você: {nome_processo} — Protocolo {numero_protocolo}. Prazo: {prazo_dias} dias úteis.',
      },
    },
    summary: 'Sempre que um formulário for submetido e for Ouvidoria ou Benefício Eventual → Atribuir responsável por regra',
    conditionLabel: 'O tipo do processo for Ouvidoria ou Concessão de Benefício Eventual',
  },

  // ── 11. Notificação de Parcela em Atraso ────────────────────
  {
    id: 'auto-11',
    name: 'Notificação de Parcela em Atraso',
    description: 'Notifica o cidadão por e-mail e SMS quando uma parcela de dívida ativa vence sem pagamento.',
    status: 'active',
    active: true,
    triggerCount: 67,
    firedCount: 67,
    createdAt: '12/03/2024',
    updatedAt: '12/03/2024',
    trigger: {
      type: 'deadline-exceeded',
      label: 'Um prazo for ultrapassado',
      config: {},
    },
    condition: {
      type: 'process-type',
      label: 'O tipo do processo for',
      config: { values: ['Cobrança da Dívida Ativa'] },
    },
    action: {
      type: 'notify-citizen-email',
      label: 'Notificar o cidadão por e-mail',
      config: {
        subject: 'Parcela em atraso — Dívida Ativa Municipal',
        template: 'Senhor(a) {nome_cidadao}, identificamos que a parcela referente ao acordo de parcelamento do débito {numero_protocolo} encontra-se em atraso. Para evitar o cancelamento do parcelamento e retomada das medidas de cobrança, regularize sua situação até {data_limite}. Entre em contato com a Procuradoria Fiscal para mais informações.',
        channel: 'email,sms',
      },
    },
    summary: 'Sempre que um prazo for ultrapassado e for Cobrança da Dívida Ativa → Notificar o cidadão por e-mail',
    conditionLabel: 'O tipo do processo for Cobrança da Dívida Ativa',
  },
];
