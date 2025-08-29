from flask_sqlalchemy import SQLAlchemy
from datetime import date

db = SQLAlchemy()

class Member(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    address = db.Column(db.String(200))
    password = db.Column(db.String(128), nullable=False)

class Borrow(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    member_id = db.Column(db.Integer, db.ForeignKey('member.id'), nullable=False)
    isbn = db.Column(db.String(20), nullable=False)
    borrow_date = db.Column(db.Date, nullable=False, default=date.today)
    return_date = db.Column(db.Date, nullable=False)
    returned_on = db.Column(db.Date, nullable=True)

    member = db.relationship("Member", backref='borrows')
