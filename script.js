function enterHouse() {

    const nameInput = document.getElementById("playerName");
    const message = document.getElementById("message");

    const name = nameInput.value.trim();

    if (name === "") {
        message.innerText = "⚠️ Please enter your contestant name.";
        return;
    }

    localStorage.setItem("playerName", name);

    window.location.href = "level2.html";
}

let timerInterval;
let timeLeft = 60;
let score = 0;
let flippedCards = [];
let matchedPairs = 0;
let lockBoard = false;
let gameActive = false;

// 10 character pairs = 20 cards
// Cartoon + Bigg Boss / actor-style character icons
const symbols = [
    "🐼", "🦊", "🐸", "🐵", "🦄",
    "🐯", "🎬", "🎤", "👑", "😎",
    "🐼", "🦊", "🐸", "🐵", "🦄",
    "🐯", "🎬", "🎤", "👑", "😎"
];

function startGame() {
    clearInterval(timerInterval);

    timeLeft = 60;
    score = 0;
    matchedPairs = 0;
    flippedCards = [];
    lockBoard = false;
    gameActive = true;

    document.getElementById("score").innerText = score;
    document.getElementById("time").innerText = timeLeft;
    document.getElementById("message").innerText = "";

    document.getElementById("startButton").style.display = "none";
    document.getElementById("levelCompletePanel").style.display = "none";

    // Shuffle cards
    const shuffled = [...symbols].sort(() => Math.random() - 0.5);
    const board = document.getElementById("cards");

    board.innerHTML = "";
    board.style.display = "grid";

    shuffled.forEach((symbol) => {
        const card = document.createElement("div");

        card.className = "card";
        card.innerText = "❓";
        card.dataset.symbol = symbol;

        card.addEventListener("click", () => flipCard(card));
        board.appendChild(card);
    });

    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById("time").innerText = timeLeft;

        if (timeLeft <= 0) {
            playerOut();
        }
    }, 1000);
}

function flipCard(card) {
    if (
        !gameActive ||
        lockBoard ||
        card.classList.contains("flipped") ||
        card.classList.contains("matched")
    ) {
        return;
    }

    card.classList.add("flipped");
    card.innerText = card.dataset.symbol;
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    const [first, second] = flippedCards;

    if (first.dataset.symbol === second.dataset.symbol) {
        first.classList.add("matched");
        second.classList.add("matched");

        matchedPairs++;
        score += 10;

        document.getElementById("score").innerText = score;
        document.getElementById("message").innerText =
            "🎉 Perfect match! +10 points";

        flippedCards = [];

        if (matchedPairs === 10) {
            levelComplete();
        }
    } else {
        lockBoard = true;

        document.getElementById("message").innerText =
            "❌ Not a match! Try again.";

        setTimeout(() => {
            first.classList.remove("flipped");
            second.classList.remove("flipped");

            first.innerText = "❓";
            second.innerText = "❓";

            flippedCards = [];
            lockBoard = false;

            if (gameActive) {
                document.getElementById("message").innerText = "";
            }
        }, 800);
    }
}

function levelComplete() {
    gameActive = false;
    clearInterval(timerInterval);

    document.getElementById("cards").style.display = "none";
    document.getElementById("levelCompletePanel").style.display = "block";
    document.getElementById("finalScore").innerText = score;
    document.getElementById("message").innerText =
        "🏆 All 10 pairs matched!";

    document.querySelector(".complete-icon").innerText = "🏆";
    document.querySelector(".complete-title").innerText =
        "LEVEL 2 COMPLETE!";
    document.querySelector(".complete-subtitle").innerText =
        "Amazing! You matched all 10 pairs!";

    document.querySelector(".preview-title").innerText = "LEVEL 03";
    document.querySelector(".preview-text").innerHTML =
        "Your next challenge is waiting!<br>Get ready for Level 3! 🔥";

    document.getElementById("nextLevelBtn").innerHTML =
        '🚀 ENTER LEVEL 3 <span>→</span>';

    document.getElementById("nextLevelBtn").style.display = "flex";
}

function playerOut() {
    if (!gameActive) return;

    gameActive = false;
    clearInterval(timerInterval);

    document.getElementById("cards").style.display = "none";
    document.getElementById("levelCompletePanel").style.display = "block";
    document.getElementById("finalScore").innerText = score;

    document.querySelector(".complete-icon").innerText = "🚨";
    document.querySelector(".complete-title").innerText = "TIME UP!";
    document.querySelector(".complete-subtitle").innerText =
        "Your earned points are saved for this result!";

    document.querySelector(".preview-title").innerText = "LEVEL 03";
    document.querySelector(".preview-text").innerHTML =
        "Your journey continues!<br>Ready for the next challenge? 🔥";

    document.getElementById("nextLevelBtn").innerHTML =
        '🚀 CONTINUE TO LEVEL 3 <span>→</span>';

    document.getElementById("nextLevelBtn").style.display = "flex";

    document.getElementById("message").innerText =
        "🚨 Time is up! Score: " + score;
}