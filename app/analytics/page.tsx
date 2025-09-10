"use client";

import React from "react";
import { Bar, Pie, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from "chart.js";
import { Download } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
);

export default function AnalyticsPage(): JSX.Element {
  // Example Data
  const diseaseTrends = {
    labels: ["Diabetes", "Hypertension", "Obesity", "Arthritis", "Asthma"],
    datasets: [
      {
        label: "Cases",
        data: [120, 90, 60, 45, 30],
        backgroundColor: "rgba(34,197,94,0.6)", // Tailwind green-500
      },
    ],
  };

  const demographics = {
    labels: ["Male", "Female", "Other"],
    datasets: [
      {
        label: "Patients",
        data: [200, 250, 20],
        backgroundColor: ["#10B981", "#3B82F6", "#F59E0B"], // green, blue, amber
      },
    ],
  };

  const ageDistribution = {
    labels: ["0-18", "19-35", "36-50", "51+"],
    datasets: [
      {
        label: "Patients",
        data: [50, 180, 120, 70],
        backgroundColor: "rgba(59,130,246,0.6)", // Tailwind blue-500
      },
    ],
  };

  const insuranceClaims = {
    labels: ["Approved", "Rejected", "Pending"],
    datasets: [
      {
        label: "Claims",
        data: [150, 40, 30],
        backgroundColor: ["#10B981", "#EF4444", "#F59E0B"], // green, red, amber
      },
    ],
  };

  const encountersOverTime = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Encounters",
        data: [30, 45, 60, 50, 80, 70],
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59,130,246,0.3)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-8 text-green-700">
        📊 Analytics Dashboard
      </h1>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-gray-600">Total Patients</h2>
          <p className="text-3xl font-bold text-green-600">470</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-gray-600">
            Total Encounters
          </h2>
          <p className="text-3xl font-bold text-blue-600">335</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-gray-600">Claims Approved</h2>
          <p className="text-3xl font-bold text-green-700">150</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-gray-600">Morbidity Reports</h2>
          <p className="text-3xl font-bold text-amber-600">25</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Disease Trends */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Disease Trends (Top 5)
          </h2>
          <Bar data={diseaseTrends} />
        </div>

        {/* Demographics */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Patient Demographics
          </h2>
          <Pie data={demographics} />
        </div>

        {/* Age Distribution */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Age Distribution
          </h2>
          <Bar data={ageDistribution} />
        </div>

        {/* Insurance Claims */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Insurance Claims
          </h2>
          <Doughnut data={insuranceClaims} />
        </div>

        {/* Encounters Over Time */}
        <div className="bg-white p-6 rounded-xl shadow lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Encounters Over Time
          </h2>
          <Line data={encountersOverTime} />
        </div>
      </div>

      {/* Export Section */}
      <div className="mt-10 flex justify-end">
        <button className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700 transition">
          <Download size={18} /> Export CSV
        </button>
      </div>
    </div>
  );
}
