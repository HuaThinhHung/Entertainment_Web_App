// Theme handler for non-module pages (about, contact, watchlist)
class ThemeHandler {
    constructor() {
        this.themeBtn = document.getElementById('toggleThemeBtn');
        this.themeIcon = document.getElementById('themeIcon');
        this.init();
    }

    init() {
        this.loadTheme();
        this.setupEventListeners();
    }

    getStoredTheme() {
        const stored = localStorage.getItem('netflix_theme');
        return stored || 'dark';
    }

    saveTheme(theme) {
        localStorage.setItem('netflix_theme', theme);
    }

    applyTheme(theme) {
        const html = document.documentElement;
        html.setAttribute('data-theme', theme);

        // Update body classes
        if (theme === 'light') {
            document.body.className = 'bg-white text-gray-900 min-h-screen';
        } else {
            document.body.className = 'bg-gray-900 text-white min-h-screen';
        }
    }

    updateThemeToggle() {
        const currentTheme = this.getStoredTheme();

        if (currentTheme === 'light') {
            this.themeIcon.classList.remove('fa-moon');
            this.themeIcon.classList.add('fa-sun');
        } else {
            this.themeIcon.classList.remove('fa-sun');
            this.themeIcon.classList.add('fa-moon');
        }
    }

    loadTheme() {
        const theme = this.getStoredTheme();
        this.applyTheme(theme);
        this.updateThemeToggle();
    }

    toggleTheme() {
        const currentTheme = this.getStoredTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        this.setTheme(newTheme);
    }

    setTheme(theme) {
        this.saveTheme(theme);
        this.applyTheme(theme);
        this.updateThemeToggle();
    }

    setupEventListeners() {
        if (this.themeBtn) {
            this.themeBtn.onclick = () => {
                this.toggleTheme();
            };
        }
    }
}

// Initialize theme handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeHandler();
}); 