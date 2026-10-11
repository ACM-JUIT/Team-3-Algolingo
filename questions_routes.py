import re
from flask import Blueprint, jsonify, request
from db import cursor

questions_bp = Blueprint('questions', __name__)

def normalize_topic(t):
    if not t:
        return 'variables'
    # Strip chapter numbering e.g. "1. ", "14. "
    clean = re.sub(r'^\d+[\.\)]\s*', '', t).strip()
    # Strip language suffix e.g. " in Python", " in Java", " in C++"
    clean = re.sub(r'\s+in\s+(?:Python|Java|C\+\+|CPP).*$', '', clean, flags=re.IGNORECASE).strip()
    lower = clean.lower()

    mapping = {
        'conditionals': ['conditional statements', 'conditionals', 'control statements', 'control structures', 'condition'],
        'loops': ['loops', 'while', 'for loop'],
        'lists': ['lists', 'arrays & strings', 'arrays, strings & pointers', 'arrays', 'collections', 'stl'],
        'tuples': ['tuples'],
        'dicts': ['dictionaries', 'dicts', 'dictionary', 'map'],
        'sets': ['sets', 'set'],
        'strings': ['strings', 'string'],
        'operators': ['operators', 'operator'],
        'variables': ['variables & data types', 'variables and data types', 'data types & variables', 'data types & operators', 'variables', 'variable', 'data types', 'data type'],
        'io': ['input and output', 'input & output', 'file i/o', 'file handling', 'introduction', 'io']
    }
    for standard_topic, syns in mapping.items():
        for s in syns:
            if re.search(r'\b' + re.escape(s) + r'\b', lower):
                return standard_topic
    return 'variables'

@questions_bp.route('/api/questions', methods=['GET'])
def get_questions():
    language = request.args.get('language')
    difficulty = request.args.get('difficulty')
    raw_topic = request.args.get('topic')
    limit = request.args.get('limit', default=10, type=int)

    standard_topic = normalize_topic(raw_topic)

    query = """
        SELECT 
            id, topic, difficulty, question_type, question, 
            option_a, option_b, option_c, option_d, 
            correct_answer, explanation, xp_reward, 
            languages, code_snippet, correct_option
        FROM questions
        WHERE LOWER(topic) = LOWER(%s)
    """
    params = [standard_topic]

    if difficulty and difficulty.strip():
        query += " AND LOWER(difficulty) = LOWER(%s)"
        params.append(difficulty.strip())

    if language and language.strip():
        lang_str = language.strip()
        if lang_str.upper() in ['C++', 'CPP']:
            query += " AND (languages ILIKE '%%C++%%' OR languages ILIKE '%%cpp%%' OR languages ILIKE '%%cplusplus%%' OR languages IS NULL OR languages = '')"
        else:
            query += " AND (languages ILIKE %s OR languages IS NULL OR languages = '')"
            params.append(f"%{lang_str}%")

    query += " ORDER BY id ASC LIMIT %s;"
    params.append(limit)

    try:
        cursor.execute(query, tuple(params))
        rows = cursor.fetchall()

        # Fallback if language filter yielded 0 results: try without language filter
        if not rows and language:
            fallback_query = """
                SELECT 
                    id, topic, difficulty, question_type, question, 
                    option_a, option_b, option_c, option_d, 
                    correct_answer, explanation, xp_reward, 
                    languages, code_snippet, correct_option
                FROM questions
                WHERE LOWER(topic) = LOWER(%s)
            """
            fallback_params = [standard_topic]
            if difficulty and difficulty.strip():
                fallback_query += " AND LOWER(difficulty) = LOWER(%s)"
                fallback_params.append(difficulty.strip())
            fallback_query += " ORDER BY id ASC LIMIT %s;"
            fallback_params.append(limit)
            cursor.execute(fallback_query, tuple(fallback_params))
            rows = cursor.fetchall()
        
        # Second fallback: if still 0 rows, fallback to variables topic
        if not rows:
            cursor.execute("""
                SELECT 
                    id, topic, difficulty, question_type, question, 
                    option_a, option_b, option_c, option_d, 
                    correct_answer, explanation, xp_reward, 
                    languages, code_snippet, correct_option
                FROM questions
                WHERE LOWER(difficulty) = LOWER(%s)
                ORDER BY id ASC LIMIT %s;
            """, (difficulty.strip() if difficulty else 'easy', limit))
            rows = cursor.fetchall()

        questions = []
        for row in rows:
            questions.append({
                "id": row[0],
                "topic": row[1],
                "difficulty": row[2],
                "question_type": row[3],
                "question": row[4],
                "options": {
                    "A": row[5],
                    "B": row[6],
                    "C": row[7],
                    "D": row[8]
                },
                "correct_answer": row[9],
                "explanation": row[10],
                "xp_reward": row[11],
                "languages": row[12],
                "code_snippet": row[13],
                "correct_option": row[14]
            })

        return jsonify({"status": "success", "count": len(questions), "data": questions}), 200

    except Exception as e:
        print("Database query error:", e)
        return jsonify({"status": "error", "message": "Failed to fetch questions."}), 500