/**
 * Blog System - Core functionality for loading and managing blog posts
 */

class BlogSystem {
    constructor() {
        this.posts = [];
        this.categories = {
            'blockchain': 'Blockchain',
            'cryptography': 'Cryptography',
            'fragments': 'Fragments',
            'mathematics': 'Mathematics'
        };
    }

    /**
     * Load posts from metadata.json
     */
    async loadPosts() {
        try {
            const response = await fetch('./posts/metadata.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.posts = data.posts || [];
            
            // Validate and process posts
            this.posts = this.posts.map(post => this.validatePost(post)).filter(Boolean);
            
            return this.posts;
        } catch (error) {
            console.error('Error loading posts:', error);
            
            // Return sample posts for development
            this.posts = this.getSamplePosts();
            return this.posts;
        }
    }

    /**
     * Validate and normalize post data
     */
    validatePost(post) {
        if (!post.title || !post.date || !post.category) {
            console.warn('Invalid post data:', post);
            return null;
        }

        return {
            title: post.title,
            date: post.date,
            category: post.category,
            url: post.url || `./posts/${utils.slugify(post.title)}.html`,
            excerpt: post.excerpt || '',
            tags: post.tags || [],
            author: post.author || 'Prashish Phunyal',
            readTime: post.readTime || this.estimateReadTime(post.excerpt || '')
        };
    }

    /**
     * Estimate reading time based on content length
     */
    estimateReadTime(content) {
        const wordsPerMinute = 200;
        const words = content.split(' ').length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return `${minutes} min read`;
    }

    /**
     * Get posts by category
     */
    getPostsByCategory(categorySlug) {
        return this.posts.filter(post => post.category === categorySlug);
    }

    /**
     * Get category display name
     */
    getCategoryName(categorySlug) {
        return this.categories[categorySlug] || categorySlug;
    }

    /**
     * Get all categories with post counts
     */
    getCategoriesWithCounts() {
        const counts = {};
        
        // Initialize counts
        Object.keys(this.categories).forEach(slug => {
            counts[slug] = {
                name: this.categories[slug],
                count: 0
            };
        });

        // Count posts in each category
        this.posts.forEach(post => {
            if (counts[post.category]) {
                counts[post.category].count++;
            }
        });

        return counts;
    }

    /**
     * Search posts
     */
    searchPosts(query) {
        if (!query || query.trim().length < 2) {
            return this.posts;
        }

        const searchTerm = query.toLowerCase().trim();
        
        return this.posts.filter(post => {
            return (
                (post.title || '').toLowerCase().includes(searchTerm) ||
                (post.excerpt || '').toLowerCase().includes(searchTerm) ||
                (post.tags || []).some(tag => tag.toLowerCase().includes(searchTerm)) ||
                this.getCategoryName(post.category).toLowerCase().includes(searchTerm)
            );
        });
    }

    /**
     * Get recent posts
     */
    getRecentPosts(limit = 10) {
        return this.posts
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit);
    }

    /**
     * Get sample posts for development/demo
     */
    // getSamplePosts() {
    //     return [
    //         {
    //             title: "Introduction to Blockchain Technology",
    //             date: "2025-01-15",
    //             category: "bloc",
    //             excerpt: "Exploring the fundamentals of blockchain technology and its potential applications in various industries.",
    //             tags: ["blockchain", "technology", "decentralization"],
    //             url: "./posts/intro-to-blockchain.html",
    //             readTime: "5 min read"
    //         },
    //         {
    //             title: "Understanding Cryptographic Hash Functions",
    //             date: "2025-01-10",
    //             category: "cryp",
    //             excerpt: "A deep dive into cryptographic hash functions, their properties, and their role in securing digital systems.",
    //             tags: ["cryptography", "hash functions", "security"],
    //             url: "./posts/crypto-hash-functions.html",
    //             readTime: "7 min read"
    //         },
    //         {
    //             title: "Random Thoughts on AI",
    //             date: "2025-01-01",
    //             category: "frag",
    //             excerpt: "Some scattered thoughts on the current state and future of artificial intelligence.",
    //             tags: ["ai", "thoughts", "future"],
    //             url: "./posts/random-thoughts-ai.html",
    //             readTime: "3 min read"
    //         },
    //         {
    //             title: "Mathematical Foundations of Machine Learning",
    //             date: "2024-12-28",
    //             category: "math",
    //             excerpt: "Essential mathematical concepts that underpin modern machine learning algorithms.",
    //             tags: ["mathematics", "machine learning", "linear algebra"],
    //             url: "./posts/math-foundations-ml.html",
    //             readTime: "8 min read"
    //         }
    //     ];
    // }

    /**
     * Render post list HTML
     */
    renderPostList(posts, container) {
        if (!container) return;

        if (posts.length === 0) {
            container.innerHTML = '<li class="no-posts"><p>No posts found.</p></li>';
            return;
        }

        container.innerHTML = posts.map(post => `
            <li class="post-item">
                <article class="post-card">
                    <div class="post-meta">
                        <time class="post-date" datetime="${post.date}">
                            ${utils.formatDate(post.date)}
                        </time>
                        <span class="post-category-tag" data-category="${post.category}">
                            ${this.getCategoryName(post.category)}
                        </span>
                    </div>
                    <h3 class="post-title">
                        <a href="${post.url}" class="post-link">${utils.escapeHtml(post.title)}</a>
                    </h3>
                    <div class="post-excerpt">
                        ${utils.escapeHtml(post.excerpt || 'Click to read more...')}
                    </div>
                    <div class="post-footer">
                        <span class="read-time">${post.readTime}</span>
                    </div>
                </article>
            </li>
        `).join('');
    }
}

// Export for global use
window.BlogSystem = BlogSystem;
