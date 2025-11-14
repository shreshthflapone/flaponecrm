import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const BarChartComponent = ({
  data,
  bars,
  dimensions = { width: 800, height: 300 },
  margin = { top: 20, right: 30, left: 20, bottom: 5 },
  className,
  onBarClick
}) => {
  return (
    <div style={{ width: "100%", height: "400px" }} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={dimensions.width}
          height={dimensions.height}
          data={data}
          margin={margin}
        >
          <CartesianGrid stroke="#f0f0f0" strokeDasharray="0 0" />
          <XAxis dataKey="name" tick={{ fontSize: 13 }} />
          <YAxis tick={{ fontSize: 13 }} />
          <Tooltip
            contentStyle={{
              fontSize: "13px",
            }}
            itemStyle={{ fontSize: "13px" }}
          />
          {/* <Legend /> */}
          {bars.map((bar, index) => (
            <Bar
              key={index}
              dataKey={bar.dataKey}
              stackId={bar.stackId}
              fill={bar.fill}
              barSize={50}
              onClick={() => onBarClick(bar.dataKey,bar.redirectData)}
              style={{ cursor: "pointer" }}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;


