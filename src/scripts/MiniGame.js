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

    writeMail(){
        let mail = document.createElement("div");
        mail.classList.add("writeMail");
        mail.innerHTML = (`
            <label for="mailText" class="mailTopic">Topic: what do you do on new year's day?</label>
            <textarea placeholder="Starts here..." rows="10" cols="20" id="mailText" class="mailTextBox"></textarea>
        `)
        this.gameElement.appendChild(mail);
    }

    drawMail() {
        let mail = document.createElement("div");
        mail.classList.add("writeMail");
        mail.innerHTML = (`
            <label for="mailText" class="mailTopic">Bald Boy and the Magic Seal – Origin: Turkey</label>
            <textarea rows="10" cols="20" id="mailText" class="mailTextBox">
                This story explores the magic of friendship through the story of a boy and his loyal dog and cat. When the boy is given a magic seal, he wishes for a palace and the hand of the emperor’s daughter so he can give his mother a better life. He and his mother are happy in their new life before a crafty woman steals the seal from their house. The emperor’s daughter is taken away, the palace vanishes, and the boy and his mother are left alone with no home. The cat and dog vow to get the magic seal back and return their friend’s happiness.
            </textarea>
        `)
        this.gameElement.appendChild(mail);
    }

    diary(){
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

    check(){
        if (this.gameType == "diary") {
            return this.diary();
        }
        if (this.gameType == "writeMail") {
            return this.writeMail();
        }
        if (this.gameType == "drawMail") {
            return this.drawMail();
        }
    }

    done(){
        this.gameElement.remove();
        this.onComplete();
    }
    



    init(container){
        this.createElement();
        this.check();
        container.appendChild(this.gameElement);
    }

}