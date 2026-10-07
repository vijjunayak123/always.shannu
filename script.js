const BIRTHDAY_UNLOCK = new Date(2026, 9, 11, 0, 0, 0);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const reasons = [
  "Your smile that changes the whole mood",
  "Your caring nature",
  "The way you talk",
  "Your adorable little anger",
  "The support you give without being asked",
  "How you make simple moments special",
  "Your honest and beautiful heart",
  "The comfort I feel beside you",
  "The dreams we are building together",
  "Simply, the way you are Shannu"
];

const quiz = [
  { question: "What kind of moment should we make next?", answers: ["❤️ Romantic date", "☕ Coffee & talks", "🌆 Evening walk", "🎬 Movie together"], reply: "Vijay is already imagining that day with you." },
  { question: "What is your favorite part of us?", answers: ["❤️ Our conversations", "🥰 Our understanding", "😂 Our fun moments", "🤝 Being together"], reply: "That is one of the reasons 'us' feels so special." },
  { question: "Which Vijay habit makes you laugh the most?", answers: ["😂 My overthinking", "😜 My teasing", "🤭 My silly talks", "🥰 My caring nature"], reply: "He will defend himself, but this answer is being saved." },
  { question: "If you could steal one thing from Vijay, what would it be?", answers: ["His hoodie", "The last bite of his food", "A whole day of his time", "His heart — permanently"], reply: "Fair warning: his heart already belongs to you." },
  { question: "When you miss Vijay, what do you do first?", answers: ["💬 Text Vijay", "📞 Call Vijay", "🥹 Check his photos", "❤️ Think about him"], reply: "A very important answer for Vijay to remember." },
  { question: "What should our next chapter have more of?", answers: ["❤️ More love", "🥰 More time", "😂 More fun", "🌸 More memories"], reply: "Then that is exactly what we should build." }
];

const letterText = `Happy birthday to the woman who makes ordinary days feel worth remembering.

You entered my life quietly, then somehow became part of every hope I carry. I love your smile, your care, the way you speak, and yes, even that little anger that is so completely you.

We are now close to completing three beautiful years together. In these years, we have shared love, laughter, little misunderstandings, long conversations, quiet moments, and so many memories that belong only to us. Through every change, we kept trusting each other, understanding each other, and choosing our relationship again.

My promise is simple: I will keep loving you and caring for you every day, not only on birthdays or special occasions. I will listen when your heart feels heavy, celebrate every little happiness with you, stand beside your dreams, and hold on to us even when a day is difficult. I cannot promise that every moment will be perfect, but I promise that my love, effort, and respect for you will always be honest.

May this year bring you the peace you deserve, courage for every dream, and a thousand reasons to smile. On difficult days, I hope you remember that you never have to carry everything alone. I will be there, cheering for you, listening to you, and choosing us.

You are loved more deeply than these words can hold. Happy birthday, my Shannu.`;

let audioContext;
let songTimer;
let isPlaying = false;
let currentQuiz = 0;
let quizResponses = [];
let letterStarted = false;
let fireworksStarted = false;

function unlockExperience() {
  const lockScreen = document.querySelector("#lock-screen");
  const experience = document.querySelector("#experience");
  if (!experience.hidden) return;
  experience.hidden = false;
  document.body.classList.remove("is-locked");
  lockScreen.classList.add("is-opening");
  window.setTimeout(() => lockScreen.hidden = true, reduceMotion ? 20 : 950);
  drawConstellation();
  drawMangoScene();
  requestAnimationFrame(updateProgress);
}

function updateCountdown() {
  const distance = BIRTHDAY_UNLOCK.getTime() - Date.now();
  if (distance <= 0) {
    unlockExperience();
    return true;
  }
  const units = {
    days: Math.floor(distance / 86400000),
    hours: Math.floor(distance / 3600000) % 24,
    minutes: Math.floor(distance / 60000) % 60,
    seconds: Math.floor(distance / 1000) % 60
  };
  Object.entries(units).forEach(([id, value]) => {
    document.querySelector(`#${id}`).textContent = String(value).padStart(2, "0");
  });
  return false;
}

function setupGate() {
  if (new URLSearchParams(location.search).get("preview") === "vijay" || updateCountdown()) {
    unlockExperience();
    return;
  }
  const timer = window.setInterval(() => {
    if (updateCountdown()) window.clearInterval(timer);
  }, 1000);
  document.querySelector("#preview-link").addEventListener("click", () => {
    const answer = window.prompt("A private preview for the person who made this. First name?");
    if (answer?.trim().toLowerCase() === "vijay") unlockExperience();
  });
}

function setupRevealObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in-view");
      if (entry.target.closest("#letter") && !letterStarted) typeLetter();
      if (entry.target.closest("#finale") && !fireworksStarted) startFireworks();
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.2 });
  document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));
}

function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - innerHeight;
  const percent = scrollable > 0 ? (scrollY / scrollable) * 100 : 0;
  document.querySelector("#progress-bar").style.width = `${percent}%`;
}

function setupEnvelope() {
  document.querySelector("#open-envelope").addEventListener("click", (event) => {
    event.currentTarget.classList.add("open");
    burstConfetti(0.7, 0.52);
    window.setTimeout(() => document.querySelector("#intro").scrollIntoView(), reduceMotion ? 50 : 1100);
  }, { once: true });
}

function buildReasons() {
  const grid = document.querySelector("#reason-grid");
  reasons.forEach((reason, index) => {
    const button = document.createElement("button");
    button.className = "reason-card";
    button.type = "button";
    button.setAttribute("aria-label", `Reveal reason ${index + 1}`);
    button.innerHTML = `<span class="reason-face reason-front"><span><strong>${String(index + 1).padStart(2, "0")}</strong><span>open me</span></span></span><span class="reason-face reason-back"><span>${reason}</span></span>`;
    button.addEventListener("click", () => {
      const wasOpen = button.classList.contains("is-flipped");
      button.classList.toggle("is-flipped");
      button.setAttribute("aria-label", wasOpen ? `Reveal reason ${index + 1}` : reason);
      const openCount = grid.querySelectorAll(".is-flipped").length;
      document.querySelector("#reason-count").textContent = openCount;
      if (openCount === reasons.length) burstConfetti(0.5, 0.55);
    });
    grid.append(button);
  });
}

function getAudioContext() {
  audioContext ??= new (window.AudioContext || window.webkitAudioContext)();
  if (audioContext.state === "suspended") audioContext.resume();
  return audioContext;
}

function playNote(frequency, start, duration, gainValue = 0.05) {
  const context = getAudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.001, start);
  gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.04);
}

function playMelody() {
  const context = getAudioContext();
  const beat = 0.32;
  const melody = [
    [392, .75], [392, .25], [440, 1], [392, 1], [523.25, 1], [493.88, 2],
    [392, .75], [392, .25], [440, 1], [392, 1], [587.33, 1], [523.25, 2],
    [392, .75], [392, .25], [783.99, 1], [659.25, 1], [523.25, 1], [493.88, 1], [440, 2],
    [698.46, .75], [698.46, .25], [659.25, 1], [523.25, 1], [587.33, 1], [523.25, 2]
  ];
  const now = context.currentTime + 0.08;
  let elapsedBeats = 0;
  melody.forEach(([frequency, beats], index) => {
    const start = now + elapsedBeats * beat;
    playNote(frequency, start, beats * beat * 0.92, 0.055);
    if ([0, 6, 12, 19].includes(index)) playNote(frequency / 2, start, beat * 5.5, 0.022);
    elapsedBeats += beats;
  });
  const lyricLines = [...document.querySelectorAll("#lyrics p")];
  const phraseStarts = [0, 12, 25];
  lyricLines.forEach((line, index) => window.setTimeout(() => {
    lyricLines.forEach((item) => item.classList.remove("is-singing"));
    line.classList.add("is-singing");
  }, phraseStarts[index] * beat * 1000));
  songTimer = window.setTimeout(() => isPlaying && playMelody(), elapsedBeats * beat * 1000 + 700);
}

function toggleSong() {
  isPlaying = !isPlaying;
  const controls = [document.querySelector("#music-toggle"), document.querySelector("#song-button")];
  document.querySelector("#vinyl").classList.toggle("is-spinning", isPlaying);
  document.querySelector("#music-toggle").classList.toggle("is-playing", isPlaying);
  controls.forEach((button) => {
    const icon = button.querySelector("svg");
    if (icon) icon.outerHTML = `<i data-lucide="${isPlaying ? "pause" : (button.id === "music-toggle" ? "music-2" : "play")}"></i>`;
  });
  window.lucide?.createIcons();
  if (isPlaying) playMelody();
  else {
    window.clearTimeout(songTimer);
    document.querySelectorAll("#lyrics p").forEach((line) => line.classList.remove("is-singing"));
  }
}

