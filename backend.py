from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api, Resource
from werkzeug.utils import secure_filename
from werkzeug.middleware.proxy_fix import ProxyFix
import os
import random, string

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'
db = SQLAlchemy(app)
api = Api(app)


class email_otps(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    otp = db.Column(db.String(6), nullable=False)
    verified = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

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
    

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    otp_secret = db.Column(db.String(16), nullable=False)
    wall_image_url = db.Column(db.String(120), nullable=True)
    profile_image_url = db.Column(db.String(120), nullable=True)

    created_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    wallet_account = db.relationship('WalletAccount', backref='user', lazy=True)

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class Group(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    members = db.relationship('User', secondary='group_members', lazy='subquery',
                              backref=db.backref('groups', lazy=True))
    wallet_account = db.relationship('WalletAccount', backref='group', lazy=True)

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class GroupMembers(db.Model):
    __tablename__ = 'group_members'
    group_id = db.Column(db.Integer, db.ForeignKey('group.id'), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class Chat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    chat_type = db.Column(db.String(10), nullable=False)  # 'single' or 'group'
    messages = db.relationship('ChatMessage', backref='chat', lazy=True)

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class ChatMembers(db.Model):
    __tablename__ = 'chat_members'
    chat_id = db.Column(db.Integer, db.ForeignKey('chat.id'), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class ChatMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    chat_id = db.Column(db.Integer, db.ForeignKey('chat.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=True)
    media_filename = db.Column(db.String(120), nullable=True)
    timestamp = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class WalletAccount(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    group_id = db.Column(db.Integer, db.ForeignKey('group.id'), nullable=True)
    balance = db.Column(db.Float, nullable=False, default=0.0)

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class WalletAccountTransaction(db.Model):
    transaction_type = db.Column(db.String(10), nullable=False)  # 'credit' or 'debit'
    account_id = db.Column(db.Integer, db.ForeignKey('wallet_account.id'), primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

# RESTful API Resources
class CreateUser(Resource):
    def post(self):
        data = request.get_json()

        print(f"calling create user, with data : {data}")

        username = data.get('username')
        email = data.get('email')
        otp_secret = verify_otp(email, data.get('otp'))
        wall_image_url = data.get('wall_image_url') or ""
        profile_image_url = data.get('profile_image_url') or ""
        
        if not otp_secret:
            return jsonify({"message": "Invalid OTP"}), 400

        try:
            user = User(username=username, email=email, otp_secret=otp_secret, wall_image_url=wall_image_url, profile_image_url=profile_image_url)
            db.session.add(user)
            db.session.commit()
            return jsonify({"message": "User created", "data": user.to_dict()}), 201
        
        except Exception as e:
            db.session.rollback()
            print(f"\nError creating user: {e}\n")
            return jsonify({"message": "Error creating user"}), 500


class CreateGroup(Resource):
    def post(self):
        data = request.get_json()
        name = data.get('name')
        member_ids = data.get('member_ids')
        
        try:
            group = Group(name=name)
            db.session.add(group)
            db.session.commit()
            for member_id in member_ids:
                group_member = GroupMembers(group_id=group.id, user_id=member_id)
                db.session.add(group_member)
            db.session.commit()
            return jsonify({"message": "Group created", "group_id": group.id})
        
        except Exception as e:
            db.session.rollback()
            print(f"\nError creating group: {e}\n")
            return jsonify({"message": "Error creating group"}), 500


class CreateSingleChat(Resource):
    def post(self):
        data = request.get_json()
        user_id = data.get('user_id')
        
        try:
            chat = Chat(chat_type='single')
            db.session.add(chat)
            db.session.commit()
            chat_member = ChatMembers(chat_id=chat.id, user_id=user_id)
            db.session.add(chat_member)
            db.session.commit()
            return jsonify({"message": "Single chat created", "chat_id": chat.id})
        
        except Exception as e:
            db.session.rollback()
            print(f"\nError creating single chat: {e}\n")
            return jsonify({"message": "Error creating single chat"}), 500


class CreateGroupChat(Resource):
    def post(self):
        data = request.get_json()
        user_ids = data.get('user_ids')
        
        try:
            chat = Chat(chat_type='group')
            db.session.add(chat)
            db.session.commit()
            for user_id in user_ids:
                chat_member = ChatMembers(chat_id=chat.id, user_id=user_id)
                db.session.add(chat_member)
            db.session.commit()
            return jsonify({"message": "Group chat created", "chat_id": chat.id})
        
        except Exception as e:
            db.session.rollback()
            print(f"\nError creating group chat: {e}\n")
            return jsonify({"message": "Error creating group chat"}), 500


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
            return jsonify({"message": "Message sent", "message_id": message.id})
        
        except Exception as e:
            db.session.rollback()
            print(f"\nError sending message: {e}\n")
            return jsonify({"message": "Error sending message"}), 500


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
            return jsonify({"message": "Message sent", "message_id": message.id})
        
        except Exception as e:
            db.session.rollback()
            print(f"\nError sending message: {e}\n")
            return jsonify({"message": "Error sending message"}), 500


class CreateSingleAccount(Resource):
    def post(self):
        data = request.get_json()
        user_id = data.get('user_id')
        initial_balance = data.get('initial_balance', 0.0)
        
        try:
            wallet_account = WalletAccount(user_id=user_id, balance=initial_balance)
            db.session.add(wallet_account)
            db.session.commit()
            return jsonify({"message": "Single account created", "account_id": wallet_account.id})
        
        except Exception as e:
            db.session.rollback()
            print(f"\nError creating single account: {e}\n")
            return jsonify({"message": "Error creating single account"}), 500


class CreateGroupAccount(Resource):
    def post(self):
        data = request.get_json()
        group_id = data.get('group_id')
        initial_balance = data.get('initial_balance', 0.0)
        
        try:
            wallet_account = WalletAccount(group_id=group_id, balance=initial_balance)
            db.session.add(wallet_account)
            db.session.commit()
            return jsonify({"message": "Group account created", "account_id": wallet_account.id})
        
        except Exception as e:
            db.session.rollback()
            print(f"\nError creating group account: {e}\n")
            return jsonify({"message": "Error creating group account"}), 500


class SendToPersonAccount(Resource):
    def post(self):
        data = request.get_json()
        from_account_id = data.get('from_account_id')
        to_account_id = data.get('to_account_id')
        amount = data.get('amount')
        from_account = WalletAccount.query.get(from_account_id)
        to_account = WalletAccount.query.get(to_account_id)
        if from_account and to_account and from_account.balance >= amount:
            from_account.balance -= amount
            to_account.balance += amount
            db.session.commit()
            return jsonify({"message": "Transaction successful"})
        return jsonify({"message": "Transaction failed"}), 400

class SendToGroupAccount(Resource):
    def post(self):
        data = request.get_json()
        from_account_id = data.get('from_account_id')
        to_group_id = data.get('to_group_id')
        amount = data.get('amount')
        from_account = WalletAccount.query.get(from_account_id)
        to_group_account = WalletAccount.query.filter_by(group_id=to_group_id).first()
        if from_account and to_group_account and from_account.balance >= amount:
            from_account.balance -= amount
            to_group_account.balance += amount
            db.session.commit()
            return jsonify({"message": "Transaction successful"})
        return jsonify({"message": "Transaction failed"}), 400

class WithdrawNormal(Resource):
    def post(self):
        data = request.get_json()
        account_id = data.get('account_id')
        amount = data.get('amount')
        account = WalletAccount.query.get(account_id)
        if account and account.balance >= amount:
            account.balance -= amount
            db.session.commit()
            return jsonify({"message": "Withdrawal successful"})
        return jsonify({"message": "Withdrawal failed"}), 400

class WithdrawGroupRequest(Resource):
    def post(self):
        data = request.get_json()
        group_id = data.get('group_id')
        amount = data.get('amount')
        group_account = WalletAccount.query.filter_by(group_id=group_id).first()
        if group_account and group_account.balance >= amount:
            # Here you would typically create a withdrawal request that needs to be signed by group members
            return jsonify({"message": "Withdrawal request created"})
        return jsonify({"message": "Withdrawal request failed"}), 400

class SignGroupWithdrawalRequest(Resource):
    def post(self):
        data = request.get_json()
        group_id = data.get('group_id')
        request_id = data.get('request_id')
        user_id = data.get('user_id')
        # Here you would typically handle the logic for signing the withdrawal request
        return jsonify({"message": "Withdrawal request signed"})

# Register API resources
api.add_resource(CreateUser, '/api/user')
api.add_resource(CreateGroup, '/api/group')

api.add_resource(CreateSingleChat, '/api/chat/single')
api.add_resource(CreateGroupChat, '/api/chat/group')

api.add_resource(CreateSingleChatMessage, '/api/chat/single/message')
api.add_resource(CreateGroupChatMessage, '/api/chat/group/message')

api.add_resource(CreateSingleAccount, '/api/wallet/single')
api.add_resource(CreateGroupAccount, '/api/wallet/group')

api.add_resource(SendToPersonAccount, '/api/wallet/send_to_person')
api.add_resource(SendToGroupAccount, '/api/wallet/send_to_group')

api.add_resource(WithdrawNormal, '/api/wallet/withdraw')
api.add_resource(WithdrawGroupRequest, '/api/wallet/withdraw_group_request')
api.add_resource(SignGroupWithdrawalRequest, '/api/wallet/sign_group_withdrawal')

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
