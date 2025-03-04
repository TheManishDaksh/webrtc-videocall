import { useEffect } from "react"


export const Receiver =()=>{

    useEffect(()=>{
        const server = new WebSocket("http://localhost:8080")
        server.onopen=()=>{
            server.send(JSON.stringify({
                type :"receiver"
            }))
        }
       startReceiving(server) 
    },[])

    function startReceiving(socket:WebSocket){
        const video = document.createElement("video")
        document.body.appendChild(video);

        const pc = new RTCPeerConnection();
        pc.ontrack =(event)=>{
            video.srcObject = new MediaStream([event.track]);
            video.play()
        }

        socket.onmessage=(event)=>{
            const message = JSON.parse(event.data)
            if(message.type === "createOffer"){
                pc.setRemoteDescription(message.sdp)
                .then(()=>{
                    pc.createAnswer()
                    .then((answer)=>{
                        pc.setLocalDescription(answer);
                        socket.send(JSON.stringify({
                            type: "createAnswer",
                            sdp : answer
                        }))
                    })
                })
            }else if(message.type === "iceCandidate"){
                pc.addIceCandidate(message.candidate)
            }
        }
    }

    return(
        <div>
            Receiver
        </div>
    )
}