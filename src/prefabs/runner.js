class Runner extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, atlas, texture, frame) {
        super(scene, x, y, atlas, texture, frame).setOrigin(0);

        //add physics
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.hanging = false;
        this.alive = true;
        this.animal = animal.WOLF;
        this.body.gravity.y = 1000;
        this.jumping = false;
        this.holdingPlatform = null;
    }

    reset() {
        this.alive = true;
        this.alpha = 0;
    }

    change(animal){
        this.animal = animal;
    }

    grabPlatform(platform){
        this.holdingPlatform = platform;
    }

    letGo(){
        this.holdingPlatform = null;
        this.body.allowGravity = true;
    }
}