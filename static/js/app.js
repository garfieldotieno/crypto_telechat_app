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

// 🎯 Object-Based UI Structure (Renamed to start_ui_structure)
let start_ui_structure = {
    top_section: [
        { visible: false, component_type: "icon_label", icon: "fa-solid fa-arrow-left", label: "back", position: "left" },
        { visible: true, component_type: "text", label: "Welcome", position: "center" },
        { visible: false, component_type: "icon_label", icon: "fa-solid fa-plus", label: "add", position: "right" }
    ],
    middle_section: [
        { visible: true, component_type: "background_image", img_src: "static/images/SplashScreen.png" }
    ],
    bottom_section: [
        { visible: true, component_type: "button_stack", 
          item_list: [{ item_type: "button", item_label: "Proceed", action: "step_navigation('verify_identity_1')" }] 
        }
    ]
};

let verify_identity_1_ui_structure = {
    top_section: [
        { visible: true, component_type: "icon_label", icon: "fa-solid fa-arrow-left", label: "Back", position: "left", action: "step_navigation('start')" },
        { visible: true, component_type: "text", label: "Enter Details", position: "center" },
        { visible: false, component_type: "icon_label", icon: "fa-solid fa-plus", label: "Add", position: "right" }
    ],
    middle_section: [
        { 
            visible: true, 
            component_type: "input_field", 
            label: "Your Email", 
            country: get_country(), 
            placeholder: "Your email address"
        }
    ],
    bottom_section: [
        { visible: true, component_type: "button_stack", 
          item_list: [{ item_type: "button", item_label: "Proceed", action: "step_navigation('verify_identity_2')" }] 
        }
    ]
};

function get_country(){
    let userCountry = new Intl.DateTimeFormat('en', { timeZoneName: 'long' }).resolvedOptions().timeZone;
    console.log("User Time Zone:", userCountry);
    return userCountry;
}


let verify_identity_2_ui_structure = {
    top_section: [
        { visible: true, component_type: "icon_label", icon: "fa-solid fa-arrow-left", label: "Back", position: "left", action: "step_navigation('verify_identity_1')" },
        { visible: true, component_type: "text", label: "Enter Confirmation Code", position: "center" },
        { visible: false, component_type: "icon_label", icon: "fa-solid fa-plus", label: "Add", position: "right" }
    ],
    middle_section: [
        { 
            visible: true, 
            component_type: "input_field", 
            label: "Confirmation Code", 
            placeholder: "Enter the code sent to your email"
        }
    ],
    bottom_section: [
        { visible: true, component_type: "button_stack", 
          item_list: [{ item_type: "button", item_label: "Confirm", action: "step_navigation('chat_listing')" }] 
        }
    ]
};






let chat_listing_ui_structure = {
    top_section: [
        { visible: false, component_type: "icon_label", icon: "fa-regular fa-arrow-left", label: "Edit", position: "left" },
        { visible: true, component_type: "text", label: "Chats", position: "center" },
        { visible: true, component_type: "icon_label", icon: "fa-regular fa-pen-to-square", label: "Add", position: "right" }
    ],

    middle_section: [
        {
            visible: true,
            component_type: "list_pad",
            item_list: [
                { item_type: "list_item_search", placeholder: "Search for chats" },
                ...get_my_chats(), // Function is called here to dynamically fetch chat data
                { item_type: "navbar", item_list: [
                    { item_type: "navbar_item", icon: "fa-solid fa-comments", label: "Chats" },
                    { item_type: "navbar_item", icon: "fa-solid fa-user", label: "Profile" },
                    { item_type: "navbar_item", icon: "fa-solid fa-address-book", label: "Contacts" }
                ]}
            ]
        }
    ],

    bottom_section: []
};






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

let contact_listing_ui_structure = {
    top_section: [  
        { visible: false, component_type: "icon_label", icon: "fa-regular fa-arrow-left", label: "back", position: "left" },
        { visible: true, component_type: "text", label: "Contacts", position: "center" },
        { visible: true, component_type: "icon_label", icon: "fa-regular fa-pen-to-square", label: "add", position: "right" }
    ],

    middle_section: [
        {
            visible: true,
            component_type: "list_pad",
            item_list: [
                { item_type: "list_item_search", placeholder: "search for members or users" },
                ...get_my_contacts(), // ✅ Function is called inside `item_list`
                { item_type: "navbar", item_list: [
                    { item_type: "navbar_item", icon: "fa-solid fa-comments", label: "Chats" },
                    { item_type: "navbar_item", icon: "fa-solid fa-user", label: "Profile" },
                    { item_type: "navbar_item", icon: "fa-solid fa-address-book", label: "Contacts" }
                ]}
            ]
        }
    ],

    bottom_section: []
};





