const toggler = document.querySelector('.navbar-toggler');
const navList = document.querySelector('.navbar-nav-list');

if (toggler && navList) {
  toggler.addEventListener('click', () => {
    navList.classList.toggle('open');
  });
  navList.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navList.classList.remove('open'));
  });
}

function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-nav-list a').forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
    link.classList.toggle('nav-active-page', href === path);
  });
}
setActiveNav();

function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
}
initReveal();

function initProgressBars() {
  const bars = document.querySelectorAll('.phase-progress-fill');
  if (!bars.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const target = e.target.dataset.progress || '0';
        e.target.style.width = target + '%';
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => {
    b.style.width = '0%';
    io.observe(b);
  });
}
initProgressBars();

function initPhaseCards() {
  const phaseCards = document.querySelectorAll('.phase-card');
  phaseCards.forEach(card => {
    card.addEventListener('click', () => {
      const targetId = card.dataset.detail;
      if (!targetId) return;
      const detail = document.getElementById(targetId);
      if (!detail) return;

      const wasActive = card.classList.contains('active');
      phaseCards.forEach(c => c.classList.remove('active'));
      document.querySelectorAll('.phase-detail').forEach(d => d.classList.remove('show'));
      if (!wasActive) {
        card.classList.add('active');
        detail.classList.add('show');
        detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });
}
initPhaseCards();

function initMissionTimer() {
  const MISSION_START = new Date('2026-05-25T00:00:00');
  const daysEl = document.getElementById('timer-days');
  const hoursEl = document.getElementById('timer-hours');
  const minsEl = document.getElementById('timer-mins');
  const secsEl = document.getElementById('timer-secs');
  const phaseEl = document.getElementById('timer-phase');
  if (!daysEl) return;

  function tick() {
    const now = new Date();
    const diff = now - MISSION_START;
    const days = Math.floor(diff / 864e5);
    const hours = Math.floor((diff % 864e5) / 36e5);
    const mins = Math.floor((diff % 36e5) / 6e4);
    const secs = Math.floor((diff % 6e4) / 1e3);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(mins).padStart(2, '0');
    secsEl.textContent = String(secs).padStart(2, '0');

    if (phaseEl) {
      const phase = days < 5 ? 'Fase 1 — Desintoxicação' :
        days < 15 ? 'Fase 2 — Estruturação do Solo' :
        days < 30 ? 'Fase 3 — Nutrição e Regeneração' :
        'Fase 4 — Proteção e Estabilidade';
      phaseEl.textContent = '● Fase 0 concluída · ' + phase;
    }
  }
  tick();
  setInterval(tick, 1000);
}
initMissionTimer();

function initHeroParallax() {
  const hero = document.querySelector('.hero-section');
  const stars = document.querySelector('.hero-stars');
  const glow = document.querySelector('.hero-glow');
  if (!hero || !stars) return;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const cx = rect.width / 2, cy = rect.height / 2;
    const dx = (e.clientX - rect.left - cx) / cx;
    const dy = (e.clientY - rect.top - cy) / cy;
    stars.style.transform = `scale(1.12) translate(${dx * -16}px, ${dy * -16}px)`;
    if (glow) glow.style.transform = `translate(${dx * 10}px, ${dy * 10}px)`;
  });

  hero.addEventListener('mouseleave', () => {
    stars.style.transform = 'scale(1) translate(0,0)';
    if (glow) glow.style.transform = 'translate(0,0)';
  });
}
initHeroParallax();

function initTerminal() {
  const termBody = document.getElementById('terminal-body');
  if (!termBody) return;

  const messages = [
    ['info',    'Monitorando níveis de umidade no micélio...'],
    ['success', 'Detectado aumento de pH em 0.2 unidades.'],
    ['info',    'Rede fúngica expandindo em direção ao setor D.'],
    ['warning', 'Flutuação de temperatura detectada: -2°C no setor A.'],
    ['success', 'Radiação UV dentro dos parâmetros aceitáveis.'],
    ['success', 'Simbiose micorrízica estabelecida no cluster 3.'],
    ['info',    'Toxicidade reduzida em mais 3% nas últimas 2 horas.'],
    ['warning', 'Sensor #18 reportou leitura anômala — reavaliando.'],
    ['success', 'Diagnóstico: falso positivo. Sensor #18 estabilizado.'],
    ['info',    'Iniciando ciclo de liberação de enzimas — Fase 2.'],
    ['success', 'Atividade bioelétrica aumentou 8% no setor B.'],
    ['info',    'Análise preditiva: Fase 3 estimada para 12 dias.'],
  ];

  let idx = 0;

  function addLog(type, msg) {
    const now = new Date().toLocaleTimeString('pt-BR');
    const line = document.createElement('div');
    line.className = 'log-line';
    line.innerHTML = `<span class="log-time">${now}</span><span class="log-${type}">${msg}</span>`;
    termBody.appendChild(line);
    termBody.scrollTop = termBody.scrollHeight;
    while (termBody.children.length > 20) {
      termBody.removeChild(termBody.firstChild);
    }
  }

  setInterval(() => {
    const [type, msg] = messages[idx % messages.length];
    addLog(type, msg);
    idx++;
  }, 3500);
}
initTerminal();

function initChart() {
  const canvas = document.getElementById('metricsChart');
  if (!canvas || !window.Chart) return;

  const labels = ['00:00','04:00','08:00','12:00','16:00','20:00'];
  const phData  = [6.2, 6.4, 6.6, 6.8, 7.0, 7.1];
  const humData = [45, 52, 58, 61, 65, 68];
  const toxData = [35, 32, 28, 24, 20, 17];
  const bioData = [28, 34, 42, 51, 58, 63];

  new window.Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [
        { label: 'pH do Solo', data: phData, borderColor: '#1D9E75', backgroundColor: 'rgba(29,158,117,0.1)', tension: 0.4, fill: true, pointRadius: 3 },
        { label: 'Umidade (%)', data: humData, borderColor: '#533AB7', backgroundColor: 'rgba(83,58,183,0.1)', tension: 0.4, fill: true, pointRadius: 3 },
        { label: 'Toxicidade (ppm)', data: toxData, borderColor: '#993C1D', backgroundColor: 'rgba(153,60,29,0.1)', tension: 0.4, fill: true, pointRadius: 3 },
        { label: 'Atividade Bioelétrica', data: bioData, borderColor: '#FAC775', backgroundColor: 'rgba(250,199,117,0.05)', tension: 0.4, fill: false, pointRadius: 3 },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          labels: { color: '#8899aa', font: { size: 11, family: "'JetBrains Mono', monospace" }, boxWidth: 10, padding: 14 },
        },
        tooltip: {
          backgroundColor: '#0d1220',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          titleColor: '#e8f0f8',
          bodyColor: '#8899aa',
          padding: 10,
        },
      },
      scales: {
        x: { ticks: { color: '#8899aa', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
        y: { ticks: { color: '#8899aa', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
      },
    },
  });
}
initChart();
