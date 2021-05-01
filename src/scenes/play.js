class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        //Load Sprites
        //this.load.image('runner', 'assets/mkcuklken-01.png');
        this.load.image('enemy', 'assets/slime.png');
        this.load.image('jungle', 'assets/jungle.png');
        this.load.image('platform', 'assets/grounds.png');
        this.load.image('floor', 'assets/ow.png');
        this.load.image('background', 'assets/background.png');
        this.load.image('backtree', 'assets/backtree.png');
        this.load.image('backtreeroot', 'assets/backtreeroot.png');
        this.load.image('bush', 'assets/bush.png');
        this.load.image('frontree', 'assets/frontree.png');
        this.load.image('frontroot', 'assets/frontroot.png');
        this.load.image('ground', 'assets/ground.png');
        this.load.image('topbush', 'assets/topbush.png');
        this.load.image('ui', 'assets/ui.png');
        this.load.image('vine', 'assets/vine.png');

        this.load.spritesheet('runner', 'assets/u.png', { frameWidth: 85, frameHeight: 74 });
        this.load.spritesheet('wolf', 'assets/wolfSpriteSheet.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('monkey', 'assets/monkeySpriteSheet.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('human', 'assets/humanSpriteSheet.png', { frameWidth: 32, frameHeight: 32 });

        this.load.audio('hJump1', 'assets/audio/Kid/Kid-Jump01.wav');
        this.load.audio('hJump2', 'assets/audio/Kid/Kid-Jump02.wav');
        this.load.audio('hJump3', 'assets/audio/Kid/Kid-Jump03.wav');
        this.load.audio('wJump1', 'assets/audio/Wolf/Wolf-Jump01.wav');
        this.load.audio('wJump2', 'assets/audio/Wolf/Wolf-Jump02.wav');
        this.load.audio('wJump3', 'assets/audio/Wolf/Wolf-Jump03.wav');
        this.load.audio('mJump1', 'assets/audio/Monkey/Monkey-Jump01.wav');
        this.load.audio('mJump2', 'assets/audio/Monkey/Monkey-Jump02.wav');
        this.load.audio('mJump3', 'assets/audio/Monkey/Monkey-Jump03.wav');
        this.load.audio('hDeath1', 'assets/audio/Kid/Kid-Death01.wav');
        this.load.audio('hDeath2', 'assets/audio/Kid/Kid-Death02.wav');
        this.load.audio('wDeath1', 'assets/audio/Wolf/Wolf-Death01.wav');
        this.load.audio('wDeath2', 'assets/audio/Wolf/Wolf-Death02.wav');
        this.load.audio('mDeath1', 'assets/audio/Monkey/Monkey-Death01.wav');
        this.load.audio('mDeath2', 'assets/audio/Monkey/Monkey-Death02.wav');

    }

    create() {
        // Set game over flag
        this.gameOver = false;

        //Debug BG Asset
        this.jungle = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'jungle').setOrigin(0, 0);
        this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'background').setOrigin(0, 0);
        this.backtreeroot = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'backtreeroot').setOrigin(0, 0);
        this.bush = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'bush').setOrigin(0, 0);
        this.vine = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'vine').setOrigin(0, 0);
        this.frountroot = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'frontroot').setOrigin(0, 0);
        this.backtree = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'backtree').setOrigin(0, 0);
        this.frontree = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'frontree').setOrigin(0, 0);
        this.topbush = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'topbush').setOrigin(0, 0);
        this.ground = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'ground').setOrigin(0, 0);
        this.ui = this.add.image(0, 0, 'ui').setOrigin(0, 0);

        //------------Scoring-------------
        //Set starting score to 0
        score = 0;

        //Display score
        let scoreConfig = {
            fontSize: '28px', color: '#FFFFFF', align: 'center',
            padding: { top: 5, bottom: 5, },
            fixedWidth: 100
        }

        this.scoreText = this.add.text(borderUISize + borderPadding / 2, borderUISize + borderPadding / 2, score, scoreConfig);

        //----------Setting up platform recycling---------------
        // keeping track of added platforms
        //this.addedPlatforms = 0;

        // group with all active platforms.
        this.platformGroup = this.add.group({
            // once a platform is removed, it's added to the pool
            removeCallback: function (platform) {
                platform.scene.platformPool.add(platform)
            }
        });

        // platform pool
        this.platformPool = this.add.group({
            // once a platform is removed from the pool, it's added to the active platforms group
            removeCallback: function (platform) {
                platform.scene.platformGroup.add(platform)
            }
        });

        this.floorGroup = this.add.group({
            // once a platform is removed, it's added to the pool
            removeCallback: function (floor) {
                floor.scene.floorPool.add(floor)
            }
        });

        this.floorPool = this.add.group({
            // once a platform is removed from the pool, it's added to the active platforms group
            removeCallback: function (floor) {
                floor.scene.floorGroup.add(floor)
            }
        });

        // adding a platform to the game, the arguments are platform width, x position and y position
        this.addPlatform(game.config.width, game.config.width / 2, game.config.height * 0.95);
        this.addFloor(game.config.width / 20, game.config.height / 2, game.config.height * 0.35);

        
        //-----------Setting up Animations-----------
        this.anims.create({
            key: "wolf",
            frames: this.anims.generateFrameNumbers("wolf", { start: 0, end: 9 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: "monkey",
            frames: this.anims.generateFrameNumbers("monkey", { start: 0, end: 9 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: "human",
            frames: this.anims.generateFrameNumbers("human", { start: 0, end: 9 }),
            frameRate: 8,
            repeat: -1
        });

        this.currAnim = null;

        //--------------Adding the Runner------------------
        this.runner = new Runner(this, gameOptions.runnerStartPosition, game.config.height * 0.4, animal.WOLF);
    
        //------------Player Collision----------------------
        // setting collisions between the runner and the platform group
        this.physics.add.collider(this.runner, this.platformGroup, function () {
            // play "run" animation if the runner is on a platform
            if (this.currAnim != this.runner.animal) {
                this.currAnim = this.runner.animal;
                this.runner.anims.play(this.currAnim);
            }
        }, null, this);

        this.physics.add.collider(this.runner, this.floorGroup, function () {
            // play "run" animation if the runner is on a platform
          if (this.currAnim != this.runner.animal) {
                this.currAnim = this.runner.animal;
                this.runner.anims.play(this.currAnim);
            }
        }, null, this);

        // checking for input
        //this.input.on("pointerdown", this.jump, this);

        // Initialize Keys
        this.cursors = this.input.keyboard.createCursorKeys();
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        //Init enemy array
        this.enemyArray = [];

        //Main Spawn System
        this.spawnClock = this.time.addEvent({
            //TODO: Random delay
            delay: 3000,
            callback: () => {
                //Spawn enemy if the game is still active
                if (!this.gameOver) {
                    //create a new enemy
                    //TODO: Random object spawn
                    this.spawn = new Enemy(this, game.config.width - 10, borderUISize * 7.5, 'enemy', 0).setOrigin(0, 0);
                    //add local physics colliders to the new object
                    console.log("spawn");
                    this.physics.add.collider(this.platformGroup, this.spawn);
                    this.physics.add.collider(
                        this.runner,
                        this.spawn,
                        () => {
                            console.log('hit');
                            this.gameOver = true;
                            this.runner.alive = false;
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
    addPlatform(platformWidth, posX, posY) {
        if (this.gameOver) {
            return;
        }
        this.addedPlatforms++;
        let platform;
        if (this.platformPool.getLength()) {//if platform pool has anything in it
            //making supsequent platforms
            platform = this.platformPool.getFirst();
            platform.x = posX;
            platform.y = posY;
            platform.active = true;
            platform.visible = true;
            platform.body.allowGravity = false;
            platform.body.setImmovable(true);
            this.platformPool.remove(platform);
            //let newRatio = platformWidth / platform.displayWidth;
            platform.displayWidth = platformWidth;
            platform.tileScaleX = 1 / platform.scaleX;
        }
        else {
            //making the first platform
            platform = this.add.tileSprite(posX, posY, platformWidth, 150, "platform");
            this.physics.add.existing(platform);
            platform.body.allowGravity = false;
            platform.body.setImmovable(true);
            platform.body.setVelocityX(gameOptions.floorSpeed);
            this.platformGroup.add(platform);
        }
        this.nextPlatformDistance = Phaser.Math.Between(gameOptions.spawnRange[0], gameOptions.spawnRange[1]);
    }

    addFloor(floorWidth, posX, posY) {
        if (this.gameOver) {
            return;
        }
        this.addedFloors++;
        let floor;
        if (this.floorPool.getLength()) {
            floor = this.floorPool.getFirst();
            floor.x = posX;
            floor.y = posY;
            floor.active = true;
            floor.visible = true;
            floor.body.allowGravity = false;
            floor.body.setImmovable(true);
            this.floorPool.remove(floor);
            //let newRatio = floorWidth / floor.displayWidth;
            floor.displayWidth = floorWidth;
            floor.tileScaleX = 1 / floor.scaleX;
        }
        else {
            floor = this.add.tileSprite(posX, posY, floorWidth, 32, "floor");
            this.physics.add.existing(floor);
            floor.body.allowGravity = false;
            floor.body.setImmovable(true);
            floor.body.setVelocityX(gameOptions.floorSpeed);
            this.floorGroup.add(floor);
        }
        this.nextFloorDistance = Phaser.Math.Between(gameOptions.spawnRange[0], gameOptions.spawnRange[1]);
    }
    // the runner jumps when on the ground, or once in the air as long as there are jumps left and the first jump was on the ground
    


    update() {
        this.scoreText.text = score;
        //If game over, check input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
            //Debug way to check high score
            //TODO: Display on Game Over screen
            console.log(highScore);
        }
        //if character falls off, automatic restart from the beginning 
        if (this.runner.y > game.config.height) {
            this.gameOver = true;
            
        }

        //runner death SFX
        if (this.gameOver) {
            let deathVar = Math.floor(Math.random()*2);
            if (this.runner.animal == animal.HUMAN) {
                if (deathVar == 0) {
                    this.sound.play('hDeath1');
                } else if (deathVar == 1) {
                    this.sound.play('hDeath2');
                }
            } else if (this.runner.animal == animal.WOLF) {
                if (deathVar == 0) {
                    this.sound.play('wDeath1');
                } else if (deathVar == 1) {
                    this.sound.play('wDeath2');
                }
            } else if (this.runner.animal == animal.MONKEY) {
                if (deathVar == 0) {
                    this.sound.play('mDeath1');
                } else if (deathVar == 1) {
                    this.sound.play('mDeath2');
                }
            }
        }

        // recycling platforms
        let minDistance = game.config.width;
        let rightmostPlatformHeight = 0;
        this.platformGroup.getChildren().forEach(function (platform) {
            let platformDistance = game.config.width - platform.x - platform.displayWidth / 2;
            if (platformDistance <= minDistance) {
                minDistance = platformDistance;
                rightmostPlatformHeight = platform.y;
            }
            if (platform.x < - platform.displayWidth / 2) {
                this.platformGroup.killAndHide(platform);
                this.platformGroup.remove(platform);
            }
        }, this);

        // adding new platforms
        if (minDistance > this.nextPlatformDistance) {
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
        this.floorGroup.getChildren().forEach(function (floor) {
            let floorDistance = game.config.width - floor.x - floor.displayWidth / 2;
            if (floorDistance < minDistance) {
                minDistance = floorDistance;
                rightmostFloorHeight = floor.y;
            }
            if (floor.x < - floor.displayWidth / 2) {
                this.floorGroup.killAndHide(floor);
                this.floorGroup.remove(floor);
            }
        }, this);
        // adding new floors
        if (minDistance > this.nextFloorDistance) {
            let nextFloorWidth = Phaser.Math.Between(gameOptions.floorSizeRange[0], gameOptions.floorSizeRange[1]);
            let floorRandomHeight = gameOptions.floorHeighScale * Phaser.Math.Between(gameOptions.floorHeightRange[0], gameOptions.floorHeightRange[1]);
            let nextFloorGap = rightmostFloorHeight + floorRandomHeight;
            let minFloorHeight = game.config.height * gameOptions.floorVerticalLimit[0];
            let maxFloorHeight = game.config.height * gameOptions.floorVerticalLimit[1];
            let nextFloorHeight = Phaser.Math.Clamp(nextFloorGap, minFloorHeight, maxFloorHeight);
            this.addFloor(nextFloorWidth, game.config.width + nextFloorWidth / 2, nextFloorHeight);
        }


        if (!this.gameOver) {
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

            if (this.runner.body.touching.down) {
               this.runner.body.setVelocityX(-gameOptions.floorSpeed);
            } else {
                this.runner.body.setVelocityX(0);//avoids boost when no friction
            }

            // Jump
            if (this.cursors.up.isDown && this.runner.body.touching.down) {
                this.runner.jumping = true;
                
                let jumpVar = Math.floor(Math.random()*3);
                if (this.runner.animal == animal.WOLF) {
                    if (jumpVar == 0) {
                        this.sound.play('wJump1');
                    } else if (jumpVar == 1) {
                        this.sound.play('wJump2');
                    } else if (jumpVar == 2) {
                        this.sound.play('wJump3');
                    }

                } else if (this.runner.animal == animal.HUMAN) {
                    if (jumpVar == 0) {
                        this.sound.play('hJump1');
                    } else if (jumpVar == 1) {
                        this.sound.play('hJump2');
                    } else if (jumpVar == 2) {
                        this.sound.play('hJump3');
                    }

                } else if (this.runner.animal == animal.MONKEY) {
                    if (jumpVar == 0) {
                        this.sound.play('mJump1');
                    } else if (jumpVar == 1) {
                        this.sound.play('mJump2');
                    } else if (jumpVar == 2) {
                        this.sound.play('mJump3');
                    }
                }
                 
                //this.runner.body.setVelocityY(-650);
            }

            
            if(this.runner.jumping){
                console.log("jumping");
                if(this.cursors.up.isDown){
                    console.log("calling jump");
                    this.runner.jump();
                }
            }


            if(this.runner.body.touching.down && this.runner.jumping){
                this.runner.jumping = false;
                this.runner.currUpVel = 0;
            }

            //------Hanging logic-------
            if (this.cursors.up.isDown && this.runner.body.touching.up) {
                this.runner.hanging = true;
            }

            if (this.runner.hanging) {
                this.runner.body.allowGravity = false;
                if (this.cursors.up.isUp) {
                    this.runner.hanging = false;
                    this.runner.body.allowGravity = true;
                }
            }
            //--------------------------
            this.enemyArray.forEach(enemy => enemy.update());

            if (this.cursors.left.isDown) {
                this.runner.change(animal.WOLF)
            }

            if (this.cursors.down.isDown) {
                this.runner.change(animal.HUMAN)
            }

            if (this.cursors.right.isDown) {
                this.runner.change(animal.MONKEY)
            }
        }
        else {
            if (score > highScore) {
                highScore = score;
            }

            this.enemyArray.forEach(enemy => enemy.destroy());
        }
    }
}

/*
    jump() {
        if (this.runner.body.touching.down || (this.runnerJumps > 0 && this.runnerJumps < gameOptions.jumps)) {
            if (this.runner.body.touching.down) {
                this.runnerJumps = 0;
            }
            this.runner.setVelocityY(gameOptions.jumpForceMax);
            //this.runnerJumps++;

            // stops animation
            this.runner.anims.stop();
        }
    }
*/