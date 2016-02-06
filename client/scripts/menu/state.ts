/// <reference path="../../../typings/tsd.d.ts" />
'use strict';

namespace Menu {
    export class State extends Phaser.State {
        title: Phaser.Text;
        start: Phaser.Text;
        howToPlay: Phaser.Text;
        background: Phaser.Sprite;
        monkeyFace: Phaser.Sprite;
        banana1L: Phaser.Sprite;
        banana2L: Phaser.Sprite;
        banana3L: Phaser.Sprite;
        banana1R: Phaser.Sprite;
        banana2R: Phaser.Sprite;
        banana3R: Phaser.Sprite;

        create() {
            this.background = this.game.add.sprite(0, 0, 'backdrop');

            this.title = this.game.add.text(
                this.game.world.centerX,
                this.game.world.centerY + 150,
                'Monkey Wizard\n - Simian Sorcery -',
                Generic.Fonts.bigFontStyle
            );

            this.title.anchor.setTo(0.5);

            this.start = this.game.add.text(
                this.game.world.centerX, this.game.world.centerY + 240, 'Start', Generic.Fonts.bigFontStyle
            );

            this.start.anchor.setTo(0.5);
            this.start.inputEnabled = true;

            this.start.events.onInputDown.add(function() {
                this.background.kill();
                this.title.kill();
                this.start.kill();
                this.howToPlay.kill();
                this.monkeyFace.kill();
                this.banana1L.kill();
                this.banana2L.kill();
                this.banana3L.kill();
                this.banana1R.kill();
                this.banana2R.kill();
                this.banana3R.kill();
                this.game.state.start('Game');
            }, this);

            this.howToPlay = this.game.add.text(
                this.game.world.centerX, this.game.world.centerY + 300, 'How To Play', Generic.Fonts.bigFontStyle
            );

            this.howToPlay.anchor.setTo(0.5);
            this.howToPlay.inputEnabled = true;

            this.howToPlay.events.onInputDown.add(function() {
                window.open('https://github.com/BrandonE/monkeywizard/blob/master/README.md');
            }, this);

            this.monkeyFace = this.game.add.sprite(
                this.game.world.centerX, this.game.world.centerY - 150, 'sprites', 'Monkey_Wizard/Monkey_Wizard_1'
            );

            this.monkeyFace.anchor.setTo(0.5);
            this.monkeyFace.scale.setTo(1);

            this.banana1L = this.game.add.sprite(
                this.game.world.centerX - 200, this.game.world.centerY - 200, 'sprites', 'Banana/Banana4'
            );

            this.banana1L.anchor.setTo(0.5);

            this.banana2L = this.game.add.sprite(
                this.game.world.centerX - 200, this.game.world.centerY, 'sprites', 'Banana/Banana1'
            );

            this.banana2L.anchor.setTo(0.5);

            this.banana3L = this.game.add.sprite(
                this.game.world.centerX - 200, this.game.world.centerY + 200, 'sprites', 'Banana/Banana3'
            );

            this.banana3L.anchor.setTo(0.5);

            this.banana1R = this.game.add.sprite(
                this.game.world.centerX + 180, this.game.world.centerY - 200, 'sprites', 'Banana/Banana4'
            );

            this.banana1R.anchor.setTo(0.5);

            this.banana2R = this.game.add.sprite(
                this.game.world.centerX + 180, this.game.world.centerY, 'sprites', 'Banana/Banana1'
            );

            this.banana2R.anchor.setTo(0.5);

            this.banana3R = this.game.add.sprite(
                this.game.world.centerX + 180, this.game.world.centerY + 200, 'sprites', 'Banana/Banana3'
            );

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
