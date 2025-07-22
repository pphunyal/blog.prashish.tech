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

        // Remove any existing category page first
        const existingCategoryPage = document.querySelector('.category-page');
        if (existingCategoryPage) {
            existingCategoryPage.remove();
        }

        // Create category page HTML
        const categoryPageHTML = `
            <div class="category-page">
                <div class="category-header">
                    <button class="back-button" onclick="window.location.hash = ''">
                        ← Back to Home
                    </button>
                    <h1 class="category-title">
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

        // Insert category page after hiding home elements
        main.insertAdjacentHTML('beforeend', categoryPageHTML);

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
        // Simply show the existing home elements instead of recreating them
        this.showHomeElements();
        
        // Re-initialize components
        this.reinitializeComponents();
    }

    /**
     * Hide home page elements for category view
     */
    hideHomeElements() {
        const searchContainer = document.querySelector('.search-container');
        const categoriesSection = document.querySelector('.categories-section');
        const postsSection = document.querySelector('.posts-section');
        
        if (searchContainer) searchContainer.style.display = 'none';
        if (categoriesSection) categoriesSection.style.display = 'none';
        if (postsSection) postsSection.style.display = 'none';
    }

    /**
     * Show home page elements
     */
    showHomeElements() {
        const main = document.querySelector('.main');
        const searchContainer = document.querySelector('.search-container');
        const categoriesSection = document.querySelector('.categories-section');
        const postsSection = document.querySelector('.posts-section');
        
        // Remove any category page content
        const categoryPage = document.querySelector('.category-page');
        if (categoryPage) {
            categoryPage.remove();
        }
        
        if (searchContainer) searchContainer.style.display = 'block';
        if (categoriesSection) categoriesSection.style.display = 'block';
        if (postsSection) postsSection.style.display = 'block';
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
