let x = 0;
let y = 0;
let player = "";
let p = "";
let state = {};
let count = 0;
let players = [];
let otherPlayer = '';
let hitTimer = 0;
let playerColor = '';
limitTime = false;
let init = true;
let gameOver = false;
const solid = {
	cPress: {
		up: false,
		down: false,
		left: false,
		right: false
	}
}
musicAlwaysOff = false;
const battlegroundBackground = new Image();
// img.onload = someFunctionToCallWhenTheImageHasLoaded
battlegroundBackground.src = 'images/battleground8.webp';

// import cannonBlast1 from '../assets/sound.mp3'
// const audio = new Audio(sound)
let prevCannonOtherPlayer = '';
let currentHitsOtherPlayer = 3;
let prevHitsOtherPlayer = 3;
let scoreboard = document.getElementById('scoreboard')
let playerHealthBoard = document.getElementById('playerHealth')
let otherPlayerHealthBoard = document.getElementById('otherPlayerHealth')
const FRAMES_PER_SECOND = 3; // Valid values are 60,30,20,15,10...
// set the mim time to render the next frame
const FRAME_MIN_TIME = (1000 / 60) * (60 / FRAMES_PER_SECOND) - (1000 / 60) * 0.5;
var lastFrameTime = 0; // the last frame time

var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
// var ctx2 = canvas.getContext("2d");
const tankGraphics = {
	tankLeft: '',
	tankRight: ''
}

initSound = false;
let soundOn = true;


const tankLeft = new Image();
// img.onload = someFunctionToCallWhenTheImageHasLoaded
tankLeft.src = './tankLeft.png';
const tankRight = new Image();
// img.onload = someFunctionToCallWhenTheImageHasLoaded
tankRight.src = './tankRight.png';
tankGraphics.tankLeft = tankLeft
tankGraphics.tankRight = tankRight

// ctx.fillStyle = "#2E4053";
// ctx.fillRect(x, y, 150, 75);

function playButtonHandler() {
	readyForPlay();
}
let themeMusic = new Audio('sounds/dance.mp3')
themeMusic.volue = 0.8;


function startMusic() {
	// canvas.appendChild(themeMusic)
	// temp.volume = 0.5
	if (soundOn && !musicAlwaysOff) themeMusic.play();
	themeMusic.loop = true;
	initSound = true;
}

const toggleMute = () => {
	let muteButton = document.getElementById('mute')
	if (muteButton.innerHTML == 'mute') {
		soundOn = false;
		themeMusic.pause();
		muteButton.innerHTML = 'unmute'
	} else {
		soundOn = true;
		if (initSound == true) themeMusic.play();
		muteButton.innerHTML = 'mute'

	}
}

async function readyForPlay() {
	document.getElementById('connectionModal').style.display = 'block'
	document.getElementById('gameBoard').style.display = 'block'
	// canvas.style.display = 'block'
	document.getElementById('start').style.display = 'none'
	await getUuid();
	while (state.players.length < 2) {
		players = await getState();
	}
	players = await getPlayers();
	startMusic()
	setupRect();
	let test = await postMove(false)
	update();

};

async function getPlayers() {
	const uuid = await fetch('/getplayers?id=' + state.id)
		.then(response => {
			return response.json()
		})
		.then(data => {
			state.players = data
		})
}

async function getState() {
	await fetch('/getstate?id=' + state.id)
		.then(response => {
			return response.json()
		})
		.then(data => {
			state = data
		})
}


async function getUuid() {
	const uuid = await fetch('/getuuid')
		.then(response => {
			return response.json()
		})
		.then(data => {
			player = data.id
			p = data.id == data.p1 ? data.p1 : data.p2;
			state = data.game
		});
	return
}

async function getData() {
	const data = await fetch(`/getData` + new URLSearchParams({
			gameId: state.id,
			id: player
		}))
		.then(response => {
			return response.json()
		})
		.then(data => {
			player = data.id
			p = data.id == data.p1 ? data.p1 : data.p2;
			otherPlayer = data.id == data.p1 ? data.p2 : data.p1;
			state = data.game
		});
}

