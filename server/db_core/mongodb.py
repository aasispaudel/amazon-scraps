from dotenv import load_dotenv
import os
from pymongo import MongoClient

load_dotenv()

mongo_db_url = (f'mongodb://{os.getenv("MONGO_DB_USERNAME")}:'
                f'{os.getenv("MONGO_DB_PASSWORD")}@{os.getenv("MONGO_DB_HOST")}:'
                f'{os.getenv("MONGO_DB_PORT")}/')

db_client = MongoClient(mongo_db_url)
product_db = db_client['product_scraps']
products_amazon = product_db['amazon']
