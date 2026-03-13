/* ══════════════════════════════════════
   script.js — AI Resume Analyzer
   Modular, performance-optimized
══════════════════════════════════════ */

'use strict';

/* ── DYNAMIC SECTION LOADER ─────────────────────────────────────────── */
var _loadedParts = {};

function loadSection(partFile, containerId, callback) {
  if (_loadedParts[partFile]) {
    if (callback) callback();
    return;
  }
  var container = document.getElementById(containerId);
  if (!container) return;

  fetch(partFile)
    .then(function(res) {
      if (!res.ok) throw new Error('Failed to load ' + partFile);
      return res.text();
    })
    .then(function(html) {
      container.innerHTML = html;
      _loadedParts[partFile] = true;
      if (callback) callback();
    })
    .catch(function(err) {
      console.warn('Section load error:', err);
      if (callback) callback();
    });
}

/* ── VANTA BACKGROUND ────────────────────────────────────────────────── */
function initVanta() {
  if (window.VANTA && window.VANTA.WAVES) {
    window.VANTA.WAVES({
      el: '#vanta-bg',
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200, minWidth: 200,
      scale: 1.0, scaleMobile: 1.0,
      color: 0x0d8a6e,
      shininess: 76,
      waveHeight: 11.5,
      waveSpeed: 0.65,
      zoom: 0.65
    });
  }
}

/* ── NAV LOGO TYPING ─────────────────────────────────────────────────── */
function initNavLogo() {
  var el = document.getElementById('navLogoText');
  var cursor = document.getElementById('navLogoCursor');
  if (!el) return;
  var full = 'AI Resume Analyzer', accent = 2, i = 0;
  function type() {
    if (i >= full.length) {
      setTimeout(function() { if (cursor) cursor.style.display = 'none'; }, 1500);
      return;
    }
    var span = document.createElement('span');
    span.textContent = full[i];
    if (i < accent) span.className = 'logo-accent';
    el.appendChild(span);
    i++;
    setTimeout(type, 80 + Math.random() * 40);
  }
  setTimeout(type, 600);
}

/* ── HERO H1 TYPEWRITER ──────────────────────────────────────────────── */
function initHeroTyper() {
  var typed = document.getElementById('heroTyped');
  if (!typed) return;
  var segments = [['Hire ', false], ['10x Faster', true], ['\nwith AI', false]];
  var chars = [];
  segments.forEach(function(s) {
    for (var i = 0; i < s[0].length; i++) chars.push({ ch: s[0][i], accent: s[1] });
  });
  var i = 0;
  function type() {
    if (i >= chars.length) return;
    var item = chars[i];
    if (item.ch === '\n') {
      typed.appendChild(document.createElement('br'));
    } else {
      var span = document.createElement('span');
      if (item.accent) span.className = 'tw-accent';
      span.textContent = item.ch;
      typed.appendChild(span);
    }
    i++;
    setTimeout(type, 55 + (Math.random() * 20 - 10));
  }
  setTimeout(type, 400);
}

