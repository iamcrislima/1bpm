// ============================================================
// SOFTBAR — Configuração de Produtos
// Nexus Project · Softplan
// ============================================================

import React from "react";

export interface SoftbarProduct {
  id: string;
  label: string;
  description: string;
  url?: string;
  to?: string;
  badge?: string;
  tagline?: string;
  longDesc?: string;
  features?: string[];
  chips?: string[];
  soon?: boolean;
  Icon: React.FC;
}

export const PRODUCTS: SoftbarProduct[] = [
  {
    id: "procuradorias",
    label: "Procuradorias",
    description: "Controle jurídico centralizado",
    url: "https://procuradorias.softplan.com.br",
    badge: "Gestão Jurídica",
    tagline: "Mais controle jurídico. Menos retrabalho.",
    longDesc:
      "Centralize pareceres, acompanhe prazos e padronize fluxos jurídicos em um ambiente totalmente digital e auditável.",
    features: [
      "Gestão de processos administrativos e judiciais",
      "Controle de prazos e manifestações",
      "Fluxos padronizados e rastreáveis",
      "Relatórios gerenciais para tomada de decisão",
    ],
    chips: ["Dívida ativa", "Devedor", "Histórico", "Impedimentos de cobrança", "Execução fiscal"],
    Icon: IconProcuradorias,
  },
  {
    id: "obras",
    label: "Obras Públicas",
    description: "Gestão de obras e contratos",
    url: "https://obras.softplan.com.br",
    badge: "Infraestrutura",
    tagline: "Gestão inteligente de obras públicas.",
    longDesc:
      "Acompanhe contratos, medições, cronogramas e execução física financeira em uma única plataforma integrada.",
    features: [
      "Gestão de contratos e aditivos",
      "Medição e acompanhamento de execução",
      "Painéis de desempenho em tempo real",
      "Integração com financeiro e planejamento",
    ],
    chips: ["Contratos", "Medições", "Cronogramas", "Indicadores", "Convênios"],
    Icon: IconObras,
  },
  {
    id: "licenciamento",
    label: "Licenciamento Ambiental",
    description: "Licenças e conformidade ambiental",
    url: "https://licenciamento.softplan.com.br",
    badge: "Meio Ambiente",
    tagline: "Licenciamento ambiental digital e rastreável.",
    longDesc:
      "Gerencie processos de licenciamento ambiental com fluxos padronizados, prazos controlados e transparência total.",
    features: [
      "Gestão de licenças e renovações",
      "Controle de condicionantes ambientais",
      "Notificações automáticas de prazos",
      "Histórico completo de processos",
    ],
    chips: ["Licenças", "Condicionantes", "Alertas", "Renovações"],
    Icon: IconLicenciamento,
  },
  {
    id: "gestao-projetos",
    label: "Gestão de Projetos",
    description: "Portfólio e projetos públicos",
    url: "https://projetos.softplan.com.br",
    badge: "Planejamento",
    tagline: "Projetos públicos sob controle total.",
    longDesc:
      "Planeje, monitore e entregue projetos governamentais com visibilidade completa de prazos, recursos e resultados.",
    features: [
      "Portfólio e gestão de projetos",
      "Cronogramas e marcos de entrega",
      "Alocação de recursos e equipes",
      "Dashboards e relatórios executivos",
    ],
    chips: ["Portfólio", "Cronograma", "Equipes", "OKRs"],
    Icon: IconGestao,
  },
  {
    id: "processos-digitais",
    label: "Processos Digitais",
    description: "Documentos e assinaturas digitais",
    url: "https://1doc.1doc.com.br",
    badge: "Processos Digitais",
    tagline: "Documentos e assinaturas no fluxo certo.",
    longDesc:
      "Gerencie documentos, memorandos, assinaturas digitais e prazos em uma única plataforma integrada ao dia a dia da gestão pública.",
    features: [
      "Criação e tramitação de documentos",
      "Assinaturas digitais com fila de aprovação",
      "Controle de prazos e vencimentos",
      "Inbox centralizado por setor",
    ],
    chips: ["Memorandos", "Assinaturas", "Prazos", "Inbox", "Comunicados"],
    Icon: IconProcessosDigitais,
  },
];

// ── BPM Tabs — exibidas em /processos* e /formularios ─────
// 4 abas conforme especificação do módulo BPM

export const BPM_TABS: SoftbarProduct[] = [
  {
    id: "processos",
    label: "Fluxos",
    description: "Fluxos BPM do módulo",
    to: "/processos",
    Icon: IconFluxos,
  },
  {
    id: "formularios",
    label: "Formulários",
    description: "Formulários dinâmicos",
    to: "/formularios",
    Icon: IconFormularios,
  },
  {
    id: "automacoes",
    label: "Automações",
    description: "Regras e integrações automáticas",
    to: "/processos?tab=automacoes",
    Icon: IconAutomacoes,
  },
  {
    id: "relatorios",
    label: "Relatórios",
    description: "Análise e métricas do módulo",
    to: "/processos?tab=relatorios",
    Icon: IconRelatorios,
  },
];

// ── Icons ─────────────────────────────────────────────────

function IconProcuradorias() {
  return <i className="fa-duotone fa-scale-balanced" />;
}
function IconObras() {
  return <i className="fa-duotone fa-helmet-safety" />;
}
function IconLicenciamento() {
  return <i className="fa-duotone fa-tree" />;
}
function IconGestao() {
  return <i className="fa-duotone fa-diagram-project" />;
}
function IconProcessosDigitais() {
  return <i className="fa-duotone fa-folder-tree" />;
}

// BPM icons
function IconFluxos() {
  return <i className="fa-duotone fa-diagram-project" />;
}
function IconFormularios() {
  return <i className="fa-duotone fa-clipboard-list" />;
}
function IconAutomacoes() {
  return <i className="fa-duotone fa-robot" />;
}
function IconRelatorios() {
  return <i className="fa-duotone fa-chart-bar" />;
}
