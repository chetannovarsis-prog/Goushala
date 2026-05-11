import React, { useState, useEffect } from 'react';
import { IndianRupee, Heart, Utensils, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useLanguage } from '../context/LanguageContext';
import { translations as allTranslations } from '../utils/translations';

const Dashboard = () => {
  const { language } = useLanguage();
  const t = allTranslations[language];
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <div className="animate-pulse p-8 bg-white rounded-3xl h-64 flex items-center justify-center text-gray-300 font-bold uppercase tracking-widest">{t.dash.loading}</div>;

  const cards = [
    { name: t.dash.totalDonations, value: `₹${stats.totalDonations.toLocaleString()}`, icon: IndianRupee, color: 'bg-green-50 text-green-600', border: 'border-green-100' },
    { name: t.dash.cowsProtected, value: stats.totalCowsSponsored, icon: Heart, color: 'bg-orange-50 text-[#FF9933]', border: 'border-orange-100' },
    { name: t.dash.bhandaraMeals, value: '2500+', icon: Utensils, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
    { name: t.dash.systemStatus, value: 'Active', icon: TrendingUp, color: 'bg-purple-50 text-purple-600', border: 'border-purple-100' },
  ];

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.name} className={`bg-white p-8 rounded-[2rem] shadow-sm border ${card.border} flex items-center gap-5 hover:shadow-xl transition-all duration-300`}>
            <div className={`${card.color} p-5 rounded-2xl`}>
              <card.icon size={30} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none mb-2">{card.name}</p>
              <h4 className="text-3xl font-black text-gray-800">{card.value}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
          <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter">{t.dash.recentActivities}</h3>
          <Link to="/donations" className="text-[#FF9933] font-bold text-sm bg-orange-50 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-[#FF9933] hover:text-white transition-all">
            {t.dash.fullHistory} <ArrowRight size={16} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-gray-400 text-xs font-black uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">{t.dash.donorEntity}</th>
                <th className="px-8 py-5">{t.dash.serviceCategory}</th>
                <th className="px-8 py-5">{t.dash.financialValue}</th>
                <th className="px-8 py-5">{t.dash.timestamp}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(stats.recentTransactions || []).map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-5 font-bold text-gray-700">{tx.name}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-bold uppercase">{tx.type}</span>
                      <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase ${tx.status === 'success' ? 'bg-green-100 text-green-700' : tx.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {tx.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 font-black text-green-600">₹{tx.amount.toLocaleString()}</td>
                  <td className="px-8 py-5 text-gray-400 text-sm">
                    {new Date(tx.createdAt).toLocaleString(undefined, {
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </td>
                </tr>
              ))}
              {(stats.recentTransactions || []).length === 0 && (
                <tr>
                  <td colSpan="4" className="px-8 py-16 text-center text-gray-200 font-black uppercase tracking-widest">
                    No recent activities
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
