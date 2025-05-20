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

function is_logged_in() {
    console.log("Checking if user is logged in...");

    let registerData = localStorage.getItem('userData');
    if (!registerData) {
        console.warn("No register_data found in localStorage.");
        return false;
    }

    try {
        let parsedData = JSON.parse(registerData);

        // Check if the user has a valid last_login timestamp
        if (!parsedData.last_login) {
            console.warn("User is not logged in: last_login is missing.");
            return false;
        }

        // Parse the last_login timestamp as local time
        const lastLoginTime = new Date(parsedData.last_login); // Local timestamp from backend
        const currentTime = new Date(); // Current local time
        const timeDifference = currentTime - lastLoginTime; // Difference in milliseconds
        const fortyFiveMinutesInMilliseconds = 45 * 60 * 1000;

        console.log("Last login time (Local):", lastLoginTime);
        console.log("Current time (Local):", currentTime);
        console.log("Time difference (ms):", timeDifference);

        if (timeDifference > fortyFiveMinutesInMilliseconds) {
            console.warn("User session has expired. Attempting to refresh session...");

            // Prevent repeated calls by setting a flag in localStorage
            if (localStorage.getItem('isRefreshingSession')) {
                console.warn("Session refresh already in progress. Skipping...");
                return false;
            }

            localStorage.setItem('isRefreshingSession', 'true'); // Set the flag

            // Attempt to refresh session by calling login_user
            login_user().finally(() => {
                localStorage.removeItem('isRefreshingSession'); // Clear the flag after login attempt
            });

            return false; // Return false for now, as the session is being refreshed
        }

        console.log("User is logged in.");
        return true;
    } catch (error) {
        console.error("Error parsing register_data:", error);
        return false;
    }
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

        // Delay redirection to ensure session refresh is complete
        setTimeout(() => {
            render_personal_profile();
        }, 1000); // Delay by 1 second
    } catch (error) {
        console.error("Error during login_user:", error);
        alert("An error occurred during login. Please try again later.");
    }
}


function uninstall_app() {
    console.log("Uninstalling the app...");

    // Unregister the service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
            registrations.forEach(registration => {
                registration.unregister().then(success => {
                    if (success) {
                        console.log("Service worker unregistered successfully.");
                    } else {
                        console.warn("Failed to unregister service worker.");
                    }
                });
            });
        });
    }

    // Clear caches
    if ('caches' in window) {
        caches.keys().then(cacheNames => {
            cacheNames.forEach(cacheName => {
                caches.delete(cacheName).then(success => {
                    if (success) {
                        console.log(`Cache ${cacheName} deleted successfully.`);
                    } else {
                        console.warn(`Failed to delete cache ${cacheName}.`);
                    }
                });
            });
        });
    }

    // Clear localStorage
    localStorage.clear();
    console.log("Local storage cleared.");

    // Provide instructions to the user
    alert(
        "The app has been uninstalled successfully.\n\n" +
        "To completely remove the app from your device:\n" +
        "1. On your desktop, right-click the app icon and select 'Uninstall'.\n" +
        "2. On your mobile device, long-press the app icon and select 'Uninstall'."
    );

    // Optionally reload the page to reflect changes
    location.reload(); // Reload the page to reflect changes
}

const walletData = {
    public_address:'',
    private_address:'',
    amount:''
}

function activate_wallet() {
    console.log('Calling activate_wallet...');

    // Fetch user data from localStorage
    const userData = fetch_user_data();
    if (!userData || !userData.id) {
        console.error("User data not found or invalid. Cannot activate wallet.");
        return;
    }

    // Make a POST request to the backend to generate a wallet
    fetch('/api/wallet/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: userData.id })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to generate wallet: ${response.statusText}`);
        }
        return response.json();
    })
    .then(async (data) => {
        console.log("Wallet generated successfully:", data);

        // Update the user data in memory
        userData.registerd_wallet = true; // Ensure this is set to true
        userData.wallet_address = data.wallet.address;

        // Log the updated userData
        console.log("Updated userData in memory:", userData);
        update_user_data(userData);

        // Notify the user
        alert("Wallet activated successfully!");

        // Wait for wallet data to be updated before rendering
        await ui_structure.update_wallet_data();

        // Proceed to render the wallet start page
        render_wallet_start();
    })
    .catch(error => {
        console.error("Error activating wallet:", error);
        alert("Failed to activate wallet. Please try again later.");
    });
}

