class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        //Load Sprites
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
        this.load.spritesheet('balloon', 'assets/balloon.png', { frameWidth: 85, frameHeight: 74 });

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
        this.load.audio('eSFX1', 'assets/audio/EnemySFX01.wav');
        this.load.audio('eSFX2', 'assets/audio/EnemySFX02.wav');
        this.load.audio('eSFX2', 'assets/audio/EnemySFX03.wav');
        this.load.audio('runSFX', 'assets/audio/Running.wav');
        this.load.audio('formChange', 'assets/audio/FormChange.wav');

    }

    create() {

        //------------Setting up sound----------------
        let runConfig = {
            mute: false,
            volume: 0.1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: false,
            delay: 0
        }
        this.runningSFX = this.sound.add('runSFX', runConfig);
        
        this.hDeathSFX1 = this.sound.add('hDeath1');
        this.hDeathSFX2 = this.sound.add('hDeath2');
        this.wDeathSFX1 = this.sound.add('wDeath1');
        this.wDeathSFX2 = this.sound.add('wDeath2');
        this.mDeathSFX1 = this.sound.add('mDeath1');
        this.mDeathSFX2 = this.sound.add('mDeath2');
        
        this.formChange = this.sound.add('formChange');
        this.formChange.setVolume(0.3);

        //-----------GLOBAL VARIABLES------------
        // Set game over flag
        this.gameOver = false;
        this.balloonDirection = 1;

        //------------SPRITE ADDITIONS
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
        this.ui = this.add.image(-500, game.config.height - 160, 'ui').setOrigin(0, 0);

        //--------------Setting up scene render layers--------------------
        this.ui.setScale(.9);
        this.obstructionLayer = this.add.layer();//ADDING LAYER
        this.UILayer = this.add.layer();
        this.UILayer.add(this.ui)


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

        //----------Setting up platform cycling---------------

        // group with all active platforms.
        this.platformGroup = this.add.group();

        //floor platform seeder
        new Platform(this, 0, game.config.height - 150, game.config.width, 150, 'platform', this.platformGroup);
        new Platform(this, 0, game.config.height - 400, game.config.width, 50, 'platform', this.platformGroup);

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
        this.physics.add.collider(this.runner, this.platformGroup, (runner, platform) => {
            // play "run" animation if the runner is on a platform
            if (runner.body.touching.down && runner == this.runner) {
                if (!runner.anims.isPlaying || (this.currAnim != runner.animal)) {
                    this.currAnim = this.runner.animal;
                    runner.anims.play(this.currAnim);
                }
            }

            if (runner.body.touching.up) {
                //set animation stuff
                runner.grabPlatform(platform);
            }
        }, null, this);

        //--------Initialize Keys-------------------
        this.cursors = this.input.keyboard.createCursorKeys();
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        //---------Enemies------------------
        this.possEnemies = {
            ground: 0,
            crowd: 1,
            roof: 2,
        };

        //A group of enemies that kill player on contact
        this.enemyGroup = this.add.group();
        this.collisionEnemies = this.add.group();
        this.physics.add.collider(this.platformGroup, this.enemyGroup);

        this.physics.add.collider(
            this.runner,
            this.collisionEnemies,
            () => {
                this.gameOver = true;
                this.runner.alive = false;
                this.runner.destroy();
            });

        //Init enemy array
        this.enemyArray = [];

        //Main Spawn System
        this.spawnClock = this.time.addEvent({
            //TODO: Random delay
            delay: 1000,
            callback: () => {
                //Spawn enemy if the game is still active
                if (!this.gameOver) {
                    //create a new enemy
                    //TODO: second zero here should be set to max no possible enemies
                    let spawnChoice = Phaser.Math.Between(0, 2);
                    switch (spawnChoice) {
                        case (this.possEnemies.ground):
                            this.spawn = new Enemy(this, game.config.width - 10, borderUISize * 7.5, 'enemy', 0).setOrigin(0, 0);
                            this.collisionEnemies.add(this.spawn);
                            this.enemyArray.push(this.spawn);
                            break;
                        case (this.possEnemies.crowd):
                            //spawns 5 enemies in a row to simulate a crowd
                            this.crowdSpawn();
                            break;
                        case(this.possEnemies.roof):
                            this.spawn = new PlatformEnemy(this, game.config.width - 10, borderUISize * 7.5, 'enemy', 0).setOrigin(0, 0);
                            this.collisionEnemies.add(this.spawn);
                            this.enemyArray.push(this.spawn);
                    }
                    //add local physics colliders to the new object

                }
            },
            callbackScope: this,
            loop: true
        });

        //----------------Balloon stuff--------------
        this.balloonStartingX = game.config.width - 100;
        this.balloon = this.add.sprite(this.balloonStartingX, 20, 'balloon').setOrigin(0);
        this.anims.create({
            key: "balloonFly",
            frames: this.anims.generateFrameNumbers("balloon", { start: 0, end: 2 }),
            frameRate: 1,
            repeat: -1
        });
        this.balloon.anims.play("balloonFly");

        this.runPlaying = false;
    }

    crowdSpawn() {
        for (let i = 0; i < 5; i++) {
            this.time.delayedCall(
                50 * i,//staggered spawning,
                () => {
                    this.spawn = new Crowd(this, game.config.width - 10, borderUISize * 7.5, 'TODO', 0).setOrigin(0, 0);
                    this.physics.add.overlap(this.runner, this.spawn, (runner) => {
                        if (runner.animal != animal.HUMAN) {
                            this.balloonDirection = 1;//set the baloon to be moving forward no matter what
                        }
                    })
                }
            )
        }
    }

    //returns a value that will be added to the balloon
    adjustBalloonSpeed() {
        switch (this.runner.animal) {
            case (animal.WOLF):
                if (this.runner.body.touching.down) {
                    this.balloonDirection = -1;
                } else {
                    this.balloonDirection = 0;
                }
                break;
            case (animal.MONKEY):
                if (this.runner.holdingPlatform) {
                    this.balloonDirection = -1
                } else {
                    this.balloonDirection = 1;
                }
                break;
            case (animal.HUMAN):
                if (this.runner.holdingPlatform) {
                    this.balloonDirection = 1;
                } else {
                    this.balloonDirection = 0;
                }
                break;
        }
        return (gameOptions.balloonSpeed * this.balloonDirection);
    }

    update() {
        this.scoreText.text = score;
        //If game over, check input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
            //Debug way to check high score
            //TODO: Display on Game Over screen
            //console.log(highScore);
        }

        //if character falls off, automatic restart from the beginning 
        if (this.runner.y > game.config.height) {
            this.gameOver = true;
        }

        //---------DeathSFX----------
        // if (this.gameOver) {
        //     let deathVar = Math.floor(Math.random()*2);
        //     switch (this.runner.animal) {
        //         case (animal.HUMAN): 
        //             if (deathVar == 0 && !this.hDeathSFX1.isPlaying) {
        //                 this.hDeathSFX1.play();
        //             } else if (deathVar == 1 && !this.hDeathSFX2.isPlaying) {
        //                 this.hDeathSFX2.play();
        //             } break;
        //         case (animal.WOLF): 
        //             if (deathVar == 0 && !this.wDeathSFX1.isPlaying) {
        //                 this.wDeathSFX1.play();
        //             } else if (deathVar == 1 && !this.wDeathSFX2.isPlaying) {
        //                 this.wDeathSFX2.play();
        //             } break;
        //         case (animal.MONKEY): 
        //             if (deathVar == 0 && !this.mDeathSFX1.isPlaying) {
        //                 this.mDeathSFX1.play();
        //             } else if (deathVar == 1 && !this.mDeathSFX2.isPlaying) {
        //                 this.mDeathSFX2.play();
        //             } break;
        //     } return this.gameOver == false;
        // } else if (!this.gameOver) {
        //         this.hDeathSFX1.stop();
        //         this.hDeathSFX2.stop();
        //         this.wDeathSFX1.stop();
        //         this.wDeathSFX2.stop();
        //         this.mDeathSFX1.stop();
        //         this.mDeathSFX2.stop();
        //     }

        this.platformGroup.getChildren().forEach(function (platform) { platform.update(); });


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

            //-----runner updates-------
            if (this.runner.body.touching.down) {
                //regain position if lost
                //if player is behind
                if (this.runner.x - gameOptions.runnerStartPosition < 20) {
                    this.runner.body.setVelocityX(-gameOptions.floorSpeed + 10);
                    //if player is ahead
                } else if (this.runner.x - gameOptions.runnerStartPosition > 20) {
                    this.runner.body.setVelocityX(-gameOptions.floorSpeed - 10);
                } else {
                    this.runner.body.setVelocityX(-gameOptions.floorSpeed);
                }
            } else {
                this.runner.body.setVelocityX(0);//avoids boost when no friction
            }

            //-------Jumping---------
            //begin jump
            if (this.runner.body.touching.down && this.cursors.up.isDown) {
                this.runner.body.setVelocityY(-100);
                this.runner.jumping = true;
                this.runner.anims.stop();
                this.timer = this.time.addEvent({
                    delay: 350,
                    callback: () => {
                        this.runner.jumping = false;
                        this.timer.destroy();
                    }
                })

                let jumpVar = Math.floor(Math.random() * 3);
                if (this.runner.animal == animal.HUMAN) {
                    if (jumpVar == 0) {
                        this.sound.play('hJump1');
                    } else if (jumpVar == 1) {
                        this.sound.play('hJump2');
                    } else if (jumpVar == 2) {
                        this.sound.play('hJump3');
                    }
                } else if (this.runner.animal == animal.WOLF) {
                    if (jumpVar == 0) {
                        this.sound.play('wJump1');
                    } else if (jumpVar == 1) {
                        this.sound.play('wJump2');
                    } else if (jumpVar == 2) {
                        this.sound.play('wJump3');
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
            }

            //sustained taller jump
            if (this.cursors.up.isDown && this.runner.jumping) {
                this.runner.body.setVelocityY(gameOptions.jumpForceMax);
            }

            if (this.runner.anims.isPlaying && !this.runningSFX.isPlaying) {
                //runPlaying = true;
                this.runningSFX.play();
            } else if (!this.runner.anims.isPlaying && this.runningSFX.isPlaying) {
                //runPlaying = false;
                this.runningSFX.stop();
            }

            //------Hanging logic-------
            if (this.cursors.up.isDown && this.runner.holdingPlatform) {
                if ((this.runner.x - this.runner.holdingPlatform.x) > this.runner.holdingPlatform.width) {
                    this.runner.letGo();
                }

                if (this.runner.body.touching.right) {
                    this.runner.letGo();
                }

                if (this.runner.animal == animal.MONKEY) {
                    this.runner.body.allowGravity = false;
                }

                if (this.runner.animal == animal.HUMAN) {
                    this.runner.body.allowGravity = false;
                }
            } else {
                this.runner.letGo();
            }
            //------ENEMY UPDATES--------------

            this.enemyArray.forEach(enemy => enemy.update());

            //-------CHANGING SHAPE--------
        
            if (this.cursors.left.isDown) {
                this.runner.change(animal.WOLF)
                this.formChange.play();
            }

            if (this.cursors.down.isDown) {
                this.runner.change(animal.HUMAN);
                this.formChange.play();
            }

            if (this.cursors.right.isDown) {
                this.runner.change(animal.MONKEY);
                this.formChange.play();
            }

            //----------BALLOON LOGIC--------
            if (this.balloon.x > game.config.width) {
                this.gameOver = true;
            }

            this.balloon.x = Phaser.Math.Clamp(this.balloon.x + this.adjustBalloonSpeed(),
                game.config.width / 2,
                game.config.width + this.balloon.width + 1);//allows balloon to leave fully
        }
        else {
            if (score > highScore) {
                highScore = score;
            }

            //stopping all animations
            this.balloon.anims.stop();
            if (this.runner.anims) {
                this.runner.anims.stop();
            }
            if (this.runningSFX.isPlaying) {
                this.runningSFX.stop();
            }
            this.enemyArray.forEach(enemy => enemy.destroy());
        }
    }
}
