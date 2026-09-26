(() => {
  const canvas = document.getElementById("helix");
  const ctx = canvas.getContext("2d");
  const ROLES = [
    { id: "INTAKE",  color: "#22d3ee", y: 0 },
    { id: "ROUTER",  color: "#8b7cff", y: 1 },
    { id: "WORKER",  color: "#ffc14d", y: 2 },
    { id: "CRITIC",  color: "#ff4d9d", y: 3 },
    { id: "MEMORY",  color: "#6cffb2", y: 4 },
    { id: "SHIP",    color: "#e8eef6", y: 5 },
  ];
  const BRIEFS = [
    "map whale wallet cluster to risk score",
    "rewrite reel caption for MATRIX.FILES desk",
    "cut ALPR event into three evidence claims",
    "route lead swarm batch through critic",
    "compile nexus graph snapshot for ops",
    "validate prism telemetry packet schema",
  ];

  const state = {
    running: true,
    rot: 0.35,
    zoom: 1,
    drag: false,
    lastX: 0,
    t: 0,
    packets: [],
    shipped: 0,
    blocked: 0,
    bus: [],
    selected: null,
    nextId: 1,
    load: Object.fromEntries(ROLES.map((r) => [r.id, 0])),
  };

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.parentElement.getBoundingClientRect();
    canvas.width = Math.floor(r.width * dpr);
    canvas.height = Math.floor(r.height * dpr);
    canvas.style.width = r.width + "px";
    canvas.style.height = r.height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener("resize", resize);
  resize();

  function log(msg) {
    state.bus.unshift({ t: Date.now(), msg });
    if (state.bus.length > 14) state.bus.pop();
    renderBus();
  }

  function inject(brief) {
    const id = "HX-" + String(state.nextId++).padStart(4, "0");
    state.packets.push({
      id,
      brief: brief || BRIEFS[Math.floor(Math.random() * BRIEFS.length)],
      rung: 0,
      progress: 0,
      tokens: 400 + Math.floor(Math.random() * 700),
      lat: 400 + Math.floor(Math.random() * 1600),
      phase: "climb",
      born: performance.now(),
    });
    state.load.INTAKE++;
    log(`${id} seated · INTAKE`);
  }

  function advance(p, dt) {
    if (p.phase === "done") return;
    p.progress += dt * (0.35 + Math.random() * 0.25);
    if (p.progress < 1) return;
    p.progress = 0;
    const from = ROLES[p.rung].id;
    if (from === "CRITIC" && Math.random() < 0.08) {
      state.blocked++;
      p.rung = 2;
      state.load.CRITIC = Math.max(0, state.load.CRITIC - 1);
      state.load.WORKER++;
      log(`${p.id} blocked · CRITIC → WORKER`);
      return;
    }
    if (p.rung >= ROLES.length - 1) {
      p.phase = "done";
      state.shipped++;
      state.load.SHIP = Math.max(0, state.load.SHIP - 1);
      log(`${p.id} shipped · MEMORY receipt written`);
      setTimeout(() => {
        state.packets = state.packets.filter((x) => x !== p);
      }, 700);
      return;
    }
    state.load[from] = Math.max(0, state.load[from] - 1);
    p.rung += 1;
    state.load[ROLES[p.rung].id]++;
    log(`${p.id} ${from} → ${ROLES[p.rung].id}`);
  }

  function helixPoint(rung, strand, extra, w, h) {
    const turns = 1.65;
    const t = (rung + extra) / 5;
    const ang = t * Math.PI * 2 * turns + state.rot + strand * Math.PI;
    const cx = w * 0.5;
    const cy = h * 0.52;
    const amp = Math.min(w, h) * 0.18 * state.zoom;
    const y = cy + (0.5 - t) * h * 0.72 * state.zoom;
    const x = cx + Math.cos(ang) * amp;
    const z = Math.sin(ang);
    return { x, y, z, ang };
  }

  function draw() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);

    const g = ctx.createRadialGradient(w * 0.5, h * 0.5, 20, w * 0.5, h * 0.55, Math.max(w, h) * 0.7);
    g.addColorStop(0, "#0c121b");
    g.addColorStop(1, "#050608");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < 50; i++) {
      const x = ((i * 97) % w);
      const y = ((i * 53 + state.t * 8) % h);
      ctx.fillStyle = "rgba(34,211,238,0.08)";
      ctx.fillRect(x, y, 1, 1);
    }

    const samples = 90;
    for (let strand = 0; strand < 2; strand++) {
      ctx.beginPath();
      for (let i = 0; i <= samples; i++) {
        const extra = (i / samples) * 5;
        const p = helixPoint(0, strand, extra, w, h);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = strand ? "rgba(255,77,157,0.45)" : "rgba(34,211,238,0.5)";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    for (let i = 0; i <= 5; i++) {
      const a = helixPoint(i, 0, 0, w, h);
      const b = helixPoint(i, 1, 0, w, h);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = "rgba(125,138,160,0.28)";
      ctx.lineWidth = 1;
      ctx.stroke();

      const role = ROLES[i];
      const node = a.z > b.z ? a : b;
      ctx.beginPath();
      ctx.arc(node.x, node.y, 7, 0, Math.PI * 2);
      ctx.fillStyle = role.color;
      ctx.fill();
      if (state.selected === role.id) {
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.font = "11px IBM Plex Sans, sans-serif";
      ctx.fillStyle = role.color;
      ctx.textAlign = node.x > w * 0.5 ? "left" : "right";
      ctx.fillText(role.id, node.x + (node.x > w * 0.5 ? 14 : -14), node.y + 4);
    }

    for (const p of state.packets) {
      const extra = p.rung + p.progress;
      const pt = helixPoint(0, 0, extra, w, h);
      const r = 4 + Math.sin(state.t * 6 + p.rung) * 1.2;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
      ctx.fillStyle = ROLES[p.rung].color;
      ctx.fill();
      ctx.fillStyle = "rgba(232,238,246,0.85)";
      ctx.font = "10px IBM Plex Mono, monospace";
      ctx.textAlign = "left";
      ctx.fillText(p.id, pt.x + 8, pt.y - 8);
    }
  }

  function renderRoles() {
    const el = document.getElementById("roles");
    el.innerHTML = ROLES.map((r) =>
      `<li><span><i class="dot" style="background:${r.color}"></i>${r.id}</span><span>${state.load[r.id]}</span></li>`
    ).join("");
  }
  function renderBus() {
    document.getElementById("bus").innerHTML = state.bus
      .map((b) => `<li>${b.msg}</li>`).join("");
  }
  function renderStats() {
    const live = state.packets.filter((p) => p.phase !== "done");
    const avgLat = live.length ? Math.round(live.reduce((a, p) => a + p.lat, 0) / live.length) : 0;
    const avgTok = live.length ? Math.round(live.reduce((a, p) => a + p.tokens, 0) / live.length) : 0;
    const cover = Math.min(99, 72 + live.length * 3);
    document.getElementById("s-runs").textContent = live.length;
    document.getElementById("s-ship").textContent = state.shipped;
    document.getElementById("s-lat").textContent = avgLat;
    document.getElementById("s-tok").textContent = avgTok;
    document.getElementById("s-brk").textContent = state.blocked;
    document.getElementById("s-cov").textContent = cover + "%";
    const now = new Date();
    document.getElementById("clock").textContent = now.toTimeString().slice(0, 8);
  }

  let last = performance.now();
  function tick(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    state.t += dt;
    if (state.running) {
      state.rot += dt * 0.22;
      for (const p of state.packets) advance(p, dt);
      if (state.packets.filter((p) => p.phase !== "done").length < 3 && Math.random() < 0.012) inject();
    }
    draw();
    renderRoles();
    renderStats();
    requestAnimationFrame(tick);
  }

  canvas.addEventListener("pointerdown", (e) => {
    state.drag = true;
    state.lastX = e.clientX;
  });
  window.addEventListener("pointerup", () => { state.drag = false; });
  window.addEventListener("pointermove", (e) => {
    if (!state.drag) return;
    state.rot += (e.clientX - state.lastX) * 0.01;
    state.lastX = e.clientX;
  });
  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    state.zoom = Math.max(0.7, Math.min(1.6, state.zoom + (e.deltaY > 0 ? -0.06 : 0.06)));
  }, { passive: false });
  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    let hit = null;
    for (let i = 0; i <= 5; i++) {
      const a = helixPoint(i, 0, 0, w, h);
      const b = helixPoint(i, 1, 0, w, h);
      const n = a.z > b.z ? a : b;
      if ((x - n.x) ** 2 + (y - n.y) ** 2 < 20 * 20) hit = ROLES[i].id;
    }
    state.selected = hit;
    if (hit) log(`inspect · ${hit} load ${state.load[hit]}`);
  });

  document.getElementById("inject").onclick = () => inject();
  document.getElementById("toggle").onclick = () => {
    state.running = !state.running;
    document.getElementById("toggle").textContent = state.running ? "Pause" : "Run";
  };

  inject("seat inaugural climb on the helix");
  inject();
  requestAnimationFrame(tick);
})();
