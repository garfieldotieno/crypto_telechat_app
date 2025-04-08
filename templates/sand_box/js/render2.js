console.log('now loading render2.js');

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

    let item_search = document.createElement('div');
    item_search.classList.add('list_item_search')

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
                    right_content.classList.add("clickable");
                    right_content.setAttribute("hx-get", `#`);
                    right_content.setAttribute("onclick", `${item.action}()`);
                }
            } else if (item.component_type === "text") {
                title_content.innerHTML = `<h3 class="top_title">${item.label}</h3>`;
            } else if (item.component_type === "item_search") {
                
                item_search.innerHTML = `
                    <div class="search_container">
                        <input type="text" placeholder="${item.placeholder}" class="search_input" />
                    </div>
                `;
                
            }
        }

    });

    center_content.appendChild(title_content);

    content_container.appendChild(left_content);
    content_container.appendChild(center_content);
    content_container.appendChild(right_content);

    section.appendChild(content_container);
    section.appendChild(item_search)
    

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
                    <input type="text" placeholder="${item.placeholder}" class="input_field" id="${item.id}" />
                `;
                break;

            case "selection_input":
                element.classList.add("input_container");
                element.innerHTML = `
                    <h3>Select Chat Type</h3>
                    <select class="input_field" id="${item.id}">
                        <option value="">Select a chat type</option>
                        ${item.options.map(option => `<option value="${option}">${option}</option>`).join('')}
                    </select>
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
                            
                            listItemElement.setAttribute("onclick", "render_other_profile_interface()");
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

        } else if (item.visible && item.component_type === "navbar"){
            nav_container = document.createElement('div');
            nav_container.classList.add('navbar_container');
            item.item_list.forEach(navItem => {
                let navItemElement = document.createElement("div");
                navItemElement.classList.add('navbar_item');
                navItemElement.innerHTML = `
                    <i class="${navItem.icon}"></i>
                    <span>${navItem.label}</span>
                `
                // Add htmx attributes for navigation
                if (navItem.label === "Chats") {
                                    
                    navItemElement.setAttribute("onclick", "render_chat_listing()");
                } else if (navItem.label === "Profile") {
                    
                    navItemElement.setAttribute("onclick", "render_personal_profile()");
                } else if (navItem.label === "Contacts") {
                    
                    navItemElement.setAttribute("onclick", "render_contact_listing()");
                } else if (navItem.label === "Wallet") {
                    
                    navItemElement.setAttribute("onclick", "render_wallet_interface()");
                }
                nav_container.appendChild(navItemElement);
            });

            section.appendChild(nav_container);
        }

    });

    return section;
}


function render_wall_interface(page) {
    console.log(`calling render_wallet_interface : ${page}`);
    // Render specific content based on the page
    if (page === "start_page") {
        render_start();
    } else if (page === "wallet_start_page") {
        render_wallet_start();
    } else if (page === "wallet_about_page") {
        render_wallet_about();
    } else if (page === "personal_profile_page") {
        render_personal_profile();
    } else if (page === "other_profile_page") {
        render_other_profile();
    } else if (page === "group_profile_page") {
        render_group_profile();
    }
}

// Empty function definitions for the suite below each page
function render_start() {
    console.log("Rendering start welcome page...");

    // Clear previous content
    document.body.innerHTML = "";
    document.body.classList.add("start-screen");

    // Determine container classes based on screen size
    let containerClass = window.innerWidth < 777 ? "app_container_small" : "app_container_big";
    let centerContainerClass = window.innerWidth < 777 ? "app_center_container_small" : "app_center_container_big";

    // Create main container
    let container = document.createElement("div");
    container.classList.add(containerClass);
    document.body.appendChild(container);

    let centerContainer = document.createElement("div");
    centerContainer.classList.add(centerContainerClass);
    container.appendChild(centerContainer);

    // Parse UI structure for start page
    let uiStructure = ui_structure.top_section.start_page;

    // Build top section
    if (uiStructure && uiStructure.some(item => item.visible)) {
        centerContainer.appendChild(create_top_section(uiStructure));
    }

    // Build middle section for start page
    let middleSectionConfig = ui_structure.middle_section.start_page;
    if (middleSectionConfig && middleSectionConfig.some(item => item.visible)) {
        let middleSection = create_middle_section(middleSectionConfig);
        centerContainer.appendChild(middleSection);
    }

    // Build bottom section for start page
    let bottomSectionConfig = ui_structure.bottom_section.start_page;
    if (bottomSectionConfig && bottomSectionConfig.some(item => item.visible)) {
        let bottomSection = create_bottom_section(bottomSectionConfig);
        centerContainer.appendChild(bottomSection);
    }

    // Add PWA install button if applicable
    if (!window.matchMedia('(display-mode: standalone)').matches && 
        !window.navigator.standalone) {
        
        let buttonContainer = document.querySelector(".button_stack");
        if (!buttonContainer) {
            buttonContainer = document.createElement("div");
            buttonContainer.classList.add("button_stack");
            centerContainer.appendChild(buttonContainer);
        }
        
        let installBtn = document.createElement("button");
        installBtn.id = 'install_button';
        installBtn.innerHTML = `Install App`;
        installBtn.classList.add("button_item");
        installBtn.style.marginTop = "10px";
        
        buttonContainer.appendChild(installBtn);
        setupPWAInstallButton(installBtn);
    }

}


