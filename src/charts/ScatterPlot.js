// 1. ScatterPlot.js - Income vs. Glucose by Diabetes Outcome
import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const ScatterPlot = () => {
  const [plotData, setPlotData] = useState({ x: [], y: [], color: [] });

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/tejvink/SDV_diabetes_dashboard/refs/heads/main/final_merged_dataset.csv")
      .then(res => res.text())
      .then(csv => {
        const rows = csv.split("\n").slice(1);
        const x = [], y = [], color = [];

        rows.forEach(row => {
          const cols = row.split(',');
          const income = parseFloat(cols[6]);
          const glucose = parseFloat(cols[1]);
          const outcome = parseInt(cols[5]);
          if (!isNaN(income) && !isNaN(glucose)) {
            x.push(income);
            y.push(glucose);
            color.push(outcome === 1 ? 'red' : 'blue');
          }
        });

        setPlotData({ x, y, color });
      });
  }, []);

  return (
    <Plot
      data={[{
        x: plotData.x,
        y: plotData.y,
        mode: 'markers',
        marker: { color: plotData.color },
        type: 'scatter'
      }]}
      layout={{
        title: 'Income vs. Glucose by Diabetes Outcome',
        xaxis: { title: 'Income ($)' },
        yaxis: { title: 'Glucose' },
        height: 500
      }}
    />
  );
};

export default ScatterPlot;
