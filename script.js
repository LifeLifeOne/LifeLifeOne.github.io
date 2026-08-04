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
