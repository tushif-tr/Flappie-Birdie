//board
let board;
let boardWidth = 400;
let boardHeight = 700;
let context;

//bird
let birdWidth = 40;
let birdHeight = 30;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;
let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

//rods
let rodArray = [];
let rodWidth = 70;
let rodHeight = 550;
let rodX = boardWidth;
let rodY = 0;

let topRodImg;
let bottomRodImg;

//physics
let velocityX = -2; //rods moving speed
let velocityY = 0; //bird jump
let gravity = 0.2;
let gameOver = false;
let score = 0;
let topScore = 0; //topscore

window.onload = function(){
    board = document.getElementById('board');
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    
    // context.fillStyle = "green";
    // context.fillRect(bird.x, bird.y, bird.width, bird.height);

    //load image
    birdImg = new Image();
    birdImg.src = "images/bird.png";
    birdImg.onload = function(){
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height)
    }
    topRodImg = new Image();
    topRodImg.src = 'images/top.jpeg';
    bottomRodImg = new Image();
    bottomRodImg.src = 'images/bottom.jpeg';

    requestAnimationFrame(update);
    setInterval(placeRods, 1500);
    document.addEventListener('keydown', moveBird);
    document.addEventListener('touchstart', moveBird);
}

function update(){
    requestAnimationFrame(update);
    if(gameOver){
        return;
    }
    context.clearRect(0,0, board.width, board.height);

    //bird
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0)
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height)

    if(bird.y > board.height){
        gameOver = true;
        updateTopScore();
    }

    //rods
    for(let i = 0; i < rodArray.length; i++){
        let rod = rodArray[i];
        rod.x += velocityX;
        context.drawImage(rod.img, rod.x, rod.y, rod.width, rod.height);
        if(!rod.passed && bird.x > rod.x + rod.width){
            score +=0.5;  //two rods
            rod.passed = true;
        }
        if(isCollision(bird, rod)){
            gameOver = true;
            updateTopScore();
        }
    }
    while(rodArray.length > 0 && rodArray[0].x < -rodWidth){
        rodArray.shift();
    }


    //score
    context.fillStyle = "white";
    context.font = "30px sans-serif";
    context.fillText(score, 15, 45);
    context.fillText(`Top:${topScore}`,300,45);
    context.font = "45px sans-serif";

    if(gameOver){
        context.fillText("GAME OVER!", 50, 200);
        context.fillText("Your Score", 90, 250);
        if(score<10){
            context.fillText(score, 185, 300);
        }
        else{
            context.fillText(score, 175, 300);
        }
        context.font = "60px sans-serif";
        context.fillText(`PLAY AGAIN!`, 18, 400);
    }
}

function placeRods(){
    if(gameOver){
        return;
    }
    let randomRodY = rodY - rodHeight/4 - Math.random()*(rodHeight/2);
    let openingSpace = board.height/3;
    let topRod = {
        img : topRodImg,
        x : rodX,
        y : randomRodY,
        width: rodWidth,
        height : rodHeight,
        passed: false
    }
    rodArray.push(topRod);
    let bottomRod = {
        img : bottomRodImg,
        x : rodX,
        y : randomRodY + rodHeight + openingSpace,
        width: rodWidth,
        height : rodHeight,
        passed: false
    }
    rodArray.push(bottomRod);
}

function moveBird(event){
    if(event.code == "Space" || event.code == "ArrowUp" || event.type === "touchstart"){
        //jump
        velocityY = -5.5;
    }

    //reset game
    if(gameOver){
        bird.y = birdY;
        rodArray = [];
        score = 0;
        gameOver = false;
    }
}

function isCollision(a,b){
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function updateTopScore(){
    if(score > topScore){
        topScore = score;
    }
}