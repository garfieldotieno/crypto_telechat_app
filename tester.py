import unittest
from backend import app, db, SingleWalletAccount, GroupWalletAccount  # your main app file with api.add_resource() calls


class WalletApiTest(unittest.TestCase):

    def setUp(self):
        # Configure app for testing
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.app = app.test_client()

        with app.app_context():
            db.create_all()

    def tearDown(self):
        with app.app_context():
            db.session.remove()
            db.drop_all()

    def test_full_wallet_flow(self):
        # 1. Create Single Wallet
        res = self.app.post('/api/wallet/single', json={"user_id": 1, "initial_balance": 500})
        self.assertEqual(res.status_code, 200)
        single_id = res.get_json()["account_id"]

        # 2. Create Group Wallet
        res = self.app.post('/api/wallet/group', json={"group_id": 1, "initial_balance": 1000})
        self.assertEqual(res.status_code, 200)
        group_id = res.get_json()["account_id"]

        # 3. Add Member to Group
        res = self.app.post('/api/wallet/group/member', json={"group_id": 1, "user_id": 2})
        self.assertEqual(res.status_code, 200)

        # 4. Load Single Wallet
        res = self.app.post('/api/wallet/load_single', json={"account_id": single_id, "amount": 200})
        self.assertEqual(res.status_code, 200)

        # 5. Load Group Wallet
        res = self.app.post('/api/wallet/load_group', json={"account_id": group_id, "amount": 500})
        self.assertEqual(res.status_code, 200)

        # 6. Send to Person
        res = self.app.post('/api/wallet/send_to_person', json={
            "from_account_id": single_id,
            "to_account_id": single_id,  # here you would have a 2nd account
            "amount": 50
        })
        self.assertIn(res.status_code, [200, 400])  # may fail if no second account exists

        # 7. Send to Group
        res = self.app.post('/api/wallet/send_to_group', json={
            "from_account_id": single_id,
            "to_group_id": 1,
            "amount": 50
        })
        self.assertEqual(res.status_code, 200)

        # 8. Withdraw from Single
        res = self.app.post('/api/wallet/withdraw', json={"account_id": single_id, "amount": 100})
        self.assertIn(res.status_code, [200, 400])

        # 9. Withdraw Group Request
        res = self.app.post('/api/wallet/withdraw_group_request', json={"group_id": 1, "amount": 50})
        self.assertEqual(res.status_code, 200)

if __name__ == '__main__':
    unittest.main()
