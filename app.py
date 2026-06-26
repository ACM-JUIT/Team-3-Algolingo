from flask import Flask, render_template, request, redirect, session
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

if __name__ == '__main__':
    app.run(debug=True)