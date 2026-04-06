"use client";

import { useState } from "react";
import type { TenseFormatted } from "@/types/tense";
import TenseForm from "./TenseForm";

interface Props {
  tenses: TenseFormatted[];
  onRefresh: () => void;
}

export default function OutputTenseTable({ tenses, onRefresh }: Props) {
  const [editItem, setEditItem] = useState<TenseFormatted | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState<string>("");
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);

  const showToast = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/tenses/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showToast(`"${deleteName}" telah dihapus dari Kitab.`, "ok");
      setDeleteId(null);
      onRefresh();
    } catch {
      showToast("Gagal menghapus. Coba lagi.", "err");
    } finally {
      setDeleting(false);
    }
  };

  // ── Edit overlay ──
  if (editItem) {
    return (
      <div className="edit-overlay">
        <TenseForm
          initial={editItem}
          onSuccess={() => { setEditItem(null); onRefresh(); }}
          onCancel={() => setEditItem(null)}
        />
      </div>
    );
  }

  return (
    <div className="output-wrapper">
      {/* Toast */}
      {toast && (
        <div className={`form-toast ${toast.type === "ok" ? "form-toast-ok" : "form-toast-err"}`}>
          {toast.msg}
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteId && (
        <div className="modal-backdrop" role="alertdialog" aria-modal="true">
          <div className="modal-box">
            <div className="modal-ornament">✿ ❦ ✿</div>
            <h3 className="modal-title">Konfirmasi Penghapusan</h3>
            <p className="modal-body">
              Yakin ingin menghapus <strong>&ldquo;{deleteName}&rdquo;</strong> dari kitab ini?
            </p>
            <p className="modal-warn"><em>Tindakan ini tidak dapat dibatalkan.</em></p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setDeleteId(null)}>
                Batalkan
              </button>
              <button
                className="btn-danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Menghapus..." : "✕ Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="output-header">
        <div className="output-ornament-line" />
        <h2 className="output-title">
          Bab I — Kompendium Tense Bahasa Inggris
        </h2>
        <p className="output-subtitle">
          <em>
            &ldquo;Himpunan lengkap seluruh kaidah tense beserta fungsi, formula, dan
            contoh penggunaannya.&rdquo;
          </em>
        </p>
        <div className="output-ornament-line" />
      </div>

      {/* Empty state */}
      {tenses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-quill">✒</div>
          <p className="empty-title">Perkamen Masih Kosong</p>
          <p className="empty-sub">
            Belum ada tense yang dituliskan. Pilih{" "}
            <strong>&ldquo;Tense Baru&rdquo;</strong> di sidebar untuk mulai.
          </p>
        </div>
      ) : (
        <div className="table-scroll-wrap">
          <table className="kitab-table" role="grid" aria-label="Tabel Tense Bahasa Inggris">
            <thead>
              <tr>
                <th className="th-num">§</th>
                <th className="th-name">Nama Tense</th>
                <th className="th-purpose">Tujuan / Fungsi</th>
                <th className="th-formula">Formula</th>
                <th className="th-notes">Catatan &amp; Contoh</th>
                <th className="th-actions">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {tenses.map((item, idx) => (
                <tr key={item.id} className="kitab-row">
                  <td className="td-num">{idx + 1}</td>
                  <td className="td-name">{item.name}</td>
                  <td className="td-purpose">{item.purpose}</td>
                  <td className="td-formula">
                    {item.formulaArray.map((part, pi) => (
                      <span key={pi}>
                        {pi > 0 && <span className="formula-plus"> + </span>}
                        <span className="formula-word">{part}</span>
                      </span>
                    ))}
                  </td>
                  <td className="td-notes">
                    {item.notes
                      ? item.notes.split("\n").map((line, li) => (
                          <span key={li}>
                            {line}
                            {li < (item.notes?.split("\n").length ?? 1) - 1 && <br />}
                          </span>
                        ))
                      : <span className="td-empty">—</span>}
                  </td>
                  <td className="td-actions">
                    <button
                      className="action-btn action-edit"
                      onClick={() => setEditItem(item)}
                      aria-label={`Edit ${item.name}`}
                    >
                      ✎ Revisi
                    </button>
                    <button
                      className="action-btn action-delete"
                      onClick={() => { setDeleteId(item.id); setDeleteName(item.name); }}
                      aria-label={`Hapus ${item.name}`}
                    >
                      ✕ Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer count */}
      <div className="output-footer">
        <span className="footer-ornament">✦ ✦ ✦</span>
        <span className="footer-count">
          {tenses.length === 0
            ? "Belum ada entri"
            : `${tenses.length} tense tercatat dalam kitab ini`}
        </span>
        <span className="footer-ornament">✦ ✦ ✦</span>
      </div>
    </div>
  );
}
