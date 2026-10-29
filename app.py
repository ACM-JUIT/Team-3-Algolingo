import os
from dotenv import load_dotenv
from questions_routes import questions_bp


from flask import Flask, render_template, request, redirect, session, jsonify,url_for
from werkzeug.security import (
    generate_password_hash,
    check_password_hash
)

from authlib.integrations.flask_client import OAuth

import db
from db import conn, cursor

load_dotenv()

app = Flask(__name__)

secret_key = os.getenv("SECRET_KEY")
if not secret_key:
    raise RuntimeError(
        "Configuration error: The SECRET_KEY environment variable is not set. "
        "Please set SECRET_KEY in your environment variables (e.g. in the Render dashboard under Environment Variables) "
        "or in your local .env file."
    )
app.secret_key = secret_key

@app.before_request
def ensure_secret_key_configured():
    if not app.secret_key:
        raise RuntimeError(
            "Configuration error: Flask secret_key is not configured on the application. "
            "Please configure the SECRET_KEY environment variable."
        )

def is_json_request():
    return (
        request.is_json
        or request.headers.get("Accept") == "application/json"
        or request.headers.get("X-Requested-With") == "XMLHttpRequest"
    )

oauth = OAuth(app)

google = oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={
        "scope": "openid email profile"
    }
)
app.register_blueprint(questions_bp)
@app.route('/')
def index():
    return render_template('index.html')


@app.route('/signup')
def signup():
    return render_template('signup.html')


@app.route('/register', methods=['POST'])
def register():
    if request.is_json:
        data = request.get_json() or {}
        raw_username = data.get('username') or ''
        raw_email = data.get('email') or ''
        password = data.get('password') or ''
    else:
        raw_username = request.form.get('username') or ''
        raw_email = request.form.get('email') or ''
        password = request.form.get('password') or ''

    username = raw_username.strip()
    email = raw_email.strip().lower()

    if not username or not email or not password:
        msg = "Please fill in all required fields."
        if is_json_request():
            return jsonify({"status": "error", "message": msg}), 400
        return render_template('signup.html', error=msg, username=username, email=email), 400

    if len(username) < 2:
        msg = "Username must be at least 2 characters long."
        if is_json_request():
            return jsonify({"status": "error", "message": msg, "field": "username"}), 400
        return render_template('signup.html', error=msg, username=username, email=email), 400

    if '@' not in email or '.' not in email.split('@')[-1]:
        msg = "Please enter a valid email address."
        if is_json_request():
            return jsonify({"status": "error", "message": msg, "field": "email"}), 400
        return render_template('signup.html', error=msg, username=username, email=email), 400

    if len(password) < 8:
        msg = "Password must be at least 8 characters long."
        if is_json_request():
            return jsonify({"status": "error", "message": msg, "field": "password"}), 400
        return render_template('signup.html', error=msg, username=username, email=email), 400

    # Check whether the email already exists
    cursor.execute(
        """
        SELECT id FROM users
        WHERE LOWER(email) = %s
        """,
        (email,)
    )
    if cursor.fetchone():
        msg = "An account with this email address already exists. Please log in instead."
        if is_json_request():
            return jsonify({"status": "error", "message": msg, "field": "email"}), 409
        return render_template('signup.html', error=msg, username=username, email=email), 409

    # Check whether the username already exists
    cursor.execute(
        """
        SELECT id FROM users
        WHERE LOWER(username) = LOWER(%s)
        """,
        (username,)
    )
    if cursor.fetchone():
        msg = "This username is already taken. Please choose another username."
        if is_json_request():
            return jsonify({"status": "error", "message": msg, "field": "username"}), 409
        return render_template('signup.html', error=msg, username=username, email=email), 409

    hashed_password = generate_password_hash(password)

    try:
        cursor.execute(
            """
            INSERT INTO users
            (username,email,password_hash)
            VALUES (%s,%s,%s)
            """,
            (username,email,hashed_password)
        )
        conn.commit()
    except Exception as e:
        try:
            conn.rollback()
        except Exception:
            pass

        err_str = str(e).lower()
        if "email" in err_str and ("unique" in err_str or "duplicate" in err_str):
            msg = "An account with this email address already exists. Please log in instead."
            field = "email"
        elif "username" in err_str and ("unique" in err_str or "duplicate" in err_str):
            msg = "This username is already taken. Please choose another username."
            field = "username"
        else:
            msg = "Registration failed due to a database error. Please try again."
            field = None

        if is_json_request():
            return jsonify({"status": "error", "message": msg, "field": field}), 409
        return render_template('signup.html', error=msg, username=username, email=email), 409

    if is_json_request():
        return jsonify({
            "status": "success",
            "message": "Account created successfully! Redirecting to login...",
            "redirect": url_for('login_user', registered=1)
        }), 201

    return redirect(url_for('login_user', registered=1))

