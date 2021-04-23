class RunRoom extends Phaser.Scene{
  constructor(){
    super('runScene');
  }

  create(){
    this.add.text(game.config.width/2, 30, 'Run Room Test Scene', {font: '14px Futura', fill: '#FFFFFF'});
    this.ground = this.add.group();
    for(let i = 0; i<game.config.width; i += tileSize){
      let groundTile = this.physics.add.sprite(i, game.config.height-tileSize, 'floor').setOrigin(0)
      groundTile.body.immovable = true;
      groundTile.body.allowGravity = false;
      this.ground.add(groundTile);
    }
    //this.add.sprite(game.config.width/2, game.config.height/2, 'floor').setOrigin(0,0);
  }
}