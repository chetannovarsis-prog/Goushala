import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Phone, Calendar, User, Search, MapPin } from 'lucide-react';
import api from '../utils/api';

const Karyakarta = () => {
  const [staff, setStaff] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: '', phone: '', joiningDate: '' });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    const res = await api.get('/admin/karyakartas');
    setStaff(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/karyakartas', formData);
      setShowModal(false);
      setFormData({ name: '', role: '', phone: '', joiningDate: '' });
      fetchStaff();
    } catch (err) {
      alert('Failed to add');
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-gray-800 tracking-tighter uppercase">Karyakarta List</h2>
          <p className="text-gray-400 font-medium">Manage trust volunteers and staff members</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-3 py-4 px-6 rounded-2xl shadow-lg ring-4 ring-orange-100">
          <Plus size={24} strokeWidth={3} /> <span className="text-lg">Add Karyakarta</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {staff.map((k) => (
          <div key={k.id} className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 group hover:shadow-2xl transition-all duration-300">
             <div className="flex gap-6 mb-8">
               <div className="w-20 h-20 bg-orange-50 rounded-[2rem] flex items-center justify-center text-[#FF9933] group-hover:bg-[#FF9933] group-hover:text-white transition-all duration-500">
                 <User size={40} />
               </div>
               <div>
                 <h3 className="text-2xl font-black text-gray-800 tracking-tight">{k.name}</h3>
                 <p className="text-[10px] font-black text-[#FF9933] uppercase tracking-widest mt-1">{k.role}</p>
                 <div className="flex items-center gap-2 text-gray-400 text-xs mt-3"><Calendar size={14} /> <span className="font-bold uppercase tracking-widest">Joined {new Date(k.joiningDate).toLocaleDateString()}</span></div>
               </div>
             </div>
             <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100/50 mb-8">
               <div className="flex items-center gap-3 text-gray-600 font-black tracking-tight"><Phone size={18} className="text-[#FF9933]" /> {k.phone}</div>
             </div>
             <button onClick={() => api.delete(`/admin/karyakartas/${k.id}`).then(fetchStaff)} className="w-full py-4 bg-red-50 text-red-400 rounded-2xl hover:bg-red-600 hover:text-white transition-all duration-300 flex justify-center gap-2 items-center text-sm font-black uppercase tracking-widest border border-red-100">
               <Trash2 size={18} /> Remove Entity
             </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#4D2D0E]/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-10 rounded-[3rem] shadow-2xl relative shadow-orange-900/20">
            <h3 className="text-3xl font-black text-gray-800 tracking-tighter uppercase mb-2">New Registry</h3>
            <p className="text-gray-400 font-medium mb-8">Add a new member to the trust team</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <input placeholder="Member Full Name" className="input-field py-4 font-bold" onChange={e => setFormData({...formData, name: e.target.value})} required/>
              <input placeholder="Official Role (e.g. Manager)" className="input-field py-4 font-bold" onChange={e => setFormData({...formData, role: e.target.value})} required/>
              <input placeholder="Contact Phone Number" className="input-field py-4 font-bold" onChange={e => setFormData({...formData, phone: e.target.value})} required/>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-gray-300 tracking-widest ml-1">Official Joining Date</label>
                <input type="date" className="input-field py-4 font-bold px-5" onChange={e => setFormData({...formData, joiningDate: e.target.value})} required/>
              </div>
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 bg-gray-100 rounded-2xl font-black text-gray-400 tracking-widest uppercase">Discard</button>
                <button type="submit" className="flex-1 py-4 btn-primary text-lg">Confirm Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Karyakarta;
