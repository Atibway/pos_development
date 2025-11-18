import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

function BarGraph({ allStock }) {
  // Sort stock by sales count
  const sortedStock = [...allStock]
    .filter((stock) => stock.sales && stock.sales.length > 0)
    .sort((a, b) => b.sales.length - a.sales.length)
    .slice(0, 10)

  // Prepare chart data
  const chartData = {
    labels: sortedStock.map((stock) => stock.name),
    datasets: [
      {
        label: "Sales Count",
        data: sortedStock.map((stock) => stock.sales?.length || 0),
        backgroundColor: "rgba(53, 162, 235, 0.7)",
        borderColor: "rgba(53, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  }

  // Chart options
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
              label += context.parsed.y
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
          stepSize: 1,
        },
        beginAtZero: true,
      },
    },
  }

  // If no data, show a message
  if (sortedStock.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No sales data available</p>
      </div>
    )
  }

  return (
    <div className="h-full">
      <Bar data={chartData} options={options} />
    </div>
  )
}

export default BarGraph
