/// <reference path="../../../typings/tsd.d.ts" />
'use strict';

namespace End {
    export class State extends Phaser.State {
        message: string;
        turns;

        create() {
        		var background = this.add.image(0, 0, 'sprites', 'Aztec Temple/Aztec-Temple');
            background.height = this.game.height;
            background.width = this.game.width;

            this.add.text(500, 360, this.message, {});
        }
    }
}
