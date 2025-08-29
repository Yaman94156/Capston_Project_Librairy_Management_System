from flask import Blueprint, request, jsonify
from models import db, Member, Borrow
from datetime import date, datetime
import requests

member_bp = Blueprint('member_bp', __name__)

BOOK_SERVICE_URL = 'http://book-service:5001'

@member_bp.route('/members', methods=['POST'])
def add_member():
    data = request.json
    if Member.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Member email already exists.'}), 400
    member = Member(**data)
    db.session.add(member)
    db.session.commit()
    return jsonify({'message': 'Member added'}), 201

@member_bp.route('/members', methods=['GET'])
def list_members():
    members = Member.query.all()
    return jsonify([{
        'id': m.id,
        'name': m.name,
        'email': m.email,
        'phone': m.phone,
        'address': m.address
    } for m in members])

@member_bp.route('/borrow', methods=['POST'])
def borrow_book():
    data = request.json
    member = Member.query.get(data['member_id'])
    if not member:
        return jsonify({'error': 'Member not found'}), 404
    # Check book availability by calling book service
    resp = requests.get(f'{BOOK_SERVICE_URL}/books')
    books = resp.json()
    book = next((b for b in books if b['isbn'] == data['isbn']), None)
    if not book:
        return jsonify({'error': 'Book not found'}), 404
    if book['quantity'] < 1:
        return jsonify({'error': 'Book not available'}), 400
    # Issue book - create borrow record
    borrow = Borrow(
        member_id=member.id,
        isbn=data['isbn'],
        borrow_date=date.today(),
        return_date=datetime.strptime(data['return_date'], '%Y-%m-%d').date()
    )
    # Update book quantity by calling book service endpoint (not implemented in book service yet, so call native API here)
    update_resp = requests.post(f'{BOOK_SERVICE_URL}/book/quantity/decrement', json={'isbn': data['isbn']})
    if update_resp.status_code != 200:
        return jsonify({'error': 'Failed to update book quantity'}), 500
    db.session.add(borrow)
    db.session.commit()
    return jsonify({'message': 'Book issued successfully'})

@member_bp.route('/return', methods=['POST'])
def return_book():
    data = request.json
    borrow = Borrow.query.filter_by(member_id=data['member_id'], isbn=data['isbn'], returned_on=None).first()
    if not borrow:
        return jsonify({'error': 'No active borrow found'}), 404
    borrow.returned_on = date.today()
    # Update book quantity increment in book service
    update_resp = requests.post(f'{BOOK_SERVICE_URL}/book/quantity/increment', json={'isbn': data['isbn']})
    if update_resp.status_code != 200:
        return jsonify({'error': 'Failed to update book quantity'}), 500
    db.session.commit()
    # Calculate fine
    late_days = (borrow.returned_on - borrow.return_date).days
    fine = 5 * late_days if late_days > 0 else 0
    return jsonify({'message': 'Book returned successfully', 'fine': fine})

@member_bp.route('/borrows/<int:member_id>', methods=['GET'])
def member_borrows(member_id):
    borrows = Borrow.query.filter_by(member_id=member_id).all()
    result = []
    resp = requests.get(f'{BOOK_SERVICE_URL}/books')
    books = resp.json()
    for b in borrows:
        book = next((bk for bk in books if bk['isbn'] == b.isbn), None)
        days_left = (b.return_date - date.today()).days
        overdue = days_left < 0
        fine = abs(days_left) * 5 if overdue else 0
        result.append({
            'isbn': b.isbn,
            'book_name': book['name'] if book else '',
            'description': book['description'] if book else '',
            'borrow_date': b.borrow_date.isoformat(),
            'return_date': b.return_date.isoformat(),
            'days_left': days_left,
            'overdue': overdue,
            'fine': fine,
            'returned_on': b.returned_on.isoformat() if b.returned_on else None
        })
    return jsonify(result)

@member_bp.route('/borrows', methods=['GET'])
def all_borrows():
    borrows = Borrow.query.all()
    # Get all books from book service to enrich data with book details
    resp = requests.get(f'{BOOK_SERVICE_URL}/books')
    books = resp.json()

    result = []
    for b in borrows:
        book = next((bk for bk in books if bk['isbn'] == b.isbn), None)
        days_left = (b.return_date - date.today()).days
        overdue = days_left < 0
        fine = abs(days_left) * 5 if overdue else 0
        result.append({
            'borrow_id': b.id,
            'member_id': b.member_id,
            'isbn': b.isbn,
            'book_name': book['name'] if book else '',
            'borrow_date': b.borrow_date.isoformat(),
            'return_date': b.return_date.isoformat(),
            'returned_on': b.returned_on.isoformat() if b.returned_on else None,
            'days_left': days_left,
            'overdue': overdue,
            'fine': fine
        })
    return jsonify(result)

@member_bp.route('/login', methods=['POST'])
def member_login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    member = Member.query.filter_by(email=email, password=password).first()

    if not member:
        return jsonify({"error": "Invalid email or password"}), 401

    return jsonify({
        "message": "Login successful",
        "member": {
            "id": member.id,
            "name": member.name,
            "email": member.email,
            "phone": member.phone,
            "address": member.address
        }
    })

@member_bp.route('/members/<int:member_id>', methods=['GET', 'PUT'])
def member_detail(member_id):
    member = Member.query.get(member_id)
    if not member:
        return jsonify({'error': 'Member not found'}), 404

    if request.method == 'GET':
        return jsonify({
            'id': member.id,
            'name': member.name,
            'email': member.email,
            'phone': member.phone,
            'address': member.address
        })

    if request.method == 'PUT':
        data = request.json
        member.name = data.get('name', member.name)
        member.email = data.get('email', member.email)
        member.phone = data.get('phone', member.phone)
        member.address = data.get('address', member.address)
        # If password change needed, add here carefully (not recommended without hashing)
        db.session.commit()
        return jsonify({'message': 'Member updated successfully'})

@member_bp.route('/members/<int:member_id>', methods=['DELETE'])
def delete_member(member_id):
    member = Member.query.get(member_id)
    if not member:
        return jsonify({'error': 'Member not found'}), 404
    db.session.delete(member)
    db.session.commit()
    return jsonify({'message': 'Member deleted successfully'})
