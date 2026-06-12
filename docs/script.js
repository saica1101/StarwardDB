const header = document.querySelector(".site-header");
const characterSearch = document.querySelector("#character-search");
const rosterCards = [...document.querySelectorAll(".roster-card")];
const siteParams = new URLSearchParams(location.search);
const siteAdminRequested = siteParams.get("admin") === "1" || siteParams.get("edit") === "1";
const SITE_ADMIN_KEY = "starward-site-admin";
const SITE_ADMIN_PASSWORD = "xzyjp";
const siteAssetBase = (() => {
  try {
    return new URL(".", document.currentScript?.src || location.href);
  } catch {
    return new URL("./", location.href);
  }
})();
const siteAssetUrl = (path) => new URL(path, siteAssetBase).toString();
const siteAdminStored = (() => {
  try {
    return sessionStorage.getItem(SITE_ADMIN_KEY) === "1";
  } catch {
    return false;
  }
})();
const unlockSiteAdmin = () => {
  if (siteAdminStored) return true;
  if (!siteAdminRequested) return false;
  const password = prompt("管理パスワード");
  if (password !== SITE_ADMIN_PASSWORD) return false;
  try {
    sessionStorage.setItem(SITE_ADMIN_KEY, "1");
    sessionStorage.setItem("starward-video-admin", "1");
  } catch {}
  return true;
};
const siteAdmin = siteAdminStored || unlockSiteAdmin();

if (siteAdmin) {
  try {
    sessionStorage.setItem(SITE_ADMIN_KEY, "1");
  } catch {}
}
document.body.classList.toggle("site-admin", siteAdmin);

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
};

const scrollToHashTarget = () => {
  if (!location.hash) return;
  const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (!target) return;
  requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
};

const pageEditSelectors = {
  editable: [
    "main h1",
    "main h2",
    "main h3",
    "main p",
    "main li",
    "main dt",
    "main dd",
    "main strong",
    "main small",
    "main .hero-copy",
    "main .eyebrow",
    "main .button",
    "main .tool-card-body span",
    "main .tool-card-body small",
    "footer p",
    "footer a",
  ].join(","),
  block: [
    ".page-hero",
    ".page-hero-inner",
    "main > .section",
    ".quick-strip article",
    ".home-dashboard article",
    ".tool-card",
    ".timeline article",
    ".character-card",
    ".video-card",
    ".note-grid article",
    ".source-note",
    ".roster-card",
    ".steps li",
    ".editor-shell",
    ".editor-title",
    ".editor-section",
    ".editor-table-wrap",
    ".editor-sidebar",
    ".editor-main",
    ".page-edit-block",
  ].join(","),
};

const normalizePagePath = (pathname = location.pathname) => {
  let page = pathname.split("?")[0].split("#")[0] || "/";
  page = page.replace(/\\/g, "/");
  if (page.endsWith("/")) page += "index.html";
  if (page === "/") page = "/index.html";
  return page;
};

const pageEditKeyCandidates = () => {
  const page = normalizePagePath();
  const withoutRepo = page.replace(/^\/[^/]+(?=\/)/, "");
  const candidates = new Set([page, withoutRepo]);
  if (withoutRepo === "/index.html") candidates.add("/");
  return [...candidates];
};

const assignPageEditKeys = () => {
  const blocks = [...document.querySelectorAll(pageEditSelectors.block)].filter((el) => {
    if (el.closest(".site-editor")) return false;
    return !el.closest("script, style, .nav");
  });
  blocks.forEach((el, index) => {
    if (!el.dataset.blockKey) el.dataset.blockKey = `block-${index}`;
  });

  const editables = [...document.querySelectorAll(pageEditSelectors.editable)].filter((el) => {
    if (el.closest(".site-editor")) return false;
    if (el.closest("script, style, .nav")) return false;
    return el.textContent.trim().length > 0;
  });
  editables.forEach((el, index) => {
    if (!el.dataset.editKey) el.dataset.editKey = `${el.tagName.toLowerCase()}-${index}`;
    if (!el.dataset.editOriginal) el.dataset.editOriginal = el.innerHTML;
  });

  return { blocks, editables };
};

