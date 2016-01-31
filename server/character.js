'use strict';

module.exports = function Character(io, config, game, socket, playerNum) {
    var self = this;

    this.id = socket.id;
    this.playerNum = playerNum;
    this.health = config.maxHealth;

    this.getId = function getId() {
        return self.id;
    };

    this.getPlayerNum = function getPlayerNum() {
        return self.playerNum;
    };

    this.getHealth = function getHealth() {
        return self.health;
    };

    this.heal = function heal(health) {
        self.health += health;

        if (self.health > config.maxHealth) {
            self.health = config.maxHealth;
        }

        io.to(game.getId()).emit('player health changed', self.playerNum, self.health);
    };

    this.hit = function hit(waveIndex, bananaIndex, x, y) {
        var turn = game.turns[game.turns.length - 1],
            playerTurn,
            wave,
            banana,
            originalHealth = self.health;

        if (turn) {
            playerTurn = turn[self.playerNum - 1];

            if (playerTurn) {
                wave = playerTurn[waveIndex];

                if (wave) {
                    banana = wave[bananaIndex];

                    if (banana) {
                        switch (banana.type) {
                            default:
                                self.health -= 1;
                                break;
                        }

                        if (self.health !== originalHealth) {
                            if (self.health <= 0) {
                                self.health = 0;
                                game.end(self.playerNum);
                            }

                            io.to(game.getId()).emit('player health changed', self.playerNum, self.health);
                        }

                        banana.hit_x = x;
                        banana.hit_y = y;
                    }
                }
            }
        }
    };

    this.toSendable = function toSendable() {
        return {
            id        : self.id,
            playerNum : self.playerNum,
            health    : self.health
        };
    };
};