function get_user_wallet() {
    console.log('Fetching user wallet information...');

    // Fetch wallet data from localStorage
    let walletData = localStorage.getItem('walletData');
    if (walletData) {
        try {
            // Parse the wallet data
            const parsedWalletData = JSON.parse(walletData);

            // Exclude the private key for security
            const walletInfo = {
                public_address: parsedWalletData.public_address,
                amount: parsedWalletData.amount
            };

            console.log("Fetched wallet information from localStorage:", walletInfo);
            return walletInfo;
        } catch (error) {
            console.error("Error parsing wallet data from localStorage:", error);
        }
    }

    // If wallet data is not found in localStorage, fetch it from the backend
    console.log("Wallet data not found in localStorage. Fetching from backend...");
    const userData = fetch_user_data();
    if (!userData || !userData.id) {
        console.error("User data not found or invalid. Cannot fetch wallet data.");
        return null;
    }

    try {
        // Fetch wallet data from the backend
        const response = fetch(`/api/wallet/${userData.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch wallet data: ${response.statusText}`);
        }

        const walletDataFromBackend = response.json();
        console.log("Fetched wallet information from backend:", walletDataFromBackend);

        // Save the wallet data to localStorage for future use
        localStorage.setItem('walletData', JSON.stringify(walletDataFromBackend));

        // Exclude the private key for security
        const walletInfo = {
            public_address: walletDataFromBackend.public_address,
            amount: walletDataFromBackend.amount
        };

        return walletInfo;
    } catch (error) {
        console.error("Error fetching wallet data from backend:", error);
        return null;
    }
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

        let contacts = [];

        // Step 1: Fetch contacts based on user.id
        let firstQueryRequest = new XMLHttpRequest();
        firstQueryRequest.open("GET", `/api/user/${user_id}/contacts`, false); // Sync request
        firstQueryRequest.send(null);

        if (firstQueryRequest.status !== 200) {
            console.error("Failed to fetch first query contact:", firstQueryRequest.statusText);
            return [];
        }

        let firstQueryContacts = JSON.parse(firstQueryRequest.responseText);
        console.log("Fetched first query contacts:", firstQueryContacts);

        // Add first query contacts to the list
        contacts = contacts.concat(firstQueryContacts);

        // Process contacts to include user details and status
        contacts = contacts.map(contact => {
            if (contact.app_user && contact.app_user_id) {
                try {
                    let userDetailsRequest = new XMLHttpRequest();
                    userDetailsRequest.open("GET", `/api/user/${contact.app_user_id}`, false); // Sync request
                    userDetailsRequest.send(null);

                    if (userDetailsRequest.status === 200) {
                        let userDetails = JSON.parse(userDetailsRequest.responseText);
                        contact.user_dict = userDetails; // Append user details
                    } else {
                        console.warn(`Failed to fetch user details for app_user_id: ${contact.app_user_id}`);
                        contact.user_dict = null;
                    }
                } catch (error) {
                    console.error(`Error fetching user details for app_user_id: ${contact.app_user_id}`, error);
                    contact.user_dict = null;
                }
            } else {
                contact.user_dict = null;
            }

            // Determine the status
            let status = "not registered"; // Default status
            if (contact.app_user && contact.user_dict?.last_login) {
                const lastLoginTime = new Date(contact.user_dict.last_login);
                const currentTime = new Date();
                const timeDifference = currentTime - lastLoginTime;
                const twoMinutesInMilliseconds = 2 * 60 * 1000;

                if (timeDifference <= twoMinutesInMilliseconds) {
                    status = "online";
                } else {
                    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
                    status = `last seen: ${lastLoginTime.toLocaleString(undefined, options)}`;
                }
            }

            return {
                item_type: "list_item_contact",
                label: contact.contact_name,
                id: contact.id,
                status: status,
                user_dict: contact.user_dict
            };
        });

        console.log("Processed contacts with user_dict and status:", contacts);
        return contacts;

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
        // update using array appending
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
    console.log("Fetching all chats...");

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

        // Fetch all chats using the new endpoint
        let request = new XMLHttpRequest();
        request.open("GET", `/api/user/${user_id}/all_chats`, false); // Sync request
        request.send(null);

        if (request.status !== 200) {
            console.error("Failed to fetch chats:", request.statusText);
            return [];
        }

        let chats = JSON.parse(request.responseText).chats;
        console.log("Fetched chats:", chats); // Log the fetched chats

        // Process chats
        chats = chats.map(chat => {
            let chatDetails = {
                item_type: "list_item_chat",
                chat_type: chat.chat_type,
                chat_member_ids: [], // Initialize as an empty array
                label: "",
                last_message: "Tap to open chat", // Placeholder text
                notification_badge: 2, // Placeholder for unread count
                id: chat.id,
                user_dict: null,
                group_dict: null,
                status: "unknown" // Default status
            };

            if (chat.chat_type === "single") {
                // Fetch chat members for single chat
                try {
                    let memberRequest = new XMLHttpRequest();
                    memberRequest.open("GET", `/api/chat/${chat.id}/members`, false); // Sync request
                    memberRequest.send(null);

                    if (memberRequest.status === 200) {
                        let members = JSON.parse(memberRequest.responseText).members;

                        if (members.length === 1) {
                            const member = members[0]; // Single chat should have one member
                            const memberUserId = member.user_id;

                            // Append the single member's user_id to chat_member_ids
                            chatDetails.chat_member_ids.push(memberUserId);

                            // Fetch user details for the member
                            let userRequest = new XMLHttpRequest();
                            userRequest.open("GET", `/api/user/${memberUserId}`, false); // Sync request
                            userRequest.send(null);

                            if (userRequest.status === 200) {
                                let user = JSON.parse(userRequest.responseText);
                                chatDetails.user_dict = user; // Append user object
                                chatDetails.label = user.username; // Use username as label
                            } else {
                                console.warn(`Failed to fetch user for chat member user_id: ${memberUserId}`);
                            }
                        } else {
                            console.warn(`Unexpected number of members for single chat ${chat.id}:`, members.length);
                        }
                    } else {
                        console.warn(`Failed to fetch members for chat_id: ${chat.id}`);
                    }
                } catch (error) {
                    console.error(`Error fetching members for chat_id: ${chat.id}`, error);
                }
            } else if (chat.chat_type === "group") {
                // Fetch chat members for group chat
                try {
                    let memberRequest = new XMLHttpRequest();
                    memberRequest.open("GET", `/api/chat/${chat.id}/members`, false); // Sync request
                    memberRequest.send(null);

                    if (memberRequest.status === 200) {
                        let members = JSON.parse(memberRequest.responseText).members;

                        // Append all member user_ids to chat_member_ids
                        chatDetails.chat_member_ids = members.map(member => member.user_id);

                        // Fetch group details for the group chat
                        let groupRequest = new XMLHttpRequest();
                        groupRequest.open("GET", `/api/chat/${chat.id}/group`, false); // Sync request
                        groupRequest.send(null);

                        if (groupRequest.status === 200) {
                            let response = JSON.parse(groupRequest.responseText);
                            let group = response.group_chat; // Extract the group_chat data from the response
                            chatDetails.group_dict = group; // Append group object
                            chatDetails.label = group.name; // Use group name as label
                            chatDetails.status = "group chat"; // Set status for group chats
                        } else {
                            console.warn(`Failed to fetch group for chat_id: ${chat.id}`);
                        }
                    } else {
                        console.warn(`Failed to fetch members for chat_id: ${chat.id}`);
                    }
                } catch (error) {
                    console.error(`Error fetching members for chat_id: ${chat.id}`, error);
                }
            }

            return chatDetails;
        });

        console.log("Processed chats with user_dict and group_dict:", chats);
        return chats;

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
        // update using array appending
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

