import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dashboard } from "../../data/mockData";
import "./Header.css";

function useClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      handler();
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
}

const NOVO_ITEMS = [
  { id: "novo-memorando",        icon: "fa-regular fa-memo",                    label: "Memorando" },
  { id: "novo-ciclo",            icon: "fa-regular fa-arrows-spin",             label: "Ciclo de Vida" },
  { id: "novo-documento",        icon: "fa-regular fa-file-lines",              label: "Documento" },
  { id: "novo-ata",              icon: "fa-regular fa-clipboard",               label: "Ata" },
  { id: "novo-circular",         icon: "fa-regular fa-bullhorn",                label: "Circular" },
  { id: "novo-oficio-manual",    icon: "fa-regular fa-envelope-open-text",      label: "Ofício Manual" },
  { id: "novo-oficio",           icon: "fa-regular fa-envelope",                label: "Ofício" },
  { id: "novo-alvara",           icon: "fa-regular fa-file-certificate",        label: "Alvará" },
  { id: "novo-ouvidoria",        icon: "fa-regular fa-comments",                label: "Ouvidoria" },
  { id: "novo-chamado",          icon: "fa-regular fa-screwdriver-wrench",      label: "Chamado técnico" },
  { id: "novo-sessao",           icon: "fa-regular fa-gavel",                   label: "Sessão Plenária" },
  { id: "novo-analise-atual",    icon: "fa-regular fa-magnifying-glass-chart",  label: "Análise de Projeto (atual)" },
  { id: "novo-protocolo",        icon: "fa-regular fa-receipt",                 label: "Protocolo" },
  { id: "novo-protocolo-pref",   icon: "fa-regular fa-receipt",                 label: "Protocolo Pref." },
  { id: "novo-analise",          icon: "fa-regular fa-magnifying-glass-chart",  label: "Análise de Projeto" },
  { id: "novo-fiscalizacao",     icon: "fa-regular fa-clipboard-list-check",    label: "Fiscalização" },
  { id: "novo-proc-adm",         icon: "fa-regular fa-scale-balanced",          label: "Proc. Administrativo" },
  { id: "novo-ato",              icon: "fa-regular fa-file-shield",             label: "Ato oficial" },
  { id: "novo-entrada-dados",    icon: "fa-regular fa-database",                label: "Entrada de dados" },
  { id: "novo-proc-judicial",    icon: "fa-regular fa-scale-balanced",          label: "Processo Judicial" },
  { id: "novo-materia",          icon: "fa-regular fa-landmark",                label: "Matéria Legislativa" },
  { id: "novo-parecer",          icon: "fa-regular fa-file-pen",                label: "Parecer" },
];

const LISTAR_ITEMS = [
  { id: "list-memorandos",       icon: "fa-regular fa-memo",                    label: "Memorandos" },
  { id: "list-ciclos",           icon: "fa-regular fa-arrows-spin",             label: "Ciclos de Vida" },
  { id: "list-ouvidoria-eouve",  icon: "fa-regular fa-comments",                label: "Ouvidoria e-Ouve" },
  { id: "list-documentos",       icon: "fa-regular fa-file-lines",              label: "Documentos" },
  { id: "list-atas",             icon: "fa-regular fa-clipboard",               label: "Atas" },
  { id: "list-circulares",       icon: "fa-regular fa-bullhorn",                label: "Circulares" },
  { id: "list-oficios",          icon: "fa-regular fa-envelope",                label: "Ofícios" },
  { id: "list-alvaras",          icon: "fa-regular fa-file-certificate",        label: "Alvarás" },
  { id: "list-ouvidorias",       icon: "fa-regular fa-comments",                label: "Ouvidorias" },
  { id: "list-chamados",         icon: "fa-regular fa-screwdriver-wrench",      label: "Chamados" },
  { id: "list-sessoes",          icon: "fa-regular fa-gavel",                   label: "Sessões Plenárias" },
  { id: "list-analises-atual",   icon: "fa-regular fa-magnifying-glass-chart",  label: "Análises de Projetos (atual)" },
  { id: "list-protocolos",       icon: "fa-regular fa-receipt",                 label: "Protocolos" },
  { id: "list-fiscalizacoes",    icon: "fa-regular fa-clipboard-list-check",    label: "Fiscalizações" },
  { id: "list-proc-adm",         icon: "fa-regular fa-scale-balanced",          label: "Proc. Administrativos" },
  { id: "list-atos",             icon: "fa-regular fa-file-shield",             label: "Atos oficiais" },
  { id: "list-docs-govbr",       icon: "fa-regular fa-file-lines",              label: "Documentos GOVBR" },
  { id: "list-entrada-dados",    icon: "fa-regular fa-database",                label: "Entradas de dados" },
  { id: "list-fiscalizados",     icon: "fa-regular fa-clipboard-list-check",    label: "Itens fiscalizados" },
];

const USER_MENU_ITEMS_1 = [
  { id: "plano",    label: "Plano 1Doc" },
  { id: "ajuda",    label: "Central de Ajuda" },
  { id: "novidades",label: "Novidades" },
  { id: "blog",     label: "Blog da 1Doc" },
];

