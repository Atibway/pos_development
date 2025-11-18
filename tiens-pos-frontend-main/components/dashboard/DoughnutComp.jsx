import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"

ChartJS.register(ArcElement, Tooltip, Legend)

function DoughnutComp({ unSettled }) {
  const totalUnsettledAmount = unSettled.reduce((sum, account) => sum + (account.balance || 0), 0)

  const data = {
    labels: unSettled.map((account) => account.customer?.name || "Unknown Customer"),
    datasets: [
      {
        label: "Unsettled Amount",
        data: unSettled.map((account) => account.balance || 0),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#8D6E63",
          "#7B1FA2",
          "#C2185B",
          "#00796B",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#8D6E63",
          "#7B1FA2",
          "#C2185B",
          "#00796B",
        ],
      },
    ],
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
            const percentage =
              totalUnsettledAmount > 0 ? ((value / totalUnsettledAmount) * 100).toFixed(2) + "%" : "0.00%"
            return `${label}: ${value.toLocaleString()} (${percentage})`
          },
        },
      },
    },
  }

  if (!unSettled || unSettled.length === 0 || totalUnsettledAmount === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No unsettled accounts to display.</p>
      </div>
    )
  }

  return (
    <div className="h-full">
      <Doughnut data={data} options={options} />
    </div>
  )
}

export default DoughnutComp
