import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppIcon } from "./AppIcon";
import { fleetVehicles } from "../data/fleetDashboard";

function buildSearchPool() {
  return fleetVehicles.map((vehicle) => ({
    id: vehicle.id,
    model: vehicle.model,
    plate: vehicle.plate,
    driver: vehicle.driver,
    searchText: [vehicle.id, vehicle.model, vehicle.plate, vehicle.driver]
      .join(" ")
      .toLowerCase(),
  }));
}

function useOutsideClick(containerRef, onOutsideClick) {
  useEffect(() => {
    function handlePointerDown(event) {
      if (!containerRef.current) {
        return;
      }

      if (!containerRef.current.contains(event.target)) {
        onOutsideClick();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [containerRef, onOutsideClick]);
}

export function AppHeader({ isMobile = false, onMenuToggle }) {
  const navigate = useNavigate();
  const headerRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  useEffect(() => {
    function syncViewportMode() {
      setIsMobileViewport(window.innerWidth <= 900);
    }

    syncViewportMode();
    window.addEventListener("resize", syncViewportMode);
    return () => window.removeEventListener("resize", syncViewportMode);
  }, []);

  const mobileMode = isMobile || isMobileViewport;

  const searchPool = useMemo(() => buildSearchPool(), []);

  const searchMatches = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return [];
    }

    return searchPool
      .filter((item) => item.searchText.includes(query))
      .slice(0, 6);
  }, [searchPool, searchQuery]);

  const notificationItems = useMemo(() => {
    return fleetVehicles
      .filter((vehicle) => vehicle.pendencies.length > 0)
      .flatMap((vehicle) =>
        vehicle.pendencies.map((pending) => ({
          id: `${vehicle.id}-${pending.slug}`,
          vehicleId: vehicle.id,
          label: pending.label,
          detail: pending.detail,
          route: `/pendencias/${vehicle.id}/${pending.slug}`,
        })),
      )
      .slice(0, 5);
  }, []);

  useOutsideClick(headerRef, () => {
    setIsNotificationOpen(false);
    setIsProfileOpen(false);
  });

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsNotificationOpen(false);
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  function handleSearchSubmit(event) {
    event.preventDefault();
    const query = searchQuery.trim();

    if (query.length === 0) {
      navigate("/veiculos");
      return;
    }

    navigate(`/veiculos?search=${encodeURIComponent(query)}`);
  }

  function handleQuickSearch(item) {
    setSearchQuery(item.id);
    navigate(`/veiculos?search=${encodeURIComponent(item.id)}`);
  }

  function handleLogout() {
    localStorage.removeItem("smart-frota-authenticated");
    localStorage.removeItem("smart-frota-remember");
    sessionStorage.removeItem("smart-frota-authenticated");
    sessionStorage.removeItem("smart-frota-remember");
    navigate("/login", { replace: true });
  }

  function handleMenuOpen() {
    if (onMenuToggle) {
      onMenuToggle();
      return;
    }

    window.dispatchEvent(new Event("smart-frota:open-sidebar"));
  }

  return (
    <header className="fg-home-header" ref={headerRef}>
      {mobileMode ? (
        <div className="fg-home-mobile-header-row">
          <button
            type="button"
            className="fg-home-icon-btn fg-mobile-menu-btn"
            aria-label="Abrir menu"
            onClick={handleMenuOpen}
          >
            <AppIcon type="menu" />
          </button>

          <div className="fg-home-mobile-brand" aria-hidden="true">
            <span className="fg-home-brand-icon">
              <AppIcon type="truck" />
            </span>
            <strong>Smart Frota</strong>
          </div>

          <button
            type="button"
            className="fg-home-icon-btn"
            aria-label="Perfil"
            title="Perfil"
            aria-expanded={isProfileOpen}
            onClick={() => {
              setIsProfileOpen((value) => !value);
              setIsNotificationOpen(false);
            }}
          >
            <AppIcon type="users" />
          </button>

          {isProfileOpen ? (
            <div className="fg-header-dropdown fg-header-profile-dropdown">
              <button
                type="button"
                className="fg-header-dropdown-item"
                onClick={() => {
                  navigate("/motoristas");
                  setIsProfileOpen(false);
                }}
              >
                <strong>Ver perfil</strong>
                <span>Dados do usuário e permissões</span>
              </button>

              <button
                type="button"
                className="fg-header-dropdown-item"
                onClick={() => {
                  navigate("/configuracoes");
                  setIsProfileOpen(false);
                }}
              >
                <strong>Configurações</strong>
                <span>Preferências do sistema</span>
              </button>

              <button
                type="button"
                className="fg-header-dropdown-item is-danger"
                onClick={handleLogout}
              >
                <strong>Sair</strong>
                <span>Encerrar sessão atual</span>
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="fg-home-header-left">
        <form className="fg-home-search-wrap" onSubmit={handleSearchSubmit}>
          <label className="fg-home-search" htmlFor="global-search">
            <input
              id="global-search"
              className="fg-home-search-input"
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Buscar por veículo, placa, motorista ou ID..."
              autoComplete="off"
            />

            <button
              type="submit"
              className="fg-home-search-submit"
              aria-label="Pesquisar"
              title="Pesquisar"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="6" />
                <path d="M16 16l4 4" />
              </svg>
            </button>
          </label>

          {searchMatches.length > 0 ? (
            <div
              className="fg-header-dropdown fg-header-search-results"
              role="listbox"
            >
              {searchMatches.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="fg-header-dropdown-item"
                  onClick={() => handleQuickSearch(item)}
                >
                  <strong>{item.id}</strong>
                  <span>
                    {item.model} · {item.plate}
                  </span>
                  <small>{item.driver}</small>
                </button>
              ))}
            </div>
          ) : null}

          <button
            type="button"
            className="fg-home-filter-btn"
            aria-label="Filtros"
            title="Filtros"
            onClick={() => navigate("/veiculos")}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M4 6h16l-6 7v5l-4 2v-7z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              />
            </svg>
          </button>
        </form>
      </div>

      <div className="fg-home-header-right">
        <button
          type="button"
          className="fg-home-new-btn"
          onClick={() => navigate("/agendamentos")}
        >
          <span>+</span> Novo Pedido
        </button>

        <div className="fg-header-menu-wrap">
          <button
            type="button"
            className="fg-home-icon-btn"
            aria-label="Notificações"
            title="Notificações"
            aria-expanded={isNotificationOpen}
            onClick={() => {
              setIsNotificationOpen((value) => !value);
              setIsProfileOpen(false);
            }}
          >
            <AppIcon type="bell" />
          </button>

          {isNotificationOpen ? (
            <div className="fg-header-dropdown fg-header-notification-dropdown">
              {notificationItems.length > 0 ? (
                notificationItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="fg-header-dropdown-item"
                    onClick={() => {
                      navigate(item.route);
                      setIsNotificationOpen(false);
                    }}
                  >
                    <strong>{item.label}</strong>
                    <span>{item.detail}</span>
                    <small>{item.vehicleId}</small>
                  </button>
                ))
              ) : (
                <div className="fg-header-dropdown-empty">
                  Sem alertas recentes.
                </div>
              )}
            </div>
          ) : null}
        </div>

        <button
          type="button"
          className="fg-home-icon-btn"
          aria-label="Segurança"
          title="Segurança e acesso"
          onClick={() => navigate("/configuracoes")}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect
              x="6"
              y="10"
              width="12"
              height="10"
              rx="2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path
              d="M8.5 10V8a3.5 3.5 0 1 1 7 0v2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            />
          </svg>
        </button>

        <div className="fg-header-menu-wrap">
          <button
            type="button"
            className="fg-home-user-chip-btn"
            aria-label="Perfil"
            title="Perfil"
            aria-expanded={isProfileOpen}
            onClick={() => {
              setIsProfileOpen((value) => !value);
              setIsNotificationOpen(false);
            }}
          >
            <div className="fg-home-user-chip">
              <div className="fg-home-user-avatar">HV</div>
              <div>
                <strong>Harsh Vani</strong>
                <p>Operations Manager</p>
              </div>
            </div>
          </button>

          {isProfileOpen ? (
            <div className="fg-header-dropdown fg-header-profile-dropdown">
              <button
                type="button"
                className="fg-header-dropdown-item"
                onClick={() => {
                  navigate("/motoristas");
                  setIsProfileOpen(false);
                }}
              >
                <strong>Ver perfil</strong>
                <span>Dados do usuário e permissões</span>
              </button>

              <button
                type="button"
                className="fg-header-dropdown-item"
                onClick={() => {
                  navigate("/configuracoes");
                  setIsProfileOpen(false);
                }}
              >
                <strong>Configurações</strong>
                <span>Preferências do sistema</span>
              </button>

              <button
                type="button"
                className="fg-header-dropdown-item is-danger"
                onClick={handleLogout}
              >
                <strong>Sair</strong>
                <span>Encerrar sessão atual</span>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
