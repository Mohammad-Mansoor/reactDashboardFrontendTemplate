window.addEventListener("DOMContentLoaded", () => {
  const progressEl  = document.getElementById("progress");
  const glowEl      = document.getElementById("progress-glow");
  const percentEl   = document.getElementById("percent");
  const statusEl    = document.getElementById("status-text");
  const particlesCt = document.getElementById("particles");

  // ── Spawn floating particles ──────────────────────────────────────────────
  const PARTICLE_COUNT = 28;
  const COLORS = [
    "rgba(11,165,236,0.7)",
    "rgba(99,102,241,0.6)",
    "rgba(251,101,20,0.5)",
    "rgba(255,255,255,0.3)",
  ];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = document.createElement("div");
    p.className = "particle";

    const size   = Math.random() * 4 + 2;       // 2–6 px
    const left   = Math.random() * 100;          // 0–100 %
    const delay  = Math.random() * 8;            // stagger
    const dur    = Math.random() * 8 + 6;        // 6–14 s
    const color  = COLORS[Math.floor(Math.random() * COLORS.length)];

    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${left}%;
      background:${color};
      animation-duration:${dur}s;
      animation-delay:-${delay}s;
      box-shadow: 0 0 ${size * 2}px ${color};
    `;
    particlesCt.appendChild(p);
  }

  // ── Status messages that cycle during load ────────────────────────────────
  const messages = [
    "Initialising secure session…",
    "Loading application modules…",
    "Connecting to health services…",
    "Preparing your workspace…",
    "Applying security policies…",
    "Almost ready…",
  ];
  let msgIndex = 0;

  function nextMessage() {
    if (!statusEl) return;
    statusEl.style.opacity = "0";
    setTimeout(() => {
      msgIndex = (msgIndex + 1) % messages.length;
      statusEl.textContent = messages[msgIndex];
      statusEl.style.opacity = "1";
    }, 400);
  }

  const msgInterval = setInterval(nextMessage, 1600);

  // ── Progress updates from main process ───────────────────────────────────
  const cleanup = window.splashAPI.on("loading-progress", (value) => {
    const pct = Math.min(100, Math.max(0, Math.floor(value)));

    if (progressEl) progressEl.style.width = pct + "%";
    if (glowEl)     glowEl.style.left      = pct + "%";
    if (percentEl)  percentEl.textContent  = pct + "%";

    // Show "Almost ready" when close to done
    if (pct >= 90 && statusEl) {
      clearInterval(msgInterval);
      statusEl.style.opacity = "0";
      setTimeout(() => {
        statusEl.textContent = "Almost ready…";
        statusEl.style.opacity = "1";
      }, 400);
    }

    if (pct >= 100 && typeof cleanup === "function") {
      clearInterval(msgInterval);
      cleanup();
    }
  });
});