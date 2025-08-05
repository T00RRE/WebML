// CONTACT PAGE FUNCTIONALITY

document.addEventListener('DOMContentLoaded', function() {
    initFormTabs();
    initFAQ();
    initContactForms();
});

// FORM TABS FUNCTIONALITY
function initFormTabs() {
    const formTabs = document.querySelectorAll('.form-tab');
    const contactForms = document.querySelectorAll('.contact-form');

    formTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetForm = tab.getAttribute('data-form');
            
            // Remove active class from all tabs and forms
            formTabs.forEach(t => t.classList.remove('active'));
            contactForms.forEach(f => f.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding form
            tab.classList.add('active');
            document.getElementById(`${targetForm}-form`).classList.add('active');
        });
    });
}

// FAQ FUNCTIONALITY
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faqItem => faqItem.classList.remove('active'));
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// CONTACT FORMS FUNCTIONALITY
function initContactForms() {
    const forms = document.querySelectorAll('.contact-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });
}

// FORM SUBMISSION HANDLER
function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formType = form.getAttribute('data-form-type');
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    // Validate form
    if (!validateContactForm(form)) {
        showNotification('Proszę wypełnić wszystkie wymagane pola', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.textContent = 'Wysyłanie...';
    submitBtn.disabled = true;
    
    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    data.formType = formType;
    
    // Simulate API call
    setTimeout(() => {
        // Remove loading state
        submitBtn.classList.remove('loading');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Show success message based on form type
        const successMessages = {
            general: 'Dziękuję za wiadomość! Odpowiemy w ciągu 2h.',
            project: 'Dziękuję za zapytanie! Przygotujemy wycenę w 24h.',
            audit: 'Dziękuję! Audyt zostanie wysłany w ciągu 24h na podany email.'
        };
        
        showNotification(successMessages[formType] || 'Wiadomość została wysłana!', 'success');
        
        // Reset form
        form.reset();
        
        // Log form data for development
        console.log(`${formType} form submitted:`, data);
        
        // Here you would send data to your backend
        // sendContactForm(data);
        
    }, 2000);
}

// FORM VALIDATION
function validateContactForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    // Clear previous errors
    form.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
    });
    
    requiredFields.forEach(field => {
        const value = field.value.trim();
        const fieldGroup = field.closest('.form-group');
        
        if (!value) {
            fieldGroup.classList.add('error');
            isValid = false;
        } else if (field.type === 'email' && !isValidEmail(value)) {
            fieldGroup.classList.add('error');
            isValid = false;
        } else if (field.type === 'url' && value && !isValidURL(value)) {
            fieldGroup.classList.add('error');
            isValid = false;
        } else if (field.type === 'tel' && value && !isValidPhone(value)) {
            fieldGroup.classList.add('error');
            isValid = false;
        }
    });
    
    return isValid;
}

// VALIDATION HELPERS
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{9,}$/;
    return phoneRegex.test(phone);
}

// NOTIFICATION SYSTEM (enhanced from main.js)
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const iconMap = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${iconMap[type] || 'ℹ️'}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles based on type
    const colorMap = {
        success: { bg: 'var(--sand-primary)', text: 'var(--dark-primary)' },
        error: { bg: '#ff6b6b', text: 'white' },
        warning: { bg: '#ffa726', text: 'var(--dark-primary)' },
        info: { bg: 'var(--dark-secondary)', text: 'var(--text-light)' }
    };
    
    const colors = colorMap[type] || colorMap.info;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${colors.bg};
        color: ${colors.text};
        padding: 1rem 1.5rem;
        border: 1px solid ${type === 'success' ? 'var(--sand-light)' : colors.bg};
        box-shadow: 0 10px 25px var(--shadow-heavy);
        z-index: 10000;
        max-width: 400px;
        backdrop-filter: blur(10px);
        animation: slideInRight 0.3s ease;
        border-radius: 8px;
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

// COPY CONTACT INFO TO CLIPBOARD
function copyContactInfo(text, type) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification(`${type} skopiowany do schowka!`, 'success');
    }).catch(() => {
        showNotification('Nie udało się skopiować', 'error');
    });
}

// ADD CLICK TO COPY FUNCTIONALITY
document.addEventListener('DOMContentLoaded', function() {
    // Add copy functionality to contact links
    const contactLinks = document.querySelectorAll('.contact-link');
    contactLinks.forEach(link => {
        if (link.href && (link.href.includes('mailto:') || link.href.includes('tel:'))) {
            link.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                const text = link.href.includes('mailto:') 
                    ? link.href.replace('mailto:', '') 
                    : link.href.replace('tel:', '');
                const type = link.href.includes('mailto:') ? 'Email' : 'Telefon';
                copyContactInfo(text, type);
            });
        }
    });
});

// FORM AUTO-SAVE (optional)
function initFormAutoSave() {
    const forms = document.querySelectorAll('.contact-form');
    
    forms.forEach(form => {
        const formType = form.getAttribute('data-form-type');
        const inputs = form.querySelectorAll('input, select, textarea');
        
        // Load saved data
        loadFormData(form, formType);
        
        // Save data on input
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                saveFormData(form, formType);
            });
        });
        
        // Clear saved data on successful submit
        form.addEventListener('submit', () => {
            setTimeout(() => {
                clearFormData(formType);
            }, 3000); // Clear after successful submit
        });
    });
}

function saveFormData(form, formType) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    localStorage.setItem(`mlweb_form_${formType}`, JSON.stringify(data));
}

