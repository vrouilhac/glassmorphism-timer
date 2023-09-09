var startTime = null; // e.g. 12:00 in milliseconds
var currentTime = null; // e.g. 12:20 in milliseconds
var timer = 5 * 1000//15 * 60 * 1000; // e.g. 30min in milliseconds, default: 15 min
var interval = null;

function playAudio() {
	const audio = document.querySelector("#audio");
	audio.play();
}

function checkEnd() {
	const remaining = getRemaining();
	
	if (remaining <= 0 && interval) {
		stopBtnEvent();
	}
}

function getRemaining() {
	if (Number.isNaN(startTime) || Number.isNaN(currentTime) || Number.isNaN(timer)) {
		console.error("Error: Something went bad");
		return 0;
	}

	const endTimer = startTime + timer;
	const diff = timestampToSecond(Math.abs(endTimer - currentTime))

	return diff < 0 ? 0 : diff;
}

function timerToParts() {
	if (Number.isNaN(startTime) || Number.isNaN(currentTime) || Number.isNaN(timer)) {
		console.error("Error: Something went bad");

		return {
			md: 0,
			mu: 0,
			sd: 0,
			su: 0,
		};
	}

	const remaining = getRemaining();

	if (remaining <= 0) {
		return {
			md: 0,
			mu: 0,
			sd: 0,
			su: 0,
		};
	}

	const minutes = Math.floor(remaining/60);
	const seconds = remaining - (minutes*60);
	const [md, mu] = formatTimePartToString(minutes).split("");
	const [sd, su] = formatTimePartToString(seconds).split("");

	return {
		md: md ?? 0,
		mu: mu ?? 0,
		sd: sd ?? 0,
		su: su ?? 0,
	};
}

function formatTimePartToString(timePart) {
	if(timePart < 10) {
		return `0${timePart}`;
	}

	return timePart.toString();
}

function timestampToSecond(timestamp) {
	return Math.floor(timestamp/1000)
}

function renderTimer() {
	const md = document.querySelector("#md");
	const mu = document.querySelector("#mu");
	const sd = document.querySelector("#sd");
	const su = document.querySelector("#su");

	const timerParts = timerToParts();

	md.textContent = timerParts.md;
	mu.textContent = timerParts.mu;
	sd.textContent = timerParts.sd;
	su.textContent = timerParts.su;
}

function updateTimer() {
	if (startTime == null && Number.isNaN(startTime)) {
		console.error("Something bad happened");
		return;
	}

	currentTime = getNowTimestamp();
}

function startBtnEvent() {
	const intervalFn = () => {
		updateTimer();
		renderTimer();
		checkEnd();
	};

	startTime = getNowTimestamp();
	intervalFn();
	interval = setInterval(intervalFn, 1000);

	toggleStartBtn();
	togglePauseBtn();
	toggleStopBtn();
}

function pauseBtnEvent() {
	if(interval) {
		clearInterval(interval);
		interval = null;
	}

	toggleResumeBtn();
	togglePauseBtn();
}

function resumeBtnEvent() {
	const elapsed = timer - getRemaining() * 1000;

	currentTime = getNowTimestamp();
	startTime = currentTime - elapsed;

	interval = setInterval(() => {
		updateTimer();
		renderTimer();
		checkEnd();
	}, 1000);

	toggleResumeBtn();
	togglePauseBtn();
}

function stopBtnEvent() {
	if (interval) {
		togglePauseBtn();
	} else {
		toggleResumeBtn();
	}

	if(interval) {
		clearInterval(interval);
		interval = null;
		timer = 15 * 60 * 1000;
		currentTime = null;
		startTime = null;
		playAudio();
	}

	toggleStopBtn();
	toggleStartBtn();
	renderTimer();
}

function toggleStartBtn() {
	const startBtn = document.querySelector("#start-btn");
	startBtn.classList.toggle("hidden");
}

function toggleResumeBtn() {
	const resumeBtn = document.querySelector("#resume-btn");
	resumeBtn.classList.toggle("hidden");
}

function togglePauseBtn() {
	const pauseBtn = document.querySelector("#pause-btn");
	pauseBtn.classList.toggle("hidden");
}

function toggleStopBtn() {
	const stopBtn = document.querySelector("#stop-btn");
	stopBtn.classList.toggle("hidden");
}

function getNowTimestamp() {
	return Math.floor(new Date(Date.now()).getTime() / 1000) * 1000;
}

function initSmallBtns() {
	const buttons = document.querySelectorAll(".button-small");
	buttons.forEach((el) => {
		el.addEventListener("click", () => {
			let diff = 0;
			switch(el.dataset?.time) {
				case "-30":
					diff -= 30 * 60 * 1000;
					break;
				case "-15":
					diff -= 15 * 60 * 1000;
					break;
				case "-5":
					diff -= 5 * 60 * 1000;
					break;
				case "+5":
					diff += 5 * 60 * 1000;
					break;
				case "+15":
					diff += 15 * 60 * 1000;
					break;
				case "+30":
					diff += 30 * 60 * 1000;
					break;
			}

			if(timer > 0 || diff > 0) {
				if((timer + diff) < 0) {
					timer = 0;
				} else {
					timer += diff;
				}
				renderTimer();
			}
		})
	});
}

function init() {
	const startBtn = document.querySelector("#start-btn");
	startBtn.addEventListener("click", startBtnEvent)

	const resumeBtn = document.querySelector("#resume-btn");
	resumeBtn.addEventListener("click", resumeBtnEvent)

	const pauseBtn = document.querySelector("#pause-btn");
	pauseBtn.addEventListener("click", pauseBtnEvent)

	const stopBtn = document.querySelector("#stop-btn");
	stopBtn.addEventListener("click", stopBtnEvent)

	initSmallBtns();

	renderTimer();
}

document.body.onload = init;
