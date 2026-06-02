const fs = require("fs");
const moveData = fs.existsSync("wiki-move-data.json") ? JSON.parse(fs.readFileSync("wiki-move-data.json", "utf8")) : {};
const characterDir = "characters";

const characters = [
  { name: "グリフィン", cost: "3.0", slug: "griffin", url: "https://w.atwiki.jp/starward/pages/34.html" },
  { name: "ヒカリ", cost: "3.0", slug: "hikari", url: "https://w.atwiki.jp/starward/pages/26.html" },
  { name: "エルフィン", cost: "3.0", slug: "elfin", url: "https://w.atwiki.jp/starward/pages/31.html" },
  { name: "ケルビム", cost: "3.0", slug: "cherubim", url: "https://w.atwiki.jp/starward/pages/16.html" },
  { name: "シュウウ", cost: "3.0", slug: "shuuu", url: "https://w.atwiki.jp/starward/pages/24.html" },
  { name: "スズラン", cost: "3.0", slug: "suzuran", url: "https://w.atwiki.jp/starward/pages/45.html" },
  { name: "キャヴァリー", cost: "3.0", slug: "cavalry", url: "https://w.atwiki.jp/starward/pages/154.html" },
  { name: "ラジエル", cost: "3.0", slug: "raziel", url: "https://w.atwiki.jp/starward/pages/165.html" },
  { name: "影", cost: "3.0", slug: "kage", url: "https://w.atwiki.jp/starward/pages/176.html" },
  { name: "ライン", cost: "3.0", slug: "line", url: "https://w.atwiki.jp/starward/pages/204.html" },
  { name: "ロタ", cost: "3.0", slug: "rota", url: "https://w.atwiki.jp/starward/pages/205.html" },
  { name: "イーザー", cost: "3.0", slug: "ether", url: "https://w.atwiki.jp/starward/pages/243.html" },
  { name: "秋雲", cost: "3.0", slug: "aki-gumo", url: "https://w.atwiki.jp/starward/pages/264.html" },
  { name: "ベータ-ロンギヌス", cost: "3.0", slug: "beta-longinus", url: "https://w.atwiki.jp/starward/pages/331.html" },
  { name: "キャミィ", cost: "3.0", slug: "cammy", url: "https://w.atwiki.jp/starward/pages/334.html" },
  { name: "セイレン", cost: "3.0", slug: "seiren", url: "https://w.atwiki.jp/starward/pages/343.html" },
  { name: "無銘", cost: "3.0", slug: "mumei", url: "https://w.atwiki.jp/starward/pages/354.html" },
  { name: "アカツキ", cost: "3.0", slug: "akatsuki", url: "https://w.atwiki.jp/starward/pages/356.html" },
  { name: "ヴォイドセーバー", cost: "3.0", slug: "void-saber", url: "https://w.atwiki.jp/starward/pages/375.html", note: "期間限定" },
  { name: "フリード", cost: "2.5", slug: "freed", url: "https://w.atwiki.jp/starward/pages/30.html" },
  { name: "カゼ", cost: "2.5", slug: "kaze", url: "https://w.atwiki.jp/starward/pages/25.html" },
  { name: "シャオリン", cost: "2.5", slug: "shaolin", url: "https://w.atwiki.jp/starward/pages/23.html" },
  { name: "シャープ", cost: "2.5", slug: "sharp", url: "https://w.atwiki.jp/starward/pages/20.html" },
  { name: "アリス", cost: "2.5", slug: "alice", url: "https://w.atwiki.jp/starward/pages/17.html" },
  { name: "スカイセーバー", cost: "2.5", slug: "sky-saber", url: "https://w.atwiki.jp/starward/pages/89.html" },
  { name: "十八号", cost: "2.5", slug: "no-18", url: "https://w.atwiki.jp/starward/pages/149.html" },
  { name: "シグナス", cost: "2.5", slug: "cygnus", url: "https://w.atwiki.jp/starward/pages/162.html" },
  { name: "アンジェリス", cost: "2.5", slug: "angelis", url: "https://w.atwiki.jp/starward/pages/167.html" },
  { name: "ヴァルキア", cost: "2.5", slug: "valkia", url: "https://w.atwiki.jp/starward/pages/203.html" },
  { name: "エヴァ", cost: "2.5", slug: "eva", url: "https://w.atwiki.jp/starward/pages/234.html" },
  { name: "轟雷改", cost: "2.5", slug: "gourai-kai", url: "https://w.atwiki.jp/starward/pages/240.html", note: "コラボ" },
  { name: "稲", cost: "2.5", slug: "ina", url: "https://w.atwiki.jp/starward/pages/244.html" },
  { name: "バーゼラルド", cost: "2.5", slug: "baselard", url: "https://w.atwiki.jp/starward/pages/241.html", note: "コラボ" },
  { name: "ノーラ", cost: "2.5", slug: "nora", url: "https://w.atwiki.jp/starward/pages/245.html" },
  { name: "ランスロット", cost: "2.5", slug: "lancelot", url: "https://w.atwiki.jp/starward/pages/265.html" },
  { name: "サンダーボルト・OTOME", cost: "2.5", slug: "thunderbolt-otome", url: "https://w.atwiki.jp/starward/pages/262.html", note: "コラボ" },
  { name: "ガラハッド・暁", cost: "2.5", slug: "galahad-akatsuki", url: "https://w.atwiki.jp/starward/pages/339.html", note: "コラボ" },
  { name: "デッド・アライブ", cost: "2.5", slug: "dead-alive", url: "https://w.atwiki.jp/starward/pages/340.html", note: "コラボ" },
  { name: "ハルカ", cost: "2.5", slug: "haruka", url: "https://w.atwiki.jp/starward/pages/344.html" },
  { name: "ドラグナー", cost: "2.5", slug: "dragner", url: "https://w.atwiki.jp/starward/pages/346.html" },
  { name: "レキ", cost: "2.5", slug: "reki", url: "https://w.atwiki.jp/starward/pages/349.html", note: "コラボ" },
  { name: "ブラック★ロックシューター", cost: "2.5", slug: "black-rock-shooter", url: "https://w.atwiki.jp/starward/pages/364.html", note: "コラボ" },
  { name: "デッドマスター", cost: "2.5", slug: "dead-master", url: "https://w.atwiki.jp/starward/pages/368.html", note: "コラボ" },
  { name: "ベータ", cost: "2.0", slug: "beta", url: "https://w.atwiki.jp/starward/pages/14.html" },
  { name: "デュカリオン", cost: "2.0", slug: "deucalion", url: "https://w.atwiki.jp/starward/pages/15.html" },
  { name: "セラフィム", cost: "2.0", slug: "seraphim", url: "https://w.atwiki.jp/starward/pages/33.html" },
  { name: "アイーダ", cost: "2.0", slug: "aida", url: "https://w.atwiki.jp/starward/pages/28.html" },
  { name: "パラス", cost: "2.0", slug: "pallas", url: "https://w.atwiki.jp/starward/pages/21.html" },
  { name: "スコーピオン", cost: "2.0", slug: "scorpion", url: "https://w.atwiki.jp/starward/pages/18.html" },
  { name: "ヴァーチェ", cost: "2.0", slug: "virtue", url: "https://w.atwiki.jp/starward/pages/58.html" },
  { name: "ザハロワ", cost: "2.0", slug: "zaharowa", url: "https://w.atwiki.jp/starward/pages/29.html" },
  { name: "咲迦", cost: "2.0", slug: "sakuya", url: "https://w.atwiki.jp/starward/pages/183.html" },
  { name: "チンニ", cost: "2.0", slug: "qinni", url: "https://w.atwiki.jp/starward/pages/193.html" },
  { name: "ダークスター", cost: "2.0", slug: "darkstar", url: "https://w.atwiki.jp/starward/pages/197.html" },
  { name: "ヒビキ", cost: "2.0", slug: "hibiki", url: "https://w.atwiki.jp/starward/pages/235.html" },
  { name: "スティレット", cost: "2.0", slug: "stylet", url: "https://w.atwiki.jp/starward/pages/242.html", note: "コラボ" },
  { name: "ボルゾイ", cost: "2.0", slug: "borzoi", url: "https://w.atwiki.jp/starward/pages/263.html", note: "シーズンパス" },
  { name: "キャッティ", cost: "2.0", slug: "catty", url: "https://w.atwiki.jp/starward/pages/266.html" },
  { name: "ブリーカー", cost: "2.0", slug: "breaker", url: "https://w.atwiki.jp/starward/pages/333.html", note: "シーズンパス" },
  { name: "ガラハッド", cost: "2.0", slug: "galahad", url: "https://w.atwiki.jp/starward/pages/337.html", note: "コラボ" },
  { name: "フランカー", cost: "2.0", slug: "flanker", url: "https://w.atwiki.jp/starward/pages/341.html", note: "シーズンパス" },
  { name: "アイスリン", cost: "2.0", slug: "icelin", url: "https://w.atwiki.jp/starward/pages/347.html", note: "シーズンパス" },
  { name: "クリスタ", cost: "2.0", slug: "crysta", url: "https://w.atwiki.jp/starward/pages/350.html" },
  { name: "タチアナ", cost: "2.0", slug: "tatiana", url: "https://w.atwiki.jp/starward/pages/357.html", note: "シーズンパス" },
  { name: "フィービー", cost: "2.0", slug: "phoebe", url: "https://w.atwiki.jp/starward/pages/359.html", note: "期間限定" },
  { name: "オーキッド", cost: "1.5", slug: "orchid", url: "https://w.atwiki.jp/starward/pages/32.html" },
  { name: "スノーウォル", cost: "1.5", slug: "snow-wal", url: "https://w.atwiki.jp/starward/pages/27.html" },
  { name: "カタリナ", cost: "1.5", slug: "katarina", url: "https://w.atwiki.jp/starward/pages/22.html" },
  { name: "ローランド", cost: "1.5", slug: "roland", url: "https://w.atwiki.jp/starward/pages/19.html" },
  { name: "ヤミン", cost: "1.5", slug: "yamin", url: "https://w.atwiki.jp/starward/pages/119.html" },
];

