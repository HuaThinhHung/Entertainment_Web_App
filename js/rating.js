// Rating and Review System
class RatingSystem {
    constructor() {
        this.ratings = this.loadRatings();
        this.reviews = this.loadReviews();
    }

    // Load ratings from localStorage
    loadRatings() {
        const saved = localStorage.getItem('movieRatings');
        return saved ? JSON.parse(saved) : {};
    }

    // Load reviews from localStorage
    loadReviews() {
        const saved = localStorage.getItem('movieReviews');
        return saved ? JSON.parse(saved) : {};
    }

    // Save ratings to localStorage
    saveRatings() {
        localStorage.setItem('movieRatings', JSON.stringify(this.ratings));
    }

    // Save reviews to localStorage
    saveReviews() {
        localStorage.setItem('movieReviews', JSON.stringify(this.reviews));
    }

    // Rate a movie
    rateMovie(movieId, rating) {
        if (rating < 1 || rating > 5) {
            throw new Error('Rating must be between 1 and 5');
        }

        this.ratings[movieId] = rating;
        this.saveRatings();

        // Update UI
        this.updateRatingDisplay(movieId);

        return rating;
    }

    // Get user rating for a movie
    getUserRating(movieId) {
        return this.ratings[movieId] || null;
    }

    // Get average rating for a movie (combine user ratings with TMDB rating)
    getAverageRating(movieId, tmdbRating = 0) {
        const userRating = this.ratings[movieId];
        if (!userRating) return tmdbRating;

        // Simple average (in a real app, you'd have multiple user ratings)
        return ((userRating + tmdbRating) / 2).toFixed(1);
    }

    // Add a review
    addReview(movieId, review) {
        if (!review.trim()) {
            throw new Error('Review cannot be empty');
        }

        if (!this.reviews[movieId]) {
            this.reviews[movieId] = [];
        }

        const newReview = {
            id: Date.now(),
            text: review.trim(),
            date: new Date().toISOString(),
            rating: this.ratings[movieId] || null
        };

        this.reviews[movieId].unshift(newReview);
        this.saveReviews();

        return newReview;
    }

    // Get reviews for a movie
    getReviews(movieId) {
        return this.reviews[movieId] || [];
    }

    // Delete a review
    deleteReview(movieId, reviewId) {
        if (this.reviews[movieId]) {
            this.reviews[movieId] = this.reviews[movieId].filter(review => review.id !== reviewId);
            this.saveReviews();
        }
    }

    // Create rating stars component
    createRatingStars(movieId, currentRating = 0, interactive = true) {
        const container = document.createElement('div');
        container.className = 'flex items-center space-x-1';

        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('i');
            star.className = `fas fa-star cursor-pointer transition-colors ${i <= currentRating ? 'text-yellow-400' : 'text-gray-400'
                }`;

            if (interactive) {
                star.addEventListener('click', () => {
                    this.rateMovie(movieId, i);
                    this.updateStars(container, i);
                });

                star.addEventListener('mouseenter', () => {
                    this.updateStars(container, i, true);
                });

                star.addEventListener('mouseleave', () => {
                    this.updateStars(container, currentRating);
                });
            }

            container.appendChild(star);
        }

        return container;
    }

    // Update stars display
    updateStars(container, rating, isHover = false) {
        const stars = container.querySelectorAll('i');
        stars.forEach((star, index) => {
            const starNumber = index + 1;
            if (starNumber <= rating) {
                star.className = `fas fa-star cursor-pointer transition-colors text-yellow-400`;
            } else {
                star.className = `fas fa-star cursor-pointer transition-colors text-gray-400`;
            }
        });
    }

    // Update rating display in movie cards
    updateRatingDisplay(movieId) {
        const ratingElements = document.querySelectorAll(`[data-movie-id="${movieId}"] .rating-stars`);
        const userRating = this.getUserRating(movieId);

        ratingElements.forEach(element => {
            if (userRating) {
                element.innerHTML = '';
                element.appendChild(this.createRatingStars(movieId, userRating, false));
            }
        });
    }

    // Create review form
    createReviewForm(movieId) {
        const form = document.createElement('div');
        form.className = 'space-y-4';
        form.innerHTML = `
            <div>
                <label class="block text-sm font-medium mb-2">Your Rating</label>
                <div class="rating-stars-container mb-2"></div>
            </div>
            <div>
                <label class="block text-sm font-medium mb-2">Your Review</label>
                <textarea 
                    class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500 transition-colors resize-none"
                    rows="4"
                    placeholder="Share your thoughts about this movie..."
                ></textarea>
            </div>
            <button class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors">
                Submit Review
            </button>
        `;

        // Add rating stars
        const starsContainer = form.querySelector('.rating-stars-container');
        const currentRating = this.getUserRating(movieId) || 0;
        starsContainer.appendChild(this.createRatingStars(movieId, currentRating, true));

        // Handle form submission
        const submitBtn = form.querySelector('button');
        const textarea = form.querySelector('textarea');

        submitBtn.addEventListener('click', () => {
            const review = textarea.value.trim();
            const rating = this.getUserRating(movieId);

            if (!rating) {
                alert('Please rate the movie first');
                return;
            }

            if (!review) {
                alert('Please write a review');
                return;
            }

            try {
                this.addReview(movieId, review);
                alert('Review submitted successfully!');
                textarea.value = '';
                // Refresh reviews display
                this.displayReviews(movieId);
            } catch (error) {
                alert(error.message);
            }
        });

        return form;
    }

    // Display reviews for a movie
    displayReviews(movieId) {
        const reviews = this.getReviews(movieId);
        const container = document.createElement('div');
        container.className = 'space-y-4';

        if (reviews.length === 0) {
            container.innerHTML = `
                <div class="text-center text-gray-400 py-8">
                    <i class="fas fa-comment text-4xl mb-4"></i>
                    <p>No reviews yet. Be the first to review this movie!</p>
                </div>
            `;
        } else {
            reviews.forEach(review => {
                const reviewElement = document.createElement('div');
                reviewElement.className = 'bg-gray-800 p-4 rounded-lg';
                reviewElement.innerHTML = `
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center space-x-2">
                            ${review.rating ? this.createRatingStars(movieId, review.rating, false).outerHTML : ''}
                            <span class="text-sm text-gray-400">${new Date(review.date).toLocaleDateString()}</span>
                        </div>
                        <button class="text-red-500 hover:text-red-400 text-sm delete-review" data-review-id="${review.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <p class="text-gray-300">${review.text}</p>
                `;

                // Add delete functionality
                const deleteBtn = reviewElement.querySelector('.delete-review');
                deleteBtn.addEventListener('click', () => {
                    if (confirm('Are you sure you want to delete this review?')) {
                        this.deleteReview(movieId, review.id);
                        this.displayReviews(movieId);
                    }
                });

                container.appendChild(reviewElement);
            });
        }

        return container;
    }

    // Get rating statistics
    getRatingStats(movieId) {
        const userRating = this.getUserRating(movieId);
        const reviews = this.getReviews(movieId);

        return {
            userRating,
            reviewCount: reviews.length,
            hasUserRated: !!userRating,
            hasUserReviewed: reviews.some(review => review.rating === userRating)
        };
    }
}

// Create and export rating system instance
const ratingSystem = new RatingSystem();

export default ratingSystem; 