import React, { useState, useEffect } from 'react';
import { Check, X, Phone, MapPin, Loader2, BookOpen } from 'lucide-react';
import api from '../utils/api';
import { useLanguage } from '../context/LanguageContext';
import { translations as allTranslations } from '../utils/translations';

const Gurukul = () => {
  const { language } = useLanguage();
  const t = allTranslations[language];
  const [apps, setApps] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    const res = await api.get('/gurukul');
    setApps(res.data);
  };

  const updateStatus = async (id, status) => {
    setLoadingId(id);
    try {
      await api.put(`/gurukul/${id}/status`, { status });
      fetchApps();
    } catch (err) {
      alert('Failed to update status');
    }
    setLoadingId(null);
  };

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-4xl font-black text-gray-800 tracking-tighter uppercase">{t.gurukulPage.title}</h2>
        <p className="text-gray-400 font-medium">{t.gurukulPage.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {apps.map((app) => (
          <div key={app.id} className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col xl:flex-row justify-between gap-10 hover:shadow-xl transition-all duration-300">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-5 flex-wrap">
                <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center text-[#FF9933]">
                  <BookOpen size={40} />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-gray-800 tracking-tight">{app.studentName}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm font-black text-gray-400 uppercase tracking-widest">{t.gurukulPage.age}: {app.age}</span>
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${app.status === 'pending' ? 'bg-yellow-50 text-yellow-600' : app.status === 'approved' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {app.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100/50">
                  <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2">{t.gurukulPage.guardian}</div>
                  <p className="text-lg font-bold text-gray-700">{app.parentName}</p>
                  <p className="flex items-center gap-2 text-gray-500 font-medium mt-1"><Phone size={14} className="text-[#FF9933]" /> {app.phone}</p>
                </div>
                <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100/50">
                  <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2">{t.gurukulPage.residency}</div>
                  <p className="flex items-center gap-2 text-gray-500 font-medium mt-1"><MapPin size={14} className="text-[#FF9933]" /> {app.address}</p>
                </div>
              </div>

              <div className="bg-orange-50/30 p-6 rounded-2xl border-l-8 border-[#FF9933]">
                <div className="text-[10px] font-black text-[#FF9933] uppercase tracking-widest mb-2">{t.gurukulPage.education}</div>
                <p className="text-gray-700 font-bold leading-relaxed">{app.education}</p>
              </div>
            </div>

            {app.status === 'pending' && (
              <div className="flex xl:flex-col items-center justify-center gap-4 border-l border-gray-100 xl:pl-10">
                <button 
                  disabled={loadingId === app.id}
                  onClick={() => updateStatus(app.id, 'approved')}
                  className="w-full xl:w-48 bg-green-600 text-white px-8 py-5 rounded-[2rem] font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg shadow-green-100 flex items-center justify-center gap-2"
                >
                  {loadingId === app.id ? <Loader2 className="animate-spin" /> : <Check size={20} strokeWidth={3} />} {t.gurukulPage.approve}
                </button>
                <button 
                  disabled={loadingId === app.id}
                  onClick={() => updateStatus(app.id, 'rejected')}
                  className="w-full xl:w-48 bg-gray-50 text-gray-400 px-8 py-5 rounded-[2rem] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center gap-2"
                >
                   <X size={20} strokeWidth={3} /> {t.gurukulPage.reject}
                </button>
              </div>
            )}
            
            {app.status !== 'pending' && (
              <div className="flex items-center justify-center xl:min-w-[200px]">
                <div className="text-center">
                  <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">{t.gurukulPage.decisionLocked}</div>
                  <div className={`text-xl font-black uppercase ${app.status === 'approved' ? 'text-green-600' : 'text-red-400'}`}>{app.status}</div>
                </div>
              </div>
            )}
          </div>
        ))}
        {apps.length === 0 && <div className="text-center py-32 bg-white rounded-[3rem] text-gray-300 font-bold uppercase tracking-widest border border-dashed border-gray-200">{t.gurukulPage.noApps}</div>}
      </div>
    </div>
  );
};

export default Gurukul;
