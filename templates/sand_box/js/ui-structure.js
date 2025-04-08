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
            placeholder: "Your email address",
            id: "email"
        }
    ],
    bottom_section: [
        { visible: true, component_type: "button_stack", 
          item_list: [{ item_type: "button", item_label: "Proceed", action: "step_navigation('verify_identity_2')" }] 
        }
    ]
};



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
            placeholder: "Enter the code sent to your email",
            id: "otp_code"
        }
    ],
    bottom_section: [
        { visible: true, component_type: "button_stack", 
          item_list: [
            { item_type: "button", item_label: "Confirm", action: "step_navigation('chat_listing')" }] 
        }
    ]
};



let chat_listing_ui_structure = {
    top_section: [
        { visible: false, component_type: "icon_label", icon: "fa-regular fa-arrow-left", label: "Edit", position: "left" },
        { visible: true, component_type: "text", label: "Chats", position: "center" },
        { visible: true, component_type: "icon_label", icon: "fa-regular fa-pen-to-square", label: "Add", position:"right", action:"step_navigation('create_chat')" },
        { visible: true, component_type: 'item_search', placeholder: "Search"}
    ],

    middle_section: [
        {
            visible: true,
            component_type: "list_pad",
            item_list: [
                
                ...get_my_chats(), // Function is called here to dynamically fetch chat data
            ]
        }
    ],

    bottom_section: [
        { visible:true, component_type: "navbar", 
            item_list: [
            { item_type: "navbar_item", icon: "fa-solid fa-address-book", label: "Contacts" },
            { item_type: "navbar_item", icon: "fa-solid fa-wallet", label: "Wallet" },
            { item_type: "navbar_item", icon: "fa-solid fa-comments", label: "Chats" },
            { item_type: "navbar_item", icon: "fa-solid fa-user", label: "Profile" }
            ]
        }
    ]
};



let contact_listing_ui_structure = {
    top_section: [  
        { visible: false, component_type: "icon_label", icon: "fa-regular fa-arrow-left", label: "back", position: "left" },
        { visible: true, component_type: "text", label: "Contacts", position: "center" },
        { visible: true, component_type: "icon_label", icon: "fa-regular fa-pen-to-square", label: "add", position: "right", action:"step_navigation('create_contact')"},
        { visible: true, component_type: 'item_search', placeholder: "Search"}
    ],

    middle_section: [
        {
            visible: true,
            component_type: "list_pad",
            item_list: [
                
                ...get_my_contacts(), // ✅ Function is called inside `item_list`
                
            ]
        }
    ],

    bottom_section: [
        { visible:true, component_type: "navbar", 
            item_list: [
            { item_type: "navbar_item", icon: "fa-solid fa-address-book", label: "Contacts" },
            { item_type: "navbar_item", icon: "fa-solid fa-wallet", label: "Wallet" },
            { item_type: "navbar_item", icon: "fa-solid fa-comments", label: "Chats" },
            { item_type: "navbar_item", icon: "fa-solid fa-user", label: "Profile" }
            ]
        }
    ]
};




let personal_profile_ui_structure = {
    top_section: [
        { visible: true, component_type: "icon_label", icon: "", label: "Cancel", position: "left", action: "render_chat_listing" },
        { visible: true, component_type: "text", label: "Profile", position: "center" },
        { visible: false, component_type: "icon_label", icon: "", label: "", position: "right" },
        { visible: true, component_type: 'item_search', placeholder: "Search"}
    ],

    middle_section: [
        {
            visible: true,
            component_type: "profile_info",
            item_list: [
                { item_type: "profile_image", src: "path/to/profile_image.jpg" },
                { item_type: "profile_details", username: "Username", wallet_address: "Wallet Address", action: "render_wallet_interface" }
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

    bottom_section: [
        { visible:true, component_type: "navbar", 
            item_list: [
            { item_type: "navbar_item", icon: "fa-solid fa-address-book", label: "Contacts" },
            { item_type: "navbar_item", icon: "fa-solid fa-wallet", label: "Wallet" },
            { item_type: "navbar_item", icon: "fa-solid fa-comments", label: "Chats" },
            { item_type: "navbar_item", icon: "fa-solid fa-user", label: "Profile" }
            ]
        }
    ]
};

let create_chat_ui_structure = {
    top_section: [
        { visible: true, component_type: "icon_label", icon: "fa-solid fa-arrow-left", label: "Cancel", position: "left", action: "render_chat_listing" },
        { visible: true, component_type: "text", label: "Create Chat", position: "center" },
        { visible: false, component_type: "icon_label", icon: "", label: "", position: "right" }
    ],
    middle_section: [
        { visible: true, component_type: "selection_input", options: ["single", "group"], id: "chat_type" },
    ],
    bottom_section: [
        { visible: true, component_type: "button_stack", 
          item_list: [{ item_type: "button", item_label: "Proceed", action: "add_chat()" }] 
        }
    ]
};


let create_contact_ui_structure = {
    top_section: [
        { visible: true, component_type: "icon_label", icon: "fa-solid fa-arrow-left", label: "Cancel", position: "left", action: "render_contact_listing" },
        { visible: true, component_type: "text", label: "Create Contact", position: "center" },
        { visible: false, component_type: "icon_label", icon: "", label: "", position: "right" }
    ],
    middle_section: [
        { visible: true, component_type: "input_field", label: "Name", placeholder: "Enter name", id: "contact_name" },
        { visible: true, component_type: "input_field", label: "Email Address", placeholder: "Enter email address", id: "contact_email" },
        { visible: true, component_type: "input_field", label: "Phone Number", placeholder: "Enter phone number", id: "contact_phone" }
    ],
    bottom_section: [
        { visible: true, component_type: "button_stack", 
          item_list: [{ item_type: "button", item_label: "Proceed", action: "verify_contact()" }] 
        }
    ]
};
