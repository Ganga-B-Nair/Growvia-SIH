<!-- README.md -->
# Growvia (Static SPA)

A one-stop career advisor featuring:
- AI-like chatbot, aptitude quiz, career path visualizer, college directory
- Interest groups with market trends, timeline tracker, and “Career Wrapped”
- Glassmorphism UI using your theme: background `#2A2A2A`, text `#ECECEC`, accent `#4682B4`

## Run
- Option 1: Open `index.html` directly in a modern browser.
- Option 2 (recommended): Serve locally
  - Python: `python3 -m http.server 8080` (then open `http://localhost:8080/growvia/` if served from parent folder)
  - Node (any static server): `npx serve .` and open the served URL.

## Data
- Stored in `localStorage` under `growvia:*` keys.
- First-time users are redirected to Onboarding.

## Notes
- Chatbot answers are generated locally (no API key).
- Visualizer shows many visible career options across clusters.
- Career Wrapped summarizes timeline achievements for a selected 1–6 month window.