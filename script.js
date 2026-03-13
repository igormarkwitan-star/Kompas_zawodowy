// Dark mode toggle
const themeToggleBtn = document.getElementById('themeToggleBtn');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggleBtn.addEventListener('click', () => {
    const theme = htmlElement.getAttribute('data-theme');
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    const icon = themeToggleBtn.querySelector('i');
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mainNav = document.getElementById('mainNav');

mobileMenuBtn.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    mobileMenuBtn.innerHTML = mainNav.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
});

// Close mobile menu when clicking a link
document.querySelectorAll('#mainNav a').forEach(link => {
    link.addEventListener('click', () => {
        mainNav.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Filter professions
const filterButtons = document.querySelectorAll('.filter-btn');
const professionCards = document.querySelectorAll('.profession-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const filter = button.getAttribute('data-filter');
        
        professionCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });

        const grid = document.querySelector('.professions-grid');
        const visibleCount = document.querySelectorAll('.profession-card.active').length;
        if (visibleCount === 1) {
            grid.classList.add('single-active');
        } else {
            grid.classList.remove('single-active');
        }
    });
});

// ========== KOD CAPTCHA ==========
let czyCaptcha = false; // Globalna zmienna

// Inicjalizacja EmailJS i obsługa formularza
document.addEventListener('DOMContentLoaded', () => {
    // Initialize single-active state
    const grid = document.querySelector('.professions-grid');
    const visibleCount = document.querySelectorAll('.profession-card.active').length;
    if (visibleCount === 1) grid.classList.add('single-active');
    
    // Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init("pDzg684W5O2i-3mUd");
    } else {
        console.error("EmailJS nie jest załadowany!");
    }
    
    // Initialize CAPTCHA observer
    initCaptchaObserver();
    
    // Handle contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Sprawdź czy captcha jest rozwiązana
            if (!czyCaptcha) {
                alert('Proszę rozwiązać captcha');
                return;
            }
            
            // Wyświetl informację o wysyłaniu
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Wysyłanie...';
            submitBtn.disabled = true;
            
            emailjs.sendForm("service_xzlqxac", "template_i100iw9", this)
                .then(function(response) {
                    console.log("Sukces:", response);
                    
                    // Ukryj formularz i pokaż podziękowanie
                    const contactSection = document.getElementById('contact');
                    const contactForm = document.getElementById('contactForm');
                    const thankYouMessage = document.getElementById('thankYouMessage');
                    
                    if (contactForm) contactForm.style.display = 'none';
                    if (thankYouMessage) {
                        thankYouMessage.style.display = 'block';
                    } else {
                        // Jeśli nie ma elementu z podziękowaniem, stwórz go
                        const thankYouDiv = document.createElement('div');
                        thankYouDiv.id = 'thankYouMessage';
                        thankYouDiv.className = 'thank-you-message';
                        thankYouDiv.innerHTML = `
                            <i class="fas fa-check-circle"></i>
                            <h3>Dziękujemy za wiadomość!</h3>
                            <p>Odpowiemy najszybciej jak to możliwe.</p>
                            <button onclick="resetFormAndReturn()" class="btn return-home-btn">Wróć do strony głównej</button>
                        `;
                        contactSection.querySelector('.contact-content').appendChild(thankYouDiv);
                    }
                    
                    // Przewiń do sekcji kontakt, żeby pokazać podziękowanie
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                })
                .catch(function(error) {
                    console.error("Błąd:", error);
                    alert("Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie później lub napisz bezpośrednio na kompas.zawodowy9@gmail.com");
                })
                .finally(function() {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
        });
    }
});

