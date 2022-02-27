class Status {
    constructor() {
        this.cash = 0;
        this.energy = 90;
        this.amount = 2;
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
        `)
        // this.element.querySelector(".hi").addEventListener("click", () => {
        //     this.lostEnergy();
        // });

    }

    init(container) {
        this.createElement();
        container.appendChild(this.element);
        setInterval(() => { this.lostEnergy(); }, 60000);
    }
}