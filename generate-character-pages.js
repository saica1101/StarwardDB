const fs = require("fs");
const moveData = fs.existsSync("wiki-move-data.json") ? JSON.parse(fs.readFileSync("wiki-move-data.json", "utf8")) : {};
const sheetData = fs.existsSync("character-sheet-data.json") ? JSON.parse(fs.readFileSync("character-sheet-data.json", "utf8")) : {};
const characterDir = "characters";

const characters = [
  { name: "グリフィン", cost: "3.0", slug: "griffin" },
  { name: "ヒカリ", cost: "3.0", slug: "hikari" },
  { name: "エルフィン", cost: "3.0", slug: "elfin" },
  { name: "ケルビム", cost: "3.0", slug: "cherubim" },
  { name: "シュウウ", cost: "3.0", slug: "shuuu" },
  { name: "スズラン", cost: "3.0", slug: "suzuran" },
  { name: "キャヴァリー", cost: "3.0", slug: "cavalry" },
  { name: "ラジエル", cost: "3.0", slug: "raziel" },
  { name: "影", cost: "3.0", slug: "kage" },
  { name: "ライン", cost: "3.0", slug: "line" },
  { name: "ロタ", cost: "3.0", slug: "rota" },
  { name: "イーザー", cost: "3.0", slug: "ether" },
  { name: "秋雲", cost: "3.0", slug: "aki-gumo" },
  { name: "ベータ-ロンギヌス", cost: "3.0", slug: "beta-longinus" },
  { name: "キャミィ", cost: "3.0", slug: "cammy" },
  { name: "セイレン", cost: "3.0", slug: "seiren" },
  { name: "無銘", cost: "3.0", slug: "mumei" },
  { name: "アカツキ", cost: "3.0", slug: "akatsuki" },
  { name: "ヴォイドセーバー", cost: "3.0", slug: "void-saber", note: "期間限定" },
  { name: "フリード", cost: "2.5", slug: "freed" },
  { name: "カゼ", cost: "2.5", slug: "kaze" },
  { name: "シャオリン", cost: "2.5", slug: "shaolin" },
  { name: "シャープ", cost: "2.5", slug: "sharp" },
  { name: "アリス", cost: "2.5", slug: "alice" },
  { name: "スカイセーバー", cost: "2.5", slug: "sky-saber" },
  { name: "十八号", cost: "2.5", slug: "no-18" },
  { name: "シグナス", cost: "2.5", slug: "cygnus" },
  { name: "アンジェリス", cost: "2.5", slug: "angelis" },
  { name: "ヴァルキア", cost: "2.5", slug: "valkia" },
  { name: "エヴァ", cost: "2.5", slug: "eva" },
  { name: "轟雷改", cost: "2.5", slug: "gourai-kai", note: "コラボ" },
  { name: "稲", cost: "2.5", slug: "ina" },
  { name: "バーゼラルド", cost: "2.5", slug: "baselard", note: "コラボ" },
  { name: "ノーラ", cost: "2.5", slug: "nora" },
  { name: "ランスロット", cost: "2.5", slug: "lancelot" },
  { name: "サンダーボルト・OTOME", cost: "2.5", slug: "thunderbolt-otome", note: "コラボ" },
  { name: "ガラハッド・暁", cost: "2.5", slug: "galahad-akatsuki", note: "コラボ" },
  { name: "デッド・アライブ", cost: "2.5", slug: "dead-alive", note: "コラボ" },
  { name: "ハルカ", cost: "2.5", slug: "haruka" },
  { name: "ドラグナー", cost: "2.5", slug: "dragner" },
  { name: "レキ", cost: "2.5", slug: "reki", note: "コラボ" },
  { name: "ブラック★ロックシューター", cost: "2.5", slug: "black-rock-shooter", note: "コラボ" },
  { name: "デッドマスター", cost: "2.5", slug: "dead-master", note: "コラボ" },
  { name: "ベータ", cost: "2.0", slug: "beta" },
  { name: "デュカリオン", cost: "2.0", slug: "deucalion" },
  { name: "セラフィム", cost: "2.0", slug: "seraphim" },
  { name: "アイーダ", cost: "2.0", slug: "aida" },
  { name: "パラス", cost: "2.0", slug: "pallas" },
  { name: "スコーピオン", cost: "2.0", slug: "scorpion" },
  { name: "ヴァーチェ", cost: "2.0", slug: "virtue" },
  { name: "ザハロワ", cost: "2.0", slug: "zaharowa" },
  { name: "咲迦", cost: "2.0", slug: "sakuya" },
  { name: "チンニ", cost: "2.0", slug: "qinni" },
  { name: "ダークスター", cost: "2.0", slug: "darkstar" },
  { name: "ヒビキ", cost: "2.0", slug: "hibiki" },
  { name: "スティレット", cost: "2.0", slug: "stylet", note: "コラボ" },
  { name: "ボルゾイ", cost: "2.0", slug: "borzoi", note: "シーズンパス" },
  { name: "キャッティ", cost: "2.0", slug: "catty" },
  { name: "ブリーカー", cost: "2.0", slug: "breaker", note: "シーズンパス" },
  { name: "ガラハッド", cost: "2.0", slug: "galahad", note: "コラボ" },
  { name: "フランカー", cost: "2.0", slug: "flanker", note: "シーズンパス" },
  { name: "アイスリン", cost: "2.0", slug: "icelin", note: "シーズンパス" },
  { name: "クリスタ", cost: "2.0", slug: "crysta" },
  { name: "タチアナ", cost: "2.0", slug: "tatiana", note: "シーズンパス" },
  { name: "フィービー", cost: "2.0", slug: "phoebe", note: "期間限定" },
  { name: "オーキッド", cost: "1.5", slug: "orchid" },
  { name: "スノーウォル", cost: "1.5", slug: "snow-wal" },
  { name: "カタリナ", cost: "1.5", slug: "katarina" },
  { name: "ローランド", cost: "1.5", slug: "roland" },
  { name: "ヤミン", cost: "1.5", slug: "yamin" },
];

