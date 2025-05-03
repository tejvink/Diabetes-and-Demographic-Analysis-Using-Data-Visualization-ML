import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const BarChartAverageBMI = () => {
  const [stateLabels, setStateLabels] = useState([]);
  const [bmiAverages, setBmiAverages] = useState([]);

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/tejvink/Diabetes-and-Demographic-Analysis-Using-Data-Visualization-ML/main/final_merged_dataset.csv")
      .then(res => res.text())
      .then(csv => {
        const rows = csv.split("\n").slice(1);
        const parsed = rows.map(row => row.split(",")).filter(r => r.length > 10);

        const stateBmiMap = {};
        parsed.forEach(cols => {
          const state = cols[0];
          const bmi = parseFloat(cols[3]);
          if (!isNaN(bmi)) {
            if (!stateBmiMap[state]) {
              stateBmiMap[state] = [];
            }
            stateBmiMap[state].push(bmi);
          }
        });

        const labels = Object.keys(stateBmiMap);
        const averages = labels.map(state => {
          const values = stateBmiMap[state];
          return values.reduce((a, b) => a + b, 0) / values.length;
        });

        setStateLabels(labels);
        setBmiAverages(averages);
      });
  }, []);

  const minBMI = Math.min(...bmiAverages);
  const maxBMI = Math.max(...bmiAverages);
  const normalizedColors = bmiAverages.map(bmi =>
    (bmi - minBMI) / (maxBMI - minBMI)
  );

  return (
    <div>
      <h2>Average BMI by State</h2>
      <Plot
        data={[{
          type: 'bar',
          x: stateLabels,
          y: bmiAverages,
          marker: {
            color: normalizedColors,
            colorscale: 'YlOrRd',
            colorbar: {
              title: 'Normalized BMI',
              thickness: 15
            }
          }
        }]}
        layout={{
          title: 'Average BMI by State',
          xaxis: { title: 'State Name', tickangle: -45 },
          yaxis: { title: 'Body Mass Index (BMI)' },
          height: 500,
          margin: { t: 50, l: 60, r: 30, b: 120 }
        }}
      />
    </div>
  );
};

export default BarChartAverageBMI;
