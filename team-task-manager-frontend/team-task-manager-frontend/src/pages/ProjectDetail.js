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
  const [members, setMembers] = useState([]); // always array
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'TODO',
    dueDate: '',
    assignedToId: ''
  });
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const fetchAll = () => {
    API.get(`/projects/${id}`)
      .then(res => setProject(res.data))
      .catch(console.error);

    API.get(`/projects/${id}/tasks`)
      .then(res => {
        setTasks(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => setTasks([]));

    API.get(`/projects/${id}/members`)
      .then(res => {
        console.log("MEMBERS API:", res.data);

        // 🔥 FIX
        if (Array.isArray(res.data)) {
          setMembers(res.data);
        } else {
          setMembers([]); // fallback
        }
      })
      .catch(() => setMembers([]));
  };

  useEffect(() => {
    fetchAll();
  }, [id]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.post(`/projects/${id}/tasks`, {
        ...form,
        assignedToId: form.assignedToId || null,
        dueDate: form.dueDate || null,
      });

      setForm({
        title: '',
        description: '',
        status: 'TODO',
        dueDate: '',
        assignedToId: ''
      });

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
    } catch {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await API.delete(`/tasks/${taskId}`);
      fetchAll();
    } catch {
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

        {/* FILTER */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <input
            placeholder="Search tasks..."
            className="border px-3 py-2 text-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          {['ALL', 'TODO', 'IN_PROGRESS', 'DONE'].map(s => (
            <button key={s} onClick={() => setFilter(s)}>
              {s}
            </button>
          ))}

          {user?.role === 'ADMIN' && (
            <button onClick={() => setShowForm(!showForm)}>
              + Add Task
            </button>
          )}
        </div>

        {/* FORM */}
        {showForm && (
          <form onSubmit={handleCreate}>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <input
              placeholder="Task title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />

            {/* ✅ FIXED MEMBERS DROPDOWN */}
            <select
              value={form.assignedToId}
              onChange={e => setForm({ ...form, assignedToId: e.target.value })}
            >
              <option value="">Assign to...</option>

              {Array.isArray(members) && members.length > 0 ? (
                members.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))
              ) : (
                <option disabled>No members</option>
              )}
            </select>

            <button type="submit">Create</button>
          </form>
        )}

        {/* TASKS */}
        {filteredTasks.map(task => (
          <div key={task.id}>
            <h3>{task.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
