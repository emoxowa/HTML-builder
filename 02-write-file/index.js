const fs = require("fs");
const readline = require("readline");
const path = require("path");

const outputFilename = "output.txt";
const outputDir = path.join(__dirname, outputFilename);
const writeStream = fs.createWriteStream(outputDir, { flags: "a" });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

if (process.platform === "win32") {
  const rl_win = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl_win.on("SIGINT", () => {
    process.emit("SIGINT");
  });
}

console.log(
  'Welcome! Please enter text to save in the file. Type "exit" to quit.'
);

rl.on("line", (input) => {
  if (input === "exit") {
    console.log("Exiting the program. Goodbye!");
    rl.close();
  } else {
    writeStream.write(`${input}\n`, (err) => {
      if (err) {
        console.error(`Error writing to file: ${err}`);
      } else {
        console.log(
          'Text successfully saved in the file. Enter more text or type "exit" to quit.'
        );
      }
    });
  }
});

process.on("SIGINT", () => {
  console.log("\nProcess interrupted (Ctrl+C). Goodbye!");
  writeStream.end();
  rl.close();
});