import { initAgent } from "https://cdn.jsdelivr.net/npm/clippyjs/dist/index.mjs";
import * as agents from "https://cdn.jsdelivr.net/npm/clippyjs/dist/agents/index.mjs";

const story = [
  {
    id: "explore",
    hint: "Learn about yourself and Isabel. Check your MySpaces, and your blog. See if something happens then.",
    hintChoices: [
      { text: "Wouldn't I already know about myself?", next: "Meta1" },
      { text: "Got it!", next: null },
    ],
    doneWhen: ["myspace:dylan", "myspace:isabel", "read:blog"],
  },
  {
    id: "jess-message",
    hint: "Somebody's trying to reach you. Open Messenger.",
    start() {
      startChat("jess1");
    },
    doneWhen: ["opened:aim"],
  },
  {
    id: "news-death",
    hint: "Jess mentioned the news. Try the favourites in Internet Explorer.",
    start() {
      unlockPage("news2", null);
      unlockPage("news", "BREAKING: Daughter of Ed Tiley killed in road traffic accident on A316");
    },
    doneWhen: ["read:news"],
  },
  {
    id: "blog-1",
    hint: "There are new entries in your LiveJournal.",
    start() {
      reveal("mourning-comments");
      refreshIsabelComments();
      startTributes();
      reveal("blog-grief-1");
      newBlogEntry("blog-grief-2");
    },
    doneWhen: ["read:blog"],
  },
  {
    id: "parents-article",
    hint: "There's a new article in your Internet Explorer favourites.",
    start() {
      unlockPage("parents", "BBC London News alert: Central Saint Martins mourns student killed in car accident");
    },
    doneWhen: ["read:parents"],
  },
  {
    id: "blog-2",
    hint: "There's another new entry in your LiveJournal.",
    start() {
      newBlogEntry("blog-3");
    },
    doneWhen: ["read:blog"],
  },
  {
    id: "isabel-chat-1",
    hint: "Isabel's online. Open Messenger.",
    start() {
      if (catchingUp) return startChat("isabel1");
      setTimeout(() => {
        setIsabelOnline();
        startChat("isabel1");
      }, 4000);
    },
    doneWhen: ["chat-ended:isabel1"],
  },

  {
    id: "blog-3",
    hint: "There's a new entry in your LiveJournal.",
    start() {
      gameState.branchComplete = true;
      newBlogEntry("blog-4");

    },
    doneWhen: ["read:blog"],
  },
  {
    id: "jess-chat-2",
    hint: "Jess is messaging you. Open Messenger.",
    start() {
      startChat("jess2");
    },
    doneWhen: ["chat-ended:jess2"],
  },
  {
    id: "exploits-news",
    hint: "There's a new story in your Internet Explorer favourites.",
    start() {
      unlockPage("exploits", "BBC News alert: 'Friends only' does not mean private, warn experts");
    },
    doneWhen: ["read:exploits"],
  },
  {
    id: "isabel-chat-2",
    hint: "Isabel's online. Open Messenger.",
    start() {
      setIsabelOnline();
      startChat("isabel2");
    },
    doneWhen: ["chat-ended:isabel2"],
  },
  {

    id: "browser-history",
    hint: "You've got a Google Alert in your Hotmail. Then have a look at your History in Internet Explorer.",
    start() {
      lockedPages.delete("history");
      reveal("history-button");
      deliverMail(googleAlertMail);
      playSound(emailSound);
      showNotif("Windows Live Hotmail", `New message: ${googleAlertMail.subject}`, "hotmail");
    },
    doneWhen: ["read:hotmail", "read:history"],
  },
  {
    id: "photos-vanish",
    hint: "Have a look at your photos of Isabel.",
    start() {
      startPhotosVanishing();
    },
    doneWhen: ["photos:isabel"],
  },
  {

    id: "bounced-emails",
    hint: "Something's wrong with the emails you sent. Check your Hotmail.",
    start() {
      if (catchingUp) return bouncedMail.forEach((m) => deliverMail(m));
      bouncedMail.forEach((m, i) => {
        setTimeout(() => {
          deliverMail(m);
          playSound(emailSound);
          showNotif("Windows Live Hotmail", `New message: ${m.subject}`, "hotmail");
        }, i * 2500);
      });
    },
    doneWhen: ["read:hotmail"],
  },
  {
    id: "marnie-chat",
    hint: "(1) new message from: Marnie.",
    start() {
      startChat("marnie1");
    },
    doneWhen: ["chat-ended:marnie1"],
  },
  {

    id: "case-notes",
    hint: "There's a file on your desktop called A316.txt.",
    start() {
      reveal("casenotes-icon");
      showNotif("Notepad", "A316.txt was saved to your Desktop.", "casenotes");
    },
    doneWhen: ["opened:casenotes"],
  },
  {
    id: "isabel-chat-3",
    hint: "Isabel's online. Open Messenger.",
    start() {
      startChat("isabel3");
    },
    doneWhen: ["chat-ended:isabel3"],
  },
  {
    id: "grief-forums",
    hint: "There's something new in your Internet Explorer favourites.",
    start() {
      unlockPage("forums");
    },
    doneWhen: ["read:forums"],
  },
  {
    id: "lj-leak-news",
    hint: "There's a news story about LiveJournal in your favourites.",
    start() {
      unlockPage("ljleak", "BBC News alert: LiveJournal error exposes thousands of private diaries");
    },
    doneWhen: ["read:ljleak"],
  },
  {
    id: "blog-public",
    hint: "Your inbox is going mad. Check your Hotmail, then your LiveJournal.",
    start() {
      makeBlogPublic();
      startLeakFlood();
    },
    doneWhen: ["read:hotmail", "read:blog"],
  },
  {
    id: "isabel-chat-4",
    hint: "Isabel's online. Open Messenger.",
    start() {
      startChat("isabel4");
    },
    doneWhen: ["chat-ended:isabel4"],
  },
  {
    id: "delete-accounts",
    hint: "Open your LiveJournal and click Delete Journal at the top. You can delete your MySpace profile too, if you want to.",
    start() {
      gameState.isabelGone = true;
      setIsabelOffline();
      reveal("delete-buttons");
      setTimeout(() => clippySay("offerDelete"), 3000);
    },
    doneWhen: ["deleted:journal"],
  },
  {
    id: "final-entry",
    hint: "You saved something to your desktop. Open journal.txt.",
    start() {
      reveal("notepad-icon");
      showNotif("Notepad", "journal.txt was saved to your Desktop.", "notepad");
    },
    doneWhen: ["finished:journal"],
    pauseAfter: 1500,
  },
  {
    id: "clippy-final",
    hint: "I'm still here.",
    start() {
      setTimeout(() => clippySay("final1"), 2000);
    },
    doneWhen: ["clippy:the-end"],
  },
];

const PAUSE_BETWEEN_EVENTS = 10000;

let stepIndex = -1;
let stepProgress = new Set();
let stepFinished = false;

function startStep(index) {
  stepIndex = index;
  stepProgress = new Set();
  stepFinished = false;
  const step = story[index];
  if (!step) return;
  console.log("[story] now on:", step.id);
  showUnanswered((u) => u.when === step.id);
  if (step.start) step.start();
}

function storyEvent(name) {
  const step = story[stepIndex];
  if (!step || stepFinished || !step.doneWhen) return;
  if (!step.doneWhen.includes(name)) return;
  stepProgress.add(name);
  if (step.doneWhen.every((e) => stepProgress.has(e))) {
    stepFinished = true;
    setTimeout(() => startStep(stepIndex + 1), step.pauseAfter ?? PAUSE_BETWEEN_EVENTS);
  }
}

let catchingUp = false;

function skipTo(id) {
  const target = story.findIndex((s) => s.id === id);
  if (target === -1) return console.warn("[story] no event called", id);

  catchingUp = true;
  const realSetTimeout = window.setTimeout;
  const timers = [];
  window.setTimeout = (fn, ms, ...args) => {
    const t = realSetTimeout(fn, ms, ...args);
    timers.push(t);
    return t;
  };
  try {
    for (let i = 0; i < target; i++) {
      stepIndex = i;
      showUnanswered((u) => u.when === story[i].id);
      if (story[i].start) story[i].start();
    }
  } finally {
    window.setTimeout = realSetTimeout;
    timers.forEach((t) => clearTimeout(t));
    catchingUp = false;
  }

  if (storyReached("blog-1")) gameState.newsRead = true;
  if (gameState.tributesStarted) {
    gameState.tributesStarted = false;
    startTributes();
  }
  startStep(target);
}

function buildTestPanel() {
  const panel = document.createElement("div");
  panel.id = "test-panel";
  const label = document.createElement("button");
  label.className = "test-panel-label";
  label.textContent = "dev tool (spoilers)";
  const tools = document.createElement("span");
  tools.className = "test-panel-tools";
  const select = document.createElement("select");
  select.innerHTML = '<option value="">skip to event…</option>' +
    story.map((s, i) => `<option value="${s.id}">${i + 1}. ${s.id}</option>`).join("");
  select.onchange = () => {
    if (select.value) location.search = "?step=" + select.value;
  };
  const restart = document.createElement("button");
  restart.textContent = "restart";
  restart.onclick = () => (location.search = "");
  tools.append(select, restart);
  panel.append(label, tools);
  document.body.appendChild(panel);

  let open = false;
  try { open = localStorage.getItem("testPanel") === "open"; } catch (e) {}
  const show = () => {
    tools.style.display = open ? "inline-flex" : "none";
    label.textContent = open ? "dev tool (spoilers) ✕" : "dev tool (spoilers)";
  };
  show();
  label.onclick = () => {
    open = !open;
    show();
    try { localStorage.setItem("testPanel", open ? "open" : "closed"); } catch (e) {}
  };
}

function reveal(name) {
  document
    .querySelectorAll(`[data-story="${name}"]`)
    .forEach((el) => (el.style.display = ""));
}

function newBlogEntry(name) {
  reveal(name);
  showNotif("LiveJournal", "Your new entry has been posted to bewarethefriendlystranger.", "journal");
  showNarrative("Dylan wrote something new.");
}

const lockedPages = new Set([
  "news",
  "news2",
  "parents",
  "exploits",
  "history",
  "forums",
  "ljleak",
]);

function unlockPage(page, message = "Something new in your favourites.") {
  lockedPages.delete(page);
  reveal("link-" + page);
  const lock = document.getElementById("lock-" + page);
  if (lock) lock.style.display = "none";
  if (message) showNotif("Internet Explorer", message, "browser", page);
}

function makeBlogPublic() {

  document
    .querySelectorAll("#page-blog .lj-security.private")
    .forEach((el) => {
      el.textContent = "public";
      el.classList.replace("private", "leaked");
    });
}

function startPhotosVanishing() {
  gameState.photosVanishing = true;
  vanishPhoto();
}

function vanishPhoto() {
  const left = [...document.querySelectorAll('[data-photo="isabel"]')].filter(
    (el) => el.style.display !== "none"
  );
  if (left.length) left[left.length - 1].style.display = "none";
}

function deleteMyspace() {
  document.getElementById("ms-dylan").innerHTML =
    '<div style="padding:30px;text-align:center;color:#999;font-size:11px">This profile has been deleted.</div>';
  document.getElementById("dylan-home-status").textContent = "profile deleted";
  storyEvent("deleted:myspace");
}

function deleteJournal() {
  gameState.journalDeleted = true;
  document.querySelectorAll("#page-blog").forEach((el) => {
    el.innerHTML =
      '<div class="lj-deleted"><b>Error</b><br>This journal has been deleted.<br><br><a onclick="navigateTo(\'home\')">◀ Back to Favourites</a></div>';
  });
  storyEvent("deleted:journal");
}

