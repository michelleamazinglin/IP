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
    Home: {
        lowerSrc: "./dist/images/maps/DemoLower.png",
        upperSrc: "./dist/images/maps/DemoUpper.png",
        gameObjects: {
            mainCharacter: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(6),
                y: utils.withGrid(6),
            }),
            mom: new Person({
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
                            { type: "textMessage", text: "I am glad you are ready to travel", faceMainCharacter: "mom" },
                            { type: "textMessage", text: "Here is some cash to get you started" },
                            { type: "textMessage", text: "stay safe and have fun" },
                        ]
                    }
                ]
            }),
            dad: new Person({
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
            // walls
            [utils.asGridCoord(0 , 4)]: true,
            [utils.asGridCoord(0, 5)]: true,
            [utils.asGridCoord(0, 6)]: true,
            [utils.asGridCoord(0, 7)]: true,
            [utils.asGridCoord(0, 8)]: true,
            [utils.asGridCoord(0, 9)]: true,
            [utils.asGridCoord(1 , 3)]: true,
            [utils.asGridCoord(2 , 3)]: true,
            [utils.asGridCoord(3 , 3)]: true,
            [utils.asGridCoord(4 , 3)]: true,
            [utils.asGridCoord(5 , 3)]: true,
            [utils.asGridCoord(6 , 4)]: true,
            [utils.asGridCoord(8 , 4)]: true,
            [utils.asGridCoord(9 , 3)]: true,
            [utils.asGridCoord(10, 3)]: true,
            [utils.asGridCoord(1, 10)]: true,
            [utils.asGridCoord(2, 10)]: true,
            [utils.asGridCoord(3, 10)]: true,
            [utils.asGridCoord(4, 10)]: true,
            [utils.asGridCoord(5, 11)]: true,
            [utils.asGridCoord(6, 10)]: true,
            [utils.asGridCoord(7, 10)]: true,
            [utils.asGridCoord(8, 10)]: true,
            [utils.asGridCoord(9, 10)]: true,
            [utils.asGridCoord(10, 10)]: true,
            [utils.asGridCoord(11, 4)]: true,
            [utils.asGridCoord(11, 5)]: true,
            [utils.asGridCoord(11, 6)]: true,
            [utils.asGridCoord(11, 7)]: true,
            [utils.asGridCoord(11, 8)]: true,
            [utils.asGridCoord(11, 9)]: true,
            [utils.asGridCoord(11, 10)]: true,
            // table
            [utils.asGridCoord(3 , 7)]: true,
            [utils.asGridCoord(4 , 7)]: true,
            // soda
            [utils.asGridCoord(3, 5)]: true,
            [utils.asGridCoord(4, 5)]: true,
            [utils.asGridCoord(1, 7)]: true,
            [utils.asGridCoord(1, 8)]: true,
            
            
        },
        cutsceneSpaces: {
            [utils.asGridCoord(7, 4)]: [
                {
                    events: [
                        { who: "dad", type: "walk", direction: "left" },
                        { who: "dad", type: "stand", direction: "up", time: 500 },
                        { type: "textMessage", text: "I still need some time to clean your room out...come back later" },
                        { who: "dad", type: "walk", direction: "right" },
                        { who: "dad", type: "stand", direction: "down" },
                        { who: "mainCharacter", type: "walk", direction: "down" },
                        { who: "mainCharacter", type: "walk", direction: "left" },
                    ]
                }
            ],
            [utils.asGridCoord(5, 10)]: [
                {
                    events: [
                        { type: "changeMap", map: "Street" }
                    ]
                }
            ]
        }

    },
    Street: {
        lowerSrc: "./dist/images/maps/StreetLower.png",
        upperSrc: "./dist/images/maps/StreetUpper.png",
        gameObjects: {
            mainCharacter: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(21),
                y: utils.withGrid(10),
                useShadow: true,
            }),
            busTicket: new Shop({
                x: utils.withGrid(32),
                y: utils.withGrid(12),
                src: "./dist/images/Objects/busTickets.png",
                talking: [
                    {
                        events: [
                            { type: "textMessage", text: "Join our bus tour to discover more..."},
                            { type: "textMessage", text: "bus ticket is 5 dollars" },
                        ]
                    }
                ]
            }),
            busStop: new Shop({
                x: utils.withGrid(28),
                y: utils.withGrid(12),
                src: "./dist/images/Objects/busStop.png",
            }),
        }
    },
}