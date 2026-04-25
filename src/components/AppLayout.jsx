import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";

export function AppLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    () => window.innerWidth > 900,
  );
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 900);

  useEffect(() => {
    function syncViewportMode() {
      const mobileView = window.innerWidth <= 900;
      setIsMobile(mobileView);
      setIsSidebarOpen(!mobileView);
    }

    syncViewportMode();
    window.addEventListener("resize", syncViewportMode);
    return () => window.removeEventListener("resize", syncViewportMode);
  }, []);

  useEffect(() => {
    function handleOpenSidebar() {
      if (window.innerWidth <= 900) {
        setIsSidebarOpen(true);
      }
    }

    window.addEventListener("smart-frota:open-sidebar", handleOpenSidebar);
    return () =>
      window.removeEventListener(
        "smart-frota:open-sidebar",
        handleOpenSidebar,
      );
  }, []);

  function openDrawer() {
    if (isMobile) {
      setIsSidebarOpen(true);
    }
  }

  function closeDrawer() {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }

  return (
    <main className="fg-home-page">
      <div
        className={`fg-home-shell ${isSidebarOpen ? "" : "is-collapsed"} ${isMobile ? "is-mobile" : ""}`}
      >
        {isMobile && isSidebarOpen ? (
          <button
            type="button"
            className="fg-mobile-drawer-overlay"
            aria-label="Fechar menu"
            onClick={closeDrawer}
          />
        ) : null}

        <Sidebar
          isOpen={isSidebarOpen}
          isMobile={isMobile}
          onMouseEnter={
            isMobile ? undefined : () => setIsSidebarOpen(true)
          }
          onMouseLeave={
            isMobile ? undefined : () => setIsSidebarOpen(false)
          }
          onClose={closeDrawer}
        />

        <section className="fg-home-main">
          {typeof children === "function"
            ? children({ isMobile, isSidebarOpen, openDrawer, closeDrawer })
            : children}
        </section>
      </div>
    </main>
  );
}
