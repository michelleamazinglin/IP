class Status {
    constructor() {
        this.cash = 0;
        this.energy = 90;
        this.amount = 2;
    }


    payCash(amount) {
        let cash = this.cash;
        cash -= amount;
        this.cash = cash;
        let element = document.querySelector(".cash");
        element.innerHTML = "Cash: " + this.cash;
    }

    addCash(amount) {
        let cash = this.cash;
        cash += amount;
        this.cash = cash;
        let element = document.querySelector(".cash");
        element.innerHTML = "Cash: " + this.cash;
        // return cash;
    }


    lostEnergy() {
        let energy = this.energy;
        if (energy <= 0) {
            energy = 0
            this.energy = energy;
        } else {
            energy -= 5;
            this.energy = energy;
            let barElement = document.querySelector(".persent");
            barElement.style.width = this.energy + "%";
            let textElement = document.querySelector(".energy");
            if (this.energy >= 100) {
                textElement.innerHTML = "&nbsp;" + this.energy + "%";
            } else {
                textElement.innerHTML = "&nbsp; &nbsp;" + this.energy + "%";
            }
        }     
    }

    addEnergy(amount) {
        let energy = this.energy;
        energy += amount;
        this.energy = energy;
        let barElement = document.querySelector(".persent");
        barElement.style.width = this.energy + "%";
        let textElement = document.querySelector(".energy");
        if (this.energy >= 100) {
            this.energy = 100;
            barElement.style.width = 100 + "%";
            textElement.innerHTML = "&nbsp;" + this.energy + "%";
        } else {
            textElement.innerHTML = "&nbsp; &nbsp;" + this.energy + "%";
        }

    }


    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("Status");
        this.element.innerHTML = (`
            <p class="Status_p cash">Cash: ${this.cash}</p>
            <div class="Status_p"> Energy: &nbsp;
                <div class="bar">
                <div class="persent" style="width: ${this.energy}%"> </div>
                </div>
                <div class="energy">
                &nbsp;${this.energy}%
                </div>
            </div>
            <div class="addCash100"></div>
            <div class="addCash5"></div>
            <div class="payCash5"></div>
            <div class="payCash1"></div>
            <div class="payFood5"></div>
            <div class="payFood10"></div>
        `)
        // pay cash
        this.element.querySelector(".payCash5").addEventListener("click", () => {
            if (this.cash >= 5) {
                this.payCash(5);
            }  
        });
        this.element.querySelector(".payCash1").addEventListener("click", () => {
            if (this.cash >= 1) {
                this.payCash(1);
            }  
        });
        // add cash
        this.element.querySelector(".addCash100").addEventListener("click", () => {
            this.addCash(100);
        });
        this.element.querySelector(".addCash5").addEventListener("click", () => {
            this.addCash(5);
        });
        // pay food
        this.element.querySelector(".payFood5").addEventListener("click", () => {
            if (this.cash >= 5) {
                this.payCash(5);
                this.addEnergy(5);
            } else {
                const eventHandler = new OverworldEvent({
                    event: { type: "textMessage", text: "emmm.. not enough cash, try to earn more cash by explore around." },
                })
                eventHandler.init();  
            }
        });
        this.element.querySelector(".payFood10").addEventListener("click", () => {
            if (this.cash >= 10) {
                this.payCash(10);
                this.addEnergy(10);
            } else {
                const eventHandler = new OverworldEvent({
                    event: { type: "textMessage", text: "emmm.. not enough cash, try to earn more cash by explore around." },
                })
                eventHandler.init();
            }
        });
    }

    init(container) {
        this.createElement();
        container.appendChild(this.element);
        setInterval(() => { this.lostEnergy(); }, 60000);
    }
}