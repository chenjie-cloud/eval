export function byId<T extends HTMLElement>(doc: Document, id: string) {
  const el = doc.getElementById(id);
  if (!el) throw new Error(`Missing element: #${id}`);
  return el as T;
}

