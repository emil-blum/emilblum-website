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

// Brush control functions
function setBrush(brushType) {
    currentBrush = brushType;
    brush.set(brushType, currentColor, 1);

    // Update active button
    document.querySelectorAll('.brush-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

function setColor(color) {
    currentColor = color;
    brush.set(currentBrush, color, 1);
}

function setBrushSize(size) {
    currentSize = parseInt(size);
    document.getElementById('size-display').textContent = currentSize;
    brush.scaleBrushes(currentSize / 20); // Scale relative to default size
}

function clearCanvas() {
    background(255);
}

function saveCanvas() {
    // Save the canvas as PNG
    const filename = 'sketch-' + Date.now() + '.png';
    saveCanvas(filename);
}

// Prevent scrolling when drawing on touch devices
document.addEventListener('touchmove', function(e) {
    if (e.target.id === 'drawing-canvas') {
        e.preventDefault();
    }
}, { passive: false });
