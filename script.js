document.addEventListener("DOMContentLoaded", () => {
    const music = document.getElementById("bgm");
    const toggle = document.getElementById("music-toggle");
    const startBtn = document.getElementById("start-btn");
    const tavern = document.querySelector(".Tavern");

    const TARGET_VOLUME = 0.4;
    const FADE_MS = 2000;

    let fadeTimer = null;
    let started = false;

    function fadeTo(target, duration, onDone) {
        if (!music) return;
        clearInterval(fadeTimer);
        const steps = 40;
        const stepTime = duration / steps;
        const delta = (target - music.volume) / steps;

        if (delta === 0) {
            if (onDone) onDone();
            return;
        }

        fadeTimer = setInterval(() => {
            music.volume = Math.min(1, Math.max(0, music.volume + delta));
            if ((delta > 0 && music.volume >= target) ||
                (delta < 0 && music.volume <= target)) {
                music.volume = target;
                clearInterval(fadeTimer);
                if (onDone) onDone();
            }
        }, stepTime);
    }

    function fadeIn() {
        if (!music) return;
        music.volume = 0;
        music.play().then(() => {
            if (toggle) toggle.textContent = "🔊";
            fadeTo(TARGET_VOLUME, FADE_MS);
        }).catch(() => {
            if (toggle) toggle.textContent = "🔇";
        });
    }

    function fadeOut() {
        fadeTo(0, FADE_MS, () => {
            music.pause();
            if (toggle) toggle.textContent = "🔇";
        });
    }

    startBtn.addEventListener("click", () => {
        if (started) return;
        started = true;

        // Show the tavern first, then fade it in
        tavern.classList.add("active");
        requestAnimationFrame(() => {
            requestAnimationFrame(() => tavern.classList.add("visible"));
        });

        document.body.classList.add("adventure-started");
        tavern.scrollIntoView({ behavior: "smooth", block: "start" });
        startBtn.style.visibility = "hidden";

        fadeIn();
    });

    if (toggle) {
        toggle.addEventListener("click", () => {
            if (!started || !music) return;
            if (music.paused) {
                fadeIn();
            } else {
                fadeOut();
            }
        });
    }

    // ---------- Click-to-flip character cards ----------
    const characters = document.querySelector(".characters");

    if (characters) {
        characters.addEventListener("click", (e) => {
            const card = e.target.closest(".card");
            if (card) card.classList.toggle("flipped");
        });

        // Keyboard support: Enter or Space flips the focused card
        characters.addEventListener("keydown", (e) => {
            if (e.key !== "Enter" && e.key !== " ") return;
            const card = e.target.closest(".card");
            if (card) {
                e.preventDefault();
                card.classList.toggle("flipped");
            }
        });
    }
});