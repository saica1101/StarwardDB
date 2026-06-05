(() => {
  const root = document.querySelector("#video-library");
  if (!root) return;

  const STORAGE_KEY = "starward-character-video-links-v1";
  const PUBLISH_CACHE_KEY = "starward-video-publish-date-cache-v1";
  const ADMIN_KEY = "starward-video-admin";
  const COSTS = ["3.0", "2.5", "2.0", "1.5"];
  const FALLBACK_CHARACTERS = [{"name":"グリフィン","cost":"3.0","slug":"griffin","url":""},{"name":"ヒカリ","cost":"3.0","slug":"hikari","url":""},{"name":"エルフィン","cost":"3.0","slug":"elfin","url":""},{"name":"ケルビム","cost":"3.0","slug":"cherubim","url":""},{"name":"シュウウ","cost":"3.0","slug":"shuuu","url":""},{"name":"スズラン","cost":"3.0","slug":"suzuran","url":""},{"name":"キャヴァリー","cost":"3.0","slug":"cavalry","url":""},{"name":"ラジエル","cost":"3.0","slug":"raziel","url":""},{"name":"影","cost":"3.0","slug":"kage","url":""},{"name":"ライン","cost":"3.0","slug":"line","url":""},{"name":"ロタ","cost":"3.0","slug":"rota","url":""},{"name":"イーザー","cost":"3.0","slug":"ether","url":""},{"name":"秋雲","cost":"3.0","slug":"aki-gumo","url":""},{"name":"ベータ-ロンギヌス","cost":"3.0","slug":"beta-longinus","url":""},{"name":"キャミィ","cost":"3.0","slug":"cammy","url":""},{"name":"セイレン","cost":"3.0","slug":"seiren","url":""},{"name":"無銘","cost":"3.0","slug":"mumei","url":""},{"name":"アカツキ","cost":"3.0","slug":"akatsuki","url":""},{"name":"ヴォイドセーバー","cost":"3.0","slug":"void-saber","url":""},{"name":"フリード","cost":"2.5","slug":"freed","url":""},{"name":"カゼ","cost":"2.5","slug":"kaze","url":""},{"name":"シャオリン","cost":"2.5","slug":"shaolin","url":""},{"name":"シャープ","cost":"2.5","slug":"sharp","url":""},{"name":"アリス","cost":"2.5","slug":"alice","url":""},{"name":"スカイセーバー","cost":"2.5","slug":"sky-saber","url":""},{"name":"十八号","cost":"2.5","slug":"no-18","url":""},{"name":"シグナス","cost":"2.5","slug":"cygnus","url":""},{"name":"アンジェリス","cost":"2.5","slug":"angelis","url":""},{"name":"ヴァルキア","cost":"2.5","slug":"valkia","url":""},{"name":"エヴァ","cost":"2.5","slug":"eva","url":""},{"name":"轟雷改","cost":"2.5","slug":"gourai-kai","url":""},{"name":"稲","cost":"2.5","slug":"ina","url":""},{"name":"バーゼラルド","cost":"2.5","slug":"baselard","url":""},{"name":"ノーラ","cost":"2.5","slug":"nora","url":""},{"name":"ランスロット","cost":"2.5","slug":"lancelot","url":""},{"name":"サンダーボルト・OTOME","cost":"2.5","slug":"thunderbolt-otome","url":""},{"name":"ガラハッド・暁","cost":"2.5","slug":"galahad-akatsuki","url":""},{"name":"デッド・アライブ","cost":"2.5","slug":"dead-alive","url":""},{"name":"ハルカ","cost":"2.5","slug":"haruka","url":""},{"name":"ドラグナー","cost":"2.5","slug":"dragner","url":""},{"name":"レキ","cost":"2.5","slug":"reki","url":""},{"name":"ブラック★ロックシューター","cost":"2.5","slug":"black-rock-shooter","url":""},{"name":"デッドマスター","cost":"2.5","slug":"dead-master","url":""},{"name":"ベータ","cost":"2.0","slug":"beta","url":""},{"name":"デュカリオン","cost":"2.0","slug":"deucalion","url":""},{"name":"セラフィム","cost":"2.0","slug":"seraphim","url":""},{"name":"アイーダ","cost":"2.0","slug":"aida","url":""},{"name":"パラス","cost":"2.0","slug":"pallas","url":""},{"name":"スコーピオン","cost":"2.0","slug":"scorpion","url":""},{"name":"ヴァーチェ","cost":"2.0","slug":"virtue","url":""},{"name":"ザハロワ","cost":"2.0","slug":"zaharowa","url":""},{"name":"咲迦","cost":"2.0","slug":"sakuya","url":""},{"name":"チンニ","cost":"2.0","slug":"qinni","url":""},{"name":"ダークスター","cost":"2.0","slug":"darkstar","url":""},{"name":"ヒビキ","cost":"2.0","slug":"hibiki","url":""},{"name":"スティレット","cost":"2.0","slug":"stylet","url":""},{"name":"ボルゾイ","cost":"2.0","slug":"borzoi","url":""},{"name":"キャッティ","cost":"2.0","slug":"catty","url":""},{"name":"ブリーカー","cost":"2.0","slug":"breaker","url":""},{"name":"ガラハッド","cost":"2.0","slug":"galahad","url":""},{"name":"フランカー","cost":"2.0","slug":"flanker","url":""},{"name":"アイスリン","cost":"2.0","slug":"icelin","url":""},{"name":"クリスタ","cost":"2.0","slug":"crysta","url":""},{"name":"タチアナ","cost":"2.0","slug":"tatiana","url":""},{"name":"フィービー","cost":"2.0","slug":"phoebe","url":""},{"name":"オーキッド","cost":"1.5","slug":"orchid","url":""},{"name":"スノーウォル","cost":"1.5","slug":"snow-wal","url":""},{"name":"カタリナ","cost":"1.5","slug":"katarina","url":""},{"name":"ローランド","cost":"1.5","slug":"roland","url":""},{"name":"ヤミン","cost":"1.5","slug":"yamin","url":""}];

  const CHARACTER_ART_PATHS = {
    aida: "tools/apps/shared/characters/20/Aida.png",
    akatsuki: "tools/apps/shared/characters/30/akatuki.png",
    "aki-gumo": "tools/apps/shared/characters/30/Akigumo.png",
    alice: "tools/apps/shared/characters/25/Aliz.png",
    angelis: "tools/apps/shared/characters/25/Angelis.png",
    baselard: "tools/apps/shared/characters/25/baze.png",
    beta: "tools/apps/shared/characters/20/Beta.png",
    "beta-longinus": "tools/apps/shared/characters/30/LonginusBeta.png",
    "black-rock-shooter": "tools/apps/shared/characters/25/BRS.png",
    borzoi: "tools/apps/shared/characters/20/Borzoi.png",
    breaker: "tools/apps/shared/characters/20/Breaker.png",
    cammy: "tools/apps/shared/characters/30/Cammy.png",
    catty: "tools/apps/shared/characters/20/Kitty.png",
    cavalry: "tools/apps/shared/characters/30/Cavalry.png",
    cherubim: "tools/apps/shared/characters/30/Cherub.png",
    crysta: "tools/apps/shared/characters/20/kurisu.png",
    cygnus: "tools/apps/shared/characters/25/Cygnus.png",
    darkstar: "tools/apps/shared/characters/20/Darkstar.png",
    "dead-alive": "tools/apps/shared/characters/25/DeadAlive.png",
    "dead-master": "tools/apps/shared/characters/25/DeadMaster.png",
    deucalion: "tools/apps/shared/characters/20/Deucalion.png",
    dragner: "tools/apps/shared/characters/25/doragu.png",
    elfin: "tools/apps/shared/characters/30/Elfin.png",
    ether: "tools/apps/shared/characters/30/Ether.png",
    eva: "tools/apps/shared/characters/25/Iva.png",
    flanker: "tools/apps/shared/characters/20/Franca.png",
    freed: "tools/apps/shared/characters/25/Ffreedo.png",
    "galahad-akatsuki": "tools/apps/shared/characters/25/sirogara-Photoroom.png",
    galahad: "tools/apps/shared/characters/20/kuro.png",
    "gourai-kai": "tools/apps/shared/characters/25/gouraikai.png",
    griffin: "tools/apps/shared/characters/30/Griffin.png",
    haruka: "tools/apps/shared/characters/25/haruka.png",
    hibiki: "tools/apps/shared/characters/20/Hibiki.png",
    hikari: "tools/apps/shared/characters/30/Hikari.png",
    icelin: "tools/apps/shared/characters/20/ice.png",
    ina: "tools/apps/shared/characters/25/Ine.png",
    kage: "tools/apps/shared/characters/30/Shadow.png",
    katarina: "tools/apps/shared/characters/15/Katerina.png",
    kaze: "tools/apps/shared/characters/25/Kaze.png",
    lancelot: "tools/apps/shared/characters/25/Lancelot.png",
    line: "tools/apps/shared/characters/30/Rhine.png",
    mumei: "tools/apps/shared/characters/30/Mumei.png",
    "no-18": "tools/apps/shared/characters/25/XVIII.png",
    nora: "tools/apps/shared/characters/25/Nora.png",
    orchid: "tools/apps/shared/characters/15/Orchid.png",
    pallas: "tools/apps/shared/characters/20/Pallas.png",
    phoebe: "tools/apps/shared/characters/20/fibi.png",
    qinni: "tools/apps/shared/characters/20/Qingni.png",
    raziel: "tools/apps/shared/characters/30/Rasiel.png",
    reki: "tools/apps/shared/characters/25/reki.png",
    roland: "tools/apps/shared/characters/15/Roland.png",
    rota: "tools/apps/shared/characters/30/Rota.png",
    sakuya: "tools/apps/shared/characters/20/Emika.png",
    scorpion: "tools/apps/shared/characters/20/Scorpion.png",
    seiren: "tools/apps/shared/characters/30/Siren.png",
    seraphim: "tools/apps/shared/characters/20/Seraph.png",
    shaolin: "tools/apps/shared/characters/25/Xiaoling.png",
    sharp: "tools/apps/shared/characters/25/Sharp.png",
    shuuu: "tools/apps/shared/characters/30/Qiuyu.png",
    "sky-saber": "tools/apps/shared/characters/25/Skysaber.png",
    "snow-wal": "tools/apps/shared/characters/15/Snowowl.png",
    stylet: "tools/apps/shared/characters/20/suteko.png",
    suzuran: "tools/apps/shared/characters/30/Convallaria.png",
    tatiana: "tools/apps/shared/characters/20/tatiana.png",
    "thunderbolt-otome": "tools/apps/shared/characters/25/sanboruto.png",
    valkia: "tools/apps/shared/characters/25/Valkia.png",
    virtue: "tools/apps/shared/characters/20/Virtues.png",
    "void-saber": "tools/apps/shared/characters/30/VoidSaber.png",
    yamin: "tools/apps/shared/characters/15/Yammyn.png",
    zaharowa: "tools/apps/shared/characters/20/Zakharova.png",
  };

  const wikiPageName = (name) =>
    ({
      "ヴァルキア": "ヴァルキア_通常時",
      "セラフィム": "セラフィム_巡遊状態",
    }[name] ?? name);
  const wikiUrl = (name) => `https://starward.wikiru.jp/?${wikiPageName(name)}`;

  FALLBACK_CHARACTERS.forEach((character) => {
    character.url = wikiUrl(character.name);
  });

  const state = {
    characters: [],
    cost: "3.0",
    selectedSlug: "",
    channelFilter: "all",
    hideEmpty: false,
    admin: loadAdminMode(),
    editing: null,
    library: loadLibrary(),
  };

  const els = {
    costTabs: document.querySelector("#video-cost-tabs"),
    characterList: document.querySelector("#video-character-list"),
    selectedName: document.querySelector("#video-selected-name"),
    selectedCost: document.querySelector("#video-selected-cost"),
    list: document.querySelector("#registered-video-list"),
    form: document.querySelector("#video-register-form"),
    channelForm: document.querySelector("#video-channel-form"),
    channelName: document.querySelector("#channel-name"),
    channelUrl: document.querySelector("#channel-url"),
    channelIcon: document.querySelector("#channel-icon"),
    channelSelect: document.querySelector("#video-channel"),
    channelFilter: document.querySelector("#channel-filter"),
    channelList: document.querySelector("#video-channel-list"),
    hideEmpty: document.querySelector("#video-hide-empty"),
    title: document.querySelector("#video-title"),
    url: document.querySelector("#video-url"),
    note: document.querySelector("#video-note"),
    submitButton: document.querySelector("#video-register-form button[type='submit']"),
    editCancel: document.querySelector("#video-edit-cancel"),
    exportButton: document.querySelector("#video-export"),
    importInput: document.querySelector("#video-import"),
    adminStatus: document.querySelector("#video-admin-status"),
    adminLock: document.querySelector("#video-admin-lock"),
  };
  const publishLookups = new Set();

  function loadAdminMode() {
    const params = new URLSearchParams(location.search);
    if (params.get("admin") === "1") {
      try {
        if (sessionStorage.getItem(ADMIN_KEY) === "1" || sessionStorage.getItem("starward-site-admin") === "1") return true;
      } catch {}
      const password = prompt("管理パスワード");
      if (password !== "xzyjp") return false;
      try {
        sessionStorage.setItem(ADMIN_KEY, "1");
        sessionStorage.setItem("starward-site-admin", "1");
      } catch {}
      return true;
    }
    try {
      return sessionStorage.getItem(ADMIN_KEY) === "1";
    } catch {
      return false;
    }
  }

  function saveAdminMode(enabled) {
    try {
      if (enabled) sessionStorage.setItem(ADMIN_KEY, "1");
      else sessionStorage.removeItem(ADMIN_KEY);
      localStorage.removeItem(ADMIN_KEY);
    } catch {
      // Storage can be unavailable in some embedded previews; the current state still works.
    }
  }

  function syncAdminMode() {
    document.body.classList.toggle("video-admin", state.admin);
    if (els.form) els.form.hidden = !state.admin;
    if (els.channelForm?.closest(".video-channel-panel")) {
      els.channelForm.closest(".video-channel-panel").hidden = !state.admin;
    }
    if (els.exportButton) els.exportButton.hidden = !state.admin;
    const importLabel = document.querySelector('label[for="video-import"]');
    if (importLabel) importLabel.hidden = !state.admin;
    if (els.adminStatus) {
      els.adminStatus.textContent = state.admin ? "管理者モード ON" : "閲覧モード";
      els.adminStatus.title = state.admin ? "登録・編集UIを表示中" : "公開時と同じ表示";
    }
    if (els.editCancel && !state.admin) resetEditing();
  }

  function unlockAdmin() {
    if (state.admin) {
      syncAdminMode();
      return;
    }
    const password = prompt("管理パスワード");
    if (password !== "xzyjp") return;
    state.admin = true;
    saveAdminMode(true);
    syncAdminMode();
    render();
  }

  function lockAdmin() {
    state.admin = false;
    saveAdminMode(false);
    syncAdminMode();
    render();
  }

  window.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "m") {
      event.preventDefault();
      unlockAdmin();
    }
    if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "l") {
      event.preventDefault();
      lockAdmin();
    }
  });

  function loadLibrary() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      if (stored && stored.videos && stored.channels) return stored;
      return { channels: [], videos: stored || {} };
    } catch {
      return { channels: [], videos: {} };
    }
  }

  function hasLibraryContent(library) {
    return Boolean(
      library?.channels?.length ||
      Object.values(library?.videos || {}).some((entries) => Array.isArray(entries) && entries.length)
    );
  }

  function savePublicLibrary() {
    if (!state.admin || typeof fetch !== "function") return;
    fetch("/api/save/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(state.library),
    }).catch((error) => console.warn("video-library-data.json の保存に失敗しました", error));
  }

  async function loadPublicLibrary() {
    if (typeof fetch !== "function") return;
    try {
      const response = await fetch("video-library-data.json?v=20260605adminsync1");
      if (!response.ok) return;
      const data = await response.json();
      const publicLibrary = data?.videos && data?.channels ? data : { channels: [], videos: {} };
      if (hasLibraryContent(publicLibrary)) {
        state.library = publicLibrary;
        if (state.admin) localStorage.setItem(STORAGE_KEY, JSON.stringify(state.library));
      }
    } catch {
      state.library = loadLibrary();
    }
  }

  function saveLibrary() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.library));
    savePublicLibrary();
  }

  function loadPublishCache() {
    try {
      return JSON.parse(localStorage.getItem(PUBLISH_CACHE_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function savePublishCache(cache) {
    localStorage.setItem(PUBLISH_CACHE_KEY, JSON.stringify(cache));
  }

  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[char]);
  }

  function selectedCharacter() {
    return state.characters.find((char) => char.slug === state.selectedSlug) || state.characters[0];
  }

  function requestedCharacterSlug() {
    const params = new URLSearchParams(location.search);
    return params.get("character") || params.get("slug") || "";
  }

  function iconFor(char) {
    const aliases = {
      "ベータ-ロンギヌス": "ロンギヌス‐ベータ",
    };
    return `tools/assets/character-icons-api/${aliases[char.name] || char.name}.png`;
  }

  function characterArtFor(char) {
    return CHARACTER_ART_PATHS[char.slug] || iconFor(char);
  }

  function videosForSlug(slug) {
    return state.library.videos[slug] || [];
  }

  function visibleVideosForSlug(slug) {
    const entries = videosForSlug(slug);
    if (state.channelFilter === "all") return entries;
    return entries.filter((entry) => entry.channelId === state.channelFilter);
  }

  function channelName(id) {
    return state.library.channels.find((channel) => channel.id === id)?.name || "未設定";
  }

  function channelById(id) {
    return state.library.channels.find((channel) => channel.id === id) || null;
  }

  function channelUrl(id) {
    return state.library.channels.find((channel) => channel.id === id)?.url || "";
  }

  function faviconFor(url) {
    try {
      const host = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?sz=96&domain=${encodeURIComponent(host)}`;
    } catch {
      return "";
    }
  }

  function channelIconFor(channel) {
    if (!channel) return "";
    return channel.icon || faviconFor(channel.url);
  }

  function youtubeVideoId(url) {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.replace(/^www\./, "");
      if (host === "youtu.be") return parsed.pathname.split("/").filter(Boolean)[0] || "";
      if (!host.includes("youtube.com")) return "";
      if (parsed.pathname === "/watch") return parsed.searchParams.get("v") || "";
      const parts = parsed.pathname.split("/").filter(Boolean);
      const marker = parts.findIndex((part) => ["shorts", "embed", "live"].includes(part));
      return marker >= 0 ? parts[marker + 1] || "" : "";
    } catch {
      return "";
    }
  }

  function thumbnailCandidatesFor(url) {
    const id = youtubeVideoId(url);
    if (!id) return [];
    const safeId = encodeURIComponent(id);
    return [
      `https://i.ytimg.com/vi/${safeId}/maxresdefault.jpg`,
      `https://i.ytimg.com/vi/${safeId}/sddefault.jpg`,
      `https://i.ytimg.com/vi/${safeId}/hqdefault.jpg`,
      `https://i.ytimg.com/vi/${safeId}/mqdefault.jpg`,
    ];
  }

  function thumbnailFor(url) {
    return thumbnailCandidatesFor(url)[0] || "";
  }

  window.starwardVideoThumbFallback = (img) => {
    const fallbacks = (img.dataset.thumbFallbacks || "").split("|").filter(Boolean);
    const next = fallbacks.shift();
    if (!next) {
      img.onerror = null;
      img.onload = null;
      return;
    }
    img.dataset.thumbFallbacks = fallbacks.join("|");
    img.src = next;
  };

  window.starwardVideoThumbLoaded = (img) => {
    if (img.dataset.thumbChecked === img.currentSrc) return;
    img.dataset.thumbChecked = img.currentSrc;
    if (img.naturalWidth <= 160 || img.naturalHeight <= 100) {
      window.starwardVideoThumbFallback(img);
    }
  };

  function thumbnailFallbackAttr(url) {
    const fallbacks = thumbnailCandidatesFor(url).slice(1);
    return fallbacks.length
      ? ` data-thumb-fallbacks="${esc(fallbacks.join("|"))}" onerror="window.starwardVideoThumbFallback && window.starwardVideoThumbFallback(this)" onload="window.starwardVideoThumbLoaded && window.starwardVideoThumbLoaded(this)"`
      : "";
  }

  function formatDate(value) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  function extractPublishDate(text) {
    const patterns = [
      /views\s*•\s*([A-Z][a-z]{2}\s+\d{1,2},\s+\d{4})\s*•/,
      /(?:Premiered|Streamed live on|Published on|Released on)\s+([A-Z][a-z]{2}\s+\d{1,2},\s+\d{4})/i,
      /"publishDate"\s*:\s*"(\d{4}-\d{2}-\d{2})"/,
      /"uploadDate"\s*:\s*"(\d{4}-\d{2}-\d{2})"/,
    ];
    for (const pattern of patterns) {
      const match = text.match(pattern);
      const formatted = formatDate(match?.[1]);
      if (formatted) return formatted;
    }
    return "";
  }

  async function fetchPublishDate(url) {
    const id = youtubeVideoId(url);
    if (!id || typeof fetch !== "function") return "";
    const cache = loadPublishCache();
    if (cache[id]) return cache[id];

    const endpoints = [
      `/api/youtube-date?id=${encodeURIComponent(id)}`,
      `https://r.jina.ai/http://https://www.youtube.com/watch?v=${encodeURIComponent(id)}`,
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint);
        if (!response.ok) continue;
        const text = await response.text();
        let publishedAt = "";
        if (text.trim().startsWith("{")) {
          publishedAt = JSON.parse(text).publishedAt || "";
        } else {
          publishedAt = extractPublishDate(text);
        }
        if (publishedAt) {
          cache[id] = publishedAt;
          savePublishCache(cache);
          return publishedAt;
        }
      } catch {
        // Try the next endpoint.
      }
    }

    return "";
  }

  function hydratePublishDates(slug, entries) {
    entries.forEach((entry) => {
      if (entry.publishedAt || !youtubeVideoId(entry.url)) return;
      const key = `${slug}:${entry.id}`;
      if (publishLookups.has(key)) return;
      publishLookups.add(key);
      fetchPublishDate(entry.url).then((publishedAt) => {
        publishLookups.delete(key);
        if (!publishedAt) return;
        const target = videosForSlug(slug).find((video) => video.id === entry.id);
        if (!target || target.publishedAt) return;
        target.publishedAt = publishedAt;
        saveLibrary();
        render();
      });
    });
  }

  function resetEditing() {
    state.editing = null;
    els.form?.reset();
    if (els.submitButton) els.submitButton.textContent = "このキャラに登録";
    if (els.editCancel) els.editCancel.hidden = true;
  }

  function beginEditing(slug, id) {
    const entry = videosForSlug(slug).find((video) => video.id === id);
    if (!entry) return;
    state.selectedSlug = slug;
    state.editing = { slug, id };
    els.channelSelect.value = entry.channelId || "";
    els.title.value = entry.title || "";
    els.url.value = entry.url || "";
    els.note.value = entry.note || "";
    if (els.submitButton) els.submitButton.textContent = "この内容で更新";
    if (els.editCancel) els.editCancel.hidden = false;
    els.form?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function moveVideo(slug, id, direction) {
    const entries = videosForSlug(slug);
    const visibleEntries = visibleVideosForSlug(slug);
    const visibleIndex = visibleEntries.findIndex((video) => video.id === id);
    const neighbor = visibleEntries[visibleIndex + direction];
    if (!neighbor) return;
    const index = entries.findIndex((video) => video.id === id);
    const nextIndex = entries.findIndex((video) => video.id === neighbor.id);
    if (index < 0 || nextIndex < 0 || nextIndex >= entries.length) return;
    [entries[index], entries[nextIndex]] = [entries[nextIndex], entries[index]];
    saveLibrary();
    render();
  }

  function renderCostTabs() {
    const counts = state.characters.reduce((acc, char) => {
      acc[char.cost] = (acc[char.cost] || 0) + 1;
      return acc;
    }, {});

    els.costTabs.innerHTML = COSTS
      .filter((cost) => counts[cost])
      .map((cost) => (
        `<button type="button" class="${cost === state.cost ? "is-active" : ""}" data-cost="${esc(cost)}">COST ${esc(cost)}</button>`
      ))
      .join("");

    els.costTabs.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        resetEditing();
        state.cost = button.dataset.cost;
        const first = state.characters.find((char) => char.cost === state.cost);
        state.selectedSlug = first?.slug || "";
        render();
      });
    });
  }

  function renderCharacters() {
    const chars = state.characters.filter((char) => {
      if (char.cost !== state.cost) return false;
      return !state.hideEmpty || visibleVideosForSlug(char.slug).length > 0;
    });
    els.characterList.innerHTML = chars.map((char) => {
      const active = char.slug === state.selectedSlug ? " is-active" : "";
      const count = visibleVideosForSlug(char.slug).length;
      const status = count > 0 ? " has-videos" : " is-empty";
      return `
        <button type="button" class="video-character-button${active}${status}" data-slug="${esc(char.slug)}" title="${esc(char.name)}">
          <img src="${esc(iconFor(char))}" alt="" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'video-character-fallback',textContent:'${esc(char.name.slice(0, 1))}'}))">
          ${count ? `<strong class="video-character-count">${count}</strong>` : ""}
          <span>${esc(char.name)}</span>
        </button>
      `;
    }).join("");

    els.characterList.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        resetEditing();
        state.selectedSlug = button.dataset.slug;
        render();
      });
    });
  }

  function renderChannels() {
    const options = [
      `<option value="all">すべてのチャンネル</option>`,
      ...state.library.channels.map((channel) => `<option value="${esc(channel.id)}">${esc(channel.name)}</option>`),
    ].join("");

    els.channelFilter.innerHTML = options;
    els.channelFilter.value = state.channelFilter;
    els.channelSelect.innerHTML = state.library.channels.length
      ? state.library.channels.map((channel) => `<option value="${esc(channel.id)}">${esc(channel.name)}</option>`).join("")
      : `<option value="">先にチャンネルを登録</option>`;
    els.channelSelect.disabled = !state.library.channels.length;

    els.channelList.innerHTML = state.library.channels.length
      ? state.library.channels.map((channel) => `
        <span class="video-channel-pill">
          ${channelIconFor(channel) ? `<img src="${esc(channelIconFor(channel))}" alt="">` : ""}
          ${esc(channel.name)}
          <button type="button" data-icon-channel="${esc(channel.id)}">画像</button>
          <button type="button" data-delete-channel="${esc(channel.id)}">x</button>
        </span>
      `).join("")
      : `<span class="video-channel-pill">未登録</span>`;

    els.channelList.querySelectorAll("[data-icon-channel]").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.dataset.iconChannel;
        const channel = channelById(id);
        if (!channel) return;
        const icon = prompt("チャンネルアイコン画像のURL", channel.icon || "");
        if (icon === null) return;
        channel.icon = icon.trim();
        saveLibrary();
        render();
      });
    });

    els.channelList.querySelectorAll("[data-delete-channel]").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.dataset.deleteChannel;
        state.library.channels = state.library.channels.filter((channel) => channel.id !== id);
        for (const entries of Object.values(state.library.videos)) {
          entries.forEach((entry) => {
            if (entry.channelId === id) entry.channelId = "";
          });
        }
        if (state.channelFilter === id) state.channelFilter = "all";
        saveLibrary();
        render();
      });
    });
  }

  function renderRegisteredVideos() {
    const char = selectedCharacter();
    if (!char) return;
    const entries = visibleVideosForSlug(char.slug);
    hydratePublishDates(char.slug, entries);

    els.selectedName.textContent = state.admin ? char.name : `${char.name}の動画`;
    els.selectedCost.textContent = `COST ${char.cost}`;
    const artHtml = `<figure class="video-selected-art" aria-hidden="true">
      <img src="${esc(characterArtFor(char))}" alt="" loading="lazy">
    </figure>`;
    const selectedArt = els.selectedCost.previousElementSibling?.classList?.contains("video-selected-art")
      ? els.selectedCost.previousElementSibling
      : null;
    if (selectedArt) selectedArt.remove();
    els.selectedCost.insertAdjacentHTML("beforebegin", artHtml);

    if (!entries.length) {
      els.list.innerHTML = `<div class="registered-empty">このキャラに登録された動画はまだありません。</div>`;
      return;
    }

    const cardsHtml = entries.map((entry) => {
      const channel = channelById(entry.channelId);
      const icon = channelIconFor(channel);
      const thumbnail = thumbnailFor(entry.url);
      const channelLink = channelUrl(entry.channelId);
      const channelIconHtml = icon
        ? `<img src="${esc(icon)}" alt="" onerror="this.classList.add('is-hidden')">`
        : `<span>${esc(channelName(entry.channelId).slice(0, 1))}</span>`;
      return `
      <article class="registered-video-card" data-id="${esc(entry.id)}">
        ${channelLink
          ? `<a class="registered-video-channel" href="${esc(channelLink)}" target="_blank" rel="noreferrer" aria-label="${esc(channelName(entry.channelId))}のチャンネルを開く">${channelIconHtml}</a>`
          : `<div class="registered-video-channel">${channelIconHtml}</div>`}
        <div class="registered-video-body">
          <h4>${esc(entry.title)}</h4>
          <div><span class="tag">${esc(channelName(entry.channelId))}</span></div>
          ${entry.note ? `<p>${esc(entry.note)}</p>` : ""}
          <div class="registered-actions">
            <a href="${esc(entry.url)}" target="_blank" rel="noreferrer">開く</a>
            ${channelLink ? `<a href="${esc(channelLink)}" target="_blank" rel="noreferrer">チャンネル</a>` : ""}
            <button class="video-admin-only" type="button" data-move-video-up="${esc(entry.id)}">上へ</button>
            <button class="video-admin-only" type="button" data-move-video-down="${esc(entry.id)}">下へ</button>
            <button class="video-admin-only" type="button" data-edit-video="${esc(entry.id)}">編集</button>
            <button class="video-admin-only" type="button" data-delete-video="${esc(entry.id)}">削除</button>
          </div>
        </div>
        ${thumbnail ? `<a class="registered-video-thumb" href="${esc(entry.url)}" target="_blank" rel="noreferrer" aria-label="動画を開く">${entry.publishedAt ? `<span class="video-published-date">${esc(entry.publishedAt)}</span>` : `<span class="video-published-date is-loading">投稿日取得中</span>`}<img src="${esc(thumbnail)}" alt="" loading="lazy"${thumbnailFallbackAttr(entry.url)}></a>` : ""}
      </article>
    `;}).join("");
    els.list.innerHTML = cardsHtml;

    els.list.querySelectorAll("[data-delete-video]").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.dataset.deleteVideo;
        state.library.videos[char.slug] = videosForSlug(char.slug).filter((entry) => entry.id !== id);
        if (!state.library.videos[char.slug].length) delete state.library.videos[char.slug];
        if (state.editing?.slug === char.slug && state.editing?.id === id) resetEditing();
        saveLibrary();
        render();
      });
    });

    els.list.querySelectorAll("[data-edit-video]").forEach((button) => {
      button.addEventListener("click", () => {
        beginEditing(char.slug, button.dataset.editVideo);
      });
    });

    els.list.querySelectorAll("[data-move-video-up]").forEach((button) => {
      button.addEventListener("click", () => {
        moveVideo(char.slug, button.dataset.moveVideoUp, -1);
      });
    });

    els.list.querySelectorAll("[data-move-video-down]").forEach((button) => {
      button.addEventListener("click", () => {
        moveVideo(char.slug, button.dataset.moveVideoDown, 1);
      });
    });
  }

  function render() {
    renderChannels();
    renderCostTabs();
    renderCharacters();
    renderRegisteredVideos();
    syncAdminMode();
  }

  els.form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const char = selectedCharacter();
    if (!char) return;

    const title = els.title.value.trim();
    const url = els.url.value.trim();
    const note = els.note.value.trim();
    if (!title || !url) return;
    if (!state.library.channels.length || !els.channelSelect.value) {
      alert("先にチャンネルを登録してください");
      return;
    }
    const publishedAt = await fetchPublishDate(url);

    if (state.editing) {
      const entries = videosForSlug(state.editing.slug);
      const entry = entries.find((video) => video.id === state.editing.id);
      if (entry) {
        entry.title = title;
        entry.url = url;
        entry.note = note;
        entry.publishedAt = publishedAt || entry.publishedAt || "";
        entry.channelId = els.channelSelect.value;
        entry.updatedAt = new Date().toISOString();
      }
    } else {
      state.library.videos[char.slug] = state.library.videos[char.slug] || [];
      state.library.videos[char.slug].unshift({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title,
        url,
        note,
        publishedAt,
        channelId: els.channelSelect.value,
        createdAt: new Date().toISOString(),
      });
    }

    saveLibrary();
    resetEditing();
    render();
  });

  els.editCancel?.addEventListener("click", () => {
    resetEditing();
  });

  els.adminLock?.addEventListener("click", () => {
    lockAdmin();
  });

  els.channelForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = els.channelName.value.trim();
    const url = els.channelUrl.value.trim();
    if (!name || !url) return;
    state.library.channels.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      url,
      icon: els.channelIcon?.value.trim() || "",
    });
    saveLibrary();
    els.channelForm.reset();
    render();
  });

  els.channelFilter?.addEventListener("change", () => {
    state.channelFilter = els.channelFilter.value;
    render();
  });

  els.hideEmpty?.addEventListener("change", () => {
    state.hideEmpty = els.hideEmpty.checked;
    const stillVisible = state.characters.some((char) => char.slug === state.selectedSlug && char.cost === state.cost && (!state.hideEmpty || visibleVideosForSlug(char.slug).length));
    if (!stillVisible) {
      const first = state.characters.find((char) => char.cost === state.cost && (!state.hideEmpty || visibleVideosForSlug(char.slug).length));
      state.selectedSlug = first?.slug || "";
    }
    render();
  });

  els.exportButton?.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state.library, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "starward-character-video-links.json";
    link.click();
    URL.revokeObjectURL(link.href);
  });

  els.importInput?.addEventListener("change", () => {
    const file = els.importInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result);
        state.library = imported?.videos && imported?.channels
          ? imported
          : { channels: [], videos: imported && typeof imported === "object" ? imported : {} };
        state.channelFilter = "all";
        saveLibrary();
        render();
      } catch {
        alert("JSONを読み込めませんでした");
      }
    };
    reader.readAsText(file);
    els.importInput.value = "";
  });

  function applyCharacters(characters) {
    state.characters = characters.filter((char) => COSTS.includes(char.cost));
    const requestedSlug = requestedCharacterSlug();
    const requested = state.characters.find((char) => char.slug === requestedSlug);
    if (requested) {
      state.cost = requested.cost;
      state.selectedSlug = requested.slug;
    } else {
      state.selectedSlug = state.characters.find((char) => char.cost === state.cost)?.slug || state.characters[0]?.slug || "";
    }
    render();
    if (requested) {
      requestAnimationFrame(() => root.scrollIntoView({ block: "start" }));
    }
  }

  syncAdminMode();
  if (state.admin && hasLibraryContent(state.library)) savePublicLibrary();
  if (typeof fetch === "function") {
    Promise.all([
      fetch("characters-data.json?v=20260601g").then((response) => response.json()).catch(() => FALLBACK_CHARACTERS),
      loadPublicLibrary(),
    ]).then(([characters]) => applyCharacters(characters));
  } else {
    applyCharacters(FALLBACK_CHARACTERS);
  }
})();


