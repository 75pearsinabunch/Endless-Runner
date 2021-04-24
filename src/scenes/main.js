//Unless otherwise stated the current state of this project is copied
//Largely from Nathan Altice's "Movement Studies"

//That's right boys, we're bringing out the big guns:
'use strict';

//global variables
const tileSize = 32;
let playerSpeed = 4;

//Configuration
let config = {
  type: Phaser.WEBGL,
  width: 840,
  height: 525,
  physics:{
    default: 'arcade',
    arcade:{
      debug: true,
      gravity:{
        x:0,
        y: 9.8
      }
    }
  },
  scene:[Loading, RunRoom]
};

let game = new Phaser.Game(config);