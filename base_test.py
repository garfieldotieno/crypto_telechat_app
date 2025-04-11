import requests
from backend import generate_otp, verify_otp

BASE_URL = "http://localhost:5000/api"

# Create Users (1 test user + 10 additional users)
users_payload = [
    {
        "username": f"user{i}",
        "email": f"user{i}@example.com",
        "otp_secret": "",
        "wall_image_url": f"test_media/background_{i}.jpeg",
        "profile_image_url": f"test_media/user{i}.jpeg"
    }
    for i in range(1, 12)
]

transform_payload = []
print(f"current transform_upload before otp update is : {transform_payload}")

for user in users_payload:
    # Generate OTP
    otp = generate_otp(user['email'])
    # Update OTP secret
    user['otp_secret'] = otp
    transform_payload.append(user)

print(f"current transform_upload after otp update is : {transform_payload}")

for user in transform_payload:
    response = requests.post(f"{BASE_URL}/user", json=user)
    print(response.json())

# Create Contacts (10 contacts created by test user)
contacts_payload = [
    {
        "adding_user_id": 1,  # Test user
        "contact_digits": f"123456789{i}",
        "contact_name": f"Contact {i}",
        "contact_email": f"user{i+1}@example.com",
        "app_user": True,
        "app_user_id": i + 1
    }
    for i in range(1, 11)
]

for contact in contacts_payload:
    response = requests.post(f"{BASE_URL}/contact", json=contact)
    print(response.json())

# Create 4 Single Chats (created by test user)
single_chats_payload = [
    {
        "creator_id": 2,  # Test user
        "chat_type": "single"
    }
    for _ in range(4)
]


def add_single_chats():
    for chat in single_chats_payload:
        response = requests.post(f"{BASE_URL}/chat/single", json=chat)
        print(response.json())

# Add Chat Members for Single Chats
single_chat_members_payload = [
    {
        "chat_id": chat_id,
        "user_id": chat_id + 1  # Assign user IDs 2, 3, 4, 5 to chats 1, 2, 3, 4
    }
    for chat_id in range(1, 5)
]

for member in single_chat_members_payload:
    response = requests.post(f"{BASE_URL}/chat/member", json=member)
    print(response.json())

# Create 1 Group Chat (created by test user, including 6 users/contacts)
group_chat_payload = {
    "creator_id": 1,  # Test user
    "chat_type": "group"
}

response = requests.post(f"{BASE_URL}/chat/group", json=group_chat_payload)
print(response.json())

# Add 6 members to the group chat
group_chat_members_payload = [
    {
        "chat_id": 1,  # Assuming the group chat ID is 1
        "user_id": i
    }
    for i in range(2, 8)  # Users 2 to 7
]


for member in group_chat_members_payload:
    response = requests.post(f"{BASE_URL}/chat/member", json=member)
    print(response.json())

# Sample 10 messages for each of the 4 single chats
single_chat_messages_payload = [
    [
        {
            "user_id": 1,  # Test user
            "chat_id": chat_id,
            "content": f"Message {msg_id} in single chat {chat_id}"
        }
        for msg_id in range(1, 11)
    ]
    for chat_id in range(1, 5)  # Assuming single chat IDs are 1 to 4
]

for chat_messages in single_chat_messages_payload:
    for message in chat_messages:
        response = requests.post(f"{BASE_URL}/chat/single/message", json=message)
        print(response.json())

# Sample 20 messages among the 6 members in the group chat
group_chat_messages_payload = [
    {
        "user_id": (msg_id % 6) + 2,  # Rotate among users 2 to 7
        "chat_id": 1,  # Assuming the group chat ID is 1
        "content": f"Message {msg_id} in group chat"
    }
    for msg_id in range(1, 21)
]

for message in group_chat_messages_payload:
    response = requests.post(f"{BASE_URL}/chat/group/message", json=message)
    print(response.json())

# Create Single Accounts
single_accounts_payload = [
    {
        "user_id": i,
        "initial_balance": 0.0
    }
    for i in range(1, 12)  # Test user + 10 additional users
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
        "user_id": i
    }
    for i in range(2, 8)  # Users 2 to 7
]

for member in group_account_members_payload:
    response = requests.post(f"{BASE_URL}/wallet/group/member", json=member)
    print(response.json())

# Load Amount to Single Accounts
load_single_accounts_payload = [
    {
        "account_id": i,
        "amount": 100.0
    }
    for i in range(1, 12)  # Test user + 10 additional users
]

for load in load_single_accounts_payload:
    response = requests.post(f"{BASE_URL}/wallet/load_single", json=load)
    print(response.json())

# Load Amount to Group Account
load_group_account_payload = {
    "account_id": 1,  # Assuming group account ID is 1
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
        "user_id": i
    }
    for i in range(1, 4)  # Users 1, 2, 3
]

for sign in sign_group_withdrawal_payloads:
    response = requests.post(f"{BASE_URL}/wallet/sign_group_withdrawal", json=sign)
    print(response.json())