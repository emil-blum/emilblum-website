# Rogue Studio - Portfolio Website

A modern, non-conformist portfolio website with clean architecture and consistent design patterns.

## 🗂️ Project Structure

```
website/
├── index.html          # Home page with hero, services, work grid
├── about.html          # About page with bio and capabilities
├── project.html        # Project detail page (case study template)
├── archive.html        # Archive gallery with infinite scroll
├── contact.html        # Contact form page
├── css/
│   └── styles.css      # Shared styles for all pages
├── js/
│   └── main.js         # Shared JavaScript functionality
└── images/             # Your project images (currently empty)
```

## 🎨 Features

- **Unified Navigation**: Consistent navigation across all pages with active state indicators
- **Responsive Design**: Mobile-first approach using Tailwind CSS
- **Shared Components**: Reusable CSS and JavaScript for maintainability
- **Interactive Elements**:
  - Draggable image piles
  - Lightbox image viewer
  - Accordion sections
  - Infinite scroll gallery (Archive page)
  - Contact form with validation

## 📄 Page Details

### Home (`index.html`)
- Hero section with large typography
- Collapsible services accordion
- Featured project grid (4 projects)
- Draggable experimental section
- Testimonials in masonry layout
- Link to archive page

### About (`about.html`)
- Large header with mission statement
- Bio content and team photo
- Capabilities grid (3 columns)
- Draggable behind-the-scenes section
- Client testimonials

### Project (`project.html`)
- Two-column layout (sticky sidebar + scrollable gallery)
- Sidebar: Year, Role, Services, Key Results (clean v1 design)
- Gallery: Multiple images with lightbox functionality
- Process lab with draggable sketches
- Client testimonial
- Related projects navigation

### Archive (`archive.html`)
- Dark theme design
- Infinite scroll masonry gallery
- Dynamic image loading
- Lightbox with image details

### Contact (`contact.html`)
- Clean white background
- Multi-step form fields
- Multi-select service options
- Single-select budget options
- Success overlay on submission

## 🚀 Deployment to Vercel

### Option 1: Deploy via GitHub (Recommended)

1. **Initialize Git Repository**
   ```bash
   cd /Users/emil/Documents/Claude-Code/Projects/Personal-Website/website
   git init
   git add .
   git commit -m "Initial commit: Portfolio website"
   ```

2. **Create GitHub Repository**
   - Go to GitHub and create a new repository
   - Follow GitHub's instructions to push your code:
   ```bash
   git remote add origin <your-repo-url>
   git branch -M main
   git push -u origin main
   ```

3. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in and click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect it as a static site
   - Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd /Users/emil/Documents/Claude-Code/Projects/Personal-Website/website
   vercel
   ```

3. **Follow the prompts**
   - Link to existing project or create new
   - Confirm settings
   - Deploy!

## 🔧 Customization Guide

### Adding Your Own Images

1. Place your images in the `images/` folder
2. Update image paths in HTML files:
   ```html
   <!-- Before -->
   <img src="https://images.unsplash.com/..." alt="...">

   <!-- After -->
   <img src="images/your-image.jpg" alt="...">
   ```

### Updating Navigation Links

The navigation is consistent across all pages. Active states are controlled by the `active` class:

```html
<a href="index.html" class="nav-icon active ...">
```

### Modifying Colors

Main colors are defined in Tailwind classes:
- Primary background: `#F8F7F4` (Off-white)
- Text: `#1a1a1a` (Near black)
- Accent: Neutral grays

To change colors globally, update the CSS custom properties or Tailwind config.

### Adding New Projects

1. Duplicate `project.html`
2. Update the content:
   - Title and description
   - Year, Role, Services, Key Results
   - Images in the gallery
   - Testimonial

3. Link to it from `index.html`:
   ```html
   <a href="your-new-project.html" class="...">View Project</a>
   ```

## 🛠️ Technologies Used

- **HTML5**: Semantic markup
- **Tailwind CSS**: Utility-first CSS framework (via CDN)
- **Vanilla JavaScript**: No framework dependencies
- **Iconify**: Icon system
- **Google Fonts**: Inter typeface

## 📝 Notes

- All pages use Tailwind CDN for rapid prototyping
- External CSS and JS files are separated for maintainability
- Archive page uses dark theme with special body class
- Contact form is front-end only (add backend integration as needed)
- Draggable elements work on both desktop and mobile

## 🎯 Next Steps

1. **Replace placeholder images** with your actual project images
2. **Update copy** (bio, project descriptions, testimonials)
3. **Add analytics** (Google Analytics, Plausible, etc.)
4. **Implement contact form backend** (Formspree, Netlify Forms, or custom API)
5. **Optimize images** (compress and use WebP format)
6. **Add SEO meta tags** (Open Graph, Twitter Cards)
7. **Set up custom domain** in Vercel settings

## 📧 Contact Form Integration

The contact form currently shows a success message but doesn't send emails. To make it functional:

### Option 1: Formspree (Easiest)
1. Sign up at [formspree.io](https://formspree.io)
2. Update form action in `contact.html`:
   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```

### Option 2: Netlify Forms
1. Deploy to Netlify
2. Add `netlify` attribute to form:
   ```html
   <form name="contact" netlify>
   ```

### Option 3: Custom Backend
Build your own API endpoint and update the form submission handler in `js/main.js`.

---

**Built with precision and chaos. 🎨**