const chat_pad_data = {
    chat_id: null,
    chat_type: null,
    chat_member_ids: [],
    messages: [],
    last_message: null,
    last_message_time: null,
    last_message_sender: null,
    last_message_type: null,
    last_message_status: null
}

function load_chat_pad(chat_id, chat_type, chat_member_ids){
    console.log("Loading chat pad data for chat_id:", chat_id);
    chat_pad_data.chat_id = chat_id;
    chat_pad_data.chat_type = chat_type;
    chat_pad_data.chat_member_ids = chat_member_ids;
    chat_pad_data.messages = [];
    chat_pad_data.last_message = null;
    chat_pad_data.last_message_time = null;
    chat_pad_data.last_message_sender = null;
    chat_pad_data.last_message_type = null;
    chat_pad_data.last_message_status = null;

    data = encodeData(chat_pad_data);
    localStorage.setItem('chat_pad_data', data);
    
    console.log("Chat pad data loaded:", data);
}

function fetch_chat_messages(chat_id) {
    console.log(`Fetching messages for chat_id: ${chat_id}...`);

    return fetch(`/api/chat/${chat_id}/messages`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to fetch messages for chat_id: ${chat_id}. Status: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Fetched messages:", data);

        // Update the chat_pad_data with the fetched messages
        const chatPadData = JSON.parse(localStorage.getItem('chat_pad_data')) || {};
        chatPadData.messages = data.messages || [];
        localStorage.setItem('chat_pad_data', JSON.stringify(chatPadData));

        console.log("Updated chat_pad_data with messages:", chatPadData);
    })
    .catch(error => {
        console.error(`Error fetching messages for chat_id: ${chat_id}:`, error);
    });
}

