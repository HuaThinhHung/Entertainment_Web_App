# Entertainment Web App

A modern, responsive web application for discovering and managing your favorite movies and TV shows.

## 🚀 Features

### Core Features

- **TMDB API Integration**: Real-time movie and TV show data from The Movie Database
- **Advanced Search**: Real-time search with autocomplete suggestions and keyword highlighting
- **Bookmark System**: Save and manage your favorite content with persistent storage
- **Smart Filtering & Sorting**: Filter by genre, year, rating, and sort by various criteria
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Dark/Light Mode**: Toggle between themes for comfortable viewing
- **Infinite Scroll**: Automatically load more content as you scroll

### Advanced Features

- **Rating & Review System**: Rate movies (1-5 stars) and write reviews
- **Watchlist & History**: Track your viewing journey with status management
- **Movie Details**: Comprehensive information including cast, director, trailers, and similar movies
- **Navigation**: Complete navigation system with About, Contact, and Watchlist pages
- **Loading States**: Skeleton loading and overlay loading for better UX
- **Toast Notifications**: User feedback for all actions

## 🛠 Technology Stack

- **HTML5**: Semantic markup and modern web standards
- **CSS3 & Tailwind CSS**: Modern styling with utility-first CSS framework
- **JavaScript ES6+**: Modern JavaScript with async/await, modules, and ES6+ features
- **TMDB API**: The Movie Database API for real-time movie and TV show data
- **LocalStorage**: Persistent data storage for user preferences and content

## 📁 Project Structure

```
Entertainment_Web_App/
├── css/
│   └── style.css              # Custom styles and theme support
├── images/
│   └── (movie posters and images)
├── js/
│   ├── main.js               # Main application logic
│   ├── api.js                # TMDB API integration
│   ├── utils.js              # Utility functions
│   ├── skeleton.js           # Loading skeleton components
│   ├── components.js         # Reusable UI components
│   ├── rating.js             # Rating and review system
│   └── watchlist.js          # Watchlist and history system
├── libs/
│   └── backtotop/            # Back to top functionality
├── index.html                # Main application page
├── about.html                # About page
├── contact.html              # Contact page
├── watchlist.html            # Watchlist & History page
└── README.md                 # Project documentation
```

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Entertainment_Web_App
   ```

2. **Open in browser**

   - Open `index.html` in your web browser
   - Or use a local server for better development experience

3. **Start exploring**
   - Browse trending and recommended content
   - Search for specific movies or TV shows
   - Add content to your bookmarks and watchlist
   - Rate and review your favorite content

## 📖 Usage Guide

### Navigation

- **Home**: Browse trending and recommended content
- **Movies**: View all movies with filtering and sorting
- **TV Series**: View all TV series with filtering and sorting
- **Bookmarks**: Access your saved content
- **Watchlist**: Manage your watchlist and view history
- **About**: Learn about the application and technology stack
- **Contact**: Get in touch with the developer

### Search & Discovery

- Use the search bar to find specific content
- Autocomplete suggestions appear as you type
- Search results highlight matching keywords
- Filter results by genre, year, rating, etc.

### Content Management

- **Bookmark**: Click the bookmark icon to save content
- **Watchlist**: Add content to your watchlist with status tracking
- **Rate & Review**: Rate movies and write reviews in detail view
- **History**: Track your viewing history with timestamps

### Movie Details

- Click on any movie/TV show card to view details
- View comprehensive information including cast, director, trailers
- See similar content recommendations
- Rate and review the content
- Add to watchlist with status tracking

### Theme & Settings

- Toggle between dark and light themes
- Theme preference is saved automatically
- Responsive design adapts to all screen sizes

## 🔧 API Integration

The app uses The Movie Database (TMDB) API for real-time data:

- **Trending Content**: Get current trending movies and TV shows
- **Search**: Multi-search across movies, TV shows, and people
- **Details**: Comprehensive movie and TV show information
- **Images**: High-quality posters and backdrops
- **Trailers**: YouTube trailer links when available

## 📱 Responsive Design

- **Desktop**: Full-featured experience with sidebar navigation
- **Tablet**: Optimized layout with touch-friendly controls
- **Mobile**: Hamburger menu and mobile-optimized interface
- **All Devices**: Consistent functionality across all screen sizes

## 🎨 UI/UX Features

- **Smooth Animations**: Hover effects, transitions, and loading states
- **Loading Skeletons**: Placeholder content while data loads
- **Toast Notifications**: User feedback for all actions
- **Modal Dialogs**: Detailed content views without page navigation
- **Infinite Scroll**: Seamless content loading
- **Keyboard Navigation**: ESC key to close modals, Enter for search

## 🔒 Data Persistence

- **Bookmarks**: Saved locally and persist across sessions
- **Watchlist**: Track viewing status and history
- **Ratings & Reviews**: Personal ratings and reviews stored locally
- **Theme Preference**: Dark/light mode preference saved
- **Search History**: Recent searches for quick access

## 🚀 Performance Features

- **Lazy Loading**: Images and content load as needed
- **Debounced Search**: Optimized search performance
- **Cached Data**: API responses cached for better performance
- **Efficient Rendering**: Optimized DOM updates and re-renders

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **TMDB**: For providing the comprehensive movie and TV show database
- **Tailwind CSS**: For the excellent utility-first CSS framework
- **Font Awesome**: For the beautiful icons
- **Community**: For feedback and suggestions

## 📞 Support

If you have any questions or need support:

- Check the [About page](about.html) for more information
- Use the [Contact form](contact.html) to get in touch
- Review the FAQ section for common questions

---

**Enjoy exploring the world of movies and TV shows! 🎬📺**
