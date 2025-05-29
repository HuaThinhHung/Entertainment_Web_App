/* =============================================================================
   Netflix Style Layout - Main JavaScript
   ============================================================================= */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {

    /* =============================================================================
       SIDEBAR MENU FUNCTIONALITY
       ============================================================================= */

    // Get all sidebar navigation icons
    const sidebarIcons = document.querySelectorAll('.sidebar-nav-icon');
    const mainContent = document.querySelector('.main-content');

    // Add active state management
    function setActiveMenuItem(clickedItem) {
        // Remove active class from all items
        sidebarIcons.forEach(icon => {
            icon.classList.remove('active');
        });

        // Add active class to clicked item
        clickedItem.classList.add('active');
    }

    // Menu item click handlers
    sidebarIcons.forEach((icon, index) => {
        icon.addEventListener('click', function () {
            setActiveMenuItem(this);

            // Handle different menu actions
            switch (index) {
                case 0: // Home/Dashboard
                    showSection('home');
                    break;
                case 1: // Play/Movies
                    showSection('movies');
                    break;
                case 2: // Bookmarks
                    showSection('bookmarks');
                    break;
                case 3: // Favorites
                    showSection('favorites');
                    break;
            }
        });
    });

    // Function to show different sections
    function showSection(sectionName) {
        // Hide all sections first
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => {
            section.style.display = 'none';
        });

        // Show selected section or create it if doesn't exist
        let targetSection = document.getElementById(sectionName + '-section');

        if (!targetSection) {
            createSection(sectionName);
        } else {
            targetSection.style.display = 'block';
        }

        // Update page title
        updatePageTitle(sectionName);
    }

    // Function to create new sections dynamically
    function createSection(sectionName) {
        const mainContainer = document.querySelector('.main-content');
        const existingContent = document.querySelector('.existing-content');

        // Hide existing content
        if (existingContent) {
            existingContent.style.display = 'none';
        }

        // Create new section
        const newSection = document.createElement('div');
        newSection.id = sectionName + '-section';
        newSection.className = 'content-section';

        // Add content based on section type
        switch (sectionName) {
            case 'home':
                // Show original content for home
                if (existingContent) {
                    existingContent.style.display = 'block';
                    return;
                }
                break;

            case 'movies':
                newSection.innerHTML = `
                    <div class="mb-8">
                        <h1 class="text-3xl font-bold mb-6">Movies</h1>
                        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            <div class="text-center text-gray-400 py-20">
                                <i class="fas fa-film text-6xl mb-4"></i>
                                <p>Movies section coming soon...</p>
                            </div>
                        </div>
                    </div>
                `;
                break;

            case 'bookmarks':
                newSection.innerHTML = `
                    <div class="mb-8">
                        <h1 class="text-3xl font-bold mb-6">My Bookmarks</h1>
                        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            <div class="text-center text-gray-400 py-20">
                                <i class="fas fa-bookmark text-6xl mb-4"></i>
                                <p>No bookmarks yet. Start bookmarking your favorite content!</p>
                            </div>
                        </div>
                    </div>
                `;
                break;

            case 'favorites':
                newSection.innerHTML = `
                    <div class="mb-8">
                        <h1 class="text-3xl font-bold mb-6">My Favorites</h1>
                        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            <div class="text-center text-gray-400 py-20">
                                <i class="fas fa-heart text-6xl mb-4"></i>
                                <p>No favorites yet. Like content to see it here!</p>
                            </div>
                        </div>
                    </div>
                `;
                break;
        }

        mainContainer.appendChild(newSection);
    }

    // Function to update page title
    function updatePageTitle(sectionName) {
        const titles = {
            'home': 'Netflix Style Layout',
            'movies': 'Movies - Netflix Style Layout',
            'bookmarks': 'My Bookmarks - Netflix Style Layout',
            'favorites': 'My Favorites - Netflix Style Layout'
        };

        document.title = titles[sectionName] || 'Netflix Style Layout';
    }

    /* =============================================================================
       CARD HOVER EFFECTS
       ============================================================================= */

    // Add hover effects for cards
    function initializeCardHoverEffects() {
        document.querySelectorAll('.card-item').forEach(item => {
            item.addEventListener('mouseenter', function () {
                this.classList.add('hover-scale');
            });

            item.addEventListener('mouseleave', function () {
                this.classList.remove('hover-scale');
            });
        });
    }

    // Initialize card hover effects
    initializeCardHoverEffects();

    /* =============================================================================
       SEARCH FUNCTIONALITY
       ============================================================================= */

    const searchInput = document.getElementById('searchInput');

    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const searchTerm = this.value.toLowerCase().trim();

            if (searchTerm.length > 0) {
                performSearch(searchTerm);
            } else {
                clearSearch();
            }
        });

        // Handle Enter key press
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                const searchTerm = this.value.toLowerCase().trim();
                if (searchTerm.length > 0) {
                    performSearch(searchTerm);
                }
            }
        });
    }

    // Function to perform search
    function performSearch(searchTerm) {
        const allCards = document.querySelectorAll('.card-item');
        let hasResults = false;

        allCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const info = card.querySelector('p').textContent.toLowerCase();

            if (title.includes(searchTerm) || info.includes(searchTerm)) {
                card.style.display = 'block';
                card.style.opacity = '1';
                hasResults = true;
            } else {
                card.style.display = 'none';
                card.style.opacity = '0.5';
            }
        });

        // Show "no results" message if needed
        showNoResultsMessage(!hasResults, searchTerm);
    }

    // Function to clear search
    function clearSearch() {
        const allCards = document.querySelectorAll('.card-item');

        allCards.forEach(card => {
            card.style.display = 'block';
            card.style.opacity = '1';
        });

        // Hide "no results" message
        const noResultsMsg = document.getElementById('no-results-message');
        if (noResultsMsg) {
            noResultsMsg.remove();
        }
    }

    // Function to show/hide no results message
    function showNoResultsMessage(show, searchTerm) {
        let noResultsMsg = document.getElementById('no-results-message');

        if (show && !noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.id = 'no-results-message';
            noResultsMsg.className = 'text-center text-gray-400 py-20';
            noResultsMsg.innerHTML = `
                <i class="fas fa-search text-6xl mb-4"></i>
                <p class="text-xl mb-2">No results found for "${searchTerm}"</p>
                <p class="text-sm">Try different keywords or browse our categories</p>
            `;

            const mainContent = document.querySelector('.main-content');
            mainContent.appendChild(noResultsMsg);
        } else if (!show && noResultsMsg) {
            noResultsMsg.remove();
        }
    }

    /* =============================================================================
       BOOKMARK & FAVORITE FUNCTIONALITY
       ============================================================================= */

    // Handle bookmark clicks
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('fa-bookmark') || e.target.closest('.bookmark-icon')) {
            e.preventDefault();
            e.stopPropagation();

            const bookmarkIcon = e.target.classList.contains('fa-bookmark') ? e.target : e.target.querySelector('.fa-bookmark');
            toggleBookmark(bookmarkIcon);
        }
    });

    // Function to toggle bookmark
    function toggleBookmark(icon) {
        if (icon.classList.contains('fas')) {
            // Remove bookmark
            icon.classList.remove('fas');
            icon.classList.add('far');
            icon.style.color = '#9ca3af'; // gray-400
            showNotification('Removed from bookmarks');
        } else {
            // Add bookmark
            icon.classList.remove('far');
            icon.classList.add('fas');
            icon.style.color = '#fbbf24'; // yellow-400
            showNotification('Added to bookmarks');
        }
    }

    /* =============================================================================
       NOTIFICATION SYSTEM
       ============================================================================= */

    // Function to show notifications
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white font-medium z-50 transform translate-x-full transition-transform duration-300`;

        // Set background color based on type
        switch (type) {
            case 'success':
                notification.classList.add('bg-green-600');
                break;
            case 'error':
                notification.classList.add('bg-red-600');
                break;
            case 'warning':
                notification.classList.add('bg-yellow-600');
                break;
            default:
                notification.classList.add('bg-blue-600');
        }

        notification.textContent = message;
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);

        // Animate out and remove
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    /* =============================================================================
       INITIALIZE DEFAULT STATE
       ============================================================================= */

    // Set initial active state
    if (sidebarIcons.length > 0) {
        sidebarIcons[0].classList.add('active');
    }

    // Wrap existing content in a container for easier management
    const trendingSection = document.querySelector('.main-content').innerHTML;
    const mainContentDiv = document.querySelector('.main-content');

    const existingContentWrapper = document.createElement('div');
    existingContentWrapper.className = 'existing-content';
    existingContentWrapper.innerHTML = trendingSection;

    mainContentDiv.innerHTML = '';
    mainContentDiv.appendChild(existingContentWrapper);

    // Initialize with home section
    showSection('home');
});