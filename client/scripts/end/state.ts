/// <reference path="../../../typings/tsd.d.ts" />
'use strict';

namespace End {
    export class State extends Phaser.State {
        clientPlayerNum: number;
        winningPlayerNum: number;
        fanfare: Phaser.Sound;
        background: Phaser.Image;
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

                this.game.state.states.Game.theme.pause();
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

            this.results = this.add.text(
                this.world.centerX, this.world.centerY - 100, message, Generic.Fonts.biggerFontStyle
            );

            this.results.anchor.set(0.5);

            this.playAgain = this.add.text(
                this.world.centerX, this.world.centerY + 100, 'Play Again', Generic.Fonts.biggerFontStyle
            );

            this.playAgain.anchor.set(0.5);
            this.playAgain.inputEnabled = true;

            this.playAgain.events.onInputDown.add(function() {
                if (self.fanfare) {
                    self.fanfare.pause();
                }

                self.killAssets();
                self.game.state.start('Game');
            }, this);

            this.menu = this.add.text(
                this.world.centerX, this.world.centerY + 180, 'Back to Menu', Generic.Fonts.biggerFontStyle
            );

            this.menu.anchor.set(0.5);
            this.menu.inputEnabled = true;

            this.menu.events.onInputDown.add(function() {
                if (self.game.state.states.Game) {
                    self.game.state.states.Game.theme.pause();
                    self.game.state.states.Game.theme = null;
                }

                if (self.fanfare) {
                    self.fanfare.pause();
                }

                self.killAssets();
                self.game.state.start('Menu');
            }, this);
        }

        killAssets() {
            this.background.kill();
            this.results.kill();
            this.playAgain.kill();
            this.menu.kill();
        }
    }
}
