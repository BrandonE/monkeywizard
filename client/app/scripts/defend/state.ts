/// <reference path="../../../typings/tsd.d.ts" />
'use strict';

namespace Defend {
    export class State extends Phaser.State {
        player: Player;

        create() {
            console.log('Defend');
            this.player = this.add.existing(new Player(this));
        }
    }

    export class Player extends Generic.Cursor {
    }
}
