class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload()
    {
        //Load Sprites
        //this.load.image('runner', 'assets/mkcuklken-01.png');
        this.load.image('enemy', 'assets/slime.png');
        this.load.image('jungle', 'assets/jungle.png');
        this.load.image('platform', 'assets/platform.png');
        this.load.image('floor', 'assets/ow.png');
        //this.load.image('ow', 'assets/ow.png');

        this.load.spritesheet('wolf', 'assets/wolfSpriteSheet.png', { frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('monkey', 'assets/monkeySpriteSheet.png', { frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('human', 'assets/humanSpriteSheet.png', { frameWidth: 32, frameHeight: 32});

        this.currRunAnim = "monkey run";


        
    }

    create()
    {
        //Debug BG Asset
        this.jungle = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'jungle').setOrigin(0,0);
                 
         //Set starting score to 0
         score = 0;

        //Display score
        let scoreConfig = { fontSize: '28px', color: '#FFFFFF', align: 'center',
            padding: { top: 5, bottom: 5, },
             fixedWidth: 100
        }

        this.scoreText = this.add.text(borderUISize + borderPadding/2, borderUISize + borderPadding/2, score, scoreConfig);

        this.currAnimal = animal.WOLF;
        //------------Create running animations------------------
        this.anims.create({
            key: "wolf run",
            frames: this.anims.generateFrameNumbers("wolf", { start: 0, end: 9 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
        key: "monkey run",
        frames: this.anims.generateFrameNumbers("monkey", { start: 0, end: 9 }),
        frameRate: 8,
        repeat: -1
        });

         this.anims.create({
        key: "human run",
        frames: this.anims.generateFrameNumbers("human", { start: 0, end: 9 }),
        frameRate: 8,
        repeat: -1
        });
        //-----------------------------------------------
        
        // keeping track of added platforms
        this.addedPlatforms = 0;
        // group with all active platforms.
        this.platformGroup = this.add.group({
            // once a platform is removed, it's added to the pool
            removeCallback: function(platform){
                platform.scene.platformPool.add(platform)
            }
        });

        this.floorGroup = this.add.group({
            // once a platform is removed, it's added to the pool
            removeCallback: function(floor){
                floor.scene.floorPool.add(floor)
            }
        });

        // platform pool
        this.platformPool = this.add.group({
            // once a platform is removed from the pool, it's added to the active platforms group
            removeCallback: function(platform){
                platform.scene.platformGroup.add(platform)
            }
        });
        this.floorPool = this.add.group({
            // once a platform is removed from the pool, it's added to the active platforms group
            removeCallback: function(floor){
                floor.scene.floorGroup.add(floor)
            }
        });

        // number of consecutive jumps made by the runner so far
        this.runnerJumps = 0;

        // adding a platform to the game, the arguments are platform width, x position and y position
        this.addPlatform(game.config.width, game.config.width / 2, game.config.height * 0.95);
        this.addFloor(game.config.width/20, game.config.width / 2, game.config.height * 0.45);
        
        // adding the runner;
        this.runner = new Runner (this, gameOptions.runnerStartPosition, game.config.height * 0.4, "wolf");
        //this.runner.setGravityY(gameOptions.runnerGravity);
        // setting collisions between the runner and the platform group

        //-------------------THIS WILL NEED TO BE SLIGHTLY RETOOLED------------------------
        this.physics.add.collider(this.runner, this.platformGroup, function(){
            // play "run" animation if the runner is on a platform
            if(!this.runner.anims.isPlaying){
                this.runner.anims.play(this.currRunAnim);
            }
        }, null, this);
     
        this.physics.add.collider(this.runner, this.floorGroup, function(){
            // play "run" animation if the runner is on a platform
            if(!this.runner.anims.isPlaying){
                this.runner.anims.play(this.currRunAnim);
            }
        }, null, this);

        // checking for input
        this.input.on("pointerdown", this.jump, this);
        //----------------------------------------------------------

         // Set game over flag
        this.gameOver = false;

        // Initialize Keys
        this.cursors = this.input.keyboard.createCursorKeys();
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        //Init enemy array
        this.enemyArray = [];
        this.enemyGroup = this.add.group();
        this.physics.add.collider(
                        this.runner,
                        this.enemyGroup, 
                        () =>
                        {
                            this.gameOver = true;
                            //this.runner.alive = false;
                            this.runner.destroy();
                        });
        this.physics.add.collider(this.platformGroup, this.enemyGroup);

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
                    this.spawn = new Enemy(this, game.config.width - 10, borderUISize*7.5, 'enemy', 0).setOrigin(0, 0);
                    //add local physics colliders to the new object
                    this.enemyGroup.add(this.spawn);
                    this.enemyArray.push(this.spawn);
                    } 
                },
                callbackScope: this,
                loop: true
            });
    }

    // the core of the script: platform are added from the pool or created on the fly
    addPlatform(platformWidth, posX, posY){
        if(this.gameOver){
            return;
        }
        this.addedPlatforms ++;
        let platform;
        if(this.platformPool.getLength()){
            platform = this.platformPool.getFirst();
            platform.x = posX;
            platform.y = posY;
            platform.active = true;
            platform.visible = true;
            this.platformPool.remove(platform);
            let newRatio =  platformWidth / platform.displayWidth;
            platform.displayWidth = platformWidth;
            platform.tileScaleX = 1 / platform.scaleX;
        }
        else{
            platform = this.add.tileSprite(posX, posY, platformWidth, 32, "platform");
            this.physics.add.existing(platform);
            platform.body.setImmovable(true);
            platform.body.setVelocityX(Phaser.Math.Between(gameOptions.platformSpeedRange[0], gameOptions.platformSpeedRange[1]) * -1);
            this.platformGroup.add(platform);
        }
        this.nextPlatformDistance = Phaser.Math.Between(gameOptions.spawnRange[0], gameOptions.spawnRange[1]);
    }
    addFloor(floorWidth, posX, posY){
        if(this.gameOver){
            return;
        }
        this.addedFloors ++;
        let floor;
        if(this.floorPool.getLength()){
            floor = this.floorPool.getFirst();
            floor.x = posX;
            floor.y = posY;
            floor.active = true;
            floor.visible = true;
            this.floorPool.remove(floor);
            let newRatio =  floorWidth / floor.displayWidth;
            floor.displayWidth = floorWidth;
            floor.tileScaleX = 1 / floor.scaleX;
        }
        else{
            floor = this.add.tileSprite(posX, posY, floorWidth, 32, "floor");
            this.physics.add.existing(floor);
            floor.body.setImmovable(true);
            floor.body.setVelocityX(Phaser.Math.Between(gameOptions.floorSpeedRange[0], gameOptions.floorSpeedRange[1]) * -1);
            this.floorGroup.add(floor);
        }
        this.nextFloorDistance = Phaser.Math.Between(gameOptions.spawnRange[0], gameOptions.spawnRange[1]);
    }
    // the runner jumps when on the ground, or once in the air as long as there are jumps left and the first jump was on the ground
    jump(){
        if(this.runner.body.touching.down || (this.runnerJumps > 0 && this.runnerJumps < gameOptions.jumps)){
            if(this.runner.body.touching.down){
                this.runnerJumps = 0;
            }
            this.runner.setVelocityY(gameOptions.jumpForce * -1);
            this.runnerJumps ++;

            // stops animation
            this.runner.anims.stop();
        }
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
        //if character falls off, automatic restart from the beginning 
        if(this.runner.y > game.config.height){
            this.scene.start("playScene");
        }
        this.runner.x = gameOptions.runnerStartPosition;
        // recycling platforms
        let minDistance = game.config.width;
        let rightmostPlatformHeight = 0;
        this.platformGroup.getChildren().forEach(function(platform){
            let platformDistance = game.config.width - platform.x - platform.displayWidth / 2;
            if(platformDistance < minDistance){
                minDistance = platformDistance;
                rightmostPlatformHeight = platform.y;
            }
            if(platform.x < - platform.displayWidth / 2){
                this.platformGroup.killAndHide(platform);
                this.platformGroup.remove(platform);
            }
        }, this);
        // adding new platforms
        if(minDistance > this.nextPlatformDistance){
            let nextPlatformWidth = Phaser.Math.Between(gameOptions.platformSizeRange[0], gameOptions.platformSizeRange[1]);
            let platformRandomHeight = gameOptions.platformHeighScale * Phaser.Math.Between(gameOptions.platformHeightRange[0], gameOptions.platformHeightRange[1]);
            let nextPlatformGap = rightmostPlatformHeight + platformRandomHeight;
            let minPlatformHeight = game.config.height * gameOptions.platformVerticalLimit[0];
            let maxPlatformHeight = game.config.height * gameOptions.platformVerticalLimit[1];
            let nextPlatformHeight = Phaser.Math.Clamp(nextPlatformGap, minPlatformHeight, maxPlatformHeight);
            this.addPlatform(nextPlatformWidth, game.config.width + nextPlatformWidth / 2, nextPlatformHeight);
        }
        // recycling floors - same thing as platform but up higher
        let rightmostFloorHeight = 0;
        this.floorGroup.getChildren().forEach(function(floor){
            let floorDistance = game.config.width - floor.x - floor.displayWidth / 2;
            if(floorDistance < minDistance){
                minDistance = floorDistance;
                rightmostFloorHeight = floor.y;
            }
            if(floor.x < - floor.displayWidth / 2){
                this.floorGroup.killAndHide(floor);
                this.floorGroup.remove(floor);
            }
        }, this);
        // adding new floors
        if(minDistance > this.nextFloorDistance){
            let nextFloorWidth = Phaser.Math.Between(gameOptions.floorSizeRange[0], gameOptions.floorSizeRange[1]);
            let floorRandomHeight = gameOptions.floorHeighScale * Phaser.Math.Between(gameOptions.floorHeightRange[0], gameOptions.floorHeightRange[1]);
            let nextFloorGap = rightmostFloorHeight + floorRandomHeight;
            let minFloorHeight = game.config.height * gameOptions.floorVerticalLimit[0];
            let maxFloorHeight = game.config.height * gameOptions.floorVerticalLimit[1];
            let nextFloorHeight = Phaser.Math.Clamp(nextFloorGap, minFloorHeight, maxFloorHeight);
            this.addFloor(nextFloorWidth, game.config.width + nextFloorWidth / 2, nextFloorHeight);
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

            if(this.cursors.left.isDown){
                this.runner.change(animal.WOLF);
                this.currRunAnim = "wolf run";
            }

            if(this.cursors.down.isDown){
                this.runner.change(animal.MONKEY);
                this.currRunAnim = "monkey run";
            }

            if(this.cursors.right.isDown){
                this.runner.change(animal.HUMAN);
                this.currRunAnim = "human run";
            }
        }
        else
        {
            //this.platformGroup.setVelocityY(0);
            if (score > highScore)
            {
                highScore = score;
            }

            this.enemyArray.forEach(enemy => enemy.destroy());
        }
    }
}