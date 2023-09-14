import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import {ISolutionDTO } from "../interfaces/solutions";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear"; // for week support

dayjs.extend(weekOfYear); // extend dayjs to support weeks

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
      position: "top" as const,
    },
  },
};

interface ISolutionsChart {
  solutions: ISolutionDTO[];
  granularity: "day" | "week" | "month";
  maxPoints?: number; // New prop
}

const SolutionsChart = ({
  solutions,
  granularity,
  maxPoints = Infinity,
}: ISolutionsChart) => {
  const solutionCounts: { [label: string]: number } = {};

  solutions.forEach((solution) => {
    let label;

    switch (granularity) {
      case "day":
        label = dayjs(solution.submissionDate).format("DD MMM YY");
        break;
      case "week":
        label =
          "W" +
          dayjs(solution.submissionDate).week() +
          " '" +
          dayjs(solution.submissionDate).format("YY");
        break;

      default:
        label = dayjs(solution.submissionDate).format("MMM YY");
        break;
    }

    if (!solutionCounts[label]) {
      solutionCounts[label] = 0;
    }

    solutionCounts[label]++;
  });

  const sortedEntries = Object.entries(solutionCounts)
    .sort(([labelA], [labelB]) => {
      if (granularity === "week") {
        const [weekA, yearA] = labelA.split(" '").map((part, index) => {
          // If it's the week part, remove the "W", otherwise parse year directly
          return index === 0 ? parseInt(part.slice(1)) : parseInt(part);
        });

        const [weekB, yearB] = labelB.split(" '").map((part, index) => {
          return index === 0 ? parseInt(part.slice(1)) : parseInt(part);
        });

        if (yearA !== yearB) {
          return yearA - yearB;
        }
        return weekA - weekB;
      } else {
        return dayjs(labelA).valueOf() - dayjs(labelB).valueOf();
      }
    })
    .slice(-maxPoints);

  const sortedLabels = Object.fromEntries(sortedEntries);

  const data = {
    labels: Object.keys(sortedLabels),
    datasets: [
      {
        label: "Submissions",
        data: Object.values(sortedLabels),
        borderColor: "#ff9b35",
        backgroundColor: "#ff9b35",
        tension: 0.4,
      },
    ],
  };

  return <Line options={options} data={data} />;
};

export default SolutionsChart;
