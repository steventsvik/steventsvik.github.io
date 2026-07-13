/* Steven Tsvik — portfolio interactions */

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- cycling hero word ---------- */
/* auto-cycles; hover pauses; click/tap advances immediately */

const WORDS = ["data", "markets", "startups", "strategy"];
const cycleEl = document.getElementById("cycleWord");
let wordIndex = 0;
let cyclePaused = false;
let swapping = false;

function swapWord() {
  if (swapping) return;
  swapping = true;
  cycleEl.classList.add("is-out");
  setTimeout(() => {
    wordIndex = (wordIndex + 1) % WORDS.length;
    cycleEl.textContent = WORDS[wordIndex];
    cycleEl.classList.remove("is-out");
    cycleEl.classList.add("is-in");
    setTimeout(() => {
      cycleEl.classList.remove("is-in");
      swapping = false;
    }, 500);
  }, 350);
}

if (cycleEl) {
  cycleEl.addEventListener("click", swapWord);
  if (!reducedMotion) {
    cycleEl.addEventListener("mouseenter", () => (cyclePaused = true));
    cycleEl.addEventListener("mouseleave", () => (cyclePaused = false));
    setInterval(() => {
      if (!cyclePaused) swapWord();
    }, 2600);
  }
}

/* ---------- custom cursor follower ---------- */

const cursorEl = document.getElementById("cursor");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (cursorEl && finePointer && !reducedMotion) {
  let targetX = -100, targetY = -100;
  let x = targetX, y = targetY;
  let cursorShown = false;

  document.addEventListener("mousemove", (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    if (!cursorShown) {
      x = targetX; y = targetY;
      cursorEl.classList.add("is-on");
      cursorShown = true;
    }
  });
  document.addEventListener("mouseleave", () => {
    cursorEl.classList.remove("is-on");
    cursorShown = false;
  });

  (function follow() {
    // tight tracking — the circle IS the cursor, so it can't lag far behind
    x += (targetX - x) * 0.4;
    y += (targetY - y) * 0.4;
    cursorEl.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    requestAnimationFrame(follow);
  })();

  // grow into a ring over anything interactive, shrink back off it
  const HOVERABLE = "a, button, .entry, .stat, .marquee-track span";
  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(HOVERABLE)) cursorEl.classList.add("is-hover");
  });
  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(HOVERABLE)) cursorEl.classList.remove("is-hover");
  });
}

/* ---------- experience accordion (compact rows, expand on click) ---------- */

const xpEntries = document.querySelectorAll(".timeline--xp .entry");

xpEntries.forEach((entry) => {
  entry.addEventListener("click", () => {
    const nowOpen = !entry.classList.contains("is-open");
    // single-open: close the others first
    xpEntries.forEach((other) => {
      other.classList.remove("is-open");
      other.querySelector(".entry-toggle").setAttribute("aria-expanded", "false");
    });
    if (nowOpen) {
      entry.classList.add("is-open");
      entry.querySelector(".entry-toggle").setAttribute("aria-expanded", "true");
    }
  });
});

/* ---------- scrollspy: light up the current section's nav link ---------- */

const spyLinks = document.querySelectorAll(".frame--nav a[data-spy]");
const spySections = [...spyLinks].map((a) =>
  document.getElementById(a.dataset.spy)
).filter(Boolean);

if (spySections.length) {
  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          spyLinks.forEach((a) =>
            a.classList.toggle("is-active", a.dataset.spy === entry.target.id)
          );
        }
      });
    },
    { rootMargin: "-35% 0px -55% 0px" }
  );
  spySections.forEach((s) => spyObserver.observe(s));

  // clear highlight back at the very top (hero)
  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY < window.innerHeight * 0.4) {
        spyLinks.forEach((a) => a.classList.remove("is-active"));
      }
    },
    { passive: true }
  );
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

/* ---------- theme toggle ---------- */

const themeBtn = document.getElementById("themeToggle");
if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
  });
}

/* ---------- work mosaic: tiles close in as you scroll ---------- */

const mosaic = document.getElementById("mosaic");
if (mosaic && !reducedMotion) {
  const tiles = [...mosaic.querySelectorAll(".tile")];
  const COLS = 5;
  const SPREAD = 260; // px each ring of tiles starts away from its slot

  tiles.forEach((tile, i) => {
    const r = Math.floor(i / COLS) - 2;
    const c = (i % COLS) - 2;
    tile.dataset.dx = c * SPREAD;
    tile.dataset.dy = r * SPREAD;
  });

  let progress = 0;

  function mosaicTick() {
    const box = mosaic.parentElement.getBoundingClientRect();
    const vh = window.innerHeight;
    // 0 → section top at viewport bottom; 1 → scrolled ~75% of a screen into it
    const target = Math.min(1, Math.max(0, (vh - box.top) / (vh * 0.75)));
    progress += (target - progress) * 0.09;

    const f = 1 - progress;
    tiles.forEach((tile) => {
      tile.style.transform = `translate(${tile.dataset.dx * f}px, ${tile.dataset.dy * f}px)`;
      tile.style.opacity = 0.1 + 0.9 * progress;
    });
    requestAnimationFrame(mosaicTick);
  }
  mosaicTick();
}

/* ---------- hide scroll hint after scrolling ---------- */

window.addEventListener(
  "scroll",
  () => document.body.classList.toggle("scrolled", window.scrollY > 80),
  { passive: true }
);
