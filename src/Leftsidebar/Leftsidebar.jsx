import React, { useEffect, useState } from "react";

const Sidebar = () => {
  const [coinData, setCoinData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [btcInput, setBtcInput] = useState(""); // State for BTC input
  const [usdConversion, setUsdConversion] = useState(null); // State for USD conversion
  const [conversionLoading, setConversionLoading] = useState(false); // State for loading during conversion

  const fetchCoinData = async () => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin&price_change_percentage=1d&precision=2"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setCoinData(data[0]); // Extract first object from API response array
      setLoading(false);
    } catch (err) {
      setError("Failed to load data");
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch data immediately when the component mounts
    fetchCoinData();

    // Set up an interval to fetch data every 5 minutes (300,000 milliseconds)
    const intervalId = setInterval(fetchCoinData, 300000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  // Handle BTC input change
  const handleBtcInputChange = (e) => {
    const value = e.target.value;
    setBtcInput(value);

    if (value && coinData) {
      setConversionLoading(true);
      const usdValue = (parseFloat(value) * coinData.current_price).toFixed(2); // Convert BTC to USD
      setUsdConversion(usdValue);
      setConversionLoading(false);
    } else {
      setUsdConversion(null);
    }
  };

  if (loading) return <div className="text-white p-4">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="w-[350px] bg-gray-900 text-white p-6 space-y-4">
      {/* Bitcoin Name & Price */}
      <div className="flex items-center gap-3 mb-4">
        <img src={coinData.image} alt="Bitcoin Logo" className="w-6 h-6" />
        <div className="text-xl font-bold">Bitcoin <span className="text-gray-400 text-sm">BTC</span></div>
      </div>

      <div className="text-3xl font-bold mb-2">${coinData.current_price.toLocaleString()}</div>
      <div className={`text-md font-medium ${coinData.price_change_percentage_24h >= 0 ? "text-green-400" : "text-red-400"}`}>
        {coinData.price_change_percentage_24h.toFixed(2)}% (1d)
      </div>

      {/* Market Cap & Volume */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-gray-800 p-3 rounded-lg">
          <div className="text-sm text-gray-400">Market Cap</div>
          <div className="text-lg font-semibold">${(coinData.market_cap / 1e12).toFixed(2)}T</div>
        </div>

        <div className="bg-gray-800 p-3 rounded-lg">
          <div className="text-sm text-gray-400">Volume (24h)</div>
          <div className={`text-lg font-semibold ${coinData.total_volume > 0 ? "text-green-400" : "text-red-400"}`}>
            ${(coinData.total_volume / 1e9).toFixed(2)}B
          </div>
        </div>
      </div>

      {/* FDV & Vol/Mkt Cap */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-gray-800 p-3 rounded-lg">
          <div className="text-sm text-gray-400">FDV</div>
          <div className="text-lg font-semibold">${(coinData.fully_diluted_valuation / 1e12).toFixed(2)}T</div>
        </div>

        <div className="bg-gray-800 p-3 rounded-lg">
          <div className="text-sm text-gray-400">Vol/Mkt Cap (24h)</div>
          <div className="text-lg font-semibold">{((coinData.total_volume / coinData.market_cap) * 100).toFixed(2)}%</div>
        </div>
      </div>

      {/* Supply Details */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-gray-800 p-3 rounded-lg">
          <div className="text-sm text-gray-400">Total Supply</div>
          <div className="text-lg font-semibold">{(coinData.total_supply / 1e6).toFixed(2)}M BTC</div>
        </div>

        <div className="bg-gray-800 p-3 rounded-lg">
          <div className="text-sm text-gray-400">Max Supply</div>
          <div className="text-lg font-semibold">{(coinData.max_supply / 1e6).toFixed(2)}M BTC</div>
        </div>
      </div>

      {/* Circulating Supply */}
      <div className="mt-4 bg-gray-800 p-3 rounded-lg flex items-center justify-between">
        <div className="text-sm text-gray-400">Circulating Supply</div>
        <div className="text-lg font-semibold">{(coinData.circulating_supply / 1e6).toFixed(2)}M BTC</div>
      </div>

      {/* BTC to USD Converter */}
      <div className="mt-6 bg-gray-800 p-4 rounded-lg">
        <div className="text-lg font-semibold mb-4">BTC to USD Converter</div>
        <div className="grid grid-cols-2 gap-5">
          <div className="text-sm text-gray-400">BTC</div>
          <div className="text-sm text-gray-400">USD</div>
          <input
            type="number"
            value={btcInput}
            onChange={handleBtcInputChange}
            className="bg-gray-700 text-white p-1 rounded"
            placeholder="1"
          />
          <div className="text-lg font-semibold">
            {conversionLoading ? "Loading..." : usdConversion ? `$${usdConversion}` : `${coinData.current_price.toLocaleString()}`}
          </div>
        </div>
      </div>

      {/* Price Performance */}
      <div className="mt-6 bg-gray-800 p-4 rounded-lg">
        <div className="text-lg font-semibold mb-4">Price Performance</div>

        <div className="space-y-3">
          {/* Low */}
          <div className="flex justify-between">
            <div className="text-sm text-gray-400">Low</div>
            <div className="text-sm font-semibold">${coinData.low_24h.toLocaleString()}</div>
          </div>

          {/* All-Time High */}
          <div className="flex justify-between">
            <div className="text-sm text-gray-400">All-Time High</div>
            <div className="text-sm font-semibold">
              ${coinData.ath.toLocaleString()} <span className="text-gray-400">({new Date(coinData.ath_date).toLocaleDateString()})</span>
            </div>
          </div>

          {/* All-Time Low */}
          <div className="flex justify-between">
            <div className="text-sm text-gray-400">All-Time Low</div>
            <div className="text-sm font-semibold">
              ${coinData.atl.toLocaleString()} <span className="text-gray-400">({new Date(coinData.atl_date).toLocaleDateString()})</span>
            </div>
          </div>

          {/* Percentage Changes */}
          <div className="flex justify-between">
            <div className="text-sm text-gray-400">ATH Change</div>
            <div className={`text-sm font-semibold ${coinData.ath_change_percentage >= 0 ? "text-green-400" : "text-red-400"}`}>
              {coinData.ath_change_percentage.toFixed(2)}%
            </div>
          </div>

          <div className="flex justify-between">
            <div className="text-sm text-gray-400">ATL Change</div>
            <div className={`text-sm font-semibold ${coinData.atl_change_percentage >= 0 ? "text-green-400" : "text-red-400"}`}>
              {coinData.atl_change_percentage.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;