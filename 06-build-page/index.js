const fs = require("fs").promises;
const path = require("path");

const componentsDir = path.join(__dirname, "components");
const stylesDir = path.join(__dirname, "styles");
const assetsDir = path.join(__dirname, "assets");
const templateFile = path.join(__dirname, "template.html");
const outputDir = path.join(__dirname, "project-dist");
const outputFile = path.join(outputDir, "index.html");
const outputStylesFile = path.join(outputDir, "style.css");
const outputAssetsDir = path.join(outputDir, "assets");

async function buildPage() {
  try {
    try {
      await fs.access(outputDir);
    } catch (err) {
      await fs.mkdir(outputDir);
    }

    const template = await fs.readFile(templateFile, "utf8");

    const regex = /{{(\w+)}}/g;
    let match;
    let newTemplate = template;

    while ((match = regex.exec(template)) !== null) {
      const componentName = match[1];
      const componentFile = path.join(componentsDir, `${componentName}.html`);

      try {
        const componentContent = await fs.readFile(componentFile, "utf8");
        newTemplate = newTemplate.replace(
          `{{${componentName}}}`,
          componentContent
        );
      } catch (err) {
        console.error(
          `Error while reading the component ${componentName}:`,
          err
        );
      }
    }

    await fs.writeFile(outputFile, newTemplate);

    const styleFiles = (await fs.readdir(stylesDir)).filter(
      (file) => path.extname(file) === ".css"
    );
    let stylesData = "";

    for (const file of styleFiles) {
      const data = await fs.readFile(path.join(stylesDir, file), "utf8");
      stylesData += data;
    }

    await fs.writeFile(outputStylesFile, stylesData);

    async function copyAssets(src, dest) {
      await fs.mkdir(dest, { recursive: true });

      const entries = await fs.readdir(src, { withFileTypes: true });

      for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
          await copyAssets(srcPath, destPath);
        } else {
          await fs.copyFile(srcPath, destPath);
        }
      }
    }

    await copyAssets(assetsDir, outputAssetsDir);
  } catch (err) {
    console.error("Error:", err);
  }
}

buildPage();
