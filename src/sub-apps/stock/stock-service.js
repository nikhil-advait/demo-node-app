const db = require('../../common/db');

const stocks = db.stocks;

let id = 0;

/*
This is how stocks are stored.
{
    stocks: {
        goog: {
            count: 2,
            list: [ {id:1, tickerSymbol: 'goog', price: 800}, {id:2, tickerSymbol: 'appl', price: 900}]
        }
    }
}
 */

// Mark functions async to simulate db even though it's not needed in this case of memory store.


const addStock = async (stock) => {
    id = id + 1;
    stock.id = id;

    // Create new array for the stock if not already present in data store.
    const stockData = stocks[stock.tickerSymbol] || {count: 0, list: []};
    stocks[stock.tickerSymbol] =  stockData;

    // Add newest stock to the begging in of array.
    // Maintain count so we don't have to calculate length of the array everytime while getting average of a stock.
    stockData.count = stockData.list.unshift(stock);
};


// Returns null if stock not found for given ticker else returns average of last 10 stock prices.
const getAverage = async (tickerSymbol) => {
    const stockData = stocks[tickerSymbol];
    if (!stockData) {
        return null;
    }

    const iterateCount = stockData.count > 10 ? 10 : stockData.count;
    let sum = 0;

    for (let i=0; i < iterateCount; i++) {
        sum = sum + stockData.list[i].price;
    }

    /**
     * Could have also done:
     * const avg = stockData.list.slice(0, iterateCount).reduce((sum, stock) => sum + stock.price, 0) / iterateCount;
     * But it would have been O(2n) operation (n in slice and n in iteration during .reduce ) instead of current O(n)
     */

    return sum / iterateCount;
};

module.exports = {
    addStock,
    getAverage
};