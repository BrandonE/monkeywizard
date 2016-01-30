'use strict';

var uuid = require('uuid'),
    Character = require(__dirname + '/character');

module.exports = function Game(io, config, games) {
    var self = this;

    this.id = uuid.v4();
    this.num = games.length + 1;
    this.players = [null, null];
    this.turns = [];
    this.nextTurn = [null, null];

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
            if (self.players[0] && self.players[1]) {
                self.destroy();
            }

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

    this.attack = function attack(attack, playerNum) {
        // Prepare to send the attack to the other player.
        if (playerNum === 1) {
            self.nextTurn[1] = attack
        } else {
            self.nextTurn[0] = attack;
        }

        if (self.nextTurn[0] && self.nextTurn[1]) {
            self.turns.push(self.nextTurn);
            io.to(self.id).emit('turn', self.nextTurn);

            self.nextTurn = [null, null];
        }
    };

    this.end = function end(losingPlayerNum) {
        io.to(self.id).emit('end', losingPlayerNum, self.turns);
        self.destroy();
    };

    this.destroy = function destroy() {
        games = games.splice(self.num - 1, 1);

        if (self.players[0]) {
            delete self.players[0];
        }

        if (self.players[1]) {
            delete self.players[1];
        }

        delete this;
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
            id      : self.id,
            players : playersToSend
        };
    };
};
