import React, { useState } from "react";
import "./index.css";

import BoxPlot from "./charts/BoxPlot";
import Heatmap from "./charts/Heatmap";
import ScatterPlot from "./charts/ScatterPlot";
import BarChartAverageBMI from "./charts/BarChartAverageBMI";
import PieChartIncomeDiabetes from "./charts/PieChartIncomeDiabetes";
import AreaChartCommuteAge from "./charts/AreaChartCommuteAge";
import BubbleChartBMIIncome from "./charts/BubbleChartBMIIncome";
import PairPlotOutcome from "./charts/PairPlotOutcome";
import ScatterPlotEmployment from "./charts/ScatterPlotEmployment";
import ScatterPovertyDiabetesRate from "./charts/ScatterPovertyDiabetesRate";



const App = () => {
  const [activeChart, setActiveChart] = useState("Box Plot");

  const renderChart = () => {
    switch (activeChart) {
      case "Box Plot":
        return <BoxPlot />;
      case "Heatmap":
        return <Heatmap />;
      case "Income vs. Glucose":
        return <ScatterPlot />;
      case "Average BMI by State":
        return <BarChartAverageBMI />;
      case "Diabetes by Income":
        return <PieChartIncomeDiabetes />;
      case "Age vs Commute Time":
        return <AreaChartCommuteAge />;
      case "BMI vs Income (Bubble)":
        return <BubbleChartBMIIncome />;
      case "Glucose, BMI, Age (Pair)":
        return <PairPlotOutcome />;
      case "Glucose vs Employment":
        return <ScatterPlotEmployment />;
      case "Poverty vs Diabetes Rate":
        return <ScatterPovertyDiabetesRate />;
      default:
        return <BoxPlot />;
    }
  };

  const chartTabs = [
    "Box Plot",
    "Heatmap",
    "Income vs. Glucose",
    "Average BMI by State",
    "Diabetes by Income",
    "Age vs Commute Time",
    "BMI vs Income (Bubble)",
    "Glucose, BMI, Age (Pair)",
    "Glucose vs Employment",
    "Poverty vs Diabetes Rate",
  ];

  return (
    <div className="app-container">
      <aside className="sidebar">
        <h2>GROUP 19</h2>
        <nav className="nav-buttons">
          {chartTabs.map((chart) => (
            <button
              key={chart}
              onClick={() => setActiveChart(chart)}
              className={activeChart === chart ? "active" : ""}
            >
              {chart}
            </button>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <h1>{activeChart}</h1>
        <div className="chart-container">{renderChart()}</div>
      </main>
    </div>
  );
};

export default App;