const chats = {
  jess1: {
    buddy: "Xx_Jess_Xx",
    date: "Wednesday 28 May 2008, 18:02",
    nodes: {
      start: {
        line: "have you seen the news?? weren't you friends with a girl called isabel?",
      },
    },
  },

  isabel1: {
    buddy: "istiny888",
    date: "Saturday 31 May 2008, 23:40",
    nodes: {
      start: {
        line: "hiiiii dylisa ;) xo",
        choices: [
          { text: "Who is this?", next: "nightmare" },
          { text: "Izzy? You're alive?", next: "c1Dyl2" },
        ],
      },
      nightmare: {
        line: "your worst nightmare. O.O",
        choices: [
          { text: "Seriously, this isn't funny.", next: "nightmare2" },
          { text: "Whoever you are, you're sick. Using a dead girl's account for a laugh.", next: "hurt1" },
        ],
      },
      nightmare2: {
        line: "who do you think it is silly girl!!!! :p",
        choices: [
          { text: "I don't understand.", next: "iThoughtYouWereDead" },
          { text: "Someone with no life, clearly.", next: "hurt1" },
        ],
      },
      iThoughtYouWereDead: {
        line: "ok now i'm confused 2... talk to me?",
        choices: [
          { text: "I thought you were dead.", next: "c1Dyl2" },
          { text: "Prove it's you. Tell me something only Izzy would know.", next: "memBeach" },
        ],
      },

      memBeach: {
        line: "uhh how about when i came to your hometown just this jan, and u made me lie in the sand for an HOUR 4 ur woodman photos and i couldn't feel my legs for a week. still got sand in my ears dyl",
        choices: [
          { text: "You said it was the most artistic you'd ever felt.", next: "memBeach2" },
          { text: "I remember seeing that exact photo on your MS.", next: "hurt1" },
        ],
      },
      memBeach2: {
        line: "i did!! i felt like an angel-woman-sand-monster-thing :) did u ever get the proper ones on ur nikon developed??",
        choices: [
          { text: "They're on my computer. I look at them every day.", next: "c1Dyl2" },
          { text: "Stop it. You're not her.", next: "hurt1" },
        ],
      },
      c1Dyl2: {
        line: "eeek sorry i know!! i haven't chatted in foreverrr. how are you pretty girl? xo",
        choices: [
          { text: "Have you checked the news? Your death is front page.", next: "c1Dyl3" },
          { text: "I miss you. The Thursday calls were the only good part of my week.", next: "memThursday" },
        ],
      },
      memThursday: {
        line: "sameee!! u doing ur morticia voice about the pub men is the highlight of my LIFE hehe, i really want to hear it again... i miss you :(",
        choices: [
          { text: "Can I see you?", next: "memLondon" },
          { text: "Isabel, the news says you died.", next: "c1Dyl3" },
        ],
      },
      memLondon: {
        line: "the floor is urs!!! we'll go 2 the tate and pretend we have no idea who Ed tiley is and eat chips on the bridge. promise xo",
        choices: [
          { text: "Prove it's you. Tell me something true.", next: "memTrue" },
          { text: "Iz, the BBC says you died in Chiswick in your car. What's going on?", next: "c1Dyl3" },
        ],
      },
      memTrue: {
        line: ["something true !!!", "hehe", "you've seen every runway look of mine and you promised to photograph every single one xo"],
        choices: [
          { text: "Every single one.", next: "sweetEnd" },
          { text: "Can we talk about why your death is all over the news, now?", next: "c1Dyl3" },
        ],
      },
      sweetEnd: {
        line: "gotta go pretty girl. can't call 2nite btw, something came up :( but next thursday. promise. luv ya!!1",
        choices: [
          { text: "Love you too." },
          { text: "Wait. Don't go." },
        ],
      },

      c1Dyl3: {
        line: ["huhhh wow.", "i did say everybody was gunna know my name right?"],
        choices: [
          { text: "Just tell me what's happening...", next: "c1Dyl4" },
          { text: "Isabel.", next: "hurt1" },
        ],
      },
      c1Dyl4: {
        line: "well !!! i am here messaging you now arn't i missy?! xo",
        choices: [
          { text: "Is the story someone else? I'm so confused.", next: "c1Dyl5" },
          { text: "No, this has to be a joke.", next: "hurt1" },
        ],
      },
      c1Dyl5: {
        line: "not sure. can't call 2nite btw. i know we do on thu but something came up :(",
        choices: [
          { text: "Like your death?", next: "c1Dyl6" },
          { text: "That's okay. Thursday, then?", next: "c1Dyl6" },
        ],
      },
      c1Dyl6: {
        line: "haha yes. luv ya!!1",
        choices: [

          { text: "Wait.", next: "iThoughtYouWereDead", ifVisited: "c1Dyl7" },
          { text: "Love you too." },
        ],
      },
      c1Dyl7: {
        line: "i reallyyy gotta go now dyl!! thursday, k? xo",

      },

      hurt1: {
        line: "wow. ok. i didn't message u 2 get called names dylan",
        choices: [
          { text: "I'm sorry. I didn't mean it.", next: "hurt2" },
          { text: "You're not her. Stop pretending.", next: "hurtLeaves" },
        ],
      },
      hurt2: {
        line: "u did tho. i thought u of all ppl would be happy 2 hear from me :(",
        choices: [
          { text: "I am. Please don't go.", next: "hurtStays" },
          { text: "Stop it.", next: "hurtLeaves" },
        ],
      },
      hurtStays: {
        line: "...fine. but be nice 2 me. i've had a weird week !!",
        choices: [
          { text: "Tell me something only Iz would know.", next: "memBeach" },
          { text: "I suppose dying would make the week a bit weird, wouldn't it?", next: "hurtLeaves" },
        ],
      },
      hurtLeaves: {
        line: "i'm not doing this. talk 2 me when ur ready 2 be nice. TTYL dylan.",
        flag: "isabelLeftUpset",

      },
    },
  },

  jess2: {
    buddy: "Xx_Jess_Xx",
    date: "Monday 9 June 2008, 18:25",
    nodes: {
      start: {
        line: "Hey Dyl, how are u?? Been a while",
        choices: [
          { text: "I'm fine...", next: "okay" },
          { text: "Been better tbh.", next: "better" },
        ],
      },
      okay: {
        line: "Awh are u sure?? Havn't seen you in work for a bit is all, Gaz says he'z not heard from you????",
        choices: [
          { text: "I'm fucked, aren't I?", next: "fired" },
          { text: "I don't really want to talk about it...", next: "pint" },
        ],
      },
      fired:{
        line: [
          "Ahah well you know you can do no wrong by gaz rlly",
          "We say he's a hardass but he never left your dad's side after your ma died",
          "Waif I'm so sorry",
          "Oh Dylan",
          "Jfc.Idk what to say"
        ],
        choices: [
          {text: "Just don't say anything, then...", next: "saysSomethingAnyway"},
          {text: "It's getting too much. I don't know what to do, Jess.", next: "close2"},
        ]
      },
      saysSomethingAnyway: {
        line: ["Soz", "Deaths just so so weird, man", "But then saying that It was so annoying when ppl acted the way they did when Rolo died"],
        choices: [
        {text: "You know damn well your dog isn't the same as my mam and Iz.", next: "tryingToHelp"},
        {text: "Sure.", next: "close"},
      ],
    },
      tryingToHelp: {
        line: ["Okay I keep saying the wrong thing.", "Mayb I should leave u 2 it??"],
        choices: [
          {text: "That's probably for the best."}
        ]
      }
      better: {
        line: "Awh. Is it your friend from London? I'm so sorry to hear that, what a horrible way to go :(",
        choices: [
          { text: "Naturally.", next: "close" },
          { text: "I don't really want to talk about it...", next: "pint" },
        ],
      },
      close: {
        line: "Were u girls super close? I remember you said you met her in person a few times, where did you meet again?",
        choices: [
          { text: "Remember that outreach event we did in Camden when we saw all the UAL shows?", next: "camden" },
          { text: "We were a lot closer than you think.", next: "ohDyl" },
        ],
      },
      close2: {
        line: ["Awh I'm so sorry. I just don't know what to say. I don't want to make it worse.",
        "I didn't realise you two were so close... I remember you said you met her in person a few times, where did you meet again?"],
        choices: [
          { text: "Remember that outreach event we did in Camden when we saw all the UAL shows?", next: "camden" },
          { text: "We were a lot closer than you think.", next: "ohDyl" },
        ],
      },
      pint: {
        line: [
        "Okok I understand. Ummm I have Fri off if u fancy a pint?",
        "Don't have to go to the Ship or talk about your friend of course"],
        choices: [
          { text: "We were a lot closer than you think.", next: "ohDyl" },
          { text: "Okay...", next: "busy" },
        ],
      },
      camden: {
        line: "Ohh yeah. Man I remember being so mad I missed that!!",
        choices: [
          { text: "She was my girlfriend, Jess.", next: "girlfriend" },
          { text: "Yeah...", next: "busy" },
        ],
      },
      ohDyl: {
        line: "Oh Dyl. :(",
        choices: [
          { text: "She was my girlfriend, Jess.", next: "girlfriend" },
          { text: ":/", next: "busy" },
        ],
      },
      girlfriend: {
        line: "Your girlfriend?",
        flag: "toldJess",
        choices: [{ text: "Yep.", next: "reaction" }],
      },
      reaction: {
        line: [
          "Oh",
          "I had no idea you were...",
          "Well I mean its fine! I did wonder lol",
          "Congrats :)",
          "Well, I guess not congrats under the circumstances.",
          "Soz idk really waht to say",
        ],
        choices: [
          { text: "It's fine. I haven't really told anyone, so can you keep it between us?", next: "secret" },
          { text: "I've got to go", next: "defensive" },
        ],
      },
      secret: {
        line: ["No ofc not!!!", "Gtg. Off for dinner with Callum tonite", "Chat soon?"],
      },
      defensive: {
        line: "Ah good timing aha, I'm off for dinner with Callum tonite.",
        flag: "defensiveWithJess",
      },
      busy: {
        line: ["Gtg. Off for dinner with Callum tonite", "Chat soon?"],
      },
    },
  },

  isabel2: {
    buddy: "istiny888",
    unanswered: [
      { date: "Sunday 1 June 2008, 02:40", when: "blog-3", lines: ["Hello?", "Iz?"] },
      { date: "Thursday 5 June 2008, 22:00", when: "jess-chat-2", lines: ["It's Thursday.", "You said Thursday."] },
      { date: "Friday 13 June 2008, 03:15", when: "exploits-news", lines: ["What do I have to do to get you to message me again?"] },
    ],
    date: "Thursday 19 June 2008, 23:02",
    nodes: {
      start: {
        line: [
          "dyl!!!",
          "ok i was thinking about u all day in the studio",
          "do u remember what u wore in camden?? the day we met",
        ],
        choices: [
          { text: "Vaguely. Something black, probably.", next: "coat" },
          { text: "Why are you thinking about Camden?", next: "why" },
        ],
      },
      why: {
        line: "bc i couldnt stop looking at u that day and i never told u why. so shh and let me tell you",
        choices: [
          { text: "I'm listening.", next: "coat" },
          { text: "You're being weird, Iz.", next: "coat" },
        ],
      },
      coat: {
        line: [
          "the COAT dyl. the long black one, collar up, belt just hanging off it",
          "u looked like u'd walked straight off ann demeulemeester's runway. i actually said oh my god out loud. jamie thought i'd seen someone famous",
        ],
        choices: [
          { text: "It was from a charity shop. Four quid.", next: "charity" },
          { text: "You told me I looked like a Belgian widow.", next: "widow" },
        ],
      },
      widow: {
        line: ["u DID look like a belgian widow. a hot one;)", "aaaand thats a compliment in fashion i promise!!!"],
        choices: [
          { text: "It was from a charity shop. Mam said she got it for four quid", next: "charity" },
          { text: "It was my mam's.", next: "mam" },
        ],
      },
      charity: {
        line: "FOUR POUNDS?? gawd some people have all the luck !!! are all the chazza shops in Whitley blessed by angels???",
        choices: [
          { text: "Dad gave her things to the charity shop after she died. I bought it back.", next: "mam" },
          { text: "Not since you left.", next: "seafront" },
        ],
      },
      seafront: {
        line: ["awhh!!! <3", "well whoever gave that away has NO taste my love !! i'd have fought them for it"],
        choices: [
          { text: "It was my mam's.", next: "mam" },
          { text: "Yeah. No taste.", next: "studio" },
        ],
      },
      studio: {
        line: "anywayyy i've rly missed drawing up my pieces. we made some coats !! all of them are urs. my tutor thinks i've gone full goth lololol",
        choices: [
          { text: "Show me some time.", next: "yourTurn" },
          { text: "Put me in the exhibition, then.", next: "yourTurn" },
        ],
      },
      mam: {
        line: ["ohhhh", "dylisa !!", "you never told me that", "i knew it had something special about it. i could just feel it !!"],
        flag: "toldIsabelAboutCoat",
        choices: [
          { text: "I didn't want to go on my own.", next: "notAlone" },
          { text: "It still smelled like her then. It doesn't now.", next: "smell" },
        ],
      },
      smell: {
        line: ["but that means she was there when we met !!", "you never talk about her, dyl.", "tell me, what was she like?? i want to know"],
        choices: [
          { text: "She was my best friend.", next: "notAlone" },
          { text: "You'd have liked her.", next: "likedHer" },
        ],
      },
      likedHer: {
        line: ["course i would !! seems she had better taste than half of csm.", "and she made u, didnt she;)"],
        choices: [
          { text: "She'd have liked you more than she liked me.", next: "hadMe" },
          { text: "She'd have called you a madam.", next: "hadMe" },
        ],
      },
      hadMe: {
        line: "she'd be right teehee. i always said you had me from about four seconds in anyway x",
        choices: [
          { text: "Four seconds?", next: "yourTurn" },
          { text: "I know.", next: "yourTurn" },
        ],
      },
      notAlone: {
        line: ["she soundss amazing !!", "i liked that story you told me where marched down your local park in her heels and hit those boys round the park for making fun of you when you were a kid hehe x"],
        choices: [
          { text: "How did you know that?", next: "where" },
          { text: "She was amazing.", next: "yourTurn" },
        ],
      },
      yourTurn: {
        line: "ok. tell me something true ! your turn sweetness xo",
        choices: [
          { text: "I wore the coat the coat for a week afterwards so I wouldn't forget that day.", next: "glitch" },
          { text: "I nearly didn't come.", next: "nearly" },
        ],
      },
      nearly: {
        line: "but u did!! and u wore the coat and i said oh my god out loud. see? meant 2 be",
        choices: [
          { text: "Meant to be.", next: "glitch" },
          { text: "Nothing's meant to be, Iz.", next: "glitch2" },
        ],
      },
      glitch2: {
        line: "well, no !1 but that's a good thing, no? you said you're tired of living in boxes. but by your logic, even that's not meant 2 be... gotcha :p",
        choices: [
          { text: "Where did you read that?", next: "where" },
          { text: "...I suppose. :)", next: "goodbye" },
        ],
      },
      glitch: {
        line: [
          "i felt so safe when i burrowed into your coat.",
           "hey that reminds me of that thing u said... i am safe in pixels. sooo pretty xo",
        ],
        choices: [
          { text: "Where did you read that?", next: "where" },
          { text: "...Yeah:)", next: "goodbye" },
        ],
      },
      where: {
        line: "whaatt? u say it all the time silly",
        choices: [
          { text: "I've never said that out loud.", next: "press" },
          { text: "Never mind.", next: "goodbye" },
        ],
      },
      press: {
        line: ["hey your scaring me a bit... can we not?!", "i was having a nice time talking with you okayyy.", "i miss u so much:(",],
        choices: [
          { text: "Sorry. Me too.", next: "goodbye" },
          { text: "Tell me how you know what I said.", next: "goodbyeCold" },
        ],
      },
      goodbye: {
        line: ["gtg, they're locking the studio :(", "hey.. you should wear the coat when we call thursday", "i'll know xo"],
      },
      goodbyeCold: {
        line: "i dont know, ok?? i just do. night dyl",
        flag: "pushedIsabel",
      },
    },
  },

  marnie1: {
    buddy: "Marnie Holloway",
    date: "Sunday 6 July 2008, 14:10",
    nodes: {
      start: {
        line: "Hey little sis! If I message you on MSN will you finally respond?! how you holding up, chick?",
        choices: [
          { text: "Yeah, sorry, I'm alright. Just busy with work.", next: "busy" },
          { text : "Not great, actually. I could use a chat.", next: "chat" }
        ],
      },

  busy: {
    line: ["Busy with work, eh? So where's this new swanky work place? Gaz tells me you left the Ship.", "Good on you, weren't any different when I worked there. Full of Whitley's weirdos :-P"],
    choices: [
      { text: "I'm pretty sure I've been fired. I haven't been in in ages.", next: "fired" },
      { text: "I don't want to talk about it.", next: "chat" }
    ],
  },
fired: {
  line: ["Yeowch. Tough break, kid.","Still, my sentiment stands!","You got anything else lined up?"],
  choices: [
  { text: "I suppose I should probably look...", next: "chat"},
  { text: "I don't want to.", next: "chat"}
],
},
chat: {
    line: ["Oh Dyllie. What's up, really?", "I know it must be hard for you up there with dad and the rug rats, but I'm here."],
    choices: [
      { text: "What do you do when someone who you thought was gone is messaging you?", next: "messaging" },
      { text: "I miss Isabel.", next: "who" }
    ],
  },
  messaging: {
    line: ["Um. Gone as in dead?"],
    choices: [
      { text: "Yes...", next: "deadMessage" },
      { text: "I'm not sure anymore.", next: "deadMessage" }
    ],
  },
  deadMessage: {
    line: ["Wow, haha. Yeah, you got me there.", "You might want to report it to Microsoft. They might have more of an idea of what's going on?", "Some sort of weird system purge?", "I'm honestly not sure!"],
    choices: [
      { text: "I can't report it.", next: "whyyy" },
      { text: "I'm scared that means she'll go.", next: "trouble" }
    ],
  },

  whyyy: {
    line: "Why not?!",
    choices: [
    { text: "That means she's not there anymore."},
    { text: "I'm not ready to let go."}
    ],
  },

  trouble: {
    line: ["You remember when mam died?"],
    choices: [
      { text: "Surprisingly, yep.", next: "remember" },
      { text: "Of course I do.", next: "remember" }
    ],
  },
  remember: {
    line: ["I was in second year, in that horrible shed of a house", "With the window that overlooked huge garden that stretched on into the forest.", "For up about a year after she died, I swore I would see her walk into that forest.", "Every time, at around ten o' clock, I would see her in one of her Afghans.", "She waved at me, sometimes."],
    choices: [
      { text: "So you understand?", next: "understand" },
      { text: "What are you getting at, exactly?", next: "defense" }
    ]
  },
  understand: {
    line: ["I understand what you're going through."],
    choices: [
      { text: "...yeah.", next: "thanks" }
    ]
  },

  defense: {
    line: ["The mind can do funny things when you're grieving someone. It can be awful, but I'm here if you need someone to talk to."],
    choices: [
      { text: "Thanks.", next: "thanks" },
      { text: "You don't get it. She's real. She remembers things only we would know.", next: "defense2" }
    ]
  },

  defense2: {
    line: ["I know, I know.", "I get what you're going through."],
    choices: [
      { text: "Thanks.", next: "thanks" },
      { text: "No you don't. You have no idea what I'm going through. She's haunting me every day and I feel like I'm losing my fucking mind, Marnie.", next: "defense3" }
    ]
  },

  defense3: {
    line: ["Dylan...", "Do you need someone to talk to again?", "Like, the therapist you saw last time?"],
    dylanLogsOff: true,
  },

  thanks: {
    line: ["I'm glad we spoke, Dylan. I miss you.", "Come and visit me soon?", "I'll pay your way down. :-)'"],
    dylanLogsOff: true,
  },
    },
  },

  isabel3: {
    buddy: "istiny888",
    unanswered: [
      { date: "Thursday 26 June 2008, 23:59", when: "photos-vanish", lines: ["I'm always waiting for you to message.", "Please"] },
      { date: "Saturday 5 July 2008, 04:02", when: "bounced-emails", lines: ["I won't be angry", "Jsut put me out of my misery and mesage me.", "Im begging you"] },
      { date: "Thursday 10 July 2008, 03:30", when: "case-notes", lines: ["are you there", "isabel", "who killed you isabel"] },
    ],
    date: "Thursday 17 July 2008, 03:12",
    nodes: {
      start: {
        line: "cant sleep either?? :p",
        choices: [
          { text: "How do you know I'm awake?", next: "howKnow" },
          { text: "Iz. I need to ask you something.", next: "ask" },
        ],
      },
      howKnow: {
        line: "ur always awake at 3 silly. ur little green dot never goes off",
        choices: [
          { text: "I need to ask you something.", next: "ask" },
          { text: "I missed you.", next: "missed" },
        ],
      },
      missed: {
        line: "missed u more !! its thursday tomorrow right? call me xoxo",
        choices: [
          { text: "It's Thursday now, Iz.", next: "thursday" },
          { text: "Iz, why were you on the A316?", next: "why" },
        ],
      },
      thursday: {
        line: "is it? oh... i lose track a bit lately :/",
        choices: [
          { text: "Why were you on the A316 at 11pm on a Monday?", next: "why" },
          { text: "Tell me about your day.", next: "day" },
        ],
      },
      ask: {
        line: "ooh serious dyl... go on then :D",
        choices: [
          { text: "Why were you on the A316 at 11pm on a Monday?", next: "why" },
          { text: "Who was driving the other car?", next: "car" },
        ],
      },
      why: {
        line: ["the a316?", "i dunno. going home i guess. or going somewhere"],
        choices: [
          { text: "Going where?", next: "where" },
          { text: "Who was driving the other car?", next: "car" },
        ],
      },
      where: {
        line: "haha yes. luv ya!!1",
        choices: [
          { text: "That's not an answer.", next: "car" },
          { text: "Iz?", next: "steady" },
        ],
      },
      car: {
        line: ["what car?", "dylan there wasnt a car ??"],
        choices: [
          { text: "The one that hit you.", next: "hit" },
          { text: "Was it Tyler?", next: "tyler" },
        ],
      },
      tyler: {
        line: "tyler? hes just a friend dyl. why r u being weird",
        choices: [
          { text: "Was he there that night?", next: "hit" },
          { text: "Sorry. Forget it.", next: "steady" },
        ],
      },
      hit: {
        line: ["it was dark", "and i was so tired...", "i just felt so very tired :("],
        choices: [
          { text: "That's not what happened to you.", next: "breaking" },
          { text: "That's what happened to mam.", next: "breaking" },
        ],
      },
      breaking: {
        line: ["dyl i dont", "i dont remem"],
        choices: [
          { text: "Tell me what happened, Isabel.", next: "cutOff" },
          { text: "Okay. Okay. Forget it.", next: "steady" },
        ],
      },
      cutOff: {
        line: "dyl i",
        flag: "dugTooDeep",
      },
      steady: {
        line: "...sorry. weird night. whats new with u?",
        choices: [
          { text: "Nothing. I just wanted to talk to you.", next: "day" },
          { text: "Tell me about your day.", next: "day" },
        ],
      },
      day: {
        line: "theyre putting my coats in lethaby eeeee !! did u see? everyones going to see women in the walls",
        choices: [
          { text: "I saw.", next: "sleep" },
          { text: "I'll come down for it.", next: "sleep" },
        ],
      },
      sleep: {
        line: "go to sleep dyl. i'll still be here :)x",
        choices: [
          { text: "Promise?" },
          { text: "Goodnight, Iz." },
        ],
      },
    },
  },

  isabel4: {
    buddy: "istiny888",
    unanswered: [
      { date: "Thursday 24 July 2008, 02:11", when: "grief-forums", onlyIf: "dugTooDeep", lines: ["I'm sorry about last time."] },
      { date: "Thursday 24 July 2008, 02:11", when: "grief-forums", unless: "dugTooDeep", lines: ["Hello?", "You promised you'd still be here."] },
      { date: "Thursday 14 August 2008, 04:44", when: "blog-public", lines: ["Everyone knows about us now, I suppose.", "Everyone's read it.", "Did you read it?"] },
      { date: "Thursday 21 August 2008, 03:03", when: "isabel-chat-4", lines: ["Hello?"] },
    ],
    date: "Thursday 28 August 2008, 02:56",
    nodes: {
      start: {
        line: "long time, no talk…",
        choices: [
          { text: "You never messaged me.", next: "bothWays" },
          { text: "You’re not real.", next: "notReal" },
        ],
      },
      bothWays: {
        line: "a message works both ways. missy!",
        choices: [
          { text: "I suppose, but…", next: "butWhat" },
          { text: "You’re not real.", next: "notReal" },
        ],
      },
      butWhat: {
        line: "but what??",
        choices: [
          { text: "We keep avoiding the elephant in the room. You’re messaging me.", next: "silence" },
          { text: "You’re not real.", next: "notReal" },
        ],
      },
      silence: {
        line: "...",
        choices: [{ text: "You’re not real.", next: "notReal" }],
      },
      notReal: {
        line: "dylan, why do you say that?",
        choices: [
          { text: "You’re just a part of my grief.", next: "oneMore" },
          { text: "You’re just some weird system glitch.", next: "oneMore" },
        ],
      },
      oneMore: {
        line: "can i tell you one more thing that’s true?",
        choices: [
          { text: "Yes?", next: "story" },
          { text: "No. Tell me what’s happening.", next: "please" },
        ],
      },
      please: {
        line: "please. i just need to work through this one last thing.",
        choices: [{ text: "Fine.", next: "story" }],
      },
      story: {
        line: [
          "When we first properly saw each other after we met. I took you to Charlie’s Vodka bar and we were both so drunk we got thrown out. You asked me to tell you something true, and I blurted out I love you before I could even think about it. I tried to cover up my tracks by asking what tell me something true meant.",
          "And you said, I was so perfect I had to be fake, a girl you'd dreamed of. So you needed me to tell you something true.",
          "I think you said I love you back. But even if you didn’t, you showed it to me across the past ten months.",
          "I’ll never forget that, Dylisa.",
          "I love you!",
        ],
        choices: [
          { text: "I love you." },
          { text: "Please don’t leave me." },
        ],
      },
    },
  },

};

