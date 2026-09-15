// =========================================================
//  BILAL — MULTI-PAGE PORTFOLIO SCRIPT
//  One file powers every page. Each feature checks whether
//  its section exists on the current page before running.
// =========================================================

const circleEl = document.querySelector("#circle");

// ---------------- SMOOTH SCROLL (all pages) ----------------
const loco = () => {
    const main = document.querySelector("#main");
    if (!main || typeof LocomotiveScroll === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const locoScroll = new LocomotiveScroll({
        el: main,
        smooth: true,
        reloadOnContextChange: true,
        lerp: 0.04,
        touchMultiplier: 4,
        smoothMobile: 0,
        smartphone: { smooth: true, breakpoint: 600 },
        tablet: { smooth: false, breakpoint: 1024 }
    });

    locoScroll.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy("#main", {
        scrollTop(value) {
            return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
            return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        },
        pinType: main.style.transform ? "transform" : "fixed"
    });

    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
    ScrollTrigger.refresh();

    // Only intercept in-page (#) links — .html links navigate normally
    document.querySelectorAll(".nav-item").forEach((link) => {
        const href = link.getAttribute("href") || "";
        if (href.startsWith("#")) {
            link.addEventListener("click", (event) => {
                event.preventDefault();
                const target = document.querySelector(href);
                if (target) locoScroll.scrollTo(target);
            });
        }
    });
};
loco();

// ---------------- MOUSE FOLLOWER (all pages) ----------------
const mouseFollower = () => {
    window.addEventListener("mousemove", (dets) => {
        gsap.to("#circle", { x: dets.clientX, y: dets.clientY, ease: Expo, duration: 0.6 });
    });
};
mouseFollower();

// ---------------- SCALE CIRCLE (elements with .scale) ----------------
const scaleCircle = () => {
    if (!document.querySelector(".scale")) return;
    document.querySelectorAll(".scale").forEach((elem) => {
        elem.addEventListener("mousemove", () => {
            gsap.to("#circle", { mixBlendMode: "normal", backgroundColor: "#1a1818", scale: 1.5, ease: Expo });
        });
        elem.addEventListener("mouseleave", () => {
            gsap.to("#circle", { mixBlendMode: "difference", backgroundColor: "#999", scale: 1, ease: Expo });
        });
    });
};
scaleCircle();

// ---------------- PAGE INTRO / LOADER (all pages) ----------------
const pageIntro = () => {
    gsap.set(".navbar, .navbar-mob", { y: -25, opacity: 0 });

    const tl = gsap.timeline();
    tl.to(".loader3 img, .loader3 p", { delay: 0.5, y: 0, ease: Expo, stagger: 0.2 })
        .to(".loader3", { delay: 1, height: "0", ease: Power2, borderRadius: "0 0 50% 50%" })
        .to(".loader2", { height: "0", ease: Power2, delay: -0.3, borderRadius: "0 0 50% 50%" })
        .to(".loader1", { height: "0", ease: Power2, delay: -0.3, borderRadius: "0 0 50% 50%" }, "a")
        .to(".navbar, .navbar-mob", { y: 0, opacity: 1, duration: 1.7, ease: "expo.inOut" }, "a")
        .call(() => ScrollTrigger.refresh());
    return tl;
};
const intro = pageIntro();

// ---------------- LANDING HERO (home only) ----------------
const landingPageAnim = () => {
    if (!document.querySelector("#landing-page")) return;

    intro
        .to("#landing-page .boundingelem", { y: 0, duration: 1.7, stagger: 0.2, ease: "expo.inOut" }, "a")
        .from(".profile-img", { opacity: 0, ease: Power2 })
        .to("#landing-page", {
            backgroundColor: "#1a1818",
            ease: Power3,
            scrollTrigger: {
                trigger: "#landing-page .boundingelem",
                scroller: "#main",
                start: "top 30%",
                scrub: 1
            }
        });
};
landingPageAnim();

// ---------------- ABOUT STATEMENT (home + about page) ----------------
const aboutAnim = () => {
    if (!document.querySelector("#about")) return;

    // On the about page this section is at the top — wait for the loader to lift
    const delay = document.body.dataset.page === "about" ? 2.6 : 0;

    gsap.timeline({
        scrollTrigger: {
            trigger: "#about",
            scroller: "#main",
            start: "top 75%",
            toggleActions: "play none none reverse"
        }
    }).to("#about .boundingelem", {
        y: 0, duration: 1.2, stagger: 0.15, ease: "power3.out", delay: delay
    });
};
aboutAnim();

// ---------------- ABOUT DETAILS (about page) ----------------
const aboutDets = () => {
    if (!document.querySelector("#about-dets .right")) return;

    gsap.timeline({
        scrollTrigger: {
            trigger: "#about-dets .right",
            scroller: "#main",
            start: "top 45%"
        }
    }).from("#about-dets .right h1, #about-dets .right p, #about-dets .right h4, #about-dets .right a", {
        x: "-75%",
        opacity: 0,
        stagger: 0.09,
        ease: Expo
    });
};
aboutDets();

// ---------------- PROJECTS HOVER (projects page) ----------------
const projectAnim = () => {
    const projects = document.querySelectorAll(".project");
    if (!projects.length) return;

    projects.forEach((project) => {

        project.addEventListener("mouseleave", () => {
            gsap.to(circleEl, { backgroundColor: "#999", scale: 1, duration: 0.2, ease: Expo });
            circleEl.innerHTML = ``;
            circleEl.style.mixBlendMode = "difference";
            gsap.to(project.querySelector("img"), { opacity: 0, ease: Power3 });
        });

        let rotate = 0;
        let diffrot = 0;
        project.addEventListener("mousemove", (dets) => {
            const top = dets.clientY - project.getBoundingClientRect().top;
            const left = dets.clientX - project.getBoundingClientRect().left;
            diffrot = dets.clientX - rotate;
            rotate = dets.clientX;

            gsap.to(circleEl, { backgroundColor: "#dadada", scale: 12, duration: 0.2, ease: Expo });
            circleEl.innerHTML = `<p>view</p>`;
            circleEl.style.mixBlendMode = "normal";

            gsap.to(project.querySelector("img"), {
                opacity: 1,
                top: top,
                left: left,
                ease: Power3,
                rotate: gsap.utils.clamp(-20, 20, diffrot * 0.3)
            });
        });
    });
};
projectAnim();

// ---------------- SKILLS CARDS (skills page) ----------------
const skill = () => {
    if (!document.querySelector("#skills .bw-card")) return;

    // On the skills page this section is at the top — wait for the loader to lift
    const delay = document.body.dataset.page === "skills" ? 2.6 : 0;

    gsap.from("#skills .bw-card", {
        opacity: 0,
        y: 45,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        delay: delay,
        scrollTrigger: {
            scroller: "#main",
            trigger: "#skills",
            start: "top 65%",
            toggleActions: "play none none reverse"
        }
    });
};
skill();

// ---------------- CRAFT MARQUEE (home + skills page) ----------------
const craftAnim = () => {
    if (!document.querySelector("#craft")) return;

    gsap.timeline({
        scrollTrigger: {
            trigger: "#craft",
            scroller: "#main",
            scrub: 1,
            pin: true,
            end: "+=1800"
        }
    })
    .to("#craft h1", { x: "-72%", ease: Expo }, "a")
    .to(".craft-img img", { scale: 1.2, ease: Power2 }, "a");
};
craftAnim();

// ---------------- CERTIFICATION HOVER (optional section) ----------------
const certHover = () => {
    if (!document.querySelector("#certifications")) return;

    const certHead = document.querySelectorAll("#certifications .cert h3");
    const certImg = document.querySelectorAll("#certifications .cert .cert-img");

    certHead.forEach((curHead) => {
        curHead.addEventListener("mousemove", () => { circleEl.innerHTML = `<p><span>view</span></p>`; });
        curHead.addEventListener("mouseleave", () => { circleEl.innerHTML = ``; });
    });

    certImg.forEach((curImg) => {
        curImg.addEventListener("mousemove", () => { circleEl.innerHTML = `<p><span>view</span></p>`; });
        curImg.addEventListener("mouseleave", () => { circleEl.innerHTML = ``; });
    });
};
certHover();

// ---------------- BACK TO TOP / LOGO ----------------
const toTop = () => {
    const backTop = document.querySelector(".back-top");
    if (backTop) backTop.addEventListener("click", () => location.reload());

    document.querySelectorAll("nav img").forEach((logo) => {
        logo.addEventListener("click", () => { window.location.href = "index.html"; });
    });
};
toTop();

// ---------------- MOBILE MENU (all pages) ----------------
const mobMenu = () => {
    const menuBtn = document.querySelector(".navbar-mob h4");
    if (!menuBtn) return;

    menuBtn.addEventListener("click", () => {
        gsap.timeline()
            .to("#menu, .bg1, .bg2", { height: "100%", ease: Power3, stagger: 0.2, borderRadius: 0 })
            .to(".bg2 a", { opacity: 1, ease: Power2, stagger: 0.06 })
            .from(".bg2 .menu-footer p", { opacity: 0, ease: Expo });
    });

    document.querySelectorAll(".bg2 a").forEach((elem) => {
        elem.addEventListener("click", (e) => {
            const href = elem.getAttribute("href") || "";
            const isPageLink = href.endsWith(".html");

            gsap.timeline()
                .to(".bg2 a", { opacity: 0, ease: Power2, stagger: 0.06 })
                .to(".bg2", { height: 0, ease: Power3, borderRadius: "0 0 500px 500px" })
                .to(".bg1", { height: 0, ease: Power3, borderRadius: "0 0 500px 500px", delay: -0.3 })
                .to("#menu", { height: 0, ease: Power3, borderRadius: "0 0 500px 500px", delay: -0.4 });

            // Page links: play the close animation first, then navigate
            if (isPageLink) {
                e.preventDefault();
                setTimeout(() => { window.location.href = href; }, 750);
            }
        });
    });
};
mobMenu();

// ---------------- CONTACT FORM (contact page) ----------------
const dummyContactForm = () => {
    const form = document.querySelector("#contact-form");
    if (!form) return;

    const successMsg = document.querySelector("#submit-success");
    const submitBtn = document.querySelector("#submit-btn");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (submitBtn) {
            submitBtn.innerText = "Sending...";
            submitBtn.style.opacity = "0.7";
            submitBtn.style.pointerEvents = "none";
        }
        setTimeout(() => {
            form.style.display = "none";
            if (successMsg) successMsg.style.display = "flex";
        }, 600);
    });
};
dummyContactForm();

// ---------------- CERTIFICATE LIGHTBOX (optional section) ----------------
const certModalHandler = () => {
    const modal = document.querySelector("#cert-modal");
    const modalImg = document.querySelector("#cert-modal-img");
    const closeModal = document.querySelector(".cert-modal-close");
    if (!modal || !modalImg) return;

    const certLinks = document.querySelectorAll(".cert a, .cert-img");

    certLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetImg = link.querySelector("img") || document.querySelector("#mern-cert-img");
            const imgSrc = targetImg ? targetImg.getAttribute("src") : "images/mern-cert.png";
            modalImg.src = imgSrc;
            modal.classList.add("active");
        });
    });

    const closeFn = () => modal.classList.remove("active");

    if (closeModal) closeModal.addEventListener("click", closeFn);

    modal.addEventListener("click", (e) => {
        if (e.target === modal || e.target === closeModal) closeFn();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("active")) closeFn();
    });
};
certModalHandler();