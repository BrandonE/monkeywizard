/// <reference path="../../../typings/tsd.d.ts" />
'use strict';

namespace Loader {
  export class State extends Phaser.State {
    preload() {
      this.load.atlasJSONHash('sprites', 'assets/images/sprites.png', 'assets/images/sprites.json');
      this.load.audio('background-music', 'assets/sound/background-music.mpg', true);
    }

    create() {
      console.log('Loading complete');
      this.game.state.start('Menu');
    }
  }
}