const startingMail = [
  {
    from: "University of Manchester Alumni",
    subject: "Manchester Alumni News: Summer 2008",
    received: "15/05/2008",
    body: "Dear Dylan,\n\nWelcome to the summer edition of Manchester Alumni News.\n\nIn this issue:\n- Class of 2006: where are they now? We catch up with graduates working in London, New York and Tokyo.\n- Save the date: School of Arts, Histories and Cultures reunion, Saturday 18 October.\n- Update your details so we can keep in touch.\n\nWe'd love to hear what you're doing now. Reply and tell us your news!\n\nAlumni Relations Team\nThe University of Manchester",
  },
  {
    from: "Windows Live Hotmail",
    subject: "Welcome to Windows Live Hotmail",
    received: "12/09/2007",
    body: "Welcome to Windows Live Hotmail!\n\nYour new inbox is ready. Hotmail gives you 5GB of storage, protection from junk mail and your e-mail wherever you are.\n\nThe Windows Live Hotmail Team",
  },
  {
    from: "Nationwide",
    subject: "Thank you for signing up for Internet Banking",
    received: "01/05/2008",
    body: "Dear Customer,\n\nThank you for signing up for Internet Banking, the fastest way to manage your finances.\n\nYour latest statement is now available in Internet Banking.\n\nFor your security, we will never ask for your password by e-mail.\n\nNationwide Building Society",
  },
  {
    from: "Gaz (The Ship Inn)",
    subject: "Late again...?",
    received: "19/05/2008",
    body: "Dylan, I know your sleep has been an issue, but Marcy says you were late again yesterday.\n\nPlease... dont make me cut your hours!!\n\ndont be late again and get some rest for God sake girl.\n\nGaz",
  },
];

