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
    step_navigation("start");
}

function render_big_screen_view() {
    console.log("calling render_big_screen_view");
    step_navigation("start");
}



function get_country(){
    let userCountry = new Intl.DateTimeFormat('en', { timeZoneName: 'long' }).resolvedOptions().timeZone;
    console.log("User Time Zone:", userCountry);
    return userCountry;
}



function get_my_chats() {
    console.log("calling get_my_chats");

    let registerData = localStorage.getItem('register_data');

    if (!registerData) {
        console.warn("No register_data found in localStorage.");
        return [];
    }

    try {
        let parsedData = JSON.parse(registerData);
        let user_id = parsedData.data.id;

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
            notification_badge: "" // No unread count in API response
        }));

    } catch (error) {
        console.error("Error fetching chats:", error);
        return [];
    }
}




function get_my_contacts() {
    console.log("Fetching contacts...");

    let registerData = localStorage.getItem("register_data");
    if (!registerData) {
        console.warn("No register_data found in localStorage.");
        return [];
    }

    try {
        let parsedData = JSON.parse(registerData);
        let user_id = parsedData.data.id;

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
            status: "online" // Default status
        }));

    } catch (error) {
        console.error("Error fetching contacts:", error);
        return [];
    }
}




function setupPWAInstallButton(installButton) {
    let deferredPrompt; // Store install event for later use

    window.addEventListener("beforeinstallprompt", (event) => {
        event.preventDefault(); // Prevent automatic prompt
        deferredPrompt = event;

        console.log("PWA Install Prompt Available");
        installButton.style.display = "block"; // Show the install button

        installButton.addEventListener("click", () => {
            deferredPrompt.prompt(); // Show install prompt

            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === "accepted") {
                    console.log("User accepted PWA install");
                } else {
                    console.log("User dismissed PWA install");
                }
                installButton.style.display = "none"; // Hide after install
            });
        });
    });
}



// Function to encode data
function encodeData(data) {
    return JSON.stringify(data);
}

// Function to decode data
function decodeData(data) {
    return JSON.parse(data);
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


function init_test_user(){
    console.log('calling init_test_user');
    let user_map = {
        "id":1,
        "username": "otieno",
        "email": "otienot75@gmail.com",
        "otp_secret": "",
        "wall_image_url": "test_media/background_one.jpeg",
        "profile_image_url": "test_media/otieno.jpeg"
    }

    localStorage.setItem('register_data',encodeData({"data":user_map}))
}


// 🚀 Initialize App on Load
document.addEventListener("DOMContentLoaded", () => {
    console.log("App Loaded");
    set_display();
    window.addEventListener("resize", set_display);
});