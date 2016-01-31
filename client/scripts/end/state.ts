/// <reference path="../../../typings/tsd.d.ts" />
'use strict';

namespace End {
    export class State extends Phaser.State {
        message: string;
        turns;

        create() {
            this.add.text(500, 360, this.message, {});
        }
    }
}
