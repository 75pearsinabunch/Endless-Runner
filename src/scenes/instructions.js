class Instructions extends Phaser.Scene {
    constructor() {
        super("instructionsScene");
    }
    preload() {
        this.load.image('cover', 'assets/singles/jungle.png');
        this.load.audio('music', 'assets/audio/BGMusic.wav');
    }
    create() {
        let menuConfig = {
            fontSize: '28px',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        this.cover = this.add.image(game.config.width / 2, game.config.height / 2, 'cover');
        this.cover.setDisplaySize(game.config.width, game.config.height);

        this.add.rectangle(game.config.width / 10, game.config.height / 9, game.config.width / 1.25, game.config.height * .7 , 0x000000).setOrigin(0, 0);
        this.add.text(game.config.width / 2, game.config.height / 4 - borderUISize - borderPadding, 'You spotted a balloon in the distant.', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width / 2, game.config.height / 3 - borderUISize - borderPadding, 'Where is it going?', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width / 2, game.config.height / 2.5 - borderUISize - borderPadding, 'Jump over obstacles or\n hold onto the cieling (↑) and', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width / 2, game.config.height / 1.75 - borderUISize - borderPadding, 'transform to investigate.\n  (←) Wolf moves faster on ground\n (→) Monkey Moves faster when climbing\n (↓) Human isn\'t impeded by other humans', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width / 2, game.config.height / 1.5, 'Use S to start', menuConfig).setOrigin(0.5);

        menuConfig.backgroundColor = "#00FF00";
        menuConfig.color = '#000';
        menuConfig.stroke = '#000000';
        menuConfig.strokeThickness = 6;
        menuConfig.boundsAlignH = "center";

        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

        let musicConfig = {
            mute: false,
            volume: 0.7,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        }
        this.music = this.sound.add('music', musicConfig);
    }
    update() {
        if (Phaser.Input.Keyboard.JustDown(keyS)) {
            // easy mode
            this.scene.start('playScene');
        }
    }
}