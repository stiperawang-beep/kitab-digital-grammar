// Shared TypeScript types across the app

export interface TenseRecord {
  id: string;
  name: string;
  purpose: string;
  formulaParts: string; // JSON string of string[] from DB
  notes: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface TenseFormatted extends Omit<TenseRecord, "formulaParts"> {
  formulaArray: string[];
}

export function parseTense(t: TenseRecord): TenseFormatted {
  return {
    ...t,
    formulaArray: (() => {
      try {
        return JSON.parse(t.formulaParts) as string[];
      } catch {
        return [t.formulaParts];
      }
    })(),
  };
}
