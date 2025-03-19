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


    images = os.listdir('test_media')
    logger.info(f"Images: {images}")

    extraced_images = []

    def get_2_unique_users(self):
        # Create 2 users from images listing, where each user has a unique email, takes the associated image for profile_image_url
        # For each user, the wall_image_url will be either background_one.jpeg or background_two.jpeg where we upload and get the respective url

        # fetching images in directory
        images = os.listdir('test_media')
        logger.info(f"\nImages found in directory: {images}\n")
        
        # filter to find two images for users
        user_images = [image for image in images if image not in ['background_one.jpeg', 'background_two.jpeg']][:2]

        if len(user_images) < 2:
            logger.error("Not enough images to create 2 unique users")
            self.fail("Not enough images to create 2 unique users")
        
        users = []
        for i, image in enumerate(user_images):
            username = image.split('.')[0].lower()
            email = f"{username}@gmail.com"
            profile_image_url = f"test_media/{image}"
            wall_image_url = f"test_media/background_{'one' if i % 2 == 0 else 'two'}.jpeg"
            
            otp = generate_otp(email)
            otp_verified = verify_otp(email, otp)
            
            if otp_verified:
                user_response = self.client.post('/api/user', json={
                    'username': username,
                    'email': email,
                    'otp_secret': otp,
                    'profile_image_url': profile_image_url,
                    'wall_image_url': wall_image_url
                })
                self.assertEqual(user_response.status_code, 201)
                users.append(user_response.get_json()['data'])
            else:
                logger.error(f"OTP verification failed for {email}")
                self.fail(f"OTP verification failed for {email}")
        
        return users

    def get_8_unique_users(self):
        pass
    
    
if __name__ == '__main__':
    unittest.main()