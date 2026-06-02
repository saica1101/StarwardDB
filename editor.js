const sectionColumns = {
  shooting: ["種別", "名称", "弾数", "威力", "備考"],
  melee: ["種別", "名称", "入力", "弾数", "威力", "備考"],
  burst: ["種別", "名称", "威力", "備考"],
};

const state = {
  characters: [],
  moveData: {},
  currentSlug: "",
};

const status = document.querySelector("#editor-status");
const characterSelect = document.querySelector("#editor-character");
const fileInput = document.querySelector("#data-file");
const nameEl = document.querySelector("#editor-name");
const sourceEl = document.querySelector("#editor-source");

const setStatus = (message) => {
  status.textContent = message;
};

const ensureCharacterData = (slug) => {
  state.moveData[slug] ??= { source: "", shooting: [], melee: [], burst: [] };
  for (const section of Object.keys(sectionColumns)) {
    state.moveData[slug][section] ??= [];
  }
  return state.moveData[slug];
};

const renderSelect = () => {
  characterSelect.innerHTML = state.characters
    .map((character) => `<option value="${character.slug}">${character.cost} ${character.name}</option>`)
    .join("");
  state.currentSlug = characterSelect.value || state.characters[0]?.slug || "";
};

const renderSection = (section) => {
  const target = document.querySelector(`#editor-${section}`);
  const data = ensureCharacterData(state.currentSlug);
  const rows = data[section];
  const columns = sectionColumns[section];

  target.innerHTML = `
    <table class="editor-table">
      <thead>
        <tr>
          ${columns.map((column) => `<th>${column}</th>`).join("")}
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        ${rows
          .map(
            (row, rowIndex) => `
              <tr>
                ${columns
                  .map(
                    (_, columnIndex) =>
                      `<td><input value="${String(row[columnIndex] ?? "").replaceAll('"', "&quot;")}" data-section="${section}" data-row="${rowIndex}" data-column="${columnIndex}" /></td>`
                  )
                  .join("")}
                <td><button type="button" class="mini-button danger" data-delete-row="${section}" data-row="${rowIndex}">削除</button></td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  `;
};

const renderEditor = () => {
  if (!state.currentSlug) return;
  const character = state.characters.find((item) => item.slug === state.currentSlug);
  const data = ensureCharacterData(state.currentSlug);

  nameEl.textContent = character ? `${character.name} / Cost ${character.cost}` : state.currentSlug;
  sourceEl.href = data.source || character?.url || "#";

  renderSection("shooting");
  renderSection("melee");
  renderSection("burst");
};

const loadJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} を読み込めませんでした`);
  return response.json();
};

const init = async () => {
  try {
    state.characters = await loadJson("characters-data.json");
    state.moveData = await loadJson("wiki-move-data.json");
    renderSelect();
    renderEditor();
    setStatus("読み込み完了。セルを編集すると即データに反映されます。");
  } catch (error) {
    setStatus("自動読み込みに失敗しました。wiki-move-data.json を選択してください。");
    try {
      state.characters = await loadJson("characters-data.json");
      renderSelect();
      renderEditor();
    } catch {
      setStatus("characters-data.json も読み込めませんでした。ローカルサーバーで開くと安定します。");
    }
  }
};

characterSelect?.addEventListener("change", () => {
  state.currentSlug = characterSelect.value;
  renderEditor();
});

fileInput?.addEventListener("change", async () => {
  const file = fileInput.files?.[0];
  if (!file) return;
  state.moveData = JSON.parse(await file.text());
  renderEditor();
  setStatus(`${file.name} を読み込みました。`);
});

document.addEventListener("input", (event) => {
  const input = event.target.closest("input[data-section]");
  if (!input) return;
  const data = ensureCharacterData(state.currentSlug);
  data[input.dataset.section][Number(input.dataset.row)][Number(input.dataset.column)] = input.value;
});

document.addEventListener("click", async (event) => {
  const addButton = event.target.closest("[data-add-row]");
  if (addButton) {
    const section = addButton.dataset.addRow;
    ensureCharacterData(state.currentSlug)[section].push(Array(sectionColumns[section].length).fill(""));
    renderSection(section);
    return;
  }

  const deleteButton = event.target.closest("[data-delete-row]");
  if (deleteButton) {
    const section = deleteButton.dataset.deleteRow;
    ensureCharacterData(state.currentSlug)[section].splice(Number(deleteButton.dataset.row), 1);
    renderSection(section);
    return;
  }

  if (event.target.closest("#download-json")) {
    const blob = new Blob([`${JSON.stringify(state.moveData, null, 2)}\n`], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "wiki-move-data.json";
    link.click();
    URL.revokeObjectURL(url);
    setStatus("wiki-move-data.json を書き出しました。");
    return;
  }

  if (event.target.closest("#copy-command")) {
    await navigator.clipboard?.writeText("node generate-character-pages.js");
    setStatus("生成コマンドをコピーしました: node generate-character-pages.js");
  }
});

init();
