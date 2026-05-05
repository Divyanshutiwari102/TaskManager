import { useEffect, useState } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar';

const StatCard = ({ label, value, color }) => (
  <div className={`bg-white rounded-xl p-6 shadow-sm border-l-4 ${color}`}>
    <p className="text-sm text-gray-500 font-medium">{label}</p>
    <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
  </div>
);

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/dashboard')
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-500 text-sm mb-8">Overview of all tasks and projects</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard label="Total Tasks" value={data?.totalTasks ?? 0} color="border-indigo-500" />
          <StatCard label="Total Projects" value={data?.totalProjects ?? 0} color="border-purple-500" />
          <StatCard label="To Do" value={data?.todoCount ?? 0} color="border-yellow-400" />
          <StatCard label="In Progress" value={data?.inProgressCount ?? 0} color="border-blue-400" />
          <StatCard label="Done" value={data?.doneCount ?? 0} color="border-green-400" />
          <StatCard label="Overdue" value={data?.overdueCount ?? 0} color="border-red-400" />
        </div>

        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4">Task Status Breakdown</h2>
          <div className="space-y-3">
            {[
              { label: 'Todo', value: data?.todoCount, total: data?.totalTasks, color: 'bg-yellow-400' },
              { label: 'In Progress', value: data?.inProgressCount, total: data?.totalTasks, color: 'bg-blue-400' },
              { label: 'Done', value: data?.doneCount, total: data?.totalTasks, color: 'bg-green-400' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{item.label}</span>
                  <span>{item.value}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full transition-all`}
                    style={{ width: item.total ? `${(item.value / item.total) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