const esc = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const youtubeSearch = (name) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(`星の翼 ${name}`)}`;
const wikiPageName = (name) =>
  ({
    "ヴァルキア": "ヴァルキア_通常時",
    "セラフィム": "セラフィム_巡遊状態",
  }[name] ?? name);
const wikiUrl = (name) => `https://starward.wikiru.jp/?${wikiPageName(name)}`;

characters.forEach((character) => {
  character.url = wikiUrl(character.name);
});

const pageName = (character) => `${characterDir}/${character.slug}.html`;
const artPaths = {
  "aida": "tools/apps/shared/characters/20/Aida.png",
  "akatsuki": "tools/apps/shared/characters/30/akatuki.png",
  "aki-gumo": "tools/apps/shared/characters/30/Akigumo.png",
  "alice": "tools/apps/shared/characters/25/Aliz.png",
  "angelis": "tools/apps/shared/characters/25/Angelis.png",
  "baselard": "tools/apps/shared/characters/25/baze.png",
  "beta-longinus": "tools/apps/shared/characters/30/LonginusBeta.png",
  "beta": "tools/apps/shared/characters/20/Beta.png",
  "black-rock-shooter": "tools/apps/shared/characters/25/BRS.png",
  "borzoi": "tools/apps/shared/characters/20/Borzoi.png",
  "breaker": "tools/apps/shared/characters/20/Breaker.png",
  "cammy": "tools/apps/shared/characters/30/Cammy.png",
  "catty": "tools/apps/shared/characters/20/Kitty.png",
  "cavalry": "tools/apps/shared/characters/30/Cavalry.png",
  "cherubim": "tools/apps/shared/characters/30/Cherub.png",
  "crysta": "tools/apps/shared/characters/20/kurisu.png",
  "cygnus": "tools/apps/shared/characters/25/Cygnus.png",
  "darkstar": "tools/apps/shared/characters/20/Darkstar.png",
  "dead-alive": "tools/apps/shared/characters/25/DeadAlive.png",
  "dead-master": "tools/apps/shared/characters/25/DeadMaster.png",
  "deucalion": "tools/apps/shared/characters/20/Deucalion.png",
  "dragner": "tools/apps/shared/characters/25/doragu.png",
  "elfin": "tools/apps/shared/characters/30/Elfin.png",
  "ether": "tools/apps/shared/characters/30/Ether.png",
  "eva": "tools/apps/shared/characters/25/Iva.png",
  "flanker": "tools/apps/shared/characters/20/Franca.png",
  "freed": "tools/apps/shared/characters/25/Ffreedo.png",
  "galahad-akatsuki": "tools/apps/shared/characters/25/sirogara-Photoroom.png",
  "galahad": "tools/apps/shared/characters/20/kuro.png",
  "gourai-kai": "tools/apps/shared/characters/25/gouraikai.png",
  "griffin": "tools/apps/shared/characters/30/Griffin.png",
  "haruka": "tools/apps/shared/characters/25/haruka.png",
  "hibiki": "tools/apps/shared/characters/20/Hibiki.png",
  "hikari": "tools/apps/shared/characters/30/Hikari.png",
  "icelin": "tools/apps/shared/characters/20/ice.png",
  "ina": "tools/apps/shared/characters/25/Ine.png",
  "kage": "tools/apps/shared/characters/30/Shadow.png",
  "katarina": "tools/apps/shared/characters/15/Katerina.png",
  "kaze": "tools/apps/shared/characters/25/Kaze.png",
  "lancelot": "tools/apps/shared/characters/25/Lancelot.png",
  "line": "tools/apps/shared/characters/30/Rhine.png",
  "mumei": "tools/apps/shared/characters/30/Mumei.png",
  "no-18": "tools/apps/shared/characters/25/XVIII.png",
  "nora": "tools/apps/shared/characters/25/Nora.png",
  "orchid": "tools/apps/shared/characters/15/Orchid.png",
  "pallas": "tools/apps/shared/characters/20/Pallas.png",
  "phoebe": "tools/apps/shared/characters/20/fibi.png",
  "qinni": "tools/apps/shared/characters/20/Qingni.png",
  "raziel": "tools/apps/shared/characters/30/Rasiel.png",
  "reki": "tools/apps/shared/characters/25/reki.png",
  "roland": "tools/apps/shared/characters/15/Roland.png",
  "rota": "tools/apps/shared/characters/30/Rota.png",
  "sakuya": "tools/apps/shared/characters/20/kuro.png",
  "scorpion": "tools/apps/shared/characters/20/Scorpion.png",
  "seiren": "tools/apps/shared/characters/30/Siren.png",
  "seraphim": "tools/apps/shared/characters/20/Seraph.png",
  "shaolin": "tools/apps/shared/characters/25/Xiaoling.png",
  "sharp": "tools/apps/shared/characters/25/Sharp.png",
  "shuuu": "tools/apps/shared/characters/30/Qiuyu.png",
  "sky-saber": "tools/apps/shared/characters/25/Skysaber.png",
  "snow-wal": "tools/apps/shared/characters/15/Snowowl.png",
  "stylet": "tools/apps/shared/characters/20/suteko.png",
  "suzuran": "tools/apps/shared/characters/30/Convallaria.png",
  "tatiana": "tools/apps/shared/characters/20/tatiana.png",
  "thunderbolt-otome": "tools/apps/shared/characters/25/sanboruto.png",
  "valkia": "tools/apps/shared/characters/25/Valkia.png",
  "virtue": "tools/apps/shared/characters/20/Virtues.png",
  "void-saber": "tools/apps/shared/characters/30/VoidSaber.png",
  "yamin": "tools/apps/shared/characters/15/Yammyn.png",
  "zaharowa": "tools/apps/shared/characters/20/Zakharova.png",
};
const artPath = (character) => artPaths[character.slug] ?? iconPath(character);
const iconFileName = (character) =>
  ({
    "ベータ-ロンギヌス": "ロンギヌス‐ベータ",
  }[character.name] ?? character.name);
