/// <reference path="../../../typings/tsd.d.ts" />
'use strict';

namespace Game {
    export class State extends Phaser.State {
        player: Player;
        pointer: Phaser.Pointer;
        waves: { player_x: number, player_y: number, pointer_x: number, pointer_y: number }[][] = [[]];
        attacking: boolean = true;
        banana: number = 0;
        maxBanana: number = 30;
        io: SocketIOClientStatic;
        socket: SocketIOClient.Socket = io.connect();

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
            var angle: { degrees: number, degreesCounterClockwise: number, radians: number },
                destinationX: number,
                destinationY: number,
                graphics: Phaser.Graphics;

            if (this.banana < this.maxBanana) {
                angle = this.getAngle(this.player.x, this.player.y, this.pointer.x, this.pointer.y);

                this.waves[0].push({
                    player_x: this.player.x,
                    player_y: this.player.y,
                    pointer_x: this.pointer.x,
                    pointer_y: this.pointer.y
                });

                this.banana++;

                graphics = this.add.graphics(100, 100);
                graphics.beginFill(0xFF3300);
                graphics.lineStyle(5, 0xffd900, 1);

                destinationX = this.player.x + (50 * Math.cos(angle.radians)) - 100;
                destinationY = this.player.y + (50 * Math.sin(angle.radians)) - 100;

                graphics.moveTo(this.player.x - 100, this.player.y - 100);
                graphics.lineTo(destinationX, destinationY);

                graphics.moveTo(destinationX, destinationY);
                graphics.lineTo(
                    this.player.x + (10 * Math.cos(angle.radians + 45)) - 100,
                    this.player.y + (10 * Math.sin(angle.radians + 45)) - 100
                );

                graphics.moveTo(destinationX, destinationY);
                graphics.lineTo(
                    this.player.x + (10 * Math.cos(angle.radians - 45)) - 100,
                    this.player.y + (10 * Math.sin(angle.radians - 45)) - 100
                );

                graphics.moveTo(this.player.x - 100, this.player.y - 100);
                graphics.lineTo(
                    this.player.x + (50 * Math.cos(angle.radians + Math.PI)) - 100,
                    this.player.y + (50 * Math.sin(angle.radians + Math.PI)) - 100
                );

                this.add.text(this.player.x - 10, this.player.y, this.banana.toString(), {});
            }
        }

        defend(waves: { player_x: number, player_y: number, pointer_x: number, pointer_y: number }[][]) {
            console.log('Defend');

            var wave: { player_x: number, player_y: number, pointer_x: number, pointer_y: number }[],
                banana: { player_x: number, player_y: number, pointer_x: number, pointer_y: number },
                w: number,
                b: number;

            for (w = 0; w < waves.length; w++) {
                wave = waves[w];

                for (b = 0; b < wave.length; b++) {
                    banana = wave[b];
                    this.addMinion(banana, b);
                }
            }
        }

        getAngle(x1: number, y1: number, x2: number, y2: number) {
            var playerPoint: Phaser.Point = new Phaser.Point(x1, y1),
                mousePoint: Phaser.Point = new Phaser.Point(x2, y2),
                angleDegrees: number = playerPoint.angle(mousePoint, true),
                angleRadians: number = playerPoint.angle(mousePoint),
                angleDegreesCounterClockwise: number;

            if (angleDegrees >= 0) {
                angleDegreesCounterClockwise = 360 - angleDegrees;
            } else {
                angleDegreesCounterClockwise = -angleDegrees;
            }

            return {
                degrees: angleDegrees,
                degreesCounterClockwise: angleDegreesCounterClockwise,
                radians: angleRadians
            };
        }

        addMinion(
            banana: { player_x: number, player_y: number, pointer_x: number, pointer_y: number }, index: number
        ) {
            var angle: { degrees: number, degreesCounterClockwise: number, radians: number },
                x: number,
                y: number;

            angle = this.getAngle(banana.player_x, banana.player_y, banana.pointer_x, banana.pointer_y);

            if (angle.degreesCounterClockwise >= 45 && angle.degreesCounterClockwise < 135) {
                x = this.player.x +
                    (((this.player.x * 2) * Math.cos(angle.radians)) / (2 * Math.sin(angle.radians)));
                y = this.game.height - 40;
            }

            if (angle.degreesCounterClockwise >= 135 && angle.degreesCounterClockwise < 225) {
                x = this.game.width - 40;
                y = this.player.y +
                    (((this.player.y * 2) * Math.sin(angle.radians)) / (2 * Math.cos(angle.radians)));
            }

            if (angle.degreesCounterClockwise >= 225 && angle.degreesCounterClockwise < 315) {
                x = (this.game.width - this.player.x) +
                    (((this.player.x * 2) * Math.cos(angle.radians)) / (2 * Math.sin(angle.radians)));
                y = 0;
                x = this.game.width - x;
            }

            if (angle.degreesCounterClockwise >= 315 || angle.degreesCounterClockwise < 45) {
                x = 0;
                y = (this.game.height - this.player.y) +
                    (((this.player.y * 2) * Math.sin(angle.radians)) / (2 * Math.cos(angle.radians)));
                y = this.game.height - y;
            }

            if (x > this.game.width - 40) {
                x = this.game.width - 40;
            }

            if (y > this.game.height - 40) {
                y = this.game.height - 40;
            }

            this.add.text(
                x,
                y,
                'M' + (index + 1).toString(),
                {}
            );
        }
    }

    export class Player extends Generic.Cursor {
        constructor(state: State) {
            super(state);
        }
    }
}
