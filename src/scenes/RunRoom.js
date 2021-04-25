class RunRoom extends Phaser.Scene{
  constructor(){
    super('runScene');
  }

  preload(){
    keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    keyY = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Y);
    keyB = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);
  }

  create(){
    //A test text just to have in the room
    this.instructionText = this.add.text(game.config.width/2, 30, 'Match the brick\'s colors to catch up to it', {font: '14px Futura', fill: '#FFFFFF'});
    this.keyText = this.add.text(game.config.width/2, 50, '(R) = Red, (Y) = Yellow, (B) = Blue (Q) = Restart', {font: '14px Futura', fill: '#FFFFFF'});
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

    //Setting up key presses for player
    keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    keyY = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Y);
    keyB = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);
    keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);

    //Game Control Code:
    this.balloonSpeed = .25;
    this.gameOver = false;
  }

  update(){
      if(Phaser.Input.Keyboard.JustDown(keyQ)){
        this.scene.restart()
      }

    if(!this.gameOver){
      //scrolls the ground texture
      this.groundScroll.tilePositionX += playerSpeed;
      if(this.player.color == this.currColor){
      this.signBlock.x = Phaser.Math.Clamp(this.signBlock.x-=this.balloonSpeed, game.config.width-200,game.config.width+tileSize+10);
      //  this.player.body.setVelocityX(5);
      }else{
        this.signBlock.x = Phaser.Math.Clamp(this.signBlock.x+=this.balloonSpeed, game.config.width-200,game.config.width+tileSize+10);
      //  this.player.body.setVelocityX(-5);
      }

      if(Phaser.Input.Keyboard.JustDown(keyR)){
        this.player.colorChange(colors.RED)
      }

      if(Phaser.Input.Keyboard.JustDown(keyY)){
        this.player.colorChange(colors.YELLOW)
      }

      if(Phaser.Input.Keyboard.JustDown(keyB)){
        this.player.colorChange(colors.BLUE)
      }

      if(this.signBlock.x>game.config.widht+tileSize){
        gameOver = true;
      }
    }
  }
}