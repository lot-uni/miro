let connection=new WebSocket('ws://'+window.location.host+'/socket');
// const button = document.querySelector('input');
// button.addEventListener('click', send_message("hello"));

connection.onopen=function(){
    var obj={
        type:"connect"
    }
    var json=JSON.stringify(obj);
    connection.send(json);
    console.log("connection open");
};

connection.onmessage=function(m){
    let data=JSON.parse(m.data);
    let counter=document.getElementById("counter");
    let game_turn_view=document.getElementById("game_turn");
    if(data.type=="connect"){
      console.log("new person connected");
    }else if(data.type=="disconnect"){
      console.log("person disconnected");
    }else if(data.type=="change"){
      console.log(data.value);
      counter.innerHTML="現在のアクセス数"+data.value;
    }else if(data.type=="piece_move"){
      console.log("game_turn_change");
      console.log(data);
      game_turn=data.value;
      game_turn_view.innerHTML="現在"+game_turn+"手目です";
      play_data[data.before_point[0]][data.before_point[1]]=null;
      play_data[data.after_point[0]][data.after_point[1]]=data.name;
    }
};

connection.onclose=function(){
    var obj={
        type:"disconnect"
    }
    var json=JSON.stringify(obj);
    connection.send(json);
    console.log("connection close");
}

// p5jsで将棋を作る

// 環境変数を定義
let init_data=[["香\n車:1","桂\n馬:1","銀\n将:1","金\n将:1","王\n将:1","金\n将:1","銀\n将:1","桂\n馬:1","香\n車:1"],[,"飛\n車:1",,,,,,"角\n行:1",],["歩\n兵:1","歩\n兵:1","歩\n兵:1","歩\n兵:1","歩\n兵:1","歩\n兵:1","歩\n兵:1","歩\n兵:1","歩\n兵:1"],[,,,,,,,,],[,,,,,,,,],[,,,,,,,,],["歩\n兵:-1","歩\n兵:-1","歩\n兵:-1","歩\n兵:-1","歩\n兵:-1","歩\n兵:-1","歩\n兵:-1","歩\n兵:-1","歩\n兵:-1"],[,"角\n行:-1",,,,,,"飛\n車:-1",],["香\n車:-1","桂\n馬:-1","銀\n将:-1","金\n将:-1","王\n将:-1","金\n将:-1","銀\n将:-1","桂\n馬:-1","香\n車:-1"]];
let captured_piece=[["歩\n兵:0",'飛\n車:0','角\n行:0','香\n車:0','桂\n馬:0','銀\n将:0','金\n将:0'],["歩\n兵:0",'飛\n車:0','角\n行:0','香\n車:0','桂\n馬:0','銀\n将:0','金\n将:0']]
let piece_choise=[];
let now_point=[];
let game_turn=0;
let player_turn;
let play_data = init_data;
let breadth=40;

let rayToCoord = function(x,y,a,b){
  let areaContains = (x,y)=> x>=0&&x<9&&y>=0&&y<9;
  let coords = [];
  while(areaContains(x,y)){
    coords.push([x,y]);
    x+=a;
    y+=b;
  }
  return coords;
}

let coordsToDisks = (coords,play_data)=>coords.map(c=>play_data[c[1]][c[0]]);

function piece_movie_choise(y,x){
  switch(play_data[y][x].slice(0,1)){
    case "歩":
      console.log("歩");
      console.log("y:",y,"x:",x);
      now_point=[y,x];
      piece_choise.push([y-(2*player_turn-1),x]);
      break;
    case "香":
      console.log("香");
      break;
    case "桂":
      console.log("桂");
      break;
    case "銀":
      console.log("銀");
      break;
    case "金":
      console.log("金");
      break;
    case "王":
      console.log("王");
      break;
    case "角":
      console.log("角");
      break;
    case "飛":
      console.log("飛");
      break;
  }
}

function setup(){
  if(document.getElementById("player").innerText=="先手"){
    player_turn=1;
  }else if(document.getElementById("player").innerText=="後手"){
    player_turn=0;
  }
  createCanvas(10*breadth,11*breadth);
  angleMode(DEGREES);
}
function draw(){
  background(242,182,109);
  fill(242,182,109);

  for(let y=0; y<9; y++){
    for(let x=0; x<9; x++){
      let posX=x*breadth;
      let posY=y*breadth;
      rect(posX+breadth/2,posY+breadth,breadth,breadth);
    }
  }
  for(let y=0; y<9; y++){
    for(let x=0; x<9; x++){
      if(play_data[y][x]!=null){
        if(play_data[y][x].slice(4)=="-1"){
          fill(242,182,109);
          beginShape();
          vertex(breadth*(1+x),breadth*(1+y));
          vertex(breadth*(0.7+x), breadth*(1.2+y));
          vertex(breadth*(0.5+x), breadth*(2+y));
          vertex(breadth*(1.5+x), breadth*(2+y));
          vertex(breadth*(1.3+x), breadth*(1.2+y));
          endShape(CLOSE);
          fill(100);
          text(play_data[y][x].slice(0,3),x*breadth+breadth*0.875,(y+1.5)*breadth);
        }else{
          fill(242,182,109);
          push();
          rotate(180);
          translate(-breadth*(x+1.5),-breadth*(y+2.5));
          beginShape();
          vertex(breadth*0.5,breadth*0.5);
          vertex(breadth*0.2, breadth*0.7);
          vertex(0, breadth*1.5);
          vertex(breadth, breadth*1.5);
          vertex(breadth*0.8, breadth*0.7);
          endShape(CLOSE);
          fill(100);
          text(play_data[y][x].slice(0,3),breadth*0.35,breadth);
          pop();
        }
      }
    }
  }
  piece_choise.forEach(function(item){
    fill(0);
    rect(breadth*(item[1]+0.9),breadth*(item[0]+1.35),breadth*0.2,breadth*0.2);
  });
}
function mousePressed(){
  let x=floor((mouseX-breadth*0.5)/breadth);
  let y=floor((mouseY-breadth)/breadth);
  if(x>=0&&x<9&&y>=0&&y<9){
    if(player_turn!=game_turn%2){
      if(play_data[y][x]!=null&&play_data[y][x].slice(4)!=2*player_turn-1){
        console.log("遊べる");
        piece_movie_choise(y,x);
      }else if(piece_choise.length>0){
        console.log("確定");
        piece_choise.forEach(function(item){
          console.log(item);
          play_data[item[0]][item[1]]=play_data[now_point[0]][now_point[1]];
          play_data[now_point[0]][now_point[1]]=null;
          piece_choise=[];
          game_turn+=1;
          var obj={
            type:"piece_move",
            before_point:now_point,
            after_point:[item[0],item[1]],
            name:play_data[item[0]][item[1]],
            value:game_turn
          }
          var json=JSON.stringify(obj);
          connection.send(json);
        });
      }
    }else{
      // console.log("遊べない");
    }
  }else{
    // console.log("out of range");
  }
}