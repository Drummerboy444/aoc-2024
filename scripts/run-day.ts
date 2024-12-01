const day = Deno.args[0];

if (day === undefined) {
  console.log("No day specified");
  Deno.exit();
}

const runDayFileName = `../days/${day}/run.ts`;

await import(runDayFileName);
