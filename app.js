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
            this.life = 3,
            this.rect = {}
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

    } else {
        gameId = currentGame[0]
        games[currentGame[0]].p2 = id;
        games[currentGame[0]][id] = 
        games[currentGame[0]].start = true;
        games[gameId][id] = new player()
        games[gameId].players.push(id)
        currentGame = [];
    }
    res.status(200).send({id:id, game:games[gameId]});
  });

  app.post('/postmove', function(req, res) {
    let gameId = req.body.gameId
    let game = req.body.game
    games[gameId][req.body.player].rect = req.body.rect;
    console.log(games[gameId])
    res.status(200).send(game)
  })

  app.get('/getplayers', function(req, res) {
    console.log(req.query.id, 'this is ID')
    console.log(games[req.query.id].players.length)
    res.status(200).send(games[req.query.id].players)
  })

  app.get('/getstate', function(req, res) {
    console.log(req.query.id, 'this is ID')
    console.log(games[req.query.id].players.length)
    res.status(200).send(games[req.query.id])
  })

  app.get('/getdata:id', function(req, res, next) {
    let id = req.params.get("gameId"); // "foo"
    console.log('IDDD', id)
    let gameId = req.params.gameId
    // let id = req.params.id
    console.log(games[gameId])
    res.status(200).send({id:id, game:games[gameId]});
    });

module.exports = app;
