import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const BoxPlot = () => {
  const [diabeticAges, setDiabeticAges] = useState([]);
  const [nonDiabeticAges, setNonDiabeticAges] = useState([]);

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/tejvink/SDV_diabetes_dashboard/refs/heads/main/final_merged_dataset.csv"
    )
      .then((res) => res.text())
      .then((csv) => {
        const rows = csv.split('\n').slice(1);
        const diabetic = [];
        const nonDiabetic = [];

        rows.forEach((row) => {
          const cols = row.split(',');
          const age = parseFloat(cols[4]);      // Age
          const outcome = parseInt(cols[5]);    // Outcome

          if (!isNaN(age) && (outcome === 0 || outcome === 1)) {
            if (outcome === 1) diabetic.push(age);
            else nonDiabetic.push(age);
          }
        });

        setDiabeticAges(diabetic);
        setNonDiabeticAges(nonDiabetic);
      });
  }, []);

  return (
    <div>
      <h2>Age Distribution: Diabetic vs. Non-Diabetic</h2>
      <Plot
        data={[
          {
            y: diabeticAges,
            type: 'box',
            name: 'Diabetic',
            marker: { color: 'red' },
            boxpoints: 'all',
            jitter: 0.5
          },
          {
            y: nonDiabeticAges,
            type: 'box',
            name: 'Non-Diabetic',
            marker: { color: 'blue' },
            boxpoints: 'all',
            jitter: 0.5
          },
        ]}
        layout={{
          title: 'Age Distribution of Diabetic vs Non-Diabetic Individuals',
          yaxis: { title: 'Age' },
          boxmode: 'group',
          height: 500,
        }}
      />
    </div>
  );
};

export default BoxPlot;
