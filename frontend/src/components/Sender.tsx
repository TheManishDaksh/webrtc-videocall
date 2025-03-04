import { useEffect, useState } from "react";

export const Sender =()=>{

    const [socket, setSocket] = useState<WebSocket|null>(null)
    const [pc, setPc] = useState<RTCPeerConnection|null>(null)

    useEffect(()=>{
        const socket = new WebSocket("http://localhost:8080")
        setSocket(socket);
        //@ts-ignore
        socket.onopen=()=>{
            socket?.send(JSON.stringify({
                type :"sender"
            }))
        }
    },[])

    function iceConnection(){
         //@ts-ignore
        socket.onmessage=async(event)=>{ 
            if(!socket){
                return;
            }

            const message = JSON.parse(event.data)
            if(message.type === "createAnswer"){
                await pc?.setRemoteDescription(message.sdp)
            }else if(message.type === "iceCandidate"){
                await pc?.addIceCandidate(message.candidate)
            }
        }

        const peerConnection = new RTCPeerConnection();
        setPc(peerConnection);
        pc.onicecandidate=(event)=>{
            if(event.candidate){
                socket?.send(JSON.stringify({
                    type : "iceCandidate",
                    candidate : event.candidate
                }))
            }
        }

        pc.onnegotiationneeded=async()=>{
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socket?.send(JSON.stringify({
                type : "createOffer",
                sdp : pc.localDescription
            }))
            getCameraAndStream(pc)
        }

        const getCameraAndStream=(pc:RTCPeerConnection)=>{
            navigator.mediaDevices.getUserMedia({ video:true })
            .then((stream)=>{
                const video = document.createElement("video")
                video.srcObject=stream;
                video.play()
                document.body.appendChild(video)
                stream.getTracks().forEach((track)=>{
                    pc.addTrack(track)
                })
            })
        }
    }

    return(
        <div>
            <button onClick={iceConnection}>Send request</button>
        </div>
    )
}