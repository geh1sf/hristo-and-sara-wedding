/* ===========================================
   LOAD IMAGES FROM JSON
=========================================== */
async function loadImages() {
    const res = await fetch("assets/data/images.json");
    const data = await res.json();

    /* HERO */
    document.documentElement.style.setProperty("--hero-desktop",
        `url('assets/images/hero/${data.hero[0]}')`);
    document.documentElement.style.setProperty("--hero-mobile",
        `url('assets/images/hero/${data.hero[1]}')`);

    /* SLIDESHOW */
    const slideshow = document.getElementById("slideshow");
    data.slideshow.forEach((file, i) => {
        let img = document.createElement("img");
        img.src = `assets/images/slideshow/${file}`;
        if (i === 0) img.classList.add("active");
        slideshow.appendChild(img);
    });

    /* BRIDESMAIDS */
    const bridesmaids = document.getElementById("bridesmaids");
    data.bridesmaids.forEach(file => {
        bridesmaids.innerHTML += `
            <div class="party-card animate-up">
                <img src="assets/images/bridesmaids/${file}">
                <h3>Bridesmaid</h3>
            </div>
        `;
    });

    /* BEST MEN */
    const bestmen = document.getElementById("bestmen");
    data.bestmen.forEach(file => {
        bestmen.innerHTML += `
            <div class="party-card animate-up">
                <img src="assets/images/bestmen/${file}">
                <h3>Best Man</h3>
            </div>
        `;
    });

    /* TIMELINE */
    const timeline = document.getElementById("timeline");
    data.timeline.forEach((file, idx) => {
        timeline.innerHTML += `
            <div class="timeline-item animate-side-${idx % 2 === 0 ? 'left' : 'right'}">
                <img src="assets/images/timeline/${file}">
                <h3>Event</h3>
                <p>Description here.</p>
            </div>
        `;
    });

    /* GALLERY */
    const gallery = document.getElementById("gallery");
    data.gallery.forEach(file => {
        gallery.innerHTML += `
            <img class="animate-up" src="assets/images/gallery/${file}">
        `;
    });
}

/* ===========================================
   RUN IMAGE LOADER
=========================================== */
loadImages();

/* ===========================================
   SLIDESHOW
=========================================== */
setInterval(() => {
    const slides = document.querySelectorAll("#slideshow img");
    if (slides.length < 2) return;

    const active = document.querySelector("#slideshow img.active");
    active.classList.remove("active");

    const next = active.nextElementSibling || slides[0];
    next.classList.add("active");
}, 3500);

/* ===========================================
   COUNTDOWN TIMER
=========================================== */
function startCountdown() {
    const target = new Date("June 27, 2026 17:00:00 GMT+0300").getTime();

    setInterval(() => {
        const now = Date.now();
        const diff = target - now;

        if (diff <= 0) return;

        document.getElementById("days").textContent = Math.floor(diff / (1000 * 60 * 60 * 24));
        document.getElementById("hours").textContent = Math.floor((diff / (1000 * 60 * 60)) % 24);
        document.getElementById("minutes").textContent = Math.floor((diff / (1000 * 60)) % 60);
        document.getElementById("seconds").textContent = Math.floor((diff / 1000) % 60);
    }, 1000);
}
startCountdown();

/* ===========================================
   MUSIC AUTOPLAY FIX
=========================================== */
document.addEventListener("DOMContentLoaded", () => {
    const music = document.getElementById("bgMusic");
    if (!music) return;

    music.volume = 0.6;

    // Try autoplay
    music.play().catch(() => {
        console.log("Autoplay blocked — waiting for first interaction.");
    });

    // Force play on first interaction
    const startMusic = () => {
        music.play().catch(() => {});
        document.removeEventListener("click", startMusic);
        document.removeEventListener("touchstart", startMusic);
        document.removeEventListener("scroll", startMusic);
    };

    document.addEventListener("click", startMusic);
    document.addEventListener("touchstart", startMusic);
    document.addEventListener("scroll", startMusic);
});

/* ===========================================
   MULTILINGUAL SUPPORT (EN/BG)
=========================================== */
let currentLang = "en";

async function loadTranslations(lang) {
    const res = await fetch("assets/data/lang.json");
    const translations = await res.json();

    document.querySelectorAll("[data-i18n]").forEach(el => {
        el.textContent = translations[lang][el.dataset.i18n];
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        el.placeholder = translations[lang][el.dataset.i18n-placeholder];
    });
}

document.getElementById("lang-switcher").addEventListener("click", e => {
    if (e.target.dataset.lang) {
        currentLang = e.target.dataset.lang;
        loadTranslations(currentLang);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    loadTranslations("en");
});

/* ===========================================
   GSAP ANIMATIONS
=========================================== */
document.addEventListener("DOMContentLoaded", () => {

    gsap.from(".hero-content", {
        opacity: 0,
        y: 40,
        duration: 1.6,
        ease: "power3.out"
    });

    gsap.utils.toArray(".animate-up").forEach(elem => {
        gsap.from(elem, {
            scrollTrigger: elem,
            opacity: 0,
            y: 50,
            duration: 1.2,
            ease: "power2.out"
        });
    });

    gsap.utils.toArray(".animate-side-left").forEach(elem => {
        gsap.from(elem, {
            scrollTrigger: elem,
            opacity: 0,
            x: -80,
            duration: 1.2
        });
    });

    gsap.utils.toArray(".animate-side-right").forEach(elem => {
        gsap.from(elem, {
            scrollTrigger: elem,
            opacity: 0,
            x: 80,
            duration: 1.2
        });
    });

});
