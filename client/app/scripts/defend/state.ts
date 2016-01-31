/// <reference path="../../../typings/tsd.d.ts" />
'use strict';

namespace Defend { 
  export class State extends Phaser.State {
    player: Player;
    bananas: number;
    
    create(): void {
      console.log('Game Started');
      this.player = this.add.existing(new Player(this));
      this.bananas = 30;
    }
    
    generateBananas(): IVector[] {
      var vectors = [],
          xMaxima = this.game.width,
          yMaxima = this.game.height,
          angleMaxima = Math.PI * 2;
      for (var i = 0; i < this.bananas; i++) {
        var vector: IVector = {
          x: Math.random() * xMaxima,
          y: Math.random() * yMaxima,
          angle: Math.random() * angleMaxima
        };
      }
      return vectors;
    }
  }
  
  export interface IVector {
    x: number;
    y: number;
    angle: number;
  }
  
  export class Player extends Generic.Cursor {
  }
}
