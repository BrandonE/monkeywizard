/// <reference path="../../../typings/tsd.d.ts" />
'use strict';

namespace Boot {
    export class State extends Phaser.State {
        init() {
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.pageAlignVertically = true;
            this.game.scale.refresh();
        }

        create() {
            console.log('Boot complete');
            this.game.state.start('Loader');
        }
    }
}
