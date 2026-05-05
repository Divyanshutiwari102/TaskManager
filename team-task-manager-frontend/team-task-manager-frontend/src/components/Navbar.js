import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link to="/dashboard" className="text-xl font-bold text-indigo-600">TaskFlow</Link>
        <Link to="/dashboard" className="text-sm text-gray-600 hover:text-indigo-600">Dashboard</Link>
        <Link to="/projects" className="text-sm text-gray-600 hover:text-indigo-600">Projects</Link>
        <Link to="/tasks" className="text-sm text-gray-600 hover:text-indigo-600">My Tasks</Link>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">
          {user?.role}
        </span>
        <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
          {initials}
        </div>
        <span className="text-sm text-gray-700">{user?.name}</span>
        <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700 ml-2">
          Logout
        </button>
      </div>
    </nav>
  );
}
