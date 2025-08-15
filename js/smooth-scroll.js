// Smooth scrolling for anchor links
document.querySelectorAll('a.smooth-scroll').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (!href) return;

        // Only intercept hash anchors (same-page) — allow normal navigation for other pages
        if (href.startsWith('#')) {
            e.preventDefault();
            if (href === '#') return;

            const targetElement = document.querySelector(href);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 60,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navOverlay = document.querySelector('.nav-overlay');
                const hamburger = document.querySelector('.hamburger');
                if (navOverlay) navOverlay.classList.remove('active');
                if (hamburger) hamburger.classList.remove('active');
            }
        } else {
            // External page link: close overlay/hamburger (visual cleanup) and allow navigation
            const navOverlay = document.querySelector('.nav-overlay');
            const hamburger = document.querySelector('.hamburger');
            if (navOverlay) navOverlay.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
            // Do not call e.preventDefault() so browser navigates
        }
    });
});

// Add active class to current section in viewport
const sections = document.querySelectorAll('section');
const navLinksScroll = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinksScroll.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
    
    // Header scroll effect
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Section fade-in animation
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop < window.innerHeight - 100) {
            section.classList.add('active');
        }
    });
});