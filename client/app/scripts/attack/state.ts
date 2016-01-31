/// <reference path="../../../typings/tsd.d.ts" />
'use strict';

namespace Attack {
  export class State extends Phaser.State {
    player: Player;
    pointer: Phaser.Pointer;
    waves: number[][] = [[]];

    create() {
      var self = this,
        maxBanana = 30,
        banana = 0;

      console.log('Attack');

      this.player = this.add.existing(new Player(this));
      this.pointer = this.game.input.activePointer;

      this.game.input.onDown.add(function() {
        var playerPoint,
          mousePoint,
          angleDegrees,
          angleRadians,
          destinationX,
          destinationY,
          graphics;

        if (banana < maxBanana) {
          playerPoint = new Phaser.Point(this.player.x, this.player.y);
          mousePoint = new Phaser.Point(this.pointer.x, this.pointer.y);
          angleDegrees = playerPoint.angle(mousePoint, true);
          angleRadians = playerPoint.angle(mousePoint);

          this.waves[0].push({
            angle: angleDegrees,
            x: this.player.x,
            y: this.player.y
          });

          banana++;

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

          this.add.text(this.player.x - 10, this.player.y, banana);
        }
      }, this);
/*
      setTimeout(function() {
        console.log(self.waves);
        self.game.state.start('Defend');
      }, 10000);
      */
    }
  }

  export class Player extends Generic.Cursor {
    constructor(state: State) {
      super(state);
    }
  }
}