const esc = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const youtubeSearch = (name) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(`星の翼 ${name}`)}`;

const pageName = (character) => `${characterDir}/${character.slug}.html`;
const cell = (value) => esc(value ?? "-");
const row = (cells) => `<tr>${cells.map((value, index) => (index === 0 ? `<th scope="row">${cell(value)}</th>` : `<td>${cell(value)}</td>`)).join("")}</tr>`;
const rows = (items, fallback) => (items?.length ? items.map(row).join("\n") : fallback);
const sectionRows = (character, type, fallback, colspan) => {
  const data = moveData[character.slug];
  if (data?.[type]?.length) return data[type].map(row).join("\n");
  if (data) return "";
  return fallback;
};
const hasSection = (character, type) => {
  const data = moveData[character.slug];
  return !data || Boolean(data[type]?.length);
};

const header = (current = "characters.html", base = "") => `
    <header class="site-header" id="top">
      <a class="brand" href="${base}index.html" aria-label="星の翼ガイド トップへ">
        <span class="brand-mark">S</span>
        <span>星の翼ガイド</span>
      </a>
      <nav class="nav" aria-label="主要ナビゲーション">
        <a href="${base}index.html">基本</a>
        <a href="${base}index.html#contributors">ご協力様</a>
        <a href="${base}characters.html"${current === "characters.html" ? ' aria-current="page"' : ""}>キャラ</a>
        <a href="${base}videos.html"${current === "videos.html" ? ' aria-current="page"' : ""}>動画</a>
      </nav>
    </header>`;

const footer = `
    <footer class="footer">
      <p>
        キャラ詳細の参照元:
        <a href="https://w.atwiki.jp/starward/" target="_blank" rel="noreferrer">星の翼(Starward) 日本語wiki</a>
      </p>
      <a href="#top">上へ戻る</a>
    </footer>`;

const weaponTable = (character) => `
      <section class="section tight">
        <div class="section-heading">
          <p class="eyebrow">Move Table</p>
          <h2>武装・格闘・バースト表</h2>
        </div>
        <div class="source-note weapon-source">
          <strong>編集メモ</strong>
          <span>画像のような表形式で、${esc(character.name)}の武装を整理する欄です。数値や凸で変わる弾数は <a href="${character.url}" target="_blank" rel="noreferrer">atwiki個別ページ</a> を見ながら追記してください。</span>
        </div>
        <div class="move-table-wrap" aria-label="${esc(character.name)}の武装表">
          ${hasSection(character, "shooting") ? `<table class="move-table">
            <thead>
              <tr>
                <th scope="col">射撃</th>
                <th scope="col">名称</th>
                <th scope="col">弾数</th>
                <th scope="col">威力</th>
                <th scope="col">備考</th>
              </tr>
            </thead>
            <tbody>
              ${sectionRows(character, "shooting", `
              <tr><th scope="row">メイン射撃</th><td>atwiki参照</td><td>-</td><td>-</td><td>主力牽制、連射、足が止まるかを記入</td></tr>
              <tr><th scope="row">サブ射撃</th><td>atwiki参照</td><td>-</td><td>-</td><td>着地取り、迎撃、差し込み用途を記入</td></tr>
              <tr><th scope="row">特殊射撃</th><td>atwiki参照</td><td>-</td><td>-</td><td>時限強化、アシスト、設置などを記入</td></tr>
              <tr><th scope="row">特殊格闘</th><td>atwiki参照</td><td>-</td><td>-</td><td>移動、派生、降りテク、形態移行を記入</td></tr>`, 5)}
            </tbody>
          </table>` : ""}
          ${hasSection(character, "melee") ? `<table class="move-table">
            <thead>
              <tr>
                <th scope="col">格闘</th>
                <th scope="col">名称</th>
                <th scope="col">入力</th>
                <th scope="col">弾数</th>
                <th scope="col">威力</th>
                <th scope="col">備考</th>
              </tr>
            </thead>
            <tbody>
              ${sectionRows(character, "melee", `
              <tr><th scope="row">通常格闘</th><td>atwiki参照</td><td>N</td><td>-</td><td>-</td><td>出し切り、派生、カット耐性を記入</td></tr>
              <tr><th scope="row">横格闘</th><td>atwiki参照</td><td>横</td><td>-</td><td>-</td><td>回り込み、差し込み、主力始動かを記入</td></tr>
              <tr><th scope="row">前格闘</th><td>atwiki参照</td><td>前</td><td>-</td><td>-</td><td>発生、判定、追い性能を記入</td></tr>
              <tr><th scope="row">後格闘</th><td>atwiki参照</td><td>後</td><td>-</td><td>-</td><td>カウンター、ピョン格、単発火力などを記入</td></tr>
              <tr><th scope="row">派生</th><td>atwiki参照</td><td>各種</td><td>-</td><td>-</td><td>火力派生、離脱派生、凸解禁派生を記入</td></tr>`, 6)}
            </tbody>
          </table>` : ""}
          ${hasSection(character, "burst") ? `<table class="move-table burst-table">
            <thead>
              <tr>
                <th scope="col">バーストアタック</th>
                <th scope="col">名称</th>
                <th scope="col">威力</th>
                <th scope="col">備考</th>
              </tr>
            </thead>
            <tbody>
              ${sectionRows(character, "burst", `
              <tr><th scope="row">バーストアタック</th><td>atwiki参照</td><td>F/S/B/MD</td><td>乱舞、単発、換装、回復などを記入</td></tr>
              <tr><th scope="row">後バーストアタック</th><td>atwiki参照</td><td>-</td><td>後入力版がある場合だけ記入</td></tr>`, 4)}
            </tbody>
          </table>` : ""}
        </div>
      </section>`;

const sectionCount = (character, type) => moveData[character.slug]?.[type]?.length ?? 0;
const previewRows = (character, type, limit = 3) => (moveData[character.slug]?.[type] ?? []).slice(0, limit);
const weaponPreview = (character) => {
  const rows = [...previewRows(character, "shooting", 3), ...previewRows(character, "melee", 2)].slice(0, 5);
  return rows.length
    ? rows
        .map((item) => `<li><strong>${cell(item[0])}</strong><span>${cell(item[1])} / ${cell(item.at(-2))}</span></li>`)
        .join("")
    : `<li><strong>武装表</strong><span>atwikiから取得した表を下部に表示します。</span></li>`;
};

const characterPage = (character) => `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(character.name)}解説 | 星の翼ガイド</title>
    <meta name="description" content="星の翼の${esc(character.name)}個別解説ページ。コスト、武装、凸効果の確認導線を整理しています。" />
    <link rel="stylesheet" href="../styles.css" />
  </head>
  <body>
