const fs = require("node:fs");
const path = require("node:path");

const rootDir = path.resolve(__dirname, "..");
const outputDir = path.join(rootDir, "dist");
const entries = ["index.html", "styles.css", "script.js", "assets"];

function copyEntry(entry) {
  const source = path.join(rootDir, entry);
  const destination = path.join(outputDir, entry);

  if (!fs.existsSync(source)) {
    throw new Error(`Missing required static asset: ${entry}`);
  }

  const stat = fs.statSync(source);
  if (stat.isDirectory()) {
    fs.cpSync(source, destination, { recursive: true });
    return;
  }

  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
}

if (!outputDir.startsWith(rootDir)) {
  throw new Error("Refusing to write outside the project directory.");
}

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });
entries.forEach(copyEntry);

console.log(`Static site built in ${path.relative(rootDir, outputDir)}`);
