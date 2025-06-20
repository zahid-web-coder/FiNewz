const dotenv = require("dotenv");
dotenv.config();
const finnewz = require("finnhub");

function getSymbolPrice(symbol) {
    try {
        const api_key = finnewz.ApiClient.instance.authentications["api_key"];
        api_key.apiKey = process.env.API_KEY;

        if (!api_key.apiKey) {
            throw new Error("API key is not set or is undefined.");
        }

        

        const finnewzClient = new finnewz.DefaultApi();
        finnewzClient.quote(symbol, (err, data, response) => {
            if (err) {
                console.error("API Error:", err);
            } else {
                console.log("Response Data:", data);
            }
        });
    } catch (error) {
        console.error("Caught Error:", error.message);
    }
}

let data=["MSFT","AAPL","BSE","NSE"];
for(let i=0;i<data.length;i++){
    getSymbolPrice(data[i]);
}