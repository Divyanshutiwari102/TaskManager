import { useEffect, useState } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar';

const statusColors = {
  TODO: 'bg-yellow-100 text-yellow-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  DONE: 'bg-green-100 text-green-700',
};

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  const fetchTasks = () => {
    API.get('/tasks/my')
      .then(res => setTasks(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTasks(); }, []);

  const updateStatus = async (taskId, status) => {
    try {
      await API.patch(`/tasks/${taskId}/status?status=${status}`);
      fetchTasks();
    } catch (err) {
      alert('Failed to update');
    }
  };

  const filtered = filter === 'ALL' ? tasks : tasks.filter(t => t.status === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Tasks</h1>
        <p className="text-gray-500 text-sm mb-6">{tasks.length} task(s) assigned to you</p>

        <div className="flex gap-2 mb-6">
          {['ALL', 'TODO', 'IN_PROGRESS', 'DONE'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition ${filter === s ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No tasks found.</div>
        ) : (
          <div className="space-y-3">
            {filtered.map(task => (
              <div key={task.id} className={`bg-white rounded-xl p-5 shadow-sm border ${task.overdue ? 'border-red-200' : 'border-transparent'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{task.title}</h3>
                      {task.overdue && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Overdue</span>}
                    </div>
                    <p className="text-gray-500 text-sm mt-1">{task.description}</p>
                    <div className="flex gap-3 mt-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[task.status]}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                      {task.dueDate && <span className="text-xs text-gray-400">📅 {task.dueDate}</span>}
                    </div>
                  </div>
                  <select
                    value={task.status}
                    onChange={e => updateStatus(task.id, e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                  >
                    <option value="TODO">TODO</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="DONE">DONE</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