let personal_profile_ui_structure = {
    top_section: [
        { visible: true, component_type: "icon_label", icon: "", label: "Cancel", position: "left", action: "render_chat_listing" },
        { visible: true, component_type: "text", label: "Profile", position: "center" },
        { visible: false, component_type: "icon_label", icon: "", label: "", position: "right" }
    ],

    middle_section: [
        {
            visible: true,
            component_type: "profile_info",
            item_list: [
                { item_type: "profile_image", src: "path/to/profile_image.jpg" },
                { item_type: "profile_details", username: "Username", wallet_address: "Wallet Address" }
            ]
        },
        {
            visible: true,
            component_type: "button_container",
            item_list: [
                { item_type: "button", item_label: "App Lock", class: "button_item" },
                { item_type: "button", item_label: "Wallet", class: "button_item" }
            ]
        }
    ],

    bottom_section: []
};

// 🛠️ Function to Create Top Section
function create_top_section(items) {
    let section = document.createElement("div");
    section.classList.add("top_section");

    let content_container = document.createElement("div");
    content_container.classList.add("content_container");

    let left_content = document.createElement("div");
    left_content.classList.add("left_content");

    let center_content = document.createElement("div");
    center_content.classList.add("center_content");

    let title_content = document.createElement("div");
    title_content.classList.add("title_content");

    let right_content = document.createElement("div");
    right_content.classList.add("right_content");

    items.forEach(item => {
        if (item.visible) {
            if (item.component_type === "icon_label") {
                let iconHTML = `<span class="content_holder"> ${item.label} </span>`;

                if (item.position === "left") {
                    left_content.innerHTML = iconHTML;
                    
                    // Add Back Navigation Logic (Except for Start Interface)
                    if (item.action) {
                        left_content.classList.add("clickable");
                        left_content.setAttribute("hx-get", `#`);
                        left_content.setAttribute("onclick", `${item.action}()`);
                    }
                } else if (item.position === "right") {
                    let iconHTML2 = `<span class="content_holder"> <i class="${item.icon}"></i> </span>`;
                    right_content.innerHTML = iconHTML2;
                }
            } else if (item.component_type === "text") {
                title_content.innerHTML = `<h3 class="top_title">${item.label}</h3>`;
            }
        }
    });

    center_content.appendChild(title_content);

    content_container.appendChild(left_content);
    content_container.appendChild(center_content);
    content_container.appendChild(right_content);

    section.appendChild(content_container);

    return section;
}

