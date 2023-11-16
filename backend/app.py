from flask import Flask, jsonify, request
from flask_cors import CORS
import tensorflow as tf
import tensorflow_hub as hub
import heapq
import numpy as np
import random
import sqlite3

app = Flask(__name__)
CORS(app)

# # Load the Universal Sentence Encoder model
# embed = hub.load("https://tfhub.dev/google/universal-sentence-encoder/4")


#db connection
def connect_to_db():
    conn = sqlite3.connect("database.db")
    return conn

def create_db_table():
    try:
        conn = connect_to_db()
        conn.execute(''' 
            CREATE TABLE IF NOT EXISTS users(user_id INTEGER PRIMARY KEY NOT NULL,
                     name TEXT NOT NULL,
                     email TEXT NOT NULL,
                     phone TEXT NOT NULL,
                    address TEXT NOT NULL,
                    country TEXT NOT NULL
            );
        ''')

        conn.commit()
        print("user table created successfully")
    except:
        print("user table creation failed")
    finally:
        conn.close()

def insert_user(user):
    print(user)
    inserted_user = {}
    try:
        conn = connect_to_db()
        cur = conn.cursor()
        cur.execute('''
            INSERT INTO users (name, email, phone, address, country)
            VALUES (?, ?, ?, ?, ?)
        ''', (user['name'], user['email'], user['phone'], user['address'], user['country']))
    

        conn.commit()
        inserted_user = get_user_by_id(cur.lastrowid)

    except:
        conn.rollback()
    
    finally:
        conn.close()
    
    return inserted_user

def get_user_by_id(user_id):
    user = {}
    try:
        conn = connect_to_db()
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        cur.execute("SELECT * FROM users WHERE user_id = ?", 
                       (user_id,))
        row = cur.fetchone()

        # convert row object to dictionary
        user["user_id"] = row["user_id"]
        user["name"] = row["name"]
        user["email"] = row["email"]
        user["phone"] = row["phone"]
        user["address"] = row["address"]
        user["country"] = row["country"]
    except:
        user = {}

    return user

@app.route("/api/users/add", methods = ["POST"])
def api_add_user():
    user = request.get_json()
    return jsonify(insert_user(user))

@app.route("/api/users/<user_id>", methods = ["GET"])
def api_get_user(user_id):
    return jsonify(get_user_by_id(user_id))

@app.route('/motivationalQuote', methods = ["GET"])
def embeddingMatch():
    # get user input

    data = request.args.get('data')

    motivational_quotes = [
    "Success is not the key to happiness. Happiness is the key to success.",
    "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle.",
    "The only way to do great work is to love what you do.",
    "Don't watch the clock; do what it does. Keep going.",
    "The harder you work for something, the greater you'll feel when you achieve it.",
    "The only limit to our realization of tomorrow will be our doubts of today.",
    "Your time is limited, so don't waste it living someone else's life.",
    "Dream big and dare to fail.",
    "Success is walking from failure to failure with no loss of enthusiasm.",
    "The future depends on what you do today.",
    "The best way to predict the future is to create it.",
    "The only person you are destined to become is the person you decide to be.",
    "Change your thoughts, and you change your world.",
    "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    "Hardships often prepare ordinary people for an extraordinary destiny.",
    "Believe you can and you're halfway there.",
    "You are never too old to set another goal or to dream a new dream.",
    "The road to success and the road to failure are almost exactly the same.",
    "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
    "The only way to achieve the impossible is to believe it is possible.",
    "You miss 100% of the shots you don't take.",
    "Don't wait for opportunity. Create it.",
    "The biggest risk is not taking any risk. In a world that's changing quickly, the only strategy that is guaranteed to fail is not taking risks.",
    "It always seems impossible until it's done.",
    "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.",
    "Success is not the result of spontaneous combustion. You must set yourself on fire.",
    "Believe in the magic within yourself.",
    "If you are working on something exciting that you really care about, you don't have to be pushed. The vision pulls you.",
    "Don't count the days, make the days count.",
    "In the middle of every difficulty lies opportunity.",
    "I can't change the direction of the wind, but I can adjust my sails to always reach my destination.",
    "Life is either a daring adventure or nothing at all.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful.",
    "The only thing standing between you and your goal is the story you keep telling yourself as to why you can't achieve it.",
    "What you get by achieving your goals is not as important as what you become by achieving your goals.",
    "The only thing that stands between you and your dream is the will to try and the belief that it is actually possible.",
    "The best revenge is massive success.",
    "Don't be pushed around by the fears in your mind. Be led by the dreams in your heart.",
    "You are never too old to set another goal or to dream a new dream.",
    "The only place where success comes before work is in the dictionary.",
    "Opportunities don't happen. You create them.",
    "Success is not in what you have, but who you have become.",
    "The only time you fail is when you fall down and stay down.",
    "If you are not willing to risk the usual, you will have to settle for the ordinary.",
    "The way to get started is to quit talking and begin doing.",
    "Your time is limited, don't waste it living someone else's life.",
    "It does not matter how slowly you go as long as you do not stop.",
    "Believe in yourself! Have faith in your abilities! Without a humble but reasonable confidence in your own powers you cannot be successful or happy.",
    "Ever tried. Ever failed. No matter. Try Again. Fail again. Fail better.",
    "Optimism is the faith that leads to achievement. Nothing can be done without hope and confidence.",
    "When something is important enough, you do it even if the odds are not in your favor.",
    "Start where you are. Use what you have. Do what you can.",
    "What you do today can improve all your tomorrows.",
    "Knowing is not enough; we must apply. Willing is not enough; we must do.",
    "If you fell down yesterday, stand up today.",
    "The key is to keep company only with people who uplift you, whose presence calls forth your best.",
    "We may encounter many defeats but we must not be defeated.",
    "Don't watch the clock; do what it does. Keep going.",
    "Setting goals is the first step in turning the invisible into the visible.", 
    "Your talent is God's gift to you. What you do with it is your gift back to God.",
    "When you reach the end of your rope, tie a knot in it and hang on.",
    "I am not afraid... I was born to do this.",
    "Either you run the day or the day runs you.",
    "The most effective way to do it, is to do it.",
    "The past cannot be changed. The future is yet in your power."
    ]

    message_embeddings_ = embed(motivational_quotes)

    data_embedding = embed([data])

    pq = []

    
    # Top 10 quotes with the most similar semantic meaning as the users' feeling
    for idx, embedding in enumerate(message_embeddings_):
        if len(pq) < 10:
            heapq.heappush(pq, [-np.linalg.norm(embedding - data_embedding), motivational_quotes[idx]])
        else:
            heapq.heappushpop(pq, [-np.linalg.norm(embedding - data_embedding), motivational_quotes[idx]])

    #randomly pick one
    choice_quote = random.choice(pq)[1]
        

    return jsonify({"Quote": choice_quote})


if __name__ == "__main__":
    app.run(debug = True, host =  "10.0.0.248")