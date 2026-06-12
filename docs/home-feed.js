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
  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);

  const renderLatestVideo = (video) => {
    if (!video?.id) return;
    const url = video.url || `https://www.youtube.com/watch?v=${encodeURIComponent(video.id)}`;
    const thumb = `https://i.ytimg.com/vi/${encodeURIComponent(video.id)}/hqdefault.jpg`;
    latestSlots.forEach((slot) => {
      if (slot.frame) {
        slot.frame.innerHTML = `
          <a class="latest-video-card-link" href="${esc(url)}" target="_blank" rel="noreferrer">
            <img src="${esc(thumb)}" alt="">
            <span>Youtubeで開く</span>
          </a>
        `;
      }
      if (slot.title) slot.title.textContent = video.title || "星の翼 公式YouTube 最新動画";
      if (slot.meta) slot.meta.textContent = video.publishedText ? `公式YouTube / ${video.publishedText}` : "公式YouTube 最新動画";
    });
  };

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

  loadLatest();
})();
