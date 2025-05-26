# Thoughty

Thoughty is a digital platform for the youth that allow them to share their ideas and projects freely, without feeling limited or locked down.

Built with:
🖥️ Frontend: HTML, CSS, JavaScript
🧪 Backend: Django + Django REST Framework
🧠 AI: Integrated LLMs for generation & judgment

## Features:

* **Thoughty Pods** that allows the user to share as much ideas as they want at any stage.
* User can battle with their ideas to see how much votes would it get.
* **Gamification Engine** which counts a mind tokens for the user and score them up.
* **Brainstorm Roulette & Multiverse** allows the user to have a creative AI thinker to help them with their ideas or to help somebody creating the same idea in another verse ✨
* **Mind Mentor** that tracks user thoughts and ideas and help them get improving using AI and suggest for them books to read and create reports for them.

### 🔔 Notifications & Timeline

* Real-time alerts for battles, reactions, evolution
* Timeline view of thought progression

## 🚀 Getting Started

Clone the repository:

```bash
git clone https://github.com/khaled-muhammad/thoughty.git
cd thoughty
```

### Backend

1. Create virtualenv & install requirements:

   ```bash
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

2. Run migrations & seed data:

   ```bash
   python manage.py migrate
   python manage.py loaddata prompts.json
   ```

3. Start dev server:

   ```bash
   python manage.py runserver
   ```

### Frontend

Open frontend/index.html directly or serve via local server:

```bash
cd frontend
python -m http.server
```

---

## 🔒 Environment Variables

Create a .env file in the backend/ directory:

```
SECRET_KEY=your-secret
DEBUG=True
ALLOWED_HOSTS=*
DATABASE_URL=postgres://...
OPENAI_API_KEY=your-openai-key
```

---

## 🧪 Testing

Run unit tests:

```bash
python manage.py test
```

---

## 📚 API Documentation

Available at:

* [http://localhost:8000/api/schema/](http://localhost:8000/api/schema/)
* [http://localhost:8000/api/docs/](http://localhost:8000/api/docs/) (Swagger UI)

---

## 🙌 Contributing

Pull requests are welcome!
Open an issue to propose changes or features.

---

## 📄 License

MIT License © 2025 Khaled Muhammad & Malak Sabry