import graphene
from graphene import ObjectType, String, Schema
from app.graphql.types.user import UserQueries
from app.graphql.mutations import CreateUser, UpdateUser, DeleteUser

# Main Query class that combines all queries
class Query(UserQueries):
    health = String()
    
    def resolve_health(self, info):
        return "GraphQL API is running successfully!"

# Main Mutations class that combines all mutations
class Mutations(ObjectType):
    create_user = CreateUser.Field()
    update_user = UpdateUser.Field()
    delete_user = DeleteUser.Field()

# Create the main schema
schema = Schema(query=Query, mutation=Mutations) 