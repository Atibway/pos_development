import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

function DashboardChart({ salesTrend }) {
  console.log("Sales Trend Data in Chart:", salesTrend) // Debugging: Check the data received by the chart

  // Format dates for better display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  // Prepare chart data
  const chartData = {
    labels: salesTrend.map((item) => formatDate(item.date)),
    datasets: [
      {
        label: "Sales Amount",
        data: salesTrend.map((item) => item.total),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        tension: 0.4,
        fill: true, // Fill area under the line
        pointBackgroundColor: "rgb(53, 162, 235)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: "Number of Sales",
        data: salesTrend.map((item) => item.count),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        tension: 0.4,
        fill: false,
        pointBackgroundColor: "rgb(255, 99, 132)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        yAxisID: "y1",
      },
    ],
  }

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
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
              if (context.datasetIndex === 0) {
                label += new Intl.NumberFormat().format(context.parsed.y)
              } else {
                label += context.parsed.y
              }
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
        },
      },
      y: {
        position: "left",
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          font: {
            size: 10,
          },
          callback: (value) => value.toLocaleString(),
        },
        title: {
          display: true,
          text: "Sales Amount",
          font: {
            size: 12,
          },
        },
      },
      y1: {
        position: "right",
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
          },
        },
        
        title: {
          display: true,
          text: "Number of Sales",
          font: {
            size: 12,
          },
        },
      },
    },
  }

  // If no data, show a message
  if (!salesTrend || salesTrend.length === 0 || salesTrend.every((item) => item.total === 0 && item.count === 0)) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No sales data available for the last 7 days.</p>
      </div>
    )
  }

  return (
    <div className="h-full">
      <Line data={chartData} options={options} />
    </div>
  )
}

export default DashboardChart
