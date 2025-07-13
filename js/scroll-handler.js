// Scroll handler for all pages
class ScrollHandler {
    constructor() {
        this.backToTopBtn = null;
        this.header = null;
        this.lastScrollTop = 0;
        this.scrollThreshold = 100;
        this.init();
    }

    init() {
        this.createBackToTopButton();
        this.setupEventListeners();
        this.makeHeaderFixed();

        // Add scroll to section functionality if there are sections
        if (document.querySelectorAll('section[id]').length > 0) {
            this.addScrollToSection();
        }
    }

    createBackToTopButton() {
        // Check if button already exists
        if (document.getElementById('backToTopBtn')) {
            this.backToTopBtn = document.getElementById('backToTopBtn');
            return;
        }

        // Create back to top button
        this.backToTopBtn = document.createElement('button');
        this.backToTopBtn.id = 'backToTopBtn';
        this.backToTopBtn.className = 'fixed bottom-8 right-8 bg-red-600 hover:bg-red-700 text-white w-12 h-12 rounded-full shadow-lg transition-all duration-300 opacity-0 invisible z-50 flex items-center justify-center';
        this.backToTopBtn.innerHTML = '<i class="fas fa-chevron-up text-lg"></i>';
        this.backToTopBtn.title = 'Back to Top';

        // Add to body
        document.body.appendChild(this.backToTopBtn);
    }

    setupEventListeners() {
        // Scroll event listener
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });

        // Back to top click event
        this.backToTopBtn.addEventListener('click', () => {
            this.scrollToTop();
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    this.smoothScrollTo(target);
                }
            });
        });
    }

    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Show/hide back to top button
        this.updateBackToTopButton(scrollTop);

        this.lastScrollTop = scrollTop;
    }

    makeHeaderFixed() {
        // Header is already fixed in HTML, just ensure sidebar positioning for index.html
        const sidebar = document.querySelector('.sidebar-desktop');
        if (sidebar) {
            const header = document.querySelector('header');
            if (header) {
                sidebar.style.top = header.offsetHeight + 'px';
                sidebar.style.height = `calc(100vh - ${header.offsetHeight}px)`;
            }
        }
    }

    updateBackToTopButton(scrollTop) {
        if (scrollTop > this.scrollThreshold) {
            this.backToTopBtn.classList.remove('opacity-0', 'invisible');
            this.backToTopBtn.classList.add('opacity-100', 'visible');
        } else {
            this.backToTopBtn.classList.add('opacity-0', 'invisible');
            this.backToTopBtn.classList.remove('opacity-100', 'visible');
        }
    }

    scrollToTop() {
        this.smoothScrollTo(0);
    }

    smoothScrollTo(target) {
        const targetPosition = typeof target === 'number' ? target : target.offsetTop;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 800;
        let start = null;

        function animation(currentTime) {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }



    // Add scroll to section functionality
    addScrollToSection() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav a[href^="#"]');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('text-red-500');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('text-red-500');
                }
            });
        });
    }
}

// Initialize scroll handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ScrollHandler();
}); 