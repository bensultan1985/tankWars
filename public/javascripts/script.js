let x = 0;
let y = 0;
let player = "";
let p = "";
let state = {};
let count = 0;
let players = [];
limitTime = false;
let init = true;
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
    players = await getPlayers();
  }
  players = await getPlayers();
  console.log(state.players)
  setupRect();
  postMove(false)
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
    // console.log(data, 'game')
    state = data})
}


async function getUuid() {
  const uuid = await fetch('/getuuid')
  .then(response => {
    return response.json()
  })
  .then(data => {
    // console.log('testing')
    player = data.id
    p = data.id == data.p1? data.p1 : data.p2;
    otherPlayer = data.id == data.p1? data.p2 : data.p1;
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
})

window.addEventListener('keyup', (e) => {
    if (e.key == " ") state[player].cPress.space = false
    if (e.key == "ArrowUp") state[player].cPress.up = false
    if (e.key == "ArrowDown") state[player].cPress.down = false
    if (e.key == "ArrowLeft") state[player].cPress.left = false
    if (e.key == "ArrowRight") state[player].cPress.right = false
})

    function drawRect(rectObj, ctxObj) {
        // ctxObj.beginPath();
        ctxObj.fillStyle = rectObj.color,rectObj.padding, rectObj.visible;
        ctxObj.fillRect(rectObj.x, rectObj.y, rectObj.w, rectObj.h)
        console.log(rectObj.x, '1', rectObj.y, '2', rectObj.w, '3', rectObj.h, '4')
        // ctxObj.closePath();
      }
      
      function drawCanvas(rectArr) {
        rectArr.forEach(rect => rect.clearRect(0, 0, canvas.width, canvas.height));
      }

      function drawBall(ball) {
        // console.log(ball)

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
        console.log('updating...')
        console.log(state)
        if (!init) {
          await getState()
        } else {
          console.log(player)
          state.players.forEach(p => {
            if (p != player) return otherPlayer = p
            return
          })
        }
        console.log(player, otherPlayer, state[otherPlayer].rect)

        init = false;
        if (state[player].cPress.down) state[player].rect.y = state[player].rect.y + 5
        if (state[player].cPress.up) state[player].rect.y = state[player].rect.y - 5
        if (state[player].cPress.left) state[player].rect.x = state[player].rect.x - 5
        if (state[player].cPress.right) state[player].rect.x = state[player].rect.x + 5
        drawCanvas([ctx])
        drawRect(state[player].rect, ctx)
        drawRect(state[otherPlayer].rect, ctx)
        console.log(player, otherPlayer)
        // console.log('2', otherPlayer, state[otherPlayer])
        // if (otherPlayer) drawRect(state[otherPlayer].rect)

        count++
        // if (count < 20)

    // if(time-lastFrameTime < FRAME_MIN_TIME && limitTime){
     let post = await postMove(true);
        // requestAnimationFrame(update);
        // return;
    // }
    lastFrameTime = time;
// console.log(state)
      // requestAnimationFrame(update);
      };

function postMove(reload) {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/postmove");
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = async() => {
    state= await JSON.parse(xhr.responseText)
    if (reload) requestAnimationFrame(update);
  };
  let data = JSON.stringify({player: player, rect: state[player].rect, gameId: state.id, game: state});
  xhr.send(data);
}

function setupRect() {
  if (state.p1 == player) {
  state[player].rect = {
    w: 20,
    h: 20,
    padding: 30,
    offsetx: 45,
    offsety: 60,
    visible: true,
    color: "#F7B02B",
    x: 45,
    y: 200,
    dx: 0,
    dy: 0,
  }
  } else {
  state[player].rect = {
    w: 20,
    h: 20,
    padding: 30,
    offsetx: 45,
    offsety: 60,
    visible: true,
    color: "#000000",
    x: 545,
    y: 200,
    dx: 0,
    dy: 0,
  }
  }
}