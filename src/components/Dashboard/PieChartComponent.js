import React from "react";
import { PieChart, Pie, Tooltip, Legend, Cell, ResponsiveContainer } from "recharts";

const PieChartComponent = ({
  data,
  isBreakdownMode,
  selectedSource,
  handleClick,
  handleLegendClick,
  randomColors,
  colorMap
}) => {
  const chartData = selectedSource
    ? data.find((item) => item.name === selectedSource)?.breakdown
    : data;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={400} height={400}>
        <Pie
          data={chartData}
          dataKey={isBreakdownMode ? "amount" : "value"}
          nameKey={isBreakdownMode ? "source" : "name"}
          outerRadius={110}
          fill="#8884d8"
          onClick={handleClick}
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                isBreakdownMode
                  ? randomColors[index] // Random colors for breakdown
                  : colorMap[entry.name] // Static colors for default view
              }
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend
          payload={data.map((item) => ({
            value: item.name,
            type: "square",
            color: colorMap[item.name],
          }))}
          onClick={handleLegendClick}
          iconSize={16}
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          wrapperStyle={{ paddingTop: "10px" }}
          content={(props) => (
            <ul
              style={{
                display: "flex",
                justifyContent: "center",
                listStyleType: "none",
                padding: 0,
              }}
            >
              {props.payload.map((entry, index) => (
                <li
                  key={`item-${index}`}
                  onClick={() =>
                    handleLegendClick({ value: entry.value })
                  }
                  style={{
                    cursor: "pointer",
                    margin: "0 10px",
                    fontWeight:
                      selectedSource === entry.value
                        ? "bold"
                        : "normal", // **Highlight**
                    color:
                      selectedSource === entry.value
                        ? "#000"
                        : "#555", // Darken color for selected
                    borderBottom:
                      selectedSource === entry.value
                        ? `2px solid ${colorMap[entry.value]}`
                        : "none", // Border for selection
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: "16px",
                      height: "16px",
                      backgroundColor: entry.color,
                      marginRight: "8px",
                    }}
                  />
                  {entry.value}
                </li>
              ))}
            </ul>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartComponent;
