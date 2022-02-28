class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.map = null;
  }

  startGameLoop() {
    const step = () => {
      //Clear off the canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      //Establish the camera person
      const cameraPerson = this.map.gameObjects.mainCharacter;

      //Update all objects
      Object.values(this.map.gameObjects).forEach(object => {
        object.update({
          arrow: this.directionInput.direction,
          map: this.map,
        })
      })

      //Draw Lower layer
      this.map.drawLowerImage(this.ctx, cameraPerson);

      //Draw Game Objects
      Object.values(this.map.gameObjects).sort((a, b) => {
        return a.y - b.y;
      }).forEach(object => {
        object.sprite.draw(this.ctx, cameraPerson);
      })

      //Draw Upper layer
      this.map.drawUpperImage(this.ctx, cameraPerson);

      requestAnimationFrame(() => {
        step();
      })
    }
    step();
  }


  bindActionInput() {
    new KeyPressListener("Enter", () => {
      //Is there a person here to talk to?
      this.map.checkForActionCutscene()
    })
  }

  bindMainCharacterPositionCheck() {
    document.addEventListener("PersonWalkingComplete", e => {
      if (e.detail.whoId === "mainCharacter") {
        //mainCharacter's position has changed
        this.map.checkForFootstepCutscene()
      }
    })
  }

  startMap(mapConfig) {
    this.map = new OverworldMap(mapConfig);
    this.map.overworld = this;
    this.map.mountObjects();
  }

  init() {
    this.startMap(window.OverworldMaps.Street);
    


    this.bindActionInput();
    this.bindMainCharacterPositionCheck();

    this.status = new Status();
    this.status.init(document.querySelector(".game-container"));

    this.directionInput = new DirectionInput();
    this.directionInput.init();

    this.startGameLoop();


    // this.map.startCutscene([
    //   { type: "textMessage", text: "hiiiiiinckjanckjankcnkjanck ajsckanckjanjcki", 
    //     options: [
    //       { 
    //         description: "description1", 
    //         label: "label",
    //         handler: () => {
    //           const status = new Status;
    //           status.addEnergy(5);
    //           const keyboardMenu = new KeyboardMenu;
    //           keyboardMenu.end();
    //         }
    //       }, 
    //       {
    //         description: "description2", 
    //         label: "label2", 
    //         handler: () => {
    //           const status = new Status;
    //           status.addCash(5);
    //           const keyboardMenu = new KeyboardMenu;
    //           keyboardMenu.end();
    //         }
    //       }
    //     ]
    //   },  
    // ])
  }
}