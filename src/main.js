/*
collaborator names:
-Rutvik Katkoriya
-Adrian Miller
-Alvaro Perez

game title:
-Wolf the Monkey Man

date completed:
-May 3rd, 2021

creative tilt justification:
-Rutvik Katkoriya
Technical Creativity: 
The sound implementation uses randomness to play one of three sounds for the jump action. This isn’t the most complicated or sophisticated bit of coding, but as someone who has little 
programming experience, I can safely say that I’m proud of being able to have a variety of sounds to play for the same action, resulting in less monotonous gameplay and keeping the player 
from hearing the sounds over and over again. 
The gameplay features a player character that can transform into three distinct forms, and I chose to design and record sounds for each form. Implementing code that allowed for the correct 
sound to play upon a jump, i.e. jump sfx that sounds like the current form of the player character, was a task that was easier than I suspected, and it makes for good immersion. 
As a novice programmer, I was assisted in the sound implementation side of things by Adrian and Alvaro, as they cleared up some buggy code for me and explained how to use some of Phaser’s 
audio objects and methods. I did my best to scour the Phaser 3 documentation, but unfortunately a lot of it went over my head. I managed to successfully learn and use the sound object, 
alongside it’s configuration parameter, to allow me to modify sounds more freely in later parts of the code, such as looping, volume control, and stopping audio playback.
Aural Creativity:
The sound design uses both original recordings and modified samples found online (all samples used were labeled as free to use and modify). I didn’t want to spend too much time worrying about 
how I myself could make the sound of a wolf jumping, and so I chose to look around online for recordings of dogs and monkeys, which in the end were modified in my digital audio workstation, 
Logic Pro X. For sounds regarding the human form, I recorded myself and edited the recordings to fit the visual style as best I could. 
The music was a little tough to get going on the first two or three drafts. I ran a couple of ideas by the team, and they didn’t quite work as they were a little too serious sounding for the 
overall idea of the game. This is meant to be fairly light hearted, so I restarted from scratch, switched key signatures and tempo, and improvised over a simple bass line before I reached a 
melody that I liked, which ended up being the draft that worked the best for this style. I wanted something upbeat, energetic, and fun. I drew on all the musical knowledge I had gained over 
the years and poured it into this one minute loop to create a fun background track to listen to that was both fitting to the visual theme of the game and could loop seamlessly. Looping the 
music in VSCode was not a challenge, as it was the last bit of sound implementation I did, by which time I had a good understanding of the Phaser’s basic audio capabilities. 

-Adrian Miller
Mechanical Creativity:
I did my best to utilize the class system to modularize our object to keep the main file clean. This took some understanding of how constructors and instantiation worked to make my own 
custom constructors which went beyond Rocket Patrol and Paddle Parkour 3. I used a method similar to the object instantiation in Paddle Parkour 3 to recursively produce platforms. 
Alvaro wrote the code to actually make the platforms go, but I made the code a bit more compact. 
Similarly I developed enemy classes and behaviors that could inherit from one another, keeping the actual code for them light. 
Finally, I worked with Alvaro to make our game easily configurable from the main.js file using global variables. 
Visual Creativity:
This is the first time ever I tried animation and texture atlases. I made quick models in blender, and learned to rig them to produce easy animations. Every player and enemy model 
I hand made in blender, produced an animation, and developed into an atlas using Leshy SpriteTool. I then, of course, implemented these animations into the game.

-Alvaro Perez
Mechanical Creativity:
I had some previous experience programming in Javascript from other classes but I was trying to match up to Adam's teaching style to avoid any confusion with my teammates. It felt strange 
using different files for different resources but made sense eventually. Most of the idea for the code came from how the ships moved in rocket patrol and whatever scribbles came from my
whiteboard of a test running the Phaser 3 engine. I realized I should have utilize more Phaser 3 Api documentation because there are some helpful suggestion on it
I made the first prototype of the random platform and enemy generation along with the player's sprite hitbox. Adrian made the code more compact and easier to understand while adding more 
enemies to be more randomly generated
Visual Creativity:
I was in charge of most of the UI elements like the background, instructions, scoring system, balloon, and platform. I used an online pixel and sprite sheet editor because it was fast and easy 
to use to manipulate the pixels in case the picture was too small or big. I also made the prototype for the player's sprite and enemies' sprite before we finalize our design for both.
Overall, it was fun making pixel art and I want to experiment more on techniques.

*/

let config = {
    type: Phaser.PHYSICS,
    width: 840,
    height: 525,
    scene: [Menu, Play, Instructions],
    backgroundColor: 808080,
    physics: {
        default: 'arcade',
        arcade: {
            //debug: true,
        }
    }
};

let game = new Phaser.Game(config);

let gameOptions = {

    platformSpeed: -300,
    //spawnRange: [50, 280],
    platformSizeRange: [150, 300],
    platformHeightRange: [-1, .5],
    platformHeightScale: 7,
    cielVerticalLimit: [0.2, 0.3],
    jumpForceMax: -400,
    runnerStartPosition: 300,
    jumps: 1,

    floorSpeed: -300,
    floorSizeRange: [150, 300],
    floorHeightRange: [-.5, .5],
    floorHeighScale: 7,
    floorVerticalLimit: [0.5, 0.8],

    platformSeparationRange: [100, 500],

    balloonSpeed: .25
}

//run SFX
let runConfig = {
    mute: false,
    volume: 0.1,
    rate: 1,
    detune: 0,
    seek: 0,
    loop: true,
    delay: 0
};

let animal = {
    WOLF: "wolf",
    MONKEY: "monkey",
    HUMAN: "human",
}

let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

let keyR, keyS;

let score = 0;
let highScore = 0;

let tileSize = 32;