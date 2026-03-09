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
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        const filter = button.getAttribute('data-filter');
        
        // Show/hide cards based on filter
        professionCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });

        // --- New: if only one card is visible, add class to center content ---
        const grid = document.querySelector('.professions-grid');
        const visibleCount = document.querySelectorAll('.profession-card.active').length;
        if (visibleCount === 1) {
            grid.classList.add('single-active');
        } else {
            grid.classList.remove('single-active');
        }
    });
});

// Form submission
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // In a real application, you would send this data to a server
    // For now, we'll just show an alert
    alert(`Dziękujemy za wiadomość, ${name}! Twoja wiadomość została "wysłana". W rzeczywistej implementacji dane zostałyby przesłane do serwera.`);
    
    // Reset form
    contactForm.reset();
});

// Initialize single-active state on page load (in case initial markup shows one)
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.professions-grid');
    const visibleCount = document.querySelectorAll('.profession-card.active').length;
    if (visibleCount === 1) grid.classList.add('single-active');
});