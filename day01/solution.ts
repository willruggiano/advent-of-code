const input = await Bun.file("input.txt").text();

const p = /(\d|one|two|three|four|five|six|seven|eight|nine)/g;
const m: Record<string, number> = {
  "1": 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

const sum = input.split("\n").reduce((acc, line) => {
  let r: RegExpExecArray | null = null;
  const matches = [];
  // biome-ignore lint/suspicious/noAssignInExpressions: we know
  while ((r = p.exec(line))) {
    matches.push(r[0]);
    p.lastIndex = r.index + 1;
  }
  if (matches.length === 0) {
    return acc;
  }
  return acc + m[matches[0]] * 10 + m[matches[matches.length - 1]];
}, 0);

console.log(sum);
