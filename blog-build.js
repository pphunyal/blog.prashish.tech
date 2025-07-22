#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

/**
 * Simple and reliable markdown to HTML converter using the marked library
 */
class MarkdownConverter {
    constructor() {
        // Configure marked for better HTML output
        marked.setOptions({
            gfm: true, // GitHub flavored markdown
            breaks: false,
            pedantic: false,
            sanitize: false,
            smartLists: true,
            smartypants: false,
            headerIds: false,
            mangle: false
        });
    }

    /**
     * Parse front matter from markdown
     */
    parseFrontMatter(content) {
        const frontMatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
        const match = content.match(frontMatterRegex);
        
        if (!match) {
            return { frontMatter: {}, content };
        }

        const frontMatter = {};
        const frontMatterLines = match[1].split(/\r?\n/);
        
        frontMatterLines.forEach(line => {
            const colonIndex = line.indexOf(':');
            if (colonIndex > -1) {
                const key = line.substring(0, colonIndex).trim();
                let value = line.substring(colonIndex + 1).trim();
                
                // Remove quotes if present
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.slice(1, -1);
                }
                
                // Handle arrays
                if (value.startsWith('[') && value.endsWith(']')) {
                    value = value.slice(1, -1).split(',').map(item => 
                        item.trim().replace(/["\[\]]/g, '')
                    );
                }
                
                frontMatter[key] = value;
            }
        });

        return { frontMatter, content: match[2].trim() };
    }

    /**
     * Create complete HTML document
     */
    createHtmlDocument(frontMatter, htmlContent) {
        const title = frontMatter.title || 'Blog Post';
        const description = frontMatter.description || '';
        const date = frontMatter.date || new Date().toISOString().split('T')[0];
        const category = frontMatter.category || 'General';
        const tags = Array.isArray(frontMatter.tags) ? frontMatter.tags : [];

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | Prashish Phunyal</title>
    <meta name="description" content="${description}">
    
    <!-- Stylesheets -->
    <link rel="stylesheet" href="../src/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Theme Script -->
    <script>
        (function() {
            const savedTheme = localStorage.getItem('theme') || 'dark';
            document.documentElement.setAttribute('data-theme', savedTheme);
        })();
    </script>
</head>
<body>
    <div class="container">
        <!-- Theme Toggle -->
        <div id="theme-toggle" class="theme-toggle" aria-label="Toggle theme">
            <button type="button" class="theme-toggle-btn" aria-label="Toggle dark/light mode">
                <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            </button>
        </div>

        <!-- Header -->
        <header class="header">
            <div class="header-content">
                <h1 class="site-title">
                    <a href="../index.html" class="site-title-link">Prashish</a>
                </h1>
                <nav class="social-nav">
                    <a href="https://bsky.app/profile/prashishphunyal.bsky.social" target="_blank" rel="noopener noreferrer" class="social-link">
                        Bluesky
                    </a>
                    <a href="https://github.com/pphunyal" target="_blank" rel="noopener noreferrer" class="social-link">
                        GitHub
                    </a>
                    <a href="#newsletter" class="social-link">
                        Newsletter
                    </a>
                </nav>
            </div>
        </header>

        <!-- Main Content -->
        <main class="main">
            <article class="post-article">
                <div class="post-header">
                    <div class="post-meta">
                        <span class="post-category-tag">${category}</span>
                        <time class="post-date" datetime="${date}">${new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                    </div>
                    <h1 class="post-title">${title}</h1>
                    <div class="post-info">
                        <span class="read-time">5 min read</span>
                    </div>
                </div>

                <div class="post-content">
                    ${htmlContent}
                </div>

                <div class="post-footer">
                    <div class="post-tags">
                        ${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="post-navigation">
                        <a href="../index.html" class="nav-link">← Back to Posts</a>
                    </div>
                </div>
            </article>
        </main>

        <!-- Footer -->
        <footer class="footer">
            <p>&copy; ${new Date().getFullYear()} Prashish Phunyal. All rights reserved.</p>
        </footer>
    </div>

    <!-- Theme Toggle Script -->
    <script>
        const themeToggle = document.getElementById('theme-toggle');
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    </script>
</body>
</html>`;
    }

    /**
     * Convert markdown file to HTML
     */
    convertFile(inputPath, outputPath) {
        try {
            // Read the markdown file
            const markdownContent = fs.readFileSync(inputPath, 'utf8');
            
            // Parse front matter and content
            const { frontMatter, content } = this.parseFrontMatter(markdownContent);
            
            // Convert markdown to HTML using marked
            const htmlContent = marked.parse(content);
            
            // Create complete HTML document
            const fullHtml = this.createHtmlDocument(frontMatter, htmlContent);
            
            // Write to output file
            fs.writeFileSync(outputPath, fullHtml, 'utf8');
            
            console.log(`✅ Converted ${inputPath} to ${outputPath}`);
            
        } catch (error) {
            console.error(`❌ Error converting ${inputPath}:`, error.message);
            process.exit(1);
        }
    }
}

// CLI usage
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length < 1) {
        console.log('Usage: node md-to-html.js input.md [output.html]');
        process.exit(1);
    }
    
    const inputPath = path.resolve(args[0]);
    const outputPath = args[1] ? path.resolve(args[1]) : inputPath.replace(/\.md$/, '.html');
    
    if (!fs.existsSync(inputPath)) {
        console.error(`❌ Input file not found: ${inputPath}`);
        process.exit(1);
    }
    
    const converter = new MarkdownConverter();
    converter.convertFile(inputPath, outputPath);
}

module.exports = MarkdownConverter;
