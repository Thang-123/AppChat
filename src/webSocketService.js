class WebSocketService {
    constructor() {
        this.websocket = null;
        this.callbacks = {};
    }

    connect(url) {
        this.websocket = new WebSocket(url);

        this.websocket.onopen = () => {
            console.log('WebSocket connected');
        };

        this.websocket.onmessage = this.handleMessage;
        this.websocket.onclose = this.handleClose;
        this.websocket.onerror = this.handleError;
    }


    sendMessage(message) {
        if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
            this.websocket.send(JSON.stringify(message));
        } else {
            console.error('WebSocket not connected or ready');
        }
    }

    registerCallback(eventType, callback) {
        this.callbacks[eventType] = callback;
    }

    handleMessage = (event) => {
        const data = JSON.parse(event.data);
        const eventType = data.event;

        if (this.callbacks[eventType]) {
            this.callbacks[eventType](data);
        } else {
            console.warn(`No callback registered for event: ${eventType}`);
        }
    };

    handleClose = () => {
        console.log('WebSocket connection closed');

        // Handle reconnection or cleanup logic if needed
        // Example: Attempt to reconnect in case of unexpected close
        // this.connect(this.websocket.url);
    };

    handleError = (error) => {
        console.error('WebSocket error:', error);
        // Implement custom error handling logic as needed
    };

    close() {
        if (this.websocket) {
            this.websocket.close();
        }
    }
}

export default new WebSocketService();
