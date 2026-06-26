import psycopg2

conn = psycopg2.connect(
    host="localhost",
    database="ALGOLINGO",
    user="postgres",
    password="Ketan@257",
    port="5432"
)

cursor = conn.cursor()