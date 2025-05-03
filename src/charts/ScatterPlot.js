import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const ScatterPlot = () => {
  const [plotData, setPlotData] = useState({ x: [], y: [], color: [] });

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/tejvink/Diabetes-and-Demographic-Analysis-Using-Data-Visualization-ML/main/final_merged_dataset.csv")
      .then(res => res.text())
      .then(csv => {
        const rows = csv.split("\n").slice(1);
        const x = [], y = [], color = [];

        rows.forEach(row => {
          const cols = row.split(',');
          const income = parseFloat(cols[6]);   // Income
          const glucose = parseFloat(cols[1]);  // Glucose
          const outcome = parseInt(cols[5]);    // Diabetes Outcome

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
    <div>
      <h2>Scatter Plot: Income vs. Glucose Level by Diabetes Outcome</h2>
      <Plot
        data={[{
          x: plotData.x,
          y: plotData.y,
          mode: 'markers',
          marker: { color: plotData.color, size: 7, opacity: 0.7 },
          type: 'scatter',
          text: plotData.color.map(c => c === 'red' ? 'Diabetic' : 'Non-Diabetic'),
          hoverinfo: 'x+y+text',
        }]}
        layout={{
          title: 'Income vs. Glucose Level by Diabetes Outcome',
          xaxis: { title: 'Annual Income (in USD)' },
          yaxis: { title: 'Glucose Level (mg/dL)' },
          height: 500
        }}
      />
    </div>
  );
};

export default ScatterPlot;
