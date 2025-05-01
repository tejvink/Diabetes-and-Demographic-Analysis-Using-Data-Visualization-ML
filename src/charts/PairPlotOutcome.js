// PairPlotOutcome.js
import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";

const PairPlotOutcome = () => {
  const [data, setData] = useState({
    glucose: [],
    bmi: [],
    age: [],
    outcome: [],
  });

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/tejvink/Diabetes-and-Demographic-Analysis-Using-Data-Visualization-ML/main/final_merged_dataset.csv"
    )
      .then((res) => res.text())
      .then((csv) => {
        const rows = csv.split("\n").slice(1);
        const glucose = [],
          bmi = [],
          age = [],
          outcome = [];

        rows.forEach((row) => {
          const cols = row.split(",");
          const g = parseFloat(cols[1]);
          const b = parseFloat(cols[3]);
          const a = parseFloat(cols[4]);
          const o = parseInt(cols[5]);

          if (!isNaN(g) && !isNaN(b) && !isNaN(a) && !isNaN(o)) {
            glucose.push(g);
            bmi.push(b);
            age.push(a);
            outcome.push(o === 1 ? "Diabetic" : "Non-Diabetic");
          }
        });

        setData({ glucose, bmi, age, outcome });
      });
  }, []);

  // Filter diabetic and non-diabetic values separately
  const getFilteredData = (xData, yData) => {
    const diabetic = {
      x: [],
      y: [],
    };
    const nonDiabetic = {
      x: [],
      y: [],
    };

    for (let i = 0; i < data.outcome.length; i++) {
      if (data.outcome[i] === "Diabetic") {
        diabetic.x.push(xData[i]);
        diabetic.y.push(yData[i]);
      } else {
        nonDiabetic.x.push(xData[i]);
        nonDiabetic.y.push(yData[i]);
      }
    }

    return { diabetic, nonDiabetic };
  };

  return (
    <div>
      <h2>Pair Plot of Glucose, BMI, and Age by Outcome</h2>
      <Plot
        data={[
          // Glucose vs BMI
          {
            x: getFilteredData(data.glucose, data.bmi).diabetic.x,
            y: getFilteredData(data.glucose, data.bmi).diabetic.y,
            mode: "markers",
            type: "scatter",
            marker: { color: "#e41a1c", size: 7 },
            name: "Glucose vs BMI (Diabetic)",
          },
          {
            x: getFilteredData(data.glucose, data.bmi).nonDiabetic.x,
            y: getFilteredData(data.glucose, data.bmi).nonDiabetic.y,
            mode: "markers",
            type: "scatter",
            marker: { color: "#377eb8", size: 7 },
            name: "Glucose vs BMI (Non-Diabetic)",
          },

          // Glucose vs Age
          {
            x: getFilteredData(data.glucose, data.age).diabetic.x,
            y: getFilteredData(data.glucose, data.age).diabetic.y,
            mode: "markers",
            type: "scatter",
            marker: { color: "#fb8072", size: 7 },
            name: "Glucose vs Age (Diabetic)",
          },
          {
            x: getFilteredData(data.glucose, data.age).nonDiabetic.x,
            y: getFilteredData(data.glucose, data.age).nonDiabetic.y,
            mode: "markers",
            type: "scatter",
            marker: { color: "#6baed6", size: 7 },
            name: "Glucose vs Age (Non-Diabetic)",
          },

          // BMI vs Age
          {
            x: getFilteredData(data.bmi, data.age).diabetic.x,
            y: getFilteredData(data.bmi, data.age).diabetic.y,
            mode: "markers",
            type: "scatter",
            marker: { color: "#fcae91", size: 7 },
            name: "BMI vs Age (Diabetic)",
          },
          {
            x: getFilteredData(data.bmi, data.age).nonDiabetic.x,
            y: getFilteredData(data.bmi, data.age).nonDiabetic.y,
            mode: "markers",
            type: "scatter",
            marker: { color: "#9ecae1", size: 7 },
            name: "BMI vs Age (Non-Diabetic)",
          },
        ]}
        layout={{
          title: "Pair Plot: Glucose, BMI, and Age Colored by Outcome",
          height: 550,
          width: 1200,
          showlegend: true,
          xaxis: { title: "Feature X" },
          yaxis: { title: "Feature Y" },
        }}
      />
    </div>
  );
};

export default PairPlotOutcome;