let pollingInterval = null; // Global variable to store the interval reference

function poll_new_chat_messages() {
    console.log("Starting polling for new chat messages...");

    // Retrieve the current chatPadData from localStorage
    const chatPadData = JSON.parse(localStorage.getItem("chat_pad_data"));
    if (!chatPadData || !chatPadData.chat_id) {
        console.error("No valid chatPadData found in localStorage. Polling stopped.");
        return;
    }

    const { chat_id } = chatPadData;

    // Function to fetch and update messages
    async function fetchAndUpdateMessages() {
        try {
            console.log(`Polling for new messages in chat_id: ${chat_id}...`);

            // Fetch the latest messages for the chat
            const response = await fetch(`/api/chat/${chat_id}/messages`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch messages for chat_id: ${chat_id}. Status: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Fetched new messages:", data);

            // Update the chatPadData with the fetched messages
            const updatedChatPadData = JSON.parse(localStorage.getItem("chat_pad_data")) || {};
            updatedChatPadData.messages = data.messages || [];
            localStorage.setItem("chat_pad_data", JSON.stringify(updatedChatPadData));

            // Update the UI with the latest messages
            const middleSection = document.querySelector(".middle_section");
            if (middleSection) {
                middleSection.innerHTML = ""; // Clear the current messages

                updatedChatPadData.messages.forEach(message => {
                    const messageElement = document.createElement("div");
                    messageElement.classList.add("message_item");

                    // Determine if the message is from the current user or another user
                    const isOwner = message.user_id === parseInt(chatPadData.chat_member_ids[0]);
                    messageElement.classList.add(isOwner ? "message_owner" : "message_recipient");

                    messageElement.innerHTML = `
                        <div class="message_content">${message.content}</div>
                        <div class="message_timestamp">${new Date(message.timestamp).toLocaleTimeString()}</div>
                    `;

                    middleSection.appendChild(messageElement);
                });

                // Scroll to the bottom of the chat
                middleSection.scrollTop = middleSection.scrollHeight;
            }
        } catch (error) {
            console.error("Error polling for new messages:", error);
        }
    }

    // Clear any existing interval to avoid duplicates
    if (pollingInterval) {
        clearInterval(pollingInterval);
    }

    // Set an interval to poll for new messages every 100ms
    pollingInterval = setInterval(fetchAndUpdateMessages, 100);
}

function stopPollingMessages() {
    if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
        console.log("Polling for new chat messages stopped.");
    }
}



function process_chat_profile(event) {
    console.log("Processing chat profile...");
    stopPollingMessages()

    // Retrieve the current chatPadData from localStorage
    const chatPadData = JSON.parse(localStorage.getItem("chat_pad_data"));
    if (!chatPadData || !chatPadData.chat_id) {
        console.error("No valid chatPadData found in localStorage.");
        return;
    }

    const { chat_id, chat_type, chat_member_ids, group_id } = chatPadData;

    if (chat_type === "group") {
        console.log(`Rendering group profile for chat_id: ${chat_id}`);
        render_group_profile(group_id); // Render the group profile page
    } else if (chat_type === "single") {
        // Retrieve the other user's ID from chat_member_ids[0]
        const otherUserId = parseInt(chat_member_ids[0]); // Convert to integer

        if (otherUserId) {
            console.log(`Rendering other profile for user_id: ${otherUserId}`);
            render_other_profile(otherUserId); // Render the other user's profile page
        } else {
            console.error("Unable to determine the other user's ID in the single chat.");
        }
    } else {
        console.error(`Unknown chat type: ${chat_type}`);
    }
}

