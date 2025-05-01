from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api, Resource
from flask_cors import CORS
from werkzeug.utils import secure_filename
from werkzeug.middleware.proxy_fix import ProxyFix
import os
import random, string
from datetime import datetime, timezone
import pytz

from web3 import Web3

try:
    # Connect to the local blockchain
    web3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545/'))

    # Check if the connection is successful
    if web3.is_connected():
        print("Connected to the local blockchain")
        print(f"Current block number: {web3.eth.block_number}")
    else:
        print("Failed to connect to the blockchain")
except Exception as e:
    print(f"Error connecting to the blockchain: {e}")


import uuid
import json


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.sqlite'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'

db = SQLAlchemy(app)
api = Api(app)
migrate = Migrate(app, db)

# enabe CORS on all routes
CORS(app)

class BaseModelMixin:
    def to_dict(self):
        result = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        for key, value in result.items():
            if isinstance(value, datetime):
                # Ensure the datetime is in UTC and serialize it in ISO 8601 format
                result[key] = value.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")
        return result



def fetch_all_email_otps():
    with app.app_context():
        return email_otps.query.all()
    
def generate_otp(email):
    # add to database table email_otps
    with app.app_context():
        email_otp = email_otps.query.filter_by(email=email).first()
        if email_otp:
            return email_otp.otp
        
        otp = ''.join(random.choices(string.digits, k=6))
        email_otp = email_otps(email=email, otp=otp, verified=False)
        db.session.add(email_otp)
        db.session.commit()
        return otp

def verify_otp(email, otp):
    # check otp in database table email_otps
    with app.app_context():
        email_otp = email_otps.query.filter_by(email=email, otp=otp).first()
        if email_otp:
            email_otp.verified = True
            db.session.commit()
            return True
        return False


class Contact (db.Model):
    id = db.Column(db.Integer, primary_key=True)
    adding_user_id = db.Column(db.Integer, nullable=False)

    contact_digits = db.Column(db.String(13), nullable=True)
    contact_name = db.Column(db.String(80), nullable=False)
    contact_email = db.Column(db.String(120), nullable=False)

    app_user = db.Column(db.Boolean, nullable=False, default=True)
    app_user_id = db.Column(db.Integer, nullable=True, default=0)

    created_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    
    def to_dict(self):
        result = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        for key, value in result.items():
            if isinstance(value, datetime):
                result[key] = value.isoformat()
        return result 


