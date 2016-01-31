/// <reference path="../../../typings/tsd.d.ts" />
'use strict';

namespace Generic {
    export class Minion extends Phaser.Sprite {
        state: Phaser.State;

        constructor(
            state: Phaser.State, waveIndex, bananaIndex: number, x: number, y: number, player_x: number, player_y
        ) {
            super(state.game, x - 50, y - 20, 'sprites', 'Monkey_Minion/Front/Monkey_Minion_1Y');

            var self = this;

            this.state = state;
            this.anchor.setTo(0.5);
            this.game.physics.arcade.enable(this);
            this.body.allowRotation = false;

            setTimeout(function() {
                state.game.add.existing(
                    new Generic.Banana(state, waveIndex, bananaIndex, x, y, player_x, player_y)
                );
            }, bananaIndex * 100);

            setTimeout(function() {
                self.kill();
            }, 3000);
        }
    }
}
