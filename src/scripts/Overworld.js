class Overworld {
 constructor(config) {
   this.element = config.element;
   this.canvas = this.element.querySelector(".game-canvas");
   this.ctx = this.canvas.getContext("2d");
 }

//  call init (refer to /init.js)
 init() {
   const image = new Image();
   image.onload = () => {
    //  draw a image into canvas
     this.ctx.drawImage(image,0,0)
   };
   image.src = "./dist/images/maps/DemoLower.png";


   const x = 5;
   const y = 6;

   const shadow = new Image();
   shadow.onload = () => {
    this.ctx.drawImage(
      shadow, 
      0, //left cut 
      0, //top cut,
      32, //width of cut
      32, //height of cut
      x * 16 - 8,
      y * 16 - 18,
      32,
      32
   )
   }
   shadow.src = "./dist/images/characters/shadow.png";


   const mainCharacter = new Image();
   mainCharacter.onload = () => {
     this.ctx.drawImage(
       mainCharacter, 
      //  make a cul
       0, //left cut 
       0, //top cut,
       32, //width of cut
       32, //height of cut
      // position to draw on map
       x * 16 - 8,
       y * 16 - 18,
      //  size 
       32,
       32
    )
   }
   mainCharacter.src = "./dist/images/characters/people/hero.png";


 }

}