class email_otps(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    otp = db.Column(db.String(6), nullable=False)
    verified = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    def to_dict(self):
        result = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        for key, value in result.items():
            if isinstance(value, datetime):
                result[key] = value.isoformat()
        return result
    

class User(db.Model, BaseModelMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    otp_secret = db.Column(db.String(16), nullable=False)
    wall_image_url = db.Column(db.String(120), nullable=True)
    profile_image_url = db.Column(db.String(120), nullable=True)
    registerd_state = db.Column(db.Boolean(), nullable=False, default=True)
    registerd_wallet = db.Column(db.Boolean(), nullable=True, default=False)
    registerd_bio = db.Column(db.String(120), nullable=True, default="User Available")
    wallet_address = db.Column(db.String(42), nullable=True)  # Ethereum wallet address
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    last_login = db.Column(db.DateTime, nullable=True, default=db.func.current_timestamp())

    wallet_account = db.relationship('SingleWalletAccount', backref='user', lazy=True)

    def wallet(self):
        """Retrieve the wallet account associated with the user."""
        return SingleWalletAccount.query.filter_by(user_id=self.id).first()



class Group(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    creator_id = db.Column(db.Integer, nullable=False)
    chat_id = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(80), unique=True, nullable=False)

    # New fields to standardize with User
    email = db.Column(db.String(120), unique=True, nullable=True)
    otp_secret = db.Column(db.String(16), nullable=True)
    wall_image_url = db.Column(db.String(120), nullable=True)
    profile_image_url = db.Column(db.String(120), nullable=True)
    registerd_wallet = db.Column(db.Boolean(), nullable=True, default=False)
    registerd_bio = db.Column(db.String(120), nullable=True, default="Group Available")
    wallet_address = db.Column(db.String(42), nullable=True)  # Ethereum wallet address

    wallet_account = db.relationship('GroupWalletAccount', backref='group', lazy=True)

    def wallet(self):
        """Retrieve the wallet account associated with the group."""
        return GroupWalletAccount.query.filter_by(group_id=self.id).first()

    def to_dict(self):
        result = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        for key, value in result.items():
            if isinstance(value, datetime):
                result[key] = value.isoformat()
        return result


class Chat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    creator_id = db.Column(db.Integer)
    chat_type = db.Column(db.String(10), nullable=False)  # 'single' or 'group'
    messages = db.relationship('ChatMessage', backref='chat', lazy=True)

    def to_dict(self):
        result = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        for key, value in result.items():
            if isinstance(value, datetime):
                result[key] = value.isoformat()
        return result


class ChatMembers(db.Model):
    __tablename__ = 'chat_members'
    chat_id = db.Column(db.Integer, db.ForeignKey('chat.id'), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)

    def to_dict(self):
        result = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        for key, value in result.items():
            if isinstance(value, datetime):
                result[key] = value.isoformat()
        return result


class ChatMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    chat_id = db.Column(db.Integer, db.ForeignKey('chat.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=True)
    media_filename = db.Column(db.String(120), nullable=True)
    timestamp = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())

    def to_dict(self):
        result = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        for key, value in result.items():
            if isinstance(value, datetime):
                result[key] = value.isoformat()
        return result


class SingleWalletAccount(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    balance = db.Column(db.Float, nullable=False, default=0.0)

    def to_dict(self):
        result = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        for key, value in result.items():
            if isinstance(value, datetime):
                result[key] = value.isoformat()
        return result

class GroupWalletAccount(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    group_id = db.Column(db.Integer, db.ForeignKey('group.id'), nullable=True)
    balance = db.Column(db.Float, nullable=False, default=0.0)

    def to_dict(self):
        result = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        for key, value in result.items():
            if isinstance(value, datetime):
                result[key] = value.isoformat()
        return result

class GroupWalletMembers(db.Model):
    __tablename__ = 'group_wallet_members'
    group_id = db.Column(db.Integer, db.ForeignKey('group.id'), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)

    def to_dict(self):
        result = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        for key, value in result.items():
            if isinstance(value, datetime):
                result[key] = value.isoformat()
        return result
     
class WalletAccountTransaction(db.Model):
    __tablename__ = 'wallet_account_transactions'
    id = db.Column(db.Integer, primary_key=True)
    uid = db.Column(db.String(36), nullable=False, default=lambda: str(uuid.uuid4()))
    
    account_id = db.Column(db.Integer)
    account_type = db.Column(db.String(10), nullable=False) # single or group
    
    transaction_type = db.Column(db.String(10), nullable=False)  # 'credit' or 'debit'
    
    amount = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())

    transaction_hash = db.Column(db.String(64), nullable=False, default=lambda: ''.join(random.choices(string.ascii_letters + string.digits, k=64)))
    transaction_chain_status = db.Column(db.String(10), nullable=False, default='pending')

    def to_dict(self):
        result = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        for key, value in result.items():
            if isinstance(value, datetime):
                result[key] = value.isoformat()
        return result

class TransactionLog(db.Model, BaseModelMixin):
    id = db.Column(db.Integer, primary_key=True)
    event_type = db.Column(db.String(50), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    chat_id = db.Column(db.Integer, db.ForeignKey('chat.id'), nullable=True)
    wallet_account_id = db.Column(db.Integer, nullable=True)
    group_id = db.Column(db.Integer, db.ForeignKey('group.id'), nullable=True)
    description = db.Column(db.Text, nullable=True)
    timestamp = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    event_metadata = db.Column(db.JSON, nullable=True)
    

# RESTful API Resources
class CreateUser(Resource):
    def post(self):
        data = request.get_json()

        print(f"\ncalling create user, with data : {data}")

        username = data.get('username')
        email = data.get('email')
        otp_secret = data.get('otp_secret') 
        wall_image_url = data.get('wall_image_url', "")
        profile_image_url = data.get('profile_image_url', "")

        print(f"checking fetched data from data : {username}, {email}, {otp_secret}, {wall_image_url}, {profile_image_url}")
        
        # Step 1: Verify OTP
        otp_verified = verify_otp(email, otp_secret)
        print(f"calling for otp verification : {otp_verified}")

        if otp_verified:
            try:
                # Step 2: Create the user
                user = User(
                    username=username, 
                    email=email, 
                    otp_secret=otp_secret, 
                    wall_image_url=wall_image_url, 
                    profile_image_url=profile_image_url
                )
                db.session.add(user)
                db.session.commit()

                # Step 3: Update contacts with the same email
                existing_contacts = Contact.query.filter_by(contact_email=email).all()
                for contact in existing_contacts:
                    contact.app_user = True
                    contact.app_user_id = user.id
                    db.session.commit()
                    print(f"Updated contact {contact.id} to link with new user {user.id}")

                return {
                    "message": "User created", 
                    "data": user.to_dict()
                }, 201  

            except Exception as e:
                db.session.rollback()
                print(f"\nError creating user: {e}\n")
                return {"message": "Error creating user"}, 500
        else:
            return {"message": "Invalid OTP"}, 400

class LoginUser(Resource):
    def post(self):
        data = request.get_json()
        email = data.get('email')
        otp = data.get('otp')

        print(f"Attempting login for email: {email} with OTP: {otp}")

        # Verify the OTP
        if verify_otp(email, otp):
            user = User.query.filter_by(email=email).first()

            if user:
                # Update the last_login field
                user.last_login = datetime.utcnow()
                db.session.commit()

                # Log the login event in TransactionLog
                transaction_log = TransactionLog(
                    event_type="user_login",
                    user_id=user.id,
                    description="User logged in",
                    event_metadata={"email": email}
                )
                db.session.add(transaction_log)
                db.session.commit()

                return {
                    "message": "Login successful",
                    "user": user.to_dict()
                }, 200
            else:
                return {"message": "User not found"}, 404
        else:
            return {"message": "Invalid OTP"}, 400
        

class CreateContact(Resource):
    def post(self):
        data = request.get_json()

        print(f"\ncalling create contact, with data : {data} of type : {type(data)}")

        adding_user_id = data.get('adding_user_id')
        contact_digits = data.get('contact_digits')
        contact_name = data.get('contact_name')
        contact_email = data.get('contact_email')
        app_user = data.get('app_user')
        app_user_id = 0

        # Check if the contact_digits already exist
        existing_contact_by_digits = Contact.query.filter_by(contact_digits=contact_digits).first()
        if existing_contact_by_digits:
            print(f"Contact with digits {contact_digits} already exists.")
            return {
                "message": "Contact with these digits already exists",
                "existing_contact": existing_contact_by_digits.to_dict()
            }, 400

        # Check if the contact_email already exists
        existing_contact_by_email = Contact.query.filter_by(contact_email=contact_email).first()
        if existing_contact_by_email:
            print(f"Contact with email {contact_email} already exists.")
            return {
                "message": "Contact with this email already exists",
                "existing_contact": existing_contact_by_email.to_dict()
            }, 400

        # Verify if the user is already an app user
        existing_user = User.query.filter_by(email=contact_email).first()
        if existing_user:
            app_user = True
            app_user_id = existing_user.id

        print(f"checking fetched data from data : {adding_user_id}, {contact_digits}, {contact_name}, {contact_email}, {app_user}, {app_user_id}")
        
        try:
            contact = Contact(
                adding_user_id=adding_user_id, 
                contact_digits=contact_digits, 
                contact_name=contact_name, 
                contact_email=contact_email, 
                app_user=app_user, 
                app_user_id=app_user_id
            )
            db.session.add(contact)
            db.session.commit()

            contact_otp = generate_otp(contact_email)

            return {
                "message": "Contact created", 
                "data": contact.to_dict(),
                "otp_data": contact_otp
            }, 201  # No jsonify()

        except Exception as e:
            db.session.rollback()
            print(f"\nError creating contact: {e}\n")
            return {"message": "Error creating contact"}, 500


class CreateGroup(Resource):
    def post(self):
        data = request.get_json()
        name = data.get('name')
        creator_id = data.get('creator_id')
        
        
        try:
            group = Group(creator_id=creator_id,name=name)
            db.session.add(group)
            db.session.commit()
            
            return {"message": "Group created", "group_id": group.id}
        
        except Exception as e:
            db.session.rollback()
            print(f"\nError creating group: {e}\n")
            return {"message": "Error creating group"}, 500
    
    def get(self):
        return jsonify([g.name for g in Group.query.all()])



class CreateSingleChat(Resource):
    def post(self):
        data = request.get_json()
        creator_id = data.get('creator_id')
        chat_type = 'single'

        try:
            chat = Chat(creator_id=creator_id, chat_type=chat_type)
            db.session.add(chat)
            db.session.commit()

            # Log the chat creation in TransactionLog
            transaction_log = TransactionLog(
                event_type="chat_created",
                user_id=creator_id,
                chat_id=chat.id,
                description="Single chat created",
                metadata={"chat_type": chat_type}
            )
            db.session.add(transaction_log)
            db.session.commit()

            return {"message": "Single chat created", "chat_id": chat.id}
        except Exception as e:
            db.session.rollback()
            print(f"Error creating single chat: {e}")
            return {"message": "Error creating single chat"}, 500

class CreateGroupChat(Resource):
    def post(self):
        data = request.get_json()
        creator_id = data.get('creator_id')
        group_name = data.get('name')  # Group name provided in the request
        chat_type = 'group'

        try:
            # Step 1: Create a record in the Chat model
            chat = Chat(creator_id=creator_id, chat_type=chat_type)
            db.session.add(chat)
            db.session.commit()

            # Step 2: Create a record in the Group model
            group = Group(creator_id=creator_id, chat_id=chat.id, name=group_name)
            db.session.add(group)
            db.session.commit()

            return {
                "message": "Group chat created successfully",
                "chat_id": chat.id,
                "group_id": group.id
            }, 201

        except Exception as e:
            db.session.rollback()
            print(f"\nError creating group chat: {e}\n")
            return {"message": "Error creating group chat"}, 500

class AddChatMember(Resource):
    def post(self):
        data = request.get_json()
        chat_id = data.get('chat_id')
        user_id = data.get('user_id')

        try:
            chat_member = ChatMembers(chat_id=chat_id, user_id=user_id)
            db.session.add(chat_member)
            db.session.commit()
            return {"message":"chat member added succesfully"}
        
        except Exception as e:
            db.session.rollback()
            print(f"\nError adding chat member : {e}")
            return {"message":"Error adding chat member : {e}"}

       

class CreateSingleChatMessage(Resource):
    def post(self):
        data = request.form
        user_id = data.get('user_id')
        chat_id = data.get('chat_id')
        content = data.get('content')
        media = request.files.get('media')
        media_filename = None

        if media:
            media_filename = secure_filename(media.filename)
            media.save(os.path.join(app.config['UPLOAD_FOLDER'], media_filename))

        try:
            message = ChatMessage(user_id=user_id, chat_id=chat_id, content=content, media_filename=media_filename)
            db.session.add(message)
            db.session.commit()
            return {"message": "Message sent", "message_id": message.id}
        
        except Exception as e:
            db.session.rollback()
            print(f"\nError sending message: {e}\n")
            return {"message": "Error sending message"}, 500


class CreateGroupChatMessage(Resource):
    def post(self):
        data = request.form
        user_id = data.get('user_id')
        chat_id = data.get('chat_id')
        content = data.get('content')
        media = request.files.get('media')
        media_filename = None

        if media:
            media_filename = secure_filename(media.filename)
            media.save(os.path.join(app.config['UPLOAD_FOLDER'], media_filename))

        try:
            message = ChatMessage(user_id=user_id, chat_id=chat_id, content=content, media_filename=media_filename)
            db.session.add(message)
            db.session.commit()
            return {"message": "Message sent", "message_id": message.id}
        
        except Exception as e:
            db.session.rollback()
            print(f"\nError sending message: {e}\n")
            return {"message": "Error sending message"}, 500


class CreateSingleAccount(Resource):
    def post(self):
        data = request.get_json()
        user_id = data.get('user_id')
        initial_balance = data.get('initial_balance', 0.0)
        
        try:
            wallet_account = SingleWalletAccount(user_id=user_id, balance=initial_balance)
            db.session.add(wallet_account)
            db.session.commit()
            return {"message": "Single account created", "account_id": wallet_account.id}
        
        except Exception as e:
            db.session.rollback()
            print(f"\nError creating single account: {e}\n")
            return {"message": "Error creating single account"}, 500


class CreateGroupAccount(Resource):
    def post(self):
        data = request.get_json()
        group_id = data.get('group_id')
        initial_balance = data.get('initial_balance', 0.0)
        
        try:
            wallet_account = GroupWalletAccount(group_id=group_id, balance=initial_balance)
            db.session.add(wallet_account)
            db.session.commit()
            return {"message": "Group account created", "account_id": wallet_account.id}
        
        except Exception as e:
            db.session.rollback()
            print(f"\nError creating group account: {e}\n")
            return {"message": "Error creating group account"}, 500


class CreateGroupAccountMember(Resource):
    def post(self):
        data = request.get_json()
        group_id = data.get('group_id')
        user_id = data.get('user_id')

        try:
            group_member = GroupWalletMembers(group_id=group_id, user_id=user_id)
            db.session.add(group_member)
            db.session.commit()
            return {"message": "Group member added to account"}
        except Exception as e:
            db.session.rollback()
            print(f"\nError adding group member to account: {e}\n")
            return {"message": "Error adding group member to account"}, 500


class LoadAmountSingleAccount(Resource):
    def post(self):
        data = request.get_json()
        account_id = data.get('account_id')
        amount = data.get('amount')
        transaction_type = 'credit'

        account = SingleWalletAccount.query.get(account_id)
        if account:
            account.balance += amount
            db.session.commit()

            # Append transaction to WalletAccountTransaction
            transaction = WalletAccountTransaction(
                account_id=account_id,
                account_type='single',
                transaction_type=transaction_type,
                amount=amount
            )
            db.session.add(transaction)
            db.session.commit()

            return {"message": "Amount loaded successfully"}
        return {"message": "Amount loading failed"}, 400

class LoadAmountGroupAccount(Resource):
    def post(self):
        data = request.get_json()
        account_id = data.get('account_id')
        amount = data.get('amount')
        transaction_type = 'credit'

        account = GroupWalletAccount.query.get(account_id)
        if account:
            account.balance += amount
            db.session.commit()

            # Append transaction to WalletAccountTransaction
            transaction = WalletAccountTransaction(
                account_id=account_id,
                account_type='group',
                transaction_type=transaction_type,
                amount=amount
            )
            db.session.add(transaction)
            db.session.commit()

            return {"message": "Amount loaded successfully"}
        return {"message": "Amount loading failed"}, 400


class SendToPersonAccount(Resource):
    def post(self):
        data = request.get_json()
        from_account_id = data.get('from_account_id')
        to_account_id = data.get('to_account_id')
        amount = data.get('amount')
        transaction_type = 'SEND'

        from_account = SingleWalletAccount.query.get(from_account_id)
        to_account = SingleWalletAccount.query.get(to_account_id)
        if from_account and to_account and from_account.balance >= amount:
            from_account.balance -= amount
            to_account.balance += amount
            db.session.commit()

            # Append transaction to WalletAccountTransaction
            transaction = WalletAccountTransaction(
                account_id=from_account_id,
                account_type='single',
                transaction_type=transaction_type,
                amount=amount
            )
            db.session.add(transaction)
            db.session.commit()

            return {"message": "Transaction successful"}
        return {"message": "Transaction failed"}, 400

class SendToGroupAccount(Resource):
    def post(self):
        data = request.get_json()
        from_account_id = data.get('from_account_id')
        to_group_id = data.get('to_group_id')
        amount = data.get('amount')
        transaction_type = 'SEND'
        
        from_account = SingleWalletAccount.query.get(from_account_id)
        to_group_account = GroupWalletAccount.query.filter_by(group_id=to_group_id).first()
        if from_account and to_group_account and from_account.balance >= amount:
            from_account.balance -= amount
            to_group_account.balance += amount
            db.session.commit()

            # Append transaction to WalletAccountTransaction
            transaction = WalletAccountTransaction(
                account_id=from_account_id,
                account_type='single',
                transaction_type=transaction_type,
                amount=amount
            )
            db.session.add(transaction)
            db.session.commit()

            return {"message": "Transaction successful"}
        return {"message": "Transaction failed"}, 400

class WithdrawNormal(Resource):
    def post(self):
        data = request.get_json()
        account_id = data.get('account_id')
        amount = data.get('amount')
        account = SingleWalletAccount.query.get(account_id)
        if account and account.balance >= amount:
            account.balance -= amount
            db.session.commit()

            # Append transaction to WalletAccountTransaction
            transaction = WalletAccountTransaction(
                account_id=account_id,
                account_type='single',
                transaction_type='singleWithdraw',
                amount=amount
            )
            db.session.add(transaction)
            db.session.commit()

            return {"message": "Withdrawal successful"}
        return {"message": "Withdrawal failed"}, 400

class WithdrawGroupRequest(Resource):
    def post(self):
        data = request.get_json()
        group_id = data.get('group_id')
        amount = data.get('amount')
        group_account = GroupWalletAccount.query.filter_by(group_id=group_id).first()
        if group_account and group_account.balance >= amount:
            # Here you would typically create a withdrawal request that needs to be signed by group members

            # Append transaction to WalletAccountTransaction
            transaction = WalletAccountTransaction(
                account_id=group_account.id,
                account_type='group',
                transaction_type='groupWithdrawRequest',
                amount=amount
            )
            db.session.add(transaction)
            db.session.commit()

            return {"message": "Withdrawal request created"}
        return {"message": "Withdrawal request failed"}, 400

class SignGroupWithdrawalRequest(Resource):
    def post(self):
        data = request.get_json()
        group_id = data.get('group_id')
        request_id = data.get('request_id')
        user_id = data.get('user_id')
        # Here you would typically handle the logic for signing the withdrawal request

        # Append transaction to WalletAccountTransaction
        transaction = WalletAccountTransaction(
            account_id=request_id,
            account_type='group',
            transaction_type='signGroupRequest',
            amount=0  # Assuming no amount is involved in signing the request
        )
        db.session.add(transaction)
        db.session.commit()

        return {"message": "Withdrawal request signed"}


class LogTransaction(Resource):
    def post(self):
        data = request.get_json()
        print(f"Logging transaction with data: {data}")

        try:
            # Create a new TransactionLog instance
            transaction = TransactionLog(
                event_type=data.get('event_type'),
                user_id=data.get('user_id'),
                chat_id=data.get('chat_id'),
                wallet_account_id=data.get('wallet_account_id'),
                group_id=data.get('group_id'),
                description=data.get('description'),
                event_metadata=data.get('event_metadata')  # Ensure this matches the model field name
            )

            # Add the transaction to the database session
            db.session.add(transaction)

            # Commit the transaction to save it to the database
            db.session.commit()

            return {"message": "Transaction logged successfully", "transaction_id": transaction.id}, 201
        except Exception as e:
            # Rollback the session in case of an error
            db.session.rollback()
            print(f"Error logging transaction: {e}")
            return {"message": "Error logging transaction", "error": str(e)}, 500


# Register the LogTransaction resource
api.add_resource(LogTransaction, '/api/transactions')

# Authentication
api.add_resource(LoginUser, '/api/user/login')


# Register API resources
api.add_resource(CreateUser, '/api/user')
api.add_resource(CreateGroup, '/api/group')

# add user
@app.route('/api/user', methods=['POST'])
def add_user():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    otp_secret = data.get('otp_secret')
    wall_image_url = data.get('wall_image_url', "")
    profile_image_url = data.get('profile_image_url', "")

    user = User(username=username, email=email, otp_secret=otp_secret, wall_image_url=wall_image_url, profile_image_url=profile_image_url)
    db.session.add(user)
    db.session.commit()

    return {"message": "User created", "user": user.to_dict()}, 201


@app.route('/api/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)
    if user:
        return jsonify(user.to_dict())
    return {"message": "User not found"}, 404


# delete user
@app.route('/api/user/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)
    if user:
        db.session.delete(user)
        db.session.commit()
        return {"message": "User deleted"}
    return {"message": "User not found"}, 404

# update user
@app.route('/api/user/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()
    user = User.query.get(user_id)
    if user:
        user.username = data.get('username', user.username)
        user.email = data.get('email', user.email)
        user.otp_secret = data.get('otp_secret', user.otp_secret)
        user.wall_image_url = data.get('wall_image_url', user.wall_image_url)
        user.profile_image_url = data.get('profile_image_url', user.profile_image_url)

        db.session.commit()
        return {"message": "User updated", "user": user.to_dict()}
    return {"message": "User not found"}, 404




api.add_resource(CreateSingleChat, '/api/chat/single')
api.add_resource(CreateGroupChat, '/api/chat/group')
api.add_resource(AddChatMember, '/api/chat/member')

api.add_resource(CreateSingleChatMessage, '/api/chat/single/message')
api.add_resource(CreateGroupChatMessage, '/api/chat/group/message')


@app.route('/app.html')
def render_app():
    return render_template('app.html')

@app.route('/api/user/<int:user_id>/chats', methods=['GET'])
def list_user_chats(user_id):
    chats = Chat.query.filter_by(creator_id=user_id).order_by(Chat.id).all()
    return jsonify([chat.to_dict() for chat in chats])

# requires more work 
@app.route('/api/user/<int:user_id>/involved_chats', methods=['GET'])
def list_involved_chats(user_id):
    # Get all chat memberships for the user
    chat_memberships = ChatMembers.query.filter_by(user_id=user_id).all()
    chat_ids = [membership.chat_id for membership in chat_memberships]
    
    # Get all chats where the user is a member but did not create the chat
    chats = Chat.query.filter(Chat.id.in_(chat_ids), Chat.creator_id != user_id).all()
    
    return jsonify([chat.to_dict() for chat in chats])

@app.route('/api/user/<int:user_id>/chats', methods=['POST'])
def delete_user_chats(user_id):
    data = request.get_json()
    print(f"calling delete user chats with data : {data} for user_id {user_id}")
    
    id_payload = data.get('selected_data')

    # Use 'item_id' instead of 'chat_id'
    delete_list = [select_item['item_id'] for select_item in id_payload]

    try:
        for id in delete_list:
            print(f"attempting to delete chat with id : {id}")
            chat = Chat.query.filter_by(id=id).first()
            if chat:
                print(f"fetched chat is {chat.id}")
                db.session.delete(chat)
                db.session.commit()
            else:
                print(f"No chat found with id: {id}")
        
        return jsonify({"delete": True})
        
    except Exception as e:
        print(f"Error deleting chats: {e}")
        return jsonify({"delete": False, "error": f"{e}"})


api.add_resource(CreateSingleAccount, '/api/wallet/single')
api.add_resource(CreateGroupAccount, '/api/wallet/group')
api.add_resource(CreateGroupAccountMember, '/api/wallet/group/member')

api.add_resource(LoadAmountSingleAccount, '/api/wallet/load_single')
api.add_resource(LoadAmountGroupAccount, '/api/wallet/load_group')

api.add_resource(SendToPersonAccount, '/api/wallet/send_to_person')
api.add_resource(SendToGroupAccount, '/api/wallet/send_to_group')

api.add_resource(WithdrawNormal, '/api/wallet/withdraw')
api.add_resource(WithdrawGroupRequest, '/api/wallet/withdraw_group_request')

api.add_resource(CreateContact, '/api/contact')

@app.route('/api/user/<int:user_id>/contacts', methods=['GET'])
def list_user_contacts(user_id):
    contacts = Contact.query.filter_by(adding_user_id=user_id).order_by(Contact.id).all()
    return jsonify([contact.to_dict() for contact in contacts])



@app.route('/api/user/<int:user_id>/contacts', methods=['POST'])
def delete_user_contacts(user_id):
    data = request.get_json()
    print(f"calling delete user contacts with data : {data} for user_id {user_id}")
    
    id_payload = data.get('selected_data')

    # Use 'item_id' instead of 'contact_id'
    delete_list = [select_item['item_id'] for select_item in id_payload]

    try:
        for id in delete_list:
            print(f"attempting to delete contact with id : {id}")
            contact = Contact.query.filter_by(id=id).first()
            if contact:
                print(f"fetched contact is {contact.contact_email}")
                db.session.delete(contact)
                db.session.commit()
            else:
                print(f"No contact found with id: {id}")
        
        return jsonify({"delete": True})
        
    except Exception as e:
        print(f"Error deleting contacts: {e}")
        return jsonify({"delete": False, "error": f"{e}"})


@app.route('/api/transactions/export', methods=['GET'])
def export_transactions():
    transactions = TransactionLog.query.all()
    transaction_data = [transaction.to_dict() for transaction in transactions]

    # Example: Export to JSON
    export_filename = "transactions.json"
    with open(export_filename, "w") as file:
        json.dump(transaction_data, file)

    return send_from_directory(directory=".", path=export_filename, as_attachment=True)


@app.route('/api/transactions', methods=['POST'])
def log_transaction():
    data = request.get_json()
    print(f"Logging transaction with data: {data}")

    try:
        transaction = TransactionLog(
            event_type=data.get('event_type'),
            user_id=data.get('user_id'),
            chat_id=data.get('chat_id'),
            wallet_account_id=data.get('wallet_account_id'),
            group_id=data.get('group_id'),
            description=data.get('description'),
            metadata=data.get('metadata')
        )
        db.session.add(transaction)
        db.session.commit()

        return {"message": "Transaction logged successfully", "transaction_id": transaction.id}, 201
    except Exception as e:
        db.session.rollback()
        print(f"Error logging transaction: {e}")
        return {"message": "Error logging transaction", "error": str(e)}, 500
    

@app.route('/api/transactions', methods=['GET'])
def list_transactions():
    event_type = request.args.get('event_type')
    user_id = request.args.get('user_id')
    wallet_account_id = request.args.get('wallet_account_id')
    chat_id = request.args.get('chat_id')

    query = TransactionLog.query

    if event_type:
        query = query.filter_by(event_type=event_type)
    if user_id:
        query = query.filter_by(user_id=user_id)
    if wallet_account_id:
        query = query.filter_by(wallet_account_id=wallet_account_id)
    if chat_id:
        query = query.filter_by(chat_id=chat_id)

    transactions = query.order_by(TransactionLog.timestamp.desc()).all()
    return jsonify([transaction.to_dict() for transaction in transactions])


@app.route('/')
def index():
    return render_template('app.html')



# 🟢 Serve Manifest
@app.route("/manifest.json")
def manifest():
    return send_from_directory("static", "manifest.json", mimetype="application/json")

# 🟢 Serve Service Worker
@app.route("/sw.js")
def service_worker():
    return send_from_directory("static", "sw.js", mimetype="application/javascript")

# Ensure the app runs properly on Vercel
if __name__ == "__main__":
    app.wsgi_app = ProxyFix(app.wsgi_app)
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
    with app.app_context():
        db.create_all()
    app.run(debug=True)
