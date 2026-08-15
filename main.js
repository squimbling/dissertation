let newsClick = 0;

const incomingSound = new Audio('incoming.mp3');
const outgoingSound = new Audio('outgoing.mp3');

 const gameState = {
  dylanMyspaceVisits: 0,
  isabelMyspaceVisits: 0,
  // story flags for story beatses
  visitedDylanMyspace: false,
  visitedIsabelMyspace: false,
  visitedBlog: false,
  friendMessageSent: false,
  newsUnlocked: false,
  newsRead: false,
  mourningRevealed: false,
  readPrivateUpdate: false,
  isabelOnline: false,
  aimEnabled: false,
  branchComplete: false,
  newArticleUnlocked: false,
  currentMyspaceView: 'home',
};
 
function checkNarrativeTriggers() {
  // Beat 2
  if (
    gameState.visitedBlog &&
    gameState.visitedDylanMyspace &&
    gameState.visitedIsabelMyspace &&
    !gameState.friendMessageSent
  ) {
    triggerFriendMessage();
  }

  if (
    gameState.newsRead &&
    !gameState.mourningRevealed &&
    gameState.currentMyspaceView === 'isabel'
  ) {
    revealMourningComments();
  }
 
  // Beat 6: istiny888 "comes online" once Dylan has read the new private
  // blog entries about the death.
  if (gameState.readPrivateUpdate && !gameState.isabelOnline) {
    triggerIsabelComesOnline();
  }
  if (gameState.branchComplete && !gameState.newArticleUnlocked) {
    gameState.newArticleUnlocked = true;
    unlockNewArticle();
}
}

function addAIMMessage(from, text, name) {
  const log = document.getElementById('aim-chat-log');
  const div = document.createElement('div');
  div.className = 'aim-msg';
  if (from === 'player') {
    div.innerHTML = `<span class="aim-from-player">you:</span> ${text}`;
    outgoingSound.currentTime = 0;
    outgoingSound.play().catch(() => {});
  } else if (from === 'isabel') {
    div.innerHTML = `<span class="aim-from-isabel">istiny888:</span> ${text}`;
    incomingSound.currentTime = 0;
    incomingSound.play().catch(() => {});
  } else if (from === 'friend') {
    div.className = 'aim-msg aim-from-system';
    div.innerHTML = `<strong>${name || 'friend'}:</strong> ${text}`;
    incomingSound.currentTime = 0;
    incomingSound.play().catch(() => {});
  } else {
    div.className = 'aim-msg aim-from-system';
    div.textContent = text;
  }
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}
 
function showNarrative(text) {
  const box = document.getElementById('narrative-box');
  box.textContent = text;
  box.classList.add('visible');
  setTimeout(() => box.classList.remove('visible'), 5000);
}
 
/* Beat 2 ------------------------------------------------------------------ */
function triggerFriendMessage() {
  if (gameState.friendMessageSent) return;
  gameState.friendMessageSent = true;
  gameState.newsUnlocked = true;
 
  const lockNews = document.getElementById('lock-news');
  const lockNews2 = document.getElementById('lock-news2');
  if (lockNews) lockNews.style.display = 'none';
  if (lockNews2) lockNews2.style.display = 'none';
 
  addAIMMessage('friend', "have you seen the news?? weren't you friends with a girl called isabel?", 'jess!!');
  showNotif('💬 TinyChat', 'jess!!: have you seen the news??', 'aim');
  showNarrative("jess!! sent you something.");
}
 
/* Beat 4 ------------------------------------------------------------------ */
function revealMourningComments() {
  gameState.mourningRevealed = true;
  const block = document.getElementById('isabel-mourning-comments');
  if (block) block.style.display = 'block';
  showNarrative("New comments on Isabel's page.");
}
 
/* Beat 5 — called every time the blog page renders; reveals the new
   private entries once mourningRevealed is true, and marks them as read
   so beat 6 can fire. */
