const displayEl = document.getElementById('display');
let expr = '';

function updateDisplay(value) {
	displayEl.value = value;
}

function clearAll() {
	expr = '';
	updateDisplay('');
}

function delOne() {
	expr = expr.slice(0, -1);
	updateDisplay(expr);
}

function append(ch) {
	expr += ch;
	updateDisplay(expr);
}

function isSafeExpression(s) {
	return /^[0-9+\-*/.()\s]+$/.test(s);
}

function evaluateExpr() {
	if (!expr) return;
	if (!isSafeExpression(expr)) {
		updateDisplay('Error');
		expr = '';
		return;
	}
	try {
		// Evaluate safely by constructing a function in an isolated scope
		const result = Function(`"use strict"; return (${expr})`)();
		// Handle floating rounding issues
		const rounded = Math.round((result + Number.EPSILON) * 1e10) / 1e10;
		updateDisplay(String(rounded));
		expr = String(rounded);
	} catch (e) {
		updateDisplay('Error');
		expr = '';
	}
}

document.addEventListener('click', (e) => {
	const btn = e.target.closest('[data-key]');
	if (!btn) return;
	const key = btn.getAttribute('data-key');
	switch (key) {
		case 'C':
			clearAll();
			break;
		case 'DEL':
			delOne();
			break;
		case '=':
			evaluateExpr();
			break;
		default:
			append(key);
	}
});

// Keyboard support
document.addEventListener('keydown', (e) => {
	const { key } = e;
	if (key === 'Enter') { e.preventDefault(); evaluateExpr(); return; }
	if (key === 'Backspace') { e.preventDefault(); delOne(); return; }
	if (key === 'Escape') { e.preventDefault(); clearAll(); return; }
	if (/^[0-9+\-*/.()]$/.test(key)) { append(key); }
});
