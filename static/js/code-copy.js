document.querySelectorAll("pre.giallo").forEach((pre) => {
  const code = pre.querySelector("code");
  if (!code || code.dataset.lang === "mermaid") return;

  const wrap = document.createElement("div");
  wrap.className = "code-wrap";
  pre.parentNode.insertBefore(wrap, pre);

  const header = document.createElement("div");
  header.className = "code-header";

  const lang = document.createElement("span");
  lang.className = "code-lang";
  const langName = code.dataset.lang;
  lang.textContent = langName && langName !== "plain" ? langName : "";

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "copy-btn";
  btn.textContent = "复制";

  btn.addEventListener("click", async () => {
    await navigator.clipboard.writeText(code.textContent);
    btn.textContent = "已复制";
    setTimeout(() => { btn.textContent = "复制"; }, 1500);
  });

  header.appendChild(lang);
  header.appendChild(btn);
  wrap.appendChild(header);
  wrap.appendChild(pre);
});
