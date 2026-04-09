import React, { useState } from 'react';
import { ShieldCheck, Calendar, Star, CheckCircle2, ArrowRight, Loader2, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useLanguage } from '../context/LanguageContext';
import { translations, getTranslation } from '../utils/translations';
import TaxExemptionSection from '../components/TaxExemptionSection';

const Membership = () => {
  const { language } = useLanguage();
  const t = getTranslation(language, 'membership');
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
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

  React.useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get('/admin/membership-plans');
        setPlans(res.data);
      } catch (err) {
        console.error("Failed to fetch membership plans", err);
      }
    };
    fetchPlans();
  }, []);

  const yearlyPlans = plans.filter(p => p.type === 'yearly');
  const lifetimePlans = plans.filter(p => p.type === 'lifetime');

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!selectedPlan) return alert("Select a plan!");

    setLoading(true);
    try {
      console.log('Creating order for plan:', selectedPlan);
      const orderRes = await api.post('/membership/create-order', {
        ...formData,
        amount: selectedPlan.price,
        type: selectedPlan.type,
      });

      console.log('Order response:', orderRes.data);
      const { order } = orderRes.data;

      if (!order || !order.id) {
        throw new Error('Invalid order response from server');
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Gaushala Membership",
        description: `${selectedPlan.type.toUpperCase()} Membership - ${selectedPlan.name}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            console.log('Payment successful, verifying:', response);
            const verifyRes = await api.post('/membership/verify-payment', {
              ...response,
              ...formData,
              userId: 0,
              type: selectedPlan.type,
              amount: selectedPlan.price,
              planName: `${selectedPlan.name} (${selectedPlan.type})`
            });

            console.log('Payment verification response:', verifyRes.data);
            navigate('/success', {
              state: {
                membership: {
                  ...formData,
                  amount: selectedPlan.price,
                  type: selectedPlan.type,
                  planName: selectedPlan.name,
                  id: verifyRes.data.membership.id,
                  memberId: verifyRes.data.membership.memberId
                }
              }
            });
          } catch (verifyError) {
            console.error('Payment verification failed:', verifyError);
            alert('Payment was successful but verification failed. Please contact support with your payment ID: ' + response.razorpay_payment_id);
          }
        },
        prefill: { 
          name: formData.name, 
          email: formData.email || '', 
          contact: formData.phone 
        },
        theme: { color: "#FF9933" },
        modal: {
          ondismiss: function() {
            console.log('Payment modal dismissed by user');
            setLoading(false);
          },
          confirm_close: true,
          escape: true
        },
        retry: {
          enabled: false
        }
      };

      console.log('Initializing Razorpay with options:', options);
      const rzp1 = new window.Razorpay(options);
      
      rzp1.on('payment.failed', function (response) {
        console.error('Payment failed:', response);
        alert('Payment failed. Please try again.');
        setLoading(false);
      });

      rzp1.open();
    } catch (err) {
      console.error('Payment initiation error:', err);
      alert("Error initiating payment: " + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  const handleTestPayment = async (e) => {
    e.preventDefault();
    if (!selectedPlan) return alert("Select a plan!");

    // For testing purposes - bypass Razorpay
    try {
      const testResponse = {
        razorpay_payment_id: `test_${Date.now()}`,
        razorpay_order_id: `test_order_${Date.now()}`,
        razorpay_signature: 'test_signature'
      };

      const verifyRes = await api.post('/membership/verify-payment', {
        ...testResponse,
        ...formData,
        userId: 0,
        type: selectedPlan.type,
        amount: selectedPlan.price,
        planName: `${selectedPlan.name} (${selectedPlan.type})`
      });

      navigate('/success', {
        state: {
          membership: {
            ...formData,
            amount: selectedPlan.price,
            type: selectedPlan.type,
            planName: selectedPlan.name,
            id: verifyRes.data.membership.id,
            memberId: verifyRes.data.membership.memberId
          }
        }
      });
    } catch (err) {
      console.error('Test payment failed:', err);
      alert('Test payment failed');
    }
  };
    

  return (
    <div className="bg-[#EDDDC7] min-h-screen pb-20">
      {/* Hero Header */}
      <div className="bg-[#4D2D0E] text-white py-24 text-center px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <img src="/Images/gurukul.png" className="w-full h-full object-cover" alt="" />
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-7xl font-semibold mb-6">{t.title}</h1>
          <p className="text-xl md:text-2xl text-orange-200/80 font-medium">{t.subtitle}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Plans Section */}
          <div className="lg:col-span-2 space-y-12">
            <div>
              <div className="flex items-center ml-1 gap-3 mb-6">
                <div className="p-2 bg-orange-400 rounded-xl shadow-sm text-yellow-100"><Calendar size={24} /></div>
                <h2 className="text-2xl font-bold text-[#4D2D0E]">{t.yearly}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {yearlyPlans.map(plan => (
                  <div key={plan.id} onClick={() => setSelectedPlan(plan)} className={`bg-white group p-8 rounded-[2rem] shadow-xl border-4 transition-all cursor-pointer ${selectedPlan?.id === plan.id ? 'border-[#FF9933] scale-105 shadow-orange-200' : 'border-transparent opacity-80 hover:opacity-100 hover:bg-orange-100 hover:shadow-2xl'}`}>
                    <p className="text-sm font-semibold text-gray-600 mb-2">{plan.name}</p>
                    <p className="text-3xl font-black text-[#4D2D0E]">₹{plan.price.toLocaleString()}</p>
                    <p className="text-xs font-bold text-gray-600 uppercase tracking-tighter">{language === 'en' ? 'per year' : '/ वर्ष'}</p>
                    <div className={`inline-block w-0 h-1 my-1 rounded-full bg-orange-500 group-hover:w-full transition-all duration-300 ${selectedPlan?.id === plan.id ? 'w-full' : ''}`}></div>
                  </div>
                ))}
              </div>
              <div className="mt-6 bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-white/50">
                <p className="text-xs font-black text-[#4D2D0E]/60 uppercase tracking-widest mb-4">{t?.benefits}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {t?.yearlyBenefits?.map((b, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm font-bold text-[#4D2D0E]">
                      <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" /> {b}
                    </div>
                  ))}
                  {(!t?.yearlyBenefits || t.yearlyBenefits.length === 0) && (
                    <p className="text-xs italic text-gray-400 col-span-2">Standard yearly benefits apply.</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6 ml-1">
                <div className="p-2 bg-orange-400 rounded-xl shadow-sm text-yellow-100"><Star size={24} /></div>
                <h2 className="text-2xl font-bold text-[#4D2D0E]">{t.lifetime}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {lifetimePlans.map(plan => (
                  <div key={plan.id} onClick={() => setSelectedPlan(plan)} className={`bg-white p-8 rounded-[2rem] shadow-xl border-4 group transition-all cursor-pointer ${selectedPlan?.id === plan.id ? 'border-[#FF9933] scale-105 shadow-orange-200' : 'border-transparent opacity-80 hover:opacity-100 hover:bg-orange-100 hover:shadow-2xl'}`}>
                    <p className="text-sm font-semibold text-gray-600 mb-2">{plan.name}</p>
                    <p className="text-3xl font-black text-[#4D2D0E]">₹{plan.price.toLocaleString()}</p>
                    <p className="text-xs font-semibold text-gray-600">One-time</p>
                    <div className={`inline-block w-0 h-1 mt-1 rounded-full bg-orange-400 group-hover:w-full transition-all duration-300 ${selectedPlan?.id === plan.id ? 'w-full' : ''}`}></div>
                    <br />
                    <div className={`inline-block w-0 h-1 rounded-full mb-1 bg-green-600 group-hover:w-5 transition-all duration-300 ${selectedPlan?.id === plan.id ? 'w-5' : ''}`}></div>
                  </div>
                ))}
              </div>
              <div className="mt-6 bg-[#4D2D0E] p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10"><ShieldCheck size={100} /></div>
                <p className="text-xs font-black text-orange-400 uppercase tracking-widest mb-4 relative z-10">{t?.benefits}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                  {t?.lifetimeBenefits?.map((b, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm font-bold text-white/80">
                      <Star size={16} className="text-[#FF9933] flex-shrink-0" /> {b}
                    </div>
                  ))}
                  {(!t?.lifetimeBenefits || t.lifetimeBenefits.length === 0) && (
                    <p className="text-xs italic text-orange-200/50 col-span-2">Exclusive lifetime recognition.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form Checkout */}
          <div className="relative">
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl sticky top-24 border border-gray-100">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">Confirmation</h3>
              <form onSubmit={handlePayment} className="space-y-4">
                <div className="space-y-1">
                  <label className="font-semibold text-xs text-gray-600">Full Name <span className="text-red-500 font-bold">*</span></label>
                  <input type="text" name="name" required className="input-field py-4 font-bold" onChange={handleInputChange} />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-xs text-gray-600">WhatsApp Number <span className="text-red-500 font-bold">*</span></label>
                  <input type="tel" name="whatsapp" required className="input-field py-4 font-bold" onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-xs text-gray-600">Phone Number <span className="text-red-500 font-bold">*</span></label>
                  <div className="space-y-2">
                    <input type="tel" name="phone" required className="input-field py-4 font-bold" onChange={handleInputChange} value={formData.phone} />
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500" 
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, phone: formData.whatsapp });
                          }
                        }}
                      />
                      <span className="text-xs text-gray-600 font-medium">Same as WhatsApp number</span>
                    </label>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-xs text-gray-600">Email Address</label>
                  <input type="email" name="email" className="input-field py-4 font-bold" onChange={handleInputChange} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-xs text-gray-600">{t?.profession}</label>
                    <input type="text" name="profession" className="input-field py-3 font-bold text-sm" onChange={handleInputChange} />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-xs text-gray-600">{t?.referral}</label>
                    <input type="text" name="referral" className="input-field py-3 font-bold text-sm" onChange={handleInputChange} />
                  </div>
                </div>

                <TaxExemptionSection
                  formData={formData}
                  handleInputChange={handleInputChange}
                  setFormData={setFormData}
                />

                {selectedPlan && (
                  <div className="mt-8 pt-8 border-t border-gray-50 bg-gray-50/30 -mx-10 px-10 rounded-b-[3rem]">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <p className="font-black text-gray-400 text-xs">{selectedPlan.type} Tier</p>
                        <p className="font-black text-gray-800">{selectedPlan.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-[#FF9933]">₹{selectedPlan.price.toLocaleString()}</p>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full btn-primary py-5 text-xl flex items-center justify-center gap-3 shadow-orange-500/20 shadow-lg"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : <>Complete <ArrowRight /></>}
                    </button>
                  </div>
                )}

                {/* Test Payment Button - Remove in production */}
                {selectedPlan && (
                  <div className="mt-4 pt-4 border-t border-gray-50">
                    <button
                      type="button"
                      onClick={handleTestPayment}
                      className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-2xl transition-all"
                    >
                      Test Membership (Skip Payment)
                    </button>
                  </div>
                )}

                {!selectedPlan && (
                  <div className="mt-10 p-6 bg-orange-50 rounded-2xl border border-orange-100 text-center">
                    <p className="text-sm font-bold text-orange-800">Please select a plan from the left to proceed with membership.</p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Membership;
