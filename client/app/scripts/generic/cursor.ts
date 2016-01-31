/// <reference path="../../../typings/tsd.d.ts" />
'use strict';

namespace Generic {  
  export class Cursor extends Phaser.Sprite {
    state: Phaser.State;
    pointer: Phaser.Pointer;
    wasd: Generic.WASD;
    destination: Phaser.Point;
    isMoving: boolean;
    speed: number;
    keySpeed: number;

    constructor(state: Phaser.State) {
      var x = state.stage.width / 2,
          y = state.stage.height / 2;
      super(state.game, x, y, 'sprites', 'Monkey_Wizard/Monkey_Wizard');
      this.state = state;
      this.wasd = new Generic.WASD(state.game);
      this.speed = 850;
      this.keySpeed = this.speed / 60;
      this.pointer = this.game.input.activePointer;
      this.anchor.setTo(0.5);
      this.game.physics.arcade.enable(this);
      this.body.allowRotation = false;
    }

    update(): void {
      
      // Touch
      /*
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
      
      */
      // WASD
      if (this.wasd.left.isDown && this.x > 300) {
        this.x -= this.keySpeed;
      } else if (this.wasd.right.isDown && this.x < this.game.width - 300) {
        this.x += this.keySpeed;
      }

      if (this.wasd.up.isDown && this.y > 125) {
        this.y -= this.keySpeed;
      } else if (this.wasd.down.isDown && this.y < this.game.height - 125) {
        this.y += this.keySpeed;
      }
    }

    move(): void {
      
      // Touch
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
