// Import core modules
import { CONFIG } from './config.js';
import appState from './state.js';
import Components from './components.js';
import moviesData from './data.js';

// Main application class
class NetflixApp {
    constructor() {
        this.heroIndex = 0;
        this.heroMovies = [];
        this.heroInterval = null;
        this.allMoviesPage = 1;
        this.allMoviesPerPage = 12;
        this.searchPage = 1;
        this.searchPerPage = 12;
        this.searchResults = [];
        this.isSearching = false;
        this.initializeApp();
        this.setupEventListeners();
        this.loadInitialData();
    }

    // Initialize the application
    initializeApp() {
        console.log('🎬 Netflix Clone App Initializing...');

        // Apply initial theme
        appState.applyTheme(appState.getTheme());

        // Update theme toggle button
        this.updateThemeToggle();

        // Show loading
        this.showLoading();
    }

    // Load initial data
    async loadInitialData() {
        try {
            // Combine trending and recommended movies
            const allMovies = [...moviesData.trending, ...moviesData.recommended];

            // Set movies in state
            appState.setMovies(allMovies);

            // Lấy 3 phim trending đầu tiên cho banner
            this.heroMovies = appState.getTrendingMovies().slice(0, 3);
            this.heroIndex = 0;
            this.renderHeroSection(this.heroMovies[this.heroIndex]);
            this.startHeroAutoSlide();

            // Render the home page
            this.renderHomePage();

            // Hide loading
            this.hideLoading();

            console.log(`✅ Loaded ${allMovies.length} movies`);

        } catch (error) {
            console.error('❌ Error loading initial data:', error);
            this.hideLoading();
            this.showError('Failed to load movies');
        }
    }

    // Render home page
    renderHomePage() {
        // Clear only the content of each section, not the whole main-content
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) heroSection.innerHTML = '';
        const trendingSection = document.querySelector('.trending-section');
        if (trendingSection) trendingSection.innerHTML = '<h2 class="text-2xl font-semibold mb-6">Trending Now</h2><div id="moviesGrid" class="movies-grid"></div>';
        const recommendedSection = document.querySelector('.recommended-section');
        if (recommendedSection) recommendedSection.innerHTML = '<h2 class="text-2xl font-semibold mb-6">Recommended for You</h2><div class="movies-grid"></div>';
        const categoriesSection = document.querySelector('.categories-section');
        if (categoriesSection) categoriesSection.innerHTML = '';

        const movies = appState.getMovies();
        const trendingMovies = appState.getTrendingMovies();
        const recommendedMovies = appState.getRecommendedMovies();

        // Render hero section
        this.renderHeroSection(trendingMovies[0]);

        // Render trending section
        this.renderTrendingSection(trendingMovies);

        // Render recommended section
        this.renderRecommendedSection(recommendedMovies);

