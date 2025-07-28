from graphene import ObjectType, String, Field, List
from app.models import User

# User GraphQL Type
class UserType(ObjectType):
    id = String()
    username = String()
    email = String()
    created_at = String()

# User Queries
class UserQueries(ObjectType):
    users = List(UserType)
    user = Field(UserType, id=String(required=True))
    
    def resolve_users(self, info):
        return User.objects.all()
    
    def resolve_user(self, info, id):
        try:
            return User.objects.get(id=id)
        except User.DoesNotExist:
            return None 