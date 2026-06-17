
const gameState = {
  isabelMyspaceVisits: 0,
  dylanMyspaceVisits: 0,
  aimMessagesReceived: 0,
  aimEnabled: false,
  isabelOnline: false,
  forumVisited: false,
  news3Unlocked: false,
  diaryEntries: 1,
  currentMyspaceView: 'home',
};
const prototypemusic = document.getElementById("prototypemusic");
prototypemusic.play().catch(() => {});
document.addEventListener("click", () => {
  prototypemusic.play();
}, { once: true });

function checkNarrativeTriggers() {
  const box = document.getElementById('narrative-box');

  // eventlistener triggered for second visit to makr isabel come online
  if (gameState.isabelMyspaceVisits === 2 && !gameState.isabelOnline) {
    gameState.isabelOnline = true;
    setIsabelOnline();
    showNarrative("Did her status just change?");
  }

  // u can message is after gamestate is triggered
  if (gameState.isabelOnline && !gameState.aimEnabled) {
    gameState.aimEnabled = true;
    enableAIM();
  }

  // come back to this, this edits the news unlokced. need to do this in codebar help
  if (gameState.forumVisited && !gameState.news3Unlocked) {
    gameState.news3Unlocked = true;
    document.getElementById('search-result-3').style.display = 'block';
  }
}

function showNarrative(text) {
  const box = document.getElementById('narrative-box');
  box.textContent = text;
  box.classList.add('visible');
  setTimeout(() => box.classList.remove('visible'), 5000);
}

function msShowHome() {
  document.getElementById('ms-home').classList.add('visible');
  document.getElementById('ms-dylan').classList.remove('visible');
  document.getElementById('ms-isabel').classList.remove('visible');
  gameState.currentMyspaceView = 'home';
  document.getElementById('myspace-title').textContent = 'MySpace.com';
  document.getElementById('myspace-status').textContent = 'MySpace.com — a place for friends';
}

function msShowProfile(who) {
  document.getElementById('ms-home').classList.remove('visible');
  document.getElementById('ms-dylan').classList.remove('visible');
  document.getElementById('ms-isabel').classList.remove('visible');

  if (who === 'dylan') {
    gameState.dylanMyspaceVisits++;
    document.getElementById('ms-dylan').classList.add('visible');
    document.getElementById('myspace-title').textContent = "Dylan's Profile — MySpace";
    document.getElementById('myspace-status').textContent = 'Viewing: Dylan';
  } else if (who === 'isabel' || who === 'player') {
    gameState.isabelMyspaceVisits++;
    document.getElementById('ms-isabel').classList.add('visible');
    document.getElementById('myspace-title').textContent = "Isabel Tiley's Profile — MySpace";
    document.getElementById('myspace-status').textContent = 'Viewing: Isabel Tiley';
  }

  checkNarrativeTriggers();
}

function setIsabelOnline() {
  // for dbadhes
  document.getElementById('isabel-status-badge').textContent = '● online now';
  document.getElementById('isabel-status-badge').className = 'ms-status-badge online';
  document.getElementById('isabel-last-login').textContent = 'today';
  document.getElementById('isabel-home-status').textContent = '● online now';

  setTimeout(() => {
    showNotif('💬 AIM', 'istiny888 has signed on.', 'aim');
  }, 1500);
}

function enableAIM() {
  document.getElementById('aim-input').disabled = false;
  document.getElementById('aim-send-btn').disabled = false;
  document.getElementById('aim-offline-msg').style.display = 'none';
  document.getElementById('aim-status').textContent = 'istiny888: online';

  addAIMMessage('system', '— istiny888 has signed on —');
  setTimeout(() => {
    addAIMMessage('isabel', "hiiiii dylisa ;) xo");
    gameState.aimMessagesReceived++;
  }, 2000);
}

// ═══════════════════════════════════════
// REMOVE THIS BC I DO NOT LIKE THE RANDOM MESSAGES IT NEEDS TO BRANCH A LA ORPEHUS
// ═══════════════════════════════════════
const isabelReplies = [
  "i'm okay. are you okay?",
  "i think about you all the time.",
  "i don't know how to explain it either.",
  "it's strange. everything feels very far away.",
  "you were always the one who made sense of things for me.",
  "i saw you were on my myspace. i know it's you.",
  "i can't explain this. i just wanted you to know i'm still here.",
  "are you still saving to come to london?",
  "i'm sorry you found out that way. i would have told you if i could.",
  "don't look too hard. some things aren't meant to be found.",
];
let replyIndex = 0;

