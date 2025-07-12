// Watchlist and History System
class WatchlistSystem {
    constructor() {
        this.watchlist = this.loadWatchlist();
        this.history = this.loadHistory();
    }

    // Load watchlist from localStorage
    loadWatchlist() {
        const saved = localStorage.getItem('movieWatchlist');
        return saved ? JSON.parse(saved) : [];
    }

    // Load history from localStorage
    loadHistory() {
        const saved = localStorage.getItem('movieHistory');
        return saved ? JSON.parse(saved) : [];
    }

    // Save watchlist to localStorage
    saveWatchlist() {
        localStorage.setItem('movieWatchlist', JSON.stringify(this.watchlist));
    }

    // Save history to localStorage
    saveHistory() {
        localStorage.setItem('movieHistory', JSON.stringify(this.history));
    }

    // Add movie to watchlist
    addToWatchlist(movie) {
        const existingIndex = this.watchlist.findIndex(item => item.id === movie.id);
        if (existingIndex === -1) {
            this.watchlist.unshift({
                ...movie,
                addedAt: new Date().toISOString(),
                status: 'plan_to_watch'
            });
            this.saveWatchlist();
            return true;
        }
        return false;
    }

    // Remove movie from watchlist
    removeFromWatchlist(movieId) {
        const index = this.watchlist.findIndex(item => item.id === movieId);
        if (index !== -1) {
            this.watchlist.splice(index, 1);
            this.saveWatchlist();
            return true;
        }
        return false;
    }

    // Update watchlist status
    updateWatchlistStatus(movieId, status) {
        const movie = this.watchlist.find(item => item.id === movieId);
        if (movie) {
            movie.status = status;
            movie.updatedAt = new Date().toISOString();

            // If marked as watched, add to history
            if (status === 'watched') {
                this.addToHistory(movie);
            }

            this.saveWatchlist();
            return true;
        }
        return false;
    }

    // Add movie to history
    addToHistory(movie) {
        const existingIndex = this.history.findIndex(item => item.id === movie.id);
        if (existingIndex !== -1) {
            // Update existing entry
            this.history[existingIndex].watchedAt = new Date().toISOString();
            this.history[existingIndex].watchCount = (this.history[existingIndex].watchCount || 0) + 1;
        } else {
            // Add new entry
            this.history.unshift({
                ...movie,
                watchedAt: new Date().toISOString(),
                watchCount: 1
            });
        }
        this.saveHistory();
    }

    // Remove movie from history
    removeFromHistory(movieId) {
        const index = this.history.findIndex(item => item.id === movieId);
        if (index !== -1) {
            this.history.splice(index, 1);
            this.saveHistory();
            return true;
        }
        return false;
    }

    // Get watchlist
    getWatchlist(status = null) {
        if (status) {
            return this.watchlist.filter(item => item.status === status);
        }
        return this.watchlist;
    }

    // Get history
    getHistory() {
        return this.history;
    }

    // Check if movie is in watchlist
    isInWatchlist(movieId) {
        return this.watchlist.some(item => item.id === movieId);
    }

    // Check if movie is in history
    isInHistory(movieId) {
        return this.history.some(item => item.id === movieId);
    }

    // Get movie status
    getMovieStatus(movieId) {
        const watchlistItem = this.watchlist.find(item => item.id === movieId);
        if (watchlistItem) {
            return watchlistItem.status;
        }

        if (this.isInHistory(movieId)) {
            return 'watched';
        }

        return 'not_added';
    }

