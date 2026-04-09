import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, X } from 'lucide-react';
import api from '../utils/api';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../utils/translations';

const MembershipPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const { language } = useLanguage();
  const t = translations[language];

  const [formData, setFormData] = useState({
    name: '',
    type: 'yearly',
    price: '',
    description: '',
    benefits: ''
  });

  const fetchPlans = async () => {
    try {
      const res = await api.get('/admin/membership-plans');
      setPlans(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      benefits: formData.benefits.split('\n').filter(b => b.trim() !== '')
    };

    try {
      if (editingPlan) {
        await api.put(`/admin/membership-plans/${editingPlan.id}`, data);
      } else {
        await api.post('/admin/membership-plans', data);
      }
      setModalOpen(false);
      setEditingPlan(null);
      setFormData({ name: '', type: 'yearly', price: '', description: '', benefits: '' });
      fetchPlans();
    } catch (err) {
      alert("Error saving plan");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      try {
        await api.delete(`/admin/membership-plans/${id}`);
        fetchPlans();
      } catch (err) {
        alert("Error deleting plan");
      }
    }
  };

  const openEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      type: plan.type,
      price: plan.price,
      description: plan.description || '',
      benefits: (plan.benefits || []).join('\n')
    });
    setModalOpen(true);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-[#4D2D0E] tracking-tight">{t.membershipPlans}</h1>
          <p className="text-gray-500">Manage subscription tiers and pricing</p>
        </div>
        <button 
          onClick={() => { setEditingPlan(null); setFormData({ name: '', type: 'yearly', price: '', description: '', benefits: '' }); setModalOpen(true); }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} /> Add New Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
               <ShieldCheck size={100} className={plan.type === 'yearly' ? 'text-blue-500' : 'text-[#FF9933]'} />
            </div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${plan.type === 'yearly' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-[#FF9933]'}`}>
                  {plan.type}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(plan)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(plan.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>

              <h3 className="text-2xl font-black text-gray-800 mb-1">{plan.name}</h3>
              <div className="text-3xl font-black text-[#FF9933] mb-4">₹{plan.price.toLocaleString()}</div>
              
              <div className="space-y-3 mb-8">
                {plan.benefits.slice(0, 3).map((b, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600 font-bold">
                    <CheckCircle2 size={14} className="text-green-500" /> {b}
                  </div>
                ))}
                {plan.benefits.length > 3 && <p className="text-xs text-gray-400">+{plan.benefits.length - 3} more benefits</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-lg p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-[#4D2D0E] uppercase tracking-tighter">
                {editingPlan ? 'Edit Membership Plan' : 'Create New Plan'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Plan Name</label>
                  <input 
                    required 
                    className="input-field" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Type</label>
                  <select 
                    className="input-field appearance-none"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="yearly">Yearly</option>
                    <option value="lifetime">Lifetime</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Price (₹)</label>
                <input 
                  type="number" 
                  required 
                  className="input-field" 
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="2100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Benefits (One per line)</label>
                <textarea 
                  rows={4}
                  className="input-field py-4" 
                  value={formData.benefits}
                  onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                  placeholder="Monthly Updates&#10;VIP Invitations&#10;Certificate"
                />
              </div>

              <button type="submit" className="w-full btn-primary py-5 text-lg shadow-xl shadow-orange-500/20">
                {editingPlan ? 'Update Plan' : 'Create Plan'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const ShieldCheck = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export default MembershipPlans;
