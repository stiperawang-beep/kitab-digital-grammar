"use client";

import { useState, useCallback } from "react";
import type { TenseFormatted } from "@/types/tense";

interface Props {
  initial?: TenseFormatted | null;
  onSuccess: () => void;
  onCancel?: () => void;
}

const PLACEHOLDER_PARTS = ["S", "have/has", "V3"];

export default function TenseForm({ initial, onSuccess, onCancel }: Props) {
  const isEdit = !!initial;

  const [name, setName] = useState(initial?.name ?? "");
  const [purpose, setPurpose] = useState(initial?.purpose ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [parts, setParts] = useState<string[]>(
    initial?.formulaArray?.length ? initial.formulaArray : [""]
  );
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);

  const addPart = () => setParts((p) => [...p, ""]);

  const removePart = (i: number) => {
    if (parts.length <= 1) return;
    setParts((p) => p.filter((_, idx) => idx !== i));
  };

  const updatePart = (i: number, val: string) => {
    setParts((p) => p.map((v, idx) => (idx === i ? val : v)));
  };

  const validate = useCallback(() => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Nama tense wajib diisi";
    if (!purpose.trim()) e.purpose = "Tujuan/fungsi wajib diisi";
    if (parts.filter((p) => p.trim()).length === 0)
      e.parts = "Formula harus memiliki minimal 1 bagian";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [name, purpose, parts]);

  const showToast = (msg: string, type: "ok" | "err") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        purpose: purpose.trim(),
        formulaParts: parts.filter((p) => p.trim()),
        notes: notes.trim() || null,
      };

      const res = await fetch(
        isEdit ? `/api/tenses/${initial!.id}` : "/api/tenses",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Server error");

      showToast(
        isEdit
          ? `"${name}" telah diperbarui! ✦`
          : `"${name}" telah ditambahkan ke Kitab! ✦`,
        "ok"
      );

      if (!isEdit) {
        setName(""); setPurpose(""); setNotes(""); setParts([""]);
      }

      setTimeout(() => onSuccess(), 800);
    } catch {
      showToast("Terjadi kesalahan. Coba lagi.", "err");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="form-wrapper">
      {/* Toast */}
      {toast && (
        <div className={`form-toast ${toast.type === "ok" ? "form-toast-ok" : "form-toast-err"}`}>
          {toast.msg}
        </div>
      )}

      <div className="form-ornament-header">
        <div className="form-ornament-line" />
        <span className="form-ornament-text">✿ ❦ ✿</span>
        <div className="form-ornament-line" />
      </div>

      <h2 className="form-title">
        {isEdit ? "— Revisi Tense —" : "— Tambah Tense Baru —"}
      </h2>

      <form onSubmit={handleSubmit} className="tense-form" noValidate>
        {/* Tense Name */}
        <div className="field-group">
          <label className="field-label" htmlFor="tenseName">
            <span className="field-ornament">❧</span> Nama Tense
          </label>
          <input
            id="tenseName"
            type="text"
            className={`field-input ${errors.name ? "field-error" : ""}`}
            placeholder="e.g. Present Perfect"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
            required
          />
          {errors.name && <p className="error-msg">{errors.name}</p>}
        </div>

        {/* Purpose */}
        <div className="field-group">
          <label className="field-label" htmlFor="tensePurpose">
            <span className="field-ornament">❧</span> Tujuan / Fungsi
          </label>
          <textarea
            id="tensePurpose"
            className={`field-textarea ${errors.purpose ? "field-error" : ""}`}
            placeholder="e.g. Menyatakan aksi yang telah selesai pada waktu yang tidak ditentukan..."
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            rows={3}
            maxLength={400}
            required
          />
          {errors.purpose && <p className="error-msg">{errors.purpose}</p>}
        </div>

        {/* Formula — Dynamic Parts */}
        <div className="field-group">
          <div className="field-label">
            <span className="field-ornament">❧</span> Formula
            <span className="field-hint"> (akan digabung dengan " + ")</span>
          </div>

          <div className="formula-list">
            {parts.map((part, i) => (
              <div key={i} className="formula-row">
                {i > 0 && <span className="formula-sep">+</span>}
                <span className="formula-idx">{i === 0 ? "S" : i + 1}</span>
                <input
                  type="text"
                  className="formula-input"
                  value={part}
                  onChange={(e) => updatePart(i, e.target.value)}
                  placeholder={PLACEHOLDER_PARTS[i] ?? `Bagian ${i + 1}`}
                  maxLength={60}
                  aria-label={`Formula bagian ${i + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removePart(i)}
                  disabled={parts.length <= 1}
                  className="formula-remove-btn"
                  aria-label="Hapus bagian"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addPart}
            className="formula-add-btn"
            disabled={parts.length >= 8}
          >
            <span>+</span> Tambah Bagian
          </button>

          {errors.parts && <p className="error-msg">{errors.parts}</p>}

          {/* Formula Preview */}
          {parts.some((p) => p.trim()) && (
            <div className="formula-preview">
              <span className="formula-preview-label">Preview: </span>
              <span className="formula-preview-value">
                {parts.filter((p) => p.trim()).join(" + ")}
              </span>
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="field-group">
          <label className="field-label" htmlFor="tenseNotes">
            <span className="field-ornament">❧</span> Catatan &amp; Contoh
            <span className="field-hint"> (opsional)</span>
          </label>
          <textarea
            id="tenseNotes"
            className="field-textarea"
            placeholder="e.g. I have visited Paris. She has already eaten."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            maxLength={600}
          />
        </div>

        {/* Actions */}
        <div className="form-actions">
          {onCancel && (
            <button type="button" onClick={onCancel} className="btn-secondary">
              Batal
            </button>
          )}
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? (
              <span className="btn-loading">⏳ Menyimpan...</span>
            ) : isEdit ? (
              <>✦ Simpan Revisi</>
            ) : (
              <>✦ Tulis ke Kitab</>
            )}
          </button>
        </div>
      </form>

      <div className="form-ornament-footer">
        <div className="form-ornament-line" />
        <span className="form-ornament-text">✾ ❧ ✾</span>
        <div className="form-ornament-line" />
      </div>
    </div>
  );
}
