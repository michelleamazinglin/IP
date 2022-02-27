class TextMessage {
  constructor({ text, onComplete, options }) {
    this.text = text;
    this.onComplete = onComplete;
    this.element = null;
    this.options = options || [];
    
  }

  createElement() {
    //Create the element
    this.element = document.createElement("div");
    this.element.classList.add("TextMessage");

    this.element.innerHTML = (`
      <p class="TextMessage_p"></p>
      <button class="Next_button">Next</button>
    `)

    //Init the typewriter effect
    this.revealingText = new RevealingText({
      element: this.element.querySelector(".TextMessage_p"),
      text: this.text,
    })

    this.element.querySelector(".Next_button").addEventListener("click", () => {
      //Close the text message
      this.done();
      // let keyboardMenu = new KeyboardMenu();
      // keyboardMenu.end();
    });

    this.actionListener = new KeyPressListener("Enter", () => {
      this.done();
    })

  }

  done() {

    if (this.revealingText.isDone) {
      this.element.remove();
      this.actionListener.unbind();
      this.onComplete();
      document.querySelector(".KeyboardMenu").remove();
      document.querySelector(".DescriptionBox").remove();
    } else {
      this.revealingText.warpToDone();
    }
  }


  showMenu(container) {
    this.keyboardMenu = new KeyboardMenu();
    this.keyboardMenu.init(container);
    this.keyboardMenu.setOptions(this.options)
  }

  init(container) {

    this.createElement();
    container.appendChild(this.element);
    this.revealingText.init();
    if (this.options.length > 0) {
      this.showMenu(container);
      this.keyboardMenu = new KeyboardMenu;
      this.keyboardMenu.setOptions(this.options)
    }
    
    
  }

}