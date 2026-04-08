from flask import Flask
import os

def create_app():
    app = Flask(__name__)
    app.secret_key=os.getenv("SECRET_KEY","dev-secret-key-change-in-prod")

    from app.routes import main
    app.register_blueprint(main)

    return app