function update_current_personal_profile() {
    console.log("Calling update_current_personal_profile...");

    // Create a modal container
    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.width = "300px";
    modal.style.padding = "20px";
    modal.style.backgroundColor = "#232D3B";
    modal.style.color = "#A1B6C3";
    modal.style.borderRadius = "10px";
    modal.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    modal.style.zIndex = "1000";
    modal.style.textAlign = "center";

    // Add a title
    const title = document.createElement("h3");
    title.textContent = "Update Personal Profile";
    title.style.marginBottom = "20px";
    modal.appendChild(title);

    // Create a button stack
    const buttonStack = document.createElement("div");
    buttonStack.style.display = "flex";
    buttonStack.style.flexDirection = "column";
    buttonStack.style.gap = "10px";

    // Create the "Background" button
    const backgroundButton = document.createElement("button");
    backgroundButton.textContent = "Background";
    backgroundButton.style.padding = "10px";
    backgroundButton.style.border = "none";
    backgroundButton.style.borderRadius = "5px";
    backgroundButton.style.backgroundColor = "#3C5E72";
    backgroundButton.style.color = "#FFFFFF";
    backgroundButton.style.cursor = "pointer";
    backgroundButton.onclick = () => handleFileUpload("profile_image", false);
    buttonStack.appendChild(backgroundButton);

    // Create the "Profile" button
    const profileButton = document.createElement("button");
    profileButton.textContent = "Profile";
    profileButton.style.padding = "10px";
    profileButton.style.border = "none";
    profileButton.style.borderRadius = "5px";
    profileButton.style.backgroundColor = "#3C5E72";
    profileButton.style.color = "#FFFFFF";
    profileButton.style.cursor = "pointer";
    profileButton.onclick = () => handleFileUpload("wall_image", false);
    buttonStack.appendChild(profileButton);

    // Add the button stack to the modal
    modal.appendChild(buttonStack);

    // Add a close button
    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.style.marginTop = "20px";
    closeButton.style.padding = "10px";
    closeButton.style.border = "none";
    closeButton.style.borderRadius = "5px";
    closeButton.style.backgroundColor = "#E74C3C";
    closeButton.style.color = "#FFFFFF";
    closeButton.style.cursor = "pointer";
    closeButton.onclick = () => document.body.removeChild(modal);
    modal.appendChild(closeButton);

    // Append the modal to the body
    document.body.appendChild(modal);
}

function update_current_group_profile() {
    console.log("Calling update_current_group_profile...");

    // Access chat_pad_data from localStorage
    const chatPadData = JSON.parse(localStorage.getItem("chat_pad_data"));
    if (!chatPadData) {
        console.error("No chat_pad_data found in localStorage.");
        return;
    }

    const { chat_id, chat_type } = chatPadData;

    if (chat_type !== "group") {
        console.error("Invalid chat type. This function is only for group profiles.");
        return;
    }

    // Create a modal container
    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.width = "300px";
    modal.style.padding = "20px";
    modal.style.backgroundColor = "#232D3B";
    modal.style.color = "#A1B6C3";
    modal.style.borderRadius = "10px";
    modal.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    modal.style.zIndex = "1000";
    modal.style.textAlign = "center";

    // Add a title
    const title = document.createElement("h3");
    title.textContent = "Update Group Profile";
    title.style.marginBottom = "20px";
    modal.appendChild(title);

    // Create a button stack
    const buttonStack = document.createElement("div");
    buttonStack.style.display = "flex";
    buttonStack.style.flexDirection = "column";
    buttonStack.style.gap = "10px";

    // Create the "Background" button
    const backgroundButton = document.createElement("button");
    backgroundButton.textContent = "Background";
    backgroundButton.style.padding = "10px";
    backgroundButton.style.border = "none";
    backgroundButton.style.borderRadius = "5px";
    backgroundButton.style.backgroundColor = "#3C5E72";
    backgroundButton.style.color = "#FFFFFF";
    backgroundButton.style.cursor = "pointer";
    backgroundButton.onclick = () => handleFileUpload("profile_image", true);
    buttonStack.appendChild(backgroundButton);

    // Create the "Profile" button
    const profileButton = document.createElement("button");
    profileButton.textContent = "Profile";
    profileButton.style.padding = "10px";
    profileButton.style.border = "none";
    profileButton.style.borderRadius = "5px";
    profileButton.style.backgroundColor = "#3C5E72";
    profileButton.style.color = "#FFFFFF";
    profileButton.style.cursor = "pointer";
    profileButton.onclick = () => handleFileUpload("wall_image", true);
    buttonStack.appendChild(profileButton);

    // Add the button stack to the modal
    modal.appendChild(buttonStack);

    // Add a close button
    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.style.marginTop = "20px";
    closeButton.style.padding = "10px";
    closeButton.style.border = "none";
    closeButton.style.borderRadius = "5px";
    closeButton.style.backgroundColor = "#E74C3C";
    closeButton.style.color = "#FFFFFF";
    closeButton.style.cursor = "pointer";
    closeButton.onclick = () => document.body.removeChild(modal);
    modal.appendChild(closeButton);

    // Append the modal to the body
    document.body.appendChild(modal);
}


