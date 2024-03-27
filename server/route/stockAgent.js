const yahooFinance = require('yahoo-finance2').default;
const POSTGRES = require('../db/postgres.js')

// const HodingStocks = ['TSLA', 'QQQM', 'TQQQ']
// const HodingStocks = ['TQQQ']
const HodingStocks = ['2330.TW']

const StockAgent = async (stocks) => {
    const fetchPromises = stocks.map(async (stock) => {
        const data = await yahooFinance.quote(stock);
        // console.log(data)
        let result = {
            Symbol: data.symbol,
            name: data.shortName,
            prevPrice: data.regularMarketPreviousClose,
            price: data.regularMarketPrice,
            range: data.regularMarketDayRange,
            volume: data.regularMarketVolume,
            change: data.regularMarketChangePercent.toFixed(2),
            PE: data.typeDisp=== 'ETF' ? null : data.trailingPE.toFixed(2),
            forwardPE: data.typeDisp=== 'ETF' ? null : data.forwardPE.toFixed(2),
            rating: data.typeDisp=== 'ETF' ? null : data.averageAnalystRating
        }
        data.typeDisp==='ETF'?'':(result.PE = data.trailingPE.toFixed(2), result.forwardPE = data.forwardPE.toFixed(2), result.rating = data.averageAnalystRating)
        console.log(result)
    })
}


StockAgent(HodingStocks)

const StockHistoryAgent = async (stock) => {
    const now = new Date();
    now.setDate(now.getDate() + 1);
    const period2 = now.toISOString().split('T')[0];
    now.setDate(now.getDate() - 1);
    // now.setFullYear(now.getFullYear() - 1);
    now.setMonth(now.getMonth() - 2);
    const period1 = now.toISOString().split('T')[0];
    console.log(`from ${period1} to ${period2}`)
    // const data = await yahooFinance.historical(stock, { period1: '2024-03-18', period2: '2024-03-23' });
    const data = await yahooFinance.historical(stock, { period1: period1, period2: period2 });
    // console.log(data)
    // Agent(data)
}
StockHistoryAgent('2330.TW');

const Agent = (data) => {
    // 從第十天開始計算10日均量
    for (let i = 9; i < data.length - 1; i++) { // 減1，因為我們需要比較隔日
        const lastTenDays = data.slice(i - 9, i + 1); // 獲取最近10天的數據
        lastTenDays.sort((a, b) => b.volume - a.volume); // 按交易量排序（從大到小）以計算10日均量
        const heightestVolume = lastTenDays[0].volume; // 獲取最高交易量
        const lowestVolume = lastTenDays[9].volume; // 獲取最低交易量
        const tenDayAverageVolume = lastTenDays.reduce((acc, curr) => acc + curr.volume, 0) / 10; // 計算10日均量
        const tenDayAveragePrice = lastTenDays.reduce((acc, curr) => acc + curr.close, 0) / 10; // 計算10日均價
        lastTenDays.sort((a, b) => b.close - a.close); // 按收盤價排序（從小到大）以計算最低價和最高價
        const lowestPrice = lastTenDays[9].close; // 獲取最低價
        const highestPrice = lastTenDays[0].close; // 獲取最高價
    
        const nextDayVolume = data[i + 1].volume; // 獲取隔日的交易量
        const nextDayPrice = data[i + 1].close; // 獲取隔日的收盤價
        let  date = data[i+1].date.toISOString().split('T')[0]
        // const differencePercentage = ((nextDayVolume - tenDayAverageVolume) / tenDayAverageVolume) * 100; // 計算差異百分比

    
        // 根據差異百分比判斷結果
        if (nextDayPrice > highestPrice) {
            if (nextDayVolume > heightestVolume && ((nextDayVolume-heightestVolume)/heightestVolume) > 0.07) {
                console.log(`${date}: 價升量升`)
            } else if (nextDayVolume < lowestVolume && ((lowestVolume-nextDayVolume)/lowestVolume) > 0.07) {
                console.log(`${date}: 價升量跌`)
            } else {
                console.log(`${date}: 價升量平`)
            }
        } else if (nextDayPrice < lowestPrice){
            if (nextDayVolume > heightestVolume && ((nextDayVolume-heightestVolume)/heightestVolume) > 0.07) {
                console.log(`${date}: 價跌量升`)
            } else if (nextDayVolume < lowestVolume && ((lowestVolume-nextDayVolume)/lowestVolume) > 0.07) {
                console.log(`${date}: 價跌量跌`)
            } else {
                console.log(`${date}: 價跌量平`)
            }
        } else {
            console.log(`${date}: 普通`)
        }
        // if (nextDayVolume > heightestVolume && ((nextDayVolume-heightestVolume)/heightestVolume) > 0.07) {
        //     console.log(`${date}: high`);
        // } else if (nextDayVolume < lowestVolume && ((lowestVolume-nextDayVolume)/lowestVolume) > 0.07) {
        //     console.log(`${date}: low`);
        // } else {
        //     console.log(`${date}: normal`);
        // }
    }
  };