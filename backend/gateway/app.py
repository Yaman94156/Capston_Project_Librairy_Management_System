from flask import Flask, request, Response
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
BOOK_SERVICE_URL = 'http://book-service:5001'
MEMBER_SERVICE_URL = 'http://member-service:5002'
ADMIN_SERVICE_URL = 'http://admin-service:5003' 

def proxy(path, service_url):
    if request.method == 'GET':
        resp = requests.get(f'{service_url}{path}')
        return Response(resp.content, status=resp.status_code, content_type=resp.headers['Content-Type'])
    if request.method == 'POST':
        resp = requests.post(f'{service_url}{path}', json=request.json)
        return Response(resp.content, status=resp.status_code, content_type=resp.headers['Content-Type'])

@app.route('/books', methods=['GET', 'POST'])
def books():
    return proxy('/books', BOOK_SERVICE_URL)

@app.route('/book/quantity/decrement', methods=['POST'])
def book_quantity_decrement():
    return proxy('/book/quantity/decrement', BOOK_SERVICE_URL)

@app.route('/book/quantity/increment', methods=['POST'])
def book_quantity_increment():
    return proxy('/book/quantity/increment', BOOK_SERVICE_URL)

@app.route('/members', methods=['GET', 'POST'])
def members():
    return proxy('/members', MEMBER_SERVICE_URL)

@app.route('/borrow', methods=['POST'])
def borrow_book():
    return proxy('/borrow', MEMBER_SERVICE_URL)

@app.route('/return', methods=['POST'])
def return_book():
    return proxy('/return', MEMBER_SERVICE_URL)

@app.route('/borrows/<int:member_id>', methods=['GET'])
def member_borrows(member_id):
    resp = requests.get(f'{MEMBER_SERVICE_URL}/borrows/{member_id}')
    return Response(resp.content, status=resp.status_code, content_type=resp.headers['Content-Type'])

@app.route('/borrows', methods=['GET'])
def all_borrows():
    resp = requests.get(f'{MEMBER_SERVICE_URL}/borrows')
    return Response(resp.content, status=resp.status_code, content_type=resp.headers['Content-Type'])

@app.route('/login', methods=['POST'])
def login():
    resp = requests.post(f'{MEMBER_SERVICE_URL}/login', json=request.json)
    return Response(resp.content, status=resp.status_code, content_type=resp.headers['Content-Type'])

@app.route('/admin/login', methods=['POST'])
def admin_login():
    return proxy('/admin/login', ADMIN_SERVICE_URL)

@app.route('/books/<int:book_id>', methods=['GET', 'PUT', 'DELETE'])
def book_by_id(book_id):
    if request.method == 'GET':
        resp = requests.get(f'{BOOK_SERVICE_URL}/books/{book_id}')
    elif request.method == 'PUT':
        resp = requests.put(f'{BOOK_SERVICE_URL}/books/{book_id}', json=request.json)
    elif request.method == 'DELETE':
        resp = requests.delete(f'{BOOK_SERVICE_URL}/books/{book_id}')
    return Response(resp.content, status=resp.status_code, content_type=resp.headers['Content-Type'])

@app.route('/members/<int:member_id>', methods=['GET', 'PUT', 'DELETE'])
def member_by_id(member_id):
    if request.method == 'GET':
        resp = requests.get(f'{MEMBER_SERVICE_URL}/members/{member_id}')
    elif request.method == 'PUT':
        resp = requests.put(f'{MEMBER_SERVICE_URL}/members/{member_id}', json=request.json)
    elif request.method == 'DELETE':
        resp = requests.delete(f'{MEMBER_SERVICE_URL}/members/{member_id}')
    return Response(resp.content, status=resp.status_code, content_type=resp.headers['Content-Type'])


@app.route('/books/search', methods=['GET'])
def books_search():
    # Forward query params to book service
    resp = requests.get(f'{BOOK_SERVICE_URL}/books/search', params=request.args)
    return Response(resp.content, status=resp.status_code, content_type=resp.headers.get('Content-Type', 'application/json'))


if __name__ == "__main__":
    app.run(host="0.0.0.0", port="5000")
