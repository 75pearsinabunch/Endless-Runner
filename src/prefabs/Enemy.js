class Enemy extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame);
        this.image = scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.enemyGroup.add(this);
        this.body.setVelocityX(-500);
        this.body.gravity.y = 1000;
        this.jumpPower = -100;
        this.alive = true;
    }

    update(){
        if(!this.alive){
            return;
        }
        if(this.x <= 0 - this.width && this.alive)
        {
            this.reset();
            score++;
        }  

        if(this.body && (this.body.touching.left && this.body.touching.down)){
            this.jump();
        }
    }

    jump(){
        this.body.setVelocityY(this.jumpPower);
        this.time.delayedCall(
            250,
            ()=>{this.body.setVelocityY(0);}
        );
    }

    reset() {
        this.destroy();
        this.alive = false;
    }
}
