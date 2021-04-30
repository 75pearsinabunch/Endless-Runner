 let config = {
    type: Phaser.PHYSICS,
    width: 840,
    height: 525,
    scene:  [Menu, Play],
    backgroundColor: 808080,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: 10,
        }
    }
};

let game = new Phaser.Game(config);

let gameOptions = {
    platformSpeedRange: [300, 300],
    spawnRange: [50, 280],
    platformSizeRange: [150, 300],
    platformHeightRange: [-.5, .5],
    platformHeighScale: 7,
    platformVerticalLimit: [0.1, 0.8],
    //runnerGravity: 900,
    jumpForce: 400,
    runnerStartPosition: 600,
    jumps: 2,
    
    floorSpeedRange: [300, 300],
    floorSizeRange: [150, 300],
    floorHeightRange: [-.5, .5],
    floorHeighScale: 7,
    floorVerticalLimit: [0.5, 0.8],
}

let animal = {
    WOLF: 0,
    MONKEY: 1,
    HUMAN: 2,
}

let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

let keyR, keyS;

let score = 0;
let highScore = 0;

let tileSize = 32;