/* ===================================
   ROGUE STUDIO - SHARED JAVASCRIPT
   =================================== */

// ==========================================
// ACCORDION FUNCTIONALITY (Home Page)
// ==========================================
function toggleAccordion(element) {
    // This is primarily for touch devices where :hover sticks or doesn't trigger nicely
    const content = element.querySelector('.accordion-content');
    const isActive = content.style.maxHeight !== '0px' && content.style.maxHeight !== '';

    // Close all others
    document.querySelectorAll('.accordion-content').forEach(el => {
        el.style.maxHeight = null;
        el.style.opacity = null;
    });

    if (!isActive && window.innerWidth < 768) {
        // Determine height manually or set a large max-height
        content.style.maxHeight = content.scrollHeight + "px";
        content.style.opacity = "1";
    } else {
        // If it was active, we just closed everything, so we are done.
        // Resetting for desktop hover compatibility:
        content.style.maxHeight = null;
        content.style.opacity = null;
    }
}

// ==========================================
// DRAGGABLE LOGIC (Shared across pages)
// ==========================================
function initDraggables() {
    const draggables = document.querySelectorAll('.draggable-item');
    let zIndexCounter = 20;

    draggables.forEach(elmnt => {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        elmnt.onmousedown = dragMouseDown;
        elmnt.ontouchstart = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            // get the mouse cursor position at startup:
            // check for touch or mouse
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            pos3 = clientX;
            pos4 = clientY;

            // Bring to front
            zIndexCounter++;
            elmnt.style.zIndex = zIndexCounter;

            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;

            // Touch support
            document.ontouchend = closeDragElement;
            document.ontouchmove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            // prevent default for touch to stop scrolling while dragging
            if(e.type === 'touchmove') {
               e.preventDefault();
            }

            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            // calculate the new cursor position:
            pos1 = pos3 - clientX;
            pos2 = pos4 - clientY;
            pos3 = clientX;
            pos4 = clientY;

            // Strip transform translate if it exists (first interaction)
            if (elmnt.style.transform.includes('translate')) {
                const rect = elmnt.getBoundingClientRect();
                const parentRect = elmnt.parentElement.getBoundingClientRect();

                elmnt.style.left = (rect.left - parentRect.left) + "px";
                elmnt.style.top = (rect.top - parentRect.top) + "px";

                // Keep rotation but remove translate
                const currentRotation = elmnt.style.transform.match(/rotate\(([^)]+)\)/);
                const rot = currentRotation ? currentRotation[1] : '0deg';
                elmnt.style.transform = `rotate(${rot})`;
                elmnt.style.position = 'absolute';
                elmnt.style.right = 'auto';
                elmnt.style.bottom = 'auto';
            }

            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
            document.ontouchend = null;
            document.ontouchmove = null;
        }
    });
}

// ==========================================
// LIGHTBOX LOGIC (Project & Archive Pages)
// ==========================================
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return; // Exit if no lightbox on page

    const lightboxImg = document.getElementById('lightbox-img');

    // Function to open lightbox
    window.openLightbox = function(element) {
        const img = element.querySelector('img');
        if (lightboxImg && img) {
            lightboxImg.src = img.src;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    // Function to close lightbox
    window.closeLightbox = function() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Close on clicking background
    lightbox.addEventListener('click', (e) => {
        if(e.target === lightbox) {
            window.closeLightbox();
        }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            window.closeLightbox();
        }
    });
}

// ==========================================
// PROJECT PAGE - TEXT OVERLAY
// ==========================================
function toggleTextOverlay() {
    const overlay = document.getElementById('text-overlay');
    if (overlay) {
        overlay.classList.toggle('open');
        document.body.style.overflow = overlay.classList.contains('open') ? 'hidden' : '';
    }
}

// ==========================================
// CONTACT PAGE - TOGGLE FUNCTIONS
// ==========================================
function toggleMulti(btn) {
    btn.classList.toggle('active');
}

function toggleSingle(btn, groupClass) {
    const group = document.getElementsByClassName(groupClass);

    for (let item of group) {
        item.classList.remove('active');
    }
    btn.classList.add('active');
}

