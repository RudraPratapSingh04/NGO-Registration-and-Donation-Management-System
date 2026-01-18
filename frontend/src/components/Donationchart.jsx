import React, { useState } from 'react';
import { Doughnut, Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Donationchart = ({ dataCounts }) => {
  const [chartType, setChartType] = useState('doughnut'); 

  const chartData = {
    labels: ['Successful', 'Pending', 'Failed'],
    datasets: [
      {
        label: 'Donations',
        data: dataCounts,
        backgroundColor: ['#24a173', '#f59e0b', '#ef4444'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
    },
  };

  const renderChart = () => {
    switch (chartType) {
      case 'pie':
        return <Pie data={chartData} options={chartOptions} />;
      case 'bar':
        return <Bar data={chartData} options={chartOptions} />;
      case 'doughnut':
      default:
        return <Doughnut data={chartData} options={chartOptions} />;
    }
  };

  return (
    <div>
      <div className="flex gap-4 mb-4">
        <button
          className={`px-3 py-1 rounded font-bold ${chartType === 'pie' ? 'bg-[#24a173] text-white' : 'bg-slate-100'}`}
          onClick={() => setChartType('pie')}
        >
          Pie
        </button>
        <button
          className={`px-3 py-1 rounded font-bold ${chartType === 'bar' ? 'bg-[#24a173] text-white' : 'bg-slate-100'}`}
          onClick={() => setChartType('bar')}
        >
          Bar
        </button>
        <button
          className={`px-3 py-1 rounded font-bold ${chartType === 'doughnut' ? 'bg-[#24a173] text-white' : 'bg-slate-100'}`}
          onClick={() => setChartType('doughnut')}
        >
          Doughnut
        </button>
      </div>

      <div className="w-full h-64">
        {renderChart()}
      </div>
    </div>
  );
};

export default Donationchart;