        // Render categories section
        this.renderCategoriesSection(movies);
    }

    // Render hero section
    renderHeroSection(movie) {
        const heroSection = document.querySelector('.hero-section');
        if (heroSection && movie) {
            heroSection.innerHTML = `
                <div class="relative h-96 md:h-[500px] rounded-xl overflow-hidden mb-8 group">
                    <div class="absolute inset-0">
                        <img src="${movie.image ? 'images/' + movie.image : ''}" alt="${movie.title}" class="w-full h-full object-cover">
                        <div class="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
                    </div>
                    <div class="relative z-10 h-full flex items-center p-8">
                        <div class="max-w-2xl">
                            <h1 class="text-4xl md:text-6xl font-bold text-white mb-4">${movie.title}</h1>
                            <div class="flex items-center text-gray-300 mb-4 space-x-4">
                                <span>${movie.year}</span>
                                <span>•</span>
                                <span>${movie.category}</span>
                                <span>•</span>
                                <span>${movie.duration}</span>
                                <span>•</span>
                                <span>${movie.rating}</span>
                            </div>
                            <p class="text-gray-300 text-lg mb-6 line-clamp-3">${movie.description}</p>
                            <div class="flex space-x-4">
                                <button class="play-hero-btn bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors duration-200">
                                    <i class="fas fa-play"></i>
                                    <span>Play</span>
                                </button>
                                <button class="trailer-hero-btn bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors duration-200">
                                    <i class="fas fa-info-circle"></i>
                                    <span>More Info</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <!-- Carousel Controls -->
                    <button class="hero-prev absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-70 text-white rounded-full w-12 h-12 flex items-center justify-center z-20 transition-all duration-200">
                        <i class="fas fa-chevron-left text-2xl"></i>
                    </button>
                    <button class="hero-next absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-70 text-white rounded-full w-12 h-12 flex items-center justify-center z-20 transition-all duration-200">
                        <i class="fas fa-chevron-right text-2xl"></i>
                    </button>
                    <!-- Dots -->
                    <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                        ${this.heroMovies.map((_, idx) => `
                            <span class="inline-block w-3 h-3 rounded-full ${idx === this.heroIndex ? 'bg-red-600' : 'bg-gray-500'} transition-all"></span>
                        `).join('')}
                    </div>
                </div>
            `;
            this.setupHeroEventListeners(movie);
            this.setupHeroCarouselControls();
        }
    }

    setupHeroCarouselControls() {
        const prevBtn = document.querySelector('.hero-prev');
        const nextBtn = document.querySelector('.hero-next');
        if (prevBtn) {
            prevBtn.onclick = () => {
                this.stopHeroAutoSlide();
                this.heroIndex = (this.heroIndex - 1 + this.heroMovies.length) % this.heroMovies.length;
                this.renderHeroSection(this.heroMovies[this.heroIndex]);
                this.startHeroAutoSlide();
            };
        }
        if (nextBtn) {
            nextBtn.onclick = () => {
                this.stopHeroAutoSlide();
                this.heroIndex = (this.heroIndex + 1) % this.heroMovies.length;
                this.renderHeroSection(this.heroMovies[this.heroIndex]);
                this.startHeroAutoSlide();
            };
        }
    }

    startHeroAutoSlide() {
        this.stopHeroAutoSlide();
        this.heroInterval = setInterval(() => {
            this.heroIndex = (this.heroIndex + 1) % this.heroMovies.length;
            this.renderHeroSection(this.heroMovies[this.heroIndex]);
        }, 5000);
    }

    stopHeroAutoSlide() {
        if (this.heroInterval) clearInterval(this.heroInterval);
    }

    // Render trending section
    renderTrendingSection(movies) {
        const moviesGrid = document.getElementById('moviesGrid');
        if (moviesGrid) {
            const displayMovies = movies.slice(0, 4); // chỉ 4 phim trending
            if (displayMovies.length > 0) {
                moviesGrid.innerHTML = displayMovies.map(movie => Components.createMovieCard(movie)).join('');
            } else {
                moviesGrid.innerHTML = Components.createEmptyState('No trending movies available');
            }
        }
    }

    // Render recommended section
    renderRecommendedSection(movies) {
        // Bỏ recommended section, thay bằng all movies có phân trang
        this.renderAllMoviesSection();
    }
    renderAllMoviesSection() {
        let allMovies = appState.getMovies();
        const totalPages = Math.ceil(allMovies.length / this.allMoviesPerPage);
        const startIdx = (this.allMoviesPage - 1) * this.allMoviesPerPage;
        const endIdx = startIdx + this.allMoviesPerPage;
        const displayMovies = allMovies.slice(startIdx, endIdx);

        let html = `
            <h2 class="text-2xl font-semibold mb-6">All Movies</h2>
            <div class="movies-grid mb-6">
                ${displayMovies.map(movie => Components.createMovieCard(movie)).join('')}
            </div>
            <div class="flex justify-center items-center space-x-2 pagination">
                <button class="all-movies-prev px-3 py-1 rounded bg-gray-700 text-white hover:bg-red-600" ${this.allMoviesPage === 1 ? 'disabled' : ''}>Prev</button>
                ${Array.from({ length: totalPages }, (_, i) => `
                    <button class="all-movies-page px-3 py-1 rounded ${this.allMoviesPage === i + 1 ? 'bg-red-600 text-white' : 'bg-gray-700 text-white hover:bg-red-600'}" data-page="${i + 1}">${i + 1}</button>
                `).join('')}
                <button class="all-movies-next px-3 py-1 rounded bg-gray-700 text-white hover:bg-red-600" ${this.allMoviesPage === totalPages ? 'disabled' : ''}>Next</button>
            </div>
        `;
        if (allMovies.length < 12) {
            html += `<div class='text-center text-red-500 font-semibold mt-4'>Dữ liệu phim hiện tại chưa đủ 12 phim. Hãy thêm phim vào data.js để đủ trang!</div>`;
        }

        // Đảm bảo chỉ có 1 section all-movies-section
        let section = document.querySelector('.all-movies-section');
        if (!section) {
            // Nếu chưa có, tạo mới và thêm vào mainContent
            const mainContent = document.querySelector('.main-content');
            section = document.createElement('div');
            section.className = 'all-movies-section mb-12';
            mainContent.appendChild(section);
        }
        section.innerHTML = html;
        this.setupAllMoviesPagination(totalPages);
    }
    setupAllMoviesPagination(totalPages) {
        const prevBtn = document.querySelector('.all-movies-prev');
        const nextBtn = document.querySelector('.all-movies-next');
        const pageBtns = document.querySelectorAll('.all-movies-page');
        if (prevBtn) prevBtn.onclick = () => {
            if (this.allMoviesPage > 1) {
                this.allMoviesPage--;
                this.renderAllMoviesSection();
            }
        };
        if (nextBtn) nextBtn.onclick = () => {
            if (this.allMoviesPage < totalPages) {
                this.allMoviesPage++;
                this.renderAllMoviesSection();
            }
        };
        pageBtns.forEach(btn => {
            btn.onclick = () => {
                const page = parseInt(btn.dataset.page);
                if (page !== this.allMoviesPage) {
                    this.allMoviesPage = page;
                    this.renderAllMoviesSection();
                }
            };
        });
    }

    // Render categories section
    renderCategoriesSection(movies) {
        const categoriesSection = document.querySelector('.categories-section');
        if (categoriesSection) {
            // Group movies by genre
            const genreGroups = this.groupMoviesByGenre(movies);

            let categoriesHTML = '<h2 class="text-2xl font-semibold mb-6">Categories</h2>';

            (genreGroups).forEach(([genre, genreMovies]) => {
                if (genreMovies.length > 0) {
                    categoriesHTML += `
                        <div class="category-section mb-8">
                            <h3 class="text-xl font-semibold mb-4">${genre}</h3>
                            <div class="movies-grid">
                                ${genreMovies.slice(0, 6).map(movie => Components.createMovieCard(movie)).join('')}
                            </div>
                        </div>
                    `;
                }
            });

            categoriesSection.innerHTML = categoriesHTML;
        }
    }

    // Group movies by genre
    groupMoviesByGenre(movies) {
        const groups = {};

        movies.forEach(movie => {
            movie.genre.forEach(genre => {
                if (!groups[genre]) {
                    groups[genre] = [];
                }
                groups[genre].push(movie);
            });
        });

        return groups;
    }

    // Setup event listeners
    setupEventListeners() {
        // Theme toggle
        this.setupThemeToggle();

        // Search functionality
        this.setupSearch();

        // Modal functionality
        this.setupModal();

        // Mobile menu
        this.setupMobileMenu();

        // Navigation
        this.setupNavigation();

        // Global event listeners
        this.setupGlobalEventListeners();
    }

    // Setup theme toggle
    setupThemeToggle() {
        const themeToggleBtn = document.getElementById('toggleThemeBtn');
        if (themeToggleBtn) {
            themeToggleBtn.addEventListener('click', () => {
                const newTheme = appState.toggleTheme();
                this.updateThemeToggle();
                this.showToast(`Switched to ${newTheme} mode`);
            });
        }
    }

    // Update theme toggle button
    updateThemeToggle() {
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
            const currentTheme = appState.getTheme();
            if (currentTheme === CONFIG.THEMES.DARK) {
                themeIcon.className = 'fas fa-sun text-xl text-gray-300';
            } else {
                themeIcon.className = 'fas fa-moon text-xl text-gray-300';
            }
        }
    }

    // Setup search functionality
    setupSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchSuggestions = document.getElementById('searchSuggestions');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.handleSearchInput(query);
                }, 200);
            });
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const query = searchInput.value.trim();
                    this.handleSearchSubmit(query);
                }
                if (e.key === 'Escape') {
                    this.hideSearchSuggestions();
                    searchInput.blur();
                }
            });
        }
        document.addEventListener('click', (e) => {
            if (!searchInput?.contains(e.target) && !searchSuggestions?.contains(e.target)) {
                this.hideSearchSuggestions();
            }
        });
    }
    handleSearchInput(query) {
        if (!query) {
            this.hideSearchSuggestions();
            this.isSearching = false;
            this.renderHomePage();
            return;
        }
        const allMovies = appState.getMovies();
        const keywords = query.trim().toLowerCase().split(/\s+/);
        const isInitialsMatch = (title) => {
            const titleWords = title.toLowerCase().split(/\s+/);
            if (keywords.length > titleWords.length) return false;
            return keywords.every((kw, idx) => titleWords[idx]?.startsWith(kw));
        };
        const results = allMovies.filter(movie =>
            isInitialsMatch(movie.title) ||
            keywords.some(kw =>
                movie.category.toLowerCase().includes(kw) ||
                movie.rating.toLowerCase().includes(kw) ||
                (kw.length === 4 && movie.year.toString() === kw)
            )
        );
        this.searchResults = results;
        this.searchPage = 1;
        this.showSearchSuggestions(results.slice(0, 6));
    }
    handleSearchSubmit(query) {
        if (!query) return;
        const allMovies = appState.getMovies();
        const keywords = query.trim().toLowerCase().split(/\s+/);
        const isInitialsMatch = (title) => {
            const titleWords = title.toLowerCase().split(/\s+/);
            if (keywords.length > titleWords.length) return false;
            return keywords.every((kw, idx) => titleWords[idx]?.startsWith(kw));
        };
        const results = allMovies.filter(movie =>
            isInitialsMatch(movie.title) ||
            keywords.some(kw =>
                movie.category.toLowerCase().includes(kw) ||
                movie.rating.toLowerCase().includes(kw) ||
                (kw.length === 4 && movie.year.toString() === kw)
            )
        );
        this.searchResults = results;
        this.searchPage = 1;
        this.isSearching = true;
        this.hideSearchSuggestions();
        this.renderSearchResults();
    }
    showSearchSuggestions(results) {
        const searchSuggestions = document.getElementById('searchSuggestions');
        if (searchSuggestions) {
            if (!results || results.length === 0) {
                searchSuggestions.innerHTML = '<div class="p-4 text-gray-400 text-center">No results found</div>';
            } else {
                searchSuggestions.innerHTML = results.map(movie => `
                    <div class="search-suggestion-item flex items-center space-x-3 p-3 hover:bg-gray-700 cursor-pointer transition-colors duration-200" data-movie-id="${movie.id}">
                        <img src="images/${movie.image}" alt="${movie.title}" class="w-12 h-16 object-cover rounded">
                        <div class="flex-1">
                            <h4 class="text-white font-semibold text-sm">${movie.title}</h4>
                            <p class="text-gray-400 text-xs">${movie.year} • ${movie.category}</p>
                        </div>
                    </div>
                `).join('');
            }
            searchSuggestions.classList.remove('hidden');
            // Click suggestion
            document.querySelectorAll('.search-suggestion-item').forEach(item => {
                item.onclick = () => {
                    const movieId = parseInt(item.dataset.movieId);
                    const movie = appState.getMovies().find(m => m.id === movieId);
                    if (movie) {
                        this.searchResults = [movie];
                        this.searchPage = 1;
                        this.isSearching = true;
                        this.hideSearchSuggestions();
                        this.renderSearchResults();
                    }
                };
            });
        }
    }
    hideSearchSuggestions() {
        const searchSuggestions = document.getElementById('searchSuggestions');
        if (searchSuggestions) searchSuggestions.classList.add('hidden');
    }
    // Setup search suggestion listeners
    setupSearchSuggestionListeners() {
        const suggestionItems = document.querySelectorAll('.search-suggestion-item');
        suggestionItems.forEach(item => {
            item.addEventListener('click', () => {
                const movieId = parseInt(item.dataset.movieId);
                const movie = appState.getMovies().find(m => m.id === movieId);
                if (movie) {
                    this.showMovieModal(movie);
                    this.hideSearchSuggestions();
                }
            });
        });
    }

    // Setup modal functionality
    setupModal() {
        const modal = document.getElementById('movieModal');
        const closeModal = document.getElementById('closeModal');

        if (modal && closeModal) {
            // Close modal button
            closeModal.addEventListener('click', () => {
                this.hideMovieModal();
            });

            // Close modal on backdrop click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideMovieModal();
                }
            });

            // Close modal on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && appState.isModalOpen()) {
                    this.hideMovieModal();
                }
            });
        }
    }

    // Show movie modal
    showMovieModal(movie) {
        const modal = document.getElementById('movieModal');
        const modalContent = document.getElementById('modalContent');

        if (modal && modalContent) {
            appState.setSelectedMovie(movie);
            modalContent.innerHTML = Components.createMovieModal(movie);

            modal.classList.remove('hidden');
            modal.classList.add('flex');

            appState.setModalOpen(true);

            // Setup modal event listeners
            this.setupModalEventListeners(movie);
        }
    }

    // Hide movie modal
    hideMovieModal() {
        const modal = document.getElementById('movieModal');
        if (modal) {
            modal.classList.remove('flex');
            modal.classList.add('hidden');
            appState.setModalOpen(false);
            appState.setSelectedMovie(null);
        }
    }

    // Setup modal event listeners
    setupModalEventListeners(movie) {
        // Bookmark button
        const bookmarkBtn = document.querySelector('.modal-bookmark-btn');
        if (bookmarkBtn) {
            bookmarkBtn.addEventListener('click', () => {
                this.toggleBookmark(movie.id);
                this.updateModalBookmarkButton(bookmarkBtn, movie.id);
            });
        }

        // Play button
        const playBtn = document.querySelector('.modal-play-btn');
        if (playBtn) {
            playBtn.addEventListener('click', () => {
                this.playMovie(movie);
            });
        }

        // Trailer button
        const trailerBtn = document.querySelector('.modal-trailer-btn');
        if (trailerBtn) {
            trailerBtn.addEventListener('click', () => {
                this.watchTrailer(movie);
            });
        }
    }

    // Setup hero event listeners
    setupHeroEventListeners(movie) {
        // Play button
        const playBtn = document.querySelector('.play-hero-btn');
        if (playBtn) {
            playBtn.addEventListener('click', () => {
                this.playMovie(movie);
            });
        }

        // Trailer button
        const trailerBtn = document.querySelector('.trailer-hero-btn');
        if (trailerBtn) {
            trailerBtn.addEventListener('click', () => {
                this.showMovieModal(movie);
            });
        }
    }

    // Setup mobile menu
    setupMobileMenu() {
        const openMenuBtn = document.getElementById('openMenuBtn');
        const closeMenuBtn = document.getElementById('closeMenuBtn');
        const mobileSidebar = document.getElementById('mobileSidebar');

        if (openMenuBtn && closeMenuBtn && mobileSidebar) {
            openMenuBtn.addEventListener('click', () => {
                mobileSidebar.classList.remove('hidden');
                mobileSidebar.classList.add('flex');
            });

            closeMenuBtn.addEventListener('click', () => {
                mobileSidebar.classList.remove('flex');
                mobileSidebar.classList.add('hidden');
            });

            // Close on backdrop click
            mobileSidebar.addEventListener('click', (e) => {
                if (e.target === mobileSidebar) {
                    mobileSidebar.classList.remove('flex');
                    mobileSidebar.classList.add('hidden');
                }
            });
        }
    }

    // Setup navigation
    setupNavigation() {
        // Desktop navigation (sidebar) - 6 icons
        const sidebarIcons = document.querySelectorAll('.sidebar-icon');
        sidebarIcons.forEach((icon, idx) => {
            icon.addEventListener('click', () => {
                const navIds = ['home', 'movies', 'tv', 'mylist', 'new', 'bookmark'];
                this.handleNavigation(navIds[idx] || 'home');
            });
        });
        // Always allow Home icon to reload Home
        const homeIcon = document.getElementById('sidebarHomeIcon');
        if (homeIcon) {
            homeIcon.addEventListener('click', () => {
                this.handleNavigation('home');
            });
        }
        // Mobile navigation
        const mobileNavBtns = document.querySelectorAll('.mobile-nav-btn');
        mobileNavBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const navId = btn.dataset.nav;
                this.handleNavigation(navId);
                // Đóng mobile menu nếu đang mở
                const mobileSidebar = document.getElementById('mobileSidebar');
                if (mobileSidebar) {
                    mobileSidebar.classList.remove('flex');
                    mobileSidebar.classList.add('hidden');
                }
            });
        });
    }
    handleNavigation(navId) {
        // Update active state for both desktop and mobile
        this.updateActiveNavigation(navId);

        switch (navId) {
            case 'home':
                this.renderHomePage();
                break;
            case 'movies':
                this.renderMoviesByCategory('Movie');
                break;
            case 'tv':
                this.renderMoviesByCategory('TV Series');
                break;
            case 'mylist':
                this.renderMyList();
                break;
            case 'bookmark':
                this.renderBookmarks();
                break;
            case 'new':
                this.renderNewPopular();
                break;
            default:
                this.renderHomePage();
        }
    }

    // Update active navigation state
    updateActiveNavigation(navId) {
        // Update desktop sidebar icons
        const sidebarIcons = document.querySelectorAll('.sidebar-icon');
        sidebarIcons.forEach((icon, idx) => {
            const navIds = ['home', 'movies', 'tv', 'mylist', 'new', 'bookmark'];
            if (navIds[idx] === navId) {
                icon.classList.add('active', 'text-red-500');
            } else {
                icon.classList.remove('active', 'text-red-500');
            }
        });

        // Update mobile navigation buttons
        const mobileNavBtns = document.querySelectorAll('.mobile-nav-btn');
        mobileNavBtns.forEach(btn => {
            if (btn.dataset.nav === navId) {
                btn.classList.add('text-red-500');
                btn.classList.remove('text-gray-400');
            } else {
                btn.classList.remove('text-red-500');
                btn.classList.add('text-gray-400');
            }
        });
    }
    renderMoviesByCategory(category) {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = '';
        const movies = appState.getMovies().filter(m => m.category === category);
        this.renderSearchResultsCustom(movies, category);
    }
    // Show only favorite movies (with isFavorite or isHeart property)
    renderMyList() {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = '';
        // Giả sử mỗi movie có thuộc tính isFavorite hoặc isHeart (nếu chưa có, bạn cần cập nhật data.js)
        const favoriteIds = appState.getFavorites();
        const movies = appState.getMovies().filter(m => favoriteIds.includes(m.id));
        this.renderSearchResultsCustom(movies, 'My List (Favorites)');
    }

    // Show only bookmarked movies
    renderBookmarks() {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = '';
        const bookmarks = appState.getBookmarks();
        const movies = appState.getMovies().filter(m => bookmarks.includes(m.id));
        this.renderSearchResultsCustom(movies, 'Bookmarks');
    }
    renderNewPopular() {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = '';
        // Lấy phim mới nhất (năm lớn nhất) hoặc rating cao
        const allMovies = appState.getMovies();
        const maxYear = Math.max(...allMovies.map(m => m.year));
        const movies = allMovies.filter(m => m.year === maxYear || m.rating === 'PG-13');
        this.renderSearchResultsCustom(movies, 'New & Popular');
    }
    renderSearchResultsCustom(movies, title = 'Results') {
        const mainContent = document.querySelector('.main-content');
        let html = `
            <div class="search-results-section mb-12">
                <h2 class="text-2xl font-semibold mb-6">${title}</h2>
                <div class="movies-grid mb-6">
                    ${movies.length > 0 ? movies.map(movie => Components.createMovieCard(movie)).join('') : '<div class="text-center text-gray-400">Không tìm thấy phim nào.</div>'}
                </div>
            </div>
        `;
        // Xóa section cũ nếu có
        let section = document.querySelector('.search-results-section');
        if (!section) {
            section = document.createElement('div');
            section.className = 'search-results-section mb-12';
            mainContent.prepend(section);
        }
        section.innerHTML = html;
    }

    // Setup global event listeners
    setupGlobalEventListeners() {
        document.addEventListener('click', (e) => {
            // Prevent modal open if clicking favorite or bookmark button
            if (e.target.closest('.favorite-btn') || e.target.closest('.bookmark-btn')) {
                // Handle favorite or bookmark logic below, but do not open modal
            } else if (e.target.closest('.movie-card')) {
                const movieCard = e.target.closest('.movie-card');
                const movieId = parseInt(movieCard.dataset.movieId);
                const movie = appState.getMovies().find(m => m.id === movieId);
                if (movie) {
                    this.showMovieModal(movie);
                }
            }
            // Bookmark button click
            if (e.target.closest('.bookmark-btn')) {
                e.stopPropagation();
                const bookmarkBtn = e.target.closest('.bookmark-btn');
                const movieId = parseInt(bookmarkBtn.dataset.movieId);
                this.toggleBookmark(movieId);
                this.updateBookmarkButton(bookmarkBtn, movieId);
            }
            // Favorite (heart) button click
            if (e.target.closest('.favorite-btn')) {
                e.stopPropagation();
                const favoriteBtn = e.target.closest('.favorite-btn');
                const movieId = parseInt(favoriteBtn.dataset.movieId);
                this.toggleFavorite(movieId);
                this.updateFavoriteButton(favoriteBtn, movieId);
            }
            // Play button click
            if (e.target.closest('.play-btn')) {
                e.stopPropagation();
                const movieCard = e.target.closest('.movie-card');
                const movieId = parseInt(movieCard.dataset.movieId);
                const movie = appState.getMovies().find(m => m.id === movieId);
                if (movie) {
                    this.showMovieModal(movie);
                }
            }
        });
    }

    // Toggle bookmark
    toggleBookmark(movieId) {
        const bookmarks = appState.toggleBookmark(movieId);
        const movie = appState.getMovies().find(m => m.id === movieId);

        if (movie) {
            const isBookmarked = appState.isBookmarked(movieId);
            const message = isBookmarked ? `Added "${movie.title}" to bookmarks` : `Removed "${movie.title}" from bookmarks`;
            this.showToast(message);
        }
    }

    // Update bookmark button
    updateBookmarkButton(button, movieId) {
        const icon = button.querySelector('i');
        const isBookmarked = appState.isBookmarked(movieId);

        if (icon) {
            icon.className = isBookmarked ? 'fas fa-bookmark text-sm' : 'far fa-bookmark text-sm';
            button.className = button.className.replace(/text-(red-500|gray-400)/g, '');
            button.classList.add(isBookmarked ? 'text-red-500' : 'text-gray-400');
        }
    }

    // Update modal bookmark button
    updateModalBookmarkButton(button, movieId) {
        const icon = button.querySelector('i');
        const isBookmarked = appState.isBookmarked(movieId);

        if (icon) {
            icon.className = isBookmarked ? 'fas fa-bookmark text-2xl' : 'far fa-bookmark text-2xl';
            button.className = button.className.replace(/text-(red-500|gray-400)/g, '');
            button.classList.add(isBookmarked ? 'text-red-500' : 'text-gray-400');
        }
    }

    // Play movie
    playMovie(movie) {
        this.showToast(`Playing "${movie.title}"`);
        // Here you would implement actual video player functionality
        console.log('Playing movie:', movie.title);
    }

    // Watch trailer
    watchTrailer(movie) {
        if (movie.trailer) {
            window.open(movie.trailer, '_blank');
        } else {
            this.showToast('Trailer not available');
        }
    }

    // Show loading
    showLoading() {
        const overlay = document.getElementById('overlayLoading');
        if (overlay) {
            overlay.classList.remove('hidden');
        }
    }

    // Hide loading
    hideLoading() {
        const overlay = document.getElementById('overlayLoading');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }

    // Show toast notification
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `fixed top-20 right-6 z-50 px-4 py-3 rounded-lg shadow-lg text-white text-sm transition-all duration-300 transform translate-x-full ${type === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`;
        toast.textContent = message;

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.classList.remove('translate-x-full');
        }, 100);

        // Animate out and remove
        setTimeout(() => {
            toast.classList.add('translate-x-full');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    // Show error
    showError(message) {
        this.showToast(message, 'error');
    }

    renderSearchResults() {
        const mainContent = document.querySelector('.main-content');
        let results = this.searchResults;
        const totalPages = Math.ceil(results.length / this.searchPerPage);
        const startIdx = (this.searchPage - 1) * this.searchPerPage;
        const endIdx = startIdx + this.searchPerPage;
        const displayMovies = results.slice(startIdx, endIdx);
        let html = `
            <div class="search-results-section mb-12">
                <h2 class="text-2xl font-semibold mb-6">Search Results</h2>
                <div class="movies-grid mb-6">
                    ${displayMovies.length > 0 ? displayMovies.map(movie => Components.createMovieCard(movie)).join('') : '<div class="text-center text-gray-400">Không tìm thấy phim nào.</div>'}
                </div>
                ${results.length > this.searchPerPage ? `
                <div class="flex justify-center items-center space-x-2 pagination">
                    <button class="search-prev px-3 py-1 rounded bg-gray-700 text-white hover:bg-red-600" ${this.searchPage === 1 ? 'disabled' : ''}>Prev</button>
                    ${Array.from({ length: totalPages }, (_, i) => `
                        <button class="search-page px-3 py-1 rounded ${this.searchPage === i + 1 ? 'bg-red-600 text-white' : 'bg-gray-700 text-white hover:bg-red-600'}" data-page="${i + 1}">${i + 1}</button>
                    `).join('')}
                    <button class="search-next px-3 py-1 rounded bg-gray-700 text-white hover:bg-red-600" ${this.searchPage === totalPages ? 'disabled' : ''}>Next</button>
                </div>` : ''}
            </div>
        `;
        // Xóa section search cũ nếu có
        let section = document.querySelector('.search-results-section');
        if (!section) {
            section = document.createElement('div');
            section.className = 'search-results-section mb-12';
            mainContent.prepend(section);
        }
        section.innerHTML = html;
        this.setupSearchPagination(totalPages);
    }
    setupSearchPagination(totalPages) {
        const prevBtn = document.querySelector('.search-prev');
        const nextBtn = document.querySelector('.search-next');
        const pageBtns = document.querySelectorAll('.search-page');
        if (prevBtn) prevBtn.onclick = () => {
            if (this.searchPage > 1) {
                this.searchPage--;
                this.renderSearchResults();
            }
        };
        if (nextBtn) nextBtn.onclick = () => {
            if (this.searchPage < totalPages) {
                this.searchPage++;
                this.renderSearchResults();
            }
        };
        pageBtns.forEach(btn => {
            btn.onclick = () => {
                const page = parseInt(btn.dataset.page);
                if (page !== this.searchPage) {
                    this.searchPage = page;
                    this.renderSearchResults();
                }
            };
        });
    }

    // Toggle favorite (heart)
    toggleFavorite(movieId) {
        const favorites = appState.toggleFavorite(movieId);
        const movie = appState.getMovies().find(m => m.id === movieId);
        if (movie) {
            const isFavorite = appState.isFavorite(movieId);
            const message = isFavorite ? `Added "${movie.title}" to favorites` : `Removed "${movie.title}" from favorites`;
            this.showToast(message);
        }
    }

    // Update favorite button (card & modal)
    updateFavoriteButton(button, movieId) {
        const icon = button.querySelector('i');
        const isFavorite = appState.isFavorite(movieId);
        if (icon) {
            icon.className = isFavorite ? 'fas fa-heart text-lg text-red-500' : 'far fa-heart text-lg text-gray-400';
            button.className = button.className.replace(/text-(red-500|gray-400)/g, '');
            button.classList.add(isFavorite ? 'text-red-500' : 'text-gray-400');
        }
        // Update modal heart if open
        const modalHeartBtn = document.querySelector('.modal-favorite-btn[data-movie-id="' + movieId + '"]');
        if (modalHeartBtn) {
            const modalIcon = modalHeartBtn.querySelector('i');
            if (modalIcon) {
                modalIcon.className = isFavorite ? 'fas fa-heart text-2xl text-red-500' : 'far fa-heart text-2xl text-gray-400';
                modalHeartBtn.className = modalHeartBtn.className.replace(/text-(red-500|gray-400)/g, '');
                modalHeartBtn.classList.add(isFavorite ? 'text-red-500' : 'text-gray-400');
            }
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NetflixApp();
});

export default NetflixApp;
