import React, { useState, useEffect } from 'react';
import { Utensils, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useLanguage } from '../context/LanguageContext';
import { translations, getTranslation } from '../utils/translations';
import TaxExemptionSection from '../components/TaxExemptionSection';

const Bhandara = () => {
  const { language } = useLanguage();
  const t = getTranslation(language, 'bhandara');
  const [categories, setCategories] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    whatsapp: '',
    email: '',
    referral: '',
    profession: '',
    require80G: false,
    address: '',
    pan: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/admin/bhandara');
        setCategories(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!selectedPlan) {
      alert(language === 'en' ? "Please select a plan!" : "कृपया एक योजना चुनें!");
      return;
    }
    if (!formData.whatsapp) {
      alert(language === 'en' ? "WhatsApp number is required!" : "व्हाट्सएप नंबर आवश्यक है!");
      return;
    }

    setLoading(true);
    try {
      const orderRes = await api.post('/donations/create-order', {
        ...formData,
        amount: selectedPlan.price,
        type: `bhandara (${selectedPlan.peopleCount} persons)`,
        quantity: 1
      });

      const { order, donationId } = orderRes.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Gaushala Bhandara",
        description: `Feed ${selectedPlan.peopleCount} people`,
        order_id: order.id,
        handler: async (response) => {
          await api.post('/donations/verify-payment', { ...response, donationId });
          navigate('/success', { state: { donation: { ...formData, amount: selectedPlan.price, type: 'bhandara', id: donationId } } });
        },
        prefill: { name: formData.name, email: formData.email, contact: formData.phone },
        theme: { color: "#FF9933" }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (err) {
      alert(language === 'en' ? "Error initiating payment" : "भुगतान शुरू करने में त्रुटि");
    }
    setLoading(false);
  };

  return (
    <div className="py-16 bg-[#EDDDC7]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16 px-4">
          <h1 className="text-4xl md:text-5xl font-semibold text-[#4D2D0E] mb-6">{t.title}</h1>
          <div className="flex justify-center gap-2 mb-8">
            <div className="w-20 h-1 bg-[#FF9933]"></div>
            <div className="w-10 h-1 bg-[#2E7D32]"></div>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: Plans */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => setSelectedPlan(cat)}
                className={`card p-8 cursor-pointer transition-all border-4 relative overflow-hidden group ${selectedPlan?.id === cat.id ? 'border-[#FF9933] scale-105 shadow-orange-200' : 'border-transparent opacity-80 hover:opacity-100 hover:bg-orange-100/50'}`}
              >
                {selectedPlan?.id === cat.id && (
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                    <Utensils size={100} />
                  </div>
                )}
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-orange-100 p-3 rounded-2xl shadow-sm text-[#FF9933]">
                    <Users className="w-8 h-8" />
                  </div>
                  <div className="text-3xl font-bold text-[#4D2D0E]">₹{cat.price.toLocaleString()}</div>
                </div>
                <h3 className="text-2xl font-bold mb-2">{cat.title}</h3>
                <p className="text-gray-600 mb-4">
                  {language === 'en' ? `Perfect for feeding approximately ${cat.peopleCount} persons.` : `लगभग ${cat.peopleCount} व्यक्तियों को खिलाने के लिए उत्तम।`}
                </p>
                <button className={`w-full py-4 rounded-full border  border-[#FF9933] font-bold text-md transition-all shadow-md ${selectedPlan?.id === cat.id ? 'bg-[#FF9933] text-white' : 'bg-white text-gray-400 group-hover:text-orange-400 hover:bg-orange-50 hover:shadow-xl hover:shadow-orange-300 hover:cursor-pointer  '}`}>
                  {selectedPlan?.id === cat.id ? (language === 'en' ? 'Verified Plan' : 'सत्यापित योजना') : (language === 'en' ? 'Select Service' : 'सेवा चुनें')}
                </button>
                <div className={`mt-4 flex gap-1 transition-all duration-300 ${selectedPlan?.id === cat.id ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="w-full h-1 bg-orange-500 rounded-full"></div>
                  <div className="w-8 h-1 bg-green-600 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Form */}
          <div className="bg-white p-8 rounded-3xl shadow-xl h-fit sticky top-24">
            <h3 className="text-2xl font-black text-gray-800 tracking-tighter uppercase mb-8 flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-xl text-[#2E7D32]"><Utensils size={24} /></div> 
              {language === 'en' ? 'Donor Details' : 'दाता विवरण'}
            </h3>
            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <label className="block font-bold text-sm mb-1">{language === 'en' ? 'Donor Name' : 'दाता का नाम'}</label>
                <input type="text" name="name" required className="input-field" onChange={handleInputChange} />
              </div>
              <div>
                <label className="block font-bold text-sm mb-1">{language === 'en' ? 'WhatsApp Number' : 'व्हाट्सएप नंबर'}</label>
                <input type="tel" name="whatsapp" required className="input-field" onChange={handleInputChange} />
              </div>
              <div>
                <label className="block font-bold text-sm mb-1">{language === 'en' ? 'Phone Number' : 'फ़ोन नंबर'}</label>
                <input type="tel" name="phone" required className="input-field" onChange={handleInputChange} />
              </div>
              <div>
                <label className="block font-bold text-sm mb-1">{language === 'en' ? 'Email' : 'ईमेल'}</label>
                <input type="email" name="email" required className="input-field" onChange={handleInputChange} />
              </div>

              <div>
                <label className="block font-bold text-sm mb-1">{getTranslation(language, 'membership.profession')}</label>
                <input type="text" name="profession" className="input-field" onChange={handleInputChange} placeholder="e.g., Teacher, MLA, IAS" />
              </div>

              <div>
                <label className="block font-bold text-sm mb-1">{getTranslation(language, 'membership.referral')}</label>
                <input type="text" name="referral" className="input-field" onChange={handleInputChange} placeholder="Name of person who referred you" />
              </div>

              <TaxExemptionSection 
                formData={formData} 
                handleInputChange={handleInputChange} 
                setFormData={setFormData} 
              />

              {selectedPlan && (
                <div className="mt-8 pt-6 border-t">
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-bold">{language === 'en' ? 'Total:' : 'कुल:'}</span>
                    <span className="text-2xl font-bold text-[#FF9933]">₹{selectedPlan.price}</span>
                  </div>
                  <button
                    disabled={loading}
                    className="w-full btn-primary py-4"
                  >
                    {loading ? (language === 'en' ? 'Redirecting...' : 'रीडायरेक्ट हो रहा है...') : (language === 'en' ? `Pay ₹${selectedPlan.price}` : `₹${selectedPlan.price} भुगतान करें`)}
                  </button>
                </div>
              )}
              {!selectedPlan && (
                <div className="bg-orange-50 p-4 rounded-lg text-orange-700 text-sm italic">
                  {language === 'en' ? 'Please select a bhandara plan from the left to continue.' : 'जारी रखने के लिए कृपया बाईं ओर से एक भंडारा योजना चुनें।'}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bhandara;
