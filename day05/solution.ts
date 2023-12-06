type K =
  | "seed-to-soil"
  | "soil-to-fertilizer"
  | "fertilizer-to-water"
  | "water-to-light"
  | "light-to-temperature"
  | "temperature-to-humidity"
  | "humidity-to-location";

class RangeMap {
  #m = new Map<number, [number, number]>();

  public set(ss: number, ds: number, rl: number) {
    this.#m.set(ss, [ds, rl]);
  }

  // Given a source range, get the destination range(s).
  // A source range might span multiple destination ranges.
  public get([s, l]: [number, number]): [number, number][] {
    // HACK!
    if (l <= 0) return [];

    for (const ss of [...this.#m.keys()].sort((a, b) => a - b)) {
      // 60 56 37: ss =: 56 ds =: 60, rl =: 37
      // biome-ignore lint/style/noNonNullAssertion: we knows it
      const [ds, rl] = this.#m.get(ss)!;
      const se = ss + rl; // exclusive
      if (s < ss) {
        const n = ss - s;
        if (n <= l) {
          return [[s, n]];
        }
        return [[s, l - (ss - s)], ...this.get([ss, l - (ss - s)])];
      }
      if (s >= se) continue;

      return [[ds + (s - ss), s - ss], ...this.get([se, l - (s - ss)])];
    }

    // By definition we must return an identity mapping.
    return [[s, l]];
  }
}

const input = await Bun.file("input.example.txt").text();
const seeds: [number, number][] = [];
const sections = input
  .split("\n\n")
  .map((v) => v.split(/\n|:\s/g).filter((v) => v.length > 0))
  .reduce((acc, v) => {
    const [s, ...ranges] = v as ["seeds" | K, ...string[]];

    if (s === "seeds") {
      let i = 0;
      const seed_ranges = ranges[0].split(" ").map(Number);
      for (const v of seed_ranges) {
        if (i++ % 2 === 0) {
          seeds.push([v, seed_ranges[i]]);
        }
      }
      return acc;
    }

    const k = s.replace(" map", "") as K;
    if (!acc.has(k)) {
      acc.set(k, new RangeMap());
    }
    // biome-ignore lint/style/noNonNullAssertion: see above
    const m = acc.get(k)!;
    for (const r of ranges) {
      const [ds, ss, rl] = r.split(" ").map(Number);
      m.set(ss, ds, rl);
    }
    return acc;
  }, new Map<Exclude<K, "seeds">, RangeMap>());

// biome-ignore lint/style/noNonNullAssertion: we knows it
const s2s = sections.get("seed-to-soil")!;
// biome-ignore lint/style/noNonNullAssertion: we knows it
const s2f = sections.get("soil-to-fertilizer")!;
// biome-ignore lint/style/noNonNullAssertion: we knows it
const f2w = sections.get("fertilizer-to-water")!;
// biome-ignore lint/style/noNonNullAssertion: we knows it
const w2l = sections.get("water-to-light")!;
// biome-ignore lint/style/noNonNullAssertion: we knows it
const l2t = sections.get("light-to-temperature")!;
// biome-ignore lint/style/noNonNullAssertion: we knows it
const t2h = sections.get("temperature-to-humidity")!;
// biome-ignore lint/style/noNonNullAssertion: we knows it
const h2l = sections.get("humidity-to-location")!;

// Part 1: Lowest location number corresponding to any of the initial seeds.
let lowest = Number.MAX_SAFE_INTEGER;
for (const seed of seeds) {
  const soil = s2s.get(seed);
  const fert = soil.flatMap((v) => s2f.get(v));
  const water = fert.flatMap((v) => f2w.get(v));
  const light = water.flatMap((v) => w2l.get(v));
  const temp = light.flatMap((v) => l2t.get(v));
  const humid = temp.flatMap((v) => t2h.get(v));
  const loc = humid.flatMap((v) => h2l.get(v)).sort((a, b) => a[0] - b[0]);
  const min_loc = loc[0][0];
  if (min_loc < lowest) {
    lowest = min_loc;
  }
}
console.log(lowest);
