import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";

const ScatterPlotEmployment = () => {
  const [glucose, setGlucose] = useState([]);
  const [employment, setEmployment] = useState([]);
  const [color, setColor] = useState([]);
  const [outcomeLabel, setOutcomeLabel] = useState([]);

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/tejvink/Diabetes-and-Demographic-Analysis-Using-Data-Visualization-ML/main/final_merged_dataset.csv"
    )
      .then((res) => res.text())
      .then((csv) => {
        const rows = csv.split("\n").slice(1);
        const g = [],
          e = [],
          c = [],
          o = [];

        rows.forEach((row) => {
          const cols = row.split(",");
          const glucoseVal = parseFloat(cols[1]);   // Glucose
          const employmentVal = parseFloat(cols[9]); // Employment
          const outcome = parseInt(cols[5]);         // Diabetes Outcome

          if (!isNaN(glucoseVal) && !isNaN(employmentVal) && !isNaN(outcome)) {
            g.push(glucoseVal);
            e.push(employmentVal);
            c.push(outcome === 1 ? "red" : "blue");
            o.push(outcome === 1 ? "Diabetic" : "Non-Diabetic");
          }
        });

        setGlucose(g);
        setEmployment(e);
        setColor(c);
        setOutcomeLabel(o);
      });
  }, []);

  return (
    <div>
      <h2>Scatter Plot: Glucose vs Employment Count by Diabetes Status</h2>
      <Plot
        data={[
          {
            x: employment,
            y: glucose,
            mode: "markers",
            type: "scatter",
            marker: { color, size: 8, opacity: 0.7 },
            text: outcomeLabel,
            hoverinfo: 'x+y+text',
          },
        ]}
        layout={{
          title: "Glucose Level vs Employment Count by Diabetes Outcome",
          xaxis: { title: "Employment Count (per state/region)" },
          yaxis: { title: "Glucose Level (mg/dL)" },
          height: 500,
        }}
      />
    </div>
  );
};

export default ScatterPlotEmployment;
