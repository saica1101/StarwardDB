(() => {
  const list = document.querySelector("#streamer-list");
  const manager = document.querySelector("#streamer-manager");
  const form = document.querySelector("#streamer-form");
  const editList = document.querySelector("#streamer-edit-list");
  const submitButton = document.querySelector("[data-streamer-submit]");
  const clearButton = document.querySelector("[data-streamer-clear]");
  if (!list || !manager || !form || !editList || !submitButton) return;

  const params = new URLSearchParams(location.search);
  const siteAdmin = params.get("admin") === "1" || document.body.classList.contains("site-admin");
  const storageKey = "starward-guide-streamers";
  const defaults = [];
  let publicItems = [...defaults];
  let editingIndex = -1;

  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);

  const savePublicJson = (items) => {
    if (typeof fetch !== "function") return;
    fetch("/api/save/streamers", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(items),
    }).catch((error) => console.warn("streamers-data.json の保存に失敗しました", error));
  };

  const load = () => {
    if (!siteAdmin && publicItems.length) return [...publicItems];
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) || "null");
      if (Array.isArray(stored) && stored.length) return stored;
    } catch {}
    if (publicItems.length) return [...publicItems];
    return [...defaults];
  };

  const save = (items) => {
    if (!siteAdmin) return;
    localStorage.setItem(storageKey, JSON.stringify(items));
    publicItems = [...items];
    savePublicJson(items);
  };

  const normalizeUrl = (url, fallback = "https://www.youtube.com/") => {
    const value = String(url || "").trim();
    if (!value) return fallback;
    return /^https?:\/\//i.test(value) ? value : `https://${value}`;
  };

  const getYoutubeVideoId = (url) => {
    try {
      const parsed = new URL(normalizeUrl(url));
      if (parsed.hostname.includes("youtu.be")) return parsed.pathname.replace("/", "").split("/")[0];
      if (parsed.searchParams.get("v")) return parsed.searchParams.get("v");
      const shorts = parsed.pathname.match(/\/shorts\/([^/?#]+)/);
      if (shorts) return shorts[1];
      const embed = parsed.pathname.match(/\/embed\/([^/?#]+)/);
      if (embed) return embed[1];
      const live = parsed.pathname.match(/\/live\/([^/?#]+)/);
      if (live) return live[1];
    } catch {}
    return "";
  };

  const toEmbedUrl = (url) => {
    const value = String(url || "").trim();
    if (!value) return "";
    const youtubeId = getYoutubeVideoId(value);
    if (youtubeId) return `https://www.youtube.com/embed/${encodeURIComponent(youtubeId)}`;
    try {
      const parsed = new URL(normalizeUrl(value));
      if (parsed.hostname.includes("twitch.tv")) {
        const name = parsed.pathname.split("/").filter(Boolean)[0];
        if (name) return `https://player.twitch.tv/?channel=${encodeURIComponent(name)}&parent=${encodeURIComponent(location.hostname || "127.0.0.1")}`;
      }
    } catch {}
    return "";
  };

  const iconFor = (item) => {
    if (item.iconUrl) return normalizeUrl(item.iconUrl, "");
    const seed = encodeURIComponent(item.name || "streamer");
    return `https://api.dicebear.com/8.x/initials/svg?seed=${seed}&backgroundColor=0ea5e9,111827&textColor=ffffff`;
  };

  const getFormValue = () => ({
    name: document.querySelector("#streamer-name").value.trim() || "配信者名",
    channelUrl: normalizeUrl(document.querySelector("#streamer-channel-url").value),
    iconUrl: document.querySelector("#streamer-icon-url").value.trim(),
    embedUrl: document.querySelector("#streamer-embed-url").value.trim(),
    description: document.querySelector("#streamer-description").value.trim() || "配信内容や紹介文をここに入れます。",
  });

  const setFormValue = (item) => {
    document.querySelector("#streamer-name").value = item?.name || "";
    document.querySelector("#streamer-channel-url").value = item?.channelUrl || "";
    document.querySelector("#streamer-icon-url").value = item?.iconUrl || "";
    document.querySelector("#streamer-embed-url").value = item?.embedUrl || "";
    document.querySelector("#streamer-description").value = item?.description || "";
  };

  const resetForm = () => {
    editingIndex = -1;
    setFormValue(null);
    submitButton.textContent = "追加";
  };

  const render = () => {
    const items = load();
    if (!items.length) {
      list.innerHTML = `<p class="empty-note">掲載準備中です。</p>`;
      editList.innerHTML = "";
      return;
    }
    list.innerHTML = items.map((item) => {
      const embedUrl = toEmbedUrl(item.embedUrl);
      return `
        <article class="streamer-card">
          <div class="streamer-head">
            <img src="${esc(iconFor(item))}" alt="" loading="lazy" />
            <div>
              <span class="tag">Stream</span>
              <h3>${esc(item.name)}</h3>
            </div>
          </div>
          <p>${esc(item.description)}</p>
          ${embedUrl ? `
            <div class="streamer-embed">
              <iframe src="${esc(embedUrl)}" title="${esc(item.name)}の配信枠" loading="lazy" allowfullscreen></iframe>
            </div>
          ` : ""}
          <a href="${esc(normalizeUrl(item.channelUrl))}" target="_blank" rel="noreferrer">チャンネルを開く</a>
        </article>
      `;
    }).join("");

    editList.innerHTML = items.map((item, index) => `
      <article class="contributor-edit-row">
        <div>
          <strong>${esc(item.name)}</strong>
          <small>${esc(normalizeUrl(item.channelUrl))}</small>
        </div>
        <button type="button" data-streamer-edit="${index}">編集</button>
        <button type="button" data-streamer-delete="${index}">削除</button>
      </article>
    `).join("");
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const items = load();
    const next = getFormValue();
    if (editingIndex >= 0) {
      items[editingIndex] = next;
    } else {
      items.push(next);
    }
    save(items);
    resetForm();
    render();
  });

  editList.addEventListener("click", (event) => {
    const editButton = event.target.closest("[data-streamer-edit]");
    const deleteButton = event.target.closest("[data-streamer-delete]");
    const items = load();
    if (editButton) {
      editingIndex = Number(editButton.dataset.streamerEdit);
      setFormValue(items[editingIndex]);
      submitButton.textContent = "更新";
    }
    if (deleteButton) {
      items.splice(Number(deleteButton.dataset.streamerDelete), 1);
      save(items);
      resetForm();
      render();
    }
  });

  clearButton?.addEventListener("click", resetForm);
  const shouldLoadPublicItems = (() => {
    if (typeof fetch !== "function") return false;
    if (!siteAdmin) return true;
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) || "null");
      return !(Array.isArray(stored) && stored.length);
    } catch {
      return true;
    }
  })();

  if (shouldLoadPublicItems) {
    fetch("streamers-data.json?v=20260603jsonsave2")
      .then((response) => response.json())
      .then((items) => {
        publicItems = Array.isArray(items) ? items : [];
        render();
      })
      .catch(render);
  } else {
    const items = load();
    if (siteAdmin && items.length) save(items);
    render();
  }
})();


