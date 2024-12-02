const lines = Deno.readTextFileSync("days/02/input.txt").split("\n");

const reports = lines.map((line) =>
  line.split(" ").map((s) => Number.parseInt(s))
);

const getReportDifferences = (report: number[]) => {
  const differences: number[] = [];

  for (let i = 0; i < report.length - 1; i++) {
    const thisLevel = report[i];
    const nextLevel = report[i + 1];

    if (thisLevel === undefined || nextLevel === undefined) throw new Error();

    differences.push(nextLevel - thisLevel);
  }

  return differences;
};

const isReportSafe = (report: number[]) => {
  const differences = getReportDifferences(report);
  const isSafelyIncreasing = differences.every((d) => d >= 1 && d <= 3);
  const isSafelyDecreasing = differences.every((d) => d >= -3 && d <= -1);
  return isSafelyIncreasing || isSafelyDecreasing;
};

const part1 = reports.filter(isReportSafe).length;
console.log("Part 1:", part1);

const applyDampener = (report: number[], levelToRemove: number) => {
  const reportAfterDampener: number[] = [];
  report.forEach((level, i) => {
    if (i !== levelToRemove) reportAfterDampener.push(level);
  });
  return reportAfterDampener;
};

const isReportSafeWithDampener = (report: number[]) => {
  if (isReportSafe(report)) return true;

  for (let i = 0; i < report.length; i++) {
    const reportWithDampener = applyDampener(report, i);
    if (isReportSafe(reportWithDampener)) return true;
  }

  return false;
};

const part2 = reports.filter(isReportSafeWithDampener).length;
console.log("Part 2:", part2);
