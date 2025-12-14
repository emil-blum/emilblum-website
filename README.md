# Emīl Blūm - Portfolio Website

A modern, SEO-optimized portfolio website with dynamic project loading and clean architecture.

## 🗂️ Project Structure

```
website/
├── index.html          # Home page with hero, services, work grid
├── about.html          # About page with bio and capabilities
├── projects.html       # All projects page
├── project.html        # Project detail page (case study template)
├── archive.html        # BTS archive gallery (dark theme)
├── contact.html        # Contact form page
├── css/
│   └── styles.css      # Shared styles for all pages
├── js/
│   └── main.js         # Shared JavaScript functionality
├── data/
│   └── projects.json   # Project data (EASY TO UPDATE!)
└── images/
    ├── projects/       # Project images
    ├── archive/        # Archive/BTS images
    └── about/          # About page images
```

## ✨ Key Features

### Dynamic Project Loading
Projects are managed through a single JSON file (`data/projects.json`). Update once, reflects everywhere automatically!

- **Featured projects** on home page (4 projects marked as `"featured": true`)
- **All projects** on projects page (all 12 projects)
- **Easy to update**: Just edit the JSON file - no HTML changes needed

### SEO Optimized
- Complete meta tags on all pages
- Open Graph protocol for social sharing
- Twitter Card support
- Page-specific titles and descriptions

### Modern Design
- Responsive layout using Tailwind CSS
- 16:9 aspect ratio project thumbnails
- Clean typography and spacing
- Dark theme archive page
- Interactive elements (lightbox, draggable items, accordions)

## 📝 How to Update Projects

### The Easy Way (Recommended)

Edit `data/projects.json` - that's it! All pages update automatically.

**Example: Adding a new project**

```json
{
  "id": "your-project-slug",
  "title": "Your Project Name",
  "subtitle": "Category / Type",
  "category": "Branding",
  "year": "2024",
  "thumbnail": "images/projects/your-project-thumb.jpg",
  "featured": true,
  "description": "Short description of the project.",
  "client": "Client Name",
  "services": ["Service 1", "Service 2", "Service 3"],
  "images": [
    "images/projects/your-project-1.jpg",
    "images/projects/your-project-2.jpg",
    "images/projects/your-project-3.jpg"
  ],
  "caseStudy": {
    "challenge": "What problem needed solving?",
    "approach": "How did you solve it?",
    "result": "What was the outcome?"
  }
}
```

**Field Explanations:**
- `id`: URL-friendly slug (no spaces, lowercase)
- `title`: Project name
- `subtitle`: Category or project type
- `category`: For filtering (Branding, Editorial, Digital, etc.)
- `year`: Project year
- `thumbnail`: Path to 16:9 thumbnail image
- `featured`: Set to `true` to show on home page (max 4 recommended)
- `description`: Meta description for SEO
- `client`: Client name
- `services`: Array of services provided
- `images`: Array of project images for gallery
- `caseStudy`: Challenge, approach, and result

### Adding Project Images

1. **Save your images** in `images/projects/`
2. **Name them clearly**: `project-name-thumb.jpg`, `project-name-1.jpg`, etc.
3. **Recommended sizes**:
   - Thumbnails: 1920x1080px (16:9 ratio)
   - Gallery images: 2000px wide minimum
4. **Update paths** in `projects.json`

### Making a Project Featured

Set `"featured": true` in the JSON. Only the first 4 featured projects show on the home page.

## 📄 Page Details

### Home (`index.html`)
- Hero section with large typography
- Services accordion
- **Featured projects** (loaded from JSON, max 4)
- Draggable experimental section
- Testimonials
- Link to archive

### About (`about.html`)
- Mission statement
- Bio and team info
- Capabilities grid
- Client testimonials

### Projects (`projects.html`)
- **All projects** (loaded from JSON, currently 12)
- Grid layout with hover effects
- Links to individual project pages

