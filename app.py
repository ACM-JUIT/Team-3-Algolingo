from flask import Flask, render_template, request, redirect, session, jsonify
from werkzeug.security import (
    generate_password_hash,
    check_password_hash
)
from db import conn, cursor

app = Flask(__name__)
app.secret_key = "algolingo_secret_key"


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/signup')
def signup():
    return render_template('signup.html')


@app.route('/register', methods=['POST'])
def register():

    username = request.form['username']
    email = request.form['email']
    password = request.form['password']

    hashed_password = generate_password_hash(password)

    cursor.execute(
        """
        INSERT INTO users
        (username,email,password_hash)
        VALUES (%s,%s,%s)
        """,
        (username,email,hashed_password)
    )

    conn.commit()

    return redirect('/login')

@app.route('/login', methods=['GET', 'POST'])
def login_user():
    if request.method == 'GET':
        return render_template('login.html')

    email = request.form['email']
    password = request.form['password']

    cursor.execute(
        """
        SELECT id, username, password_hash
        FROM users
        WHERE email = %s
        """,
        (email,)
    )

    user = cursor.fetchone()

    if user:

        user_id = user[0]
        username = user[1]
        password_hash = user[2]

        if check_password_hash(password_hash, password):

            session['user_id'] = user_id
            session['username'] = username

            return redirect('/dashboard')

    return "Invalid Email or Password"


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
    app.run(debug=True)