    // Create watchlist button
    createWatchlistButton(movie) {
        const button = document.createElement('button');
        const status = this.getMovieStatus(movie.id);

        button.className = 'watchlist-btn bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2';
        button.setAttribute('data-movie-id', movie.id);

        const icon = document.createElement('i');
        const text = document.createElement('span');

        switch (status) {
            case 'plan_to_watch':
                icon.className = 'fas fa-clock text-yellow-400';
                text.textContent = 'Plan to Watch';
                break;
            case 'watching':
                icon.className = 'fas fa-play text-blue-400';
                text.textContent = 'Watching';
                break;
            case 'watched':
                icon.className = 'fas fa-check text-green-400';
                text.textContent = 'Watched';
                break;
            default:
                icon.className = 'fas fa-plus text-gray-300';
                text.textContent = 'Add to Watchlist';
        }

        button.appendChild(icon);
        button.appendChild(text);

        button.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleWatchlist(movie);
            this.updateWatchlistButton(button, movie.id);
        });

        return button;
    }

    // Toggle watchlist
    toggleWatchlist(movie) {
        const status = this.getMovieStatus(movie.id);

        if (status === 'not_added') {
            this.addToWatchlist(movie);
            showToast('Added to watchlist!', 'success');
        } else {
            this.removeFromWatchlist(movie.id);
            showToast('Removed from watchlist!', 'success');
        }
    }

    // Update watchlist button
    updateWatchlistButton(button, movieId) {
        const status = this.getMovieStatus(movieId);
        const icon = button.querySelector('i');
        const text = button.querySelector('span');

        switch (status) {
            case 'plan_to_watch':
                icon.className = 'fas fa-clock text-yellow-400';
                text.textContent = 'Plan to Watch';
                break;
            case 'watching':
                icon.className = 'fas fa-play text-blue-400';
                text.textContent = 'Watching';
                break;
            case 'watched':
                icon.className = 'fas fa-check text-green-400';
                text.textContent = 'Watched';
                break;
            default:
                icon.className = 'fas fa-plus text-gray-300';
                text.textContent = 'Add to Watchlist';
        }
    }

    // Create status dropdown
    createStatusDropdown(movieId) {
        const dropdown = document.createElement('select');
        dropdown.className = 'bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500';
        dropdown.innerHTML = `
            <option value="plan_to_watch">Plan to Watch</option>
            <option value="watching">Watching</option>
            <option value="watched">Watched</option>
        `;

        const currentStatus = this.getMovieStatus(movieId);
        if (currentStatus !== 'not_added') {
            dropdown.value = currentStatus;
        }

        dropdown.addEventListener('change', (e) => {
            this.updateWatchlistStatus(movieId, e.target.value);
            showToast(`Status updated to ${e.target.value.replace('_', ' ')}!`, 'success');
        });

        return dropdown;
    }

    // Create watchlist card
    createWatchlistCard(movie) {
        const card = document.createElement('div');
        card.className = 'bg-gray-800 rounded-lg overflow-hidden';
        card.innerHTML = `
            <div class="relative">
                <img src="${movie.image}" alt="${movie.title}" class="w-full h-48 object-cover">
                <div class="absolute top-2 right-2">
                    <button class="remove-watchlist bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors" data-movie-id="${movie.id}">
                        <i class="fas fa-times text-sm"></i>
                    </button>
                </div>
                <div class="absolute bottom-2 left-2">
                    <span class="bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                        ${movie.category}
                    </span>
                </div>
            </div>
            <div class="p-4">
                <h3 class="font-semibold text-lg mb-2">${movie.title}</h3>
                <div class="flex items-center space-x-2 text-sm text-gray-300 mb-3">
                    <span>${movie.year}</span>
                    <span>•</span>
                    <span>${movie.rating}</span>
                    <span>•</span>
                    <span>${movie.duration}</span>
                </div>
                <div class="space-y-3">
                    <div class="status-dropdown-container"></div>
                    <button class="view-details w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors" data-movie-id="${movie.id}">
                        View Details
                    </button>
                </div>
            </div>
        `;

        // Add status dropdown
        const dropdownContainer = card.querySelector('.status-dropdown-container');
        const dropdown = this.createStatusDropdown(movie.id);
        dropdownContainer.appendChild(dropdown);

        // Add event listeners
        const removeBtn = card.querySelector('.remove-watchlist');
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeFromWatchlist(movie.id);
            card.remove();
            showToast('Removed from watchlist!', 'success');
        });

        const viewBtn = card.querySelector('.view-details');
        viewBtn.addEventListener('click', () => {
            // This will be handled by the main app
            const event = new CustomEvent('showMovieDetails', { detail: movie });
            document.dispatchEvent(event);
        });

        return card;
    }

    // Create history card
    createHistoryCard(movie) {
        const card = document.createElement('div');
        card.className = 'bg-gray-800 rounded-lg overflow-hidden';
        card.innerHTML = `
            <div class="relative">
                <img src="${movie.image}" alt="${movie.title}" class="w-full h-48 object-cover">
                <div class="absolute top-2 right-2">
                    <button class="remove-history bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors" data-movie-id="${movie.id}">
                        <i class="fas fa-times text-sm"></i>
                    </button>
                </div>
                <div class="absolute bottom-2 left-2">
                    <span class="bg-green-600 text-white px-2 py-1 rounded text-xs">
                        <i class="fas fa-check mr-1"></i>Watched
                    </span>
                </div>
            </div>
            <div class="p-4">
                <h3 class="font-semibold text-lg mb-2">${movie.title}</h3>
                <div class="flex items-center space-x-2 text-sm text-gray-300 mb-3">
                    <span>${movie.year}</span>
                    <span>•</span>
                    <span>${movie.rating}</span>
                    <span>•</span>
                    <span>${movie.duration}</span>
                </div>
                <div class="text-sm text-gray-400 mb-3">
                    <div>Watched: ${new Date(movie.watchedAt).toLocaleDateString()}</div>
                    ${movie.watchCount > 1 ? `<div>Watched ${movie.watchCount} times</div>` : ''}
                </div>
                <button class="view-details w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors" data-movie-id="${movie.id}">
                    View Details
                </button>
            </div>
        `;

        // Add event listeners
        const removeBtn = card.querySelector('.remove-history');
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeFromHistory(movie.id);
            card.remove();
            showToast('Removed from history!', 'success');
        });

        const viewBtn = card.querySelector('.view-details');
        viewBtn.addEventListener('click', () => {
            // This will be handled by the main app
            const event = new CustomEvent('showMovieDetails', { detail: movie });
            document.dispatchEvent(event);
        });

        return card;
    }

    // Get statistics
    getStats() {
        const watchlistStats = {
            total: this.watchlist.length,
            plan_to_watch: this.watchlist.filter(item => item.status === 'plan_to_watch').length,
            watching: this.watchlist.filter(item => item.status === 'watching').length,
            watched: this.watchlist.filter(item => item.status === 'watched').length
        };

        const historyStats = {
            total: this.history.length,
            totalWatches: this.history.reduce((sum, item) => sum + (item.watchCount || 1), 0)
        };

        return { watchlist: watchlistStats, history: historyStats };
    }
}

// Create and export watchlist system instance
const watchlistSystem = new WatchlistSystem();

export default watchlistSystem; 