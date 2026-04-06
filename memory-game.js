/* ============================================================
   MEMORY GAME — SCRIPT
============================================================ */

const imagePath = "images/menu-illustrations/";

const sets = {
  6: [
    "apple.png",
    "berries.png",
    "blueberry-lemon.png",
    "cherry-bomb.png",
    "strawberries.png",
    "chocolate-strawberry.png"
  ],
  8: [
    "apple.png",
    "berries.png",
    "blueberry-lemon.png",
    "cherry-bomb.png",
    "strawberries.png",
    "chocolate-strawberry.png",
    "biscoff.png",
    "maple.png"
  ],
  12: [
    "apple.png",
    "berries.png",
    "blueberry-lemon.png",
    "cherry-bomb.png",
    "strawberries.png",
    "chocolate-strawberry.png",
    "biscoff.png",
    "maple.png",
    "mint-chocolate.png",
    "peanut-butter-cup.png",
    "smore.png",
    "banana-split.png"
  ]
};

let timerInterval;
let time = 0;
let moves = 0;
let matches = 0;
let firstCard = null;
let lockBoard = false;
let currentMode = 6;

const timerEl = document.getElementById("timer");
const movesEl = document.getElementById("moves");
const matchesEl = document.getElementById("matches");
const grid = document.getElementById("memoryGrid");

const winScreen = document.getElementById("winScreen");
const winStats = document.getElementById("winStats");
const recordMsg = document.getElementById("recordMsg");
const playAgainBtn = document.getElementById("playAgainBtn");

/* ---------------- TIMER ---------------- */
function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    time++;
    timerEl.textContent = time;
  }, 1000);
}

/* ---------------- SCORE RESET ---------------- */
function resetScore() {
  moves = 0;
  matches = 0;
  movesEl.textContent = moves;
  matchesEl.textContent = matches;
}

/* ---------------- HIGH SCORE ---------------- */
function getHighScore(mode) {
  return JSON.parse(localStorage.getItem("memoryHighScore_" + mode)) || null;
}

function saveHighScore(mode, score) {
  localStorage.setItem("memoryHighScore_" + mode, JSON.stringify(score));
}

/* ---------------- CARD GENERATION ---------------- */
function generateCards(mode) {
  currentMode = mode;
  grid.className = "memory-grid pairs-" + mode;

  const images = sets[mode];
  const cardImages = [...images, ...images];
  cardImages.sort(() => Math.random() - 0.5);

  grid.innerHTML = "";

  cardImages.forEach(src => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-face card-back">
        <img src="images/businesses/alexander-design-lab/alexander-design-lab-logo.png">
      </div>
      <div class="card-face card-front">
        <img src="${imagePath + src}">
      </div>
    `;
    card.addEventListener("click", () => flipCard(card, src));
    grid.appendChild(card);
  });
}

/* ---------------- FLIP LOGIC ---------------- */
function flipCard(card, src) {
  if (lockBoard || card.classList.contains("flipped")) return;

  if (moves === 0 && matches === 0 && time === 0) {
    startTimer();
  }

  card.classList.add("flipped");

  if (!firstCard) {
    firstCard = { card, src };
    return;
  }

  moves++;
  movesEl.textContent = moves;

  if (firstCard.src === src) {
    matches++;
    matchesEl.textContent = matches;
    firstCard = null;

    if (matches === grid.children.length / 2) {
      clearInterval(timerInterval);
      setTimeout(showWinScreen, 600);
    }

  } else {
    lockBoard = true;
    setTimeout(() => {
      card.classList.remove("flipped");
      firstCard.card.classList.remove("flipped");
      firstCard = null;
      lockBoard = false;
    }, 800);
  }
}

/* ---------------- WIN SCREEN ---------------- */
function showWinScreen() {
  grid.classList.add("fade-out");

  const score = { time, moves };
  const best = getHighScore(currentMode);
  let isRecord = false;

  if (!best || time < best.time || (time === best.time && moves < best.moves)) {
    saveHighScore(currentMode, score);
    isRecord = true;
  }

  recordMsg.textContent = isRecord ? "New Record!" : "";

  winStats.innerHTML = `
    <p>Time: <strong>${time}s</strong></p>
    <p>Moves: <strong>${moves}</strong></p>
    <p>Matches: <strong>${matches}</strong></p>
    ${
      best
        ? `<p>Best Time: ${best.time}s<br>Best Moves: ${best.moves}</p>`
        : `<p>No previous record</p>`
    }
  `;

  winScreen.classList.add("active");
}

/* ---------------- PLAY AGAIN ---------------- */
playAgainBtn.addEventListener("click", () => {
  winScreen.classList.remove("active");
  grid.classList.remove("fade-out");

  clearInterval(timerInterval);

  time = 0;
  timerEl.textContent = 0;

  resetScore();
  firstCard = null;
  lockBoard = false;

  generateCards(currentMode);
});

/* ---------------- DIFFICULTY BUTTONS ---------------- */
document.querySelectorAll(".difficulty-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    clearInterval(timerInterval);

    time = 0;
    timerEl.textContent = 0;

    resetScore();
    firstCard = null;
    lockBoard = false;

    winScreen.classList.remove("active");
    grid.classList.remove("fade-out");

    generateCards(btn.dataset.mode);
  });
});

/* ---------------- DEFAULT MODE ---------------- */
generateCards(6);
