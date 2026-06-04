# GitHub Pages 公開用フォルダ

この `docs` フォルダの中身が、GitHub Pagesで公開するHP本体です。

GitHubの `Settings > Pages` で以下にしてください。

- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/docs`

このフォルダに入れていない主なもの:

- `admin.html`
- `editor.html`
- `server.py`
- `publish-tool.js`
- `import-*.js`
- `*.csv`
- `*.bak`

公開内容を更新するときは、HPフォルダ側で編集してから `build-publish-folder.bat` を実行してください。
