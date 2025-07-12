import { CONFIG } from './config.js';

// Global state management
class AppState {
    constructor() {
        this.state = {
            // Theme state
            theme: this.getStoredTheme(),

            // Movie data
            movies: [],
            trendingMovies: [],
            recommendedMovies: [],

            // Search state
            searchQuery: '',
            searchResults: [],
            isSearching: false,

            // Modal state
            selectedMovie: null,
            isModalOpen: false,

            // Bookmark state
            bookmarks: this.getStoredBookmarks(),

            // UI state
            isLoading: false,
            currentSection: 'home',

            // Filter state
            currentCategory: 'all',
            currentGenre: 'all'
        };

        this.listeners = [];
    }

    // Getter methods
    getState() {
        return { ...this.state };
    }

    getTheme() {
        return this.state.theme;
    }

    getMovies() {
        return this.state.movies;
    }

    getTrendingMovies() {
        return this.state.trendingMovies;
    }

    getRecommendedMovies() {
        return this.state.recommendedMovies;
    }

    getSearchQuery() {
        return this.state.searchQuery;
    }

    getSearchResults() {
        return this.state.searchResults;
    }

    getSelectedMovie() {
        return this.state.selectedMovie;
    }

    getBookmarks() {
        return this.state.bookmarks;
    }

    // Setter methods with state updates
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notifyListeners();
    }

    setTheme(theme) {
        this.state.theme = theme;
        this.saveTheme(theme);
        this.applyTheme(theme);
        this.notifyListeners();
    }

    setMovies(movies) {
        this.state.movies = movies;
        this.state.trendingMovies = movies.filter(movie => movie.isTrending);
        this.state.recommendedMovies = movies.filter(movie => !movie.isTrending);
        this.notifyListeners();
    }

    setSearchQuery(query) {
        this.state.searchQuery = query;
        this.notifyListeners();
    }

    setSearchResults(results) {
        this.state.searchResults = results;
        this.notifyListeners();
    }

    setSelectedMovie(movie) {
        this.state.selectedMovie = movie;
        this.notifyListeners();
    }

    setModalOpen(isOpen) {
        this.state.isModalOpen = isOpen;
        this.notifyListeners();
    }

    setLoading(isLoading) {
        this.state.isLoading = isLoading;
        this.notifyListeners();
    }

    // Bookmark methods
    toggleBookmark(movieId) {
        const bookmarks = [...this.state.bookmarks];
        const index = bookmarks.indexOf(movieId);

        if (index > -1) {
            bookmarks.splice(index, 1);
        } else {
            bookmarks.push(movieId);
        }

        this.state.bookmarks = bookmarks;
        this.saveBookmarks(bookmarks);
        this.notifyListeners();

        return bookmarks;
    }

    isBookmarked(movieId) {
        return this.state.bookmarks.includes(movieId);
    }

    // Favorite (heart) methods
    toggleFavorite(movieId) {
        let favorites = this.getFavorites();
        const index = favorites.indexOf(movieId);
        if (index > -1) {
            favorites.splice(index, 1);
        } else {
            favorites.push(movieId);
        }
        this.saveFavorites(favorites);
        this.notifyListeners();
        return favorites;
    }
    isFavorite(movieId) {
        return this.getFavorites().includes(movieId);
    }
    getFavorites() {
        const favs = localStorage.getItem('favorite_movies');
        return favs ? JSON.parse(favs) : [];
    }
    saveFavorites(favorites) {
        localStorage.setItem('favorite_movies', JSON.stringify(favorites));
    }

    // Theme methods
    toggleTheme() {
        const newTheme = this.state.theme === CONFIG.THEMES.DARK ? CONFIG.THEMES.LIGHT : CONFIG.THEMES.DARK;
        this.setTheme(newTheme);
        return newTheme;
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        // Update body classes based on theme
        if (theme === CONFIG.THEMES.DARK) {
            document.body.className = 'bg-gray-900 text-white font-sans';
        } else {
            document.body.className = 'bg-white text-gray-900 font-sans';
        }
    }

    // Local storage methods
    getStoredTheme() {
        const stored = localStorage.getItem(CONFIG.STORAGE_KEYS.THEME);
        return stored || CONFIG.THEMES.DARK;
    }

    saveTheme(theme) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.THEME, theme);
    }

    getStoredBookmarks() {
        const stored = localStorage.getItem(CONFIG.STORAGE_KEYS.BOOKMARKS);
        return stored ? JSON.parse(stored) : [];
    }

    saveBookmarks(bookmarks) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
    }

    // Observer pattern for state changes
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            const index = this.listeners.indexOf(listener);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        };
    }

    notifyListeners() {
        this.listeners.forEach(listener => listener(this.state));
    }

    // Search methods
    searchMovies(query) {
        if (!query.trim()) {
            this.setSearchResults([]);
            return [];
        }

        const results = this.state.movies.filter(movie =>
            movie.title.toLowerCase().includes(query.toLowerCase()) ||
            movie.description.toLowerCase().includes(query.toLowerCase()) ||
            movie.genre.some(genre => genre.toLowerCase().includes(query.toLowerCase()))
        );

        this.setSearchResults(results);
        return results;
    }

    // Filter methods
    filterByCategory(category) {
        this.state.currentCategory = category;
        this.notifyListeners();
    }

    filterByGenre(genre) {
        this.state.currentGenre = genre;
        this.notifyListeners();
    }

    getFilteredMovies() {
        let filtered = this.state.movies;

        if (this.state.currentCategory !== 'all') {
            filtered = filtered.filter(movie => movie.category.toLowerCase() === this.state.currentCategory);
        }

        if (this.state.currentGenre !== 'all') {
            filtered = filtered.filter(movie =>
                movie.genre.some(genre => genre.toLowerCase() === this.state.currentGenre)
            );
        }

        return filtered;
    }
}

// Create and export singleton instance
const appState = new AppState();

// Initialize theme on load
appState.applyTheme(appState.getTheme());

export default appState; 