### Project (`project.html`)
- Individual project template
- Dynamic title loading from URL parameter
- Two-column layout
- Gallery with lightbox

### Archive (`archive.html`)
- Dark theme BTS gallery
- 30 experimental items
- Masonry layout
- Limited scroll (not infinite)

### Contact (`contact.html`)
- Multi-step form
- Service selection
- Budget options
- Success overlay

## 🚀 Deployment

This site is already deployed on Vercel and connected to GitHub!

### Making Updates

1. **Edit files** locally (mainly `data/projects.json` and add images)
2. **Commit changes:**
   ```bash
   git add .
   git commit -m "Update projects"
   git push
   ```
3. **Vercel auto-deploys** within seconds!

### First Time Setup (Already Done)

✅ Git repository initialized
✅ Connected to GitHub: `https://github.com/emil-blum/emilblum-website`
✅ Deployed on Vercel
✅ Auto-deploy enabled

## 🎨 Customization

### Updating Colors

Main colors are Tailwind classes. To change:
- Neutral grays: `neutral-900`, `neutral-500`, etc.
- Archive dark theme: `bg-black`, `text-white`

### Updating Navigation

Navigation is consistent across all pages. Update in each HTML file's `<nav>` section.

### Updating SEO

Edit meta tags in the `<head>` of each page:
- Title: `<title>Your Page Title</title>`
- Description: `<meta name="description" content="...">`
- Social preview image: `images/social-preview.jpg` (create this!)

## 🛠️ Technologies

- **HTML5**: Semantic markup
- **Tailwind CSS**: Via CDN for rapid development
- **Vanilla JavaScript**: No framework dependencies
- **JSON**: Data management for projects
- **Iconify**: Icon system
- **Google Fonts**: Inter typeface

## 📋 Quick Checklist

### Before Going Live
- [ ] Replace all placeholder images with real project photos
- [ ] Update all project data in `projects.json`
- [ ] Create social preview image (`images/social-preview.jpg`)
- [ ] Update bio and about content
- [ ] Add real testimonials
- [ ] Configure contact form (Formspree/Web3Forms)
- [ ] Add Google Analytics or Plausible
- [ ] Test on mobile devices
- [ ] Set up custom domain on Vercel

### Adding New Projects
1. Add project images to `images/projects/`
2. Add project entry to `data/projects.json`
3. Set `"featured": true` if you want it on home page
4. Commit and push to GitHub
5. Vercel auto-deploys!

## 📧 Contact Form Setup

The contact form currently shows a success message but doesn't send emails.

### Option 1: Web3Forms (Free)
1. Sign up at [web3forms.com](https://web3forms.com)
2. Get your access key
3. Update form in `contact.html`:
   ```html
   <form action="https://api.web3forms.com/submit" method="POST">
     <input type="hidden" name="access_key" value="YOUR_KEY">
     <!-- rest of form -->
   </form>
   ```

### Option 2: Formspree
1. Sign up at [formspree.io](https://formspree.io)
2. Update form action:
   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```

## 🎯 Folder Structure for Images

```
images/
├── projects/
│   ├── monotype-thumb.jpg (1920x1080)
│   ├── monotype-1.jpg
│   ├── monotype-2.jpg
│   ├── kinetic-thumb.jpg
│   └── ... (all your project images)
├── archive/
│   └── ... (BTS/experimental images)
├── about/
│   └── team.jpg
└── social-preview.jpg (1200x630 for social sharing)
```

## 💡 Pro Tips

1. **Use WebP format** for smaller file sizes (browsers support it now)
2. **Optimize images** before uploading (use tools like TinyPNG or Squoosh)
3. **Keep thumbnails 16:9** ratio for consistency
4. **Use descriptive filenames** (helps with SEO)
5. **Test locally** before pushing to GitHub

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

---

**Built with Claude Code. Now go make it yours! 🎨**