function handleFormSubmit(e) {
    e.preventDefault();

    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<iconify-icon icon="lucide:loader-2" width="16" class="animate-spin"></iconify-icon> Sending...';

    // Simulate network request
    setTimeout(() => {
        document.getElementById('successOverlay').classList.add('visible');
        btn.innerHTML = originalText;
        e.target.reset();
        document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
    }, 1200);
}

// ==========================================
// ARCHIVE PAGE - INFINITE GALLERY
// ==========================================
function initArchiveGallery() {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return; // Exit if not on archive page

    const loader = document.getElementById('loader');
    const itemCountEl = document.getElementById('item-count');

    // Data Source (Simulated) - 30 items total
    const imageDatabase = [
        { src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000", title: "Neon Void", caption: "RENDER 01, BLENDER CYCLES", year: "2024" },
        { src: "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=1000", title: "Grid System", caption: "UI EXPLORATION, FIGMA", year: "2024" },
        { src: "https://images.unsplash.com/photo-1492571350019-22de08371fd3?q=80&w=1000", title: "Tokyo Drift", caption: "CAPTURED ON 35MM, SHIBUYA", year: "2024" },
        { src: "https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?q=80&w=1000", title: "Abstract Flow", caption: "GENERATIVE ART, PROCESSING", year: "2024" },
        { src: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000", title: "Brutalist Wall", caption: "ARCHITECTURAL STUDY", year: "2023" },
        { src: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=1000", title: "Glass Distortion", caption: "MATERIAL EXPERIMENT", year: "2023" },
        { src: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1000", title: "Mono Packaging", caption: "BRAND IDENTITY", year: "2023" },
        { src: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000", title: "Chrome Type", caption: "TYPOGRAPHY STUDY", year: "2023" },
        { src: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000", title: "Cyber Terminal", caption: "WEBGL EXPERIMENT", year: "2023" },
        { src: "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?q=80&w=1000", title: "Glitch Noise", caption: "ANALOG VIDEO SYNTH", year: "2022" },
        { src: "https://images.unsplash.com/photo-1605106702734-205df224ecce?q=80&w=1000", title: "Minimal Chair", caption: "PRODUCT DESIGN", year: "2022" },
        { src: "https://images.unsplash.com/photo-1515462277126-2dd0c162007a?q=80&w=1000", title: "Retro Console", caption: "HARDWARE ARCHIVE", year: "2022" },
        { src: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1000", title: "Pattern Grid", caption: "EXPERIMENTAL, P5.JS", year: "2022" },
        { src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000", title: "Motion Study", caption: "AFTER EFFECTS", year: "2022" },
        { src: "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=1000", title: "Type Treatment", caption: "KINETIC TYPOGRAPHY", year: "2021" },
        { src: "https://images.unsplash.com/photo-1492571350019-22de08371fd3?q=80&w=1000", title: "Urban Patterns", caption: "PHOTOGRAPHY", year: "2021" },
        { src: "https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?q=80&w=1000", title: "Flow State", caption: "DIGITAL ART", year: "2021" },
        { src: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000", title: "Structure", caption: "ARCHITECTURE", year: "2021" },
        { src: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=1000", title: "Refraction", caption: "3D RENDER", year: "2021" },
        { src: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1000", title: "Packaging Mock", caption: "PRODUCT DESIGN", year: "2020" },
        { src: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000", title: "Metal Shader", caption: "CINEMA 4D", year: "2020" },
        { src: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000", title: "Interface", caption: "UI CONCEPT", year: "2020" },
        { src: "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?q=80&w=1000", title: "Glitch Art", caption: "DATAMOSH", year: "2020" },
        { src: "https://images.unsplash.com/photo-1605106702734-205df224ecce?q=80&w=1000", title: "Product Shot", caption: "PHOTOGRAPHY", year: "2020" },
        { src: "https://images.unsplash.com/photo-1515462277126-2dd0c162007a?q=80&w=1000", title: "Vintage Tech", caption: "STILL LIFE", year: "2020" },
        { src: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1000", title: "Grid Experiment", caption: "CSS ART", year: "2020" },
        { src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000", title: "Neon Vibes", caption: "ABSTRACT", year: "2020" },
        { src: "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=1000", title: "Wireframe", caption: "CONCEPT ART", year: "2020" },
        { src: "https://images.unsplash.com/photo-1492571350019-22de08371fd3?q=80&w=1000", title: "Street View", caption: "DOCUMENTARY", year: "2020" },
        { src: "https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?q=80&w=1000", title: "Fluid Motion", caption: "MOTION GRAPHICS", year: "2020" }
    ];

    let loadedCount = 0;
    let isLoading = false;

    // Function to create an image card
    function createCard(imgData, index) {
        const wrapper = document.createElement('div');
        wrapper.className = 'break-inside-avoid mb-8 group relative image-card';

        wrapper.innerHTML = `
            <div class="relative w-full overflow-hidden bg-neutral-900 rounded-sm cursor-pointer" onclick="openArchiveImage('${imgData.src}', '${imgData.title}', '${imgData.caption}')">
                <img src="${imgData.src}" alt="${imgData.title}" class="w-full h-auto object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out">

                <!-- Hover Expand Button (V2 Style - Top Right) -->
                <div class="expand-btn absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 transform translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-sm backdrop-blur-sm">
                    <iconify-icon icon="lucide:maximize-2" width="14" class="text-neutral-900"></iconify-icon>
                </div>
            </div>

            <!-- Caption -->
            <div class="mt-3 flex justify-between items-start opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                <div class="text-xs font-mono tracking-wide text-neutral-400 uppercase max-w-[70%]">
                    ${imgData.caption}
                </div>
                <div class="text-[10px] text-neutral-600 border border-neutral-800 px-1.5 py-0.5 rounded">
                    ${imgData.year}
                </div>
            </div>
        `;
        return wrapper;
    }

    // Function to load batch of images (limited to 30 total)
    function loadImages(count = 18) {
        if (isLoading || loadedCount >= 30) return; // Stop at 30 images
        isLoading = true;
        loader.style.opacity = '1';

        // Simulate network delay
        setTimeout(() => {
            const remaining = Math.min(count, 30 - loadedCount);
            for (let i = 0; i < remaining; i++) {
                const imgData = imageDatabase[loadedCount + i];
                const card = createCard(imgData, loadedCount + i);
                grid.appendChild(card);
            }

            loadedCount += remaining;
            itemCountEl.innerText = loadedCount.toString().padStart(3, '0');

            isLoading = false;
            loader.style.opacity = '0';

            // Show footer when all 30 are loaded
            if (loadedCount >= 30) {
                const footer = document.getElementById('archive-footer');
                if (footer) footer.classList.remove('hidden');
            }
        }, 800);
    }

    // Archive-specific lightbox opener
    window.openArchiveImage = function(src, title, caption) {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxTitle = document.getElementById('lightbox-title');
        const lightboxDesc = document.getElementById('lightbox-desc');

        if (lightbox && lightboxImg) {
            lightboxImg.src = src;
            if (lightboxTitle) lightboxTitle.innerText = title;
            if (lightboxDesc) lightboxDesc.innerText = caption;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    // Initial Load
    loadImages(18);

    // Infinite Scroll Listener
    window.addEventListener('scroll', () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 1000) {
            loadImages(9);
        }
    });
}

// ==========================================
// PROJECTS - DYNAMIC LOADING FROM JSON
// ==========================================
let projectsData = null;

// Load projects from JSON
async function loadProjectsData() {
    if (projectsData) return projectsData;

    try {
        const response = await fetch('data/projects.json');
        projectsData = await response.json();
        return projectsData;
    } catch (error) {
        console.error('Error loading projects:', error);
        return null;
    }
}

// Create project card HTML
function createProjectCard(project, index) {
    return `
        <div class="reveal-up">
            <div class="group relative overflow-hidden aspect-video bg-neutral-200 mb-4">
                <img src="${project.thumbnail}" alt="${project.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                <div class="absolute inset-0 bg-neutral-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                    <a href="project.html?id=${project.id}" class="bg-white text-neutral-900 px-6 py-3 rounded-full text-sm font-medium tracking-wide transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl hover:bg-neutral-100 flex items-center gap-2">
                        View Project <iconify-icon icon="lucide:arrow-right" width="16"></iconify-icon>
                    </a>
                </div>
            </div>
            <div class="flex justify-between items-end border-b border-neutral-200 pb-2">
                <div>
                    <h3 class="text-xl font-medium tracking-tight text-neutral-900">${project.title}</h3>
                    <p class="text-sm text-neutral-500 mt-1">${project.subtitle}</p>
                </div>
                <div class="text-xs font-mono text-neutral-300">${String(index + 1).padStart(2, '0')}</div>
            </div>
        </div>
    `;
}

// Initialize featured projects on home page
async function initFeaturedProjects() {
    const container = document.getElementById('featured-projects');
    if (!container) return;

    const data = await loadProjectsData();
    if (!data) return;

    const featured = data.projects.filter(p => p.featured).slice(0, 4);
    container.innerHTML = featured.map((project, index) => createProjectCard(project, index)).join('');
}

// Initialize all projects on projects page
async function initAllProjects() {
    const container = document.getElementById('all-projects');
    if (!container) return;

    const data = await loadProjectsData();
    if (!data) return;

    container.innerHTML = data.projects.map((project, index) => createProjectCard(project, index)).join('');
}

// Initialize single project page - FULLY DYNAMIC
async function initProjectPage() {
    // Check if we're on project page
    if (!window.location.pathname.includes('project.html')) return;

    // Get project ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');

    if (!projectId) {
        // No ID provided, redirect to projects page
        window.location.href = 'projects.html';
        return;
    }

    const data = await loadProjectsData();
    if (!data) return;

    const project = data.projects.find(p => p.id === projectId);

    if (!project) {
        // Project not found, redirect to projects page
        window.location.href = 'projects.html';
        return;
    }

    // Update page title and meta tags
    document.title = `${project.title} - Emīl Blūm`;
    updateMetaTag('name', 'description', project.description);
    updateMetaTag('property', 'og:title', `${project.title} - Emīl Blūm`);
    updateMetaTag('property', 'og:description', project.description);
    updateMetaTag('name', 'twitter:title', `${project.title} - Emīl Blūm`);
    updateMetaTag('name', 'twitter:description', project.description);

    // Update project title
    const titleEl = document.getElementById('project-title');
    if (titleEl) titleEl.innerHTML = project.title.toUpperCase().replace(' ', '<br>');

    // Update project description
    const descEl = document.getElementById('project-description');
    if (descEl) descEl.textContent = project.description;

    // Update sidebar info
    updateSidebarInfo('project-year', project.year);
    updateSidebarInfo('project-client', project.client);
    updateSidebarInfo('project-role', project.role);
    updateSidebarInfo('project-services', project.services.join(', '));

    // Update metrics section
    if (project.metrics) {
        const metricsTitle = document.getElementById('metrics-title');
        const metricsList = document.getElementById('metrics-list');

        if (metricsTitle) metricsTitle.textContent = project.metrics.title;
        if (metricsList) {
            metricsList.innerHTML = project.metrics.items.map(item =>
                `<span>${item}</span>`
            ).join('');
        }
    }

    // Update case study content with flexible renderer
    const caseStudyEl = document.getElementById('case-study-content');
    if (caseStudyEl && project.caseStudy && project.caseStudy.sections) {
        caseStudyEl.innerHTML = renderCaseStudy(project.caseStudy.sections);
    }

    // Update gallery images
    const galleryEl = document.getElementById('project-gallery');
    if (galleryEl && project.images) {
        galleryEl.innerHTML = project.images.map(img => `
            <div class="reveal-up">
                <div class="w-full aspect-video bg-neutral-200 overflow-hidden rounded-sm cursor-pointer group" onclick="openLightbox(this)">
                    <img src="${img}" alt="${project.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                </div>
            </div>
        `).join('');
    }
}

// Helper function to update meta tags
function updateMetaTag(attr, attrValue, content) {
    const tag = document.querySelector(`meta[${attr}="${attrValue}"]`);
    if (tag) tag.setAttribute('content', content);
}

// Helper function to update sidebar info
function updateSidebarInfo(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

// Render flexible case study content
function renderCaseStudy(sections) {
    return sections.map(section => {
        switch(section.type) {
            case 'heading':
                const level = section.level || 2;
                const headingClass = level === 1 ? 'text-3xl font-semibold mb-4 text-neutral-900' :
                                   level === 2 ? 'text-2xl font-semibold mb-4 text-neutral-900 mt-8' :
                                   'text-lg font-semibold uppercase tracking-wide text-neutral-600 mb-3 mt-6';
                return `<h${level} class="${headingClass}">${section.content}</h${level}>`;

            case 'paragraph':
                return `<p class="text-neutral-700 leading-relaxed mb-6">${section.content}</p>`;

            case 'list':
                const listItems = section.items.map(item =>
                    `<li class="flex gap-3"><span class="text-neutral-400 mt-1">•</span><span class="flex-1">${item}</span></li>`
                ).join('');
                return `<ul class="space-y-2 mb-6 text-neutral-700">${listItems}</ul>`;

            case 'numbered-list':
                const numberedItems = section.items.map((item, index) =>
                    `<li class="flex gap-3"><span class="text-neutral-400 font-medium">${index + 1}.</span><span class="flex-1">${item}</span></li>`
                ).join('');
                return `<ol class="space-y-2 mb-6 text-neutral-700">${numberedItems}</ol>`;

            case 'quote':
                const author = section.author ? `<cite class="text-sm text-neutral-500 not-italic">— ${section.author}</cite>` : '';
                return `<blockquote class="border-l-4 border-neutral-300 pl-6 py-4 my-8 italic text-lg text-neutral-800">${section.content}${author ? '<br>' + author : ''}</blockquote>`;

            default:
                return '';
        }
    }).join('');
}

// ==========================================
// DRAGGABLE SECTIONS - DYNAMIC LOADING
// ==========================================

// Generate random position within safe bounds
function getRandomPosition(containerWidth, containerHeight, itemWidth) {
    const margin = 50; // Keep items away from edges
    const maxX = containerWidth - itemWidth - margin;
    const maxY = containerHeight - 200 - margin; // Keep away from bottom

    return {
        left: margin + Math.random() * (maxX - margin),
        top: margin + Math.random() * (maxY - margin),
        rotation: -15 + Math.random() * 30 // -15deg to +15deg
    };
}

// Load and render draggable items
async function loadDraggables(containerId, jsonFile) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const response = await fetch(jsonFile);
        const data = await response.json();

        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        data.items.forEach((item, index) => {
            const itemWidth = parseInt(item.width) || 250;
            const pos = getRandomPosition(containerWidth, containerHeight, itemWidth);

            const div = document.createElement('div');
            div.className = 'draggable-item absolute cursor-move select-none transition-shadow duration-300 hover:shadow-2xl group';
            div.style.width = item.width;
            div.style.left = `${pos.left}px`;
            div.style.top = `${pos.top}px`;
            div.style.transform = `rotate(${pos.rotation}deg)`;
            div.style.zIndex = 10 + index;

            div.innerHTML = `
                <img src="${item.image}" alt="${item.alt}" class="w-full h-auto shadow-lg border-4 border-white" draggable="false">
            `;

            container.appendChild(div);
        });

    } catch (error) {
        console.error('Error loading draggables:', error);
    }
}

// Initialize home page draggables
async function initHomeDraggables() {
    await loadDraggables('home-draggables', 'data/home-draggables.json');
}

// Initialize about page draggables
async function initAboutDraggables() {
    await loadDraggables('about-draggables', 'data/about-draggables.json');
}

// ==========================================
// INITIALIZE ON PAGE LOAD
// ==========================================
document.addEventListener('DOMContentLoaded', async function() {
    initLightbox();
    initArchiveGallery();
    await initFeaturedProjects();
    await initAllProjects();
    await initProjectPage();
    await initHomeDraggables();
    await initAboutDraggables();

    // Initialize draggables after all dynamic content is loaded
    // This handles both dynamically loaded draggables and static ones (like project page)
    setTimeout(() => {
        initDraggables();
    }, 100);
});
