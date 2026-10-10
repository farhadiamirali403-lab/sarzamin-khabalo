/*
  Personalize the site by changing the text below.
  Keep it generic for now, so the site is ready to be customized before sharing.
*/
const personalName = "خوابالوی دوست‌داشتنی";

const quiz = [
  {
    question: "اگر الان ساعت سه بعدازظهر باشد، تو کجایی؟",
    answers: [
      { text: "تازه خوابم گرفته.", emoji: "😴", points: 3 },
      { text: "پنج دقیقهٔ دیگه بیدار می‌شم.", emoji: "🛌", points: 2 },
      { text: "من از دیشب هنوز بیدار نشدم!", emoji: "💤", points: 4 },
    ],
  },
  {
    question: "برای یک چرتِ ایده‌آل، چی لازم داری؟",
    answers: [
      { text: "بالش نرم و پتو تا زیر چونه.", emoji: "☁️", points: 4 },
      { text: "فقط پنج دقیقه سکوت... شاید دو ساعت.", emoji: "🤫", points: 3 },
      { text: "هرجا بشه سرمو بذارم!", emoji: "🐻", points: 2 },
    ],
  },
  {
    question: "پیام «بیداری؟» ساعت ده شب یعنی...",
    answers: [
      { text: "متأسفانه خوابم برده بود.", emoji: "🌙", points: 4 },
      { text: "در حال آماده‌شدن برای خوابم.", emoji: "🫧", points: 3 },
      { text: "فقط اومدم شب‌بخیر بگم.", emoji: "💗", points: 2 },
    ],
  },
];

let quizIndex = 0;
let score = 0;
const screens = [...document.querySelectorAll(".screen")];
const navLinks = [...document.querySelectorAll(".nav-link")];
const questionText = document.querySelector("#question-text");
const answers = document.querySelector("#answers");
const questionNumber = document.querySelector("#question-number");
const progressBar = document.querySelector("#progress-bar");
const progressLabel = document.querySelector("#progress-label");

document.querySelectorAll("[data-person-name]").forEach((item) => {
  item.textContent = personalName;
});

function showScreen(targetId) {
  screens.forEach((screen) => {
    const isTarget = screen.id === targetId;
    screen.hidden = !isTarget;
    screen.classList.toggle("active", isTarget);
  });

  navLinks.forEach((link) => {
    const isTarget = link.dataset.go === targetId;
    link.classList.toggle("active", isTarget);
    link.setAttribute("aria-current", isTarget ? "page" : "false");
  });

  if (targetId === "quiz") {
    // A fresh visit after a completed test should start a new playful round.
    if (quizIndex >= quiz.length) {
      quizIndex = 0;
      score = 0;
    }
    renderQuestion();
  }
  if (targetId === "result") showResult();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderQuestion() {
  const current = quiz[quizIndex];
  questionText.textContent = current.question;
  questionNumber.textContent = String(quizIndex + 1);
  progressLabel.textContent = `سؤال ${quizIndex + 1} از ${quiz.length}`;
  progressBar.style.width = `${((quizIndex + 1) / quiz.length) * 100}%`;
  answers.replaceChildren();

  current.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer";
    button.innerHTML = `<span class="answer-emoji" aria-hidden="true">${answer.emoji}</span><b>${answer.text}</b>`;
    button.addEventListener("click", () => pickAnswer(answer.points));
    answers.appendChild(button);
  });
}

function pickAnswer(points) {
  score += points;
  quizIndex += 1;
  if (quizIndex < quiz.length) {
    renderQuestion();
  } else {
    showScreen("result");
  }
}

function showResult() {
  const percentage = Math.min(99, 55 + score * 4);
  const title = document.querySelector("#result-title");
  const copy = document.querySelector("#result-copy");
  const badge = document.querySelector("#result-badge");
  const meter = document.querySelector("#meter-fill");

  if (percentage > 91) {
    title.textContent = "تو یک خوابالوی حرفه‌ای هستی!";
    copy.textContent = "نتیجهٔ آزمایش: بدون میزان کافی خواب و ناز، قابلیت فعالیت نداری. و راستش، این خیلی هم بانمکه.";
    badge.textContent = "ملکهٔ سرزمین خوابالوها";
  } else if (percentage > 79) {
    title.textContent = "استعداد خوابالویی تو بالاست!";
    copy.textContent = "تو هرجا یک جای دنج ببینی، احتمالاً می‌تونی یک چرتِ عالی بزنی. کاملاً قابل احترام است.";
    badge.textContent = "قهرمان چرت‌های کوتاه";
  } else {
    title.textContent = "یک خوابالوی پنهان پیدا شد!";
    copy.textContent = "ممکنه خودت انکارش کنی، اما قلبت یک تختِ نرم و پتوهای گرم می‌خواهد.";
    badge.textContent = "عضو افتخاری باشگاه بالش‌ها";
  }

  meter.style.width = "0";
  requestAnimationFrame(() => setTimeout(() => { meter.style.width = `${percentage}%`; }, 80));
}

document.querySelectorAll("[data-go]").forEach((button) => {
  button.addEventListener("click", () => showScreen(button.dataset.go));
});

document.querySelector("#room-switch").addEventListener("click", (event) => {
  const active = event.currentTarget.getAttribute("aria-pressed") === "true";
  event.currentTarget.setAttribute("aria-pressed", String(!active));
  document.querySelector("#room-card").classList.toggle("lit", !active);
});

document.querySelector("#envelope").addEventListener("click", (event) => {
  const opened = event.currentTarget.classList.toggle("open");
  event.currentTarget.setAttribute("aria-expanded", String(opened));
  const note = document.querySelector("#love-note");
  note.hidden = !opened;
});

document.querySelector(".sound-toggle").addEventListener("click", (event) => {
  const enabled = event.currentTarget.getAttribute("aria-pressed") === "true";
  event.currentTarget.setAttribute("aria-pressed", String(!enabled));
  event.currentTarget.firstElementChild.textContent = enabled ? "♡" : "♥";
  // Kept intentionally silent: this is a visual comfort toggle and needs no media file.
});
