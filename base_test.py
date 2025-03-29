import requests
from backend import generate_otp, verify_otp

BASE_URL = "http://localhost:5000/api"

# Create Users
users_payload = [
    {
        "username": "otieno",
        "email": "otienot75@gmail.com",
        "otp_secret": "",
        "wall_image_url": "test_media/background_one.jpeg",
        "profile_image_url": "test_media/otieno.jpeg"
    },
    {
        "username": "garfield",
        "email": "garfield@gmail.com",
        "otp_secret": "",
        "wall_image_url": "test_media/background_two.jpeg",
        "profile_image_url": "test_media/garfield.jpeg"
    },
    {
        "username": "stark",
        "email": "stark@gmail.com",
        "otp_secret": "",
        "wall_image_url": "test_media/background_one.jpeg",
        "profile_image_url": "test_media/stark.jpeg"
    },
    {
        "username": "stark4",
        "email": "stark4@gmail.com",
        "otp_secret": "",
        "wall_image_url": "test_media/background_one.jpeg",
        "profile_image_url": "test_media/stark.jpeg"
    },
    {
        "username": "stark5",
        "email": "stark5@gmail.com",
        "otp_secret": "",
        "wall_image_url": "test_media/background_one.jpeg",
        "profile_image_url": "test_media/stark.jpeg"
    },
    {
        "username": "stark6",
        "email": "stark6@gmail.com",
        "otp_secret": "",
        "wall_image_url": "test_media/background_one.jpeg",
        "profile_image_url": "test_media/stark.jpeg"
    },
    {
        "username": "stark7",
        "email": "stark7@gmail.com",
        "otp_secret": "",
        "wall_image_url": "test_media/background_one.jpeg",
        "profile_image_url": "test_media/stark.jpeg"
    },
    {
        "username": "stark8",
        "email": "stark8@gmail.com",
        "otp_secret": "",
        "wall_image_url": "test_media/background_one.jpeg",
        "profile_image_url": "test_media/stark.jpeg"
    },
    {
        "username": "stark9",
        "email": "stark9@gmail.com",
        "otp_secret": "",
        "wall_image_url": "test_media/background_one.jpeg",
        "profile_image_url": "test_media/stark.jpeg"
    },
    {
        "username": "stark10",
        "email": "stark10@gmail.com",
        "otp_secret": "",
        "wall_image_url": "test_media/background_one.jpeg",
        "profile_image_url": "test_media/stark.jpeg"
    },
    {
        "username": "stark11",
        "email": "stark11@gmail.com",
        "otp_secret": "",
        "wall_image_url": "test_media/background_one.jpeg",
        "profile_image_url": "test_media/stark.jpeg"
    },
    {
        "username": "stark12",
        "email": "stark12@gmail.com",
        "otp_secret": "",
        "wall_image_url": "test_media/background_one.jpeg",
        "profile_image_url": "test_media/stark.jpeg"
    },
    {
        "username": "stark13",
        "email": "stark13@gmail.com",
        "otp_secret": "",
        "wall_image_url": "test_media/background_one.jpeg",
        "profile_image_url": "test_media/stark.jpeg"
    },
    {
        "username": "stark14",
        "email": "stark14@gmail.com",
        "otp_secret": "",
        "wall_image_url": "test_media/background_one.jpeg",
        "profile_image_url": "test_media/stark.jpeg"
    },
    {
        "username": "stark15",
        "email": "stark15@gmail.com",
        "otp_secret": "",
        "wall_image_url": "test_media/background_one.jpeg",
        "profile_image_url": "test_media/stark.jpeg"
    },
    {
        "username": "stark16",
        "email": "stark16@gmail.com",
        "otp_secret": "",
        "wall_image_url": "test_media/background_one.jpeg",
        "profile_image_url": "test_media/stark.jpeg"
    },
    {
        "username": "stark17",
        "email": "stark17@gmail.com",
        "otp_secret": "",
        "wall_image_url": "test_media/background_one.jpeg",
        "profile_image_url": "test_media/stark.jpeg"
    },
    {
        "username": "stark18",
        "email": "stark18@gmail.com",
        "otp_secret": "",
        "wall_image_url": "test_media/background_one.jpeg",
        "profile_image_url": "test_media/stark.jpeg"
    },
    {
        "username": "stark19",
        "email": "stark19@gmail.com",
        "otp_secret": "",
        "wall_image_url": "test_media/background_one.jpeg",
        "profile_image_url": "test_media/stark.jpeg"
    },
    {
        "username": "stark20",
        "email": "stark20@gmail.com",
        "otp_secret": "",
        "wall_image_url": "test_media/background_one.jpeg",
        "profile_image_url": "test_media/stark.jpeg"
    },
    
]

transform_payload = []
print(f"current transform_upload before otp update is : {transform_payload}")

for user in users_payload:
    # generate otp
    otp = generate_otp(user['email'])
    # update otp_secret
    user['otp_secret'] = otp

    transform_payload.append(user)

print(f"current transform_upload after otp update is : {transform_payload}")
     

