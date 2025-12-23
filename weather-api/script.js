const API_KEY = '0d9c890a2e929bbf4bd256598096a8cc';

const form = document.getElementById('weatherForm');
const cityInput = document.getElementById('city');
const unitsRadios = document.querySelectorAll('input[name="units"]');
const result = document.getElementById('result');
const themeToggle = document.getElementById('themeToggle');

const API_BASE = 'https://api.openweathermap.org/data/2.5/weather';

// Theme persistence
const savedTheme = localStorage.getItem('weather_theme');
if (savedTheme === 'dark') {
	document.body.classList.add('dark');
	themeToggle.checked = true;
}

themeToggle.addEventListener('change', () => {
	document.body.classList.toggle('dark', themeToggle.checked);
	localStorage.setItem('weather_theme', themeToggle.checked ? 'dark' : 'light');
});

function getSelectedUnits() {
	return document.querySelector('input[name="units"]:checked')?.value || 'metric';
}

function renderMessage(msg) {
	result.innerHTML = `<div class="empty-state"><p class="hint">${msg}</p></div>`;
}

function renderWeather(data, units) {
	const city = `${data.name}, ${data.sys?.country || ''}`.trim();
	const tempUnit = units === 'metric' ? '°C' : '°F';
	const windUnit = units === 'metric' ? 'm/s' : 'mph';
	const icon = data.weather?.[0]?.icon || '';
	const desc = data.weather?.[0]?.description || '';
	const iconUrl = icon ? `https://openweathermap.org/img/wn/${icon}@2x.png` : '';

	result.innerHTML = `
		<article class="weather">
			<div>
				<h2>${city}</h2>
				<p class="meta">${new Date().toLocaleString()}</p>
				<div class="temp">${Math.round(data.main.temp)}${tempUnit}</div>
				<p class="meta">${desc}</p>
			</div>
			<div class="details">
				${iconUrl ? `<img src="${iconUrl}" alt="${desc}"/>` : ''}
				<div class="detail"><span class="label">Feels like</span><span class="value">${Math.round(data.main.feels_like)}${tempUnit}</span></div>
				<div class="detail"><span class="label">Humidity</span><span class="value">${data.main.humidity}%</span></div>
				<div class="detail"><span class="label">Wind</span><span class="value">${Math.round(data.wind.speed)} ${windUnit}</span></div>
				<div class="detail"><span class="label">Pressure</span><span class="value">${data.main.pressure} hPa</span></div>
			</div>
		</article>
	`;
}

async function fetchWeather(city, units) {
	const key = (API_KEY || '').trim();
	if (!key) {
		renderMessage('Set your OpenWeather API key in weather-api/script.js (API_KEY).');
		return;
	}
	renderMessage('Loading…');
	try {
		const url = `${API_BASE}?q=${encodeURIComponent(city)}&appid=${encodeURIComponent(key)}&units=${encodeURIComponent(units)}`;
		const res = await fetch(url);
		if (!res.ok) {
			const errText = await res.text().catch(() => '');
			throw new Error(`Request failed (${res.status}). ${errText}`);
		}
		const data = await res.json();
		renderWeather(data, units);
		// Fetch and render 5-day forecast after current weather
		fetchForecast(city, units).catch((e) => {
			console.error(e);
			// Silently ignore forecast errors but keep current weather visible
		});
	} catch (err) {
		console.error(err);
		renderMessage('Could not fetch weather. Check city name and API key.');
	}
}

form.addEventListener('submit', (e) => {
	e.preventDefault();
	const city = cityInput.value.trim();
	const units = getSelectedUnits();
	if (!city) { renderMessage('Please enter a city.'); return; }
	fetchWeather(city, units);
});

// -------- 5-day forecast --------
const FORECAST_BASE = 'https://api.openweathermap.org/data/2.5/forecast';

