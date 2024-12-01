const parseLine = (line: string): [number, number] => {
  const [id1, id2] = line.split("   ").map((stringId) =>
    Number.parseInt(stringId)
  );

  if (id1 === undefined || id2 === undefined) {
    throw new Error("Invalid input");
  }

  return [id1, id2];
};

const lines = Deno.readTextFileSync("days/01/input.txt").split("\n").map(
  parseLine,
);

const list1 = lines.map(([id1]) => id1);
const list2 = lines.map(([_, id2]) => id2);

const sortedList1 = list1.sort();
const sortedList2 = list2.sort();

const zippedList = sortedList1.map((id1, index): [number, number] => {
  const id2 = sortedList2[index];
  if (id2 === undefined) throw new Error("Failed to zip lists");
  return [id1, id2];
});

const part1 = zippedList.map(([id1, id2]) => Math.abs(id1 - id2)).reduce(
  (id1, id2) => id1 + id2,
  0,
);

console.log("Part 1:", part1);

const list2Occurrences = list2.reduce<Record<number, number>>((lookup, id) => {
  if (lookup[id] !== undefined) lookup[id]++;
  else lookup[id] = 1;
  return lookup;
}, {});

const part2 = list1.map((id) => {
  const occurrences = list2Occurrences[id];
  if (occurrences === undefined) return 0;
  return id * occurrences;
}).reduce((a, b) => a + b, 0);

console.log("Part 2:", part2);