function loadFormData(form, formType) {
    const savedData = localStorage.getItem(`mlweb_form_${formType}`);
    if (savedData) {
        const data = JSON.parse(savedData);
        Object.keys(data).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field && data[key]) {
                field.value = data[key];
            }
        });
    }
}

function clearFormData(formType) {
    localStorage.removeItem(`mlweb_form_${formType}`);
}

// FORM FIELD ENHANCEMENTS
function initFormEnhancements() {
    // Phone number formatting
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.startsWith('48')) {
                value = '+' + value;
            } else if (value.length > 0 && !value.startsWith('+')) {
                value = '+48' + value;
            }
            e.target.value = value;
        });
    });
    
    // URL validation and formatting
    const urlInputs = document.querySelectorAll('input[type="url"]');
    urlInputs.forEach(input => {
        input.addEventListener('blur', (e) => {
            let value = e.target.value.trim();
            if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
                e.target.value = 'https://' + value;
            }
        });
    });
    
    // Character count for textareas
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        const maxLength = textarea.getAttribute('maxlength');
        if (maxLength) {
            const counter = document.createElement('div');
            counter.className = 'char-counter';
            counter.style.cssText = `
                text-align: right;
                font-size: 0.8rem;
                color: var(--text-muted);
                margin-top: 0.5rem;
            `;
            textarea.parentNode.appendChild(counter);
            
            function updateCounter() {
                const remaining = maxLength - textarea.value.length;
                counter.textContent = `${textarea.value.length}/${maxLength}`;
                counter.style.color = remaining < 50 ? '#ff6b6b' : 'var(--text-muted)';
            }
            
            textarea.addEventListener('input', updateCounter);
            updateCounter();
        }
    });
}

// SMART FORM SUGGESTIONS
function initSmartSuggestions() {
    // Industry-based project suggestions
    const industrySelect = document.querySelector('#proj-type');
    const descriptionTextarea = document.querySelector('#proj-description');
    
    if (industrySelect && descriptionTextarea) {
        const suggestions = {
            'landing': 'Jedna strona z formularzem kontaktowym, sekcjami: o nas, usługi, kontakt. Idealna do promocji konkretnej usługi lub produktu.',
            'multilingual': 'Strona w wielu językach z profesjonalnymi tłumaczeniami. Dobra do ekspansji zagranicznej.',
            'comprehensive': 'Kompleksowa witryna z CMS, blogiem, galeriami. Pełna prezentacja firmy z możliwością samodzielnego zarządzania treścią.',
            'ecommerce': 'Sklep internetowy z koszykiem, płatnościami online, zarządzaniem produktami i zamówieniami.'
        };
        
        industrySelect.addEventListener('change', (e) => {
            const suggestion = suggestions[e.target.value];
            if (suggestion && !descriptionTextarea.value.trim()) {
                descriptionTextarea.placeholder = suggestion;
            }
        });
    }
}

// PROGRESSIVE FORM DISCLOSURE
function initProgressiveDisclosure() {
    const projectForm = document.querySelector('#project-form');
    if (!projectForm) return;
    
    const budgetSelect = projectForm.querySelector('#proj-budget');
    const typeSelect = projectForm.querySelector('#proj-type');
    const additionalFields = document.createElement('div');
    additionalFields.className = 'additional-fields';
    additionalFields.style.display = 'none';
    
    // Add additional fields based on selections
    function showAdditionalFields() {
        const budget = budgetSelect?.value;
        const type = typeSelect?.value;
        
        if ((budget && parseInt(budget.split('-')[0]) >= 3000) || type === 'comprehensive' || type === 'ecommerce') {
            additionalFields.style.display = 'block';
            
            if (!additionalFields.innerHTML) {
                additionalFields.innerHTML = `
                    <div class="form-group">
                        <label for="additional-features">Dodatkowe funkcje (opcjonalnie)</label>
                        <textarea id="additional-features" name="additional_features" 
                                placeholder="Np. system rezerwacji, płatności online, integracje z systemami zewnętrznymi..." 
                                rows="3"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="design-preferences">Preferencje designu (opcjonalnie)</label>
                        <textarea id="design-preferences" name="design_preferences" 
                                placeholder="Np. preferowane kolory, style, przykłady stron które się podobają..." 
                                rows="2"></textarea>
                    </div>
                `;
                
                // Insert before submit button
                const submitBtn = projectForm.querySelector('.submit-btn');
                submitBtn.parentNode.insertBefore(additionalFields, submitBtn);
            }
        } else {
            additionalFields.style.display = 'none';
        }
    }
    
    budgetSelect?.addEventListener('change', showAdditionalFields);
    typeSelect?.addEventListener('change', showAdditionalFields);
}

// INITIALIZE ALL ENHANCEMENTS
document.addEventListener('DOMContentLoaded', function() {
    initFormAutoSave();
    initFormEnhancements();
    initSmartSuggestions();
    initProgressiveDisclosure();
    
    console.log('MLWeb Contact Page - All features loaded! 📞');
});

// KEYBOARD SHORTCUTS
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to submit active form
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const activeForm = document.querySelector('.contact-form.active');
        if (activeForm) {
            e.preventDefault();
            activeForm.querySelector('.submit-btn').click();
        }
    }
    
    // Ctrl/Cmd + 1,2,3 to switch form tabs
    if ((e.ctrlKey || e.metaKey) && ['1', '2', '3'].includes(e.key)) {
        e.preventDefault();
        const tabIndex = parseInt(e.key) - 1;
        const tabs = document.querySelectorAll('.form-tab');
        if (tabs[tabIndex]) {
            tabs[tabIndex].click();
        }
    }
});