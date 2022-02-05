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
    }
    console.log(data);
};

connection.onclose=function(){
    var obj={
        type:"disconnect"
    }
    var json=JSON.stringify(obj);
    connection.send(json);
    console.log("connection close");
}



// function send_message(){
//     var obj={
//         type:"send_message"
//     }
//     var json=JSON.stringify(obj);
//     connection.send(json);
//     console.log("send message:hello");
//     connection.send("hello");
// }