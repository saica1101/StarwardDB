# GitHub Pages 公開メモ

このフォルダは編集用の元フォルダです。
GitHub Pagesで公開するファイルは `docs/` に分けています。

## Gitに上げる公開用フォルダ

`docs/` がGitHub Pages公開用です。

`build-publish-folder.bat` を実行すると、HPフォルダ内の公開に必要なファイルだけを `docs/` にコピーします。

GitHubに公開したいときは、基本的に以下を上げればOKです。

- `docs/**`
- `.gitignore`
- `PUBLISHING.md`

サイト生成や編集をGitHubにも残したい場合だけ、以下も一緒に上げます。

- `generate-character-pages.js`
- `generate-character-pages.bat`
- `build-publish-folder.js`
- `build-publish-folder.bat`
- `publish-tool.js`
- `publish-tool.bat`

## `docs/` に入る一般公開ページ

- `index.html`
- `characters.html`
- `characters/*.html`
- `videos.html`
- `streamers.html`
- `tools.html`
- `tools/**`
- `contributors-data.json`
- `streamers-data.json`
- `video-library-data.json`
- `character-sheet-data.json`
- `wiki-move-data.json`

通常ナビゲーションから管理ページへのリンクは出しません。

## `docs/` に入れないローカル用ファイル

- `admin.html`
- `editor.html`
- `server.py`
- `publish-tool.js`
- `import-*.js`
- `*.csv`
- `*.bak`

管理パスワードは `xzyjp` です。

注意: GitHub Pages は静的サイトなので、これは本物のサーバー認証ではありません。一般ユーザーの画面から隠すための管理導線です。完全に隠したい場合は、管理ページを別の非公開リポジトリやローカル専用に分けてください。

## 更新作業

1. ローカルで `python server.py` を起動する。
2. `http://127.0.0.1:8766/admin.html` を開く。
3. 必要なデータを編集する。
4. JSON保存またはJSON出力で以下を更新する。
   - `contributors-data.json`
   - `streamers-data.json`
   - `video-library-data.json`
5. `build-publish-folder.bat` を実行して `docs/` を更新する。
6. GitにコミットしてGitHubへpushする。

## Git公開ツール

`publish-tool.bat` をダブルクリックすると、ローカル公開ツールが起動します。

1. `publish-tool.bat` を起動する。
2. `http://127.0.0.1:8790/` を開く。
3. Gitに上げるファイルをチェックする。
4. 公開先URL、ブランチ、GitHubユーザー名、Token、コミット文を入力する。
5. `公開する` を押す。

Tokenは保存されません。GitHubの通常パスワードではなく、Personal Access Tokenを使ってください。
`チェック状態を無視して、すべての変更を追加する` をオンにすると、ファイル選択を使わず全変更を公開対象にします。

## GitHub Pages

1. GitHubでリポジトリを作る。
2. このフォルダをリポジトリのルートへ置く。
3. `Settings > Pages` を開く。
4. `Deploy from a branch` を選ぶ。
5. `main` / `/docs` を選ぶ。
6. `https://ユーザー名.github.io/リポジトリ名/` で公開される。

## 公開前チェック

- `file:///C:/...` のようなローカル絶対パスが残っていないか確認する。
- 一般URLに `?admin=1` を付けない。
- `admin.html` と `editor.html` は一般ページからリンクしない。
- JSONが空のまま公開されていないか確認する。
