console.log('now loading navigation2.js');

function switch_navigation(page) {
    console.log(`calling switch_navigation with page: ${page}`);
}

function get_country() {
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

function init_user(data) {
    console.log('calling init_user with data:', data);

    // Check if required fields are present in the data
    if (!data || !data.id || !data.username || !data.email) {
        console.error("Invalid data provided to init_user. Required fields: id, username, email.");
        return;
    }

    // Use the provided data to initialize the user map
    let user_map = {
        registered_state: false,
        id: data.id,
        username: data.username,
        email: data.email,
        otp_secret: data.otp_secret || "",
        wall_image_url: data.wall_image_url || "test_media/background_one.jpeg",
        profile_image_url: data.profile_image_url || "test_media/otieno.jpeg"
    };

    // Retrieve existing userData from localStorage
    let app_data = decodeData(localStorage.getItem('userData')) || {};

    console.log("Existing app_data:", app_data);

    // Update userData with registered state
    app_data.registered_state = true;

    // Save updated userData to localStorage
    localStorage.setItem('userData', encodeData(app_data));

    
    console.log("Initialized register_data in localStorage:", user_map);
}

function verify_email(next) {
    console.log("Verifying email...");
    const email = document.getElementById("email_input").value; // Assuming there's an input field with id 'email'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        console.error("Invalid email format.");
        return;
    }

    if (email === "user1@example.com") {
        console.log("Test user detected.");
        init_user({
            registered_state: true,
            id: 1,
            username: "user1",
            email: "user1@example.com",
            otp_secret: "",
            wall_image_url: "test_media/background_one.jpeg",
            profile_image_url: "test_media/otieno.jpeg"
        });
    } else {
        // Extract username from email (everything before '@')
        const username = email.split("@")[0];

        // Initialize userData with default values
        const userData = {
            registered_state: false,
            username: username,
            email: email,
            otp_secret: "",
            wall_image_url: "",
            profile_image_url: ""
        };

        localStorage.setItem("userData", JSON.stringify(userData));
        console.log("Initialized userData in localStorage:", userData);
    }

    setTimeout(() => {
        console.log("Email verified.");
        next();
    }, 1000); // Simulate async verification
}

function verify_code(next) {
    console.log("Verifying code...");
    const code = document.getElementById("verification_code_input").value; // Assuming there's an input field with id 'verification_code_input'

    // Retrieve userData from localStorage
    const userData = JSON.parse(localStorage.getItem("userData")) || {};

    // Save the code to otp_secret
    userData.otp_secret = code;
    localStorage.setItem("userData", JSON.stringify(userData));
    console.log("Updated userData with otp_secret in localStorage:", userData);

    setTimeout(() => {
        console.log("Code verified. Submitting user data...");

        // Submit user data
        fetch("/api/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        })
            .then((response) => {
                if (response.status === 201) {
                    return response.json(); // Successful user creation
                } else if (response.status === 400) {
                    throw new Error("Invalid OTP");
                } else if (response.status === 500) {
                    throw new Error("Error creating user");
                } else {
                    throw new Error("Unexpected error occurred");
                }
            })
            .then((data) => {
                console.log("User data submitted successfully:", data);
                init_user(data.data); // Pass the response data to init_user
                render_resource_listing_interface('contact_page');
            })
            .catch((error) => {
                console.error(error.message);
                localStorage.removeItem("userData");
                console.log("Cleared userData from localStorage.");
                render_start(); // Assuming there's a function to render the start page
            });

        next();
    }, 1000); // Simulate async verification
}