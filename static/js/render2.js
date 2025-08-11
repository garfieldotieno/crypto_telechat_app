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
                // Declare and initialize item_search as a DOM element
                let item_search = document.createElement("div");
                item_search.classList.add("search_container");
                item_search.innerHTML = `
                    <input type="text" placeholder="${item.placeholder}" class="search_input" />
                `;
                center_content.appendChild(item_search); // Append to center_content
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

function create_middle_section(items) {
    let section = document.createElement("div");
    section.classList.add("middle_section");

    section.style.alignItems = "center";
    section.style.justifyContent = "flex-start";

    items.forEach(item => {
        if (!item.visible) return;

        let element = document.createElement("div");

        switch (item.component_type) {
            case "surface_pad":
                element.classList.add("surface_pad");
                item.item_list.forEach(subItem => {
                    if (!subItem.visible) return;

                    let subElement = document.createElement("div");
                    subElement.classList.add("icon_label");

                    subElement.innerHTML = `
                        <i class="${subItem.icon}"></i>
                        <span>${subItem.label}</span>
                    `;

                    if (subItem.action) {
                        subElement.setAttribute("onclick", subItem.action);
                    }

                    element.appendChild(subElement);
                });
                break;

            case "transaction_summary_screen":
                element.classList.add("transaction_summary_screen");
                element.innerHTML = `
                    <div class="transaction_item top_left">${item.item_list.top_left}</div>
                    <div class="transaction_item top_right">${item.item_list.top_right}</div>
                    <div class="transaction_item middle_center">${item.item_list.middle_center}</div>
                    <div class="transaction_item bottom_right">${item.item_list.bottom_right}</div>
                `;
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

            case "background_image":
                element.classList.add("image_wrapper");
                element.innerHTML = `
                    <img src="${item.img_src}" class="background_image" />
                `;
                break;

            case "separation_title":
                element.classList.add("separation_title");
                element.innerHTML = `<div class="separation_title_label">${item.label}</div>`;
                break;

            case "separation_title_address":
                element.classList.add("separation_title_address");
                element.innerHTML = `<div class="separation_title_label">${item.label}</div>`;
                break;

            case "info_section":
                element.classList.add("info_section");
                element.innerHTML = `<div class="info_content">${item.label}</div>`;
                break;

            case "list_pad":
                element.classList.add("list_pad_container");

                if (item.component_owner === "contact_page") {
                    item.item_list = get_my_contacts();
                }

                if (item.component_owner === "chat_page") {
                    item.item_list = get_my_chats();
                }

                if (item.component_owner === "wallet_page"){
                    console.log('arrived at wallet_page item')
                }

                item.item_list.forEach(listItem => {

                    if (!listItem || !listItem.item_type) {
                        console.warn("Skipping invalid list item:", listItem);
                        return;
                    }

                    let listItemElement = document.createElement("div");
                    listItemElement.classList.add(listItem.item_type);

                    switch (listItem.item_type) {
                        case "list_item_chat":
                            const chatMemberIds = listItem.chat_member_ids.join('.'); // Join member IDs with dots

                            listItemElement.innerHTML = `
                                <div class="list_item_container">
                                    <div class="list_item_image" style="background-image: url('${listItem.user_dict?.profile_image_url || listItem.group_dict?.profile_image_url || "static/images/default_chat.png"}');"></div>
                                    <div class="list_item_content">
                                        <div class="list_item_title">${listItem.user_dict?.username || listItem.group_dict?.name || "Unknown Chat"}</div>
                                        <p class="list_item_message">${listItem.last_message || "No messages yet"}</p>
                                    </div>
                                    ${listItem.notification_badge ? `<div class="notification_badge">${listItem.notification_badge}</div>` : ""}
                                </div>
                            `;
                            listItemElement.setAttribute('data-chat-id', listItem.id);
                            listItemElement.setAttribute('data-chat-type', listItem.chat_type); // Add chat type attribute
                            listItemElement.setAttribute('data-chat-member-ids', chatMemberIds); // Add chat member IDs attribute
                            listItemElement.setAttribute("onclick", "render_chat_messages(event)");
                            break;

                        case "list_item_contact":
                            listItemElement.innerHTML = `
                                <div class="list_item_container">
                                    <div class="list_item_image" style="background-image: url('${listItem.user_dict?.wall_image_url || "static/images/default_profile.png"}');"></div>
                                    <div class="list_item_content">
                                        <div class="list_item_title">${listItem.label}</div>
                                        <p class="list_item_message" style="color: ${listItem.status === 'online' ? '#037EE5' : '#666'};">${listItem.status}</p>
                                    </div>
                                </div>
                            `;

                            listItemElement.setAttribute("data-contact-id", listItem.id);
                            listItemElement.setAttribute("data-contact-online-status", listItem.status);
                            listItemElement.setAttribute("data-contact-registerd-status", listItem.user_dict?.registerd_state || "false");
                            listItemElement.setAttribute("data-contact-registerd-wallet", listItem.user_dict?.registerd_wallet || "false");
                            listItemElement.setAttribute("data-contact-app-user-id", listItem.user_dict?.id || "null");
                            break;

                        case "list_item_transaction":
                            console.log('now rendering list_item_transaction');

                            let icon_class = "";
                            switch (listItem.type){
                                case "vest":
                                    icon_class = "fa-solid fa-";
                                    break;
                                case "token":
                                    break;
                                case "purchase":
                                    icon_class = "fa-solid fa-cart-shopping";
                                    break;
                                case "withdraw":
                                    icon_class = "fa-solid fa-money-bill-transfer";
                                    break;
                                case "send":
                                    icon_class = "fa-solid fa-arrow-right";
                                    break;
                                case "recieve":
                                    icon_class = "fa-solid fa-arrow-left";
                                    break;
                                default:
                                    console.warn(`Unknown transaction type : ${listItem.type}`);
                            }

                            listItemElement.innerHTML = `
                                <div class="list_item_container">
                                    <div class="list_item_icon">
                                        <i class="${icon_class}"></i>
                                    </div>
                                    <div class="list_item_content">
                                        <div class="list_item_header">
                                            <div class="list_item_title">${listItem.label}</div>
                                            <span class="list_item_title_spacer"></span>
                                            <div class="list_item_datetime">${new Date(listItem.datetime).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                </div>
                            `;
                            console.log(`before appending, created transaction vest item is ${listItemElement}`);
                            element.appendChild(listItemElement); // Append the correct element
                            console.log('ending creation of a single transaction vest item');
                            break;

                        case "list_item_transaction_vest":
                            console.log('starting creation of transaction vest item');
                            // let transactionElement0 = document.createElement("div");
                            // transactionElement0.classList.add(listItem.item_type);
                        
                            let iconClass0 = "";
                            switch (listItem.type) {
                                case "purchase":
                                    iconClass0 = "fa-solid fa-cart-shopping";
                                    break;
                                case "withdraw":
                                    iconClass0 = "fa-solid fa-money-bill-transfer";
                                    break;
                                case "send":
                                    iconClass0 = "fa-solid fa-arrow-right";
                                    break;
                                case "receive":
                                    iconClass0 = "fa-solid fa-arrow-left";
                                    break;
                                default:
                                    console.warn(`Unknown transaction type: ${listItem.type}`);
                                    return; // Skip invalid transaction types
                            }
                        
                            listItemElement.innerHTML = `
                                <div class="list_item_container">
                                    <div class="list_item_icon">
                                        <i class="${iconClass0}"></i>
                                    </div>
                                    <div class="list_item_content">
                                        <div class="list_item_header">
                                            <div class="list_item_title">${listItem.label}</div>
                                            <span class="list_item_title_spacer"></span>
                                            <div class="list_item_datetime">${new Date(listItem.datetime).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                </div>
                            `;
                            console.log(`before appending, created transaction vest item is ${listItemElement}`);
                            element.appendChild(listItemElement); // Append the correct element
                            console.log('ending creation of a single transaction vest item');
                            break;    

                        case "list_item_transaction_token":
                            console.log('starting creation of transaction token item');
                            // let transactionElement = document.createElement("div");
                            // transactionElement.classList.add(listItem.item_type);

                            let iconClass = "";
                            switch (listItem.type) {
                                case "purchase":
                                    iconClass = "fa-solid fa-cart-shopping";
                                    break;
                                case "withdraw":
                                    iconClass = "fa-solid fa-money-bill-transfer";
                                    break;
                                case "send":
                                    iconClass = "fa-solid fa-arrow-right";
                                    break;
                                case "receive":
                                    iconClass = "fa-solid fa-arrow-left";
                                    break;
                                default:
                                    console.warn(`Unknown transaction type: ${listItem.type}`);
                                    return;
                            }   
                            listItemElement.innerHTML = `
                                <div class="list_item_container">
                                    <div class="list_item_icon">
                                        <i class="${iconClass}"></i>
                                    </div>
                                    <div class="list_item_content">
                                        <div class="list_item_header">
                                            <div class="list_item_title">${listItem.label}</div>
                                            <span class="list_item_title_spacer"></span>
                                            <div class="list_item_datetime">${new Date(listItem.datetime).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                </div>
                            `;

                            console.log(`before appending, created transaction token item is ${listItemElement}`);
                            element.appendChild(listItemElement);
                            console.log('ending creation of a single transaction token item');
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



function create_bottom_section(items) {
    let section = document.createElement("div");
    section.classList.add("bottom_section");

    items.forEach(item => {
        if (item.visible && item.component_type === "button_stack") {
            let buttonContainer = document.createElement("div");
            buttonContainer.classList.add("button_stack");

            item.item_list.forEach(btn => {
                let button = document.createElement("button");
                button.classList.add("button_item");

                // Add icon and label
                button.innerHTML = `
                    ${btn.icon ? `<i class="${btn.icon}"></i>` : ""} 
                    ${btn.item_label}
                `;

                // Add action
                if (btn.action) {
                    button.setAttribute("onclick", btn.action);
                }

                buttonContainer.appendChild(button);
            });

            section.appendChild(buttonContainer);
        } else if (item.visible && item.component_type === "button") {
            let button = document.createElement("button");
            button.classList.add("button_item");

            // Add icon and label
            button.innerHTML = `
                ${item.icon ? `<i class="${item.icon}"></i>` : ""} 
                ${item.label}
            `;

            // Add action
            if (item.action) {
                button.setAttribute("onclick", item.action);
            }

            section.appendChild(button);
        } else if (item.visible && item.component_type === "navbar") {
            console.log(`now rendering the navbar at the bottom`)

            let navContainer = document.createElement("div");
            navContainer.classList.add("navbar_container");

            item.item_list.forEach(navItem => {
                let navItemElement = document.createElement("div");
                navItemElement.classList.add("navbar_item");

                // Add icon and label
                navItemElement.innerHTML = `
                    <i class="${navItem.icon}"></i>
                    <span>${navItem.label}</span>
                `;

                // Add navigation actions
                if (navItem.label === "Chats") {
                    navItemElement.setAttribute("onclick", "render_chat_listing('normal')");
                } else if (navItem.label === "Profile") {
                    navItemElement.setAttribute("onclick", "render_personal_profile()");
                } else if (navItem.label === "Contacts") {
                    navItemElement.setAttribute("onclick", "render_contact_listing('normal')");
                } else if (navItem.label === "Wallet") {
                    navItemElement.setAttribute("onclick", "render_wallet_interface()");
                }

                navContainer.appendChild(navItemElement);
            });

            section.appendChild(navContainer);
        } else if (item.visible && item.component_type === "horizontal_stack") {
            let horizontalStack = document.createElement("div");
            horizontalStack.classList.add("horizontal_stack");

            item.item_list.forEach(stackItem => {
                if (stackItem.item_type === "icon") {
                    let iconElement = document.createElement("div");
                    iconElement.classList.add("icon");
                    iconElement.innerHTML = `<i class="${stackItem.icon_name}"></i>`;

                    // Add action
                    if (stackItem.action) {
                        iconElement.setAttribute("onclick", stackItem.action);
                    }

                    horizontalStack.appendChild(iconElement);
                } else if (stackItem.item_type === "input") {
                    let inputElement = document.createElement("input");
                    inputElement.type = stackItem.input_type || "text";
                    inputElement.placeholder = stackItem.placeholder || "";
                    inputElement.classList.add("input");

                    // Apply custom styles if provided
                    if (stackItem.style) {
                        Object.keys(stackItem.style).forEach(key => {
                            inputElement.style[key] = stackItem.style[key];
                        });
                    }

                    // Bind variable if provided
                    if (stackItem.bind_variable) {
                        inputElement.setAttribute("data-bind", stackItem.bind_variable);
                    }

                    horizontalStack.appendChild(inputElement);
                }
            });

            section.appendChild(horizontalStack);
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


async function render_group_profile(group_id) {
    console.log(`Rendering group profile page for group ID: ${group_id}...`);

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
        // Dynamically update the group profile data
        await ui_structure.update_group_profile_data(group_id);

        // Parse UI structure for group profile page
        let topSectionConfig = ui_structure.top_section.group_profile_page;
        let middleSectionConfig = ui_structure.middle_section.group_profile_page;
        let bottomSectionConfig = ui_structure.bottom_section.group_profile_page;

        // Build top section
        if (topSectionConfig && topSectionConfig.some(item => item.visible)) {
            centerContainer.appendChild(create_top_section(topSectionConfig));
        }

        // Build middle section for group profile page
        if (middleSectionConfig && middleSectionConfig.some(item => item.visible)) {
            let middleSection = create_middle_section(middleSectionConfig);
            centerContainer.appendChild(middleSection);
        }

        // Build bottom section for group profile page
        if (bottomSectionConfig && bottomSectionConfig.some(item => item.visible)) {
            let bottomSection = create_bottom_section(bottomSectionConfig);
            centerContainer.appendChild(bottomSection);
        }
    } catch (error) {
        console.error("Error rendering group profile page:", error);
    }
}



async function render_other_profile(user_id) {
    console.log(`Rendering other profile page for user ID: ${user_id}...`);

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
        // Dynamically update the other profile data
        await ui_structure.update_other_profile_data(user_id);

        // Parse UI structure for other profile page
        let topSectionConfig = ui_structure.top_section.other_profile_page;
        let middleSectionConfig = ui_structure.middle_section.other_profile_page;
        let bottomSectionConfig = ui_structure.bottom_section.other_profile_page;

        // Build top section
        if (topSectionConfig && topSectionConfig.some(item => item.visible)) {
            centerContainer.appendChild(create_top_section(topSectionConfig));
        }

        // Build middle section for other profile page
        if (middleSectionConfig && middleSectionConfig.some(item => item.visible)) {
            let middleSection = create_middle_section(middleSectionConfig);
            centerContainer.appendChild(middleSection);
        }

        // Build bottom section for other profile page
        if (bottomSectionConfig && bottomSectionConfig.some(item => item.visible)) {
            let bottomSection = create_bottom_section(bottomSectionConfig);
            centerContainer.appendChild(bottomSection);
        }
    } catch (error) {
        console.error("Error rendering other profile page:", error);
    }
}



async function render_wallet_interface() {
    console.log("Rendering wallet interface...");

    // Fetch user data from localStorage
    const userData = decodeData(localStorage.getItem('userData'));

    if (!userData) {
        console.error("No user data found in localStorage. Redirecting to personal profile.");
        render_personal_profile();
        return;
    }

    // Check if the user has a registered wallet
    if (userData.registerd_wallet) {
        console.log("User wallet is registered.");

        try {
            // Dynamically update wallet data in the UI structure
            await ui_structure.update_wallet_data();

            // Render the wallet start page
            render_wallet_start();
        } catch (error) {
            console.error("Error updating wallet data:", error);
            alert("Failed to load wallet interface. Please try again later.");
        }
    } else {
        console.log("User wallet is not registered. Redirecting to personal profile.");
        render_personal_profile();
    }
}


function render_wallet_start() {
    console.log("Rendering wallet start page...");

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
    let topSectionConfig = ui_structure.top_section.wallet_start_page;
    if (topSectionConfig && topSectionConfig.some(item => item.visible)) {
        centerContainer.appendChild(create_top_section(topSectionConfig));
    }

    // Render middle section
    let middleSectionConfig = ui_structure.middle_section.wallet_start_page;
    if (middleSectionConfig && middleSectionConfig.some(item => item.visible)) {
        let middleSection = create_middle_section(middleSectionConfig);

        // Dynamically update the balance section
        const walletInfo = get_user_wallet();
        if (walletInfo) {
            const balanceSection = middleSection.querySelector(".balance_section");
            if (balanceSection) {
                balanceSection.innerHTML = `Balance: ${walletInfo.amount} USD`;
            }
        }

        centerContainer.appendChild(middleSection);
    }

    // Render bottom section
    let bottomSectionConfig = ui_structure.bottom_section.wallet_start_page;
    if (bottomSectionConfig && bottomSectionConfig.some(item => item.visible)) {
        let bottomSection = create_bottom_section(bottomSectionConfig);
        centerContainer.appendChild(bottomSection);
    }
}


function render_wallet_purchase_start(){
    console.log(`checking for render wallet purchase start`);

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
    let topSectionConfig = ui_structure.top_section.wallet_purchase_start_page;
    if (topSectionConfig && topSectionConfig.some(item => item.visible)) {
        centerContainer.appendChild(create_top_section(topSectionConfig));
    }

    // Render middle section
    let middleSectionConfig = ui_structure.middle_section.wallet_purchase_start_page;
    // Build middle section for other profile page
    if (middleSectionConfig && middleSectionConfig.some(item => item.visible)) {
        let middleSection = create_middle_section(middleSectionConfig);
        centerContainer.appendChild(middleSection);
    }
    
    // Render bottom section
    let bottomSectionConfig = ui_structure.bottom_section.wallet_purchase_start_page;
    if (bottomSectionConfig && bottomSectionConfig.some(item => item.visible)) {
        let bottomSection = create_bottom_section(bottomSectionConfig);
        centerContainer.appendChild(bottomSection);
    }
}

function show_wallet_purchase_types(){
    console.log('showing wallet purchase types');

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
    let topSectionConfig = ui_structure.top_section.wallet_purchase_types;
    if (topSectionConfig && topSectionConfig.some(item => item.visible)) {
        centerContainer.appendChild(create_top_section(topSectionConfig));
    }

    // Render middle section
    let middleSectionConfig = ui_structure.middle_section.wallet_purchase_types;
    // Build middle section for other profile page
    if (middleSectionConfig && middleSectionConfig.some(item => item.visible)) {
        let middleSection = create_middle_section(middleSectionConfig);
        centerContainer.appendChild(middleSection);
    }
    
    // Render bottom section
    let bottomSectionConfig = ui_structure.bottom_section.wallet_purchase_types;
    if (bottomSectionConfig && bottomSectionConfig.some(item => item.visible)) {
        let bottomSection = create_bottom_section(bottomSectionConfig);
        centerContainer.appendChild(bottomSection);
    }
}


function render_wallet_send_start(){

}

function render_wallet_sign_start(){

}

function render_wallet_withdraw_start(){

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
function render_contact_listing(mode, processor_name) {
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
                load_resource_selection_data("contact", "select_one", processor_name);
                document.querySelectorAll(".list_item_contact").forEach(item => {
                    item.classList.add("selectable");
                    item.onclick = () => handleSelectOne(item);
                });
                updateTopSection(centerContainer, ui_structure.top_section.select_contact_page);
                updateBottomSection(centerContainer, ui_structure.bottom_section.select_contact_page);
                break;

            case "select_many":
                console.log("Mode: select_many - Enabling multiple selection.");
                load_resource_selection_data("contact", "select_many", processor_name);
                document.querySelectorAll(".list_item_contact").forEach(item => {
                    item.classList.add("selectable");
                    item.onclick = () => handleSelectMany(item);
                });
                updateTopSection(centerContainer, ui_structure.top_section.select_contact_page);
                updateBottomSection(centerContainer, ui_structure.bottom_section.select_contact_page);
                break;

            case "normal":
                console.log("Mode: normal - Rendering contact listing in normal mode.");
                load_resource_selection_data("contact", "normal", process_select);
                break;

            case "registerd_users":
                console.log("Mode: registerd_users - Filtering registered users.");
                load_resource_selection_data("contact", "select_many", processor_name);

                document.querySelectorAll(".list_item_contact").forEach(item => {
                    item.classList.add("selectable");
                    item.onclick = () => handleSelectMany(item);
                });
                updateTopSection(centerContainer, ui_structure.top_section.select_contact_page);
                updateBottomSection(centerContainer, ui_structure.bottom_section.select_contact_page);

                const filterContacts = () => {
                    const contacts = document.querySelectorAll(".list_item_contact");
                    if (contacts.length > 0) {
                        console.log("Contacts detected. Applying filters...");

                        contacts.forEach(contact => {
                            const isRegistered = contact.getAttribute("data-contact-registerd-status") === "true";
                            const hasWallet = contact.getAttribute("data-contact-registerd-wallet") === "true";

                            // Hide contacts that are not registered or don't have a wallet
                            if (!isRegistered) {
                                contact.style.display = "none";
                            } else {
                                contact.style.display = ""; // Ensure visible contacts are displayed
                            }
                        });
                    } else {
                        // Retry after a short delay if no contacts are found
                        setTimeout(filterContacts, 100);
                    }
                };

                // Start filtering
                filterContacts();
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
    // Retrieve the resource value from resource_selection_data
    const resourceSelectionData = JSON.parse(localStorage.getItem("resource_selection_data")) || {};
    const resource = resourceSelectionData.resource;

    // Determine the attribute to fetch based on the resource type
    const itemId = resource === "contact"
        ? item.getAttribute("data-contact-id")
        : item.getAttribute("data-chat-id");

    if (!itemId) {
        console.warn("Item ID not found for the selected resource.");
        return;
    }

    // Deselect any previously selected item
    document.querySelectorAll(".list_item_contact.selected, .list_item_chat.selected").forEach(selectedItem => {
        selectedItem.classList.remove("selected");
        const checkIcon = selectedItem.querySelector(".fa-circle-check");
        if (checkIcon) checkIcon.remove(); // Remove the check icon
    });

    // Select the clicked item
    item.classList.add("selected");
    console.log(`Selected item: ${itemId}`);

    // Add a check icon to the right side
    const checkIcon = document.createElement("i");
    checkIcon.classList.add("fa", "fa-circle-check", "check_icon");
    item.querySelector(".list_item_container").appendChild(checkIcon);

    // Update resource selection data
    clear_resource_selection_data_single_select(); // Clear previous selection
    update_resource_selection_data({ item_id: itemId });
}

function handleSelectMany(item) {
    console.log(`calling handleSelectMany, for item  ${item}`);

    // Retrieve the resource value from resource_selection_data
    const resourceSelectionData = JSON.parse(localStorage.getItem("resource_selection_data")) || {};
    const resource = resourceSelectionData.resource;

    console.log(`current resource being : ${resource}`);

    // Determine the attribute to fetch based on the resource type
    const itemId = resource === "contact"
        ? item.getAttribute("data-contact-id")
        : item.getAttribute("data-chat-id");

    if (!itemId) {
        console.warn("Item ID not found for the selected resource.");
        return;
    }

    // Toggle the selected state of the clicked item
    item.classList.toggle("selected");
    console.log(`Toggled selection for item: ${itemId}`);

    if (item.classList.contains("selected")) {
        // Add a check icon to the right side
        const checkIcon = document.createElement("i");
        checkIcon.classList.add("fa", "fa-circle-check", "check_icon");
        item.querySelector(".list_item_container").appendChild(checkIcon);

        // Update resource selection data
        update_resource_selection_data({ item_id: itemId });
    } else {
        // Remove the check icon
        const checkIcon = item.querySelector(".fa-circle-check");
        if (checkIcon) checkIcon.remove();

        // Remove the item ID from resource selection data
        const resourceData = JSON.parse(localStorage.getItem("resource_selection_data")) || {};
        resourceData.selected_data = resourceData.selected_data.filter(data => data.item_id !== itemId);
        localStorage.setItem("resource_selection_data", JSON.stringify(resourceData));
    }
}

function render_chat_listing(mode, processor_name) {
    console.log(`calling render_chat_listing with mode: ${mode}`);

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
                load_resource_selection_data("chat", "select_one", processor_name);
                document.querySelectorAll(".list_item_chat").forEach(item => {
                    item.classList.add("selectable");
                    item.onclick = () => handleSelectOne(item); // Use handleSelectOne
                });
                updateTopSection(centerContainer, ui_structure.top_section.select_chat_page);
                updateBottomSection(centerContainer, ui_structure.bottom_section.select_chat_page);
                break;

            case "select_many":
                console.log("Mode: select_many - Enabling multiple selection.");
                load_resource_selection_data("chat", "select_many", processor_name);
                document.querySelectorAll(".list_item_chat").forEach(item => {
                    item.classList.add("selectable");
                    item.onclick = () => handleSelectMany(item); // Use handleSelectMany
                });
                updateTopSection(centerContainer, ui_structure.top_section.select_chat_page);
                updateBottomSection(centerContainer, ui_structure.bottom_section.select_chat_page);
                break;

            case "normal":
                console.log("Mode: normal - Rendering chat listing in normal mode.");
                load_resource_selection_data("chat", "normal", process_select);
                break;

            default:
                console.warn(`Unknown mode: ${mode}`);
        }
    } else {
        console.warn("No mode specified for render_chat_listing.");
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
    } else if (input_page === "create_chat_single") {
        render_new_chat_single(); // Handle single or group chat creation
    } else if (input_page === "create_chat_group") {
        render_new_chat_group(); // Handle single or group chat creation
    }
    
    else if (input_page === "create_personal_account_transaction") {
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



function render_create_chat(){
    console.log('calling render_create_chat')
    render_contact_listing('registerd_users', 'create_chat');
}

function render_new_chat_group() {
    console.log("Rendering new chat group interface...");

    // Clear previous content
    document.body.innerHTML = "";
    document.body.classList.remove("start-screen");
    document.body.classList.add("create-chat-group-screen");

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
    if (createPageConfig && createPageConfig.some( item => item.visible)) {
        centerContainer.appendChild(create_top_section(createPageConfig));
    }

    // Middle Section: Render input for group name
    let middleSection = document.createElement("div");
    middleSection.classList.add("middle_section");
    centerContainer.appendChild(middleSection);

    let inputContainer = document.createElement("div");
    inputContainer.classList.add("input_container");

    let inputField = document.createElement("input");
    inputField.type = "text";
    inputField.placeholder = "Enter group name";
    inputField.id = "group_name";
    inputField.name = "group_name";
    inputField.classList.add("input_field");

    inputContainer.appendChild(inputField);
    middleSection.appendChild(inputContainer);
    inputField.focus();

    // Bottom Section: Add "Proceed" button
    let bottomSectionConfig = ui_structure.bottom_section.create_page;
    if (bottomSectionConfig && bottomSectionConfig.some(item => item.visible)) {
        let bottomSection = create_bottom_section(bottomSectionConfig);
        centerContainer.appendChild(bottomSection);

        // Attach handler to the "Proceed" button
        let proceedButton = bottomSection.querySelector(".button_item");
        if (proceedButton) {
            proceedButton.onclick = () => {
                console.log('Proceed button clicked');

                // Retrieve the group name from the input field
                let groupName = document.getElementById("group_name").value;
                if (!groupName) {
                    alert("Please enter a group name.");
                    return;
                }

                // Retrieve the current user's data
                const userData = decodeData(localStorage.getItem('userData'));
                const user_id = userData.id;

                // Retrieve the selected contacts from resource_selection_data
                const resourceSelectionData = decodeData(localStorage.getItem("resource_selection_data"));
                const selectedContacts = resourceSelectionData.selected_data;

                if (!selectedContacts || selectedContacts.length === 0) {
                    alert("Please select at least one contact.");
                    return;
                }

                // Step 1: Create the group chat
                fetch('/api/chat/group', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ creator_id: user_id, name: groupName }),
                })
                    .then((response) => {
                        if (response.status === 201 || response.status === 200) {
                            return response.json(); // Group chat created successfully
                        } else {
                            throw new Error('Failed to create group chat');
                        }
                    })
                    .then((groupData) => {
                        console.log('Group chat created successfully:', groupData);

                        // Step 2: Add selected contacts as members of the group chat
                        const chat_id = groupData.chat_id;

                        const memberPromises = selectedContacts.map(contact => {
                            return fetch('/api/chat/member', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ chat_id: chat_id, user_id: contact.item_id }),
                            });
                        });

                        return Promise.all(memberPromises);
                    })
                    .then((responses) => {
                        const allSuccessful = responses.every(response => response.status === 201 || response.status === 200);
                        if (allSuccessful) {
                            console.log('All members added to the group chat successfully.');
                            alert('Group chat created successfully!');
                            render_chat_listing('normal'); // Render the chat listing in normal mode
                        } else {
                            throw new Error('Failed to add some members to the group chat');
                        }
                    })
                    .catch((error) => {
                        console.error('Error creating group chat:', error.message);
                        alert('Failed to create group chat. Please try again.');
                    });
            };
        }
    }
}


function render_chat_messages(event) {
    console.log("Rendering chat messages interface...");

    const chat_id = event.currentTarget.getAttribute("data-chat-id");
    const chat_type = event.currentTarget.getAttribute("data-chat-type");
    const chat_member_ids = event.currentTarget.getAttribute("data-chat-member-ids");

    console.log(`Chat ID: ${chat_id}, Chat Type: ${chat_type}, Chat Member IDs: ${chat_member_ids}`);

    if (!chat_id) {
        console.error("No chat_id found on the clicked element.");
        return;
    }

    // Initialize chatPadData
    const chatPadData = {
        chat_id,
        chat_type,
        chat_member_ids: chat_member_ids ? chat_member_ids.split(",") : [],
        group_id: null // Default to null
    };

    // If the chat type is "group", fetch the group_id
    if (chat_type === "group") {
        console.log('showing group chats')
        fetch(`/api/chat/${chat_id}/group`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch group details for chat ID: ${chat_id}`);
                }
                return response.json();
            })
            .then(groupData => {
                console.log("Fetched group data:", groupData);

                // Ensure group_id is correctly extracted from groupData
                if (groupData && groupData.group_chat.id) {
                    chatPadData.group_id = groupData.group_chat.id;
                    console.log(`new chatPadData is ${chatPadData}`)
                } else {
                    console.warn("groupData does not contain a valid group_id.");
                }

                // Store updated chatPadData in localStorage
                localStorage.setItem("chat_pad_data", JSON.stringify(chatPadData));
                console.log("Updated chatPadData stored in localStorage:", chatPadData);

                // Proceed with rendering the chat messages
                renderChatUI(chatPadData);
            })
            .catch(error => {
                console.error("Error fetching group details:", error);
            });
    } else {
        console.log('showing single chat messages');

        // For non-group chats, store chatPadData directly
        localStorage.setItem("chat_pad_data", JSON.stringify(chatPadData));
        console.log("chatPadData stored in localStorage:", chatPadData);

        // Proceed with rendering the chat messages
        renderChatUI(chatPadData);
        poll_new_chat_messages();
    }
}

async function renderChatUI(chatPadData) {
    console.log("Rendering chat UI...");

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
    let topSectionConfig = ui_structure.top_section.chat_message_page;
    if (topSectionConfig && topSectionConfig.some(item => item.visible)) {
        centerContainer.appendChild(create_top_section(topSectionConfig));
    }

    // Add a back button action
    const backButton = document.querySelector(".top_section .left_content");
    if (backButton) {
        backButton.onclick = () => {
            stopPollingMessages(); // Stop polling when navigating back
            render_chat_listing("normal"); // Navigate back to the chat listing
        };
    }

    // Render middle section
    let middleSection = document.createElement("div");
    middleSection.classList.add("middle_section");
    centerContainer.appendChild(middleSection);

    try {
        // Fetch messages for the chat
        const chat_id = chatPadData.chat_id;
        console.log(`Fetching messages for chat_id: ${chat_id}...`);
        await fetch_chat_messages(chat_id);

        // Retrieve updated chatPadData from localStorage
        const updatedChatPadData = JSON.parse(localStorage.getItem('chat_pad_data')) || {};
        const messages = updatedChatPadData.messages || [];
        const userData = decodeData(localStorage.getItem('userData'));

        console.log("Messages to render:", messages);

        // Render messages in the middle section
        messages.forEach(message => {
            const messageElement = document.createElement("div");
            messageElement.classList.add("message_item");

            // Determine if the message is from the current user or another user
            const isOwner = message.user_id === userData.id; 
            // const isRecipient = chatPadData.chat_member_ids.includes(String(message.user_id));

            // if (isOwner) {
            //     messageElement.classList.add("message_owner"); // Align to the right for the chat creator
            // } else if (isRecipient) {
            //     messageElement.classList.add("message_recipient"); // Align to the left for other chat members
            // } else {
            //     console.warn(`Message user_id ${message.user_id} does not match any known user in the chat.`);
            // }

            if (isOwner) {
                messageElement.classList.add("message_owner"); // Align to the right for the chat creator
            }
            else{
                messageElement.classList.add("message_recipient"); // Align to the left for other chat members
            }

            messageElement.innerHTML = `
                <div class="message_content">${message.content}</div>
                <div class="message_timestamp">${new Date(message.timestamp).toLocaleTimeString()}</div>
            `;

            middleSection.appendChild(messageElement);
        });

        // Scroll to bottom after messages are rendered
        setTimeout(() => {
            middleSection.scrollTop = middleSection.scrollHeight;
            console.log("Scrolled to bottom of messages.");
        }, 0);
    } catch (error) {
        console.error("Error fetching or rendering messages:", error);
    }

    // Render bottom section
    let bottomSection = document.createElement("div");
    bottomSection.classList.add("horizontal_stack");

    // Input field for message content
    let inputField = document.createElement("input");
    inputField.type = "text";
    inputField.placeholder = "Write a message...";
    inputField.classList.add("input");
    bottomSection.appendChild(inputField);

    // Send button
    let sendButton = document.createElement("div");
    sendButton.classList.add("icon");
    sendButton.innerHTML = `<i class="fa-solid fa-paper-plane"></i>`;

    // Function to handle sending messages
    const sendMessage = async () => {
        const content = inputField.value.trim();
        if (!content) {
            alert("Message cannot be empty!");
            return;
        }

        try {
            // sending user data
            let user_data = decodeData(localStorage.getItem('userData'));

            // Determine the endpoint based on chat type
            const endpoint = chatPadData.chat_type === "group"
                ? "/api/chat/group/message"
                : "/api/chat/single/message";

            // Post the message to the backend
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user_id: parseInt(user_data.id), // Assuming the first ID is the sender
                    chat_id: chatPadData.chat_id,
                    content: content
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to send message: ${response.statusText}`);
            }

            const result = await response.json();
            console.log("Message sent successfully:", result);

            // Clear the input field
            inputField.value = "";

            // Refresh the chat messages
            await fetch_chat_messages(chatPadData.chat_id);
            renderChatUI(chatPadData);
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Failed to send message. Please try again.");
        }
    };

    // Attach click event to the send button
    sendButton.onclick = sendMessage;

    // Attach keydown event to the input field to listen for the Enter key
    inputField.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    bottomSection.appendChild(sendButton);
    centerContainer.appendChild(bottomSection);
}





