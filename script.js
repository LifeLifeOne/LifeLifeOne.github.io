const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".navigation");
const header = document.querySelector("[data-header]");

function closeMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  navigation.classList.remove("open");
  document.body.classList.remove("menu-open");
}

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  navigation.classList.toggle("open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 12);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}

document.querySelector("[data-year]").textContent = new Date().getFullYear();

const themeToggle = document.querySelector("[data-theme-toggle]");
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const themeLabel = themeToggle.querySelector(".sr-only");

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  if (themeColorMeta) themeColorMeta.content = theme === "dark" ? "#161511" : "#f5f3ec";
  themeLabel.textContent = theme === "dark" ? "Activer le thème clair" : "Activer le thème sombre";
  themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
}

applyTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");

themeToggle.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("theme", next);
  applyTheme(next);
});

const pipelineLinks = [...document.querySelectorAll("nav[data-pipeline-nav] a")];
const pipelineSections = pipelineLinks.map((link) => document.querySelector(link.hash));
const pipelineList = document.querySelector("nav[data-pipeline-nav] ol");
const pipelineMobileLabel = document.querySelector("[data-pipeline-mobile-label]");
let pipelineTicking = false;
let previousPipelineIndex = -1;

function centerMobilePipelineJob(link) {
  if (!window.matchMedia("(max-width: 900px)").matches) return;
  const linkCenter = link.parentElement.offsetLeft + link.offsetLeft + link.offsetWidth / 2;
  const targetLeft = linkCenter - pipelineList.clientWidth / 2;
  pipelineList.scrollTo({
    left: targetLeft,
    behavior: prefersReducedMotion ? "auto" : "smooth",
  });
}

function updatePipeline() {
  const viewportMarker = window.scrollY + window.innerHeight * 0.42;
  const atPageEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  let activeIndex = atPageEnd ? pipelineSections.length - 1 : 0;

  pipelineSections.forEach((section, index) => {
    if (section && section.offsetTop <= viewportMarker) activeIndex = index;
  });

  pipelineLinks.forEach((link, index) => {
    const label = link.dataset.pipelineLabel;
    const state = index < activeIndex ? "terminé" : index === activeIndex ? "en cours" : "non exécuté";
    link.classList.toggle("is-complete", index < activeIndex);
    link.classList.toggle("is-active", index === activeIndex);
    link.toggleAttribute("aria-current", index === activeIndex);
    link.setAttribute("aria-label", `${label} — job ${state}`);
  });

  pipelineMobileLabel.textContent = pipelineLinks[activeIndex].dataset.pipelineLabel;
  if (activeIndex !== previousPipelineIndex) {
    centerMobilePipelineJob(pipelineLinks[activeIndex]);
    previousPipelineIndex = activeIndex;
  }

  pipelineTicking = false;
}

function requestPipelineUpdate() {
  if (pipelineTicking) return;
  pipelineTicking = true;
  window.requestAnimationFrame(updatePipeline);
}

updatePipeline();
window.addEventListener("scroll", requestPipelineUpdate, { passive: true });
window.addEventListener("resize", requestPipelineUpdate);

const pipelineClose = document.querySelector("[data-pipeline-close]");
const pipelineRestore = document.querySelector("[data-pipeline-restore]");

function setPipelineVisibility(isVisible) {
  const state = isVisible ? "visible" : "hidden";
  document.documentElement.dataset.pipelineNav = state;
  localStorage.setItem("pipeline-nav", state);
  if (isVisible) {
    (pipelineLinks.find((link) => link.classList.contains("is-active")) || pipelineLinks[0])
      ?.focus({ preventScroll: true });
  }
}

pipelineClose.addEventListener("click", () => {
  setPipelineVisibility(false);
  pipelineRestore.focus({ preventScroll: true });
});

pipelineRestore.addEventListener("click", () => setPipelineVisibility(true));

function syncPipelineDefaultWithViewport() {
  if (localStorage.getItem("pipeline-nav")) return;
  document.documentElement.dataset.pipelineNav = window.matchMedia("(max-width: 900px)").matches
    ? "hidden"
    : "visible";
}

window.addEventListener("resize", syncPipelineDefaultWithViewport);