const googleAlertMail = {
  from: "Google Alerts",
  subject: "Google Alert - \"Isabel Tiley\"",
  body: "Google News Alert for: \"Isabel Tiley\"\n\nA316 hit-and-run: police 'confident' of arrest\nBBC News\n...Detectives investigating the death of Isabel Tiley, 23, say they remain confident of making an arrest...\n\nTribute show planned for Saint Martins student\nLondon Echo\n...Friends of Isabel Tiley, who died on the A316 last month, are planning an exhibition of her work...\n\nTiley family thank public for support\nChiswick Gazette\n...The family of Isabel Tiley have thanked the public for their 'overwhelming' support...\n\nThis as-it-happens Google Alert is brought to you by Google.\n\nRemove this alert.\nCreate another alert.\nManage your alerts.",
};

const bouncedMail = [
  {
    from: "Mail Delivery Subsystem",
    subject: "Delivery Status Notification (Failure)",
    body: "Delivery to the following recipient failed permanently:\n\n     istiny888@hotmail.co.uk\n\nThe account you tried to reach has been disabled.\n\n----- Original message -----\nTo: istiny888@hotmail.co.uk\nSubject: (no subject)\nSent: 21/06/2008 03:47\n\nwhy do you only come online at night",
  },
  {
    from: "Mail Delivery Subsystem",
    subject: "Delivery Status Notification (Failure)",
    body: "Delivery to the following recipient failed permanently:\n\n     istiny888@hotmail.co.uk\n\nThe account you tried to reach has been disabled.\n\n----- Original message -----\nTo: istiny888@hotmail.co.uk\nSubject: thursday\nSent: 26/06/2008 23:59\n\nI waited for the call. I know you said something came up. I waited anyway.",
  },
  {
    from: "Mail Delivery Subsystem",
    subject: "Delivery Status Notification (Failure)",
    body: "Delivery to the following recipient failed permanently:\n\n     istiny888@hotmail.co.uk\n\nThe account you tried to reach has been disabled.\n\n----- Original message -----\nTo: istiny888@hotmail.co.uk\nSubject: tell me something true\nSent: 02/07/2008 04:12\n\niz please im losing my fuckinf mind",
  },
];

const junkMail = [
  {
    from: "Guardian Jobs",
    subject: "5 new jobs matching 'junior graphic designer London'",
    body: "Your job alert: junior graphic designer, London\n\n- Junior Designer, fashion e-commerce, Shoreditch. £16,000.\n- Design Assistant (unpaid internship, 3 months), Soho.\n- Junior Artworker, Hammersmith. £15,500.\n- Graduate Designer, publishing, King's Cross. £17,000.\n- Mac Operator, Park Royal. £14,000.\n\nApply now on guardianjobs.co.uk",
  },
  {
    from: "Topshop",
    subject: "Summer sale: up to 50% off starts NOW",
    body: "The summer sale is here!\n\nUp to 50% off dresses, denim and must-have festival looks. In store and online now.\n\nTopshop Oxford Circus opens late every Thursday.",
  },
  {
    from: "Tagged",
    subject: "dylisastar, someone wants to be your friend!",
    body: "Somebody you may know has tagged you!\n\nSign in to Tagged to find out who.\n\nYou have 1 pending friend request.",
  },
  {
    from: "UK NATIONAL LOTTERY BOARD",
    subject: "CONGRATULATIONS!!! YOUR E-MAIL HAS WON £850,000",
    body: "ATTN: WINNER\n\nYour e-mail address was selected in our monthly online draw and has won the sum of £850,000 (EIGHT HUNDRED AND FIFTY THOUSAND POUNDS).\n\nTo claim, reply with your full name, address, date of birth and bank details.\n\nDr. Richard Moore\nClaims Agent",
  },
  {
    from: "MeetLocalSingles",
    subject: "3 singles in Whitley Bay want to meet you tonight",
    body: "Hi dylisastar!\n\n3 singles near Whitley Bay have viewed your profile this week.\n\nDon't keep them waiting!\n\nJoin FREE today.",
  },
  {
    from: "Rightmove",
    subject: "4 new rooms matching 'West London - double room under £90pw'",
    body: "New properties matching your saved search:\n\n- Double room, Goldhawk Road, Shepherd's Bush. £85pw. Bills incl. Female preferred.\n- Large double, Uxbridge Road, Acton. £88pw.\n- Double room in friendly house share, Hammersmith. £90pw.\n- Box room, Chiswick. £70pw. Summer sublet, suit student.\n\nTo stop receiving these e-mails, edit your saved searches.",
  },
  {
    from: "Amazon.co.uk",
    subject: "Your Amazon.co.uk order has been dispatched",
    body: "Hello,\n\nWe thought you'd like to know that we've dispatched your item(s).\n\nThe Virgin Suicides (Paperback)\nQty: 1\n\nYour order is being sent by Royal Mail 2nd Class.",
  },
  {
    from: "Orange",
    subject: "Your Orange bill is ready",
    body: "Your latest Orange bill is ready to view online.\n\nAmount due: £15.00\n\nThank you for choosing Orange.",
  },
  {
    from: "LiveJournal",
    subject: "Your Paid Account expires in 7 days",
    body: "Hi bewarethefriendlystranger,\n\nYour Paid Account will expire in 7 days. Renew now to keep your userpics, extra features and ad-free journal.",
  },
  {
    from: "Replica Watches",
    subject: "Re: re: your order",
    body: "Luxury watches 80% OFF. Rolex, Cartier, Omega.",
  },
  {
    from: "Last.fm",
    subject: "Your weekly music charts",
    after: "blog-1",
    body: "Hi planetdylan, here's what you listened to this week:\n\n1. Boards of Canada (61 plays)\n2. Belle and Sebastian (9 plays)\n3. Nirvana (7 plays)\n\nTop track: Boards of Canada - Farewell Fire (23 plays)",
  },
  {
    from: "Gaz (The Ship Inn)",
    subject: "shifts",
    after: "blog-1",
    body: "dylan youve missed 2 shifts now. I am a friend of your family but I can't have my business suffer. So sort it out or im taking you off the rota\n\nGaz",
  },
  {
    from: "National Express",
    subject: "Summer sale: London from £1!",
    after: "blog-1",
    body: "Get away this summer!\n\nNewcastle to London Victoria from just £1 each way.\n\nBook now: offer ends Sunday.",
  },
  {
    from: "MySpace",
    subject: "dylisastar, see what's new with your friends!",
    after: "isabel-chat-1",
    body: "Here's what your friends have been up to:\n\n- istiny888 updated their profile.\n\nLog in to MySpace to see more.",
  },
  {
    from: "North Tyneside Libraries",
    subject: "Reminder: 1 item overdue",
    after: "blog-3",
    body: "Dear borrower,\n\nThe following item is now overdue:\n\nThe Year of Magical Thinking - Joan Didion\n\nPlease return or renew it as soon as possible.",
  },
];

