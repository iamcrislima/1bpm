import { useState } from 'react';
import './Sidebar.css';
import { NavLink, useLocation } from 'react-router-dom';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const topNavItems = [
  { to: '/', icon: 'fa-regular fa-inbox', label: 'Inbox', badge: 12 },
  { to: '/atividades', icon: 'fa-regular fa-bolt', label: 'Atividades' },
  { to: '/documentos', icon: 'fa-regular fa-file-lines', label: 'Documentos' },
  { to: '/assinaturas', icon: 'fa-regular fa-signature', label: 'Assinaturas' },
  { to: '/comunicacao', icon: 'fa-regular fa-comment-dots', label: 'Comunicação' },
];

const processosInteligentesSub = [
  { to: '/processos', icon: 'fa-regular fa-diagram-project', label: 'Fluxos' },
  { to: '/formularios', icon: 'fa-regular fa-clipboard-list', label: 'Formulários' },
];

const bottomNavItems = [
  { to: '/integracoes', icon: 'fa-regular fa-link', label: 'Integrações' },
  { to: '/relatorios', icon: 'fa-regular fa-chart-bar', label: 'Relatórios' },
  { to: '/configuracoes', icon: 'fa-regular fa-gear', label: 'Configurações' },
];

function NavIcon({ icon }: { icon: string }) {
  return (
    <span
      className="nav-icon"
      dangerouslySetInnerHTML={{ __html: `<i class="${icon}"></i>` }}
    />
  );
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();

  const isProcessosAtivo = location.pathname.startsWith('/processos') || location.pathname.startsWith('/formularios');
  const [processosAberto, setProcessosAberto] = useState(isProcessosAtivo);

  const renderNavItem = (item: { to: string; icon: string; label: string; badge?: number }) => {
    const isActive = item.to === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(item.to);
    return (
      <NavLink
        key={item.to}
        to={item.to}
        className={`nav-item ${isActive ? 'active' : ''}`}
        title={collapsed ? item.label : undefined}
      >
        <NavIcon icon={item.icon} />
        {!collapsed && (
          <>
            <span className="nav-label">{item.label}</span>
            {item.badge && <span className="nav-badge">{item.badge}</span>}
          </>
        )}
        {isActive && <span className="nav-active-bar" />}
      </NavLink>
    );
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-mark">1D</div>
        {!collapsed && <span className="logo-text">1Doc</span>}
      </div>

      {/* Botão Novo */}
      {!collapsed && (
        <div className="sidebar-new-btn">
          <button className="btn-new">
            <span>+</span>
            Novo
          </button>
        </div>
      )}

      {/* Nav */}
      <nav className="sidebar-nav">
        {topNavItems.map(renderNavItem)}

        {/* ── Processos Inteligentes (grupo expansível) ── */}
        <div className="nav-group">
          <button
            className={`nav-item nav-group-trigger ${isProcessosAtivo ? 'active' : ''}`}
            onClick={() => !collapsed && setProcessosAberto(o => !o)}
            title={collapsed ? 'Processos Inteligentes' : undefined}
          >
            <NavIcon icon="fa-regular fa-rocket" />
            {!collapsed && (
              <>
                <span className="nav-label">Proc. Inteligentes</span>
                <span className={`nav-chevron ${processosAberto ? 'open' : ''}`}>
                  <i className="fa-regular fa-chevron-right" style={{ fontSize: 10 }} />
                </span>
              </>
            )}
            {isProcessosAtivo && <span className="nav-active-bar" />}
          </button>

          {/* Sub-itens */}
          {!collapsed && processosAberto && (
            <div className="nav-sub-items">
              {processosInteligentesSub.map(item => {
                const isActive = location.pathname.startsWith(item.to);
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={`nav-item nav-sub-item ${isActive ? 'active' : ''}`}
                  >
                    <NavIcon icon={item.icon} />
                    <span className="nav-label">{item.label}</span>
                    {isActive && <span className="nav-active-bar" />}
                  </NavLink>
                );
              })}
            </div>
          )}
          {/* Collapsed: mostra sub direto como itens */}
          {collapsed && (
            <>
              {processosInteligentesSub.map(item => {
                const isActive = location.pathname.startsWith(item.to);
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                    title={item.label}
                  >
                    <NavIcon icon={item.icon} />
                    {isActive && <span className="nav-active-bar" />}
                  </NavLink>
                );
              })}
            </>
          )}
        </div>

        {bottomNavItems.map(renderNavItem)}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <NavLink to="#" className="nav-item">
          <NavIcon icon="fa-regular fa-circle-question" />
          {!collapsed && <span className="nav-label">Ajuda</span>}
        </NavLink>
        <button className="nav-item collapse-btn" onClick={onToggle}>
          <NavIcon icon={collapsed ? 'fa-regular fa-chevron-right' : 'fa-regular fa-chevron-left'} />
          {!collapsed && <span className="nav-label">Recolher menu</span>}
        </button>
      </div>
    </aside>
  );
}
