import os
from dotenv import load_dotenv

from flask import (
    Flask,
    render_template,
    request,
    redirect,
    session,
    url_for
)

from werkzeug.security import (
    generate_password_hash,
    check_password_hash
)

from authlib.integrations.flask_client import OAuth

from db import conn, cursor

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY")

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

@app.route('/')
def login():
    return render_template('login.html')


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

    return redirect('/')

@app.route('/login', methods=['POST'])
def login_user():

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

@app.route("/login/google")
def google_login():
    redirect_uri = url_for("google_authorized", _external=True)
    return google.authorize_redirect(redirect_uri)

@app.route("/login/google/authorized")
def google_authorized():

    conn.rollback()   # Reset any aborted transaction

    token = google.authorize_access_token()

    user_info = token["userinfo"]

    email = user_info["email"]

    username = user_info["name"]
    google_id = user_info["sub"]
    picture = user_info.get("picture")

    # Check whether the user already exists
    cursor.execute(
        """
        SELECT id, username
        FROM users
        WHERE email=%s
        """,
        (email,)
    )

    user = cursor.fetchone()

    if user:

        session["user_id"] = user[0]
        session["username"] = user[1]

    else:

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
                NULL,
                %s,
                'google',
                %s
            )
            RETURNING id
            """,
            (
                username,
                email,
                google_id,
                picture
            )
        )

        new_user = cursor.fetchone()

        if new_user is None:
         return "Failed to create Google user."

        user_id = new_user[0]

        conn.commit()

        session["user_id"] = user_id
        session["username"] = username

    return redirect("/dashboard")


@app.route('/dashboard')
def dashboard():

    if 'user_id' not in session:
        return redirect('/')

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