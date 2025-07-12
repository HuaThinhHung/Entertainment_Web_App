import { CONFIG, getImagePath, formatDuration, formatYear, truncateText } from './config.js';
import appState from './state.js';

// UI Components
export class Components {
    // Create movie card component
    static createMovieCard(movie) {
        const isBookmarked = appState.isBookmarked(movie.id);
        const bookmarkIcon = isBookmarked ? 'fas fa-bookmark' : 'far fa-bookmark';
        const bookmarkClass = isBookmarked ? 'text-red-500' : 'text-gray-400';
        const isFavorite = appState.isFavorite(movie.id);
        const heartIcon = isFavorite ? 'fas fa-heart' : 'far fa-heart';
        const heartClass = isFavorite ? 'text-red-500' : 'text-gray-400';

        return `
            <div class="movie-card group relative bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer" data-movie-id="${movie.id}">
                <!-- Movie Image -->
                <div class="relative overflow-hidden">
                    <img src="${getImagePath(movie.image)}" 
                         alt="${movie.title}" 
                         class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                         loading="lazy">
                    
                    <!-- Overlay with play button -->
                    <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                        <button class="play-btn opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 bg-red-600 hover:bg-red-700 text-white rounded-full w-12 h-12 flex items-center justify-center">
                            <i class="fas fa-play text-lg"></i>
                        </button>
                    </div>
                    
                    <!-- Bookmark button -->
                    <button class="bookmark-btn absolute top-2 right-2 bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200 ${bookmarkClass} hover:text-red-500" data-movie-id="${movie.id}">
                        <i class="${bookmarkIcon} text-lg"></i>
                    </button>
                    
                    <!-- Heart (favorite) button -->
                    <button class="favorite-btn absolute top-2 left-2 bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200 ${heartClass} hover:text-red-500" data-movie-id="${movie.id}">
                        <i class="${heartIcon} text-lg"></i>
                    </button>
                    
                    <!-- Rating badge -->
                    <div class="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                        ${movie.rating}
                    </div>
                </div>
                
                <!-- Movie Info -->
                <div class="p-4">
                    <div class="flex items-start justify-between mb-2">
                        <h3 class="text-white font-semibold text-sm leading-tight line-clamp-2">${movie.title}</h3>
                    </div>
                    
                    <div class="flex items-center text-gray-400 text-xs space-x-2 mb-2">
                        <span>${formatYear(movie.year)}</span>
                    <span>•</span>
                        <span>${movie.category}</span>
                    <span>•</span>
                        <span>${formatDuration(movie.duration)}</span>
                    </div>
                    
                    <div class="flex flex-wrap gap-1 mb-3">
                        ${movie.genre.slice(0, 2).map(genre =>
            `<span class="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">${genre}</span>`
        ).join('')}
                    </div>
                    
                    <p class="text-gray-400 text-xs line-clamp-2">${truncateText(movie.description, 80)}</p>
                </div>
            </div>
        `;
    }

    // Create hero section component
    static createHeroSection(movie) {
        if (!movie) return '';

        return `
            <div class="hero-section relative h-96 md:h-[500px] rounded-xl overflow-hidden mb-8">
                <div class="absolute inset-0">
                    <img src="${getImagePath(movie.image)}" 
                         alt="${movie.title}" 
                         class="w-full h-full object-cover">
                    <div class="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
                </div>
                
                <div class="relative z-10 h-full flex items-center p-8">
                    <div class="max-w-2xl">
                        <h1 class="text-4xl md:text-6xl font-bold text-white mb-4">${movie.title}</h1>
                        <div class="flex items-center text-gray-300 mb-4 space-x-4">
                            <span>${formatYear(movie.year)}</span>
                            <span>•</span>
                            <span>${movie.category}</span>
                            <span>•</span>
                            <span>${formatDuration(movie.duration)}</span>
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
        </div>
    `;
    }

