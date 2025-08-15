document.addEventListener('DOMContentLoaded', () => {
            // Smooth scrolling for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });

            // Mobile menu toggle (basic) - scoped variables to avoid collisions
            const ssHamburger = document.querySelector('.hamburger');
            const ssNavLinks = document.querySelector('.nav-links');

            if (ssHamburger && ssNavLinks) {
                ssHamburger.addEventListener('click', () => {
                    ssNavLinks.style.display = ssNavLinks.style.display === 'flex' ? 'none' : 'flex';
                });
            }

            // Form submission (placeholder) - target specific form to avoid conflicts
            const auditForm = document.querySelector('#audit-form');
            if (auditForm) {
                auditForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    alert('Dziękuję! Audyt zostanie wysłany w ciągu 24h na podany email.');
                });
            }
        });