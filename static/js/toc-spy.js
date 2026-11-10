document.addEventListener("DOMContentLoaded", () => {
  const links = Array.from(document.querySelectorAll(".toc a"));
  if (!links.length) return;

  const headingIds = links.map((a) => {
    const href = a.getAttribute("href") || "";
    const idx = href.indexOf("#");
    return idx >= 0 ? decodeURIComponent(href.slice(idx + 1)) : "";
  });

  const headings = headingIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (!headings.length) return;

  function update() {
    let current = headings[0].id;
    for (const h of headings) {
      if (h.getBoundingClientRect().top <= 120) current = h.id;
    }
    links.forEach((a, i) => {
      a.classList.toggle("active", headingIds[i] === current);
    });
  }

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update, { passive: true });
});
