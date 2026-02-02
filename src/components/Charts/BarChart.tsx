import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
  }[];
  title?: string;
  height?: string;
}

export const BarChart: React.FC<BarChartProps> = ({
  labels,
  datasets,
  title,
  height = '320px',
}) => {
  const data = {
    labels,
    datasets: datasets.map(ds => ({
      ...ds,
      borderRadius: 6,
      borderSkipped: false,
    })),
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#1e293b',
          font: {
            size: 13,
            weight: 'bold',
            family: 'Inter',
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'rectRounded',
        },
      },
      title: {
        display: !!title,
        text: title,
        color: '#1e293b',
        font: {
          size: 16,
          weight: 'bold',
          family: 'Inter',
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 14,
          family: 'Inter',
        },
        bodyFont: {
          size: 13,
          family: 'Inter',
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#1e293b',
          font: {
            size: 10,
            weight: 'bold',
            family: 'Inter',
          },
          maxRotation: 45,
          minRotation: 0,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      y: {
        ticks: {
          color: '#64748b',
          font: {
            size: 11,
            family: 'Inter',
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        beginAtZero: true,
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  return (
    <div style={{ height }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
