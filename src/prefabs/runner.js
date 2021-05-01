class Runner extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        //add physics
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.hanging = false;
        this.alive = true;
        this.animal = animal.WOLF
        this.body.gravity.y = 1000;
        this.jumps = 0;//number consecutive jumps
    }

    update() {
        
    }

    getPosVec(){
        return new Phaser.Math.Vector2(this.x, this.y);
    }

    reset() {
        console.log("hit");
        this.alive = true;
        this.alpha = 0;
    }

    change(animal){
        this.animal = animal;
    }
    runAnim(){
        
    }
}