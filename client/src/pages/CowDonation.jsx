import React, { useState, useEffect } from 'react';
import { Minus, Plus, Heart, ShieldCheck, Loader2, ShoppingBag, X, ChevronRight, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useLanguage } from '../context/LanguageContext';
import { translations, getTranslation } from '../utils/translations';
import TaxExemptionSection from '../components/TaxExemptionSection';

const fodderItems = [
  { id: 'green-fodder', name: 'Green Fodder', nameHi: 'हरा चारा', price: 500, unit: '100 Kg', desc: 'Green crops like legume crops, cereal crops, grass crops', image: '/Images/fooder1.png' },
  { id: 'gud', name: 'Gud - jaggery', nameHi: 'गुड़', price: 800, unit: '10 Kg Bag', desc: 'A sweet solid food substance obtained from the juice of sugarcane', image: '/Images/cowDonation/gud_jeggary.png' },
  { id: 'husk', name: 'Husk - wheat Straw', nameHi: 'गेहूं का भूसा', price: 700, unit: '100 Kg', desc: 'Stalk that remains after the wheat grain has been harvested', image: '/Images/cowDonation/husk-wheat.png' },
  { id: 'khal', name: 'Khal - mustard Cake', nameHi: 'सरसों की खल', price: 850, unit: '20 Kg Bag', desc: 'The solid residue left after oil is extracted from mustard seeds', image: '/Images/cowDonation/khal-mustered.png' },
  { id: 'chokar', name: 'Chokar - wheat Bran', nameHi: 'गेहूं का चोकर', price: 600, unit: '20 Kg Bag', desc: 'The outer shell of wheat is called bran', image: '/Images/cowDonation/choker-wheat.png' },
  { id: 'chana', name: 'Channa Churi', nameHi: 'चना चूरी', price: 1000, unit: '15 Kg Bag', desc: 'Chickpea is an annual legume. It is also known as gram', image: '/Images/cowDonation/chana-churi.png' },
  { id: 'roti', name: '2 Rotis With Gud Daily', nameHi: 'प्रतिदिन गुड़ के साथ 2 रोटियां', price: 900, unit: 'Per Month', desc: '2 Wheat Rotis well prepared and baked will be served with Jaggery daily', image: '/Images/cowDonation/roti-gud.png' },
  { id: 'cotton-seed', name: 'Cotton Seed Cake', nameHi: 'बिनौला खल', price: 900, unit: '20 Kg Bag', desc: 'Cottonseed Cake is a nutrient-rich byproduct obtained after oil extraction', image: '/Images/cowDonation/cotton-seed.png' },
  { id: 'healthy-feed', name: 'Healthy Gau Feed', nameHi: 'स्वस्थ गौ आहार', price: 1200, unit: '40 Kg Bag', desc: 'Cattle Feed is a balanced and scientifically formulated nutritional mix', image: '/Images/healthy.png' },
];

const sevaCategories = [
  { id: 'feed', title: 'Feed Cows', titleHi: 'गौ ग्रास', desc: 'We feed our gauvansh a variety of fodder types. Select the specific fodder you wish to donate.', descHi: 'हम अपने गौवंश को विभिन्न प्रकार का चारा खिलाते हैं। वह विशिष्ट चारा चुनें जिसे आप दान करना चाहते हैं।', image: '/Images/fooder1.png' },
  { id: 'care', title: 'Monthly Care', titleHi: 'मासिक सेवा', desc: 'Provides shelter for destitute cows and bulls, often abandoned by their owners.', descHi: 'बेसहारा गायों और बैलों को आश्रय प्रदान करता है, जिन्हें अक्सर उनके मालिकों द्वारा छोड़ दिया जाता है।', image: '/Images/healthy.png' },
  { id: 'medical', title: 'Medical Seva', titleHi: 'चिकित्सा सेवा', desc: 'We primarily shelter elderly and destitute gauvansh rescued from critical conditions.', descHi: 'हम मुख्य रूप से गंभीर स्थितियों से बचाए गए बुजुर्ग और बेसहारा गौवंश को आश्रय देते हैं।', image: '/Images/4.png' },
  { id: 'construction', title: 'Construction', titleHi: 'निर्माण सेवा', desc: 'With the growing number of gauvansh each month, we continually need to construct new cow sheds.', descHi: 'हर महीने गौवंश की बढ़ती संख्या के साथ, हमें लगातार नए गौशालाओं के निर्माण की आवश्यकता होती है।', image: '/Images/3.png' },
  { id: 'pehli-roti', title: 'Pehli Roti', titleHi: 'पहली रोटी', desc: 'You can feed pehli roti to the cows. Select from the item list for your contributions.', descHi: 'आप गायों को पहली रोटी खिला सकते हैं। अपने योगदान के लिए आइटम सूची से चयन करें।', image: '/Images/cowDonation/roti-gud.png' },
  { id: 'monthly-medical', title: 'Monthly Medical Seva', titleHi: 'मासिक चिकित्सा सेवा', desc: 'With your seva, we will provide full medical care to one cow or bull for an entire month.', descHi: 'आपकी सेवा से, हम एक पूरे महीने के लिए एक गाय या बैल को पूर्ण चिकित्सा देखभाल प्रदान करेंगे।', image: '/Images/banner.png' },
];