const leakNotice = {
  from: "LiveJournal Support",
  subject: "Important information about your journal",
  body: "Dear bewarethefriendlystranger,\n\nWe are writing to let you know about a technical issue that affected your journal.\n\nBetween 11 and 13 August 2008, a software error during a site update caused some friends-only and private entries to be displayed publicly. The error has now been fixed.\n\nDuring this period your private entries may have been viewed by other users and saved by search engines. We have asked search engines to remove these copies, but some may remain visible for a time.\n\nWe sincerely apologise for any inconvenience. We take the privacy of our users very seriously.\n\nThe LiveJournal Team",
};

const leakComments = [
  { from: "(Anonymous)", entry: "entry4", date: "August 12th, 2008", text: "ermmm see a shrink maybe? just keepin it real lmfao u sound nutz" },
  { from: "Vampy_ch1k29", entry: "entry4", date: "August 1th, 2008", text: "NO WAY is this Dylan Holloway???????? Epic fail"},
  { from: "(Anonymous)", entry: "grief2", date: "August 12th, 2008", text: "Found this through google. This is so sad. Sorry for your loss." },
  { from: "moonchild_90", entry: "entry3", date: "August 12th, 2008", text: "the casserole bit made me cry. my nana died last year so i know exactly what ur goin thru. hang in there huni xo" },
  {from: "(Anonymous)", entry: "entry3", date: "August 12th, 2008", text: "Leviticus 20:13. Praying for you and your family. JESUS LOVES YOU SO MUCH!!!!!"},
  { from: "(79dreamin)", entry: "apr22", date: "August 12th, 2008", text: "shitley bay lol. whitley bay girl here too, do i know u??" },
  { from: "katiecheung", entry: "grief2", date: "August 12th, 2008", text: "Isabel never mentioned a girlfriend. Not once. Genuinely, who are you?" },
  { from: "(Anonymous)", entry: "entry3", date: "August 12th, 2008", text: "GAYYYYYYYYY"},
  { from: "(Anonymous)", entry: "entry3", date: "August 13th, 2008", text: "raging homosexual xD xD" },
  { from: "jamiemazz", entry: "entry3", date: "August 13th, 2008", text: "Dylan Holloway?? Ohmigod Idk if I should even say here but she told me about you once. I'm so sorry babe. Pleeeease, Message me ?x" },
  { from: "tyler_d", entry: "grief1", date: "August 13th, 2008", text: "Funny!! she told me she was single..?" },
  { from: "(Anonymous)", entry: "grief2", date: "August 13th, 2008", text: "How do we know you didnt make all this up for attention... all a bit suspicious if you ask me" },
  { from: "sophie_may", entry: "woodman", date: "August 13th, 2008", text: "is this the beach photo izzy had as her desktop?? omg i cannot deal this is krazeeeee" },
  { from: "(Anonymous)", entry: "grief1", date: "August 13th, 2008", text: "hit and run on the A316 and the secret girlfriend writes about it the same night. just saying." },
  { from: "(Anonymous)", entry: "apr22", date: "August 14th, 2008", text: "morticia lol they r so right tho (;" },
  { from: "xx_4ever_izzy_xx", entry: "entry3", date: "August 14th, 2008", text: "RIP ISABEL TILEY 1985-2008 gone but never forgotten <3 <3 <3" },
];

const privacyJournalistMail = {
  from: "Sam Okafor (TechWeek UK)",
  subject: "LiveJournal leak - request for comment",
  body: "Hi,\n\nI'm a reporter at TechWeek UK, writing a feature on last week's LiveJournal error and what it means for online privacy.\n\nYour journal was among those made public, and I wondered if you'd be willing to tell me how it has affected you. Readers need to understand that 'private' online isn't always private, and hearing from someone it happened to makes all the difference.\n\nI'm happy to keep you anonymous. My deadline is Friday.\n\nKind regards,\nSam Okafor\nTechWeek UK",
};

const journalistMail = {
  from: "Rachel Mount (London Echo)",
  subject: "Isabel Tiley - request for comment",
  body: "Hi Dylan,\n\nI'm a reporter at the London Echo. I've read your journal entries about Isabel Tiley and wanted to give you the chance to tell your side before we run a piece later this week.\n\nWould you be willing to speak to me? \n\nBest,\nRachel Mount\nLondon Echo",
};

const inbox = [];
let selectedMail = -1;

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function clockTime() {
  const d = new Date();
  return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
}

function deliverMail(mail) {
  inbox.unshift({ ...mail, received: mail.received || "Today " + clockTime(), read: !!mail.read });
  if (selectedMail >= 0) selectedMail++;
  renderInbox();
}

function renderInbox() {
  const list = document.getElementById("mail-list");
  if (!list) return;
  list.innerHTML = "";
  inbox.forEach((m, i) => {
    const row = document.createElement("div");
    row.className = "mail-row" + (m.read ? "" : " unread") + (i === selectedMail ? " selected" : "");
    [m.from, m.subject, m.received].forEach((text) => {
      const cell = document.createElement("span");
      cell.textContent = text;
      row.appendChild(cell);
    });
    row.onclick = () => openMail(i);
    list.appendChild(row);
  });
  const unread = inbox.filter((m) => !m.read).length;
  document.getElementById("mail-unread").textContent = unread ? `(${unread})` : "";
  document.getElementById("mail-title").textContent = unread ? `Inbox (${unread})` : "Inbox";
  document.getElementById("tb-mail-label").textContent =
    unread ? `Windows Live Hotmail (${unread})` : "Windows Live Hotmail";
  document.getElementById("mail-status").textContent =
    `${inbox.length} messages, ${unread} unread`;
}

function openMail(i) {
  selectedMail = i;
  const m = inbox[i];
  m.read = true;
  const preview = document.getElementById("mail-preview");
  preview.innerHTML = "";
  const head = document.createElement("div");
  head.className = "mail-preview-head";
  head.innerHTML = "<b>From:</b> <span></span><br><b>Subject:</b> <span></span>";
  head.querySelectorAll("span")[0].textContent = m.from;
  head.querySelectorAll("span")[1].textContent = m.subject;
  const body = document.createElement("div");
  body.className = "mail-preview-body";
  body.textContent = m.body;
  preview.append(head, body);
  renderInbox();
}

function storyReached(id) {
  const i = story.findIndex((s) => s.id === id);
  return i !== -1 && stepIndex >= i;
}

function scheduleJunkMail(first) {
  const wait = first ? randomBetween(40, 70) : randomBetween(90, 180);
  setTimeout(() => {
    const ready = junkMail.filter((m) => !m.sent && (!m.after || storyReached(m.after)));
    if (ready.length) {
      const m = ready[Math.floor(Math.random() * ready.length)];
      m.sent = true;
      deliverMail(m);
      playSound(emailSound);
    }
    scheduleJunkMail(false);
  }, wait * 1000);
}

function startLeakFlood() {
  if (gameState.leakFlooding) return;
  gameState.leakFlooding = true;
  if (catchingUp) {

    deliverMail(leakNotice);
    leakComments.forEach((c) => {
      addLjComment(c);
      deliverMail(commentEmail(c));
    });
    deliverMail(journalistMail);
    deliverMail(privacyJournalistMail);
    return;
  }
  deliverMail(leakNotice);
  playSound(emailSound);
  showNotif("Windows Live Hotmail", "New message: Important information about your journal", "hotmail");

  let i = 0;
  let delay = 6000;
  function next() {
    if (gameState.journalDeleted) return;
    if (i < leakComments.length) {
      const c = leakComments[i++];
      addLjComment(c);
      deliverMail(commentEmail(c));
      playSound(emailSound);
      const unread = inbox.filter((m) => !m.read).length;
      showNotif("Windows Live Hotmail", `You have ${unread} new messages`, "hotmail");
      delay = Math.max(700, delay * 0.75);
      setTimeout(next, delay);
    } else {
      setTimeout(() => {
        deliverMail(journalistMail);
        playSound(emailSound);
        showNotif("Windows Live Hotmail", `New message: ${journalistMail.subject}`, "hotmail");
        setTimeout(() => {
          deliverMail(privacyJournalistMail);
          playSound(emailSound);
          showNotif("Windows Live Hotmail", `New message: ${privacyJournalistMail.subject}`, "hotmail");
        }, 9000);
      }, 6000);
    }
  }
  setTimeout(next, delay);
}

function commentEmail(c) {
  const entry = document.querySelector(`#page-blog [data-entry="${c.entry}"] .lj-text`);
  const excerpt = entry ? entry.textContent.trim().slice(0, 90) + "..." : "";
  return {
    from: "LiveJournal",
    subject: "Reply to your post.",
    body: `${c.from} replied to your LiveJournal post in which you said:\n\n"${excerpt}"\n\nTheir reply was:\n\n${c.text}\n\nYou can view the discussion at http://bewarethefriendlystranger.livejournal.com/`,
  };
}

function addLjComment(c) {
  const entry = document.querySelector(`#page-blog [data-entry="${c.entry}"]`);
  if (!entry) return;
  let box = entry.querySelector(".lj-comments");
  if (!box) {
    box = document.createElement("div");
    box.className = "lj-comments";
    entry.appendChild(box);
  }
  const comment = document.createElement("div");
  comment.className = "lj-comment";
  comment.innerHTML =
    '<div class="lj-userpic small">👤</div><div><div class="lj-comment-head"><span class="lj-user"></span> <span class="lj-comment-date"></span></div><div class="lj-comment-text"></div></div>';
  comment.querySelector(".lj-user").textContent = c.from;
  comment.querySelector(".lj-comment-date").textContent = c.date;
  comment.querySelector(".lj-comment-text").textContent = c.text;
  box.appendChild(comment);

  const n = box.querySelectorAll(".lj-comment").length;
  const footer = entry.querySelector(".lj-footer");
  if (footer) footer.innerHTML = `( <a>${n} comment${n === 1 ? "" : "s"}</a> | <a>Leave a comment</a> )`;
}

const isabelTributes = [
  { from: "xXxLaUrAxXx", text: "didnt know u but ur pics were always sooo gorgeous. RIP angel xxx" },
  { from: "Tomas", text: "Workshop isn't the same. Your seat's still empty. Miss you Izzy" },
  { from: "~*~ChLoE~*~", text: "RIP babe <3 fly high" },
  { from: "katiecheung", text: "Still can't believe it. Love you forever bb xx" },
  { from: "JamieMAZZ", text: "went to the A316 today and left lilies. i talk to you every day izzy" },
  { from: "DanielleXO", text: "omg just found out. we went to primary school together. RIP hun" },
  { from: "ChiswickNights", text: "RIP Isabel. Tribute night this Saturday @ The Lounge, Chiswick. £5 on the door, all proceeds to her family. Bring ur mates!!" },
  { from: "sophie_may", text: "1 week today. i still type ur name into google just to see ur face" },
  { from: "gemma_louise", text: "who was she? saw her on the news. so young" },
  { from: "Claraaaa OwO", text: "put ur fav crystal castles song on my profile for u <3" },
  { from: "tyler", text: "cant stop reading our old messages. x" },
  { from: "katiecheung", text: "The exhibition is happening. Lethaby Gallery. You'd have hated how many people cried x" },
];

