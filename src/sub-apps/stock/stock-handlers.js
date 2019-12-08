
const CustomError = require('../../common/helpers').CustomError;
const stockSV = require('./stock-service');


exports.storeStockHandler = async (stock) => {
    await stockSV.addStock(stock);
};


exports.getAverageHandler = async (tickerSymbol) => {
    const avg = await stockSV.getAverage(tickerSymbol);

    if (avg === null) {
        throw new CustomError('No stock value found for given ticker symbol', 404);
    }

    return avg;
}
