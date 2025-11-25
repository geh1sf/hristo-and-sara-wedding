/* LOAD IMAGES FROM JSON */
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
            <div class="party-card">
                <img src="assets/images/bridesmaids/${file}">
                <h3>Bridesmaid</h3>
            </div>
        `;
    });

    /* BEST MEN */
    const bestmen = document.getElementById("bestmen");
    data.bestmen.forEach(file => {
        bestmen.innerHTML += `
            <div class="party-card">
                <img src="assets/images/bestmen/${file}">
                <h3>Best Man</h3>
            </div>
        `;
    });

    /* TIMELINE */
    const timeline = document.getElementById("timeline");
    data.timeline.forEach(file => {
        timeline.innerHTML += `
            <div class="timeline-item">
                <img src="assets/images/timeline/${file}">
                <h3>Event</h3>
                <p>Description here.</p>
            </div>
        `;
    });

    /* GALLERY */
    const gallery = document.getElementById("gallery");
    data.gallery.forEach(file => {
        gallery.innerHTML += `<img src="assets/images/gallery/${file}">`;
    });
}

/* RUN IMAGE LOADER */
loadImages();

/* SLIDESHOW */
setInterval(() => {
    const slides = document.querySelectorAll("#slideshow img");
    if (slides.length < 2) return;

    const active = document.querySelector("#slideshow img.active");
    active.classList.remove("active");

    const next = active.nextElementSibling || slides[0];
    next.classList.add("active");
}, 3500);

/* MUSIC AUTOPLAY FIX */
document.addEventListener("DOMContentLoaded", () => {
    const music = document.getElementById("bgMusic");
    if (!music) return;

    music.volume = 0.6;

    // Try autoplay
    music.play().catch(() => {
        console.log("Autoplay blocked — waiting for interaction.");
    });

    // Start on first touch/click/scroll
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
