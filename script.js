function runWhenReady() {
    if (typeof gsap === 'undefined' || typeof Lenis === 'undefined' || typeof ScrollTrigger === 'undefined') {
        setTimeout(runWhenReady, 100);
        return;
    }

    // --- All libraries are loaded, proceed with initialization ---
    
    const preloader = document.querySelector('.preloader');
    const content = document.querySelector('main');
    
    // Add initial styles to content
    if (content) {
        content.style.opacity = '0';
        content.style.transform = 'translateY(20px)';
        content.style.transition = 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
    }
    
    if (preloader) {
        preloader.style.opacity = '0';
        preloader.addEventListener('transitionend', () => {
            preloader.style.display = 'none';
            
            // Fade in content with slight delay
            if (content) {
                content.style.opacity = '1';
                content.style.transform = 'translateY(0)';
            }
        });
    }
    document.body.classList.add('loaded');

    try {
        // Initialize smooth scrolling with Apple-like physics
        const lenis = new Lenis({
            duration: 1.4,
            easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)), // Exponential ease-out for Apple-like deceleration
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 0.8, // Slightly reduced for more precise control
            smoothTouch: true,  // Enable smooth scrolling on touch devices
            touchMultiplier: 1.5,
            infinite: false,
            orientation: 'vertical',
            smoothWheel: true,
            normalizeWheel: true,
            wheelMultiplier: 0.8, // Slightly reduced for more precise control
        });
        
        // RAF loop for smooth animations
        function animate(time) {
            lenis.raf(time);
            requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
        
        // Add scroll listener for scroll-based effects
        lenis.on('scroll', (e) => {
            // Update scroll-based animations
            updateParallaxElements();
        });
        
        // Function to update parallax elements
        function updateParallaxElements() {
            const scrollPosition = lenis.scroll;
            const parallaxElements = document.querySelectorAll('.parallax');
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.1;
                const yPos = -scrollPosition * speed;
                element.style.transform = `translateY(${yPos}px)`;
            });
        }

        // Enhanced custom cursor with Apple-like motion
        const cursor = document.querySelector('.cursor');
        const cursorGrowElements = document.querySelectorAll('a, button, .skill-tag, .project-item, .cert-item, .bento-item, .social-link');

        // Variables for smooth cursor movement
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        // Custom cursor with smooth interpolation
        document.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Animate cursor with requestAnimationFrame for smoother motion
        function animateCursor() {
            // Calculate the distance between current cursor position and target mouse position
            const dx = mouseX - cursorX;
            const dy = mouseY - cursorY;
            
            // Apply easing (Apple-like smoothing)
            cursorX += dx * 0.2;
            cursorY += dy * 0.2;
            
            // Apply the position with transform for better performance
            cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
            
            // Continue the animation loop
            requestAnimationFrame(animateCursor);
        }

        // Start the cursor animation
        animateCursor();

        // Enhanced hover effects
        cursorGrowElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-grow');
                // Add subtle scale effect to the hovered element
                element.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                element.style.transform = 'scale(1.02)';
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-grow');
                // Reset the scale effect
                element.style.transform = '';
            });
        });

        // GSAP Animations with Apple-like motion and timing
        gsap.registerPlugin(ScrollTrigger);
        
        // Apple-like easing functions
        const appleEaseOut = "power3.out";
        const appleEaseInOut = "power2.inOut";
        
        // Staggered reveal animations for elements with .gsap-reveal class
        const revealElements = gsap.utils.toArray('.gsap-reveal');
        revealElements.forEach((element, index) => {
            gsap.fromTo(element, 
                { 
                    y: 30, 
                    opacity: 0,
                    scale: 0.98
                }, 
                { 
                    y: 0, 
                    opacity: 1,
                    scale: 1,
                    duration: 1.2, 
                    delay: index * 0.05, // Subtle stagger effect
                    ease: appleEaseOut,
                    scrollTrigger: {
                        trigger: element,
                        start: "top 85%",
                        toggleActions: "play none none none",
                        markers: false
                    }
                }
            );
        });
        
        // Text reveal animations with refined timing
        gsap.to(".gsap-reveal-line", {
            y: "0%", opacity: 1, stagger: 0.08, duration: 1.2,
            ease: appleEaseOut, delay: 0.5
        });
        
        // Enhanced parallax effect on hero section
        gsap.to("#hero", {
            scale: 0.95, opacity: 0.5,
            scrollTrigger: { trigger: "#hero", start: "bottom bottom", end: "bottom top", scrub: 0.5 }
        });
        
        // Horizontal scroll section with improved physics
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
                    scrub: 0.5, // Smoother scrubbing for Apple-like motion
                    invalidateOnRefresh: true
                }
            });
        }
        
        // Enhanced scroll cue animation
        const scrollCue = document.querySelector('.scroll-down-cue');
        if (scrollCue) {
            // Initial animation to draw attention
            gsap.fromTo(scrollCue, 
                { y: -10, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, delay: 0.5, ease: appleEaseOut }
            );
            
            setTimeout(() => {
                scrollCue.classList.add('visible');
            }, 2000);

            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    scrollCue.style.opacity = '0';
                    scrollCue.style.pointerEvents = 'none';
                } else {
                    scrollCue.style.opacity = '0.7';
                    scrollCue.style.pointerEvents = 'auto';
                }
            }, { once: true });
        }
        
        // Initialize theme switcher
        initThemeSwitcher();
        
        // Theme switcher functionality
        function initThemeSwitcher() {
            // Create theme switcher element
            const themeSwitcher = document.createElement('div');
            themeSwitcher.className = 'theme-switcher';
            themeSwitcher.innerHTML = `
                <div class="theme-switcher-toggle">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 2V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 20V22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M4.93 4.93L6.34 6.34" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M17.66 17.66L19.07 19.07" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M2 12H4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M20 12H22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M6.34 17.66L4.93 19.07" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M19.07 4.93L17.66 6.34" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div class="theme-options">
                    <button class="theme-option" data-theme="midnight">Midnight</button>
                    <button class="theme-option" data-theme="titanium">Titanium</button>
                    <button class="theme-option" data-theme="starlight">Starlight</button>
                </div>
            `;
            document.body.appendChild(themeSwitcher);
            
            // Toggle theme options visibility
            const themeToggle = themeSwitcher.querySelector('.theme-switcher-toggle');
            const themeOptions = themeSwitcher.querySelector('.theme-options');
            
            themeToggle.addEventListener('click', () => {
                themeOptions.classList.toggle('active');
            });
            
            // Theme switching functionality
            const themeButtons = themeSwitcher.querySelectorAll('.theme-option');
            themeButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const theme = button.dataset.theme;
                    document.documentElement.setAttribute('data-theme', theme);
                    localStorage.setItem('theme', theme);
                    themeOptions.classList.remove('active');
                    
                    // Update active state
                    themeButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                });
            });
            
            // Set initial theme from localStorage or default to 'midnight'
            const savedTheme = localStorage.getItem('theme') || 'midnight';
            document.documentElement.setAttribute('data-theme', savedTheme);
            
            // Set active state for current theme
            const currentThemeButton = Array.from(themeButtons).find(btn => btn.dataset.theme === savedTheme);
            if (currentThemeButton) {
                currentThemeButton.classList.add('active');
            }
            
            // Close theme options when clicking outside
            document.addEventListener('click', (e) => {
                if (!themeSwitcher.contains(e.target)) {
                    themeOptions.classList.remove('active');
                }
            });
        }

    } catch (error) {
        console.error("An error occurred during initialization:", error);
    }
}

// Start the process
runWhenReady();