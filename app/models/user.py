from mongoengine import Document, StringField, EmailField, DateTimeField
from datetime import datetime

class User(Document):
    username = StringField(max_length=80, required=True, unique=True)
    email = EmailField(required=True, unique=True)
    created_at = DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'users',
        'indexes': [
            'username',
            'email'
        ]
    }
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat()
        }
    
    def __repr__(self):
        return f'<User {self.username}>' 