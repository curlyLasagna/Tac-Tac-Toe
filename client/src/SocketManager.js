import { io } from "socket.io-client"

export const socket = io("http://localhost:3005")

export const SocketManager = () => {
    useEffect(() => {
        function onConnect() {
            console.log("user connected")
        }
        function onDisconnect() {
            console.log("user disconnected")
        }

        function onFunc() {
            console.log("Hello")
        }

        socket.on("connect", onConnect)
        socket.on("disconnect", onDisconnect)
        socket.on("hello", onFunc)

        return () => {
            socket.off("connect", onConnect)
            socket.off("disconnect", onDisconnect)
            socket.off("hello", onFunc)
    
        }
    })
}