import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const PieChartIncomeDiabetes = () => {
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/tejvink/SDV_diabetes_dashboard/refs/heads/main/final_merged_dataset.csv')
      .then((res) => res.text())
      .then((csv) => {
        const rows = csv.split('\n').slice(1);
        const data = rows
          .map(row => row.split(','))
          .filter(row => row.length > 10);

        const brackets = {
          '<30k': { diabetic: 0, nonDiabetic: 0 },
          '30k-60k': { diabetic: 0, nonDiabetic: 0 },
          '60k+': { diabetic: 0, nonDiabetic: 0 },
        };

        data.forEach(cols => {
          const income = parseFloat(cols[6]);
          const outcome = parseInt(cols[5]);

          if (!isNaN(income) && !isNaN(outcome)) {
            if (income < 30000) {
              outcome === 1 ? brackets['<30k'].diabetic++ : brackets['<30k'].nonDiabetic++;
            } else if (income < 60000) {
              outcome === 1 ? brackets['30k-60k'].diabetic++ : brackets['30k-60k'].nonDiabetic++;
            } else {
              outcome === 1 ? brackets['60k+'].diabetic++ : brackets['60k+'].nonDiabetic++;
            }
          }
        });

        const labels = [];
        const values = [];

        Object.keys(brackets).forEach(range => {
          labels.push(`${range} - Diabetic`);
          labels.push(`${range} - Non-Diabetic`);
          values.push(brackets[range].diabetic);
          values.push(brackets[range].nonDiabetic);
        });

        setPieData([{ labels, values, type: 'pie', textinfo: 'label+percent', hole: 0.4 }]);
      });
  }, []);

  return (
    <div>
      <h2>Pie Chart: Diabetes Outcomes by Income Ranges</h2>
      <Plot
        data={pieData}
        layout={{
          title: 'Diabetes Distribution Across Income Ranges',
          height: 500,
        }}
      />
    </div>
  );
};

export default PieChartIncomeDiabetes;
