# 🏰 ALGOLINGO – Gamified Programming Learning Platform

![Python](https://img.shields.io/badge/Python-3.12-blue?logo=python)
![Flask](https://img.shields.io/badge/Flask-3.x-black?logo=flask)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-blue?logo=postgresql)
![HTML](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow?logo=javascript)
![License](https://img.shields.io/badge/License-MIT-green)

ALGOLINGO is a **Gamified Programming Learning Platform** that transforms programming education into an engaging RPG adventure. Instead of solving traditional multiple-choice questions on a plain website, learners battle monsters, earn XP, collect gold, level up, and unlock new programming concepts through interactive gameplay.

The project combines the learning experience of **Duolingo**, the interactivity of **CodeCombat**, and the progression mechanics of classic RPG games.

---

# 📖 Table of Contents

- Overview
- Features
- Tech Stack
- Project Architecture
- Folder Structure
- Database Design
- Authentication
- Game Mechanics
- Battle System
- Question System
- Installation
- Environment Variables
- Running the Project
- API Overview
- Screenshots
- Future Improvements
- Team

---

# 🎯 Overview

Programming education often becomes repetitive and discouraging for beginners.

ALGOLINGO solves this problem by integrating:

- 🎮 RPG Gameplay
- ⚔️ Monster Battles
- 📚 Programming Questions
- 🏆 XP & Level System
- 💰 Gold Rewards
- ❤️ HP System
- 🎒 Inventory
- 🛒 Shop
- 🌍 Google Authentication

The objective is to make learning programming fun while maintaining educational value.

---

# ✨ Features

## Authentication

- User Registration
- User Login
- Google OAuth Login
- Secure Password Hashing
- Flask Sessions
- Logout

---

## Dashboard

- Player Profile
- HP Bar
- XP Bar
- Gold Display
- Level Display
- Current Topic
- Dungeon Map
- Monster Selection
- Inventory
- Shop
- Adventure Log

---

## Question System

Supports

- Python
- Java
- C++

Question Types

- MCQs
- Code Snippets
- Topic-wise Questions
- Difficulty-wise Questions

---

## RPG Gameplay

- Explore dungeon
- Fight monsters
- Solve questions
- Earn XP
- Earn Gold
- Level Up
- Heal
- Buy Potions
- Unlock harder challenges

---

# 🛠 Tech Stack

## Frontend

- HTML5
- CSS3
- JavaScript

---

## Backend

- Python
- Flask

---

## Database

- PostgreSQL

---

## Authentication

- Google OAuth
- Flask Sessions

---

## Version Control

- Git
- GitHub

---

# 🏗 Project Architecture

```
                    Browser

                        │

                        ▼

              HTML + CSS + JavaScript

                        │

                        ▼

                 Flask Backend

        ┌────────────┼─────────────┐
        │            │             │
        ▼            ▼             ▼

 Authentication   Game Logic    API Routes

        │            │             │

        └────────────┼─────────────┘

                     ▼

               PostgreSQL Database
```

---

# 📂 Folder Structure

```
ALGOLINGO/

│

├── static/

│   ├── css/

│   ├── js/

│   ├── tower.png

│   ├── monsters_spritesheet.png

│   └── items_spritesheet.png

│

├── templates/

│   ├── index.html

│   ├── login.html

│   ├── signup.html

│   └── dashboard.html

│

├── app.py

├── db.py

├── questions_routes.py

├── requirements.txt

├── .env

└── README.md
```

---

# 🗄 Database Design

## Users Table

| Column | Description |
|----------|-------------|
| id | Primary Key |
| username | Username |
| email | User Email |
| password_hash | Encrypted Password |
| level | Current Player Level |
| created_at | Account Creation Date |
| profile_picture | Google Profile Picture |
| provider | Login Provider |
| google_id | Google Account ID |
| xp | Total Experience |
| gold | Player Gold |
| hp | Current HP |
| completed_questions | Questions Already Solved |

---

## Questions Table

| Column | Description |
|----------|-------------|
| id | Question ID |
| topic | Programming Topic |
| difficulty | Easy / Medium / Hard |
| question_type | MCQ / Code |
| question | Question Text |
| option_a | Option A |
| option_b | Option B |
| option_c | Option C |
| option_d | Option D |
| correct_answer | Correct Answer |
| explanation | Solution Explanation |
| xp_reward | XP Earned |
| created_at | Creation Time |
| languages | Python / Java / C++ |
| code_snippet | Optional Code Block |
| correct_option | A/B/C/D |

---

# 🔐 Authentication

ALGOLINGO supports two authentication methods.

## Email Login

```
Register

↓

Password Hashing

↓

PostgreSQL

↓

Login

↓

Session Created

↓

Dashboard
```

---

## Google Login

```
Google OAuth

↓

Google verifies account

↓

Flask receives user information

↓

Check PostgreSQL

↓

Existing User?

↓

Yes → Login

No → Create Account

↓

Dashboard
```

---

# ⚔ Battle System

```
Player approaches monster

↓

Press Space

↓

Battle Modal Opens

↓

Question Loaded

↓

Player Answers

↓

Correct?

↓

YES

↓

Monster HP decreases

↓

Wrong?

↓

Player HP decreases

↓

Monster Defeated

↓

XP + Gold Reward

↓

Database Updated

↓

Return to Dungeon
```

---

# ❤️ HP System

Default HP

```
100 HP
```

Wrong answers reduce HP.

Example

```
100

↓

85

↓

70

↓

55

↓

40

↓

25

↓

0
```

At 0 HP

- Battle Lost
- Player must heal before continuing

---

# ⭐ XP System

XP rewards depend on question difficulty.

| Difficulty | XP |
|------------|----|
| Easy | 50 |
| Medium | 100 |
| Hard | 200 |

When enough XP is earned

```
Level Up

↓

Higher Rewards

↓

Future Content Unlocks
```

---

# 💰 Gold System

Gold is earned by defeating monsters.

Used for

- Buying Potions
- Unlocking Equipment
- Future Shop Items

---

# 🧪 Question System

Questions are selected dynamically from PostgreSQL.

Filtering

- Language
- Topic
- Difficulty

Supported Languages

- Python
- Java
- C++

---

# 🧙 Monster Difficulty

## 🟢 Easy

Green Slime

HP

100

---

## 🟡 Medium

Skeleton

HP

150

---

## 🔴 Hard

Beholder

HP

200

---

# 🧪 Installation

Clone the repository

```bash
git clone https://github.com/ACM-JUIT/Team-3-Algolingo.git
```

Go into project

```bash
cd ALGOLINGO
```

Create virtual environment

```bash
python -m venv venv
```

Activate

Windows

```bash
venv\Scripts\activate
```

Linux/macOS

```bash
source venv/bin/activate
```

Install packages

```bash
pip install -r requirements.txt
```

---

# ⚙ Environment Variables

Create a `.env`

```env
SECRET_KEY=your_secret_key

DATABASE_URL=postgresql://username:password@localhost:5432/algolingo

GOOGLE_CLIENT_ID=your_google_client_id

GOOGLE_CLIENT_SECRET=your_google_client_secret
```

---

# ▶ Run the Project

```bash
python app.py
```

Visit

```
http://127.0.0.1:5000
```

---

# 🌐 Main Routes

| Route | Description |
|---------|------------|
| / | Landing Page |
| /login | Login |
| /signup | Register |
| /dashboard | Dashboard |
| /logout | Logout |
| /api/state | Player State |
| /questions | Question APIs |

---

# 📈 Current Progress

✅ Landing Page

✅ Login System

✅ Signup System

✅ Google Authentication

✅ PostgreSQL Integration

✅ Dashboard

✅ RPG UI

✅ HP System

✅ XP System

✅ Gold System

✅ Monster Battles

✅ Shop UI

✅ Inventory UI

✅ Adventure Log

✅ Programming Questions

---

# 🚀 Future Improvements

- Boss Battles
- Daily Quests
- Achievements
- Leaderboards
- Friends System
- Multiplayer Battles
- Adaptive Difficulty
- AI Generated Questions
- Coding Challenges
- DSA Tower
- Admin Dashboard
- Inventory Database
- Equipment Upgrade System
- Sound Effects
- Animations
- Mobile Support

---

# 👨‍💻 Team

**Team 3 – ACM JUIT**

Project developed as part of the ACM Software Development Initiative.

---

# 📜 License

This project is licensed under the MIT License.

---

# ⭐ Acknowledgements

Inspired by

- Duolingo
- CodeCombat
- Pokémon RPG Mechanics
- Classic Pixel Dungeon Games
- Open Source Community

---

> **"Learn Programming. Defeat Monsters. Level Up Your Logic."**
