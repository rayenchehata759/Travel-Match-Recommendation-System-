import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__),"..","database","destinations.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def get_all_destinations():

    #retourne les destination sous forme de liste de dictionnaires
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM Destinations;")

    rows = cur.fetchall()
    conn.close()
    return [dict(row) for row in rows]




