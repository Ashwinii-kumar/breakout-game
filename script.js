const rulesBtn=document.getElementById("rules-btn");
const closeBtn=document.getElementById("close-btn");
const rules=document.getElementById("rules");
const canvas=document.getElementById("canvas");
const ctx=canvas.getContext('2d');
let gameover=new Audio("gameover.mp3");
const ting=new Audio("tinggg.mp3");
const plBtn=document.getElementById("pl");
let flag=true;
let score=0;
let scores=[];
// ting.duration=.01;
// console.log(ting.duration);
let delayInMilliseconds = 1000; //1 second


let highScore = localStorage.getItem('score');
// Draw High Score
function drawHighScore() {
    ctx.font ='20px Arial';
    ctx.fillText(`High Score: ${localStorage.getItem('score')}`, canvas.width - 780, 30);
}


rulesBtn.addEventListener("click",pause);
closeBtn.addEventListener("click",playy);
 function pause(){
    if(score>0)
    {
        flag=false;
    }
    
 }
 function playy()
 {
    if(flag===false && score>0)
    {
        flag=true;
        requestAnimationFrame(update);
    }
   
 }


 pl.addEventListener("click",update);


function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
  }




//create brickrowe and brick cols


// setInterval(()=>{
//     const viewport_height=window.innerHeight;
// const viewport_width=window.innerWidth;
//     console.log(typeof(viewport_height));
//     console.log(viewport_width);
// },2000)
// if(window.innerWidth <= 767){
//     let brickRowCount=6;
//     let brickColCount=5;
// }
// else{

// }
    const brickRowCount=10;
    const brickColCount=5;
const bricks=[];
//rules and close event handlers
rulesBtn.addEventListener('click',()=>{
    rules.classList.add('show');
});

closeBtn.addEventListener('click',()=>{
    rules.classList.remove('show');
});


//create ball,paddle and brick props

const ball={
    x:canvas.width/2,
    y:canvas.height/2,
    size:10,
    speed:4,
    dx:4,
    dy:-4
};

const paddle={
    x:canvas.width/2-45,
    y:canvas.height-20,
    w:180,
    h:15,
    speed:12,
    dx:0,
    
};

const brickInfo={
     w:70,
     h:20,
     padding:5,
     offSetX:35,
     offSetY:60,
     visible:true
};



//draw ball
function drawBall(){
    
   ctx.beginPath();
   ctx.arc(
    ball.x,ball.y,ball.size,0,Math.PI*2
   );
   ctx.fillStyle="red";
   ctx.fill();
   ctx.closePath();
}

function drawPaddle()
{
    ctx.beginPath();
    ctx.rect(
        paddle.x,paddle.y,paddle.w,paddle.h
    );
    ctx.fill();
    ctx.fillStyle="purple";
    ctx.fill();
    ctx.closePath();
}
function drawScore(){
    ctx.font="20px Arial ";
    ctx.fillStyle = "green";
    ctx.fillText(`Score: ${score}`,canvas.width-100,30);
}

//move paddle

function movePaddle(){
    paddle.x+=paddle.dx;

    //wall detection
    if(paddle.x+paddle.w > canvas.width)
    {
        paddle.x=canvas.width-paddle.w;
    }
    if(paddle.x<0)
    {
        paddle.x=0;
    }
}


// draw();
function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawPaddle();
    drawBall();
    drawScore();
    drawHighScore();
    drawBricks();
    collisionDetection();
}

function update()
{

    pl.disabled=true;
    canvas.style.display="block";
    canvas.style.backgroundColor="#222";
    pl.style.display="none";
    moveBall();
    movePaddle();
    draw();
   
    
   
   if(flag)
   {
    requestAnimationFrame(update);
   }
   else{
    return;

   }
   
}






//create 2-d array of bricks 
// each (i,j)th element will be an object with x and y different and rest properties same as each other
//also rows will have j same,x different,offsetX is added
//columns will have x same ,y different,offsety is added
//
for(let i=0;i<brickRowCount;i++)
{
    bricks[i]=[];
    for(let j=0;j<brickColCount;j++)
    {
        const x=i*(brickInfo.w + brickInfo.padding)+brickInfo.offSetX;
        const y=j*(brickInfo.h + brickInfo.padding)+brickInfo.offSetY;

        bricks[i][j]={
            x,y,...brickInfo
        };
    }
}

//draw bricks

function drawBricks(){

    bricks.forEach((row)=>{
        row.forEach((brick)=>{
             
             ctx.beginPath();
             ctx.rect(brick.x,brick.y,brick.w,brick.h);
             ctx.fillStyle=brick.visible?"#2395DD":"transparent";
             ctx.fill();
             ctx.closePath();



        });
    });
};



//move ball
function moveBall()
{
    ball.x+=ball.dx;
    ball.y+=ball.dy;

    //wall detection

    if(ball.x + ball.dx > canvas.width-ball.size || ball.x + ball.dx < ball.size)
    {
        ball.dx*=-1;
    }
    if( ball.y + ball.dy < ball.size)
    {
        ball.dy*=-1;
    }
    else if(ball.y + ball.dy > canvas.height-ball.size)
    {
        gameover.play();
        alert(`"GAME OVER!!  yOUR sCORE:${score}"`);
        if(localStorage.getItem('score') < score) {
            localStorage.setItem('score', score);
        }
        highScore = localStorage.getItem('score');
        score=0;
        ball.x=canvas.width/2;
        ball.y=canvas.height/2;
        ball.speed=+1;
        if(ball.dx > 0)
        {
            ball.dx=-4;
        }
        else{
            ball.dx=4;
        }
        bricks.forEach((row)=>{
            row.forEach((brick)=>{
               brick.visible=true;
            })
       })
    //    flag=false;
    
    
       document.location.reload();

        
    }

    //paddle collision

    if (
        ball.x + ball.size > paddle.x &&
        ball.x - ball.size < paddle.x + paddle.w &&
        ball.y + ball.size > paddle.y
      ) {
        ball.dy = -ball.speed;
      }
}

//check ball and brick collsion
function collisionDetection()
{
    bricks.forEach((row)=>{
        row.forEach((brick)=>{
           if(brick.visible)
           {
              if((ball.x + ball.size > brick.x)&&
                (ball.x - ball.size < brick.x + brick.w)&&
                (ball.y + ball.size > brick.y)&&
                (ball.y - ball.size < brick.y + brick.h))
                {
                    ball.dy=-ball.dy;
                    
                    
                    brick.visible=false;
                   
                    increaseScore();
                }
    
           }
    
    
        });
    });

   
    
}








//paddle controls

function keyDown(e)
{
    if(e.key==="ArrowLeft" || e.key==="Left")
    {
         paddle.dx=-paddle.speed;
    }
    else if(e.key==="ArrowRight" || e.key==="Right")
    {
        paddle.dx=paddle.speed;
    }
}

function keyUp(e)
{
    paddle.dx=0;
  
}


//keyboard events
document.addEventListener("keydown",keyDown);
document.addEventListener("keyup",keyUp);


function increaseScore()
{
    score++;
    if(score%(brickColCount*brickRowCount)===0)
    {
        bricks.forEach((row)=>{
             row.forEach((brick)=>{
                brick.visible=true;
             })
        })
    }
    // ball.dx+=3;
    // ball.dy+=-3;
}




