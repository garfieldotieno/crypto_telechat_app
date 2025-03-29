console.log('now loading pwa-manager.js');

/**
 * PWA Manager - Handles Progressive Web App installation and related features
 */

// Register service worker for PWA functionality
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                })
                .catch(error => {
                    console.log('ServiceWorker registration failed: ', error);
                });
        });
    }
}

// Setup the PWA installation button
function setupPWAInstallButton(installButton) {
    let deferredPrompt; // Store install event for later use

    // Hide the button initially until prompt is available
    installButton.style.display = "none";
    
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true) {
        console.log("App already installed");
        installButton.style.display = "none";
        return; // Exit if already installed
    }

    // Listen for the beforeinstallprompt event
    window.addEventListener("beforeinstallprompt", (event) => {
        event.preventDefault(); // Prevent automatic prompt
        deferredPrompt = event;

        console.log("PWA Install Prompt Available");
        installButton.style.display = "block"; // Show the install button

        installButton.addEventListener("click", async () => {
            if (!deferredPrompt) return;
            
            // Show the install prompt
            deferredPrompt.prompt();
            
            // Wait for user choice
            const choiceResult = await deferredPrompt.userChoice;
            if (choiceResult.outcome === "accepted") {
                console.log("User accepted PWA install");
            } else {
                console.log("User dismissed PWA install");
            }
            
            // Clear the prompt reference
            deferredPrompt = null;
            installButton.style.display = "none";
        });
    });

    // Listen for successful installation
    window.addEventListener("appinstalled", (event) => {
        console.log("PWA was installed");
        installButton.style.display = "none";
    });
}

// Add install button to container based on platform detection
function addPWAInstallButton(container) {
    // Check if the app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true) {
        console.log("App already installed - not adding button");
        return null;
    }

    console.log("Adding PWA install button");
    let buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button_stack");
    container.appendChild(buttonContainer);

    let installBtn = document.createElement("button");
    installBtn.id = 'install_button';
    installBtn.innerHTML = `Install App`;
    installBtn.classList.add("button_item");
    installBtn.style.marginTop = "10px";
    
    buttonContainer.appendChild(installBtn);
    setupPWAInstallButton(installBtn);
    
    // For iOS devices, add installation instructions
    const platform = getDevicePlatform();
    if (platform === 'ios') {
        showIOSInstallInstructions(container);
    }
    
    return installBtn;
}

// Check if PWA is supported in current browser
function isPWASupported() {
    return 'serviceWorker' in navigator;
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