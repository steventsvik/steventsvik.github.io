/* Steven Tsvik — portfolio interactions */

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- cycling hero word ---------- */

const WORDS = ["data", "markets", "startups", "strategy"];
const cycleEl = document.getElementById("cycleWord");
let wordIndex = 0;

if (cycleEl && !reducedMotion) {
  setInterval(() => {
    cycleEl.classList.add("is-out");
    setTimeout(() => {
      wordIndex = (wordIndex + 1) % WORDS.length;
      cycleEl.textContent = WORDS[wordIndex];
      cycleEl.classList.remove("is-out");
      cycleEl.classList.add("is-in");
      setTimeout(() => cycleEl.classList.remove("is-in"), 500);
    }, 350);
  }, 2600);
}

/* ---------- scroll reveals ---------- */

const revealEls = document.querySelectorAll(".reveal");

if (reducedMotion) {
  revealEls.forEach((el) => el.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );
  revealEls.forEach((el) => observer.observe(el));
}

/* ---------- stat count-up ---------- */

function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimals || "0", 10);
  const suffix = el.dataset.suffix || "";
  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.innerHTML = (target * eased).toFixed(decimals) + suffix;
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const statEls = document.querySelectorAll(".stat-num");

if (reducedMotion) {
  statEls.forEach((el) => {
    el.innerHTML = el.dataset.count + (el.dataset.suffix || "");
  });
} else {
  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  statEls.forEach((el) => statObserver.observe(el));
}

/* ---------- hide scroll hint after scrolling ---------- */

window.addEventListener(
  "scroll",
  () => document.body.classList.toggle("scrolled", window.scrollY > 80),
  { passive: true }
);
