const WebSocketService = (() => {
    let socket;
    let callbacks = {};

    const connect = (url) => {
        socket = new WebSocket(url);

        socket.onopen = () => {
            console.log('WebSocket connected');
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (callbacks[data.event] && data.status == 'success') {
                callbacks[data.event](data.data);
            }else if (callbacks[data.event] && data.status == 'error'){
                callbacks[data.event](data.mes);
            }
        };

        socket.onclose = () => {
            console.log('WebSocket closed');
        };

        socket.onerror = (error) => {
            console.log('WebSocket error', error);
        };
    };

    const registerCallback = (event, callback) => {
        callbacks[event] = callback;
    };

    const sendMessage = (message) => {
        try {
            socket.send(JSON.stringify(message));
            // console.log(message)
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const close = () => {
        socket.onclose();
    }


    return {
        connect,
        registerCallback,
        sendMessage,
        close
    };
})();

export default WebSocketService;