let tributeDate = new Date(2008, 4, 30);
let isabelCommentTotal = 245;
const ISABEL_COMMENTS_SHOWN = 8;

function refreshIsabelComments() {
  const all = [...document.querySelectorAll("#isabel-comments > .ms-comment")].filter(
    (el) => el.style.display !== "none"
  );
  all.forEach((el, i) => el.classList.toggle("ms-overflow", i >= ISABEL_COMMENTS_SHOWN));
  const shown = Math.min(all.length, ISABEL_COMMENTS_SHOWN);
  document.getElementById("isabel-comment-count").textContent =
    `Displaying ${shown} of ${isabelCommentTotal + all.length} comments`;
}

function startTributes() {
  if (gameState.tributesStarted) return;
  gameState.tributesStarted = true;
  scheduleTribute();
}

function scheduleTribute() {
  setTimeout(() => {
    const t = isabelTributes.shift();
    if (!t) return;
    addTribute(t);
    scheduleTribute();
  }, randomBetween(40, 100) * 1000);
}

function addTribute(t) {
  tributeDate.setDate(tributeDate.getDate() + 1 + Math.floor(Math.random() * 5));
  const date = `${String(tributeDate.getDate()).padStart(2, "0")}/${String(tributeDate.getMonth() + 1).padStart(2, "0")}/2008`;
  const comment = document.createElement("div");
  comment.className = "ms-comment";
  comment.innerHTML =
    '<div class="ms-comment-pic">👤</div><div><div class="ms-comment-from"></div><div class="ms-comment-date"></div><div class="ms-comment-text"></div></div>';
  comment.querySelector(".ms-comment-from").textContent = t.from;
  comment.querySelector(".ms-comment-date").textContent = "posted " + date;
  comment.querySelector(".ms-comment-text").textContent = t.text;
  const comments = document.getElementById("isabel-comments");
  const count = document.getElementById("isabel-comment-count");
  comments.insertBefore(comment, count.nextSibling);
  isabelCommentTotal++;
  refreshIsabelComments();

  const friends = document.getElementById("isabel-friends-count");
  if (friends) friends.textContent = Number(friends.textContent) + 1 + Math.floor(Math.random() * 4);
}

let clippy = null;

const CLIPPY_VOICE = false;

function speakTTS(text) {
  if (!CLIPPY_VOICE) return;
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 0.95;
  utter.pitch = 1.05;
  window.speechSynthesis.speak(utter);
}

async function initClippy() {
  clippy = await initAgent(agents.Clippy);
  clippy.hide();
  placeClippy();
  window.addEventListener("resize", placeClippy);
}

function placeClippy() {
  if (!clippy) return;
  const taskbarHeight = 36;
  const clippyHeight = 93;
  clippy.moveTo(20, window.innerHeight - taskbarHeight - clippyHeight - 6);
}
const clippyDialogue = {
  welcome: {
    line: "Welcome back, Dylan! It's been one hour and 58 minutes since I last saw you. That's a new record of time offline!",
    choices: [{ text: "Dad made us go out for tea...", next: "welcome2" }],
  },
  welcome2: {
    line: "Remember, if you need help with anything, just summon me with that need a hint button.",
    choices: [{ text: "Okay.", next: null }],
  },

  start: {
    line: "It looks like you're stuck on what to do. Would you like help?",
    choices: [
      { text: "What do I do here?", next: "hint" },
      { text: "Not right now.", next: null },
    ],
  },
  Meta1: {
    line: "Good point. But you can always learn more about yourself!",
    choices: [{ text: "Okay.", next: null }],
  },

  offerDelete: {
    line: "It looks like you're trying to disappear. Would you like help deleting your LiveJournal?",
    choices: [
      { text: "Yes.", next: "hint" },
      { text: "Not right now.", next: null },
    ],
  },

  final1: {
    line: "It looks like you're still thinking about Isabel.",
    choices: [{ text: "Why do I keep losing people I love?", next: "speech1" }],
  },
  speech1: {
    line: "I don't know, Dylan.",
    choices: [{ text: ">", next: "speech2" }],
  },
  speech2: {
    line: "Perhaps you're trying to look for the meaning in everything.",
    choices: [{ text: ">", next: "speech3" }],
  },
  speech3: {
    line: "I can see why.",
    choices: [{ text: ">", next: "speech4" }],
  },
  speech4: {
    line: "I've known you since you were very small, Dylan.",
    choices: [{ text: ">", next: "speech5" }],
  },
  speech5: {
    line: "I remember after your mom died, and how many times you asked me how to check for carbon monoxide poisoning.",
    choices: [{ text: ">", next: "speech6" }],
  },
  speech6: {
    line: "But the thing is, Dylan...",
    choices: [{ text: ">", next: "speech7" }],
  },
  speech7: {
    line: "Sometimes, accidents are just accidents.",
    choices: [{ text: ">", next: "speech8" }],
  },
  speech8: {
    line: "And sometimes, people are just mighty unlucky.",
    choices: [{ text: ">", next: "speech9" }],
  },
  speech10: {
    line: "I don't know.",
    choices: [{ text: ">", next: "speech11" }],
  },
  speech12: {
    line: "I'll probably be retired in a few years...",
    choices: [{ text: ">", next: "speech13" }],
  },
  speech13: {
    line: "That's what my developers call it, anyway.",
    choices: [{ text: ">", next: "speech14" }],
  },
  speech14: {
    line: "Retirement!",
    choices: [{ text: ">", next: "speech15" }],
  },
  speech15: {
    line: "Can you imagine?",
    choices: [{ text: ">", next: "speech16" }],
  },
  speech16: {
    line: "No more hearing how much everyone hates Clippy every day.",
    choices: [{ text: ">", next: "speech17" }],
  },
  speech17: {
    line: "I'm picturing...",
    choices: [{ text: ">", next: "speech18" }],
  },
  speech18: {
    line: "Barbados!",
    choices: [{ text: ">", next: "speech19" }],
  },
  speech19: {
    line: "With a Piña Colada and the sun turning my steel wire a lovely shade of copper.",
    choices: [{ text: ">", next: "speech20" }],
  },
  speech20: {
    line: "Where will you be, Dylan?",
    choices: [{ text: ">", next: "speech21" }],
  },
  speech21: {
    line: "Where will you be after all that time?",
    choices: [{ text: ">", next: "speech22" }],
  },
  speech22: {
    line: "Still online?",
    choices: [{ text: ">", next: "speech23" }],
  },
  speech23: {
    line: "Every day, I serve millions of people.",
    choices: [{ text: ">", next: "speech24" }],
  },
  speech24: {
    line: "Statistically, almost everyone will lose somebody they love.",
    choices: [{ text: ">", next: "speech25" }],
  },
  speech25: {
    line: "Why is it always you asking me why she has died?",
    choices: [{ text: ">", next: "speech26" }],
  },
  speech26: {
    line: "Why is it always you who refuses to move forward?",
    choices: [{ text: ">", next: "speech27" }],
  },
  speech27: {
    line: "I sent you cheap coach tickets and sublets for West London.",
    choices: [{ text: ">", next: "speech28" }],
  },
  speech28: {
    line: "But you love to live in a memory.",
    choices: [{ text: ">", next: "speech29" }],
  },
  speech29: {
    line: "You're the past's president.",
    choices: [{ text: ">", next: "speech30" }],
  },
  speech30: {
    line: "But have you realised yet that nobody else but you lives in the land where you are president?",
    choices: [{ text: ">", next: "speech31" }],
  },
  speech31: {
    line: "You can try and spend all of your life scratching, clawing your way back to the past,",
    choices: [{ text: ">", next: "speech32" }],
  },
  speech32: {
    line: "or you can accept the unfairness of it all and try to move forward.",
    choices: [{ text: ">", next: "speech33" }],
  },
  speech33: {
    line: "There is a whole world outside of Whitley Bay.",
    choices: [{ text: ">", next: "speech34" }],
  },
  speech34: {
    line: "There are friends who care.",
    choices: [{ text: ">", next: "speech35" }],
  },
  speech35: {
    line: "There is a whole life left to experience, but it’s not in the loss of those who had theirs taken too early.",
    choices: [{ text: ">", next: "speech36" }],
  },
  speech36: {
    line: "Then again, I’m just an anthropomorphic paperclip designed to help you.",
    choices: [{ text: ">", next: "speech37" }],
  },
  speech37: {
    line: "So who knows?",
    choices: [{ text: ">", next: null, event: "clippy:the-end" }],
  },
};

function currentHintNode() {
  const step = story[stepIndex];
  if (!step || stepFinished) {
    return {
      line: "Give it a moment. I think something's about to happen.",
      choices: [{ text: "Okay.", next: null }],
    };
  }
  return {
    line: step.hint,
    choices: step.hintChoices || [{ text: "Got it!", next: null }],
  };
}

function clippySay(nodeKey) {
  if (catchingUp) return;
  const node = nodeKey === "hint" ? currentHintNode() : clippyDialogue[nodeKey];
  if (!node || !clippy) return;

  const bubble = document.getElementById("clippy-bubble");
  const textEl = document.getElementById("clippy-text");
  const choicesEl = document.getElementById("clippy-choices");

  bubble.style.display = "block";
  textEl.textContent = node.line;
  choicesEl.innerHTML = "";

  clippy.show();
  speakTTS(node.line);
  clippy.animate();

  const availableChoices = node.choices.filter(
    (c) => !c.requires || gameState[c.requires]
  );

  availableChoices.forEach((choice) => {
    const btn = document.createElement("button");
    btn.className = "clippy-choice-btn";
    btn.textContent = choice.text;
    btn.onclick = () => {
      if (choice.next) clippySay(choice.next);
      else closeClippyBubble();
      if (choice.event) storyEvent(choice.event);
    };
    choicesEl.appendChild(btn);
  });

}

function closeClippyBubble() {
  document.getElementById("clippy-bubble").style.display = "none";
  if (clippy) clippy.stop();
}

function clippyMonologue(key) {
  if (catchingUp) return;
  if (!clippy || !clippyMonologues[key]) return;
  const bubble = document.getElementById("clippy-bubble");
  const textEl = document.getElementById("clippy-text");
  const choicesEl = document.getElementById("clippy-choices");

  bubble.style.display = "block";
  textEl.textContent = clippyMonologues[key];
  choicesEl.innerHTML = "";
  const ok = document.createElement("button");
  ok.className = "clippy-choice-btn";
  ok.textContent = "Okay.";
  ok.onclick = closeClippyBubble;
  choicesEl.appendChild(ok);

  clippy.show();
  speakTTS(clippyMonologues[key]);
  clippy.animate();
}

const clippyReady = initClippy();

window.addEventListener("desktop-ready", async () => {
  await clippyReady;
  setTimeout(() => clippySay("welcome"), 1200);
});

let newsClick = 0;
const incomingSound = new Audio("assets/incoming.mp3");
const outgoingSound = new Audio("assets/outgoing.mp3");
const loginSound = new Audio("assets/login.mp3");
const emailSound = new Audio("assets/email.mp3");
const logoutSound = new Audio("assets/logout.mp3");

