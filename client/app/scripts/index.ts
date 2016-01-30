/// <reference path="../../typings/tsd.d.ts" />
'use strict';

class MonkeyWizards extends Phaser.Game {
  constructor() {
    super(1280, 720, Phaser.AUTO, '');
    this.state.add('Boot', Boot.State);
    this.state.add('Loader', Loader.State);
    this.state.add('Menu', Menu.State);
    this.state.add('Attack', Attack.State);
    this.state.add('Defend', Defend.State);
    this.state.add('Score', Score.State);

    this.state.start('Boot');
  }
}

new MonkeyWizards();

