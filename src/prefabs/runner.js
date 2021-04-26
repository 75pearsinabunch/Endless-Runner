class Runner extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        //add physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.gravity.y = 1000;
    }

    update() {
        
    }

    reset() {
        console.log("hit");
        this.alive = true;
        this.alpha = 0;
    }
}