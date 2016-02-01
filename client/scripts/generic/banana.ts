/// <reference path="../../../typings/tsd.d.ts" />
'use strict';

namespace Generic {
    export class Banana extends Phaser.Sprite {
        state: Phaser.State;
        killed: boolean = false;
        waveIndex: number;
        bananaIndex: number;

        constructor(
            state: Phaser.State, waveIndex, bananaIndex: number, x: number, y: number, player_x: number, player_y
        ) {
            super(state.game, x, y, 'sprites', 'Banana/Banana1');

            var self = this,
                point: Phaser.Point = new Phaser.Point(x, y),
                playerPoint: Phaser.Point = new Phaser.Point(player_x, player_y),
                angleDegrees: number = point.angle(playerPoint, true);

            this.state = state;
            this.waveIndex = waveIndex;
            this.bananaIndex = bananaIndex;
            this.anchor.setTo(0.5);
            this.game.physics.arcade.enable(this);
            this.body.allowRotation = true;
            this.body.velocity = this.game.physics.arcade.velocityFromAngle(angleDegrees, 500);

            setTimeout(function() {
                self.kill();
            }, 5000 - (self.bananaIndex * 100));
        }

        update() {
            this.angle += 5;

            if (!this.killed && this.state.id && this.checkOverlap(this, this.state.player)) {
                this.killed = true;

                this.state.socket.emit(
                    'player hit', this.waveIndex, this.bananaIndex, this.state.player.x, this.state.player.y
                );

                this.kill();
            }
        }

        checkOverlap(spriteA, spriteB) {
            var boundsA = spriteA.getBounds();
            var boundsB = spriteB.getBounds();

            return Phaser.Rectangle.intersects(boundsA, boundsB);
        }
    }
}
