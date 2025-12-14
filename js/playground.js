// Playground drawing canvas with Fabric.js - Enhanced Version
let canvas;
let currentBrush = 'pencil';
let currentColor = '#000000';
let currentSize = 20;
let isEraser = false;

// History for undo/redo
let history = [];
let historyStep = 0;

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

    // Save initial state
    saveState();

    // Track changes for history
    canvas.on('path:created', function() {
        saveState();
    });

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
    let brush;

    if (isEraser) {
        // Eraser mode
        brush = new fabric.PencilBrush(canvas);
        brush.color = '#ffffff'; // White to erase
        brush.width = currentSize;
    } else {
        // Regular brush modes
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
            case 'hline':
                brush = new fabric.PatternBrush(canvas);
                brush.getPatternSrc = function() {
                    const patternCanvas = document.createElement('canvas');
                    patternCanvas.width = patternCanvas.height = 10;
                    const ctx = patternCanvas.getContext('2d');
                    ctx.strokeStyle = currentColor;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(0, 5);
                    ctx.lineTo(10, 5);
                    ctx.stroke();
                    return patternCanvas;
                };
                break;
            case 'vline':
                brush = new fabric.PatternBrush(canvas);
                brush.getPatternSrc = function() {
                    const patternCanvas = document.createElement('canvas');
                    patternCanvas.width = patternCanvas.height = 10;
                    const ctx = patternCanvas.getContext('2d');
                    ctx.strokeStyle = currentColor;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(5, 0);
                    ctx.lineTo(5, 10);
                    ctx.stroke();
                    return patternCanvas;
                };
                break;
            case 'square':
                brush = new fabric.PatternBrush(canvas);
                brush.getPatternSrc = function() {
                    const patternCanvas = document.createElement('canvas');
                    patternCanvas.width = patternCanvas.height = 10;
                    const ctx = patternCanvas.getContext('2d');
                    ctx.fillStyle = currentColor;
                    ctx.fillRect(0, 0, 5, 5);
                    return patternCanvas;
                };
                break;
            case 'diamond':
                brush = new fabric.PatternBrush(canvas);
                brush.getPatternSrc = function() {
                    const patternCanvas = document.createElement('canvas');
                    patternCanvas.width = patternCanvas.height = 10;
                    const ctx = patternCanvas.getContext('2d');
                    ctx.fillStyle = currentColor;
                    ctx.beginPath();
                    ctx.moveTo(5, 0);
                    ctx.lineTo(10, 5);
                    ctx.lineTo(5, 10);
                    ctx.lineTo(0, 5);
                    ctx.closePath();
                    ctx.fill();
                    return patternCanvas;
                };
                break;
            default:
                brush = new fabric.PencilBrush(canvas);
        }

        brush.color = currentColor;
        brush.width = currentSize;
    }

    canvas.freeDrawingBrush = brush;
}

function saveState() {
    // Remove any states after current step
    history = history.slice(0, historyStep + 1);

    // Save current canvas state
    history.push(JSON.stringify(canvas));
    historyStep = history.length - 1;

    // Limit history to 50 steps
    if (history.length > 50) {
        history.shift();
        historyStep--;
    }
}

function undo() {
    if (historyStep > 0) {
        historyStep--;
        canvas.loadFromJSON(history[historyStep], function() {
            canvas.renderAll();
        });
    }
}

function redo() {
    if (historyStep < history.length - 1) {
        historyStep++;
        canvas.loadFromJSON(history[historyStep], function() {
            canvas.renderAll();
        });
    }
}

function setBackground(type) {
    switch(type) {
        case 'white':
            canvas.backgroundColor = '#ffffff';
            canvas.backgroundImage = null;
            break;
        case 'paper':
            // Create paper texture
            const paperCanvas = document.createElement('canvas');
            paperCanvas.width = 200;
            paperCanvas.height = 200;
            const ctx = paperCanvas.getContext('2d');
            ctx.fillStyle = '#fdfcfa';
            ctx.fillRect(0, 0, 200, 200);
            // Add noise
            for (let i = 0; i < 1000; i++) {
                ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.05})`;
                ctx.fillRect(Math.random() * 200, Math.random() * 200, 1, 1);
            }
            canvas.setBackgroundColor({source: paperCanvas.toDataURL(), repeat: 'repeat'}, canvas.renderAll.bind(canvas));
            break;
        case 'grid':
            // Create grid pattern
            const gridCanvas = document.createElement('canvas');
            gridCanvas.width = gridCanvas.height = 20;
            const gridCtx = gridCanvas.getContext('2d');
            gridCtx.strokeStyle = '#e5e5e5';
            gridCtx.lineWidth = 1;
            gridCtx.beginPath();
            gridCtx.moveTo(0, 20);
            gridCtx.lineTo(20, 20);
            gridCtx.lineTo(20, 0);
            gridCtx.stroke();
            canvas.setBackgroundColor({source: gridCanvas.toDataURL(), repeat: 'repeat'}, canvas.renderAll.bind(canvas));
            break;
        case 'dots':
            // Create dot pattern
            const dotCanvas = document.createElement('canvas');
            dotCanvas.width = dotCanvas.height = 20;
            const dotCtx = dotCanvas.getContext('2d');
            dotCtx.fillStyle = '#d4d4d4';
            dotCtx.beginPath();
            dotCtx.arc(2, 2, 1, 0, Math.PI * 2);
            dotCtx.fill();
            canvas.setBackgroundColor({source: dotCanvas.toDataURL(), repeat: 'repeat'}, canvas.renderAll.bind(canvas));
            break;
    }
    canvas.renderAll();
    saveState();
}

function setupControls() {
    // Brush type dropdown
    const brushType = document.getElementById('brush-type');
    if (brushType) {
        brushType.addEventListener('change', function() {
            currentBrush = this.value;
            isEraser = false;
            updateBrush();
        });
    }

    // Eraser button
    const eraserBtn = document.getElementById('eraser-btn');
    if (eraserBtn) {
        eraserBtn.addEventListener('click', function() {
            isEraser = !isEraser;
            this.classList.toggle('active');
            updateBrush();
        });
    }

    // Color picker
    const colorPicker = document.getElementById('color-picker');
    const colorValue = document.getElementById('color-value');
    if (colorPicker) {
        colorPicker.addEventListener('input', function() {
            currentColor = this.value;
            if (colorValue) {
                colorValue.textContent = this.value.toUpperCase();
            }
            if (!isEraser) {
                updateBrush();
            }
        });
    }

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

    // Background texture
    const bgTexture = document.getElementById('bg-texture');
    if (bgTexture) {
        bgTexture.addEventListener('change', function() {
            setBackground(this.value);
        });
    }

    // Undo button
    const undoBtn = document.getElementById('undo-btn');
    if (undoBtn) {
        undoBtn.addEventListener('click', undo);
    }

    // Redo button
    const redoBtn = document.getElementById('redo-btn');
    if (redoBtn) {
        redoBtn.addEventListener('click', redo);
    }

    // Clear button
    const clearBtn = document.getElementById('clear-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            canvas.clear();
            canvas.backgroundColor = '#ffffff';
            canvas.renderAll();
            saveState();
        });
    }

    // Save button
    const saveBtn = document.getElementById('save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
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

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Z for undo
        if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
            e.preventDefault();
            undo();
        }
        // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y for redo
        if ((e.ctrlKey || e.metaKey) && (e.shiftKey && e.key === 'z' || e.key === 'y')) {
            e.preventDefault();
            redo();
        }
    });
}