window.addEventListener('keydown', (e) => {
	if (e.key == " ") state[player].cPress.space = true
	if (e.key == "ArrowUp") state[player].cPress.up = true
	if (e.key == "ArrowDown") state[player].cPress.down = true
	if (e.key == "ArrowLeft") state[player].cPress.left = true
	if (e.key == "ArrowRight") state[player].cPress.right = true

	if (e.key == " ") solid.cPress.space = true
	if (e.key == "ArrowUp") solid.cPress.up = true
	if (e.key == "ArrowDown") solid.cPress.down = true
	if (e.key == "ArrowLeft") solid.cPress.left = true
	if (e.key == "ArrowRight") solid.cPress.right = true

})

window.addEventListener('keyup', (e) => {
	if (e.key == " ") state[player].cPress.space = false
	if (e.key == "ArrowUp") state[player].cPress.up = false
	if (e.key == "ArrowDown") state[player].cPress.down = false
	if (e.key == "ArrowLeft") state[player].cPress.left = false
	if (e.key == "ArrowRight") state[player].cPress.right = false

	if (e.key == " ") solid.cPress.space = false
	if (e.key == "ArrowUp") solid.cPress.up = false
	if (e.key == "ArrowDown") solid.cPress.down = false
	if (e.key == "ArrowLeft") solid.cPress.left = false
	if (e.key == "ArrowRight") solid.cPress.right = false
})


function drawRect(rectObj, ctxObj, tankType) {
	// ctxObj.beginPath();
	// var newPattern = ctx.createPattern(testimg, "no-repeat");
	ctxObj.drawImage(tankGraphics[tankType], rectObj.x, rectObj.y, rectObj.w, rectObj.h);

	// ctxObj.fillRect(rectObj.x, rectObj.y, rectObj.w, rectObj.h)
	// ctxObj.closePath();
}

function drawCanvas(rectArr) {
	rectArr.forEach(rect => rect.clearRect(0, 0, canvas.width, canvas.height));
}

function drawBall(ball) {
	rectObj.beginPath();
	rectObj.arc(ball.x, ball.y, 5, 0, Math.PI * 2);
	rectObj.fillStyle = ball.color;
	rectObj.fill();
	rectObj.closePath();
}

function moveBall(ball) {
	ball.x += ball.dx;
	// ball.y += ball.dy;
};

