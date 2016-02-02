/// <reference path="../../../typings/tsd.d.ts" />
'use strict';

namespace Generic {
    export class Minion extends Phaser.Sprite {
        state: Phaser.State;
        killed: boolean = false;

        constructor(
            state: Phaser.State, waveIndex, bananaIndex: number, x: number, y: number, player_x: number, player_y
        ) {
            var self = this,
                side = (y > state.game.height / 2) ? 'Back' : 'Front';

            super(state.game, x - 50, y - 20, 'sprites', 'Monkey_Minion/' + side + '/Monkey_Minion_1Y');

            this.state = state;
            this.anchor.setTo(0.5);
            this.game.physics.arcade.enable(this);
            this.body.allowRotation = false;

            setTimeout(function() {
                if (!self.killed && self.state.id) {
                    state.game.add.existing(
                        new Generic.Banana(state, waveIndex, bananaIndex, x, y, player_x, player_y)
                    );
                }
            }, bananaIndex * 100);

            setTimeout(function() {
                self.kill();
            }, 5000);
        }
    }
}
