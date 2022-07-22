var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var uuid = require('uuid')
const {
	WebSocketServer
} = require('ws');
const WebSocket = require('ws');

const wss = new WebSocketServer({
	port: process.env.PORT || 8080,
});
let clients = {

}

//   wss.getUniqueID = function () {
//     return uuid.v4();

// }
wss.on('connection', function connection(ws) {

	let gameId = uuid.v4();
	let id = uuid.v4();
	if (currentGame.length == 0) {
		games[gameId] = new game(id, '', gameId);
		currentGame[0] = gameId;
		games[gameId][id] = new player()
		games[gameId].players.push(id)
		games[gameId].dCannonBalls[id] = [];
	} else {
		gameId = currentGame[0]
		games[currentGame[0]].p2 = id;
		games[currentGame[0]][id] =
			games[currentGame[0]].start = true;
		games[gameId][id] = new player()
		games[gameId].players.push(id)
		currentGame = [];
		games[gameId].dCannonBalls[id] = [];
	}
	// ws.send('test')
	ws.send(JSON.stringify({
		id: id,
		game: games[gameId]
	}));


	ws.on('message', function message(e) {
		let data = JSON.parse(e.toString())
		if (data.call == 'getplayers') {
			ws.send(JSON.stringify({call: 'getplayers', body: {players: games[gameId].players, game: games[gameId]}}))
		}

		if (data.call == 'getuuid') {

			let gameId = uuid.v4();
			let id = uuid.v4();
            clients[id] = ws

			if (currentGame.length == 0) {
				games[gameId] = new game(id, '', gameId);
				currentGame[0] = gameId;
				games[gameId][id] = new player()
				games[gameId].players.push(id)
				games[gameId].dCannonBalls[id] = [];
                ws.send(JSON.stringify({call: 'getuuid', body: {
                    id: id,
                    game: games[gameId]
                    }}))			
                } else {
				gameId = currentGame[0]
				games[currentGame[0]].p2 = id;
				games[currentGame[0]][id] =
					games[currentGame[0]].start = true;
				games[gameId][id] = new player()
				games[gameId].players.push(id)
				currentGame = [];
				games[gameId].dCannonBalls[id] = [];


                // ws.send(JSON.stringify({call: 'getplayers', body: {players: games[gameId].players, game: games[gameId]}}))
                ws.send(JSON.stringify({call: 'getplayers', body: {players: games[gameId].players, game: games[gameId], p2:true, id: id} }))
                        
                clients[games[gameId].p1].send(JSON.stringify({call: 'getplayers', body: {players: games[gameId].players, game: games[gameId], p2:false}}))
			}
			ws.send(JSON.stringify({
                call: 'getuuid',
                body: {
				id: id,
				game: games[gameId]
                }
			}));
		}

		if (data.call == 'getstate') {

			ws.send(JSON.stringify({call: 'getstate', body: games[req.query.id]}))
		}

		if (data.call == 'postmove') {
            console.log(data.player)
			let gameId = data.gameId
			let game = data.game
			games[gameId][data.player].rect = data.rect;
			games[gameId][data.player].cPress = data.cPress;
			games[gameId][data.player].cannonBalls = data.cannonBalls;
			games[gameId][data.player].cannonTimer = data.cannonTimer;
			games[gameId][data.player].healthMeter = data.healthMeter;
			games[gameId][data.player].rect.color = data.playerColor;

			games[gameId].dCannonBalls[data.otherPlayer] = [];
			if (data.deleteBalls != undefined) {
				data.deleteBalls.forEach(ball => {
					if (ball != undefined || 0) games[gameId].dCannonBalls[data.otherPlayer].push(ball)

				})
				let myBalls = games[gameId][data.player].cannonBalls
				let myDeleteBalls = games[gameId].dCannonBalls[data.player]
				let newBalls = []
				if (games[gameId][data.otherPlayer]) {
					for (let i = 0; i < myDeleteBalls.length; i++) {
						myBalls.forEach(ball => {
							if (ball.id != myDeleteBalls[i]) newBalls.push(ball)

						})
						games[gameId][data.player].cannonBalls = newBalls;
					}
				}
			}
			clients[data.player].send(JSON.stringify({call: 'postmove', body: games[gameId]}))

		}
	});
});


// var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

class game {
	constructor(p1, p2, id) {
		this.p1 = p1 || '';
		this.p2 = p2 || '';
		this.id = id || '';
		this.start = false;
		this.players = [];
		this.dCannonBalls = {}
	}
}

class player {
	constructor() {
		this.cPress = {
				space: false,
				up: false,
				down: false,
				right: false
			},
			this.cannonTimer = 0;
		this.healthMeter = 3,
			this.rect = {},
			this.cannonBalls = [],
			this.deleteBalls = []
	}
}
let currentGame = [];
let games = {};

/* 
  app.get('/getdata:id', function(req, res, next) {
    let id = req.params.get("gameId"); // "foo"
    let gameId = req.params.gameId
    // let id = req.params.id
    res.status(200).send({id:id, game:games[gameId]});
    }); */

module.exports = {app, wss};