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
embed = hub.load("https://tfhub.dev/google/universal-sentence-encoder")


#db connection
def connect_to_db():
    conn = sqlite3.connect("database.db")
    return conn


####################   user table  ############################
def create_user_table():
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

create_user_table()

def insert_user(user):
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


#################### Goals Table ###########################
def create_goals_table():
    try:
        conn = connect_to_db()
        conn.execute('''CREATE TABLE IF NOT EXISTS goals(
            goal_id INTEGER PRIMARY KEY NOT NULL,
            goal TEXT NOT NULL,
            user_id INTEGER NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(user_id)
        );''')

        conn.commit()

        print("goal table created successfully")

    except:
        print("ERROR")
    finally:
        conn.close()
create_goals_table()

def get_goals_by_id(user_id):
    goals = {}
    try:
        conn = connect_to_db()
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        cur.execute("SELECT * FROM goals WHERE user_id = ?",
                    (user_id,))
        allGoals = cur.fetchall()
        for idx, g in enumerate(allGoals):
            goals[str(idx)] = g["goal"]
        conn.commit()

    except:
        print("Failed to retrieve goals")

    finally:
        conn.close()

    return goals

def insert_goal(goal_data):
    inserted_goal = {}
    try:
        conn = connect_to_db()
        cur = conn.cursor()

        cur.execute('''
            INSERT INTO goals (goal, user_id)
            VALUES (?, ?)
        ''',
        (goal_data["goal"], goal_data["user_id"]))

        conn.commit()
        inserted_goal["goal"] = goal_data["goal"]
        inserted_goal["user_id"] = goal_data["user_id"]

    except:
        conn.rollback()
        print("Cannot Insert Goal")
    finally:
        conn.close()

    return inserted_goal

def delete_goal(goal_data):
    deleted = {}
    try:
        conn = connect_to_db()
        cur = conn.cursor()
        cur.execute('''
            DELETE from goals WHERE goal = ? and user_id = ?
        ''',
        (goal_data["goal"], goal_data["user_id"]))
        conn.commit()

        deleted["message"] = "Goal deleted"
    except:
        print("Deletion failed")
        deleted["message"] = "Goal failed to delete"
    finally:    
        conn.close()

    return deleted

@app.route("/api/goals/<user_id>", methods = ["GET"])
def api_gets_goal(user_id):
    return jsonify(get_goals_by_id(user_id))

@app.route("/api/goals/add", methods = ["POST"])
def api_add_goal():
    goal_data = request.get_json()
    return jsonify(insert_goal(goal_data))

@app.route("/api/goals/delete", methods = ["DELETE"])
def api_delete_goal():
    goal_data = request.get_json()
    return jsonify(delete_goal(goal_data))

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

@app.route("/suggestedGoals", methods = ["GET"])
def goalMatch():

    goals = [
    "Read a book each month.",
    "Learn a new language.",
    "Take up a musical instrument.",
    "Develop a daily meditation habit.",
    "Practice mindfulness.",
    "Improve time management skills.",
    "Start a gratitude journal.",
    "Learn a new skill on YouTube.",
    "Take a public speaking course.",
    "Set aside time for self-reflection weekly.",
    "Exercise for at least 30 minutes daily.",
    "Try a new type of workout (yoga, HIIT, etc.).",
    "Drink more water daily.",
    "Improve your sleep routine.",
    "Cook a healthy meal from scratch weekly.",
    "Achieve a fitness milestone (run a 5k, lift a certain weight).",
    "Take regular breaks to stretch at work.",
    "Cut down on processed foods.",
    "Practice portion control.",
    "Explore a new outdoor activity (hiking, kayaking, etc.).",
    "Strengthen existing friendships.",
    "Make an effort to meet new people.",
    "Host a gathering with friends.",
    "Reconnect with old friends.",
    "Attend a social event or meetup.",
    "Improve communication skills.",
    "Join a club or group with shared interests.",
    "Plan a family reunion.",
    "Volunteer for a community organization.",
    "Mend a broken relationship.",
    "Take a professional development course.",
    "Attend a networking event.",
    "Set career-related milestones.",
    "Update your resume.",
    "Learn a new software or tool.",
    "Start a side hustle.",
    "Improve time management at work.",
    "Set career goals for the next 5 years.",
    "Explore a new career path.",
    "Obtain a new certification or qualification.",
    "Create a monthly budget.",
    "Save a percentage of your income.",
    "Pay off a credit card or loan.",
    "Start an emergency fund.",
    "Invest in a retirement account.",
    "Cut unnecessary expenses.",
    "Set a specific savings goal.",
    "Track daily expenses for a month.",
    "Create a passive income stream.",
    "Consult a financial advisor.",
    "Start a blog or vlog.",
    "Learn photography.",
    "Write a short story or poem.",
    "Take up painting or drawing.",
    "Start a DIY project.",
    "Learn a new craft (knitting, woodworking, etc.).",
    "Explore a new genre of music.",
    "Create a personal website/portfolio.",
    "Experiment with cooking new recipes.",
    "Try your hand at gardening.",
    "Plan a trip."
]
    
    ##users' input feeling
    feeling = request.args.get("data")

    print(feeling)

    suggested_goals = {}

    ## if feeling is not inputed
    if feeling == "":
        for i in range(3):
            goal  = random.choice(goals)
            suggested_goals[i] = goal
    else:
        feeling_embedding =  embed([feeling])

        goal_embeddings = embed(goals)
        
        pq = []

        for idx, goal_embed in  enumerate(goal_embeddings): 
            if len(pq) < 3:
                heapq.heappush(pq, [-np.linalg.norm(goal_embed - feeling_embedding), goals[idx]])
            else:
                heapq.heappushpop(pq, [-np.linalg.norm(goal_embed - feeling_embedding), goals[idx]])

        for i in range(len(pq)):
            suggested_goals[i] = pq[i][1]

    print(suggested_goals)
    return jsonify(suggested_goals)

if __name__ == "__main__":
    app.run(debug = True, host =  "10.0.0.248")