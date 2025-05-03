// AreaChartCommuteAge.js
import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";

const AreaChartCommuteAge = () => {
  const [nonDiabetic, setNonDiabetic] = useState([]);
  const [diabetic, setDiabetic] = useState([]);

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/tejvink/Diabetes-and-Demographic-Analysis-Using-Data-Visualization-ML/main/final_merged_dataset.csv"
    )
      .then((res) => res.text())
      .then((csv) => {
        const rows = csv.split("\n").slice(1).map(row => row.split(","));
        const diabeticData = {};
        const nonDiabeticData = {};

        rows.forEach((cols) => {
          const age = parseInt(cols[4]);
          const commute = parseFloat(cols[8]);
          const outcome = parseInt(cols[5]);

          if (!isNaN(age) && !isNaN(commute)) {
            const group = outcome === 1 ? diabeticData : nonDiabeticData;
            if (!group[age]) group[age] = [];
            group[age].push(commute);
          }
        });

        const formatData = (group) =>
          Object.keys(group)
            .sort((a, b) => parseInt(a) - parseInt(b))
            .map((age) => ({
              age: parseInt(age),
              avgCommute:
                group[age].reduce((a, b) => a + b, 0) / group[age].length,
            }));

        setDiabetic(formatData(diabeticData));
        setNonDiabetic(formatData(nonDiabeticData));
      });
  }, []);

  return (
    <div>
      <h2>Mean Commute vs. Age by Diabetes Outcome</h2>
      <Plot
        data={[
          {
            x: nonDiabetic.map((d) => d.age),
            y: nonDiabetic.map((d) => d.avgCommute),
            fill: "tozeroy",
            name: "Non-Diabetic",
            type: "scatter",
            mode: "lines",
            line: { color: "blue" },
          },
          {
            x: diabetic.map((d) => d.age),
            y: diabetic.map((d) => d.avgCommute),
            fill: "tozeroy",
            name: "Diabetic",
            type: "scatter",
            mode: "lines",
            line: { color: "red" },
          },
        ]}
        layout={{
          title: "Commute Time vs. Age by Diabetes Outcome",
          xaxis: { title: "Patient Age (Years)" },
          yaxis: { title: "Average Commute Time (Minutes)" },
          height: 500,
        }}
      />
    </div>
  );
};

export default AreaChartCommuteAge;
