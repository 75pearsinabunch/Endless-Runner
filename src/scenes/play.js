class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.atlas('sprites', 'assets/spritesheet.png', 'assets/sprites.json');
         this.load.image('sprites','grounds');


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
        //Debug BG Assets
        this.jungle = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'sprites', 'jungle').setOrigin(0);
        this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'sprites', 'background').setOrigin(0, 0);
        this.backtreeroot = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'sprites', 'backtreeroot').setOrigin(0, 0);
        this.bush = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'sprites', 'bush').setOrigin(0, 0);
        this.vine = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'sprites', 'vine').setOrigin(0, 0);
        this.frountroot = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'sprites', 'frontroot').setOrigin(0, 0);
        this.backtree = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'sprites', 'backtree').setOrigin(0, 0);
        this.frontree = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'sprites', 'frontree').setOrigin(0, 0);
        this.topbush = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'sprites', 'topbush').setOrigin(0, 0);
        this.ground = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'sprites', 'ground').setOrigin(0, 0);
        this.ui = this.add.image(0, game.config.height - 160, 'sprites', 'UI').setOrigin(0, 0);

        this.platformTexture = (this, 'grounds', 'sprites')

        //-----------Setting up Animations-----------
        //--PLAYER ANIMS--
        this.anims.create({
            key: 'wolf_run',
            frames: this.anims.generateFrameNames('sprites', { prefix: 'wolf', start: 1, end: 10, zeroPad: 4 }),
            repeat: -1
        });

        this.anims.create({
            key: 'monkey_run',
            frames: this.anims.generateFrameNames('sprites', { prefix: 'monkey', start: 0, end: 10, zeroPad: 4 }),
            repeat: -1
        });

        this.anims.create({
            key: 'human_run',
            frames: this.anims.generateFrameNames('sprites', { prefix: 'human', start: 0, end: 11, zeroPad: 4 }),
            repeat: -1
        });

        this.anims.create({
            key: 'monkey_climb',
            frames: this.anims.generateFrameNames('sprites', { prefix: 'monkey', start: 11, end: 21, zeroPad: 4 }),
            repeat: -1
        });

        this.anims.create({
            key: 'human_climb',
            frames: this.anims.generateFrameNames('sprites', { prefix: 'human', start: 12, end: 22, zeroPad: 4 }),
            repeat: -1
        });

        this.currAnim = null;

        //--ENEMY ANIMS--
        this.anims.create({
            key: 'rock_roll',
            frames: this.anims.generateFrameNames('sprites', { prefix: 'rock', start: 1, end: 10, zeroPad: 4 }),
            repeat: -1
        });

        this.anims.create({
            key: 'bat_flap',
            frames: this.anims.generateFrameNames('sprites', { prefix: 'bat', start: 1, end: 10, zeroPad: 4 }),
            repeat: -1
        });

        this.anims.create({
            key: 'balloon_fly',
            frames: this.anims.generateFrameNames('sprites', { prefix: 'ballon', start: 1, end: 3 }),
            repeat: -1
        });

        this.anims.create({
            key: 'crowd_run',
            frames: this.anims.generateFrameNames('sprites', { prefix: 'tourist', start: 0, end: 10, zeroPad: 4 }),
            repeat: -1
        });

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
            fontSize: '48px', color: '#FFFFFF', align: 'center', stroke: '#000000',
            padding: { top: 4, bottom: 4, },
            fixedWidth: 100
        }

        this.scoreText = this.add.text(borderUISize + borderPadding / 2, borderUISize + borderPadding / 2, score, scoreConfig);

        //----------Setting up platform cycling---------------

        // group with all active platforms.
        this.platformGroup = this.add.group();

        this.groundImage = this.add
        //floor platform seeder
        //sets one platform high enough to be upper, and another low enough to be lower
        new Platform(this, 0, gameOptions.floorVerticalLimit[1]*game.config.height,  game.config.width, 150, 'sprites', 'grounds',this.platformGroup);
        new Platform(this, 0, gameOptions.cielVerticalLimit[1]*game.config.height/1.25, game.config.width, 50, 'sprites', 'grounds', this.platformGroup);



        //--------------Adding the Runner------------------
        this.runner = new Runner(this, gameOptions.runnerStartPosition, game.config.height * 0.685, 'sprites', 'wolf_run',0);

        //------------Player Collision----------------------
        // setting collisions between the runner and the platform group
        this.physics.add.collider(this.runner, this.platformGroup, (runner, platform) => {
            // play "run" animation if the runner is on a platform
            if (runner.body.touching.down && runner == this.runner) {
                if (!runner.anims.isPlaying || (this.currAnim != runner.animal)) {
                    this.currAnim = this.runner.animal;
                    runner.anims.play(this.currAnim+'_run');
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
                this.the_end();
                this.runner.destroy();
            });

        //Init enemy array
        this.enemyArray = [];

        //Main Spawn System
        this.spawnClock = this.time.addEvent({
            //TODO: Random delay
            delay: 1500,
            callback: () => {
                //Spawn enemy if the game is still active
                if (!this.gameOver) {
                    //create a new enemy
                    //TODO: second zero here should be set to max no possible enemies
                    let spawnChoice = Phaser.Math.Between(0, 2);
                    switch (spawnChoice) {
                        case (this.possEnemies.ground):
                            this.spawn = new Enemy(this, game.config.width - 10, borderUISize * 7.5, 'sprites', 'rock_roll', 0).setOrigin(0, 0);
                            this.spawn.anims.play('rock_roll')
                            this.collisionEnemies.add(this.spawn);
                            this.enemyArray.push(this.spawn);
                            break;
                        case (this.possEnemies.crowd):
                            //spawns 5 enemies in a row to simulate a crowd
                            this.crowdSpawn();
                            break;
                        case (this.possEnemies.roof):
                            this.spawn = new PlatformEnemy(this, game.config.width - 10, borderUISize * 7.5, 'sprites', 'batStatic', 0).setOrigin(0, 0);
                            this.spawn.anims.play('bat_flap');
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
        this.balloon = this.add.sprite(this.balloonStartingX, 20,'sprites', 'balloon').setOrigin(0);
        this.balloon.anims.play("balloon_fly");

        this.runPlaying = false;
    }

    crowdSpawn() {
        for (let i = 0; i < 5; i++) {
            this.time.delayedCall(
                50 * i,//staggered spawning,
                () => {
                    this.spawn = new Enemy(this, game.config.width - 10, borderUISize * 7.5,'sprites', 'crowd_run', 0).setOrigin(0, 0);
                    this.spawn.anims.play('crowd_run')
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

    //just tells the player that game over and press restart
    the_end(){
        this.add.rectangle(game.config.width/3.15, game.config.height/2.25, game.config.width/2.75, game.config.height/4, 0x000000).setOrigin(0, 0);
        this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER, the balloon escaped').setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart').setOrigin(0.5);
    }

    update() {
        this.scoreText.text = score;
        //If game over, check input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        //if character falls off, automatic restart from the beginning 
        if (this.runner.y > game.config.height) {
            this.the_end();
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