const USER_MENU_ITEMS_2 = [
  { id: "adm",      label: "Administração" },
  { id: "relat",    label: "Relatórios" },
  { id: "atend",    label: "Central de Atendimento" },
  { id: "suporte",  label: "Chat com Suporte" },
];

export default function Header() {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLElement>(null);

  useClickOutside(menuRef, () => setOpenMenu(null));

  const toggle = (id: string) => setOpenMenu((prev) => (prev === id ? null : id));

  const closeAndNavigate = (to: string) => {
    setOpenMenu(null);
    navigate(to);
  };

  return (
    <header className="onb-header" ref={menuRef}>
      <div className="onb-header__left">
        <span className="onb-header__logo" onClick={() => navigate("/")}>1Doc</span>

        <nav className="onb-header__nav">
          <span className="onb-header__nav-item" onClick={() => navigate("/")}>Início</span>

          {/* Inbox */}
          <span className="onb-header__nav-item" onClick={() => toggle("inbox")}>
            Inbox <i className="fa-solid fa-chevron-down" style={{ fontSize: 10 }} />
            {openMenu === "inbox" && (
              <div className="onb-header__dropdown">
                <div className="onb-header__dropdown-item">Inbox de SADM</div>
                <div className="onb-header__dropdown-item">Inbox pessoal</div>
              </div>
            )}
          </span>

          {/* Novo */}
          <span className="onb-header__nav-item" onClick={() => toggle("novo")}>
            Novo <i className="fa-solid fa-chevron-down" style={{ fontSize: 10 }} />
            {openMenu === "novo" && (
              <div className="onb-header__dropdown onb-header__dropdown--tall">
                {NOVO_ITEMS.map((item) => (
                  <div key={item.id} className="onb-header__dropdown-item">
                    <i className={item.icon} style={{ width: 18, textAlign: "center", color: "var(--text-secondary)" }} />
                    {item.label}
                  </div>
                ))}
              </div>
            )}
          </span>

          {/* Listar */}
          <span className="onb-header__nav-item" onClick={() => toggle("listar")}>
            Listar <span className="onb-header__badge">4</span>
            <i className="fa-solid fa-chevron-down" style={{ fontSize: 10 }} />
            {openMenu === "listar" && (
              <div className="onb-header__dropdown onb-header__dropdown--tall">
                {LISTAR_ITEMS.map((item) => (
                  <div key={item.id} className="onb-header__dropdown-item">
                    <i className={item.icon} style={{ width: 18, textAlign: "center", color: "var(--text-secondary)" }} />
                    {item.label}
                  </div>
                ))}
              </div>
            )}
          </span>

          <span className="onb-header__nav-item">Fila de Assinaturas</span>
        </nav>
      </div>

      <div className="onb-header__right">
        {/* Search */}
        <div className="onb-header__search">
          <input className="onb-header__search-input" type="text" placeholder="Buscar" readOnly />
          <i className="fa-solid fa-magnifying-glass onb-header__search-icon" />
        </div>

        {/* Action icons */}
        <div className="onb-header__actions">
          <span className="onb-header__action-btn"><i className="fa-regular fa-desktop" /></span>
          <span className="onb-header__action-btn">
            <i className="fa-regular fa-bell" />
            <span className="onb-header__bell-dot" />
          </span>
        </div>

        {/* User */}
        <div className="onb-header__user" onClick={() => toggle("user")}>
          <div className="onb-header__avatar">CL</div>
          <span>Cris Lima</span>
          <i className="fa-solid fa-chevron-down" style={{ fontSize: 10, color: "var(--text-tertiary)" }} />

          {openMenu === "user" && (
            <div className="onb-header__dropdown onb-header__dropdown--user">
              <div className="onb-header__user-info">
                <div>
                  <strong>Cris - Administrador</strong>
                  <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>cris.lima@1doc.com.br</div>
                </div>
                <div className="onb-header__user-avatar-lg">CL</div>
              </div>

              <button className="onb-header__user-pref-btn">Preferências da conta</button>

              <div className="onb-header__dropdown-divider" />

              {USER_MENU_ITEMS_1.map((item) => (
                <div key={item.id} className="onb-header__dropdown-item">{item.label}</div>
              ))}

              <div className="onb-header__dropdown-divider" />

              {USER_MENU_ITEMS_2.map((item) => (
                <div key={item.id} className="onb-header__dropdown-item">{item.label}</div>
              ))}

              <div className="onb-header__dropdown-divider" />

              {/* Processos Inteligentes */}
              <div
                className="onb-header__dropdown-item"
                onClick={() => closeAndNavigate("/processos")}
              >
                <i className="fa-regular fa-diagram-project" style={{ width: 18, textAlign: "center", color: "var(--primary-pure)" }} />
                <span style={{ color: "var(--primary-pure)", fontWeight: 700 }}>Processos Inteligentes</span>
                <span className="onb-header__badge" style={{ marginLeft: "auto" }}>
                  {dashboard.atrasados}
                </span>
              </div>

              <div className="onb-header__dropdown-divider" />

              {/* Sair */}
              <div className="onb-header__dropdown-item" style={{ color: "var(--danger)" }}>
                <i className="fa-regular fa-arrow-right-from-bracket" style={{ width: 18, textAlign: "center", color: "var(--danger)" }} />
                Sair
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
