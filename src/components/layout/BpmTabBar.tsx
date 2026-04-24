import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import "./BpmTabBar.css";

const TABS = [
  {
    id: "visao-geral",
    label: "Visão Geral",
    icon: "fa-regular fa-gauge",
    to: "/processos",
    match: (pathname: string, tab: string | null) =>
      pathname === "/processos" && !tab,
  },
  {
    id: "fluxos",
    label: "Fluxos",
    icon: "fa-regular fa-diagram-project",
    to: "/processos/fluxos",
    match: (pathname: string, tab: string | null) =>
      pathname.startsWith("/processos/") && tab !== "automacoes",
  },
  {
    id: "formularios",
    label: "Formulários",
    icon: "fa-regular fa-clipboard-list",
    to: "/formularios",
    match: (pathname: string) => pathname.startsWith("/formularios"),
  },
  {
    id: "automacoes",
    label: "Automações",
    icon: "fa-regular fa-robot",
    to: "/processos?tab=automacoes",
    match: (_pathname: string, tab: string | null) => tab === "automacoes",
  },
];

export default function BpmTabBar() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tab = searchParams.get("tab");

  return (
    <div className="bpm-tabbar">
      {TABS.map((t) => {
        const isActive = t.match(location.pathname, tab);
        return (
          <button
            key={t.id}
            className={`bpm-tabbar__tab ${isActive ? "bpm-tabbar__tab--active" : ""}`}
            onClick={() => navigate(t.to)}
          >
            <i className={t.icon} />
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