const iconPath = (character) => `tools/assets/character-icons-api/${iconFileName(character)}.png`;
const cell = (value) => esc(value ?? "-");
const row = (cells, attrs = "") => `<tr${attrs}>${cells.map((value, index) => (index === 0 ? `<th scope="row">${cell(value)}</th>` : `<td>${cell(value)}</td>`)).join("")}</tr>`;
const rows = (items, fallback) => (items?.length ? items.map(row).join("\n") : fallback);
const formRules = {
  suzuran: ["通常", "満開"],
  cavalry: ["通常", "アサルトモード"],
  griffin: ["通常", "飛翔"],
  line: ["通常", "進化後"],
  seiren: ["通常", "巡遊"],
  mumei: ["通常", "妖刀"],
  "void-saber": ["分離", "合体"],
  freed: ["通常", "騎乗"],
  angelis: ["通常", "神託"],
  valkia: ["通常", "強制暴走"],
  lancelot: ["通常", "蒼炎"],
  "thunderbolt-otome": ["通常", "強化状態"],
  "galahad-akatsuki": ["通常", "アカツキ状態"],
  "dead-alive": ["通常", "デッド・アライブ"],
  haruka: ["通常", "月見草", "紫陽花"],
  dragner: ["通常", "巡航モード"],
  reki: ["通常", "龍影"],
  "black-rock-shooter": ["通常", "砲撃モード"],
  seraphim: ["巡遊状態", "六翼降臨"],
  scorpion: ["通常", "マグマ戦車"],
};
const rowText = (item) => item.join(" ");
const inferRowForm = (slug, section, item, rowIndex, sectionItems) => {
  const text = rowText(item);
  const first = item[0] ?? "";
  const name = item[1] ?? "";

  if (slug === "cavalry" && section === "shooting") {
    const modeStart = sectionItems.findIndex((rowItem) => rowText(rowItem).includes("アサルトモード"));
    if (modeStart >= 0 && rowIndex === modeStart) return "共通";
    return modeStart >= 0 && rowIndex > modeStart ? "アサルトモード" : "通常";
  }
  if (slug === "valkia") return text.includes("強制暴走") ? "強制暴走" : "通常";
  if (slug === "suzuran") return text.includes("満開") || text.includes("赤花満開") ? "満開" : "通常";
  if (slug === "griffin") {
    if (first === "サブ格闘" && name === "飛翔") return "共通";
    return first.includes("飛翔中") || name.includes("飛翔") ? "飛翔" : "通常";
  }
  if (slug === "line") return text.includes("進化後") ? "進化後" : "通常";
  if (slug === "seiren") return text.includes("巡遊") || text.includes("モード中") ? "巡遊" : "通常";
  if (slug === "mumei") return text.includes("妖刀") ? "妖刀" : "通常";
  if (slug === "void-saber") {
    if (text.includes("合体/分離")) return "共通";
    if (text.includes("(合体)") || first.includes("2")) return "合体";
    if (text.includes("(分離)") || first.includes("1")) return "分離";
    return "共通";
  }
  if (slug === "freed") return first === "サブ格闘" && text.includes("魔女騎乗") ? "共通" : text.includes("騎乗") ? "騎乗" : "通常";
  if (slug === "angelis") return text.includes("神託降臨") ? "共通" : text.includes("神託") ? "神託" : "通常";
  if (slug === "lancelot") return text.includes("蒼炎解放") ? "共通" : text.includes("強化中") || text.includes("蒼炎") ? "蒼炎" : "通常";
  if (slug === "thunderbolt-otome") return text.includes("オーバーチャージ・リリース") ? "共通" : text.includes("強化状態") ? "強化状態" : "通常";
  if (slug === "galahad-akatsuki") return text.includes("聖杯の加護") ? "共通" : text.includes("強化状態") || text.includes("アカツキ状態") ? "アカツキ状態" : "通常";
  if (slug === "dead-alive") return first === "後サブ格闘" ? "共通" : text.includes("デッド・アライブ") || text.includes("換装") ? "デッド・アライブ" : "通常";
  if (slug === "haruka") {
    if (text.includes("月見草")) return "月見草";
    if (text.includes("紫陽花")) return "紫陽花";
    return "通常";
  }
  if (slug === "dragner") return first === "サブ格闘" && text.includes("巡航モード") ? "共通" : text.includes("巡航") || text.includes("モード中") || text.includes("変形") ? "巡航モード" : "通常";
  if (slug === "reki") return text.includes("龍影召来") ? "共通" : text.includes("龍影") || text.includes("龍喰") ? "龍影" : "通常";
  if (slug === "black-rock-shooter") return text.includes("星潰し") ? "共通" : text.includes("砲撃モード") ? "砲撃モード" : "通常";
  if (slug === "seraphim") return text.includes("六翼降臨") ? "共通" : text.includes("六翼") ? "六翼降臨" : "巡遊状態";
  if (slug === "scorpion") return first === "サブ格闘" && text.includes("マグマ戦車!") ? "共通" : text.includes("マグマ戦車") ? "マグマ戦車" : "通常";
  return "通常";
};
const formTabs = (character) => {
  const forms = formRules[character.slug] ?? [];
  if (!forms.length) return "";
  return `<div class="move-form-tabs" data-move-form-tabs aria-label="${esc(character.name)}の形態切り替え">
          <button type="button" class="form-tab is-active" data-move-form="all" aria-pressed="true">すべて</button>
          ${forms.map((form) => `<button type="button" class="form-tab" data-move-form="${esc(form)}" aria-pressed="false">${esc(form)}</button>`).join("")}
        </div>`;
};
const sectionRows = (character, type, fallback, colspan) => {
  const data = moveData[character.slug];
  if (data?.[type]?.length) {
    return data[type]
      .map((item, index) => {
        const form = inferRowForm(character.slug, type, item, index, data[type]);
        return row(item, ` data-form-row data-form="${esc(form)}"`);
      })
      .join("\n");
  }
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
        <a href="${base}index.html#contributors">ご協力者様</a>
        <a href="${base}characters.html"${current === "characters.html" ? ' aria-current="page"' : ""}>キャラ</a>
        <a href="${base}videos.html"${current === "videos.html" ? ' aria-current="page"' : ""}>動画</a>
      </nav>
    </header>`;

const footer = `
    <footer class="footer">
      <a href="#top">上へ戻る</a>
    </footer>`;

const weaponTable = (character) => `
      <section class="section tight">
        <div class="section-heading">
          <p class="eyebrow">Move Table</p>
          <h2>武装・格闘・バースト表</h2>
        </div>
        <div class="move-table-panel">
          ${formTabs(character)}
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
              <tr><th scope="row">メイン射撃</th><td>-</td><td>-</td><td>-</td><td>主力牽制、連射、足が止まるかを記入</td></tr>
              <tr><th scope="row">サブ射撃</th><td>-</td><td>-</td><td>-</td><td>着地取り、迎撃、差し込み用途を記入</td></tr>
              <tr><th scope="row">特殊射撃</th><td>-</td><td>-</td><td>-</td><td>時限強化、アシスト、設置などを記入</td></tr>
              <tr><th scope="row">特殊格闘</th><td>-</td><td>-</td><td>-</td><td>移動、派生、降りテク、形態移行を記入</td></tr>`, 5)}
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
              <tr><th scope="row">通常格闘</th><td>-</td><td>N</td><td>-</td><td>-</td><td>出し切り、派生、カット耐性を記入</td></tr>
              <tr><th scope="row">横格闘</th><td>-</td><td>横</td><td>-</td><td>-</td><td>回り込み、差し込み、主力始動かを記入</td></tr>
              <tr><th scope="row">前格闘</th><td>-</td><td>前</td><td>-</td><td>-</td><td>発生、判定、追い性能を記入</td></tr>
              <tr><th scope="row">後格闘</th><td>-</td><td>後</td><td>-</td><td>-</td><td>カウンター、ピョン格、単発火力などを記入</td></tr>
              <tr><th scope="row">派生</th><td>-</td><td>各種</td><td>-</td><td>-</td><td>火力派生、離脱派生、凸解禁派生を記入</td></tr>`, 6)}
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
              <tr><th scope="row">バーストアタック</th><td>-</td><td>F/S/B/MD</td><td>乱舞、単発、換装、回復などを記入</td></tr>
              <tr><th scope="row">後バーストアタック</th><td>-</td><td>-</td><td>後入力版がある場合だけ記入</td></tr>`, 4)}
            </tbody>
          </table>` : ""}
          </div>
        </div>
      </section>`;

const sectionCount = (character, type) => moveData[character.slug]?.[type]?.length ?? 0;
const hp = (character) => sheetData[character.slug]?.hp || "-";
const redlock = (character) => sheetData[character.slug]?.redlock || "-";
const convItems = (character) => sheetData[character.slug]?.conv ?? [];
const constellationList = (character) => {
  const items = convItems(character);
  if (!items.length) return `<li><strong>-</strong><span>未入力</span></li>`;
  return items
    .map((item) => `<li><strong>${cell(item.level)}</strong><span>${cell(item.text)}</span></li>`)
    .join("\n");
};

const characterPage = (character) => `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(character.name)}解説 | 星の翼ガイド</title>
    <meta name="description" content="星の翼の${esc(character.name)}個別解説ページ。コスト、武装、凸効果の確認導線を整理しています。" />
    <link rel="stylesheet" href="../styles.css?v=20260604panel1" />
  </head>
  <body>