for user in transform_payload:
    response = requests.post(f"{BASE_URL}/user", json=user)
    print(response.json())

# Create Group
group_payload = {
    "name": "CartoonNetworkFanbase",
    "creator_id": 1
}

response = requests.post(f"{BASE_URL}/group", json=group_payload)
print(response.json())

# Create Single Chats
single_chats_payload = [
    {
        "creator_id": 1,
        "chat_type": "single"
    },
    {
        "creator_id": 1,
        "chat_type": "single"
    },
    {
        "creator_id": 1,
        "chat_type": "single"
    },
    {
        "creator_id": 1,
        "chat_type": "single"
    },
    {
        "creator_id": 1,
        "chat_type": "single"
    },
    {
        "creator_id": 1,
        "chat_type": "single"
    },
    {
        "creator_id": 1,
        "chat_type": "single"
    },
    {
        "creator_id": 1,
        "chat_type": "single"
    },
    {
        "creator_id": 1,
        "chat_type": "single"
    },
    {
        "creator_id": 1,
        "chat_type": "single"
    },
    {
        "creator_id": 1,
        "chat_type": "single"
    },
    {
        "creator_id": 1,
        "chat_type": "single"
    },
    {
        "creator_id": 1,
        "chat_type": "single"
    },
    {
        "creator_id": 1,
        "chat_type": "single"
    },
    {
        "creator_id": 1,
        "chat_type": "single"
    },
    {
        "creator_id": 1,
        "chat_type": "single"
    }

]

for chat in single_chats_payload:
    response = requests.post(f"{BASE_URL}/chat/single", json=chat)
    print(response.json())

# Create Group Chat
group_chat_payload = {
    "creator_id": 1,
    "chat_type": "group"
}

response = requests.post(f"{BASE_URL}/chat/group", json=group_chat_payload)
print(response.json())

# Add Chat Members
chat_members_payload = [
    {
        "chat_id": 1,
        "user_id": 2
    },
    {
        "chat_id": 2,
        "user_id": 3
    },
    {
        "chat_id": 3,
        "user_id": 2
    },
    {
        "chat_id": 3,
        "user_id": 3
    }
]

for member in chat_members_payload:
    response = requests.post(f"{BASE_URL}/chat/member", json=member)
    print(response.json())

# Create Single Chat Messages
chat_1_messages_payload = [
    {
        "user_id": 1,
        "chat_id": 1,
        "content": "Do you remember the Powerpuff Girls?"
    },
    {
        "user_id": 2,
        "chat_id": 1,
        "content": "Yes, they were awesome!"
    },
    {
        "user_id": 1,
        "chat_id": 1,
        "content": "Who was your favorite character?"
    },
    {
        "user_id": 2,
        "chat_id": 1,
        "content": "I liked Bubbles the most."
    },
    {
        "user_id": 1,
        "chat_id": 1,
        "content": "Bubbles was great! I liked Blossom."
    },
    {
        "user_id": 2,
        "chat_id": 1,
        "content": "Blossom was the leader, right?"
    },
    {
        "user_id": 1,
        "chat_id": 1,
        "content": "Yes, she was the leader."
    },
    {
        "user_id": 2,
        "chat_id": 1,
        "content": "What about Mojo Jojo?"
    },
    {
        "user_id": 1,
        "chat_id": 1,
        "content": "Mojo Jojo was a funny villain."
    },
    {
        "user_id": 2,
        "chat_id": 1,
        "content": "Yeah, he was hilarious!"
    }
]

for message in chat_1_messages_payload:
    response = requests.post(f"{BASE_URL}/chat/single/message", data=message)
    print(response.json())

chat_2_messages_payload = [
    {
        "user_id": 1,
        "chat_id": 2,
        "content": "Do you remember Dexter's Laboratory?"
    },
    {
        "user_id": 3,
        "chat_id": 2,
        "content": "Yes, Dexter was a genius!"
    },
    {
        "user_id": 1,
        "chat_id": 2,
        "content": "Who was your favorite character?"
    },
    {
        "user_id": 3,
        "chat_id": 2,
        "content": "I liked Dee Dee."
    },
    {
        "user_id": 1,
        "chat_id": 2,
        "content": "Dee Dee was always causing trouble."
    },
    {
        "user_id": 3,
        "chat_id": 2,
        "content": "Yes, she was so funny."
    },
    {
        "user_id": 1,
        "chat_id": 2,
        "content": "What about Mandark?"
    },
    {
        "user_id": 3,
        "chat_id": 2,
        "content": "Mandark was Dexter's rival."
    },
    {
        "user_id": 1,
        "chat_id": 2,
        "content": "Yes, he was always trying to outsmart Dexter."
    },
    {
        "user_id": 3,
        "chat_id": 2,
        "content": "But Dexter always won in the end."
    }
]

for message in chat_2_messages_payload:
    response = requests.post(f"{BASE_URL}/chat/single/message", data=message)
    print(response.json())