const CowDonation = () => {
  const { language } = useLanguage();
  const t = getTranslation(language, 'cowDonation');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(5000);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isItemized, setIsItemized] = useState(false); // Toggle between Sponsorship and Cart
  const [selectedItems, setSelectedItems] = useState({});
  const [activeCategory, setActiveCategory] = useState(null);
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
    const fetchPrice = async () => {
      try {
        const res = await api.get('/admin/cow-price');
        setPrice(res.data.price);
      } catch (err) {
        console.error("Failed to fetch price", err);
      }
    };
    fetchPrice();
  }, []);

  // Calculate items in cart including virtual sponsorship item
  const fodderItemsInCart = Object.entries(selectedItems)
    .filter(([id, qty]) => qty > 0 && id !== 'sponsorship')
    .map(([id, qty]) => {
      const item = fodderItems.find(i => i.id === id);
      return { ...item, qty };
    });

  const sponsorshipInCart = selectedItems['sponsorship'] > 0 
    ? { id: 'sponsorship', name: 'Annual Cow Sponsorship', nameHi: 'वार्षिक गौ प्रायोजन', price: price, qty: selectedItems['sponsorship'], image: '/Images/donate.png' }
    : null;

  const allItemsInCart = sponsorshipInCart ? [sponsorshipInCart, ...fodderItemsInCart] : fodderItemsInCart;

  const itemsTotal = allItemsInCart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const updateItemQty = (id, delta) => {
    setSelectedItems(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta)
    }));
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e, customAmount, paymentType) => {
    if (e) e.preventDefault();
    if (!formData.whatsapp) {
      alert(language === 'en' ? "WhatsApp number is required to proceed!" : "आगे बढ़ने के लिए व्हाट्सएप नंबर आवश्यक है!");
      return;
    }

    const finalAmount = customAmount || (isItemized ? itemsTotal : price);
    if (finalAmount <= 0) return alert("Invalid amount");

    setLoading(true);
    try {
      const res = await loadRazorpay();
      if (!res) {
        alert('Razorpay SDK failed to load. Are you online?');
        setLoading(false);
        return;
      }

      const orderRes = await api.post('/donations/create-order', {
        ...formData,
        amount: finalAmount,
        type: paymentType || (isItemized ? 'items' : 'cow'),
        quantity: isItemized ? 1 : 1,
        items: isItemized ? selectedItems : null
      });

      const { order, donationId } = orderRes.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Gaushala Donation",
        description: isItemized ? "Unified Seva Donation" : `Support Cow Sponsorship`,
        order_id: order.id,
        handler: async (response) => {
          try {
            await api.post('/donations/verify-payment', {
              ...response,
              donationId
            });
            navigate('/success', { state: { donation: { ...formData, amount: finalAmount, type: isItemized ? 'items' : 'cow', id: donationId } } });
          } catch (err) {
            alert("Verification failed but payment might be successful. Contact support.");
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: "#8B1E16"
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (err) {
      console.error(err);
      alert("Error initiating payment");
    }
    setLoading(false);
  };

  const handleAdoptCow = () => {
    updateItemQty('sponsorship', quantity);
    setIsItemized(true);
    // Smooth scroll to form
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      {/* Main Donation Section */}
      <div className="py-16 bg-[#EDDDC7]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Side - Info */}
            <div className="space-y-8 animate-in slide-in-from-left duration-700">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-semibold text-[#4D2D0E] mb-4">{t.title}</h1>
                <div className="flex gap-2">
                  <div className="w-20 h-1.5 bg-[#FF9933] rounded-full"></div>
                  <div className="w-10 h-1.5 bg-[#2E7D32] rounded-full"></div>
                </div>
              </div>
              <p className="text-xl text-gray-600 font-medium leading-relaxed">
                {language === 'en' ? 'Support the healthcare, nutrition, and shelter of our sacred gau-matas. Your contribution directly impacts their well-being.' : 'हमारी पवित्र गौ-माताओं की स्वास्थ्य सेवा, पोषण और आश्रय में सहायता करें। आपका योगदान सीधे उनके कल्याण को प्रभावित करता है।'}
              </p>
              
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-yellow-100 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-10 -mt-10 group-hover:scale-125 transition-all duration-700"></div>
                  
                  <div className="flex justify-between items-start relative z-10 mb-8 border-b border-gray-100 pb-8">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2E7D32] mb-1">
                        {language === 'en' ? 'Service Cost' : 'सेवा शुल्क'}
                      </div>
                      <div className="text-6xl font-black text-[#4D2D0E] flex items-baseline gap-2">
                        <span className="text-[#FF9933]">₹{price.toLocaleString()}</span>
                        <span className="text-sm font-semibold text-gray-400">
                          {language === 'en' ? 'per cow / year' : 'प्रति गाय / वर्ष'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 flex flex-wrap items-center gap-6 justify-between">
                    <div className="space-y-2">
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Quantity</div>
                      <div className="bg-[#FAF7F2] p-1.5 rounded-2xl border border-orange-100 flex items-center gap-4">
                        <button 
                          type="button" 
                          onClick={() => setQuantity(q => Math.max(1, q - 1))}
                          className="w-10 h-10 rounded-xl bg-white border border-orange-100 flex items-center justify-center text-[#8B1E16] hover:bg-[#8B1E16] hover:text-white transition-all shadow-sm active:scale-90"
                        >
                          <Minus size={18} />
                        </button>
                        <span className="text-2xl font-black text-[#4D2D0E] min-w-[2rem] text-center">{quantity}</span>
                        <button 
                          type="button" 
                          onClick={() => setQuantity(q => q + 1)}
                          className="w-10 h-10 rounded-xl bg-white border border-green-100 flex items-center justify-center text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white transition-all shadow-sm active:scale-90"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Subtotal</div>
                      <div className="text-3xl font-bold text-[#4D2D0E]">₹{(price * quantity).toLocaleString()}</div>
                    </div>

                    <button 
                      onClick={handleAdoptCow}
                      className="flex-grow md:flex-grow-0 px-8 py-4 bg-[#8B1E16] text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-[#8B1E16]/30 hover:bg-[#6D1610] active:scale-95 transition-all"
                    >
                      <Heart size={20} className="fill-white" />
                      Adopted Cow
                    </button>
                  </div>
                  
                  <p className="mt-8 text-gray-500 relative z-10 text-sm italic font-medium">
                    {language === 'en' ? 'Includes high-quality fodder, regular vet checkups, and 24/7 care.' : 'इसमें उच्च गुणवत्ता वाला चारा, नियमित पशु-चिकित्सक जांच और 24/7 देखभाल शामिल है।'}
                  </p>
                </div>

                <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white transition-all hover:scale-[1.01] duration-500">
                  <img src="/Images/donate.png" alt="Donate Cow" className="w-full h-auto object-cover" />
                </div>
              </div>
            </div>

            {/* Right Side - Form Card */}
            <div className="relative overflow-hidden rounded-[2.5rem] border border-orange-100 bg-white/95 p-8 md:p-12 shadow-2xl backdrop-blur-sm animate-in slide-in-from-right duration-700">
              <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-[#FF9933] via-[#FACC15] to-[#2E7D32]" />
              <div className="space-y-6 relative">
                <div className="space-y-3 pb-2 border-b border-gray-100 flex justify-between items-start">
                  <div>
                    <p className="text-lg text-[#4D2D0E] font-black">{isItemized ? (language === 'en' ? 'Cart Summary' : 'दान की सूची') : (language === 'en' ? 'Cow Sponsorship' : 'गौ सहायता')}</p>
                    <h2 className="text-3xl font-bold text-[#1F2937]">{isItemized ? (language === 'en' ? 'Review & Donate' : (language === 'en' ? 'Complete your donation' : 'अपना दान पूरा करें')) : (language === 'en' ? 'Complete your donation' : 'अपना दान पूरा करें')}</h2>
                  </div>
                  {isItemized && (
                    <button 
                      onClick={() => { setIsItemized(false); setSelectedItems({}); }}
                      className="text-[#8B1E16] text-xs font-bold border-b border-[#8B1E16] pb-0.5 hover:text-red-500 hover:border-red-500 transition-all"
                    >
                      {language === 'en' ? 'Clear & Go Back' : 'साफ़ करें और वापस जाएं'}
                    </button>
                  )}
                </div>

                <form onSubmit={handlePayment} className="space-y-6">
                  {/* Unified Cart Summary */}
                  {isItemized && (
                    <div className="space-y-3 bg-[#FAF7F2] p-5 rounded-2xl border border-orange-50 shadow-inner">
                      {allItemsInCart.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-sm pb-4 border-b border-orange-100/30 last:border-0 last:pb-0">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-white shadow-sm border border-orange-50">
                              <img src={item.image} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-700 leading-tight">{language === 'en' ? item.name : item.nameHi}</span>
                              <span className="text-[10px] text-gray-400 font-bold">₹{item.price.toLocaleString()} / unit</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 bg-white p-1 rounded-lg border border-orange-100 shadow-sm">
                            <button 
                              type="button"
                              onClick={() => updateItemQty(item.id, -1)}
                              className="w-6 h-6 rounded flex items-center justify-center bg-gray-50 text-[#8B1E16] hover:bg-red-50 transition-colors"
                            >
                              <Minus size={12} strokeWidth={3} />
                            </button>
                            <span className="w-4 text-center font-black text-[#4D2D0E]">{item.qty}</span>
                            <button 
                              type="button"
                              onClick={() => updateItemQty(item.id, 1)}
                              className="w-6 h-6 rounded flex items-center justify-center bg-gray-50 text-[#2E7D32] hover:bg-green-50 transition-colors"
                            >
                              <Plus size={12} strokeWidth={3} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold mb-1 text-gray-700">{language === 'en' ? 'Donor Name' : 'दाता का नाम'}</label>
                      <input type="text" name="name" required className="input-field" onChange={handleInputChange} />
                    </div>
                    <div>
                      <label className="block font-bold mb-1 text-gray-700">{language === 'en' ? 'Phone Number' : 'फ़ोन नंबर'}</label>
                      <input type="tel" name="phone" required className="input-field" onChange={handleInputChange} />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-gray-700">{language === 'en' ? 'WhatsApp Number' : 'व्हाट्सएप नंबर'} <span className="text-red-500">*</span></label>
                    <input type="tel" name="whatsapp" required className="input-field" onChange={handleInputChange} />
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-gray-700">{language === 'en' ? 'Email Address' : 'ईमेल पता'}</label>
                    <input type="email" name="email" required className="input-field" onChange={handleInputChange} />
                  </div>

                  <TaxExemptionSection 
                    formData={formData} 
                    handleInputChange={handleInputChange} 
                    setFormData={setFormData} 
                  />

                  <div className="pt-6 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-xl font-medium text-gray-500">{t.total}:</span>
                      <span className="text-4xl font-bold text-[#FF9933]">
                        ₹{itemsTotal.toLocaleString()}
                      </span>
                    </div>
                    <button 
                      disabled={loading || (isItemized && allItemsInCart.length === 0)}
                      className="w-full rounded-3xl bg-[#8B1E16] text-white text-xl py-5 flex items-center justify-center gap-3 shadow-xl hover:bg-[#6D1610] transition-all font-bold"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : (language === 'en' ? `Donate Now` : `अभी दान करें`)}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gau Seva Categories Section */}
      <div className="py-24 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#4D2D0E] mb-4">
            {language === 'en' ? 'Other Gau Seva Categories' : 'अन्य गौ सेवा श्रेणियां'}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#FF9933] to-[#2E7D32] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sevaCategories.map((cat) => (
            <div 
              key={cat.id}
              className="bg-[#FEDB8F]/30 rounded-[2.5rem] p-6 border-2 border-orange-200/50 flex flex-col group transition-all hover:shadow-2xl hover:bg-white hover:-translate-y-2"
            >
              <div className="overflow-hidden rounded-[2rem] mb-6 aspect-video">
                <img 
                  src={cat.image} 
                  alt={cat.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
              </div>
              <h3 className="text-2xl font-bold text-[#4D2D0E] mb-3">
                {language === 'en' ? cat.title : cat.titleHi}
              </h3>
              <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                {language === 'en' ? cat.desc : cat.descHi}
              </p>
              
              <div className="space-y-4">
                <button className="text-[#8B1E16] font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                  Read more <ChevronRight size={16} />
                </button>
                <button 
                  onClick={() => {
                    if (cat.id === 'feed' || cat.id === 'pehli-roti') {
                      setIsModalOpen(true);
                      setActiveCategory(cat.id);
                    } else {
                      // Scroll to top form for other categories
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="w-full bg-[#8B1E16] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#8B1E16]/20 active:scale-95 transition-all"
                >
                  <ShoppingBag size={20} />
                  Add Items to donate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feed Cows Item Selection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#4D2D0E]/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#FAF7F2] w-full max-w-5xl max-h-[90vh] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white">
              <div>
                <h3 className="text-3xl font-bold text-[#4D2D0E]">
                  {language === 'en' ? 'Feed Cows' : 'गौ ग्रास'}
                </h3>
              </div>
              <div className="flex items-center gap-6">
                <div className="bg-[#8B1E16] text-white px-6 py-2.5 rounded-2xl font-black text-xl flex items-center gap-2">
                  Total : <span className="text-orange-300">₹{fodderItemsInCart.reduce((acc, i) => acc + (i.price * i.qty), 0).toLocaleString()}</span>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-3 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-2xl transition-all"
                >
                  <X size={28} />
                </button>
              </div>
            </div>

            {/* Modal Content - Scrollable Grid */}
            <div className="overflow-y-auto p-8 bg-gray-50/50">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fodderItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-3xl p-5 border border-orange-100 shadow-sm flex flex-col gap-4">
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] font-bold text-gray-800">
                        <Star className="w-3 h-3 text-[#FF9933] fill-[#FF9933]" /> 4.{Math.floor(Math.random() * 5) + 5}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-[#4D2D0E] text-lg mb-1">
                        {language === 'en' ? item.name : item.nameHi}
                      </h4>
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                        <span className="font-bold text-gray-700">Description :</span> {item.desc}
                      </p>
                    </div>

                    <div className="flex justify-between items-end mt-auto pt-4 border-t border-gray-50">
                      <div>
                        <div className="text-xl font-black text-[#4D2D0E]">₹{item.price}/-</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{item.unit}</div>
                      </div>
                      
                      <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                        <button 
                          onClick={() => updateItemQty(item.id, -1)}
                          className="w-8 h-8 rounded-lg bg-[#8B1E16] text-white flex items-center justify-center active:scale-90 transition-all"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-4 text-center font-black text-gray-700">{selectedItems[item.id] || 0}</span>
                        <button 
                          onClick={() => updateItemQty(item.id, 1)}
                          className="w-8 h-8 rounded-lg bg-[#8B1E16] text-white flex items-center justify-center active:scale-90 transition-all"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-8 border-t border-gray-100 bg-white flex justify-end gap-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-8 py-4 border-2 border-orange-200 text-[#4D2D0E] rounded-2xl font-bold hover:bg-orange-50 active:scale-95 transition-all"
              >
                Back To Main Cart
              </button>
              <button 
                onClick={() => { setIsItemized(true); setIsModalOpen(false); }}
                disabled={fodderItemsInCart.length === 0 || loading}
                className="px-12 py-4 bg-[#8B1E16] text-white rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-[#8B1E16]/20 disabled:opacity-50 disabled:grayscale active:scale-95 transition-all"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Proceed'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Star = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
  </svg>
);

export default CowDonation;
