import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SoftbarModal from "./SoftbarModal";
import { PRODUCTS } from "./softbar.config";
import type { SoftbarProduct } from "./softbar.config";
import "./Softbar.css";
import logoSoftplan from "../../assets/logo-softplan.svg";

interface SoftbarProps {
  activeProductId?: string;
  clientProducts?: string[];
  onProductChange?: (id: string) => void;
  onLogoClick?: () => void;
  tabs?: SoftbarProduct[];
}

export default function Softbar({
  activeProductId = "processos-digitais",
  clientProducts = [],
  onProductChange,
  onLogoClick,
  tabs,
}: SoftbarProps) {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [modalProduct, setModalProduct] = useState<SoftbarProduct | null>(null);

  const items = tabs ?? PRODUCTS;
  const isRouterMode = !!tabs;

  const handleItemClick = (product: SoftbarProduct) => {
    if (isRouterMode && product.to) {
      navigate(product.to);
      return;
    }
    const isContracted = clientProducts.includes(product.id);
    if (isContracted && onProductChange) {
      onProductChange(product.id);
    } else if (isContracted && product.url) {
      window.location.href = product.url;
    } else {
      setModalProduct(product);
    }
  };

  return (
    <>
      <nav className="softbar" aria-label="Navegação de produtos Softplan">
        {/* Logo */}
        <div className="softbar__logo" onClick={onLogoClick} title="Nexus — Visão geral">
          <img src={logoSoftplan} alt="Softplan" style={{ width: 28, height: 28 }} />
        </div>

        <div className="softbar__divider" />

        {/* Product / tab items */}
        <ul className="softbar__list">
          {items.map((product) => {
            const isActive = product.id === activeProductId;
            const isContracted = isRouterMode || clientProducts.includes(product.id);
            const isHovered = hoveredId === product.id;
            const notificationCount = product.id === "processos-digitais" || product.id === "inbox" ? 6 : null;

            return (
              <li key={product.id} className="softbar__item-wrapper">
                <button
                  className={[
                    "softbar__item",
                    isActive ? "softbar__item--active" : "",
                    !isContracted ? "softbar__item--disabled" : "",
                  ].filter(Boolean).join(" ")}
                  onClick={() => handleItemClick(product)}
                  onMouseEnter={() => setHoveredId(product.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  aria-label={product.label}
                  aria-current={isActive ? "page" : undefined}
                >
                  <product.Icon />
                  {notificationCount && (
                    <span className="softbar__notification-badge" aria-label={`${notificationCount} notificações`}>
                      {notificationCount}
                    </span>
                  )}
                  {!isContracted && !isActive && (
                    <span className="softbar__lock-dot" aria-hidden="true" />
                  )}
                </button>

                {/* Tooltip */}
                {isHovered && (
                  <div className="softbar__tooltip" role="tooltip">
                    <span className={`softbar__tooltip-tag ${isContracted ? "softbar__tooltip-tag--active" : "softbar__tooltip-tag--disabled"}`}>
                      {isActive ? "Você está aqui" : isContracted ? "Contratado" : "Não contratado"}
                    </span>
                    <span className="softbar__tooltip-name">{product.label}</span>
                    <span className="softbar__tooltip-desc">{product.description}</span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {/* Extra tools — only shown in product mode */}
        {!isRouterMode && (
          <>
            <div className="softbar__divider" />
            <ul className="softbar__list">
              {[
                { id: "map", label: "Map", description: "Visualização geoespacial", Icon: IconMap },
                { id: "analytics", label: "Analytics", description: "Inteligência de dados", Icon: IconAnalytics },
              ].map((tool) => (
                <li key={tool.id} className="softbar__item-wrapper">
                  <button
                    className="softbar__item softbar__item--disabled softbar__item--soon"
                    onMouseEnter={() => setHoveredId(tool.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    aria-label={tool.label}
                    onClick={() => setModalProduct({ ...tool, soon: true, Icon: tool.Icon })}
                  >
                    <tool.Icon />
                  </button>
                  {hoveredId === tool.id && (
                    <div className="softbar__tooltip" role="tooltip">
                      <span className="softbar__tooltip-tag softbar__tooltip-tag--soon">Em breve</span>
                      <span className="softbar__tooltip-name">{tool.label}</span>
                      <span className="softbar__tooltip-desc">{tool.description}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Bottom: perfil */}
        <div className="softbar__bottom">
          <div className="softbar__divider" />
          <ul className="softbar__list" style={{ marginBottom: "12px" }}>
            <li className="softbar__item-wrapper">
              <button
                className="softbar__item softbar__item--disabled"
                onMouseEnter={() => setHoveredId("profile")}
                onMouseLeave={() => setHoveredId(null)}
                aria-label="Meu perfil"
              >
                <IconProfile />
              </button>
              {hoveredId === "profile" && (
                <div className="softbar__tooltip" role="tooltip">
                  <span className="softbar__tooltip-name">Meu perfil</span>
                  <span className="softbar__tooltip-desc">Configurações da conta</span>
                </div>
              )}
            </li>
          </ul>
        </div>
      </nav>

      {/* Modal */}
      {modalProduct && (
        <SoftbarModal
          product={modalProduct}
          onClose={() => setModalProduct(null)}
        />
      )}
    </>
  );
}

function IconMap() {
  return <i className="fa-duotone fa-map" />;
}

function IconAnalytics() {
  return <i className="fa-duotone fa-chart-line" />;
}

function IconProfile() {
  return <i className="fa-duotone fa-user" />;
}
