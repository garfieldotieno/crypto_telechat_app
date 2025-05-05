console.log('now loading pwa-manager.js');

/**
 * PWA Manager - Handles Progressive Web App installation and related features
 */

// Register service worker for PWA functionality
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                })
                .catch(error => {
                    console.log('ServiceWorker registration failed: ', error);
                });
        });
    }
}



// Function to detect platform for tailored instructions
function getDevicePlatform() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    // iOS detection
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return 'ios';
    }
    
    // Android detection
    if (/android/i.test(userAgent)) {
        return 'android';
    }
    
    // Desktop detection
    return 'desktop';
}

// For iOS devices that don't support standard installation
function showIOSInstallInstructions(container) {
    if (window.navigator.standalone) {
        return; // Already installed, don't show instructions
    }
    
    const instructionsBox = document.createElement('div');
    instructionsBox.classList.add('ios-install-instructions');
    instructionsBox.style.margin = '15px';
    instructionsBox.style.padding = '15px';
    instructionsBox.style.border = '1px solid #ccc';
    instructionsBox.style.borderRadius = '5px';
    instructionsBox.style.backgroundColor = '#f9f9f9';
    
    instructionsBox.innerHTML = `
        <h3 style="margin-top: 0;">Install this app on your iPhone</h3>
        <p>1. Tap the share button at the bottom of the screen</p>
        <p>2. Scroll down and tap "Add to Home Screen"</p>
        <p>3. Tap "Add" in the top right corner</p>
        <button class="button_item" id="close-instructions">Got it!</button>
    `;
    
    container.appendChild(instructionsBox);
    
    document.getElementById('close-instructions').addEventListener('click', () => {
        instructionsBox.remove();
    });
}


// Add this function to create a PWA install button in both verification screens
function addPWAInstallButtonToScreen(container) {
    // Check if the app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true) {
        console.log("App already installed - not adding button");
        return null;
    }
    
    // Check if setupPWAInstallButton function exists
    if (typeof setupPWAInstallButton !== 'function') {
        console.warn("PWA install function not available");
        return null;
    }

    console.log("Adding PWA install button");
    let buttonContainer = document.createElement("div");
    buttonContainer.classList.add("pwa-install-container");
    buttonContainer.style.textAlign = "center";
    buttonContainer.style.marginTop = "20px";
    buttonContainer.style.opacity = "0.8";
    container.appendChild(buttonContainer);

    let installBtn = document.createElement("button");
    installBtn.id = 'install_button';
    installBtn.innerHTML = `Install App`;
    installBtn.style.padding = "8px 15px";
    installBtn.style.backgroundColor = "#f0f0f0";
    installBtn.style.color = "#333";
    installBtn.style.border = "1px solid #ccc";
    installBtn.style.borderRadius = "5px";
    installBtn.style.display = "none"; // Hidden by default until prompt is available
    
    buttonContainer.appendChild(installBtn);
    setupPWAInstallButton(installBtn);
    
    return installBtn;
}

