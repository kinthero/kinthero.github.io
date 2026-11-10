document.addEventListener("DOMContentLoaded", () => {
  const bar = document.getElementById("reading-progress");
  const btn = document.getElementById("back-to-top");

  function onScroll() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    if (bar) {
      bar.style.width = (max > 0 ? (doc.scrollTop / max) * 100 : 0) + "%";
    }
    if (btn) {
      btn.classList.toggle("visible", doc.scrollTop > 400);
    }
  }

  if (btn) {
    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
});
