document.addEventListener('DOMContentLoaded', function() {
    // Initialize parallax effect
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    
    // Check if prefers-reduced-motion is enabled
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.pageYOffset;
            
            parallaxElements.forEach(function(element) {
                const parallaxSpeed = element.dataset.speed || 0.5;
                const elementOffset = element.offsetTop;
                const elementHeight = element.offsetHeight;
                
                // Only apply parallax when element is in viewport
                if (scrollPosition > elementOffset - window.innerHeight && 
                    scrollPosition < elementOffset + elementHeight) {
                    const yPos = -(scrollPosition - elementOffset) * parallaxSpeed;
                    element.style.backgroundPosition = `center ${yPos}px`;
                }
            });
        });
    }
    
    // Add data-speed attribute to parallax elements
    parallaxElements.forEach((element, index) => {
        element.setAttribute('data-speed', (index * 0.1 + 0.3).toFixed(1));
    });
});