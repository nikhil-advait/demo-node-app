const handlers = require('./stock-handlers');
const handleAsyncExceptions = require('../../common/helpers').handleAsyncExceptions;


exports.storeStock = handleAsyncExceptions(async (req, res) => {

    // Any errors thrown will be handled by handleAsyncExceptions() and appropriate status code will be sent back to client.
    await handlers.storeStockHandler(req.body);

    // 201 HTTP Status code is more appropriate than 200 here.
    res.status(201).send('Stock price added');
});


exports.getAverage = handleAsyncExceptions(async (req, res) => {
    const tickerSymbol = req.params.tickerSymbol;
    console.log(`Getting avg for last 10 prices for stock:${tickerSymbol}. Requested by User:${ req.session.name ||req.session.username}`);
    const avg = await handlers.getAverageHandler(tickerSymbol);
    res.status(200).send({average: avg});
});

