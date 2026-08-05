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

const hireScreen = document.querySelector(".hire-screen");
const glitchLayer = document.querySelector(".glitch-layer");
const hiringTrigger = document.querySelector("[data-hiring-trigger]");

function playHiringEffect() {
  if (
    document.body.classList.contains("glitch-active") ||
    hireScreen.classList.contains("is-active")
  ) return;
  document.body.classList.add("glitch-active");
}

glitchLayer.addEventListener("animationend", (event) => {
  if (event.animationName !== "glitch-flash") return;
  document.body.classList.remove("glitch-active");
  hireScreen.classList.add("is-active");
  hireScreen.setAttribute("aria-hidden", "false");
});

hireScreen.addEventListener("animationend", (event) => {
  if (event.animationName !== "hiring-screen") return;
  hireScreen.classList.remove("is-active");
  hireScreen.setAttribute("aria-hidden", "true");
});

hiringTrigger.addEventListener("click", (event) => {
  closeMenu();
  if (prefersReducedMotion) return;
  event.preventDefault();
  playHiringEffect();
});
