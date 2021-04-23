class Loading extends Phaser.Scene{
  constructor(){
    super('loadScene');
  }

  preload(){
    this.load.image('floor', 'assets/tempTile.png');
    this.load.image('floorTile','assets/tileSpriteFloor.png');
  }

  create(){
    this.scene.start('runScene');
  }
}