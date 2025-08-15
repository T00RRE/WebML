// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navOverlay = document.querySelector('.nav-overlay');
const closeMenuBtn = document.querySelector('.close-menu');
const navLinksMain = document.querySelectorAll('.nav-links a');
const langSwitchers = document.querySelectorAll('.lang');
const auditForm = document.querySelector('#audit-form');

console.log('Hamburger:', hamburger);
console.log('Nav overlay:', navOverlay);
console.log('Close button:', closeMenuBtn);
console.log('Nav links:', navLinksMain);

// Safety: ensure hamburger and overlay stacking and pointer events so clicks reach the hamburger
if (hamburger) {
    try {
        hamburger.style.zIndex = '10002';
        hamburger.style.pointerEvents = 'auto';
    } catch (err) {
        console.warn('Could not set hamburger inline styles', err);
    }
}
if (navOverlay) {
    try {
        // ensure overlay is below hamburger but above content
        navOverlay.style.zIndex = '10000';
    } catch (err) {
        console.warn('Could not set navOverlay inline styles', err);
    }
}

// Mobile menu toggle - ZAKTUALIZOWANA FUNKCJA
function toggleMenu() {
    console.log('toggleMenu called. Before toggle - hamburger active?', hamburger && hamburger.classList.contains('active'), 'navOverlay active?', navOverlay && navOverlay.classList.contains('active'));
    hamburger.classList.toggle('active');
    navOverlay.classList.toggle('active');
    // Toggle body class to prevent scrolling and allow CSS rules (e.g. hide hamburger)
    document.body.classList.toggle('menu-open');
    console.log('toggleMenu finished. After toggle - hamburger active?', hamburger && hamburger.classList.contains('active'), 'navOverlay active?', navOverlay && navOverlay.classList.contains('active'));
    
    // Lepsza obsługa blokady scrolla
    if (navOverlay.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
    } else {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
    }
}

// Close menu - ZAKTUALIZOWANA FUNKCJA
function closeMenu() {
    hamburger.classList.remove('active');
    navOverlay.classList.remove('active');
    // Ensure body class is removed
    document.body.classList.remove('menu-open');
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
}

// Event Listeners - ZAKTUALIZOWANE
if (hamburger) {
    hamburger.addEventListener('click', function(e) {
        console.log('hamburger clicked, event target:', e.target, 'this:', this);
        e.stopPropagation(); // Zapobiega bąbelkowaniu
        toggleMenu();
    });
    console.log('hamburger click handler attached');
} else {
    console.warn('Hamburger element not found when attaching click handler');
}

if (closeMenuBtn) {
    closeMenuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        closeMenu();
    });
}

// Close menu when clicking on nav links - ZAKTUALIZOWANE
navLinksMain.forEach(link => {
    link.addEventListener('click', function(e) {
        // Najpierw zamknij menu
        closeMenu();
        
        // Potem obsłuż scroll
        const targetId = this.getAttribute('href');
        if (targetId.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(targetId);
            if (target) {
                setTimeout(() => { // Małe opóźnienie dla płynności
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 300);
            }
        }
    });
});

// Close menu when clicking outside - ZAKTUALIZOWANE
document.addEventListener('click', function(e) {
    if (navOverlay.classList.contains('active') && 
        !e.target.closest('.nav-overlay') && 
        !e.target.closest('.hamburger')) {
        closeMenu();
    }
});

// Close menu with Escape key - BEZ ZMIAN (działa dobrze)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navOverlay.classList.contains('active')) {
        closeMenu();
    }
});

// Language switcher
langSwitchers.forEach(lang => {
    lang.addEventListener('click', () => {
        // Remove active class from all language options
        langSwitchers.forEach(l => l.classList.remove('active'));
        
        // Add active class to clicked language
        lang.classList.add('active');
        
        // Get selected language
        const selectedLang = lang.getAttribute('data-lang');
        
        // Store in localStorage
        localStorage.setItem('selectedLanguage', selectedLang);
        
        // Here you would implement actual language switching
        console.log('Language switched to:', selectedLang);
        
        // Example: You could call a function to change page content
        // switchLanguage(selectedLang);
    });
});

