import { useLanguage } from '../context/LanguageContext';
import { translations as allTranslations } from '../utils/translations';
import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Plus, ArrowUpRight, ArrowDownRight, IndianRupee, Filter, X, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';

const Accounting = () => {
  const { language } = useLanguage();
  const t = allTranslations[language].accountingPage;
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ 
    type: 'pay-in', 
    amount: '', 
    transaction_type: 'donation',
    category: '',
    payment_mode: 'cash',
    reference_id: '',
    user_id: '',
    description: '', 
    attachment_url: '',
    recurring: 'none',
    date: new Date().toISOString().split('T')[0] 
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTx();
  }, []);

  const fetchTx = async () => {
    const res = await api.get('/admin/transactions');
    setTransactions(res.data);
  };

  const totals = transactions.reduce((acc, curr) => {
    if (curr.type === 'pay-in') acc.inc += curr.amount;
    else acc.exp += curr.amount;
    return acc;
  }, { inc: 0, exp: 0 });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/admin/transactions', formData);
      setShowModal(false);
      fetchTx();
    } catch (err) {
      alert('Failed to save transaction');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-gray-800 tracking-tighter uppercase">{t.header}</h2>
          <p className="text-gray-400 font-medium">{t.sub}</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-3 py-4 px-6 rounded-2xl shadow-xl ring-4 ring-orange-50">
          <Plus size={24} strokeWidth={3}/> <span className="text-lg">{t.newEntry}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm group hover:ring-2 ring-green-100 transition-all">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">{t.payIn}</p>
          <div className="text-4xl font-black text-green-600 flex items-center gap-3">
             <div className="bg-green-50 p-2 rounded-xl"><ArrowUpRight /></div>
             ₹{totals.inc.toLocaleString()}
          </div>
        </div>
        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm group hover:ring-2 ring-red-100 transition-all">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">{t.payOut}</p>
          <div className="text-4xl font-black text-red-500 flex items-center gap-3">
             <div className="bg-red-50 p-2 rounded-xl"><ArrowDownRight /></div>
             ₹{totals.exp.toLocaleString()}
          </div>
        </div>
        <div className="bg-[#4D2D0E] p-10 rounded-[3.5rem] shadow-2xl text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF9933]/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
          <p className="text-[10px] font-black text-[#FF9933] uppercase tracking-widest mb-4 relative z-10">{t.netBalance}</p>
          <div className="text-4xl font-black text-[#FF9933] flex items-center gap-3 relative z-10">
             <IndianRupee size={40} className="text-white/20" /> ₹{(totals.inc - totals.exp).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 flex justify-between items-center border-b border-gray-50 bg-gray-50/20">
           <h3 className="text-base font-black text-gray-700 uppercase tracking-widest">{t.history}</h3>
           <button className="text-gray-400 hover:text-gray-600"><Filter /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-10 py-6">{t.ledgerDate}</th>
                <th className="px-10 py-6">{t.transactionType}</th>
                <th className="px-10 py-6">{t.narration}</th>
                <th className="px-10 py-6">{t.paymentMode}</th>
                <th className="px-10 py-6 text-right">{t.value} (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {transactions.map(tx => (
                 <tr key={tx.id} className="hover:bg-gray-50/30 transition-all duration-300">
                   <td className="px-10 py-8 text-sm text-gray-400 font-bold tracking-widest uppercase">{new Date(tx.date).toLocaleDateString()}</td>
                   <td className="px-10 py-8">
                     <span className="bg-gray-100 px-3 py-1 rounded-full text-[10px] font-black uppercase text-gray-500">
                        {t.types[tx.transaction_type] || tx.transaction_type}
                     </span>
                   </td>
                   <td className="px-10 py-8 font-black text-gray-700 tracking-tight text-lg">{tx.description}</td>
                   <td className="px-10 py-8 font-bold text-gray-400 uppercase text-xs">{t.modes[tx.payment_mode] || tx.payment_mode}</td>
                   <td className="px-10 py-8 text-right">
                     <span className={`text-2xl font-black ${tx.type === 'pay-in' ? 'text-green-600' : 'text-red-400'}`}>
                       {tx.type === 'pay-in' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                     </span>
                   </td>
                 </tr>
               ))}
               {transactions.length === 0 && (
                 <tr>
                   <td colSpan="5" className="p-20 text-center text-gray-200 font-black uppercase tracking-widest">
                     Empty Ledger
                   </td>
                 </tr>
               )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#4D2D0E]/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl p-12 rounded-[3.5rem] shadow-2xl relative shadow-orange-900/10 my-auto">
            <button onClick={() => setShowModal(false)} className="absolute top-10 right-10 text-gray-300 hover:text-gray-600 transition-colors"><X size={32} /></button>
            <h3 className="text-3xl font-black text-gray-800 tracking-tighter uppercase mb-2">{t.bookEntry}</h3>
            <p className="text-gray-400 font-medium mb-10">{t.recordMovement}</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                     <div className={`cursor-pointer p-6 rounded-3xl border-4 transition-all text-center ${formData.type === 'pay-in' ? 'bg-green-50 border-green-500 scale-105' : 'bg-gray-50 border-transparent text-gray-400'}`} onClick={() => setFormData({...formData, type: 'pay-in'})}>
                        <TrendingUp className="mx-auto mb-2" />
                        <div className="text-xs font-black uppercase tracking-widest">Pay-In</div>
                     </div>
                     <div className={`cursor-pointer p-6 rounded-3xl border-4 transition-all text-center ${formData.type === 'pay-out' ? 'bg-red-50 border-red-500 scale-105' : 'bg-gray-50 border-transparent text-gray-400'}`} onClick={() => setFormData({...formData, type: 'pay-out'})}>
                        <TrendingDown className="mx-auto mb-2" />
                        <div className="text-xs font-black uppercase tracking-widest">Pay-Out</div>
                     </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">{t.amount}</label>
                    <input type="number" placeholder="₹ 0.00" className="input-field py-5 text-2xl font-black text-center" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required/>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">{t.transactionType}</label>
                    <select className="input-field py-4 font-bold" value={formData.transaction_type} onChange={e => setFormData({...formData, transaction_type: e.target.value})}>
                       <option value="donation">{t.types.donation}</option>
                       <option value="membership">{t.types.membership}</option>
                       <option value="cow_purchase">{t.types.cow_purchase}</option>
                       <option value="cow_feed">{t.types.cow_feed}</option>
                       <option value="medical">{t.types.medical}</option>
                       <option value="salary">{t.types.salary}</option>
                       <option value="maintenance">{t.types.maintenance}</option>
                       <option value="bhandara">{t.types.bhandara}</option>
                       <option value="other">{t.types.other}</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">{t.paymentMode}</label>
                    <select className="input-field py-4 font-bold" value={formData.payment_mode} onChange={e => setFormData({...formData, payment_mode: e.target.value})}>
                       <option value="cash">{t.modes.cash}</option>
                       <option value="upi">{t.modes.upi}</option>
                       <option value="bank">{t.modes.bank}</option>
                       <option value="cheque">{t.modes.cheque}</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">{t.referenceId}</label>
                    <input placeholder="TXN1234567" className="input-field py-4 font-bold" value={formData.reference_id} onChange={e => setFormData({...formData, reference_id: e.target.value})} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">{t.date}</label>
                    <input type="date" className="input-field py-4 font-bold px-5" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required/>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">{t.description}</label>
                <textarea placeholder={t.narration} className="input-field py-4 text-lg font-bold min-h-[100px]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required/>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6">
                <button type="button" onClick={() => setShowModal(false)} className="py-5 font-black text-gray-400 uppercase bg-gray-100 rounded-2xl tracking-widest">{t.discard}</button>
                <button type="submit" disabled={loading} className="py-5 btn-primary text-xl flex items-center justify-center gap-2">
                   {loading ? <Loader2 className="animate-spin" /> : t.commit}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounting;
