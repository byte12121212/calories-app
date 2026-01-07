/**
 * Camera Food Scanner
 * Handles camera access, photo capture, and AR-style calorie overlay
 */

let stream = null;
let videoElement = null;
let canvasElement = null;
let ctx = null;
let isScanning = false;
let currentFoodData = null;

/**
 * Initialize camera scanner
 * @param {HTMLElement} videoEl - Video element to display camera feed
 * @param {HTMLElement} canvasEl - Canvas element for capturing images
 * @returns {Promise<boolean>} - True if camera initialized successfully
 */
async function initializeCamera(videoEl, canvasEl) {
    try {
        videoElement = videoEl;
        canvasElement = canvasEl;
        ctx = canvasEl.getContext('2d');
        
        // Request camera access
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'environment', // Use back camera on mobile
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        });
        
        // Set video source
        videoElement.srcObject = stream;
        videoElement.play();
        
        return true;
    } catch (error) {
        console.error('Camera initialization error:', error);
        throw new Error('Failed to access camera. Please ensure camera permissions are granted.');
    }
}

/**
 * Stop camera stream
 */
function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    
    if (videoElement) {
        videoElement.srcObject = null;
    }
}

/**
 * Capture photo from video stream
 * @returns {Promise<Blob>} - Captured image as blob
 */
async function capturePhoto() {
    if (!videoElement || !canvasElement || !ctx) {
        throw new Error('Camera not initialized');
    }
    
    // Set canvas dimensions to match video
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;
    
    // Draw video frame to canvas
    ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
    
    // Convert canvas to blob
    return new Promise((resolve, reject) => {
        canvasElement.toBlob((blob) => {
            if (blob) {
                resolve(blob);
            } else {
                reject(new Error('Failed to capture image'));
            }
        }, 'image/jpeg', 0.9);
    });
}

/**
 * Scan food from camera
 * @returns {Promise<{success: boolean, food?: string, calories?: number, image?: string, error?: string}>}
 */
async function scanFood() {
    try {
        if (!videoElement || !canvasElement) {
            throw new Error('Camera not initialized');
        }
        
        isScanning = true;
        
        // Capture photo
        const imageBlob = await capturePhoto();
        
        // Recognize food from image
        const recognitionResult = await recognizeFoodFromImage(imageBlob);
        
        if (!recognitionResult.success) {
            throw new Error(recognitionResult.error || 'Failed to recognize food');
        }
        
        // Store food data
        currentFoodData = {
            food: recognitionResult.food,
            calories: recognitionResult.calories,
            image: await blobToDataURL(imageBlob),
            confidence: recognitionResult.confidence || 0.8
        };
        
        isScanning = false;
        return {
            success: true,
            food: currentFoodData.food,
            calories: currentFoodData.calories,
            image: currentFoodData.image
        };
        
    } catch (error) {
        isScanning = false;
        console.error('Food scan error:', error);
        return {
            success: false,
            error: error.message || 'Failed to scan food'
        };
    }
}

/**
 * Convert blob to data URL
 * @param {Blob} blob - Blob to convert
 * @returns {Promise<string>} - Data URL string
 */
function blobToDataURL(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

/**
 * Draw AR-style calorie overlay on image
 * @param {HTMLImageElement|HTMLCanvasElement} imageElement - Image to overlay
 * @param {string} foodName - Name of detected food
 * @param {number} calories - Calorie count
 * @param {HTMLElement} container - Container element to display overlay
 */
function drawAROverlay(imageElement, foodName, calories, container) {
    // Create overlay canvas
    const overlayCanvas = document.createElement('canvas');
    overlayCanvas.width = imageElement.width || imageElement.videoWidth;
    overlayCanvas.height = imageElement.height || imageElement.videoHeight;
    const overlayCtx = overlayCanvas.getContext('2d');
    
    // Draw original image
    overlayCtx.drawImage(imageElement, 0, 0, overlayCanvas.width, overlayCanvas.height);
    
    // Draw semi-transparent overlay
    overlayCtx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    overlayCtx.fillRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    
    // Draw food info box (centered)
    const boxWidth = Math.min(overlayCanvas.width * 0.8, 400);
    const boxHeight = 150;
    const boxX = (overlayCanvas.width - boxWidth) / 2;
    const boxY = (overlayCanvas.height - boxHeight) / 2;
    
    // Draw rounded rectangle background
    overlayCtx.fillStyle = 'rgba(99, 102, 241, 0.95)';
    overlayCtx.beginPath();
    // Use manual rounded rectangle path (roundRect may not be supported in all browsers)
    const radius = 12;
    overlayCtx.moveTo(boxX + radius, boxY);
    overlayCtx.lineTo(boxX + boxWidth - radius, boxY);
    overlayCtx.quadraticCurveTo(boxX + boxWidth, boxY, boxX + boxWidth, boxY + radius);
    overlayCtx.lineTo(boxX + boxWidth, boxY + boxHeight - radius);
    overlayCtx.quadraticCurveTo(boxX + boxWidth, boxY + boxHeight, boxX + boxWidth - radius, boxY + boxHeight);
    overlayCtx.lineTo(boxX + radius, boxY + boxHeight);
    overlayCtx.quadraticCurveTo(boxX, boxY + boxHeight, boxX, boxY + boxHeight - radius);
    overlayCtx.lineTo(boxX, boxY + radius);
    overlayCtx.quadraticCurveTo(boxX, boxY, boxX + radius, boxY);
    overlayCtx.closePath();
    overlayCtx.fill();
    
    // Draw border
    overlayCtx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    overlayCtx.lineWidth = 2;
    overlayCtx.stroke();
    
    // Draw food name
    overlayCtx.fillStyle = '#ffffff';
    overlayCtx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    overlayCtx.textAlign = 'center';
    overlayCtx.textBaseline = 'middle';
    overlayCtx.fillText(foodName, overlayCanvas.width / 2, boxY + 50);
    
    // Draw calories
    overlayCtx.font = '32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    overlayCtx.fillText(`${calories} cal`, overlayCanvas.width / 2, boxY + 100);
    
    // Display overlay
    overlayCanvas.className = 'ar-overlay';
    container.innerHTML = '';
    container.appendChild(overlayCanvas);
}

/**
 * Draw floating calorie text on live video (AR style)
 * @param {string} foodName - Name of detected food
 * @param {number} calories - Calorie count
 * @param {HTMLElement} container - Container element
 */
function drawFloatingCalories(foodName, calories, container) {
    // Remove existing overlay
    const existingOverlay = container.querySelector('.floating-calories');
    if (existingOverlay) {
        existingOverlay.remove();
    }
    
    // Create floating text element
    const overlay = document.createElement('div');
    overlay.className = 'floating-calories';
    overlay.innerHTML = `
        <div class="ar-food-name">${escapeHtml(foodName)}</div>
        <div class="ar-calories">${calories} cal</div>
    `;
    
    container.appendChild(overlay);
}

/**
 * Remove floating calories overlay
 * @param {HTMLElement} container - Container element
 */
function removeFloatingCalories(container) {
    const overlay = container.querySelector('.floating-calories');
    if (overlay) {
        overlay.remove();
    }
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Check if camera is available
 * @returns {Promise<boolean>} - True if camera is available
 */
async function isCameraAvailable() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return false;
    }
    
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        return devices.some(device => device.kind === 'videoinput');
    } catch (error) {
        return false;
    }
}

