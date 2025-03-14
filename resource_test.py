import unittest
import logging
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_testing import TestCase
from backend import app, db, User, Group, Chat, WalletAccount, ChatMessage
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TestAPI(TestCase):
    SQLALCHEMY_DATABASE_URI = "sqlite:///test.db"
    TESTING = True

    def create_app(self):
        app.config['SQLALCHEMY_DATABASE_URI'] = self.SQLALCHEMY_DATABASE_URI
        app.config['TESTING'] = self.TESTING
        app.config['UPLOAD_FOLDER'] = 'test_uploads'
        return app

    def setUp(self):
        db.create_all()
        self.client = app.test_client()
        if not os.path.exists(app.config['UPLOAD_FOLDER']):
            os.makedirs(app.config['UPLOAD_FOLDER'])
        logger.info("Setup complete, database created")

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        if os.path.exists(app.config['UPLOAD_FOLDER']):
            for file in os.listdir(app.config['UPLOAD_FOLDER']):
                os.remove(os.path.join(app.config['UPLOAD_FOLDER'], file))
            os.rmdir(app.config['UPLOAD_FOLDER'])
        logger.info("Teardown complete, database dropped")

    def log_table_records(self, model):
        records = model.query.all()
        if records:
            logger.info(f"Table: {model.__tablename__}")
            for record in records:
                logger.info(record)
        else:
            logger.info(f"No records found in table: {model.__tablename__}")

    def test_create_single_chat(self):
        user1 = User(username="testuser1", email="testuser1@example.com")
        user2 = User(username="testuser2", email="testuser2@example.com")
        db.session.add(user1)
        db.session.add(user2)
        db.session.commit()
        logger.info(f"Users created: {user1}, {user2}")

        response = self.client.post('/api/chat/single', json={'user_id': user1.id})
        logger.info(f"Response: {response.json}")
        self.assertEqual(response.status_code, 200)
        self.assertIn("Single chat created", response.json['message'])

        chat_id = response.json['chat_id']
        response = self.client.post('/api/chat/single/message', data={
            'user_id': user1.id,
            'chat_id': chat_id,
            'content': 'Hello, this is a test message from user1.'
        })
        logger.info(f"Response: {response.json}")
        self.assertEqual(response.status_code, 200)
        self.assertIn("Message sent", response.json['message'])

        response = self.client.post('/api/chat/single/message', data={
            'user_id': user2.id,
            'chat_id': chat_id,
            'content': 'Hello, this is a test message from user2.'
        })
        logger.info(f"Response: {response.json}")
        self.assertEqual(response.status_code, 200)
        self.assertIn("Message sent", response.json['message'])

        self.log_table_records(User)
        self.log_table_records(Chat)
        self.log_table_records(ChatMessage)

    # def test_create_group_chat(self):
    #     group = Group(name="Football Club")
    #     user1 = User(username="player1", email="player1@example.com")
    #     user2 = User(username="player2", email="player2@example.com")
    #     user3 = User(username="player3", email="player3@example.com")
    #     db.session.add(group)
    #     db.session.add(user1)
    #     db.session.add(user2)
    #     db.session.add(user3)
    #     db.session.commit()
    #     logger.info(f"Group and users created: {group}, {user1}, {user2}, {user3}")

    #     response = self.client.post('/api/chat/group', json={'group_id': group.id})
    #     logger.info(f"Response: {response.json}")
    #     self.assertEqual(response.status_code, 200)
    #     self.assertIn("Group chat created", response.json['message'])

    #     chat_id = response.json['chat_id']
    #     response = self.client.post('/api/chat/group/message', data={
    #         'user_id': user1.id,
    #         'chat_id': chat_id,
    #         'content': 'Hello team, this is player1.'
    #     })
    #     logger.info(f"Response: {response.json}")
    #     self.assertEqual(response.status_code, 200)
    #     self.assertIn("Message sent", response.json['message'])

    #     response = self.client.post('/api/chat/group/message', data={
    #         'user_id': user2.id,
    #         'chat_id': chat_id,
    #         'content': 'Hello team, this is player2.'
    #     })
    #     logger.info(f"Response: {response.json}")
    #     self.assertEqual(response.status_code, 200)
    #     self.assertIn("Message sent", response.json['message'])

    #     response = self.client.post('/api/chat/group/message', data={
    #         'user_id': user3.id,
    #         'chat_id': chat_id,
    #         'content': 'Hello team, this is player3.'
    #     })
    #     logger.info(f"Response: {response.json}")
    #     self.assertEqual(response.status_code, 200)
    #     self.assertIn("Message sent", response.json['message'])

    #     self.log_table_records(User)
    #     self.log_table_records(Group)
    #     self.log_table_records(Chat)
    #     self.log_table_records(ChatMessage)


    def test_create_single_account(self):
        user = User(username="testuser", email="testuser@example.com")
        db.session.add(user)
        db.session.commit()
        logger.info(f"User created: {user}")

        response = self.client.post('/api/wallet/single', json={'user_id': user.id, 'initial_balance': 100.0})
        logger.info(f"Response: {response.json}")
        self.assertEqual(response.status_code, 200)
        self.assertIn("Single account created", response.json['message'])

        self.log_table_records(User)
        self.log_table_records(WalletAccount)

    def test_create_group_account(self):
        group = Group(name="testgroup")
        db.session.add(group)
        db.session.commit()
        logger.info(f"Group created: {group}")

        response = self.client.post('/api/wallet/group', json={'group_id': group.id, 'initial_balance': 200.0})
        logger.info(f"Response: {response.json}")
        self.assertEqual(response.status_code, 200)
        self.assertIn("Group account created", response.json['message'])

        self.log_table_records(Group)
        self.log_table_records(WalletAccount)

    def test_send_to_person_account(self):
        user1 = User(username="testuser1", email="testuser1@example.com")
        user2 = User(username="testuser2", email="testuser2@example.com")
        db.session.add(user1)
        db.session.add(user2)
        db.session.commit()
        logger.info(f"Users created: {user1}, {user2}")

        account1 = WalletAccount(user_id=user1.id, balance=100.0)
        account2 = WalletAccount(user_id=user2.id, balance=50.0)
        db.session.add(account1)
        db.session.add(account2)
        db.session.commit()
        logger.info(f"Accounts created: {account1}, {account2}")

        response = self.client.post('/api/wallet/send_to_person', json={'from_account_id': account1.id, 'to_account_id': account2.id, 'amount': 30.0})
        logger.info(f"Response: {response.json}")
        self.assertEqual(response.status_code, 200)
        self.assertIn("Transaction successful", response.json['message'])

        self.log_table_records(WalletAccount)

    def test_send_to_group_account(self):
        user = User(username="testuser", email="testuser@example.com")
        group = Group(name="testgroup")
        db.session.add(user)
        db.session.add(group)
        db.session.commit()
        logger.info(f"User and group created: {user}, {group}")

        account1 = WalletAccount(user_id=user.id, balance=100.0)
        account2 = WalletAccount(group_id=group.id, balance=50.0)
        db.session.add(account1)
        db.session.add(account2)
        db.session.commit()
        logger.info(f"Accounts created: {account1}, {account2}")

        response = self.client.post('/api/wallet/send_to_group', json={'from_account_id': account1.id, 'to_group_id': group.id, 'amount': 30.0})
        logger.info(f"Response: {response.json}")
        self.assertEqual(response.status_code, 200)
        self.assertIn("Transaction successful", response.json['message'])

        self.log_table_records(WalletAccount)

    def test_withdraw_normal(self):
        user = User(username="testuser", email="testuser@example.com")
        db.session.add(user)
        db.session.commit()
        logger.info(f"User created: {user}")

        account = WalletAccount(user_id=user.id, balance=100.0)
        db.session.add(account)
        db.session.commit()
        logger.info(f"Account created: {account}")

        response = self.client.post('/api/wallet/withdraw', json={'account_id': account.id, 'amount': 30.0})
        logger.info(f"Response: {response.json}")
        self.assertEqual(response.status_code, 200)
        self.assertIn("Withdrawal successful", response.json['message'])

        self.log_table_records(WalletAccount)

    def test_withdraw_group_request(self):
        group = Group(name="testgroup")
        db.session.add(group)
        db.session.commit()
        logger.info(f"Group created: {group}")

        account = WalletAccount(group_id=group.id, balance=100.0)
        db.session.add(account)
        db.session.commit()
        logger.info(f"Account created: {account}")

        response = self.client.post('/api/wallet/withdraw_group_request', json={'group_id': group.id, 'amount': 30.0})
        logger.info(f"Response: {response.json}")
        self.assertEqual(response.status_code, 200)
        self.assertIn("Withdrawal request created", response.json['message'])

        self.log_table_records(WalletAccount)

    def test_sign_group_withdrawal_request(self):
        group = Group(name="testgroup")
        user = User(username="testuser", email="testuser@example.com")
        db.session.add(group)
        db.session.add(user)
        db.session.commit()
        logger.info(f"Group and user created: {group}, {user}")

        # Assuming you have a way to create and track withdrawal requests
        # Here you would typically create a withdrawal request and then sign it
        response = self.client.post('/api/wallet/sign_group_withdrawal', json={'group_id': group.id, 'request_id': 1, 'user_id': user.id})
        logger.info(f"Response: {response.json}")
        self.assertEqual(response.status_code, 200)
        self.assertIn("Withdrawal request signed", response.json['message'])

        self.log_table_records(Group)
        self.log_table_records(User)

if __name__ == '__main__':
    unittest.main()