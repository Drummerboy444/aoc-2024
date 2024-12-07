const parseLine = (line: string) => {
  const [stringTotal, stringTerms] = line.split(": ");
  if (stringTotal === undefined || stringTerms === undefined) throw new Error();
  const total = Number(stringTotal);
  const terms = stringTerms.split(" ").map((stringTerm) => Number(stringTerm));
  return { total, terms };
};

const getPossibleTotals = (
  currentTotal: number,
  terms: number[],
  operations: ((a: number, b: number) => number)[],
): number[] => {
  const [nextTerm, ...remainingTerms] = terms;
  if (nextTerm === undefined) return [currentTotal];

  return operations.flatMap((operation) =>
    getPossibleTotals(
      operation(currentTotal, nextTerm),
      remainingTerms,
      operations,
    )
  );
};

const solve = (
  lines: string[],
  operations: ((a: number, b: number) => number)[],
) =>
  lines.map(parseLine).filter(({ total, terms }) =>
    getPossibleTotals(0, terms, operations).includes(total)
  ).reduce((currentTotal, { total: thisTotal }) => currentTotal + thisTotal, 0);

const add = (a: number, b: number) => a + b;
const multiply = (a: number, b: number) => a * b;
const concatenate = (a: number, b: number) => Number(`${a}${b}`);

const lines = Deno.readTextFileSync("days/07/input.txt").split("\n");

const part1 = solve(lines, [add, multiply]);
console.log("Part 1:", part1);
const part2 = solve(lines, [add, multiply, concatenate]);
console.log("Part 2:", part2);
