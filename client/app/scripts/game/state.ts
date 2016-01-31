/// <reference path="../../../typings/tsd.d.ts" />
'use strict';

namespace Game {
    export class State extends Phaser.State {
        player: Player;
        pointer: Phaser.Pointer;
        waves: Object[][] = [[]];
        attacking: boolean = true;
        banana: number = 0;
        maxBanana: number = 30;

        create() {
            var self = this;

            this.attacking = true;
            console.log('Attack');

            this.player = this.add.existing(new Player(this));
            this.pointer = this.game.input.activePointer;

            this.game.input.onDown.add(function() {
                if (this.attacking) {
                    this.attack();
                }
            }, this);

            setTimeout(function() {
                self.attacking = false;
                self.defend(self.waves);
            }, 10000);

        }

        attack() {
            var playerPoint: Phaser.Point,
                mousePoint: Phaser.Point,
                x: number,
                y: number,
                angleDegrees: number,
                angleRadians: number,
                angleDegreesCounterClockwise: number,
                destinationX: number,
                destinationY: number,
                graphics: Phaser.Graphics;

            if (this.banana < this.maxBanana) {
                playerPoint = new Phaser.Point(this.player.x, this.player.y);
                mousePoint = new Phaser.Point(this.pointer.x, this.pointer.y);
                angleDegrees = playerPoint.angle(mousePoint, true);
                angleRadians = playerPoint.angle(mousePoint);

                if (angleDegrees >= 0) {
                    angleDegreesCounterClockwise = 360 - angleDegrees;
                } else {
                    angleDegreesCounterClockwise = -angleDegrees;
                }

                this.waves[0].push({
                    angle: angleDegrees,
                    x: this.player.x,
                    y: this.player.y
                });

                this.banana++;

                graphics = this.add.graphics(100, 100);
                graphics.beginFill(0xFF3300);
                graphics.lineStyle(5, 0xffd900, 1);

                destinationX = this.player.x + (50 * Math.cos(angleRadians)) - 100;
                destinationY = this.player.y + (50 * Math.sin(angleRadians)) - 100;

                graphics.moveTo(this.player.x - 100, this.player.y - 100);
                graphics.lineTo(destinationX, destinationY);

                graphics.moveTo(destinationX, destinationY);
                graphics.lineTo(
                    this.player.x + (10 * Math.cos(angleRadians + 45)) - 100,
                    this.player.y + (10 * Math.sin(angleRadians + 45)) - 100
                );

                graphics.moveTo(destinationX, destinationY);
                graphics.lineTo(
                    this.player.x + (10 * Math.cos(angleRadians - 45)) - 100,
                    this.player.y + (10 * Math.sin(angleRadians - 45)) - 100
                );

                graphics.moveTo(this.player.x - 100, this.player.y - 100);
                graphics.lineTo(
                    this.player.x + (50 * Math.cos(angleRadians + Math.PI)) - 100,
                    this.player.y + (50 * Math.sin(angleRadians + Math.PI)) - 100
                );

                this.add.text(this.player.x - 10, this.player.y, this.banana.toString(), {});

                if (angleDegreesCounterClockwise >= 45 && angleDegreesCounterClockwise < 135) {
                    x = this.player.x +
                        (((this.player.x * 2) * Math.cos(angleRadians)) / (2 * Math.sin(angleRadians)));
                    y = this.game.height - 40;
                }

                if (angleDegreesCounterClockwise >= 135 && angleDegreesCounterClockwise < 225) {
                    x = this.game.width - 40;
                    y = this.player.y +
                        (((this.player.y * 2) * Math.sin(angleRadians)) / (2 * Math.cos(angleRadians)));
                }

                if (angleDegreesCounterClockwise >= 225 && angleDegreesCounterClockwise < 315) {
                    x = (this.game.width - this.player.x) +
                        (((this.player.x * 2) * Math.cos(angleRadians)) / (2 * Math.sin(angleRadians)));
                    y = 0;
                    x = this.game.width - x;
                }

                if (angleDegreesCounterClockwise >= 315 || angleDegreesCounterClockwise < 45) {
                    x = 0;
                    y = (this.game.height - this.player.y) +
                        (((this.player.y * 2) * Math.sin(angleRadians)) / (2 * Math.cos(angleRadians)));
                    y = this.game.height - y;
                }

                if (x > this.game.width - 40) {
                    x = this.game.width - 40;
                }

                if (y > this.game.height - 40) {
                    y = this.game.height - 40;
                }

                // Minion
                this.add.text(
                    x,
                    y,
                    'M',
                    {}
                );
            }
        }

        defend(waves: Object[][]) {
            console.log('Defend');
        }
    }

    export class Player extends Generic.Cursor {
        constructor(state: State) {
            super(state);
        }
    }
}
