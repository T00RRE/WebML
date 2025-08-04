// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navOverlay = document.querySelector('.nav-overlay');
const closeMenuBtn = document.querySelector('.close-menu');
const navLinks = document.querySelectorAll('.nav-links a');
const langSwitchers = document.querySelectorAll('.lang');
const auditForm = document.querySelector('#audit-form');

// Mobile menu toggle
function toggleMenu() {
    hamburger.classList.toggle('active');
    navOverlay.classList.toggle('active');
    document.body.style.overflow = navOverlay.classList.contains('active') ? 'hidden' : '';
}

// Close menu
function closeMenu() {
    hamburger.classList.remove('active');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Event Listeners
if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
}

if (closeMenuBtn) {
    closeMenuBtn.addEventListener('click', closeMenu);
}

// Close menu when clicking on nav links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        closeMenu();
        
        // Smooth scroll to target
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Close menu when clicking outside
navOverlay.addEventListener('click', (e) => {
    if (e.target === navOverlay) {
        closeMenu();
    }
});

// Close menu with Escape key
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