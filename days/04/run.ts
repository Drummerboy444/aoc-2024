const wordSearch = Deno.readTextFileSync("days/04/input.txt").split("\n");

const tryGetWord = (
  positions: [i: number, j: number][],
) => {
  const characters = positions.map(([i, j]) => wordSearch[i]?.[j]);
  if (characters.some((character) => character === undefined)) return undefined;
  return characters.join("");
};

const countXMases = () =>
  wordSearch.flatMap((row, i) =>
    row.split("").flatMap((_, j) => [
      tryGetWord([[i, j], [i - 1, j], [i - 2, j], [i - 3, j]]),
      tryGetWord([[i, j], [i + 1, j], [i + 2, j], [i + 3, j]]),
      tryGetWord([[i, j], [i, j - 1], [i, j - 2], [i, j - 3]]),
      tryGetWord([[i, j], [i, j + 1], [i, j + 2], [i, j + 3]]),
      tryGetWord([[i, j], [i - 1, j - 1], [i - 2, j - 2], [i - 3, j - 3]]),
      tryGetWord([[i, j], [i - 1, j + 1], [i - 2, j + 2], [i - 3, j + 3]]),
      tryGetWord([[i, j], [i + 1, j - 1], [i + 2, j - 2], [i + 3, j - 3]]),
      tryGetWord([[i, j], [i + 1, j + 1], [i + 2, j + 2], [i + 3, j + 3]]),
    ])
  ).filter((word) => word === "XMAS").length;

const countXMasCrosses = () =>
  wordSearch.flatMap((row, i) =>
    row.split("").map((_, j) => [
      tryGetWord([[i, j], [i + 1, j + 1], [i + 2, j + 2]]),
      tryGetWord([[i + 2, j], [i + 1, j + 1], [i, j + 2]]),
    ])
  ).filter(([word1, word2]) =>
    (word1 === "MAS" || word1 === "SAM") &&
    (word2 === "MAS" || word2 === "SAM")
  ).length;

console.log("Part 1:", countXMases());
console.log("Part 2:", countXMasCrosses());
