console.log('now loading ui2-structure.js');

const ui_structure = {
    top_section: {
        start_page: [
            { visible: false, component_type: "icon_label", icon: "fa-solid fa-arrow-left", label: "back", position: "left" },
            { visible: true, component_type: "text", label: "Welcome", position: "center" },
            { visible: false, component_type: "icon_label", icon: "fa-solid fa-plus", label: "add", position: "right" }
        ],
        wallet_start_page: [
            { visible: true, component_type: "icon_label", icon: "fa-solid fa-arrow-left", label: "Back", position: "left", action:"render_contact_listing('normal')" },
            { visible: true, component_type: "text", label: "Wallet", position: "center" },
            { visible: true, component_type: "icon_label", icon: "fa-solid fa-info-circle", label: "Info", position: "right", action:"render_wallet_about()" }
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
            { visible: true, component_type: "icon_label", icon: "fa-solid fa-arrow-left", label: "Back", position: "left", action: "render_chat_listing('normal')" },
            { visible: true, component_type: "text", label: "Contact", position: "center" },
            { visible: false, component_type: "icon_label", icon: "fa-solid fa-plus", label: "Add", position: "right" }
        ],
        group_profile_page: [
            { visible: true, component_type: "icon_label", icon: "fa-solid fa-arrow-left", label: "Back", position: "left", action: "render_chat_listing('normal')" },
            { visible: true, component_type: "text", label: "Group Profile", position: "center" },
            { visible: true, component_type: "icon_label", icon: "fa-solid fa-users", label: "Members", position: "right" }
        ],
        contact_page: [
            { visible: true, component_type: "icon_label", icon: "fa-solid fa-trash", label: "Delete", position: "left", action:"render_contact_listing('select_many', 'delete_contact')" },
            { visible: true, component_type: "text", label: "Contacts", position: "center" },
            { visible: true, component_type: "icon_label", icon: "fa-solid fa-user-plus", label: "Add Contact", position: "right", action: "render_dynamic_input_interface('create_contact')" }
        ],
        chat_page: [
            { visible: true, component_type: "icon_label", icon: "fa-solid fa-trash", label: "Delete", position: "left", action:"render_chat_listing('select_many', 'delete_chat')" },
            { visible: true, component_type: "text", label: "Chat", position: "center" },
            { visible: true, component_type: "icon_label", icon: "fa-solid fa-plus", label: "Options", position: "right", action: "render_create_chat()" },
            
        ],
        select_chat_page:[
            { visible: true, component_type: "icon_label", icon: "fa-solid fa-arrow-left", label: "Back", position: "left", action: "render_chat_listing('normal')"},
            { visible: true, component_type: "text", label: "Select Chat", position: "center" },
            { visible: false, component_type: "icon_label", icon: "fa-solid fa-edit", label: "Edit", position: "right" }  
        ],
        create_page: [
            { visible: true, component_type: "icon_label", icon: "fa-solid fa-arrow-left", label: "Back", position: "left", action: "render_start()" },
            { visible: true, component_type: "text", label: "Create", position: "center" },
            { visible: false, component_type: "icon_label", icon: "fa-solid fa-plus", label: "Add", position: "right" }
        ],
        select_contact_page:[
            { visible: true, component_type: "icon_label", icon: "fa-solid fa-arrow-left", label: "Back", position: "left", action: "render_contact_listing('normal')"},
            { visible: true, component_type: "text", label: "Select Contact", position: "center" },
            { visible: false, component_type: "icon_label", icon: "fa-solid fa-edit", label: "Edit", position: "right" }
        ],
        chat_message_page: [
            { visible: true, component_type: "icon_label", icon: "fa-solid fa-arrow-left", label: "Back", position: "left", action:"render_chat_listing('normal')" },
            { visible: true, component_type: "text", label: "Messages", position: "center" },
            { visible: true, component_type: "icon_label", icon: "fa-solid fa-info-circle", label: "Info", position: "right", action:"process_chat_profile(event)" },
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
            
        ],
        group_profile: [
            { visible: true, component_type: "profile_image", img_src: "static/images/background_two.jpeg" },
            { visible: true, component_type: "profile_background_image", img_src: "static/images/aku.jpeg" },
        ],

        contact_page: [
            {
                visible: true,
                component_type: "item_search",
                placeholder: "Search Contacts",
                action: "search_contacts()" // Add a valid search function
            },
            {
                visible: true,
                component_type: "list_pad",
                component_owner: "contact_page",
                item_list: []
            }
        ],

        chat_page: [
            {
                visible: true,
                component_type: "item_search",
                placeholder: "Search Chat",
                action: "search_chats()" // Add a valid search function
            },
            {
                visible: true,
                component_type: "list_pad",
                component_owner: "chat_page",
                item_list: []
            }
        ],
        chat_message_page:[
            { visible: true, component_type: "background_image", img_src: "static/images/chat_wallpaper.jpeg" },
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
                    { item_type: "button", item_label: "Personal Transactions", action: "step_navigation('purchase_page')" },
                    { item_type: "button", item_label: "Group Transactions", action: "step_navigation('withdraw_page')" },
                    { item_type: "button", item_label: "Purchase Token", action: "step_navigation('purchase_page')" },
                    { item_type: "button", item_label: "Withdraw Token", action: "step_navigation('withdraw_page')" }
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
                    { item_type: "button", item_label: "Proceed", action: "process_select()" },
                   
                ] 
            }
        ],
        personal_profile_page: [
            
        ],
        other_profile_page:[
            
        ],
        group_profile_page:[
            
        ],
        create_message_page: [
            {
                visible: true,
                component_type: "horizontal_stack",
                item_list: [
                    {
                        item_type: "icon",
                        icon_name: "fa-solid fa-paperclip", // Font Awesome paperclip icon
                        action: "open_attachment()"
                    },
                    {
                        item_type: "input",
                        input_type: "text",
                        placeholder: "Write a message...",
                        style: {
                            border_radius: "20px",
                            padding: "10px",
                            flex: 1, // Make it expand in the middle
                            border: "1px solid #ccc"
                        },
                        bind_variable: "new_message"
                    },
                    {
                        item_type: "icon",
                        icon_name: "fa-solid fa-face-smile", // Font Awesome smiley face icon
                        action: "open_emoji_picker()"
                    },
                    {
                        item_type: "icon",
                        icon_name: "fa-solid fa-camera", // Font Awesome camera icon
                        action: "open_camera()"
                    }
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
                action: "verify_email" 
            },
            { 
                visible: true, 
                component_type: "input_field", 
                placeholder: "Enter verification code", 
                id: "verification_code_input", 
                name: "otp_secret", 
                action: "verify_code" 
            }
        ],

        create_contact: [
            { 
                visible: true, 
                component_type: "input_field", 
                placeholder: "Enter contact name", 
                id: "contact_name_input", 
                name: "contact_name", 
                action: "validate_contact_name" 
            },
            { 
                visible: true, 
                component_type: "input_field", 
                placeholder: "Enter contact email", 
                id: "contact_email_input", 
                name: "contact_email", 
                action: "validate_contact_email" 
            },
            { 
                visible: true, 
                component_type: "input_field", 
                placeholder: "Enter contact digits", 
                id: "contact_digits_input", 
                name: "contact_digits", 
                action: "validate_contact_digits" 
            }
        ],

        create_vest_item: [
            { 
                visible: true, 
                component_type: "input_field", 
                placeholder: "Enter vest name", 
                id: "vest_name_input", 
                name: "name", 
                action: "validate_vest_name" 
            },
            { 
                visible: true, 
                component_type: "input_field", 
                placeholder: "Enter vest description", 
                id: "vest_description_input", 
                name: "description", 
                action: "validate_vest_description" 
            },
            { 
                visible: true, 
                component_type: "input_field", 
                placeholder: "Enter token entry", 
                id: "token_entry_input", 
                name: "token_entry", 
                action: "validate_token_entry" 
            },
            { 
                visible: true, 
                component_type: "input_field", 
                placeholder: "Enter vesting duration (in days)", 
                id: "vesting_duration_input", 
                name: "vesting_duration", 
                action: "validate_vesting_duration" 
            },
            { 
                visible: true, 
                component_type: "input_field", 
                placeholder: "Enter yield percentage", 
                id: "yield_percentage_input", 
                name: "yield_percentage", 
                action: "validate_yield_percentage" 
            }
        ],

        personal_transactions: {
            purchase_token: [
                { 
                    visible: true, 
                    component_type: "input_field", 
                    placeholder: "Enter token amount", 
                    id: "token_amount_input", 
                    name: "token_amount", 
                    action: "validate_token_amount" 
                },
                { 
                    visible: true, 
                    component_type: "input_field", 
                    placeholder: "Enter your wallet address", 
                    id: "user_wallet_address_input", 
                    name: "user_wallet_address", 
                    action: "validate_wallet_address" 
                },
                { 
                    visible: true, 
                    component_type: "input_field", 
                    placeholder: "Enter payment reference", 
                    id: "payment_reference_input", 
                    name: "payment_reference", 
                    action: "validate_payment_reference" 
                }
            ],
            send_token: [
                { 
                    visible: true, 
                    component_type: "input_field", 
                    placeholder: "Enter token amount", 
                    id: "send_token_amount_input", 
                    name: "token_amount", 
                    action: "validate_token_amount" 
                },
                { 
                    visible: true, 
                    component_type: "input_field", 
                    placeholder: "Enter receiver address", 
                    id: "receiver_address_input", 
                    name: "receiver_address", 
                    action: "validate_receiver_address" 
                }
            ],
            vest_token: [
                { 
                    visible: true, 
                    component_type: "input_field", 
                    placeholder: "Enter vest ID", 
                    id: "vest_id_input", 
                    name: "vest_id", 
                    action: "validate_vest_id" 
                },
                { 
                    visible: true, 
                    component_type: "input_field", 
                    placeholder: "Enter wallet address", 
                    id: "wallet_address_input", 
                    name: "wallet_address", 
                    action: "validate_wallet_address" 
                }
            ],
            unvest_token: [
                { 
                    visible: true, 
                    component_type: "input_field", 
                    placeholder: "Select vest listing", 
                    id: "vest_listing_selection_input", 
                    name: "vest_listing_selection", 
                    action: "validate_vest_listing" 
                },
                { 
                    visible: true, 
                    component_type: "input_field", 
                    placeholder: "Enter wallet address", 
                    id: "wallet_address_input", 
                    name: "wallet_address", 
                    action: "validate_wallet_address" 
                }
            ],
            withdraw_token_to_cash: [
                { 
                    visible: true, 
                    component_type: "input_field", 
                    placeholder: "Enter token amount", 
                    id: "withdraw_token_amount_input", 
                    name: "token_amount", 
                    action: "validate_token_amount" 
                },
                { 
                    visible: true, 
                    component_type: "input_field", 
                    placeholder: "Enter payment settlement description", 
                    id: "payment_settlement_description_input", 
                    name: "payment_settlement_description", 
                    action: "validate_payment_description" 
                }
            ]
        },

        group_transactions: {
            admin_purchase_token: [
                { 
                    visible: true, 
                    component_type: "input_field", 
                    placeholder: "Enter token amount", 
                    id: "admin_token_amount_input", 
                    name: "token_amount", 
                    action: "validate_token_amount" 
                },
                { 
                    visible: true, 
                    component_type: "input_field", 
                    placeholder: "Enter group wallet address", 
                    id: "group_wallet_address_input", 
                    name: "group_wallet", 
                    action: "validate_wallet_address" 
                },
                { 
                    visible: true, 
                    component_type: "input_field", 
                    placeholder: "Enter payment reference", 
                    id: "admin_payment_reference_input", 
                    name: "payment_reference", 
                    action: "validate_payment_reference" 
                }
            ],
            admin_send_token: [
                { 
                    visible: true, 
                    component_type: "input_field", 
                    placeholder: "Enter token amount", 
                    id: "admin_send_token_amount_input", 
                    name: "token_amount", 
                    action: "validate_token_amount" 
                },
                { 
                    visible: true, 
                    component_type: "input_field", 
                    placeholder: "Enter receiver address", 
                    id: "admin_receiver_address_input", 
                    name: "receiver_address", 
                    action: "validate_receiver_address" 
                }
            ],
            admin_request_token_withdrawal: [
                { 
                    visible: true, 
                    component_type: "input_field", 
                    placeholder: "Enter group ID", 
                    id: "admin_group_id_input", 
                    name: "group_id", 
                    action: "validate_group_id" 
                }
            ],
            admin_vest_token: [
                { 
                    visible: true, 
                    component_type: "input_field", 
                    placeholder: "Enter token amount", 
                    id: "admin_vest_token_amount_input", 
                    name: "token_amount", 
                    action: "validate_token_amount" 
                },
                { 
                    visible: true, 
                    component_type: "input_field", 
                    placeholder: "Enter vest ID", 
                    id: "admin_vest_id_input", 
                    name: "vest_id", 
                    action: "validate_vest_id" 
                }
            ],
            admin_unvest_token: [
                { 
                    visible: true, 
                    component_type: "input_field", 
                    placeholder: "Select vest listing", 
                    id: "admin_vest_listing_selection_input", 
                    name: "vest_listing_selection", 
                    action: "validate_vest_listing" 
                },
                { 
                    visible: true, 
                    component_type: "input_field", 
                    placeholder: "Enter group wallet address", 
                    id: "admin_group_wallet_address_input", 
                    name: "group_wallet_address", 
                    action: "validate_wallet_address" 
                }
            ],
            admin_withdraw_token_to_cash: [
                { 
                    visible: true, 
                    component_type: "input_field", 
                    placeholder: "Enter token amount", 
                    id: "admin_withdraw_token_amount_input", 
                    name: "token_amount", 
                    action: "validate_token_amount" 
                },
                { 
                    visible: true, 
                    component_type: "input_field", 
                    placeholder: "Enter payment settlement description", 
                    id: "admin_payment_settlement_description_input", 
                    name: "payment_settlement_description", 
                    action: "validate_payment_description" 
                }
            ]
        }
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
            
            // Check if the user is logged in
            const isLoggedIn = is_logged_in();

            // Update the middle_section.personal_profile_page dynamically
            this.middle_section.personal_profile_page = [
                { 
                    visible: true, 
                    component_type: "profile_image", 
                    img_src: userData.profile_image_url || "static/images/default_profile.png" 
                },
                { 
                    visible: true, 
                    component_type: "profile_background_image", 
                    img_src: userData.wall_image_url || "static/images/default_background.png" 
                },
                { visible: true, component_type: "separation_title", label: "Transactions" },
            ];

            // Update the bottom_section.personal_profile_page with a separation_title
            this.bottom_section.personal_profile_page = [
                { 
                    visible: true, 
                    component_type: "button_stack", 
                    item_list: [
                        { item_type: "button", item_label: "Update Profile", action: "step_navigation('verify_identity_1')" },
                        { item_type: "button", item_label: "Files Shared", action: "step_navigation('verify_identity_1')" },
                        { item_type: "button", item_label: "Links Shared", action: "step_navigation('purchase_page')" },
                        { item_type: "button", item_label: "Groups Shared", action: "step_navigation('purchase_page')" },
                        // Show "Wallet" button only if logged in and wallet is not registered
                        ...(isLoggedIn && !userData.registerd_wallet ? [
                            { item_type: "button", item_label: "Wallet", action: "activate_wallet()" }
                        ] : []),
                        // Show "Login" button only if not logged in
                        ...(!isLoggedIn ? [
                            { item_type: "button", item_label: "Login", action: "login_user()" }
                        ] : []),
                        // Always show "Uninstall" button
                        { item_type: "button", item_label: "Uninstall", action: "uninstall_app()" }
                    ] 
                }
            ];

        } catch (error) {
            console.error("Error updating personal profile data:", error);
        }
    },

    update_other_profile_data: async function (user_id) {
        console.log("Updating the other profile data...");

        try {
            // Fetch user data from the backend
            const response = await fetch(`/api/user/${user_id}`);
            if (!response.ok) {
                console.warn(`Failed to fetch user data for user_id: ${user_id}. Status: ${response.status}`);
                return;
            }

            const userData = await response.json();
            console.log("Fetched user data:", userData);

            // Dynamically update the middle_section.other_profile_page
            this.middle_section.other_profile_page = [
                { 
                    visible: true, 
                    component_type: "profile_image", 
                    img_src: userData.profile_image_url || "static/images/default_profile.png" 
                },
                { 
                    visible: true, 
                    component_type: "profile_background_image", 
                    img_src: userData.wall_image_url || "static/images/default_background.png" 
                },
                { visible: true, component_type: "separation_title", label: "Transactions" },
                
            ];

            this.bottom_section.other_profile_page= [
                {
                    visible: true, 
                    component_type: "button_stack", 
                    item_list: [
                        { item_type: "button", item_label: "Update Profile", action: "step_navigation('verify_identity_1')" },
                        { item_type: "button", item_label: "Files Shared", action: "step_navigation('verify_identity_1')" },
                        { item_type: "button", item_label: "Links Shared", action: "step_navigation('purchase_page')" },
                        { item_type: "button", item_label: "Groups Shared", action: "step_navigation('purchase_page')" },
                        
                    ] 
                }
            ]

            console.log("Updated other_profile_page:", this.middle_section.other_profile_page);
        } catch (error) {
            console.error(`Error updating other profile data for user_id: ${user_id}`, error);
        }
    },

    update_group_profile_data: async function (group_id) {
        console.log("Updating the group profile data...");

        try {
            // Fetch group data from the backend
            const response = await fetch(`/api/chat/${group_id}/group`);
            if (!response.ok) {
                console.warn(`Failed to fetch group data for group_id: ${group_id}. Status: ${response.status}`);
                return;
            }

            const groupData = await response.json();
            console.log("Fetched group data:", groupData);

            // Dynamically update the middle_section.group_profile_page
            this.middle_section.group_profile_page = [
                { 
                    visible: true, 
                    component_type: "profile_image", 
                    img_src: groupData.group_chat.profile_image_url || "static/images/default_profile.png" 
                },
                { 
                    visible: true, 
                    component_type: "profile_background_image", 
                    img_src: groupData.group_chat.wall_image_url || "static/images/default_background.png" 
                },
                { visible: true, component_type: "separation_title", label: "Transactions" },
                
            ];


            this.bottom_section.group_profile_page = [
                { 
                    visible: true, 
                    component_type: "button_stack", 
                    item_list: [
                        { item_type: "button", item_label: "Update Profile", action: "step_navigation('verify_identity_1')" },
                        { item_type: "button", item_label: "Files Shared", action: "step_navigation('verify_identity_1')" },
                        { item_type: "button", item_label: "Links Shared", action: "step_navigation('purchase_page')" },
                        { item_type: "button", item_label: "Groups Shared", action: "step_navigation('purchase_page')" },
                        
                    ] 
                }
            ]

            console.log("Updated group_profile_page:", this.middle_section.group_profile_page);
        } catch (error) {
            console.error(`Error updating group profile data for group_id: ${group_id}`, error);
        }
    },
    
    update_wallet_data: async function () {
        console.log("Updating wallet data...");

        try {
            // Fetch user data from localStorage
            const userData = fetch_user_data();

            if (!userData) {
                console.warn("No user data found in localStorage.");
                return;
            }

            console.log("Fetched user data:", userData);

            // Extract wallet address from userData
            const publicAddress = userData.wallet_address || "Not Available";

            // Dynamically update the middle_section.wallet_start_page
            this.middle_section.wallet_start_page = [
                { 
                    visible: true, 
                    component_type: "profile_image", 
                    img_src: userData.profile_image_url || "static/images/default_profile.png" 
                },
                { 
                    visible: true, 
                    component_type: "profile_background_image", 
                    img_src: userData.wall_image_url || "static/images/default_background.png" 
                },
                { 
                    visible: true, 
                    component_type: "separation_title", 
                    label: "Information" 
                },
                { 
                    visible: true, 
                    component_type: "separation_title_address", 
                    label: `Public Address: ${publicAddress}` 
                },
                {
                    visible: true,
                    component_type: "transaction_summary_screen",
                    item_list:{
                        top_left:"2 incoming",
                        top_right:"10 local processed",
                        middle_center:"40.85sosa",
                        bottom_right:"2 scroll processed"
                    }
                }
            ];

            console.log("Updated wallet_start_page:", this.middle_section.wallet_start_page);
        } catch (error) {
            console.error("Error updating wallet data:", error);
        }
    }
 
};

// window.ui_structure = ui_structure;