${header("characters.html", "../")}

    <main>
      <section class="character-hero">
        <div class="character-hero-inner">
          <a class="back-link" href="../characters.html">キャラ一覧へ戻る</a>
          <p class="eyebrow">Cost ${esc(character.cost)}${character.note ? ` / ${esc(character.note)}` : ""}</p>
          <h1>${esc(character.name)}</h1>
          <p>${esc(character.name)}の基本データと武装表を確認できます。</p>
          <div class="hero-actions">
            <a class="button primary" href="#guide">基本データ</a>
            <a class="button ghost" href="#moves">武装表</a>
            <a class="button ghost" href="${youtubeSearch(character.name)}" target="_blank" rel="noreferrer">動画検索</a>
          </div>
        </div>
        <figure class="character-hero-art" aria-hidden="true">
          <img src="../${esc(artPath(character))}" alt="" loading="eager" decoding="async" />
        </figure>
      </section>

      <section class="section tight" id="guide">
        <div class="character-detail-grid">
          <article class="detail-panel">
            <h2>基本データ</h2>
            <dl class="spec-list">
              <div><dt>コスト</dt><dd>${esc(character.cost)}</dd></div>
              <div><dt>体力</dt><dd>${esc(hp(character))}</dd></div>
              <div><dt>赤ロック</dt><dd>${esc(redlock(character))}</dd></div>
              <div><dt>動画</dt><dd><a href="${youtubeSearch(character.name)}" target="_blank" rel="noreferrer">YouTube検索</a></dd></div>
            </dl>
          </article>
          <article class="detail-panel constellation-panel">
            <h2>凸効果</h2>
            <ol class="constellation-list">
              ${constellationList(character)}
            </ol>
          </article>
        </div>
      </section>

