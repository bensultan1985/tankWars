var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var uuid = require('uuid')


// var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

class game {
    constructor(p1, p2, id) {
    this.p1 = p1 || '';
    this.p2 = p2 || '';
    this.id = id || '';
    this.start = false;
    this.players = [];
    this.dCannonBalls = {
        }
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

app.get('/getuuid', function(req, res, next) {
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
    res.status(200).send({id:id, game:games[gameId]});
  });

  app.post('/postmove', function(req, res) {
    let gameId = req.body.gameId
    let game = req.body.game
    games[gameId][req.body.player].rect = req.body.rect;
    games[gameId][req.body.player].cPress = req.body.cPress;
    games[gameId][req.body.player].cannonBalls = req.body.cannonBalls;
    games[gameId][req.body.player].cannonTimer = req.body.cannonTimer;
    games[gameId][req.body.player].healthMeter = req.body.healthMeter;
    games[gameId][req.body.player].rect.color = req.body.playerColor;

    games[gameId].dCannonBalls[req.body.otherPlayer] = [];
    if (req.body.deleteBalls != undefined) {
    req.body.deleteBalls.forEach(ball => {
        if (ball != undefined || 0) games[gameId].dCannonBalls[req.body.otherPlayer].push(ball)

    })
    let myBalls = games[gameId][req.body.player].cannonBalls
    let myDeleteBalls = games[gameId].dCannonBalls[req.body.player]
    let newBalls = []
    if (games[gameId][req.body.otherPlayer]) {
        for (let i = 0; i < myDeleteBalls.length; i++) {
            myBalls.forEach(ball => {
                if (ball.id != myDeleteBalls[i]) newBalls.push(ball)

            })
            games[gameId][req.body.player].cannonBalls = newBalls;
        }
    }
}   
// games[gameId].dCannonBalls[req.body.otherPlayer] = [];
// games[gameId].dCannonBalls[req.body.player] = [];
    res.status(200).send(game)
  })

  app.get('/getplayers', function(req, res) {
    res.status(200).send(games[req.query.id].players)
  })

  app.get('/getstate', function(req, res) {
    res.status(200).send(games[req.query.id])
  })

  app.get('/getdata:id', function(req, res, next) {
    let id = req.params.get("gameId"); // "foo"
    let gameId = req.params.gameId
    // let id = req.params.id
    res.status(200).send({id:id, game:games[gameId]});
    });

module.exports = app;