function renderBlogPage() {
  const newSection = document.getElementById('blog-private-new');
  if (!newSection) return;
 
  if (gameState.mourningRevealed) {
    if (newSection.style.display === 'none') {
      newSection.style.display = 'block';
      showNarrative("Dylan wrote something new.");
    }
    if (!gameState.readPrivateUpdate) {
      gameState.readPrivateUpdate = true;
      checkNarrativeTriggers();
    }
  }
}
 
/* Beat 6 ------------------------------------------------------------------ */
function triggerIsabelComesOnline() {
  if (gameState.isabelOnline) return;
  gameState.isabelOnline = true;
 
  setIsabelOnline();
  showNarrative("Did her status just change?");
 
  gameState.aimEnabled = true;
  enableAIM();
}

function unlockNewArticle() {
  // add a new link to the browser favourites home page
  const home = document.getElementById('page-home');
  const newLink = document.createElement('a');
  newLink.onclick = () => navigateTo('news3');
  newLink.innerHTML = '📰 Isabel Tiley — reward offered for information <span style="font-size:9px;color:#cc0000">NEW</span>';
  home.appendChild(newLink);
}
 
/* -------------------------------------------------------------------------
   MYSPACE
   ------------------------------------------------------------------------- */
 
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

  if (who === 'dylan' || who === 'player') {
    gameState.dylanMyspaceVisits++;
    gameState.visitedDylanMyspace = true;
    gameState.currentMyspaceView = 'dylan';
    document.getElementById('ms-dylan').classList.add('visible');
    document.getElementById('myspace-title').textContent = "Dylan's Profile — MySpace";
    document.getElementById('myspace-status').textContent = 'Viewing: Dylan';
  } else if (who === 'isabel') {
    gameState.isabelMyspaceVisits++;
    gameState.visitedIsabelMyspace = true;
    gameState.currentMyspaceView = 'isabel';
    document.getElementById('ms-isabel').classList.add('visible');
    document.getElementById('myspace-title').textContent = "Isabel Tiley's Profile — MySpace";
    document.getElementById('myspace-status').textContent = 'Viewing: Isabel Tiley';
  }
 
  checkNarrativeTriggers();
}
 
function setIsabelOnline() {
  document.getElementById('isabel-status-badge').textContent = '● online now';
  document.getElementById('isabel-status-badge').className = 'ms-status-badge online';
  document.getElementById('isabel-last-login').textContent = 'today';
  document.getElementById('isabel-home-status').textContent = '● online now';
 
  setTimeout(() => {
    showNotif('💬 AIM', 'istiny888 has signed on.', 'aim');
  }, 1500);
}
 
function enableAIM() {
  document.getElementById('aim-input').disabled = true;
  document.getElementById('aim-send-btn').disabled = true;
  document.getElementById('aim-offline-msg').style.display = 'none';
  document.getElementById('aim-status').textContent = 'istiny888: online';
 
  addAIMMessage('system', '— istiny888 has signed on —');
  setTimeout(() => {
    const startNode = dialogueBranches.start;
    addAIMMessage('isabel', startNode.isabelLine);
    showAimChoices(startNode.choices);
  }, 2000);
}
 
function addAIMMessage(from, text, name) {
  const log = document.getElementById('aim-chat-log');
  const div = document.createElement('div');
  div.className = 'aim-msg';
  if (from === 'player') {
    div.innerHTML = `<span class="aim-from-player">you:</span> ${text}`;
  } else if (from === 'isabel') {
    div.innerHTML = `<span class="aim-from-isabel">istiny888:</span> ${text}`;
  } else if (from === 'friend') {
    // PLACEHOLDER STYLE: re-using the system message look with a bold name
    // since style.css doesn't have a dedicated ".aim-from-friend" class yet.
    div.className = 'aim-msg aim-from-system';
    div.innerHTML = `<strong>${name || 'friend'}:</strong> ${text}`;
  } else {
    div.className = 'aim-msg aim-from-system';
    div.textContent = text;
  }
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}
 
