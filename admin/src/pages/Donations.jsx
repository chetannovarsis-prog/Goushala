import React, { useState, useEffect } from 'react';
import { Download, Filter, Search, MoreVertical } from 'lucide-react';
import api from '../utils/api';
import { useLanguage } from '../context/LanguageContext';
import { translations as allTranslations } from '../utils/translations';

const Donations = () => {
  const { language } = useLanguage();
  const t = allTranslations[language];
  const [donations, setDonations] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await api.get('/donations');
        setDonations(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDonations();
  }, []);

  const filtered = filter === 'all' ? donations : donations.filter(d => d.type.includes(filter));

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
                <tr key={d.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-8 py-6">
                    <div className="font-black text-gray-700">{d.name}</div>
                    <div className="text-xs text-gray-400 flex items-center gap-2 mt-1">
                      <span className="bg-orange-50 text-[#FF9933] px-2 py-0.5 rounded uppercase font-bold">{d.whatsapp}</span>
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
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"><MoreVertical size={20} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Donations;
