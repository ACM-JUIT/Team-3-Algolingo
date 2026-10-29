import os
import unittest
import sqlite3
import tempfile
from unittest.mock import patch

# Test suite covering all Algolingo authentication and registration requirements

class TestAlgolingoAuth(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Ensure SECRET_KEY is present for base importing
        if not os.environ.get("SECRET_KEY"):
            os.environ["SECRET_KEY"] = "test_secret_key_12345"

        import app as app_module
        cls.app_module = app_module
        cls.app = app_module.app
        cls.app.config['TESTING'] = True
        cls.client = cls.app.test_client()

    def setUp(self):
        # Create an isolated temporary SQLite database for tests
        self.temp_db = tempfile.NamedTemporaryFile(suffix=".db", delete=False)
        self.temp_db.close()
        self.db_path = self.temp_db.name

        self.conn = sqlite3.connect(self.db_path, check_same_thread=False)
        self.cur = self.conn.cursor()
        self.cur.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                level INTEGER DEFAULT 1,
                xp INTEGER DEFAULT 0,
                gold INTEGER DEFAULT 1250,
                hp INTEGER DEFAULT 100,
                completed_questions TEXT DEFAULT '',
                google_id TEXT,
                provider TEXT DEFAULT 'local',
                profile_picture TEXT
            );
        """)
        self.conn.commit()

        # Wire the mock into db.conn and db.cursor used by app
        import db
        self.db_module = db
        self.test_conn = db.SqliteConnWrapper(self.conn)
        self.test_cur = self.test_conn.cursor()

        self.orig_conn = self.app_module.conn
        self.orig_cursor = self.app_module.cursor
        self.orig_db_conn = db.conn
        self.orig_db_cursor = db.cursor

        self.app_module.conn = self.test_conn
        self.app_module.cursor = self.test_cur
        db.conn = self.test_conn
        db.cursor = self.test_cur

    def tearDown(self):
        # Restore original connections
        self.app_module.conn = self.orig_conn
        self.app_module.cursor = self.orig_cursor
        self.db_module.conn = self.orig_db_conn
        self.db_module.cursor = self.orig_db_cursor
        self.test_conn.close()
        try:
            os.remove(self.db_path)
        except Exception:
            pass

    def test_new_user_registration(self):
        """Verify registration with a new email address via JSON and Form."""
        # 1. JSON / Fetch submission
        res = self.client.post('/register', json={
            'username': 'HeroOne',
            'email': 'hero1@algolingo.com',
            'password': 'password123'
        }, headers={'Accept': 'application/json'})

        self.assertEqual(res.status_code, 201)
        data = res.get_json()
        self.assertEqual(data.get('status'), 'success')

        # Check DB
        self.cur.execute("SELECT username, email FROM users WHERE email='hero1@algolingo.com'")
        row = self.cur.fetchone()
        self.assertIsNotNone(row)
        self.assertEqual(row[0], 'HeroOne')
        self.assertEqual(row[1], 'hero1@algolingo.com')

        # 2. Standard Form submission
        res_form = self.client.post('/register', data={
            'username': 'HeroTwo',
            'email': 'hero2@algolingo.com',
            'password': 'password123'
        })
        self.assertEqual(res_form.status_code, 302)
        self.assertIn('/login', res_form.headers.get('Location'))

    def test_duplicate_email_registration_handled_gracefully(self):
        """Verify duplicate-email registration produces 409 and clear message, not 500 error."""
        # Register initial user
        self.client.post('/register', json={
            'username': 'OriginalUser',
            'email': 'Duplicate@example.com',
            'password': 'password123'
        }, headers={'Accept': 'application/json'})

        # Attempt to register with same email in different case and trailing spaces
        res = self.client.post('/register', json={
            'username': 'AnotherUser',
            'email': '  duplicate@example.com  ',
            'password': 'password456'
        }, headers={'Accept': 'application/json'})

        self.assertEqual(res.status_code, 409)
        data = res.get_json()
        self.assertEqual(data.get('status'), 'error')
        self.assertIn('already exists', data.get('message', '').lower())
        self.assertEqual(data.get('field'), 'email')

        # Attempt with Form POST
        res_form = self.client.post('/register', data={
            'username': 'DifferentUser',
            'email': 'duplicate@example.com',
            'password': 'password456'
        })
        self.assertEqual(res_form.status_code, 409)
        self.assertIn(b'already exists', res_form.data)

    def test_duplicate_username_registration_handled_gracefully(self):
        """Verify duplicate-username registration produces 409 and user-friendly error."""
        self.client.post('/register', json={
            'username': 'CodeMaster',
            'email': 'first@example.com',
            'password': 'password123'
        }, headers={'Accept': 'application/json'})

        res = self.client.post('/register', json={
            'username': '  codemaster  ',
            'email': 'second@example.com',
            'password': 'password456'
        }, headers={'Accept': 'application/json'})

        self.assertEqual(res.status_code, 409)
        data = res.get_json()
        self.assertEqual(data.get('status'), 'error')
        self.assertIn('already taken', data.get('message', '').lower())
        self.assertEqual(data.get('field'), 'username')

    def test_login_and_session_creation(self):
        """Verify login sets session['user_id'] and allows access to dashboard."""
        self.client.post('/register', json={
            'username': 'GamerHero',
            'email': 'gamer@algolingo.com',
            'password': 'secretpassword'
        }, headers={'Accept': 'application/json'})

        # Test successful login with mixed casing email
        res = self.client.post('/login', json={
            'email': '  GAMER@algolingo.com ',
            'password': 'secretpassword'
        }, headers={'Accept': 'application/json'})

        self.assertEqual(res.status_code, 200)
        with self.client.session_transaction() as sess:
            self.assertIn('user_id', sess)
            self.assertEqual(sess.get('username'), 'GamerHero')

        # Access dashboard with session
        dash_res = self.client.get('/dashboard')
        self.assertEqual(dash_res.status_code, 200)

    def test_invalid_password_rejected(self):
        """Verify invalid passwords return 401 and are rejected."""
        self.client.post('/register', json={
            'username': 'SecureUser',
            'email': 'secure@algolingo.com',
            'password': 'correct_password'
        }, headers={'Accept': 'application/json'})

        res = self.client.post('/login', json={
            'email': 'secure@algolingo.com',
            'password': 'wrong_password'
        }, headers={'Accept': 'application/json'})

        self.assertEqual(res.status_code, 401)
        data = res.get_json()
        self.assertEqual(data.get('status'), 'error')
        self.assertIn('invalid email or password', data.get('message', '').lower())

    def test_existing_users_can_log_in(self):
        """Verify that existing pre-seeded users in database can still log in."""
        from werkzeug.security import generate_password_hash
        hashed = generate_password_hash("veteran_password")
        self.cur.execute(
            """
            INSERT INTO users (username, email, password_hash, level, xp, gold, hp)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            ("VeteranPlayer", "veteran@algolingo.com", hashed, 5, 2400, 5000, 100)
        )
        self.conn.commit()

        # Existing user logs in
        res = self.client.post('/login', json={
            'email': 'veteran@algolingo.com',
            'password': 'veteran_password'
        }, headers={'Accept': 'application/json'})

        self.assertEqual(res.status_code, 200)
        with self.client.session_transaction() as sess:
            self.assertEqual(sess.get('username'), 'VeteranPlayer')

    def test_google_oauth_flow_compatibility_and_deduplication(self):
        """Verify Google OAuth creates compatible user record and does not duplicate on repeat login."""
        # Mock google.authorize_access_token to return user info
        mock_userinfo = {
            "email": "GoogleHero@example.com",
            "name": "GoogleHero",
            "sub": "google-id-12345",
            "picture": "https://example.com/avatar.png"
        }

        with patch.object(self.app_module.google, 'authorize_access_token', return_value={"userinfo": mock_userinfo}):
            # First Google login creates the user
            res1 = self.client.get('/login/google/authorized')
            self.assertEqual(res1.status_code, 302)
            self.assertIn('/dashboard', res1.headers.get('Location'))

            # Check DB
            self.cur.execute("SELECT id, username, email, google_id, provider FROM users WHERE email='googlehero@example.com'")
            user_row = self.cur.fetchone()
            self.assertIsNotNone(user_row)
            first_user_id = user_row[0]
            self.assertEqual(user_row[3], 'google-id-12345')
            self.assertEqual(user_row[4], 'google')

            # Count total users
            self.cur.execute("SELECT count(*) FROM users WHERE email='googlehero@example.com'")
            self.assertEqual(self.cur.fetchone()[0], 1)

            # Second Google login should not create a duplicate user
            res2 = self.client.get('/login/google/authorized')
            self.assertEqual(res2.status_code, 302)

            self.cur.execute("SELECT count(*) FROM users WHERE email='googlehero@example.com'")
            self.assertEqual(self.cur.fetchone()[0], 1)

    def test_missing_secret_key_reported_clearly(self):
        """Verify missing SECRET_KEY is detected and raises a clear configuration error."""
        orig_key = self.app.secret_key
        try:
            self.app.secret_key = None
            with self.assertRaises(RuntimeError) as ctx:
                self.client.get('/')
            self.assertIn("SECRET_KEY", str(ctx.exception))
        finally:
            self.app.secret_key = orig_key


if __name__ == '__main__':
    unittest.main()
