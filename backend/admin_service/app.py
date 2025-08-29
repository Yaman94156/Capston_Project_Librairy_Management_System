from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///admin.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)

@app.route('/admin/login', methods=['POST'])
def admin_login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400

    admin = Admin.query.filter_by(username=username, password=password).first()

    if not admin:
        return jsonify({'error': 'Invalid username or password'}), 401

    return jsonify({
        'message': 'Admin login successful',
        'admin': {
            'id': admin.id,
            'username': admin.username
        }
    })

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        # Add default admin if doesn't exist
        if not Admin.query.filter_by(username='admin').first():
            new_admin = Admin(username='admin', password='adminpass')
            db.session.add(new_admin)
            db.session.commit()
    app.run(port=5003, host="0.0.0.0")