function renderQuiz() {
  const item = quiz[currentQuiz];
  document.querySelector("#quiz-step").textContent = `Question ${currentQuiz + 1} of ${quiz.length}`;
  document.querySelector("#quiz-score").textContent = `${quizResponses.length} saved`;
  document.querySelector("#quiz-question").textContent = item.question;
  document.querySelector("#quiz-feedback").textContent = "";
  document.querySelector("#quiz-next").hidden = true;
  const options = document.querySelector("#quiz-options");
  options.replaceChildren();
  item.answers.forEach((answer, answerIndex) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quiz-option";
    button.textContent = answer;
    button.addEventListener("click", () => answerQuiz(answerIndex));
    options.append(button);
  });
}

function answerQuiz(selected) {
  const item = quiz[currentQuiz];
  const buttons = [...document.querySelectorAll(".quiz-option")];
  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === selected) button.classList.add("selected");
  });
  quizResponses[currentQuiz] = { question: item.question, answer: item.answers[selected] };
  localStorage.setItem("shannuQuizAnswers", JSON.stringify(quizResponses));
  document.querySelector("#quiz-feedback").textContent = item.reply;
  document.querySelector("#quiz-score").textContent = `${quizResponses.length} saved`;
  const next = document.querySelector("#quiz-next");
  next.hidden = false;
  next.firstChild.textContent = currentQuiz === quiz.length - 1 ? "Add a note for Vijay " : "Next question ";
}

function setupQuiz() {
  renderQuiz();
  document.querySelector("#quiz-next").addEventListener("click", () => {
    if (currentQuiz < quiz.length - 1) {
      currentQuiz += 1;
      renderQuiz();
    } else {
      document.querySelector("#quiz-flow").hidden = true;
      document.querySelector("#answer-form").hidden = false;
      renderAnswerReview();
      document.querySelector("#answer-note").focus();
    }
  });
  document.querySelector("#answer-form").addEventListener("submit", sendQuizAnswers);
  document.querySelector("#share-answers").addEventListener("click", shareQuizAnswers);
  document.querySelector("#copy-answers").addEventListener("click", copyQuizAnswers);
  document.querySelector("#continue-after-send").addEventListener("click", () => document.querySelector("#letter").scrollIntoView());
}

function getCompleteResponses() {
  let savedResponses = [];
  try {
    savedResponses = JSON.parse(localStorage.getItem("shannuQuizAnswers") || "[]");
  } catch {
    savedResponses = [];
  }
  return quiz.map((item, index) => {
    const response = quizResponses[index] || savedResponses[index];
    return response?.answer ? { question: item.question, answer: response.answer } : null;
  });
}

function renderAnswerReview() {
  const review = document.querySelector("#answer-review");
  const responses = getCompleteResponses();
  review.replaceChildren();
  responses.forEach((response, index) => {
    const item = document.createElement("div");
    item.className = `answer-review-item${response ? "" : " is-missing"}`;
    item.innerHTML = `<span>${String(index + 1).padStart(2, "0")}</span><div><strong>${quiz[index].question}</strong><p>${response?.answer || "Answer missing — return to the questions"}</p></div>`;
    review.append(item);
  });
}

function getAnswerSummary() {
  const note = document.querySelector("#answer-note").value.trim();
  const responses = getCompleteResponses();
  if (responses.some((response) => !response)) {
    renderAnswerReview();
    document.querySelector("#send-status").textContent = "One or more answers are missing. Please complete all six questions before sharing.";
    return null;
  }
  quizResponses = responses;
  localStorage.setItem("shannuQuizAnswers", JSON.stringify(responses));
  const formattedAnswers = responses.map((response, index) => `${index + 1}. ${response.question}\nAnswer: ${response.answer}`).join("\n\n");
  localStorage.setItem("shannuQuizNote", note);
  return {
    note,
    formattedAnswers,
    text: `Hi Vijay,\n\nHere are my birthday answers:\n\n${formattedAnswers}\n\nMy note:\n${note || "No extra note — my six answers say it all."}\n\n- Shannu`
  };
}