const applyPageEdits = (edits) => {
  if (!edits || typeof edits !== "object") return;
  (edits.added || []).forEach((block) => {
    if (!block?.id || document.querySelector(`[data-added-block="${CSS.escape(block.id)}"]`)) return;
    const template = document.createElement("template");
    template.innerHTML = block.html || "";
    const node = template.content.firstElementChild;
    if (node) document.querySelector("main .section, main")?.append(node);
  });
  const { blocks, editables } = assignPageEditKeys();
  editables.forEach((el) => {
    if (Object.prototype.hasOwnProperty.call(edits.text || {}, el.dataset.editKey)) {
      el.innerHTML = edits.text[el.dataset.editKey];
    }
  });
  blocks.forEach((el) => {
    el.classList.toggle("is-user-hidden", !!edits.hidden?.[el.dataset.blockKey]);
  });
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });
window.addEventListener("load", scrollToHashTarget);
window.addEventListener("hashchange", scrollToHashTarget);
scrollToHashTarget();

(() => {
  if (siteAdmin || typeof fetch !== "function") return;
  fetch(siteAssetUrl(`page-edits-data.json?v=${Date.now()}`))
    .then((response) => response.ok ? response.json() : {})
    .then((allEdits) => {
      const key = pageEditKeyCandidates().find((candidate) => allEdits?.[candidate]);
      if (key) applyPageEdits(allEdits[key]);
    })
    .catch(() => {});
})();

(() => {
  const hero = document.querySelector("[data-random-namecard-hero]");
  if (!hero) return;

  const namecardImages = [
    { src: "assets/namecards/item_namecard_bg_large_new_20010004.webp", position: "38% 42%" },
    { src: "assets/namecards/item_namecard_bg_large_new_20010005.webp", position: "44% 42%" },
    { src: "assets/namecards/item_namecard_bg_large_new_20010006.webp", position: "34% 38%" },
    { src: "assets/namecards/item_namecard_bg_large_new_20010007.webp", position: "62% 42%" },
    { src: "assets/namecards/item_namecard_bg_large_new_20010008.webp", position: "42% 42%" },
    { src: "assets/namecards/item_namecard_bg_large_new_20010009.webp", position: "42% 42%" },
    { src: "assets/namecards/item_namecard_bg_large_new_20010010.webp", position: "36% 42%" },
    { src: "assets/namecards/item_namecard_bg_large_new_20010011.webp", position: "40% 40%" },
    { src: "assets/namecards/item_namecard_bg_large_new_20010013.webp", position: "46% 40%" },
    { src: "assets/namecards/item_namecard_bg_large_new_20010014.webp", position: "36% 42%" },
    { src: "assets/namecards/item_namecard_bg_large_new_20010015.webp", position: "43% 42%" },
    { src: "assets/namecards/item_namecard_bg_large_new_20010016.webp", position: "43% 42%" },
    { src: "assets/namecards/item_namecard_bg_large_new_20010017.webp", position: "52% 40%" },
    { src: "assets/namecards/item_namecard_bg_large_new_20010018.webp", position: "37% 38%" },
    { src: "assets/namecards/item_namecard_bg_large_new_20010019.webp", position: "42% 38%" },
    { src: "assets/namecards/item_namecard_bg_large_new_20010020.webp", position: "35% 40%" },
  ];
  const picked = namecardImages[Math.floor(Math.random() * namecardImages.length)];
  hero.style.setProperty("--namecard-bg", `url("${picked.src}")`);
  hero.style.setProperty("--namecard-position", picked.position);
})();

characterSearch?.addEventListener("input", () => {
  const query = characterSearch.value.trim().toLowerCase();

  rosterCards.forEach((card) => {
    const text = `${card.textContent} ${card.dataset.search ?? ""}`.toLowerCase();
    const isHidden = query.length > 0 && !text.includes(query);
    card.hidden = isHidden;

    if (!isHidden && query.length > 0) {
      card.closest(".cost-group")?.setAttribute("open", "");
    }
  });
});

