from flask import Flask
from models import db
from routes import member_bp
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///members.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
app.register_blueprint(member_bp)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(port=5002, host="0.0.0.0")
