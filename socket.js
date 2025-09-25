import { Server as SocketIOServer } from "socket.io"


const setupSocket = (server)=>{
    const disconnect = (socket) =>{
        console.log(`Client disconnected: ${socket.id}`)
        for(const [userId,socketId] of userSocketMap.entries()){
            if(socketId === socket.id){
                userSocketMap.delete(userId)
                break
            }
        }
    }
    const io = new SocketIOServer(server,{
        cors:{
            origin: process.env.ORIGIN,
            methods: ["GET","POST"],
            credentials: true
        }
    })

    const userSocketMap = new Map()
    io.on("connection",(socket)=>{
        const userId = socket.handshake.query.userId

        if(userId) {
            userSocketMap.set(userId,socket.id)
            console.log(`user Connected: with ${userId} with socket Id ${socket.id}`)
        }else{
            console.log("UserId are not provided during connection")
        }
        socket.on("disconnect",()=>disconnect)
    })
}
export default setupSocket