/* ── AI SCAN ANIMATION ───────────────────────────────────────────────── */
function initScanAnimation() {
  var steps    = [1,2,3,4,5].map(function(i){ return document.getElementById('sstep'+i); });
  var scanLine = document.getElementById('scanLine');
  var skills   = document.querySelectorAll('#skillsRow .scan-skill-tag');
  var exp1     = document.getElementById('expRow1');
  var exp2     = document.getElementById('expRow2');
  var scoreNum = document.getElementById('scoreNum');
  var scoreBar = document.getElementById('scoreBar');
  var badge    = document.getElementById('scanBadge');
  if (!steps[0] || !scanLine) return;

  var animTimeout = null;

  function setStep(idx) {
    steps.forEach(function(s,i){
      s.classList.remove('step-active','step-done');
      if (i < idx) s.classList.add('step-done');
      if (i === idx) s.classList.add('step-active');
    });
  }
  function countScore(target, ms) {
    var start = 0, step = target / (ms / 30);
    var t = setInterval(function(){
      start = Math.min(start + step, target);
      scoreNum.textContent = Math.round(start) + '%';
      scoreBar.style.width = Math.round(start) + '%';
      if (start >= target) clearInterval(t);
    }, 30);
  }
  function reset() {
    steps.forEach(function(s){ s.classList.remove('step-active','step-done'); });
    scanLine.classList.remove('scanning');
    skills.forEach(function(sk){ sk.classList.remove('detected'); });
    if (exp1) exp1.classList.remove('glow');
    if (exp2) exp2.classList.remove('glow');
    scoreNum.textContent = '0%';
    scoreBar.style.width = '0%';
    badge.classList.remove('show');
  }
  function play() {
    if (animTimeout) clearTimeout(animTimeout);
    reset();
    setTimeout(function(){ setStep(0); }, 300);
    setTimeout(function(){
      setStep(1);
      scanLine.classList.remove('scanning');
      void scanLine.offsetWidth;
      scanLine.classList.add('scanning');
      skills.forEach(function(sk,i){ setTimeout(function(){ sk.classList.add('detected'); }, 300 + i*200); });
    }, 800);
    setTimeout(function(){
      setStep(2);
      if (exp1) exp1.classList.add('glow');
      setTimeout(function(){ if (exp2) exp2.classList.add('glow'); }, 350);
    }, 2400);
    setTimeout(function(){ setStep(3); countScore(92, 1100); }, 3400);
    setTimeout(function(){
      setStep(4);
      badge.classList.add('show');
      animTimeout = setTimeout(play, 3200);
    }, 4800);
  }
  var hero = document.getElementById('hero-section');
  if (!hero) { play(); return; }
  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if (e.isIntersecting) { play(); obs.disconnect(); } });
  }, { threshold: 0.2 });
  obs.observe(hero);
}

/* ── COMPARE SCROLL REVEAL ───────────────────────────────────────────── */
function initCompareReveal() {
  var left = document.getElementById('compareLeft');
  var right = document.getElementById('compareRight');
  if (!left || !right) return;
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { e.target.classList.add('cmp-visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  obs.observe(left);
  obs.observe(right);
}

/* ── STATS COUNTER ───────────────────────────────────────────────────── */
function initStatsCounters() {
  var statNums = document.querySelectorAll('.stat-item-num[data-target]');
  if (!statNums.length) return;
  function animateCounter(el) {
    var target = parseInt(el.dataset.target, 10);
    var suffix = el.dataset.suffix || '';
    var dur = 1800, start = performance.now();
    function step(now) {
      var p = Math.min((now - start) / dur, 1);
      var ease = 1 - Math.pow(1 - p, 3);
      var val = Math.round(target * ease);
      el.textContent = (target >= 1000 ? val.toLocaleString() : val) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var statsBar = document.querySelector('.stats-bar');
  if (!statsBar) return;
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { statNums.forEach(animateCounter); obs.disconnect(); }
    });
  }, { threshold: 0.4 });
  obs.observe(statsBar);
}

/* ── SCROLL REVEAL (generic) ─────────────────────────────────────────── */
function initScrollReveal() {
  var els = document.querySelectorAll('.feat-card, .testi-card, .stat-item');
  els.forEach(function(el) { el.classList.add('reveal'); });
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        var siblings = Array.from(e.target.parentElement.children);
        e.target.style.transitionDelay = (siblings.indexOf(e.target) * 0.07) + 's';
        e.target.classList.add('revealed');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(function(el) { obs.observe(el); });
}

