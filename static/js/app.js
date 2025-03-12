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
   	console.log("calling render_small_screen_view")

    // example function render_start_interface
    render_start_interface();
}



// Function to create big screen structure
function render_big_screen_view() {
    console.log("calling render_big_screen_view");

    // begin render function section
	render_start_interface();
}



function update_top_section(visible_state, left_item_content, middle_content, right_item_content){
	console.log("update_top_section");

    let top_section = document.querySelector(".top_section");
    
    if(visible_state == "invisible"){
        top_section.style.display = "none";
    }
    else{
        // lets display the top section such that first_content: fa fa-arrow-left "back", h3 to show middle conent, left_content = ""
        let left_content = document.createElement("h3");
        left_content.classList.add("left_content");
        left_content.innerHTML = left_item_content;

        let title_content = document.createElement("h3");
        title_content.classList.add("title_content");
        title_content.innerHTML = middle_content;

        let right_content = document.createElement("h3");
        right_content.classList.add("right_content");
        right_content.innerHTML = right_item_content;

        // create a content for free
        let content_container = document.createElement("div");
        content_container.classList.add("content_container");

        
        // add,then display block
        content_container.appendChild(left_content);
        content_container.appendChild(title_content);
        content_container.appendChild(right_content);


        top_section.appendChild(content_container);
        

        top_section.style.display = "block";
    }
	
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

    document.body.innerHTML = "";

    // Determine container classes based on screen size
    let containerClass = window.innerWidth < 777 ? "app_container_small" : "app_container_big";
    let centerContainerClass = window.innerWidth < 777 ? "app_center_container_small" : "app_center_container_big";

    // If the container does not exist, create and append it
    container = document.createElement("div");
    container.classList.add(containerClass);
    document.body.appendChild(container);
   

    // If the center container does not exist, create and append it
    centerContainer = document.createElement("div");
    centerContainer.classList.add(centerContainerClass);
    container.appendChild(centerContainer);

    // Clear existing content inside the center container
    centerContainer.innerHTML = "";

    // Create and append top section
    let top_section = document.createElement("div");
    top_section.classList.add("top_section");

    let left_content = ``;
    
    let title_content = "Welcome";
    
    let right_content = ``;

    // Create and append middle section
    let middle_section = document.createElement("div");
    middle_section.classList.add("middle_section");

    let paragraph_middle = document.createElement("p");
    paragraph_middle.textContent = "This is middle_section added content";
    paragraph_middle.style.textAlign = "center";

    middle_section.appendChild(paragraph_middle);

    // Create and append bottom section
    let bottom_section = document.createElement("div");
    bottom_section.classList.add("bottom_section");

    let paragraph_bottom = document.createElement("p");
    paragraph_bottom.textContent = "This is bottom_section";
    paragraph_bottom.style.textAlign = "center";

    bottom_section.appendChild(paragraph_bottom);

    // Append sections to the center container
    centerContainer.appendChild(top_section);
    centerContainer.appendChild(middle_section);
    centerContainer.appendChild(bottom_section);

    update_top_section("visible", left_content, title_content, right_content);
}



function render_app_interface(){
	console.log("calling render_app_interface");
	
}

function render_verify_identity_one_interface(){
	console.log("calling render_verify_identity_one");
}

function render_verify_identity_two_interface(){
	console.log("calling render_verify_identity_two");
}

function navigation_bar(){
	console.log("rendering navigation bar");
}

function render_list_pad_contacts(){
	console.log("rendering listing_pad_container");
}


function render_settings(){
	console.log("calling render_settigns");
}

// Wait for DOM to load before executing scripts
document.addEventListener("DOMContentLoaded", () => {
    console.log("App Loaded");
    set_display();
    window.addEventListener("resize", set_display);
});
