# GitHub Pages 公開メモ

このフォルダは一般公開用サイトをルートに置く構成です。

## 一般ユーザーが見るページ

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

通常ナビゲーションから管理ページへのリンクは出しません。

## 管理者用ページ

- `admin.html`
- `editor.html`
- `index.html?admin=1#contributors`
- `streamers.html?admin=1`
- `videos.html?admin=1`
- `tools/starward_updates_by_character.html?admin=1`

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
5. GitにコミットしてGitHubへpushする。

## GitHub Pages

1. GitHubでリポジトリを作る。
2. このフォルダの中身をリポジトリのルートへ置く。
3. `Settings > Pages` を開く。
4. `Deploy from a branch` を選ぶ。
5. `main` / `/root` を選ぶ。
6. `https://ユーザー名.github.io/リポジトリ名/` で公開される。

## 公開前チェック

- `file:///C:/...` のようなローカル絶対パスが残っていないか確認する。
- 一般URLに `?admin=1` を付けない。
- `admin.html` と `editor.html` は一般ページからリンクしない。
- JSONが空のまま公開されていないか確認する。
