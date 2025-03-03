import { WebSocketServer, WebSocket} from "ws";

const server = new WebSocketServer({port : 8080})

let sender:null|WebSocket = null;
let receiver:null|WebSocket = null;

server.on("connection", function(socket){
    socket.onerror=(error)=>{
        console.log(error);
    }
    socket.send("connected to server");
    
    socket.onmessage=(event:any)=>{
        const message = JSON.parse(event.data);
        if(message.type === "sender"){
            sender = socket;
        }else if(message.type === "receiver"){
            receiver = socket
        }else if(message.type === "createOffer"){
            if(socket === sender){
                receiver?.send(JSON.stringify({type: "createOffer", sdp : message.sdp}))
            }else{
                return;
            }
        }else if(message.type == "createAnswer"){
            if(socket === receiver){
                sender?.send(JSON.stringify({type: "createAnswer", sdp: message.sdp}))
            }else{
                return;
            }
        }else if(message.type == "iceCandidate"){
            if(socket === sender){
                receiver?.send(JSON.stringify({type: "iceCandidate", candidate: message.candidate }))
            }else if(socket === receiver){
                sender?.send(JSON.stringify({type: "iceCandidate", candidate: message.candidate }))
            }
        }
    }
})