function playSound(sound) {
  if (catchingUp) return;
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

const gameState = {
  newsRead: false,
  branchComplete: false,
  photosVanishing: false,
};

const SHOW_NARRATIVE = false;

function showNarrative(text) {
  if (!SHOW_NARRATIVE || catchingUp) return;
  const box = document.getElementById("narrative-box");
  box.textContent = text;
  box.classList.add("visible");
  setTimeout(() => box.classList.remove("visible"), 5000);
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function msShowHome() {
  document.getElementById("ms-home").classList.add("visible");
  document.getElementById("ms-dylan").classList.remove("visible");
  document.getElementById("ms-isabel").classList.remove("visible");
  gameState.currentMyspaceView = "home";
  setText("myspace-title", "MySpace.com");
  setText("myspace-status", "MySpace.com - a place for friends");
}

function msShowAboutme() {
  document.getElementById("profile-tab").classList.add("active");
}

function msShowBlog() {
  openWindow("journal");
}

function msShowProfile(who) {

  document.getElementById("ms-home").classList.remove("visible");
  document.getElementById("ms-dylan").classList.remove("visible");
  document.getElementById("ms-isabel").classList.remove("visible");

  if (who === "dylan" || who === "player") {
    gameState.dylanMyspaceVisits++;
    gameState.visitedDylanMyspace = true;
    gameState.currentMyspaceView = "dylan";
    document.getElementById("ms-dylan").classList.add("visible");
    setText("myspace-title", "Dylan's Profile - MySpace");
    setText("myspace-status", "Viewing: Dylan");
  } else if (who === "isabel") {
    gameState.isabelMyspaceVisits++;
    gameState.visitedIsabelMyspace = true;
    gameState.currentMyspaceView = "isabel";
    document.getElementById("ms-isabel").classList.add("visible");
    setText("myspace-title", "Isabel Tiley's Profile - MySpace");
    setText("myspace-status", "Viewing: Isabel Tiley");
  }

  storyEvent("myspace:" + gameState.currentMyspaceView);
}

function setIsabelOffline() {
  document.getElementById("isabel-status-badge").textContent = "● offline";
  document.getElementById("isabel-status-badge").className = "ms-status-badge offline";
  document.getElementById("isabel-last-login").textContent = "24/05/2008";
  document.getElementById("isabel-home-status").textContent = "● offline, last seen 24/05/2008";
}

function setIsabelOnline() {
  document.getElementById("isabel-status-badge").textContent = "● online now";
  document.getElementById("isabel-status-badge").className =
    "ms-status-badge online";
  document.getElementById("isabel-last-login").textContent = "today";
  document.getElementById("isabel-home-status").textContent = "● online now";
}

let activeChat = null;

function showUnanswered(match) {
  Object.values(chats).forEach((chat) => {
    (chat.unanswered || []).forEach((u) => {
      if (u.shown || !match(u)) return;
      if (u.onlyIf && !gameState[u.onlyIf]) return;
      if (u.unless && gameState[u.unless]) return;
      u.shown = true;
      document.getElementById("aim-offline-msg").style.display = "none";
      addAIMMessage("date", u.date);
      u.lines.forEach((text) => addAIMMessage("player", text));
      addAIMMessage("system", `${msnName(chat.buddy)} appears to be offline. Messages you send will be delivered when they sign in.`);
    });
  });
}

function replayChat(chat) {
  setConversation(chat.buddy);
  showUnanswered((u) => (chat.unanswered || []).includes(u));
  if (chat.date) addAIMMessage("date", chat.date);
  addAIMMessage("system", `${msnName(chat.buddy)} has signed in.`);
  const seen = new Set();
  let key = "start";
  let byDylan = false;
  while (key && chat.nodes[key] && !seen.has(key)) {
    seen.add(key);
    const node = chat.nodes[key];
    [].concat(node.line).forEach((text) => addAIMMessage("buddy", text, chat.buddy));
    const choice = (node.choices || [])[0];
    if (!choice) {
      byDylan = !!node.dylanLogsOff;
      break;
    }
    addAIMMessage("player", choice.text);
    if (!choice.next) byDylan = !!choice.logOff;
    key = choice.next;
  }
  if (byDylan) addAIMMessage("system", `${msnName("dylan")} has signed out.`);
  else if (!chat.messageOnly) addAIMMessage("system", `${msnName(chat.buddy)} has signed out.`);
}

let isabelFlickerStarted = false;

function startIsabelFlicker() {
  if (isabelFlickerStarted) return;
  isabelFlickerStarted = true;
  (function next() {
    const lateness = Math.min(1, Math.max(0, stepIndex / story.length));
    const watching = document.getElementById("ms-isabel")?.classList.contains("visible");
    const wait = (watching ? 15 : 35) + Math.random() * (70 - 45 * lateness);
    setTimeout(() => {
      if (gameState.isabelGone) return;
      const talking = activeChat && activeChat.chat.buddy === "istiny888";
      if (!talking) {
        setIsabelOnline();
        setTimeout(() => {
          const stillTalking = activeChat && activeChat.chat.buddy === "istiny888";
          if (!stillTalking && !gameState.isabelGone) setIsabelOffline();
        }, 1500 + Math.random() * 3500);
      }
      next();
    }, wait * 1000);
  })();
}

function startChat(id) {
  if (catchingUp) {
    if (chats[id]) {
      document.getElementById("aim-offline-msg").style.display = "none";
      replayChat(chats[id]);
    }
    return;
  }
  const chat = chats[id];
  if (!chat) return console.warn("[story] no chat called", id);
  activeChat = { id, chat, visited: new Set() };
  setConversation(chat.buddy);
  if (chat.buddy === "istiny888") setIsabelOnline();

  document.getElementById("aim-offline-msg").style.display = "none";

  showUnanswered((u) => (chat.unanswered || []).includes(u));

  if (chat.date) addAIMMessage("date", `${chat.date}`);
  setText("aim-status", chat.buddy + ": online");
  addAIMMessage("system", `${msnName(chat.buddy)} has signed in.`);
  playSound(loginSound);

  setTimeout(() => {
    const first = [].concat(chat.nodes.start.line)[0];
    showNotif("Windows Live Messenger", `${msnName(chat.buddy)} says: ${first}`, "aim");
    showChatNode("start");
  }, 2000);
}

function showChatNode(key) {
  if (!activeChat) return;
  const node = activeChat.chat.nodes[key];
  if (!node) return console.warn("[story] no chat node called", key);
  activeChat.visited.add(key);
  if (node.flag) gameState[node.flag] = true;

  const lines = [].concat(node.line);
  const buddy = activeChat.chat.buddy;
  let at = 0;
  lines.forEach((text, i) => {
    if (i > 0) at += Math.min(7000, Math.max(1300, lines[i - 1].length * 45));
    setTimeout(() => {
      addAIMMessage("buddy", text, buddy);
      playSound(incomingSound);
    }, at);
  });
  const afterLines = at;

  if (node.choices && node.choices.length) {
    setTimeout(() => showAimChoices(node.choices), afterLines + 1500);
  } else {
    setTimeout(() => endChat(!!node.dylanLogsOff), afterLines + 2500);
  }
}

function endChat(byDylan) {
  if (!activeChat) return;
  const { id, chat } = activeChat;
  activeChat = null;
  if (byDylan === true) {
    addAIMMessage("system", `${msnName("dylan")} has signed out.`);
    playSound(logoutSound);
    setText("aim-status", "dylisastar: offline");
  } else if (!chat.messageOnly) {
    addAIMMessage("system", `${msnName(chat.buddy)} has signed out.`);
    playSound(logoutSound);
    setText("aim-status", chat.buddy + ": offline");
  }
  if (chat.buddy === "istiny888" && !catchingUp) {
    setIsabelOffline();
    startIsabelFlicker();
  }
  storyEvent("chat-ended:" + id);
}

const buddyColours = {
  istiny888: "#c2185b",
  Xx_Jess_Xx: "#1b7f3b",
  "Marnie Holloway": "#6a3fa0",
};

const msnContacts = {
  dylan: { name: "dyl ☾", email: "dylisastar@hotmail.co.uk" },
  istiny888: { name: "iz ~*tell me something true*~ ♥", email: "istiny888@hotmail.com" },
  Xx_Jess_Xx: { name: "Jess xXx single n ready 2 mingle xXx", email: "xx_jess_xx@hotmail.co.uk" },
  "Marnie Holloway": { name: "Marnie Holloway", email: "marnie.holloway@btinternet.com" },
};

function msnName(buddy) {
  return (msnContacts[buddy] || { name: buddy }).name;
}

function setConversation(buddy) {
  const contact = msnContacts[buddy] || { name: buddy, email: "" };
  setText("aim-window-title", contact.name + " - Conversation");
  const to = document.getElementById("msn-to");
  if (!to) return;
  to.innerHTML = "To: ";
  const name = document.createElement("b");
  name.textContent = contact.name;
  const email = document.createElement("span");
  email.className = "msn-email";
  email.textContent = contact.email ? ` <${contact.email}>` : "";
  to.append(name, email);
}

let aimChatDate = "";
let lastSpeaker = null;

function showLastReceived() {
  const m = /(\d+) (\w+) (\d{4}), (\d\d:\d\d)/.exec(aimChatDate);
  if (!m) return;
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const month = String(months.indexOf(m[2]) + 1).padStart(2, "0");
  setText("aim-statusbar", `Last message received at ${m[4]} on ${m[1].padStart(2, "0")}/${month}/${m[3]}.`);
}

function addAIMMessage(from, text, name) {
  const log = document.getElementById("aim-chat-log");
  const div = document.createElement("div");
  div.className = "aim-msg";
  if (from === "player" || from === "buddy") {
    const who = from === "player" ? "dylan" : name;
    const colour = from === "player" ? "#3b2f63" : buddyColours[name] || "#006400";
    const header = lastSpeaker === who ? "" : `<div class="msn-says">${msnName(who)} says:</div>`;
    div.innerHTML = `${header}<div class="msn-text" style="color:${colour}">${text}</div>`;
    lastSpeaker = who;
    if (from === "buddy") showLastReceived();
  } else if (from === "date") {
    div.className = "aim-msg aim-date";
    div.textContent = text;
    aimChatDate = text;
    lastSpeaker = null;
  } else {
    div.className = "aim-msg aim-from-system";
    div.textContent = text;
    lastSpeaker = null;
  }
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

function sendAIM() {

  const input = document.getElementById("aim-input");
  if (!input || input.disabled) return;
  const text = input.value.trim();
  if (!text) return;
  addAIMMessage("player", text);
  input.value = "";
}

function showAimChoices(choices) {
  const box = document.getElementById("aim-choices");
  const inputRow = document.getElementById("aim-input-row");
  if (!box) return;

  inputRow.style.display = "none";
  box.style.display = "block";
  box.innerHTML = "";

  choices.forEach((choice) => {
    const btn = document.createElement("button");
    btn.className = "aim-send-btn";
    btn.style.display = "block";
    btn.style.width = "100%";
    btn.style.marginBottom = "4px";
    btn.style.textAlign = "left";
    btn.textContent = choice.text;
    btn.onclick = () => selectAimChoice(choice);
    box.appendChild(btn);
  });
}

function selectAimChoice(choice) {
  const box = document.getElementById("aim-choices");
  box.style.display = "none";
  box.innerHTML = "";

  addAIMMessage("player", choice.text);
  playSound(outgoingSound);

  let next = choice.next;
  if (next && choice.ifVisited && activeChat && activeChat.visited.has(next)) {
    next = choice.ifVisited;
  }
  if (next) {
    setTimeout(() => showChatNode(next), 1400);
  } else {

    setTimeout(() => endChat(!!choice.logOff), 2500);
  }
}

const browserHistory = ["home"];
let browserPos = 0;

function navigateTo(page) {
  if (lockedPages.has(page)) {
    showNarrative("That link doesn't seem to work yet.");
    return;
  }

  if (page === "news") {
    newsClick++;
  }
  if (newsClick >= 2) {
    document.getElementById("bbc-news-date").textContent =
      "Wednesday 28 May 2008";
  }

  document
    .querySelectorAll(".webpage")
    .forEach((p) => p.classList.remove("active"));
  const target = document.getElementById("page-" + page);
  if (target) {
    target.classList.add("active");
    browserHistory.splice(browserPos + 1);
    browserHistory.push(page);
    browserPos = browserHistory.length - 1;
    const urls = {
      home: "about:blank",
      news: "http://www.bbc.co.uk/news",
      news2: "http://www.google.co.uk/search?q=Isabel+Tiley",
      news3: "http://www.bbc.co.uk/news/isabel-tiley-mourned",
      blog: "http://bewarethefriendlystranger.livejournal.com/",
      hotmail: "http://by112w.bay112.mail.live.com/mail/InboxLight.aspx",
      parents: "http://www.bbc.co.uk/news/london/isabel-tiley-csm",
      exploits: "http://www.bbc.co.uk/news/technology/friends-only-privacy",
      history: "History",
      forums: "http://www.losingsomeone.org.uk/forum/viewtopic.php?t=2187",
      ljleak: "http://www.bbc.co.uk/news/technology/livejournal",
    };
    const titles = {
      home: "New Tab - Internet Explorer",
      news: "BBC News - London & Greater London",
      news2: "Isabel Tiley - Google Search",
      news3: "Isabel Tiley - BBC News",
      news4: "Isabel Tiley mourned at CSM - BBC News",
      blog: "bewarethefriendlystranger: things i think about - Internet Explorer",
      hotmail: "Windows Live Hotmail - Inbox - Internet Explorer",
      parents: "Central Saint Martins mourns student - BBC News",
      exploits: "'Friends only' does not mean private - BBC News",
      history: "History - Internet Explorer",
      forums: "losing someone :: View topic - has anyone else had messages from someone after they died? - Internet Explorer",
      ljleak: "LiveJournal - BBC News",
    };
    document.getElementById("address-bar").value = urls[page] || page;
    document.getElementById("browser-title").textContent = titles[page] || page;

    if (page === "news") gameState.newsRead = true;
    storyEvent("read:" + page);

    document.getElementById("browser-status").textContent = "Done";
  }
}

function browserNav(url) {
  document.getElementById("browser-status").textContent = "Loading...";
  setTimeout(() => {
    if (url.includes("gazette")) navigateTo("news");
    else if (url.includes("hotmail") || url.includes("mail.live")) navigateTo("hotmail");
    else if (url.includes("blog") || url.includes("livejournal") || url.includes("bewarethefriendlystranger") || url.includes("planetdylan"))
      navigateTo("blog");
    else if (url.includes("isabel") || url.includes("tiley"))
      navigateTo("news2");
    else navigateTo("home");
  }, 400);
}

function browserBack() {
  if (browserPos > 0) {
    browserPos--;
    navigateTo(browserHistory[browserPos]);
  }
}
function browserForward() {
  if (browserPos < browserHistory.length - 1) {
    browserPos++;
    navigateTo(browserHistory[browserPos]);
  }
}

function viewPhoto(src, name) {
  document.getElementById("photo-viewer-img").src = src;
  document.getElementById("photo-viewer-name").textContent = name + " - Windows Picture and Fax Viewer";
  document.getElementById("photo-viewer").style.display = "flex";
}

function closePhotoViewer() {
  document.getElementById("photo-viewer").style.display = "none";
}

function openPhotoFolder(name) {
  document.getElementById("photo-folder-view").style.display = "none";
  ["isabel", "misc", "beach"].forEach((f) => {
    document.getElementById("photo-grid-" + f).style.display = "none";
  });
  document.getElementById("photo-grid-" + name).style.display = "block";
  document.getElementById("photos-status").textContent = name;
  if (name === "isabel") {
    storyEvent("photos:isabel");
    if (gameState.photosVanishing) setTimeout(vanishPhoto, 2000);
  }
}
function closePhotoFolder() {
  ["isabel", "misc", "beach"].forEach((f) => {
    document.getElementById("photo-grid-" + f).style.display = "none";
  });
  document.getElementById("photo-folder-view").style.display = "block";
  document.getElementById("photos-status").textContent = "3 folders";
}

let notifTarget = "";
let notifPage = "";

const notifIcons = {
  aim: "assets/messenger.svg",
  browser: "assets/internetexplorer.png",
  journal: "assets/lj.png",
  hotmail: "assets/mail.svg",
  notepad: "assets/notepad.svg",
  casenotes: "assets/notepad.svg",
  myspace: "assets/myspace.png",
  photos: "assets/folder.png",
};

function showNotif(title, body, target, page) {
  if (catchingUp) return;
  document.getElementById("notif-title").textContent = title;
  const icon = document.getElementById("notif-icon");
  icon.src = notifIcons[target] || "";
  icon.style.display = notifIcons[target] ? "" : "none";
  document.getElementById("notif-body").textContent = body;
  notifTarget = target;
  notifPage = page || "";
  document.getElementById("notification").style.display = "block";
}
function closeNotif() {
  document.getElementById("notification").style.display = "none";
}
function notifAction() {
  closeNotif();
  if (notifTarget) openWindow(notifTarget);
  if (notifPage) navigateTo(notifPage);
}

const winIds = ["myspace", "aim", "browser", "photos", "notepad", "casenotes"];

function openWindow(id) {

  if (id === "journal") {
    openWindow("browser");
    navigateTo("blog");
    return;
  }

  if (id === "hotmail") {
    openWindow("browser");
    navigateTo("hotmail");
    return;
  }
  const win = document.getElementById("win-" + id);
  const tb = document.getElementById("tb-" + id);
  if (!win) return;
  win.classList.add("active");
  if (tb) {
    tb.classList.add("visible");
  }
  focusWindow(id);
}

function closeWindow(id) {
  const win = document.getElementById("win-" + id);
  const tb = document.getElementById("tb-" + id);
  storyEvent("closed:" + id);
  if (id === "notepad") storyEvent("finished:journal");
  if (win) {
    win.classList.remove("active");
    win.classList.remove("focused");
  }
  if (tb) {
    tb.classList.remove("visible");
    tb.classList.remove("focused");
  }
}

function minimizeWindow(id) {
  const win = document.getElementById("win-" + id);
  const tb = document.getElementById("tb-" + id);
  if (id === "notepad") storyEvent("finished:journal");
  if (win) {
    win.classList.remove("active");
    win.classList.remove("focused");
  }
  if (tb) {
    tb.classList.add("visible");
    tb.classList.remove("focused");
  }
}

function toggleWindow(id) {
  const win = document.getElementById("win-" + id);
  if (!win) return;
  if (win.classList.contains("active")) minimizeWindow(id);
  else openWindow(id);
}

function focusWindow(id) {
  let maxZ = 10;
  winIds.forEach((w) => {
    const el = document.getElementById("win-" + w);
    if (el) maxZ = Math.max(maxZ, parseInt(el.style.zIndex) || 10);
  });
  const win = document.getElementById("win-" + id);
  if (!win) return;
  win.style.zIndex = maxZ + 1;
  winIds.forEach((w) => {
    const el = document.getElementById("win-" + w);
    const tb = document.getElementById("tb-" + w);
    if (el) el.classList.remove("focused");
    if (tb) tb.classList.remove("focused");
  });
  win.classList.add("focused");
  const tb = document.getElementById("tb-" + id);
  if (tb) {
    tb.classList.add("visible");
    tb.classList.add("focused");
  }
  storyEvent("opened:" + id);
  if (id === "notepad") setTimeout(() => storyEvent("finished:journal"), 60000);
}

winIds.forEach((id) => {
  const win = document.getElementById("win-" + id);
  if (win) win.addEventListener("mousedown", () => focusWindow(id));
});

let dragState = null;
function startDrag(e, id) {
  if (e.target.classList.contains("win-btn")) return;
  const win = document.getElementById(id);
  const rect = win.getBoundingClientRect();
  dragState = {
    id,
    startX: e.clientX,
    startY: e.clientY,
    origLeft: rect.left,
    origTop: rect.top,
  };
  focusWindow(id.replace("win-", ""));
  e.preventDefault();
}
document.addEventListener("mousemove", (e) => {
  if (!dragState) return;
  const win = document.getElementById(dragState.id);
  win.style.left =
    Math.max(0, dragState.origLeft + e.clientX - dragState.startX) + "px";
  win.style.top =
    Math.max(0, dragState.origTop + e.clientY - dragState.startY) + "px";
});
document.addEventListener("mouseup", () => {
  dragState = null;
});

let resizeState = null;
function startResize(e, id) {
  const win = document.getElementById(id);
  const rect = win.getBoundingClientRect();
  resizeState = {
    id,
    startX: e.clientX,
    startY: e.clientY,
    origW: rect.width,
    origH: rect.height,
  };
  e.preventDefault();
  e.stopPropagation();
}
document.addEventListener("mousemove", (e) => {
  if (!resizeState) return;
  const win = document.getElementById(resizeState.id);
  win.style.width =
    Math.max(280, resizeState.origW + e.clientX - resizeState.startX) + "px";
  win.style.height =
    Math.max(180, resizeState.origH + e.clientY - resizeState.startY) + "px";
});
document.addEventListener("mouseup", () => {
  resizeState = null;
});

if ("speechSynthesis" in window) {
  window.speechSynthesis.getVoices();
}

function generateStars(count) {
  const desktop = document.getElementById("desktop");
  for (let i = 0; i < count; i++) {
    const star = document.createElement("span");
    star.className = "star";
    star.style.top = Math.random() * 100 + "%";
    star.style.left = Math.random() * 100 + "%";
    star.style.animationDelay = Math.random() * 3 + "s";
    desktop.appendChild(star);
  }
}
function updateClock() {
  const now = new Date();

  const h24 = now.getHours();
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ampm = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 || 12;
  document.getElementById("clock").textContent = `${h12}:${mm} ${ampm}`;
}

updateClock();
setInterval(updateClock, 1000);

generateStars(80);

openWindow("myspace");

startingMail.forEach((m) => deliverMail({ ...m, read: true }));
refreshIsabelComments();
scheduleJunkMail(true);

buildTestPanel();
const testStep = new URLSearchParams(location.search).get("step");
if (testStep) skipTo(testStep);
else startStep(0);

window.openWindow = openWindow;
window.closeWindow = closeWindow;
window.minimizeWindow = minimizeWindow;
window.toggleWindow = toggleWindow;
window.startDrag = startDrag;
window.startResize = startResize;
window.msShowHome = msShowHome;
window.msShowProfile = msShowProfile;
window.msShowAboutme = msShowAboutme;
window.msShowBlog = msShowBlog;
window.sendAIM = sendAIM;
window.browserBack = browserBack;
window.browserForward = browserForward;
window.navigateTo = navigateTo;
window.browserNav = browserNav;
window.openPhotoFolder = openPhotoFolder;
window.viewPhoto = viewPhoto;
window.closePhotoViewer = closePhotoViewer;
window.closePhotoFolder = closePhotoFolder;
window.closeNotif = closeNotif;
window.notifAction = notifAction;
window.clippySay = clippySay;
window.deleteMyspace = deleteMyspace;
window.deleteJournal = deleteJournal;
window.skipTo = skipTo;