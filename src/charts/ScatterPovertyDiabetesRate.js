import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const ScatterPovertyDiabetesRate = () => {
  const [plotData, setPlotData] = useState([]);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/tejvink/Diabetes-and-Demographic-Analysis-Using-Data-Visualization-ML/main/final_merged_dataset.csv')
      .then(res => res.text())
      .then(csv => {
        const rows = csv.split('\n').slice(1);
        const stateData = {};

        rows.forEach(row => {
          const cols = row.split(',');
          const state = cols[0];
          const outcome = parseInt(cols[5]);    // Diabetes Outcome
          const poverty = parseFloat(cols[7]);  // Poverty Rate

          if (!state || isNaN(outcome) || isNaN(poverty)) return;

          if (!stateData[state]) {
            stateData[state] = {
              total: 0,
              diabetic: 0,
              povertySum: 0
            };
          }

          stateData[state].total += 1;
          stateData[state].povertySum += poverty;
          if (outcome === 1) {
            stateData[state].diabetic += 1;
          }
        });

        const x = [];
        const y = [];
        const hoverText = [];

        Object.entries(stateData).forEach(([state, stats]) => {
          const diabetesRate = (stats.diabetic / stats.total) * 100;
          const avgPoverty = stats.povertySum / stats.total;

          x.push(avgPoverty);
          y.push(diabetesRate);
          hoverText.push(
            `State: ${state}<br>Avg. Poverty Rate: ${avgPoverty.toFixed(1)}%<br>Diabetes Rate: ${diabetesRate.toFixed(1)}%`
          );
        });

        setPlotData([
          {
            x: x,
            y: y,
            type: 'scatter',
            mode: 'markers',
            text: hoverText,
            hoverinfo: 'text',
            marker: {
              size: 10,
              color: '#2ca02c'
            }
          }
        ]);
      });
  }, []);

  return (
    <div>
      <h2>Scatter Plot: Poverty Rate vs Diabetes Rate</h2>
      <Plot
        data={plotData}
        layout={{
          title: 'Relationship Between Poverty and Diabetes Rate by State',
          xaxis: { title: 'Average Poverty Rate (%) per State' },
          yaxis: { title: 'Diabetes Rate (%) per State' },
          height: 500,
          width: 800,
          showlegend: false
        }}
        config={{ responsive: true }}
      />
    </div>
  );
};

export default ScatterPovertyDiabetesRate;
