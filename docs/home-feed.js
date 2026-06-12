(() => {
  const latestSlots = [
    {
      frame: document.querySelector("#official-latest-video"),
      title: document.querySelector("#official-latest-title"),
      meta: document.querySelector("#official-latest-meta"),
    },
    {
      frame: document.querySelector("#official-latest-video-card"),
      title: document.querySelector("#official-latest-card-title"),
      meta: null,
    },
  ];
  const latestShortSlots = [
    {
      frame: document.querySelector("#official-latest-short-card"),
      title: document.querySelector("#official-latest-short-title"),
      meta: null,
    },
  ];
  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);

  const thumbnailUrl = (id, quality = "maxresdefault") => `https://i.ytimg.com/vi/${encodeURIComponent(id)}/${quality}.jpg`;
  const embedUrl = (id) => `https://www.youtube.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&playsinline=1`;

  const playInFrame = (frame, videoId, title) => {
    if (!frame || !videoId) return;
    frame.innerHTML = `
      <iframe
        src="${esc(embedUrl(videoId))}"
        title="${esc(title || "星の翼 公式YouTube")}"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
    `;
  };

  const renderLatestVideo = (video, slots = latestSlots) => {
    if (!video?.id) return;
    const url = video.url || `https://www.youtube.com/watch?v=${encodeURIComponent(video.id)}`;
    const thumb = thumbnailUrl(video.id);
    const fallbackThumb = thumbnailUrl(video.id, "hqdefault");
    slots.forEach((slot) => {
      if (slot.frame) {
        slot.frame.innerHTML = `
          <a class="latest-video-card-link" href="${esc(url)}" data-youtube-id="${esc(video.id)}" data-youtube-title="${esc(video.title || "星の翼 公式YouTube")}">
            <img src="${esc(thumb)}" data-fallback-src="${esc(fallbackThumb)}" alt="" loading="lazy" decoding="async" fetchpriority="low">
            <span>このサイトで再生</span>
          </a>
        `;
        const image = slot.frame.querySelector("img[data-fallback-src]");
        image?.addEventListener("error", () => {
          image.src = image.dataset.fallbackSrc;
          image.removeAttribute("data-fallback-src");
        }, { once: true });
      }
      if (slot.title) slot.title.textContent = video.title || "星の翼 公式YouTube 最新動画";
      if (slot.meta) slot.meta.textContent = video.publishedText ? `公式YouTube / ${video.publishedText}` : "公式YouTube 最新動画";
    });
  };

  document.addEventListener("click", (event) => {
    const link = event.target.closest?.(".latest-video-card-link[data-youtube-id]");
    if (!link) return;
    event.preventDefault();
    playInFrame(link.closest(".latest-video-frame"), link.dataset.youtubeId, link.dataset.youtubeTitle);
  });

  if (typeof fetch !== "function") return;

  const loadLatest = async () => {
    const sources = [
      "official-latest-video.json",
      "api/youtube-latest?handle=StarWard_jp",
      "api/youtube-latest.json",
      "/api/youtube-latest?handle=StarWard_jp",
    ];
    for (const source of sources) {
      try {
        const response = await fetch(source, { cache: "no-store" });
        if (!response.ok) continue;
        const video = await response.json();
        if (video?.id) {
          renderLatestVideo(video);
          return;
        }
      } catch {
        // Try the next source.
      }
    }
  };

  const loadLatestShort = async () => {
    const sources = [
      "official-latest-short.json",
      "api/youtube-latest-short?handle=StarWard_jp",
      "api/youtube-latest-short.json",
    ];
    for (const source of sources) {
      try {
        const response = await fetch(source, { cache: "no-store" });
        if (!response.ok) continue;
        const video = await response.json();
        if (video?.id) {
          renderLatestVideo(video, latestShortSlots);
          return;
        }
      } catch {
        // Try the next source.
      }
    }
  };

  loadLatest();
  loadLatestShort();
})();
