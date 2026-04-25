import "../styles/dashboard.css";
import { useMemo, useState } from "react";
import { AppLayout } from "../components/AppLayout";
import { AppHeader } from "../components/AppHeader";
import { AppIcon } from "../components/AppIcon";

const driversSeed = [
  {
    id: "D-001",
    name: "Raj Kumar",
    role: "Motorista Sênior",
    email: "raj.kumar@smartfrota.com",
    phone: "+55 11 98444-1122",
    cnh: "05498233411",
    category: "E",
    status: "Em rota",
    vehicle: "V-1023 • Volvo FH 460",
    initials: "RK",
    avatarTone: "blue",
  },
  {
    id: "D-002",
    name: "Suresh Mehta",
    role: "Motorista",
    email: "suresh.mehta@smartfrota.com",
    phone: "+55 11 97711-2211",
    cnh: "06233492874",
    category: "D",
    status: "Em rota",
    vehicle: "V-1048 • Mercedes Atego",
    initials: "SM",
    avatarTone: "green",
  },
  {
    id: "D-003",
    name: "Arjun Patil",
    role: "Motorista Sênior",
    email: "arjun.patil@smartfrota.com",
    phone: "+55 11 96622-3311",
    cnh: "07122839410",
    category: "E",
    status: "Afastado",
    vehicle: "Sem veículo",
    initials: "AP",
    avatarTone: "red",
  },
  {
    id: "D-004",
    name: "Vikram Singh",
    role: "Motorista",
    email: "vikram.singh@smartfrota.com",
    phone: "+55 11 98892-1145",
    cnh: "05811389200",
    category: "D",
    status: "Disponível",
    vehicle: "V-1184 • Scania P360",
    initials: "VS",
    avatarTone: "purple",
  },
  {
    id: "D-005",
    name: "Priya Tiwari",
    role: "Motorista",
    email: "priya.tiwari@smartfrota.com",
    phone: "+55 11 93444-9081",
    cnh: "04770019824",
    category: "C",
    status: "Disponível",
    vehicle: "V-1210 • Ford Cargo 2429",
    initials: "PT",
    avatarTone: "amber",
  },
  {
    id: "D-006",
    name: "Ankit Das",
    role: "Motorista Sênior",
    email: "ankit.das@smartfrota.com",
    phone: "+55 11 94421-1073",
    cnh: "06900112457",
    category: "E",
    status: "Em rota",
    vehicle: "V-1261 • MAN TGX 28.440",
    initials: "AD",
    avatarTone: "blue",
  },
  {
    id: "D-007",
    name: "Laura Martins",
    role: "Motorista",
    email: "laura.martins@smartfrota.com",
    phone: "+55 11 95770-1110",
    cnh: "04355110998",
    category: "D",
    status: "Em rota",
    vehicle: "V-1236 • Volvo VM 330",
    initials: "LM",
    avatarTone: "green",
  },
  {
    id: "D-008",
    name: "Deepak Nair",
    role: "Motorista",
    email: "deepak.nair@smartfrota.com",
    phone: "+55 11 96501-7712",
    cnh: "07620110357",
    category: "E",
    status: "Em rota",
    vehicle: "V-1091 • Volkswagen Delivery",
    initials: "DN",
    avatarTone: "amber",
  },
];

const filterKeys = ["Todos", "Em rota", "Disponível", "Afastado"];

function statusClass(status) {
  if (status === "Em rota") {
    return "fg-drivers-badge-green";
  }

  if (status === "Disponível") {
    return "fg-drivers-badge-amber";
  }

  if (status === "Afastado") {
    return "fg-drivers-badge-red";
  }

  return "fg-drivers-badge-gray";
}

