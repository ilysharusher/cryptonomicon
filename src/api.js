const API_KEY = '3574a1ea559b10639c916230210b98d53d046aec99e2cea3362a3bbb137f8df8';

const tickersHandlers = new Map();
const socket = new WebSocket(`wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`);

socket.addEventListener('message', (event) => {
    const { TYPE: type, FROMSYMBOL: currency, PRICE: newPrice } = JSON.parse(event.data);

    if (type !== '5' || newPrice === undefined) {
        return;
    }

    const handlers = tickersHandlers.get(currency) ?? [];
    handlers.forEach((fn) => fn(newPrice));
});

function sendToWebSocket(message) {
    const stringifiedMessage = JSON.stringify(message);

    if (socket.readyState === WebSocket.OPEN) {
        socket.send(stringifiedMessage);
        return;
    }

    socket.addEventListener(
        'open',
        () => {
            socket.send(stringifiedMessage);
        },
        { once: true }
    );
}

export const subscribeToTicker = (ticker, cb) => {
    const subscribers = tickersHandlers.get(ticker) || [];
    tickersHandlers.set(ticker, [...subscribers, cb]);
    sendToWebSocket({
        action: 'SubAdd',
        subs: [`5~CCCAGG~${ticker}~USDT`]
    });
};

export const unsubscribeFromTicker = (ticker) => {
    tickersHandlers.delete(ticker);
    sendToWebSocket({
        action: 'SubRemove',
        subs: [`5~CCCAGG~${ticker}~USDT`]
    });
};
