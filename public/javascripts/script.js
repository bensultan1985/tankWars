let x = 0;
let y = 0;
let player = "";
let p = "";
let state = {};
let count = 0;
let players = [];
let otherPlayer = '';
limitTime = false;
let init = true;
const solid = {
  cPress: {
    up: false,
    down: false,
    left: false,
    right: false
  }
}
let scoreboard = document.getElementById('scoreboard')
let playerHealthBoard = document.getElementById('playerHealth')
let otherPlayerHealthBoard = document.getElementById('otherPlayerHealth')
const FRAMES_PER_SECOND = 3;  // Valid values are 60,30,20,15,10...
// set the mim time to render the next frame
const FRAME_MIN_TIME = (1000/60) * (60 / FRAMES_PER_SECOND) - (1000/60) * 0.5;
var lastFrameTime = 0;  // the last frame time

var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
// var ctx2 = canvas.getContext("2d");


// ctx.fillStyle = "#2E4053";
// ctx.fillRect(x, y, 150, 75);

async function onLoad() {
  await getUuid();
  while (state.players.length < 2) {
    players = await getState();
  }
  players = await getPlayers();
  setupRect();
  let test = await postMove(false)
    update();
};

async function getPlayers() {
  const uuid = await fetch('/getplayers?id='+ state.id)
  .then(response => {
    return response.json()
  })
  .then(data => {
    state.players = data})
}

async function getState() {
  await fetch('/getstate?id='+ state.id)
  .then(response => {
    return response.json()
  })
  .then(data => {
    state = data})
}


async function getUuid() {
  const uuid = await fetch('/getuuid')
  .then(response => {
    return response.json()
  })
  .then(data => {
    player = data.id
    p = data.id == data.p1? data.p1 : data.p2;
  state = data.game});
  return
}

async function getData() {
  const data = await fetch(`/getData`+ new URLSearchParams({
    gameId: state.id,
    id: player
}))
  .then(response => {
    return response.json()
  })
  .then(data => {
    player = data.id
    p = data.id == data.p1? data.p1 : data.p2;
    otherPlayer = data.id == data.p1? data.p2 : data.p1;
  state = data.game});
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

    function drawRect(rectObj, ctxObj) {
        // ctxObj.beginPath();
        ctxObj.fillStyle = rectObj.color,rectObj.padding, rectObj.visible;
        ctxObj.fillRect(rectObj.x, rectObj.y, rectObj.w, rectObj.h)
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
          otherPlayer = state.players[0] == player? state.players[1] : state.players[0]
        }

        init = false;
        if (solid.cPress.down) state[player].rect.y = state[player].rect.y + 5
        if (solid.cPress.up) state[player].rect.y = state[player].rect.y - 5
        if (solid.cPress.left) state[player].rect.x = state[player].rect.x - 5
        if (solid.cPress.right) state[player].rect.x = state[player].rect.x + 5
        if (solid.cPress.space) {
          if (state[player].cannonTimer <= 0) {
            state[player].cannonBalls.push(new CannonBall(state[player].rect.x, state[player].rect.y, 3))
              state[player].cannonTimer = 26;
          }
        }
        if (playerHealthBoard.innerHTML != state[player].healthMeter) playerHealthBoard.innerHTML = state[player].healthMeter
        if (otherPlayerHealthBoard.innerHTML != state[otherPlayer].healthMeter) otherPlayerHealthBoard.innerHTML = state[otherPlayer].healthMeter

        drawCanvas([ctx])
        drawRect(state[player].rect, ctx)
        drawRect(state[otherPlayer].rect, ctx)
        if (state[player].cannonBalls.length > 30) {
          let extra = state[player].cannonBalls.length - 30;
          state[player].cannonBalls.splice(0, extra)
        }
        for (let i = 0; i < state[player].cannonBalls.length;i++) {
          let ball = state[player].cannonBalls[i]
          drawBall(ball)
          if (ball.player == player) moveBall(ball)
          // if (ball.x > 700) {
          // state.cannonBalls.splice(i,1)
      }
      for (let i = 0; i < state[otherPlayer].cannonBalls.length;i++) {
        let ball = state[otherPlayer].cannonBalls[i]
        drawBall(ball)
        if (ball.player == player) moveBall(ball)
        // if (ball.x > 700) {
        // state.cannonBalls.splice(i,1)
    }

        hitDetection();
        // console.log(state[otherPlayer].deleteBalls[0])
          // console.log(state[otherPlayer].cannonBalls)
          console.log(state)
          if (state[otherPlayer].deleteBalls[0] != undefined) {
            alert('test')
            state[player].cannonBalls.forEach(cannon => {
            console.log(state[otherPlayer].deleteBalls.indexOf(ball => ball == cannon))
          })
        }
        // if (state[otherPlayer].deleteBalls[0] != undefined) alert(state[otherPlayer].deleteBalls[0])
        // console.log(state[otherPlayer].deleteBalls)
     await postMove(true);
        // requestAnimationFrame(update);
      };

async function postMove(reload) {
  await fetch("/postmove", {
     
    // Adding method type
    method: "POST",
     
    // Adding body or contents to send
    body: JSON.stringify({player: player, otherPlayer: otherPlayer, rect: state[player].rect, gameId: state.id, game: state, cPress: state[player].cPress, cannonBalls: state[player].cannonBalls, cannonTimer: state[player].cannonTimer-1, healthMeter: state[player].healthMeter}),
     
    // Adding headers to the request
    headers: {
        "Content-type": "application/json; charset=UTF-8", "Accept": "application/json"
    }
})
 
// Converting to JSON
.then(response => response.json())
 
// Displaying results to console
.then(data => {
  state= data;
  if (reload) requestAnimationFrame(update);
});
}

function setupRect() {
  state[player].rect = {
    w: 20,
    h: 20,
    padding: 30,
    offsetx: 45,
    offsety: 60,
    visible: true,
    color: state.p1 == player? '#F7B02B' : "#000000",
    x: state.p1 == player? 45 : 545,
    y: state.p1 == player? 200 : 200,
    dx: 1,
    dy: 1,
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
  this.color = state.p1 == player? '#F7B02B' : "#120D85",
  this.x = state.p1 == player? rectx + state[player].rect.w : rectx,
  this.y = recty + Math.floor(state[player].rect.h/2),
  this.dx = state.p1 == player? dx : -dx,
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
  for (let i=0; i < state[otherPlayer].cannonBalls.length;i++) {
    let ball = state[otherPlayer].cannonBalls[i];
    let rect = state[player].rect;
    if (ball.x > rect.x && ball.x < rect.x+rect.w) {
      if (ball.y > rect.y && ball.y < rect.y + rect.h) {
        state[otherPlayer].deleteBalls.push(ball.id);
        state[player].healthMeter--
        return true;
      }
    }
  }
  return false;
}