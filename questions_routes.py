from flask import Blueprint, jsonify, request
from db import cursor
from ollama_service import ollama_service

questions_bp = Blueprint('questions', __name__)

@questions_bp.route('/api/questions', methods=['GET'])
def get_questions():
    language = request.args.get('language')
    difficulty = request.args.get('difficulty')
    topic = request.args.get('topic')
    limit = request.args.get('limit', default=10, type=int)

    query = """
        SELECT 
            id, topic, difficulty, question_type, question, 
            option_a, option_b, option_c, option_d, 
            correct_answer, explanation, xp_reward, 
            languages, code_snippet, correct_option
        FROM questions
        WHERE 1=1
    """
    params = []

    # Clean topic string (e.g., stripping "in C++", "in Python")
    if topic and topic.strip():
        clean_topic = topic.replace(" in Python", "").replace(" in C++", "").replace(" in Java", "").replace("in C++", "").strip()
        query += " AND (LOWER(topic) = LOWER(%s) OR LOWER(topic) = LOWER(%s))"
        params.extend([topic.strip(), clean_topic])

    if difficulty and difficulty.strip():
        query += " AND LOWER(difficulty) = LOWER(%s)"
        params.append(difficulty.strip())

    if language and language.strip():
        lang_str = language.strip()
        if lang_str.upper() in ['C++', 'CPP']:
            query += " AND (languages ILIKE '%%C++%%' OR languages ILIKE '%%cpp%%' OR languages ILIKE '%%cplusplus%%')"
        else:
            query += " AND (languages ILIKE %s OR languages IS NULL OR languages = '')"
            params.append(f"%{lang_str}%")

    query += " ORDER BY id ASC LIMIT %s;"
    params.append(limit)

    try:
        cursor.execute(query, tuple(params))
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

@questions_bp.route('/api/questions/<int:question_id>/ai-explanation', methods=['GET'])
def get_ai_explanation(question_id):
    """Get AI-generated explanation for a question"""
    try:
        cursor.execute("SELECT question, explanation FROM questions WHERE id = %s", (question_id,))
        row = cursor.fetchone()
        
        if not row:
            return jsonify({"error": "Question not found"}), 404
        
        question, existing_explanation = row
        # Use Ollama to enhance or generate explanation
        enhanced_explanation = ollama_service.generate_response(
            f"Provide a detailed but concise explanation for this programming question:\n\n{question}"
        )
        
        return jsonify({
            "status": "success",
            "original_explanation": existing_explanation,
            "ai_explanation": enhanced_explanation
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
