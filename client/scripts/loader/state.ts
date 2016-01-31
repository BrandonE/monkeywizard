/// <reference path="../../../typings/tsd.d.ts" />
'use strict';

namespace Loader {
    export class State extends Phaser.State {
        preload() {
            this.load.atlasJSONHash('sprites', 'assets/images/sprites.png', 'assets/images/sprites.json');
            this.load.json('config', 'assets/config.json');
            this.load.image('backdrop', 'assets/images/backdrop.jpg');
            this.load.audio('background-music', 'assets/sound/background-music.mp3')
        }

        create() {
            console.log('Loading complete');
            this.game.state.start('Menu');
        }
    }
}
