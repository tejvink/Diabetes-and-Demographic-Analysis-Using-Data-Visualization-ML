// src/charts/ScatterPlotEmployment.js
import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";

const ScatterPlotEmployment = () => {
  const [glucose, setGlucose] = useState([]);
  const [employment, setEmployment] = useState([]);
  const [color, setColor] = useState([]);

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/tejvink/SDV_diabetes_dashboard/refs/heads/main/final_merged_dataset.csv"
    )
      .then((res) => res.text())
      .then((csv) => {
        const rows = csv.split("\n").slice(1);
        const g = [],
          e = [],
          c = [];

        rows.forEach((row) => {
          const cols = row.split(",");
          const glucoseVal = parseFloat(cols[1]);
          const employmentVal = parseFloat(cols[9]);
          const outcome = parseInt(cols[5]);

          if (
            !isNaN(glucoseVal) &&
            !isNaN(employmentVal) &&
            !isNaN(outcome)
          ) {
            g.push(glucoseVal);
            e.push(employmentVal);
            c.push(outcome === 1 ? "red" : "blue");
          }
        });

        setGlucose(g);
        setEmployment(e);
        setColor(c);
      });
  }, []);

  return (
    <Plot
      data={[
        {
          x: employment,
          y: glucose,
          mode: "markers",
          type: "scatter",
          marker: { color, size: 8, opacity: 0.7 },
        },
      ]}
      layout={{
        title: "Glucose vs. Employment Rate by Diabetes Outcome",
        xaxis: { title: "Employment Count" },
        yaxis: { title: "Glucose Level" },
        height: 500,
      }}
    />
  );
};

export default ScatterPlotEmployment;