function sendAIM() {
  // Kept as a safety fallback only — the istiny888 conversation no longer
  // uses free text (see enableAIM/showAimChoices), so under normal play
  // aim-input stays disabled and this never fires.
  const input = document.getElementById('aim-input');
  if (!input || input.disabled) return;
  const text = input.value.trim();
  if (!text) return;
  addAIMMessage('player', text);
  input.value = '';
}
 
const dialogueBranches = {
  start: {
    isabelLine: "hiiiii dylisa ;) xo",
    choices: [
      {
        text: "Who is this?",
        reply: "your worst nightmare. O.O",
        next: "nightmare",
      },
      {
        text: "Izzy? You're alive?",
        reply: "eeek sorry i know!! i haven't called in foreverrr. how are you pretty girl? xo",
        next: "c1Dyl2", //undefined rn. now no longer undefined wahoo
      },
    ],
  },
  nightmare: {
    isabelLine: "your worst nightmare. O.O",
    choices: [
      {
        text: "Seriously, this isn't funny.",  
        reply: "who do you think it is silly girl!!!! :p",
        next: "nightmare2",
      },
    ],
  },
  nightmare2: {
    isabelLine: "who do you think it is silly girl!!!! :p",
    choices: [
      {
        text: "I don't understand.",
        reply: "ok now i'm confused 2... talk to me?",
        next: "iThoughtYouWereDead",
      },
    ],
  },
  iThoughtYouWereDead: {
    isabelLine: "ok now i'm confused 2... talk to me?",
    choices: [
      {
        text: "I thought you were dead.",
        reply: "eeek sorry i know!! i haven't called in foreverrr. how are you pretty girl? xo",
        next: "c1Dyl2",
      },
    ],
  },
  c1Dyl2: {
    isabelLine: "eeek sorry i know!! i haven't called in foreverrr. how are you pretty girl? xo",
    choices: [
      {
        text: "Have you checked the news? Your death is front page.",
        reply: "huhhh wow. i did say everybody was gunna know my name right?",
        next: "c1Dyl3",
      },
    ],
  },
  c1Dyl3: {
    isabelLine: "huhhh wow. i did say everybody was gunna know my name right?",
    choices: [
      {
        text: "Isabel.",
        reply: "well !!! i am here messaging you now arn't i missy?! xo",
        next: "c1Dyl4",
      },
    ],   
  },
    c1Dyl4: {
      isabelLine: "well !!! i am here messaging you now arn't i missy?! xo",
      choices: [
        {
          text: "Is the story someone else? I'm so confused.",  
          reply: "not sure. can't call 2nite btw. i know we do on thu but something came up :(",
          next: "c1Dyl5",
        },
      ],
    },
  c1Dyl5: {
    isabelLine: "not sure. can't call 2nite btw. i know we do on thu but something came up :(",
    choices: [  
      {
        text: "Like your death?",
        reply: "haha yes. luv ya!!1",
        next: "c1Dyl6",
      },
    ],
  },
  c1Dyl6: {
    isabelLine: "haha yes. luv ya!!1",
    choices: [
      {
        text: "Wait.",
      },
    ],
  },
};
function showAimChoices(choices) {
  const box = document.getElementById('aim-choices');
  const inputRow = document.getElementById('aim-input-row');
  if (!box) return;
 
  inputRow.style.display = 'none';
  box.style.display = 'block';
  box.innerHTML = '';
 
  choices.forEach(choice => {
    const btn = document.createElement('button');
    btn.className = 'aim-send-btn';
    btn.style.display = 'block';
    btn.style.width = '100%';
    btn.style.marginBottom = '4px';
    btn.style.textAlign = 'left';
    btn.textContent = choice.text;
    btn.onclick = () => selectAimChoice(choice);
    box.appendChild(btn);
  });
}
 
