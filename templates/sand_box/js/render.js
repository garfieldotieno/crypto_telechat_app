console.log('now loading render.js');

function render_start_interface() {
    console.log("calling render_start_interface");
    
    document.body.innerHTML = ""; // Clear previous content
    document.body.classList.add('start-screen'); // Add special class for start screen
    
    let containerClass = window.innerWidth < 777 ? "app_container_small" : "app_container_big";
    let centerContainerClass = window.innerWidth < 777 ? "app_center_container_small" : "app_center_container_big";
    
    // Create main container with full height for start screen
    let container = document.createElement("div");
    container.classList.add(containerClass);
    document.body.appendChild(container);
    
    let centerContainer = document.createElement("div");
    centerContainer.classList.add(centerContainerClass);
    container.appendChild(centerContainer);
    
    // Parse UI structure from your config
    let uiStructure = start_interface_ui_config.find(config => config.config_name === "start");
    
    // Build sections only if they exist in the structure
    if (uiStructure.top_section && uiStructure.top_section.some(item => item.visible)) {
        centerContainer.appendChild(create_top_section(uiStructure.top_section));
    }
    
    // Middle section with background image
    if (uiStructure.middle_section) {
        let middleSection = create_middle_section(uiStructure.middle_section);
        centerContainer.appendChild(middleSection);
    }
    
    // Bottom section with buttons
    if (uiStructure.bottom_section) {
        centerContainer.appendChild(create_bottom_section(uiStructure.bottom_section));
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

// Follow the same pattern for other render_* functions
// render_chat_listing, render_contact_listing, render_personal_profile, etc.

function render_verify_identity_1() {
    console.log("calling render_verify_identity_1");
    
    document.body.innerHTML = ""; // Clear previous content
    document.body.classList.remove('start-screen'); // Remove start screen class if present
    document.body.classList.add('verify-screen'); // Add verification screen class
    
    let containerClass = window.innerWidth < 777 ? "app_container_small" : "app_container_big";
    let centerContainerClass = window.innerWidth < 777 ? "app_center_container_small" : "app_center_container_big";
    
    let container = document.createElement("div");
    container.classList.add(containerClass);
    document.body.appendChild(container);
    
    let centerContainer = document.createElement("div");
    centerContainer.classList.add(centerContainerClass);
    container.appendChild(centerContainer);
    
    // Get UI structure for verify_identity_1 from start_interface_ui_config
    let uiStructure = start_interface_ui_config.find(config => config.config_name === "verify_identity_1");
    
    if (!uiStructure) {
        console.error("Could not find UI configuration for verify_identity_1");
        return;
    }
    
    // Build sections only if they exist in the structure
    if (uiStructure.top_section && uiStructure.top_section.some(item => item.visible)) {
        centerContainer.appendChild(create_top_section(uiStructure.top_section));
    }
    
    // Middle section with input field
    if (uiStructure.middle_section) {
        let middleSection = create_middle_section(uiStructure.middle_section);
        centerContainer.appendChild(middleSection);
    }
    
    // Bottom section with buttons
    if (uiStructure.bottom_section) {
        centerContainer.appendChild(create_bottom_section(uiStructure.bottom_section));
    }
    
    // Set focus on the email input field for better UX
    setTimeout(() => {
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.focus();
        }
    }, 100);
    
    // Call the transition function if specified
    if (uiStructure.transition_function && uiStructure.transition_function.name) {
        const transitionFn = window[uiStructure.transition_function.name];
        if (typeof transitionFn === 'function') {
            if (uiStructure.transition_function.type === "input") {
                // For input transitions, we'll handle in the form submission
                console.log("Input transition function ready:", uiStructure.transition_function.name);
            } else {
                transitionFn();
            }
        }
    }
}


function render_verify_identity_2() {
    console.log("calling render_verify_identity_2");
    
    document.body.innerHTML = ""; // Clear previous content
    document.body.classList.remove('start-screen'); // Remove start screen class if present
    document.body.classList.add('verify-screen'); // Add verification screen class
    
    let containerClass = window.innerWidth < 777 ? "app_container_small" : "app_container_big";
    let centerContainerClass = window.innerWidth < 777 ? "app_center_container_small" : "app_center_container_big";
    
    let container = document.createElement("div");
    container.classList.add(containerClass);
    document.body.appendChild(container);
    
    let centerContainer = document.createElement("div");
    centerContainer.classList.add(centerContainerClass);
    container.appendChild(centerContainer);
    
    // Get UI structure for verify_identity_2 from start_interface_ui_config
    let uiStructure = start_interface_ui_config.find(config => config.config_name === "verify_identity_2");
    
    if (!uiStructure) {
        console.error("Could not find UI configuration for verify_identity_2");
        return;
    }
    
    // Build sections only if they exist in the structure
    if (uiStructure.top_section && uiStructure.top_section.some(item => item.visible)) {
        centerContainer.appendChild(create_top_section(uiStructure.top_section));
    }
    
    // Middle section with input field
    if (uiStructure.middle_section) {
        let middleSection = create_middle_section(uiStructure.middle_section);
        centerContainer.appendChild(middleSection);
        
        // Add email reminder if available
        const storedEmail = localStorage.getItem("email");
        if (storedEmail) {
            const emailReminder = document.createElement('div');
            emailReminder.classList.add('email-reminder');
            emailReminder.innerHTML = `<p>A code has been sent to <strong>${storedEmail}</strong></p>`;
            emailReminder.style.textAlign = 'center';
            emailReminder.style.marginTop = '10px';
            emailReminder.style.color = '#666';
            middleSection.appendChild(emailReminder);
        }
    }
    
    // Bottom section with buttons
    if (uiStructure.bottom_section) {
        centerContainer.appendChild(create_bottom_section(uiStructure.bottom_section));
    }
    
    // Add resend code option
    const resendContainer = document.createElement('div');
    resendContainer.classList.add('resend-container');
    resendContainer.style.textAlign = 'center';
    resendContainer.style.marginTop = '20px';
    
    const resendButton = document.createElement('button');
    resendButton.textContent = 'Resend Code';
    resendButton.classList.add('text-button');
    resendButton.style.background = 'none';
    resendButton.style.border = 'none';
    resendButton.style.color = '#007AFF';
    resendButton.style.fontWeight = 'bold';
    resendButton.style.cursor = 'pointer';
    
    resendButton.addEventListener('click', () => {
        resendButton.textContent = 'Code resent';
        resendButton.style.color = '#666';
        resendButton.disabled = true;
        
        // Add your code resending logic here
        console.log('Resending verification code');
        
        // Simulate resending delay with countdown
        let countdown = 30;
        const countdownInterval = setInterval(() => {
            countdown--;
            resendButton.textContent = `Resend in ${countdown}s`;
            
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                resendButton.textContent = 'Resend Code';
                resendButton.style.color = '#007AFF';
                resendButton.disabled = false;
            }
        }, 1000);
    });
    
    resendContainer.appendChild(resendButton);
    centerContainer.appendChild(resendContainer);
    
    // Set focus on the OTP input field for better UX
    setTimeout(() => {
        const otpInput = document.getElementById('otp_code');
        if (otpInput) {
            otpInput.focus();
        }
    }, 100);
    
    // Call the transition function if specified
    if (uiStructure.transition_function && uiStructure.transition_function.name) {
        const transitionFn = window[uiStructure.transition_function.name];
        if (typeof transitionFn === 'function') {
            if (uiStructure.transition_function.type === "input") {
                // For input transitions, we'll handle in the form submission
                console.log("Input transition function ready:", uiStructure.transition_function.name);
            } else {
                transitionFn();
            }
        }
    }
}

