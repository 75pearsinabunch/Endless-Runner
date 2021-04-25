class RunRoom extends Phaser.Scene{
  constructor(){
    super('runScene');
  }

  preload(){
 
  }

  create(){
    //A test text just to have in the room
    this.add.text(game.config.width/2, 30, 'Run Room Test Scene', {font: '14px Futura', fill: '#FFFFFF'});
    //Creating the physics floor:
    this.ground = this.add.group();
    
    //Creating the physics objects that make up the floor and adding them into a group
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

    //all possible colors the scene could be
    this.possibleTints = [colors.RED, colors.YELLOW, colors.BLUE];

    //a global "color" to the scene, the player should move faster if they are this color
    //and slower if they are not for prototype
    this.currColor = this.possibleTints[Phaser.Math.Between(0,2)];
    this.signBlock.setTint(this.currColor);//change color of sign block to match world color

    //color change event every so often
    this.colorChange = this.time.addEvent({
      delay: 1000,
      callback: () => {
        //changes world color and updates tint of block
        this.currColor = this.possibleTints[Phaser.Math.Between(0,2)];
        this.signBlock.setTint(this.currColor);
      },
      loop: true,
    })

    //Creating the player:
    //this.player = this.physics.add.sprite( , game.config.height-100, 'kid');
    this.player = new Player(
      this,
      100,
      game.config.height - 2*tileSize,
      'kid', 
    ).setOrigin(0);
    
    this.physics.add.collider(this.player, this.ground);
    this.player.colorChange(colors.BLUE);
  }

  update(){
    //scrolls the ground texture
    this.groundScroll.tilePositionX += playerSpeed;
  }
}