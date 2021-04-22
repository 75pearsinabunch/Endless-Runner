class RunRoom extends Phaser.Scene{
  constructor(){
    super('runScene');
  }

  create(){
    this.add.text(game.config.width/2, 30, 'Run Room Test Scene', {font: '14px Futura', fill: '#FFFFFF'});
  }
}