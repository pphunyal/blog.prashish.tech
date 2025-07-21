/**
 * Fixed Markdown to HTML Converter
 * Generates HTML that matches the exact structure of existing blog posts
 */

const fs = require('fs');
const path = require('path');

class MarkdownConverter {
    constructor() {
        // Markdown parsing rules
        this.rules = [
            // Code blocks (must come before inline code)
            { 
                pattern: /```(\w+)?\r?\n([\s\S]*?)\r?\n```/g, 
                replacement: (match, lang, code) => {
                    const language = lang ? ` class="language-${lang}"` : '';
                    return `<pre><code${language}>${this.escapeHtml(code.trim())}</code></pre>`;
                }
            },
            
            // Headers
            { pattern: /^#### (.*$)/gm, replacement: '<h4>$1</h4>' },
            { pattern: /^### (.*$)/gm, replacement: '<h3>$1</h3>' },
            { pattern: /^## (.*$)/gm, replacement: '<h2>$1</h2>' },
            { pattern: /^# (.*$)/gm, replacement: '<h1>$1</h1>' },
            
            // Bold and Italic
            { pattern: /\*\*\*(.*?)\*\*\*/g, replacement: '<strong><em>$1</em></strong>' },
            { pattern: /\*\*(.*?)\*\*/g, replacement: '<strong>$1</strong>' },
            { pattern: /\*(.*?)\*/g, replacement: '<em>$1</em>' },
            
            // Inline code
            { pattern: /`([^`]+)`/g, replacement: '<code>$1</code>' },
            
            // Links
            { pattern: /\[([^\]]+)\]\(([^)]+)\)/g, replacement: '<a href="$2">$1</a>' },
            
            // Images
            { pattern: /!\[([^\]]*)\]\(([^)]+)\)/g, replacement: '<img src="$2" alt="$1">' },
            
            // Horizontal rule
            { pattern: /^---$/gm, replacement: '<hr>' },
            
            // Lists (basic implementation)
            { pattern: /^- (.*$)/gm, replacement: '<li>$1</li>' },
            
            // Blockquotes
            { pattern: /^> (.*$)/gm, replacement: '<blockquote>$1</blockquote>' }
        ];
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
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
     * Parse markdown to HTML
     */
    parseMarkdown(markdown) {
        if (!markdown) return '';
        
        let html = markdown;
        
        // Apply all rules
        this.rules.forEach(rule => {
            if (typeof rule.replacement === 'function') {
                html = html.replace(rule.pattern, rule.replacement);
            } else {
                html = html.replace(rule.pattern, rule.replacement);
            }
        });
        
        // Convert paragraphs (split by double newlines)
        const paragraphs = html.split(/\r?\n\r?\n/);
        html = paragraphs.map(para => {
            const trimmed = para.trim();
            if (!trimmed) return '';
            
            // Don't wrap if already wrapped in HTML tags
            if (trimmed.startsWith('<h') || trimmed.startsWith('<pre') || 
                trimmed.startsWith('<ul') || trimmed.startsWith('<ol') ||
                trimmed.startsWith('<blockquote') || trimmed.startsWith('<hr') ||
                trimmed.startsWith('<li>')) {
                return trimmed;
            }
            
            // Handle list items
            if (trimmed.includes('<li>')) {
                return '<ul>\n                        ' + trimmed + '\n                    </ul>';
            }
            
            return '<p>' + trimmed + '</p>';
        }).filter(para => para).join('\n\n                    ');
        
        // Fix nested lists
        html = html.replace(/<\/ul>\s*<ul>/g, '');
        
        return html;
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
            
            // Convert markdown to HTML
            const htmlContent = this.parseMarkdown(content);
            
            // Create complete HTML document
            const fullHtml = this.createHtmlDocument(frontMatter, htmlContent);
            
            // Write to output file
            fs.writeFileSync(outputPath, fullHtml, 'utf8');
            
            console.log(`✅ Converted ${inputPath} to ${outputPath}`);
            return true;
        } catch (error) {
            console.error(`❌ Error converting ${inputPath}:`, error.message);
            return false;
        }
    }

    /**
     * Create a complete HTML document matching existing blog structure
     */
    createHtmlDocument(frontMatter, content) {
        const title = frontMatter.title || 'Blog Post';
        const date = frontMatter.date || new Date().toISOString().split('T')[0];
        const author = frontMatter.author || 'Anonymous';
        const category = frontMatter.category || 'general';
        
        // Format date for display
        const dateObj = new Date(date);
        const formattedDate = dateObj.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        // Get category name
        const categoryNames = {
            'bloc': 'Blockchain',
            'cryp': 'Cryptography', 
            'econ': 'Economics',
            'frag': 'Fragments',
            'math': 'Mathematics'
        };
        const categoryName = categoryNames[category] || 'General';
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | Prashish Phunyal</title>
    <meta name="description" content="${frontMatter.excerpt || ''}">
    
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
                        <time class="post-date" datetime="${date}">${formattedDate}</time>
                        <span class="post-category-tag" data-category="${category}">${categoryName}</span>
                    </div>
                    <h1 class="post-title">${title}</h1>
                    <div class="post-info">
                        ${frontMatter.readTime ? `<span class="read-time">${frontMatter.readTime}</span>` : ''}
                        <span class="author">by ${author}</span>
                    </div>
                </div>

                <div class="post-content">
                    ${content}
                </div>
            </article>
        </main>
    </div>

    <!-- Scripts -->
    <script src="../src/index.js"></script>
</body>
</html>`;
    }
}

// Command line usage
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length < 1) {
        console.log('Usage: node md-to-html-fixed.js input.md [output.html]');
        console.log('Example: node md-to-html-fixed.js posts/crypto-hash-functions.md posts/crypto-hash-functions.html');
        process.exit(1);
    }
    
    const inputPath = args[0];
    const outputPath = args[1] || inputPath.replace('.md', '.html');
    
    const converter = new MarkdownConverter();
    converter.convertFile(inputPath, outputPath);
}

module.exports = MarkdownConverter;