export function DriversPage() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [viewMode, setViewMode] = useState("table");

  const counters = useMemo(() => {
    const total = driversSeed.length;
    const emRota = driversSeed.filter(
      (driver) => driver.status === "Em rota",
    ).length;
    const disponivel = driversSeed.filter(
      (driver) => driver.status === "Disponível",
    ).length;
    const afastado = driversSeed.filter(
      (driver) => driver.status === "Afastado",
    ).length;

    return {
      Todos: total,
      "Em rota": emRota,
      Disponível: disponivel,
      Afastado: afastado,
    };
  }, []);

  const filteredDrivers = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return driversSeed.filter((driver) => {
      const matchFilter =
        activeFilter === "Todos" || driver.status === activeFilter;

      const matchQuery =
        normalized.length === 0 ||
        [driver.name, driver.email, driver.phone, driver.cnh, driver.vehicle]
          .join(" ")
          .toLowerCase()
          .includes(normalized);

      return matchFilter && matchQuery;
    });
  }, [activeFilter, query]);

  return (
    <AppLayout>
      <AppHeader />

      <div className="fg-home-content fg-drivers-content">
        <section className="fg-drivers-page-top">
          <div>
            <h3>Gestão de Motoristas</h3>
            <p>Visualize, cadastre e gerencie os motoristas da sua frota</p>
          </div>

          <button type="button" className="fg-home-new-btn">
            <span>+</span> Adicionar Motorista
          </button>
        </section>

        <section className="fg-drivers-kpi-strip">
          <article className="fg-drivers-kpi-card">
            <span className="fg-drivers-kpi-icon is-blue">
              <AppIcon type="users" />
            </span>
            <div>
              <strong>{counters.Todos}</strong>
              <small>Total de motoristas</small>
            </div>
          </article>

          <article className="fg-drivers-kpi-card">
            <span className="fg-drivers-kpi-icon is-green">
              <AppIcon type="pin" />
            </span>
            <div>
              <strong>{counters["Em rota"]}</strong>
              <small>Em rota</small>
            </div>
          </article>

          <article className="fg-drivers-kpi-card">
            <span className="fg-drivers-kpi-icon is-amber">
              <AppIcon type="clock" />
            </span>
            <div>
              <strong>{counters["Disponível"]}</strong>
              <small>Disponíveis</small>
            </div>
          </article>

          <article className="fg-drivers-kpi-card">
            <span className="fg-drivers-kpi-icon is-red">
              <AppIcon type="doc" />
            </span>
            <div>
              <strong>{counters.Afastado}</strong>
              <small>Afastados</small>
            </div>
          </article>
        </section>

        <section className="fg-drivers-toolbar-wrap">
          <div className="fg-drivers-toolbar-left">
            {filterKeys.map((key) => (
              <button
                key={key}
                type="button"
                className={activeFilter === key ? "is-active" : ""}
                onClick={() => setActiveFilter(key)}
              >
                <span>{key}</span>
                <em>{counters[key]}</em>
              </button>
            ))}
          </div>

          <div className="fg-drivers-toolbar-right">
            <div className="fg-drivers-search-wrap">
              <span aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="6" />
                  <path d="M16 16l4 4" />
                </svg>
              </span>
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar por nome, email, telefone ou CNH"
              />
            </div>

            <div className="fg-drivers-view-switch">
              <button
                type="button"
                className={viewMode === "table" ? "is-active" : ""}
                onClick={() => setViewMode("table")}
                aria-label="Visualização tabela"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 6h2v2H4zM8 6h12v2H8zM4 11h2v2H4zM8 11h12v2H8zM4 16h2v2H4zM8 16h12v2H8z" />
                </svg>
              </button>

              <button
                type="button"
                className={viewMode === "cards" ? "is-active" : ""}
                onClick={() => setViewMode("cards")}
                aria-label="Visualização cards"
              >
                <AppIcon type="grid" />
              </button>
            </div>
          </div>
        </section>

        {viewMode === "table" ? (
          <section className="fg-drivers-table-card">
            <div className="fg-drivers-table-wrap">
              <table className="fg-drivers-table">
                <thead>
                  <tr>
                    <th>Motorista</th>
                    <th>Email</th>
                    <th>Telefone</th>
                    <th>CNH</th>
                    <th>Categoria</th>
                    <th>Status</th>
                    <th>Veículo</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredDrivers.map((driver) => (
                    <tr key={driver.id}>
                      <td>
                        <div className="fg-driver-cell">
                          <span
                            className={`fg-driver-avatar is-${driver.avatarTone}`}
                          >
                            {driver.initials}
                          </span>
                          <div>
                            <strong>{driver.name}</strong>
                            <small>{driver.role}</small>
                          </div>
                        </div>
                      </td>
                      <td>{driver.email}</td>
                      <td>{driver.phone}</td>
                      <td>
                        <span className="fg-driver-cnh">{driver.cnh}</span>
                      </td>
                      <td>
                        <span className="fg-driver-category">
                          {driver.category}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`fg-driver-status ${statusClass(driver.status)}`}
                        >
                          {driver.status}
                        </span>
                      </td>
                      <td>{driver.vehicle}</td>
                      <td>
                        <div className="fg-driver-actions">
                          <button
                            type="button"
                            aria-label={`Editar ${driver.name}`}
                          >
                            ✎
                          </button>
                          <button
                            type="button"
                            aria-label={`Remover ${driver.name}`}
                          >
                            ×
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredDrivers.length === 0 ? (
                <div className="fg-drivers-empty">
                  Nenhum motorista encontrado.
                </div>
              ) : null}
            </div>
          </section>
        ) : (
          <section className="fg-drivers-cards-grid">
            {filteredDrivers.map((driver) => (
              <article key={driver.id} className="fg-driver-card">
                <div className="fg-driver-card-head">
                  <span className={`fg-driver-avatar is-${driver.avatarTone}`}>
                    {driver.initials}
                  </span>
                  <div>
                    <h4>{driver.name}</h4>
                    <p>{driver.role}</p>
                  </div>
                </div>

                <div className="fg-driver-card-rows">
                  <div>
                    <small>Email</small>
                    <strong>{driver.email}</strong>
                  </div>
                  <div>
                    <small>Telefone</small>
                    <strong>{driver.phone}</strong>
                  </div>
                  <div>
                    <small>Veículo</small>
                    <strong>{driver.vehicle}</strong>
                  </div>
                </div>

                <div className="fg-driver-card-foot">
                  <span
                    className={`fg-driver-status ${statusClass(driver.status)}`}
                  >
                    {driver.status}
                  </span>
                  <span className="fg-driver-cnh">CNH {driver.cnh}</span>
                </div>
              </article>
            ))}

            {filteredDrivers.length === 0 ? (
              <div className="fg-drivers-empty">
                Nenhum motorista encontrado.
              </div>
            ) : null}
          </section>
        )}
      </div>
    </AppLayout>
  );
}