// Initialize language from localStorage
function initializeLanguage() {
    const savedLang = localStorage.getItem('selectedLanguage');
    if (savedLang) {
        const langElement = document.querySelector(`[data-lang="${savedLang}"]`);
        if (langElement) {
            langSwitchers.forEach(l => l.classList.remove('active'));
            langElement.classList.add('active');
        }
    }
}

// Form submission
if (auditForm) {
    auditForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        
        // Add loading state
        submitBtn.classList.add('loading');
        submitBtn.textContent = 'Wysyłanie...';
        submitBtn.disabled = true;
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Simulate API call
        setTimeout(() => {
            // Remove loading state
            submitBtn.classList.remove('loading');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Show success message
            showNotification('Dziękuję! Audyt zostanie wysłany w ciągu 24h na podany email.', 'success');
            
            // Reset form
            this.reset();
            
            console.log('Form data:', data);
            
            // Here you would send data to your backend
            // sendAuditRequest(data);
            
        }, 2000);
    });
console.log('Language initialized');
    console.log('Hamburger element:', hamburger);
    console.log('Nav overlay element:', navOverlay);
    console.log('Close button element:', closeMenuBtn);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--sand-primary)' : 'var(--dark-secondary)'};
        color: ${type === 'success' ? 'var(--dark-primary)' : 'var(--text-light)'};
        padding: 1rem 1.5rem;
        border: 1px solid ${type === 'success' ? 'var(--sand-light)' : 'var(--sand-semi)'};
        box-shadow: 0 10px 25px var(--shadow-heavy);
        z-index: 10000;
        max-width: 400px;
        backdrop-filter: blur(10px);
        animation: slideInRight 0.3s ease;
    `;
    
    // Append to body
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Smooth scrolling for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll animations
function animateOnScroll() {
    const elements = document.querySelectorAll('.problem-point, .benefit, .portfolio-item, .service-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        observer.observe(element);
    });
}

// Form validation
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        const value = field.value.trim();
        const fieldGroup = field.closest('.form-group');
        
        // Remove existing error states
        fieldGroup.classList.remove('error');
        
        if (!value) {
            fieldGroup.classList.add('error');
            isValid = false;
        } else if (field.type === 'email' && !isValidEmail(value)) {
            fieldGroup.classList.add('error');
            isValid = false;
        } else if (field.type === 'url' && !isValidURL(value)) {
            fieldGroup.classList.add('error');
            isValid = false;
        }
    });
    
    return isValid;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// URL validation
function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}


// Parallax effect for background images
function initParallax() {
    const sections = document.querySelectorAll('.problem, .solution, .portfolio, .services, .audit-form');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const speed = 0.5;
            
            if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
                const yPos = -(scrolled * speed);
                section.style.backgroundPosition = `center ${yPos}px`;
            }
        });
    });
}

// Copy to clipboard functionality
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Skopiowano do schowka!', 'success');
    }).catch(() => {
        showNotification('Nie udało się skopiować', 'error');
    });
}

// Header scroll effect
function handleHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;

    // Ustaw stan początkowy
    header.classList.toggle('scrolled', window.scrollY > 100);

    // Nasłuchiwanie scrolla, używamy toggle z warunkiem dla wydajności
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 100);
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeLanguage();
    animateOnScroll();
    handleHeaderScroll();
    initParallax();
    
    console.log('MLWeb - Website loaded successfully! 🚀');
});

// Add CSS for animations if not already present
if (!document.querySelector('#dynamic-animations')) {
    const style = document.createElement('style');
    style.id = 'dynamic-animations';
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .notification-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
        }
        
        .notification-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: inherit;
            opacity: 0.7;
            transition: opacity 0.3s ease;
        }
        
        .notification-close:hover {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
}