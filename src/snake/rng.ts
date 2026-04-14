export type Rng = Readonly<{
  nextInt: (maxExclusive: number) => number;
}>;

export function createDefaultRng(): Rng {
  return {
    nextInt(maxExclusive) {
      if (maxExclusive <= 0) return 0;
      if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
        const buf = new Uint32Array(1);
        crypto.getRandomValues(buf);
        return buf[0] % maxExclusive;
      }
      return Math.floor(Math.random() * maxExclusive);
    }
  };
}