@app.route('/login', methods=['GET', 'POST'])
def login_user():
    if request.method == 'GET':
        return render_template('login.html')

    if request.is_json:
        data = request.get_json() or {}
        raw_email = data.get('email') or ''
        password = data.get('password') or ''
    else:
        raw_email = request.form.get('email') or ''
        password = request.form.get('password') or ''

    email = raw_email.strip().lower()

    if not email or not password:
        msg = "Please enter both email and password."
        if is_json_request():
            return jsonify({"status": "error", "message": msg}), 400
        return render_template('login.html', error=msg, email=email), 400

    cursor.execute(
        """
        SELECT id, username, password_hash
        FROM users
        WHERE LOWER(email) = %s
        """,
        (email,)
    )

    user = cursor.fetchone()

    if user:
        user_id = user[0]
        username = user[1]
        password_hash = user[2]

        if password_hash and check_password_hash(password_hash, password):
            session['user_id'] = user_id
            session['username'] = username

            if is_json_request():
                return jsonify({
                    "status": "success",
                    "message": "Logged in successfully!",
                    "redirect": url_for('dashboard')
                }), 200

            return redirect(url_for('dashboard'))

    msg = "Invalid email or password."
    if is_json_request():
        return jsonify({"status": "error", "message": msg}), 401
    return render_template('login.html', error=msg, email=email), 401

@app.route("/login/google")
def google_login():
    redirect_uri = url_for("google_authorized", _external=True)
    return google.authorize_redirect(redirect_uri)

@app.route("/login/google/authorized")
def google_authorized():
    try:
        conn.rollback()   # Reset any aborted transaction
    except Exception:
        pass

    token = google.authorize_access_token()
    user_info = token.get("userinfo") or {}

    raw_email = user_info.get("email") or ""
    email = raw_email.strip().lower()
    username = (user_info.get("name") or email.split("@")[0] or "Adventurer").strip()
    google_id = user_info.get("sub")
    picture = user_info.get("picture")

    if not email:
        return "Failed to retrieve email from Google.", 400

    # Check whether the user already exists (case-insensitive email matching)
    cursor.execute(
        """
        SELECT id, username
        FROM users
        WHERE LOWER(email)=%s
        """,
        (email,)
    )

    user = cursor.fetchone()

    if user:
        session["user_id"] = user[0]
        session["username"] = user[1]
    else:
        # Check whether username exists to avoid collision
        cursor.execute("SELECT id FROM users WHERE LOWER(username)=LOWER(%s)", (username,))
        if cursor.fetchone():
            import random
            username = f"{username}_{random.randint(100, 999)}"

        try:
            cursor.execute(
                """
                INSERT INTO users
                (
                    username,
                    email,
                    password_hash,
                    google_id,
                    provider,
                    profile_picture
                )
                VALUES
                (
                    %s,
                    %s,
                    %s,
                    %s,
                    'google',
                    %s
                )
                RETURNING id
                """,
                (
                    username,
                    email,
                    "",
                    google_id,
                    picture
                )
            )

            new_user = cursor.fetchone()
            user_id = None
            if new_user:
                user_id = new_user[0]
            elif hasattr(cursor, 'lastrowid') and cursor.lastrowid:
                user_id = cursor.lastrowid

            if not user_id:
                conn.rollback()
                return "Failed to create Google user.", 500

            conn.commit()

            session["user_id"] = user_id
            session["username"] = username
        except Exception as e:
            try:
                conn.rollback()
            except Exception:
                pass
            print("Error creating Google user:", e)
            return "Failed to create Google user.", 500

    return redirect("/dashboard")


@app.route('/dashboard')
def dashboard():

    if 'user_id' not in session:
        return redirect('/login')

    return render_template(
        'dashboard.html',
        username=session['username']
    )
@app.route('/logout')
def logout():
    session.clear()
    return redirect('/')

@app.route('/api/state', methods=['GET', 'POST'])
def api_state():
    if 'user_id' not in session:
        return jsonify({"error": "Unauthorized"}), 401
    
    user_id = session['user_id']
    
    if request.method == 'GET':
        try:
            cursor.execute(
                """
                SELECT level, xp, gold, hp, completed_questions 
                FROM users 
                WHERE id = %s
                """,
                (user_id,)
            )
            row = cursor.fetchone()
            if row and row[0] is not None:
                state = {
                    "level": row[0],
                    "xp": row[1],
                    "gold": row[2],
                    "hp": row[3],
                    "completed_questions": row[4] or ""
                }
                # Sync into session
                for k, v in state.items():
                    session[k] = v
                return jsonify(state)
        except Exception as e:
            print("DB error on state get:", e)
            
        # Fallback to session or default
        state = {
            "level": session.get('level', 1),
            "xp": session.get('xp', 0),
            "gold": session.get('gold', 1250),
            "hp": session.get('hp', 100),
            "completed_questions": session.get('completed_questions', "")
        }
        return jsonify(state)
        
    elif request.method == 'POST':
        data = request.get_json() or {}
        level = data.get('level', 1)
        xp = data.get('xp', 0)
        gold = data.get('gold', 1250)
        hp = data.get('hp', 100)
        completed_questions = data.get('completed_questions', "")
        
        # Save in session
        session['level'] = level
        session['xp'] = xp
        session['gold'] = gold
        session['hp'] = hp
        session['completed_questions'] = completed_questions
        
        # Save in DB
        try:
            cursor.execute(
                """
                UPDATE users 
                SET level = %s, xp = %s, gold = %s, hp = %s, completed_questions = %s 
                WHERE id = %s
                """,
                (level, xp, gold, hp, completed_questions, user_id)
            )
            conn.commit()
            return jsonify({"status": "success", "source": "db"})
        except Exception as e:
            print("DB error on state save:", e)
            try:
                conn.rollback()
            except:
                pass
            return jsonify({"status": "success", "source": "session"})

if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)