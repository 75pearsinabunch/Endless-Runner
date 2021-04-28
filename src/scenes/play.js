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

            //Adding cieling for testing purposes
            this.cieling = this.add.rectangle(
                0,
                game.config.height/3,
                game.config.width,
                borderUISize*2.5,
                0xFFFFFF
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

            /*
            this.platform = this.add.image(
                0, 
                borderUISize * 12.5, 
                'platform'
            ).setOrigin(0, 0);
            */

            //Setting up groups
            this.cielingGroup = this.physics.add.group();
            this.floorGroup = this.physics.add.group();

            
            // Enable Physics for ground/floor instance
            this.cielingGroup.add(this.physics.add.existing(this.cieling));
            

            //Make sure the sky doesn't fall
            this.cieling.body.setImmovable(true);
            this.cieling.body.allowGravity = false;

            // Set world bounds 
            //this.floorGroup.body.setCollideWorldBounds(true);
            this.runner.body.setCollideWorldBounds(true);        
            
            // Collision between objects with the ground
            this.physics.add.collider(this.runner, this.cielingGroup);
            this.physics.add.collider(this.runner, this.floorGroup);

            // Set game over flag
            this.gameOver = false;

            // Initialize Keys
            this.cursors = this.input.keyboard.createCursorKeys();
            keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

            //Init enemy array
            this.enemyArray = [];

            //Main Spawn System
            /*
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
            */

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
        },
        loop: true,
        });

        this.hanging = false;

        
        //Setting up area spawning
        //Main Spawn System
            this.arcEvent = this.time.addEvent({
                //TODO: Random delay
                delay: 1000,
                callback: () =>
                {
                    //Spawn enemy if the game is still active
                    if (!this.gameOver)
                    {
                        this.shape = this.add.rectangle(game.config.width, game.config.height, 148, 148, 0x6666ff);
                        this.block = this.physics.add.existing(this.shape);
                        this.block.allowGravity = false;
                        this.block.body.setVelocityY(-100);
                        this.floorGroup.add(this.block);       
                    } 
                },
                callbackScope: this,
                loop: true
            });

            
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
            if (this.cursors.up.isDown && this.runner.body.touching.down)
            {
                this.runner.body.setVelocityY(-650);
            }

            if(this.cursors.up.isDown && this.runner.body.touching.up){
                this.hanging = true;
            }

            if(this.hanging){
                this.runner.body.allowGravity = false;
                if(this.cursors.up.isUp){
                    this.hanging = false;
                    this.runner.body.allowGravity = true;
                }
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

            if(this.cursors.left.isDown){
                this.runner.colorChange(colors.RED)
            }

            if(this.cursors.down.isDown){
                this.runner.colorChange(colors.YELLOW)
            }

            if(this.cursors.right.isDown){
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