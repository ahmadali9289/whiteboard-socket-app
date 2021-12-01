import Express, { Application, Request, Response, NextFunction } from 'express'
import { Server, Socket } from "socket.io";
import {createServer} from 'http'
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

const app: Application = Express()
const server = createServer(app)
const io = new Server(server);

const PORT: number = 8080
let connections: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>[] = []

app.use(Express.static('public'))

server.listen(PORT, () => {
    console.log(`Server stated on Port ${PORT}`)
})

// whenever a user connects on port 3000 via
// a websocket, log that a user has connected
io.on("connection", function(socket: Socket) {
    console.log("a user connected ==> ", socket);
    connections.push(socket)
    // whenever we receive a 'message' we log it out
    socket.on("message", function(message: any) {
      console.log(message);
    });

    socket.on('draw', (data) => {
        socket.broadcast.emit('ondraw', { x: data.x, y: data.y })
    })
    
    socket.on('down', (data) => {
        socket.broadcast.emit('ondown', { x: data.x, y: data.y })
    })

    socket.on('disconnect', (reason) => {
        console.log('Disconnected from socket ==> ', socket.id, reason )
        connections = connections.filter(conn => conn.id == socket.id)
    })
  });

