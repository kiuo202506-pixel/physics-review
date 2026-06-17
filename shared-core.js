/* === shared-core.js — injected into every chapter page === */

// Register Service Worker for PWA offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function(){
    navigator.serviceWorker.register('/sw.js').then(function(r){
      console.log('SW registered:', r.scope);
    }).catch(function(e){ console.log('SW failed:', e); });
  });
}

(function(){
  'use strict';

  // ============================
  // 1. THEME (night mode)
  // ============================
  const savedTheme = localStorage.getItem('epa-theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  window.epaToggleTheme = function() {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('epa-theme', next);
  };

  // ============================
  // 2. FONT SIZE
  // ============================
  const savedFont = localStorage.getItem('epa-font') || 'm';
  document.documentElement.setAttribute('data-font', savedFont);
  const fontSizes = ['s','m','l','xl'];
  window.epaCycleFont = function() {
    const cur = document.documentElement.getAttribute('data-font') || 'm';
    const idx = fontSizes.indexOf(cur);
    const next = fontSizes[(idx + 1) % fontSizes.length];
    document.documentElement.setAttribute('data-font', next);
    localStorage.setItem('epa-font', next);
  };

  // ============================
  // 3. SEARCH
  // ============================
  window.epaSearch = function(input) {
    // Clear previous highlights
    document.querySelectorAll('.epa-search-highlight').forEach(function(el){
      el.replaceWith(el.textContent);
    });
    const q = input.value.trim();
    if (!q) return;
    // Search in main content area only
    const area = document.querySelector('.kn-main') || document.body;
    const walker = document.createTreeWalker(area, NodeFilter.SHOW_TEXT, null, false);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    let count = 0;
    textNodes.forEach(function(node){
      const txt = node.textContent;
      const idx = txt.toLowerCase().indexOf(q.toLowerCase());
      if (idx >= 0) {
        const span = document.createElement('span');
        span.className = 'epa-search-highlight';
        const before = txt.slice(0, idx);
        const match = txt.slice(idx, idx + q.length);
        const after = txt.slice(idx + q.length);
        span.textContent = match;
        const frag = document.createDocumentFragment();
        frag.appendChild(document.createTextNode(before));
        frag.appendChild(span);
        frag.appendChild(document.createTextNode(after));
        node.parentNode.replaceChild(frag, node);
        count++;
        // Scroll to first match
        if (count === 1) span.scrollIntoView({behavior:'smooth',block:'center'});
      }
    });
    if (count === 0) { /* optional: show no-results toast */ }
  };

  // ============================
  // 4. WRONG ANSWER BOOK
  // ============================
  window.epaGetWrongAnswers = function() {
    try {
      return JSON.parse(localStorage.getItem('epa-wrong-answers') || '[]');
    } catch(e) { return []; }
  };

  window.epaAddWrongAnswer = function(qData, chapterLabel) {
    var wrong = epaGetWrongAnswers();
    // Dedup by question text
    var exists = wrong.some(function(w){ return w.question === qData.question; });
    if (!exists) {
      qData.chapter = chapterLabel || '';
      qData.addedAt = Date.now();
      qData.reviewCount = 0;
      qData.nextReview = Date.now() + 86400000; // 1 day later
      wrong.push(qData);
      localStorage.setItem('epa-wrong-answers', JSON.stringify(wrong));
    }
  };

  window.epaRemoveWrongAnswer = function(index) {
    var wrong = epaGetWrongAnswers();
    wrong.splice(index, 1);
    localStorage.setItem('epa-wrong-answers', JSON.stringify(wrong));
  };

  window.epaMarkReviewed = function(index) {
    var wrong = epaGetWrongAnswers();
    if (wrong[index]) {
      wrong[index].reviewCount = (wrong[index].reviewCount || 0) + 1;
      // Spaced repetition intervals: 1d, 3d, 7d, 14d, 30d
      var intervals = [1,3,7,14,30];
      var ri = Math.min(wrong[index].reviewCount, intervals.length - 1);
      wrong[index].nextReview = Date.now() + intervals[ri] * 86400000;
      wrong[index].lastReviewed = Date.now();
      localStorage.setItem('epa-wrong-answers', JSON.stringify(wrong));
    }
  };

  // ============================
  // 5. PROGRESS / STREAK
  // ============================
  window.epaGetProgress = function() {
    try {
      return JSON.parse(localStorage.getItem('epa-progress') || '{"completed":[],"streak":0,"lastVisit":"","scoreHistory":[]}');
    } catch(e) { return {completed:[],streak:0,lastVisit:"",scoreHistory:[]}; }
  };

  window.epaMarkChapterDone = function(chapterId) {
    var p = epaGetProgress();
    if (p.completed.indexOf(chapterId) < 0) {
      p.completed.push(chapterId);
    }
    // Update streak
    var today = new Date().toDateString();
    if (p.lastVisit !== today) {
      var yesterday = new Date(Date.now() - 86400000).toDateString();
      if (p.lastVisit === yesterday) {
        p.streak = (p.streak || 0) + 1;
      } else if (p.lastVisit !== today) {
        p.streak = 1;
      }
    }
    p.lastVisit = today;
    localStorage.setItem('epa-progress', JSON.stringify(p));
  };

  window.epaRecordScore = function(chapterId, score, total) {
    var p = epaGetProgress();
    p.scoreHistory.push({chapter: chapterId, score: score, total: total, date: Date.now()});
    if (p.scoreHistory.length > 50) p.scoreHistory = p.scoreHistory.slice(-50);
    localStorage.setItem('epa-progress', JSON.stringify(p));
  };

  // ============================
  // 6. TTS (Text-to-Speech)
  // ============================
  window.epaTTS = {
    speaking: false,
    utterance: null,
    play: function(text, rate) {
      if (!('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = 'zh-CN';
      u.rate = rate || 0.9;
      u.onend = function(){ epaTTS.speaking = false; };
      epaTTS.utterance = u;
      epaTTS.speaking = true;
      window.speechSynthesis.speak(u);
    },
    pause: function() { window.speechSynthesis.pause(); },
    resume: function() { window.speechSynthesis.resume(); },
    stop: function() { window.speechSynthesis.cancel(); epaTTS.speaking = false; }
  };

  // Keep-alive for Chrome long-utterance bug
  setInterval(function(){
    if (epaTTS.speaking && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      window.speechSynthesis.resume();
    }
  }, 8000);

  // ============================
  // 7. HOOK INTO QUIZ GRADING
  // ============================
  // After gradeAll() is called, scan for wrong answers and save them
  var origGradeAll = window.gradeAll;
  window.gradeAll = function() {
    if (origGradeAll) origGradeAll();
    // Wait for DOM update
    setTimeout(function(){
      var questions = window.Q || [];
      var chapterLabel = document.querySelector('h1') ? document.querySelector('h1').textContent : '';
      document.querySelectorAll('.question-block').forEach(function(block, idx){
        if (block.classList.contains('wrong') || block.classList.contains('incorrect')) {
          if (questions[idx]) {
            epaAddWrongAnswer(questions[idx], chapterLabel);
          }
        }
      });
      // Record score
      var scoreEl = document.getElementById('score-num');
      var totalEl = document.querySelectorAll('.question-block');
      if (scoreEl && totalEl.length) {
        var sc = parseInt(scoreEl.textContent) || 0;
        epaRecordScore(chapterLabel, sc, totalEl.length);
      }
    }, 200);
  };

})();

// ============================
// 8. NAVIGATION (bottom bar)
// ============================
// Chapters array
var EPA_CHAPTERS = [
  {file:'Chapter 1 Force and Motion.html', label:'Ch1'},
  {file:'Chapter 2 Particle Dynamics 质点动力学.html', label:'Ch2'},
  {file:'Chapter 3 Rotation of Rigid Body 刚体转动.html', label:'Ch3'},
  {file:'Chapter 4 Special Relativity 狭义相对论.html', label:'Ch4'},
  {file:'Chapter 5 Mechanical Vibration.html', label:'Ch5'},
  {file:'Chapter 6 Mechanical Wave.html', label:'Ch6'},
  {file:'Chapter 7 Kinetic Theory of Ideal Gas.html', label:'Ch7'},
  {file:'Chapter 8 Thermodynamics.html', label:'Ch8'}
];

document.addEventListener('DOMContentLoaded', function(){
  // Identify current chapter
  var curFile = window.location.pathname.split('/').pop();
  var curIdx = -1;
  for (var i=0; i<EPA_CHAPTERS.length; i++) {
    if (EPA_CHAPTERS[i].file === curFile) { curIdx = i; break; }
  }

  // Inject navigation bar
  var nav = document.createElement('div');
  nav.id = 'epa-mobile-nav';
  var prevFile = curIdx > 0 ? EPA_CHAPTERS[curIdx-1].file : 'index.html';
  var prevLabel = curIdx > 0 ? EPA_CHAPTERS[curIdx-1].label : 'Home';
  var nextFile = curIdx < EPA_CHAPTERS.length-1 ? EPA_CHAPTERS[curIdx+1].file : 'index.html';
  var nextLabel = curIdx < EPA_CHAPTERS.length-1 ? EPA_CHAPTERS[curIdx+1].label : 'Home';

  nav.innerHTML =
    '<button onclick="location.href=\\''+prevFile+'\\'"><span class=nav-icon>&#9664;</span>'+prevLabel+'</button>'+
    '<button onclick="location.href=\\'index.html\\'"><span class=nav-icon>&#9776;</span>目录</button>'+
    '<button onclick="location.href=\\''+nextFile+'\\'">'+nextLabel+'<span class=nav-icon>&#9654;</span></button>';
  document.body.appendChild(nav);

  // Inject toolbar
  var toolbar = document.createElement('div');
  toolbar.id = 'epa-toolbar';
  toolbar.innerHTML =
    '<button onclick=epaToggleTheme() title=夜间模式>&#9790;</button>'+
    '<button onclick=epaCycleFont() title=字号>Aa</button>'+
    '<button onclick="var tts=document.getElementById(\\'epa-tts-bar\\');tts.classList.toggle(\\'active\\');" title=朗读>&#9835;</button>';
  document.body.appendChild(toolbar);

  // Inject TTS bar
  var ttsBar = document.createElement('div');
  ttsBar.id = 'epa-tts-bar';
  ttsBar.innerHTML =
    '<button onclick="var area=document.querySelector(\\'.kn-main\\');var txt=area?area.textContent:document.body.textContent;epaTTS.play(txt,0.9)">播放</button>'+
    '<button onclick=epaTTS.pause()>暂停</button>'+
    '<button onclick=epaTTS.stop()>停止</button>'+
    '<select onchange="epaTTS.play(document.querySelector(\\'.kn-main\\')?document.querySelector(\\'.kn-main\\').textContent:document.body.textContent,parseFloat(this.value))">'+
    '<option value=0.7>0.7x</option><option value=0.9 selected>0.9x</option><option value=1.1>1.1x</option><option value=1.3>1.3x</option></select>';
  document.body.appendChild(ttsBar);

  // Inject search box at top of main content
  var mainArea = document.querySelector('.kn-main');
  if (mainArea) {
    var searchBox = document.createElement('input');
    searchBox.id = 'epa-search-box';
    searchBox.type = 'text';
    searchBox.placeholder = '搜索本章知识点...';
    searchBox.addEventListener('input', function(){ epaSearch(searchBox); });
    mainArea.insertBefore(searchBox, mainArea.firstChild);
  }

  // Mark chapter as visited
  if (curIdx >= 0) {
    epaMarkChapterDone('ch'+(curIdx+1));
  }
});
