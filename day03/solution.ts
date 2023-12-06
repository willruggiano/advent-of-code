const uuid = () => crypto.randomUUID();
const input = await Bun.file("input.txt")
  .text()
  .then((t) => t.split("\n"));

const Empty = Symbol(".");
type Empty = typeof Empty;

type Cell =
  | {
      id: string;
      row: number;
      col: number;
      type: "n";
      val: number;
    }
  | {
      id: string;
      row: number;
      col: number;
      type: ".";
      val: Empty;
    }
  | {
      id: string;
      row: number;
      col: number;
      type: "s";
      val: string;
    };

const schematic = new Array<Cell>();
let row = 0;
for (const line of input) {
  if (line.length === 0) {
    continue;
  }

  let col = 0;
  const matches = line.match(/(\d+|\.|[^0-9\.])/g) ?? [];
  for (const m of matches) {
    const id = uuid();
    if (m === ".") {
      schematic.push({ id, row, col: col++, type: m, val: Empty });
      continue;
    }

    if (Number.isNaN(+m)) {
      schematic.push({ id, row, col: col++, type: "s", val: m });
      continue;
    }

    for (const _ of Array(m.length).keys()) {
      schematic.push({ id, row, col: col++, type: "n", val: +m });
    }
    // col += m.length
  }

  ++row;
}

const n = input[0].length;
const s = new Set<string>();
let sum = 0;
for (const { type, col, row, val } of schematic) {
  if (type === "s" && val === "*") {
    const ds = [];
    if (col > 0) {
      // west
      ds.push([row, col - 1]);
      if (row > 0) {
        // northwest
        ds.push([row - 1, col - 1]);
      }
      // southwest
      ds.push([row + 1, col - 1]);
    }
    if (col < n) {
      // east
      ds.push([row, col + 1]);
      if (row > 0) {
        // northeast
        ds.push([row - 1, col + 1]);
      }
      // southeast
      ds.push([row + 1, col + 1]);
    }
    if (row > 0) {
      // north
      ds.push([row - 1, col]);
    }
    // south
    ds.push([row + 1, col]);

    const neighbors = ds.flatMap((d) => {
      const neighbor = schematic.at(d[0] * n + d[1]);
      if (neighbor && neighbor.type === "n" && !s.has(neighbor.id)) {
        s.add(neighbor.id);
        return [neighbor];
      }

      return [];
    });

    if (neighbors.length === 2) {
      sum += neighbors[0].val * neighbors[1].val;
    }
  }
}

console.log(sum);
