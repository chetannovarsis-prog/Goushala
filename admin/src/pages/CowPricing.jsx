import React, { useState, useEffect } from 'react';
import { Save, Loader2, IndianRupee } from 'lucide-react';
import api from '../utils/api';

const CowPricing = () => {
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchPrice = async () => {
      const res = await api.get('/admin/cow-price');
      setPrice(res.data.price);
    };
    fetchPrice();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put('/admin/cow-price', { price });
      setMessage('Price updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Failed to update price');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto space-y-10 py-10">
      <div className="text-center">
        <h2 className="text-4xl font-black text-gray-800 tracking-tighter">COW PRICING</h2>
        <p className="text-gray-400 font-medium">Configure annual sponsorship rates</p>
      </div>
      
      <div className="bg-white p-12 rounded-[3rem] shadow-2xl space-y-8 border border-gray-100">
        <div className="space-y-4">
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest text-center">Price Per Cow (Annual)</label>
          <div className="relative group">
            <span className="absolute left-6 top-5 text-4xl font-black text-gray-300 group-focus-within:text-[#FF9933] transition-colors">₹</span>
            <input 
               type="number" 
               className="w-full p-8 pl-16 text-5xl font-black border-4 border-gray-50 rounded-[2rem] focus:border-[#FF9933] focus:outline-none transition-all text-center bg-gray-50/50"
               value={price}
               onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <p className="text-sm text-gray-400 text-center font-medium italic">Live update on public donation page.</p>
        </div>

        {message && <div className="bg-green-50 text-green-600 p-4 rounded-2xl text-center font-bold animate-pulse">{message}</div>}

        <button 
           onClick={handleSave}
           disabled={loading}
           className="w-full btn-primary py-6 text-2xl flex items-center justify-center gap-3 shadow-xl shadow-orange-200"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Save size={28} />} Update Live Rate
        </button>
      </div>

      <div className="bg-orange-50/50 p-8 rounded-[2rem] border-l-8 border-[#FF9933] flex gap-4">
        <div className="bg-[#FF9933] text-white p-2 rounded-lg h-fit"><IndianRupee size={20} /></div>
        <div>
          <h4 className="font-black text-[#4D2D0E] mb-1 uppercase text-xs tracking-widest">Policy Note</h4>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">Changes take effect immediately for all new donors. Recurring sponsors are billed at the rate agreed upon at the start of their cycle.</p>
        </div>
      </div>
    </div>
  );
};

export default CowPricing;
