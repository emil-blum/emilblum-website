// Playground drawing canvas with Fabric.js
let canvas;
let currentBrush = 'pencil';
let currentColor = '#000000';
let currentSize = 20;

// Initialize Fabric.js canvas when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initCanvas();
    setupControls();
});

function initCanvas() {
    // Get container dimensions
    const container = document.getElementById('canvas-container');
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    // Initialize Fabric canvas
    canvas = new fabric.Canvas('drawing-canvas', {
        isDrawingMode: true,
        width: containerWidth,
        height: containerHeight,
        backgroundColor: '#ffffff'
    });

    // Set initial brush
    updateBrush();

    // Handle window resize
    window.addEventListener('resize', function() {
        const newWidth = container.offsetWidth;
        const newHeight = container.offsetHeight;
        canvas.setDimensions({
            width: newWidth,
            height: newHeight
        });
        canvas.renderAll();
    });
}

function updateBrush() {
    // Create brush based on current type
    let brush;

    switch(currentBrush) {
        case 'pencil':
            brush = new fabric.PencilBrush(canvas);
            break;
        case 'circle':
            brush = new fabric.CircleBrush(canvas);
            break;
        case 'spray':
            brush = new fabric.SprayBrush(canvas);
            break;
        default:
            brush = new fabric.PencilBrush(canvas);
    }

    // Set brush properties
    brush.color = currentColor;
    brush.width = currentSize;

    // Apply to canvas
    canvas.freeDrawingBrush = brush;
}

function setupControls() {
    // Brush type selection
    document.querySelectorAll('.brush-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const brushType = this.id.replace('brush-', '');
            currentBrush = brushType;
            updateBrush();

            // Update active state
            document.querySelectorAll('.brush-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Color selection
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            currentColor = this.getAttribute('data-color');
            updateBrush();
        });
    });

    // Brush size slider
    const sizeSlider = document.getElementById('brush-size');
    if (sizeSlider) {
        sizeSlider.addEventListener('input', function() {
            currentSize = parseInt(this.value);
            const sizeDisplay = document.getElementById('size-display');
            if (sizeDisplay) {
                sizeDisplay.textContent = currentSize;
            }
            updateBrush();
        });
    }

    // Clear button
    const clearBtn = document.getElementById('clear-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            canvas.clear();
            canvas.backgroundColor = '#ffffff';
            canvas.renderAll();
        });
    }

    // Save button
    const saveBtn = document.getElementById('save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            // Convert canvas to data URL and trigger download
            const dataURL = canvas.toDataURL({
                format: 'png',
                quality: 1
            });

            const link = document.createElement('a');
            link.download = 'sketch-' + Date.now() + '.png';
            link.href = dataURL;
            link.click();
        });
    }
}
