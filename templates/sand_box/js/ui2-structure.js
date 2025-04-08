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
            { visible: true, component_type: "icon_label", icon: "fa-solid fa-arrow-left", label: "Back", position: "left" },
            { visible: true, component_type: "text", label: "Profile", position: "center" },
            { visible: true, component_type: "icon_label", icon: "fa-solid fa-edit", label: "Edit", position: "right" }
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
            { visible: true, component_type: "icon_label", icon: "fa-solid fa-trash", label: "Delete", position: "left" },
            { visible: true, component_type: "text", label: "Contacts", position: "center" },
            { visible: true, component_type: "icon_label", icon: "fa-solid fa-user-plus", label: "Add Contact", position: "right" }
        ],
        chat_page: [
            { visible: true, component_type: "icon_label", icon: "fa-solid fa-trash", label: "Delete", position: "left" },
            { visible: true, component_type: "text", label: "Chat", position: "center" },
            { visible: true, component_type: "icon_label", icon: "fa-solid fa-ellipsis-v", label: "Options", position: "right" }
        ],
        create_page: [
            { visible: true, component_type: "icon_label", icon: "fa-solid fa-arrow-left", label: "Back", position: "left" },
            { visible: true, component_type: "text", label: "Create", position: "center" },
            { visible: false, component_type: "icon_label", icon: "fa-solid fa-plus", label: "Add", position: "right" }
        ],
        chat_message_page: [
            { visible: true, component_type: "icon_label", icon: "fa-solid fa-arrow-left", label: "Back", position: "left" },
            { visible: true, component_type: "text", label: "Messages", position: "center" },
            { visible: true, component_type: "icon_label", icon: "fa-solid fa-info-circle", label: "Info", position: "right" }
        ]
    },
    
    middle_section: {
        start_page: [
            { visible: true, component_type: "background_image", img_src: "images/SplashScreen.png" }
        ],
        wallet_start_page: [
            { visible: true, component_type: "profile_image", img_src: "images/profile.png" },
            { visible: true, component_type: "profile_background_image", img_src: "static/images/wallet_background.png" },
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
            { visible: true, component_type: "profile_image", img_src: "images/profile.png" },
            { visible: true, component_type: "profile_background_image", img_src: "static/images/profile_background.png" },
            { visible: true, component_type: "separation_title", label: "Information" },
            { visible: true, component_type: "info_section", action: "show_profile_information()" },
            { visible: true, component_type: "label_item", label: "Username", action: "copy_username()" },
            { visible: true, component_type: "label_item", label: "Email", action: "copy_email()" },
            { visible: true, component_type: "label_item", label: "Wallet", action: "copy_wallet()" }
        ],
        other_profile_page: [
            { visible: true, component_type: "profile_image", img_src: "images/other_profile.png" },
            { visible: true, component_type: "profile_background_image", img_src: "static/images/other_profile_background.png" },
            { visible: true, component_type: "separation_title", label: "Information" },
            { visible: true, component_type: "info_section", action: "show_profile_information()" },
            { visible: true, component_type: "label_item", label: "Username", action: "copy_username()" },
            { visible: true, component_type: "label_item", label: "Email", action: "copy_email()" },
            { visible: true, component_type: "label_item", label: "Wallet", action: "copy_wallet()" },
            { visible: true, component_type: "separation_title", label: "Groups" },
            { visible: true, component_type: "resource_listing_interface", resource_type: "chats:groups", action: "list_common_groups()" }
        ],
        group_profile_page: [
            { visible: true, component_type: "profile_image", img_src: "images/group_profile.png" },
            { visible: true, component_type: "profile_background_image", img_src: "static/images/group_profile_background.png" },
            { visible: true, component_type: "separation_title", label: "Information" },
            { visible: true, component_type: "info_section", action: "show_profile_information()" },
            { visible: true, component_type: "label_item", label: "Username", action: "copy_username()" },
            { visible: true, component_type: "label_item", label: "Email", action: "copy_email()" },
            { visible: true, component_type: "label_item", label: "Wallet", action: "copy_wallet()" },
            { visible: true, component_type: "separation_title", label: "Members" },
            { visible: true, component_type: "resource_listing_interface", resource_type: "chats:chat_members", action: "list_group_members()" }
        ],
        contact_page: [{
            visible: true,
            component_type: "list_pad",
            item_list: [
                
                ...get_my_chats(), // Function is called here to dynamically fetch chat data
            ]
        }],
        chat_page: [{
            visible: true,
            component_type: "list_pad",
            item_list: [
                
                ...get_my_chats(), // Function is called here to dynamically fetch chat data
            ]
        }],
        create_page: [

        ],
        chat_message_page: []
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
        wallet_about_page: [],
        personal_profile_page: [],
        other_profile_page: [],
        group_profile_page: [],
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
        create_page: [
            { visible: true, component_type: "button_stack", 
                item_list: [{ item_type: "button", item_label: "Proceed", action: "step_navigation('verify_identity_1')" }] 
            }
        ],
        chat_message_page: [
            { visible: true, component_type: "input_stack", 
                item_list: [
                    { item_type: "icon", icon: "fa-solid fa-paperclip", action: "attach_file()" },
                    { item_type: "input", placeholder: "Type a message...", id: "message_input" },
                    { item_type: "icon", icon: "fa-solid fa-arrow-right", action: "send_message()" }
                ]
            }
        ]
    }
};

// Export or make the structure globally accessible if needed
window.ui_structure = ui_structure;

const create_input_structure = {
    create_user: {
        inputs: [
            
            { visible: true, component_type: "input_field", placeholder: "Enter your email", id: "email_input", name: "email" },
            { visible: true, component_type: "input_field", placeholder: "Enter verification code", id: "verification_code_input", name:"otp_secret" }
        ],
        processors: [
            verify_email, verify_code
        ]
    }
};

window.create_input_structure = create_input_structure;