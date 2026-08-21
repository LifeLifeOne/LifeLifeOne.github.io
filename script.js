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

const pipelineNav = document.querySelector("nav[data-pipeline-nav]");
const pipelineLinks = [...pipelineNav.querySelectorAll("a")];
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
    if (index === activeIndex) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
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

function applyPipelineVisibility(isVisible) {
  const state = isVisible ? "visible" : "hidden";
  document.documentElement.dataset.pipelineNav = state;
  pipelineNav.toggleAttribute("inert", !isVisible);
  pipelineRestore.toggleAttribute("inert", isVisible);
  if (isVisible) {
    pipelineNav.removeAttribute("aria-hidden");
    pipelineRestore.setAttribute("aria-hidden", "true");
  } else {
    pipelineNav.setAttribute("aria-hidden", "true");
    pipelineRestore.removeAttribute("aria-hidden");
  }
}

function focusAfterPipelineTransition(element, expectedState) {
  window.setTimeout(() => {
    if (document.documentElement.dataset.pipelineNav === expectedState) {
      element?.focus({ preventScroll: true });
    }
  }, prefersReducedMotion ? 0 : 200);
}

function setPipelineVisibility(isVisible, { focusActive = isVisible } = {}) {
  applyPipelineVisibility(isVisible);
  localStorage.setItem("pipeline-nav", isVisible ? "visible" : "hidden");
  if (isVisible && focusActive) {
    const activeLink = pipelineLinks.find((link) => link.classList.contains("is-active")) || pipelineLinks[0];
    focusAfterPipelineTransition(activeLink, "visible");
  }
}

pipelineClose.addEventListener("click", () => {
  setPipelineVisibility(false);
  focusAfterPipelineTransition(pipelineRestore, "hidden");
});

pipelineRestore.addEventListener("click", (event) => {
  setPipelineVisibility(true, { focusActive: event.detail === 0 });
});

pipelineLinks.forEach((link, index) => {
  link.addEventListener("focus", () => {
    pipelineMobileLabel.textContent = link.dataset.pipelineLabel;
    centerMobilePipelineJob(link);
  });

  link.addEventListener("keydown", (event) => {
    if (event.key === " " || event.key === "Spacebar") {
      event.preventDefault();
      link.click();
      window.requestAnimationFrame(() => link.focus({ preventScroll: true }));
      return;
    }

    const previousKeys = ["ArrowUp", "ArrowLeft"];
    const nextKeys = ["ArrowDown", "ArrowRight"];
    let targetIndex = null;

    if (previousKeys.includes(event.key)) targetIndex = (index - 1 + pipelineLinks.length) % pipelineLinks.length;
    if (nextKeys.includes(event.key)) targetIndex = (index + 1) % pipelineLinks.length;
    if (event.key === "Home") targetIndex = 0;
    if (event.key === "End") targetIndex = pipelineLinks.length - 1;
    if (targetIndex === null) return;

    event.preventDefault();
    pipelineLinks[targetIndex].focus({ preventScroll: true });
  });
});

pipelineNav.addEventListener("focusout", (event) => {
  if (pipelineNav.contains(event.relatedTarget)) return;
  const activeLink = pipelineLinks.find((link) => link.classList.contains("is-active"));
  if (activeLink) pipelineMobileLabel.textContent = activeLink.dataset.pipelineLabel;
});

applyPipelineVisibility(document.documentElement.dataset.pipelineNav === "visible");

function syncPipelineDefaultWithViewport() {
  if (localStorage.getItem("pipeline-nav")) return;
  applyPipelineVisibility(false);
}

window.addEventListener("resize", syncPipelineDefaultWithViewport);