// Inicjalizacja observera CAPTCHA
function initCaptchaObserver() {
    const submitBtn = document.getElementById('submit');
    if (!submitBtn) {
        console.warn("Przycisk submit nie został znaleziony");
        return;
    }
    
    // Funkcja do sprawdzania statusu
    function checkCaptchaStatus() {
        const captchaStatus = document.querySelector('.xsukax-captcha-status');
        if (captchaStatus && submitBtn) {
            console.log('Status captcha:', captchaStatus.innerText);
            
            if (captchaStatus.innerText.includes('success') || 
                captchaStatus.innerText.includes('Verification successful')) {
                submitBtn.style.display = 'block';
                czyCaptcha = true;
                return true;
            } else {
                submitBtn.style.display = 'none';
                czyCaptcha = false;
                return false;
            }
        }
        return false;
    }
    
    // Sprawdź od razu
    checkCaptchaStatus();
    
    // Obserwuj zmiany w statusie
    const observer = new MutationObserver(() => {
        checkCaptchaStatus();
    });
    
    // Obserwuj całe body na pojawienie się elementu status
    const bodyObserver = new MutationObserver(() => {
        const captchaStatus = document.querySelector('.xsukax-captcha-status');
        if (captchaStatus) {
            observer.observe(captchaStatus, { 
                childList: true, 
                subtree: true, 
                characterData: true 
            });
            bodyObserver.disconnect(); // Przestań obserwować body
            checkCaptchaStatus();
        }
    });
    
    bodyObserver.observe(document.body, { 
        childList: true, 
        subtree: true 
    });
}

// Funkcja do obsługi checkboxa RODO
function pojawienie(numer) {
    if (numer == 1) {
        const captcha = document.getElementById('captcha');
        const czy = document.getElementById('rodoCheck');
        const submit = document.getElementById('submit');
        
        if (!captcha || !czy || !submit) return;
        
        if (czy.checked) {
            captcha.style.display = 'block';
            // Nie pokazuj submit od razu - captcha musi być rozwiązana
        } else {
            captcha.style.display = 'none';
            submit.style.display = 'none';
            czyCaptcha = false;
        }
    }
}

// Funkcja do resetowania formularza i powrotu (z implementacją rozwiązania 1)
function resetFormAndReturn() {
    const contactForm = document.getElementById('contactForm');
    const thankYouMessage = document.getElementById('thankYouMessage');
    const captcha = document.getElementById('captcha');
    const rodoCheck = document.getElementById('rodoCheck');
    const submit = document.getElementById('submit');
    const contactSection = document.getElementById('contact');
    
    if (contactForm) {
        contactForm.reset();
        contactForm.style.display = 'block';
    }
    if (thankYouMessage) {
        thankYouMessage.style.display = 'none';
    }
    if (captcha) {
        captcha.style.display = 'none';
    }
    if (rodoCheck) {
        rodoCheck.checked = false;
    }
    if (submit) {
        submit.style.display = 'none';
    }
    
    czyCaptcha = false;
    
    // === ROZWIĄZANIE 1: Resetuj wszystkie instancje CAPTCHA ===
    if (typeof xsukaxCAPTCHA !== 'undefined' && xsukaxCAPTCHA.resetAll) {
        try {
            xsukaxCAPTCHA.resetAll();
            console.log('CAPTCHA została zresetowana przez xsukaxCAPTCHA.resetAll()');
        } catch (error) {
            console.error('Błąd podczas resetowania CAPTCHA:', error);
        }
    } else {
        console.warn('xsukaxCAPTCHA nie jest dostępne - upewnij się że biblioteka jest załadowana');
        
        // Fallback: ręczne znalezienie i kliknięcie przycisku odświeżania
        try {
            const refreshBtn = document.querySelector('.xsukax-captcha-wrapper button[title="New Challenge"]');
            if (refreshBtn) {
                refreshBtn.click();
                console.log('CAPTCHA zresetowana przez kliknięcie przycisku odświeżania');
            }
        } catch (error) {
            console.error('Nie udało się zresetować CAPTCHA przez fallback:', error);
        }
    }
    
    // Przewiń do sekcji kontakt
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Dodatkowa funkcja pomocnicza do ręcznego resetowania CAPTCHA (opcjonalnie)
function manualResetCaptcha() {
    if (typeof xsukaxCAPTCHA !== 'undefined' && xsukaxCAPTCHA.resetAll) {
        xsukaxCAPTCHA.resetAll();
        return true;
    }
    return false;
}

// Eksportuj funkcje do globalnego zasięgu (jeśli potrzebne)
window.resetFormAndReturn = resetFormAndReturn;
window.pojawienie = pojawienie;
window.manualResetCaptcha = manualResetCaptcha;