/* ── DOWNLOAD DROPDOWN ───────────────────────────────────────────────── */
function initDownload() {
  var panel = document.getElementById('dropdownPanel');
  var btns = document.querySelectorAll('[data-os]');
  if (!panel || !btns.length) return;

  var osData = {
    windows: { name: 'Windows', versions: ['Windows 11', 'Windows 10', 'Windows 8', 'Windows 7'] },
    mac:     { name: 'macOS',   versions: ['Sonoma', 'Ventura', 'Monterey'] },
    unix:    { name: 'Linux',   versions: ['Ubuntu', 'Debian', 'Fedora', 'Arch'] }
  };
  var osIcons = {
    windows: '<svg viewBox="0 0 24 24" fill="none" stroke="#0a6e57" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="17" height="17"><rect x="2" y="3" width="9" height="9" rx="1"/><rect x="13" y="3" width="9" height="9" rx="1"/><rect x="2" y="13" width="9" height="9" rx="1"/><rect x="13" y="13" width="9" height="9" rx="1"/></svg>',
    mac:     '<svg viewBox="0 0 24 24" fill="none" stroke="#0a6e57" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="17" height="17"><path d="M9 7c0-3 3-3 3-3 0 3 3 3 3 3"/><path d="M12 10v4m0 0c-3 0-5 2-5 5h10c0-3-2-5-5-5z"/></svg>',
    unix:    '<svg viewBox="0 0 24 24" fill="none" stroke="#0a6e57" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="17" height="17"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>'
  };
  var arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="11" height="11"><polyline points="9 18 15 12 9 6"/></svg>';

  function renderDropdown(activeOs) {
    var html = '';
    Object.keys(osData).forEach(function(os) {
      html += '<div class="os-col' + (os === activeOs ? ' os-col-active' : '') + '">';
      html += '<div class="os-col-header">' + osIcons[os] + '<span class="os-col-heading">' + osData[os].name + '</span></div>';
      html += '<ul class="os-version-list">';
      osData[os].versions.forEach(function(v) {
        html += '<li><span>' + arrow + ' ' + v + '</span></li>';
      });
      html += '</ul></div>';
    });
    panel.innerHTML = html;
    panel.style.display = 'flex';
    setTimeout(function() { panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 50);
  }

  btns.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      var isActive = btn.classList.contains('active');
      btns.forEach(function(b) { b.classList.remove('active'); });
      if (isActive) {
        panel.style.display = 'none';
      } else {
        btn.classList.add('active');
        renderDropdown(btn.dataset.os);
      }
    });
  });
}

/* ── DOWNLOAD CARD ENTRANCE ──────────────────────────────────────────── */
function initDlCard() {
  var dlCard = document.getElementById('dlCard');
  if (!dlCard) return;
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { dlCard.classList.add('dl-visible'); obs.disconnect(); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  obs.observe(dlCard);
}

/* ── DEMO TABS ───────────────────────────────────────────────────────── */
function initDemoTabs() {
  var tabs = document.querySelectorAll('.pdemo-tab');
  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      var target = tab.getAttribute('data-ptab');
      tabs.forEach(function(t) { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
      tab.classList.add('active'); tab.setAttribute('aria-selected','true');
      document.querySelectorAll('.pdemo-video-panel').forEach(function(v) { v.classList.remove('active'); });
      document.querySelectorAll('.pdemo-steps-wrap').forEach(function(s) { s.classList.remove('active'); });
      var vid = document.getElementById('pvid-' + target);
      var steps = document.getElementById('psteps-' + target);
      if (vid) {
        vid.classList.add('active');
        var v = vid.querySelector('video');
        if (v) { v.currentTime = 0; v.play().catch(function(){}); }
      }
      if (steps) steps.classList.add('active');
    });
  });
}

