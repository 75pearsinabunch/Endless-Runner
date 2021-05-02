class Platform extends Phaser.GameObjects.TileSprite{

  constructor(scene, oX, oY, width, height, texture, group){
    super(scene, oX,oY,width, height, texture).setOrigin(0);
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
      oY:oY, 
      width: width, 
      height: height, 
      texture: texture, 
      group: group
    };
    //generates a random gap between this platform and the next one to follow it
    this.nextPlatformGap = Phaser.Math.Between(...gameOptions.platformSeparationRange);
    this.hasSpawned = false;
    //console.log(this.separationPoint);
  }

  update(){
    if(this.startData.scene.gameOver){
      this.body.setVelocityX(0);
    }
    //if the platform leaves the screen we remove it
    if((this.x+this.width)<0){
      this.startData.group.remove(this);
      this.destroy();
    }

    //makes a new platform if it gets a randomized distance from the right of the screen
    if((this.x<(game.config.width-this.nextPlatformGap))&& !this.hasSpawned){
      this.hasSpawned = true;
      this.createReplacement();
    }
  }

  generateNextHeight(){
        let nextHeight = this.startData.oY + Phaser.Math.Between(...gameOptions.platformHeightRange)*gameOptions.platformHeightScale;
        if(this.startData.oY<=gameOptions.cielVerticalLimit[1]*game.config.height){
          //Clamps to upper portion of screen
          nextHeight = Phaser.Math.Clamp(nextHeight, 
                                        gameOptions.cielVerticalLimit[0]*game.config.height,
                                        gameOptions.cielVerticalLimit[1]*game.config.height)
        }else{
          //clamps to lower portion
                    nextHeight = Phaser.Math.Clamp(nextHeight, 
                                        gameOptions.floorVerticalLimit[0]*game.config.height,
                                        gameOptions.floorVerticalLimit[1]*game.config.height)
        }
        return nextHeight;
  }

  createReplacement(){
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
      //texture
      this.startData.texture,//constant?
      //group
      this.startData.group//constant
    ));
  }
}

