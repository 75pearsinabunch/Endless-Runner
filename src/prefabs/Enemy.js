class Enemy extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setVelocityX(-500);
        this.body.gravity.y = 1000;
        this.alive = true;
    }

    update(){
        if(this.x <= 0 - this.width && this.alive)
        {
            this.reset();
            score++;
        }  
    }

    reset() {
        this.destroy();
        this.alive = false;
        //this.x = game.config.width + 50;
        //this.alpha = 1;
    }
}
