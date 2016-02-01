/// <reference path="../../../typings/tsd.d.ts" />
'use strict';

namespace Menu {
    export class State extends Phaser.State {
        title: Phaser.Text;
        start: Phaser.Text;
        howToPlayer: Phaser.Text;
        monkeyFace: Phaser.Sprite;
        banana1L: Phaser.Sprite;
        banana2L: Phaser.Sprite;
        banana3L: Phaser.Sprite;
        banana1R: Phaser.Sprite;
        banana2R: Phaser.Sprite;
        banana3R: Phaser.Sprite;

        create() {
            console.log('Menu Loaded');
            this.game.add.sprite(0, 0, 'backdrop');

            this.title = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 150, 'Monkey Wizard\n - Simian Sorcery -', { font: "35px Arial", fill: "#ffff00", align: "center" });
            this.title.anchor.setTo(0.5);

            this.start = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 240, 'Start', { font: "35px Arial", fill: "#ffff00", align: "center" });
            this.start.anchor.setTo(0.5);
            this.start.inputEnabled = true;

            this.start.events.onInputDown.add(function() {
                this.game.state.start('Game');
            }, this);

            this.howToPlayer = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 300, 'How To Play', { font: "35px Arial", fill: "#ffff00", align: "center" });
            this.howToPlayer.anchor.setTo(0.5);
            this.howToPlayer.inputEnabled = true;

            this.howToPlayer.events.onInputDown.add(function() {
                window.open('https://github.com/BrandonE/monkeywizard/blob/master/README.md');
            }, this);

            this.monkeyFace = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY - 150, 'sprites', 'Monkey_Wizard/Monkey_Wizard_1');
            this.monkeyFace.anchor.setTo(0.5);
            this.monkeyFace.scale.setTo(1);

            this.banana1L = this.game.add.sprite(this.game.world.centerX -200, this.game.world.centerY - 200, 'sprites', 'Banana/Banana4');
            this.banana1L.anchor.setTo(0.5);

            this.banana2L = this.game.add.sprite(this.game.world.centerX -200, this.game.world.centerY, 'sprites', 'Banana/Banana1');
            this.banana2L.anchor.setTo(0.5);

            this.banana3L = this.game.add.sprite(this.game.world.centerX -200, this.game.world.centerY + 200, 'sprites', 'Banana/Banana3');
            this.banana3L.anchor.setTo(0.5);

            this.banana1R = this.game.add.sprite(this.game.world.centerX +180, this.game.world.centerY - 200, 'sprites', 'Banana/Banana4');
            this.banana1R.anchor.setTo(0.5);

            this.banana2R = this.game.add.sprite(this.game.world.centerX +180, this.game.world.centerY, 'sprites', 'Banana/Banana1');
            this.banana2R.anchor.setTo(0.5);

            this.banana3R = this.game.add.sprite(this.game.world.centerX +180, this.game.world.centerY + 200, 'sprites', 'Banana/Banana3');
            this.banana3R.anchor.setTo(0.5);
        }

        update() {
            this.banana1L.angle += 1;
            this.banana2L.angle += 2;
            this.banana3L.angle += 3;
            this.banana1R.angle -= 1;
            this.banana2R.angle -= 2;
            this.banana3R.angle -= 3;
        }
    }
}
