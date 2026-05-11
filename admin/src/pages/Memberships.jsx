import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, Mail, Calendar, Search, Filter, Loader2, Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useLanguage } from '../context/LanguageContext';
import { translations as allTranslations } from '../utils/translations';

const Memberships = () => {
  const { language } = useLanguage();
  const t = allTranslations[language];
  const navigate = useNavigate();
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMemberships();
  }, []);

  const fetchMemberships = async () => {
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/admin/memberships', {
        headers: token && token !== 'undefined' && token !== 'null' ? { Authorization: `Bearer ${token}` } : {}
      });
      if (Array.isArray(res.data)) {
        setMemberships(res.data);
      } else {
        setMemberships([]);
        setError('Unexpected response from server.');
        console.error('Unexpected memberships response:', res.data);
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch memberships';
      setError(message);
      console.error('Failed to fetch memberships:', message, err.response?.data || err);
      setMemberships([]);
    }
    setLoading(false);
  };

  const filteredMembers = memberships.filter(m => {
    const q = searchTerm.toLowerCase();
    const name = (m.name || '').toLowerCase();
    const memberId = (m.memberId || '').toLowerCase();
    const phone = (m.phone || m.whatsapp || '').toLowerCase();
    return (
      String(m.id).includes(searchTerm) ||
      (m.type || '').toLowerCase().includes(q) ||
      name.includes(q) ||
      memberId.includes(q) ||
      phone.includes(q)
    );
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-gray-800 tracking-tighter uppercase">{t.memberships}</h2>
          <p className="text-gray-400 font-medium">Manage and view all active organization members</p>
        </div>
        <div className="flex gap-4">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search members..." 
                className="pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 ring-orange-100 outline-none w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <button className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-gray-400 hover:text-gray-600"><Filter /></button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 rounded-3xl p-6 font-semibold">
          Membership load failed: {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Members</p>
            <p className="text-3xl font-black text-gray-800">{memberships.length}</p>
         </div>
         <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Yearly</p>
            <p className="text-3xl font-black text-blue-600">{memberships.filter(m => m.type === 'yearly').length}</p>
         </div>
         <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Lifetime</p>
            <p className="text-3xl font-black text-purple-600">{memberships.filter(m => m.type === 'lifetime').length}</p>
         </div>
         <div className="bg-[#4D2D0E] p-8 rounded-[2.5rem] shadow-xl text-white">
            <p className="text-[10px] font-black text-[#FF9933] uppercase tracking-widest mb-2">Revenue</p>
            <p className="text-3xl font-black text-[#FF9933]">₹{memberships.reduce((acc, m) => acc + m.planAmount, 0).toLocaleString()}</p>
         </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-10 py-6">Member ID</th>
                <th className="px-10 py-6">Tier</th>
                <th className="px-10 py-6">Status</th>
                <th className="px-10 py-6">Valid Until</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {loading ? (
                 <tr><td colSpan="5" className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-[#FF9933]" size={40} /></td></tr>
               ) : filteredMembers.map(m => (
                 <tr
                   key={m.id}
                   className="hover:bg-gray-50/30 transition-all duration-300 cursor-pointer"
                   onClick={() => navigate(`/memberships/${m.id}`)}
                 >
                   <td className="px-10 py-8">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#FF9933] font-black">#{m.userId}</div>
                        <span className="font-bold text-gray-700">Member #{m.id}</span>
                     </div>
                   </td>
                   <td className="px-10 py-8">
                     <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${m.type === 'lifetime' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                        {m.type}
                     </span>
                   </td>
                   <td className="px-10 py-8">
                     <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                        <ShieldCheck size={16} /> Active
                     </div>
                   </td>
                   <td className="px-10 py-8 text-sm font-bold text-gray-400 uppercase">
                      {m.endDate ? new Date(m.endDate).toLocaleDateString() : 'Infinite'}
                   </td>
                   <td className="px-10 py-8 text-right">
                      <Link onClick={(e) => e.stopPropagation()} to={`/memberships/${m.id}`} className="inline-flex items-center justify-center p-3 bg-gray-100 rounded-xl text-gray-400 hover:text-[#FF9933] hover:bg-orange-50 transition-all">
                        <Pencil size={18} />
                      </Link>
                   </td>
                 </tr>
               ))}
               {!loading && filteredMembers.length === 0 && (
                 <tr><td colSpan="5" className="p-20 text-center text-gray-200 font-black uppercase">No Members Found</td></tr>
               )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Memberships;
