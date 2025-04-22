import React, { useEffect, useRef, useState } from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import News from "./News";

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, annotationPlugin);

const CoinChart = ({ coinId }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [chartData, setChartData] = useState(null);
  const [prevDayPrice, setPrevDayPrice] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [slope, setSlope] = useState(null); // Track the slope of the curve

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=2`
      );
      const data = await response.json();

      const prices = data.prices.map((price) => price[1]);
      const timestamps = data.prices.map((price) => new Date(price[0]));

      // Get the last timestamp (latest recorded time)
      const latestTimestamp = timestamps[timestamps.length - 1];

      // Find timestamp exactly 24 hours before the last timestamp
      const prevDayTimestamp = new Date(latestTimestamp);
      prevDayTimestamp.setDate(latestTimestamp.getDate() - 1);

      // Find the closest price to this timestamp
      let prevPrice = null;
      for (let i = timestamps.length - 1; i >= 0; i--) {
        if (timestamps[i] <= prevDayTimestamp) {
          prevPrice = prices[i];
          break;
        }
      }

      setPrevDayPrice(prevPrice); // Store the previous day's price

      // Set up chart data
      setChartData({
        labels: timestamps.map((t) => t.toLocaleTimeString()),
        datasets: [
          {
            label: `${coinId.toUpperCase()} Price (USD)`,
            data: prices,
            borderColor: "white", // White curve
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 0,
            tension: 0, // Smooth curve
            shadowColor: "rgba(128, 128, 128, 0.5)", // Gray shadow
            shadowBlur: 10, // Soft shadow effect
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // Fetch data immediately when the component mounts
    fetchData();

    // Set up an interval to fetch data every 5 minutes (300,000 milliseconds)
    const intervalId = setInterval(fetchData, 300000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [coinId]);

  useEffect(() => {
    if (chartRef.current && chartData) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");
      chartInstanceRef.current = new Chart(ctx, {
        type: "line",
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: "nearest",
            intersect: false,
          },
          plugins: {
            annotation: {
              annotations: prevDayPrice
                ? {
                    line1: {
                      type: "line",
                      yMin: prevDayPrice,
                      yMax: prevDayPrice,
                      borderColor: "green", // Green horizontal line
                      borderWidth: 2,
                      borderDash: [5, 5], // Dotted effect
                      label: {
                        content: `1-Day Prior: $${prevDayPrice.toFixed(2)}`,
                        enabled: true,
                        position: "end",
                        backgroundColor: "green",
                        color: "#fff",
                      },
                      shadowColor: "rgba(128, 128, 128, 0.5)", // Gray shadow
                      shadowBlur: 10,
                    },
                  }
                : {},
            },
            tooltip: {
              enabled: false,
              external: function (context) {
                const { tooltip: tooltipModel } = context;
                if (!tooltipModel || tooltipModel.opacity === 0) return;

                const dataIndex = tooltipModel.dataPoints[0].dataIndex;
                const price = chartData.datasets[0].data[dataIndex].toFixed(2);
                const time = chartData.labels[dataIndex];

                // Calculate slope
                const prevPrice = chartData.datasets[0].data[dataIndex - 1];
                const nextPrice = chartData.datasets[0].data[dataIndex + 1];
                const slope = nextPrice - prevPrice;

                setCurrentPrice(price);
                setCurrentTime(time);
                setSlope(slope);
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [chartData, prevDayPrice]);

  return (
    <div className="w-full h-full bg-black items-center justify-center">
      {/* Bar on Top of the Chart */}
      <div className="w-3/4 ml-40 mt-20 p-4 bg-gray-800 rounded-lg shadow-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span
              className={`w-3 h-3 rounded-full ${
                slope > 0 ? "bg-green-500" : slope < 0 ? "bg-red-500" : "bg-green-500"
              }`}
            ></span>
            <span className="text-white">
              Price: <b>${currentPrice}</b>
            </span>
          </div>
          <span className="text-white">{currentTime}</span>
          <span className="text-white">
            Vol 24h: <b>$39.07B</b>
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="relative w-3/4 ml-40 mt-4 h-125 justify-center items-center">
        <canvas ref={chartRef} id="coinChart"></canvas>
      </div>

      {/* News Component */}
      <div>
        <News />
      </div>
    </div>
  );
};

export default CoinChart;