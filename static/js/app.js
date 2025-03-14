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
    render_start_interface();
}

function render_big_screen_view() {
    console.log("calling render_big_screen_view");
    render_start_interface();
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
          item_list: [{ item_type: "button", item_label: "Proceed", action: "render_verify_identity_1" }] 
        }
    ]
};

let verify_identity_1_ui_structure = {
    top_section: [
        { visible: true, component_type: "icon_label", icon: "fa-solid fa-arrow-left", label: "Back", position: "left", action: "render_start_interface" },
        { visible: true, component_type: "text", label: "Enter Details", position: "center" },
        { visible: false, component_type: "icon_label", icon: "fa-solid fa-plus", label: "Add", position: "right" }
    ],
    middle_section: [
        { 
            visible: true, 
            component_type: "input_field", 
            label: "Your Phone", 
            country: "Kenya", 
            placeholder: "Your phone number"
        }
    ],
    bottom_section: [
        { visible: true, component_type: "button_stack", 
          item_list: [{ item_type: "button", item_label: "Proceed", action: "render_verify_identity_2" }] 
        }
    ]
};

let verify_identity_2_ui_structure = {
    top_section: [
        { visible: true, component_type: "icon_label", icon: "fa-solid fa-arrow-left", label: "Back", position: "left", action: "render_verify_identity_1" },
        { visible: true, component_type: "text", label: "Enter Confirmation Code", position: "center" },
        { visible: false, component_type: "icon_label", icon: "fa-solid fa-plus", label: "Add", position: "right" }
    ],
    middle_section: [
        { 
            visible: true, 
            component_type: "input_field", 
            label: "Confirmation Code", 
            placeholder: "Enter the code sent to your phone"
        }
    ],
    bottom_section: [
        { visible: true, component_type: "button_stack", 
          item_list: [{ item_type: "button", item_label: "Confirm", action: "render_chat_listing" }] 
        }
    ]
};

let chat_listing_ui_structure = {
    top_section: [  
        { visible: false, component_type: "icon_label", icon: "fa-solid fa-arrow-left", label: "back", position: "left" },
        { visible: true, component_type: "text", label: "Chats", position: "center" },
        { visible: true, component_type: "icon_label", icon: "fa-solid fa-pen-to-square", label: "add", position: "right" }
    ],

    middle_section: [
        {
            visible: true,
            component_type: "list_pad",
            item_list: [
                { item_type: "list_item_search", placeholder: "search for members or users" },
                { item_type: "list_item_wallet", label: "Wallet", balance: "$100.00", notification_badge: "3" },
                { item_type: "list_item_chat", label: "Chat 1", last_message: "Hello, how are you?", notification_badge: "1" },
                { item_type: "list_item_chat", label: "Chat 2", last_message: "Let's meet tomorrow.", notification_badge: "2" },
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

let contact_listing_ui_structure = {
    top_section: [  
        { visible: false, component_type: "icon_label", icon: "fa-solid fa-arrow-left", label: "back", position: "left" },
        { visible: true, component_type: "text", label: "Contacts", position: "center" },
        { visible: true, component_type: "icon_label", icon: "fa-solid fa-pen-to-square", label: "add", position: "right" }
    ],

    middle_section: [
        {
            visible: true,
            component_type: "list_pad",
            item_list: [
                { item_type: "list_item_search", placeholder: "search for members or users" },
                { item_type: "list_item_contact", label: "Contact 1", status: "online" },
                { item_type: "list_item_contact", label: "Contact 2", status: "last seen recently" },
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
                title_content.innerHTML = `<h3>${item.label}</h3>`;
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

                        case "profile_info":
                            listItemElement.classList.add("profile_info_container");
                            listItem.item_list.forEach(profileItem => {
                                if (profileItem.item_type === "profile_image") {
                                    listItemElement.innerHTML += `
                                        <div class="profile_image_container">
                                            <img src="${profileItem.src}" class="profile_image" />
                                        </div>
                                    `;
                                } else if (profileItem.item_type === "profile_details") {
                                    listItemElement.innerHTML += `
                                        <div class="profile_details_container">
                                            <div class="profile_username">${profileItem.username}</div>
                                            <div class="profile_wallet_address">${profileItem.wallet_address}</div>
                                        </div>
                                    `;
                                }
                            });
                            break;

                        case "button_container":
                            listItemElement.classList.add("button_container");
                            listItem.item_list.forEach(buttonItem => {
                                listItemElement.innerHTML += `
                                    <div class="button_item_container">
                                        <button class="${buttonItem.class}">${buttonItem.item_label}</button>
                                    </div>
                                `;
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
                button.setAttribute("onclick", `${btn.action}()`);

                buttonContainer.appendChild(button);
            });

            section.appendChild(buttonContainer);
        } else if (item.visible && item.component_type === "button") {
            let button = document.createElement("button");
            button.innerHTML = item.label;
            button.classList.add("button_item");
            button.setAttribute("onclick", `${item.action}()`);

            section.appendChild(button);
        }
    });

    return section;
}

// 🎨 Render Start Interface
function render_start_interface() {
    console.log("calling render_start_interface");

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

    // Create middle section and insert the install button
    let middleSection = create_middle_section(start_ui_structure.middle_section);
    centerContainer.appendChild(middleSection);
    centerContainer.appendChild(create_bottom_section(start_ui_structure.bottom_section));

    console.log("now adding the download button");
    let buttonContainer = document.getElementsByClassName("button_stack")[0]; // Get first matching element

    let install_btn = document.createElement("button");
    install_btn.innerHTML = `Download`;
    install_btn.classList.add("button_item");
    buttonContainer.appendChild(install_btn);

    setupPWAInstallButton(install_btn);
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
}


// 🚀 Initialize App on Load
document.addEventListener("DOMContentLoaded", () => {
    console.log("App Loaded");
    set_display();
    window.addEventListener("resize", set_display);
});