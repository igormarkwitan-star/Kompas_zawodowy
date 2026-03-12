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

// Inicjalizacja EmailJS i obsługa formularza
document.addEventListener('DOMContentLoaded', () => {
    // Initialize single-active state
    const grid = document.querySelector('.professions-grid');
    const visibleCount = document.querySelectorAll('.profession-card.active').length;
    if (visibleCount === 1) grid.classList.add('single-active');
    
    // Initialize EmailJS
    emailjs.init("pDzg684W5O2i-3mUd");
    
    // Handle contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Wyświetl informację o wysyłaniu
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Wysyłanie...';
            submitBtn.disabled = true;
            
            emailjs.sendForm("service_xzlqxac", "template_i100iw9", this)
                .then(function(response) {
                    console.log("Sukces:", response);
                    alert("Dziękujemy za wiadomość! Odpowiemy najszybciej jak to możliwe.");
                    location.reload();
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
let czyCaptcha = false;
// Dodaję observer na status captcha
document.addEventListener('DOMContentLoaded', () => {
    const submit = document.getElementById('submit');
    
    // Funkcja do sprawdzania statusu
    function checkCaptchaStatus() {
        const captchaStatus = document.querySelector('.xsukax-captcha-status');
        if (captchaStatus && submit) {
            console.log('Status captcha:', captchaStatus.innerText); // debug
            
            if (captchaStatus.innerText.includes('success') || 
                captchaStatus.innerText.includes('Verification successful')) {
                submit.style.display = 'block';
                czyCaptcha=true
                return true;
            } else {
                submit.style.display = 'none';
                return false;
            }
        }
        return false;
    }
    
    // Sprawdź od razu (może już istnieje)
    if (!checkCaptchaStatus()) {
        // Jeśli nie ma, obserwuj całe body na pojawienie się elementu
        const bodyObserver = new MutationObserver(() => {
            if (checkCaptchaStatus()) {
                bodyObserver.disconnect(); // przestań obserwować gdy znajdzie
            }
        });
        
        bodyObserver.observe(document.body, { 
            childList: true, 
            subtree: true 
        });
    }
    
    // Dodatkowo: jeśli captcha jest już widoczna, ale status się zmienia
    const existingStatus = document.querySelector('.xsukax-captcha-status');
    if (existingStatus && submit) {
        const observer = new MutationObserver(() => {
            checkCaptchaStatus();
        });
        
        observer.observe(existingStatus, { 
            childList: true, 
            subtree: true, 
            characterData: true 
        });
    }
});

function pojawienie(numer) {
    if (numer == 1) {
        const captcha = document.getElementById('captcha');
        const czy = document.getElementById('rodoCheck');
        const submit = document.getElementById('submit');
        
        if (czy.checked) {
            captcha.style.display = 'block';
            if (czyCaptcha) {
                submit.style.display = 'block';
            }
        } else {
            captcha.style.display = 'none';
            submit.style.display = 'none';
        }
    }
}

