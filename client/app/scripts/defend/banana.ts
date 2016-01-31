/// <reference path="../../../typings/tsd.d.ts" />
'use strict';

namespace Defend {
  export class Banana extends Phaser.Sprite {
    state: State;
    
    constructor(state) {
      this.state = state;
      super(state.game, 0, 0, 'sprites', 'Banana/Banana1');
      this.game.physics.arcade.enable(this);
      this.checkWorldBounds = true;
      this.outOfBoundsKill = true;
      this.exists = false;
    }
  }
  
  export class Bananas extends Phaser.Group {
    cooldown: number;
    nextBanana: number;
    vectors: IVector[];
    
    constructor(state: State) {
      super(state.game);
      this.cooldown = 100;
      this.nextBanana = 0;
      
      for (var i = 0; i < 100; i++) {
        this.add(new Banana(state));
      }
    }
    
    update(): void {
      if (this.game.time.time > this.nextBanana && this.vectors && this.vectors.length > 0) {
        var banana = this.getFirstExists(false) as Banana;
        if (banana) {  
          var vect = this.vectors.pop();
          var slope = Math.tan(vect.angle);
          banana.reset(vect.x, vect.y);
          this.game.physics.arcade.velocityFromAngle(vect.angle, 300, banana.body.velocity);
          this.nextBanana = this.game.time.time + this.cooldown;
        }
      }
    }
  }
}
