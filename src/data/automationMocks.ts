export interface Automation {
  id: string;
  name: string;
  triggerId: string;
  triggerLabel: string;
  conditionLabel: string | null;
  actionId: string;
  actionLabel: string;
  summary: string;
  active: boolean;
  createdAt: string;
  firedCount: number;
}

export const AUTOMATION_MOCKS: Automation[] = [
  {
    id: 'auto-1',
    name: 'Alerta de SLA crítico',
    triggerId: 'deadline-exceeded',
    triggerLabel: 'Um prazo for ultrapassado',
    conditionLabel: 'O tipo do processo for Licenciamento Ambiental ou Ouvidoria',
    actionId: 'notify-manager',
    actionLabel: 'Notificar o gestor da área',
    summary: 'Sempre que um prazo for ultrapassado e o processo for Licenciamento ou Ouvidoria → Notificar o gestor da área',
    active: true,
    createdAt: '05/03/2026',
    firedCount: 47,
  },
  {
    id: 'auto-2',
    name: 'Boas-vindas ao cidadão',
    triggerId: 'form-submitted',
    triggerLabel: 'Um formulário for submetido pelo cidadão',
    conditionLabel: null,
    actionId: 'notify-citizen-email',
    actionLabel: 'Notificar o cidadão por e-mail',
    summary: 'Sempre que um formulário for submetido → Notificar o cidadão por e-mail',
    active: true,
    createdAt: '10/03/2026',
    firedCount: 312,
  },
  {
    id: 'auto-3',
    name: 'Escalada automática por inatividade',
    triggerId: 'stage-stalled',
    triggerLabel: 'Uma etapa ficar parada por mais de 5 dias',
    conditionLabel: null,
    actionId: 'escalate',
    actionLabel: 'Escalar para o nível superior',
    summary: 'Sempre que uma etapa ficar parada por mais de 5 dias → Escalar para o nível superior',
    active: true,
    createdAt: '18/03/2026',
    firedCount: 12,
  },
  {
    id: 'auto-4',
    name: 'Conclusão de processo',
    triggerId: 'process-archived',
    triggerLabel: 'Um processo for concluído e arquivado',
    conditionLabel: null,
    actionId: 'notify-citizen-email',
    actionLabel: 'Notificar o cidadão por e-mail',
    summary: 'Sempre que um processo for concluído e arquivado → Notificar o cidadão por e-mail',
    active: true,
    createdAt: '22/03/2026',
    firedCount: 198,
  },
  {
    id: 'auto-5',
    name: 'Vistoria agendada',
    triggerId: 'process-entered-stage',
    triggerLabel: 'Um processo entrar em uma etapa específica',
    conditionLabel: 'O tipo do processo for Licenciamento Ambiental',
    actionId: 'notify-citizen-email',
    actionLabel: 'Notificar o cidadão por e-mail',
    summary: 'Sempre que um processo entrar em uma etapa específica e for Licenciamento Ambiental → Notificar o cidadão por e-mail',
    active: false,
    createdAt: '01/04/2026',
    firedCount: 0,
  },
  {
    id: 'auto-6',
    name: 'Aprovação expressa de baixo valor',
    triggerId: 'approval-granted',
    triggerLabel: 'Uma aprovação for concedida',
    conditionLabel: 'O valor da solicitação for menor que R$ 10.000',
    actionId: 'move-stage',
    actionLabel: 'Avançar para a próxima etapa',
    summary: 'Sempre que uma aprovação for concedida e o valor for < R$ 10.000 → Avançar para a próxima etapa',
    active: true,
    createdAt: '10/04/2026',
    firedCount: 34,
  },
];