async function shareQuizAnswers() {
  const status = document.querySelector("#send-status");
  const summary = getAnswerSummary();
  if (!summary) return;
  if (!navigator.share) {
    await copyQuizAnswers();
    status.textContent = "Sharing is not available here, so all answers were copied. Paste them into Vijay's WhatsApp chat.";
    return;
  }
  try {
    await navigator.share({ title: "Shannu's birthday answers", text: summary.text });
    status.textContent = "Shared successfully. Vijay can now see every answer.";
    document.querySelector("#continue-after-send").hidden = false;
    burstConfetti(0.5, 0.72);
  } catch (error) {
    if (error.name !== "AbortError") status.textContent = "Sharing could not open. Use Copy and paste the answers into Vijay's chat.";
  }
}

async function copyQuizAnswers() {
  const status = document.querySelector("#send-status");
  const summary = getAnswerSummary();
  if (!summary) return;
  try {
    await navigator.clipboard.writeText(summary.text);
  } catch {
    const textArea = document.createElement("textarea");
    textArea.value = summary.text;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.append(textArea);
    textArea.select();
    document.execCommand("copy");
    textArea.remove();
  }
  status.textContent = "All six answers and your note are copied. Paste them into Vijay's WhatsApp chat.";
  document.querySelector("#continue-after-send").hidden = false;
}

async function sendQuizAnswers(event) {
  event.preventDefault();
  const sendButton = document.querySelector("#send-answers");
  const status = document.querySelector("#send-status");
  const emailFallback = document.querySelector("#email-fallback");
  const summary = getAnswerSummary();
  if (!summary) return;
  const { note, formattedAnswers, text } = summary;
  emailFallback.href = `mailto:vijaykumara2003@gmail.com?subject=${encodeURIComponent("Shannu completed your birthday questions")}&body=${encodeURIComponent(text)}`;
  emailFallback.hidden = true;
  sendButton.disabled = true;
  sendButton.textContent = "Trying automatic email...";
  sendButton.classList.add("is-sending");
  window.lucide?.createIcons();
  status.textContent = "";
  const formData = new FormData();
  formData.append("_subject", "Shannu completed your birthday questions");
  formData.append("_template", "table");
  formData.append("_captcha", "false");
  formData.append("Shannu's answers", formattedAnswers);
  formData.append("Shannu's note", note || "No extra note — her six answers say it all.");
  formData.append("Submitted", new Date().toLocaleString());
  try {
    const response = await fetch("https://formsubmit.co/ajax/vijaykumara2003@gmail.com", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: formData
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.success === false) throw new Error(result.message || "Delivery failed");
    status.textContent = "Submitted for delivery. If this is the first message, Vijay must approve FormSubmit's activation email in his inbox or spam folder.";
    sendButton.hidden = true;
    document.querySelector("#continue-after-send").hidden = false;
    burstConfetti(0.5, 0.72);
  } catch {
    status.textContent = "Automatic delivery could not connect. Your answers are saved — use the email button below to send them safely.";
    sendButton.disabled = false;
    sendButton.textContent = "Retry automatic sending";
    emailFallback.hidden = false;
    document.querySelector("#continue-after-send").hidden = false;
  } finally {
    sendButton.classList.remove("is-sending");
    window.lucide?.createIcons();
  }
}

function typeLetter() {
  letterStarted = true;
  const target = document.querySelector("#typed-letter");
  if (reduceMotion) {
    target.textContent = letterText;
    return;
  }
  let index = 0;
  const type = () => {
    target.textContent = letterText.slice(0, index += 2);
    if (index < letterText.length) window.setTimeout(type, 22);
  };
  type();
}

function buildBalloons() {
  const wishes = ["A year full of peaceful mornings", "Courage for every beautiful dream", "Laughter that makes your cheeks hurt", "Love that always feels like home", "A thousand reasons to smile"];
  const colors = ["#e94676", "#397756", "#f0ad37", "#b83268", "#6b9d57"];
  const field = document.querySelector("#balloon-field");
  wishes.forEach((wish, index) => {
    const balloon = document.createElement("button");
    balloon.type = "button";
    balloon.className = "balloon";
    balloon.style.cssText = `--balloon-color:${colors[index]};--duration:${8 + index * 0.8}s;--delay:${index * -1.4}s;left:${5 + index * 21}%;`;
    balloon.innerHTML = `<span>${index + 1}</span>`;
    balloon.setAttribute("aria-label", `Pop balloon ${index + 1}`);
    balloon.addEventListener("click", () => {
      balloon.classList.add("is-popped");
      balloon.disabled = true;
      document.querySelector("#wish-message").textContent = wish;
      const remaining = field.querySelectorAll(".balloon:not(.is-popped)").length;
      if (remaining === 0) completeBalloonWishes();
    });
    field.append(balloon);
  });
  document.querySelector("#go-to-cake").addEventListener("click", showBirthdayCake);
}

