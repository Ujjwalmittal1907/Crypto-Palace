import React, { useState, useEffect, createContext } from 'react';

// Create the context
export const CoinContext = createContext();

// Context Provider Component
export const CoinContextProvider = (props) => {
    const [allCoin, setAllCoin] = useState([]);
    const [currency, setCurrency] = useState({
        name: "usd",
        symbol: "$"
    });

    // Fetch all coins
    const fetchAllCoin = async () => {
        try {
            const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.name}&order=market_cap_desc&per_page=100&page=1&sparkline=false`);
            const data = await response.json();
            setAllCoin(data);
        } catch (error) {
            console.error("Error fetching coins:", error);
        }
    };

    // Fetch coins when the component mounts or currency changes
    useEffect(() => {
        fetchAllCoin();
    }, [currency]);

    // Context value
    const contextValue = {
        allCoin,
        currency,
        setCurrency
    };

    return (
        <CoinContext.Provider value={contextValue}>
            {props.children}
        </CoinContext.Provider>
    );
};

export default CoinContextProvider;
// export { CoinContext };
