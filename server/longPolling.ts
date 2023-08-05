import 'dotenv/config'

import express from 'express'

import cors from 'cors'

import * as events from 'events'


const app = express()

const emitter = new events.EventEmitter()


app.use(cors())
app.use(express.json())


app.get('/get-messages', (request, response) => {
    emitter.once('newMessage', (message) => {
        response.json(message)
    })
})

app.post('/new-messages', (request, response) => {
    const message = request.body

    emitter.emit('newMessage', message)

    response.status(200)
})

app.listen(process.env.PORT, () => console.log(`Server started on port ${process.env.PORT}`))