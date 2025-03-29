console.log('now loading navigation.js');


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
                if(val!= ''){
                    console.log(`email data is : ${val}`);
                    appData2.verify_identity_1_data = {input:val};
                    localStorage.setItem("appData", encodeData(appData2));

                    render_verify_identity_2();
                } else {
                    console.log("your input was empty, try again")
                }
                
                
            }

            
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
                if(val != ''){
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

                    localStorage.setItem("appData", encodeData(appData3));
                    
                    render_chat_listing();

                } else {
                    console.log("your input for otp_code is empty, try again")
                }
                
            }

            
            break;
        case "contact_listing":
            render_contact_listing();
            break;
        case "personal_profile":
            render_personal_profile();
            break;
        case "create_chat":
            render_create_chat_interface()
            break;
        case "create_contact":
            render_create_contact_interface();
            break;
        case "wallet_interface":
            render_wallet_interface();
            break;
        case "other_profile_interface": 
            render_other_profile_interface();
            break;
        case "group_profile_interface":
            render_group_profile_interface();
            break;
        default:
            console.warn(`Unknown step: ${step}`);
    }
}

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


function load_navigation_step(){
    console.log('calling load_input_step');

    let step_input_data = {
        
    }
}

function update_navigation_step(){
    console.log('calling update_input_step');
    
}

function render_start_for(interface_name){
    console.log(`calling render_start_for interface ${interface_name}`);

}

function render_input_step_transition(name){
    console.log('calling render_input_step_transition');

    if (name == 'register_user'){

    }else if (name == "create_contact"){

    }else if (name == "create_chat"){

    }else if (name == "create_personal_transaction_purchase"){

    }else if (name == "create_personal_transaction_send_to_personal"){

    }else if (name == "create_personal_transaction_send_to_group"){

    }else if (name == "create_personal_transaction_vest_amount"){

    }else if (name == "create_personal_transaction_withdraw"){

    }else if (name == "create_group_transaction_purchase"){

    }else if (name == "create_group_transaction_send_to_personal"){

    }else if (name == "create_group_transaction_send_to_group"){

    }else if (name == "create_group_transaction_vest_group_amount"){

    }else if (name == "create_group_transaction_request_group_withdraw"){

    }else if (name == "create_group_transaction_sign_withdraw_request"){

    }

}