document.querySelectorAll("[data-table-filter]").forEach((input) => {
  const table = document.querySelector(input.dataset.tableFilter);
  if (!table) return;
  const rows = [...table.querySelectorAll("tbody tr")];
  input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();
    rows.forEach((row) => {
      const text = `${row.textContent} ${row.dataset.search ?? ""}`.toLowerCase();
      row.hidden = query.length > 0 && !text.includes(query);
    });
  });
});

(() => {
  const tabGroups = [...document.querySelectorAll("[data-move-form-tabs]")];
  if (!tabGroups.length) return;

  const setActiveForm = (group, form) => {
    const section = group.closest("section");
    const rows = [...(section?.querySelectorAll("[data-form-row]") ?? [])];

    group.querySelectorAll("[data-move-form]").forEach((button) => {
      const isActive = button.dataset.moveForm === form;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    rows.forEach((row) => {
      const rowForm = row.dataset.form || "";
      row.hidden = form !== "all" && rowForm !== form && rowForm !== "共通";
    });
  };

  tabGroups.forEach((group) => {
    setActiveForm(group, "all");
    group.addEventListener("click", (event) => {
      const button = event.target.closest("[data-move-form]");
      if (!button) return;
      setActiveForm(group, button.dataset.moveForm);
    });
  });
})();

(() => {
  if (!siteAdmin) return;

  const editableSelector = [
    "main h1",
    "main h2",
    "main h3",
    "main p",
    "main li",
    "main dt",
    "main dd",
    "main strong",
    "main small",
    "main .hero-copy",
    "main .eyebrow",
    "main .button",
    "main .tool-card-body span",
    "main .tool-card-body small",
    "footer p",
    "footer a",
  ].join(",");
  const blockSelector = [
    ".page-hero",
    ".page-hero-inner",
    "main > .section",
    ".quick-strip article",
    ".home-dashboard article",
    ".tool-card",
    ".timeline article",
    ".character-card",
    ".video-card",
    ".note-grid article",
    ".source-note",
    ".roster-card",
    ".steps li",
    ".editor-shell",
    ".editor-title",
    ".editor-section",
    ".editor-table-wrap",
    ".editor-sidebar",
    ".editor-main",
    ".page-edit-block",
  ].join(",");
  const outerBlockSelector = [
    ".page-hero",
    "main > .section",
    ".editor-shell",
    ".editor-main",
    ".editor-sidebar",
  ].join(",");

  const pageKey = `starward-guide-page-edits:${location.pathname}`;
  const ui = document.createElement("div");
  const fileInput = document.createElement("input");
  let editMode = false;
  let editables = [];
  let blocks = [];
  let activeElement = null;
  let publishTimer = 0;

  const publishPageEdits = (edits) => {
    if (typeof fetch !== "function") return;
    window.clearTimeout(publishTimer);
    publishTimer = window.setTimeout(() => {
      fetch("/api/save/page-edit", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          page: normalizePagePath(),
          edits,
        }),
      }).catch((error) => console.warn("page-edits-data.json の保存に失敗しました", error));
    }, 350);
  };

  const loadEdits = () => {
    try {
      const stored = JSON.parse(localStorage.getItem(pageKey) || "{}");
      if (stored && (stored.text || stored.hidden || stored.added)) return stored;
      return { text: stored || {}, hidden: {}, added: [] };
    } catch {
      return { text: {}, hidden: {}, added: [] };
    }
  };

  const saveEdits = (edits) => {
    localStorage.setItem(pageKey, JSON.stringify(edits));
    publishPageEdits(edits);
    updateCount();
  };

  const collectEdits = () => {
    const edits = loadEdits();
    edits.text = {};
    edits.hidden = {};
    edits.added = [...document.querySelectorAll("[data-added-block]")].map((el) => ({
      id: el.dataset.addedBlock,
      html: el.outerHTML,
    }));

    editables.forEach((el) => {
      if (el.innerHTML !== el.dataset.editOriginal) {
        edits.text[el.dataset.editKey] = el.innerHTML;
      }
    });
    blocks.forEach((el) => {
      if (el.classList.contains("is-user-hidden") || isBlockEmpty(el)) {
        edits.hidden[el.dataset.blockKey] = true;
      }
    });

    return edits;
  };

  const isBlockEmpty = (el) => {
    if (el.querySelector("img, video, iframe, canvas, table, input:not([type='hidden']), select, textarea")) {
      return false;
    }
    return el.textContent.trim().length === 0;
  };

  const updateCount = () => {
    const edits = loadEdits();
    const count = Object.keys(edits.text).length + Object.keys(edits.hidden).length + edits.added.length;
    ui.querySelector("[data-edit-count]").textContent = `${count}件保存`;
  };

  const assignKeys = () => {
    blocks = [...document.querySelectorAll(blockSelector)].filter((el) => {
      if (el.closest(".site-editor")) return false;
      return !el.closest("script, style, .nav");
    });
    blocks.forEach((el, index) => {
      if (!el.dataset.blockKey) el.dataset.blockKey = `block-${index}`;
    });

    editables = [...document.querySelectorAll(editableSelector)].filter((el) => {
      if (el.closest(".site-editor")) return false;
      if (el.closest("script, style, .nav")) return false;
      return el.textContent.trim().length > 0;
    });

    editables.forEach((el, index) => {
      el.dataset.editKey = `${el.tagName.toLowerCase()}-${index}`;
      el.dataset.editOriginal = el.innerHTML;
    });
  };

  const applyEdits = () => {
    const edits = loadEdits();
    (edits.added || []).forEach((block) => {
      if (!block?.id || document.querySelector(`[data-added-block="${CSS.escape(block.id)}"]`)) return;
      const template = document.createElement("template");
      template.innerHTML = block.html;
      const node = template.content.firstElementChild;
      if (node) document.querySelector("main .section, main")?.append(node);
    });
    assignKeys();
    editables.forEach((el) => {
      if (Object.prototype.hasOwnProperty.call(edits.text, el.dataset.editKey)) {
        el.innerHTML = edits.text[el.dataset.editKey];
      }
    });
    blocks.forEach((el) => {
      el.classList.toggle("is-user-hidden", !!edits.hidden[el.dataset.blockKey]);
    });
  };

  const setEditMode = (enabled) => {
    editMode = enabled;
    document.body.classList.toggle("page-editing", editMode);
    editables.forEach((el) => {
      el.contentEditable = String(editMode);
      el.spellcheck = false;
    });
    ui.querySelector("[data-edit-toggle]").textContent = editMode ? "編集終了" : "編集";
    ui.querySelector("[data-edit-remove]").disabled = !editMode;
    ui.querySelector("[data-edit-remove-outer]").disabled = !editMode;
    ui.querySelector("[data-edit-restore]").disabled = !editMode;
    ui.querySelector("[data-edit-show-hidden]").disabled = !editMode;
    ui.querySelector("[data-edit-add-text]").disabled = !editMode;
    ui.querySelector("[data-edit-add-card]").disabled = !editMode;
  };

  const getTargetBlock = () => {
    const target = activeElement || document.activeElement;
    return target?.closest?.(blockSelector) || target?.closest?.("[data-edit-key]");
  };

  const getOuterTargetBlock = () => {
    const target = activeElement || document.activeElement;
    return target?.closest?.(outerBlockSelector) || getTargetBlock();
  };

  const hideTargetBlock = () => {
    const target = getTargetBlock();
    if (!target || target.closest(".site-editor")) return;
    target.classList.add("is-user-hidden");
    saveEdits(collectEdits());
  };

  const hideOuterTargetBlock = () => {
    const target = getOuterTargetBlock();
    if (!target || target.closest(".site-editor")) return;
    target.classList.add("is-user-hidden");
    saveEdits(collectEdits());
  };

  const restoreTargetBlock = () => {
    const target = getTargetBlock();
    if (!target || target.closest(".site-editor")) return;
    target.classList.remove("is-user-hidden");
    saveEdits(collectEdits());
  };

  const toggleHiddenPreview = () => {
    document.body.classList.toggle("show-hidden-edits");
    ui.querySelector("[data-edit-show-hidden]").textContent =
      document.body.classList.contains("show-hidden-edits") ? "削除非表示" : "削除表示";
  };

  const addBlock = (type) => {
    const container = document.querySelector("main .section, main");
    if (!container) return;
    const id = `added-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const wrapper = document.createElement("article");
    wrapper.className = type === "card" ? "page-edit-block page-edit-card" : "page-edit-block page-edit-text";
    wrapper.dataset.addedBlock = id;
    wrapper.innerHTML = type === "card"
      ? `<h3>新しい枠</h3><p>ここを編集できます。</p>`
      : `<p>新しい文章を入力できます。</p>`;

    const target = getTargetBlock();
    if (target?.parentElement && !target.closest(".site-editor")) {
      target.insertAdjacentElement("afterend", wrapper);
    } else {
      container.append(wrapper);
    }

    assignKeys();
    wrapper.querySelector("p, h3")?.focus();
    saveEdits(collectEdits());
  };

  const exportEdits = () => {
    const payload = {
      page: location.pathname,
      exportedAt: new Date().toISOString(),
      edits: collectEdits(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `starward-page-edits-${document.title || "page"}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const importEdits = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const payload = JSON.parse(reader.result);
        saveEdits(payload.edits || payload);
        applyEdits();
      } catch {
        alert("JSONを読み込めませんでした");
      }
    };
    reader.readAsText(file);
  };

  const buildUi = () => {
    ui.className = "site-editor";
    ui.innerHTML = `
      <button type="button" data-edit-toggle>編集</button>
      <button type="button" data-edit-save>保存</button>
      <button type="button" data-edit-export>JSON出力</button>
      <button type="button" data-edit-import>JSON読込</button>
      <button type="button" data-edit-remove disabled>選択削除</button>
      <button type="button" data-edit-remove-outer disabled>外枠削除</button>
      <button type="button" data-edit-restore disabled>選択復元</button>
      <button type="button" data-edit-show-hidden disabled>削除表示</button>
      <button type="button" data-edit-add-text disabled>文章追加</button>
      <button type="button" data-edit-add-card disabled>枠追加</button>
      <button type="button" data-edit-reset>リセット</button>
      <span data-edit-count>0件保存</span>
    `;

    fileInput.type = "file";
    fileInput.accept = "application/json,.json";
    fileInput.hidden = true;

    document.body.append(ui, fileInput);

    ui.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;
      if (button.matches("[data-edit-toggle]")) setEditMode(!editMode);
      if (button.matches("[data-edit-save]")) saveEdits(collectEdits());
      if (button.matches("[data-edit-export]")) exportEdits();
      if (button.matches("[data-edit-import]")) fileInput.click();
      if (button.matches("[data-edit-remove]")) hideTargetBlock();
      if (button.matches("[data-edit-remove-outer]")) hideOuterTargetBlock();
      if (button.matches("[data-edit-restore]")) restoreTargetBlock();
      if (button.matches("[data-edit-show-hidden]")) toggleHiddenPreview();
      if (button.matches("[data-edit-add-text]")) addBlock("text");
      if (button.matches("[data-edit-add-card]")) addBlock("card");
      if (button.matches("[data-edit-reset]")) {
        if (!confirm("このページの編集内容をリセットしますか？")) return;
        localStorage.removeItem(pageKey);
        location.reload();
      }
    });
    fileInput.addEventListener("change", () => {
      if (fileInput.files[0]) importEdits(fileInput.files[0]);
      fileInput.value = "";
    });

    document.addEventListener("input", (event) => {
      if (!editMode || !event.target?.dataset?.editKey) return;
      saveEdits(collectEdits());
    });
    document.addEventListener("focusin", (event) => {
      if (event.target?.matches?.("[data-edit-key], [data-block-key], .page-edit-block")) {
        activeElement = event.target;
      }
    });
    document.addEventListener("click", (event) => {
      if (!editMode || event.target.closest(".site-editor")) return;
      const target = event.target.closest("[data-edit-key], [data-block-key], .page-edit-block");
      if (target) activeElement = target;
    });
  };

  assignKeys();
  applyEdits();
  if (siteAdmin) publishPageEdits(loadEdits());
  scrollToHashTarget();
  window.StarwardPageEditor = {
    enable: () => setEditMode(true),
    disable: () => setEditMode(false),
    toggle: () => setEditMode(!editMode),
    hide: hideTargetBlock,
    hideOuter: hideOuterTargetBlock,
    restore: restoreTargetBlock,
    addText: () => addBlock("text"),
    addCard: () => addBlock("card"),
    save: () => saveEdits(collectEdits()),
    export: exportEdits,
  };
  buildUi();
  updateCount();
})();

