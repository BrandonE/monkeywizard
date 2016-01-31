/// <reference path="../../../typings/tsd.d.ts" />
'use strict';

namespace Attack {
  export class State extends Phaser.State {
    player: Player;
    pointer: Phaser.Pointer;
    waves: number[][] = [[]];

    create() {
      var self = this;

      console.log('Attack');

      this.player = this.add.existing(new Player(this));
      this.pointer = this.game.input.activePointer;

      this.game.input.onDown.add(function() {
        var playerPoint,
          mousePoint,
          angle;

        playerPoint = new Phaser.Point(this.player.x, this.player.y);
        mousePoint = new Phaser.Point(this.pointer.x, this.pointer.y);
        angle = playerPoint.angle(mousePoint, true);

        this.waves[0].push({
          angle: angle,
          x: this.player.x,
          y: this.player.y
        });
      }, this);

      setTimeout(function() {
        console.log(self.waves);
        self.game.state.start('Defend');
      }, 10000);
    }
  }

  export class Player extends Generic.Cursor {
    constructor(state: State) {
      super(state);
    }
  }
}
