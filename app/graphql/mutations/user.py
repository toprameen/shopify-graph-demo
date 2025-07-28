from graphene import Mutation, String, Field
from app.models import User
from app.graphql.types import UserType

# Create User Mutation
class CreateUser(Mutation):
    class Arguments:
        username = String(required=True)
        email = String(required=True)
    
    user = Field(UserType)
    success = String()
    error = String()
    
    def mutate(self, info, username, email):
        try:
            # Check if user already exists
            if User.objects(username=username).first():
                return CreateUser(error="Username already exists")
            
            if User.objects(email=email).first():
                return CreateUser(error="Email already exists")
            
            # Create new user
            user = User(username=username, email=email)
            user.save()
            
            return CreateUser(user=user, success="User created successfully")
        except Exception as e:
            return CreateUser(error=str(e))

# Update User Mutation
class UpdateUser(Mutation):
    class Arguments:
        id = String(required=True)
        username = String()
        email = String()
    
    user = Field(UserType)
    success = String()
    error = String()
    
    def mutate(self, info, id, username=None, email=None):
        try:
            user = User.objects.get(id=id)
            
            if username:
                user.username = username
            if email:
                user.email = email
                
            user.save()
            return UpdateUser(user=user, success="User updated successfully")
        except User.DoesNotExist:
            return UpdateUser(error="User not found")
        except Exception as e:
            return UpdateUser(error=str(e))

# Delete User Mutation
class DeleteUser(Mutation):
    class Arguments:
        id = String(required=True)
    
    success = String()
    error = String()
    
    def mutate(self, info, id):
        try:
            user = User.objects.get(id=id)
            user.delete()
            return DeleteUser(success="User deleted successfully")
        except User.DoesNotExist:
            return DeleteUser(error="User not found")
        except Exception as e:
            return DeleteUser(error=str(e)) 