function completeBalloonWishes() {
  const handoff = document.querySelector("#wish-handoff");
  document.querySelector("#wish-message").textContent = "Every wish is yours, Shannu.";
  handoff.hidden = false;
  requestAnimationFrame(() => handoff.classList.add("is-visible"));
  burstConfetti(0.5, 0.68);
  window.setTimeout(() => burstConfetti(0.3, 0.62), 280);
  window.setTimeout(() => burstConfetti(0.7, 0.62), 560);
  if (!reduceMotion) window.setTimeout(showBirthdayCake, 2600);
}

function showBirthdayCake() {
  document.querySelector("#cake").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  window.setTimeout(() => document.querySelector(".candle:not(.out)")?.focus({ preventScroll: true }), reduceMotion ? 50 : 900);
}

function buildCake() {
  const candles = document.querySelector("#candles");
  for (let index = 0; index < 5; index += 1) {
    const candle = document.createElement("button");
    candle.type = "button";
    candle.className = "candle";
    candle.setAttribute("aria-label", `Blow out candle ${index + 1}`);
    candle.innerHTML = '<span class="flame"></span>';
    candle.addEventListener("click", () => {
      candle.classList.add("out");
      candle.disabled = true;
      const left = candles.querySelectorAll(".candle:not(.out)").length;
      document.querySelector("#cake-status").textContent = left ? `${left} flame${left === 1 ? "" : "s"} left` : "Your wish is on its way";
      if (left === 0) {
        burstConfetti(0.5, 0.55);
        window.setTimeout(() => document.querySelector("#finale").scrollIntoView(), 1300);
      }
    });
    candles.append(candle);
  }
}

function burstConfetti(originX, originY) {
  if (reduceMotion || !window.confetti) return;
  window.confetti({ particleCount: 110, spread: 85, origin: { x: originX, y: originY }, colors: ["#ec4776", "#336b4a", "#efb74f", "#ffd9e4"] });
}

function setupFinale() {
  document.querySelector("#reveal-final").addEventListener("click", (event) => {
    event.currentTarget.hidden = true;
    const answer = document.querySelector("#final-answer");
    answer.hidden = false;
    burstConfetti(0.5, 0.52);
    window.setTimeout(() => burstConfetti(0.25, 0.45), 350);
    window.setTimeout(() => burstConfetti(0.75, 0.45), 700);
  });
}

