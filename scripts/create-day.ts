const day = Deno.args[0];

if (day === undefined) {
  console.log("No day specified");
  Deno.exit();
}

const runFileContents =
  `const lines = Deno.readTextFileSync("days/${day}/input.test.txt").split("\\n")

console.log(lines);
`;

await Deno.mkdir(`days/${day}`);
await Deno.writeTextFile(`days/${day}/run.ts`, runFileContents);
await Deno.writeTextFile(`days/${day}/input.txt`, "");
await Deno.writeTextFile(`days/${day}/input.test.txt`, "");
