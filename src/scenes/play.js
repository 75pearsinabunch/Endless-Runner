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

        // group with all active platforms.
        this.platformGroup = this.add.group();

        //floor platform seeder
        new Platform(this, 0, game.config.height-150, game.config.width, 150, 'platform', this.platformGroup);
        new Platform(this, 0, game.config.height-400, game.config.width, 50, 'platform', this.platformGroup);

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
        this.physics.add.collider(this.runner, this.platformGroup, function (runner, platform) {
            // play "run" animation if the runner is on a platform
            if(this.runner.touching.down){
                if (!this.runner.anims.isPlaying || (this.currAnim != this.runner.animal)) {
                    this.currAnim = this.runner.animal;
                    this.runner.anims.play(this.currAnim);
                }
            }else if(this.runner.touching.up){
                console.log("Registering up touch");
                runner.grabPlatform(platform);//STOPPED WORKING HERE, YET UNTESTED
            }
        }, null, this);

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

        this.platformGroup.getChildren().forEach(function (platform){platform.update();});


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
                if(this.runner.x-gameOptions.runnerStartPosition < 20){
                     this.runner.body.setVelocityX(-gameOptions.floorSpeed + 10);
                //if player is ahead
                }else if(this.runner.x-gameOptions.runnerStartPosition > 20){
                    this.runner.body.setVelocityX(-gameOptions.floorSpeed - 10);
                }else{
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
                    delay: 250,
                    callback: () => {
                        this.runner.jumping = false;
                        this.timer.destroy();
                    }
                })
            }

            //sustained taller jump
            if (this.cursors.up.isDown && this.runner.jumping) {
                console.log("jumping");
                this.runner.body.setVelocityY(gameOptions.jumpForceMax);
            }

            //------Hanging logic-------
            if (this.cursors.up.isDown && this.runner.body.touching.up) {
                this.runner.body.allowGravity = false;
                this.runner.hanging = true;
            }else{
                this.runner.body.allowGravity = true;
                this.runner.hanging = false;
            }

            /*if (this.runner.hanging) {
                if (this.cursors.up.isUp || this.runner.body.touching.up) {
                    this.runner.hanging = false;
                    this.runner.body.allowGravity = true;
                }
            }
            */
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
