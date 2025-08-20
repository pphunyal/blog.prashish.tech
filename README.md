# Prashish Phunyal's Blog

A minimalist blog built with vanilla HTML, CSS, and JavaScript featuring dark/light themes, category filtering, search functionality, and Markdown-to-H## 📂 Categories

- **blockchain**: Blockchain technology, cryptocurrencies, decentralized systems
- **cryptography**: Cryptographic algorithms, security, digital signatures
- **mathematics**: Mathematical foundations, algorithms, theoretical concepts
- **fragments**: Short thoughts, reflections, and miscellaneous posts

### Adding New Categories

To add a new category to the blog system:

1. **Create posts with the new category** in their front matter:
   ```markdown
   ---
   title: "Your Post Title"
   date: "2025-01-10"
   category: "new-category"  # Your new category name
   excerpt: "Post description"
   tags: ["tag1", "tag2"]
   author: "Prashish Phunyal"
   readTime: "5 min read"
   ---
   ```

2. **Update the homepage category tiles** in `index.html`:
   ```html
   <div class="category-tile" data-category="new-category">
       <h3>New Category</h3>
       <p>Description of your new category</p>
   </div>
   ```

3. **Add category styling** in `src/style.css` (optional):
   ```css
   .category-tile[data-category="new-category"] {
       /* Custom styling for your category */
   }
   ```

4. **Update router.js** to handle the new category route:
   - The router automatically handles new categories, but you may want to update the category display name mapping if needed.

5. **Rebuild metadata** to include the new category:
   ```bash
   node blog-build.js update-metadata posts
   ```

The blog system automatically recognizes new categories when processing posts, so minimal configuration is required!nversion.

## Project Structure

```
blog.prashish.tech/
├── index.html              # Main blog homepage
├── blog-build.js           # Enhanced Markdown to HTML converter with CLI
├── src/
│   ├── style.css           # Main stylesheet with CSS custom properties
│   ├── index.js            # Homepage functionality
│   ├── blog.js             # Blog system core
│   ├── search.js           # Search functionality
│   └── router.js           # Category routing for SPA navigation
├── posts/
│   ├── metadata.json       # Post metadata (title, date, category, etc.)
│   ├── *.html              # Published HTML posts
│   └── *.md                # Markdown source files
└── README.md               # Project documentation
```

## Blog Build System

The `blog-build.js` script provides a comprehensive CLI for managing markdown-to-HTML conversion and metadata management.

### Installation
Ensure you have the required dependencies:
```bash
npm install marked
```

### Commands

#### 1. Convert Single File
Convert a single markdown file to HTML:
```bash
node blog-build.js convert posts/my-post.md [output.html]
```

**Example:**
```bash
node blog-build.js convert posts/understanding-bitcoin.md
# Outputs: posts/understanding-bitcoin.html
```

#### 2. Build All Files
Convert all markdown files in a directory to HTML:
```bash
node blog-build.js build-all [input-dir] [output-dir]
```

**Examples:**
```bash
# Convert all .md files in posts/ directory
node blog-build.js build-all posts

# Convert from source to destination directory
node blog-build.js build-all drafts posts
```

**Features:**
- Processes all `.md` files in the specified directory
- Skips hidden files (starting with `.`)
- Provides conversion summary with success/failure counts
- Creates output directory if it doesn't exist

#### 3. Update Metadata
Automatically update `metadata.json` with post information extracted from markdown front matter:
```bash
node blog-build.js update-metadata [posts-dir]
```

**Example:**
```bash
node blog-build.js update-metadata posts
```

**Features:**
- Extracts metadata from YAML front matter
- Updates existing posts or adds new ones
- Maintains chronological order (newest first)
- Automatically sorts posts by date

#### 4. Help
Display usage information:
```bash
node blog-build.js help
```

### Workflow Examples

#### Adding a New Blog Post
```bash
# 1. Write your markdown file with front matter
# posts/new-post.md

# 2. Convert to HTML
node blog-build.js convert posts/new-post.md

# 3. Update metadata
node blog-build.js update-metadata posts
```

#### Batch Processing Multiple Posts
```bash
# 1. Add multiple .md files to posts/ directory

# 2. Convert all at once
node blog-build.js build-all posts

# 3. Update metadata for all posts
node blog-build.js update-metadata posts
```

## Markdown Front Matter Format

Each Markdown file should start with YAML front matter:

```markdown
---
title: "Your Post Title"
date: "2025-01-10"
category: "cryptography"  # blockchain, mathematics, fragments, cryptography
excerpt: "A brief description of your post for the homepage."
tags: ["tag1", "tag2", "tag3"]
author: "Prashish Phunyal"
readTime: "5 min read"
---

# Your Post Title

Your markdown content goes here...
```

