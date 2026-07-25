"""
Database connection and initialization module for Algolingo.
Supports PostgreSQL with optional SQLite fallback.
"""

import os
from dotenv import load_dotenv
import logging

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# PostgreSQL configuration
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "algolingo")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_ENABLE_SSL = os.getenv("DB_ENABLE_SSL", "false").lower() == "true"

# Try PostgreSQL connection first
conn = None
cursor = None

try:
    import psycopg2
    from psycopg2 import pool
    
    # Create connection pool for better performance
    connection_string = (
        f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )
    
    conn_params = {
        "host": DB_HOST,
        "port": DB_PORT,
        "database": DB_NAME,
        "user": DB_USER,
        "password": DB_PASSWORD,
    }
    
    if DB_ENABLE_SSL:
        conn_params["sslmode"] = "require"
    
    conn = psycopg2.connect(**conn_params)
    cursor = conn.cursor()
    
    # Initialize database schema
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(100) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255),
            google_id VARCHAR(255),
            provider VARCHAR(50),
            profile_picture VARCHAR(500),
            level INTEGER DEFAULT 1,
            xp INTEGER DEFAULT 0,
            gold INTEGER DEFAULT 1250,
            hp INTEGER DEFAULT 100,
            completed_questions TEXT DEFAULT '',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    
    # Ensure all required columns exist (for migration support)
    cursor.execute("""
        ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255);
        ALTER TABLE users ADD COLUMN IF NOT EXISTS provider VARCHAR(50);
        ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_picture VARCHAR(500);
        ALTER TABLE users ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS gold INTEGER DEFAULT 1250;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS hp INTEGER DEFAULT 100;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS completed_questions TEXT DEFAULT '';
        ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    """)
    
    conn.commit()
    logger.info("✓ PostgreSQL database connected and schema verified successfully.")
    
except (ImportError, psycopg2.Error) as e:
    logger.warning(f"PostgreSQL connection failed: {e}")
    logger.info("Falling back to SQLite3 database...")
    
    try:
        import sqlite3
        
        sqlite_conn = sqlite3.connect("algolingo.db", check_same_thread=False)
        sqlite_cur = sqlite_conn.cursor()
        
        # SQLite schema
        sqlite_cur.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT,
                google_id TEXT,
                provider TEXT,
                profile_picture TEXT,
                level INTEGER DEFAULT 1,
                xp INTEGER DEFAULT 0,
                gold INTEGER DEFAULT 1250,
                hp INTEGER DEFAULT 100,
                completed_questions TEXT DEFAULT '',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        sqlite_conn.commit()
        
        # Wrapper classes to maintain psycopg2-like interface
        class SqliteCursorWrapper:
            """Wrapper to adapt SQLite cursor to psycopg2 interface"""
            def __init__(self, cur):
                self.cur = cur
            
            def execute(self, query, params=None):
                translated_query = query.replace('%s', '?')
                if params:
                    self.cur.execute(translated_query, params)
                else:
                    self.cur.execute(translated_query)
            
            def fetchone(self):
                return self.cur.fetchone()
            
            def fetchall(self):
                return self.cur.fetchall()
        
        class SqliteConnWrapper:
            """Wrapper to adapt SQLite connection to psycopg2 interface"""
            def __init__(self, sqlite_conn):
                self.conn = sqlite_conn
            
            def commit(self):
                self.conn.commit()
            
            def rollback(self):
                self.conn.rollback()
            
            def cursor(self):
                return SqliteCursorWrapper(self.conn.cursor())
        
        conn = SqliteConnWrapper(sqlite_conn)
        cursor = conn.cursor()
        logger.info("✓ SQLite3 database fallback initialized successfully.")
        
    except Exception as sq_err:
        logger.error(f"SQLite3 fallback also failed: {sq_err}")
        logger.warning("Using in-memory mock database (data will not persist).")
        
        # Mock classes for complete failure
        class MockCursor:
            def execute(self, *args, **kwargs):
                pass
            def fetchone(self):
                return None
            def fetchall(self):
                return []
        
        class MockConn:
            def commit(self):
                pass
            def rollback(self):
                pass
            def cursor(self):
                return MockCursor()
        
        conn = MockConn()
        cursor = conn.cursor()
