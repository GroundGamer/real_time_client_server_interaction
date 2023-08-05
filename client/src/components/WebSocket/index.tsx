import React from 'react'


interface MessageItem {
    id: string
    event: string
    username: string
    message: string
}


const WebSock = () => {
    const [messages, setMessages] = React.useState<Array<MessageItem>>([])

    const [value, setValue] = React.useState<string>('')

    const socket = React.useRef<WebSocket>()

    const [connected, setConnected] = React.useState(false)

    const [username, setUsername] = React.useState('')


    const sendMessage = async (username: string, message: string) => {
        const messageItem = {
            id: Date.now(),
            event: 'message',
            username,
            message
        }

        socket.current?.send(JSON.stringify(messageItem))

        setValue('')
    }

    const connect = () => {
        socket.current = new WebSocket('ws://localhost:5000')

        socket.current.onopen = () => {
            setConnected(true)

            const message = {
                id: Date.now(),
                event: 'connection',
                username
            }

            console.log('Socket: подключение установлено')

            socket.current?.send(JSON.stringify(message))
        }

        socket.current.onmessage = (event) => {
            console.log('Socket: сообщение получено')

            const message = JSON.parse(event.data)

            setMessages((prevState) => [message, ...prevState])
        }

        socket.current.onclose = () => {
            console.log('Socket: закрыт')
        }

        socket.current.onerror = () => {
            console.log('Socket: произошла ошибка')
        }
    }


    if (!connected) {
        return (
            <div className={'center'}>
                <div className={'form'}>
                    <input
                        type={'text'}
                        value={username}
                        placeholder={'Введите Ваше имя'}
                        onChange={(event) => setUsername(event.target.value)}
                    />
                    <button onClick={connect}>Войти</button>
                </div>
            </div>
        )
    }


    return (
        <div className={'center'}>
            <div>
                <div className={'form'}>
                    <input
                        type={'text'}
                        value={value}
                        onChange={(event) => setValue(event.target.value)}
                    />
                    <button onClick={() => sendMessage(username, value)}>Отправить</button>
                </div>
                <div className={'messages'}>
                    {messages.map(item => (
                        <div key={item?.id}>
                            {item?.event === 'connection' ? (
                                <div className={'connection_message'}>
                                    Пользователь {item?.username} подключен
                                </div>
                            ) : (
                                <div className={'message'}>
                                    {item?.username}: {item?.message}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default WebSock
