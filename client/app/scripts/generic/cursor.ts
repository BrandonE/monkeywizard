/// <reference path="../../../typings/tsd.d.ts" />
'use strict';

namespace Generic {
  export class Cursor extends Phaser.Sprite {
    state: Phaser.State;
    pointer: Phaser.Pointer;
    destination: Phaser.Point;
    isMoving: boolean;
    speed: number;

    constructor(state: Phaser.State) {
      var x = state.stage.width / 2,
          y = state.stage.height / 2;
      super(state.game, x, y, 'sprites', 'Monkey_Wizard/Monkey_Wizard');
      this.state = state;
      this.speed = 850;
      this.pointer = this.game.input.activePointer;
      this.anchor.setTo(0.5);
      this.game.physics.arcade.enable(this);
      this.body.allowRotation = false;
    }

    update(): void {
      var distance = Phaser.Point.distance(this, this.pointer);
      if (this.pointer.isDown && distance > 45) {
        this.destination = new Phaser.Point(this.pointer.x, this.pointer.y);
        this.isMoving = true;
      }
      if (this.isMoving) {
        this.move();
      } else {
        this.idle();
      }
    }

    move(): void {
      var distance = Phaser.Point.distance(this, this.destination, true);
      if (distance > 30) {
        this.game.physics.arcade.moveToXY(this, this.destination.x, this.destination.y, this.speed);
      } else {
        this.isMoving = false;
      }
    }

    idle(): void {
      this.body.velocity.setTo(0);
    }
  }
}
