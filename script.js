var canvas = document.getElementById('mycanvas');
var ctx = canvas.getContext('2d');

// ball dimensions and speed 
var x = canvas.width/2;
var y = canvas.height - 30;
var radius = 15;
var dx = 2;
var dy = -2;

// paddle dimensions
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth)/2;

// paddle controls
var rightPressed = false;
var leftPressed = false;

// score
var score = 0;

// brick dimensions
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var bricks = [];
for(var c = 0; c < brickColumnCount ; c++){
    bricks[c] = [];
    for(var r = 0; r < brickRowCount ; r++){
        bricks[c][r] = { x : 0, y : 0, status : true};
    }
}

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e){
    if(e.keyCode == 39){             // 39 is key code for right arrow key ->
        rightPressed = true; 
    }
    else if(e.keyCode == 37){        // 37 is key code for left arrow key <-
        leftPressed = true;
    }
}

function keyUpHandler(e){
    if(e.keyCode == 39){               
        rightPressed = false;
    }
    else if(e.keyCode == 37){
        leftPressed = false;
    }
}

function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBall(){
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function initWall(){
    for(var c = 0; c < brickColumnCount ; c++){
        for(var r = 0; r < brickRowCount ; r++){
            var brickX = (c*(brickWidth+brickPadding)) + brickOffsetLeft;
            var brickY = (r*(brickHeight+brickPadding)) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
        }
    }
}

function drawBricks(){
    for(var c = 0; c < brickColumnCount ; c++){
        for(var r = 0; r < brickRowCount ; r++){
            var brick = bricks[c][r];
            if(brick.status){
                ctx.beginPath();
                ctx.rect(brick.x, brick.y, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function collisionDetection(){
    for(var c = 0; c < brickColumnCount ; c++){
        for(var r = 0; r < brickRowCount ; r++){
            if(bricks[c][r].status && x + radius > bricks[c][r].x && 
               x < (bricks[c][r].x + brickWidth + radius) && y + radius > bricks[c][r].y && 
               (y < bricks[c][r].y + brickHeight + radius)){
                console.log("Inside");
                bricks[c][r].status = false;
                dy = -dy;
                score++;
                if(score == brickRowCount * brickColumnCount){
                    alert("YOU WIN, CONGRATULATIONS");
                    document.location.reload();
                }
            }
        }
    }
}

function drawScore(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
} 

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    collisionDetection();
    
    if(x + radius >= canvas.width || x - radius <= 0)
        dx = -dx;
    if( y + radius >= canvas.height || y - radius <= 0)
        dy = -dy;
    else if(y + radius + paddleHeight > canvas.height){
        if(x + radius > paddleX && x - radius < paddleX + paddleWidth){
            dy = -dy;  
        }else{
            alert("GAME OVER");
            document.location.reload();
        }
    
    }
    
    
    if(rightPressed && paddleX < canvas.width-paddleWidth){
        paddleX += 7;
    }
    else if(leftPressed && paddleX > 0){
        paddleX -= 7;
    }
        
    x += dx;
    y += dy;
}

initWall();
setInterval(draw, 10);