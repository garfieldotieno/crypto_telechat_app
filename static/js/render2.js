console.log('now loading render2.js');

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

            case "profile_image":
                element.classList.add("profile_image_wrapper");
                element.innerHTML = `
                    <img src="${item.img_src}" class="profile_image" />
                `;
                break;

            case "profile_background_image":
                element.classList.add("profile_background_wrapper");
                element.innerHTML = `
                    <div class="profile_background_circle">
                        <img src="${item.img_src}" class="profile_background_image" />
                    </div>
                `;
                break;

            case "separation_title":
                element.classList.add("separation_title");
                element.innerHTML = `
                    <div class="separation_title_label">${item.label}</div>
                `;
                break;

            case "info_section":
                element.classList.add("info_section");
                element.innerHTML = `
                    <div class="info_content">${item.label}</div>
                `;
                break;

            case "label_item":
                element.classList.add("label_item");
                element.innerHTML = `
                    <div class="label_item_content" onclick="${item.action}">${item.label}</div>
                `;
                break;

            case "resource_listing_interface":
                element.classList.add("resource_listing_interface");
                element.innerHTML = `
                    <div class="resource_title">${item.label}</div>
                    <div class="resource_list" onclick="${item.action}">Loading ${item.resource_type}...</div>
                `;
                break;
            
                case "list_pad":
                    element.classList.add("list_pad_container");
                    
                    if (item.component_owner == "contact_page"){
                        item.item_list = get_my_contacts()
                    }

                    if (item.component_owner == "chat_page"){
                        item.item_list = get_my_chats()
                    }

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
                                
                                listItemElement.setAttribute('data-chat-id', listItem.id)
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
                                // Append custom attribute data-contact-id
                                listItemElement.setAttribute("data-contact-id", listItem.id);
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
                                    
                    navItemElement.setAttribute("onclick", "render_chat_listing('normal')");
                } else if (navItem.label === "Profile") {
                    
                    navItemElement.setAttribute("onclick", "render_personal_profile()");
                } else if (navItem.label === "Contacts") {
                    
                    navItemElement.setAttribute("onclick", "render_contact_listing('normal')");
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

    if (fetch_user_data() != null){
        if(is_registerd()){
            clear_contact_data()
            render_contact_listing('normal');
        }
        else{
            
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
    } else{
        init_test_user();
        render_start();
    }
   
    

    
}


async function render_personal_profile() {
    console.log("Rendering personal profile page...");

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

    try {
        // Dynamically update the personal profile data
        await ui_structure.update_personal_profile_data();

        // Parse UI structure for personal profile page
        let topSectionConfig = ui_structure.top_section.personal_profile_page;
        let middleSectionConfig = ui_structure.middle_section.personal_profile_page;
        let bottomSectionConfig = ui_structure.bottom_section.personal_profile_page;

        // Build top section
        if (topSectionConfig && topSectionConfig.some(item => item.visible)) {
            centerContainer.appendChild(create_top_section(topSectionConfig));
        }

        // Build middle section for personal profile page
        if (middleSectionConfig && middleSectionConfig.some(item => item.visible)) {
            let middleSection = create_middle_section(middleSectionConfig);
            centerContainer.appendChild(middleSection);
        }

        // Build bottom section for personal profile page
        if (bottomSectionConfig && bottomSectionConfig.some(item => item.visible)) {
            let bottomSection = create_bottom_section(bottomSectionConfig);
            centerContainer.appendChild(bottomSection);
        }
    } catch (error) {
        console.error("Error rendering personal profile page:", error);
    }
}

function render_group_profile() {
    console.log("Rendering group profile page...");

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

    // Parse UI structure for group profile page
    let uiStructure = ui_structure.top_section.group_profile_page;

    // Build top section
    if (uiStructure && uiStructure.some(item => item.visible)) {
        centerContainer.appendChild(create_top_section(uiStructure));
    }

    // Build middle section for group profile page
    let middleSectionConfig = ui_structure.middle_section.group_profile_page;
    if (middleSectionConfig && middleSectionConfig.some(item => item.visible)) {
        let middleSection = create_middle_section(middleSectionConfig);
        centerContainer.appendChild(middleSection);
    }

    // Build bottom section for group profile page
    let bottomSectionConfig = ui_structure.bottom_section.group_profile_page;
    if (bottomSectionConfig && bottomSectionConfig.some(item => item.visible)) {
        let bottomSection = create_bottom_section(bottomSectionConfig);
        centerContainer.appendChild(bottomSection);
    }

}


function render_other_profile() {
    console.log("Rendering other profile page...");
    // Clear previous content

}


function render_wallet_interface(){
    console.log("rendering for wallet_interface")

    userData = decodeData(localStorage.getItem('userData'))

    if (userData.registerd_wallet){
        console.log('user wallet is registerd');


    } else{
        console.log('user wallet is not registerd')
        render_personal_profile();
    }
}

function render_wallet_start() {
    console.log("Rendering wallet start page...");
}


function render_wallet_about() {
    console.log("Rendering wallet about page...");
}

function render_resource_listing_interface(resource_page) {
    console.log(`calling render_resource_listing_interface : ${resource_page}`);
    // Render specific resource listings
    if (resource_page === "contact_page") {
        render_contact_listing('normal'); // Listings for select and delete
    } else if (resource_page === "chat_page") {
        render_chat_listing('normal'); // Listings for select and delete
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

    // Render top section
    let topSectionConfig = ui_structure.top_section.contact_page;
    if (topSectionConfig && topSectionConfig.some(item => item.visible)) {
        centerContainer.appendChild(create_top_section(topSectionConfig));
    }

    // Render middle section
    let middleSectionConfig = ui_structure.middle_section.contact_page;
    if (middleSectionConfig && middleSectionConfig.some(item => item.visible)) {
        centerContainer.appendChild(create_middle_section(middleSectionConfig));
    }

    // Render bottom section
    let bottomSectionConfig = ui_structure.bottom_section.contact_page;
    if (bottomSectionConfig && bottomSectionConfig.some(item => item.visible)) {
        centerContainer.appendChild(create_bottom_section(bottomSectionConfig));
    }

    // Handle different modes
    if (mode) {
        switch (mode) {
            case "select_one":
                console.log("Mode: select_one - Enabling single selection.");
                load_resource_selection_data()
                document.querySelectorAll(".list_item_contact").forEach(item => {
                    item.classList.add("selectable");
                    item.onclick = () => handleSelectOne(item);
                });
                updateTopSection(centerContainer, ui_structure.top_section.select_contact_page);
                // Update bottom section to use select_page definition
                updateBottomSection(centerContainer, ui_structure.bottom_section.select_contact_page);
                break;

            case "select_many":
                console.log("Mode: select_many - Enabling multiple selection.");
                load_resource_selection_data()
                document.querySelectorAll(".list_item_contact").forEach(item => {
                    item.classList.add("selectable");
                    item.onclick = () => handleSelectMany(item);
                });
                updateTopSection(centerContainer, ui_structure.top_section.select_contact_page);
                // Update bottom section to use select_page definition
                updateBottomSection(centerContainer, ui_structure.bottom_section.select_contact_page);
                break;

            case "normal":
                console.log("Mode: normal - Rendering contact listing in normal mode.");
                break;

            default:
                console.warn(`Unknown mode: ${mode}`);
        }
    } else {
        console.warn("No mode specified for render_contact_listing.");
    }
}

function updateTopSection(centerContainer, selectPageConfig) {
    console.log("Updating top section with select_page configuration...");

    // Remove the existing top section
    const existingTopSection = centerContainer.querySelector(".top_section");
    if (existingTopSection) {
        existingTopSection.remove();
    }

    // Create and append the new top section
    if (selectPageConfig && selectPageConfig.some(item => item.visible)) {
        const newTopSection = create_top_section(selectPageConfig);
        centerContainer.prepend(newTopSection);
    } else {
        console.warn("No visible items found in select_page configuration.");
    }
}

function updateBottomSection(centerContainer, selectPageConfig) {
    console.log("Updating bottom section with select_page configuration...");

    // Remove the existing bottom section
    const existingBottomSection = centerContainer.querySelector(".bottom_section");
    if (existingBottomSection) {
        existingBottomSection.remove();
    }

    // Create and append the new bottom section
    if (selectPageConfig && selectPageConfig.some(item => item.visible)) {
        const newBottomSection = create_bottom_section(selectPageConfig);
        centerContainer.appendChild(newBottomSection);
    } else {
        console.warn("No visible items found in select_page configuration.");
    }
}


function handleSelectOne(item) {
    // Deselect any previously selected contact
    document.querySelectorAll(".list_item_contact.selected").forEach(selectedItem => {
        selectedItem.classList.remove("selected");
        const checkIcon = selectedItem.querySelector(".fa-circle-check");
        if (checkIcon) checkIcon.remove(); // Remove the check icon
    });

    // Select the clicked contact
    item.classList.add("selected");
    const contactId = item.getAttribute("data-contact-id");
    console.log(`Selected contact: ${contactId}`);

    // Add a check icon to the right side
    const checkIcon = document.createElement("i");
    checkIcon.classList.add("fa", "fa-circle-check", "check_icon");
    item.querySelector(".list_item_container").appendChild(checkIcon);

    // Update resource selection data
    clear_resource_selection_data(); // Clear previous selection
    update_resource_selection_data({ contact_id: contactId });
}


function handleChatSelectOne(item){
    // Deselect any previously selected contact
    document.querySelectorAll(".list_item_chat.selected").forEach(selectedItem => {
        selectedItem.classList.remove("selected");
        const checkIcon = selectedItem.querySelector(".fa-circle-check");
        if (checkIcon) checkIcon.remove(); // Remove the check icon
    });

    // Select the clicked contact
    item.classList.add("selected");
    const chatId = item.getAttribute("data-chat-id");
    console.log(`Selected contact: ${chatId}`);

    // Add a check icon to the right side
    const checkIcon = document.createElement("i");
    checkIcon.classList.add("fa", "fa-circle-check", "check_icon");
    item.querySelector(".list_item_container").appendChild(checkIcon);

    // Update resource selection data
    clear_resource_selection_data(); // Clear previous selection
    update_resource_selection_data({ chat_id: chatId });
}

function render_chat_listing(mode) {
    console.log('calling render_chat_listing for mode : ', mode);

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

    // Render top section
    let topSectionConfig = ui_structure.top_section.chat_page;
    if (topSectionConfig && topSectionConfig.some(item => item.visible)) {
        centerContainer.appendChild(create_top_section(topSectionConfig));
    }

    // Render middle section
    let middleSectionConfig = ui_structure.middle_section.chat_page;
    if (middleSectionConfig && middleSectionConfig.some(item => item.visible)) {
        centerContainer.appendChild(create_middle_section(middleSectionConfig));
    }

    // Render bottom section
    let bottomSectionConfig = ui_structure.bottom_section.chat_page;
    if (bottomSectionConfig && bottomSectionConfig.some(item => item.visible)) {
        centerContainer.appendChild(create_bottom_section(bottomSectionConfig));
    }

    // Handle different modes
    if (mode) {
        switch (mode) {
            case "select_one":
                console.log("Mode: select_one - Enabling single selection.");
                load_resource_selection_data()
                document.querySelectorAll(".list_item_chat").forEach(item => {
                    item.classList.add("selectable");
                    item.onclick = () => handleChatSelectOne(item);
                });
                updateTopSection(centerContainer, ui_structure.top_section.select_chat_page);
                // Update bottom section to use select_page definition
                updateBottomSection(centerContainer, ui_structure.bottom_section.select_chat_page);
                break;

            case "select_many":
                console.log("Mode: select_many - Enabling multiple selection.");
                load_resource_selection_data()
                document.querySelectorAll(".list_item_chat").forEach(item => {
                    item.classList.add("selectable");
                    item.onclick = () => handleChatSelectMany(item);
                });
                updateTopSection(centerContainer, ui_structure.top_section.select_chat_page);
                // Update bottom section to use select_page definition
                updateBottomSection(centerContainer, ui_structure.bottom_section.select_chat_page);
                break;

            case "normal":
                console.log("Mode: normal - Rendering chat listing in normal mode.");
                break;

            default:
                console.warn(`Unknown mode: ${mode}`);
        }
    } else {
        console.warn("No mode specified for render_contact_listing.");
    }
}

function handleSelectMany(item) {
    // Toggle the selected state of the clicked contact
    item.classList.toggle("selected");
    const contactId = item.getAttribute("data-contact-id");
    console.log(`Toggled selection for contact: ${contactId}`);

    if (item.classList.contains("selected")) {
        // Add a check icon to the right side
        const checkIcon = document.createElement("i");
        checkIcon.classList.add("fa", "fa-circle-check", "check_icon");
        item.querySelector(".list_item_container").appendChild(checkIcon);

        // Update resource selection data
        update_resource_selection_data({ contact_id: contactId });
    } else {
        // Remove the check icon
        const checkIcon = item.querySelector(".fa-circle-check");
        if (checkIcon) checkIcon.remove();

        // Remove the contact ID from resource selection data
        const resourceData = JSON.parse(localStorage.getItem("resource_selection_data")) || {};
        resourceData.selected_data = resourceData.selected_data.filter(data => data.contact_id !== contactId);
        localStorage.setItem("resource_selection_data", JSON.stringify(resourceData));
    }
}

function handleChatSelectMany(item){
    // Toggle the selected state of the clicked contact
    item.classList.toggle("selected");
    const chatId = item.getAttribute("data-chat-id");
    console.log(`Toggled selection for chat: ${chatId}`);

    if (item.classList.contains("selected")) {
        // Add a check icon to the right side
        const checkIcon = document.createElement("i");
        checkIcon.classList.add("fa", "fa-circle-check", "check_icon");
        item.querySelector(".list_item_container").appendChild(checkIcon);

        // Update resource selection data
        update_resource_selection_data({ chat_id: chatId });
    } else {
        // Remove the check icon
        const checkIcon = item.querySelector(".fa-circle-check");
        if (checkIcon) checkIcon.remove();

        // Remove the contact ID from resource selection data
        const resourceData = JSON.parse(localStorage.getItem("resource_selection_data")) || {};
        resourceData.selected_data = resourceData.selected_data.filter(data => data.chat_id !== chatId);
        localStorage.setItem("resource_selection_data", JSON.stringify(resourceData));
    }
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

function render_dynamic_input_interface2(componentId, mode = null) {
    console.log(`Rendering dynamic input interface for component: ${componentId}, mode: ${mode}`);

    // Clear previous content
    document.body.innerHTML = "";

    // Fetch the component configuration from the UI structure
    const componentConfig = ui_structure.create_section.create_chat.find(
        (component) => component.id === componentId
    );

    if (!componentConfig) {
        console.error(`Component with ID ${componentId} not found.`);
        return;
    }

    // Render the component
    if (componentConfig.component_type === "input_field") {
        // Render input field
        const inputField = document.createElement("input");
        inputField.type = "text";
        inputField.placeholder = componentConfig.placeholder;
        inputField.id = componentConfig.id;
        inputField.name = componentConfig.name;

        const proceedButton = document.createElement("button");
        proceedButton.textContent = "Proceed";
        proceedButton.onclick = () => {
            const inputValue = inputField.value;
            if (componentConfig.action && typeof window[componentConfig.action] === "function") {
                window[componentConfig.action](inputValue, () => {
                    console.log("Proceeding to the next step...");
                });
            }
        };

        document.body.appendChild(inputField);
        document.body.appendChild(proceedButton);
    } else if (componentConfig.component_type === "contact_list_select") {
        // Render contact list
        render_contact_listing(mode);
    }
}

function render_create_user() {
    console.log("Rendering create user interface...");

    // Clear previous content
    document.body.innerHTML = "";
    document.body.classList.remove("start-screen");
    document.body.classList.add("create-user-screen");

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

    // Render the top section for create_page
    let createPageConfig = ui_structure.top_section.create_page;
    if (createPageConfig && createPageConfig.some(item => item.visible)) {
        centerContainer.appendChild(create_top_section(createPageConfig));
    }

    // Middle Section: Render one input at a time
    let middleSection = document.createElement("div");
    middleSection.classList.add("middle_section");
    centerContainer.appendChild(middleSection);

    let createUserConfig = ui_structure.create_section.create_user;
    let currentInputIndex = 0;

    // Function to render the current input
    function renderCurrentInput() {
        middleSection.innerHTML = ""; // Clear previous input
        let inputConfig = createUserConfig[currentInputIndex];
        if (inputConfig && inputConfig.visible) {
            if (inputConfig.component_type === "input_field") {
                let inputContainer = document.createElement("div");
                inputContainer.classList.add("input_container");

                let inputField = document.createElement("input");
                inputField.type = "text";
                inputField.placeholder = inputConfig.placeholder;
                inputField.id = inputConfig.id;
                inputField.name = inputConfig.name;
                inputField.classList.add("input_field");

                inputContainer.appendChild(inputField);
                middleSection.appendChild(inputContainer);
                inputField.focus();
            } else if (inputConfig.component_type === "checkbox") {
                let checkboxContainer = document.createElement("div");
                checkboxContainer.classList.add("checkbox_container");

                let checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.id = inputConfig.id;
                checkbox.name = inputConfig.name;

                let label = document.createElement("label");
                label.htmlFor = inputConfig.id;
                label.textContent = inputConfig.label;

                checkboxContainer.appendChild(checkbox);
                checkboxContainer.appendChild(label);
                middleSection.appendChild(checkboxContainer);
            }
        }
    }

    // Render the first input
    renderCurrentInput();

    // Bottom Section: Add "Proceed" button
    let bottomSectionConfig = ui_structure.bottom_section.create_page;
    if (bottomSectionConfig && bottomSectionConfig.some(item => item.visible)) {
        let bottomSection = create_bottom_section(bottomSectionConfig);
        centerContainer.appendChild(bottomSection);

        // Attach handler to the "Proceed" button
        let proceedButton = bottomSection.querySelector(".button_item");
        if (proceedButton) {
            proceedButton.onclick = () => {
                console.log('proceed button clicked');

                // Get the current input configuration
                let inputConfig = createUserConfig[currentInputIndex];

                // Retrieve the input field value using its ID
                let inputValue = null;

                if (inputConfig && inputConfig.component_type === "input_field") {
                    let inputField = document.getElementById(inputConfig.id);
                    if (inputField) {
                        inputValue = inputField.value;
                    } else {
                        console.error(`Input field with ID "${inputConfig.id}" not found.`);
                    }
                } else if (inputConfig && inputConfig.component_type === "checkbox") {
                    let checkbox = document.getElementById(inputConfig.id);
                    if (checkbox) {
                        inputValue = checkbox.checked; // For checkboxes, use `checked` instead of `value`
                    } else {
                        console.error(`Checkbox with ID "${inputConfig.id}" not found.`);
                    }
                }

                // Get the current processor function
                let currentProcessor = inputConfig?.action;

                if (currentProcessor && typeof window[currentProcessor] === "function") {
                    console.log(`Executing processor: ${currentProcessor}`);
                    // Pass the input value to the processor function
                    window[currentProcessor](inputValue, () => {
                        // Move to the next input after the processor completes
                        currentInputIndex++;
                        if (currentInputIndex < createUserConfig.length) {
                            renderCurrentInput();
                        } else {
                            console.log("All inputs processed. Submitting...");
                        }
                    });
                } else {
                    console.warn("No processor found or processor is not a function. Moving to the next input.");
                    // If no processor, move to the next input
                    currentInputIndex++;
                    if (currentInputIndex < createUserConfig.length) {
                        renderCurrentInput();
                    } else {
                        console.log("All inputs processed. Submitting...");
                    }
                }
            };
        }
    }
}

function render_create_contact() {
    console.log("Rendering create contact interface...");

    // Clear previous content
    document.body.innerHTML = "";
    document.body.classList.remove("start-screen");
    document.body.classList.add("create-contact-screen");

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

    // Render the top section for create_page
    let createPageConfig = ui_structure.top_section.create_page;
    if (createPageConfig && createPageConfig.some(item => item.visible)) {
        centerContainer.appendChild(create_top_section(createPageConfig));
    }

    // Middle Section: Render one input at a time
    let middleSection = document.createElement("div");
    middleSection.classList.add("middle_section");
    centerContainer.appendChild(middleSection);

    let createContactConfig = ui_structure.create_section.create_contact;
    let currentInputIndex = 0;

    // Function to render the current input
    function renderCurrentInput() {
        middleSection.innerHTML = ""; // Clear previous input
        let inputConfig = createContactConfig[currentInputIndex];
        if (inputConfig && inputConfig.visible) {
            if (inputConfig.component_type === "input_field") {
                let inputContainer = document.createElement("div");
                inputContainer.classList.add("input_container");

                let inputField = document.createElement("input");
                inputField.type = "text";
                inputField.placeholder = inputConfig.placeholder;
                inputField.id = inputConfig.id;
                inputField.name = inputConfig.name;
                inputField.classList.add("input_field");

                inputContainer.appendChild(inputField);
                middleSection.appendChild(inputContainer);
                inputField.focus();
            }
        }
    }

    // Render the first input
    renderCurrentInput();

    // Bottom Section: Add "Proceed" button
    let bottomSectionConfig = ui_structure.bottom_section.create_page;
    if (bottomSectionConfig && bottomSectionConfig.some(item => item.visible)) {
        let bottomSection = create_bottom_section(bottomSectionConfig);
        centerContainer.appendChild(bottomSection);

        // Attach handler to the "Proceed" button
        let proceedButton = bottomSection.querySelector(".button_item");
        if (proceedButton) {
            proceedButton.onclick = () => {
                console.log('proceed button clicked');

                // Get the current input configuration
                let inputConfig = createContactConfig[currentInputIndex];

                // Retrieve the input field value using its ID
                let inputValue = null;

                if (inputConfig && inputConfig.component_type === "input_field") {
                    let inputField = document.getElementById(inputConfig.id);
                    if (inputField) {
                        inputValue = inputField.value;
                    } else {
                        console.error(`Input field with ID "${inputConfig.id}" not found.`);
                    }
                } else if (inputConfig && inputConfig.component_type === "checkbox") {
                    let checkbox = document.getElementById(inputConfig.id);
                    if (checkbox) {
                        inputValue = checkbox.checked; // For checkboxes, use `checked` instead of `value`
                    } else {
                        console.error(`Checkbox with ID "${inputConfig.id}" not found.`);
                    }
                }

                // Get the current processor function
                let currentProcessor = inputConfig?.action;

                if (currentProcessor && typeof window[currentProcessor] === "function") {
                    console.log(`Executing processor: ${currentProcessor}`);
                    // Pass the input value to the processor function
                    window[currentProcessor](inputValue, () => {
                        // Move to the next input after the processor completes
                        currentInputIndex++;
                        if (currentInputIndex < createContactConfig.length) {
                            renderCurrentInput();
                        } else {
                            console.log("All inputs processed. Submitting...");
                        }
                    });
                } else {
                    console.warn("No processor found or processor is not a function. Moving to the next input.");
                    // If no processor, move to the next input
                    currentInputIndex++;
                    if (currentInputIndex < createContactConfig.length) {
                        renderCurrentInput();
                    } else {
                        console.log("All inputs processed. Submitting...");
                    }
                }
            };
        }
    }
}

function render_create_chat() {
    console.log("Rendering create chat interface...");

    // Clear previous content
    document.body.innerHTML = "";
    document.body.classList.remove("start-screen");
    document.body.classList.add("create-contact-screen");

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

    // Render the top section for create_page
    let createPageConfig = ui_structure.top_section.create_page;
    if (createPageConfig && createPageConfig.some(item => item.visible)) {
        centerContainer.appendChild(create_top_section(createPageConfig));
    }

    // Middle Section: Render one input at a time
    let middleSection = document.createElement("div");
    middleSection.classList.add("middle_section");
    centerContainer.appendChild(middleSection);

    let createChatConfig = ui_structure.create_section.create_chat;
    let currentInputIndex = 0;

    function renderCurrentInput(){
        console.log('calling renderCurrentInput');
        middleSection.innerHTML = ""; // Clear previous input
        let inputConfig = createChatConfig[currentInputIndex];
        if (inputConfig && inputConfig.visible) {
            if (inputConfig.component_type === "input_field") {
                let inputContainer = document.createElement("div");
                inputContainer.classList.add("input_container");

                let inputField = document.createElement("input");
                inputField.type = "text";
                inputField.placeholder = inputConfig.placeholder;
                inputField.id = inputConfig.id;
                inputField.name = inputConfig.name;
                inputField.classList.add("input_field");

                inputContainer.appendChild(inputField);
                middleSection.appendChild(inputContainer);
                inputField.focus();
            } else if (inputConfig.component_type === "input_select_field"){
                let inputContainer = document.createElement("div");
                inputContainer.classList.add('input_container');

                let inputSelectField = document.createElement('select');
                inputSelectField.classList.add("input_field");

                inputSelectField.innerHTML = `
                    <option value="none"></option>
                    <option value="single">Single</option>
                    <option value="group">Group</option>
                `

                inputContainer.appendChild(inputSelectField);
                middleSection.appendChild(inputContainer);
                inputSelectField.focus();

            } else if (inputConfig.component_type === "contact_list_select"){
                // get value of select option then decide eith select_one, or select_many
                data = decodeData(localStorage.getItem('create_chat_page_data'));
                let chat_type = data.primary_input.chat_type
                console.log(`fetched chat_type is : ${chat_type}`)
                
                if(chat_type === 'single'){
                    render_contact_listing('select_one');
                }
                else if (chat_type === 'group'){
                    render_contact_listing('select_many');
                }
                
            }
        }
    }

    renderCurrentInput();

    // Bottom Section: Add "Proceed" button
    let bottomSectionConfig = ui_structure.bottom_section.create_page;
    if(bottomSectionConfig && bottomSectionConfig.some(item => item.visible)){
        let bottomSection = create_bottom_section(bottomSectionConfig);
        centerContainer.appendChild(bottomSection);

        // Attach handler to proceed button
        let proceedButton = bottomSection.querySelector(".button_item");
        if (proceedButton) {
            proceedButton.onclick = () =>{
                console.log('proceed button clicked');

                // Get the current input configuration
                let inputConfig = createChatConfig[currentInputIndex];

                // Retrieve the input field value using its ID
                let inputValue = null;

                if (inputConfig && inputConfig.component_type === "input_field") {
                    let inputField = document.getElementById(inputConfig.id);
                    if (inputField) {
                        inputValue = inputField.value;
                    } else {
                        console.error(`Input field with ID "${inputConfig.id}" not found.`);
                    }
                } else if (inputConfig && inputConfig.component_type === "input_select_field"){
                    let select = document.querySelector("select");
                    inputValue = ""

                    for (let option of Array.from(select.options)) {
                        if (option.selected) {
                        inputValue = String(option.value);
                        }
                    }
                    
                    
                } else if (inputConfig && inputConfig.component_type === "contact_list_select"){
                    
                }

                // Get the current processor function
                let currentProcessor = inputConfig?.action;

                if (currentProcessor && typeof window[currentProcessor] === "function") {
                    console.log(`Executing processor: ${currentProcessor}`);
                    // Pass the input value to the processor function
                    window[currentProcessor](inputValue, () => {
                        console.log('calling selected option value is :', inputValue);
                        // Move to the next input after the processor completes
                        currentInputIndex++;
                        if (currentInputIndex < createChatConfig.length) {
                            renderCurrentInput();
                        } else {
                            console.log("All inputs processed. Submitting...");
                        }
                    });
                } else {
                    console.warn("No processor found or processor is not a function. Moving to the next input.");
                    // If no processor, move to the next input
                    currentInputIndex++;
                    if (currentInputIndex < createChatConfig.length) {
                        renderCurrentInput();
                    } else {
                        console.log("All inputs processed. Submitting...");
                    }
                }


            }   
        }

    }
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





