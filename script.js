/* ================= SETTINGS (change these) ================= */
const SENDER    = "Soumyadeep";            // name shown at the end of the letter
const SIGNOFF   = "Forever yours,";         // word before the sender name
const LOAD_SECS = 5;                        // loading page length
const LETTER = (name) =>
`My dearest ${name},

Today the world got the most beautiful gift: you. Every moment with you feels like a dream I never want to wake up from.

You are my everything, my love, my life. I had no words, so I made this little surprise to tell you how much you mean to me.

May you get success in every work that you do, and may every wish of your heart come true. Whatever happens, I am always with you, any time, all time, forever.

Happy Birthday, my love. I love you forever.`;
/* ============================================================ */

const $ = (id) => document.getElementById(id);
let userName = "";

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => { s.classList.remove("active", "show"); });
  const el = $(id);
  el.classList.add("active");
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("show")));
}

/* ---------- 1. login ---------- */
function makeFloatingHearts() {
  const box = document.querySelector(".float-hearts");
  for (let i = 0; i < 22; i++) {
    const h = document.createElement("span");
    h.className = "fh"; h.textContent = "❤";
    h.style.left = Math.random() * 100 + "%";
    h.style.fontSize = 14 + Math.random() * 26 + "px";
    h.style.animationDuration = 8 + Math.random() * 10 + "s";
    h.style.animationDelay = -Math.random() * 14 + "s";
    box.appendChild(h);
  }
}
makeFloatingHearts();
showScreen("login");

$("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const v = $("nameInput").value.trim();
  if (v.length < 1) { $("loginError").textContent = "Please enter your name first."; return; }
  userName = v.replace(/[<>]/g, "");
  startLoading();
});

/* ---------- 2. loading (5 s) ---------- */
function startLoading() {
  showScreen("loading");
  $("loadingText").textContent = `Getting your surprise ready, ${userName}...`;
  const video = $("wishVideo");
  video.load();                                   // preload while the loader runs
  const t0 = performance.now(), total = LOAD_SECS * 1000;
  (function tick(now) {
    const p = Math.min(1, (now - t0) / total);
    $("barFill").style.width = p * 100 + "%";
    $("countdown").textContent = Math.max(0, Math.ceil(LOAD_SECS - p * LOAD_SECS));
    if (p < 1) requestAnimationFrame(tick); else startVideo();
  })(t0);
}

/* ---------- 3. video ---------- */
function startVideo() {
  showScreen("videoScreen");
  const video = $("wishVideo");
  video.currentTime = 0;
  const p = video.play();
  if (p) p.catch(() => { $("tapPlay").hidden = false; });
}
$("tapPlay").addEventListener("click", () => { $("tapPlay").hidden = true; $("wishVideo").play(); });
$("wishVideo").addEventListener("ended", startWish);
$("wishVideo").addEventListener("error", () => setTimeout(startWish, 800));   // never get stuck
$("skipBtn").addEventListener("click", () => { $("wishVideo").pause(); startWish(); });

/* ---------- 4. wishing page ---------- */
let typingTimer = null, fwRunning = false;
function startWish() {
  if ($("wishScreen").classList.contains("active")) return;
  showScreen("wishScreen");
  $("who").textContent = userName || "my love";
  $("signoff").textContent = `${SIGNOFF} ${SENDER}`;
  $("signoff").classList.remove("show"); $("replayBtn").hidden = true;
  spawnBalloons(); startFireworks(); typeLetter(LETTER(userName || "love"));
}

function typeLetter(text) {
  const body = $("letterBody"); body.textContent = ""; body.classList.add("typing");
  let i = 0; clearInterval(typingTimer);
  typingTimer = setInterval(() => {
    body.textContent = text.slice(0, ++i);
    if (i >= text.length) {
      clearInterval(typingTimer); body.classList.remove("typing");
      $("signoff").classList.add("show"); $("replayBtn").hidden = false;
    }
  }, 38);
}
$("replayBtn").addEventListener("click", () => { fwRunning = false; startVideo(); showScreen("videoScreen"); });

