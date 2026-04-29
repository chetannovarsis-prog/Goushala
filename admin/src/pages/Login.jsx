import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Lock, Mail, Loader2, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    try {
      const res = await api.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#EDDDC7] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-[#4D2D0E] tracking-tighter">ADMIN ACCESS</h1>
          <p className="text-gray-400 mt-2 font-medium">Gaushala Management Portal</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-bold border border-red-100">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Email Address</label>
            <div className="relative flex items-center">
              {/* <Mail className="absolute left-4 text-gray-300 w-5 h-5 pointer-events-none" /> */}
              <input 
                type="email" 
                required 
                className="input-field pl-12" 
                placeholder="admin@gaushala.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Password</label>
            <div className="relative flex items-center">
              {/* <Lock className="absolute left-4 text-gray-300 w-5 h-5 pointer-events-none" /> */}
              <input 
                type={showPassword ? "text" : "password"} 
                required 
                className="input-field pl-12 pr-12" 
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-gray-300 hover:text-[#FF9933] transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2 shadow-lg shadow-orange-200"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Enter Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
