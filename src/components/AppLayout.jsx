import { useState } from "react";
import { Sidebar } from "./Sidebar";

export function AppLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <main className="fg-home-page">
      <div className={`fg-home-shell ${isSidebarOpen ? "" : "is-collapsed"}`}>
        <Sidebar
          isOpen={isSidebarOpen}
          onMouseEnter={() => setIsSidebarOpen(true)}
          onMouseLeave={() => setIsSidebarOpen(false)}
        />
        <section className="fg-home-main">{children}</section>
      </div>
    </main>
  );
}