function fitCanvas(canvas) {
  const ratio = Math.min(devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * ratio;
  canvas.height = rect.height * ratio;
  const context = canvas.getContext("2d");
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  return { context, width: rect.width, height: rect.height };
}

function drawConstellation() {
  const canvas = document.querySelector("#constellation-canvas");
  if (!canvas || canvas.offsetParent === null) return;
  const { context, width, height } = fitCanvas(canvas);
  const points = [[.1,.23],[.2,.16],[.3,.28],[.43,.18],[.57,.3],[.68,.19],[.82,.27],[.9,.16],[.12,.65],[.24,.77],[.38,.62],[.52,.74],[.67,.59],[.78,.76],[.9,.64]];
  context.strokeStyle = "rgba(169,32,78,.2)";
  context.lineWidth = 1;
  context.beginPath();
  points.forEach(([x, y], index) => index ? context.lineTo(x * width, y * height) : context.moveTo(x * width, y * height));
  context.stroke();
  points.forEach(([x, y], index) => {
    context.beginPath();
    context.arc(x * width, y * height, index % 3 === 0 ? 3 : 1.7, 0, Math.PI * 2);
    context.fillStyle = index % 2 ? "#ec4776" : "#336b4a";
    context.fill();
  });
}

function drawMangoScene() {
  const canvas = document.querySelector("#mango-canvas");
  if (!canvas || canvas.offsetParent === null) return;
  const { context, width, height } = fitCanvas(canvas);
  const sky = context.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, "#f4b86a");
  sky.addColorStop(.48, "#df7180");
  sky.addColorStop(1, "#1d4a34");
  context.fillStyle = sky;
  context.fillRect(0, 0, width, height);
  context.fillStyle = "rgba(255,235,180,.72)";
  context.beginPath();
  context.arc(width * .78, height * .26, Math.min(width, height) * .08, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#173c2a";
  context.beginPath();
  context.moveTo(width * .42, height);
  context.bezierCurveTo(width * .38, height * .72, width * .48, height * .52, width * .44, 0);
  context.lineTo(width * .6, 0);
  context.bezierCurveTo(width * .52, height * .42, width * .55, height * .72, width * .62, height);
  context.fill();
  const seed = (value) => Math.abs(Math.sin(value * 999)) % 1;
  for (let index = 0; index < 100; index += 1) {
    const x = seed(index + 1) * width;
    const y = seed(index + 4) * height * .58;
    const radius = 18 + seed(index + 7) * 42;
    context.fillStyle = index % 6 === 0 ? "#4f783f" : "#234f32";
    context.beginPath();
    context.ellipse(x, y, radius, radius * .45, seed(index) * 2, 0, Math.PI * 2);
    context.fill();
    if (index % 11 === 0) {
      context.fillStyle = "#e9a83d";
      context.beginPath();
      context.ellipse(x, y + radius * .45, 8, 13, .3, 0, Math.PI * 2);
      context.fill();
    }
  }
}

function startFireworks() {
  fireworksStarted = true;
  if (reduceMotion) return;
  const canvas = document.querySelector("#fireworks-canvas");
  const particles = [];
  let frame = 0;
  const colors = ["#ec4776", "#8abf72", "#efb74f", "#ffd9e4"];
  const launch = (width, height) => {
    const x = width * (.15 + Math.random() * .7);
    const y = height * (.12 + Math.random() * .45);
    const color = colors[Math.floor(Math.random() * colors.length)];
    for (let index = 0; index < 42; index += 1) {
      const angle = (Math.PI * 2 * index) / 42;
      const speed = 1.2 + Math.random() * 3;
      particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1, color });
    }
  };
  const animate = () => {
    const { context, width, height } = fitCanvas(canvas);
    context.clearRect(0, 0, width, height);
    if (frame % 75 === 0) launch(width, height);
    particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += .018;
      particle.life -= .012;
      context.globalAlpha = Math.max(0, particle.life);
      context.fillStyle = particle.color;
      context.fillRect(particle.x, particle.y, 2.5, 2.5);
    });
    context.globalAlpha = 1;
    for (let index = particles.length - 1; index >= 0; index -= 1) if (particles[index].life <= 0) particles.splice(index, 1);
    frame += 1;
    if (document.visibilityState === "visible") requestAnimationFrame(animate);
    else window.setTimeout(() => requestAnimationFrame(animate), 500);
  };
  animate();
}

function setupAmbientTrail() {
  if (reduceMotion) return;
  const canvas = document.querySelector("#ambient-canvas");
  const petals = [];
  let pointerX = innerWidth / 2;
  let pointerY = innerHeight / 2;
  window.addEventListener("pointermove", (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (Math.random() > .55) petals.push({ x: pointerX, y: pointerY, vx: Math.random() - .5, vy: -Math.random(), life: 1 });
  });
  const animate = () => {
    const { context, width, height } = fitCanvas(canvas);
    context.clearRect(0, 0, width, height);
    petals.forEach((petal) => {
      petal.x += petal.vx;
      petal.y += petal.vy;
      petal.life -= .025;
      context.globalAlpha = Math.max(0, petal.life);
      context.fillStyle = "#ec4776";
      context.beginPath();
      context.ellipse(petal.x, petal.y, 3, 6, petal.life * 4, 0, Math.PI * 2);
      context.fill();
    });
    context.globalAlpha = 1;
    for (let index = petals.length - 1; index >= 0; index -= 1) if (petals[index].life <= 0) petals.splice(index, 1);
    requestAnimationFrame(animate);
  };
  animate();
}

function initialize() {
  setupGate();
  setupRevealObserver();
  setupEnvelope();
  buildReasons();
  setupQuiz();
  buildBalloons();
  buildCake();
  setupFinale();
  setupAmbientTrail();
  document.querySelector("#song-button").addEventListener("click", toggleSong);
  document.querySelector("#music-toggle").addEventListener("click", toggleSong);
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", () => {
    if (!document.querySelector("#experience").hidden) {
      drawConstellation();
      drawMangoScene();
    }
  });
  window.lucide?.createIcons();
}

initialize();