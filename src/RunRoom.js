class RunRoom extends Phaser.Scene{
  constructor(){
    super('runScene');
  }

  create(){
    //A test text just to have in the room
    this.add.text(game.config.width/2, 30, 'Run Room Test Scene', {font: '14px Futura', fill: '#FFFFFF'});
    //Creating the physics floor:
    this.ground = this.add.group();
    for(let i = 0; i<game.config.width; i += tileSize){
      let groundTile = this.physics.add.sprite(i, game.config.height-tileSize, 'floor').setOrigin(0)
      groundTile.body.immovable = true;
      groundTile.body.allowGravity = false;
      this.ground.add(groundTile);
    }
    //Adding a visual tilesprite to show the illusion of motion
    this.groundScroll = this.add.tileSprite(0, game.config.height-tileSize, game.config.width, tileSize, 'floorTile').setOrigin(0);
  }

  update(){
    this.groundScroll.tilePositionX += playerSpeed;
  }
}