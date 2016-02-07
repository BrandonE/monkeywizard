/// <reference path="../../../typings/tsd.d.ts" />
'use strict';

namespace Generic {
    export class Minion extends Phaser.Sprite {
        killed: boolean = false;

        constructor(
            state: Phaser.State, waveIndex, bananaIndex: number, x: number, y: number, player_x: number, player_y
        ) {
            super(
                state.game,
                x - 50,
                y - 20,
                'sprites',
                'Monkey_Minion/' + ((y > state.game.height / 2) ? 'Back' : 'Front') +
                    '/Monkey_Minion_1Y'
            );

            var self = this;

            this.anchor.setTo(0.5);
            this.game.physics.arcade.enable(this);
            this.body.allowRotation = false;

            setTimeout(function() {
                if (!self.killed && self.game.state.states.Game.id) {
                    self.game.state.states.Game.bananas.push(
                        self.game.state.states.Game.game.add.existing(
                            new Generic.Banana(state, waveIndex, bananaIndex, x, y, player_x, player_y)
                        )
                    );
                }
            }, bananaIndex * 100);

            setTimeout(function() {
                self.kill();
            }, 5000);
        }
    }
}
