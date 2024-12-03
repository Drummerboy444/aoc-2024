const file = Deno.readTextFileSync("days/03/input.txt");

const mulsRegex = /mul\([0-9]{1,3},[0-9]{1,3}\)/gm;

const getMuls = (file: string) => {
  const mulsMatches = file.matchAll(mulsRegex);

  return mulsMatches.toArray().map(([match]) => {
    const [x, y] = match.slice(4, match.length - 1).split(",").map((s) =>
      Number.parseInt(s)
    );
    if (x === undefined || y === undefined) throw new Error();
    return [x, y] as const;
  });
};

const muls = getMuls(file);

const part1 = muls.map(([x, y]) => x * y).reduce((x, y) => x + y, 0);
console.log("Part 1:", part1);

const getEnabledMuls = (file: string) => {
  const enabledBlocks: string[] = [""];
  let enabled = true;

  for (let i = 0; i < file.length; i++) {
    if (file.slice(i, i + 7) === "don't()") {
      enabled = false;
      i += 6;
      continue;
    }

    if (file.slice(i, i + 4) === "do()") {
      if (!enabled) enabledBlocks.push("");
      enabled = true;
      i += 3;
      continue;
    }

    if (!enabled) continue;

    const character = file[i];
    const lastEnabledBlock = enabledBlocks.pop();
    if (character === undefined || lastEnabledBlock === undefined) {
      throw new Error();
    }
    enabledBlocks.push(lastEnabledBlock + character);
  }

  return enabledBlocks.flatMap(getMuls);
};

const part2 = getEnabledMuls(file).map(([x, y]) => x * y).reduce(
  (x, y) => x + y,
  0,
);
console.log("Part 2:", part2);