function render_wallet_start() {
    console.log("Rendering wallet start page...");
}

function render_wallet_about() {
    console.log("Rendering wallet about page...");
}

function render_personal_profile() {
    console.log("Rendering personal profile page...");
}

function render_other_profile() {
    console.log("Rendering other profile page...");
}

function render_group_profile() {
    console.log("Rendering group profile page...");
}


function render_resource_listing_interface(resource_page) {
    console.log(`calling render_resource_listing_interface : ${resource_page}`);
    // Render specific resource listings
    if (resource_page === "contact_page") {
        render_contact_listing(); // Listings for select and delete
    } else if (resource_page === "chat_page") {
        render_chat_listing(); // Listings for select and delete
    } else {
        console.error(`No configuration found for resource page: ${resource_page}`);
    }
}


// 🛠️ Function to Render Contact Listing
function render_contact_listing(mode) {
    console.log(`calling render_contact_listing with mode: ${mode}`);

    // Clear previous content
    document.body.innerHTML = "";

    // Determine container classes based on screen size
    let containerClass = window.innerWidth < 777 ? "app_container_small" : "app_container_big";
    let centerContainerClass = window.innerWidth < 777 ? "app_center_container_small" : "app_center_container_big";

    // Create main container
    let container = document.createElement("div");
    container.classList.add(containerClass);
    document.body.appendChild(container);

    let centerContainer = document.createElement("div");
    centerContainer.classList.add(centerContainerClass);
    container.appendChild(centerContainer);

    // Dynamically build the UI sections using ui_structure
    if (ui_structure) {
        // Top Section
        if (ui_structure.top_section.contact_page) {
            centerContainer.appendChild(create_top_section(ui_structure.top_section.contact_page));
        }

        // Middle Section
        if (ui_structure.middle_section.contact_page) {
            centerContainer.appendChild(create_middle_section(ui_structure.middle_section.contact_page));
        }

        // Handle different modes
        switch (mode) {

            case "delete":
                console.log("Mode: delete - Enabling delete functionality.");
                if (ui_structure.bottom_section.contact_page) {
                    centerContainer.appendChild(create_bottom_section(ui_structure.bottom_section.contact_page));
                }
                document.querySelectorAll(".list_item_contact").forEach(item => {
                    item.classList.add("deletable");
                    item.setAttribute("onclick", "deleteContact(this)");
                });
                break;

            case "select_one":
                console.log("Mode: select_one - Enabling single selection.");
                if (ui_structure.bottom_section.contact_page) {
                    centerContainer.appendChild(create_bottom_section(ui_structure.bottom_section.contact_page));
                }
                document.querySelectorAll(".list_item_contact").forEach(item => {
                    item.classList.add("selectable");
                    item.setAttribute("onclick", "selectContact(this, 'single')");
                });
                break;

            case "select_many":
                console.log("Mode: select_many - Enabling multiple selection.");
                if (ui_structure.bottom_section.contact_page) {
                    centerContainer.appendChild(create_bottom_section(ui_structure.bottom_section.contact_page));
                }
                document.querySelectorAll(".list_item_contact").forEach(item => {
                    item.classList.add("selectable");
                    item.setAttribute("onclick", "selectContact(this, 'multiple')");
                });
                break;

            case "normal":
                console.log("Mode: normal - Rendering bottom section as usual.");
                if (ui_structure.bottom_section.contact_page) {
                    centerContainer.appendChild(create_bottom_section(ui_structure.bottom_section.contact_page));
                }
                break;
        }
    } else {
        console.error("ui_structure is not defined or missing contact_page configuration.");
    }
}


// Function to handle deleting a contact
function deleteContact(element) {
    cosole.log('calling deleteContact');

    const contactId = element.getAttribute("data-contact-id"); // Assuming each contact has a unique ID
    console.log(`Deleting contact with ID: ${contactId}`);
    // Make an API call to delete the contact
    fetch(`${BASE_URL}/contacts/${contactId}`, { method: "DELETE" })
        .then(response => response.json())
        .then(data => {
            console.log("Contact deleted:", data);
            // Remove the contact from the UI
            element.remove();
        })
        .catch(error => console.error("Error deleting contact:", error));
}


// Function to handle selecting a single contact
function selectContact(element, mode) {
    console.log('calling selectContact');

    if (mode === "single") {
        // Deselect any previously selected contact
        document.querySelectorAll(".list_item_contact.selected").forEach(item => {
            item.classList.remove("selected");
        });
        // Select the clicked contact
        element.classList.add("selected");
        console.log(`Selected contact: ${element.getAttribute("data-contact-id")}`);

    } else if (mode === "multiple") {
        // Toggle the selected state of the clicked contact
        element.classList.toggle("selected");
        console.log(`Toggled selection for contact: ${element.getAttribute("data-contact-id")}`);
    }

}


