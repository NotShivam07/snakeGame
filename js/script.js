// Game constants
let inputDir={x:0,y:0};
const gameOverSound=new Audio('gameover.mp3');
const foodSound=new Audio('food.mp3');
const moveSound=new Audio('move.mp3');
const musicSound=new Audio('music.mp3');
let speed=7;
let lastPaintTime=0;
let snakeArr=[
    {x:13,y:15}//yhan abhi sirf head hai snake ka
]
food={x:12,y:10};//Food is an object it is not an array. Snake was an array because it will change wrt time
let board=document.getElementById('board');
let score=0;
let sc=document.getElementById('score');
let hiscoreBox=document.getElementById('hiscoreBox');
let hiscoreval;


// Game Functions 
//->hume game loop required hota hai games mei jo baar baar screen ko paint krta hai. requestAnimationFrame ke dwara ye kaam achhe se hota hai ek achhe fps ke sath.
function main(ctime){//ab main baar baar call hoga aur requestAnimationFrame baar baar execute hoga --> aise hmne game loop bna liya hai(hum setInterval ka bhi se kr skte the. Read the resource link to clearify this)
    window.requestAnimationFrame(main);
    // console.log(ctime);
    if((ctime-lastPaintTime)/1000<1/speed){
        return;
    }
    lastPaintTime=ctime;
    gameEngine();
}

function isCollide(snake) {
    // If snake bump into himself
    for (let i = 1; i < snake.length; i++) {//yhan ek se isliye shuru kiya kyuki 0 se krne pe toh condition true hi rhegi na
        if(snake[0].x===snake[i].x && snake[0].y===snake[i].y){
            return true;
        }
    }
    if(snake[0].x>=18 || snake[0].x<=0 || snake[0].y<=0 || snake[0].y>=18)
    return true;

    return false;
}

function gameEngine(){
    // Part 1: Updating the snake array and food
    if(isCollide(snakeArr)){
        gameOverSound.play();
        musicSound.pause();
        inputDir={x:0,y:0};
        sc.innerHTML="Score: "+0;
        alert("Game Over. Press any key to play again!");
        snakeArr=[{x:13,y:15}];
        musicSound.play();
        score=0;
    }

    // If snake have eaten the food, increment the score and regenrate the food
    if(snakeArr[0].y===food.y && snakeArr[0].x===food.x){
        foodSound.play();
        score+=1;
        if(score>hiscoreval){
            hiscoreval=score;
            localStorage.setItem("hiscore",JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML="High score: "+hiscoreval;
        }
        sc.innerHTML="Score: "+score;
        snakeArr.unshift({x:snakeArr[0].x+inputDir.x,y:snakeArr[0].y+inputDir.y});//Isse ye hoga ki snake ka head uss direction mei progress kr jayega jis,e vo pehle se chal rha tha(kyuki uska head abhi ek coordinate pr hai aur usme hum current direction add karenge jo ek coordinate hoga with (0,1),(1,0),(0,-1)or(-1,0))
        let a=2;
        let b=16;
        food={x:Math.round(a+(b-a)*Math.random()),y:Math.round(a+(b-a)*Math.random())};
    }
    // Moving the snake
    for(let i=snakeArr.length-2;i>=0;i--){
        /**/snakeArr[i+1]={...snakeArr[i]};//Hume iski destructuring krni hogi kyuki directly assign krne par referencing problem ho skti hain. Sbse pehli baar for loop chalne par last wala 2nd last par aa jayega aur aisa baaki elements ke liye bhi hoga for loop se
    }
    snakeArr[0].x += inputDir.x;//Sab ek ek se shift ho jayenge par last mei hume head bhi aage bdhana hoga uske liye ye kiya hai
    snakeArr[0].y += inputDir.y;

    // Part 2: Display the snake and food
    // Display the snake
    board.innerHTML="";//kyuki hme updated snake ke sath pichla snkae nhi dikhana hai
    snakeArr.forEach((e,index)=>{
        snakeElement=document.createElement('div');//div type ka ek element create kiya hai
        snakeElement.style.gridRowStart=e.y; //ye e.x nahi hoga kyuki kis row mei rkhna hai mtlb uppr se kitni height par rkhna hai
        snakeElement.style.gridColumnStart=e.x;
        if(index===0){
            snakeElement.classList.add('head');//Aggr sirf index===0 hai yani sirf snake ka head hai toh mai head class add kr dunga 
        }
        else{
            snakeElement.classList.add('snake');//isse snakeElement(div) mei snake class add ho gyi
        }
        board.appendChild(snakeElement);
    })
    // Display the food
    foodElement=document.createElement('div');//div type ka ek element create kiya hai
    foodElement.style.gridRowStart=food.y; //ye e.x nahi hoga kyuki kis row mei rkhna hai mtlb uppr se kitni height par rkhna hai
    foodElement.style.gridColumnStart=food.x;
    foodElement.classList.add('food');//isse snakeElement(div) mei food class add ho gyi
    board.appendChild(foodElement);
}




// Main logic starts here
localStorage.setItem("hiscore",0);
let hiscore=localStorage.getItem("hiscore");
if(hiscore===null){
    hiscoreval=0;
    localStorage.setItem("hiscore",JSON.stringify(hiscoreval))
}
else{
    hiscoreval=JSON.parse(hiscore);
    hiscoreBox.innerHTML="High Score: "+hiscore;
}

window.requestAnimationFrame(main);
window.addEventListener('keyup',e=>{
    inputDir={x:0,y:1}//start the game
    musicSound.play();
    moveSound.play();
    if(musicSound.paused){
        sc.innerHTML="Score: "+0;
    }
    switch (e.key) {
        case "ArrowUp":
            // console.log("ArrowUp")
            inputDir.x=0;
            inputDir.y=-1;
            break;
        case "ArrowDown":
            // console.log("ArrowDown")
            inputDir.x=0;
            inputDir.y=1;
            break;
        case "ArrowLeft":
            // console.log("ArrowLeft")
            inputDir.x=-1;
            inputDir.y=0;
            break;
        case "ArrowRight":
            // console.log("ArrowRight")
            inputDir.x=1;
            inputDir.y=0;
            break;
    
        default:
            break;
    }
})