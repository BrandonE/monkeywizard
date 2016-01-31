/// <reference path="../../../typings/tsd.d.ts" />
'use strict';

namespace Attack {
  export class State extends Phaser.State {
    player: Player;

    create() {
      console.log('Game Started');
      this.player = this.add.existing(new Player(this));
    }
  }

  export class Player extends Generic.Cursor {
    constructor(state: State) {
      super(state);
    }
  }
}
