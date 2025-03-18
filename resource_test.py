import unittest
import logging
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_testing import TestCase
from backend import app, db, User, Group, Chat, WalletAccount, ChatMessage, email_otps, generate_otp, verify_otp
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TestAPI(TestCase):
    SQLALCHEMY_DATABASE_URI = "sqlite:///app.db"
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
        print(f"\n\ncalling a soft tearDown")
        logger.info("\nTeardown complete, database dropped")

    def log_table_records(self, model):
        records = model.query.all()
        if records:
            logger.info(f"\nTable: {model.__tablename__}\n")
            for record in records:
                record_dict = record.to_dict()
                logger.info("\n\n")
                logger.info(", ".join(f"{key}: {value}" for key, value in record_dict.items()))
        else:
            logger.info(f"\nNo records found in table: {model.__tablename__}\n")

    def test_create_two_users(self):
        # Create two users by fetching name from the images [aku.jpeg, samurai.jpeg] in test_media folder
        # generate username and email from the extracted name, then proceed to generate the otp

        # fetching images in directory
        images = os.listdir('test_media')
        logger.info(f"\nImages found in directory: {images}\n")
        
        # filter to find aku.jpeg and samurai.jpeg
        aku_image = 'aku.jpeg' if 'aku.jpeg' in images else None
        samurai_image = 'samurai.jpeg' if 'samurai.jpeg' in images else None

        # Check if the images exist
        if not aku_image or not samurai_image:
            logger.error("Required images not found in the directory")
            self.fail("Required images not found in the directory")
        
        # extract name
        aku_name = aku_image.split('.')[0]
        samurai_name = samurai_image.split('.')[0]
        logger.info(f"Extracted names: {aku_name}, {samurai_name}")
        
        # generate username and email
        aku_username = aku_name.lower()
        samurai_username = samurai_name.lower()
        aku_email = f"{aku_name.replace(' ', '.').lower()}@gmail.com"
        samurai_email = f"{samurai_name.replace(' ', '.').lower()}@gmail.com"
        logger.info(f"Generated username and email: {aku_username}, {aku_email}, {samurai_username}, {samurai_email}")
        
        # generate otp
        aku_otp = generate_otp(aku_email)
        samurai_otp = generate_otp(samurai_email)
        logger.info(f"Generated otp: {aku_otp}, {samurai_otp}")
        
        # verify otp
        aku_verified = verify_otp(aku_email, aku_otp)
        samurai_verified = verify_otp(samurai_email, samurai_otp)
        logger.info(f"Verified otp: {aku_verified}, {samurai_verified}")
        
        # create users
        aku_user = User(username=aku_username, email=aku_email, otp_secret=aku_otp)
        samurai_user = User(username=samurai_username, email=samurai_email, otp_secret=samurai_otp)
        db.session.add(aku_user)
        db.session.add(samurai_user)
        db.session.commit()
        
        self.log_table_records(User)

    def test_create_group(self):
        pass 

    

    
if __name__ == '__main__':
    unittest.main()