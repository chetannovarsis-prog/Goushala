import React, { useState, useEffect } from 'react';
import { Download, Filter, Search, MoreVertical, Pencil, Trash2, FileText, X, Loader2 } from 'lucide-react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { translations as allTranslations } from '../utils/translations';

const Donations = () => {
  const { language } = useLanguage();
  const t = allTranslations[language];
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [filter, setFilter] = useState('all');
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [editingDonation, setEditingDonation] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await api.get('/admin/donations');
        setDonations(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDonations();
  }, []);

  const filtered = filter === 'all' ? donations : donations.filter(d => d.type.includes(filter));

  const refresh = async () => {
    const res = await api.get('/admin/donations');
    setDonations(res.data);
  };

  const openReceipt = (donationId) => {
    const apiBase = String(import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
    window.open(`${apiBase}/api/certificates/generate/donation/${donationId}`, '_blank');
  };

  const openEdit = (d) => {
    setMenuOpenId(null);
    setEditingDonation({
      id: d.id,
      name: d.name || '',
      phone: d.phone || '',
      whatsapp: d.whatsapp || '',
      email: d.email || '',
      type: d.type || 'cow',
      quantity: d.quantity ?? 1,
      amount: d.amount ?? 0,
      status: d.status || 'pending',
      require80G: !!d.require80G,
      address: d.address || '',
      pan: d.pan || '',
      referral: d.referral || '',
      profession: d.profession || '',
    });
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!editingDonation?.id) return;
    setSaving(true);
    try {
      await api.put(`/admin/donations/${editingDonation.id}`, editingDonation);
      setEditingDonation(null);
      await refresh();
    } catch (err) {
      alert('Failed to update donation');
    }
    setSaving(false);
  };

  const deleteDonation = async (d) => {
    setMenuOpenId(null);
    const ok = confirm(`Delete donation #${d.id}? This cannot be undone.`);
    if (!ok) return;
    try {
      await api.delete(`/admin/donations/${d.id}`);
      await refresh();
    } catch (err) {
      alert('Failed to delete donation');
    }
  };

  const exportCSV = () => {
    const headers = ['ID', 'Name', 'Phone', 'WhatsApp', 'Email', 'Type', 'Amount', 'Status', 'Date'];
    const rows = filtered.map(d => [d.id, d.name, d.phone, d.whatsapp, d.email, d.type, d.amount, d.status, d.createdAt]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "donations.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 ">{t.donationsPage.title}</h2>
          <p className="text-gray-400 font-medium">{t.donationsPage.subtitle}</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 bg-[#4D2D0E] text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-black transition-all">
          <Download size={20} /> {t.donationsPage.export}
        </button>
      </div>

      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 relative w-full">
          <Search className="absolute right-4 top-4 text-gray-300" size={20} />
          <input type="text" placeholder={t.donationsPage.search} className="input-field pl-12" />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={18} className="text-gray-400" />
          <select 
            className="input-field py-3 min-w-[200px] font-bold"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">{t.donationsPage.all}</option>
            <option value="cow">{t.donationsPage.cow}</option>
            <option value="bhandara">{t.donationsPage.bhandara}</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-xs font-black uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">{t.donationsPage.donorIdentity}</th>
                <th className="px-8 py-5">{t.donationsPage.serviceType}</th>
                <th className="px-8 py-5">{t.donationsPage.financialValue}</th>
                <th className="px-8 py-5">{t.donationsPage.verificationStatus}</th>
                <th className="px-8 py-5">{t.donationsPage.action}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((d) => (
                <tr
                  key={d.id}
                  className="hover:bg-gray-50/30 transition-colors cursor-pointer"
                  onClick={() => navigate(`/donations/${d.id}`)}
                >
                  <td className="px-8 py-6">
                    <div className="font-black text-gray-700">{d.name}</div>
                    <div className="text-xs text-gray-400 flex items-center gap-2 mt-1">
                      {(d.whatsapp || d.phone) ? (
                        <span className="bg-orange-50 text-[#FF9933] px-2 py-0.5 rounded uppercase font-bold">{d.whatsapp || d.phone}</span>
                      ) : (
                        <span className="text-gray-300 font-bold">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${d.type.includes('cow') ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                      {d.type}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-black text-gray-800 text-lg">₹{d.amount.toLocaleString()}</td>
                  <td className="px-8 py-6">
                    <span className={`flex items-center gap-2 w-fit px-3 py-1 rounded-lg text-[10px] font-black uppercase ${d.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${d.status === 'success' ? 'bg-green-600' : 'bg-yellow-600'}`}></div>
                      {d.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpenId(menuOpenId === d.id ? null : d.id);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"
                      >
                        <MoreVertical size={20} />
                      </button>

                      {menuOpenId === d.id && (
                        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 shadow-xl rounded-2xl overflow-hidden z-50">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openReceipt(d.id);
                            }}
                            className="w-full px-4 py-3 text-left text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <FileText size={16} /> View Receipt (PDF)
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEdit(d);
                            }}
                            className="w-full px-4 py-3 text-left text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Pencil size={16} /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteDonation(d);
                            }}
                            className="w-full px-4 py-3 text-left text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 size={16} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingDonation && (
        <div className="fixed inset-0 bg-[#4D2D0E]/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl p-10 rounded-[3.5rem] shadow-2xl relative shadow-orange-900/10 my-auto">
            <button onClick={() => setEditingDonation(null)} className="absolute top-8 right-8 text-gray-300 hover:text-gray-600 transition-colors"><X size={32} /></button>
            <h3 className="text-3xl font-black text-gray-800 tracking-tighter uppercase mb-2">Edit Donation</h3>
            <p className="text-gray-400 font-medium mb-8">Update donation record #{editingDonation.id}.</p>

            <form onSubmit={saveEdit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Name</label>
                  <input className="input-field py-4 font-bold" value={editingDonation.name} onChange={(e) => setEditingDonation({ ...editingDonation, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Email</label>
                  <input className="input-field py-4 font-bold" value={editingDonation.email} onChange={(e) => setEditingDonation({ ...editingDonation, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Phone</label>
                  <input className="input-field py-4 font-bold" value={editingDonation.phone} onChange={(e) => setEditingDonation({ ...editingDonation, phone: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">WhatsApp</label>
                  <input className="input-field py-4 font-bold" value={editingDonation.whatsapp} onChange={(e) => setEditingDonation({ ...editingDonation, whatsapp: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Type</label>
                  <select className="input-field py-4 font-bold" value={editingDonation.type} onChange={(e) => setEditingDonation({ ...editingDonation, type: e.target.value })}>
                    <option value="cow">cow</option>
                    <option value="bhandara">bhandara</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Status</label>
                  <select className="input-field py-4 font-bold" value={editingDonation.status} onChange={(e) => setEditingDonation({ ...editingDonation, status: e.target.value })}>
                    <option value="pending">pending</option>
                    <option value="success">success</option>
                    <option value="failed">failed</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Quantity</label>
                  <input type="number" className="input-field py-4 font-bold" value={editingDonation.quantity} onChange={(e) => setEditingDonation({ ...editingDonation, quantity: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Amount (₹)</label>
                  <input type="number" className="input-field py-4 font-bold" value={editingDonation.amount} onChange={(e) => setEditingDonation({ ...editingDonation, amount: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <button type="button" onClick={() => setEditingDonation(null)} className="py-5 font-black text-gray-400 uppercase bg-gray-100 rounded-2xl tracking-widest">Cancel</button>
                <button type="submit" disabled={saving} className="py-5 btn-primary text-xl flex items-center justify-center gap-2">
                  {saving ? <Loader2 className="animate-spin" /> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Donations;
