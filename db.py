try:
    import psycopg2
    conn = psycopg2.connect(
        host="localhost",
        database="ALGOLINGO",
        user="postgres",
        password="Ketan@257",
        port="5432"
    )
    cursor = conn.cursor()
    # Ensure users table has gamification columns
    try:
        cursor.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;")
        cursor.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0;")
        cursor.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS gold INTEGER DEFAULT 1250;")
        cursor.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS hp INTEGER DEFAULT 100;")
        cursor.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS completed_questions TEXT DEFAULT '';")
        conn.commit()
        print("Database schema verified and updated successfully.")
    except Exception as db_err:
        conn.rollback()
        print("Failed to run schema updates, rolling back:", db_err)
except Exception as e:
    print("Warning: PostgreSQL database connection failed. Falling back to local SQLite3 database algolingo.db.", e)
    import sqlite3
    try:
        sqlite_conn = sqlite3.connect("algolingo.db", check_same_thread=False)
        sqlite_cur = sqlite_conn.cursor()
        sqlite_cur.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                level INTEGER DEFAULT 1,
                xp INTEGER DEFAULT 0,
                gold INTEGER DEFAULT 1250,
                hp INTEGER DEFAULT 100,
                completed_questions TEXT DEFAULT ''
            );
        """)
        sqlite_conn.commit()
        
        class SqliteCursorWrapper:
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
            def __init__(self, conn):
                self.conn = conn
            def commit(self):
                self.conn.commit()
            def rollback(self):
                self.conn.rollback()
            def cursor(self):
                return SqliteCursorWrapper(self.conn.cursor())
                
        conn = SqliteConnWrapper(sqlite_conn)
        cursor = conn.cursor()
        print("SQLite3 database fallback initialized successfully.")
    except Exception as sq_err:
        print("Critical: SQLite3 fallback failed as well, using memory mock:", sq_err)
        class MockCursor:
            def execute(self, *args, **kwargs): pass
            def fetchone(self): return None
        class MockConn:
            def commit(self): pass
            def cursor(self): return MockCursor()
        conn = MockConn()
        cursor = conn.cursor()
