class KeyboardMenu {
  constructor() {
    this.up = null;
    this.down = null;
    this.prevFocus = null;
  }

  setOptions(options) {
    this.options = options;
    document.querySelector(".KeyboardMenu").innerHTML = this.options.map((option, index) => {
      return (`
        <div class="option">
          <button class="optionButton" data-button="${index}" data-description="${option.description}">
            ${option.label}
          </button>
        </div>
      `)
    }).join("");

    const buttons = document.querySelectorAll(".optionButton")
    // console.log(buttons)
    buttons.forEach((button,index) => {
      // this.prevFocus = button;
      button.addEventListener("click", () => {
        const chosenOption = this.options[ index ];
        chosenOption.handler();
      })
      // button.addEventListener("mouseenter", () => {
      //   button.focus();
      // })
      button.addEventListener("focus", () => {
        this.prevFocus = button;
        if (button.dataset.description != "undefined") {
          document.querySelector(".DescriptionBox").innerText = button.dataset.description;
        }
       
      })
    })

    // setTimeout(() => {
    //   document.querySelector(".KeyboardMenu").querySelector("button[data-button]:not([disabled])").focus();
    // }, 10)

    


  }


  createElement() {
    this.listElement = document.createElement("div");
    this.listElement.classList.add("KeyboardMenu");

    //Description box element
    this.descriptionElement = document.createElement("div");
    this.descriptionElement.classList.add("DescriptionBox");
    this.descriptionElement.innerHTML = (`<p></p>`);
    this.descriptionElementText = this.descriptionElement.querySelector("p");
  }

  end() {
    //Remove menu element and description element
    document.querySelector(".KeyboardMenu").remove();
    document.querySelector(".DescriptionBox").remove();

    

    //Clean up bindings
    // this.up.unbind();
    // this.down.unbind();
  }

  init(container) {
    this.createElement();
    container.appendChild(this.descriptionElement);
    container.appendChild(this.listElement);

    // up button does not work, taking the listerner out first
    
    // this.up = new KeyPressListener("ArrowUp", () => {
    //   const current = Number(this.prevFocus.dataset.button);
    //   console.log(current);
    //   const prevButton = Array.from(this.listElement.querySelectorAll("button[data-button]")).reverse().find(el => {
    //     let result = el.dataset.button < current;
    //     return result;
    //   })
    //   prevButton?.focus();
    // })
    // this.down = new KeyPressListener("ArrowDown", () => {
    //   const current = Number(this.prevFocus.dataset.button);
    //   const nextButton = Array.from(this.listElement.querySelectorAll("button[data-button]")).find(el => {
    //     return el.dataset.button > current;
    //   })
    //   nextButton?.focus();
    // })

  }


}