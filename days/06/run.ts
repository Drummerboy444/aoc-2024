type Grid = Record<number, Record<number, "#" | ".">>;
type Direction = "up" | "down" | "left" | "right";
type Coordinate = { x: number; y: number };
type Guard = Coordinate & { direction: Direction };

const parseLines = (lines: string[]): { grid: Grid; guard: Guard } => {
  const grid: Grid = {};
  let guard: Guard | undefined;

  lines.forEach((line, y) => {
    line.split("").forEach((character, x) => {
      if (character !== "." && character !== "#") {
        guard = { x, y, direction: "up" };
        grid[x]![y] = ".";
        return;
      }

      if (x in grid) {
        grid[x]![y] = character;
      } else {
        grid[x] = { [y]: character };
      }
    });
  });

  if (guard === undefined) throw new Error();
  return { grid, guard };
};

const tryGetCell = (grid: Grid, { x, y }: Coordinate) => {
  const col = grid[x];
  if (col === undefined) return undefined;
  return col[y];
};

const trySetCell = (grid: Grid, { x, y }: Coordinate, value: "#" | ".") => {
  const col = grid[x];
  if (col === undefined) return;
  col[y] = value;
};

const rotate90Degrees = (direction: Direction): Direction => {
  return direction === "up"
    ? "right"
    : direction === "right"
    ? "down"
    : direction === "down"
    ? "left"
    : "up";
};

const getNextGuardPosition = (grid: Grid, guard: Guard): Guard | undefined => {
  const nextCoordinate: Coordinate = guard.direction === "up"
    ? { x: guard.x, y: guard.y - 1 }
    : guard.direction === "down"
    ? { x: guard.x, y: guard.y + 1 }
    : guard.direction === "left"
    ? { x: guard.x - 1, y: guard.y }
    : { x: guard.x + 1, y: guard.y };

  const nextCell = tryGetCell(grid, nextCoordinate);

  if (nextCell === undefined) return undefined;

  if (nextCell === ".") {
    return {
      x: nextCoordinate.x,
      y: nextCoordinate.y,
      direction: guard.direction,
    };
  }

  return {
    x: guard.x,
    y: guard.y,
    direction: rotate90Degrees(guard.direction),
  };
};

const getVisitedCells = (grid: Grid, guard: Guard) => {
  const visitedCells = new Set<string>();
  visitedCells.add(`${guard.x},${guard.y}`);
  let guardPosition = guard;

  while (true) {
    const nextGuardPosition = getNextGuardPosition(grid, guardPosition);
    if (nextGuardPosition === undefined) break;
    visitedCells.add(`${nextGuardPosition.x},${nextGuardPosition.y}`);
    guardPosition = nextGuardPosition;
  }

  return visitedCells;
};

const willEnterLoop = (grid: Grid, guard: Guard): boolean => {
  const visitedCells = new Set<string>();
  visitedCells.add(`${guard.x},${guard.y},${guard.direction}`);
  let guardPosition = guard;

  while (true) {
    const nextGuardPosition = getNextGuardPosition(grid, guardPosition);
    if (nextGuardPosition === undefined) return false;
    if (
      visitedCells.has(
        `${nextGuardPosition.x},${nextGuardPosition.y},${nextGuardPosition.direction}`,
      )
    ) return true;
    visitedCells.add(
      `${nextGuardPosition.x},${nextGuardPosition.y},${nextGuardPosition.direction}`,
    );
    guardPosition = nextGuardPosition;
  }
};

const countLoopingObstructions = (grid: Grid, guard: Guard) => {
  let loopingObstructions = 0;
  const gridWidth = Object.entries(grid).length;
  const firstCol = grid[0];
  if (firstCol === undefined) throw new Error();
  const gridHeight = Object.entries(firstCol).length;

  for (let x = 0; x < gridWidth; x++) {
    for (let y = 0; y < gridHeight; y++) {
      if (guard.x === x && guard.y === y) continue;
      if (tryGetCell(grid, { x, y }) === "#") continue;
      trySetCell(grid, { x, y }, "#");
      if (willEnterLoop(grid, guard)) loopingObstructions++;
      trySetCell(grid, { x, y }, ".");
    }
  }

  return loopingObstructions;
};

const lines = Deno.readTextFileSync("days/06/input.txt").split("\n");
const { grid, guard } = parseLines(lines);

const part1 = getVisitedCells(grid, guard).size;
console.log("Part 1:", part1);

const part2 = countLoopingObstructions(grid, guard);
console.log("Part 2:", part2);
