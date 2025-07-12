import { moviesData } from '../data.js';
import { showToast } from '../utils.js';
import { showMovieDetails } from '../components.js';

class HomeController {
    constructor() {
        this.isInitialized = false;
        this.searchTimeout = null;
        this.currentSearchQuery = '';
        this.bookmarkedMovies = JSON.parse(localStorage.getItem('bookmarkedMovies') || '[]');

        this.init();
    }

    async init() {
        if (this.isInitialized) return;

        this.setupEventListeners();
        this.loadAndRenderData();
        this.isInitialized = true;
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });

            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handleSearch(e.target.value);
                }

                if (e.key === 'Escape') {
                    e.preventDefault();
                    searchInput.value = '';
                    this.handleSearch('');
                }
            });
        }

        // Theme toggle
        const themeToggle = document.getElementById('toggleThemeBtn');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Mobile menu
        this.setupMobileMenuListeners();

        // Global click handlers
        this.setupGlobalClickHandlers();
    }

    setupMobileMenuListeners() {
        const openMenuBtn = document.getElementById('openMenuBtn');
        const closeMenuBtn = document.getElementById('closeMenuBtn');
        const mobileSidebar = document.getElementById('mobileSidebar');

        if (openMenuBtn) {
            openMenuBtn.addEventListener('click', () => {
                mobileSidebar.classList.remove('hidden');
                mobileSidebar.classList.add('flex');
            });
        }

        if (closeMenuBtn) {
            closeMenuBtn.addEventListener('click', () => {
                mobileSidebar.classList.add('hidden');
                mobileSidebar.classList.remove('flex');
            });
        }

        if (mobileSidebar) {
            mobileSidebar.addEventListener('click', (e) => {
                if (e.target === mobileSidebar) {
                    mobileSidebar.classList.add('hidden');
                    mobileSidebar.classList.remove('flex');
                }
            });
        }
    }

    setupGlobalClickHandlers() {
        document.addEventListener('click', (e) => {
            // Handle movie card clicks
            if (e.target.closest('.movie-card')) {
                const card = e.target.closest('.movie-card');
                const movieId = parseInt(card.dataset.movieId);
                this.showMovieDetails(movieId);
            }

            // Handle bookmark button clicks
            if (e.target.closest('.bookmark-btn')) {
                e.preventDefault();
                e.stopPropagation();
                const btn = e.target.closest('.bookmark-btn');
                const movieId = parseInt(btn.dataset.movieId);
                this.toggleBookmark(movieId);
            }

            // Handle play button clicks
            if (e.target.closest('.play-btn')) {
                e.preventDefault();
                e.stopPropagation();
                const card = e.target.closest('.movie-card');
                const movieId = parseInt(card.dataset.movieId);
                this.showMovieDetails(movieId);
            }
        });
    }

    loadAndRenderData() {
        try {
            // Load data from data.js
            const allMovies = [...moviesData.trending, ...moviesData.recommended];

            // Render different sections
            this.renderHeroSection(moviesData.trending.slice(0, 1)[0]);
            this.renderTrendingSection(moviesData.trending);
            this.renderRecommendedSection(moviesData.recommended);
            this.renderCategories(allMovies);

            // Update bookmark states
            this.updateBookmarkStates();

        } catch (error) {
            console.error('Failed to load data:', error);
            showToast('Failed to load movies. Please refresh the page.', 'error');
        }
    }

    renderHeroSection(heroMovie) {
        const heroContainer = document.querySelector('.hero-section');
        if (!heroContainer || !heroMovie) return;

        const imagePath = heroMovie.image.startsWith('images/') ? heroMovie.image : `images/${heroMovie.image}`;

        heroContainer.innerHTML = `
            <div class="relative h-[80vh] rounded-lg overflow-hidden">
                <img src="${imagePath}" alt="${heroMovie.title}" class="w-full h-full object-cover">
                <div class="absolute inset-0 gradient-overlay"></div>
                <div class="absolute bottom-0 left-0 right-0 p-12">
                    <div class="max-w-3xl">
                        <h1 class="text-5xl md:text-7xl font-bold text-white mb-6 text-shadow-lg">${heroMovie.title}</h1>
                        <div class="flex items-center space-x-6 text-gray-200 mb-6 text-shadow">
                            <span class="text-lg">${heroMovie.year}</span>
                            <span class="w-1 h-1 bg-red-500 rounded-full"></span>
                            <span class="flex items-center text-lg">
                                <i class="fas ${heroMovie.category === 'Movie' ? 'fa-film' : 'fa-tv'} mr-2"></i>
                                ${heroMovie.category}
                                </span>
                            <span class="w-1 h-1 bg-red-500 rounded-full"></span>
                            <span class="rating-badge">${heroMovie.rating}</span>
                            <span class="w-1 h-1 bg-red-500 rounded-full"></span>
                            <span class="text-lg">${heroMovie.duration}</span>
                        </div>
                        <p class="text-gray-200 text-xl mb-8 line-clamp-3 text-shadow">${heroMovie.description}</p>
                        <div class="flex space-x-6">
                            <button class="btn-netflix text-white px-10 py-4 rounded-lg font-bold text-lg flex items-center hover-lift">
                                <i class="fas fa-play mr-3 text-xl"></i>
                                Play
                            </button>
                            <button class="bg-gray-800 bg-opacity-80 backdrop-blur text-white px-10 py-4 rounded-lg font-bold text-lg flex items-center hover:bg-gray-700 transition-all duration-300 border border-gray-600 hover:border-gray-500">
                                <i class="fas fa-info-circle mr-3 text-xl"></i>
                                More Info
                            </button>
                        </div>
                        <div class="mt-6 flex flex-wrap gap-2">
                            ${heroMovie.genre.slice(0, 3).map(genre => `
                                <span class="genre-tag">${genre}</span>
                            `).join('')}
                        </div>
                        </div>
                    </div>
                </div>
            `;
    }

    renderTrendingSection(trendingMovies) {
        const trendingContainer = document.querySelector('.trending-section .movies-grid');
        if (!trendingContainer) return;

        const moviesHTML = trendingMovies.map(movie => this.createMovieCard(movie, 'trending')).join('');
        trendingContainer.innerHTML = moviesHTML;
    }

    renderRecommendedSection(recommendedMovies) {
        const recommendedContainer = document.querySelector('.recommended-section .movies-grid');
        if (!recommendedContainer) return;

        const moviesHTML = recommendedMovies.map(movie => this.createMovieCard(movie, 'recommended')).join('');
        recommendedContainer.innerHTML = moviesHTML;
    }

    renderCategories(allMovies) {
        // Group movies by genre
        const genreGroups = {};
        allMovies.forEach(movie => {
            movie.genre.forEach(genre => {
                if (!genreGroups[genre]) {
                    genreGroups[genre] = [];
                }
                genreGroups[genre].push(movie);
            });
        });

        // Render top genres
        const topGenres = Object.keys(genreGroups).slice(0, 4);
        const categoriesContainer = document.querySelector('.categories-section');
        if (!categoriesContainer) return;

        const categoriesHTML = topGenres.map(genre => `
            <div class="category-section mb-8">
                <h2 class="text-2xl font-semibold mb-4">${genre}</h2>
                <div class="movies-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    ${genreGroups[genre].slice(0, 6).map(movie => this.createMovieCard(movie, 'category')).join('')}
                </div>
            </div>
        `).join('');

        categoriesContainer.innerHTML = categoriesHTML;
    }

    createMovieCard(movie, type = 'default') {
        const imagePath = movie.image.startsWith('images/') ? movie.image : `images/${movie.image}`;
        const isBookmarked = this.bookmarkedMovies.some(bm => bm.id === movie.id);

        return `
            <div class="movie-card group cursor-pointer" data-movie-id="${movie.id}">
                <div class="relative aspect-[2/3] rounded-lg overflow-hidden">
                    <img src="${imagePath}" alt="${movie.title}" class="w-full h-full object-cover">
                    
                    <!-- Play button -->
                    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div class="play-btn bg-white bg-opacity-90 rounded-full p-4 hover:bg-opacity-100 transition-all">
                            <i class="fas fa-play text-black text-xl"></i>
                        </div>
                    </div>
                    
                    <!-- Bookmark button -->
                    <div class="absolute top-3 right-3">
                        <div class="bookmark-btn bg-black bg-opacity-60 rounded-full p-2.5 hover:bg-opacity-80 transition-all" data-movie-id="${movie.id}">
                            <i class="fas fa-bookmark text-white text-lg ${isBookmarked ? 'text-red-500' : ''}"></i>
                        </div>
                            </div>
                    
                    <!-- Rating badge -->
                    <div class="absolute top-3 left-3">
                        <div class="rating-badge">
                            <i class="fas fa-star mr-1"></i>
                            ${movie.rating}
                        </div>
                    </div>
                    
                    <!-- Movie info overlay -->
                    <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <h3 class="text-white font-bold text-sm mb-2 text-shadow">${movie.title}</h3>
                        <div class="flex items-center justify-between text-gray-200 text-xs mb-2">
                            <span>${movie.year}</span>
                            <span class="flex items-center">
                                <i class="fas ${movie.category === 'Movie' ? 'fa-film' : 'fa-tv'} mr-1"></i>
                                ${movie.category}
                            </span>
                            <span>${movie.duration}</span>
                        </div>
                        <div class="flex flex-wrap gap-1">
                            ${movie.genre.slice(0, 2).map(genre => `
                                <span class="genre-tag text-xs">${genre}</span>
                            `).join('')}
                        </div>
                        </div>
                    </div>
                </div>
            `;
    }

    handleSearch(query) {
        this.currentSearchQuery = query.trim();

        if (!this.currentSearchQuery) {
            this.showHomeContent();
            return;
        }

        // Filter movies based on search query
        const allMovies = [...moviesData.trending, ...moviesData.recommended];
        const searchResults = allMovies.filter(movie =>
            movie.title.toLowerCase().includes(this.currentSearchQuery.toLowerCase()) ||
            movie.description.toLowerCase().includes(this.currentSearchQuery.toLowerCase()) ||
            movie.genre.some(genre => genre.toLowerCase().includes(this.currentSearchQuery.toLowerCase()))
        );

        this.displaySearchResults(searchResults);
    }

    displaySearchResults(results) {
        const mainContent = document.querySelector('.main-content');
        if (!mainContent) return;

        const resultsHTML = `
            <div class="search-results">
                <div class="flex items-center justify-between mb-8">
                    <h2 class="text-3xl font-bold text-shadow">Search Results for "${this.currentSearchQuery}"</h2>
                    <button onclick="homeController.showHomeContent()" class="btn-netflix text-white px-6 py-3 rounded-lg font-semibold flex items-center hover-lift">
                        <i class="fas fa-arrow-left mr-2"></i>Back to Home
                    </button>
                </div>
                
                ${results.length === 0 ? `
                    <div class="text-center py-16">
                        <div class="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i class="fas fa-search text-4xl text-gray-500"></i>
                                        </div>
                        <h3 class="text-2xl font-bold mb-4 text-shadow">No results found</h3>
                        <p class="text-gray-400 text-lg">No movies or TV series found for "${this.currentSearchQuery}"</p>
                        <p class="text-gray-500 mt-2">Try searching with different keywords</p>
                                    </div>
                ` : `
                    <div class="mb-6">
                        <p class="text-gray-300 text-lg">Found ${results.length} result${results.length !== 1 ? 's' : ''}</p>
                                    </div>
                    <div class="movies-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                        ${results.map(movie => this.createMovieCard(movie, 'search')).join('')}
                                    </div>
                `}
            </div>
        `;

        mainContent.innerHTML = resultsHTML;
        this.updateBookmarkStates();
    }

    showHomeContent() {
        this.loadAndRenderData();
    }

    showMovieDetails(movieId) {
        const allMovies = [...moviesData.trending, ...moviesData.recommended];
        const movie = allMovies.find(m => m.id === movieId);

        if (!movie) {
            showToast('Movie not found', 'error');
            return;
        }

        showMovieDetails(movie);
    }

    toggleBookmark(movieId) {
        const allMovies = [...moviesData.trending, ...moviesData.recommended];
        const movie = allMovies.find(m => m.id === movieId);

        if (!movie) return;

        const isBookmarked = this.bookmarkedMovies.some(bm => bm.id === movieId);

        if (isBookmarked) {
            this.bookmarkedMovies = this.bookmarkedMovies.filter(bm => bm.id !== movieId);
            showToast('Removed from bookmarks', 'success');
        } else {
            this.bookmarkedMovies.push(movie);
            showToast('Added to bookmarks', 'success');
        }

        // Save to localStorage
        localStorage.setItem('bookmarkedMovies', JSON.stringify(this.bookmarkedMovies));

        // Update UI
        this.updateBookmarkStates();
    }

    updateBookmarkStates() {
        const bookmarkBtns = document.querySelectorAll('.bookmark-btn');
        bookmarkBtns.forEach(btn => {
            const movieId = parseInt(btn.dataset.movieId);
            const icon = btn.querySelector('i');
            const isBookmarked = this.bookmarkedMovies.some(bm => bm.id === movieId);

            if (icon) {
                icon.classList.toggle('text-red-500', isBookmarked);
            }
        });
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
            themeIcon.className = newTheme === 'dark' ? 'fas fa-moon text-xl' : 'fas fa-sun text-xl';
        }

        showToast(`Switched to ${newTheme} theme`, 'success');
    }

    // Public methods
    refresh() {
        this.loadAndRenderData();
    }
}

// Create and export instance
const homeController = new HomeController();
export default homeController;

// Make it globally available
window.homeController = homeController; 