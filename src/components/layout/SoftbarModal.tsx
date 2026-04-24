import { useEffect } from "react";
import type { SoftbarProduct } from "./softbar.config";
import "./SoftbarModal.css";

interface SoftbarModalProps {
  product: SoftbarProduct;
  onClose: () => void;
}

export default function SoftbarModal({ product, onClose }: SoftbarModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const isSoon = product.soon;

  return (
    <div
      className="sbmodal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="sbmodal-title"
    >
      <div className="sbmodal">
        {/* Close button */}
        <button className="sbmodal__close" onClick={onClose} aria-label="Fechar">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="1" y1="1" x2="13" y2="13" />
            <line x1="13" y1="1" x2="1" y2="13" />
          </svg>
        </button>

        {/* Header */}
        <div className="sbmodal__header">
          <span className={`sbmodal__badge ${isSoon ? "sbmodal__badge--soon" : ""}`}>
            {isSoon ? "Em breve" : product.badge}
          </span>
          <h2 className="sbmodal__title" id="sbmodal-title">
            {isSoon ? product.label : product.tagline}
          </h2>
          <p className="sbmodal__desc">
            {isSoon
              ? `${product.label} está sendo preparado e em breve estará disponível para contratação.`
              : product.longDesc}
          </p>
        </div>

        {/* Chips preview */}
        {product.chips && !isSoon && (
          <div className="sbmodal__chips">
            {product.chips.map((chip) => (
              <span key={chip} className="sbmodal__chip">{chip}</span>
            ))}
          </div>
        )}

        {/* Features */}
        {product.features && !isSoon && (
          <ul className="sbmodal__features">
            {product.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        )}

        {/* Integration note */}
        {!isSoon && (
          <p className="sbmodal__integrate">
            Integra com: <strong>Processos Digitais · 1Doc</strong>
          </p>
        )}

        {/* Actions */}
        <div className="sbmodal__actions">
          <button
            className="sbmodal__btn-primary"
            onClick={() => {
              alert("Redirecionando para solicitação de avaliação...");
              onClose();
            }}
          >
            {isSoon ? "Me notifique quando lançar" : "Solicitar avaliação"}
          </button>
          <button className="sbmodal__btn-secondary" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
