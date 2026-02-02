import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  labels: string[];
  data: number[];
  backgroundColor?: string[];
  borderColor?: string[];
  borderWidth?: number;
  title?: string;
  height?: string;
}

const defaultColors = [
  '#10b981', // Green
  '#ef4444', // Red
  '#f59e0b', // Orange
  '#3b82f6', // Blue
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#84cc16', // Lime
];

export const DoughnutChart: React.FC<DoughnutChartProps> = ({
  labels,
  data,
  backgroundColor = defaultColors,
  borderColor = Array(defaultColors.length).fill('#ffffff'),
  borderWidth = 3,
  title,
  height = '320px',
}) => {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor,
        borderColor,
        borderWidth,
        hoverOffset: 8,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
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
          usePointStyle: false,
          boxWidth: 40,
          boxHeight: 15,
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
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
      easing: 'easeOutQuart',
    },
  };

  return (
    <div style={{ height }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default DoughnutChart;
