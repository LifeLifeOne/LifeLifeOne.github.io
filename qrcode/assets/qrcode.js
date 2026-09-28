const themeToggle = document.querySelector("[data-theme-toggle]");
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const themeLabel = themeToggle.querySelector(".sr-only");

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeColorMeta.content = theme === "dark" ? "#161511" : "#f5f3ec";
  themeLabel.textContent = theme === "dark" ? "Activer le thème clair" : "Activer le thème sombre";
  themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
}

applyTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");

themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("theme", nextTheme);
  applyTheme(nextTheme);
});

document.querySelector("[data-year]").textContent = new Date().getFullYear();