function toLocalDateString(tsSeconds, tzOffsetSeconds) {
	const ms = (tsSeconds + tzOffsetSeconds) * 1000;
	const d = new Date(ms);
	const y = d.getUTCFullYear();
	const m = String(d.getUTCMonth() + 1).padStart(2, '0');
	const day = String(d.getUTCDate()).padStart(2, '0');
	return `${y}-${m}-${day}`;
}

function weekdayShort(tsSeconds, tzOffsetSeconds) {
	const ms = (tsSeconds + tzOffsetSeconds) * 1000;
	return new Date(ms).toUTCString().slice(0, 3); // Mon, Tue, ...
}

function groupByDay(list, tzOffsetSeconds) {
	const map = new Map();
	for (const item of list) {
		const key = toLocalDateString(item.dt, tzOffsetSeconds);
		if (!map.has(key)) map.set(key, []);
		map.get(key).push(item);
	}
	return map;
}

function summarizeDay(entries, tzOffsetSeconds, units) {
	let min = Infinity, max = -Infinity;
	for (const it of entries) {
		const t = it.main?.temp;
		if (typeof t === 'number') {
			if (t < min) min = t;
			if (t > max) max = t;
		}
	}
	// pick icon near 12:00 local if possible
	const targetHour = 12;
	let best = entries[0];
	let bestDiff = Infinity;
	for (const it of entries) {
		const ms = (it.dt + tzOffsetSeconds) * 1000;
		const hour = new Date(ms).getUTCHours();
		const diff = Math.abs(hour - targetHour);
		if (diff < bestDiff) { bestDiff = diff; best = it; }
	}
	const icon = best.weather?.[0]?.icon || '';
	const desc = best.weather?.[0]?.description || '';
	const iconUrl = icon ? `https://openweathermap.org/img/wn/${icon}.png` : '';
	const tempUnit = units === 'imperial' ? '°F' : '°C';
	return { min: Math.round(min), max: Math.round(max), iconUrl, desc, tempUnit, repDt: best.dt };
}

function renderForecast(forecast, units) {
	const { city, list } = forecast;
	const tz = city?.timezone || 0;
	const grouped = groupByDay(list, tz);
	const todayKey = toLocalDateString(Math.floor(Date.now() / 1000), tz);
	const days = [];
	for (const [key, entries] of grouped) {
		if (key === todayKey) continue; // skip current day
		days.push({ key, entries });
	}
	days.sort((a, b) => (a.key < b.key ? -1 : 1));
	const top5 = days.slice(0, 5);
	if (!top5.length) return;

	const cards = top5.map(({ key, entries }) => {
		const s = summarizeDay(entries, tz, units);
		const [y, m, d] = key.split('-');
		const labelDate = `${m}/${d}`;
		const wk = weekdayShort(s.repDt, tz);
		return `
			<div class="day">
				<div class="day__top">
					<span class="day__wk">${wk}</span>
					<span class="day__date">${labelDate}</span>
				</div>
				${s.iconUrl ? `<img src="${s.iconUrl}" alt="${s.desc}" class="day__icon" />` : ''}
				<div class="day__temps">
					<span class="max">${s.max}${s.tempUnit}</span>
					<span class="min">${s.min}${s.tempUnit}</span>
				</div>
				<div class="day__desc">${s.desc}</div>
			</div>
		`;
	}).join('');

	const container = document.createElement('section');
	container.className = 'forecast';
	container.innerHTML = `
		<h3 class="subtitle" style="margin-top:12px;">5-Day Forecast</h3>
		<div class="forecast__grid">${cards}</div>
	`;
	result.appendChild(container);
}

async function fetchForecast(city, units) {
	const key = (API_KEY || '').trim();
	if (!key) return;
	const url = `${FORECAST_BASE}?q=${encodeURIComponent(city)}&appid=${encodeURIComponent(key)}&units=${encodeURIComponent(units)}`;
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Forecast failed (${res.status})`);
	const data = await res.json();
	renderForecast(data, units);
}