// Add helper functions for the identity verification process
function saveEmailToLocalStorage(email) {
    if (email) {
        localStorage.setItem("email", email);
        console.log("Email saved to localStorage:", email);
    }
}

function processVerificationCode(code) {
    if (code) {
        console.log("Processing verification code:", code);
        // Add your verification code processing logic here
        
        // For demo purposes, let's just accept any 6-digit code
        if (code.length === 6 && /^\d+$/.test(code)) {
            console.log("Valid verification code format");
            return true;
        } else {
            console.warn("Invalid verification code format");
            return false;
        }
    }
    return false;
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


function render_create_chat_interface() {
    console.log("calling render_create_chat_interface");

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
    centerContainer.appendChild(create_top_section(create_chat_ui_structure.top_section));
    centerContainer.appendChild(create_middle_section(create_chat_ui_structure.middle_section));
    centerContainer.appendChild(create_bottom_section(create_chat_ui_structure.bottom_section));

    // Add event listener for chat type selection
    let selectionInput = document.getElementById("chat_type");
    selectionInput.addEventListener("change", function() {
        let chatType = selectionInput.value;
        display_contacts_for_chat_type(chatType);
    });
}


function display_contacts_for_chat_type(chatType) {
    console.log(`Displaying contacts for chat type: ${chatType}`);

    let contactsContainer = document.getElementById("contacts_container");
    if (!contactsContainer) {
        contactsContainer = document.createElement("div");
        contactsContainer.id = "contacts_container";
        contactsContainer.classList.add("input_container");
        document.querySelector(".middle_section").appendChild(contactsContainer);
    }

    contactsContainer.innerHTML = ""; // Clear previous content

    let contacts = get_my_contacts(); // Fetch user's contacts

    if (chatType === "single") {
        contactsContainer.innerHTML = `
            <h3>Select a Contact</h3>
            <select id="single_contact_select" class="input_field">
                <option value="">Select a contact</option>
                ${contacts.map(contact => `<option value="${contact.id}">${contact.label}</option>`).join('')}
            </select>
        `;
    } else if (chatType === "group") {
        contactsContainer.innerHTML = `
            <h3>Select Contacts</h3>
            ${contacts.map(contact => `
                <div class="input_field_2">
                    <label for="contact_${contact.id}">${contact.label}</label>
                    <input type="checkbox" id="contact_${contact.id}" value="${contact.id}">
                </div>
            `).join('')}
        `;
    }

    
}


function add_chat() {
    console.log(`calling add_chat`);

    let selectionInput = document.querySelector(".selection_input");
    console.log(`fetched selectionInput is : ${selectionInput}`);

    let chatType = selectionInput ? selectionInput.value : null;

    if (chatType) {
        console.log(`Selected chat type: ${chatType}`);

        let chatPayload = {
            creator_id: get_user_id(),
            chat_type: chatType
        };

        let memberPayload = [];

        if (chatType === "single") {

            let contactSelect = document.getElementById("single_contact_select");
            let selectedContactId = contactSelect ? contactSelect.value : null;

            if (selectedContactId) {
                memberPayload.push({ user_id: selectedContactId });
            } else {
                console.warn("No contact selected for single chat");
                return;
            }

        } else if (chatType === "group") {

            let checkboxes = document.querySelectorAll("#contacts_container input[type='checkbox']:checked");
            
            checkboxes.forEach(checkbox => {
                memberPayload.push({ user_id: checkbox.value });
            });

            if (memberPayload.length === 0) {
                console.warn("No contacts selected for group chat");
                return;
            }
        }

        console.log("Chat Payload:", chatPayload);
        console.log("Member Payload:", memberPayload);

        // Post chat payload to the appropriate endpoint
        fetch(`http://localhost:5000/api/chat/${chatType}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(chatPayload),
        })
        .then(response => response.json())
        .then(chatData => {
            console.log('Successful chat creation:', chatData);

            // Post member payloads for group chat
            if (chatType === "group") {
                memberPayload.forEach(member => {
                    fetch('http://localhost:5000/api/chat/member', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            chat_id: chatData.chat_id,
                            user_id: member.user_id
                        }),
                    })
                    .then(response => response.json())
                    .then(memberData => {
                        console.log('Successful member addition:', memberData);
                    })
                    .catch((error) => {
                        console.error('Error adding member:', error);
                    });
                });
            }

            // Render chat interface
            render_chat_interface(chatType);
        })
        .catch((error) => {
            console.error('Error creating chat:', error);
        });
    } else {
        console.warn("No chat type selected");
    }
}

function get_user_id() {
    let registerData = localStorage.getItem('register_data');
    
    if (!registerData) {
        console.warn("No register_data found in localStorage.");
        return null;
    }

    let parsedData = JSON.parse(registerData);
    return parsedData.data.id;
}


function render_create_contact_interface() {
    console.log("calling render_create_contact_interface");

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
    centerContainer.appendChild(create_top_section(create_contact_ui_structure.top_section));
    centerContainer.appendChild(create_middle_section(create_contact_ui_structure.middle_section));
    centerContainer.appendChild(create_bottom_section(create_contact_ui_structure.bottom_section));
}

function verify_contact() {
    console.log("calling verify_contact");

    let nameInput = document.getElementById("contact_name");
    let emailInput = document.getElementById("contact_email");
    let phoneInput = document.getElementById("contact_phone");

    let name = nameInput ? nameInput.value : null;
    let email = emailInput ? emailInput.value : null;
    let phone = phoneInput ? phoneInput.value : null;

    if (name && email && phone) {
        console.log(`Name: ${name}, Email: ${email}, Phone: ${phone}`);
        
        // Add logic to verify contact
        add_contact(name, email, phone);
    } else {
        console.warn("Email or phone number is missing");
    }
}

function add_contact(name, email, phone) {
    console.log("calling add_contact");

    // Fetch adding_user_id from localStorage
    let registerData = localStorage.getItem('register_data');
    if (!registerData) {
        console.warn("No register_data found in localStorage.");
        return;
    }

    let parsedData = JSON.parse(registerData);
    let adding_user_id = parsedData.data.id;

    // Generate payload
    let payload = {
        "adding_user_id": adding_user_id,
        "contact_digits": phone,
        "contact_name": name,
        "contact_email": email,
        "app_user": true, // Assuming app_user is true for now
        "app_user_id": 2 // Assuming app_user_id is 2 for now
    };

    console.log("Generated payload:", payload);

    // Post payload to localhost:5000/api/contact
    fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Successful contact addition:', data);
        // Fetch the updated list of contacts
        fetch_contacts_and_render();
    })
    .catch((error) => {
        console.error('Error:', error);
        // If failed, render failed interface
        render_failed_interface();
    });
}

function fetch_contacts_and_render() {
    console.log("Fetching updated contacts...");

    let registerData = localStorage.getItem("register_data");
    if (!registerData) {
        console.warn("No register_data found in localStorage.");
        return;
    }

    let parsedData = JSON.parse(registerData);
    let user_id = parsedData.data.id;

    if (!user_id) {
        console.warn("User ID not found in register_data.");
        return;
    }

    // Fetch updated contacts from API
    fetch(`/api/user/${user_id}/contacts`)
        .then(response => response.json())
        .then(contacts => {
            console.log("Fetched updated contacts:", contacts);
            // Update the contact listing UI structure with the new contacts
            contact_listing_ui_structure.middle_section[0].item_list = contacts.map(contact => ({
                item_type: "list_item_contact",
                label: contact.contact_name,
                status: "online" // Default status
            }));
            // Render the updated contact listing interface
            render_contact_listing();
        })
        .catch(error => {
            console.error("Error fetching updated contacts:", error);
        });
}

function render_chat_interface(chat_type) {
    console.log(`calling render_chat_interface with chat_type: ${chat_type}`);
    // Add logic to render chat interface based on chat_type
}

function render_other_person_interface() {
    console.log("calling render_other_person_interface");
    // Add logic to render other person interface
}

function render_failed_interface() {
    console.log("calling render_failed_interface");
    // Add logic to render failed interface
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

function render_wallet_interface(account_type){
    console.log('calling render_wallet_interface');
}

function render_other_profile_interface(){
    console.log("calling render_other_profile_interface");
}

function render_group_profile_interface(){
    console.log('calling rener_group_profile_interface');
}

