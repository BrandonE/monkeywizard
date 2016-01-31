/// <reference path="../../typings/tsd.d.ts" />
'use strict';

class MonkeyWizards extends Phaser.Game {
    constructor() {
        super(1280, 720, Phaser.AUTO, '');
        this.state.add('Boot', Boot.State);
        this.state.add('Loader', Loader.State);
        this.state.add('Menu', Menu.State);
        this.state.add('Game', Game.State);
        this.state.add('End', End.State);
        this.state.start('Boot');
    }
}

new MonkeyWizards();
