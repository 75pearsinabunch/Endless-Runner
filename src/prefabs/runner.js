class Runner extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        //add physics
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.color = colors.RED;
        this.body.gravity.y = 1000;
    }

    update() {
        
    }

    reset() {
        console.log("hit");
        this.alive = true;
        this.alpha = 0;
    }

    colorChange(color){
        this.color = color;
        this.setTint(color);
    }
}