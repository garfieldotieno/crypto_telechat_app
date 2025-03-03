// Wait for DOM to load before executing scripts
document.addEventListener("DOMContentLoaded", () => {
    console.log("App Loaded");

    // Get all interfaces
    const interfaces = document.querySelectorAll(".app_container > div");

    // Function to toggle visibility
    function showInterface(targetClass) {
        interfaces.forEach(el => el.classList.add("inactive_interface")); // Hide all
        document.querySelector(`.${targetClass}`).classList.remove("inactive_interface"); // Show target
        DocumentFragment.querySelector(`.${targetClass}`).classList.add('active_interface');
        console.log(`Switched to ${targetClass}`);
    }

    // Start interface
    function show_start_page() {
        showInterface("start_interface");
    }

    // Validate number interface
    function validate_number_interface() {
        showInterface("validate_number_interface");
    }

    // Chat listing
    function show_chat_listing_pad() {
        showInterface("chat_listing_pad");
    }

    // Contact listing
    function show_contact_listing_pad() {
        showInterface("contact_listing_pad");
    }

    // Call listing
    function show_call_listing_pad() {
        showInterface("call_listing_pad");
    }

    // Settings
    function show_settings_interface() {
        showInterface("settings_interface");
    }

    // One-on-one chat
    function show_primary_chat_interface() {
        showInterface("primary_chat_interface");
    }

    // Group chat
    function show_group_chat_interface() {
        showInterface("group_chat_interface");
    }

    // Upload media
    function upload_media_interface() {
        showInterface("upload_media_interface");
    }

    // Example event bindings
    document.querySelector(".start_interface").addEventListener("click", validate_number_interface);
});
