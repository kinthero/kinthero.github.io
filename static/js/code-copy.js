document.querySelectorAll("pre.giallo").forEach((pre) => {
  const code = pre.querySelector("code");
  if (!code || code.dataset.lang === "mermaid") return;

  const wrap = document.createElement("div");
  wrap.className = "code-wrap";
  pre.parentNode.insertBefore(wrap, pre);
  wrap.appendChild(pre);

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "copy-btn";
  btn.textContent = "复制";

  btn.addEventListener("click", async () => {
    await navigator.clipboard.writeText(code.textContent);
    btn.textContent = "已复制";
    setTimeout(() => { btn.textContent = "复制"; }, 1500);
  });

  wrap.appendChild(btn);
});
