window.addEventListener("load", function() {
    let urlParams = new URLSearchParams(window.location.search);
    let userData = document.querySelectorAll("span");
    let container = document.querySelector(".container");
    let start = document.querySelectorAll("button");
    let message = document.querySelectorAll("h1");
    let messageImg = document.querySelectorAll("img")[1];
    let messageBlock = document.querySelectorAll("div")[1];
    let lastDate = document.querySelector("h2");
    let lastScore = userData[4];
    let birdsSrcs = ["bird1.gif", "bird2.gif", "bird3.gif"];
    let allBirds = [];
    let bombedBirdes = [];
    let scores = 0;
    let birdsKilled = 0;

    if (urlParams.get("name")) {
        message[0].innerHTML = `Welcome ${urlParams.get("name")}`;
        userData[0].innerHTML = `Welcome : ${urlParams.get("name")}`;
    }

    function startTimer() {
        let seconds = 60;
        let timerId = setInterval(() => {
            seconds--;
            if (seconds == 0) {
                clearInterval(timerId);
            }
            userData[2].innerHTML = "Time Limit : 0." + seconds;
        }, 1000);
    }

    let startGame = function() {
        container.style.display = "none";
        lastScore.innerText = "Last Score : " + localStorage.getItem("lastScore");
        localStorage.setItem("lastDate", new Date().toLocaleString());

        startTimer();
        createBird();
        createBomb();
        bombedBirdes.length = 0;
        allBirds = [];
        birdsKilled = 0;
        scores = 0;
        userData[1].innerHTML = "Scores : " + 0;
        userData[3].innerHTML = "Birds Killed : " + 0;
        let birdsTimer = setInterval(createBird, 1000);
        setTimeout(function() {
            clearInterval(birdsTimer);
        }, 48700);
        let bombTimer = setInterval(createBomb, 2000);
        setTimeout(function() {
            clearInterval(bombTimer);
        }, 57000);
        setTimeout(() => {
            if (scores > 50) {
                message[1].innerHTML = "You Win";
                messageImg.src = "img/win.jfif";
            } else {
                message[1].innerHTML = "You Lose";
                messageImg.src = "img/lose.jfif";
            }
            messageBlock.style.display = "block";
            message[2].innerHTML = "Your Score is : " + scores;
            localStorage.setItem("lastScore", scores);
            lastDate.innerHTML = "Last Visit : " + localStorage.getItem("lastDate");
        }, 60000);
    }
    start[0].addEventListener("click", () => {
        startGame();
    });
    start[1].addEventListener("click", () => {
        messageBlock.style.display = "none";
        startGame();
    });
    let createBird = () => {
        let bird = document.createElement("img");
        bird.src = "img/" + birdsSrcs[Math.floor(Math.random() * birdsSrcs.length)];
        bird.classList.add("bird");
        document.body.appendChild(bird);
        let top = Math.random() * (innerHeight - bird.height);
        bird.style.top = top + "px";
        bird.style.left = "0px";
        allBirds.push(bird);
        moveRight(bird, 0, top);
    };
    let moveRight = function(bird, left, top) {
        let id = setInterval(function() {
            left += 10;

            if (left < (innerWidth - bird.width)) {
                bird.style.left = left + "px";
            } else {
                clearInterval(id);
                let index = allBirds.indexOf(bird);
                allBirds.splice(index, 1);
                bird.remove();
            }
        }, 100);
    }

    let createBomb = () => {
        let bomb = document.createElement("img");
        bomb.src = "img/bomb.png";
        bomb.classList.add("bomb");
        document.body.appendChild(bomb);
        let left = Math.random() * (innerWidth - bomb.width);
        bomb.style.left = left + "px";
        bomb.style.top = "0px";
        let startFall = fallDown(bomb, 0, left);
        bomb.addEventListener("click", function() {
            clearInterval(startFall);
            let firedBomb = this;
            firedBomb.src = "img/bombed.jpg";
            firedBomb.style.width = "200px";
            firedBomb.style.height = "200px";
            let bombLeft = +firedBomb.style.left.replace("px", "");
            let bombTop = +firedBomb.style.top.replace("px", "");
            let bombWidth = firedBomb.width;
            let bombHeight = firedBomb.height;
            setTimeout(function() {
                firedBomb.remove();
            }, 500);
            allBirds.forEach(function(bird) {
                let birdLeft = +bird.style.left.replace("px", "");
                let birdTop = +bird.style.top.replace("px", "");
                let birdWidth = bird.width;
                let birdHeight = bird.height;
                if (birdLeft + birdWidth >= bombLeft &&
                    birdLeft <= bombLeft + bombWidth * 2 &&
                    birdTop + birdHeight >= bombTop &&
                    birdTop <= bombTop + bombHeight * 2) {
                    bombedBirdes.push(bird.src.slice(-9, -4));
                    let index = allBirds.indexOf(bird);
                    allBirds.splice(index, 1);
                    bird.remove();
                }
            });
            bombedBirdes.forEach(function(bombed) {
                if (bombed == "bird1")
                    scores -= 10;
                else if (bombed == "bird2")
                    scores += 10;
                else if (bombed == "bird3")
                    scores += 5;
            });
            birdsKilled += bombedBirdes.length;
            userData[1].innerHTML = "Scores : " + scores;
            userData[3].innerHTML = "Birds Killed : " + birdsKilled;
            bombedBirdes.length = 0;
        });
    };
    let fallDown = function(bomb, top, left) {
        let id = setInterval(function() {
            top += 5;

            if (top < (innerHeight - bomb.height)) {
                bomb.style.top = top + "px";
            } else {
                clearInterval(id);
                bomb.remove();
            }
        }, 50);
        return id;
    }
});