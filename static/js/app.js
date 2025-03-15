function set_display() {
    console.log("calling set_display");
 
    document.body.innerHTML = "";

    if (window.innerWidth < 777) {
        console.log("Rendering small screen view");
        render_small_screen_view();
    } else {
        console.log("Rendering big screen view");
        render_big_screen_view();
    }
}

function render_small_screen_view() {
    console.log("calling render_small_screen_view");
    render_start_interface();
}

function render_big_screen_view() {
    console.log("calling render_big_screen_view");
    render_start_interface();
}

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
          item_list: [{ item_type: "button", item_label: "Proceed", action: "render_verify_identity_1" }] 
        }
    ]
};


let verify_identity_1_ui_structure = {
    top_section: [
        { 
            visible: true, 
            component_type: "icon_label", 
            icon: "fa-solid fa-arrow-left", 
            label: "cancel", 
            position: "left",
            action: "render_start_interface" // Back to the start
        },
        { visible: false, component_type: "text", label: "Enter Details", position: "center" },
        { visible: false, component_type: "icon_label", icon: "fa-solid fa-plus", label: "add", position: "right" }
    ],
    middle_section: [
        { 
            visible: true, 
            component_type: "input_field", 
            label: "Your Phone", 
            country: "Kenya", 
            placeholder: "Your phone number"
        }
    ],
    bottom_section: [
        { visible: true, component_type: "button_stack", 
          item_list: [{ item_type: "button", item_label: "Proceed", action: "render_verify_identity_2" }] 
        }
    ]
};


let verify_identity_2_ui_structure = {
    top_section: [
        { 
            visible: true, 
            component_type: "icon_label", 
            icon: "fa-solid fa-arrow-left", 
            label: "cancel", 
            position: "left",
            action: "render_verify_identity_1" // Back to previous step
        },
        { visible: false, component_type: "text", label: "Enter Confirmation Code", position: "center" },
        { visible: false, component_type: "icon_label", icon: "fa-solid fa-plus", label: "add", position: "right" }
    ],
    middle_section: [
        { 
            visible: true, 
            component_type: "input_field", 
            label: "Confirmation Code", 
            placeholder: "Enter the code sent to your phone"
        }
    ],
    bottom_section: [
        { visible: true, component_type: "button_stack", 
          item_list: [{ item_type: "button", item_label: "Confirm", action: "confirm_code" }] 
        }
    ]
};


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

    items.forEach(item => {
        if (item.visible) {
            if (item.component_type === "icon_label") {
                let iconHTML = ` <span class="content_holder">${item.label}</span>`;

                if (item.position === "left") {
                    left_content.innerHTML = iconHTML;
                    
                    // Add Back Navigation Logic (Except for Start Interface)
                    if (item.action) {
                        left_content.classList.add("clickable");
                        left_content.setAttribute("hx-get", `#`);
                        left_content.setAttribute("onclick", `${item.action}()`);
                    }
                    
                } else if (item.position === "right") {
                    right_content.innerHTML = iconHTML;
                }
            } else if (item.component_type === "text") {
                title_content.innerHTML = `<span class="content_holder">${item.label}</span>`;
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
                    <input type="text" placeholder="${item.placeholder}" class="input_field" />
                `;
                break;

            default:
                console.warn(`Unknown component_type: ${item.component_type}`);
        }

        section.appendChild(element);
    });

    return section;
}


function setupPWAInstallButton(installButton) {
    let deferredPrompt; // Store install event for later use

    window.addEventListener("beforeinstallprompt", (event) => {
        event.preventDefault(); // Prevent automatic prompt
        deferredPrompt = event;

        console.log("PWA Install Prompt Available");
        installButton.style.display = "block"; // Show the install button

        installButton.addEventListener("click", () => {
            deferredPrompt.prompt(); // Show install prompt

            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === "accepted") {
                    console.log("User accepted PWA install");
                } else {
                    console.log("User dismissed PWA install");
                }
                installButton.style.display = "none"; // Hide after install
            });
        });
    });
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
                button.innerHTML = `${btn.item_label} <i class="${btn.item_icon}"></i>`;
                button.classList.add("button_item");
                button.setAttribute("onclick", `${btn.action}()`);

                buttonContainer.appendChild(button);
            });

            

            section.appendChild(buttonContainer);
        } 
    });

    return section;
}





// 🎨 Render Start Interface
function render_start_interface() {
    console.log("calling render_start_interface");

    document.body.innerHTML = "";

    let containerClass = window.innerWidth < 777 ? "app_container_small" : "app_container_big";
    let centerContainerClass = window.innerWidth < 777 ? "app_center_container_small" : "app_center_container_big";

    let container = document.createElement("div");
    container.classList.add(containerClass);
    document.body.appendChild(container);

    let centerContainer = document.createElement("div");
    centerContainer.classList.add(centerContainerClass);
    container.appendChild(centerContainer);

    // centerContainer.appendChild(create_top_section(start_ui_structure.top_section));

    // Create middle section and insert the install button
    let middleSection = create_middle_section(start_ui_structure.middle_section);
    

    centerContainer.appendChild(middleSection);
    centerContainer.appendChild(create_bottom_section(start_ui_structure.bottom_section));

	console.log("now adding the download button")
    let buttonContainer = document.getElementsByClassName("button_stack")[0]; // Get first matching element
    
    

    let install_btn = document.createElement("button");
    install_btn.innerHTML = `Download`;
    install_btn.classList.add("button_item");
    buttonContainer.appendChild(install_btn);

    setupPWAInstallButton(install_btn);

}


function render_verify_identity_1() {
    console.log("calling render_verify_identity_1");

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
    centerContainer.appendChild(create_top_section(verify_identity_1_ui_structure.top_section));
    centerContainer.appendChild(create_middle_section(verify_identity_1_ui_structure.middle_section));
    centerContainer.appendChild(create_bottom_section(verify_identity_1_ui_structure.bottom_section));
}


function render_verify_identity_2() {
    console.log("calling render_verify_identity_2");

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
    centerContainer.appendChild(create_top_section(verify_identity_2_ui_structure.top_section));
    centerContainer.appendChild(create_middle_section(verify_identity_2_ui_structure.middle_section));
    centerContainer.appendChild(create_bottom_section(verify_identity_2_ui_structure.bottom_section));
}


// 🚀 Initialize App on Load
document.addEventListener("DOMContentLoaded", () => {
    console.log("App Loaded");
    set_display();
    window.addEventListener("resize", set_display);
});
