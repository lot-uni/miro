let connection=new WebSocket('ws://'+window.location.host+'/socket');

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
      counter.innerHTML="現在のアクセス数"+data.value;
    }else if(data.type="move"){
      game.game_turn=data.game_turn;
      game_turn_view.innerHTML=data.game_turn;
      game.play_data[data.before_point[1]][data.before_point[0]]=null;
      game.play_data[data.after_point[1]][data.after_point[0]]=data.name;
      console.log(data.before_point);
      console.log(data.after_point);
      console.log(data.name);

    }else if(data.type="server"){
      console.log("server");
      console.log(data.value);
    }
};


// ゲームのコード
let game;
let rayToCoords = function(x,y,a,b){
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
function setup(){
  game=new Game();
  createCanvas(10*game.breadth,11*game.breadth);
  angleMode(DEGREES);
}
function draw(){
  background(game.board_color);
  game.frame_draw();
  game.piece_draw();
  game.piece_choise_draw();
}
function mousePressed(){
  let x = floor((mouseX-game.breadth*0.5)/game.breadth);
  let y = floor((mouseY-game.breadth)/game.breadth);
  if(game.player_turn!=game.game_turn%2&&game.play_data[y][x]!=null&&game.play_data[y][x].slice(4)!=2*game.player_turn-1){
    game.now_point=[x,y];
    game.piece_choise=[];
    switch(game.play_data[y][x].slice(0,1)){
      case "歩":
        game.look_around(x,y,1,0);
        break
      case "香":
        var breakpoint=true;
        rayToCoords(x,y,0,-2*game.player_turn+1).slice(1).forEach(function(c){
          if(game.play_data[c[1]][c[0]]==null&&breakpoint){
            game.piece_choise.push(c);
          }else if(game.play_data[c[1]][c[0]]!=null&&game.play_data[c[1]][c[0]].slice(4)==2*game.player_turn-1&&breakpoint){
            game.piece_choise.push(c);
            breakpoint=false;
          }else{
            breakpoint=false;
          }
        });
        break
      case "桂":
        game.look_way(x,y,game.player_turn);
        break
      case "銀":
        game.look_around(x,y,1,0);
        game.look_around(x,y,1,1);
        game.look_around(x,y,1,-1);
        game.look_around(x,y,-1,-1);
        game.look_around(x,y,-1,1);
        break
      case "金":
        game.look_around(x,y,1,0);
        game.look_around(x,y,1,1);
        game.look_around(x,y,1,-1);
        game.look_around(x,y,0,1);
        game.look_around(x,y,0,-1);
        game.look_around(x,y,-1,0);
        break
      case "角":
        var breakpoint=true;
        rayToCoords(x,y,-2*game.player_turn+1,-2*game.player_turn+1).slice(1).forEach(function(c){
          if(game.play_data[c[1]][c[0]]==null&&breakpoint){
            game.piece_choise.push(c);
          }else if(game.play_data[c[1]][c[0]]!=null&&game.play_data[c[1]][c[0]].slice(4)==2*game.player_turn-1&&breakpoint){
            game.piece_choise.push(c);
            breakpoint=false;
          }else{
            breakpoint=false;
          }
        });
        breakpoint=true;
        rayToCoords(x,y,-2*game.player_turn+1,2*game.player_turn-1).slice(1).forEach(function(c){
          if(game.play_data[c[1]][c[0]]==null&&breakpoint){
            game.piece_choise.push(c);
          }else if(game.play_data[c[1]][c[0]]!=null&&game.play_data[c[1]][c[0]].slice(4)==2*game.player_turn-1&&breakpoint){
            game.piece_choise.push(c);
            breakpoint=false;
          }else{
            breakpoint=false;
          }
        });
        breakpoint=true;
        rayToCoords(x,y,2*game.player_turn-1,-2*game.player_turn+1).slice(1).forEach(function(c){
          if(game.play_data[c[1]][c[0]]==null&&breakpoint){
            game.piece_choise.push(c);
          }else if(game.play_data[c[1]][c[0]]!=null&&game.play_data[c[1]][c[0]].slice(4)==2*game.player_turn-1&&breakpoint){
            game.piece_choise.push(c);
            breakpoint=false;
          }else{
            breakpoint=false;
          }
        });
        breakpoint=true;
        rayToCoords(x,y,2*game.player_turn-1,2*game.player_turn-1).slice(1).forEach(function(c){
          if(game.play_data[c[1]][c[0]]==null&&breakpoint){
            game.piece_choise.push(c);
          }else if(game.play_data[c[1]][c[0]]!=null&&game.play_data[c[1]][c[0]].slice(4)==2*game.player_turn-1&&breakpoint){
            game.piece_choise.push(c);
            breakpoint=false;
          }else{
            breakpoint=false;
          }
        });
        break
      case "飛":
        var breakpoint=true;
        rayToCoords(x,y,0,-2*game.player_turn+1).slice(1).forEach(function(c){
          if(game.play_data[c[1]][c[0]]==null&&breakpoint){
            game.piece_choise.push(c);
          }else if(game.play_data[c[1]][c[0]]!=null&&game.play_data[c[1]][c[0]].slice(4)==2*game.player_turn-1&&breakpoint){
            game.piece_choise.push(c);
            breakpoint=false;
          }else{
            breakpoint=false;
          }
        });
        breakpoint=true;
        rayToCoords(x,y,0,2*game.player_turn-1).slice(1).forEach(function(c){
          if(game.play_data[c[1]][c[0]]==null&&breakpoint){
            game.piece_choise.push(c);
          }else if(game.play_data[c[1]][c[0]]!=null&&game.play_data[c[1]][c[0]].slice(4)==2*game.player_turn-1&&breakpoint){
            game.piece_choise.push(c);
            breakpoint=false;
          }else{
            breakpoint=false;
          }
        });
        breakpoint=true;
        rayToCoords(x,y,-2*game.player_turn+1,0).slice(1).forEach(function(c){
          if(game.play_data[c[1]][c[0]]==null&&breakpoint){
            game.piece_choise.push(c);
          }else if(game.play_data[c[1]][c[0]]!=null&&game.play_data[c[1]][c[0]].slice(4)==2*game.player_turn-1&&breakpoint){
            game.piece_choise.push(c);
            breakpoint=false;
          }else{
            breakpoint=false;
          }
        });
        breakpoint=true;
        rayToCoords(x,y,2*game.player_turn-1,0).slice(1).forEach(function(c){
          if(game.play_data[c[1]][c[0]]==null&&breakpoint){
            game.piece_choise.push(c);
          }else if(game.play_data[c[1]][c[0]]!=null&&game.play_data[c[1]][c[0]].slice(4)==2*game.player_turn-1&&breakpoint){
            game.piece_choise.push(c);
            breakpoint=false;
          }else{
            breakpoint=false;
          }
        });
        break
      case "王":
        game.look_around(x,y,1,0);
        game.look_around(x,y,1,1);
        game.look_around(x,y,1,-1);
        game.look_around(x,y,0,1);
        game.look_around(x,y,0,-1);
        game.look_around(x,y,-1,0);
        game.look_around(x,y,-1,1);
        game.look_around(x,y,-1,-1);
        break
    }
  }else{
    game.piece_choise.forEach(function(e){
      if(e[0]==x&&e[1]==y){
        game.game_turn++;
        var obj={
          type:"move",
          game_turn:game.game_turn,
          before_point:game.now_point,
          after_point:e,
          name:game.play_data[game.now_point[1]][game.now_point[0]]
        }
        var json=JSON.stringify(obj);
        connection.send(json);
        game.play_data[y][x]=game.play_data[game.now_point[1]][game.now_point[0]];
        game.play_data[game.now_point[1]][game.now_point[0]]=null;
        game.piece_choise=[];
      }
    });
  }
}

class Game {
  constructor() {
    this.init();
  }
  init(){
    this.init_data=[["香\n車:1","桂\n馬:1","銀\n将:1","金\n将:1","王\n将:1","金\n将:1","銀\n将:1","桂\n馬:1","香\n車:1"],[,"飛\n車:1",,,,,,"角\n行:1",],["歩\n兵:1","歩\n兵:1","歩\n兵:1","歩\n兵:1","歩\n兵:1","歩\n兵:1","歩\n兵:1","歩\n兵:1","歩\n兵:1"],[,,,,,,,,],[,,,,,,,,],[,,,,,,,,],["歩\n兵:-1","歩\n兵:-1","歩\n兵:-1","歩\n兵:-1","歩\n兵:-1","歩\n兵:-1","歩\n兵:-1","歩\n兵:-1","歩\n兵:-1"],[,"角\n行:-1",,,,,,"飛\n車:-1",],["香\n車:-1","桂\n馬:-1","銀\n将:-1","金\n将:-1","王\n将:-1","金\n将:-1","銀\n将:-1","桂\n馬:-1","香\n車:-1"]];
    this.captured_piece=[["歩\n兵:0",'飛\n車:0','角\n行:0','香\n車:0','桂\n馬:0','銀\n将:0','金\n将:0'],["歩\n兵:0",'飛\n車:0','角\n行:0','香\n車:0','桂\n馬:0','銀\n将:0','金\n将:0']]
    this.piece_choise=[];
    this.now_point=[];
    this.game_turn=document.getElementById("game_turn").innerText;
    this.player_turn;
    this.play_data = this.init_data;
    this.breadth=40;
    this.board_color=color(242,182,109);
    this.border_color=color(0,0,0);
    if(document.getElementById("player").innerText=="先手"){
      this.player_turn=1;
    }else if(document.getElementById("player").innerText=="後手"){
      this.player_turn=0;
    }
  }
  frame_draw(){
    for(this.y=0; this.y<9; this.y++){
      for(this.x=0; this.x<9; this.x++){
        fill(this.board_color);
        this.posX=this.x*this.breadth;
        this.posY=this.y*this.breadth;
        rect(this.posX+this.breadth/2,this.posY+this.breadth,this.breadth,this.breadth);
      }
    } 
  }
  piece_draw(){
    for(this.y=0; this.y<9; this.y++){
          for(this.x=0; this.x<9; this.x++){
            if(this.play_data[this.y][this.x]!=null){
              if(this.play_data[this.y][this.x].slice(4)=="-1"){
                fill(242,182,109);
                beginShape();
                vertex(this.breadth*(1+this.x),this.breadth*(1+this.y));
                vertex(this.breadth*(0.7+this.x),this.breadth*(1.2+this.y));
                vertex(this.breadth*(0.5+this.x), this.breadth*(2+this.y));
                vertex(this.breadth*(1.5+this.x), this.breadth*(2+this.y));
                vertex(this.breadth*(1.3+this.x), this.breadth*(1.2+this.y));
                endShape(CLOSE);
                fill(100);
                text(this.play_data[this.y][this.x].slice(0,3),this.x*this.breadth+this.breadth*0.875,(this.y+1.5)*this.breadth);
              }else{
                fill(242,182,109);
                push();
                rotate(180);
                translate(-this.breadth*(this.x+1.5),-this.breadth*(this.y+2.5));
                beginShape();
                vertex(this.breadth*0.5,this.breadth*0.5);
                vertex(this.breadth*0.2, this.breadth*0.7);
                vertex(0, this.breadth*1.5);
                vertex(this.breadth, this.breadth*1.5);
                vertex(this.breadth*0.8, this.breadth*0.7);
                endShape(CLOSE);
                fill(100);
                text(this.play_data[this.y][this.x].slice(0,3),this.breadth*0.35,this.breadth);
                pop();
              }
            }
          }
        }
  }
  piece_choise_draw(){
    fill(111)
    this.piece_choise.forEach(function(element){
      rect((element[0]+0.9)*40,(element[1]+1.4)*40,10,10);
    });
  }
  look_around(x,y,a,b){
    if(y-(2*this.player_turn-1)*a>=0&&y-(2*this.player_turn-1)*a<9&&x-(2*this.player_turn-1)*b>=0&&x-(2*this.player_turn-1)*b<9){
      if(this.play_data[y-(2*this.player_turn-1)*a][x-(2*this.player_turn-1)*b]==null||this.play_data[y-(2*this.player_turn-1)*a][x-(2*this.player_turn-1)*b].slice(4)==2*this.player_turn-1){
        this.piece_choise.push([x-(2*this.player_turn-1)*b,y-(2*this.player_turn-1)*a]);
      }
    }
  }
  look_way(x,y,a){
    this.way=a*2-1;
    if(x!=0){
      if(this.play_data[y-this.way*2][x-1]==null||this.play_data[y-this.way*2][x-1].slice(4)==this.way){
        this.piece_choise.push([x-1,y-this.way*2]);
      }
    }
    if(x!=8){
      if(this.play_data[y-this.way*2][x+1]==null||this.play_data[y-this.way*2][x+1].slice(4)==this.way){
        this.piece_choise.push([x+1,y-this.way*2]);
      }
    }    
  }
}

// let borad = new Game();

// let connection=new WebSocket('ws://'+window.location.host+'/socket');

// connection.onopen=function(){
//     var obj={
//         type:"connect"
//     }
//     var json=JSON.stringify(obj);
//     connection.send(json);
//     console.log("connection open");
// };

// connection.onmessage=function(m){
//     let data=JSON.parse(m.data);
//     let counter=document.getElementById("counter");
//     let game_turn_view=document.getElementById("game_turn");
//     if(data.type=="connect"){
//       console.log("new person connected");
//     }else if(data.type=="disconnect"){
//       console.log("person disconnected");
//     }else if(data.type=="change"){
//       console.log(data.value);
//       counter.innerHTML="現在のアクセス数"+data.value;
//     }else if(data.type=="piece_move"){
//       console.log("game_turn_change");
//       console.log(data);
//       game_turn=data.value;
//       game_turn_view.innerHTML="現在"+game_turn+"手目です";
//       play_data[data.before_point[0]][data.before_point[1]]=null;
//       play_data[data.after_point[0]][data.after_point[1]]=data.name;
//     }
// };

// p5jsで将棋を作る

// let init_data=[["香\n車:1","桂\n馬:1","銀\n将:1","金\n将:1","王\n将:1","金\n将:1","銀\n将:1","桂\n馬:1","香\n車:1"],[,"飛\n車:1",,,,,,"角\n行:1",],["歩\n兵:1","歩\n兵:1","歩\n兵:1","歩\n兵:1","歩\n兵:1","歩\n兵:1","歩\n兵:1","歩\n兵:1","歩\n兵:1"],[,,,,,,,,],[,,,,,,,,],[,,,,,,,,],["歩\n兵:-1","歩\n兵:-1","歩\n兵:-1","歩\n兵:-1","歩\n兵:-1","歩\n兵:-1","歩\n兵:-1","歩\n兵:-1","歩\n兵:-1"],[,"角\n行:-1",,,,,,"飛\n車:-1",],["香\n車:-1","桂\n馬:-1","銀\n将:-1","金\n将:-1","王\n将:-1","金\n将:-1","銀\n将:-1","桂\n馬:-1","香\n車:-1"]];
// let captured_piece=[["歩\n兵:0",'飛\n車:0','角\n行:0','香\n車:0','桂\n馬:0','銀\n将:0','金\n将:0'],["歩\n兵:0",'飛\n車:0','角\n行:0','香\n車:0','桂\n馬:0','銀\n将:0','金\n将:0']]
// let piece_choise=[];
// let now_point=[];
// let game_turn=0;
// let player_turn;
// let play_data = init_data;
// let breadth=40;


// let rayToCoord = function(x,y,a,b){
//   let areaContains = (x,y)=> x>=0&&x<9&&y>=0&&y<9;
//   let coords = [];
//   while(areaContains(x,y)){
//     coords.push([x,y]);
//     x+=a;
//     y+=b;
//   }
//   return coords;
// }

// let coordsToDisks = (coords,play_data)=>coords.map(c=>play_data[c[1]][c[0]]);

// function piece_movie_choise(y,x){
//   now_point=[y,x];
//   switch(play_data[y][x].slice(0,1)){
//     case "歩":
//       piece_choise.push([y-(2*player_turn-1),x]);
//       break;
//     case "香":
//       console.log("香");
//       break;
//     case "桂":
//       console.log("桂");
//       break;
//     case "銀":
//       console.log("銀");
//       break;
//     case "金":
//       console.log("金");
//       break;
//     case "王":
//       console.log("王");
//       break;
//     case "角":
//       console.log("角");
//       break;
//     case "飛":
//       console.log("飛");
//       break;
//   }
// }

// function setup(){
//   if(document.getElementById("player").innerText=="先手"){
//     player_turn=1;
//   }else if(document.getElementById("player").innerText=="後手"){
//     player_turn=0;
//   }
//   createCanvas(10*breadth,11*breadth);
//   angleMode(DEGREES);
// }
// function draw(){
//   background(242,182,109);
//   fill(242,182,109);

//   for(let y=0; y<9; y++){
//     for(let x=0; x<9; x++){
//       let posX=x*breadth;
//       let posY=y*breadth;
//       rect(posX+breadth/2,posY+breadth,breadth,breadth);
//     }
//   }
//   for(let y=0; y<9; y++){
//     for(let x=0; x<9; x++){
//       if(play_data[y][x]!=null){
//         if(play_data[y][x].slice(4)=="-1"){
//           fill(242,182,109);
//           beginShape();
//           vertex(breadth*(1+x),breadth*(1+y));
//           vertex(breadth*(0.7+x), breadth*(1.2+y));
//           vertex(breadth*(0.5+x), breadth*(2+y));
//           vertex(breadth*(1.5+x), breadth*(2+y));
//           vertex(breadth*(1.3+x), breadth*(1.2+y));
//           endShape(CLOSE);
//           fill(100);
//           text(play_data[y][x].slice(0,3),x*breadth+breadth*0.875,(y+1.5)*breadth);
//         }else{
//           fill(242,182,109);
//           push();
//           rotate(180);
//           translate(-breadth*(x+1.5),-breadth*(y+2.5));
//           beginShape();
//           vertex(breadth*0.5,breadth*0.5);
//           vertex(breadth*0.2, breadth*0.7);
//           vertex(0, breadth*1.5);
//           vertex(breadth, breadth*1.5);
//           vertex(breadth*0.8, breadth*0.7);
//           endShape(CLOSE);
//           fill(100);
//           text(play_data[y][x].slice(0,3),breadth*0.35,breadth);
//           pop();
//         }
//       }
//     }
//   }
//   piece_choise.forEach(function(item){
//     fill(0);
//     rect(breadth*(item[1]+0.9),breadth*(item[0]+1.35),breadth*0.2,breadth*0.2);
//   });
// }
// function mousePressed(){
//   let x=floor((mouseX-breadth*0.5)/breadth);
//   let y=floor((mouseY-breadth)/breadth);
//   if(x>=0&&x<9&&y>=0&&y<9){
//     if(player_turn!=game_turn%2){
//       if(play_data[y][x]!=null&&play_data[y][x].slice(4)!=2*player_turn-1){
//         console.log("遊べる");
//         piece_movie_choise(y,x);
//       }else if(piece_choise.length>0){
//         piece_choise.forEach(function(item){
//           if(item[0]==y&&item[1]==x){
//             play_data[item[0]][item[1]]=play_data[now_point[0]][now_point[1]];
//             play_data[now_point[0]][now_point[1]]=null;
//             game_turn+=1;
//             var obj={
//               type:"piece_move",
//               before_point:now_point,
//               after_point:[item[0],item[1]],
//               name:play_data[item[0]][item[1]],
//               value:game_turn
//             }
//             var json=JSON.stringify(obj);
//             connection.send(json);
//           }
//         });
//         piece_choise=[];
//       }
//     }else{
//       // console.log("遊べない");
//     }
//   }else{
//     // console.log("out of range");
//   }
// }