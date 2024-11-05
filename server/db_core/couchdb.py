from couchdb import Server

couch_db_url = f'http://admin:admin@127.0.0.1:5984/'
print('COUCH DB URL', couch_db_url)
couch = Server(couch_db_url)
couchdb = couch['product_db']

