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

    theMetQuiz(){
        let quiz = document.createElement("div");
        quiz.classList.add("quiz");
        quiz.innerHTML = (`
            <h2 class="quizQuestion">Which one below is an American Artist?</h2>
            <div class="quizAnswers">
            <button id="answer1" class="quizOptionFalse">Vincent van Gogh</button>
            <button id="answer2" class="quizOptionTrue">Andy Warhol</button>
            <button id="answer3" class="quizOptionFalse">Pablo Picasso</button>
            </div>
        `)
        this.gameElement.appendChild(quiz);

        let popup = document.createElement("div");
        popup.classList.add("popup");
        popup.innerHTML = (`
            <h1 class="quizTrue">Congreats</h1>
            <h1 class="quizFalse">oops</h1>
            <button class="quizNext">Next Question</button>
        `);
        let quizTrue = popup.querySelector(".quizTrue");
        let quizFalse = popup.querySelector(".quizFalse");
        quizTrue.style.display = "none";
        quizFalse.style.display = "none";
        popup.querySelector(".quizNext").addEventListener("click", () => {
            popup.style.display = "none";
            quiz.innerHTML = (`
            <h2 class="quizQuestion">That's all the questions for now</h2>
            `)
        });
        this.gameElement.querySelectorAll(".quizOptionFalse").forEach((ele) => {
            ele.addEventListener("click", () => {
                ele.classList.add("red");
                this.gameElement.appendChild(popup);
                quizFalse.style.display = "block";
                quizTrue.style.display = "none";
            })
        });
        this.gameElement.querySelectorAll(".quizOptionTrue").forEach((ele) => {
            ele.addEventListener("click", () => {
                document.querySelector(".addCash5").click();
                ele.classList.add("green");
                this.gameElement.appendChild(popup);
                quizTrue.style.display = "block";
                quizFalse.style.display = "none";
            })
        })

    }



    nighthawks() {
        let nighthawks = document.createElement("div");
        nighthawks.innerHTML = (`
            <img class="nighthawks" src="dist/images/Objects/nighthawks.png">
        `)
        this.gameElement.appendChild(nighthawks);
    }

    americanGothic(){
        let americanGothic = document.createElement("div");
        americanGothic.innerHTML = (`
            <img class=" americanGothic" src="dist/images/Objects/AmericanGothic.png">
        `)
        this.gameElement.appendChild(americanGothic);
    }

    andyCans(){
        let andyCans = document.createElement("div");
        andyCans.innerHTML = (`
            <img class="nighthawks" src="dist/images/Objects/andyCans.png">
        `)
        this.gameElement.appendChild(andyCans);
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
        if (this.gameType == "TheMetQuiz") {
            return this.theMetQuiz();
        }
        if (this.gameType == "nighthawks") {
            return this.nighthawks();
        }
        if (this.gameType == "americanGothic") {
            return this.americanGothic();
        }
        if (this.gameType == "andyCans") {
            return this.andyCans();
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