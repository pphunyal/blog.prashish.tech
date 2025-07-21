/**
 * Category Router - Handles routing for category pages
 */

class CategoryRouter {
    constructor() {
        this.blogSystem = new BlogSystem();
        this.currentRoute = '';
        this.init();
    }

    /**
     * Initialize router
     */
    async init() {
        // Load posts first
        await this.blogSystem.loadPosts();
        
        // Set up routing
        this.bindEvents();
        this.handleInitialRoute();
    }

    /**
     * Bind routing events
     */
    bindEvents() {
        // Handle hash changes
        window.addEventListener('hashchange', () => {
            this.handleRouteChange();
        });

        // Handle category link clicks
        document.addEventListener('click', (e) => {
            const categoryLink = e.target.closest('.category-link');
            if (categoryLink) {
                e.preventDefault();
                const category = categoryLink.getAttribute('data-category');
                this.navigateToCategory(category);
            }
        });

        // Handle back button for home
        window.addEventListener('popstate', () => {
            this.handleRouteChange();
        });
    }

    /**
     * Handle initial route on page load
     */
    handleInitialRoute() {
        const hash = window.location.hash;
        if (hash && hash.startsWith('#category/')) {
            this.handleRouteChange();
        }
    }

    /**
     * Handle route changes
     */
    handleRouteChange() {
        const hash = window.location.hash;
        
        if (!hash || hash === '#') {
            this.showHomePage();
            return;
        }

        if (hash.startsWith('#category/')) {
            const category = hash.replace('#category/', '');
            this.showCategoryPage(category);
            return;
        }

        // Unknown route, redirect to home
        this.showHomePage();
    }

    /**
     * Navigate to category page
     */
    navigateToCategory(category) {
        window.location.hash = `#category/${category}`;
    }

    /**
     * Show category page
     */
    showCategoryPage(categorySlug) {
        this.currentRoute = `category/${categorySlug}`;
        
        const categoryName = this.blogSystem.getCategoryName(categorySlug);
        const posts = this.blogSystem.getPostsByCategory(categorySlug);
        
        // Update page title
        document.title = `${categoryName} | Blog | Prashish Phunyal`;
        
        // Hide search and categories sections
        this.hideHomeElements();
        
        // Show category page content
        this.renderCategoryPage(categorySlug, categoryName, posts);
        
        // Update active category
        this.updateActiveCategoryLink(categorySlug);
    }

    /**
     * Show home page
     */
    showHomePage() {
        this.currentRoute = '';
        
        // Update page title
        document.title = 'Blog | Prashish Phunyal';
        
        // Show home elements
        this.showHomeElements();
        
        // Clear active category
        this.updateActiveCategoryLink(null);
        
        // Re-render recent posts
        this.renderHomePage();
    }

    /**
     * Render category page
     */
    renderCategoryPage(categorySlug, categoryName, posts) {
        const main = document.querySelector('.main');
        if (!main) return;

        // Create category page HTML
        const categoryPageHTML = `
            <div class="category-page">
                <div class="category-header">
                    <button class="back-button" onclick="window.location.hash = ''">
                        ← Back to Home
                    </button>
                    <h1 class="category-title">
                        <span class="category-icon">${this.getCategoryIcon(categorySlug)}</span>
                        ${categoryName}
                    </h1>
                </div>
                
                <section class="category-posts">
                    <div class="posts-container">
                        <ul class="post-list" id="category-posts">
                            ${posts.length > 0 ? '' : '<li class="no-posts"><p>No posts in this category yet.</p></li>'}
                        </ul>
                    </div>
                </section>
            </div>
        `;

        main.innerHTML = categoryPageHTML;

        // Render posts if any
        if (posts.length > 0) {
            const postsList = document.getElementById('category-posts');
            this.blogSystem.renderPostList(posts, postsList);
        }
    }

    /**
     * Render home page
     */
    renderHomePage() {
        const main = document.querySelector('.main');
        if (!main) return;

        // Restore original home page content
        main.innerHTML = `
            <!-- Search Bar -->
            <div class="search-container">
                <input type="search" id="search-input" class="search-input" placeholder="Search posts..." aria-label="Search posts">
                <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>

            <!-- Categories -->
            <section class="categories-section">
                <h2 class="section-title">Categories</h2>
                <nav class="categories-nav">
                    <a href="#category/bloc" class="category-link" data-category="bloc">
                        <span class="category-icon">🔗</span>
                        Blockchain
                    </a>
                    <a href="#category/cryp" class="category-link" data-category="cryp">
                        <span class="category-icon">🔐</span>
                        Cryptography
                    </a>
                    <a href="#category/frag" class="category-link" data-category="frag">
                        <span class="category-icon">💭</span>
                        Fragments
                    </a>
                    <a href="#category/math" class="category-link" data-category="math">
                        <span class="category-icon">🧮</span>
                        Mathematics
                    </a>
                </nav>
            </section>

            <!-- Recent Posts -->
            <section class="posts-section">
                <h2 class="section-title">Recent Posts</h2>
                <div class="posts-container">
                    <ul class="post-list" id="recent-posts">
                        <li class="loading-item">
                            <div class="loading-spinner"></div>
                            <span>Loading posts...</span>
                        </li>
                    </ul>
                </div>
            </section>
        `;

        // Re-initialize components
        this.reinitializeComponents();
    }

    /**
     * Hide home page elements for category view
     */
    hideHomeElements() {
        const searchContainer = document.querySelector('.search-container');
        const categoriesSection = document.querySelector('.categories-section');
        
        if (searchContainer) searchContainer.style.display = 'none';
        if (categoriesSection) categoriesSection.style.display = 'none';
    }

    /**
     * Show home page elements
     */
    showHomeElements() {
        const searchContainer = document.querySelector('.search-container');
        const categoriesSection = document.querySelector('.categories-section');
        
        if (searchContainer) searchContainer.style.display = 'block';
        if (categoriesSection) categoriesSection.style.display = 'block';
    }

    /**
     * Update active category link
     */
    updateActiveCategoryLink(activeCategory) {
        const categoryLinks = document.querySelectorAll('.category-link');
        
        categoryLinks.forEach(link => {
            const category = link.getAttribute('data-category');
            if (category === activeCategory) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    /**
     * Get category icon
     */
    getCategoryIcon(categorySlug) {
        const icons = {
            'bloc': '⛓️',
            'cryp': '🔐',
            'frag': '💭',
            'math': '🧮'
        };
        return icons[categorySlug] || '📝';
    }

    /**
     * Re-initialize components after home page render
     */
    async reinitializeComponents() {
        // Wait a bit for DOM to settle
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Re-initialize search system
        if (window.SearchSystem) {
            const searchSystem = new SearchSystem();
            searchSystem.init(this.blogSystem.posts, this.blogSystem);
        }
        
        // Load and display recent posts
        const recentPostsList = document.getElementById('recent-posts');
        if (recentPostsList) {
            const recentPosts = this.blogSystem.getRecentPosts();
            this.blogSystem.renderPostList(recentPosts, recentPostsList);
        }
    }
}

// Export for global use
window.CategoryRouter = CategoryRouter;
