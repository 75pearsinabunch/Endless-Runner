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
        this.load.image('platform', 'assets/grounds.png');
        this.load.image('floor', 'assets/ow.png');
        this.load.image('background','assets/background.png');
        this.load.image('backtree','assets/backtree.png');
        this.load.image('backtreeroot','assets/backtreeroot.png');
        this.load.image('bush','assets/bush.png');
        this.load.image('frontree','assets/frontree.png');
        this.load.image('frontroot','assets/frontroot.png');
        this.load.image('ground','assets/ground.png');
        this.load.image('topbush','assets/topbush.png');
        this.load.image('ui','assets/ui.png');
        this.load.image('vine','assets/vine.png');
        this.load.audio('kJump1', 'assets/Kid-Jump01.wav');
        this.load.audio('kJump2', 'assets/Kid-Jump02.wav');
        this.load.audio('kJump3', 'assets/Kid-Jump03.wav');
        //this.load.image('ow', 'assets/ow.png');

        this.load.spritesheet('runner', 'assets/u.png', { frameWidth: 85, frameHeight: 74 });
    }

    create()
    {
            //Basic instructions for playtesting purposes
            this.instructionText = this.add.text(game.config.width/2, 30, 'Match the brick\'s colors to keep it on screen!', {font: '14px Futura', fill: '#FFFFFF'});
            this.keyText = this.add.text(game.config.width/2, 50, '(R) = Red, (Y) = Yellow, (B) = Blue (R) = Restart', {font: '14px Futura', fill: '#FFFFFF'});

            //Debug BG Asset
            this.jungle = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'jungle').setOrigin(0,0);
            this.background = this.add.tileSprite(0,0,game.config.width, game.config.height,'background').setOrigin(0,0);
            this.backtreeroot = this.add.tileSprite(0,0,game.config.width, game.config.height,'backtreeroot').setOrigin(0,0);
            this.bush = this.add.tileSprite(0,0,game.config.width, game.config.height,'bush').setOrigin(0,0);
            this.vine = this.add.tileSprite(0,0,game.config.width, game.config.height,'vine').setOrigin(0,0);
            this.frountroot = this.add.tileSprite(0,0,game.config.width, game.config.height,'frontroot').setOrigin(0,0);
            this.backtree = this.add.tileSprite(0,0,game.config.width, game.config.height,'backtree').setOrigin(0,0);
            this.frontree = this.add.tileSprite(0,0,game.config.width, game.config.height,'frontree').setOrigin(0,0);
            this.topbush = this.add.tileSprite(0,0,game.config.width, game.config.height,'topbush').setOrigin(0,0);
            this.ground = this.add.tileSprite(0,0,game.config.width, game.config.height,'ground').setOrigin(0,0);
            this.ui = this.add.image(0,0,'ui').setOrigin(0,0);

                 
            //Set starting score to 0
            score = 0;
            //Display score
            let scoreConfig = { fontSize: '28px', color: '#FFFFFF', align: 'center',
                padding: { top: 5, bottom: 5, },
                fixedWidth: 100
            }

            this.scoreText = this.add.text(borderUISize + borderPadding/2, borderUISize + borderPadding/2, score, scoreConfig);

            this.anims.create({
                key: "run",
                frames: this.anims.generateFrameNumbers("runner", { start: 0, end: 3 }),
                frameRate: 8,
                repeat: -1
            });

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
        this.addFloor(game.config.width/20, game.config.width / 2, game.config.height * 0.35);
        // adding the runner;
        this.runner = new Runner(this, gameOptions.runnerStartPosition, game.config.height * 0.4, "runner");
        //this.runner.setGravityY(gameOptions.runnerGravity);
        // setting collisions between the runner and the platform group
        this.physics.add.collider(this.runner, this.platformGroup, function(){
            // play "run" animation if the runner is on a platform
            if(!this.runner.anims.isPlaying){
                this.runner.anims.play("run");
            }
        }, null, this);
        this.physics.add.collider(this.runner, this.floorGroup, function(){
            // play "run" animation if the runner is on a platform
            if(!this.runner.anims.isPlaying){
                this.runner.anims.play("run");
            }
        }, null, this);
        // checking for input
        this.input.on("pointerdown", this.jump, this);



            // this.physics.add.existing(this.ground);
            //this.physics.add.existing(this.cieling);

            //Make sure the sky doesn't fall
            //this.cieling.body.setImmovable(true);
            //this.cieling.body.allowGravity = false;


            // Set world bounds 
            // this.ground.body.setCollideWorldBounds(true);
            //this.runner.body.setCollideWorldBounds(true);        
            
            // Collision between objects with the ground
            //this.physics.add.collider(this.runner, this.ground);
            //this.physics.add.collider(this.runner, this.cieling);

            // Set game over flag
            this.gameOver = false;

            // Initialize Keys
            this.cursors = this.input.keyboard.createCursorKeys();
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
                        this.spawn = new Enemy(this, game.config.width - 10, borderUISize*7.5, 'enemy', 0).setOrigin(0, 0);
                        //add local physics colliders to the new object
                        console.log("spawn");
                        this.physics.add.collider(this.platformGroup,this.spawn);
                        this.physics.add.collider(
                            this.runner,
                            this.spawn, 
                            () =>
                            {
                                console.log('hit');
                                this.gameOver = true;
                                //this.runner.alive = false;
                                this.runner.destroy();
                            });

                        this.enemyArray.push(this.spawn);
                    } 
                },
                callbackScope: this,
                loop: true
            });
        this.hanging = false;
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
            platform.body.allowGravity = false;
            platform.body.setImmovable(true);
            this.platformPool.remove(platform);
            let newRatio =  platformWidth / platform.displayWidth;
            platform.displayWidth = platformWidth;
            platform.tileScaleX = 1 / platform.scaleX;
        }
        else{
            platform = this.add.tileSprite(posX, posY, platformWidth, 150, "platform");
            this.physics.add.existing(platform);
            platform.body.allowGravity = false;
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
            floor.body.allowGravity = false;
            floor.body.setImmovable(true);
            this.floorPool.remove(floor);
            let newRatio =  floorWidth / floor.displayWidth;
            floor.displayWidth = floorWidth;
            floor.tileScaleX = 1 / floor.scaleX;
        }
        else{
            floor = this.add.tileSprite(posX, posY, floorWidth, 32, "floor");
            this.physics.add.existing(floor);
            floor.body.allowGravity = false;
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
            this.gameOver = true;
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
            this.background.tilePositionX += 1.8;
            this.backtree.tilePositionX += 2.1;
            this.backtreeroot.tilePositionX += 2.1;
            this.bush.tilePositionX += 2.4;
            this.frontree.tilePositionX += 2.7;
            this.frountroot.tilePositionX += 2.7;
            this.ground.tilePositionX += 3;
            this.topbush.tilePositionX += 2.9;
            this.vine.tilePositionX += 2.1;
            this.jungle.tilePositionX += 3;



            // Jump
            if (this.cursors.up.isDown && this.runner.body.touching.down)
            {
                this.runner.body.setVelocityY(-650);
                // let soundVar = Math.floor(Math.random()*3);
                // if(soundVar == 0) {
                //     this.sound.play('kJump1');
                // } else if (soundVar == 1) {
                //     this.sound.play('kJump2');
                // } else if (soundVar == 2) {
                //     this.sound.play('kJump3');
                // }
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
                this.runner.colorChange(animal.WOLF)
            }

            if(this.cursors.down.isDown){
                this.runner.colorChange(animal.HUMAN)
            }

            if(this.cursors.right.isDown){
                this.runner.colorChange(animal.MONKEY)
            }
        }
        else
        {
            if (score > highScore)
            {
                highScore = score;
            }

            this.enemyArray.forEach(enemy => enemy.destroy());
        }
    }
}