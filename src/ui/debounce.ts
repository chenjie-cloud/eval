export function debounce<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void | Promise<void>,
  waitMs: number,
) {
  let t: number | undefined;
  return (...args: TArgs) => {
    if (t) window.clearTimeout(t);
    t = window.setTimeout(() => fn(...args), waitMs);
  };
}

