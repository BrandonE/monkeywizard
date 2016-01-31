/// <reference path="../../../typings/tsd.d.ts" />
'use strict';

namespace Defend {
  export class State extends Phaser.State {
    player: Player;
    bananas: Bananas;
    bananaCount: number;
    waveLength: number;
    nextWave: number;

    create(): void {
      console.log('Game Started');
      this.world.bounds = new Phaser.Rectangle(125, 125, 1030, 470);
      this.player = this.add.existing(new Player(this));
      this.bananaCount = 30;
      this.waveLength = 12 * 60; // waves are 12 seconds long
      this.nextWave = this.game.time.time + 120; // start first wave after two seconds
      this.bananas = new Bananas(this);
      this.sound.add('background-music', 100, true);
    }

    update(): void {
      if (this.game.time.time > this.nextWave) {
        this.bananas.vectors = this.generateVectors();
      }
    }
    
    generateVectors(): IVector[] {
      var vectors = [],
          xMaxima = this.game.width,
          yMaxima = this.game.height,
          angleMaxima = 360;
      for (var i = 0; i < this.bananaCount; i++) {
        vectors.push({
          x: Math.random() * xMaxima,
          y: Math.random() * yMaxima,
          angle: Math.random() * angleMaxima - 180
        });
      }
      return vectors;
    }
  }
}
