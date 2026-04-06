"use client";

import { useState, useEffect, useCallback } from "react";
import LampToggle from "@/components/LampToggle";
import TenseForm from "@/components/TenseForm";
import OutputTenseTable from "@/components/OutputTenseTable";
import { parseTense, type TenseRecord, type TenseFormatted } from "@/types/tense";

type Tab = "new" | "output";

export default function Home() {
  const [tab, setTab] = useState<Tab>("output");
  const [tenses, setTenses] = useState<TenseFormatted[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchTenses = useCallback(async () => {
    try {
      const res = await fetch("/api/tenses", { cache: "no-store" });
      const data: TenseRecord[] = await res.json();
      setTenses(data.map(parseTense));
    } catch {
      console.error("Failed to fetch tenses");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTenses();
  }, [fetchTenses]);

  const handleNewSuccess = () => {
    fetchTenses();
    setTab("output");
  };

  return (
    <div className="app-shell">
      {/* ───── Sidebar ───── */}
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        {/* Sidebar header */}
        <div className="sidebar-header">
          <div className="sidebar-seal">
            <span className="sidebar-seal-text">EG</span>
          </div>
          <div className="sidebar-brand">
            <span className="sidebar-brand-main">Digital Kitab</span>
            <span className="sidebar-brand-sub">English Grammar</span>
          </div>
        </div>

        {/* Ornament divider */}
        <div className="sidebar-divider">
          <div className="sidebar-divider-line" />
          <span className="sidebar-divider-icon">❦</span>
          <div className="sidebar-divider-line" />
        </div>

        {/* Nav */}
        <nav className="sidebar-nav" role="navigation" aria-label="Main navigation">
          <button
            className={`sidebar-item ${tab === "new" ? "sidebar-item-active" : ""}`}
            onClick={() => { setTab("new"); setSidebarOpen(false); }}
            aria-current={tab === "new" ? "page" : undefined}
          >
            <span className="sidebar-item-icon">✦</span>
            <span className="sidebar-item-text">
              <span className="sidebar-item-main">Tense Baru</span>
              <span className="sidebar-item-desc">Tambah entri ke kitab</span>
            </span>
          </button>

          <button
            className={`sidebar-item ${tab === "output" ? "sidebar-item-active" : ""}`}
            onClick={() => { setTab("output"); setSidebarOpen(false); }}
            aria-current={tab === "output" ? "page" : undefined}
          >
            <span className="sidebar-item-icon">📜</span>
            <span className="sidebar-item-text">
              <span className="sidebar-item-main">Output Tense</span>
              <span className="sidebar-item-desc">
                Lihat tabel kitab
                {tenses.length > 0 && (
                  <span className="sidebar-badge">{tenses.length}</span>
                )}
              </span>
            </span>
          </button>
        </nav>

        {/* Sidebar footer */}
        <div className="sidebar-footer">
          <div className="sidebar-divider" style={{ marginBottom: 12 }}>
            <div className="sidebar-divider-line" />
            <span className="sidebar-divider-icon">✿</span>
            <div className="sidebar-divider-line" />
          </div>
          <p className="sidebar-footer-quote">
            <em>&ldquo;In the mastery of tense<br />lieth the mastery of time.&rdquo;</em>
          </p>
          <p className="sidebar-footer-credit">Guild of Grammarians · MMXXVI</p>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ───── Main content ───── */}
      <div className="main-area">
        {/* Top bar */}
        <header className="topbar">
          <button
            className="topbar-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>

          <div className="topbar-title-area">
            <div className="topbar-ornament">❧ ✦ ❧</div>
            <h1 className="topbar-title">
              The Digital Kitab of English Grammar
            </h1>
            <div className="topbar-ornament">❧ ✦ ❧</div>
          </div>

          <div className="topbar-right">
            <LampToggle />
          </div>
        </header>

        {/* Page content */}
        <main className="main-content">
          {/* Decorative top border */}
          <div className="content-ornament-top">
            <div className="content-orn-line" />
            <span className="content-orn-text">✿ ❦ ✿ ❦ ✿</span>
            <div className="content-orn-line" />
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-quill">✒</div>
              <p className="loading-text">Membuka lembar kitab...</p>
            </div>
          ) : tab === "new" ? (
            <TenseForm onSuccess={handleNewSuccess} />
          ) : (
            <OutputTenseTable tenses={tenses} onRefresh={fetchTenses} />
          )}
        </main>

        {/* Footer */}
        <footer className="page-footer">
          <div className="footer-orn-line" />
          <p className="footer-text">
            Finis Coronat Opus &middot; <em>The end crowns the work</em> &middot;{" "}
            Ditulis &amp; dijilid di Scriptorium Digital
          </p>
        </footer>
      </div>
    </div>
  );
}
