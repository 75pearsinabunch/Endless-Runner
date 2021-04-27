 let config = {
    type: Phaser.PHYSICS,
    width: 840,
    height: 525,
    scene:  [Menu, Play],
    backgroundColor: 808080,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },
            debug: false
        }
    }
};

let game = new Phaser.Game(config);

let gameOptions = {
    platformSpeed: 350,
    spawnRange: [100, 300],
    platformSizeRange: [100, 350],
    //Gravity: 900,
    jumpForce: 400,
    Start: 200,
    jumps: 2
}

let colors = {
    RED: 0xff0000,
    YELLOW: 0xffff00,
    BLUE: 0x0000ff,
}

let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

let keyUP, keyR, keyS;

let score = 0;
let highScore = 0;

let tileSize = 32;