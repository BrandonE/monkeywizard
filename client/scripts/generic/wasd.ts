/// <reference path="../../../typings/tsd.d.ts" />
'use strict';

namespace Generic {
    export class WASD {
        up: Phaser.Key;
        down: Phaser.Key;
        left: Phaser.Key;
        right: Phaser.Key;

        constructor(game: Phaser.Game) {
            this.up = game.input.keyboard.addKey(Phaser.Keyboard.W);
            this.down = game.input.keyboard.addKey(Phaser.Keyboard.S);
            this.left = game.input.keyboard.addKey(Phaser.Keyboard.A);
            this.right = game.input.keyboard.addKey(Phaser.Keyboard.D);
        }
    }
}
