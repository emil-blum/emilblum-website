// Playground drawing canvas with p5.brush
// Global variables for brush state
let currentBrush = 'marker';
let currentColor = '#000000';
let currentSize = 20;

// p5.js sketch
function setup() {
    // Get the container dimensions
    const container = document.getElementById('canvas-container');
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    // Create canvas that fills the container
    const canvas = createCanvas(containerWidth, containerHeight);
    canvas.parent('canvas-container');
    canvas.id('drawing-canvas');

    // Set background to white
    background(255);

    // Initialize brush
    brush.load();
    brush.set(currentBrush, currentColor, 1);
    brush.scaleBrushes(currentSize / 20); // Default size is 20

    // Setup event listeners after p5 setup
    setupControls();
}

function draw() {
    // Only draw when mouse is pressed and within canvas
    if (mouseIsPressed && mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
        brush.line(pmouseX, pmouseY, mouseX, mouseY);
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
        clearBtn.addEventListener('click', clearCanvas);
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
    brush.set(brushType, currentColor, 1);
    brush.scaleBrushes(currentSize / 20);
}

function setColor(color) {
    currentColor = color;
    brush.set(currentBrush, color, 1);
}

function setBrushSize(size) {
    currentSize = parseInt(size);
    const sizeDisplay = document.getElementById('size-display');
    if (sizeDisplay) {
        sizeDisplay.textContent = currentSize;
    }
    brush.scaleBrushes(currentSize / 20); // Scale relative to default size
}

function clearCanvas() {
    background(255);
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
