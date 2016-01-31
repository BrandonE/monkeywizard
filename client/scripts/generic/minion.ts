/// <reference path="../../../typings/tsd.d.ts" />
'use strict';

namespace Generic {
    export class Minion extends Phaser.Sprite {
        state: Phaser.State;

        constructor(state: Phaser.State, timeout: number, x: number, y: number, player_x: number, player_y) {
            super(state.game, x, y, 'sprites', 'Monkey_Minion/Monkey_Minion_fwd');
            this.state = state;
            this.anchor.setTo(0.5);
            this.game.physics.arcade.enable(this);
            this.body.allowRotation = false;

            setTimeout(function() {
                state.game.add.existing(
                    new Generic.Banana(state, x + 50, y + 20, player_x, player_y)
                );
            }, timeout);
        }
    }
}
