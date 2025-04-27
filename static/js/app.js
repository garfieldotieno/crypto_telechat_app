console.log('now loading app.js')


// At the beginning of your file
document.addEventListener("DOMContentLoaded", () => {
    console.log("App Loaded");
    set_display();
    window.addEventListener("resize", set_display);
    
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed: ', error);
            });
    }
});

// ... rest of your existing code
function set_display() {
    console.log("calling set_display");

    document.body.innerHTML = "";

    if (window.innerWidth < 777) {
        console.log("Rendering small screen view");
        render_small_screen_view();
    } else {
        console.log("Rendering big screen view");
        render_big_screen_view();
    }
}

function render_small_screen_view() {
    console.log("calling render_small_screen_view");
    render_start();
}

function render_big_screen_view() {
    console.log("calling render_big_screen_view");
    render_start();
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

// Function to generate a unique 10-character string
function generateUniqueString(length = 10) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

// Check if PWA is supported in current browser
function isPWASupported() {
    return 'serviceWorker' in navigator;
}

// Function to encode data
function encodeData(data) {
    return JSON.stringify(data);
}

// Function to decode data
function decodeData(data) {
    return JSON.parse(data);
}

const welcome_and_register_page_data_template = {
    registerd_state: false,
    id: 1,
    username: 'user1',
    email: "user1@example.com",
    otp_secret: "",
    wall_image_url: "static/images/samurai.jpeg",
    profile_image_url: "static/images/background_one.jpeg"
};


function init_user(data) {
    console.log('calling init_user with data:', data);

    // Check if required fields are present in the data
    if (!data || !data.id || !data.username || !data.email) {
        console.error("Invalid data provided to init_user. Required fields: id, username, email.");
        return;
    }

    // Save updated userData to localStorage
    localStorage.setItem('userData', encodeData(data));

    
    console.log("Initialized register_data in localStorage:", data);
}


function init_test_user(){
    init_user(welcome_and_register_page_data_template);
}


function fetch_user_data(){
    console.log("Fetching user data...");
    let registerData = localStorage.getItem('userData');

    if (!registerData) {
        console.warn("No register_data found in localStorage");

        return null;
    }

    try {
        let parsedData = JSON.parse(registerData);
        
        return parsedData;
    } catch (error) {
        console.error("Error parsing register_data:", error);
        return null;
    }
}


async function fetch_other_profile_data(user_id){
    console.log(`Fetching other profile data from backend ${user_id}`);
}

async function fetch_group_profile_data(user_id){
    console.log(`Fetching group profile data ${user_id}`);
}


async function fetch_user_backend_data() {
    console.log("Fetching user data from backend...");

    let registerData = localStorage.getItem('userData');
    if (!registerData) {
        console.warn("No register_data found in localStorage");
        return null;
    }

    // Parse the user data from localStorage
    let parsedData = JSON.parse(registerData);
    let user_id = parsedData.id;

    if (!user_id) {
        console.warn("User ID not found in register_data.");
        return null;
    }

    try {
        // Fetch data from the backend using the Fetch API
        const response = await fetch(`/api/user/${user_id}`);
        if (!response.ok) {
            console.error("Failed to fetch user data:", response.statusText);
            return null;
        }

        const userData = await response.json();
        console.log("Fetched user data:", userData); // Log the fetched data

        // Update localStorage with the fetched data
        localStorage.setItem('userData', encodeData(userData));
        console.log("Updated register_data in localStorage:", userData);

        return userData;

    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
}


function update_user_data(data){
    console.log('calling update_user_data with data:', data);
    let registerData = localStorage.getItem('userData');
    if (!registerData) {
        console.warn("No register_data found in localStorage");
        return;
    }
    try {
        let parsedData = JSON.parse(registerData);
        // Update the parsedData with new data
        Object.assign(parsedData, data);
        // Save the updated data back to localStorage
        localStorage.setItem('userData', encodeData(parsedData));
        console.log("Updated register_data in localStorage:", parsedData);
    } catch (error) {
        console.error("Error parsing register_data:", error);
    }
}


function register_user(){
    data = fetch_user_data();
    data.registerd_state = true ;
    localStorage.setItem('userData', encodeData(data));
}

function is_registerd(){
    data = fetch_user_data();

    if (data.registerd_state){
        return true
    }
    else{
        return false
    }
}

// function is_logged_in() {
//     console.log("Checking if user is logged in...");

//     let registerData = localStorage.getItem('userData');
//     if (!registerData) {
//         console.warn("No register_data found in localStorage.");
//         return false;
//     }

//     try {
//         let parsedData = JSON.parse(registerData);

//         // Check if the user has a valid last_login timestamp
//         if (!parsedData.last_login) {
//             console.warn("User is not logged in: last_login is missing.");
//             return false;
//         }

//         // Parse the last_login timestamp as UTC
//         const lastLoginTime = new Date(parsedData.last_login); // UTC timestamp from backend
//         const currentTime = new Date(); // Current time in local timezone
//         const timeDifference = currentTime - lastLoginTime; // Difference in milliseconds
//         const fortyFiveMinutesInMilliseconds = 45 * 60 * 1000;

//         if (timeDifference > fortyFiveMinutesInMilliseconds) {
//             console.warn("User session has expired. Attempting to refresh session...");
//             // Attempt to refresh session by calling login_user
//             login_user();
//             return false; // Return false for now, as the session is being refreshed
//         }

//         console.log("User is logged in.");
//         return true;
//     } catch (error) {
//         console.error("Error parsing register_data:", error);
//         return false;
//     }
// }

function is_logged_in(){
    loged_in_state = false
    console.log(`checking login : ${loged_in_state}`)
    return loged_in_state
}


async function login_user() {
    console.log("Calling login_user...");

    let registerData = localStorage.getItem('userData');
    if (!registerData) {
        console.warn("No register_data found in localStorage. Redirecting to registration...");
        render_register_page();
        return;
    }

    try {
        let parsedData = JSON.parse(registerData);
        const email = parsedData.email;
        const otp = parsedData.otp_secret;

        if (!email || !otp) {
            console.warn("Email or OTP is missing in register_data. Cannot proceed with login.");
            return;
        }

        const response = await fetch('/api/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, otp })
        });

        if (!response.ok) {
            console.error("Login failed:", response.statusText);
            alert("Login failed. Please check your credentials and try again.");
            return;
        }

        const userData = await response.json();
        console.log("Login successful. Fetched user data:", userData);

        // Update localStorage with the fetched user data, including the updated last_login
        localStorage.setItem('userData', encodeData(userData.user));
        console.log("Updated register_data in localStorage:", userData.user);

        // Redirect to the personal profile page or dashboard
        render_personal_profile();
    } catch (error) {
        console.error("Error during login_user:", error);
        alert("An error occurred during login. Please try again later.");
    }
}


function get_user_wallet(){
    console.log('calling get_user_wallet for information');
}

function get_my_contacts() {
    console.log("Fetching contacts...");

    let registerData = localStorage.getItem("userData");
    if (!registerData) {
        console.warn("No register_data found in localStorage.");
        return [];
    }

    try {
        let parsedData = JSON.parse(registerData);
        let user_id = parsedData.id;

        if (!user_id) {
            console.warn("User ID not found in register_data.");
            return [];
        }

        // Synchronous request to fetch contacts
        let request = new XMLHttpRequest();
        request.open("GET", `/api/user/${user_id}/contacts`, false); // Sync request
        request.send(null);

        if (request.status !== 200) {
            console.error("Failed to fetch contacts:", request.statusText);
            return [];
        }

        let contacts = JSON.parse(request.responseText);
        console.log("Fetched contacts:", contacts); // Log the fetched contacts

        // Map API response to UI structure format
        return contacts.map(contact => ({
            item_type: "list_item_contact",
            label: contact.contact_name,
            id:contact.id,
            status: "online" // Default status
        }));

    } catch (error) {
        console.error("Error fetching contacts:", error);
        return [];
    }
}


const contact_page_data_template = {
    adding_user_id:null,
    contact_digits:null,
    contact_name:null,
    contact_email:null,
    app_user: true,
    app_user_id: null,
    selected_data : []

}


const resource_selection_data_template = {
    selected_data: [],
    select_type:"normal",
    is_export:false,
    processor:null,
    resource:null
}


function load_resource_selection_data(resource, select_type, processor) {
    console.log("calling load_resource_selection_data");


    if(select_type === "select_many"){
        console.log("processing current select :", select_type)
        resource_selection_data_template.select_type = select_type
        resource_selection_data_template.is_export = true;
        resource_selection_data_template.processor = processor
        resource_selection_data_template.resource = resource
    }

    else if (select_type === "select_one"){
        console.log("processing current select :", select_type)
        resource_selection_data_template.select_type = select_type
        resource_selection_data_template.is_export = true;
        resource_selection_data_template.processor = processor
        resource_selection_data_template.resource = resource
    }

    else if (select_type === "normal"){
        console.log("processing current select :", select_type)
        resource_selection_data_template.select_type = select_type
        resource_selection_data_template.is_export = false;
        resource_selection_data_template.processor = null
        resource_selection_data_template.resource = resource
    }

    data = encodeData(resource_selection_data_template);
    localStorage.setItem('resource_selection_data', data);
    
    console.log("Resource selection data loaded:", data);
    
}



function update_resource_selection_data(data) {
    console.log("calling update_resource_selection_data with data:", data);
    let resourceSelectionData = localStorage.getItem('resource_selection_data');
    if (!resourceSelectionData) {
        console.warn("No resource_selection_data found in localStorage");
        return;
    }
    try {
        let parsedData = JSON.parse(resourceSelectionData); 
        // update using array appenging
        parsedData.selected_data.push(data);
        // Save the updated data back to localStorage
        localStorage.setItem('resource_selection_data', encodeData(parsedData));
        console.log("Updated resource_selection_data in localStorage:", parsedData);
    } catch (error) {
        console.error("Error parsing resource_selection_data:", error);
    }
}


function clear_resource_selection_data() {  
    console.log("calling clear_resource_selection_data");
    localStorage.removeItem('resource_selection_data');
    console.log("Resource selection data cleared from localStorage");
}

function clear_resource_selection_data_single_select() {
    console.log("calling clear_resource_selection_data_single_select");

    // Retrieve the resource selection data from localStorage
    let resourceSelectionData = localStorage.getItem('resource_selection_data');
    if (!resourceSelectionData) {
        console.warn("No resource_selection_data found in localStorage");
        return;
    }

    try {
        // Parse the data
        let parsedData = JSON.parse(resourceSelectionData);

        // Clear only the selected_data array
        parsedData.selected_data = [];

        // Save the updated data back to localStorage
        localStorage.setItem('resource_selection_data', encodeData(parsedData));
        console.log("Cleared selected_data in resource_selection_data:", parsedData);
    } catch (error) {
        console.error("Error parsing resource_selection_data:", error);
    }
}


function load_contact_data() {
    console.log("calling load_contact_data");
    data = encodeData(contact_page_data_template);
    localStorage.setItem('contact_page_data', data);
    console.log("Contact page data loaded:", contact_page_data_template);
}


function update_contact_data(data) {
    console.log("calling update_contact_data with data:", data);
    let contactPageData = localStorage.getItem('contact_page_data');
    if (!contactPageData) {
        console.warn("No contact_page_data found in localStorage");
        return;
    }
    try {
        let parsedData = JSON.parse(contactPageData);
        // Update the parsedData with new data
        Object.assign(parsedData, data);
        // Save the updated data back to localStorage
        localStorage.setItem('contact_page_data', encodeData(parsedData));
        console.log("Updated contact_page_data in localStorage:", parsedData);
    } catch (error) {
        console.error("Error parsing contact_page_data:", error);
    }
}


function clear_contact_data() {
    console.log("calling clear_contact_data");
    localStorage.removeItem('contact_page_data');
    console.log("Contact page data cleared from localStorage");
}


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

    // Default to other
    return 'other';
}


