// Configuration file for the Netflix Clone app
export const CONFIG = {
    // API Configuration
    API_BASE_URL: 'https://api.example.com',

    // Local Storage Keys
    STORAGE_KEYS: {
        THEME: 'netflix_theme',
        BOOKMARKS: 'netflix_bookmarks',
        WATCHLIST: 'netflix_watchlist',
        SEARCH_HISTORY: 'netflix_search_history'
    },

    // UI Configuration
    UI: {
        GRID_BREAKPOINTS: {
            mobile: 1,
            tablet: 2,
            desktop: 3,
            large: 4,
            xlarge: 5
        },
        MODAL_ANIMATION_DURATION: 300,
        SEARCH_DEBOUNCE_DELAY: 300,
        LOADING_TIMEOUT: 5000
    },

    // Theme Configuration
    THEMES: {
        LIGHT: 'light',
        DARK: 'dark'
    },

    // Movie Categories
    CATEGORIES: {
        TRENDING: 'trending',
        RECOMMENDED: 'recommended',
        MOVIES: 'movies',
        TV_SERIES: 'tv_series',
        DOCUMENTARY: 'documentary',
        ACTION: 'action',
        DRAMA: 'drama',
        COMEDY: 'comedy',
        HORROR: 'horror',
        SCI_FI: 'sci_fi'
    }
};

// Utility functions
export const getImagePath = (imageName) => {
    return `images/${imageName}`;
};

export const formatDuration = (duration) => {
    return duration || 'N/A';
};

export const formatYear = (year) => {
    return year || 'N/A';
};

export const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}; 