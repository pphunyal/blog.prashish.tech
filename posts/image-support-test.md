---
title: "Image Support Test"
date: "2024-01-15"
category: "tech"
excerpt: "Testing the new image functionality in the blog system"
tags: ["test", "images", "development"]
author: "Prashish Phunyal"
readTime: "3 min read"
---

# Image Support Test

This is a test post to demonstrate the new image functionality in the blog system.

## Basic Image Syntax

Here's how you can add images to your blog posts:

```markdown
![Alt text](image-filename.jpg)
![Bitcoin diagram](crypto/bitcoin-network.png)
```

## Image with Caption

When you add a title attribute, it becomes a caption:

```markdown
![Bitcoin network](crypto/bitcoin-network.png "Bitcoin peer-to-peer network architecture")
```

## Image Organization

Images are organized in category-specific directories:

- `crypto/` - Cryptocurrency and blockchain images
- `tech/` - Technology and programming images  
- `personal/` - Personal and reflection images

## Features

The image system includes:

- **Responsive design** - Images scale automatically
- **Lazy loading** - Images load when they come into view
- **Hover effects** - Subtle zoom and shadow on hover
- **Dark mode support** - Images adapt to theme changes
- **Figure captions** - Title attributes become styled captions

## Example Usage

```markdown
![Elliptic curve example](crypto/elliptic-curve.png "Mathematical representation of an elliptic curve")
```

This creates a responsive image with a caption below it, properly styled for both light and dark themes.
