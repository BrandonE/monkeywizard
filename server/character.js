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

    this.takeDamage = function takeDamage(damage) {
        self.health -= damage;

        if (self.health < 0) {
            self.health = 0;
        }

        io.to(game.getId()).emit('player health changed', self.playerNum, self.health);
    };

    this.toSendable = function toSendable() {
        return {
            id        : self.id,
            playerNum : self.playerNum,
            health    : self.health
        };
    };
};