async function update(time) {
	if (!init) {
		await getState()
	} else {
		otherPlayer = state.players[0] == player ? state.players[1] : state.players[0]
	}
	document.getElementById('connectionModal').style.display = 'none'
	init = false;
	let opCannonBalls = state[otherPlayer].cannonBalls ? state[otherPlayer].cannonBalls : ''
	if (prevCannonOtherPlayer != '' && prevCannonOtherPlayer != undefined) {
		if (opCannonBalls[opCannonBalls.length - 1]) {
			if (prevCannonOtherPlayer != opCannonBalls[opCannonBalls.length - 1].id) {
				let temp = new Audio('sounds/hit.mp3')
				canvas.appendChild(temp)
				// temp.volume = 0.5
				if (soundOn) temp.play();
				setTimeout(() => {
					canvas.removeChild(temp)
				}, 1000)
			}
		}
	}
	if (opCannonBalls[opCannonBalls.length - 1] != '' && opCannonBalls[opCannonBalls.length - 1] != undefined) prevCannonOtherPlayer = opCannonBalls[opCannonBalls.length - 1].id;
	prevHitsOtherPlayer = currentHitsOtherPlayer
	currentHitsOtherPlayer = state[otherPlayer].healthMeter
	if (currentHitsOtherPlayer < prevHitsOtherPlayer) {
		canvas.style.borderColor = 'yellow';
		canvas.style.background = '#FEFBEE';
		let temp = new Audio('sounds/cannonBlast1.mp3')
		canvas.appendChild(temp)
		// temp.volume = 0.5
		if (soundOn) temp.play();
		setTimeout(() => {
			canvas.removeChild(temp)
		}, 1000)
		// playerColor = state[player].rect.color

		state[player].rect.color = state[player].rect.hitColor

		setTimeout(() => {
			canvas.style.borderColor = 'black';
			// canvas.style.borderWidth = '2px';
			canvas.style.background = 'white'
		}, 240)
	}



	if (solid.cPress.down && inBounds('down')) state[player].rect.y = state[player].rect.y + 5
	if (solid.cPress.up && inBounds('up')) state[player].rect.y = state[player].rect.y - 5
	if (solid.cPress.left && inBounds('left')) state[player].rect.x = state[player].rect.x - 5
	if (solid.cPress.right && inBounds('right')) state[player].rect.x = state[player].rect.x + 5
	if (solid.cPress.space) {
		if (state[player].cannonTimer <= 0) {
			state[player].cannonBalls.push(new CannonBall(state[player].rect.x, state[player].rect.y, 22))
			state[player].cannonTimer = 8;
			let temp = new Audio('sounds/hit.mp3')
			canvas.appendChild(temp)
			// temp.volume = 0.5
			if (soundOn) temp.play();
			setTimeout(() => {
				canvas.removeChild(temp)
			}, 1000)
		}
	}
	if (playerHealthBoard.innerHTML != state[player].healthMeter) playerHealthBoard.innerHTML = state[player].healthMeter
	if (otherPlayerHealthBoard.innerHTML != state[otherPlayer].healthMeter) otherPlayerHealthBoard.innerHTML = state[otherPlayer].healthMeter
	console.log(state[player].healthMeter, state[otherPlayer].healthMeter)

	if (state[player].healthMeter == 0) {
		console.log(state[player].healthMeter, state[otherPlayer].healthMeter)
		let endgame = document.getElementById('endgame')
		themeMusic.pause();
		document.getElementById('gameBoard').style.display = 'none';
		endgame.style.display = 'block'
		console.log(endgame)
		endgame.innerHTML = 'DEFEAT'
		endgame.style.textSize = '24px'
		endgame.style.color = 'red'
		gameOver = true;
	} else if (state[otherPlayer].healthMeter == 0) {
		console.log(state[player].healthMeter, state[otherPlayer].healthMeter, 'other')

		let endgame = document.getElementById('endgame')
		themeMusic.pause();
		document.getElementById('gameBoard').style.display = 'none';
		endgame.style.display = 'block'
		endgame.innerHTML = 'VICTORY'
		endgame.style.textSize = '24px'
		endgame.style.color = 'blue'
		gameOver = true;

	}
	drawCanvas([ctx])
	ctx.drawImage(battlegroundBackground, 0, 0, 600, 400)
	tankOneType = state.p1 == player ? 'tankRight' : 'tankLeft'
	tankTwoType = state.p2 == player ? 'tankRight' : 'tankLeft'
	drawRect(state[player].rect, ctx, tankOneType)
	drawRect(state[otherPlayer].rect, ctx, tankTwoType)
	if (state[player].cannonBalls.length > 30) {
		let extra = state[player].cannonBalls.length - 30;
		state[player].cannonBalls.splice(0, extra)
	}
	for (let i = 0; i < state[player].cannonBalls.length; i++) {
		let ball = state[player].cannonBalls[i]
		drawBall(ball)
		if (ball.player == player) moveBall(ball)
		// if (ball.x > 700) {
		// state.cannonBalls.splice(i,1)
	}
	for (let i = 0; i < state[otherPlayer].cannonBalls.length; i++) {
		let ball = state[otherPlayer].cannonBalls[i]
		drawBall(ball)
		if (ball.player == player) moveBall(ball)
		// if (ball.x > 700) {
		// state.cannonBalls.splice(i,1)
	}

	// console.log(hitTimer)
	// console.log(state[player].dCannonBalls, state[player].cannonBalls, state[otherPlayer].dCannonBalls, state[otherPlayer].cannonBalls)
	await postMove(true);
};

