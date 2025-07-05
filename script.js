function runWhenReady() {
    if (typeof gsap === 'undefined' || typeof Lenis === 'undefined' || typeof ScrollTrigger === 'undefined') {
        setTimeout(runWhenReady, 100);
        return;
    }

    // --- All libraries are loaded, proceed with initialization ---
    
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        preloader.addEventListener('transitionend', () => preloader.style.display = 'none');
    }
    document.body.classList.add('loaded');

    try {
        const lenis = new Lenis({ lerp: 0.08 });
        
        function animate(time) {
            lenis.raf(time);
            requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);

        const cursor = document.querySelector('.cursor');
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function moveCursor() {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            cursor.setAttribute("style", `top: ${cursorY}px; left: ${cursorX}px;`);
            requestAnimationFrame(moveCursor);
        }
        moveCursor();

        document.querySelectorAll('a, button, .skill-tag, .project-item, .cert-item, .bento-item').forEach(el => {
            el.addEventListener('mouseover', () => cursor.classList.add('cursor-grow'));
            el.addEventListener('mouseout', () => cursor.classList.remove('cursor-grow'));
        });

        gsap.registerPlugin(ScrollTrigger);

        gsap.to(".gsap-reveal-line", {
            y: "0%", opacity: 1, stagger: 0.1, duration: 1,
            ease: "power3.out", delay: 0.5
        });
        
        document.querySelectorAll(".gsap-reveal").forEach(el => {
            gsap.fromTo(el, { opacity: 0, y: 50 }, {
                opacity: 1, y: 0, duration: 1.2, ease: "power3.out",
                scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" }
            });
        });

        gsap.to("#hero", {
            scale: 0.95, opacity: 0.5,
            scrollTrigger: { trigger: "#hero", start: "bottom bottom", end: "bottom top", scrub: true }
        });
        
        const track = document.querySelector('.horizontal-scroll-track');
        if (window.innerWidth > 768) {
            let trackWidth = track.scrollWidth - window.innerWidth + (window.innerWidth * 0.1);
            gsap.to(track, {
                x: -trackWidth,
                ease: "none",
                scrollTrigger: {
                    trigger: ".horizontal-scroll-section",
                    start: "top top",
                    end: () => `+=${trackWidth}`,
                    pin: true,
                    scrub: 1,
                    invalidateOnRefresh: true
                }
            });
        }
        
        const scrollCue = document.querySelector('.scroll-down-cue');
        if (scrollCue) {
            setTimeout(() => {
                scrollCue.classList.add('visible');
            }, 2000);

            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    scrollCue.style.opacity = '0';
                } else {
                     scrollCue.style.opacity = '0.7';
                }
            }, { once: true });
        }

    } catch (error) {
        console.error("An error occurred during initialization:", error);
    }
}

// Start the process
runWhenReady();