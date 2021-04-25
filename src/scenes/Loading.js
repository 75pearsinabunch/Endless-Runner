class Loading extends Phaser.Scene{
  constructor(){
    super('loadScene');
  }

  preload(){
    this.load.image('floor', 'assets/tempTile.png');
    this.load.image('floorB', 'assets/floorB.png');
    this.load.image('floorR', 'assets/floorR.png');
    this.load.image('floorY', 'assets/floorY.png');
    this.load.image('kid', 'assets/mkcuklken-01.png');
    this.load.image('floorTile','assets/tileSpriteFloor.png');
  }

  create(){
    this.scene.start('runScene');
  }
}