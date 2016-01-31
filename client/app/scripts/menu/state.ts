/// <reference path="../../../typings/tsd.d.ts" />
'use strict';

namespace Menu {
  export class State extends Phaser.State {


    create() {
      console.log('Menu Loaded');
      this.game.add.sprite(0, 0, 'backdrop');
      this.Text = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 150, 'Monkey Wizards\n - Simian Sorcery -\n\nClick to Start!', { font: "35px Arial", fill: "#ffffff", align: "center" });
      this.Text.anchor.setTo(0.5);

      this.monkeyFace = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY - 150, 'sprites', 'Monkey_Wizard/Monkey_Wizard');
      this.monkeyFace.anchor.setTo(0.5);
      this.monkeyFace.scale.setTo(2);

      this.banana1L = this.game.add.sprite(this.game.world.centerX -200, this.game.world.centerY - 200, 'sprites', 'Banana/Banana1');
      this.banana1L.anchor.setTo(0.5);

      this.banana2L = this.game.add.sprite(this.game.world.centerX -200, this.game.world.centerY, 'sprites', 'Banana/Banana2');
      this.banana2L.anchor.setTo(0.5);

      this.banana3L = this.game.add.sprite(this.game.world.centerX -200, this.game.world.centerY + 200, 'sprites', 'Banana/Banana3');
      this.banana3L.anchor.setTo(0.5);

      this.banana1R = this.game.add.sprite(this.game.world.centerX +180, this.game.world.centerY - 200, 'sprites', 'Banana/Banana1');
      this.banana1R.anchor.setTo(0.5);

      this.banana2R = this.game.add.sprite(this.game.world.centerX +180, this.game.world.centerY, 'sprites', 'Banana/Banana2');
      this.banana2R.anchor.setTo(0.5);

      this.banana3R = this.game.add.sprite(this.game.world.centerX +180, this.game.world.centerY + 200, 'sprites', 'Banana/Banana3');
      this.banana3R.anchor.setTo(0.5);





    }

    update() {

      this.banana1L.angle += 1;
      this.banana2L.angle += 2;
      this.banana3L.angle += 3;
      this.banana1R.angle -= 1;
      this.banana2R.angle -= 2;
      this.banana3R.angle -= 3;

      if (this.input.activePointer.isDown) {
        this.game.state.start('Attack');
      }
    }
  }
}
