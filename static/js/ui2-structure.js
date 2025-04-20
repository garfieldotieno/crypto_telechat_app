console.log('now loading ui2-structure.js');

const ui_structure = {
    top_section: {
        start_page: [
            { visible: false, component_type: "icon_label", icon: "fa-solid fa-arrow-left", label: "back", position: "left" },
            { visible: true, component_type: "text", label: "Welcome", position: "center" },
            { visible: false, component_type: "icon_label", icon: "fa-solid fa-plus", label: "add", position: "right" }
        ],
        wallet_start_page: [
            { visible: true, component_type: "icon_label", icon: "fa-solid fa-arrow-left", label: "Back", position: "left" },
            { visible: true, component_type: "text", label: "Wallet", position: "center" },
            { visible: true, component_type: "icon_label", icon: "fa-solid fa-info-circle", label: "Info", position: "right" }
        ],
        wallet_about_page: [
            { visible: true, component_type: "icon_label", icon: "fa-solid fa-arrow-left", label: "Back", position: "left" },
            { visible: true, component_type: "text", label: "About Wallet", position: "center" },
            { visible: false, component_type: "icon_label", icon: "fa-solid fa-plus", label: "Add", position: "right" }
        ],
        personal_profile_page: [
            { visible: true, component_type: "icon_label", icon: "fa-solid fa-arrow-left", label: "Back", position: "left", action: "render_start()" },
            { visible: true, component_type: "text", label: "Profile", position: "center" },
            { visible: true, component_type: "icon_label", icon: "fa-solid fa-square-pen", label: "Edit", position: "right" }
        ],
        other_profile_page: [
            { visible: true, component_type: "icon_label", icon: "fa-solid fa-arrow-left", label: "Back", position: "left" },
            { visible: true, component_type: "text", label: "Contact", position: "center" },
            { visible: false, component_type: "icon_label", icon: "fa-solid fa-plus", label: "Add", position: "right" }
        ],
        group_profile_page: [
            { visible: true, component_type: "icon_label", icon: "fa-solid fa-arrow-left", label: "Back", position: "left" },
            { visible: true, component_type: "text", label: "Group Profile", position: "center" },
            { visible: true, component_type: "icon_label", icon: "fa-solid fa-users", label: "Members", position: "right" }
        ],
        contact_page: [
            { visible: true, component_type: "icon_label", icon: "fa-solid fa-trash", label: "Delete", position: "left", action:"render_contact_listing('select_many')" },
            { visible: true, component_type: "text", label: "Contacts", position: "center" },
            { visible: true, component_type: "icon_label", icon: "fa-solid fa-user-plus", label: "Add Contact", position: "right", action: "render_dynamic_input_interface('create_contact')" },
            { visible: true, component_type: 'item_search', placeholder: "Search"}
        ],
        chat_page: [
            { visible: true, component_type: "icon_label", icon: "fa-solid fa-trash", label: "Delete", position: "left", action:"render_chat_listing('select_many')" },
            { visible: true, component_type: "text", label: "Chat", position: "center" },
            { visible: true, component_type: "icon_label", icon: "fa-solid fa-plus", label: "Options", position: "right", action: "render_dynamic_input_interface('create_chat')" },
            { visible: true, component_type: 'item_search', placeholder: "Search"}
        ],
        select_chat_page:[
            { visible: true, component_type: "icon_label", icon: "fa-solid fa-arrow-left", label: "Back", position: "left", action: "render_chat_listing('normal')"},
            { visible: true, component_type: "text", label: "Select Chat", position: "center" },
            { visible: false, component_type: "icon_label", icon: "fa-solid fa-edit", label: "Edit", position: "right" },
            { visible: true, component_type: 'item_search', placeholder: "Search"}
        ],
        create_page: [
            { visible: true, component_type: "icon_label", icon: "fa-solid fa-arrow-left", label: "Back", position: "left", action: "render_start()" },
            { visible: true, component_type: "text", label: "Create", position: "center" },
            { visible: false, component_type: "icon_label", icon: "fa-solid fa-plus", label: "Add", position: "right" }
        ],
        select_contact_page:[
            { visible: true, component_type: "icon_label", icon: "fa-solid fa-arrow-left", label: "Back", position: "left", action: "render_contact_listing('normal')"},
            { visible: true, component_type: "text", label: "Select Contact", position: "center" },
            { visible: false, component_type: "icon_label", icon: "fa-solid fa-edit", label: "Edit", position: "right" },
            { visible: true, component_type: 'item_search', placeholder: "Search"}
        ],
        chat_message_page: [
            { visible: true, component_type: "icon_label", icon: "fa-solid fa-arrow-left", label: "Back", position: "left" },
            { visible: true, component_type: "text", label: "Messages", position: "center" },
            { visible: true, component_type: "icon_label", icon: "fa-solid fa-info-circle", label: "Info", position: "right" }
        ]
    },
    
    middle_section: {
        start_page: [
            { visible: true, component_type: "background_image", img_src: "static/images/SplashScreen.png" }
        ],
        wallet_start_page: [
            { visible: true, component_type: "profile_image", img_src: "static/images/samurai.png" },
            { visible: true, component_type: "profile_background_image", img_src: "static/images/background_one.jpeg" },
            { visible: true, component_type: "separation_title", label: "Information" },
            { visible: true, component_type: "balance_section", balance: "1000 USD" },
            { visible: true, component_type: "personal_transaction_listing", transactions: [] },
            { visible: true, component_type: "group_transaction_listing", transactions: [] }
        ],
        wallet_about_page: [
            { visible: true, component_type: "separation_title", label: "About" },
            { visible: true, component_type: "info_section", content: "This wallet allows you to manage your transactions securely within the chat app." }
        ],
        personal_profile_page: [
            { visible: true, component_type: "profile_image", img_src: "static/images/background_one.jpeg" },
            { visible: true, component_type: "profile_background_image", img_src: "static/images/samurai.jpeg" },
        ],
        other_profile_page: [
            { visible: true, component_type: "profile_image", img_src: "static/images/background_two.jpeg" },
            { visible: true, component_type: "profile_background_image", img_src: "static/images/aku.jpeg" },
            { visible: true, component_type: "separation_title", label: "Information" },
            { visible: true, component_type: "info_section", action: "show_profile_information()" },
            { visible: true, component_type: "label_item", label: "Username", action: "copy_username()" },
            { visible: true, component_type: "label_item", label: "Email", action: "copy_email()" },
            { visible: true, component_type: "label_item", label: "Wallet", action: "copy_wallet()" },
            { visible: true, component_type: "separation_title", label: "Groups" },
            { visible: true, component_type: "resource_listing_interface", resource_type: "chats:groups", action: "list_common_groups()" }
        ],
        contact_page : [
            {
                visible: true,
                component_type: "list_pad",
                component_owner: "contact_page",
                item_list: []
            }
        ],
        chat_page : [
            {
                visible: true,
                component_type: "list_pad",
                component_owner: "chat_page",
                item_list: []
            }
        ]
        
    },
    
    bottom_section: {
        start_page: [
            { visible: true, component_type: "button_stack", 
                item_list: [{ item_type: "button", item_label: "Proceed", action: "render_dynamic_input_interface('create_user')" }] 
            }
        ],
        wallet_start_page: [
            { visible: true, component_type: "button_stack", 
                item_list: [
                    { item_type: "button", item_label: "Activate", action: "step_navigation('verify_identity_1')" },
                    { item_type: "button", item_label: "Purchase", action: "step_navigation('purchase_page')" },
                    { item_type: "button", item_label: "Withdraw", action: "step_navigation('withdraw_page')" }
                ] 
            }
        ],
        create_page: [
            { visible: true, component_type: "button_stack", 
                item_list: [
                    { item_type: "button", item_label: "Proceed" },
                    
                ] 
            }
        ],
        contact_page: [
            { visible:true, component_type: "navbar", 
                item_list: [
                { item_type: "navbar_item", icon: "fa-solid fa-address-book", label: "Contacts" },
                { item_type: "navbar_item", icon: "fa-solid fa-wallet", label: "Wallet" },
                { item_type: "navbar_item", icon: "fa-solid fa-comments", label: "Chats" },
                { item_type: "navbar_item", icon: "fa-solid fa-user", label: "Profile" }
                ]
            }
        ],
        select_contact_page: [
            { visible: true, component_type: "button_stack", 
                item_list: [
                    { item_type: "button", item_label: "Proceed", action: "process_select()" },
                   
                ] 
            }
        ],
        chat_page: [
            { visible:true, component_type: "navbar", 
                item_list: [
                { item_type: "navbar_item", icon: "fa-solid fa-address-book", label: "Contacts" },
                { item_type: "navbar_item", icon: "fa-solid fa-wallet", label: "Wallet" },
                { item_type: "navbar_item", icon: "fa-solid fa-comments", label: "Chats" },
                { item_type: "navbar_item", icon: "fa-solid fa-user", label: "Profile" }
                ]
            }
        ],
        select_chat_page: [
            { visible: true, component_type: "button_stack", 
                item_list: [
                    { item_type: "button", item_label: "Proceed", action: "process_chat_select()" },
                   
                ] 
            }
        ],
        personal_profile_page: [
            { visible: true, component_type: "button_stack", 
                item_list: [
                    { item_type: "button", item_label: "Username", action: "copy_username()" },
                    { item_type: "button", item_label: "Email", action: "copy_email()" },
                    { item_type: "button", item_label: "Wallet", action: "copy_wallet()" }
                    
                ] 
            }
        ]
    },

    create_section: {
        create_user: [
            { 
                visible: true, 
                component_type: "input_field", 
                placeholder: "Enter your email", 
                id: "email_input", 
                name: "email", 
                action: "verify_email" // Add a valid processor function name
            },
            { 
                visible: true, 
                component_type: "input_field", 
                placeholder: "Enter verification code", 
                id: "verification_code_input", 
                name: "otp_secret", 
                action: "verify_code" // Add a valid processor function name
            }
        ],

        create_contact: [
            { 
                visible: true, 
                component_type: "input_field", 
                placeholder: "Enter contact name", 
                id: "contact_name_input", 
                name: "contact_name", 
                action: "validate_contact_name" // Processor for this input
            },
            { 
                visible: true, 
                component_type: "input_field", 
                placeholder: "Enter contact email", 
                id: "contact_email_input", 
                name: "contact_email", 
                action: "validate_contact_email" // Processor for this input
            },
            { 
                visible: true, 
                component_type: "input_field", 
                placeholder: "Enter contact digits", 
                id: "contact_digits_input", 
                name: "contact_digits", 
                action: "validate_contact_digits" // Processor for this input
            }
            
        ],

        create_chat: [
            { 
                visible: true, 
                component_type: "input_select_field", 
                placeholder: "Type", 
                id: "chat_type_input", 
                name: "chat_type", 
                action: "process_chat_type" // Processor for this input
            },
            {
                visible: true,
                component_type: "input_field",
                placeholder: "Group Name",
                id: "chat_group_name_input",
                name: "chat_type",
                action: "process_group_name"
            },
            {
                visible:true,
                component_type: "contact_list_select",
                action:"process_create_chat"
                
            }
        ]
    },

    // Function to dynamically update personal_profile_page
    update_personal_profile_data: async function () {
        console.log("Updating personal profile data...");

        try {
            // Fetch user data from the backend
            const userData = await fetch_user_backend_data();

            if (!userData) {
                console.warn("No user data found.");
                return;
            }

            console.log("Fetched user data:", userData);

            // Update the middle_section.personal_profile_page dynamically
            this.middle_section.personal_profile_page = [
                { visible: true, component_type: "profile_image", img_src: userData.profile_image_url || "static/images/default_profile.png" },
                { visible: true, component_type: "profile_background_image", img_src: userData.wall_image_url || "static/images/default_background.png" },
                { visible: true, component_type: "separation_title", label: "Bio" },
                { visible: true, component_type: "info_section", label: userData.registerd_bio },
                { visible: true, component_type: "separation_title", label: "Actions" }
                
            ];

            this.bottom_section.personal_profile_page = [
                { visible: true, component_type: "button_stack", 
                    item_list: [
                        { item_type: "button", item_label: `${userData.username}`, action: `copy_to_clipboard('${userData.username}')` },
                        { item_type: "button", item_label: `${userData.email}`, action: `copy_to_clipboard('${userData.email}')` },
                        { item_type: "button", item_label: `${"Login"}`, action: `login_user` }
                    ] 
                }
            ];

            console.log("Updated personal_profile_page:", this.middle_section.personal_profile_page);
        } catch (error) {
            console.error("Error updating personal profile data:", error);
        }
    }
};

// window.ui_structure = ui_structure;

