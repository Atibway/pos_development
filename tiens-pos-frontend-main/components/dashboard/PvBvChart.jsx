import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

function PvBvChart({ stockData }) {
  const labels = stockData.map((stock) => stock.name)
  const pvData = stockData.map((stock) => stock.pv || 0)
  const bvData = stockData.map((stock) => stock.bv || 0)

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "PV",
        data: pvData,
        backgroundColor: "rgba(75, 192, 192, 0.7)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "BV",
        data: bvData,
        backgroundColor: "rgba(153, 102, 255, 0.7)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
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
        usePointStyle: true,
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || ""
            if (label) {
              label += ": "
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat().format(context.parsed.y)
            }
            return label
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
          },
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          font: {
            size: 10,
          },
        },
        beginAtZero: true,
      },
    },
  }

  if (!stockData || stockData.length === 0 || (pvData.every((val) => val === 0) && bvData.every((val) => val === 0))) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No PV/BV data available for top products.</p>
      </div>
    )
  }

  return (
    <div className="h-full">
      <Bar data={chartData} options={options} />
    </div>
  )
}

export default PvBvChart
