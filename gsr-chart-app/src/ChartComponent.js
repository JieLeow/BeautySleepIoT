import React, { useEffect, useState } from "react";
import { database } from "./firebase"; // Updated import
import { ref, onValue, off } from "firebase/database"; // Importing necessary functions
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "chartjs-plugin-zoom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartComponent = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "GSR Average",
        data: [],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "Heat Index (F)",
        data: [],
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
      {
        label: "Humidity (%)",
        data: [],
        fill: false,
        borderColor: "rgb(54, 162, 235)",
        tension: 0.1,
      },
      {
        label: "Temperature (F)",
        data: [],
        fill: false,
        borderColor: "rgb(255, 159, 64)",
        tension: 0.1,
      },
    ],
  });

  // State hooks for box values
  const [averageTemp, setAverageTemp] = useState(0);
  const [averageHumidity, setAverageHumidity] = useState(0);
  const [highestGSR, setHighestGSR] = useState(0);
  const [lowestGSR, setLowestGSR] = useState(Infinity);

  const parseTimestamp = (timestamp) => {
    const [year, monthDay, hourMinute] = timestamp.split(":");
    return `${year}-${monthDay.substring(0, 2)}-${monthDay.substring(
      2
    )} ${hourMinute.substring(0, 2)}:${hourMinute.substring(2)}`;
  };

  const loadData = () => {
    const dbRef = ref(database, "LJ/data");
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      const timestamps = [];
      const gsrAverages = [];
      const heatIndexesF = [];
      const humidities = [];
      const temperaturesF = [];

      const nHoursAgo = new Date();
      nHoursAgo.setHours(nHoursAgo.getHours() - 8);

      for (const [key, value] of Object.entries(data)) {
        if (
          typeof value === "object" &&
          value !== null &&
          "gsrAverage" in value
        ) {
          const readableTimestamp = parseTimestamp(key);
          const dataTime = new Date(readableTimestamp);
          if (dataTime >= nHoursAgo) {
            timestamps.push(readableTimestamp);
            gsrAverages.push(value.gsrAverage);
            heatIndexesF.push(value.heatIndexF);
            humidities.push(value.humidity);
            temperaturesF.push(value.temperatureF);
          }
        }
      }

      // Get average temp, humidity, min/max GSR values
      const tempSum = temperaturesF.reduce((a, b) => a + b, 0);
      const humiditySum = humidities.reduce((a, b) => a + b, 0);
      const avgTemp = tempSum / temperaturesF.length || 0;
      const avgHumidity = humiditySum / humidities.length || 0;
      const maxGSR = Math.max(...gsrAverages);
      const minGSR = Math.min(...gsrAverages);

      // Update the state for box values
      setAverageTemp(avgTemp);
      setAverageHumidity(avgHumidity);
      setHighestGSR(maxGSR);
      setLowestGSR(minGSR);

      setChartData({
        labels: timestamps,
        datasets: [
          {
            ...chartData.datasets[0],
            data: gsrAverages,
          },
          {
            ...chartData.datasets[1],
            data: heatIndexesF,
          },
          {
            ...chartData.datasets[2],
            data: humidities,
          },
          {
            ...chartData.datasets[3],
            data: temperaturesF,
          },
        ],
      });
    });
  };

  useEffect(() => {
    const dbRef = ref(database, "LJ/data");
    loadData();
    // Cleanup function
    return () => off(dbRef, "value", loadData); // Updated to use modular SDK
  }, []);

  // Component for displaying the box values
  const ValueBox = ({ label, value }) => (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "10px",
        margin: "10px",
        textAlign: "center",
      }}
    >
      <div style={{ fontWeight: "bold" }}>{label}</div>
      <div>{value.toFixed(2)}</div>
    </div>
  );

  return (
    <div>
      <Line data={chartData} />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <ValueBox label="Average Temperature (Last Hour)" value={averageTemp} />
        <ValueBox
          label="Average Humidity (Last Hour)"
          value={averageHumidity}
        />
        <ValueBox label="Highest GSR read" value={highestGSR} />
        <ValueBox label="Lowest GSR read" value={lowestGSR} />
      </div>
    </div>
  );
};

export default ChartComponent;
