// PORTFOLIO PAGE FUNCTIONALITY

document.addEventListener('DOMContentLoaded', function() {
    initPortfolioFilters();
    initPortfolioHover();
    initScrollAnimations();
    console.log('MLWeb Portfolio - All features loaded! 📊');
});

// PORTFOLIO FILTERS FUNCTIONALITY
function initPortfolioFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterValue = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter portfolio items
            filterPortfolioItems(portfolioItems, filterValue);
        });
    });
}

function filterPortfolioItems(items, filter) {
    items.forEach((item, index) => {
        const categories = item.getAttribute('data-category').split(' ');
        const shouldShow = filter === 'all' || categories.includes(filter);
        
        if (shouldShow) {
            // Add staggered animation delay
            setTimeout(() => {
                item.style.display = 'block';
                item.classList.remove('fade-out');
                item.classList.add('fade-in');
            }, index * 100);
        } else {
            item.classList.remove('fade-in');
            item.classList.add('fade-out');
            
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
}

// PORTFOLIO HOVER ENHANCEMENTS
function initPortfolioHover() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        const overlay = item.querySelector('.portfolio-overlay');
        const image = item.querySelector('.portfolio-image img');
        
        // Enhanced hover effects
        item.addEventListener('mouseenter', () => {
            // Add subtle parallax effect to overlay content
            const info = overlay.querySelector('.portfolio-info');
            info.style.transform = 'translateY(-10px)';
            
            // Add glow effect
            item.style.boxShadow = `0 20px 60px rgba(181, 149, 106, 0.2)`;
        });
        
        item.addEventListener('mouseleave', () => {
            const info = overlay.querySelector('.portfolio-info');
            info.style.transform = 'translateY(0)';
            item.style.boxShadow = '';
        });
        
        // Mouse move parallax effect
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            
            const moveX = (x - 0.5) * 20;
            const moveY = (y - 0.5) * 20;
            
            if (image) {
                image.style.transform = `scale(1.05) translate(${moveX * 0.5}px, ${moveY * 0.5}px)`;
            }
        });
        
        item.addEventListener('mouseleave', () => {
            if (image) {
                image.style.transform = 'scale(1.05)';
            }
        });
    });
}

// SCROLL ANIMATIONS
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Animate portfolio items on scroll
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
    });
    
    // Animate testimonials
    const testimonials = document.querySelectorAll('.testimonial-card');
    testimonials.forEach((testimonial, index) => {
        testimonial.style.opacity = '0';
        testimonial.style.transform = 'translateY(30px)';
        testimonial.style.transition = `all 0.6s ease ${index * 0.2}s`;
        observer.observe(testimonial);
    });
    
    // Animate stats
    const stats = document.querySelectorAll('.stat');
    stats.forEach((stat, index) => {
        stat.style.opacity = '0';
        stat.style.transform = 'translateY(20px)';
        stat.style.transition = `all 0.5s ease ${index * 0.1}s`;
        observer.observe(stat);
    });
}

// PORTFOLIO ITEM CLICK HANDLER
document.addEventListener('click', function(e) {
    const portfolioItem = e.target.closest('.portfolio-item');
    const portfolioLink = e.target.closest('.portfolio-link');
    
    if (portfolioItem && !portfolioLink) {
        // If clicked on portfolio item but not on a link, show project details
        const projectName = portfolioItem.querySelector('h3').textContent;
        showProjectModal(portfolioItem, projectName);
    }
});

// PROJECT MODAL (optional enhancement)
function showProjectModal(item, projectName) {
    const info = item.querySelector('.portfolio-info');
    const description = info.querySelector('.portfolio-description').textContent;
    const metrics = Array.from(info.querySelectorAll('.metric')).map(m => m.textContent);
    
    // Create modal (you can enhance this further)
    const modal = createModal({
        title: projectName,
        description: description,
        metrics: metrics,
        image: item.querySelector('img').src
    });
    
    document.body.appendChild(modal);
}