function selectAimChoice(choice) {
  const box = document.getElementById('aim-choices');
  box.style.display = 'none';
  box.innerHTML = '';
 
  addAIMMessage('player', choice.text);
 
  setTimeout(() => {
    addAIMMessage('isabel', choice.reply);
 
    const nextNode = choice.next ? dialogueBranches[choice.next] : null;
    if (nextNode) {
      setTimeout(() => {
        if (nextNode.choices) showAimChoices(nextNode.choices);
      }, 1500);
    } else {
      setTimeout(() => {
        addAIMMessage('system', '— istiny888 has signed off —');
        gameState.branchComplete = true;
        checkNarrativeTriggers(); 
      }, 2500);
    }
  }, 1400);
}
 
const browserHistory = ['home'];
let browserPos = 0;
 
function navigateTo(page) {
  if ((page === 'news' || page === 'news2') && !gameState.newsUnlocked) {
    showNarrative("That link doesn't seem to work yet.");
    return;
  }
 
  if (page === 'news') {
    newsClick++;
  }
  if (newsClick >= 2) {
    document.getElementById('bbc-news-date').textContent = 'Wednesday 28 May 1998';
  }
 
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
      news3: 'http://www.bbc.co.uk/news/isabel-tiley-mourned',
      blog: 'http://isabelsthings.blogspot.com',
    };
    const titles = {
      home: 'New Tab — Internet Explorer',
      news: 'BBC News - London & Greater London',
      news2: 'Isabel Tiley — Google Search',
      news3: 'Isabel Tiley — BBC News',
      news4: 'Isabel Tiley mourned at CSAM — BBC News',
      blog: "things i think about — Internet Explorer",
    };
    document.getElementById('address-bar').value = urls[page] || page;
    document.getElementById('browser-title').textContent = titles[page] || page;
 
    if (page === 'blog') {
      gameState.visitedBlog = true;
      renderBlogPage();
      checkNarrativeTriggers();
    }
 
    if (page === 'news') {
      gameState.newsRead = true;
      checkNarrativeTriggers();
    }
 
    document.getElementById('browser-status').textContent = 'Done';
  }
}
 
function browserNav(url) {
  document.getElementById('browser-status').textContent = 'Loading...';
  setTimeout(() => {
    if (url.includes('gazette')) navigateTo('news');
    else if (url.includes('blog')) navigateTo('blog');
    else if (url.includes('isabel') || url.includes('tiley')) navigateTo('news2');
    else navigateTo('home');
  }, 400);
}
 
function browserBack() {
  if (browserPos > 0) { browserPos--; navigateTo(browserHistory[browserPos]); }
}
function browserForward() {
  if (browserPos < browserHistory.length - 1) { browserPos++; navigateTo(browserHistory[browserPos]); }
}
 
/* -------------------------------------------------------------------------
   (NEED ACC PHOTOS)
   ------------------------------------------------------------------------- */
 
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
 
/* -------------------------------------------------------------------------
   NOTIFICATIONS
   ------------------------------------------------------------------------- */
 
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
 
/* -------------------------------------------------------------------------
   WINDOWS
   ------------------------------------------------------------------------- */
 
// 'diary' removed — folded into the blog page inside the browser window
const winIds = ['myspace', 'aim', 'browser', 'photos'];
 
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
 
/* -------------------------------------------------------------------------
   DRAGGING / RESIZING
   ------------------------------------------------------------------------- */
 
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
 
/* -------------------------------------------------------------------------
   DESKTOP DECORATION
   ------------------------------------------------------------------------- */
 
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
function updateClock() {
    const now = new Date();

    const h24 = now.getHours();
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ampm = h24 >= 12 ? 'PM' : 'AM';
    const h12 = (h24 % 12) || 12;
    document.getElementById('clock').textContent = `${h12}:${mm} ${ampm}`;
}

updateClock();
setInterval(updateClock, 1000);

generateStars(80);
 
openWindow('myspace');