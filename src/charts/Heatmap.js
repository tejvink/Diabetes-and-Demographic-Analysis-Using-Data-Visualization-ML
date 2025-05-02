import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const Heatmap = () => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/tejvink/Diabetes-and-Demographic-Analysis-Using-Data-Visualization-ML/main/final_merged_dataset.csv')
      .then(res => res.text())
      .then(csv => {
        const rows = csv.split('\n').slice(1);
        const data = rows
          .map(row => row.split(','))
          .filter(row => row.length > 10);

        const diabeticBins = {};
        const nonDiabeticBins = {};
        let total = 0;

        data.forEach(cols => {
          const age = parseInt(cols[4]);
          const commute = parseFloat(cols[8]);
          const outcome = parseInt(cols[5]);

          if (!isNaN(age) && !isNaN(commute) && !isNaN(outcome)) {
            const ageBin = Math.floor(age / 5) * 5;
            const commuteBin = Math.floor(commute / 5) * 5;
            const key = `${ageBin}-${commuteBin}`;
            total++;

            if (outcome === 1) {
              diabeticBins[key] = (diabeticBins[key] || 0) + 1;
            } else {
              nonDiabeticBins[key] = (nonDiabeticBins[key] || 0) + 1;
            }
          }
        });

        setTotalCount(total);

        const xAxis = [...new Set(Object.keys({ ...diabeticBins, ...nonDiabeticBins }).map(k => k.split('-')[1]))].sort((a, b) => a - b);
        const yAxis = [...new Set(Object.keys({ ...diabeticBins, ...nonDiabeticBins }).map(k => k.split('-')[0]))].sort((a, b) => a - b);

        const diffMatrix = yAxis.map(y =>
          xAxis.map(x => {
            const d = diabeticBins[`${y}-${x}`] || 0;
            const n = nonDiabeticBins[`${y}-${x}`] || 0;
            return d - n;
          })
        );

        const customText = yAxis.map(y =>
          xAxis.map(x => {
            const d = diabeticBins[`${y}-${x}`] || 0;
            const n = nonDiabeticBins[`${y}-${x}`] || 0;
            const countDiff = d - n;
            const percent = ((Math.abs(countDiff) / total) * 100).toFixed(2);
            return `Age: ${y}<br>Commute: ${x}<br>Count Diff: ${countDiff}<br>Contribution: ${percent}%`;
          })
        );

        setHeatmapData([
          {
            z: diffMatrix,
            x: xAxis,
            y: yAxis,
            type: 'heatmap',
            text: customText,
            hoverinfo: 'text',
            colorscale: [
              [0, '#5cd6c0'],   // green
              [0.5, '#f2e94e'], // yellow
              [1, '#f94144']    // red-orange
            ],
            reversescale: false,
            colorbar: {
              title: 'Diabetic - Non-Diabetic Count'
            },
          }
        ]);
      });
  }, []);

  return (
    <div>
      <h2>Heatmap: Age vs. Commute Time by Diabetes Status (Difference)</h2>
      <Plot
        data={heatmapData}
        layout={{
          title: 'Difference in Patient Density (Diabetic - Non-Diabetic)',
          xaxis: { title: 'Mean Commute Time (binned)', automargin: true },
          yaxis: { title: 'Age (binned)', automargin: true },
          height: 600,
        }}
      />
    </div>
  );
};

export default Heatmap;