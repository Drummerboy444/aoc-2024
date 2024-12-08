type Coordinate = { i: number; j: number };
type Antenna = Coordinate & { frequency: string };

const getAntennas = (lines: string[]) =>
  lines.flatMap((line, j) =>
    line.split("").map((character, i) => ({ i, j, character }))
  ).reduce<Antenna[]>(
    (previous, { i, j, character }) => {
      if (character !== ".") previous.push({ i, j, frequency: character });
      return previous;
    },
    [],
  );

const getImmediateAntiNodes = (
  { i: i1, j: j1 }: Coordinate,
  { i: i2, j: j2 }: Coordinate,
): Coordinate[] => {
  const iDiff = i2 - i1;
  const jDiff = j2 - j1;
  return [{ i: i1 - iDiff, j: j1 - jDiff }, { i: i2 + iDiff, j: j2 + jDiff }];
};

const getHarmonicAntiNodes = (
  maxI: number,
  maxJ: number,
) =>
(
  { i: i1, j: j1 }: Coordinate,
  { i: i2, j: j2 }: Coordinate,
): Coordinate[] => {
  const iDiff = i2 - i1;
  const jDiff = j2 - j1;

  const antiNodes: Coordinate[] = [];
  const max = Math.max(maxI, maxJ);

  for (let i = -max; i <= max; i++) {
    antiNodes.push({
      i: i1 - (i * iDiff),
      j: j1 - (i * jDiff),
    });
  }

  return antiNodes;
};

const getAllAntiNodes = (
  antennas: Antenna[],
  getAntiNodes: (c1: Coordinate, c2: Coordinate) => Coordinate[],
): Coordinate[] => {
  const allAntiNodes: Coordinate[] = [];

  antennas.forEach((antenna, i) => {
    const otherAntennas = antennas.slice(i + 1).filter((otherAntenna) =>
      otherAntenna.frequency === antenna.frequency
    );
    allAntiNodes.push(
      ...otherAntennas.flatMap((otherAntenna) =>
        getAntiNodes(antenna, otherAntenna)
      ),
    );
  });

  return allAntiNodes;
};

const countAllUniqueAntiNodes = (
  antennas: Antenna[],
  getAntiNodes: (c1: Coordinate, c2: Coordinate) => Coordinate[],
) =>
  new Set(
    getAllAntiNodes(antennas, getAntiNodes).filter(({ i, j }) =>
      i >= 0 && i <= maxI && j >= 0 && j <= maxJ
    ).map(({ i, j }) => `${i},${j}`),
  ).size;

const lines = Deno.readTextFileSync("days/08/input.txt").split("\n");
const maxI = lines[0]!.length - 1;
const maxJ = lines.length - 1;
const antennas = getAntennas(lines);

const part1 = countAllUniqueAntiNodes(antennas, getImmediateAntiNodes);
console.log("Part 1:", part1);

const part2 = countAllUniqueAntiNodes(
  antennas,
  getHarmonicAntiNodes(maxI, maxJ),
);
console.log("Part 2:", part2);
