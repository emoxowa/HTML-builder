const fs = require('fs').promises;
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const outputDir = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputDir, 'bundle.css');

async function mergeStyles() {
  try {
    try {
      await fs.access(outputDir);
    } catch (err) {
      await fs.mkdir(outputDir);
    }

    const files = await fs.readdir(stylesDir);
    const cssFiles = files.filter(file => path.extname(file) === '.css');

    let stylesData = '';

    for (const file of cssFiles) {
      const data = await fs.readFile(path.join(stylesDir, file), 'utf8');
      stylesData += data;
    }

    await fs.writeFile(outputFile, stylesData);
    console.log("The file bundle.css has been successfully created.");

  } catch (err) {
    console.error('Error:', err);
  }
}

mergeStyles();
