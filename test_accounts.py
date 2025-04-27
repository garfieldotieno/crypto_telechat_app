from web3 import Web3
from eth_account import Account
import pytest

# Sample sender_receiver data for testing
sender_receiver = [
    {
        'address': '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        'private_key': 'ac0974bec39a17e36ba4a6b4d238ff944bacb478c51812dc3a010c7d01b50e0d17dc79c8'  # Ensure this is a 64-character key
    },
    {
        'address': '0x5a8d8ad5d8f96c0de7efce9f94c1f773764b8a9f',
        'private_key': '59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d'
    }
]

# Create Web3 instance
web3 = Web3(Web3.HTTPProvider('http://localhost:8545'))  # Update this with your provider

@pytest.mark.parametrize("sender_receiver", [sender_receiver])
def test_send_transaction(sender_receiver):
    sender, receiver = sender_receiver

    txn = {
        'to': receiver['address'],
        'value': web3.to_wei(1, 'ether'),
        'gas': 21000,
        'gasPrice': web3.to_wei('2', 'gwei'),
        'nonce': web3.eth.get_transaction_count(sender['address']),
    }

    # Fix private key length (make sure it's exactly 32 bytes, no extra characters)
    private_key = sender['private_key']

    # Sign the transaction with the sender's private key
    signed_txn = web3.eth.account.sign_transaction(txn, private_key)
    
    # Send the transaction
    txn_hash = web3.eth.send_raw_transaction(signed_txn.rawTransaction)
    
    # Ensure the transaction was sent successfully
    assert txn_hash is not None
    print(f"Transaction sent with hash: {txn_hash.hex()}")


def test_receiver_balance_increase(sender_receiver):
    sender, receiver = sender_receiver

    # Check if the receiver address is valid
    if not Web3.is_address(receiver['address']):
        raise ValueError("Receiver address is invalid")

    # Check the initial balance of the receiver
    initial_balance = web3.eth.get_balance(receiver['address'])
    
    # Send the transaction and wait for confirmation
    txn = {
        'to': receiver['address'],
        'value': web3.to_wei(1, 'ether'),
        'gas': 21000,
        'gasPrice': web3.to_wei('2', 'gwei'),
        'nonce': web3.eth.get_transaction_count(sender['address']),
    }
    
    signed_txn = web3.eth.account.sign_transaction(txn, sender['private_key'])
    txn_hash = web3.eth.send_raw_transaction(signed_txn.rawTransaction)
    
    # Wait for the transaction receipt
    web3.eth.wait_for_transaction_receipt(txn_hash)
    
    # Check the final balance of the receiver
    final_balance = web3.eth.get_balance(receiver['address'])
    
    # Assert that the balance has increased
    assert final_balance > initial_balance
    print(f"Receiver's balance has increased: {web3.from_wei(final_balance, 'ether')} ETH")
