const diskMap = Deno.readTextFileSync("days/09/input.txt").split("").map(
  (a) => Number(a),
);

const toLayout = (diskMap: number[]) => {
  return diskMap.flatMap((diskMapItem, i) =>
    Array.from<(number | ".")>({ length: diskMapItem }).fill(
      i % 2 === 0 ? Math.floor(i / 2) : ".",
    )
  );
};

const compress = (layout: (number | ".")[]) => {
  const compressedLayout: (number | ".")[] = [...layout];

  for (let i = layout.length - 1; i >= 0; i--) {
    const item = compressedLayout[i];
    if (item === undefined) throw new Error();
    if (item === ".") continue;

    const precedingItems = compressedLayout.slice(0, i);
    const firstEmptySpace = precedingItems.findIndex((space) => space === ".");
    if (firstEmptySpace === -1) continue;
    compressedLayout[firstEmptySpace] = item;
    compressedLayout[i] = ".";
  }

  return compressedLayout;
};

const getChecksum = (layout: (number | ".")[]) =>
  layout.reduce<number>(
    (previous, current, i) => previous + (current === "." ? 0 : current * i),
    0,
  );

console.log(getChecksum(compress(toLayout(diskMap))));