/* balloons: red hearts + hot-air balloons */
const HEART = (c) => `<svg width="70" height="110" viewBox="0 0 70 110"><path d="M35 78 C-6 46 8 6 35 28 C62 6 76 46 35 78Z" fill="${c}"/><path d="M18 22c4-6 10-6 14-2" stroke="#fff" stroke-opacity=".55" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M35 78l-5 8h10z" fill="${c}"/><path d="M35 86c-6 8 6 14 0 22" stroke="#ffd98a" stroke-width="1.6" fill="none"/></svg>`;
const AIR = (c1, c2) => `<svg width="100" height="150" viewBox="0 0 100 150"><path d="M50 4C14 4 6 44 30 78h40C94 44 86 4 50 4Z" fill="${c1}"/><path d="M50 4C30 14 30 60 38 78h24C70 60 70 14 50 4Z" fill="${c2}"/><path d="M30 78l12 26M70 78L58 104M50 78v26" stroke="#5a3a1a" stroke-width="2"/><rect x="40" y="104" width="20" height="14" rx="2" fill="#a8672d"/></svg>`;
function spawnBalloons() {
  const box = $("balloons"); box.innerHTML = "";
  const reds = ["#e0143c", "#ff2d55", "#c70f35", "#ff4b6e"];
  const airs = [["#ff5b7f", "#ffd98a"], ["#7a5cff", "#ff9fc2"], ["#ff8c42", "#ffe29a"], ["#2ec4b6", "#fff"]];
  for (let i = 0; i < 26; i++) {
    const d = document.createElement("div"); d.className = "balloon";
    const air = i % 3 === 0;
    d.innerHTML = air ? AIR(...airs[i % airs.length]) : HEART(reds[i % reds.length]);
    const s = 0.55 + Math.random() * 0.8;
    d.style.left = Math.random() * 94 + "%";
    d.style.transform = `scale(${s})`;
    d.firstChild.style.animationDuration = 2.5 + Math.random() * 3 + "s";
    d.style.animationDuration = 11 + Math.random() * 12 + "s";
    d.style.animationDelay = -Math.random() * 20 + "s";
    d.style.opacity = 0.92;
    box.appendChild(d);
  }
}

/* sky shots (fireworks) */
function startFireworks() {
  const cv = $("fireworks"), ctx = cv.getContext("2d");
  const fit = () => { cv.width = innerWidth; cv.height = innerHeight; };
  fit(); addEventListener("resize", fit);
  const parts = [], shells = [];
  const pal = [[255,217,138],[255,143,184],[255,90,110],[190,160,255],[255,255,255],[255,170,80]];
  function launch() {
    shells.push({ x: cv.width * (0.1 + Math.random() * 0.8), y: cv.height, ty: cv.height * (0.12 + Math.random() * 0.38), c: pal[(Math.random() * pal.length) | 0] });
  }
  function burst(x, y, c) {
    const n = 90 + (Math.random() * 60 | 0);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.283, v = 1 + Math.random() * 4.5;
      parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1, dec: 0.008 + Math.random() * 0.012, c: Math.random() < .25 ? pal[(Math.random() * pal.length) | 0] : c });
    }
  }
  fwRunning = true; let next = 0;
  (function loop(t) {
    if (!fwRunning) { ctx.clearRect(0, 0, cv.width, cv.height); return; }
    ctx.globalCompositeOperation = "destination-out"; ctx.fillStyle = "rgba(0,0,0,.22)"; ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.globalCompositeOperation = "lighter";
    if (t > next) { launch(); if (Math.random() < .5) launch(); next = t + 350 + Math.random() * 600; }
    for (let i = shells.length - 1; i >= 0; i--) {
      const s = shells[i]; s.y -= 9;
      ctx.fillStyle = `rgb(${s.c})`; ctx.fillRect(s.x - 1.5, s.y, 3, 12);
      if (s.y <= s.ty) { burst(s.x, s.y, s.c); shells.splice(i, 1); }
    }
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i]; p.x += p.vx; p.y += p.vy; p.vx *= .985; p.vy = p.vy * .985 + .045; p.life -= p.dec;
      if (p.life <= 0) { parts.splice(i, 1); continue; }
      ctx.fillStyle = `rgba(${p.c[0]},${p.c[1]},${p.c[2]},${p.life})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, 2.2 * p.life + .4, 0, 6.283); ctx.fill();
    }
    requestAnimationFrame(loop);
  })(0);
}
