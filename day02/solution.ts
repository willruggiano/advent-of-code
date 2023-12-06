const input = await Bun.file("input.txt").text();

const limit: Record<string, number> = {
  red: 12,
  green: 13,
  blue: 14,
};

const sum = input
  .split("\n")
  .flatMap((line) => {
    const matches = line.match(/Game (\d+): (.*)/);
    if (!matches) {
      return [];
    }

    const handfuls = matches[2].split(";").map((handful) => {
      const matches = handful.match(/(\d+) (red|green|blue)/g);
      if (!matches) {
        return [];
      }
      return matches.map((match) => {
        const m = match.split(" ");
        return [+m[0], m[1]] as [number, string];
      });
    });

    const max: Record<string, number> = {
      red: 0,
      green: 0,
      blue: 0,
    };
    for (const handful of handfuls) {
      for (const [n, color] of handful) {
        if (n > max[color]) {
          max[color] = n;
        }
      }
    }
    return max.red * max.green * max.blue;
  })
  .reduce((acc, p) => acc + p, 0);

console.log(sum);
