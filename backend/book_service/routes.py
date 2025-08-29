from flask import Blueprint, request, jsonify
from models import db, Book

book_bp = Blueprint('book_bp', __name__)

@book_bp.route('/books', methods=['POST'])
def add_book():
    data = request.json
    if Book.query.filter_by(isbn=data['isbn']).first():
        return jsonify({'error': 'Book with ISBN already exists.'}), 400
    book = Book(
        isbn=data.get('isbn'),
        name=data.get('name'),
        author=data.get('author'),
        quantity=data.get('quantity'),
        description=data.get('description')
    )
    db.session.add(book)
    db.session.commit()
    return jsonify({'message': 'Book added'}), 201

@book_bp.route('/books', methods=['GET'])
def list_books():
    books = Book.query.all()
    return jsonify([
        {
            'id': b.id,
            'isbn': b.isbn,
            'name': b.name,
            'author': b.author,
            'quantity': b.quantity,
            'description': b.description,
        } for b in books
    ])

@book_bp.route('/book/quantity/decrement', methods=['POST'])
def decrement_quantity():
    data = request.json
    book = Book.query.filter_by(isbn=data['isbn']).first()
    if not book or book.quantity < 1:
        return jsonify({'error': 'Book not available'}), 400
    book.quantity -= 1
    db.session.commit()
    return jsonify({'message': 'Quantity decremented'})

@book_bp.route('/book/quantity/increment', methods=['POST'])
def increment_quantity():
    data = request.json
    book = Book.query.filter_by(isbn=data['isbn']).first()
    if not book:
        return jsonify({'error': 'Book not found'}), 404
    book.quantity += 1
    db.session.commit()
    return jsonify({'message': 'Quantity incremented'})
#fff
@book_bp.route('/books/<int:book_id>', methods=['GET', 'PUT'])
def book_detail(book_id):
    book = Book.query.get(book_id)
    if not book:
        return jsonify({'error': 'Book not found'}), 404

    if request.method == 'GET':
        return jsonify({
            'id': book.id,
            'isbn': book.isbn,
            'name': book.name,
            'author': book.author,
            'quantity': book.quantity,
            'description': book.description
        })

    if request.method == 'PUT':
        data = request.json
        book.isbn = data.get('isbn', book.isbn)
        book.name = data.get('name', book.name)
        book.author = data.get('author', book.author)
        book.quantity = data.get('quantity', book.quantity)
        book.description = data.get('description', book.description)
        db.session.commit()
        return jsonify({'message': 'Book updated successfully'})

@book_bp.route('/books/<int:book_id>', methods=['DELETE'])
def delete_book(book_id):
    book = Book.query.get(book_id)
    if not book:
        return jsonify({'error': 'Book not found'}), 404
    db.session.delete(book)
    db.session.commit()
    return jsonify({'message': 'Book deleted successfully'})


@book_bp.route('/books/search', methods=['GET'])
def search_book():
    """Search a book by id, isbn, name, or author.
       - ?id=<int> or ?isbn=<str> returns single book
       - ?name=<str> or ?author=<str> returns list of matching books (case-insensitive, partial match)
       If multiple query params are provided, priority: id -> isbn -> name/author (combined)
    """
    book_id = request.args.get('id', type=int)
    isbn = request.args.get('isbn', type=str)
    name = request.args.get('name', type=str)
    author = request.args.get('author', type=str)

    # Exact lookups first
    if book_id is not None:
        book = Book.query.get(book_id)
        if not book:
            return jsonify({'error': 'Book not found'}), 404
        return jsonify({
            'id': book.id,
            'isbn': book.isbn,
            'name': book.name,
            'author': book.author,
            'quantity': book.quantity,
            'description': book.description
        }), 200

    if isbn:
        book = Book.query.filter_by(isbn=isbn).first()
        if not book:
            return jsonify({'error': 'Book not found'}), 404
        return jsonify({
            'id': book.id,
            'isbn': book.isbn,
            'name': book.name,
            'author': book.author,
            'quantity': book.quantity,
            'description': book.description
        }), 200

    # Partial / fuzzy searches for name/author - return list
    query = Book.query
    filters = []
    if name:
        # Use case-insensitive partial match
        filters.append(Book.name.ilike(f"%{name}%"))
    if author:
        filters.append(Book.author.ilike(f"%{author}%"))

    if filters:
        # combine filters with AND so both name and author can be used together
        books = query.filter(*filters).all()
        results = [{
            'id': b.id,
            'isbn': b.isbn,
            'name': b.name,
            'author': b.author,
            'quantity': b.quantity,
            'description': b.description
        } for b in books]
        return jsonify(results), 200

    return jsonify({'error': 'Please provide id, isbn, name or author as query parameter'}), 400

