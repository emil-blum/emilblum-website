// Playground drawing canvas with p5.brush
// Global variables for brush state
let currentBrush = 'marker';
let currentColor = '#000000';
let currentSize = 1;

// p5.js sketch
function setup() {
    // Get the container dimensions
    const container = document.getElementById('canvas-container');
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    // IMPORTANT: p5.brush REQUIRES WEBGL mode
    const canvas = createCanvas(containerWidth, containerHeight, WEBGL);
    canvas.parent('canvas-container');
    canvas.id('drawing-canvas');

    // Load brushes AFTER canvas creation
    brush.load();

    // Set initial brush
    brush.set(currentBrush, currentColor, currentSize);

    // Setup event listeners after p5 setup
    setupControls();
}

function draw() {
    // Set white background
    background(255);

    // WEBGL has (0,0) at center, translate to top-left for standard drawing
    translate(-width / 2, -height / 2);

    // Only draw when mouse is pressed and within canvas
    if (mouseIsPressed && mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
        // Convert mouse coordinates for WEBGL
        const x1 = pmouseX;
        const y1 = pmouseY;
        const x2 = mouseX;
        const y2 = mouseY;

        brush.line(x1, y1, x2, y2);
    }
}

// Handle window resize
function windowResized() {
    const container = document.getElementById('canvas-container');
    if (container) {
        resizeCanvas(container.offsetWidth, container.offsetHeight);
    }
}

// Setup control event listeners
function setupControls() {
    // Brush selection
    document.querySelectorAll('.brush-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const brushType = this.id.replace('brush-', '');
            setBrush(brushType);

            // Update active state
            document.querySelectorAll('.brush-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Color selection
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const color = this.getAttribute('data-color');
            setColor(color);
        });
    });

    // Brush size
    const sizeSlider = document.getElementById('brush-size');
    if (sizeSlider) {
        sizeSlider.addEventListener('input', function() {
            setBrushSize(this.value);
        });
    }

    // Clear button
    const clearBtn = document.getElementById('clear-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            background(255);
        });
    }

    // Save button
    const saveBtn = document.getElementById('save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveDrawing);
    }
}

// Brush control functions
function setBrush(brushType) {
    currentBrush = brushType;
    brush.set(brushType, currentColor, currentSize);
}

function setColor(color) {
    currentColor = color;
    brush.set(currentBrush, color, currentSize);
}

function setBrushSize(size) {
    // Convert size from 5-50 range to brush weight (0.5 to 3)
    currentSize = map(parseInt(size), 5, 50, 0.5, 3);
    const sizeDisplay = document.getElementById('size-display');
    if (sizeDisplay) {
        sizeDisplay.textContent = size;
    }
    brush.set(currentBrush, currentColor, currentSize);
}

function saveDrawing() {
    // Save the canvas as PNG with timestamp
    const filename = 'sketch-' + Date.now() + '.png';
    saveCanvas(filename);
}

// Prevent scrolling when drawing on touch devices
document.addEventListener('touchmove', function(e) {
    const canvas = document.getElementById('drawing-canvas');
    if (canvas && e.target === canvas) {
        e.preventDefault();
    }
}, { passive: false });
