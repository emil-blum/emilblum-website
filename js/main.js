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

// Initialize single project page
async function initProjectPage() {
    const projectContainer = document.getElementById('project-content');
    if (!projectContainer) return;

    // Get project ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');

    if (!projectId) return;

    const data = await loadProjectsData();
    if (!data) return;

    const project = data.projects.find(p => p.id === projectId);
    if (!project) return;

    // Update page title
    document.title = `${project.title} - Emīl Blūm`;

    // You can add more dynamic content loading here
    // For now, the project.html template will need manual updates per project
    // But this structure allows for future full dynamic loading
}

// ==========================================
// INITIALIZE ON PAGE LOAD
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    initDraggables();
    initLightbox();
    initArchiveGallery();
    initFeaturedProjects();
    initAllProjects();
    initProjectPage();
});