function handleFileUpload(fieldName, isGroup = false) {
    console.log(`Uploading file for ${fieldName}...`);

    // Create a hidden file input
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*"; // Accept only image files
    fileInput.style.display = "none";

    // Trigger file selection
    fileInput.onchange = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            console.warn("No file selected.");
            return;
        }

        console.log(`Selected file: ${file.name}`);

        const formData = new FormData();
        formData.append(fieldName, file);

        let endpoint;
        let group_id = null;
        let chatPadData = null;

        if (isGroup) {
            console.log("Handling group profile update...");
            chatPadData = JSON.parse(localStorage.getItem("chat_pad_data"));
            console.log("Retrieved chatPadData:", chatPadData);

            if (!chatPadData || chatPadData.chat_type !== "group" || !chatPadData.group_id) {
                console.error("Invalid or missing chatPadData for group profile.");
                return;
            }

            group_id = chatPadData.group_id;
            console.log(`Group group_id: ${group_id}`);
            endpoint = `/api/group/${group_id}`;
        } else {
            console.log("Handling personal profile update...");
            const userData = JSON.parse(localStorage.getItem("userData"));
            console.log("Retrieved userData:", userData);

            if (!userData || !userData.id) {
                console.error("Invalid or missing userData for personal profile.");
                return;
            }

            const { id: user_id } = userData;
            console.log(`User ID: ${user_id}`);
            endpoint = `/api/user/${user_id}`;
        }

        try {
            console.log(`Sending file to endpoint: ${endpoint}`);
            const response = await fetch(endpoint, {
                method: "PUT",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Failed to upload ${fieldName}: ${response.statusText}`);
            }

            const result = await response.json();
            console.log(`${fieldName} updated successfully:`, result);

            alert(`${fieldName === "profile_image" ? "Background" : "Profile"} updated successfully!`);

            // Update the UI structure and re-render the profile page
            if (isGroup) {
                console.log("Updating group profile UI...");

                try {
                    const updatedGroupData = await fetch(`/api/group/${group_id}`);
                    if (!updatedGroupData.ok) {
                        throw new Error(`Failed to fetch group data. Status: ${updatedGroupData.status}`);
                    }
                    const groupResult = await updatedGroupData.json();
                    console.log("Fetched updated group data:", groupResult);

                    localStorage.setItem("group_profile_page", JSON.stringify(groupResult.group_chat));

                } catch (fetchError) {
                    console.error("Error fetching updated group data:", fetchError);
                }

                console.log("Re-rendering group profile...");
                render_group_profile(group_id);
            } else {
                console.log("Updating personal profile UI...");
                await ui_structure.update_personal_profile_data();
                console.log("Re-rendering personal profile...");
                render_personal_profile();
            }
        } catch (error) {
            console.error(`Error uploading ${fieldName}:`, error);
            alert(`Failed to update ${fieldName}. Please try again.`);
        }
    };

    fileInput.click();
}
