import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Users, IndianRupee, Loader2, X } from 'lucide-react';
import api from '../utils/api';

const Bhandara = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', peopleCount: '', price: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await api.get('/admin/bhandara');
    setCategories(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/admin/bhandara/${editingId}`, formData);
      } else {
        await api.post('/admin/bhandara', formData);
      }
      setShowModal(false);
      setFormData({ title: '', peopleCount: '', price: '' });
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      alert('Operation failed');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this bhandara plan?')) {
      await api.delete(`/admin/bhandara/${id}`);
      fetchCategories();
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-gray-800 tracking-tighter uppercase">Bhandara Packs</h2>
          <p className="text-gray-400 font-medium">Manage community feeding programs and pricing</p>
        </div>
        <button 
           onClick={() => { setShowModal(true); setEditingId(null); setFormData({ title: '', peopleCount: '', price: '' }); }} 
           className="btn-primary flex items-center gap-3 py-4 px-6 rounded-2xl shadow-lg ring-4 ring-orange-50"
        >
          <Plus size={24} strokeWidth={3} /> <span className="text-lg">Add New Pack</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-xl transition-all duration-300 group">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className="bg-orange-50 p-4 rounded-2xl text-[#FF9933] group-hover:bg-[#FF9933] group-hover:text-white transition-colors duration-500">
                   <Users size={32} />
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Service Value</div>
                  <div className="text-3xl font-black text-gray-800">₹{cat.price}</div>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-700 tracking-tight">{cat.title}</h3>
                <p className="text-gray-500 font-bold mt-1 uppercase text-xs tracking-widest">Feeds {cat.peopleCount} Persons</p>
              </div>
            </div>
            <div className="flex gap-3 border-t border-gray-50 mt-8 pt-6">
              <button 
                 onClick={() => { setEditingId(cat.id); setFormData(cat); setShowModal(true); }}
                 className="flex-1 flex justify-center py-4 rounded-2xl bg-gray-50 text-gray-400 hover:bg-[#FF9933] hover:text-white transition-all duration-300"
              >
                <Edit2 size={20} />
              </button>
              <button 
                 onClick={() => handleDelete(cat.id)}
                 className="flex-1 flex justify-center py-4 rounded-2xl bg-red-50 text-red-400 hover:bg-red-600 hover:text-white transition-all duration-300"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#4D2D0E]/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg p-10 rounded-[3rem] shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-gray-300 hover:text-gray-600"><X size={32} /></button>
            
            <div className="mb-10 text-center">
              <h3 className="text-3xl font-black text-gray-800 tracking-tighter uppercase">{editingId ? 'Edit Package' : 'New Pack Registry'}</h3>
              <p className="text-gray-400 font-medium">Fill in the packet details for the public platform</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Package Designation</label>
                <input 
                   required className="input-field text-xl font-bold py-5" 
                   value={formData.title} 
                   onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                   placeholder="e.g. Maha Bhandara"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Capacity (Headcount)</label>
                  <input 
                     type="number" required className="input-field text-xl font-bold py-5" 
                     value={formData.peopleCount} 
                     onChange={(e) => setFormData({ ...formData, peopleCount: e.target.value })} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Valuation (₹)</label>
                  <input 
                     type="number" required className="input-field text-xl font-bold py-5" 
                     value={formData.price} 
                     onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-5 bg-gray-100 rounded-2xl font-black text-gray-400 uppercase tracking-widest">Discard</button>
                <button type="submit" disabled={loading} className="flex-1 py-5 btn-primary text-xl flex items-center justify-center gap-2">
                   {loading ? <Loader2 className="animate-spin" /> : 'Confirm Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bhandara;