    // Create movie modal component
    static createMovieModal(movie) {
        if (!movie) return '';

        const isBookmarked = appState.isBookmarked(movie.id);
        const bookmarkIcon = isBookmarked ? 'fas fa-bookmark' : 'far fa-bookmark';
        const bookmarkClass = isBookmarked ? 'text-red-500' : 'text-gray-400';
        const isFavorite = appState.isFavorite(movie.id);
        const heartIcon = isFavorite ? 'fas fa-heart' : 'far fa-heart';
        const heartClass = isFavorite ? 'text-red-500' : 'text-gray-400';

        return `
            <div class="modal-content">
        <div class="flex flex-col md:flex-row gap-6">
                    <!-- Movie Poster -->
                    <div class="flex-shrink-0">
                        <img src="${getImagePath(movie.image)}" 
                             alt="${movie.title}" 
                             class="w-full md:w-80 h-auto rounded-lg shadow-lg">
            </div>
                    <!-- Movie Details -->
                    <div class="flex-1 relative">
                        <button class="modal-bookmark-btn ${bookmarkClass} hover:text-red-500 transition-colors duration-200 absolute top-6 right-6 z-10" data-movie-id="${movie.id}" style="outline:none;">
                            <i class="${bookmarkIcon} text-2xl ${bookmarkClass}"></i>
                        </button>
                        <h2 class="text-2xl md:text-3xl font-bold text-white mb-2 mt-2">${movie.title}</h2>
                        
                        <div class="flex items-center text-gray-400 mb-4 space-x-4">
                            <span>${formatYear(movie.year)}</span>
                    <span>•</span>
                    <span>${movie.category}</span>
                            <span>•</span>
                            <span>${formatDuration(movie.duration)}</span>
                    <span>•</span>
                    <span>${movie.rating}</span>
                        </div>
                        
                        <div class="flex flex-wrap gap-2 mb-4">
                            ${movie.genre.map(genre =>
            `<span class="bg-gray-700 text-gray-300 text-sm px-3 py-1 rounded-full">${genre}</span>`
        ).join('')}
                        </div>
                        
                        <p class="text-gray-300 mb-6 leading-relaxed">${movie.description}</p>
                        
                        <div class="space-y-4">
                            <div>
                                <h4 class="text-white font-semibold mb-2">Cast:</h4>
                                <p class="text-gray-400">${movie.cast.join(', ')}</p>
                </div>
                            
                <div>
                                <h4 class="text-white font-semibold mb-2">Director:</h4>
                                <p class="text-gray-400">${movie.director}</p>
                            </div>
                        </div>
                        
                        <div class="flex space-x-4 mt-6">
                            <button class="modal-play-btn bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors duration-200">
                                <i class="fas fa-play"></i>
                                <span>Play</span>
                            </button>
                            <button class="modal-trailer-btn bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors duration-200">
                                <i class="fas fa-film"></i>
                                <span>Watch Trailer</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Create search suggestions component
    static createSearchSuggestions(results) {
        if (!results || results.length === 0) {
            return '<div class="p-4 text-gray-400 text-center">No results found</div>';
        }

        return results.map(movie => `
            <div class="search-suggestion-item flex items-center space-x-3 p-3 hover:bg-gray-700 cursor-pointer transition-colors duration-200" data-movie-id="${movie.id}">
                <img src="${getImagePath(movie.image)}" 
                     alt="${movie.title}" 
                     class="w-12 h-16 object-cover rounded">
                <div class="flex-1">
                    <h4 class="text-white font-semibold text-sm">${movie.title}</h4>
                    <p class="text-gray-400 text-xs">${formatYear(movie.year)} • ${movie.category}</p>
                </div>
                </div>
        `).join('');
    }

    // Create loading spinner component
    static createLoadingSpinner() {
        return `
            <div class="loading-spinner flex items-center justify-center p-8">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                <span class="ml-3 text-gray-400">Loading...</span>
                    </div>
        `;
    }

    // Create empty state component
    static createEmptyState(message = 'No content available') {
        return `
            <div class="empty-state flex flex-col items-center justify-center p-12 text-center">
                <i class="fas fa-film text-6xl text-gray-600 mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-400 mb-2">${message}</h3>
                <p class="text-gray-500">Try adjusting your search or filters</p>
            </div>
        `;
    }

    // Create category filter component
    static createCategoryFilter() {
        const categories = [
            { id: 'all', name: 'All', icon: 'fas fa-th' },
            { id: 'movie', name: 'Movies', icon: 'fas fa-film' },
            { id: 'tv_series', name: 'TV Series', icon: 'fas fa-tv' },
            { id: 'documentary', name: 'Documentary', icon: 'fas fa-camera' },
            { id: 'action', name: 'Action', icon: 'fas fa-fire' },
            { id: 'drama', name: 'Drama', icon: 'fas fa-theater-masks' },
            { id: 'comedy', name: 'Comedy', icon: 'fas fa-laugh' }
        ];

        return `
            <div class="category-filter flex flex-wrap gap-2 mb-6">
                ${categories.map(category => `
                    <button class="category-btn bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200" data-category="${category.id}">
                        <i class="${category.icon}"></i>
                        <span>${category.name}</span>
                    </button>
                `).join('')}
        </div>
    `;
    }

    // Create navigation component
    static createNavigation() {
        const navItems = [
            { id: 'home', name: 'Home', icon: 'fas fa-home' },
            { id: 'movies', name: 'Movies', icon: 'fas fa-film' },
            { id: 'tv', name: 'TV Shows', icon: 'fas fa-tv' },
            { id: 'mylist', name: 'My List', icon: 'fas fa-heart' },
            { id: 'new', name: 'New & Popular', icon: 'fas fa-fire' },
            { id: 'bookmark', name: 'Bookmarks', icon: 'fas fa-bookmark' }
        ];

        return `
            <nav class="main-navigation hidden md:flex space-x-6">
                ${navItems.map(item => `
                    <a href="#" class="nav-item text-gray-300 hover:text-red-500 transition-colors duration-200 flex items-center space-x-2" data-nav="${item.id}">
                        <i class="${item.icon}"></i>
                        <span>${item.name}</span>
                    </a>
                `).join('')}
            </nav>
        `;
    }

    // Create theme toggle component
    static createThemeToggle() {
        const currentTheme = appState.getTheme();
        const icon = currentTheme === CONFIG.THEMES.DARK ? 'fas fa-sun' : 'fas fa-moon';

        return `
            <button id="themeToggleBtn" class="theme-toggle bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition-colors duration-200">
                <i class="${icon} text-xl text-gray-300"></i>
            </button>
        `;
    }
}

export default Components; 