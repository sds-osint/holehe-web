# Holehe Web Checker

A FastAPI-powered web interface for [Holehe](https://github.com/megadose/holehe), an OSINT tool that checks if an email is registered on various websites.

---

## 🚀 Features

- Clean and responsive web interface
- Async backend for fast Holehe execution
- Export results to CSV
- Copy raw output to clipboard
- Scan duration tracking
- Dockerized for easy deployment

---

## 🐳 Running with Docker

### Build and run locally
```bash
docker build -t holehe-web .
docker run -p 8000:8000 holehe-web
```

Then visit [http://localhost:8000](http://localhost:8000)

### Or with Docker Compose
```bash
docker compose up -d
```

---

## 📁 Project Structure

```
.
├── Dockerfile
├── docker-compose.yml (optional)
├── main.py             # FastAPI backend
├── requirements.txt    # Python dependencies
├── static/
│   ├── index.html      # Web interface
│   ├── style.css       # Styling
│   └── script.js       # Frontend logic
└── .gitignore
```

---

## 🛠 Development

Make sure you have `holehe`, `fastapi`, and `uvicorn` installed:
```bash
pip install -r requirements.txt
```
Then run:
```bash
uvicorn main:app --reload
```

Access the app at [http://localhost:8000](http://localhost:8000)

---

## ✨ Credit

- [megadose/holehe](https://github.com/megadose/holehe) — the tool this project wraps
- UI inspired by ChatGPT's dark theme 🌚

---

## 📄 License

This project is for educational and research purposes only.
