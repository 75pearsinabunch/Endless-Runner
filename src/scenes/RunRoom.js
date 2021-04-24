class RunRoom extends Phaser.Scene{
  constructor(){
    super('runScene');
  }

  preload(){
    //setting up universal colors enum
    this.colors = {
      RED: 0xff0000,
      YELLOW: 0xffff00,
      BLUE: 0x0000ff,
    }
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

    //Adding color changing block
    this.signBlock = this.add.sprite((game.config.width - 100), game.config.height/2, 'floorB').setOrigin(0);

    this.possibleTints = [this.colors.RED, this.colors.YELLOW, this.colors.BLUE];
    this.currColor = this.possibleTints[Phaser.Math.Between(0,2)];
    this.signBlock.setTint(this.currColor);
    //color change event every so often
    this.colorChange = this.time.addEvent({
      delay: 1000,
      callback: () => {
        console.log("Color Change");
        this.currColor = this.possibleTints[Phaser.Math.Between(0,2)];
        this.signBlock.setTint(this.currColor);
      },
      loop: true,
    })
  }

  update(){
    //scrolls the ground texture
    this.groundScroll.tilePositionX += playerSpeed;
  }
}