${header("characters.html", "../")}

    <main>
      <section class="character-hero">
        <div class="character-hero-inner">
          <a class="back-link" href="../characters.html">キャラ一覧へ戻る</a>
          <p class="eyebrow">Cost ${esc(character.cost)}${character.note ? ` / ${esc(character.note)}` : ""}</p>
          <h1>${esc(character.name)}</h1>
          <p>${esc(character.name)}の入口ページです。最初に役割と主力武装を確認し、必要になったら詳細な武装表とatwiki原典へ進めます。</p>
          <div class="hero-actions">
            <a class="button primary" href="#guide">使い方を見る</a>
            <a class="button ghost" href="#moves">武装表</a>
            <a class="button ghost" href="${youtubeSearch(character.name)}" target="_blank" rel="noreferrer">動画検索</a>
          </div>
        </div>
      </section>

      <section class="section tight" id="guide">
        <div class="character-detail-grid">
          <article class="detail-panel">
            <h2>基本データ</h2>
            <dl class="spec-list">
              <div><dt>コスト</dt><dd>${esc(character.cost)}</dd></div>
              <div><dt>射撃表</dt><dd>${sectionCount(character, "shooting")}件</dd></div>
              <div><dt>格闘表</dt><dd>${sectionCount(character, "melee")}件</dd></div>
              <div><dt>参照元</dt><dd><a href="${character.url}" target="_blank" rel="noreferrer">atwiki個別ページ</a></dd></div>
              <div><dt>動画</dt><dd><a href="${youtubeSearch(character.name)}" target="_blank" rel="noreferrer">YouTube検索</a></dd></div>
            </dl>
          </article>
          <article class="detail-panel">
            <h2>最初に見る武装</h2>
            <ul class="detail-list">
              ${weaponPreview(character)}
            </ul>
          </article>
        </div>
      </section>

      <section class="section tight split-band">
        <div class="section-heading">
          <p class="eyebrow">Game Plan</p>
          <h2>使い方の型</h2>
        </div>
        <div class="note-grid">
          <article class="detail-panel">
            <h3>序盤</h3>
            <p>まず主力射撃の届く距離を確認。無理に触りに行かず、敵2人のロックと着地を見ます。</p>
          </article>
          <article class="detail-panel">
            <h3>中盤</h3>
            <p>表の備考にあるスタン、強制ダウン、照射、派生を見て、相方と重ねやすい武装を選びます。</p>
          </article>
          <article class="detail-panel">
            <h3>凸・対策</h3>
            <p>弾数や派生が変わる凸を確認。対面では一番痛い始動武装と、追ってはいけない場面を覚えます。</p>
          </article>
        </div>
      </section>