# Create Group Chat Messages
group_chat_messages_payload = [
    {
        "user_id": 1,
        "chat_id": 3,
        "content": "Welcome to the Cartoon Network Fanbase!"
    },
    {
        "user_id": 2,
        "chat_id": 3,
        "content": "Thanks! I'm excited to be here."
    },
    {
        "user_id": 3,
        "chat_id": 3,
        "content": "Me too! I love Cartoon Network."
    },
    {
        "user_id": 1,
        "chat_id": 3,
        "content": "What's your favorite show?"
    },
    {
        "user_id": 2,
        "chat_id": 3,
        "content": "I love the Powerpuff Girls."
    },
    {
        "user_id": 3,
        "chat_id": 3,
        "content": "Dexter's Laboratory is my favorite."
    },
    {
        "user_id": 1,
        "chat_id": 3,
        "content": "Both are great shows!"
    },
    {
        "user_id": 2,
        "chat_id": 3,
        "content": "Yes, they are!"
    },
    {
        "user_id": 3,
        "chat_id": 3,
        "content": "I also like Johnny Bravo."
    },
    {
        "user_id": 1,
        "chat_id": 3,
        "content": "Johnny Bravo is hilarious!"
    }
]

for message in group_chat_messages_payload:
    response = requests.post(f"{BASE_URL}/chat/group/message", data=message)
    print(response.json())

# Create Single Accounts
single_accounts_payload = [
    {
        "user_id": 1,
        "initial_balance": 0.0
    },
    {
        "user_id": 2,
        "initial_balance": 0.0
    },
    {
        "user_id": 3,
        "initial_balance": 0.0
    }
]

for account in single_accounts_payload:
    response = requests.post(f"{BASE_URL}/wallet/single", json=account)
    print(response.json())

# Create Group Account
group_account_payload = {
    "group_id": 1,
    "initial_balance": 0.0
}

response = requests.post(f"{BASE_URL}/wallet/group", json=group_account_payload)
print(response.json())

# Add Group Account Members
group_account_members_payload = [
    {
        "group_id": 1,
        "user_id": 2
    },
    {
        "group_id": 1,
        "user_id": 3
    }
]

for member in group_account_members_payload:
    response = requests.post(f"{BASE_URL}/wallet/group/member", json=member)
    print(response.json())

# Load Amount to Single Accounts
load_single_accounts_payload = [
    {
        "account_id": 1,
        "amount": 100.0
    },
    {
        "account_id": 2,
        "amount": 100.0
    },
    {
        "account_id": 3,
        "amount": 100.0
    }
]

for load in load_single_accounts_payload:
    response = requests.post(f"{BASE_URL}/wallet/load_single", json=load)
    print(response.json())

# Load Amount to Group Account
load_group_account_payload = {
    "account_id": 1,
    "amount": 650.0
}

response = requests.post(f"{BASE_URL}/wallet/load_group", json=load_group_account_payload)
print(response.json())

# Send to Person Account
send_to_person_payloads = [
    {
        "from_account_id": 1,
        "to_account_id": 3,
        "amount": 10.0,
        "from_account_type": "single"
    },
    {
        "from_account_id": 1,
        "to_account_id": 2,
        "amount": 50.0,
        "from_account_type": "group"
    }
]

for send in send_to_person_payloads:
    response = requests.post(f"{BASE_URL}/wallet/send_to_person", json=send)
    print(response.json())

# Send to Group Account
send_to_group_payload = {
    "from_account_id": 1,
    "to_group_id": 1,
    "amount": 15.0,
    "from_account_type": "single"
}

response = requests.post(f"{BASE_URL}/wallet/send_to_group", json=send_to_group_payload)
print(response.json())

# Withdraw Normal
withdraw_normal_payload = {
    "account_id": 2,
    "amount": 30.0
}

response = requests.post(f"{BASE_URL}/wallet/withdraw", json=withdraw_normal_payload)
print(response.json())

# Withdraw Group Request
withdraw_group_request_payload = {
    "group_id": 1,
    "amount": 100.0
}

response = requests.post(f"{BASE_URL}/wallet/withdraw_group_request", json=withdraw_group_request_payload)
print(response.json())

# Sign Group Withdrawal Request
sign_group_withdrawal_payloads = [
    {
        "group_id": 1,
        "request_id": 1,
        "user_id": 1
    },
    {
        "group_id": 1,
        "request_id": 1,
        "user_id": 2
    },
    {
        "group_id": 1,
        "request_id": 1,
        "user_id": 3
    }
]

for sign in sign_group_withdrawal_payloads:
    response = requests.post(f"{BASE_URL}/wallet/sign_group_withdrawal", json=sign)
    print(response.json())

# Create Contacts
contacts_payload = [
    {
        "adding_user_id": 1,
        "contact_digits": "1234567890",
        "contact_name": "John Doe",
        "contact_email": "garfield@gmail.com",
        "app_user": True,
        "app_user_id": 2
    },
    {
        "adding_user_id": 1,
        "contact_digits": "0987654321",
        "contact_name": "Jane Smith",
        "contact_email": "stark@gmail.com",
        "app_user": True,
        "app_user_id": 3
    }
]

for contact in contacts_payload:
    response = requests.post(f"{BASE_URL}/contact", json=contact)
    print(response.json())