// 🛠️ Function to Create Middle Section
function create_middle_section(items) {
    let section = document.createElement("div");
    section.classList.add("middle_section");

    items.forEach(item => {
        if (!item.visible) return; // Skip hidden elements

        let element = document.createElement("div");

        switch (item.component_type) {
            case "background_image":
                element.classList.add("image_wrapper");
                element.innerHTML = `<img src="${item.img_src}" class="background_image" />`;
                break;

            case "input_field":
                element.classList.add("input_container");
                element.innerHTML = `
                    <h3>${item.label}</h3>
                    <p>${item.country || ''}</p>
                    <input type="text" placeholder="${item.placeholder}" class="input_field" />
                `;
                break;
            
            case "profile_info":
                console.log('reached rendering profile_info component, should be inside list_pad_container');

                element.classList.add("profile_info_container");
                item.item_list.forEach(profileItem => {
                    if (profileItem.item_type === "profile_image") {
                        element.innerHTML += `
                            <div class="profile_image_container">
                                <img src="${profileItem.src}" class="profile_image" />
                            </div>
                        `;
                    } else if (profileItem.item_type === "profile_details") {
                        element.innerHTML += `
                            <div class="profile_details_container">
                                <div class="profile_username">${profileItem.username}</div>
                                <div class="profile_wallet_address">${profileItem.wallet_address}</div>
                            </div>
                        `;
                    }
                });
                break;
    
            case "button_container":
                console.log('reached rendering button_container component, should be inside the list_pad_container');

                element.classList.add("button_container");
                item.item_list.forEach(buttonItem => {
                    element.innerHTML += `
                        <div class="button_item_container">
                            <button class="${buttonItem.class}">${buttonItem.item_label}</button>
                        </div>
                    `;
                });
                break;

            case "list_pad":
                element.classList.add("list_pad_container");
                item.item_list.forEach(listItem => {
                    let listItemElement = document.createElement("div");
                    listItemElement.classList.add(listItem.item_type);

                    switch (listItem.item_type) {
                        case "list_item_search":
                            listItemElement.innerHTML = `
                                <div class="search_container">
                                    <input type="text" placeholder="${listItem.placeholder}" class="search_input" />
                                </div>
                            `;
                            break;

                        case "list_item_wallet":
                            listItemElement.innerHTML = `
                                <div class="list_item_container">
                                    <div class="list_item_image"></div>
                                    <div class="list_item_content">
                                        <div class="list_item_title">${listItem.label}</div>
                                        <p class="list_item_message">${listItem.balance}
                                    </div>
                                    <div class="notification_badge">${listItem.notification_badge}</div>
                                </div>
                            `
                            
                            listItemElement.setAttribute("onclick", "render_wallet_interface()");

                        case "list_item_chat":
                            listItemElement.innerHTML = `
                                <div class="list_item_container">
                                    <div class="list_item_image"></div>
                                    <div class="list_item_content">
                                        <div class="list_item_title">${listItem.label}</div>
                                        <p class="list_item_message">${listItem.last_message || listItem.balance}</p>
                                    </div>
                                    <div class="notification_badge">${listItem.notification_badge}</div>
                                </div>
                            `;

                            
                            listItemElement.setAttribute("onclick", "render_chat_interface()");
                            break;

                        case "list_item_contact":
                            listItemElement.innerHTML = `
                                <div class="list_item_container">
                                    <div class="list_item_image"></div>
                                    <div class="list_item_content">
                                        <div class="list_item_title">${listItem.label}</div>
                                        <p class="list_item_message" style="color: ${listItem.status === 'online' ? '#037EE5' : '#666'};">${listItem.status}</p>
                                    </div>
                                </div>
                            `;
                            
                            listItemElement.setAttribute("onclick", "render_other_interface()");
                            break;

                        case "navbar":
                            listItemElement.classList.add("navbar_container");
                            listItem.item_list.forEach(navItem => {
                                let navItemElement = document.createElement("div");
                                navItemElement.classList.add("navbar_item");
                                navItemElement.innerHTML = `
                                    <i class="${navItem.icon}"></i>
                                    <span>${navItem.label}</span>
                                `;
                                // Add htmx attributes for navigation
                                if (navItem.label === "Chats") {
                                    navItemElement.setAttribute("hx-get", "#");
                                    navItemElement.setAttribute("onclick", "render_chat_listing()");
                                } else if (navItem.label === "Profile") {
                                    navItemElement.setAttribute("hx-get", "#");
                                    navItemElement.setAttribute("onclick", "render_personal_profile()");
                                } else if (navItem.label === "Contacts") {
                                    navItemElement.setAttribute("hx-get", "#");
                                    navItemElement.setAttribute("onclick", "render_contact_listing()");
                                }
                                listItemElement.appendChild(navItemElement);
                            });
                            break;

                        
                        default:
                            console.warn(`Unknown list item type: ${listItem.item_type}`);
                    }

                    element.appendChild(listItemElement);
                });
                break;
            
            

            default:
                console.warn(`Unknown component_type: ${item.component_type}`);
        }

        section.appendChild(element);
    });

    return section;
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

// 🛠️ Function to Create Bottom Section
function create_bottom_section(items) {
    let section = document.createElement("div");
    section.classList.add("bottom_section");

    items.forEach(item => {
        if (item.visible && item.component_type === "button_stack") {
            let buttonContainer = document.createElement("div");
            buttonContainer.classList.add("button_stack");

            item.item_list.forEach(btn => {
                let button = document.createElement("button");
                button.innerHTML = btn.item_label;
                button.classList.add("button_item");
                button.setAttribute("onclick", btn.action);

                buttonContainer.appendChild(button);
            });

            section.appendChild(buttonContainer);
        } else if (item.visible && item.component_type === "button") {
            let button = document.createElement("button");
            button.innerHTML = item.label;
            button.classList.add("button_item");
            button.setAttribute("onclick", item.action);

            section.appendChild(button);
        }
    });

    return section;
}

function step_navigation(step) {
    console.log(`calling step_navigation, for step : ${step}`);

    // Check if localStorage is supported
    if (typeof(Storage) !== "undefined") {
        // Initialize localStorage during the "start" step
        if (step === "start") {
            if (!localStorage.getItem("appData")) {
                const appData = {
                    current_step:"start",
                    start_data: {input: null},
                    verify_identity_1_data: {},
                    verify_identity_2_data: {},
                    registered_state: false,
                    chat_listing_data: {},
                    contact_listing_data: {},
                    personal_profile_data: {},
                };
                localStorage.setItem("appData", encodeData(appData));
            }
        }

        // Update current_step in localStorage
        const appData = decodeData(localStorage.getItem("appData"));
        appData.current_step = step;
        localStorage.setItem("appData", encodeData(appData));
    } else {
        console.warn("LocalStorage is not supported by this browser.");
    }

    switch (step) {
        case "start":
            render_start_interface();
            break;

        case "verify_identity_1":
            console.log("calling verify_identity_1");

            const curr_app_data = decodeData(localStorage.getItem("appData"));
            console.log("current app data is: ", curr_app_data);
            curr_app_data.current_step = "verify_identity_1";
            localStorage.setItem("appData", encodeData(curr_app_data));

            render_verify_identity_1();
            break;
        case "verify_identity_2":
            console.log("calling verify_identity_2");

            const appData2 = decodeData(localStorage.getItem("appData"));
            // Store the input value from the input element with class .input_field
            const inputField = document.querySelector(".input_field");
            if (inputField) {
                val = inputField.value;
                console.log(`email data is : ${val}`);
                appData2.verify_identity_1_data = {input:val};
                localStorage.setItem("appData", encodeData(appData2));
            }

            render_verify_identity_2();
            break;
        case "chat_listing":
            console.log("calling chat_listing");

            // Update registered_state to true
            const appData3 = decodeData(localStorage.getItem("appData"));
            
            // Generate a unique username
            const uniqueUsername = generateUniqueString();

            // Store the input value from the input element with class .input_field
            const inputField2 = document.querySelector(".input_field");
            if (inputField2) {
                let val = inputField2.value;
                console.log("val for email otp code is :", val);
                appData3.verify_identity_2_data = {input: val};
                appData3.registered_state = true;

                console.log(`\ndata found in localStorage is : ${appData3.verify_identity_1_data.input}`);
                console.log(`data found in localStorage is : ${appData3.verify_identity_2_data.input}`);
                console.log(`data found in localStorage is : ${appData3.registered_state}\n`);

                // Using fetch API, we get appData attributes: verify_identity_1_data, verify_identity_2_data
                // Hit endpoint /api/user where form data username, email, otp_secret
                // Store the response in localStorage
                fetch('http://localhost:5000/api/user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: uniqueUsername,
                        email: appData3.verify_identity_1_data.input,
                        otp_secret: appData3.verify_identity_2_data.input
                    }),
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Successful user registration:', data);
                    // Store the data in localStorage
                    localStorage.setItem("register_data", encodeData(data));
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            }

            localStorage.setItem("appData", encodeData(appData3));
            render_chat_listing();
            break;
        case "contact_listing":
            render_contact_listing();
            break;
        case "personal_profile":
            render_personal_profile();
            break;
        default:
            console.warn(`Unknown step: ${step}`);
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

// 🎨 Render Start Interface
function render_start_interface() {
    console.log("calling render_start_interface");

    const appData = decodeData(localStorage.getItem("appData"));
    if (appData && appData.registered_state) {
        render_chat_listing();
        return;
    }

    document.body.innerHTML = "";

    let containerClass = window.innerWidth < 777 ? "app_container_small" : "app_container_big";
    let centerContainerClass = window.innerWidth < 777 ? "app_center_container_small" : "app_center_container_big";

    let container = document.createElement("div");
    container.classList.add(containerClass);
    document.body.appendChild(container);

    let centerContainer = document.createElement("div");
    centerContainer.classList.add(centerContainerClass);
    container.appendChild(centerContainer);

    // Conditionally render the top section based on the visible property
    if (start_ui_structure.top_section.some(item => item.visible)) {
        centerContainer.appendChild(create_top_section(start_ui_structure.top_section));
    }

    // Create middle section
    let middleSection = create_middle_section(start_ui_structure.middle_section);
    centerContainer.appendChild(middleSection);
    centerContainer.appendChild(create_bottom_section(start_ui_structure.bottom_section));

    // Check if the app is already installed
    window.addEventListener('appinstalled', (event) => {
        console.log('PWA was installed');
        // Remove the install button if the app is already installed
        let installButton = document.getElementById('install_button');
        if (installButton) {
            installButton.remove();
        }
    });

    // Create and insert the install button if the app is not installed
    if (!window.matchMedia('(display-mode: standalone)').matches) {
        console.log("now adding the download button");
        let buttonContainer = document.getElementsByClassName("button_stack")[0]; // Get first matching element

        let install_btn = document.createElement("button");
        install_btn.id = 'install_button';
        install_btn.innerHTML = `Install`;
        install_btn.classList.add("button_item");
        install_btn.style.marginTop = "10px";

        buttonContainer.appendChild(install_btn);

        setupPWAInstallButton(install_btn);
    }
}

function render_verify_identity_1() {
    console.log("calling render_verify_identity_1");

    document.body.innerHTML = ""; // Clear previous content

    let containerClass = window.innerWidth < 777 ? "app_container_small" : "app_container_big";
    let centerContainerClass = window.innerWidth < 777 ? "app_center_container_small" : "app_center_container_big";

    let container = document.createElement("div");
    container.classList.add(containerClass);
    document.body.appendChild(container);

    let centerContainer = document.createElement("div");
    centerContainer.classList.add(centerContainerClass);
    container.appendChild(centerContainer);

    // Build the UI sections dynamically
    centerContainer.appendChild(create_top_section(verify_identity_1_ui_structure.top_section));
    centerContainer.appendChild(create_middle_section(verify_identity_1_ui_structure.middle_section));
    centerContainer.appendChild(create_bottom_section(verify_identity_1_ui_structure.bottom_section));
}

function render_verify_identity_2() {
    console.log("calling render_verify_identity_2");

    document.body.innerHTML = ""; // Clear previous content

    let containerClass = window.innerWidth < 777 ? "app_container_small" : "app_container_big";
    let centerContainerClass = window.innerWidth < 777 ? "app_center_container_small" : "app_center_container_big";

    let container = document.createElement("div");
    container.classList.add(containerClass);
    document.body.appendChild(container);

    let centerContainer = document.createElement("div");
    centerContainer.classList.add(centerContainerClass);
    container.appendChild(centerContainer);

    // Build the UI sections dynamically
    centerContainer.appendChild(create_top_section(verify_identity_2_ui_structure.top_section));
    centerContainer.appendChild(create_middle_section(verify_identity_2_ui_structure.middle_section));
    centerContainer.appendChild(create_bottom_section(verify_identity_2_ui_structure.bottom_section));
}



function render_chat_listing() {
    console.log("calling render_chat_listing");

    document.body.innerHTML = ""; // Clear previous content

    let containerClass = window.innerWidth < 777 ? "app_container_small" : "app_container_big";
    let centerContainerClass = window.innerWidth < 777 ? "app_center_container_small" : "app_center_container_big";

    let container = document.createElement("div");
    container.classList.add(containerClass);
    document.body.appendChild(container);

    let centerContainer = document.createElement("div");
    centerContainer.classList.add(centerContainerClass);
    container.appendChild(centerContainer);

    // Build the UI sections dynamically
    centerContainer.appendChild(create_top_section(chat_listing_ui_structure.top_section));
    centerContainer.appendChild(create_middle_section(chat_listing_ui_structure.middle_section));
    centerContainer.appendChild(create_bottom_section(chat_listing_ui_structure.bottom_section));

    // Check if the app is already installed
    window.addEventListener('appinstalled', (event) => {
        console.log('PWA was installed');
        // Remove the install button if the app is already installed
        let installButton = document.getElementById('install_button');
        if (installButton) {
            installButton.remove();
        }
    });

    // Create and insert the install button if the app is not installed
    if (!window.matchMedia('(display-mode: standalone)').matches) {
        console.log("now adding the download button");
        let buttonContainer = document.createElement("div");
        buttonContainer.classList.add("button_stack");
        centerContainer.appendChild(buttonContainer);

        let install_btn = document.createElement("button");
        install_btn.id = 'install_button';
        install_btn.innerHTML = `Install`;
        install_btn.classList.add("button_item");

        // can we app margin of 10px below
        install_btn.style.marginTop = "10px";

        buttonContainer.appendChild(install_btn);

        setupPWAInstallButton(install_btn);
    }
}

function render_contact_listing() {
    console.log("calling render_contact_listing");

    document.body.innerHTML = ""; // Clear previous content

    let containerClass = window.innerWidth < 777 ? "app_container_small" : "app_container_big";
    let centerContainerClass = window.innerWidth < 777 ? "app_center_container_small" : "app_center_container_big";

    let container = document.createElement("div");
    container.classList.add(containerClass);
    document.body.appendChild(container);

    let centerContainer = document.createElement("div");
    centerContainer.classList.add(centerContainerClass);
    container.appendChild(centerContainer);

    // Build the UI sections dynamically
    centerContainer.appendChild(create_top_section(contact_listing_ui_structure.top_section));
    centerContainer.appendChild(create_middle_section(contact_listing_ui_structure.middle_section));
    centerContainer.appendChild(create_bottom_section(contact_listing_ui_structure.bottom_section));

    // Check if the app is already installed
    window.addEventListener('appinstalled', (event) => {
        console.log('PWA was installed');
        // Remove the install button if the app is already installed
        let installButton = document.getElementById('install_button');
        if (installButton) {
            installButton.remove();
        }
    });

    // Create and insert the install button if the app is not installed
    if (!window.matchMedia('(display-mode: standalone)').matches) {
        console.log("now adding the download button");
        let buttonContainer = document.createElement("div");
        buttonContainer.classList.add("button_stack");
        centerContainer.appendChild(buttonContainer);

        let install_btn = document.createElement("button");
        install_btn.id = 'install_button';
        install_btn.innerHTML = `Install`;
        install_btn.classList.add("button_item");

        // can we app margin of 10px below
        install_btn.style.marginTop = "10px";

        buttonContainer.appendChild(install_btn);

        setupPWAInstallButton(install_btn);
    }
}

function render_personal_profile() {
    console.log("calling render_personal_profile");

    document.body.innerHTML = ""; // Clear previous content

    let containerClass = window.innerWidth < 777 ? "app_container_small" : "app_container_big";
    let centerContainerClass = window.innerWidth < 777 ? "app_center_container_small" : "app_center_container_big";

    let container = document.createElement("div");
    container.classList.add(containerClass);
    document.body.appendChild(container);

    let centerContainer = document.createElement("div");
    centerContainer.classList.add(centerContainerClass);
    container.appendChild(centerContainer);

    // Build the UI sections dynamically
    centerContainer.appendChild(create_top_section(personal_profile_ui_structure.top_section));
    centerContainer.appendChild(create_middle_section(personal_profile_ui_structure.middle_section));
    centerContainer.appendChild(create_bottom_section(personal_profile_ui_structure.bottom_section));

    // Check if the app is already installed
    window.addEventListener('appinstalled', (event) => {
        console.log('PWA was installed');
        // Remove the install button if the app is already installed
        let installButton = document.getElementById('install_button');
        if (installButton) {
            installButton.remove();
        }
    });

    // Create and insert the install button if the app is not installed
    if (!window.matchMedia('(display-mode: standalone)').matches) {
        console.log("now adding the download button");
        let buttonContainer = document.createElement("div");
        buttonContainer.classList.add("button_stack");
        centerContainer.appendChild(buttonContainer);

        let install_btn = document.createElement("button");
        install_btn.id = 'install_button';
        install_btn.innerHTML = `Install`;
        install_btn.classList.add("button_item");

        // can we app margin of 10px below
        install_btn.style.marginTop = "10px";
        
        buttonContainer.appendChild(install_btn);

        setupPWAInstallButton(install_btn);
    }
}


function render_chat_interface(chat_type){
    console.log('calling render_chat_interface');
}

function render_wallet_interface(){
    console.log('calling render_wallet_interface');
}

function render_other_interface(){
    console.log("calling render_other_interface");
}


// 🚀 Initialize App on Load
document.addEventListener("DOMContentLoaded", () => {
    console.log("App Loaded");
    set_display();
    window.addEventListener("resize", set_display);
});