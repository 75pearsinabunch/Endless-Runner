/*
    Holds information about the runner main character and its behaviors/properties
    Constructor takes in the scene and information necessary to instantiate an 
    arcade sprite. 
*/

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

    //Called to reset the game
    reset() {
        this.alive = true;
        this.alpha = 0;
    }

    //setter for animal field
    change(animal){
        this.animal = animal;
    }

    //A reference to a platform that has been 
    //grabbed most recently (i.e. that the player
    //touched while holding up)
    grabPlatform(platform){
        this.holdingPlatform = platform;
    }

    //undoes the affects of holding a platform
    letGo(){
        this.holdingPlatform = null;
        this.body.allowGravity = true;
    }
}