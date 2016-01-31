/// <reference path="../../../typings/tsd.d.ts" />
'use strict';

namespace Generic {
    export class Banana extends Phaser.Sprite {
        state: Phaser.State;

        constructor(state: Phaser.State, x: number, y: number, player_x: number, player_y) {
            var point: Phaser.Point = new Phaser.Point(x, y),
                playerPoint: Phaser.Point = new Phaser.Point(player_x, player_y),
                angleDegrees: number = point.angle(playerPoint, true);

            super(state.game, x, y, 'sprites', 'Banana/Banana1');
            this.state = state;
            this.anchor.setTo(0.5);
            this.game.physics.arcade.enable(this);
            this.body.allowRotation = true;
            this.body.velocity = this.game.physics.arcade.velocityFromAngle(angleDegrees, 500);
        }

        update() {
            if (this.checkOverlap(this, this.state.player)) {
                delete this.kill();
            }
        }

        checkOverlap(spriteA, spriteB) {
            var boundsA = spriteA.getBounds();
            var boundsB = spriteB.getBounds();

            return Phaser.Rectangle.intersects(boundsA, boundsB);
        }
    }
}
