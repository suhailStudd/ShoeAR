const menu = document.querySelector("#menu-bar");
const navbar = document.querySelector(".navbar");
const slides = document.querySelectorAll(".slide-container");
const homeSection = document.querySelector(".home");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let index = 0;
let slideIntervalId = null;
let pointerFrameId = null;
let pointerTargetX = 0;
let pointerTargetY = 0;
let pointerCurrentX = 0;
let pointerCurrentY = 0;

if (menu && navbar) {
    menu.onclick = () => {
        menu.classList.toggle("fa-times");
        navbar.classList.toggle("active");
    };

    document.querySelectorAll(".navbar a").forEach((link) => {
        link.addEventListener("click", () => {
            menu.classList.remove("fa-times");
            navbar.classList.remove("active");
        });
    });

    document.addEventListener("click", (event) => {
        if (!navbar.contains(event.target) && !menu.contains(event.target)) {
            menu.classList.remove("fa-times");
            navbar.classList.remove("active");
        }
    });
}

function resetShoeDepth() {
    document.querySelectorAll(".slide-container .image .shoe").forEach((shoe) => {
        shoe.style.removeProperty("--tilt-rot");
        shoe.style.removeProperty("--tilt-y");
        shoe.style.removeProperty("--move-x");
        shoe.style.removeProperty("--move-y");
    });
}

function next() {
    if (!slides.length) {
        return;
    }

    slides[index].classList.remove("active");
    index = (index + 1) % slides.length;
    slides[index].classList.add("active");
    resetShoeDepth();
}

function prev() {
    if (!slides.length) {
        return;
    }

    slides[index].classList.remove("active");
    index = (index - 1 + slides.length) % slides.length;
    slides[index].classList.add("active");
    resetShoeDepth();
}

function startAutoSlide() {
    if (slides.length < 2 || prefersReducedMotion) {
        return;
    }

    clearInterval(slideIntervalId);
    slideIntervalId = setInterval(() => {
        next();
    }, 7000);
}

function stopAutoSlide() {
    clearInterval(slideIntervalId);
    slideIntervalId = null;
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function getActiveShoe() {
    return document.querySelector(".slide-container.active .image .shoe");
}

function applyDepthMotion(x, y) {
    const shoe = getActiveShoe();

    if (!shoe) {
        return;
    }

    shoe.style.setProperty("--tilt-rot", `${(x * 5).toFixed(2)}deg`);
    shoe.style.setProperty("--tilt-y", `${(x * 12).toFixed(2)}deg`);
    shoe.style.setProperty("--move-x", `${(x * 14).toFixed(2)}px`);
    shoe.style.setProperty("--move-y", `${(y * 10).toFixed(2)}px`);
}

function animateDepthMotion() {
    pointerCurrentX += (pointerTargetX - pointerCurrentX) * 0.14;
    pointerCurrentY += (pointerTargetY - pointerCurrentY) * 0.14;

    applyDepthMotion(pointerCurrentX, pointerCurrentY);

    const continueAnimation =
        Math.abs(pointerTargetX - pointerCurrentX) > 0.004 ||
        Math.abs(pointerTargetY - pointerCurrentY) > 0.004;

    pointerFrameId = continueAnimation ? requestAnimationFrame(animateDepthMotion) : null;
}

function requestDepthAnimation() {
    if (!pointerFrameId) {
        pointerFrameId = requestAnimationFrame(animateDepthMotion);
    }
}

if (homeSection) {
    startAutoSlide();

    homeSection.addEventListener("mouseenter", stopAutoSlide);
    homeSection.addEventListener("mouseleave", startAutoSlide);

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            stopAutoSlide();
            return;
        }

        startAutoSlide();
    });

    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!prefersReducedMotion && hasFinePointer) {
        homeSection.addEventListener("pointermove", (event) => {
            const rect = homeSection.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width;
            const y = (event.clientY - rect.top) / rect.height;

            pointerTargetX = clamp((x - 0.5) * 2, -1, 1);
            pointerTargetY = clamp((y - 0.5) * 2, -1, 1);

            requestDepthAnimation();
        });

        homeSection.addEventListener("pointerleave", () => {
            pointerTargetX = 0;
            pointerTargetY = 0;
            requestDepthAnimation();
        });
    }
}

document.querySelectorAll(".featured-image-1").forEach((image_1) => {
    image_1.addEventListener("click", () => {
        const src = image_1.getAttribute("src");
        const bigImage = document.querySelector(".big-image-1");
        if (bigImage) {
            bigImage.src = src;
        }
    });
});

document.querySelectorAll(".featured-image-2").forEach((image_2) => {
    image_2.addEventListener("click", () => {
        const src = image_2.getAttribute("src");
        const bigImage = document.querySelector(".big-image-2");
        if (bigImage) {
            bigImage.src = src;
        }
    });
});

document.querySelectorAll(".featured-image-3").forEach((image_3) => {
    image_3.addEventListener("click", () => {
        const src = image_3.getAttribute("src");
        const bigImage = document.querySelector(".big-image-3");
        if (bigImage) {
            bigImage.src = src;
        }
    });
});
