#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const MOBILE_CSS = `
/* === Injected by convert-mobile.js — Hot Potatoes Mobile Optimizations === */

@media (max-width: 600px) {
  body {
    margin-left: 1% !important;
    margin-right: 1% !important;
  }

  .ExerciseTitle {
    font-size: 120% !important;
  }

  .ExerciseSubtitle {
    font-size: 105% !important;
  }

  #ContainerDiv {
    flex-direction: column !important;
  }

  .ExerciseContainer,
  .ReadingContainer {
    min-width: 0 !important;
    width: 100% !important;
  }

  button,
  .FuncButton,
  .NavButton {
    min-width: 44px !important;
    min-height: 44px !important;
    padding: 0.7em 1em !important;
  }

  .FuncButton {
    box-shadow: 0.1em 0.15em 0.1em var(--strFuncShadeColor) !important;
  }

  .NavButton {
    box-shadow: 0.1em 0.15em 0.1em var(--strNavShadeColor) !important;
  }

  .NavButtonBar button {
    display: block !important;
    width: 100% !important;
    margin-bottom: 0.3em !important;
  }

  div.Keypad button {
    width: 2.6em !important;
    height: 2.6em !important;
    font-size: 140% !important;
  }

  div.Feedback {
    position: fixed !important;
    left: 5% !important;
    width: 90% !important;
    top: 15% !important;
    max-height: 70vh !important;
    overflow-y: auto !important;
  }

  ol.MCAnswers {
    padding-left: 1.5em !important;
    padding-right: 0.3em !important;
  }

  ol.MCAnswers li {
    margin-bottom: 1.2em !important;
  }

  li.QuizQuestion {
    padding: 0.5em !important;
  }

  .QNum {
    margin: 0 0.3em 0.5em 0.3em !important;
  }

  .QuestionText {
    font-size: 0.95em !important;
    line-height: 1.4 !important;
  }

  input,
  textarea,
  select {
    max-width: 100% !important;
    box-sizing: border-box !important;
    font-size: 16px !important;
  }

  table.FlashcardTable td.Showing {
    padding: 1em !important;
    font-size: 120% !important;
  }

  a.ExSegment {
    font-size: 100% !important;
    padding: 0.4em !important;
  }

  /* Drag-and-drop: make cards bigger for touch */
  div.CardStyle {
    font-size: 1.2em !important;
    min-width: 3em !important;
    padding: 0.7em !important;
  }

  div.DropLine {
    width: 90% !important;
    left: 5% !important;
  }

  /* Cloze: improve readability */
  div.ClozeBody {
    line-height: 1.8 !important;
  }
}

/* Prevent iOS zoom on input focus (applies always, not just mobile) */
@media (max-width: 600px) {
  input[type="text"],
  input[type="search"],
  input:not([type]) {
    font-size: 16px !important;
  }
}
`.trim();

const VIEWPORT_META = '<meta name="viewport" content="width=device-width, initial-scale=1.0">';

function hasViewportMeta(html) {
  return /<meta[^>]*name\s*=\s*["']viewport["'][^>]*>/i.test(html);
}

function extractTitle(html) {
  const match = html.match(/<title>([\s\S]*?)<\/title>/i);
  if (match) {
    return match[1].replace(/&[#\w]+;/g, '').trim();
  }
  return null;
}

function injectViewportMeta(html) {
  if (hasViewportMeta(html)) {
    return html;
  }
  return html.replace(/(<head[^>]*>)/i, `$1\n${VIEWPORT_META}`);
}

function injectMobileCSS(html) {
  return html.replace(/(<\/head>)/i, `<style>\n${MOBILE_CSS}\n</style>\n$1`);
}

function convert(html) {
  let result = injectViewportMeta(html);
  result = injectMobileCSS(result);
  return result;
}

function generateIndex(files, outputDir) {
  const items = files
    .map((f) => {
      const title = f.title || path.basename(f.name, path.extname(f.name));
      return `    <li><a href="${f.name}">${escapeHtml(title)}</a></li>`;
    })
    .join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Exercises</title>
<style>
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    max-width: 600px;
    margin: 2em auto;
    padding: 0 1em;
    background: #f5f5f5;
    color: #333;
  }
  h1 { font-size: 1.5em; }
  ul { padding: 0; list-style: none; }
  li { margin-bottom: 0.8em; }
  a {
    display: block;
    padding: 1em;
    background: #fff;
    border-radius: 0.5em;
    text-decoration: none;
    color: #1a0dab;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
  a:hover { background: #e8f0fe; }
</style>
</head>
<body>
<h1>Exercises</h1>
<ul>
${items}
</ul>
</body>
</html>`;

  fs.writeFileSync(path.join(outputDir, 'index.html'), html, 'utf-8');
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { inputDir: null, outputDir: 'output', files: [] };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--input' || args[i] === '-i') {
      opts.inputDir = args[++i];
    } else if (args[i] === '--output' || args[i] === '-o') {
      opts.outputDir = args[++i];
    } else if (args[i] === '--file' || args[i] === '-f') {
      opts.files.push(args[++i]);
    } else if (args[i] === '--help' || args[i] === '-h') {
      printHelp();
      process.exit(0);
    }
  }

  if (!opts.inputDir && opts.files.length === 0) {
    opts.inputDir = 'input';
  }

  return opts;
}

function printHelp() {
  console.log(`Usage: node convert-mobile.js [options]

Options:
  --input,  -i <dir>   Input directory (default: input/)
  --output, -o <dir>   Output directory (default: output/)
  --file,   -f <path>  Convert a single file (repeatable)
  --help,   -h         Show this help

Examples:
  node convert-mobile.js                           # scan input/, write to output/
  node convert-mobile.js --file quiz.html           # convert one file
  node convert-mobile.js -i exams/ -o dist/         # custom dirs
  node convert-mobile.js -f a.html -f b.html -o out/ # multiple files`);
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function outputFilename(inputPath) {
  const ext = path.extname(inputPath);
  const base = path.basename(inputPath, ext);
  return `${base}.mobile${ext}`;
}

function main() {
  const opts = parseArgs();
  const outputDir = path.resolve(opts.outputDir);
  ensureDir(outputDir);

  let filePaths = [];

  if (opts.files.length > 0) {
    filePaths = opts.files.map((f) => path.resolve(f));
  }

  if (opts.inputDir) {
    const inputDir = path.resolve(opts.inputDir);
    if (!fs.existsSync(inputDir)) {
      console.error(`Error: input directory not found: ${inputDir}`);
      process.exit(1);
    }
    const dirFiles = fs
      .readdirSync(inputDir)
      .filter((f) => /\.html?$/i.test(f))
      .map((f) => path.join(inputDir, f));
    filePaths = [...filePaths, ...dirFiles];
  }

  // Deduplicate
  filePaths = [...new Set(filePaths)];

  if (filePaths.length === 0) {
    console.log('No .html files found.');
    process.exit(0);
  }

  const results = [];

  for (const fp of filePaths) {
    const html = fs.readFileSync(fp, 'utf-8');
    const title = extractTitle(html);
    const converted = convert(html);
    const outName = outputFilename(fp);
    const outPath = path.join(outputDir, outName);

    fs.writeFileSync(outPath, converted, 'utf-8');
    results.push({ name: outName, title, inputPath: fp });
    console.log(`  ${path.relative(process.cwd(), fp)} → ${path.relative(process.cwd(), outPath)}`);
  }

  generateIndex(results, outputDir);
  console.log(`\nDone. ${results.length} file(s) converted → ${path.relative(process.cwd(), outputDir)}/`);
}

main();
