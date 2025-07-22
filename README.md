# Prashish Phunyal's Blog

A minimalist blog built with vanilla HTML, CSS, and JavaScript featuring dark/light themes, category filtering, search functionality, and Markdown-to-HTML conversion.

##  Project Structure

```
blog/
├── index.html              # Main blog homepage
├── src/
│   ├── style.css           # Main stylesheet with CSS custom properties
│   ├── index.js            # Homepage functionality
│   ├── blog.js             # Blog system core
│   ├── search.js           # Search functionality
│   ├── router.js           # Category routing
│   └── markdown.js         # Browser-based Markdown parser
├── posts/
│   ├── metadata.json       # Post metadata (title, date, category, etc.)
│   ├── *.html              # Published HTML posts
│   └── *.md                # Markdown source files
├── md-to-html.js           # Node.js Markdown to HTML converter (using marked library)
```

## � Converting Markdown to HTML

### Using Node.js (Recommended)
```bash
node md-to-html.js posts/your-post.md posts/your-post.html
```

### Markdown Front Matter Format
Each Markdown file should start with YAML front matter:

```markdown
---
title: "Your Post Title"
date: "2025-01-10"
category: "cryp"
excerpt: "A brief description of your post for the homepage."
tags: ["tag1", "tag2", "tag3"]
author: "Prashish Phunyal"
readTime: "5 min read"
---

# Your Post Title

Your markdown content goes here...
```