/* ── DEVELOPER STORY TYPING ──────────────────────────────────────────── */
function initDevStory() {
  var lines = [
    "A developer named Kartvaya once joined a company to build software.",
    "",
    "But after some time, the company suddenly removed him from the job.",
    "The reason was strange.",
    "",
    "The company was using a poor resume-analysis system.",
    "Their software could not properly scan or understand resumes.",
    "Because of that, the company was wasting hours reading resumes",
    "manually — and still missing good candidates.",
    "",
    "Instead of fixing the problem, they blamed the process",
    "and removed Kartvaya from the role.",
    "",
    "But that moment gave him an idea.",
    "",
    "Why not build a better system?",
    "A software that can actually scan resumes properly,",
    "find the right candidates, and save the company's time.",
    "",
    "So Kartvaya decided to build this ATS software.",
    "A tool designed to help companies quickly discover the right",
    "people — without wasting hours on manual screening.",
    "",
    "Because hiring should be smart, fast, and fair",
    "for both companies and candidates."
  ];
  var textEl    = document.getElementById('devstoryText');
  var cursor    = document.getElementById('devstoryCursor');
  var replayBtn = document.getElementById('devstoryReplay');
  if (!textEl || !cursor || !replayBtn) return;
  var started = false, animTimeout = null;

  function typeStory() {
    if (animTimeout) clearTimeout(animTimeout);
    textEl.innerHTML = '';
    textEl.appendChild(cursor);
    replayBtn.classList.remove('visible');
    var li = 0, ci = 0;
    function typeChar() {
      if (li >= lines.length) { replayBtn.classList.add('visible'); return; }
      var line = lines[li];
      if (line === '') {
        var br = document.createElement('span'); br.className = 'line-break';
        textEl.insertBefore(br, cursor); li++; ci = 0;
        animTimeout = setTimeout(typeChar, 130); return;
      }
      if (ci < line.length) {
        textEl.insertBefore(document.createTextNode(line[ci]), cursor); ci++;
        animTimeout = setTimeout(typeChar, 22 + (Math.random() * 14 - 7));
      } else {
        if (li < lines.length - 1) {
          var br2 = document.createElement('span'); br2.className = 'line-break';
          textEl.insertBefore(br2, cursor);
        }
        li++; ci = 0;
        animTimeout = setTimeout(typeChar, 320);
      }
    }
    animTimeout = setTimeout(typeChar, 400);
  }

  var section = document.getElementById('developer-story');
  if (section) {
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting && !started) { started = true; typeStory(); obs.disconnect(); }
      });
    }, { threshold: 0.25 });
    obs.observe(section);
  }
  replayBtn.addEventListener('click', function() { started = true; typeStory(); });
}

/* ── SIGN IN MODAL ───────────────────────────────────────────────────── */
function initModal() {
  var overlay  = document.getElementById('signInModal');
  var openBtn  = document.getElementById('signInBtn');
  var closeBtn = document.getElementById('modalClose');
  if (!overlay || !openBtn || !closeBtn) return;

  function openModal(e) {
    e.preventDefault();
    overlay.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
    setTimeout(function() {
      var inp = document.getElementById('modalEmail');
      if (inp) inp.focus();
    }, 320);
  }
  function closeModal() {
    overlay.classList.remove('modal-open');
    document.body.style.overflow = '';
  }
  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', function(e) { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeModal(); });

  var signInBtn = document.getElementById('modalSignInBtn');
  if (signInBtn) {
    signInBtn.addEventListener('click', function() {
      var email = document.getElementById('modalEmail').value.trim();
      var pass  = document.getElementById('modalPass').value;
      if (!email || !pass) { document.getElementById('modalEmail').focus(); return; }
      signInBtn.textContent = 'Signing in…';
      signInBtn.style.opacity = '0.75';
      setTimeout(function() { signInBtn.textContent = 'Sign In to Dashboard'; signInBtn.style.opacity = '1'; }, 1800);
    });
  }
}

/* ── SMOOTH SCROLL ───────────────────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      var id = a.getAttribute('href').slice(1);
      if (!id) return;
      var target = document.getElementById(id);
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
}

/* ── LAZY PART LOADER WITH INTERSECTION OBSERVER ────────────────────── */
function initLazyParts() {
  var part1Container = document.getElementById('part1-container');
  var part2Container = document.getElementById('part2-container');

  if (part1Container) {
    // Part 1 loads immediately (above fold)
    loadSection('part1.html', 'part1-container', function() {
      initHeroTyper();
      initScanAnimation();
      initCompareReveal();
      initSmoothScroll();
    });
  }

  if (part2Container) {
    // Part 2 loads when 200px from viewport
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          loadSection('part2.html', 'part2-container', function() {
            initStatsCounters();
            initScrollReveal();
            initDemoTabs();
            initDownload();
            initDlCard();
            initDevStory();
            initSmoothScroll();
          });
          obs.unobserve(e.target);
        }
      });
    }, { rootMargin: '200px' });
    obs.observe(part2Container);
  }
}

/* ── BOOT ────────────────────────────────────────────────────────────── */
function boot() {
  initVanta();
  initNavLogo();
  initModal();
  initLazyParts();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
