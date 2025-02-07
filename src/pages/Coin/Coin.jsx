import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import LineChart from "../../components/LineChart/LineChart"; 
import './Coin.css';

const Coin = () => {
    const { coinId } = useParams();  
    const [coinData, setCoinData] = useState(null);
    const [historicalData, setHistoricalData] = useState(null);

    const fetchCoinData = async () => {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                'x-cg-demo-api-key': 'CG-knkG1EyDbFhmgsphw61YRbGs'
            }
        };

        try {
            const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`, options);
            const data = await response.json();
            setCoinData(data);
        } catch (error) {
            console.error("Error fetching coin data:", error);
        }
    };

    // Fetch historical data
    const fetchHistoricalData = async () => {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                'x-cg-demo-api-key': 'CG-knkG1EyDbFhmgsphw61YRbGs'
            }
        };

        try {
            const response = await fetch(
                `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=10&interval=daily`,
                options
            );
            const data = await response.json();
            setHistoricalData(data.prices); 
        } catch (error) {
            console.error("Error fetching historical data:", error);
        }
    };

    useEffect(() => {
        fetchCoinData();
        fetchHistoricalData();
    }, [coinId]);  

    if (!coinData || !historicalData) {
        return <p>Loading...</p>;
    }

    const formattedHistoricalData = historicalData.map(([timestamp, price]) => ({
        date: new Date(timestamp).toLocaleDateString(), 
        price: price,
    }));

    return (
        <div className='coin'>
            {/* Coin Name & Logo */}
            <div className='coin-name'>
                <img src={coinData.image.large} alt={coinData.name} />
                <p><b>{coinData.name} ({coinData.symbol.toUpperCase()})</b></p>
            </div>

            {/* Market Stats */}
            <div className="market-stats">
                <ul>
                    <li><b>Current Price:</b></li>
                    <li>${coinData.market_data.current_price.usd.toLocaleString()}</li>
                </ul>

                <ul>
                    <li><b>Market Cap:</b></li>
                    <li>${coinData.market_data.market_cap.usd.toLocaleString()}</li>
                </ul>

                <ul>
                    <li><b>24H High:</b></li>
                    <li>${coinData.market_data.high_24h.usd.toLocaleString()}</li>
                </ul>

                <ul>
                    <li><b>24H Low:</b></li>
                    <li>${coinData.market_data.low_24h.usd.toLocaleString()}</li>
                </ul>
            </div>

            {/* Chart Section */}
            <div className="chart-container">
                <h3>Price History (Last 10 Days)</h3>
                <LineChart data={formattedHistoricalData} />
            </div>
        </div>
    );
};

export default Coin;
