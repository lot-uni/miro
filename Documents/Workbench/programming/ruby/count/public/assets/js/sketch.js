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
    if(data.type=="connect"){
      console.log("new person connected");
    }else if(data.type=="disconnect"){
      console.log("person disconnected");
    }else if(data.type=="change"){
      console.log(data.value);
      counter.innerHTML="現在のアクセス数"+data.value;
    }else if(data.type=="play_data"){
      console.log(data.data);
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

// 環境設定変数
let init_data = [
    ["香\n車:1","桂\n馬:1","銀\n将:1","金\n将:1","王\n将:1","金\n将:1","銀\n将:1","桂\n馬:1","香\n車:1"],
    [,"飛\n車:1",,,,,,"角\n行:1",],
    ["歩\n兵:1","歩\n兵:1","歩\n兵:1","歩\n兵:1","歩\n兵:1","歩\n兵:1","歩\n兵:1","歩\n兵:1","歩\n兵:1"],
    [,,,,,,,,],
    [,,,,,,,,],
    [,,,,,,,,],
    ["歩\n兵:-1","歩\n兵:-1","歩\n兵:-1","歩\n兵:-1","歩\n兵:-1","歩\n兵:-1","歩\n兵:-1","歩\n兵:-1","歩\n兵:-1"],
    [,"角\n行:-1",,,,,,"飛\n車:-1",],
    ["香\n車:-1","桂\n馬:-1","銀\n将:-1","金\n将:-1","王\n将:-1","金\n将:-1","銀\n将:-1","桂\n馬:-1","香\n車:-1"]
  ];
  let captured_piece=[
    ["歩\n兵:0",'飛\n車:0','角\n行:0','香\n車:0','桂\n馬:0','銀\n将:0','金\n将:0'],
    ["歩\n兵:0",'飛\n車:0','角\n行:0','香\n車:0','桂\n馬:0','銀\n将:0','金\n将:0']
  ]
  let play_data = init_data;
  let choices = [];
  let now_piece;
  let tern = 1;
  
  function setup(){
    createCanvas(410,480);
    angleMode(DEGREES);
  }
  function mouseClicked(){
    let x = Math.trunc((mouseX-25)/40);
    let y = Math.trunc((mouseY-60)/40);
    if(play_data[y][x]!=undefined&&play_data[y][x].slice(4)==tern){
      choices=[];
      if(!Object.is(y,-0)){
        separate_pieces(x,y);
      }else if(y==9){
        console.log(captured_piece[1][9-x]);
      }else{
        if(tern==1&&captured_piece[0][2].slice(4)>0){
          for(let y=0; y<9; y++){
            for(let x=0; x<9; x++){
              if(play_data[y][x]==undefined){
                choices.push([y,x]);
              }
            }
          }
          now_piece=[null,null,"角\n行:1"];
          captured_piece[0][2]="角\n行:0";
        }
      }
    }
    console.log(choices);
    choices.forEach(point=>{
      if(point[0]==y&&point[1]==x){
        if(y<3&&tern==-1&&now_piece[2].slice(0,1)!="と"&&now_piece[2].slice(0,1)!="成"&&now_piece[2].slice(0,1)!="龍"&&now_piece[2].slice(0,1)!="竜"){
          if(y!=0){
            flag = confirm("成りますか?");
          }else{
            flag = true
          }
          if (flag == true){
            switch(now_piece[2].slice(0,1)){
              case "歩":
                now_piece.splice(2,1,"と\n金:-1");
                break
              case "香":
                now_piece.splice(2,1,"成\n香:-1");
                break
              case "銀":
                now_piece.splice(2,1,"成\n銀:-1");
                break
              case "桂":
                now_piece.splice(2,1,"成\n桂:-1");
                break
              case "角":
                now_piece.splice(2,1,"竜\n馬:-1");
                break
              case "飛":
                now_piece.splice(2,1,"龍\n王:-1");
                break
            }
          }
        }if(y>5&&tern==1&&now_piece[2].slice(0,1)!="と"&&now_piece[2].slice(0,1)!="成"&&now_piece[2].slice(0,1)!="龍"&&now_piece[2].slice(0,1)!="竜"){
          if(y!=8){
            flag = confirm("成りますか?");
          }else{
            flag = true
          }
          if (flag == true){
            switch(now_piece[2].slice(0,1)){
              case "歩":
                now_piece.splice(2,1,"と\n金:1");
                break
              case "香":
                now_piece.splice(2,1,"成\n香:1");
                break
              case "銀":
                now_piece.splice(2,1,"成\n銀:1");
                break
              case "桂":
                now_piece.splice(2,1,"成\n桂:1");
                break
              case "角":
                now_piece.splice(2,1,"竜\n馬:1");
                break
              case "飛":
                now_piece.splice(2,1,"龍\n王:1");
                break
            }
          }
        }
        if(now_piece[0]!=null){
          play_data[now_piece[1]][now_piece[0]]=null;
        }
        if(play_data[y][x]!=undefined){
          console.log("駒が取られた",play_data[y][x].slice(0,1));
          if(tern==1){
            switch(play_data[y][x].slice(0,3)){
              case "歩\n兵":
                console.log(int(captured_piece[0][0].slice(4))+1);
                captured_piece[0][0]="歩\n兵:"+str(int(captured_piece[0][0].slice(4))+1);
                break;
              case "龍\n王":
              case "飛\n車":
                console.log(int(captured_piece[0][1].slice(4))+1);
                captured_piece[0][1]="飛\n車:"+str(int(captured_piece[0][1].slice(4))+1);
                break;
              case "竜\n馬":
              case "角\n行":
                console.log(int(captured_piece[0][2].slice(4))+1);
                captured_piece[0][2]="角\n行:"+str(int(captured_piece[0][2].slice(4))+1);
                break;
              case "成\n香":
              case "香\n車":
                console.log(int(captured_piece[0][3].slice(4))+1);
                captured_piece[0][3]="香\n車:"+str(int(captured_piece[0][3].slice(4))+1);
                break;
              case "成桂":
              case "桂\n馬":
                console.log(int(captured_piece[0][4].slice(4))+1);
                captured_piece[0][4]="桂\n馬:"+str(int(captured_piece[0][4].slice(4))+1);
                break;
              case "成\n銀":
              case "銀\n将":
                console.log(int(captured_piece[0][5].slice(4))+1);
                captured_piece[0][5]="銀\n将:"+str(int(captured_piece[0][5].slice(4))+1);
                break;
              case "金\n将":
                console.log(int(captured_piece[0][6].slice(4))+1);
                captured_piece[0][6]="金\n将:"+str(int(captured_piece[0][6].slice(4))+1);
                break;
              case "王\n将":
                alert("先手の勝ちです");
                break;
            }
          }else{
            switch(play_data[y][x].slice(0,3)){
              case "と\n金":
              case "歩\n兵":
                console.log(int(captured_piece[1][0].slice(4))+1);
                captured_piece[1][0]="歩\n兵:"+str(int(captured_piece[1][0].slice(4))+1);
                break;
              case "龍\n王":
              case "飛\n車":
                console.log(int(captured_piece[1][1].slice(4))+1);
                captured_piece[1][1]="飛\n車:"+str(int(captured_piece[1][1].slice(4))+1);
                break;
              case "竜\n馬":
              case "角\n行":
                console.log(int(captured_piece[1][2].slice(4))+1);
                captured_piece[1][2]="角\n行:"+str(int(captured_piece[1][2].slice(4))+1);
                break;
              case "成\n香":
              case "香\n車":
                console.log(int(captured_piece[1][3].slice(4))+1);
                captured_piece[1][3]="香\n車:"+str(int(captured_piece[1][3].slice(4))+1);
                break;
              case "成\n銀":
              case "銀\n将":
                console.log(int(captured_piece[1][4].slice(4))+1);
                captured_piece[1][4]="桂\n馬:"+str(int(captured_piece[1][4].slice(4))+1);
                break;
              case "成\n銀":
              case "銀\n将":
                console.log(int(captured_piece[1][5].slice(4))+1);
                captured_piece[1][5]="銀\n将:"+str(int(captured_piece[1][5].slice(4))+1);
                break;
              case "金\n将":
                console.log(int(captured_piece[1][6].slice(4))+1);
                captured_piece[1][6]="金\n将:"+str(int(captured_piece[1][6].slice(4))+1);
                break;
              case "王\n将":
                alert("後手の勝ちです");
                break;
            }
          }
        }
        play_data[y][x]=now_piece[2];
        choices=[];
        tern=tern*-1;
        var obj={
          type:"play_data",
          data:play_data
        }
        var json=JSON.stringify(obj);
        console.log(play_data);
        connection.send(json);
      }
    })
    if(play_data[y][x]==undefined||play_data[y][x].slice(4)!=tern){
      choices=[];
    }
  }
  function ray_up_y(x,y){
    if(tern==1){
      for (let i = y+1; i < 9; i++){
        if(play_data[i][x]!=undefined){
          if(play_data[i][x].slice(4)!=tern){
            choices.push([i,x]);
          }
          break
        }
        choices.push([i,x]);
      }
    }else{
      for(let i = y-1; i > -1; i--){
        if(play_data[i][x]!=undefined){
          if(play_data[i][x].slice(4)!=tern){
            choices.push([i,x]);
          }
          break
        }
        choices.push([i,x]);
      }
    }
  }
  function ray_down_y(x,y){
    if(tern==1){
      for(let i = y-1; i > -1; i--){
        if(play_data[i][x]!=undefined){
          if(play_data[i][x].slice(4)!=tern){
            choices.push([i,x]);
          }
          break
        }
        choices.push([i,x]);
      }
    }else{
      for(let i = y+1; i < 9; i++){
        if(play_data[i][x]!=undefined){
          if(play_data[i][x].slice(4)!=tern){
            choices.push([i,x]);
          }
          break
        }
        choices.push([i,x]);
      }
    }
  }
  function ray_right_y(x,y){
    if(tern==1){
      for(let i = x-1; i > -1; i--){
        if(play_data[y][i]!=undefined){
          if(play_data[y][i].slice(4)!=tern){
            choices.push([y,i]);
          }
          break
        }
        choices.push([y,i]);
      }
    }else{
      for(let i = x+1; i < 9; i++){
        if(play_data[y][i]!=undefined){
          if(play_data[y][i].slice(4)!=tern){
            choices.push([y,i]);
          }
          break
        }
        choices.push([y,i]);
      }
    }
  }
  function ray_left_y(x,y){
    if(tern==1){
      for(let i=x+1; i<9; i++){
        if(play_data[y][i]!=undefined){
          if(play_data[y][i].slice(4)!=tern){
            choices.push([y,i]);
          }
          break
        }
        choices.push([y,i]);
      }
    }else{
      for(let i=x-1; i>-1; i--){
        if(play_data[y][i]!=undefined){
          if(play_data[y][i].slice(4)!=tern){
            choices.push([y,i]);
          }
          break
        }
        choices.push([y,i]);
      }
    }
  }
  function rayToCoords(x,y,a,b){
    let areaContains=(x,y)=>x>=0 && x<8 && y>=0 && y<8;
    while(areaContains(x,y)) {
      x += a;
      y += b;
      if(play_data[y][x]!=undefined){
        if(play_data[y][x].slice(4)!=tern){
          choices.push([y,x]);
          break
        }else{
          break
        }
      }
      if(x>=0){
        choices.push([y,x]); 
      }
    }
  }
  function separate_pieces(x,y){
    let piece=play_data[y][x];
    switch(piece.slice(0,1)){
      case "歩":
        if(play_data[y+tern][x]==undefined||play_data[y+tern][x].slice(4)!=tern){
          now_piece=[x,y,piece];
          choices.push([y+tern,x]);
        }
        break;
      case "龍":
        if(play_data[y+tern][x-1]==undefined||play_data[y+tern][x-1].slice(4)!=tern){
          if(x>0&&x<9){
            now_piece=[x,y,piece];
            choices.push([y+tern,x-1]);
          }
        }if(play_data[y+tern][x+1]==undefined||play_data[y+tern][x+1].slice(4)!=tern){
          if(x>-1&&x<8){
            now_piece=[x,y,piece];
            choices.push([y+tern,x+1]);
          }
        }if(y>0&&y<8){
          if(play_data[y-tern][x-1]==undefined||play_data[y-tern][x-1].slice(4)!=tern){
            if(x>0&&x<9){
              now_piece=[x,y,piece];
              choices.push([y-tern,x-1]);
            }
          }
        }if(y>0&&y<8){
          if(play_data[y-tern][x+1]==undefined||play_data[y-tern][x+1].slice(4)!=tern){
            if(x>-1&&x<8){
              now_piece=[x,y,piece];
              choices.push([y-tern,x+1]);
            }
          }
        }
      case "飛":
        console.log("飛車");
        now_piece=[x,y,piece];
        ray_up_y(x,y);
        ray_down_y(x,y);
        ray_right_y(x,y);
        ray_left_y(x,y);
        break;
      case "竜":
        if(play_data[y+tern][x]==undefined||play_data[y+tern][x].slice(4)!=tern){
          now_piece=[x,y,piece];
          choices.push([y+tern,x]);
        }if(play_data[y][x-1]==undefined||play_data[y][x+1].slice(4)!=tern){
          if(x>0&&x<9){
            now_piece=[x,y,piece];
            choices.push([y,x-1]);
          }
        }if(play_data[y][x+1]==undefined||play_data[y][x+1].slice(4)!=tern){
          if(x>-1&&x<8){
            now_piece=[x,y,piece];
            choices.push([y,x+1]);
          }
        }if(y>0&&y<8){
          if(play_data[y-tern][x]==undefined||play_data[y-tern][x].slice(4)!=tern){
            now_piece=[x,y,piece];
            choices.push([y-tern,x]);
          }
        }
      case "角":
        console.log("角行");
        rayToCoords(x,y,1,1);
        rayToCoords(x,y,1,-1);
        rayToCoords(x,y,-1,1);
        rayToCoords(x,y,-1,-1);
        now_piece=[x,y,piece];
        break;
      case "香":
        console.log("香車");
        now_piece=[x,y,piece];
        ray_up_y(x,y);
        break;
      case "桂":
        console.log("桂馬");
        if(play_data[y+tern*2][x-1]==undefined||play_data[y+tern*2][x-1].slice(4)!=tern){
          if(x>0&&x<9){
            now_piece=[x,y,piece];
            choices.push([y+tern*2,x-1]);
          }
        }if(play_data[y+tern*2][x+1]==undefined||play_data[y+tern*2][x+1].slice(4)!=tern){
          if(x>-1&&x<8){
            now_piece=[x,y,piece];
            choices.push([y+tern*2,x+1]);
          }
        }
        break;
      case "銀":
        console.log("銀将");
        if(play_data[y+tern][x-1]==undefined||play_data[y+tern][x-1].slice(4)!=tern){
          if(x>0&&x<9){
            now_piece=[x,y,piece];
            choices.push([y+tern,x-1]);
          }
        }if(play_data[y+tern][x]==undefined||play_data[y+tern][x].slice(4)!=tern){
          now_piece=[x,y,piece];
          choices.push([y+tern,x]);
        }if(play_data[y+tern][x+1]==undefined||play_data[y+tern][x+1].slice(4)!=tern){
          if(x>-1&&x<8){
            now_piece=[x,y,piece];
            choices.push([y+tern,x+1]);
          }
        }if(y>0&&y<8){
          if(play_data[y-tern][x-1]==undefined||play_data[y-tern][x-1].slice(4)!=tern){
            if(x>0&&x<9){
              now_piece=[x,y,piece];
              choices.push([y-tern,x-1]);
            }
          }
        }
        if(y>0&&y<8){
          if(play_data[y-tern][x+1]==undefined||play_data[y-tern][x+1].slice(4)!=tern){
            if(x>-1&&x<8){
              now_piece=[x,y,piece];
              choices.push([y-tern,x+1]);
            }
          }
        }
        break;
      case "と":
      case "成":
      case "金":
        console.log("金将");
        if(play_data[y+tern][x-1]==undefined||play_data[y+tern][x-1].slice(4)!=tern){
          if(x>0&&x<9){
            now_piece=[x,y,piece];
            choices.push([y+tern,x-1]);
          }
        }if(play_data[y+tern][x]==undefined||play_data[y+tern][x].slice(4)!=tern){
          now_piece=[x,y,piece];
          choices.push([y+tern,x]);
        }if(play_data[y+tern][x+1]==undefined||play_data[y+tern][x+1].slice(4)!=tern){
          if(x>-1&&x<8){
            now_piece=[x,y,piece];
            choices.push([y+tern,x+1]);
          }
        }if(play_data[y][x-1]==undefined||play_data[y][x].slice(4)!=tern){
          if(x>0&&x<9){
            now_piece=[x,y,piece];
            choices.push([y,x-1]);
          }
        }if(play_data[y][x+1]==undefined||play_data[y][x+1].slice(4)!=tern){
          if(x>-1&&x<8){
            now_piece=[x,y,piece];
            choices.push([y,x+1]);
          }
        }
        if(y>0&&y<8){
          if(play_data[y-tern][x]==undefined||play_data[y-tern][x].slice(4)!=tern){
            now_piece=[x,y,piece];
            choices.push([y-tern,x]);
          }
        }
        break;
      case "王":
        console.log("王将");
        if(play_data[y+tern][x-1]==undefined||play_data[y+tern][x-1].slice(4)!=tern){
          if(x>0&&x<9){
            now_piece=[x,y,piece];
            choices.push([y+tern,x-1]);
          }
        }if(play_data[y+tern][x]==undefined||play_data[y+tern][x].slice(4)!=tern){
          now_piece=[x,y,piece];
          choices.push([y+tern,x]);
        }if(play_data[y+tern][x+1]==undefined||play_data[y+tern][x+1].slice(4)!=tern){
          if(x>-1&&x<8){
            now_piece=[x,y,piece];
            choices.push([y+tern,x+1]);
          }
        }if(y>0&&y<8){
          if(play_data[y-tern][x-1]==undefined||play_data[y-tern][x-1].slice(4)!=tern){
            if(x>0&&x<9){
              now_piece=[x,y,piece];
              choices.push([y-tern,x-1]);
            }
          }
        }if(play_data[y][x-1]==undefined||play_data[y][x].slice(4)!=tern){
          if(x>0&&x<9){
            now_piece=[x,y,piece];
            choices.push([y,x-1]);
          }
        }if(play_data[y][x+1]==undefined||play_data[y][x+1].slice(4)!=tern){
          if(x>-1&&x<8){
            now_piece=[x,y,piece];
            choices.push([y,x+1]);
          }
        }
        if(y>0&&y<8){
          if(play_data[y-tern][x]==undefined||play_data[y-tern][x].slice(4)!=tern){
            now_piece=[x,y,piece];
            choices.push([y-tern,x]);
          }
        }
        if(y>0&&y<8){
          if(play_data[y-tern][x+1]==undefined||play_data[y-tern][x+1].slice(4)!=tern){
            if(x>-1&&x<8){
              now_piece=[x,y,piece];
              choices.push([y-tern,x+1]);
            }
          }
        }
        break;
    }
  }
  function draw(){
    background(242,182,109);
    let w=(width-50)/9;
    let h=(height-w*9)/2;
    for(let x=0; x<9; x++){
      for(let y=0; y<9; y++){
        noFill();
        rect(w*x+25,w*y+h,w);
        let text_point=String(play_data[y][x]).substring(0,3);
        if(play_data[y][x]!=undefined){
          if(play_data[y][x].slice(4)=="1"){
            quad(
              26+w*x,63+w*y,
              64+w*x,63+w*y,
              59+w*x,96+w*y,
              31+w*x,96+w*y
            );
            fill(0,0,0);
            push();
            translate(100, 100);
            rotate(180);
            translate(-350, -418);
            text(text_point,w*(9-x)+40,w*(9-y)+75);
            pop(); 
          }else{
            quad(
              31+w*x,63+w*y,
              59+w*x,63+w*y,
              64+w*x,96+w*y,
              26+w*x,96+w*y
            );
            fill(0,0,0);
            text(text_point,w*x+40,w*y+75);
          }
        }
      }
    }
    for(let x=0; x<7; x++){
      noFill();
      quad(
        26+w*x,23,
        64+w*x,23,
        59+w*x,56,
        31+w*x,56
      );
      fill(0,0,0);
      push();
      translate(100, 100);
      rotate(180);
      translate(-350, -418);
      text(captured_piece[0][x],w*(9-x)+35,475);
      pop(); 
    }
    for(let x=0; x<7; x++){
      noFill();
      quad(
        111+w*x,424,
        139+w*x,424,
        144+w*x,457,
        106+w*x,457
      );
      fill(0,0,0);
      text(captured_piece[1][x],w*(9-x)-5,437);
    }
    choices.forEach(point=>square(40+point[1]*40, 75+point[0]*40, 10));
  }