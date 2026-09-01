# extensions.py - Flask Extension Configuration
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

# SQLAlchemy Database Extension
# Provides object-relational mapping for PostgreSQL database operations
db = SQLAlchemy()

# Bcrypt Password Hashing Extension  
# Implements secure password hashing using the bcrypt algorithm
bcrypt = Bcrypt()