## Adding Images to Blog Posts

The blog system supports comprehensive image functionality with automatic processing and responsive display.

### Image Syntax

#### Basic Image
```markdown
![Alt text](image-filename.jpg)
```

#### Image with Caption
Use the title attribute to add captions that will be displayed below the image:
```markdown
![Bitcoin network diagram](bitcoin-network.png "Bitcoin peer-to-peer network architecture")
```

### Image Organization

Images are stored in `src/assets/images/` with category-specific subdirectories:

```
src/assets/images/
├── crypto/         # Cryptocurrency and blockchain images
├── tech/           # Technology and programming images
└── personal/       # Personal and reflection images
```

### Image Path Options

The build system automatically processes image paths:

```markdown
# Category subdirectory (recommended)
![Hash function diagram](crypto/hash-function.png)
![Performance chart](tech/performance-chart.png)

# Direct from images directory
![Diagram](blockchain-architecture.png)

# Full relative path
![Logo](../src/assets/images/logo.png)

# External URLs work as expected
![External image](https://example.com/image.jpg)
```

### Image Features

- **Responsive Design**: Images automatically scale for different screen sizes
- **Lazy Loading**: Images load only when they come into view
- **Hover Effects**: Subtle zoom and shadow effects on hover
- **Dark Mode Support**: Images adapt to theme changes
- **Figure Captions**: Title attributes become styled figure captions
- **Loading Optimization**: Automatic `loading="lazy"` attribute

### Image Best Practices

1. **File Naming**: Use descriptive, lowercase filenames with hyphens
   ```
   ✅ bitcoin-network-diagram.png
   ❌ Bitcoin Network Diagram.PNG
   ```

2. **File Organization**: Place images in appropriate category folders
   ```
   ✅ crypto/elliptic-curve-example.png
   ✅ tech/algorithm-comparison.jpg
   ```

3. **Alt Text**: Always provide meaningful alt text for accessibility
   ```markdown
   ✅ ![Elliptic curve showing point addition](crypto/ecc-point-addition.png)
   ❌ ![Image](crypto/ecc-point-addition.png)
   ```

4. **File Sizes**: Optimize images for web (aim for <500KB per image)

### Example Usage in Blog Post

```markdown
---
title: "Understanding Elliptic Curve Cryptography"
date: "2024-01-15"
category: "cryptography"
---

# Understanding Elliptic Curve Cryptography

ECC provides the same level of security as RSA with smaller key sizes.

![Elliptic curve over finite field](crypto/elliptic-curve-field.png "Example of an elliptic curve y² = x³ + ax + b over a finite field")

The mathematical foundation involves point operations on the curve...

![Point addition on elliptic curve](crypto/ecc-point-addition.png "Geometric interpretation of point addition P + Q = R")
```

## ✨ Features

- **Dark/Light Theme**: Toggle between themes with persistent localStorage
- **Category Filtering**: Filter posts by category (blockchain, cryptography, mathematics, fragments)
- **Search Functionality**: Real-time search across post titles and content
- **Responsive Design**: Mobile-first design with CSS Grid and Flexbox
- **SPA Navigation**: Hash-based routing for category pages
- **Markdown Support**: Full markdown support with syntax highlighting
- **SEO Friendly**: Proper meta tags and semantic HTML structure

## Development

### Local Development
```bash
# Clone the repository
git clone https://github.com/pphunyal/blog.prashish.tech.git
cd blog.prashish.tech

# Install dependencies (for markdown processing)
npm install marked

# Serve locally (any static server)
python -m http.server 8000
# or
npx serve .
```

### Content Management
1. **Write** markdown files in `posts/` directory
2. **Build** HTML files using `blog-build.js`
3. **Update** metadata automatically
4. **Deploy** static files to your hosting platform

## Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Styling**: CSS Custom Properties, CSS Grid, Flexbox
- **Build Tools**: Node.js with marked library
- **Fonts**: Inter (Google Fonts)
- **Icons**: Inline SVG icons
- **Hosting**: Static site hosting (GitHub Pages, Netlify, etc.)

## Categories

- **blockchain**: Blockchain technology, cryptocurrencies, decentralized systems
- **cryptography**: Cryptographic algorithms, security, digital signatures
- **mathematics**: Mathematical foundations, algorithms, theoretical concepts
- **fragments**: Short thoughts, reflections, and miscellaneous posts

## Deployment

The blog is designed as a static site and can be deployed to any static hosting service:

```bash
# Build all posts
node blog-build.js build-all posts

# Update metadata
node blog-build.js update-metadata posts

# Deploy to your hosting platform
# (GitHub Pages, Netlify, Vercel, etc.)
```

## License

MIT License - feel free to use this as a template for your own blog!
