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
except Exception as e:
    print("Warning: Database connection failed. Mocking db connection for visual verification.", e)
    class MockCursor:
        def execute(self, *args, **kwargs): pass
        def fetchone(self): return None
    class MockConn:
        def commit(self): pass
        def cursor(self): return MockCursor()
    conn = MockConn()
    cursor = conn.cursor()