function set_display() {
    console.log("calling set_display");

    // Clear the entire body before adding new elements
    document.body.innerHTML = "";

    if (window.innerWidth < 777) {
        console.log("Rendering small screen view");
        render_small_screen_view();
    } else {
        console.log("Rendering big screen view");
        render_big_screen_view();
    }
}

// Function to create small screen structure
function render_small_screen_view() {
    console.log("calling render_small_screen_view");

    let smallContainer = document.createElement("div");
    smallContainer.classList.add("app_container_small");

    let centerContainer = document.createElement("div");
    centerContainer.classList.add("app_center_container_small");
    // begin render function section

    // example function render_start_interface
    render_start_interface()
    // end render function
    
    smallContainer.appendChild(centerContainer);
    document.body.appendChild(smallContainer); // Attach directly to body
}



// Function to create big screen structure
function render_big_screen_view() {
    console.log("calling render_big_screen_view");

    let bigContainer = document.createElement("div");
    bigContainer.classList.add("app_container_big");

    let centerContainer = document.createElement("div");
    centerContainer.classList.add("app_center_container_big");


    // begin render function section
    

    // Top section
        let top_section = document.createElement("div");
        top_section.classList.add("top_section");
        let first_content = "";
        let title_content = "";
        let right_content = "";
        
        update_top_section(first_content, title_content, right_content);
    
        // Add a paragraph for top_section
        let paragraph_top = document.createElement("p");
        paragraph_top.textContent = "This is top_section";
        paragraph_top.style.textAlign = "center"; 
    
        top_section.appendChild(paragraph_top);
    
        // Middle section
        let middle_section = document.createElement("div");
        middle_section.classList.add("middle_section");
    
        let middle_component_item = document.createElement("div");
        
        update_middle_section([middle_component_item]);
    
        // Add a paragraph for middle_section
        let paragraph_middle = document.createElement("p");
        paragraph_middle.textContent = "This is middle_section added content"; 
        paragraph_middle.style.textAlign = "center"; 
    
        middle_section.appendChild(paragraph_middle);
    
        // Bottom section
        let bottom_section = document.createElement("div");
        bottom_section.classList.add("bottom_section");
    
        let bottom_component_item = document.createElement("div");
        
        update_bottom_section([bottom_component_item]);
    
        // Add a paragraph for bottom_section
        let paragraph_bottom = document.createElement("p");
        paragraph_bottom.textContent = "This is bottom_section"; 
        paragraph_bottom.style.textAlign = "center"; 
    
        bottom_section.appendChild(paragraph_bottom);
    
        // Append sections to center container
        centerContainer.appendChild(top_section);
        centerContainer.appendChild(middle_section);
        centerContainer.appendChild(bottom_section);
    
    // end render function
    
    bigContainer.appendChild(centerContainer);
    document.body.appendChild(bigContainer); // Attach directly to body
}


function update_top_section(first_content,middle_content, left_content){
	console.log("update_top_section");
	// start by adding current paragraph
}

function update_middle_section([component_item,]){
	console.log("update_middlle_section");
	// start by adding current paragraph
}

function update_bottom_section([component_item,]){
	console.log("update_bottom_section");
	// start by adding current paragraph
}


function render_start_interface() {
    console.log("calling render_start_interface");

    let container = document.createElement("div");
    container.classList.add(window.innerWidth < 777 ? "app_container_small" : "app_container_big");

    let centerContainer = document.createElement("div");
    centerContainer.classList.add(window.innerWidth < 777 ? "app_center_container_small" : "app_center_container_big");

    // Top section
    let top_section = document.createElement("div");
    top_section.classList.add("top_section");
    let first_content = "";
    let title_content = "";
    let right_content = "";

    update_top_section(first_content, title_content, right_content);

    // Add a paragraph for top_section
    let paragraph_top = document.createElement("p");
    paragraph_top.textContent = "This is top_section";
    paragraph_top.style.textAlign = "center";

    top_section.appendChild(paragraph_top);

    // Middle section
    let middle_section = document.createElement("div");
    middle_section.classList.add("middle_section");

    let middle_component_item = document.createElement("div");

    update_middle_section([middle_component_item]);

    // Add a paragraph for middle_section
    let paragraph_middle = document.createElement("p");
    paragraph_middle.textContent = "This is middle_section added content";
    paragraph_middle.style.textAlign = "center";

    middle_section.appendChild(paragraph_middle);

    // Bottom section
    let bottom_section = document.createElement("div");
    bottom_section.classList.add("bottom_section");

    let bottom_component_item = document.createElement("div");

    update_bottom_section([bottom_component_item]);

    // Add a paragraph for bottom_section
    let paragraph_bottom = document.createElement("p");
    paragraph_bottom.textContent = "This is bottom_section";
    paragraph_bottom.style.textAlign = "center";

    bottom_section.appendChild(paragraph_bottom);

    // Append sections to center container
    centerContainer.appendChild(top_section);
    centerContainer.appendChild(middle_section);
    centerContainer.appendChild(bottom_section);

    container.appendChild(centerContainer);
    document.body.appendChild(container); // Attach directly to body
}

function render_verify_identity_one(){
	console.log("calling render_verify_identity_one");
}

function render_verify_identity_two(){
	console.log("calling render_verify_identity_two");
}


// Call initially & on resize
set_display();
window.addEventListener("resize", set_display);


// Wait for DOM to load before executing scripts
document.addEventListener("DOMContentLoaded", () => {
    console.log("App Loaded");
    set_display();
});
