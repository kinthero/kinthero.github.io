(() => {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");

  function apply(theme) {
    const eff = theme === "light" || theme === "dark" ? theme : (mq.matches ? "dark" : "light");
    document.documentElement.dataset.theme = theme || "auto";
    document.getElementById("giallo-light").media = eff === "light" ? "all" : "not all";
    document.getElementById("giallo-dark").media = eff === "dark" ? "all" : "not all";
    document.dispatchEvent(new CustomEvent("themechange", { detail: eff }));
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;
    const icons = { auto: "◐", light: "☀", dark: "☾" };
    const names = { auto: "跟随系统", light: "亮色", dark: "深色" };
    btn.textContent = icons[theme || "auto"];
    btn.title = "主题：" + names[theme || "auto"] + "（点击切换）";
  }

  apply(localStorage.getItem("theme"));

  mq.addEventListener("change", () => apply(localStorage.getItem("theme")));

  document.addEventListener("DOMContentLoaded", () => {
    const order = ["auto", "light", "dark"];
    apply(localStorage.getItem("theme"));
    document.getElementById("theme-toggle").addEventListener("click", () => {
      const cur = localStorage.getItem("theme") || "auto";
      const next = order[(order.indexOf(cur) + 1) % order.length];
      if (next === "auto") localStorage.removeItem("theme");
      else localStorage.setItem("theme", next);
      apply(next);
    });
  });
})();
