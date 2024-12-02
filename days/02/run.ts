const lines = Deno.readTextFileSync("days/02/input.txt").split("\n");

const reports = lines.map((line) =>
  line.split(" ").map((s) => Number.parseInt(s))
);

const getReportDifferences = (report: number[]): number[] =>
  report.reduce<number[]>((differences, thisLevel, i) => {
    const nextLevel = report[i + 1];
    return nextLevel === undefined
      ? differences
      : [...differences, nextLevel - thisLevel];
  }, []);

const isReportSafe = (report: number[]): boolean => {
  const differences = getReportDifferences(report);
  const isSafelyIncreasing = differences.every((d) => d >= 1 && d <= 3);
  const isSafelyDecreasing = differences.every((d) => d >= -3 && d <= -1);
  return isSafelyIncreasing || isSafelyDecreasing;
};

const part1 = reports.filter(isReportSafe).length;
console.log("Part 1:", part1);

const applyDampener = (report: number[], levelToRemove: number): number[] =>
  report.filter((_, i) => i !== levelToRemove);

const isReportSafeWithDampener = (report: number[]): boolean =>
  isReportSafe(report) ||
  report.some((_, i) => isReportSafe(applyDampener(report, i)));

const part2 = reports.filter(isReportSafeWithDampener).length;
console.log("Part 2:", part2);