function createModal({ title, description, metrics, image }) {
    const modal = document.createElement('div');
    modal.className = 'project-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(10px);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div class="modal-content" style="
            background: var(--dark-secondary);
            padding: 3rem;
            max-width: 800px;
            max-height: 80vh;
            overflow-y: auto;
            border: 1px solid var(--sand-semi);
            position: relative;
        ">
            <button class="modal-close" style="
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                color: var(--sand-primary);
                font-size: 1.5rem;
                cursor: pointer;
            ">&times;</button>
            
            <img src="${image}" alt="${title}" style="
                width: 100%;
                height: 200px;
                object-fit: cover;
                margin-bottom: 2rem;
            ">
            
            <h2 style="color: var(--sand-primary); margin-bottom: 1rem;">${title}</h2>
            
            <div class="modal-metrics" style="
                display: flex;
                gap: 1rem;
                margin-bottom: 2rem;
                flex-wrap: wrap;
            ">
                ${metrics.map(metric => `
                    <span style="
                        background: var(--sand-primary);
                        color: var(--dark-primary);
                        padding: 0.5rem 1rem;
                        font-size: 0.9rem;
                        font-weight: 600;
                    ">${metric}</span>
                `).join('')}
            </div>
            
            <p style="
                color: var(--text-light);
                line-height: 1.6;
                margin-bottom: 2rem;
            ">${description}</p>
            
            <div class="modal-actions" style="
                display: flex;
                gap: 1rem;
                justify-content: center;
            ">
                <a href="#" class="modal-btn primary" style="
                    background: var(--sand-primary);
                    color: var(--dark-primary);
                    padding: 1rem 2rem;
                    text-decoration: none;
                    font-weight: 600;
                ">Zobacz stronę</a>
                <a href="#" class="modal-btn secondary" style="
                    background: transparent;
                    color: var(--sand-primary);
                    border: 1px solid var(--sand-primary);
                    padding: 1rem 2rem;
                    text-decoration: none;
                    font-weight: 600;
                ">Case Study</a>
            </div>
        </div>
    `;
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
        modal.style.opacity = '0';
        setTimeout(() => modal.remove(), 300);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.opacity = '0';
            setTimeout(() => modal.remove(), 300);
        }
    });
    
    // Show modal
    setTimeout(() => modal.style.opacity = '1', 10);
    
    return modal;
}

// PERFORMANCE OPTIMIZATION
function initPerformanceOptimizations() {
    // Lazy loading for portfolio images
    const portfolioImages = document.querySelectorAll('.portfolio-item img');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    portfolioImages.forEach(img => {
        if (img.src) {
            img.dataset.src = img.src;
            img.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="%23333"/></svg>';
        }
        imageObserver.observe(img);
    });
}

// SEARCH/FILTER ENHANCEMENT
function initAdvancedSearch() {
    // Create search input (you can add this to HTML)
    const filtersContainer = document.querySelector('.filter-buttons');
    if (!filtersContainer) return;
    
    const searchContainer = document.createElement('div');
    searchContainer.style.cssText = `
        margin-top: 2rem;
        text-align: center;
    `;
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Szukaj projektów...';
    searchInput.style.cssText = `
        padding: 1rem;
        width: 300px;
        max-width: 100%;
        background: rgba(181, 149, 106, 0.1);
        border: 1px solid rgba(181, 149, 106, 0.3);
        color: var(--text-light);
        font-family: 'Poppins', sans-serif;
    `;
    
    searchContainer.appendChild(searchInput);
    filtersContainer.parentNode.insertBefore(searchContainer, filtersContainer.nextSibling);
    
    // Search functionality
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const searchTerm = e.target.value.toLowerCase();
            searchPortfolioItems(searchTerm);
        }, 300);
    });
}

function searchPortfolioItems(searchTerm) {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        const title = item.querySelector('h3').textContent.toLowerCase();
        const category = item.querySelector('.portfolio-category').textContent.toLowerCase();
        const description = item.querySelector('.portfolio-description').textContent.toLowerCase();
        
        const matchesSearch = !searchTerm || 
            title.includes(searchTerm) || 
            category.includes(searchTerm) || 
            description.includes(searchTerm);
        
        if (matchesSearch) {
            item.style.display = 'block';
            item.classList.remove('fade-out');
            item.classList.add('fade-in');
        } else {
            item.classList.remove('fade-in');
            item.classList.add('fade-out');
            setTimeout(() => item.style.display = 'none', 300);
        }
    });
}

// PORTFOLIO STATISTICS COUNTER
function initStatCounter() {
    const stats = document.querySelectorAll('.stat-number');
    
    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                const finalValue = stat.textContent;
                const numValue = parseInt(finalValue);
                
                if (numValue && numValue > 0) {
                    animateCounter(stat, 0, numValue, finalValue.replace(numValue, ''), 2000);
                }
                countObserver.unobserve(stat);
            }
        });
    });
    
    stats.forEach(stat => countObserver.observe(stat));
}

function animateCounter(element, start, end, suffix, duration) {
    const increment = end / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            element.textContent = end + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 16);
}

// KEYBOARD NAVIGATION
function initKeyboardNavigation() {
    let currentIndex = 0;
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName.toLowerCase() === 'input') return;
        
        switch(e.key) {
            case 'ArrowRight':
                e.preventDefault();
                currentIndex = (currentIndex + 1) % portfolioItems.length;
                focusPortfolioItem(currentIndex);
                break;
            case 'ArrowLeft':
                e.preventDefault();
                currentIndex = currentIndex === 0 ? portfolioItems.length - 1 : currentIndex - 1;
                focusPortfolioItem(currentIndex);
                break;
            case 'Enter':
                if (portfolioItems[currentIndex]) {
                    portfolioItems[currentIndex].click();
                }
                break;
        }
    });
}

function focusPortfolioItem(index) {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    // Remove previous focus
    portfolioItems.forEach(item => item.style.outline = '');
    
    // Add focus to current item
    if (portfolioItems[index]) {
        portfolioItems[index].style.outline = '2px solid var(--sand-primary)';
        portfolioItems[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// INITIALIZE ALL FEATURES
document.addEventListener('DOMContentLoaded', function() {
    initPortfolioFilters();
    initPortfolioHover();
    initScrollAnimations();
    initPerformanceOptimizations();
    initAdvancedSearch();
    initStatCounter();
    initKeyboardNavigation();
    
    console.log('MLWeb Portfolio - All advanced features loaded! 🚀');
});

// EXPORT FUNCTIONS FOR POTENTIAL USE
window.MLWebPortfolio = {
    filterPortfolioItems,
    searchPortfolioItems,
    showProjectModal,
    animateCounter
};