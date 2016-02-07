/// <reference path="../../../typings/tsd.d.ts" />
'use strict';

namespace Generic {
    export class Banana extends Phaser.Sprite {
        killed: boolean;
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

        update(): void {
            this.angle += 5;

            if (
                !this.killed && this.game.state.states.Game.id &&
                    this.checkOverlap(this, this.game.state.states.Game.player)
            ) {
                if (this.game.state.states.Game.players[0] && this.game.state.states.Game.players[1]) {
                    this.game.state.states.Game.socket.emit(
                        'player hit',
                        this.waveIndex,
                        this.bananaIndex,
                        this.game.state.states.Game.player.x,
                        this.game.state.states.Game.player.y
                    );
                }

                this.kill();
                this.killed = true;
            }
        }

        checkOverlap(spriteA, spriteB): boolean {
            var boundsA: Phaser.Rectangle = spriteA.getBounds(),
                boundsB: Phaser.Rectangle = spriteB.getBounds();

            boundsB.width = boundsB.width / 2;
            boundsB.height = boundsB.height / 2;
            boundsB.x += boundsB.width / 2;
            boundsB.y += boundsB.height / 2;

            return Phaser.Rectangle.intersects(boundsA, boundsB);
        }
    }
}