(() => {
  const list = document.querySelector("#contributors-list");
  const manager = document.querySelector("#contributors-manager");
  const form = manager?.querySelector(".contributor-form");
  const editList = manager?.querySelector("[data-contributor-edit-list]");
  const clearButton = manager?.querySelector("[data-contributor-clear]");
  const submitButton = manager?.querySelector("[data-contributor-submit]");
  if (!list || !manager || !form || !editList || !submitButton) return;

  const storageKey = "starward-guide-contributors";
  const defaults = [];
  let publicContributors = [...defaults];
  let editingIndex = -1;

  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);

  const savePublicJson = (contributors) => {
    if (typeof fetch !== "function") return;
    fetch("/api/save/contributors", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(contributors),
    }).catch((error) => console.warn("contributors-data.json の保存に失敗しました", error));
  };

  const loadContributors = () => {
    if (!siteAdmin && publicContributors.length) return [...publicContributors];
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) || "null");
      if (Array.isArray(stored) && stored.length) return stored;
    } catch {}
    if (publicContributors.length) return [...publicContributors];
    return [...defaults];
  };

  const saveContributors = (contributors) => {
    if (!siteAdmin) return;
    localStorage.setItem(storageKey, JSON.stringify(contributors));
    publicContributors = [...contributors];
    savePublicJson(contributors);
  };

  const loadStreamers = () => {
    try {
      const stored = JSON.parse(localStorage.getItem("starward-guide-streamers") || "[]");
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  };

  const isPlaceholderContributors = (contributors) => (
    contributors.length === defaults.length &&
    contributors.every((contributor) => (
      contributor?.name === "チャンネル名" &&
      normalizeUrl(contributor?.url) === "https://www.youtube.com/" &&
      !contributor?.iconUrl
    ))
  );

  const streamersAsContributors = () => loadStreamers().map((streamer) => ({
    name: streamer.name || "チャンネル名",
    url: streamer.channelUrl || "https://www.youtube.com/",
    iconUrl: streamer.iconUrl || "",
  }));

  const normalizeUrl = (url) => {
    const value = String(url || "").trim();
    if (!value) return "https://www.youtube.com/";
    return /^https?:\/\//i.test(value) ? value : `https://${value}`;
  };

  const normalizeKey = (value) => normalizeUrl(value).replace(/\/+$/, "").toLowerCase();

  const findMatchingStreamer = (contributor) => {
    const contributorName = String(contributor?.name || "").trim();
    const contributorUrl = normalizeKey(contributor?.url);
    return loadStreamers().find((streamer) => {
      const streamerName = String(streamer?.name || "").trim();
      const streamerUrl = normalizeKey(streamer?.channelUrl);
      return (
        (contributorName && streamerName && contributorName === streamerName) ||
        (contributorUrl && streamerUrl && contributorUrl === streamerUrl)
      );
    });
  };

  const iconFor = (contributor) => {
    if (contributor?.iconUrl) return normalizeUrl(contributor.iconUrl);
    const streamer = findMatchingStreamer(contributor);
    if (streamer?.iconUrl) return normalizeUrl(streamer.iconUrl);
    const seed = encodeURIComponent(contributor?.name || "channel");
    return `https://api.dicebear.com/8.x/initials/svg?seed=${seed}&backgroundColor=0ea5e9,111827&textColor=ffffff`;
  };

  const getFormValue = () => ({
    name: form.elements.name.value.trim() || "チャンネル名",
    url: normalizeUrl(form.elements.url.value),
    iconUrl: form.elements.iconUrl.value.trim(),
  });

  const setFormValue = (contributor) => {
    form.elements.name.value = contributor?.name || "";
    form.elements.url.value = contributor?.url || "";
    form.elements.iconUrl.value = contributor?.iconUrl || "";
  };

  const resetForm = () => {
    editingIndex = -1;
    setFormValue(null);
    submitButton.textContent = "追加";
  };

  const renderContributors = () => {
    const storedContributors = loadContributors();
    const streamerContributors = streamersAsContributors();
    const contributors = isPlaceholderContributors(storedContributors) && streamerContributors.length
      ? streamerContributors
      : storedContributors;
    if (!contributors.length) {
      list.innerHTML = `<p class="empty-note">掲載準備中です。</p>`;
      editList.innerHTML = "";
      return;
    }
    list.innerHTML = contributors.map((contributor) => `
      <article class="video-card channel-card">
        <a class="contributor-icon-link" href="${esc(normalizeUrl(contributor.url))}" target="_blank" rel="noreferrer" aria-label="${esc(contributor.name)}を開く">
          <img src="${esc(iconFor(contributor))}" alt="">
        </a>
        <h3>${esc(contributor.name)}</h3>
      </article>
    `).join("");

    editList.innerHTML = contributors.map((contributor, index) => `
      <article class="contributor-edit-row">
        <div>
          <strong>${esc(contributor.name)}</strong>
          <small>${esc(normalizeUrl(contributor.url))}</small>
        </div>
        <button type="button" data-contributor-edit="${index}">編集</button>
        <button type="button" data-contributor-delete="${index}">削除</button>
      </article>
    `).join("");
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const contributors = loadContributors();
    const next = getFormValue();
    if (editingIndex >= 0) {
      contributors[editingIndex] = next;
    } else {
      contributors.push(next);
    }
    saveContributors(contributors);
    resetForm();
    renderContributors();
  });

  editList.addEventListener("click", (event) => {
    const editButton = event.target.closest("[data-contributor-edit]");
    const deleteButton = event.target.closest("[data-contributor-delete]");
    const contributors = loadContributors();
    if (editButton) {
      editingIndex = Number(editButton.dataset.contributorEdit);
      setFormValue(contributors[editingIndex]);
      submitButton.textContent = "更新";
    }
    if (deleteButton) {
      const index = Number(deleteButton.dataset.contributorDelete);
      contributors.splice(index, 1);
      saveContributors(contributors);
      resetForm();
      renderContributors();
    }
  });

  clearButton?.addEventListener("click", resetForm);
  const shouldLoadPublicContributors = (() => {
    if (typeof fetch !== "function") return false;
    if (!siteAdmin) return true;
    return true;
  })();

  if (shouldLoadPublicContributors) {
    fetch(siteAssetUrl("contributors-data.json?v=20260612icons1"))
      .then((response) => response.json())
      .then((contributors) => {
        publicContributors = Array.isArray(contributors) ? contributors : [];
        if (siteAdmin && publicContributors.length) {
          localStorage.setItem(storageKey, JSON.stringify(publicContributors));
        }
        renderContributors();
      })
      .catch(renderContributors);
  } else {
    const contributors = loadContributors();
    if (siteAdmin && contributors.length) saveContributors(contributors);
    renderContributors();
  }
})();