/*
        // keeping track of added platforms
        //this.addedPlatforms = 0;

        // adding a platform to the game, the arguments are platform width, x position and y position
        //this.addPlatform(game.config.width, game.config.width / 2, game.config.height * 0.95);
        //this.addFloor(game.config.width / 20, game.config.height / 2, game.config.height * 0.35);

        //this.floorGroup = this.add.group({
            // once a platform is removed, it's added to the pool
            //removeCallback: function (floor) {
            //    floor.scene.floorPool.add(floor)
            //}
        //});
      
            // platform pool
            this.platformPool = this.add.group({
                // once a platform is removed from the pool, it's added to the active platforms group
                removeCallback: function (platform) {
                    platform.scene.platformGroup.add(platform)
                }
            });
    

            this.floorPool = this.add.group({
                // once a platform is removed from the pool, it's added to the active platforms group
                removeCallback: function (floor) {
                    floor.scene.floorGroup.add(floor)
                }
            });
           


Rad code I still wanna use:      
        // recycling platforms
        let minDistance = game.config.width;
        let leftmostPlatformHeight = 0;
        this.platformGroup.getChildren().forEach(function (platform) {
            //platform distance is screen widt - platform position - 
            let platformDistance = game.config.width - platform.x;// - platform.displayWidth / 2;
            //finds the platform height furthest left
            if (platformDistance <= minDistance) {
                minDistance = platformDistance;
                leftmostPlatformHeight = platform.y;
            }

            if(platform.x>0)
            this.createReplacement()

            if (platform.x+platform.displayWidth <0){// - platform.displayWidth / 2) {
                this.platformGroup.killAndHide(platform);
                this.platformGroup.remove(platform);
                
            }
        }, this);

        // adding new platforms
        /*
        if (minDistance > this.nextPlatformDistance) {
            let nextPlatformWidth = Phaser.Math.Between(gameOptions.platformSizeRange[0], gameOptions.platformSizeRange[1]);
            let platformRandomHeight = gameOptions.platformHeighScale * Phaser.Math.Between(gameOptions.platformHeightRange[0], gameOptions.platformHeightRange[1]);
            let nextPlatformGap = rightmostPlatformHeight + platformRandomHeight;
            let minPlatformHeight = game.config.height * gameOptions.platformVerticalLimit[0];
            let maxPlatformHeight = game.config.height * gameOptions.platformVerticalLimit[1];
            let nextPlatformHeight = Phaser.Math.Clamp(nextPlatformGap, minPlatformHeight, maxPlatformHeight);
            this.addPlatform(nextPlatformWidth, game.config.width + nextPlatformWidth / 2, nextPlatformHeight);
        }
        // recycling floors - same thing as platform but up higher
        let rightmostFloorHeight = 0;
        this.floorGroup.getChildren().forEach(function (floor) {
            let floorDistance = game.config.width - floor.x - floor.displayWidth / 2;
            if (floorDistance < minDistance) {
                minDistance = floorDistance;
                rightmostFloorHeight = floor.y;
            }
            if (floor.x < - floor.displayWidth / 2) {
                this.floorGroup.killAndHide(floor);
                this.floorGroup.remove(floor);
            }
        }, this);
        // adding new floors
        if (minDistance > this.nextFloorDistance) {
            let nextFloorWidth = Phaser.Math.Between(gameOptions.floorSizeRange[0], gameOptions.floorSizeRange[1]);
            let floorRandomHeight = gameOptions.floorHeighScale * Phaser.Math.Between(gameOptions.floorHeightRange[0], gameOptions.floorHeightRange[1]);
            let nextFloorGap = rightmostFloorHeight + floorRandomHeight;
            let minFloorHeight = game.config.height * gameOptions.floorVerticalLimit[0];
            let maxFloorHeight = game.config.height * gameOptions.floorVerticalLimit[1];
            let nextFloorHeight = Phaser.Math.Clamp(nextFloorGap, minFloorHeight, maxFloorHeight);
            this.addFloor(nextFloorWidth, game.config.width + nextFloorWidth / 2, nextFloorHeight);
        }
        */


    /*
    // the core of the script: platform are added from the pool or created on the fly
    addPlatform(platformWidth, posX, posY) {
        if (this.gameOver) {
            return;
        }
        //this.addedPlatforms++;
        /*let platform;
        if (this.platformPool.getLength()) {//if platform pool has anything in it
            //making supsequent platforms
            platform = this.platformPool.getFirst();
            platform.x = posX;
            platform.y = posY;
            platform.active = true;
            platform.visible = true;
            platform.body.allowGravity = false;
            platform.body.setImmovable(true);
            this.platformPool.remove(platform);
            //let newRatio = platformWidth / platform.displayWidth;
            platform.displayWidth = platformWidth;
            platform.tileScaleX = 1 / platform.scaleX;
        }
        else {
            */
        //making the first platform
        /*
        let platform = this.add.tileSprite(posX, posY, platformWidth, 150, "platform").setOrigin(0);
        this.physics.add.existing(platform);
        platform.body.allowGravity = false;
        platform.body.setImmovable(true);
        platform.body.setVelocityX(gameOptions.floorSpeed);
        this.platformGroup.add(platform);
        //}
        
        //this.nextPlatformDistance = Phaser.Math.Between(gameOptions.spawnRange[0], gameOptions.spawnRange[1]);
    }

    addFloor(floorWidth, posX, posY) {
        if (this.gameOver) {
            return;
        }
        /*
        this.addedFloors++;
        let floor;
        if (this.floorPool.getLength()) {
            floor = this.floorPool.getFirst();
            floor.x = posX;
            floor.y = posY;
            floor.active = true;
            floor.visible = true;
            floor.body.allowGravity = false;
            floor.body.setImmovable(true);
            this.floorPool.remove(floor);
            //let newRatio = floorWidth / floor.displayWidth;
            floor.displayWidth = floorWidth;
            floor.tileScaleX = 1 / floor.scaleX;
        }
        else {
            
            let floor = this.add.tileSprite(posX, posY, floorWidth, 32, "floor").setOrigin(0);
            this.physics.add.existing(floor);
            floor.body.allowGravity = false;
            floor.body.setImmovable(true);
            floor.body.setVelocityX(gameOptions.floorSpeed);
            this.floorGroup.add(floor);
        //}
        //this.nextFloorDistance = Phaser.Math.Between(gameOptions.spawnRange[0], gameOptions.spawnRange[1]);
    }
    */