${weaponTable(character).replace('<section class="section tight">', '<section class="section tight" id="moves">')}
    </main>

${footer}
    <script src="../script.js"></script>
  </body>
</html>
`;

const rosterCard = (character) => `
          <article class="roster-card" data-search="${esc(`${character.cost} ${character.name} ${character.note ?? ""}`)}">
            <div>
              <span class="cost">${esc(character.cost)}${character.note ? ` / ${esc(character.note)}` : ""}</span>
              <h3>${esc(character.name)}</h3>
              <p>射撃${sectionCount(character, "shooting")}件 / 格闘${sectionCount(character, "melee")}件 / 覚醒${sectionCount(character, "burst")}件。要点から詳細表まで確認できます。</p>
            </div>
            <div class="card-actions">
              <a href="${pageName(character)}">個別ページ</a>
              <a href="${character.url}" target="_blank" rel="noreferrer">atwiki</a>
              <a href="${youtubeSearch(character.name)}" target="_blank" rel="noreferrer">動画</a>
            </div>
          </article>`;

const grouped = ["3.0", "2.5", "2.0", "1.5"]
  .map((cost, index) => {
    const cards = characters.filter((character) => character.cost === cost).map(rosterCard).join("\n");
    return `
        <details class="cost-group" ${index === 0 ? "open" : ""}>
          <summary id="cost-${cost.replace(".", "-")}">
            <span>コスト${cost}</span>
            <small>${characters.filter((character) => character.cost === cost).length}キャラ</small>
          </summary>
          <div class="roster-list">${cards}
          </div>
        </details>`;
  })
  .join("\n");

const charactersIndex = `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>キャラ別 武装・凸効果参照 | 星の翼ガイド</title>
    <meta
      name="description"
      content="星の翼のキャラ別に、武装・凸効果を確認するための参照リンクと、このサイト用の要点メモをまとめるページです。"
    />
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
${header()}

    <main>
      <section class="page-hero compact">
        <div class="page-hero-inner">
          <p class="eyebrow">Character Reference</p>
          <h1>キャラ別 武装・凸効果参照</h1>
          <p>
            検索、コスト別の開閉、キャラ個別ページをまとめたデータベースです。キャラ名・コスト・個別ページURLは
            <a href="https://w.atwiki.jp/starward/" target="_blank" rel="noreferrer">星の翼(Starward) 日本語wiki</a>
            のキャラクター一覧を基準にしています。
          </p>
        </div>
      </section>

      <section class="section tight">
        <div class="section-heading">
          <p class="eyebrow">How To Read</p>
          <h2>キャラを見る順番</h2>
        </div>
        <div class="quick-strip inline">
          <article>
            <span class="number">01</span>
            <h2>主力武装</h2>
            <p>まず当てに行く武装、拒否に使う武装、着地取りに使う武装を分けて読む。</p>
          </article>
          <article>
            <span class="number">02</span>
            <h2>キャンセル</h2>
            <p>攻め継続、着地ずらし、格闘の伸ばし方に関わるルートだけ先に覚える。</p>
          </article>
          <article>
            <span class="number">03</span>
            <h2>凸効果</h2>
            <p>武装追加、弾数増加、キャンセル解禁など、使用感が変わる凸を優先して確認。</p>
          </article>
        </div>
      </section>

      <section class="section tight">
        <div class="section-heading">
          <p class="eyebrow">Roster</p>
          <h2>キャラ一覧</h2>
        </div>
        <div class="source-note">
          <strong>参照元</strong>
          <span>atwikiトップのキャラクター一覧から、${characters.length}キャラ分の個別ページを作成しました。</span>
        </div>
        <div class="roster-tools" role="search">
          <label for="character-search">キャラ検索</label>
          <input id="character-search" type="search" placeholder="例: グリフィン / 2.5 / コラボ" />
        </div>
        <div class="db-stats">
          <article><strong>${characters.length}</strong><span>キャラ</span></article>
          <article><strong>${Object.values(moveData).reduce((sum, item) => sum + (item.shooting?.length ?? 0), 0)}</strong><span>射撃データ</span></article>
          <article><strong>${Object.values(moveData).reduce((sum, item) => sum + (item.melee?.length ?? 0), 0)}</strong><span>格闘データ</span></article>
          <article><strong>${Object.values(moveData).reduce((sum, item) => sum + (item.burst?.length ?? 0), 0)}</strong><span>覚醒データ</span></article>
        </div>
${grouped}
      </section>
    </main>

${footer}
    <script src="script.js"></script>
  </body>
</html>
`;

if (!fs.existsSync(characterDir)) {
  fs.mkdirSync(characterDir);
}

for (const file of fs.readdirSync(".")) {
  if (/^character-.+\.html$/.test(file)) {
    fs.unlinkSync(file);
  }
}

for (const file of fs.readdirSync(characterDir)) {
  if (file.endsWith(".html")) {
    fs.unlinkSync(`${characterDir}/${file}`);
  }
}

for (const character of characters) {
  fs.writeFileSync(pageName(character), characterPage(character), "utf8");
}

fs.writeFileSync("characters.html", charactersIndex, "utf8");
fs.writeFileSync("characters-data.json", `${JSON.stringify(characters, null, 2)}\n`, "utf8");
console.log(`Generated ${characters.length} character pages.`);
