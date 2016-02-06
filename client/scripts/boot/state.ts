/// <reference path="../../../typings/tsd.d.ts" />
'use strict';

namespace Boot {
    export class State extends Phaser.State {
        init() {
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        }

        create() {
            console.log('Boot complete');
            this.game.state.start('Loader');
        }
    }
}
