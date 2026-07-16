// ============ LOADING SCREEN ============
window.addEventListener("load", () => {
  const loadingScreen = document.getElementById("loading-screen");
  if (loadingScreen) {
    setTimeout(() => {
      loadingScreen.classList.add("hidden");
      document.body.style.overflow = "";
    }, 1500);
  }
});

// Prevent scroll during loading
document.body.style.overflow = "hidden";

// ============ AOS ============
document.addEventListener("DOMContentLoaded", () => {
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 650,
      easing: "ease-out-cubic",
      once: true,
      offset: 50,
      disable: window.innerWidth < 480 ? "phone" : false,
    });
  }
});

// ============ SCROLL EVENTS (throttled) ============
const scrollProgress = document.getElementById("scroll-progress");
const header = document.getElementById("header");
const backToTop = document.getElementById("back-to-top");
let scrollTicking = false;

window.addEventListener("scroll", () => {
  if (!scrollTicking) {
    requestAnimationFrame(() => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollProgress) scrollProgress.style.width = ((scrollTop / docHeight) * 100) + "%";
      if (header) header.classList.toggle("scrolled", scrollTop > 50);
      if (backToTop) backToTop.classList.toggle("visible", scrollTop > 500);
      updateActiveNav(scrollTop);
      scrollTicking = false;
    });
    scrollTicking = true;
  }
}, { passive: true });

// ============ ACTIVE NAV ============
function updateActiveNav(scrollPos) {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  const pos = scrollPos + 160;
  let current = "";
  sections.forEach((s) => {
    if (pos >= s.offsetTop && pos < s.offsetTop + s.offsetHeight) current = s.id;
  });
  navLinks.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === `#${current}`));
}

// ============ MOBILE MENU ============
const menuIcon = document.getElementById("menu-icon");
const navbar = document.getElementById("navbar");
if (menuIcon && navbar) {
  menuIcon.addEventListener("click", () => {
    const open = navbar.classList.toggle("active");
    menuIcon.classList.toggle("active", open);
    menuIcon.setAttribute("aria-expanded", open);
    document.body.style.overflow = open ? "hidden" : "";
  });
  document.querySelectorAll(".nav-link").forEach((l) => {
    l.addEventListener("click", () => {
      navbar.classList.remove("active");
      menuIcon.classList.remove("active");
      menuIcon.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navbar.classList.contains("active")) {
      navbar.classList.remove("active");
      menuIcon.classList.remove("active");
      menuIcon.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
  });
}

// ============ SMOOTH SCROLL ============
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      const hh = header ? header.offsetHeight : 80;
      window.scrollTo({ top: target.offsetTop - hh, behavior: "smooth" });
    }
  });
});

// ============ TYPED.JS ============
document.addEventListener("DOMContentLoaded", () => {
  if (typeof Typed !== "undefined") {
    new Typed(".multiple-text", {
      strings: ["مونتير فيديوهات ريلز", "Reels Editor", "Shorts Creator", "TikTok Specialist", "Motion Designer"],
      typeSpeed: 65,
      backSpeed: 35,
      backDelay: 1800,
      loop: true,
    });
  }
});

// ============ COUNTER (Optimized) ============
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = parseInt(el.dataset.count);
    const step = target / (1200 / 16);
    let cur = 0;
    const tick = () => {
      cur += step;
      if (cur < target) {
        el.textContent = Math.floor(cur);
        requestAnimationFrame(tick);
      } else {
        el.textContent = target;
      }
    };
    tick();
    counterObs.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll(".stat-number").forEach((c) => counterObs.observe(c));

// ============ BACK TO TOP ============
if (backToTop) backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// ============ PARALLAX (desktop only) ============
if (window.innerWidth >= 768) {
  const orbs = document.querySelectorAll(".gradient-orb");
  if (orbs.length) {
    let pTick = false;
    window.addEventListener("scroll", () => {
      if (!pTick) {
        requestAnimationFrame(() => {
          const s = window.pageYOffset;
          orbs.forEach((orb, i) => {
            const sp = (i + 1) * 0.12;
            orb.style.transform = `translate(${s * sp * 0.2}px, ${s * sp * 0.35}px)`;
          });
          pTick = false;
        });
        pTick = true;
      }
    }, { passive: true });
  }
}

// ============ IMAGE LIGHTBOX ============
(function () {
  const overlay = document.getElementById("lightbox-overlay");
  const imgEl = document.getElementById("lightbox-img");
  const closeBtn = document.getElementById("lightbox-close");
  if (!overlay || !imgEl) return;

  function open(src, alt) {
    imgEl.src = src;
    imgEl.alt = alt || "";
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }
  function close() {
    overlay.classList.remove("active");
    document.body.style.overflow = "";
    setTimeout(() => { imgEl.src = ""; }, 350);
  }

  document.querySelectorAll(".testimonial-screenshot").forEach((el) => {
    const img = el.querySelector("img");
    if (!img) return;
    el.addEventListener("click", () => open(img.src, img.alt));
    el.addEventListener("keydown", (e) => { if (e.key === "Enter") open(img.src, img.alt); });
  });

  if (closeBtn) closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("active")) close();
  });
})();

// ============ LAZY LOADING FOR VIDEOS & IMAGES ============
if ("IntersectionObserver" in window) {
  const lazyObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const el = e.target;
        if (el.dataset.src) {
          el.src = el.dataset.src;
          el.classList.add("loaded");
        }
        if (el.dataset.srcset) {
          el.srcset = el.dataset.srcset;
        }
        lazyObs.unobserve(el);
      }
    });
  }, { rootMargin: "200px" });

  document.querySelectorAll("img[data-src]").forEach((img) => lazyObs.observe(img));
  document.querySelectorAll("img[data-srcset]").forEach((img) => lazyObs.observe(img));
}

// ============ PERFORMANCE: Debounce utility ============
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ============ EASTER EGG ============
console.log("%c🎬 Abdullah Ahmed - Video Editor", "font-size:22px;font-weight:900;color:#38bdf8;");
console.log("%cLooking for a video editor? Let's work together!", "font-size:13px;color:#8b5cf6;");
