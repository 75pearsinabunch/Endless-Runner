class Enemy extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame);
        this.image = scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.enemyGroup.add(this);
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
    }
}
