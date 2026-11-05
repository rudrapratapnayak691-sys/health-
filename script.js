/* AETHER Health Center — interactive behaviors */

document.addEventListener("DOMContentLoaded", () => {
  initParticles();
  initParallax();
  initBodyDiagram();
  initDashboard();
  initExploreButton();
  initNavHighlight();
  initSceneReveal();
});

function initSceneReveal() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".scene").forEach(s => s.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".scene").forEach(s => observer.observe(s));
}

function initParticles() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.getElementById("ambient-particles");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let particles = [];
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.min(65, Math.floor((w * h) / 19000));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2.2 + 0.6,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.25,
        alpha: Math.random() * 0.4 + 0.15
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(195, 100%, 70%, ${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();
  window.addEventListener("resize", () => {
    resize();
    createParticles();
  });
}

function initParallax() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const earth = document.querySelector(".earth");
  const craft = document.querySelector(".spacecraft-orbit");
  if (!earth) return;

  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    earth.style.transform = `translateY(${y * 0.12}px)`;
    if (craft && y < window.innerHeight) {
      craft.style.opacity = Math.max(0, 1 - y / (window.innerHeight * 0.6));
    }
  }, { passive: true });
}

const bodyData = {
  muscles: {
    title: "Muscles",
    text: "In microgravity, muscles do less work. Anti-gravity muscles in the legs and back can weaken without regular exercise. About two hours of daily resistance and aerobic training helps limit the loss."
  },
  bones: {
    title: "Bones",
    text: "Weight-bearing bones lose density at roughly 1% per month without countermeasures. Exercise that loads the skeleton, plus good nutrition (calcium and vitamin D), helps protect bone health."
  },
  circulation: {
    title: "Circulation",
    text: "Fluids shift toward the head, causing a puffy face and thinner legs. The heart works differently without gravity. Regular aerobic exercise helps maintain cardiovascular fitness."
  },
  balance: {
    title: "Balance",
    text: "The vestibular system adapts to weightlessness. Upon return to Earth, astronauts may feel unsteady until the system readjusts. Exercise and gradual reconditioning help recovery."
  },
  vision: {
    title: "Vision",
    text: "Some astronauts experience changes in vision linked to fluid shifts and pressure on the eyes (Spaceflight Associated Neuro-ocular Syndrome). Monitoring and research continue to understand and manage this."
  }
};

function initBodyDiagram() {
  const nodes = document.querySelectorAll(".body-svg .node");
  const panel = document.getElementById("body-info");
  if (!nodes.length || !panel) return;

  nodes.forEach(node => {
    node.addEventListener("click", () => {
      nodes.forEach(n => n.classList.remove("active"));
      node.classList.add("active");
      const key = node.dataset.info;
      const data = bodyData[key];
      if (data) {
        panel.innerHTML = `<h3>${data.title}</h3><p>${data.text}</p>`;
      }
    });

    node.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        node.click();
      }
    });
    node.setAttribute("tabindex", "0");
    node.setAttribute("role", "button");
  });
}

function initDashboard() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const gauges = document.querySelectorAll(".gauge");
  gauges.forEach(g => {
    const base = parseFloat(g.dataset.value);
    const valueEl = g.querySelector(".gauge-value");
    if (!valueEl) return;

    setInterval(() => {
      const variation = (Math.random() - 0.5) * (base * 0.04);
      let next = base + variation;
      if (g.classList.contains("stress")) next = Math.max(1.5, Math.min(5, next));
      else if (g.classList.contains("nutrition")) next = Math.max(85, Math.min(98, next));
      else next = Math.max(base * 0.95, Math.min(base * 1.05, next));

      const display = next >= 10 ? next.toFixed(1) : next.toFixed(1);
      valueEl.childNodes[0].textContent = display;
    }, 3400 + Math.random() * 1600);
  });
}

function initExploreButton() {
  const btn = document.getElementById("explore-btn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    document.getElementById("body").scrollIntoView({ behavior: "smooth" });
  });
}

function initNavHighlight() {
  const sections = document.querySelectorAll("main section[id]");
  const links = document.querySelectorAll(".main-nav a");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove("active"));
        const active = document.querySelector(`.main-nav a[href="#${entry.target.id}"]`);
        if (active) active.classList.add("active");
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => observer.observe(s));
}
