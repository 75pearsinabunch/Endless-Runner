class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload()
    {
        //Load Sprites
        this.load.image('runner', 'assets/mkcuklken-01.png');
        this.load.image('enemy', 'assets/slime.png');
        this.load.image('jungle', 'assets/jungle.png');
        this.load.image('platform', 'assets/platform.png');
        this.load.image('ow', 'assets/ow.png');
    }

    create()
    {
        //Basic instructions for playtesting purposes
        this.instructionText = this.add.text(game.config.width/2, 30, 'Match the brick\'s colors to keep it on screen!', {font: '14px Futura', fill: '#FFFFFF'});
        this.keyText = this.add.text(game.config.width/2, 50, '(R) = Red, (Y) = Yellow, (B) = Blue (R) = Restart', {font: '14px Futura', fill: '#FFFFFF'});

        //Debug BG Asset
        this.jungle = this.add.tileSprite(
            0,
            0,
            game.config.width,
            game.config.height,
            'jungle'
            ).setOrigin(0,0);

        //Ground Physics Collider
        this.ground = this.add.rectangle(
            0,
            borderUISize * 15,
            game.config.width,
            borderUISize * 2.5,
            0x917dd4,
            0
            ).setOrigin(0,0);     
            
        //Set starting score to 0
        score = 0;

        //Display score
        let scoreConfig = {
            fontSize: '28px',
            color: '#FFFFFF',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }

        this.scoreText = this.add.text(borderUISize + borderPadding/2, borderUISize + borderPadding/2, score, scoreConfig);

        this.runner = new Runner(
            this,
            game.config.width/10,
            borderUISize*10,
            'runner'
        ).setOrigin(0.5, 0);

        this.platform = this.add.image(
            0, 
            borderUISize * 12.5, 
            'platform'
        ).setOrigin(0, 0);

        // Enable Physics for ground instance
        this.add.existing(this.ground);
        this.physics.add.existing(this.ground);

        // Set world bounds 
        this.ground.body.setCollideWorldBounds(true);
        this.runner.body.setCollideWorldBounds(true);        
        
        // Collision between objects with the ground
        this.physics.add.collider(this.runner, this.ground);

        // Set game over flag
        this.gameOver = false;

        // Initialize Keys
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);  
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        //Init enemy array
        this.enemyArray = [];

        //Main Spawn System
        this.spawnClock = this.time.addEvent({
            //TODO: Random delay
            delay: 3000,
            callback: () =>
            {
                //Spawn enemy if the game is still active
                if (!this.gameOver)
                {
                    //create a new enemy
                    //TODO: Random object spawn
                    this.spawn = new Enemy(this, game.config.width - 10, borderUISize*10.5, 'enemy', 0).setOrigin(0, 0.0);
                    

                    //add local physics colliders to the new object
                    console.log("spawn");
                    this.physics.add.collider(this.ground,this.spawn);
                    this.physics.add.collider(
                        this.runner,
                        this.spawn, 
                        () =>
                        {
                            this.gameOver = true;
                            this.runner.alive = false;
                        });

                    this.enemyArray.push(this.spawn);
                } 
            },
            callbackScope: this,
            loop: true
        });

            //Adding color changing block
    this.signBlock = this.add.sprite((game.config.width - 100), game.config.height/2, 'runner').setOrigin(0);

    //all possible colors the scene could be
    this.possibleTints = [colors.RED, colors.YELLOW, colors.BLUE];

    //a global "color" to the scene, the runner should move faster if they are this color
    //and slower if they are not for prototype
    this.currColor = this.possibleTints[Phaser.Math.Between(0,2)];
    this.signBlock.setTint(this.currColor);//change color of sign block to match world color

    this.balloonSpeed = .25;

    //color change event every so often
    this.colorChange = this.time.addEvent({
      delay: 1000,
      callback: () => {
        //changes world color and updates tint of block
        this.currColor = this.possibleTints[Phaser.Math.Between(0,2)];
        this.signBlock.setTint(this.currColor);
        this.signBlock.tintFill = true;
        console.log(this.signBlock);
      },
      loop: true,
    });

    //Setting up keys
    keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update()
    {
        //console.log(this.checkCollision(this.runner, this.scoreColl));
        this.scoreText.text = score;

        //If game over, check input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
            
            //Debug way to check high score
            //TODO: Display on Game Over screen
            console.log(highScore);
        }

        if (!this.gameOver)
        {
            //Update scroll BG
            this.jungle.tilePositionX += 3;

            // Jump
            if (Phaser.Input.Keyboard.JustDown(keyUP) && this.runner.body.touching.down)
            {
                this.runner.body.setVelocityY(-650);
            }
            
            if (this.enemyArray.length != 0)
            {
                this.enemyArray.forEach(enemy => enemy.update());
            }

            if(this.runner.color == this.currColor){
                this.signBlock.x = Phaser.Math.Clamp(this.signBlock.x-=this.balloonSpeed, game.config.width-200,game.config.width+tileSize+10);
            }else{
                this.signBlock.x = Phaser.Math.Clamp(this.signBlock.x+=this.balloonSpeed, game.config.width-200,game.config.width+tileSize+10);
            }

            if(Phaser.Input.Keyboard.JustDown(keyLEFT)){
                this.runner.colorChange(colors.RED)
            }

            if(Phaser.Input.Keyboard.JustDown(keyDOWN)){
                this.runner.colorChange(colors.YELLOW)
            }

            if(Phaser.Input.Keyboard.JustDown(keyRIGHT)){
                this.runner.colorChange(colors.BLUE)
            }

            if(this.signBlock.x>game.config.width+tileSize){
                this.instructionText.text = 'Game Over!';
                this.gameOver = true;
            }
            
        }
        else
        {
            if (this.runner.alive == false)
            {
                this.runner.reset();
            }

            //Update high score
            if (score > highScore)
            {
                highScore = score;
            }

            this.enemyArray.forEach(enemy => enemy.destroy());
        }
    }
}