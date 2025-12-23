# Final Project ELEC3

A collection of four small, beginner-friendly web apps built as a solo project. Each app focuses on core front‑end skills (HTML, CSS, JavaScript) and uses clean, modular code:

- Calculator
- Stopwatch
- Random User Contacts (RandomUser API)
- Weather Dashboard (OpenWeatherMap API)

## Overview
- Single repository containing four standalone apps under `final-project-elec3/`.
- Each app runs client-side with no backend required.
- API-powered apps fetch data securely over HTTPS.

## Main Features
- **Calculator:** Keyboard and button input, safe expression evaluation, rounding, clear/delete actions.
- **Stopwatch:** Start/stop, reset, lap recording, spacebar lap shortcut, centisecond precision.
- **Random User Contacts:** Generate multiple contacts, gender filter, cards/table view toggle, delete/clear, live stats, dark mode with `localStorage`.
- **Weather Dashboard:** Current weather by city, metric/imperial units, icon + description, feels-like, humidity, wind, pressure, 5‑day forecast, dark theme persistence.

## APIs Used

### 1) Random User API
- **Name:** Random User API
- **Base URL:** `https://randomuser.me/api/`
- **Endpoint:** `GET /` (returns random users)
- **Parameters:**
  - `results` (number of users to return)
  - `gender` (`male` | `female`, optional)
- **Authentication:** None
- **Implementation Location:** See [final-project-elec3/random-user-api/script.js](final-project-elec3/random-user-api/script.js)

### 2) OpenWeatherMap API
- **Name:** OpenWeatherMap (Current Weather + 5‑Day Forecast)
- **Base URLs:**
  - Current: `https://api.openweathermap.org/data/2.5/weather`
  - Forecast: `https://api.openweathermap.org/data/2.5/forecast`
- **Endpoints:**
  - `GET /weather` → Current weather by city
  - `GET /forecast` → 5‑day/3‑hour forecast by city
- **Parameters (both endpoints):**
  - `q` (city name, e.g. `Manila`)
  - `units` (`metric` or `imperial`)
  - `appid` (API key)
- **Authentication:** API key required. Sign up at https://openweathermap.org/.
- **Set Your Key:** Edit the `API_KEY` at the top of [final-project-elec3/weather-api/script.js](final-project-elec3/weather-api/script.js).

## Technologies Used
- HTML5 for structure
- CSS3 for styling and responsive layouts
- Vanilla JavaScript (ES6+): DOM manipulation, events, timers, `fetch`, `localStorage`

## Getting Started

### 1) Clone or Download
- **Clone (Git):**
```bash
git clone https://github.com/Qwertyyy16/final-project-elec3.git
cd final-project-elec3
```
- **Download ZIP:**
  - Click “Code” → “Download ZIP” in your repo, then unzip.

### 2) Run Locally
You can open each app directly or serve the folder with a simple static server.

- **Easiest (Double‑click):** Open any app’s `index.html` in your browser:
  - [final-project-elec3/calculator/index.html](final-project-elec3/calculator/index.html)
  - [final-project-elec3/stopwatch/index.html](final-project-elec3/stopwatch/index.html)
  - [final-project-elec3/random-user-api/index.html](final-project-elec3/random-user-api/index.html)
  - [final-project-elec3/weather-api/index.html](final-project-elec3/weather-api/index.html)

- **Recommended (VS Code Live Server):** Install the “Live Server” extension, then right‑click `index.html` → “Open with Live Server”.

- **Python (if installed):**
```bash
# From the repo root
cd final-project-elec3
python -m http.server 8080
# Then open http://localhost:8080/<app-folder>/index.html
```

### 3) Weather API Key
- Sign up at OpenWeatherMap to get an API key.
- Open [final-project-elec3/weather-api/script.js](final-project-elec3/weather-api/script.js).
- Replace the `API_KEY` value near the top with your key.

## Screenshots
Add screenshots to a `screenshots/` folder and replace these placeholders:
- Calculator: `![Calculator](screenshots/calculator.png)`
- Stopwatch: `![Stopwatch](screenshots/stopwatch.png)`
- Random User Contacts: `![Random User](screenshots/random-user.png)`
- Weather Dashboard: `![Weather Dashboard](screenshots/weather.png)`

## Credits / Attribution
- Random User API — https://randomuser.me/
- OpenWeatherMap — https://openweathermap.org/

## Notes for Instructors
- All apps are client‑side and runnable without additional setup.
- API usage is scoped, documented, and uses standard endpoints.
- Code emphasizes readability, safe evaluation (calculator), and clean UI interactions.
