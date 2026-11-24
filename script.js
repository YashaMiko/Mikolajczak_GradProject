const music = document.getElementById("bgm");
const toggle = document.getElementById("music-toggle");
const startBtn = document.getElementById("start-btn");

const TARGET_VOLUME = 0.4;   // max volume (0 to 1)
const FADE_MS = 2000;        // fade duration in milliseconds

let fadeTimer = null;
let started = false;         // becomes true once the button is pressed

function fadeTo(target, duration, onDone) {
    clearInterval(fadeTimer);
    const steps = 40;
    const stepTime = duration / steps;
    const delta = (target - music.volume) / steps;

    fadeTimer = setInterval(() => {
        const next = music.volume + delta;
        music.volume = Math.min(1, Math.max(0, next));

        if ((delta > 0 && music.volume >= target) ||
            (delta < 0 && music.volume <= target)) {
            music.volume = target;
            clearInterval(fadeTimer);
            if (onDone) onDone();
        }
    }, stepTime);
}

function fadeIn() {
    music.volume = 0;
    music.play().then(() => {
        toggle.textContent = "🔊";
        fadeTo(TARGET_VOLUME, FADE_MS);
    }).catch(() => {
        toggle.textContent = "🔇";
    });
}

function fadeOut() {
    fadeTo(0, FADE_MS, () => {
        music.pause();
        toggle.textContent = "🔇";
    });
}

// "Start the adventure!": music fades in, background changes, page scrolls
startBtn.addEventListener("click", () => {
    started = true;
    fadeIn();

    document.body.classList.add("adventure-started");

    document.querySelector(".tavernintro").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    startBtn.style.visibility = "hidden";
});

// Mute/unmute toggle (only works after the adventure has started)
toggle.addEventListener("click", () => {
    if (!started) return;
    if (music.paused) {
        fadeIn();
    } else {
        fadeOut();
    }
});