"use client"

import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { useState } from "react"

ChartJS.register(ArcElement, Tooltip, Legend)

function ClientTypeChart({ clientTypeData }) {
  const [metric, setMetric] = useState("count") // 'count', 'value', 'pv', 'bv'

  const getChartData = () => {
    const data = clientTypeData.map((item) => item[metric])
    const labels = clientTypeData.map((item) => item.name)
    const backgroundColors = [
      "#4CAF50", // Member (Green)
      "#FFC107", // Non-Member (Amber)
      "#2196F3", // Working Client (Blue)
      "#9C27B0", // HP Client (Purple)
    ]

    return {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: backgroundColors.slice(0, labels.length),
          borderColor: "#fff",
          borderWidth: 2,
        },
      ],
    }
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          usePointStyle: true,
          boxWidth: 10,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#333",
        bodyColor: "#666",
        borderColor: "#ddd",
        borderWidth: 1,
        padding: 10,
        boxPadding: 5,
        callbacks: {
          label: (context) => {
            const label = context.label || ""
            const value = context.parsed
            const total = context.dataset.data.reduce((sum, val) => sum + val, 0)
            const percentage = total > 0 ? ((value / total) * 100).toFixed(2) + "%" : "0.00%"
            return `${label}: ${value.toLocaleString()} (${percentage})`
          },
        },
      },
    },
  }

  const totalMetricValue = clientTypeData.reduce((sum, item) => sum + item[metric], 0)

  if (!clientTypeData || clientTypeData.length === 0 || totalMetricValue === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No client type sales data available.</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-center gap-2 mb-4">
        <button
          onClick={() => setMetric("count")}
          className={`px-3 py-1 rounded-md text-sm ${
            metric === "count" ? "bg-primary text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          Count
        </button>
        <button
          onClick={() => setMetric("value")}
          className={`px-3 py-1 rounded-md text-sm ${
            metric === "value" ? "bg-primary text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          Value
        </button>
        <button
          onClick={() => setMetric("pv")}
          className={`px-3 py-1 rounded-md text-sm ${
            metric === "pv" ? "bg-primary text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          PV
        </button>
        <button
          onClick={() => setMetric("bv")}
          className={`px-3 py-1 rounded-md text-sm ${
            metric === "bv" ? "bg-primary text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          BV
        </button>
      </div>
      <div className="flex-1">
        <Doughnut data={getChartData()} options={options} />
      </div>
    </div>
  )
}

export default ClientTypeChart