function addAIMMessage(from, text) {
  const log = document.getElementById('aim-chat-log');
  const div = document.createElement('div');
  div.className = 'aim-msg';
  if (from === 'player') {
    div.innerHTML = `<span class="aim-from-player">you:</span> ${text}`;
  } else if (from === 'isabel') {
    div.innerHTML = `<span class="aim-from-isabel">istiny888:</span> ${text}`;
  } else {
    div.className = 'aim-msg aim-from-system';
    div.textContent = text;
  }
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

// BROWSER TINGS
const browserHistory = ['home'];
let browserPos = 0;

function navigateTo(page) {
  document.querySelectorAll('.webpage').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + page);
  if (target) {
    target.classList.add('active');
    browserHistory.splice(browserPos + 1);
    browserHistory.push(page);
    browserPos = browserHistory.length - 1;
    const urls = {
      home: 'about:blank',
      news: 'http://www.bbc.co.uk/news',
      news2: 'http://www.google.co.uk/search?q=Isabel+Tiley',
      blog: 'http://isabelsthings.blogspot.com',
    };
    const titles = {
      home: 'New Tab — Internet Explorer',
      news: 'BBC News - London & Greater London',
      news2: 'Isabel Tiley — Google Search',
      blog: "things i think about — Internet Explorer",
    };
    document.getElementById('address-bar').value = urls[page] || page;
    document.getElementById('browser-title').textContent = titles[page] || page;

    if (page === 'forum') {
      gameState.forumVisited = true;
      checkNarrativeTriggers();
    }
    document.getElementById('browser-status').textContent = 'Done';
  }
}

function browserNav(url) {
  document.getElementById('browser-status').textContent = 'Loading...';
  setTimeout(() => {
    if (url.includes('gazette')) navigateTo('news');
    else if (url.includes('grief') || url.includes('forum')) navigateTo('forum');
    else if (url.includes('isabel') || url.includes('tiley')) navigateTo('news2');
    else if (url.includes('blog') || url.includes('isabel')) navigateTo('blog');
    else navigateTo('home');
  }, 400);
}

function browserBack() {
  if (browserPos > 0) { browserPos--; navigateTo(browserHistory[browserPos]); }
}
function browserForward() {
  if (browserPos < browserHistory.length - 1) { browserPos++; navigateTo(browserHistory[browserPos]); }
}

// ═══════════════════════════════════════
// PHOTOS
// ═══════════════════════════════════════
function openPhotoFolder(name) {
  document.getElementById('photo-folder-view').style.display = 'none';
  ['isabel', 'misc', 'beach'].forEach(f => {
    document.getElementById('photo-grid-' + f).style.display = 'none';
  });
  document.getElementById('photo-grid-' + name).style.display = 'block';
  document.getElementById('photos-status').textContent = name;
}
function closePhotoFolder() {
  ['isabel', 'misc', 'beach'].forEach(f => {
    document.getElementById('photo-grid-' + f).style.display = 'none';
  });
  document.getElementById('photo-folder-view').style.display = 'block';
  document.getElementById('photos-status').textContent = '3 folders';
}

// ═══════════════════════════════════════
// DIARY
// ═══════════════════════════════════════
const diaryTA = document.getElementById('diary-textarea');
if (diaryTA) {
  diaryTA.addEventListener('keyup', () => {
    const pos = diaryTA.value.substr(0, diaryTA.selectionStart).split('\n');
    document.getElementById('diary-status').textContent = 'Ln ' + pos.length + ', Col ' + (pos[pos.length - 1].length + 1);
  });
}

// ═══════════════════════════════════════
// NOTIFICATION
// ═══════════════════════════════════════
let notifTarget = '';
function showNotif(title, body, target) {
  document.getElementById('notif-title').textContent = title;
  document.getElementById('notif-body').textContent = body;
  notifTarget = target;
  document.getElementById('notification').style.display = 'block';
}
function closeNotif() {
  document.getElementById('notification').style.display = 'none';
}
function notifAction() {
  closeNotif();
  if (notifTarget) openWindow(notifTarget);
}

