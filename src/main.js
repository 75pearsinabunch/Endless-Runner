/*
collaborator names:
-Rutvik Katkoriya
-Adrian Miller
-Alvaro Perez
game title:
-Wolf the Monkey Man
date completed:
-May 3rd, 2021
creative tilt justification:
-Rutvik Katkoriya
-Adrian Miller
-Alvaro Perez

*/

let config = {
    type: Phaser.PHYSICS,
    width: 840,
    height: 525,
    scene: [Menu, Play],
    backgroundColor: 808080,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        }
    }
};

let game = new Phaser.Game(config);

let gameOptions = {

    platformSpeed: -300,
    //spawnRange: [50, 280],
    platformSizeRange: [150, 300],
    platformHeightRange: [-1, .5],
    platformHeightScale: 7,
    cielVerticalLimit: [0.2, 0.3],
    jumpForceMax: -350,
    runnerStartPosition: 300,
    jumps: 1,

    floorSpeed: -300,
    floorSizeRange: [150, 300],
    floorHeightRange: [-.5, .5],
    floorHeighScale: 7,
    floorVerticalLimit: [0.5, 0.8],

    platformSeparationRange: [100, 500],

    balloonSpeed: .25
}

//run SFX
let runConfig = {
    mute: false,
    volume: 0.1,
    rate: 1,
    detune: 0,
    seek: 0,
    loop: true,
    delay: 0
};

let animal = {
    WOLF: "wolf",
    MONKEY: "monkey",
    HUMAN: "human",
}

let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

let keyR, keyS;

let score = 0;
let highScore = 0;

let tileSize = 32;