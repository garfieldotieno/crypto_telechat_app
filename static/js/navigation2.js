console.log('now loading navigation2.js');

function switch_navigation(page) {
    console.log(`calling switch_navigation with page: ${page}`);
}

function get_country() {
    let userCountry = new Intl.DateTimeFormat('en', { timeZoneName: 'long' }).resolvedOptions().timeZone;
    console.log("User Time Zone:", userCountry);
    return userCountry;
}


function verify_email(inputValue, next) {
    console.log("Verifying email...");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(inputValue)) {
        console.error("Invalid email format.");
        alert("Please enter a valid email address.");
        next(); // Call the next callback to proceed, even if validation fails
        return;
    }

    // Extract the username from the email
    const extractedUsername = inputValue.split("@")[0];
    console.log(`Extracted username: ${extractedUsername}`);

    if (inputValue === "user1@example.com") {
        console.log("Test user detected.");
        update_user_data({ email: inputValue, username: extractedUsername });
        register_user();
        render_start();
    } else {
        // Simulate async processing (e.g., API call)
        setTimeout(() => {
            update_user_data({ email: inputValue, username: extractedUsername });
            console.log(`Email verified: ${inputValue}`);
            next(); // Call the next callback to proceed
        }, 1000);
    }
}


function verify_code(inputValue, next) {
    console.log("Verifying code...");

    // Validate the input value
    if (!inputValue || inputValue.length !== 6) {
        console.error("Invalid verification code.");
        alert("Please enter a valid 6-digit verification code.");
        next(); // Call the next callback to proceed, even if validation fails
        return;
    }

    // Retrieve userData from localStorage
    const userData = JSON.parse(localStorage.getItem("userData")) || {};

    // Save the code to otp_secret
    userData.otp_secret = inputValue;
    localStorage.setItem("userData", JSON.stringify(userData));
    console.log("Updated userData with otp_secret in localStorage:", userData);

    // Simulate async verification
    setTimeout(() => {
        console.log("Code verified. Submitting user data...");

        // Submit user data
        fetch("/api/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        })
            .then((response) => {
                if (response.status === 201) {
                    return response.json(); // Successful user creation
                } else if (response.status === 400) {
                    throw new Error("Invalid OTP");
                } else if (response.status === 500) {
                    throw new Error("Error creating user");
                } else {
                    throw new Error("Unexpected error occurred");
                } 
            })
            .then((data) => {
                console.log("User data submitted successfully:", data);
                init_user(data.data); // Pass the response data to init_user
                update_user_data({ registerd_state:true});
                render_resource_listing_interface('contact_page');
            })
            .catch((error) => {
                console.error(error.message);
                localStorage.removeItem("userData");
                console.log("Cleared userData from localStorage.");
                render_start(); // Assuming there's a function to render the start page
            });

        next(); // Call the next callback to proceed to the next step
    }, 1000); // Simulate async verification
}


// Validate contact name
function validate_contact_name(inputValue, next) {
    console.log("Validating contact name...");
    load_contact_data(); // Load contact data from localStorage
    const nameRegex = /^[a-zA-Z\s]+$/; // Allow only letters and spaces

    if (!nameRegex.test(inputValue)) {
        console.error("Invalid contact name format.");
        alert("Please enter a valid contact name (letters and spaces only).");
        return; // Validation failed, do not proceed
    }

    // Step data into contact_page_data
    update_contact_data({ contact_name: inputValue  });
    console.log("Contact name is valid and saved to contact_page_data.");
    next(); // Validation passed, proceed to the next input
}

// Validate contact email
function validate_contact_email(inputValue, next) {
    console.log("Validating contact email...");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format validation

    if (!emailRegex.test(inputValue)) {
        console.error("Invalid email format.");
        alert("Please enter a valid email address.");
        return; // Validation failed, do not proceed
    }

    // Step data into contact_page_data
    update_contact_data({ contact_email: inputValue  });
    console.log("Contact email is valid and saved to contact_page_data.");
    next(); // Validation passed, proceed to the next input
}


function validate_contact_digits(inputValue, next) {
    console.log("Validating contact digits...");
    const digitsRegex = /^\d{10,15}$/; // Allow only digits, with a length between 10 and 15

    if (!digitsRegex.test(inputValue)) {
        console.error("Invalid contact digits format.");
        alert("Please enter a valid contact number (10-15 digits).");
        return; // Validation failed, do not proceed
    }

    // Fetch `adding_user_id` from `fetch_user_data`
    const userData = fetch_user_data();
    const adding_user_id = userData?.id || null;

    // Step data into contact_page_data
    update_contact_data(
        {
            contact_digits: inputValue,
            adding_user_id: adding_user_id,
            app_user: true, // Default to true
            app_user_id: 2, // Default to 2
        }
    );

    console.log("Contact digits are valid and saved to contact_page_data.");

    // Load the updated contact data
    const contactData = decodeData(localStorage.getItem('contact_page_data'));

    if (contactData) {
        // Call add_contact with the updated data
        add_contact(
            contactData.contact_name,
            contactData.contact_email,
            contactData.contact_digits
        );
    } else {
        console.error("Failed to load contact data from localStorage.");
    }

    next(); // Validation passed, proceed to the next input
}


function add_contact(name, email, phone) {
    console.log("Adding contact with details:", { name, email, phone });

    app_user_data = decodeData(localStorage.getItem('userData'));
    console.log("fetched user data is :", {app_user_data})
    // Prepare the contact data
    const contactData = {
        contact_name: name,
        contact_email: email,
        contact_digits: phone,
        adding_user_id: app_user_data.id,
        app_user : true,
        app_user_id : 2,

    };

    console.log(`posting data should be : ${contactData}`)

    // Post the contact data to the server
    fetch("/api/contact", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
    })
        .then((response) => {
            if (response.status === 201) {
                console.log("Contact added successfully.");
                return response.json();
            } else if (response.status === 400) {
                throw new Error("Invalid contact data.");
            } else {
                throw new Error("Unexpected error occurred while adding contact.");
            }
        })
        .then((data) => {
            console.log("Server response for added contact:", data);
            alert("Contact added successfully!");
            clear_contact_data(); // Clear the contact_page_data after successful addition'
            render_contact_listing('normal'); // Assuming this function renders the contact listing
        })
        .catch((error) => {
            console.error("Error adding contact:", error.message);
            alert("Failed to add contact. Please try again.");
        });
}

function process_select(){
    console.log("Processing select...");
}