function render_chat_listing() {
    console.log('calling render_chat_listing');
}


function render_dynamic_input_interface(input_page) {
    // Get the stack trace and extract the calling function two steps up
    const stack = new Error().stack;
    const stackLines = stack.split("\n");
    const callerTwoStepsUp = stackLines[3]?.trim() || "Unknown caller";

    console.log(`calling render_dynamic_input_interface : ${input_page}`);
    console.log(`Called by: ${callerTwoStepsUp}`);

    // Render specific input interfaces
    if (input_page === "create_contact") {
        render_create_contact();
    } else if (input_page === "create_chat") {
        render_create_chat(); // Handle single or group chat creation
    } else if (input_page === "create_personal_account_transaction") {
        render_create_personal_transaction();
    } else if (input_page === "create_group_account_transaction") {
        render_create_group_transaction();
    } else if (input_page === "create_user") {
        render_create_user(); // Handle user creation
    } else {
        console.error(`No configuration found for input page: ${input_page}`);
    }
}


function render_create_user() {
    console.log("Rendering create user interface...");

    // Clear previous content
    document.body.innerHTML = "";
    document.body.classList.remove("start-screen"); // Remove start screen class if present
    document.body.classList.add("create-user-screen"); // Add create user screen class

    // Determine container classes based on screen size
    let containerClass = window.innerWidth < 777 ? "app_container_small" : "app_container_big";
    let centerContainerClass = window.innerWidth < 777 ? "app_center_container_small" : "app_center_container_big";

    // Create main container
    let container = document.createElement("div");
    container.classList.add(containerClass);
    document.body.appendChild(container);

    let centerContainer = document.createElement("div");
    centerContainer.classList.add(centerContainerClass);
    container.appendChild(centerContainer);

    // Dynamically update the create_page configuration
    let createPageConfig = ui_structure.top_section.create_page.map(item => {
        if (item.label === "Back") {
            return { ...item, action: "render_start()" }; // Add action to the "Back" button
        }
        return item;
    });

    // Render the updated top_section for create_page
    if (createPageConfig && createPageConfig.some(item => item.visible)) {
        centerContainer.appendChild(create_top_section(createPageConfig));
    }

    // Middle Section: Use create_input_structure.create_user.inputs
    let middleSection = document.createElement("div");
    middleSection.classList.add("middle_section");
    centerContainer.appendChild(middleSection);

    let inputs = create_input_structure.create_user.inputs;
    let processors = create_input_structure.create_user.processors;

    let currentInputIndex = 0;

    // Function to render the current input
    function renderCurrentInput() {
        middleSection.innerHTML = ""; // Clear previous input
        let inputConfig = inputs[currentInputIndex];
        if (inputConfig && inputConfig.visible) {
            let inputContainer = document.createElement("div");
            inputContainer.classList.add("input_container");

            let inputField = document.createElement("input");
            inputField.type = "text";
            inputField.placeholder = inputConfig.placeholder;
            inputField.id = inputConfig.id;
            inputField.classList.add("input_field");

            inputContainer.appendChild(inputField);
            middleSection.appendChild(inputContainer);
            inputField.focus();
        }
    }

    // Bottom Section: Use ui_structure.bottom_section.create_page
    let bottomSectionConfig = ui_structure.bottom_section.create_page;
    if (bottomSectionConfig && bottomSectionConfig.some(item => item.visible)) {
        let bottomSection = create_bottom_section(bottomSectionConfig);
        centerContainer.appendChild(bottomSection);

        // Attach handlers to the buttons in the bottom section
        let proceedButton = bottomSection.querySelector(".button_item");
        if (proceedButton) {
            function attachProcessor() {
                proceedButton.onclick = () => {
                    let currentProcessor = processors[currentInputIndex];
                    if (currentProcessor) {
                        currentProcessor(() => {
                            // Move to the next input after the current processor completes
                            currentInputIndex++;
                            if (currentInputIndex < inputs.length) {
                                renderCurrentInput();
                                attachProcessor();
                            } else {
                                console.log("All inputs processed. Submitting...");
                            }
                        });
                    }
                };
            }

            // Initial rendering of the first input and attaching the processor
            renderCurrentInput();
            attachProcessor();
        }
    }
}


function render_create_contact() {
    console.log("Rendering create contact interface...");
}

function render_create_chat() {
    console.log("Rendering create chat interface...");
}

function render_create_personal_transaction() {
    console.log("Rendering create personal account transaction interface...");
}

function render_create_group_transaction() {
    console.log("Rendering create group account transaction interface...");
}

function render_dynamic_chat_message_interface(single){
    console.log(`calling render_dynamic_chat_message_interface of type : ${single}`);
}





