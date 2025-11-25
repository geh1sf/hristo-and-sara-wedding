/* ==========================================================
   GLOBAL ROOT PATH FOR GITHUB PAGES
========================================================== */
const ROOT = "/hristo-and-sara-wedding";

/* ==========================================================
   IMAGE LOADER (JSON-BASED)
========================================================== */
async function loadImages() {
    const res = await fetch(`${ROOT}/assets/data/images.json`);
    const data = await res.json();

    /* HERO BACKGROUNDS */
    document.documentElement.style.setProperty(
        "--hero-desktop",
        `url('${ROOT}/assets/images/hero/${data.hero[0]}')`
    );

    document.documentElement.style.setProperty(
        "--hero-mobile",
        `url('${ROOT}/assets/images/hero/${data.hero[1]}')`
    );

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
            </div>
        `;
    });

    data.bestmen.forEach(file => {
        weddingparty.innerHTML += `
            <div class="party-card animate-up">
                <img src="${ROOT}/assets/images/bestmen/${file}">
                <h3>Best Man</h3>
            </div>
        `;
    });

    /* GALLERY */
    const gallery = document.getElementById("gallery");
    data.gallery.forEach(file => {
        gallery.innerHTML += `
            <img class="animate-up" src="${ROOT}/assets/images/gallery/${file}">
        `;
    });
}

loadImages();


/* ==========================================================
   SLIDESHOW ROTATION
========================================================== */
setInterval(() => {
    const slides = document.querySelectorAll("#slideshow img");
    if (slides.length < 2) return;

    const active = document.querySelector("#slideshow img.active");
    active.classList.remove("active");

    const next = active.nextElementSibling || slides[0];
    next.classList.add("active");
}, 3500);


/* ==========================================================
   COUNTDOWN TIMER
========================================================== */
function startCountdown() {
    const target = new Date("June 27, 2026 17:00:00 GMT+0300").getTime();

    setInterval(() => {
        const now = Date.now();
        const diff = target - now;

        if (diff <= 0) return;

        document.getElementById("days").textContent =
            Math.floor(diff / (1000 * 60 * 60 * 24));

        document.getElementById("hours").textContent =
            Math.floor((diff / (1000 * 60 * 60)) % 24);

        document.getElementById("minutes").textContent =
            Math.floor((diff / (1000 * 60)) % 60);

        document.getElementById("seconds").textContent =
            Math.floor((diff / 1000) % 60);

    }, 1000);
}

startCountdown();


/* ==========================================================
   MUSIC AUTOPLAY FIX
========================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const music = document.getElementById("bgMusic");
    if (!music) return;

    music.volume = 0.6;

    music.play().catch(() => {
        console.log("Autoplay blocked — waiting for interaction.");
    });

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


/* ==========================================================
   TOOLTIP LOGIC
========================================================== */
function attachTooltip(select) {
    const wrapper = select.parentElement;
    const tooltip = wrapper.querySelector(".tooltip");

    select.addEventListener("change", () => {
        const option = select.selectedOptions[0];
        const tip = option.dataset.tooltip || "";
        tooltip.textContent = tip;
        tooltip.style.opacity = tip ? "1" : "0";
    });

    select.addEventListener("touchstart", () => {
        const option = select.selectedOptions[0];
        tooltip.textContent = option.dataset.tooltip || "";
        tooltip.style.opacity = "1";
    });
}

document.addEventListener("DOMContentLoaded", () => {
    attachTooltip(document.getElementById("menuMain"));
    attachTooltip(document.getElementById("plusOneMenu"));
});


/* ==========================================================
   +1 LOGIC: SHOW / HIDE
========================================================== */
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


/* ==========================================================
   FORM VALIDATION
========================================================== */
document.getElementById("rsvpForm").addEventListener("submit", function (event) {
    const plusOneSelect = document.getElementById("plusOneSelect");
    const plusOneName = document.getElementById("plusOneName");
    const plusOneMenu = document.getElementById("plusOneMenu");

    if (plusOneSelect.value === "Yes") {

        if (plusOneName.value.trim() === "") {
            alert("Please enter the name of your +1.");
            event.preventDefault();
            return;
        }

        if (plusOneMenu.value === "") {
            alert("Please select a menu for your +1.");
            event.preventDefault();
            return;
        }
    }
});


/* ==========================================================
   MULTILINGUAL SYSTEM
========================================================== */
let currentLang = "en";

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
    if (e.target.dataset.lang) {
        currentLang = e.target.dataset.lang;
        loadTranslations(currentLang);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    loadTranslations("en");
});


/* ==========================================================
   GSAP ANIMATIONS
========================================================== */
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
