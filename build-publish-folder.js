const fs = require("fs");
const path = require("path");

const root = __dirname;
const outputDir = path.join(root, "docs");

const copyItems = [
  ".nojekyll",
  "index.html",
  "characters.html",
  "videos.html",
  "streamers.html",
  "tools.html",
  "robots.txt",
  "styles.css",
  "script.js",
  "home-feed.js",
  "video-library.js",
  "streamers.js",
  "contributors-data.json",
  "streamers-data.json",
  "video-library-data.json",
  "characters-data.json",
  "character-sheet-data.json",
  "wiki-move-data.json",
  "page-edits-data.json",
  "assets",
  "characters",
  "tools",
];

const removeDir = (target) => {
  fs.rmSync(target, { recursive: true, force: true });
};

const ensureDir = (target) => {
  fs.mkdirSync(target, { recursive: true });
};

const copyRecursive = (source, destination) => {
  const stat = fs.statSync(source);
  if (stat.isDirectory()) {
    ensureDir(destination);
    for (const entry of fs.readdirSync(source)) {
      copyRecursive(path.join(source, entry), path.join(destination, entry));
    }
    return;
  }
  ensureDir(path.dirname(destination));
  fs.copyFileSync(source, destination);
};

const main = () => {
  removeDir(outputDir);
  ensureDir(outputDir);

  const copied = [];
  const missing = [];

  for (const item of copyItems) {
    const source = path.join(root, item);
    if (!fs.existsSync(source)) {
      missing.push(item);
      continue;
    }
    copyRecursive(source, path.join(outputDir, item));
    copied.push(item);
  }

  const readme = [
    "# GitHub Pages 公開用フォルダ",
    "",
    "この `docs` フォルダの中身が、GitHub Pagesで公開するHP本体です。",
    "",
    "GitHubの `Settings > Pages` で以下にしてください。",
    "",
    "- Source: `Deploy from a branch`",
    "- Branch: `main`",
    "- Folder: `/docs`",
    "",
    "このフォルダに入れていない主なもの:",
    "",
    "- `admin.html`",
    "- `editor.html`",
    "- `server.py`",
    "- `publish-tool.js`",
    "- `import-*.js`",
    "- `*.csv`",
    "- `*.bak`",
    "",
    "公開内容を更新するときは、HPフォルダ側で編集してから `build-publish-folder.bat` を実行してください。",
    "",
  ].join("\n");
  fs.writeFileSync(path.join(outputDir, "README.md"), readme);

  console.log(`公開用フォルダを作成しました: ${outputDir}`);
  console.log(`コピー: ${copied.length}件`);
  if (missing.length) console.log(`見つからなかった項目: ${missing.join(", ")}`);
};

if (require.main === module) {
  main();
}
