const API_KEY = '3574a1ea559b10639c916230210b98d53d046aec99e2cea3362a3bbb137f8df8';

const tickersHandlers = new Map();

const loadTickers = () => {
    // debugger;
    if (tickersHandlers.size === 0) return;

    fetch(
        `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[...tickersHandlers.keys()].join(
            ','
        )}&tsyms=USD&api_key=${API_KEY}`
    )
        .then((res) => res.json())
        .then((prices) => {
            const updatedPrices = Object.fromEntries(
                Object.entries(prices).map(([ticker, price]) => [ticker, price.USD])
            );

            Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
                const handlers = tickersHandlers.get(currency) || [];
                handlers.forEach((fn) => fn(newPrice));
            });
        });
};

export const subscribeToTicker = (ticker, cb) => {
    const subscribers = tickersHandlers.get(ticker) || [];
    tickersHandlers.set(ticker, [...subscribers, cb]);
};

export const unsubscribeFromTicker = (ticker) => {
    tickersHandlers.delete(ticker);
};

setInterval(loadTickers, 3000);

window.tickers = tickersHandlers;
