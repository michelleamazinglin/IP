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
                useShadow: true,
                src: "dist/images/Characters/people/mainCharacter.png",
            }),
            mom: new Person({
                x: utils.withGrid(7),
                y: utils.withGrid(9),
                src: "dist/images/Characters/people/npc1.png",
                useShadow: true,
                talking: [
                    {
                        events: [
                            { type: "addEnergy", amount: 5 },
                            { type: "textMessage", text: "I am glad you are ready to travel", faceMainCharacter: "mom" },
                            { type: "textMessage", text: "Here is some cash to get you started" },
                            { type: "addCash", amount: 100 },
                            { type: "textMessage", text: "stay safe and have fun" },
                        ]
                    }
                ]
            }),
            dad: new Person({
                x: utils.withGrid(8),
                y: utils.withGrid(5),
                useShadow: true,
                src: "dist/images/Characters/people/npc3.png",
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
                x: utils.withGrid(22),
                y: utils.withGrid(12),
                useShadow: true,
                src: "dist/images/Characters/people/mainCharacter.png",
            }),
            USnpc: new Person({
                x: utils.withGrid(15),
                y: utils.withGrid(11),
                useShadow: true,
                src: "dist/images/Characters/people/UncleSam.png",
                talking: [
                    {
                        events: [
                            { type: "textMessage", text: "Hi, I'm Uncle Sam", faceMainCharacter: "USnpc" },
                            { type: "textMessage", text: "English is primary language in United States" },
                            { type: "textMessage", text: "Having fun exploring..." },
                        ]
                    }
                ]
            }),
            busTicket: new Shop({
                x: utils.withGrid(32),
                y: utils.withGrid(12),
                src: "./dist/images/Objects/busTickets.png",
                talking: [
                    {
                        events: [
                            { type: "textMessage", 
                                text: "Join our bus tour to discover more...",
                                options: 
                                [
                                        {
                                            description: "ticket is 5 dollars",
                                            label: "Get one ticket",
                                            handler: () => {
                                            const status = new Status;
                                            status.payCash(5);
                                            const keyboardMenu = new KeyboardMenu;
                                            keyboardMenu.end();
                                            }
                                        },
                                        {
                                            label: "Maybe next time",
                                            handler: () => {
                                                const keyboardMenu = new KeyboardMenu;
                                                keyboardMenu.end();
                                            }
                                        },
                                ]
                            },
                            
                        ]
                    }
                ]
            }),
            busStop: new Shop({
                x: utils.withGrid(29),
                y: utils.withGrid(12),
                src: "./dist/images/Objects/busStop.png",
                objectSizeX: 48,
                objectSizeY: 32,
            }),
            car: new Shop({
                x: utils.withGrid(34),
                y: utils.withGrid(18),
                src: "./dist/images/Objects/car.png",
                objectSizeX: 48,
                objectSizeY: 32,
                isMounted: false,
                behaviorLoop: [
                    { type: "move", direction: "left"},
                    { type: "move", direction: "left" },
                    { type: "move", direction: "left" },
                    { type: "move", direction: "left" },
                    { type: "move", direction: "left" },
                    { type: "move", direction: "left" },
                    { type: "move", direction: "left" },
                    { type: "move", direction: "left" },
                    { type: "move", direction: "left" },
                    { type: "move", direction: "left" },
                    { type: "move", direction: "left" },
                    { type: "move", direction: "left" },
                    { type: "move", direction: "left" },
                    { type: "move", direction: "left" },
                    { type: "move", direction: "left" },
                    { type: "move", direction: "left" },
                    { type: "move", direction: "left" },
                    { type: "move", direction: "left" },
                    { type: "move", direction: "left" },
                    { type: "move", direction: "left" },
                    { type: "move", direction: "left" },
                    { type: "move", direction: "left" },
                    { type: "move", direction: "left" },
                    { type: "move", direction: "left" },
                    { type: "move", direction: "left" },
                    { type: "move", direction: "left" },
                    { type: "move", direction: "left" },
                    { type: "move", direction: "left" },
                    { type: "move", direction: "left" },
                    { type: "move", direction: "left" },
                    { type: "move", direction: "right" },
                    { type: "move", direction: "right" },
                    { type: "move", direction: "right" },
                    { type: "move", direction: "right" },
                    { type: "move", direction: "right" },
                    { type: "move", direction: "right" },
                    { type: "move", direction: "right" },
                    { type: "move", direction: "right" },
                    { type: "move", direction: "right" },
                    { type: "move", direction: "right" },
                    { type: "move", direction: "right" },
                    { type: "move", direction: "right" },
                    { type: "move", direction: "right" },
                    { type: "move", direction: "right" },
                    { type: "move", direction: "right" },
                    { type: "move", direction: "right" },
                    { type: "move", direction: "right" },
                    { type: "move", direction: "right" },
                    { type: "move", direction: "right" },
                    { type: "move", direction: "right" },
                    { type: "move", direction: "right" },
                    { type: "move", direction: "right" },
                    { type: "move", direction: "right" },
                    { type: "move", direction: "right" },
                    { type: "move", direction: "right" },
                    { type: "move", direction: "right" },
                    { type: "move", direction: "right" },
                    { type: "move", direction: "right" },
                    { type: "move", direction: "right" },
                    { type: "move", direction: "right" },
                ],
            }),
            bus: new Shop({
                x: utils.withGrid(28),
                y: utils.withGrid(16),
                src: "./dist/images/Objects/bus.png",
                objectSizeX: 64,
                objectSizeY: 32,

            }),
        },
        walls:{
            // the white house
            [utils.asGridCoord(15, 7)]: true,
            [utils.asGridCoord(16, 7)]: true,
            [utils.asGridCoord(17, 7)]: true,
            [utils.asGridCoord(18, 7)]: true,
            [utils.asGridCoord(19, 7)]: true,
            [utils.asGridCoord(21, 7)]: true,
            [utils.asGridCoord(22, 7)]: true,
            [utils.asGridCoord(23, 7)]: true,
            [utils.asGridCoord(24, 7)]: true,
            [utils.asGridCoord(25, 5)]: true,
            [utils.asGridCoord(25, 6)]: true,
            [utils.asGridCoord(25, 7)]: true,
            // empire state building
            [utils.asGridCoord(13, 7)]: true,
            [utils.asGridCoord(14, 8)]: true,
            [utils.asGridCoord(15, 8)]: true,
            [utils.asGridCoord(13, 8)]: true,
            // Home
            [utils.asGridCoord(21, 11)]: true,
            [utils.asGridCoord(23, 11)]: true,
            [utils.asGridCoord(21, 10)]: true,
            [utils.asGridCoord(21, 10)]: true,
            [utils.asGridCoord(23, 10)]: true,
            [utils.asGridCoord(24, 10)]: true,
            // hollywood
            [utils.asGridCoord(5, 5)]: true,
            [utils.asGridCoord(5, 6)]: true,
            [utils.asGridCoord(6, 6)]: true,
            [utils.asGridCoord(7, 6)]: true,
            [utils.asGridCoord(8, 6)]: true,
            [utils.asGridCoord(9, 6)]: true,
            [utils.asGridCoord(10, 6)]: true,
            [utils.asGridCoord(11, 6)]: true,
            [utils.asGridCoord(12, 6)]: true,
            // The Met
            [utils.asGridCoord(2, 9)]: true,
            [utils.asGridCoord(2, 10)]: true,
            [utils.asGridCoord(2, 11)]: true,
            [utils.asGridCoord(3, 11)]: true,
            [utils.asGridCoord(4, 11)]: true,
            [utils.asGridCoord(5, 11)]: true,
            [utils.asGridCoord(3, 9)]: true,
            [utils.asGridCoord(4, 9)]: true,
            [utils.asGridCoord(5, 9)]: true,
            [utils.asGridCoord(6, 9)]: true,
            [utils.asGridCoord(7, 9)]: true,
            [utils.asGridCoord(8, 9)]: true,
            [utils.asGridCoord(9, 9)]: true,
            [utils.asGridCoord(10, 9)]: true,
            [utils.asGridCoord(10, 10)]: true,
            [utils.asGridCoord(7, 11)]: true,
            [utils.asGridCoord(8, 11)]: true,
            [utils.asGridCoord(9, 11)]: true,
            [utils.asGridCoord(10, 11)]: true,
            // cafe
            [utils.asGridCoord(27, 5)]: true,
            [utils.asGridCoord(27, 6)]: true,
            [utils.asGridCoord(27, 7)]: true,
            [utils.asGridCoord(27, 8)]: true,
            [utils.asGridCoord(28, 8)]: true,
            [utils.asGridCoord(30, 8)]: true,
            [utils.asGridCoord(31, 8)]: true,
            [utils.asGridCoord(32, 8)]: true,
            [utils.asGridCoord(33, 8)]: true,
            [utils.asGridCoord(34, 8)]: true,
            [utils.asGridCoord(35, 8)]: true,
            // grass
            [utils.asGridCoord(0, 14)]: true,
            [utils.asGridCoord(1, 14)]: true,
            [utils.asGridCoord(2, 14)]: true,
            [utils.asGridCoord(3, 14)]: true,
            [utils.asGridCoord(4, 14)]: true,
            [utils.asGridCoord(5, 14)]: true,
            [utils.asGridCoord(6, 14)]: true,
            [utils.asGridCoord(7, 14)]: true,
            [utils.asGridCoord(8, 14)]: true,
            [utils.asGridCoord(9, 14)]: true,
            [utils.asGridCoord(10, 14)]: true,
            [utils.asGridCoord(11, 14)]: true,
            [utils.asGridCoord(12, 14)]: true,
            [utils.asGridCoord(13, 14)]: true,
            [utils.asGridCoord(14, 14)]: true,
            [utils.asGridCoord(15, 14)]: true,
            [utils.asGridCoord(16, 14)]: true,
            [utils.asGridCoord(17, 14)]: true,
            [utils.asGridCoord(18, 14)]: true,
            [utils.asGridCoord(19, 14)]: true,
            [utils.asGridCoord(20, 14)]: true,
            [utils.asGridCoord(21, 14)]: true,
            [utils.asGridCoord(22, 14)]: true,
            [utils.asGridCoord(23, 14)]: true,
            [utils.asGridCoord(24, 14)]: true,
            [utils.asGridCoord(25, 14)]: true,
            [utils.asGridCoord(26, 14)]: true,
            [utils.asGridCoord(27, 14)]: true,
            [utils.asGridCoord(28, 14)]: true,
            [utils.asGridCoord(29, 14)]: true,
            [utils.asGridCoord(30, 14)]: true,
            [utils.asGridCoord(33, 14)]: true,
            [utils.asGridCoord(34, 14)]: true,
            [utils.asGridCoord(35, 14)]: true,
            [utils.asGridCoord(36, 14)]: true,
            // 自由女神
            [utils.asGridCoord(37, 11)]: true,
            [utils.asGridCoord(38, 11)]: true,
            [utils.asGridCoord(39, 11)]: true,
            [utils.asGridCoord(40, 11)]: true,
            [utils.asGridCoord(37, 12)]: true,
            [utils.asGridCoord(37, 13)]: true,
            [utils.asGridCoord(37, 14)]: true,
            [utils.asGridCoord(38, 14)]: true,
            [utils.asGridCoord(39, 14)]: true,
            [utils.asGridCoord(40, 14)]: true,
            // busStop
            [utils.asGridCoord(30, 12)]: true,
            [utils.asGridCoord(31, 12)]: true,
            [utils.asGridCoord(33, 12)]: true,
            // border
            [utils.asGridCoord(0, 4)]: true,
            [utils.asGridCoord(1, 4)]: true,
            [utils.asGridCoord(2, 4)]: true,
            [utils.asGridCoord(3, 4)]: true,
            [utils.asGridCoord(4, 4)]: true,
            [utils.asGridCoord(1, 13)]: true,
            [utils.asGridCoord(0, 12)]: true,
            [utils.asGridCoord(0, 15)]: true,
            [utils.asGridCoord(0, 16)]: true,
            [utils.asGridCoord(0, 17)]: true,
            [utils.asGridCoord(0, 18)]: true,
            [utils.asGridCoord(1, 19)]: true,
            [utils.asGridCoord(2, 19)]: true,
            [utils.asGridCoord(3, 19)]: true,
            [utils.asGridCoord(4, 19)]: true,
            [utils.asGridCoord(5, 19)]: true,
            [utils.asGridCoord(6, 19)]: true,
            [utils.asGridCoord(7, 19)]: true,
            [utils.asGridCoord(8, 19)]: true,
            [utils.asGridCoord(9, 19)]: true,
            [utils.asGridCoord(10, 19)]: true,
            [utils.asGridCoord(11, 19)]: true,
            [utils.asGridCoord(12, 19)]: true,
            [utils.asGridCoord(13, 19)]: true,
            [utils.asGridCoord(14, 19)]: true,
            [utils.asGridCoord(15, 19)]: true,
            [utils.asGridCoord(16, 19)]: true,
            [utils.asGridCoord(17, 19)]: true,
            [utils.asGridCoord(18, 19)]: true,
            [utils.asGridCoord(19, 19)]: true,
            [utils.asGridCoord(20, 19)]: true,
            [utils.asGridCoord(21, 19)]: true,
            [utils.asGridCoord(22, 19)]: true,
            [utils.asGridCoord(23, 19)]: true,
            [utils.asGridCoord(24, 19)]: true,
            [utils.asGridCoord(25, 19)]: true,
            [utils.asGridCoord(26, 19)]: true,
            [utils.asGridCoord(27, 19)]: true,
            [utils.asGridCoord(28, 19)]: true,
            [utils.asGridCoord(29, 19)]: true,
            [utils.asGridCoord(30, 19)]: true,
            [utils.asGridCoord(31, 19)]: true,
            [utils.asGridCoord(32, 19)]: true,
            [utils.asGridCoord(33, 19)]: true,
            [utils.asGridCoord(34, 19)]: true,
            [utils.asGridCoord(35, 19)]: true,
            [utils.asGridCoord(36, 19)]: true,
            [utils.asGridCoord(37, 19)]: true,
            [utils.asGridCoord(38, 19)]: true,
            [utils.asGridCoord(39, 19)]: true,
            [utils.asGridCoord(40, 19)]: true,
            [utils.asGridCoord(41, 15)]: true,
            [utils.asGridCoord(41, 16)]: true,
            [utils.asGridCoord(41, 17)]: true,
            [utils.asGridCoord(41, 18)]: true,
            [utils.asGridCoord(36, 8)]: true,
            [utils.asGridCoord(37, 8)]: true,
            [utils.asGridCoord(38, 8)]: true,
            [utils.asGridCoord(39, 8)]: true,
            [utils.asGridCoord(40, 8)]: true,
            [utils.asGridCoord(41, 9)]: true,
            [utils.asGridCoord(41, 10)]: true,
            [utils.asGridCoord(26, 4)]: true,
        },
        cutsceneSpaces: {
            [utils.asGridCoord(22, 11)]: [
                {
                    events: [
                        { type: "changeMap", map: "Home" }
                    ]
                }
            ],
            [utils.asGridCoord(29, 8)]: [
                {
                    events: [
                        { type: "changeMap", map: "DiningRoomUSA" }
                    ]
                }
            ],
            [utils.asGridCoord(6, 11)]: [
                {
                    events: [
                        { type: "changeMap", map: "TheMet" }
                    ]
                }
            ],
            [utils.asGridCoord(4, 7)]: [
                {
                    events: [
                        { type: "changeMap", map: "AirPort" }
                    ]
                }
            ],
            [utils.asGridCoord(4, 8)]: [
                {
                    events: [
                        { type: "changeMap", map: "AirPort" }
                    ]
                }
            ],
        }
    },
    DiningRoomUSA: {
        lowerSrc: "./dist/images/maps/DiningRoomLower.png",
        upperSrc: "./dist/images/maps/DiningRoomUpper.png",
        gameObjects: {
            mainCharacter: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(6),
                y: utils.withGrid(11),
                useShadow: true,
                src: "dist/images/Characters/people/mainCharacter.png",
            }),
        },
        walls: {
            [utils.asGridCoord(0, 1)]: true,
        },
        cutsceneSpaces: {
            [utils.asGridCoord(6, 12)]: [
                {
                    events: [
                        { type: "changeMap", map: "Street" }
                    ]
                }
            ]
        }
    },
    TheMet: {
        lowerSrc: "./dist/images/maps/TheMetLower.png",
        upperSrc: "./dist/images/maps/TheMetUpper.png",
        gameObjects: {
            mainCharacter: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(7),
                y: utils.withGrid(23),
                useShadow: true,
                src: "dist/images/Characters/people/mainCharacter.png",
            }),
        },
        walls: {
            [utils.asGridCoord(0, 1)]: true,
        },
        cutsceneSpaces: {
            [utils.asGridCoord(7, 17)]: [
                {
                    events: [
                        { type: "textMessage", text: "edward hopper - nighthawks" },
                    ]
                }
            ],
            [utils.asGridCoord(15, 17)]: [
                {
                    events: [
                        { type: "textMessage", text: "grant wood - american gothic" },
                    ]
                }
            ],
            [utils.asGridCoord(7, 24)]: [
                {
                    events: [
                        { type: "changeMap", map: "Street" }
                    ]
                }
            ]
        }
    },
    AirPort: {
        lowerSrc: "./dist/images/maps/AirPortLower.png",
        upperSrc: "./dist/images/maps/AirPortUpper.png",
        gameObjects: {
            mainCharacter: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(15),
                y: utils.withGrid(13),
                useShadow: true,
                src: "dist/images/Characters/people/mainCharacter.png",
            }),
        },
        walls: {
            [utils.asGridCoord(0, 1)]: true,
        },
        cutsceneSpaces: {
            [utils.asGridCoord(16, 13)]: [
                {
                    events: [
                        { type: "changeMap", map: "Street" }
                    ]
                }
            ]
        }
    },
}

