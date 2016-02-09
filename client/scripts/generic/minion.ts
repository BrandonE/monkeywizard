/// <reference path="../../../typings/tsd.d.ts" />
'use strict';

namespace Generic {
    export class Minion extends Phaser.Sprite {
        waveIndex: number;
        bananaIndex: number;
        banana_x: number;
        banana_y: number;
        player_x: number;
        player_y: number;
        side: string;
        killed: boolean = false;

        constructor(
            state: Phaser.State, waveIndex: number, bananaIndex: number, banana_x: number, banana_y: number, player_x: number,
            player_y: number
        ) {
            super(state.game, null, null, 'sprites');

            if (banana_y <= player_y) {
                this.side = 'Front';
                this.x = banana_x - 45;
                this.y = banana_y - 25;
            } else {
                this.side = 'Back';
                this.x = banana_x + 50;
                this.y = banana_y + 25;
            }

            this.frameName = 'Monkey_Minion/' + this.side + '/Monkey_Minion_1Y';

            var self = this;

            this.waveIndex = waveIndex;
            this.bananaIndex = bananaIndex;
            this.banana_x = banana_x;
            this.banana_y = banana_y;
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

            this.frameName = 'Monkey_Minion/' + this.side + '/Monkey_Minion_2Y';

            setTimeout(function() {
                self.thirdFrame();
            }, 100);
        }

        thirdFrame() {
            this.frameName = 'Monkey_Minion/' + this.side + '/Monkey_Minion_3';

            if (!this.killed && this.game.state.states.Game.id) {
                this.game.state.states.Game.bananas.push(
                    this.game.state.states.Game.game.add.existing(
                        new Generic.Banana(
                            this.game.state.states.Game,
                            this.waveIndex,
                            this.bananaIndex,
                            this.banana_x,
                            this.banana_y,
                            this.player_x,
                            this.player_y
                        )
                    )
                );
            }
        }
    }
}
