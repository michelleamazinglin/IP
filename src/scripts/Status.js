class Status {
    constructor() {
        this.cash = 0;
        this.energy = 100;
        this.amount = 2;
    }



    addCash(amount) {
        let cash = this.cash;
        cash += amount;
        this.cash = cash;
        let element = document.querySelector(".cash");
        element.innerHTML = "Cash: " + cash;
        // return cash;
    }

    



    lostEnergy(){
        this.energy -= 1
    }

    get energyPercent() {
        const percent = this.energy / 100 * 100;
        return percent > 0 ? percent : 0;
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("Status");
        this.element.innerHTML = (`
            <p class="Status_p cash">Cash: ${this.cash}</p>
            <div class="Status_p"> Energy: &nbsp;
                <div class="bar">
                <div class="persent" style="width: ${this.energyPercent}%"> </div>
                </div>
                &nbsp;${this.energy}%
            </div>
        `)


    }

    init(container) { 
        this.createElement();
        container.appendChild(this.element);
    }
}