function get_my_chats() {
    console.log("calling get_my_chats");

    let registerData = localStorage.getItem('userData');

    if (!registerData) {
        console.warn("No register_data found in localStorage.");
        return [];
    }

    try {
        let parsedData = JSON.parse(registerData);
        let user_id = parsedData.id;

        if (!user_id) {
            console.warn("User ID not found in register_data.");
            return [];
        }

        // Fetch chats from API (Synchronous fetch to be used directly in structure)
        let request = new XMLHttpRequest();
        request.open("GET", `/api/user/${user_id}/chats`, false); // Synchronous request
        request.send(null);

        if (request.status !== 200) {
            console.error("Failed to fetch chats:", request.statusText);
            return [];
        }

        let chats = JSON.parse(request.responseText);
        console.log("Fetched chats:", chats); // Log the fetched chats

        // Map API response to UI structure format
        return chats.map(chat => ({
            item_type: "list_item_chat",
            label: chat.chat_type === "single" ? `Chat ${chat.id}` : `Group ${chat.id}`,
            last_message: "Tap to open chat", // Placeholder text
            notification_badge: "", // No unread count in API response
            id:chat.id
        }));

    } catch (error) {
        console.error("Error fetching chats:", error);
        return [];
    }
}


const create_chat_data_template = {
    primary_input:[],
    selected_data: []
}

function load_create_chat_data(){
    console.log('loading create chat data');
    data = encodeData(create_chat_data_template);
    localStorage.setItem('create_chat_page_data', data);
    console.log("Contact page data loaded:", create_chat_data_template);
}

function update_create_chat_data(data){
    console.log('updating create chat data');
    let createChatPageData = localStorage.getItem('create_chat_page_data');
    if (!createChatPageData) {
        console.warn("No resource_selection_data found in localStorage");
        return;
    }
    try {
        let parsedData = JSON.parse(createChatPageData); 
        // update using array appenging
        parsedData.selected_data.push(data);
        // Save the updated data back to localStorage
        localStorage.setItem('create_chat_page_data', encodeData(parsedData));
        console.log("Updated create_chat_page_data in localStorage:", parsedData);
    } catch (error) {
        console.error("Error parsing create_chat_page_data:", error);
    }
}

function clear_create_chat_data(){
    console.log('clear create chat data');
    localStorage.removeItem('create_chat_page_data');
    console.log("create_chat_page_data cleared from localStorage");
}







 


