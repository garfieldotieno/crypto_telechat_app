class Wallet:
    def __init__(self):
        self.accounts = {}

    def create_account(self, account_id, initial_balance=0):
        self.accounts[account_id] = {
            'balance': initial_balance,
            'group': False,
            'members': []
        }

    def create_group_account(self, account_id, members, initial_balance=0):
        self.accounts[account_id] = {
            'balance': initial_balance,
            'group': True,
            'members': members
        }

    def send(self, from_account, to_account, amount):
        if from_account not in self.accounts or to_account not in self.accounts:
            return "Account not found"
        if self.accounts[from_account]['balance'] < amount:
            return "Insufficient balance"
        self.accounts[from_account]['balance'] -= amount
        self.accounts[to_account]['balance'] += amount
        return "Transaction successful"

    def check_balance(self, account_id):
        if account_id not in self.accounts:
            return "Account not found"
        return self.accounts[account_id]['balance']

    def multisig_consequence(self, account_id, action):
        if account_id not in self.accounts:
            return "Account not found"
        if not self.accounts[account_id]['group']:
            return "Not a group account"
        # Implement multisig logic here
        return f"Multisig action '{action}' executed for account {account_id}"

# Example usage
wallet = Wallet()
wallet.create_account('single_account', 100)
wallet.create_group_account('group_account', ['member1', 'member2'], 200)

print(wallet.check_balance('single_account'))  # Output: 100
print(wallet.send('single_account', 'group_account', 50))  # Output: Transaction successful
print(wallet.check_balance('single_account'))  # Output: 50
print(wallet.check_balance('group_account'))  # Output: 250
print(wallet.multisig_consequence('group_account', 'approve'))  # Output: Multisig action 'approve' executed for account group_account