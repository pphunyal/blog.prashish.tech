/**
 * Search System - Handles blog post searching and filtering
 */

class SearchSystem {
    constructor() {
        this.searchInput = document.getElementById('search-input');
        this.posts = [];
        this.blogSystem = null;
        this.searchResults = [];
        this.isSearching = false;
    }

    /**
     * Initialize search system
     */
    init(posts, blogSystem) {
        this.posts = posts || [];
        this.blogSystem = blogSystem || new BlogSystem();
        
        if (this.searchInput) {
            this.bindEvents();
        }
    }

    /**
     * Bind search events
     */
    bindEvents() {
        // Debounced search input
        const debouncedSearch = utils.debounce((query) => {
            this.performSearch(query);
        }, 300);

        this.searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            debouncedSearch(query);
        });

        // Handle search on enter key
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.performSearch(this.searchInput.value.trim());
            }
        });

        // Clear search when input is cleared
        this.searchInput.addEventListener('change', (e) => {
            if (e.target.value === '') {
                this.clearSearch();
            }
        });
    }

    /**
     * Perform search operation
     */
    performSearch(query) {
        if (!query || query.length < 2) {
            this.clearSearch();
            return;
        }

        this.isSearching = true;
        this.updateSearchState();

        try {
            // Perform the search
            this.searchResults = this.blogSystem.searchPosts(query);
            
            // Update UI with results
            this.displaySearchResults(query);
            
            // Update URL to reflect search
            this.updateSearchURL(query);
        } catch (error) {
            console.error('Search error:', error);
            this.isSearching = false;
            this.updateSearchState();
            
            // Show error message
            const recentPostsList = document.getElementById('recent-posts');
            if (recentPostsList) {
                recentPostsList.innerHTML = `
                    <li class="error-state">
                        <p>Search error occurred. Please try again.</p>
                    </li>
                `;
            }
        }
    }

    /**
     * Clear search and show all posts
     */
    clearSearch() {
        this.isSearching = false;
        this.searchResults = [];
        this.updateSearchState();
        
        // Update section title back to "Recent Posts"
        const postsSection = document.querySelector('.posts-section');
        const sectionTitle = postsSection?.querySelector('.section-title');
        if (sectionTitle) {
            sectionTitle.textContent = 'Recent Posts';
        }
        
        // Show all recent posts
        const recentPostsList = document.getElementById('recent-posts');
        if (recentPostsList && this.blogSystem) {
            const recentPosts = this.blogSystem.getRecentPosts();
            this.blogSystem.renderPostList(recentPosts, recentPostsList);
        }
        
        // Clear search URL
        this.updateSearchURL('');
    }

    /**
     * Display search results
     */
    displaySearchResults(query) {
        const recentPostsList = document.getElementById('recent-posts');
        const postsSection = document.querySelector('.posts-section');
        
        if (!recentPostsList || !postsSection) return;

        // Update section title
        const sectionTitle = postsSection.querySelector('.section-title');
        if (sectionTitle) {
            sectionTitle.textContent = this.searchResults.length > 0 
                ? `Search Results (${this.searchResults.length})`
                : 'No Results Found';
        }

        // Show results or no results message
        if (this.searchResults.length > 0) {
            this.blogSystem.renderPostList(this.searchResults, recentPostsList);
        } else {
            recentPostsList.innerHTML = `
                <li class="no-posts">
                    <div class="no-results">
                        <p>No posts found for "${utils.escapeHtml(query)}"</p>
                        <p class="search-suggestions">
                            Try searching for: 
                            <button class="suggestion-btn" data-query="blockchain">blockchain</button>,
                            <button class="suggestion-btn" data-query="crypto">crypto</button>,
                            <button class="suggestion-btn" data-query="economics">economics</button>,
                            <button class="suggestion-btn" data-query="ai">AI</button>
                        </p>
                    </div>
                </li>
            `;
            
            // Add event listeners to suggestion buttons
            const suggestionBtns = recentPostsList.querySelectorAll('.suggestion-btn');
            suggestionBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const suggestedQuery = btn.getAttribute('data-query');
                    this.searchInput.value = suggestedQuery;
                    this.performSearch(suggestedQuery);
                });
            });
        }
    }

    /**
     * Update search state indicators
     */
    updateSearchState() {
        // Add/remove searching class to container
        const container = document.querySelector('.container');
        if (container) {
            container.classList.toggle('searching', this.isSearching);
        }

        // Update search input placeholder
        if (this.searchInput) {
            if (this.isSearching) {
                this.searchInput.setAttribute('data-searching', 'true');
            } else {
                this.searchInput.removeAttribute('data-searching');
            }
        }
    }

    /**
     * Update URL to reflect current search
     */
    updateSearchURL(query) {
        const url = new URL(window.location);
        
        if (query) {
            url.searchParams.set('search', query);
        } else {
            url.searchParams.delete('search');
        }
        
        // Update URL without triggering navigation
        window.history.replaceState({}, '', url);
    }

    /**
     * Get search query from URL
     */
    getSearchFromURL() {
        const url = new URL(window.location);
        return url.searchParams.get('search') || '';
    }

    /**
     * Initialize search from URL if present
     */
    initializeFromURL() {
        const searchQuery = this.getSearchFromURL();
        if (searchQuery && this.searchInput) {
            this.searchInput.value = searchQuery;
            this.performSearch(searchQuery);
        }
    }

    /**
     * Get search suggestions based on available posts
     */
    getSearchSuggestions(query) {
        if (!query || query.length < 2) return [];

        const suggestions = new Set();
        const searchTerm = query.toLowerCase();

        // Add matching post titles
        this.posts.forEach(post => {
            const words = post.title.toLowerCase().split(' ');
            words.forEach(word => {
                if (word.includes(searchTerm) && word.length > 2) {
                    suggestions.add(word);
                }
            });
        });

        // Add matching tags
        this.posts.forEach(post => {
            post.tags?.forEach(tag => {
                if (tag.toLowerCase().includes(searchTerm)) {
                    suggestions.add(tag);
                }
            });
        });

        // Add matching categories
        Object.values(this.blogSystem?.categories || {}).forEach(category => {
            if (category.toLowerCase().includes(searchTerm)) {
                suggestions.add(category.toLowerCase());
            }
        });

        return Array.from(suggestions).slice(0, 5);
    }

    /**
     * Highlight search terms in results
     */
    highlightSearchTerms(text, query) {
        if (!query || !text) return text;
        
        const regex = new RegExp(`(${utils.escapeHtml(query)})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
}

// Export for global use
window.SearchSystem = SearchSystem;
