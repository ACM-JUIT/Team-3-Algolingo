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
        sqlite_cur.execute("""
            CREATE TABLE IF NOT EXISTS questions (
                id TEXT PRIMARY KEY,
                topic TEXT,
                difficulty TEXT,
                question_type TEXT,
                question TEXT,
                option_a TEXT,
                option_b TEXT,
                option_c TEXT,
                option_d TEXT,
                correct_answer TEXT,
                explanation TEXT,
                xp_reward INTEGER DEFAULT 100,
                languages TEXT,
                code_snippet TEXT,
                correct_option TEXT
            );
        """)
        sqlite_conn.commit()
        
        sqlite_cur.execute("SELECT count(*) FROM questions;")
        if sqlite_cur.fetchone()[0] == 0:
            try:
                import os, re
                js_path = os.path.join(os.path.dirname(__file__), "static", "js", "questions.js")
                if os.path.exists(js_path):
                    with open(js_path, "r", encoding="utf-8") as f:
                        text = f.read()
                    raw_blocks = re.split(r'\n\s*\{\s*\n\s*id:', text)
                    seed_data = []
                    for b in raw_blocks[1:]:
                        block = "id:" + b.split('\n  },')[0].split('\n  }')[0]
                        def ext_line(field):
                            m = re.search(r'(?:^|\n)\s*' + field + r':\s*(.*?)(?:,\s*(?:\n|//)|$)', block)
                            if m:
                                val = m.group(1).strip()
                                val = re.sub(r'//.*$', '', val).strip()
                                if (val.startswith('"') and val.endswith('"')) or (val.startswith("'") and val.endswith("'")) or (val.startswith('`') and val.endswith('`')):
                                    val = val[1:-1]
                                return val
                            return ""

                        qid = ext_line("id")
                        topic = ext_line("topic")
                        diff = ext_line("difficulty")
                        qtype = ext_line("type")

                        m_q = re.search(r'(?:^|\n)\s*question:\s*["\'`]([\s\S]*?)["\'`]\s*(?:,|$)', block)
                        qtext = m_q.group(1).strip() if m_q else ext_line("question")

                        m_code = re.search(r'(?:^|\n)\s*code:\s*["\'`]([\s\S]*?)["\'`]\s*(?:,|$)', block)
                        code = m_code.group(1).strip() if m_code else ""

                        m_exp = re.search(r'(?:^|\n)\s*explanation:\s*["\'`]([\s\S]*?)["\'`]\s*(?:,|$)', block)
                        explanation = m_exp.group(1).strip() if m_exp else ext_line("explanation")

                        m_ans = re.search(r'(?:^|\n)\s*answer:\s*(?:["\'`]?)(.*?)(?:["\'`]?)\s*(?:,|\s*//|\s*\n|$)', block)
                        ans = m_ans.group(1).strip() if m_ans else ""
                        ans = re.sub(r'//.*$', '', ans).strip().strip('"\'`')

                        m_opts = re.search(r'options:\s*\[([\s\S]*?)\]', block)
                        opts = []
                        if m_opts:
                            opts = [m[1] for m in re.findall(r'(["\'`])((?:(?!\1)[\s\S])*?)\1', m_opts.group(1))]

                        opt_a = opts[0] if len(opts) > 0 else ""
                        opt_b = opts[1] if len(opts) > 1 else ""
                        opt_c = opts[2] if len(opts) > 2 else ""
                        opt_d = opts[3] if len(opts) > 3 else ""

                        correct_option = ""
                        if qtype == "mcq":
                            if ans.upper() in ["A", "B", "C", "D"]:
                                correct_option = ans.upper()
                            else:
                                for idx, opt_text in enumerate([opt_a, opt_b, opt_c, opt_d]):
                                    if opt_text.strip().lower() == ans.strip().lower():
                                        correct_option = chr(65 + idx)
                                        break

                        if qtype == "mcq" and correct_option in ["A", "B", "C", "D"]:
                            correct_answer = {"A": opt_a, "B": opt_b, "C": opt_c, "D": opt_d}[correct_option]
                        else:
                            correct_answer = ans

                        seed_data.append((
                            qid, topic, diff, qtype, qtext,
                            opt_a, opt_b, opt_c, opt_d,
                            correct_answer, explanation, 100,
                            "Python, C++, Java", code, correct_option
                        ))
                    sqlite_cur.executemany("""
                        INSERT OR REPLACE INTO questions (
                            id, topic, difficulty, question_type, question,
                            option_a, option_b, option_c, option_d,
                            correct_answer, explanation, xp_reward,
                            languages, code_snippet, correct_option
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """, seed_data)
                    sqlite_conn.commit()
                    print(f"Auto-seeded {len(seed_data)} questions into SQLite database.")
            except Exception as seed_err:
                print("Failed to auto-seed questions:", seed_err)

        import threading
        _thread_local = threading.local()
        _db_lock = threading.Lock()

        class SqliteCursorWrapper:
            def __init__(self, conn):
                self.conn = conn
            def _get_cur(self):
                if not hasattr(_thread_local, "cur") or _thread_local.cur is None:
                    _thread_local.cur = self.conn.cursor()
                return _thread_local.cur
            def execute(self, query, params=None):
                translated_query = query.replace('%s', '?').replace('ILIKE', 'LIKE').replace('ilike', 'like')
                cur = self._get_cur()
                with _db_lock:
                    if params:
                        cur.execute(translated_query, params)
                    else:
                        cur.execute(translated_query)
            def fetchone(self):
                with _db_lock:
                    return self._get_cur().fetchone()
            def fetchall(self):
                with _db_lock:
                    return self._get_cur().fetchall()
                
        class SqliteConnWrapper:
            def __init__(self, conn):
                self.conn = conn
            def commit(self):
                with _db_lock:
                    self.conn.commit()
            def rollback(self):
                with _db_lock:
                    self.conn.rollback()
            def cursor(self):
                return SqliteCursorWrapper(self.conn)
                
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
