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
            var self = this;

            this.background = this.add.image(0, 0, 'sprites', 'Aztec Temple/Aztec-Temple');

            this.fanfare = this.sound.play('fanfare', 100);

            this.background.height = this.game.height;
            this.background.width = this.game.width;

            this.results = this.add.text(this.world.centerX, this.world.centerY - 100, this.message, { font: "60px Arial", fill: "#ffff00", align: "center" });
            this.results.anchor.set(0.5);

            this.playAgain = this.add.text(this.world.centerX, this.world.centerY + 100, "Play Again", { font: "65px Arial", fill: "#ffff00", align: "center" });
            this.playAgain.anchor.set(0.5);
            this.playAgain.inputEnabled = true;

            this.playAgain.events.onInputDown.add(function() {
                self.fanfare.pause();
                self.game.state.start('Game');
            }, this);

            this.menu = this.add.text(this.world.centerX, this.world.centerY + 180, "Back to Menu", { font: "65px Arial", fill: "#ffff00", align: "center" });
            this.menu.anchor.set(0.5);
            this.menu.inputEnabled = true;

            this.menu.events.onInputDown.add(function() {
                self.fanfare.pause();
                self.game.state.start('Menu');
            }, this);

        }
    }
}
