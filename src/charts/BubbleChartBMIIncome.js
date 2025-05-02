// BubbleChartBMIIncome.js
import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";

const BubbleChartBMIIncome = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/tejvink/SDV_diabetes_dashboard/refs/heads/main/final_merged_dataset.csv"
    )
      .then((res) => res.text())
      .then((csv) => {
        const rows = csv.split("\n").slice(1);
        const parsed = rows.map((r) => r.split(","));
        const bmi = [], income = [], age = [], color = [];

        parsed.forEach((cols) => {
          const bmiVal = parseFloat(cols[3]);
          const incomeVal = parseFloat(cols[6]);
          const ageVal = parseInt(cols[4]);
          const outcome = parseInt(cols[5]);
          if (!isNaN(bmiVal) && !isNaN(incomeVal) && !isNaN(ageVal)) {
            bmi.push(bmiVal);
            income.push(incomeVal);
            age.push(ageVal);
            color.push(outcome === 1 ? "red" : "blue");
          }
        });

        setData({ bmi, income, age, color });
      });
  }, []);

  return (
    <div>
      <h2>BMI vs. Income (Bubble Size = Age)</h2>
      <Plot
        data={[
          {
            x: data.bmi,
            y: data.income,
            mode: "markers",
            marker: {
              size: data.age,
              color: data.color,
              sizemode: "area",
              sizeref: 2.0 * Math.max(...(data.age || [1])) / 100**2,
              opacity: 0.6,
            },
            text: data.age?.map((a, i) => `Age: ${a}, Outcome: ${data.color[i] === 'red' ? 'Diabetic' : 'Non-Diabetic'}`),
            type: "scatter",
          },
        ]}
        layout={{
          title: "BMI vs. Income by Age and Diabetes Outcome",
          xaxis: { title: "BMI" },
          yaxis: { title: "Income ($)" },
          height: 500,
        }}
      />
    </div>
  );
};

export default BubbleChartBMIIncome;
