import os
import pandas as pd
import sqlite3

# Chemins
DB_PATH = os.path.join(os.path.dirname(__file__), "destinations.db")
DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
INIT_PATH = os.path.join(os.path.dirname(__file__), "init_db.sql")


#conn = sqlite3.connect(DB_PATH)
#cursor = conn.cursor()

#with open(INIT_PATH, 'r') as f:
#   cursor.executescript(f.read())

def load_destination(conn):
    df=pd.read_csv(os.path.join(DATA_DIR, "destination_clean.csv"))
    cur=conn.cursor()

    for index, row in df.iterrows():
        cur.execute(
            """
            INSERT INTO Destinations (id, city, country, region,short_description,culture,adventure,nature,beaches,nightlife,cuisine,wellness,urban,seclusion)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

            ON CONFLICT(id) DO UPDATE SET
                city=excluded.city,
                country=excluded.country,
                region=excluded.region,
                short_description=excluded.short_description,
                culture=excluded.culture,
                adventure=excluded.adventure,
                nature=excluded.nature,
                beaches=excluded.beaches,
                nightlife=excluded.nightlife,
                cuisine=excluded.cuisine,
                wellness=excluded.wellness,
                urban=excluded.urban,
                seclusion=excluded.seclusion
            """,
            (
                row['id'], row['city'], row['country'], row['region'], row['short_description'], 
                int(row['culture']), int(row['adventure']), int(row['nature']), int(row['beaches']), int(row['nightlife']), int(row['cuisine']), int(row['wellness']), int(row['urban']), int(row['seclusion'])
                )
        )
        conn.commit() 




if __name__ == "__main__":
    conn=sqlite3.connect(DB_PATH)
    load_destination(conn)
    
    conn.close()
    print("Chargement terminé:")

    conn = sqlite3.connect(DB_PATH)  # ou le chemin direct vers destinations.db
    cursor = conn.cursor()
    df_check = pd.read_sql("SELECT * FROM Destinations LIMIT 5", conn)
    print(df_check)
    conn.close()