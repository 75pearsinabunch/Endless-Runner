/*
Based on Alvaro Perez's original tile script and Professor Nathan Altice's Paddle Parkour
This is an object which recursively instantiates a copy of itself as soon as it gets a
distance (set randomly within a range) from the right side of the screen. 

Constructor takes arguements required for making a tilesprite, but also arguements for 
the scene this will go in and the physics group it will be place into (for this code this
means either above tiles or below tiles)
*/
class Platform extends Phaser.GameObjects.TileSprite {

    constructor(scene, oX, oY, width, height, atlas, texture, group) {

        super(scene, oX, oY, width, height, atlas, texture).setOrigin(0);
        //setting visual and physical properties
        this.image = scene.add.existing(this);
        scene.obstructionLayer.add(this.image);//add image to layer in main scene
        scene.physics.add.existing(this);
        this.body.allowGravity = false;
        this.body.setImmovable(true);
        this.body.setVelocityX(gameOptions.floorSpeed);

        group.add(this);
        //create a structure to hold starting data for later instantiation
        this.startData = {
            scene: scene,
            oX: oX,
            oY: oY,
            width: width,
            height: height,
            atlas: atlas,
            texture: texture,
            group: group
        };
        //generates a random gap between this platform and the next one to follow it
        this.nextPlatformGap = Phaser.Math.Between(...gameOptions.platformSeparationRange);
        this.hasSpawned = false;
        //console.log(this.separationPoint);
    }

    update() {
        if (this.startData.scene.gameOver) {
            this.body.setVelocityX(0);
        }
        //if the platform leaves the screen we remove it
        if ((this.x + this.width) < 0) {
            this.startData.group.remove(this);
            this.destroy();
        }

        //makes a new platform if it gets a randomized distance from the right of the screen
        if ((this.x < (game.config.width - this.nextPlatformGap)) && !this.hasSpawned) {
            this.hasSpawned = true;
            this.createReplacement();
        }
    }

    //Generates a random height (float) based off the current height of this platform.
    generateNextHeight() {
        let nextHeight = this.startData.oY + Phaser.Math.Between(...gameOptions.platformHeightRange) * gameOptions.platformHeightScale;
        if (this.startData.oY <= gameOptions.cielVerticalLimit[1] * game.config.height) {
            //Clamps to upper portion of screen
            nextHeight = Phaser.Math.Clamp(nextHeight,
                gameOptions.cielVerticalLimit[0] * game.config.height,
                gameOptions.cielVerticalLimit[1] * game.config.height)
        } else {
            //clamps to lower portion
            nextHeight = Phaser.Math.Clamp(nextHeight,
                gameOptions.floorVerticalLimit[0] * game.config.height,
                gameOptions.floorVerticalLimit[1] * game.config.height)
        }
        return nextHeight;
    }

    //Instantiates new platform
    createReplacement() {
        (new Platform(
            //scene
            this.startData.scene,//constant
            //starting x
            game.config.width,//constant
            //starting y
            this.generateNextHeight(),
            //width
            Phaser.Math.Between(...gameOptions.platformSizeRange),
            //height
            this.startData.height,
            //atlas
            this.startData.atlas,//constant
            //texture
            this.startData.texture,//constant
            //group
            this.startData.group//constant
        ));
    }
}
