import React from 'react'

import axios from 'axios'


interface MessageItem {
    id: string
    message: string
    createDate: string
}


const LongPolling = () => {
    const [messages, setMessages] = React.useState<Array<MessageItem>>([])

    const [value, setValue] = React.useState<string>('')


    const sendMessage = async (message: string) => {
        await axios.post('http://localhost:5000/new-messages', {
            id: Date.now(),
            message
        })
    }

    const subscribe = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/get-messages')

            setMessages((prevState) => [data, ...prevState])

            await subscribe()
        } catch (error) {
            console.error(error)

            setTimeout(() => {
                subscribe()
            }, 500)
        }
    }


    React.useEffect(() => {
        subscribe()
    }, [])


    return (
        <div className={'center'}>
            <div>
                <div className={'form'}>
                    <input value={value} onChange={(event) => setValue(event.target.value)} type={'text'}/>
                    <button onClick={() => sendMessage(value)}>Отправить</button>
                </div>
                <div className={'messages'}>
                    {messages.map(item => (
                        <div key={item?.id} className={'message'}>
                            {item?.message}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default LongPolling
