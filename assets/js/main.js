/* ROOT PATH */
const ROOT = "/hristo-and-sara-wedding";

/* ============================================================
   LOAD IMAGES + INIT GALLERY
============================================================ */
async function loadImages() {
    const res = await fetch(`${ROOT}/assets/data/images.json`);
    const data = await res.json();

    document.documentElement.style.setProperty("--hero-desktop",
        `url('${ROOT}/assets/images/hero/${data.hero[0]}')`);

    document.documentElement.style.setProperty("--hero-mobile",
        `url('${ROOT}/assets/images/hero/${data.hero[1]}')`);

    /* SLIDESHOW */
    const slideshow = document.getElementById("slideshow");
    data.slideshow.forEach((file, i) => {
        let img = document.createElement("img");
        img.src = `${ROOT}/assets/images/slideshow/${file}`;
        if (i === 0) img.classList.add("active");
        slideshow.appendChild(img);
    });

    /* WEDDING PARTY */
    const weddingparty = document.getElementById("weddingparty");
    data.bridesmaids.forEach(file => {
        weddingparty.innerHTML += `
            <div class="party-card animate-up">
                <img src="${ROOT}/assets/images/bridesmaids/${file}">
                <h3>Bridesmaid</h3>
            </div>`;
    });
    data.bestmen.forEach(file => {
        weddingparty.innerHTML += `
            <div class="party-card animate-up">
                <img src="${ROOT}/assets/images/bestmen/${file}">
                <h3>Best Man</h3>
            </div>`;
    });

    /* 3D CAROUSEL */
    init3DCarousel(data.gallery);
}
loadImages();

/* SLIDESHOW ROTATION */
setInterval(() => {
    const slides = document.querySelectorAll("#slideshow img");
    if (slides.length < 2) return;

    const active = document.querySelector("#slideshow img.active");
    active.classList.remove("active");

    const next = active.nextElementSibling || slides[0];
    next.classList.add("active");
}, 3500);

/* ============================================================
   COUNTDOWN
============================================================ */
function startCountdown() {
    const target = new Date("June 27, 2026 17:00:00 GMT+0300").getTime();

    setInterval(() => {
        const now = Date.now();
        const diff = target - now;
        if (diff <= 0) return;

        document.getElementById("days").textContent =
            Math.floor(diff / 86400000);

        document.getElementById("hours").textContent =
            Math.floor((diff / 3600000) % 24);

        document.getElementById("minutes").textContent =
            Math.floor((diff / 60000) % 60);

        document.getElementById("seconds").textContent =
            Math.floor((diff / 1000) % 60);

    }, 1000);
}
startCountdown();

/* ============================================================
   MUSIC AUTOPLAY
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
    const music = document.getElementById("bgMusic");
    if (!music) return;

    music.volume = 0.6;
    music.play().catch(() => {});

    const startMusic = () => {
        music.play().catch(() => {});
        document.removeEventListener("click", startMusic);
        document.removeEventListener("touchstart", startMusic);
    };

    document.addEventListener("click", startMusic);
    document.addEventListener("touchstart", startMusic);
});

/* ============================================================
   TOOLTIP
============================================================ */
function attachTooltip(select) {
    const wrapper = select.parentElement;
    const tooltip = wrapper.querySelector(".tooltip");

    select.addEventListener("change", () => {
        const option = select.selectedOptions[0];
        tooltip.textContent = option.dataset.tooltip || "";
        tooltip.style.opacity = tooltip.textContent ? "1" : "0";
    });
}

document.addEventListener("DOMContentLoaded", () => {
    attachTooltip(document.getElementById("menuMain"));
    attachTooltip(document.getElementById("plusOneMenu"));
});

/* ============================================================
   +1 LOGIC
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
    const plusOneSelect = document.getElementById("plusOneSelect");
    const plusOneName = document.getElementById("plusOneName");
    const plusOneMenuWrapper = document.getElementById("plusOneMenuWrapper");
    const plusOneMenu = document.getElementById("plusOneMenu");

    plusOneSelect.addEventListener("change", () => {
        if (plusOneSelect.value === "Yes") {
            plusOneName.style.display = "block";
            plusOneMenuWrapper.style.display = "block";
            plusOneMenu.required = true;
        } else {
            plusOneName.style.display = "none";
            plusOneMenuWrapper.style.display = "none";
            plusOneMenu.required = false;
            plusOneName.value = "";
            plusOneMenu.value = "";
        }
    });
});

/* ============================================================
   FORM CONFIRMATION
============================================================ */
document.getElementById("rsvpForm").addEventListener("submit", function () {
    document.getElementById("confirmation").style.display = "block";
    setTimeout(() => this.reset(), 500);
});

/* ============================================================
   TRANSLATIONS
============================================================ */
async function loadTranslations(lang) {
    const res = await fetch(`${ROOT}/assets/data/lang.json`);
    const translations = await res.json();

    document.querySelectorAll("[data-i18n]").forEach(el => {
        el.textContent = translations[lang][el.dataset.i18n];
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        el.placeholder = translations[lang][el.dataset.i18nPlaceholder];
    });
}

document.getElementById("lang-switcher").addEventListener("click", e => {
    if (e.target.dataset.lang) loadTranslations(e.target.dataset.lang);
});

document.addEventListener("DOMContentLoaded", () => {
    loadTranslations("en");
});

/* ============================================================
   GSAP ANIMATIONS
============================================================ */
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
});

/* ============================================================
   3D CAROUSEL
============================================================ */
let carouselIndex = 0;
let carouselImages = [];

function init3DCarousel(images) {
    const container = document.getElementById("carousel3D");
    carouselImages = images;

    container.innerHTML = "";

    images.forEach((src, i) => {
        const item = document.createElement("div");
        item.className = "carousel-item";
        item.innerHTML = `<img src="${ROOT}/assets/images/gallery/${src}">`;
        container.appendChild(item);
    });

    updateCarousel3D();
    setInterval(nextCarouselImage, 3000);
}

function updateCarousel3D() {
    const items = document.querySelectorAll(".carousel-item");
    const total = items.length;

    items.forEach((item, i) => {
        const pos = (i - carouselIndex + total) % total;

        if (pos === 0) item.className = "carousel-item active";
        else if (pos === 1) item.className = "carousel-item right";
        else if (pos === total - 1) item.className = "carousel-item left";
        else item.className = "carousel-item far";
    });
}

function nextCarouselImage() {
    carouselIndex = (carouselIndex + 1) % carouselImages.length;
    updateCarousel3D();
}

/* ============================================================
   PETAL GENERATOR
============================================================ */
function createPetal() {
    const container = document.getElementById("petal-container");
    if (!container) return;

    const petal = document.createElement("div");
    petal.classList.add("petal");

    petal.style.left = Math.random() * 100 + "vw";

    const size = 18 + Math.random() * 25;
    petal.style.width = size + "px";
    petal.style.height = size + "px";

    const duration = 4 + Math.random() * 5;
    petal.style.animationDuration = duration + "s";

    container.appendChild(petal);

    setTimeout(() => petal.remove(), duration * 1000);
}

setInterval(createPetal, 350);

/* Create petal layer */
document.addEventListener("DOMContentLoaded", () => {
    const petalLayer = document.createElement("div");
    petalLayer.id = "petal-container";
    document.body.appendChild(petalLayer);
});
