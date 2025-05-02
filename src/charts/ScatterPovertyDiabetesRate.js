import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const ScatterPovertyDiabetesRate = () => {
  const [plotData, setPlotData] = useState([]);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/tejvink/SDV_diabetes_dashboard/refs/heads/main/final_merged_dataset.csv')
      .then(res => res.text())
      .then(csv => {
        const rows = csv.split('\n').slice(1);
        const stateData = {};

        rows.forEach(row => {
          const cols = row.split(',');
          const state = cols[0];
          const outcome = parseInt(cols[5]);
          const poverty = parseFloat(cols[7]);

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
            `State: ${state}<br>Poverty Rate: ${avgPoverty.toFixed(1)}%<br>Diabetes Rate: ${diabetesRate.toFixed(1)}%`
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
      <h2>Poverty vs Diabetes Rate</h2>
      <Plot
        data={plotData}
        layout={{
          height: 500,
          width: 800,
          title: 'Diabetes Rate vs. Poverty Level by State',
          xaxis: { title: 'Average Poverty Rate (%)' },
          yaxis: { title: 'Diabetes Rate (%)' },
          showlegend: false
        }}
        config={{
          responsive: true
        }}
      />
    </div>
  );
};

export default ScatterPovertyDiabetesRate;