// ═══════════════════════════════════════
// WINDOW MANAGEMENT
// ═══════════════════════════════════════
const winIds = ['myspace', 'aim', 'diary', 'browser', 'photos'];

function openWindow(id) {
  const win = document.getElementById('win-' + id);
  const tb = document.getElementById('tb-' + id);
  if (!win) return;
  win.classList.add('active');
  if (tb) { tb.classList.add('visible'); }
  focusWindow(id);
}

function closeWindow(id) {
  const win = document.getElementById('win-' + id);
  const tb = document.getElementById('tb-' + id);
  if (win) { win.classList.remove('active'); win.classList.remove('focused'); }
  if (tb) { tb.classList.remove('visible'); tb.classList.remove('focused'); }
}

function minimizeWindow(id) {
  const win = document.getElementById('win-' + id);
  const tb = document.getElementById('tb-' + id);
  if (win) { win.classList.remove('active'); win.classList.remove('focused'); }
  if (tb) { tb.classList.add('visible'); tb.classList.remove('focused'); }
}

function toggleWindow(id) {
  const win = document.getElementById('win-' + id);
  if (!win) return;
  if (win.classList.contains('active')) minimizeWindow(id);
  else openWindow(id);
}

function focusWindow(id) {
  let maxZ = 10;
  winIds.forEach(w => {
    const el = document.getElementById('win-' + w);
    if (el) maxZ = Math.max(maxZ, parseInt(el.style.zIndex) || 10);
  });
  const win = document.getElementById('win-' + id);
  if (!win) return;
  win.style.zIndex = maxZ + 1;
  winIds.forEach(w => {
    const el = document.getElementById('win-' + w);
    const tb = document.getElementById('tb-' + w);
    if (el) el.classList.remove('focused');
    if (tb) tb.classList.remove('focused');
  });
  win.classList.add('focused');
  const tb = document.getElementById('tb-' + id);
  if (tb) { tb.classList.add('visible'); tb.classList.add('focused'); }
}

winIds.forEach(id => {
  const win = document.getElementById('win-' + id);
  if (win) win.addEventListener('mousedown', () => focusWindow(id));
});

// ═══════════════════════════════════════
// DRAG
// ═══════════════════════════════════════
let dragState = null;
function startDrag(e, id) {
  if (e.target.classList.contains('win-btn')) return;
  const win = document.getElementById(id);
  const rect = win.getBoundingClientRect();
  dragState = { id, startX: e.clientX, startY: e.clientY, origLeft: rect.left, origTop: rect.top };
  focusWindow(id.replace('win-', ''));
  e.preventDefault();
}
document.addEventListener('mousemove', e => {
  if (!dragState) return;
  const win = document.getElementById(dragState.id);
  win.style.left = Math.max(0, dragState.origLeft + e.clientX - dragState.startX) + 'px';
  win.style.top = Math.max(0, dragState.origTop + e.clientY - dragState.startY) + 'px';
});
document.addEventListener('mouseup', () => { dragState = null; });

// ═══════════════════════════════════════
// RESIZE
// ═══════════════════════════════════════
let resizeState = null;
function startResize(e, id) {
  const win = document.getElementById(id);
  const rect = win.getBoundingClientRect();
  resizeState = { id, startX: e.clientX, startY: e.clientY, origW: rect.width, origH: rect.height };
  e.preventDefault(); e.stopPropagation();
}
document.addEventListener('mousemove', e => {
  if (!resizeState) return;
  const win = document.getElementById(resizeState.id);
  win.style.width = Math.max(280, resizeState.origW + e.clientX - resizeState.startX) + 'px';
  win.style.height = Math.max(180, resizeState.origH + e.clientY - resizeState.startY) + 'px';
});
document.addEventListener('mouseup', () => { resizeState = null; });

function generateStars(count) {
  const desktop = document.getElementById('desktop');
  for (let i = 0; i < count; i++) {
    const star = document.createElement('span');
    star.className = 'star';
    star.style.top = Math.random() * 100 + '%';
    star.style.left = Math.random() * 100 + '%';
    star.style.animationDelay = Math.random() * 3 + 's';
    desktop.appendChild(star);
  }
}
generateStars(80);

// ═══════════════════════════════════════
// INIT
// ═══════════════════════════════════════
openWindow('myspace');