document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("search-input");
  const status = document.getElementById("search-status");
  const list = document.getElementById("search-results");
  const docs = window.searchIndex.documentStore.docs;

  let timer = null;

  input.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(search, 200);
  });

  function search() {
    const query = input.value.trim().toLowerCase();
    list.innerHTML = "";
    status.textContent = "";
    if (!query) return;

    const hits = [];
    for (const url in docs) {
      const doc = docs[url];
      const title = (doc.title || "").toLowerCase();
      const body = (doc.body || "").toLowerCase();
      let score = body.split(query).length - 1;
      if (title.includes(query)) score += 10;
      if (url.toLowerCase().includes(query)) score += 5;
      if (score > 0) hits.push({ url: url, title: doc.title, score: score });
    }

    hits.sort((a, b) => b.score - a.score);
    status.textContent = hits.length + " 条结果";

    for (const hit of hits.slice(0, 20)) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = hit.url;
      a.textContent = hit.title;
      li.appendChild(a);
      list.appendChild(li);
    }
  }
});
