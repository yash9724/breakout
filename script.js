var canvas = document.getElementById('mycanvas');
var ctx = canvas.getContext('2d');

// player lives
var lives = 3;

// game level
var level = 1;
var lastLevel = 5;

var paused = false;

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
function initBricks(){
    for(var c = 0; c < brickColumnCount ; c++){
        bricks[c] = [];
        for(var r = 0; r < brickRowCount ; r++){
            bricks[c][r] = { x : 0, y : 0, status : true};
        }
}
}

function mouseMoveHandler(e){
    // e.clientX ==> Returns the horizontal coordinate 
    // of the mouse pointer, relative to the current window, 
    // when the mouse event was triggered
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > paddleWidth/2 && relativeX < canvas.width - paddleWidth/2){
        // middle of paddle will at same position as x of mouse pointer
        paddleX = relativeX - paddleWidth/2;
    }
}

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
    initBricks();
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
                    if(level === lastLevel){
                        alert("YOU WIN, CONGRATULATIONS");
                        document.location.reload();
                    } else {
                        level++;
                        brickRowCount++;
                        canvas.height += brickHeight; 
                        // reset ball, paddle position and 
                        // brick wall
                        paddleX = (canvas.width - paddleWidth)/2;
                        x = canvas.width/2;
                        y = canvas.height - 30;
                        initWall();

                        // increase ball speed
                        dx = -dx;
                        dx += 1;
                        dy = -dy;
                        dy -= 1;
                        score = 0;    
                        paused = true;
                        ctx.rect(0, 0, canvas.width, canvas.height);
                        ctx.fillStyle = "#0095DD";
                        ctx.fill();
                        ctx.font = "16px Arial";
                        ctx.fillStyle = "#FFFFFF";
                        ctx.fillText("Level " + (level-1) +" completed, starting next level...", 110, 150);
                        setTimeout(function(){
                            // This function will run after 3 secs
                            paused = false;
                            draw();
                        }, 2000);
                    }
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

function drawLives(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function drawLevel(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Level: "+level, 210, 20);

}

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    drawLevel();
    collisionDetection();
    
    if(x + radius >= canvas.width || x - radius <= 0)
        dx = -dx;
    if( y + radius >= canvas.height || y - radius <= 0)
        dy = -dy;
    else if(y + radius + paddleHeight > canvas.height){
        if(x + radius > paddleX && x - radius < paddleX + paddleWidth){
            dy = -dy;  
        }else{
            lives--;
            if(lives){
                x = canvas.width/2;
                y = canvas.height-30;
                paddleX = (canvas.width-paddleWidth)/2;
            }else{
                // alert("GAME OVER");
                // document.location.reload();
            }

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

    if(!paused){
        // this function will give smooth and efficient frame rendering 
        // as compared to setInterval 
        requestAnimationFrame(draw);
    }
    
}

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
document.addEventListener("mousemove", mouseMoveHandler);
initWall();
// setInterval(draw, 10);          //has fixed frame rate of 10
draw();