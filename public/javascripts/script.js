let x = 0;
let y = 0;
let cannonBalls = [];
let player = "";
let state = {};
let count = 0;
let rect = {};

var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
ctx.fillStyle = "#2E4053";
ctx.fillRect(x, y, 150, 75);

async function onLoad() {
  await getUuid();
  // console.log(state[player])
  setupRect();
  console.log(state)
  console.log(rect)
  rect = state[player].rect;
  drawRect(rect)

  update();
}

async function getUuid() {
  const uuid = await fetch('/getuuid')
  .then(response => {
    return response.json()

  })
  .then(data => {
    console.log(data.game)
    player = data.id
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

    class CannonBall {
        constructor(rectx, recty, dx) {
        this.w = 5,
        this.h = 5,
        this.padding = 30,
        this.offsetx = 45,
        this.offsety = 60,
        this.visible = true,
        this.color = "#120D85",
        this.x = rectx,
        this.y = recty,
        this.dx = dx,
        this.dy = 0
        }
    }

    function drawRect(rect) {
        ctx.beginPath();
        ctx.fillStyle = rect.color,rect.padding, rect.visible;
        ctx.fillRect(rect.x, rect.y, rect.w, rect.h)
        ctx.closePath();
      }
      
      function drawCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      function drawBall(ball) {
        // console.log(ball)

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
        ctx.closePath();
      }

      function moveBall(ball) {
        ball.x += ball.dx;
        // ball.y += ball.dy;
      };

      function update() {
        console.log(player)
        console.log(state)
        if (state[player].cannonTimer > 0) state[player].cannonTimer--
        if (state[player].cPress.down) rect.y = rect.y + 5
        if (state[player].cPress.up) rect.y = rect.y - 5
        if (state[player].cPress.left) rect.x = rect.x - 5
        if (state[player].cPress.right) rect.x = rect.x + 5
        if (state[player].cPress.space) {
            if (state[player].cannonTimer <= 0) {
                cannonBalls.push(new CannonBall(rect.x, rect.y, 2))
                state[player].cannonTimer = 26;
            }
        }
        drawCanvas()
        drawRect(rect)
        // console.log(rect)
        for (let i = 0; i < cannonBalls.length;i++) {
            // console.log('ball')
            // console.log(cannonBalls[i])
            let ball = cannonBalls[i]
            drawBall(ball)
            moveBall(ball)
            // console.log(ball.x)
            if (ball.x > 700) {
            cannonBalls.splice(i,1)
        }
        // console.log(cannonBalls)


        }
        // draw the canvas again
        // now you call update recursively in order to keep moving
        postData();
        count++
        if (count < 20)
      requestAnimationFrame(update);
      //
      };
      
      //uncomment the statement below to animate
    //   function drawBall(ball) {
    //     ctx.beginPath();
    //     ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    //     ctx.fillStyle = ball.color;
    //     ctx.fill();
    //     ctx.closePath();
    //   }

    function postData() {
      let xhr = new XMLHttpRequest();
xhr.open("POST", "/postdata");

xhr.setRequestHeader("Accept", "application/json");
xhr.setRequestHeader("Content-Type", "application/json");

// xhr.onload = () => console.log(xhr.responseText);

let data = JSON.stringify(state);

xhr.send(data);
    }

    function setupRect() {
      state[player].rect = {
        w: 20,
        h: 20,
        padding: 30,
        offsetx: 45,
        offsety: 60,
        visible: true,
        color: "#F7B02B",
        x: 0,
        y: 0,
        dx: 3,
        dy: -1,
      };
    }