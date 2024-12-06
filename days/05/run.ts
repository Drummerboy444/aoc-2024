const [rawPageOrderingRules, rawUpdates] = Deno.readTextFileSync(
  "days/05/input.txt",
).split("\n\n");

if (rawPageOrderingRules === undefined || rawUpdates === undefined) {
  throw new Error();
}

const rules = rawPageOrderingRules.split("\n").map((rawPageOrderingRule) => {
  const [page1, page2] = rawPageOrderingRule.split("|").map(Number);
  if (page1 === undefined || page2 === undefined) throw new Error();
  return [page1, page2] as const;
});

const updates = rawUpdates.split("\n").map((rawUpdate) =>
  rawUpdate.split(",").map(Number)
);

const isValidUpdate = (update: number[]) => {
  const seenPages = new Set<number>();
  for (let i = 0; i < update.length; i++) {
    const page = update[i];
    if (page === undefined) throw new Error();

    const isValidPage = rules.every(([rulePage1, rulePage2]) => {
      if (!update.includes(rulePage1) || !update.includes(rulePage2)) {
        return true;
      }
      if (rulePage2 !== page) return true;
      if (seenPages.has(rulePage1)) return true;
      return false;
    });

    if (isValidPage) {
      seenPages.add(page);
      continue;
    }
    return false;
  }
  return true;
};

const getMiddlePage = (update: number[]) => {
  const middleIndex = Math.floor(update.length / 2);
  const middlePage = update[middleIndex];
  if (middlePage === undefined) throw new Error();
  return middlePage;
};

const part1 = updates.filter(isValidUpdate).map(getMiddlePage).reduce(
  (a, b) => a + b,
  0,
);
console.log("Part 1:", part1);

const fixUpdate = (update: number[]) => {
  const fixedUpdate: number[] = [];

  update.forEach((page) => {
    const pagesBefore = rules.filter(([rulePage1, rulePage2]) => {
      if (
        update.includes(rulePage1) && update.includes(rulePage2) &&
        rulePage2 === page
      ) {
        return true;
      }
      return false;
    }).map(([rulePage1]) => rulePage1);

    const pagesAfter = rules.filter(([rulePage1, rulePage2]) => {
      if (
        update.includes(rulePage1) && update.includes(rulePage2) &&
        rulePage1 === page
      ) {
        return true;
      }
      return false;
    }).map(([_, rulePage2]) => rulePage2);

    const pagesBeforeIndexes = fixedUpdate.filter((update) =>
      pagesBefore.includes(update)
    ).map((_, i) => i);

    const pagesAfterIndexes = fixedUpdate.filter((update) =>
      pagesAfter.includes(update)
    ).map((_, i) => i);

    if (pagesBeforeIndexes.length === 0 && pagesAfterIndexes.length === 0) {
      fixedUpdate.push(page);
      return;
    }

    if (pagesBeforeIndexes.length === 0 && pagesAfterIndexes.length !== 0) {
      const minPageAfterIndex = Math.min(...pagesAfterIndexes);
      fixedUpdate.splice(minPageAfterIndex, 0, page);
      return;
    }

    const maxPageBeforeIndex = Math.max(...pagesBeforeIndexes);
    fixedUpdate.splice(maxPageBeforeIndex + 1, 0, page);
  });

  return fixedUpdate;
};

const part2 = updates.filter((update) => !isValidUpdate(update)).map(fixUpdate)
  .map(
    getMiddlePage,
  ).reduce((a, b) => a + b, 0);
console.log("Part 2:", part2);
