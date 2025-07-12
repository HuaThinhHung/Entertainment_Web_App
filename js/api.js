import { CONFIG, getApiUrl, getImageUrl } from './config.js';
import { moviesData } from './data.js';

class ApiService {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    // Generic API request with error handling and caching
    async request(endpoint, params = {}) {
        const cacheKey = `${endpoint}?${new URLSearchParams(params).toString()}`;

        // Check cache first
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }

        try {
            const url = getApiUrl(endpoint, params);
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const data = await response.json();

            // Cache the result
            this.cache.set(cacheKey, {
                data,
                timestamp: Date.now()
            });

            return data;
        } catch (error) {
            console.warn('API request failed, using fallback data:', error);
            return this.getFallbackData(endpoint, params);
        }
    }

    // Get fallback data from local data
    getFallbackData(endpoint, params) {
        const { page = 1, with_genres, sort_by } = params;

        let movies = [];

        // Combine all movies from different categories
        if (endpoint.includes('/trending')) {
            movies = [...moviesData.trending];
        } else if (endpoint.includes('/movie/popular')) {
            movies = [...moviesData.recommended, ...moviesData.trending];
        } else if (endpoint.includes('/discover/movie')) {
            movies = [...moviesData.recommended, ...moviesData.trending];
        } else if (endpoint.includes('/search')) {
            const query = params.query?.toLowerCase();
            if (query) {
                const allMovies = [...moviesData.trending, ...moviesData.recommended];
                movies = allMovies.filter(movie =>
                    movie.title.toLowerCase().includes(query) ||
                    movie.description.toLowerCase().includes(query)
                );
            }
        } else {
            movies = [...moviesData.trending, ...moviesData.recommended];
        }

        // Apply filters
        if (with_genres) {
            const genreIds = with_genres.split(',').map(id => parseInt(id));
            movies = movies.filter(movie =>
                movie.genre.some(genre =>
                    genreIds.includes(this.getGenreIdFromName(genre))
                )
            );
        }

        // Apply sorting
        if (sort_by) {
            movies = this.sortMovies(movies, sort_by);
        }

        // Pagination
        const itemsPerPage = 20;
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedMovies = movies.slice(startIndex, endIndex);

        return {
            results: paginatedMovies,
            page: parseInt(page),
            total_pages: Math.ceil(movies.length / itemsPerPage),
            total_results: movies.length
        };
    }

    // Convert genre name to ID for filtering
    getGenreIdFromName(genreName) {
        const genreMap = {
            'Action': 28,
            'Adventure': 12,
            'Animation': 16,
            'Comedy': 35,
            'Crime': 80,
            'Documentary': 99,
            'Drama': 18,
            'Family': 10751,
            'Fantasy': 14,
            'History': 36,
            'Horror': 27,
            'Music': 10402,
            'Mystery': 9648,
            'Romance': 10749,
            'Science Fiction': 878,
            'Thriller': 53,
            'War': 10752,
            'Western': 37,
            'Space': 878,
            'Nature': 99,
            'Reality': 10764,
            'Cars': 12,
            'Entertainment': 35,
            'Travel': 99,
            'Culture': 99,
            'Wildlife': 99,
            'Sport': 10767,
            'Racing': 12
        };
        return genreMap[genreName] || 0;
    }

    // Sort movies by different criteria
    sortMovies(movies, sortBy) {
        const sorted = [...movies];

        switch (sortBy) {
            case 'popularity.desc':
                return sorted.sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0));
            case 'release_date.desc':
                return sorted.sort((a, b) => b.year - a.year);
            case 'title.asc':
                return sorted.sort((a, b) => a.title.localeCompare(b.title));
            case 'vote_average.desc':
                return sorted.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
            default:
                return sorted;
        }
    }

    // Transform local data to match API format
    transformMovieData(movie) {
        return {
            id: movie.id,
            title: movie.title,
            overview: movie.description,
            poster_path: movie.image,
            backdrop_path: movie.image,
            release_date: `${movie.year}-01-01`,
            vote_average: this.parseRating(movie.rating),
            vote_count: Math.floor(Math.random() * 1000) + 100,
            genre_ids: movie.genre.map(g => this.getGenreIdFromName(g)),
            media_type: movie.category.toLowerCase(),
            popularity: movie.isTrending ? 100 : Math.floor(Math.random() * 50) + 10,
            original_title: movie.title,
            original_language: 'en',
            adult: false,
            video: false,
            // Additional fields for compatibility
            name: movie.title,
            first_air_date: movie.category === 'TV Series' ? `${movie.year}-01-01` : null,
            origin_country: ['US'],
            // Custom fields
            custom: {
                duration: movie.duration,
                cast: movie.cast,
                director: movie.director,
                trailer: movie.trailer,
                isTrending: movie.isTrending,
                isSaved: movie.isSaved
            }
        };
    }

    // Parse rating string to number
    parseRating(rating) {
        const ratingMap = {
            'G': 1.0,
            'PG': 3.0,
            'PG-13': 5.0,
            'R': 7.0,
            'NC-17': 9.0,
            'E': 2.0
        };
        return ratingMap[rating] || 5.0;
    }

    // API Methods
    async getTrending(mediaType = 'all', timeWindow = 'day') {
        const data = await this.request(`/trending/${mediaType}/${timeWindow}`);
        return {
            ...data,
            results: data.results.map(movie => this.transformMovieData(movie))
        };
    }

    async getPopularMovies(page = 1) {
        const data = await this.request('/movie/popular', { page });
        return {
            ...data,
            results: data.results.map(movie => this.transformMovieData(movie))
        };
    }

    async getTopRatedMovies(page = 1) {
        const data = await this.request('/movie/top_rated', { page });
        return {
            ...data,
            results: data.results.map(movie => this.transformMovieData(movie))
        };
    }

    async getUpcomingMovies(page = 1) {
        const data = await this.request('/movie/upcoming', { page });
        return {
            ...data,
            results: data.results.map(movie => this.transformMovieData(movie))
        };
    }

    async getPopularTVShows(page = 1) {
        const data = await this.request('/tv/popular', { page });
        return {
            ...data,
            results: data.results.map(movie => this.transformMovieData(movie))
        };
    }

    async getTopRatedTVShows(page = 1) {
        const data = await this.request('/tv/top_rated', { page });
        return {
            ...data,
            results: data.results.map(movie => this.transformMovieData(movie))
        };
    }

    async searchMulti(query, page = 1) {
        const data = await this.request('/search/multi', { query, page });
        return {
            ...data,
            results: data.results.map(movie => this.transformMovieData(movie))
        };
    }

    async discoverMovies(params = {}) {
        const data = await this.request('/discover/movie', params);
        return {
            ...data,
            results: data.results.map(movie => this.transformMovieData(movie))
        };
    }

    async discoverTVShows(params = {}) {
        const data = await this.request('/discover/tv', params);
        return {
            ...data,
            results: data.results.map(movie => this.transformMovieData(movie))
        };
    }

    async getMovieDetails(movieId) {
        const data = await this.request(`/movie/${movieId}`);
        return this.transformMovieData(data);
    }

    async getTVShowDetails(tvId) {
        const data = await this.request(`/tv/${tvId}`);
        return this.transformMovieData(data);
    }

    async getGenres(mediaType = 'movie') {
        return await this.request(`/genre/${mediaType}/list`);
    }

    // Get image URL with proper sizing
    getImageUrl(path, size = 'poster') {
        return getImageUrl(path, size);
    }

    // Clear cache
    clearCache() {
        this.cache.clear();
    }
}

// Create and export singleton instance
const apiService = new ApiService();
export default apiService; 