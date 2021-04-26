class TitleScreen extends Phaser.Scene{
    constructor(){
        super({key: 'TitleScreen'});
    }
    preload(){
        this.load.image('background_image', 'assets/jungle.png');

    }
    create(){
        let background = this.add.sprite(0, 0 , 'background_image');
        background.setOrigin(0,0);


    }
}
export default TitleScreen;