/// <reference path="../../../typings/tsd.d.ts" />
'use strict';

namespace End {
    export class State extends Phaser.State {
        message: string;
        fanfare: Phaser.Sound;
        turns;

        create() {
            var background = this.add.image(0, 0, 'sprites', 'Aztec Temple/Aztec-Temple');

            this.fanfare = this.sound.play('fanfare', 100);

            background.height = this.game.height;
            background.width = this.game.width;

            var text = this.add.text(this.world.centerX, this.world.centerY - 100, this.message, { font: "60px Arial", fill: "#ffff00", align: "center" });

            var backButton = this.add.text(this.world.centerX, this.world.centerY + 100, "Back to Menu", { font: "65px Arial", fill: "#ffff00", align: "center" });

            // text.tint = 0xff00033;

            text.anchor.set(0.5);
            backButton.anchor.set(0.5);

            backButton.inputEnabled = true;
            backButton.events.onInputDown.add(goBack, this);

            function goBack() {
                this.fanfare.kill();
                this.game.state.start('Menu');;
            }
        }
    }
}
