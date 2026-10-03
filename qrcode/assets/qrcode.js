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

const revealEmailButton = document.querySelector("[data-reveal-email]");
const contactEmail = document.querySelector("[data-contact-email]");
const copyEmailButton = document.querySelector("[data-copy-email]");
const copyStatus = document.querySelector("[data-copy-status]");
const contactAddress = "vivien.barbeau.contact@gmail.com";

revealEmailButton.addEventListener("click", () => {
  contactEmail.hidden = false;
  revealEmailButton.setAttribute("aria-expanded", "true");
});

const copyStatusTimeouts = new WeakMap();

function showCopyStatus(message, duration = 3000, status = copyStatus) {
  window.clearTimeout(copyStatusTimeouts.get(status));
  status.textContent = message;
  status.classList.add("is-visible");
  copyStatusTimeouts.set(status, window.setTimeout(() => {
    status.classList.remove("is-visible");
    status.textContent = "";
  }, duration));
}

copyEmailButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(contactAddress);
    showCopyStatus("✓ Adresse e-mail copiée !");
  } catch {
    showCopyStatus("Copie impossible. Sélectionnez l’adresse pour la copier.", 6000);
  }
});

document.querySelector("[data-copy-hero-email]").addEventListener("click", async () => {
  const status = document.querySelector("[data-hero-copy-status]");
  try {
    await navigator.clipboard.writeText(contactAddress);
    showCopyStatus("✓ Adresse e-mail copiée !", 3000, status);
  } catch {
    showCopyStatus(`Copie impossible. Mon adresse : ${contactAddress}`, 6000, status);
  }
});
