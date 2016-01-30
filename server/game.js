'use strict';

var uuid = require('uuid'),
    Character = require(__dirname + '/character');

module.exports = function Game(io, config, num) {
    var self = this;

    this.id = uuid.v4();
    this.num = num;
    this.players = [null, null];

    this.getId = function getId() {
        return self.id;
    };

    this.getPlayerById = function getPlayerById(id) {
        var player,
            p;

        for (p = 0; p < self.players.length; p++) {
            player = self.players[p];

            if (player && player.getId() === id) {
                return player;
            }
        }

        return null;
    };

    this.isAvailable = function isAvailable() {
        return (!this.players[0] || !this.players[1]);
    };

    this.connect = function connect(socket) {
        var playerNum = 0,
            player;

        if (!self.players[0]) {
            playerNum = 1;
        } else if (!self.players[1]) {
            playerNum = 2;
        }

        if (playerNum) {
            player = new Character(io, config, self, socket, playerNum);
            self.players[playerNum - 1] = player;

            io.to(self.id).emit('user connected', playerNum, self.toSendable());
            console.log(self.connectionMessage(playerNum, socket.id));
        }
    };

    this.disconnect = function disconnect(id) {
        var player = self.getPlayerById(id),
            playerNum;

        if (player) {
            playerNum = player.getPlayerNum();
            delete self.players[playerNum - 1];

            io.to(self.id).emit('user disconnected', playerNum);
            console.log(self.connectionMessage(playerNum, id, true));
        }
    };

    this.connectionMessage = function connectionMessage(playerNum, id, disconnected) {
        var message;

        message = 'Player #' + playerNum + ' (' + id + ')';

        if (disconnected) {
            message += ' disconnected from';
        } else {
            message += ' connected to';
        }

        message += ' Game #' + self.num + ' (' + self.id + ')';

        return message;
    };

    this.toSendable = function toSendable() {
        var playersToSend = [],
            playerToSend,
            p;

        for (p = 0; p < self.players.length; p++) {
            playerToSend = self.players[p];

            if (playerToSend) {
                playerToSend = playerToSend.toSendable();
            }

            playersToSend.push(playerToSend);
        }

        return {
            players   : playersToSend
        };
    };
};
