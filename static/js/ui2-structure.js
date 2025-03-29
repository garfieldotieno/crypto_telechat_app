console.log('now loading ui2-structure.js');

start_interface_ui_config = [
    {
        config_name: "start",
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
        ],
        getters : [],
        setters: [],
        transition_function: {name:"render_start_listing", type:"normal"}

    },
    {
        config_name: "verify_identity_1",
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
        ],
        getters : [],
        setters: [],
        transition_function: {name:"render_start_listing_2", type:"input"}
    },
    {
        config_name: "verify_identity_2",
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
        ],
        getters : [],
        setters: [],
        transition_function: {name:"render_start_listing_3", type:"input"}
    }

]


contact_interface_ui_config = [
    {
        top_section : [],
        middle_section : [],
        bottom_section : [],
        getters : [],
        setters: [],
        transition_function: "render_contact_listing"
    },
    {
        top_section : [],
        middle_section: [],
        bottom_section:[],
        getters: [],
        setters: [],
        transition_function: "render_contact_create"
    }
]


chat_interface_ui_config = [
    {
        top_section : [],
        middle_section : [],
        bottom_section : [],
        getters : [],
        setters: [],
        transition_function: "render_chat_listing"
    },
    {
        top_section : [],
        middle_section: [],
        bottom_section:[],
        getters: [],
        setters: [],
        transition_function: "render_chat_listing"
    }
]

chat_message_interface_ui_config = [
    {
        top_section : [],
        middle_section : [],
        bottom_section : [],
        getters : [],
        setters: [],
        polling: true,
        transition_function: "render_chat_message_listing"
    },
]


personal_profile_interface_ui_config = [
    {
        top_section : [],
        middle_section : [],
        bottom_section : [],
        getters : [],
        setters: [],
        transition_function: "render_personal_profile"
    }
]


other_profile_interface_ui_config = [
    {
        top_section : [],
        middle_section : [],
        bottom_section : [],
        getters : [],
        setters: [],
        transition_function: "render_other_profile"
    }
]


group_profile_interface_ui_config = [
    {
        top_section : [],
        middle_section : [],
        bottom_section : [],
        getters : [],
        setters: [],
        transition_function: "render_group_profile"
    }
]


wallet_interface_ui_config = [
    {
        top_section : [],
        middle_section : [],
        bottom_section : [],
        getters : [],
        setters: [],
        transition_function: "render_wallet_interface"
    },
    {
        top_section : [],
        middle_section: [],
        bottom_section:[]
    },
    {
        top_section: [],
        middle_section: [],
        bottom_section: []
    },
    {
        top_section : [],
        middle_section : [],
        bottom_section : []
    },
    {
        top_section : [],
        middle_section: [],
        bottom_section:[]
    },
    {
        top_section: [],
        middle_section: [],
        bottom_section: []
    },
    {
        top_section : [],
        middle_section : [],
        bottom_section : []
    },
    {
        top_section : [],
        middle_section: [],
        bottom_section:[]
    },
    {
        top_section: [],
        middle_section: [],
        bottom_section: []
    },
    {
        top_section : [],
        middle_section : [],
        bottom_section : []
    },
    {
        top_section : [],
        middle_section: [],
        bottom_section:[]
    }
]