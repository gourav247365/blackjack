const cardsdeck=[
    ['1s.png','1c.png','1h.png','1d.png'],
    ['2s.png','2c.png','2h.png','2d.png'],
    ['3s.png','3c.png','3h.png','3d.png'],
    ['4s.png','4c.png','4h.png','4d.png'],
    ['5s.png','5c.png','5h.png','5d.png'],
    ['6s.png','6c.png','6h.png','6d.png'],
    ['7s.png','7c.png','7h.png','7d.png'],
    ['8s.png','8c.png','8h.png','8d.png'],
    ['9s.png','9c.png','9h.png','9d.png'],
    ['10s.png','10c.png','10h.png','10d.png'],
    ['11s.png','11c.png','11h.png','11d.png'],
    ['12s.png','12c.png','12h.png','12d.png'],
    ['13s.png','13c.png','13h.png','13d.png']   
];

let obj={
    score:0
};
let obj2={
    score:0
};

let i=1;
let scoreEl=document.getElementById("score-el");    
let messageEl=document.getElementById("message-el");
let hitBtn=document.getElementById("hit-btn");
let startgameBtn=document.getElementById("startgame-btn");
let statusEl=document.getElementById("status-el");
let cardsDiv=document.getElementById("cards-div");
let parentEl=document.getElementById("parent");
let playernameEl=document.getElementById("playername-el");
let nameEl=document.getElementById("name");
let gameSt=document.getElementById("game-st");
let newgameBtn=document.getElementById("newgame-btn")
let instructionsBtn=document.getElementById("instructions-btn")
let closeBtn=document.getElementById("close-btn")
let gameover=false;
let disablehitbtn=false;
let switched=false;

let previd;
let headingEl=document.querySelector("h1");
let afterStart=document.querySelectorAll(".afterstart");
// console.log(afterStart);

hitBtn.addEventListener("click",()=>{
    hit("cards-div","score-el",obj,flip);
});

newgameBtn.addEventListener("click",()=>{
    window.location.reload();
});

instructionsBtn.addEventListener("click", () => {
    document.getElementById("mydialog").showModal();
});

closeBtn.addEventListener("click", () => {
    document.getElementById("mydialog").close();
});

function ChangeBet() {
    document.getElementById("amt").innerText=document.getElementById("bet-el").value
}

function start(){
    disablehitbtn=true;
    headingEl.style.transition='none';
    nameEl.style.display='none';
    document.querySelector(".sel-div").style.display="none"
    cardsDiv.style.display='inline-block';
    startgameBtn.style.display='none';
    statusEl.textContent='Want a New Card?';
    hitBtn.style.display='inline-block';
    parentEl.style.display='flex';
    for(let el of afterStart) {
        el.style.display='inline';
    }
    if(nameEl.value) { 
        playernameEl.innerText=nameEl.value;
    }

    setTimeout(()=>{
        flip("one",obj,"score-el",message);
    },1250);

    setTimeout(()=>{
        flip("two",obj,"score-el",message);
        disablehitbtn=false;
    },2250);
}

function game_over(){
    for(let el of afterStart) {
        el.style.display='none';
    }
    document.getElementById("newgame-btn").style.display='inline-block';
    document.getElementById("instructions-btn").style.display='none';
}

function message() {
    if(obj.score<21) {
        messageEl.textContent='You are Still Alive in the Game';
    }
    else if(obj.score===21 && obj2.score===21) {
        messageEl.textContent='';
        gameSt.textContent='DRAW';
        gameSt.style.color='orange';
        game_over();
        gameover=true;
    }
    else if(obj.score>21) {
        messageEl.textContent='You are out of the Game';
        gameSt.textContent='YOU LOSE';
        gameSt.style.color='red';
        game_over();
        gameover=true;
    }
    if(obj2.score>21){
        messageEl.textContent='You got Blackjack';
        gameSt.textContent='YOU WON';
        gameSt.style.color='green';
        game_over();
        gameover=true;
    }
    if(obj2.score>obj.score && obj2.score<=21){
        messageEl.textContent='You are out of the Game';
        gameSt.textContent='YOU LOSE';
        gameSt.style.color='red';
        game_over();
        gameover=true;
    }
}

function hit(div_id,score_el,obj_el,call_flip) {
    if(!disablehitbtn || switched ) {
        disablehitbtn=true;
        
        if(previd)
            document.getElementById(previd).style.animation='none';
        if(!gameover) {
            let newid='next'+i;
            document.getElementById(div_id).innerHTML+=` <img src="/assets/cards/back.png" id=${newid} height="160px" width="114px" alt="error" > `;  
            // document.getElementById(newid).style.animation='cardin 1s cubic-bezier(0.25, 0.1, 0.23, 0.98)'
            setTimeout(()=>{
                call_flip(newid,obj_el,score_el,message);
                disablehitbtn=false;
            },1100)
            i++;
        }
    }
}

function flip(card_id,obj_el,score_el,call_message) {
    if(previd) {
        document.getElementById(previd).style.animation='none';
    }
    let card=Math.floor(Math.random()*13)+1;
    let tmp=Math.floor(Math.random()*4);
    while(cardsdeck[card-1][tmp]==null) {
        card=Math.floor(Math.random()*13)+1;
        tmp=Math.floor(Math.random()*4);
    }
    setTimeout(()=>{
        document.getElementById(card_id).src="/assets/cards/"+cardsdeck[card-1][tmp];    
        cardsdeck[card-1][tmp]=null;
        document.getElementById(score_el).textContent="Score: "+ obj_el.score;
    },250);
    document.getElementById(card_id).style.animation='flipback linear 0.25s 2 alternate-reverse';
    previd=card_id;
    if(card>=10)
        obj_el.score+=10;
    else if(card>=1 && card<=9)
        obj_el.score+=card;
    disablenewcard=false;
    if(obj_el.score===21 && obj_el===obj)
        switchPlayer();
    call_message();
}

function switchPlayer() {
    switched=true;
    disablehitbtn=true;
    flip("d-one",obj2,"d-score-el",message);
    
    setTimeout(()=>{
        flip("d-two",obj2,"d-score-el",message);
    },1250);

    // hitAndFlip();

    const ref= setInterval(()=>{
        if(obj.score >= obj2.score && obj2.score < 21){
            hit("d-cards-div", "d-score-el",obj2 ,flip)
        }
        if(gameover){
            clearInterval(ref)
        }
    },2250)
}