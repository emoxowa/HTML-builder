
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

async function deleteFolderRecursive(dirPath) {
  try {
    await fs.promises.access(dirPath);
  } catch (error) {
    if (error.code === "ENOENT") {
      return;
    }
    throw error;
  }

  const files = await fs.promises.readdir(dirPath);

  for (const file of files) {
    const curPath = path.join(dirPath, file);
    const fileStat = await fs.promises.stat(curPath);

    if (fileStat.isDirectory()) {
      await deleteFolderRecursive(curPath);
    } else {
      await fs.promises.unlink(curPath);
    }
  }

  await fs.promises.rmdir(dirPath);
}


async function copyDir() {
  const inDir = "04-copy-directory/files";
  const outDir = "04-copy-directory/files-copy";

  try {
    await deleteFolderRecursive(outDir);
    await mkdir(outDir, { recursive: true });
  } catch (error) {
    console.error(`Error preparing destination directory: ${error.message}`);
    return;
  }

  try {
    const files = await readdir(inDir);

    for (const file of files) {
      const inPath = path.join(inDir, file);
      const outPath = path.join(outDir, file);

      const fileStat = await stat(inPath);

      if (fileStat.isFile()) {
        const content = await readFile(inPath);
        await writeFile(outPath, content);
      } else if (fileStat.isDirectory()) {
        await copyDir(inPath, outPath);
      }
    }
  } catch (error) {
    console.error(`Error copying directory: ${error.message}`);
  }
}

copyDir()
  .then(() => console.log("Directory copied successfully"))
  .catch((error) => console.error(`Error: ${error.message}`));
