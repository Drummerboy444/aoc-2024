const day = Deno.args[0];

if (day === undefined) {
  console.log("No day specified");
  Deno.exit();
}

const runFileContents =
  `import { readLines } from "../../utils/file-reading.ts";

const lines = await readLines("days/${day}/input.test.txt");

console.log(lines);
`;

await Deno.mkdir(`days/${day}`);
await Deno.writeTextFile(`days/${day}/run.ts`, runFileContents);
await Deno.writeTextFile(`days/${day}/input.txt`, "");
await Deno.writeTextFile(`days/${day}/input.test.txt`, "");