async function postMove(reload) {
	if (gameOver == false) {
		if (reload) hitDetection()
		hitTimer--
		await fetch("/postmove", {

				// Adding method type
				method: "POST",

				// Adding body or contents to send
				body: JSON.stringify({
					player: player,
					otherPlayer: otherPlayer,
					rect: state[player].rect,
					gameId: state.id,
					game: state,
					cPress: state[player].cPress,
					cannonBalls: state[player].cannonBalls,
					cannonTimer: state[player].cannonTimer - 1,
					healthMeter: state[player].healthMeter,
					deleteBalls: state.dCannonBalls[otherPlayer],
					playerColor: state[player].rect.color
				}),

				// Adding headers to the request
				headers: {
					"Content-type": "application/json; charset=UTF-8",
					"Accept": "application/json"
				}
			})

			// Converting to JSON
			.then(response => response.json())

			// Displaying results to console
			.then(data => {
				state = data;
				if (reload) requestAnimationFrame(update);
			});
	}
}

function setupRect() {
	state[player].rect = {
		w: 40,
		h: 40,
		padding: 30,
		offsetx: 45,
		offsety: 60,
		visible: true,
		color: state.p1 == player ? '#F7B02B' : "#008033",
		primaryColor: state.p1 == player ? '#F7B02B' : "#008033",
		hitColor: 'red',
		x: state.p1 == player ? 45 : 545,
		y: state.p1 == player ? 200 : 200,
		dx: 18,
		dy: 18,
	}
}

function moveBall(ball) {
	ball.x += ball.dx;
	// ball.y += ball.dy;
};

class CannonBall {
	constructor(rectx, recty, dx) {
		this.player = player
		this.w = 5,
			this.h = 5,
			this.padding = 30,
			this.offsetx = 45,
			this.offsety = 60,
			this.visible = true,
			this.color = state.p1 == player ? '#F7B02B' : '#008033',
			this.x = state.p1 == player ? rectx + state[player].rect.w : rectx,
			this.y = recty + Math.floor(state[player].rect.h / 2),
			this.dx = state.p1 == player ? dx : -dx,
			this.dy = 0,
			this.id = Math.floor(Math.random() * 10000000)
	}
}

function drawBall(ball) {
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, 5, 0, Math.PI * 2);
	ctx.fillStyle = ball.color;
	ctx.fill();
	ctx.closePath();
}

function hitDetection() {
	// console.log(state[otherPlayer].cannonBalls, state[player].cannonBalls)
	if (hitTimer <= 0) {
		state[player].rect.color = state[player].rect.primaryColor;

		for (let i = 0; i < state[otherPlayer].cannonBalls.length; i++) {
			let ball = state[otherPlayer].cannonBalls[i];
			let rect = state[player].rect;
			state.dCannonBalls[otherPlayer] = [];
			if (ball.x > rect.x && ball.x < rect.x + rect.w) {
				if (ball.y > rect.y && ball.y < rect.y + rect.h) {
					if (state.dCannonBalls[otherPlayer].length == 0) {
						state.dCannonBalls[otherPlayer].push(ball.id);
						state[player].healthMeter--
						hitTimer = 15
						canvas.style.borderColor = 'red';
						canvas.style.background = '#FFF0F0';
						// playerColor = state[player].rect.color
						state[player].rect.color = state[player].rect.hitColor

						let temp = new Audio('sounds/cannonBlast1.mp3')
						canvas.appendChild(temp)
						// temp.volume = 0.5
						if (soundOn) temp.play();
						setTimeout(() => {
							canvas.removeChild(temp)
						}, 1000)


						setTimeout(() => {
							canvas.style.borderColor = 'black';
							// canvas.style.borderWidth = '2px';
							canvas.style.background = 'white'
						}, 240)
					}
				}
			}
		}
	}
	return false;
}

const inBounds = (direction) => {
	if (state[player].rect.x <= 0 && direction == 'left') return false;
	if (state[player].rect.x >= 600 - state[player].rect.h && direction == 'right') return false;
	if (state[player].rect.y <= 0 && direction == 'up') return false;
	if (state[player].rect.y >= 400 - state[player].rect.h && direction == 'down') return false;
	return true;
}