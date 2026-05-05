import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const statusColors = {
  TODO: 'bg-yellow-100 text-yellow-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  DONE: 'bg-green-100 text-green-700',
};

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', status: 'TODO', dueDate: '', assignedToId: '' });
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

 const fetchAll = () => {
  API.get(`/projects/${id}`).then(res => setProject(res.data));

  API.get(`/projects/${id}/tasks`)
    .then(res => setTasks(Array.isArray(res.data) ? res.data : []))
    .catch(() => setTasks([]));

  API.get(`/projects/${id}/members`)
    .then(res => {
      // 🔥 FIX (बस यही)
      setMembers(Array.isArray(res.data) ? res.data : []);
    })
    .catch(() => setMembers([]));
};
  useEffect(() => { fetchAll(); }, [id]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.post(`/projects/${id}/tasks`, {
        ...form,
        assignedToId: form.assignedToId || null,
        dueDate: form.dueDate || null,
      });
      setForm({ title: '', description: '', status: 'TODO', dueDate: '', assignedToId: '' });
      setShowForm(false);
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create task');
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await API.patch(`/tasks/${taskId}/status?status=${status}`);
      fetchAll();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await API.delete(`/tasks/${taskId}`);
      fetchAll();
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  const filteredTasks = tasks
    .filter(t => filter === 'ALL' || t.status === filter)
    .filter(t => t.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{project?.name}</h1>
          <p className="text-gray-500 text-sm">{project?.description}</p>
        </div>

        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <input
            placeholder="Search tasks..."
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {['ALL', 'TODO', 'IN_PROGRESS', 'DONE'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition ${filter === s ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
          {user?.role === 'ADMIN' && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="ml-auto bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
            >
              + Add Task
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="bg-white rounded-xl p-6 shadow-sm mb-6 space-y-3">
            <h2 className="font-semibold text-gray-800">New Task</h2>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <input required placeholder="Task title"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <textarea placeholder="Description" rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            <div className="grid grid-cols-3 gap-3">
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="TODO">TODO</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="DONE">DONE</option>
              </select>

<input
  type="date"
  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
  value={form.dueDate}
  onChange={e => setForm({ ...form, dueDate: e.target.value })}
/>

<select
  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
  value={form.assignedToId}
  onChange={e => setForm({ ...form, assignedToId: e.target.value })}
>
  <option value="">Assign to...</option>

  {(Array.isArray(members) ? members : []).map(m => (
    <option key={m.id} value={m.id}>
      {m.name}
    </option>
  ))}

</select>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">Create Task</button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm">Cancel</button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No tasks found.</div>
          ) : filteredTasks.map(task => (
            <div key={task.id} className={`bg-white rounded-xl p-5 shadow-sm border ${task.overdue ? 'border-red-200' : 'border-transparent'}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{task.title}</h3>
                    {task.overdue && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Overdue</span>}
                  </div>
                  <p className="text-gray-500 text-sm">{task.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[task.status]}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                    {task.assignedTo && <span className="text-xs text-gray-400">👤 {task.assignedTo}</span>}
                    {task.dueDate && <span className="text-xs text-gray-400">📅 {task.dueDate}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <select
                    value={task.status}
                    onChange={e => handleStatusChange(task.id, e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                  >
                    <option value="TODO">TODO</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="DONE">DONE</option>
                  </select>
                  {user?.role === 'ADMIN' && (
                    <button onClick={() => handleDelete(task.id)} className="text-red-400 hover:text-red-600 text-xs">✕</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
