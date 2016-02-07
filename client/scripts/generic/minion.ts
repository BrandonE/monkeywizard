/// <reference path="../../../typings/tsd.d.ts" />
'use strict';

namespace Generic {
    export class Minion extends Phaser.Sprite {
        waveIndex: number;
        bananaIndex: number;
        x: number;
        y: number;
        player_x: number;
        player_y: number;
        killed: boolean = false;

        constructor(
            state: Phaser.State, waveIndex: number, bananaIndex: number, x: number, y: number, player_x: number,
            player_y: number
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

            this.waveIndex = waveIndex;
            this.bananaIndex = bananaIndex;
            this.x = x;
            this.y = y;
            this.player_x = player_x;
            this.player_y = player_y;

            this.anchor.setTo(0.5);
            this.game.physics.arcade.enable(this);
            this.body.allowRotation = false;

            setTimeout(function() {
                self.secondFrame();
            }, bananaIndex * 100);

            setTimeout(function() {
                self.kill();
            }, 5000);
        }

        secondFrame() {
            var self = this;

            this.frameName = 'Monkey_Minion/' + ((this.y > this.game.height / 2) ? 'Back' : 'Front') +
                '/Monkey_Minion_2Y';

            setTimeout(function() {
                self.thirdFrame();
            }, 100);
        }

        thirdFrame() {
            this.frameName = 'Monkey_Minion/' + ((this.y > this.game.height / 2) ? 'Back' : 'Front') +
                '/Monkey_Minion_3';

            if (!this.killed && this.game.state.states.Game.id) {
                this.game.state.states.Game.bananas.push(
                    this.game.state.states.Game.game.add.existing(
                        new Generic.Banana(
                            this.game.state.states.Game,
                            this.waveIndex,
                            this.bananaIndex,
                            this.x,
                            this.y,
                            this.player_x,
                            this.player_y
                        )
                    )
                );
            }
        }
    }
}
