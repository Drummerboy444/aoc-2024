type Grid = Record<number, Record<number, number>>;
type Coordinate = { i: number; j: number };

const tryGetCell = (grid: Grid, { i, j }: Coordinate) => {
  const col = grid[i];
  if (col === undefined) return undefined;
  return col[j];
};

const getTopographicMap = (lines: string[]): Grid => {
  const topographicMap: Grid = {};

  lines.forEach((line, j) => {
    line.split("").forEach((character, i) => {
      if (topographicMap[i] === undefined) topographicMap[i] = {};
      topographicMap[i][j] = Number(character);
    });
  });

  return topographicMap;
};

const getTrails = (currentPath: Coordinate[], map: Grid): Coordinate[][] => {
  const currentPosition = currentPath[currentPath.length - 1];
  if (currentPosition === undefined) throw new Error();

  const currentPositionHeight = tryGetCell(map, currentPosition);
  if (currentPositionHeight === undefined) throw new Error();

  if (currentPositionHeight === 9) return [currentPath];

  const adjacentCells: Coordinate[] = [
    { i: currentPosition.i - 1, j: currentPosition.j },
    { i: currentPosition.i + 1, j: currentPosition.j },
    { i: currentPosition.i, j: currentPosition.j - 1 },
    { i: currentPosition.i, j: currentPosition.j + 1 },
  ];

  return adjacentCells.filter((cell) =>
    tryGetCell(map, cell) === currentPositionHeight + 1
  ).flatMap((cell) => getTrails([...currentPath, cell], map));
};

const lines = Deno.readTextFileSync("days/10/input.txt").split("\n");
const maxI = lines[0]!.length - 1;
const maxJ = lines.length - 1;

const map = getTopographicMap(lines);

const startingPoints: Coordinate[] = [];
for (let i = 0; i <= maxI; i++) {
  for (let j = 0; j <= maxJ; j++) {
    const cell = tryGetCell(map, { i, j });
    if (cell === undefined) throw new Error();
    if (cell === 0) startingPoints.push({ i, j });
  }
}

const part1 = startingPoints.map((startingPoint) =>
  getTrails([startingPoint], map)
).map((trails) => {
  const endPoints = trails.map((trail) => {
    const endPoint = trail[trail.length - 1];
    if (endPoint === undefined) throw new Error();
    return endPoint;
  });
  return new Set(endPoints.map(({ i, j }) => `${i},${j}`)).size;
}).reduce((a, b) => a + b, 0);
console.log("Part 1:", part1);

const part2 = startingPoints.map((startingPoint) =>
  getTrails([startingPoint], map)
).map((trails) => {
  return trails.length;
}).reduce((a, b) => a + b, 0);
console.log("Part 2:", part2);
