import React, { useEffect, useState } from "react";
import { ResponsiveLine } from "@nivo/line";
import io from "socket.io-client";

const socket = io("http://localhost:5001"); // Replace with your server URL

const RealTimeLineChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Listen for data events emitted by the server
    socket.on("data", (newData) => {
      setData((prevData) => [...prevData, newData]);
    });

    return () => {
      socket.disconnect(); // Disconnect the socket when the component unmounts
    };
  }, []);

  return (
    <div>
      <h1>Real-time Line Chart</h1>
      <ResponsiveLine
        width={800}
        height={400}
        data={data.map((item) => ({
          x: item.timestamp,
          y: item.value,
        }))}
        xScale={{ type: "time", format: "%Y-%m-%dT%H:%M:%S.%LZ" }}
        xFormat="time:%Y-%m-%dT%H:%M:%S.%LZ"
        yScale={{ type: "linear", min: 0, max: 100 }}
        axisBottom={{
          format: "%H:%M:%S",
          tickValues: "every 5 seconds",
          legend: "Time",
          legendOffset: 36,
          legendPosition: "middle",
        }}
        axisLeft={{
          legend: "Value",
          legendOffset: -40,
          legendPosition: "middle",
        }}
        enableGridX={false}
        enablePoints={false}
        curve="monotoneX"
      />
    </div>
  );
};

export default RealTimeLineChart;
