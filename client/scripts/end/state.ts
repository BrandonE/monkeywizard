/// <reference path="../../../typings/tsd.d.ts" />
'use strict';

namespace End {
    export class State extends Phaser.State {
        message: string;
        background: Phaser.Sprite;
        fanfare: Phaser.Sound;
        results: Phaser.Text;
        playAgain: Phaser.Text;
        menu: Phaser.Text;
        turns;

        create() {
            var self = this,
                win = (this.clientPlayerNum === this.winningPlayerNum),
                message;

            if (win) {
                if (this.turns) {
                    message = 'You win!';
                } else {
                    message = 'Opponent disconnected';
                }

                this.theme.pause();
                this.game.state.states.Game.theme = null;
                this.fanfare = this.sound.play('fanfare', 0.5);
            } else {
                if (this.turns) {
                    message = 'You have been defeated';
                } else {
                    message = 'You have disconnected';
                }
            }

            this.background = this.add.image(0, 0, 'sprites', 'Aztec Temple/Aztec-Temple');

            this.background.height = this.game.height;
            this.background.width = this.game.width;

            this.results = this.add.text(this.world.centerX, this.world.centerY - 100, message, { font: "60px Arial", fill: "#ffff00", align: "center" });
            this.results.anchor.set(0.5);

            this.playAgain = this.add.text(this.world.centerX, this.world.centerY + 100, "Play Again", { font: "65px Arial", fill: "#ffff00", align: "center" });
            this.playAgain.anchor.set(0.5);
            this.playAgain.inputEnabled = true;

            this.playAgain.events.onInputDown.add(function() {
                if (self.fanfare) {
                    self.fanfare.pause();
                }

                self.background.kill();
                self.results.kill();
                self.playAgain.kill();
                self.menu.kill();
                self.game.state.start('Game');
            }, this);

            this.menu = this.add.text(this.world.centerX, this.world.centerY + 180, "Back to Menu", { font: "65px Arial", fill: "#ffff00", align: "center" });
            this.menu.anchor.set(0.5);
            this.menu.inputEnabled = true;

            this.menu.events.onInputDown.add(function() {
                if (self.theme) {
                    self.theme.pause();
                    this.game.state.states.Game.theme = null;
                }

                if (self.fanfare) {
                    self.fanfare.pause();
                }

                self.background.kill();
                self.results.kill();
                self.playAgain.kill();
                self.menu.kill();
                self.game.state.start('Menu');
            }, this);

        }
    }
}
