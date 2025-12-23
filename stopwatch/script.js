const timeEl = document.getElementById('time');
const startStopBtn = document.getElementById('startStop');
const resetBtn = document.getElementById('reset');
const lapsContainer = document.getElementById('laps');

let startTime = 0;
let elapsed = 0; // ms
let timerId = null;
let laps = [];

function format(ms) {
	const totalCs = Math.floor(ms / 10); // centiseconds
	const cs = totalCs % 100;
	const totalSec = Math.floor(totalCs / 100);
	const sec = totalSec % 60;
	const totalMin = Math.floor(totalSec / 60);
	const min = totalMin % 60;
	const hr = Math.floor(totalMin / 60);
	return `${String(hr).padStart(2, '0')}:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
}

function render() { 
	timeEl.textContent = format(elapsed); 
}

function tick() {
	const now = performance.now();
	elapsed = now - startTime;
	render();
}

function start() {
	if (timerId) return;
	startTime = performance.now() - elapsed;
	timerId = setInterval(tick, 10);
	startStopBtn.textContent = '';
	startStopBtn.innerHTML = '<span class="btn-text">Stop</span><span class="btn-icon">⏹</span>';
	startStopBtn.classList.remove('btn--start');
	startStopBtn.classList.add('btn--stop');
	resetBtn.disabled = true;
	timeEl.classList.add('running');
}

function stop() {
	if (!timerId) return;
	clearInterval(timerId);
	timerId = null;
	tick();
	startStopBtn.textContent = '';
	startStopBtn.innerHTML = '<span class="btn-text">Start</span><span class="btn-icon">▶</span>';
	startStopBtn.classList.remove('btn--stop');
	startStopBtn.classList.add('btn--start');
	resetBtn.disabled = false;
	timeEl.classList.remove('running');
}

function addLap() {
	if (!timerId) return; // Only add lap while running
	const lapTime = format(elapsed);
	laps.unshift({ 
		time: lapTime, 
		number: laps.length + 1 
	});
	renderLaps();
}

function renderLaps() {
	lapsContainer.innerHTML = laps.map((lap, index) => `
		<div class="lap-item">
			<span class="lap-label">Lap ${lap.number}</span>
			<span class="lap-time">${lap.time}</span>
		</div>
	`).join('');
}

function reset() {
	stop();
	elapsed = 0;
	laps = [];
	render();
	renderLaps();
}

startStopBtn.addEventListener('click', () => (timerId ? stop() : start()));
resetBtn.addEventListener('click', reset);

// Add lap functionality on spacebar
document.addEventListener('keydown', (e) => {
	if (e.code === 'Space') {
		e.preventDefault();
		addLap();
	}
});

render();

