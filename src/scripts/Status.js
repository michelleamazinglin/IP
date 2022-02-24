class Status {
    constructor() {
        this.cash = 0;
        this.hunger = 0;
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("Status");
        this.element.innerHTML = (`
            <p class="Status_p">cash: ${this.cash}</p>
            <p class="Status_p">hunger: ${this.hunger}</p>
        `)
    }

    init(container) {
        console.log(container);
        this.createElement();
        container.appendChild(this.element);
    }
}