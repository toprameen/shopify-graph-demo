from flask import Flask
from flask_cors import CORS
from mongoengine import connect
from flask_graphql import GraphQLView
from config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize CORS
    CORS(app)
    
    # Initialize MongoDB connection
    connect(**app.config['MONGODB_SETTINGS'])
    
    # Register blueprints
    from app.main import bp as main_bp
    app.register_blueprint(main_bp)
    
    # Import GraphQL schema after app initialization
    from app.graphql.schema import schema
    
    # Add GraphQL endpoint
    app.add_url_rule(
        '/graphql',
        view_func=GraphQLView.as_view('graphql', schema=schema, graphiql=True)
    )
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True) 