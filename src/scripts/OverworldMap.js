class OverworldMap {
    constructor(config) {
        this.overworld = null;
        this.gameObjects = config.gameObjects;
        this.cutsceneSpaces = config.cutsceneSpaces || {};
        this.walls = config.walls || {};

        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc;

        this.upperImage = new Image();
        this.upperImage.src = config.upperSrc;

        this.isCutscenePlaying = false;
    }

    drawLowerImage(ctx, cameraPerson) {
        ctx.drawImage(
            this.lowerImage,
            utils.withGrid(10.5) - cameraPerson.x,
            utils.withGrid(6) - cameraPerson.y
        )
    }

    drawUpperImage(ctx, cameraPerson) {
        ctx.drawImage(
            this.upperImage,
            utils.withGrid(10.5) - cameraPerson.x,
            utils.withGrid(6) - cameraPerson.y
        )
    }

    isSpaceTaken(currentX, currentY, direction) {
        const { x, y } = utils.nextPosition(currentX, currentY, direction);
        return this.walls[`${x},${y}`] || false;
    }

    mountObjects() {
        Object.keys(this.gameObjects).forEach(key => {

            let object = this.gameObjects[key];
            object.id = key;

            //TODO: determine if this object should actually mount
            object.mount(this);

        })
    }

    async startCutscene(events) {
        this.isCutscenePlaying = true;

        for (let i = 0; i < events.length; i++) {
            const eventHandler = new OverworldEvent({
                event: events[i],
                map: this,
            })
            await eventHandler.init();
        }

        this.isCutscenePlaying = false;

        //Reset NPCs to do their idle behavior
        Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this))
    }

    checkForActionCutscene() {
        const mainCharacter = this.gameObjects["mainCharacter"];
        const nextCoords = utils.nextPosition(mainCharacter.x, mainCharacter.y, mainCharacter.direction);
        const match = Object.values(this.gameObjects).find(object => {
            return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
        });
        if (!this.isCutscenePlaying && match && match.talking.length) {
            this.startCutscene(match.talking[0].events)
        }
    }

    checkForFootstepCutscene() {
        const mainCharacter = this.gameObjects["mainCharacter"];
        const match = this.cutsceneSpaces[`${mainCharacter.x},${mainCharacter.y}`];
        if (!this.isCutscenePlaying && match) {
            this.startCutscene(match[0].events)
        }
    }

    addWall(x, y) {
        this.walls[`${x},${y}`] = true;
    }
    removeWall(x, y) {
        delete this.walls[`${x},${y}`]
    }
    moveWall(wasX, wasY, direction) {
        this.removeWall(wasX, wasY);
        const { x, y } = utils.nextPosition(wasX, wasY, direction);
        this.addWall(x, y);
    }

}

window.OverworldMaps = {
    DemoRoom: {
        lowerSrc: "./dist/images/maps/DemoLower.png",
        upperSrc: "./dist/images/maps/DemoUpper.png",
        gameObjects: {
            mainCharacter: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(5),
                y: utils.withGrid(6),
            }),
            npcA: new Person({
                x: utils.withGrid(7),
                y: utils.withGrid(9),
                src: "./dist/images/characters/people/npc1.png",
                behaviorLoop: [
                    // { type: "stand", direction: "left", time: 800 },
                    // { type: "stand", direction: "up", time: 800 },
                    // { type: "stand", direction: "right", time: 1200 },
                    // { type: "stand", direction: "up", time: 300 },
                ],
                talking: [
                    {
                        events: [
                            { type: "textMessage", text: "I'm busy...", faceMainCharacter: "npcA" },
                            { type: "textMessage", text: "Go away!" },
                            { who: "mainCharacter", type: "walk", direction: "up" },
                        ]
                    }
                ]
            }),
            npcB: new Person({
                x: utils.withGrid(8),
                y: utils.withGrid(5),
                src: "./dist/images/characters/people/npc3.png",
                // behaviorLoop: [
                //   { type: "walk",  direction: "left" },
                //   { type: "stand",  direction: "up", time: 800 },
                //   { type: "walk",  direction: "up" },
                //   { type: "walk",  direction: "right" },
                //   { type: "walk",  direction: "down" },
                // ]
            }),
        },
        walls: {
            [utils.asGridCoord(7, 6)]: true,
            [utils.asGridCoord(8, 6)]: true,
            [utils.asGridCoord(7, 7)]: true,
            [utils.asGridCoord(8, 7)]: true,
        },
        cutsceneSpaces: {
            [utils.asGridCoord(7, 4)]: [
                {
                    events: [
                        { who: "npcB", type: "walk", direction: "left" },
                        { who: "npcB", type: "stand", direction: "up", time: 500 },
                        { type: "textMessage", text: "You can't be in there!" },
                        { who: "npcB", type: "walk", direction: "right" },
                        { who: "mainCharacter", type: "walk", direction: "down" },
                        { who: "mainCharacter", type: "walk", direction: "left" },
                    ]
                }
            ],
            [utils.asGridCoord(5, 10)]: [
                {
                    events: [
                        { type: "changeMap", map: "Kitchen" }
                    ]
                }
            ]
        }

    },
    Kitchen: {
        lowerSrc: "./dist/images/maps/KitchenLower.png",
        upperSrc: "./dist/images/maps/KitchenUpper.png",
        gameObjects: {
            mainCharacter: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(5),
                y: utils.withGrid(5),
            }),
            npcB: new Person({
                x: utils.withGrid(10),
                y: utils.withGrid(8),
                src: "./dist/images/characters/people/npc3.png",
                talking: [
                    {
                        events: [
                            { type: "textMessage", text: "You made it!", faceMainCharacter: "npcB" },
                        ]
                    }
                ]
            })
        }
    },
}