${weaponTable(character).replace('<section class="section tight">', '<section class="section tight" id="moves">')}
    </main>

${footer}
    <script src="../script.js?v=20260604panel1"></script>
  </body>
</html>
`;

const rosterCard = (character) => `
          <article class="roster-card" data-search="${esc(`${character.cost} ${character.name} ${character.note ?? ""}`)}">
            <div class="roster-info"><img class="roster-icon" src="${esc(iconPath(character))}" alt="${esc(character.name)}" loading="lazy" decoding="async"><div class="roster-copy">
              <span class="cost">${esc(character.cost)}${character.note ? ` / ${esc(character.note)}` : ""}</span>
              <h3>${esc(character.name)}</h3>
              <p>射撃${sectionCount(character, "shooting")}件 / 格闘${sectionCount(character, "melee")}件 / 覚醒${sectionCount(character, "burst")}件。要点から詳細表まで確認できます。</p>
            </div></div>
            <div class="card-actions">
              <a href="${pageName(character)}">個別ページ</a>
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
    <title>キャラ別 武装・凸効果 | 星の翼ガイド</title>
    <meta
      name="description"
      content="星の翼のキャラ別に、武装・凸効果とこのサイト用の要点メモをまとめるページです。"
    />
    <link rel="stylesheet" href="styles.css?v=20260604panel1" />
  </head>
  <body>
${header()}

    <main>
      <section class="page-hero compact">
        <div class="page-hero-inner">
          <p class="eyebrow">Character Reference</p>
          <h1>キャラ別 武装・凸効果</h1>
          <p>
            検索、コスト別の開閉、キャラ個別ページをまとめたデータベースです。
          </p>
        </div>
      </section>

      <section class="section tight">
        <div class="section-heading">
          <p class="eyebrow">Roster</p>
          <h2>キャラ一覧</h2>
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
    <script src="script.js?v=20260604panel1"></script>
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
