class MiniGame {
    constructor(gameType, onComplete) {
        this.gameType = gameType;
        this.onComplete = onComplete;
    }

    createElement() {
        this.gameElement = document.createElement("div");
        this.gameElement.classList.add("MiniGame");
        this.x = document.createElement("div");
        this.x.classList.add("x");
        this.x.innerText = "X";
        this.gameElement.appendChild(this.x);
        this.gameElement.querySelector(".x").addEventListener("click", () => {
            //Close the mini game
            this.done();
        });
    }

    diary(){
        console.log("yay");
        let book = document.createElement("div");
        book.classList.add("diary");
        book.innerHTML = (`
            <video class="diaryAnimation" width="320" height="240" controls autoplay>
                <source src="dist/images/videos/officeDiary.mp4" type="video/mp4">
                <source src="dist/images/videos/officeDiary.ogg" type="video/ogg">
                Your browser does not support the video tag.
            </video>
        `)
        this.gameElement.appendChild(book);
        

    }
    happy() {
        console.log("happy");
    }

    check(){
        if (this.gameType == "diary") {
            return this.diary();
        }
        if (this.gameType == "happy") {
            return this.happy();
        }
    }

    done(){
        this.gameElement.remove();
        this.onComplete();
    }
    



    init(container){
        console.log(this.onComplete)
        // console.log(this.gameType)
        this.createElement();
        this.check();
        // console.log(container)
        container.appendChild(this.gameElement);
    }

}