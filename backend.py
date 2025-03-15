from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api, Resource
from werkzeug.utils import secure_filename
from werkzeug.middleware.proxy_fix import ProxyFix
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'
db = SQLAlchemy(app)
api = Api(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    otp_secret = db.Column(db.String(16), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    wallet_account = db.relationship('WalletAccount', backref='user', lazy=True)

class Group(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    members = db.relationship('User', secondary='group_members', lazy='subquery',
                              backref=db.backref('groups', lazy=True))
    wallet_account = db.relationship('WalletAccount', backref='group', lazy=True)

class GroupMembers(db.Model):
    __tablename__ = 'group_members'
    group_id = db.Column(db.Integer, db.ForeignKey('group.id'), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)

class Chat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    chat_type = db.Column(db.String(10), nullable=False)  # 'single' or 'group'
    messages = db.relationship('ChatMessage', backref='chat', lazy=True)

class ChatMembers(db.Model):
    __tablename__ = 'chat_members'
    chat_id = db.Column(db.Integer, db.ForeignKey('chat.id'), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)

class ChatMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    chat_id = db.Column(db.Integer, db.ForeignKey('chat.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=True)
    media_filename = db.Column(db.String(120), nullable=True)
    timestamp = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())

class WalletAccount(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    group_id = db.Column(db.Integer, db.ForeignKey('group.id'), nullable=True)
    balance = db.Column(db.Float, nullable=False, default=0.0)

class WalletAccountTransaction(db.Model):
    transaction_type = db.Column(db.String(10), nullable=False)  # 'credit' or 'debit'
    account_id = db.Column(db.Integer, db.ForeignKey('wallet_account.id'), primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())

# RESTful API Resources
class CreateSingleChat(Resource):
    def post(self):
        data = request.get_json()
        user_id = data.get('user_id')
        chat = Chat(chat_type='single')
        db.session.add(chat)
        db.session.commit()
        chat_member = ChatMembers(chat_id=chat.id, user_id=user_id)
        db.session.add(chat_member)
        db.session.commit()
        return jsonify({"message": "Single chat created", "chat_id": chat.id})

class CreateGroupChat(Resource):
    def post(self):
        data = request.get_json()
        user_ids = data.get('user_ids')
        chat = Chat(chat_type='group')
        db.session.add(chat)
        db.session.commit()
        for user_id in user_ids:
            chat_member = ChatMembers(chat_id=chat.id, user_id=user_id)
            db.session.add(chat_member)
        db.session.commit()
        return jsonify({"message": "Group chat created", "chat_id": chat.id})

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

        message = ChatMessage(user_id=user_id, chat_id=chat_id, content=content, media_filename=media_filename)
        db.session.add(message)
        db.session.commit()
        return jsonify({"message": "Message sent", "message_id": message.id})

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

        message = ChatMessage(user_id=user_id, chat_id=chat_id, content=content, media_filename=media_filename)
        db.session.add(message)
        db.session.commit()
        return jsonify({"message": "Message sent", "message_id": message.id})

class CreateSingleAccount(Resource):
    def post(self):
        data = request.get_json()
        user_id = data.get('user_id')
        initial_balance = data.get('initial_balance', 0.0)
        wallet_account = WalletAccount(user_id=user_id, balance=initial_balance)
        db.session.add(wallet_account)
        db.session.commit()
        return jsonify({"message": "Single account created", "account_id": wallet_account.id})

class CreateGroupAccount(Resource):
    def post(self):
        data = request.get_json()
        group_id = data.get('group_id')
        initial_balance = data.get('initial_balance', 0.0)
        wallet_account = WalletAccount(group_id=group_id, balance=initial_balance)
        db.session.add(wallet_account)
        db.session.commit()
        return jsonify({"message": "Group account created", "account_id": wallet_account.id})

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
