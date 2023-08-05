import 'dotenv/config'

import * as WebSocket from 'ws'


const webSocketServer = new WebSocket.Server({
    port: Number(process.env.PORT)
},() => console.log('Server start success on 5000 port'))

webSocketServer.on('connection', function connection(webSocket) {
    webSocket.on('message', function (message) {
        // @ts-ignore
        message = JSON.parse(message)

        // @ts-ignore
        switch (message.event) {
            case 'message':
                broadcastMessage(message)

                break

            case 'connection':
                broadcastMessage(message)

                break
        }
    })
})


function broadcastMessage(message) {
    webSocketServer.clients.forEach(client => {
        client.send(JSON.stringify(message))
    })
}