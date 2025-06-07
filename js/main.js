// Import movies data
import moviesData from './data.js';

document.addEventListener('DOMContentLoaded', function () {
    // Initialize movies data
    const allMovies = [...moviesData.trending, ...moviesData.recommended];

    // Get DOM elements
    const searchInput = document.getElementById('searchInput');
    const mainContent = document.querySelector('.ml-16.p-6');
    const trendingSection = document.querySelector('.mb-10');
    const recommendedSection = Array.from(document.querySelectorAll('h2')).find(h2 => h2.textContent.includes('Recommended for you'))?.parentElement;

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function (e) {
            const searchTerm = e.target.value.toLowerCase().trim();
            handleSearch(searchTerm);
        }, 300));

        // Add keypress event for Enter key
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                const searchTerm = e.target.value.toLowerCase().trim();
                handleSearch(searchTerm);
            }
        });
    }

    // Debounce function to limit search frequency
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Handle search functionality
    function handleSearch(searchTerm) {
        if (!searchTerm) {
            // Show original sections when search is empty
            if (trendingSection) trendingSection.style.display = 'block';
            if (recommendedSection) recommendedSection.style.display = 'block';
            removeSearchResults();
            return;
        }

        // Hide original sections when searching
        if (trendingSection) trendingSection.style.display = 'none';
        if (recommendedSection) recommendedSection.style.display = 'none';

        // Filter movies based on search term
        const filteredMovies = allMovies.filter(movie => {
            const searchableFields = [
                movie.title.toLowerCase(),
                ...movie.genre.map(g => g.toLowerCase()),
                movie.year.toString(),
                movie.category.toLowerCase(),
                movie.description.toLowerCase()
            ];
            return searchableFields.some(field => field.includes(searchTerm));
        });

        // Display search results
        displaySearchResults(filteredMovies, searchTerm);
    }

    // Function to display search results
    function displaySearchResults(movies, searchTerm) {
        removeSearchResults(); // Remove existing results

        // Create search results section
        const searchSection = document.createElement('div');
        searchSection.id = 'searchResults';
        searchSection.className = 'mb-10';

        // Add search results header
        const header = document.createElement('h2');
        header.className = 'text-2xl font-semibold mb-6';
        header.textContent = `Search Results for "${searchTerm}"`;
        searchSection.appendChild(header);

        // Create grid container for results
        const grid = document.createElement('div');
        grid.className = 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4';

        if (movies.length === 0) {
            // Show no results message
            const noResults = document.createElement('div');
            noResults.className = 'col-span-full text-center text-gray-400 py-20';
            noResults.innerHTML = `
                <i class="fas fa-search text-6xl mb-4"></i>
                <p class="text-xl mb-2">No results found</p>
                <p class="text-sm">Try different keywords or remove search filters</p>
            `;
            grid.appendChild(noResults);
        } else {
            // Create movie cards for results
            movies.forEach(movie => {
                const card = createMovieCard(movie);
                grid.appendChild(card);
            });
        }

        searchSection.appendChild(grid);
        if (mainContent) {
            mainContent.insertBefore(searchSection, mainContent.firstChild);
        }
    }

    // Function to remove search results
    function removeSearchResults() {
        const existingResults = document.getElementById('searchResults');
        if (existingResults) {
            existingResults.remove();
        }
    }

    // Function to create a movie card
    function createMovieCard(movie) {
        const card = document.createElement('div');
        card.className = 'card-item cursor-pointer';
        card.innerHTML = `
            <div class="aspect-[3/4] rounded-lg overflow-hidden relative">
                <img src="images/${movie.image}" alt="${movie.title}" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-black bg-opacity-20 hover:bg-opacity-40 transition-opacity"></div>
                <div class="absolute bottom-3 left-3 z-10">
                    <div class="flex items-center space-x-2 text-sm text-gray-300 mb-1">
                        <span>${movie.year}</span>
                        <span>•</span>
                        <span class="flex items-center">
                            <i class="fas ${movie.category === 'Movie' ? 'fa-film' : 'fa-tv'} mr-1"></i>
                            ${movie.category}
                        </span>
                        <span>•</span>
                        <span>${movie.rating}</span>
                    </div>
                    <h3 class="text-sm font-semibold">${movie.title}</h3>
                </div>
                <div class="absolute top-3 right-3 bg-black bg-opacity-50 rounded-full p-1.5 opacity-0 hover:opacity-100 transition-opacity z-10">
                    <i class="fas fa-play text-white text-xs"></i>
                </div>
                <div class="absolute top-3 left-3 bg-black bg-opacity-50 rounded px-2 py-1 bookmark-btn z-10" data-movie-id="${movie.id}">
                    <i class="fas fa-bookmark text-white text-xs ${movie.isSaved ? 'text-red-600' : ''}"></i>
                </div>
            </div>
        `;

        // Add click event to show movie details
        card.addEventListener('click', () => showMovieDetails(movie));

        // Add bookmark functionality
        const bookmarkBtn = card.querySelector('.bookmark-btn');
        if (bookmarkBtn) {
            bookmarkBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent modal from opening
                toggleBookmark(movie.id);
                const icon = bookmarkBtn.querySelector('i');
                if (icon) {
                    icon.classList.toggle('text-red-600');
                }
            });
        }

        return card;
    }

    // Function to show movie details
    function showMovieDetails(movie) {
        const modal = document.getElementById('movieModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalContent = document.getElementById('modalContent');

        if (!modal || !modalTitle || !modalContent) return;

        modalTitle.textContent = movie.title;
        modalContent.innerHTML = `
            <div class="flex flex-col md:flex-row gap-6">
                <div class="w-full md:w-1/3">
                    <img src="images/${movie.image}" alt="${movie.title}" class="w-full rounded-lg">
                </div>
                <div class="w-full md:w-2/3 space-y-4">
                    <div class="flex items-center space-x-2 text-sm text-gray-300">
                        <span>${movie.year}</span>
                        <span>•</span>
                        <span>${movie.category}</span>
                        <span>•</span>
                        <span>${movie.rating}</span>
                        <span>•</span>
                        <span>${movie.duration}</span>
                    </div>
                    <p class="text-gray-300">${movie.description}</p>
                    <div>
                        <h4 class="text-sm font-semibold mb-1">Genre:</h4>
                        <div class="flex flex-wrap gap-2">
                            ${movie.genre.map(g => `
                                <span class="px-2 py-1 bg-gray-700 rounded-full text-xs">${g}</span>
                            `).join('')}
                        </div>
                    </div>
                    <div>
                        <h4 class="text-sm font-semibold mb-1">Cast:</h4>
                        <p class="text-gray-300 text-sm">${movie.cast.join(', ')}</p>
                    </div>
                    <div>
                        <h4 class="text-sm font-semibold mb-1">Director:</h4>
                        <p class="text-gray-300 text-sm">${movie.director}</p>
                    </div>
                    ${movie.trailer ? `
                        <div class="mt-4">
                            <a href="${movie.trailer}" target="_blank" class="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
                                <i class="fas fa-play text-sm"></i>
                                <span>Watch Trailer</span>
                            </a>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        // Show modal
        modal.classList.remove('hidden');
        modal.classList.add('flex');

        // Close modal functionality
        const closeModal = document.getElementById('closeModal');
        if (closeModal) {
            closeModal.onclick = () => {
                modal.classList.remove('flex');
                modal.classList.add('hidden');
            };
        }

        // Close modal when clicking outside
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.classList.remove('flex');
                modal.classList.add('hidden');
            }
        };
    }

    // Function to toggle bookmark status
    function toggleBookmark(movieId) {
        const movie = allMovies.find(m => m.id === movieId);
        if (movie) {
            movie.isSaved = !movie.isSaved;
            // Save to localStorage
            saveBookmarks();
            // Update all instances of this movie's bookmark button
            updateBookmarkButtons(movieId, movie.isSaved);
        }
    }

    // Function to update all bookmark buttons for a movie
    function updateBookmarkButtons(movieId, isSaved) {
        const bookmarkBtns = document.querySelectorAll(`.bookmark-btn[data-movie-id="${movieId}"] i`);
        bookmarkBtns.forEach(icon => {
            if (isSaved) {
                icon.classList.add('text-red-600');
            } else {
                icon.classList.remove('text-red-600');
            }
        });
    }

    // Function to save bookmarks to localStorage
    function saveBookmarks() {
        try {
            const bookmarkedMovies = allMovies
                .filter(movie => movie.isSaved)
                .map(movie => movie.id);
            localStorage.setItem('bookmarkedMovies', JSON.stringify(bookmarkedMovies));
        } catch (error) {
            console.error('Error saving bookmarks:', error);
        }
    }

    // Function to load bookmarks from localStorage
    function loadBookmarks() {
        try {
            const savedBookmarks = JSON.parse(localStorage.getItem('bookmarkedMovies')) || [];
            savedBookmarks.forEach(id => {
                const movie = allMovies.find(m => m.id === id);
                if (movie) {
                    movie.isSaved = true;
                    updateBookmarkButtons(id, true);
                }
            });
        } catch (error) {
            console.error('Error loading bookmarks:', error);
        }
    }

    // Initialize bookmark buttons
    function initializeBookmarkButtons() {
        document.querySelectorAll('.bookmark-btn').forEach(btn => {
            const movieId = parseInt(btn.dataset.movieId);
            if (!movieId) return;

            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent modal from opening
                toggleBookmark(movieId);
            });

            // Set initial state
            const movie = allMovies.find(m => m.id === movieId);
            if (movie && movie.isSaved) {
                const icon = btn.querySelector('i');
                if (icon) {
                    icon.classList.add('text-red-600');
                }
            }
        });
    }

    // Navigation icon handlers
    const sidebarIcons = document.querySelectorAll('.sidebar-icon');
    sidebarIcons.forEach((icon, idx) => {
        icon.addEventListener('click', () => {
            // Xóa trạng thái active cũ
            sidebarIcons.forEach(i => i.classList.remove('active', 'text-red-500'));
            icon.classList.add('active', 'text-red-500');

            // Xử lý từng icon
            switch (idx) {
                case 0: // Home
                    renderAllMovies();
                    break;
                case 1: // Movie
                    renderMoviesByCategory('Movie');
                    break;
                case 2: // TV Series
                    renderMoviesByCategory('TV Series');
                    break;
                case 3: // Bookmark
                    renderBookmarkedMovies();
                    break;
            }
        });
    });

    // Hàm hiển thị tất cả phim
    function renderAllMovies() {
        // Hiện lại các section gốc
        if (trendingSection) trendingSection.style.display = 'block';
        if (recommendedSection) recommendedSection.style.display = 'block';
        removeSearchResults();
    }

    // Hàm lọc phim theo category
    function renderMoviesByCategory(category) {
        if (trendingSection) trendingSection.style.display = 'none';
        if (recommendedSection) recommendedSection.style.display = 'none';
        const filtered = allMovies.filter(m => m.category === category);
        displaySearchResults(filtered, category);
    }

    // Hàm hiển thị phim đã bookmark
    function renderBookmarkedMovies() {
        if (trendingSection) trendingSection.style.display = 'none';
        if (recommendedSection) recommendedSection.style.display = 'none';
        const filtered = allMovies.filter(m => m.isSaved);
        displaySearchResults(filtered, "Bookmarked");
    }

    // Initialize the app
    loadBookmarks();
    initializeBookmarkButtons();
});
