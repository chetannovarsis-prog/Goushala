import React, { useState, useEffect, useRef } from 'react';
import { Minus, Plus, Heart, ShieldCheck, Loader2, ShoppingBag, X, Sparkles, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../utils/translations';
import TaxExemptionSection from '../components/TaxExemptionSection';

const fodderItems = [
  { id: 'green-fodder', name: 'Green Fodder', nameHi: 'हरा चारा', price: 500, unit: '100 Kg', desc: 'Green crops like legume crops, cereal crops, grass crops', image: '/Images/fooder1.png' },
  { id: 'gud', name: 'Gud - Jaggery', nameHi: 'गुड़', price: 800, unit: '10 Kg Bag', desc: 'A sweet solid food substance obtained from the juice of sugarcane', image: '/Images/cowDonation/gud_jeggary.png' },
  { id: 'husk', name: 'Husk - Wheat Straw', nameHi: 'गेहूं का भूसा', price: 700, unit: '100 Kg', desc: 'Stalk that remains after the wheat grain has been harvested', image: '/Images/cowDonation/husk-wheat.png' },
  { id: 'khal', name: 'Khal - Mustard Cake', nameHi: 'सरसों की खल', price: 850, unit: '20 Kg Bag', desc: 'The solid residue left after oil is extracted from mustard seeds', image: '/Images/cowDonation/khal-mustered.png' },
  { id: 'chokar', name: 'Chokar - Wheat Bran', nameHi: 'गेहूं का चोकर', price: 600, unit: '20 Kg Bag', desc: 'The outer shell of wheat is called bran', image: '/Images/cowDonation/choker-wheat.png' },
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
  const [isItemized, setIsItemized] = useState(false);
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
  const formCardRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await api.get('/admin/cow-price');
        if (res.data?.price) {
          setPrice(res.data.price);
        }
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
      return item ? { ...item, qty } : null;
    })
    .filter(Boolean);

  const sponsorshipInCart = selectedItems['sponsorship'] > 0
    ? { id: 'sponsorship', name: 'Annual Cow Sponsorship', nameHi: 'वार्षिक गौ प्रायोजन', price: price, qty: selectedItems['sponsorship'], image: '/Images/donate.png' }
    : null;

  const allItemsInCart = sponsorshipInCart ? [sponsorshipInCart, ...fodderItemsInCart] : fodderItemsInCart;
  const itemsTotal = allItemsInCart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const sponsorshipTotal = price * quantity;
  const displayTotal = isItemized ? itemsTotal : sponsorshipTotal;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const updateItemQty = (id, delta) => {
    setSelectedItems(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta)
    }));
  };

  const scrollToForm = () => {
    formCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

    const finalAmount = customAmount || displayTotal;
    if (finalAmount <= 0) return alert(language === 'en' ? "Please select at least one item or cow sponsorship." : "कृपया कम से कम एक विकल्प चुनें।");

    const totalQty = isItemized
      ? allItemsInCart.reduce((acc, item) => acc + item.qty, 0)
      : quantity;

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
        quantity: totalQty,
        items: isItemized ? selectedItems : null
      });

      const { order, donationId } = orderRes.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Gaushala Donation",
        description: isItemized ? "Unified Seva Donation" : `Support Cow Sponsorship (${quantity})`,
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
    if (isItemized) {
      setSelectedItems(prev => ({
        ...prev,
        sponsorship: quantity
      }));
    }
    scrollToForm();
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      {/* Main Donation Section */}
      <div className="py-10 md:py-14 bg-[#EDDDC7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left Side - Info & Sponsorship Card */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-orange-200 text-[#8B1E16] text-xs font-bold uppercase tracking-wider shadow-sm">
                  <Sparkles size={14} className="text-[#FF9933]" />
                  {language === 'en' ? 'Gau Seva & Protection' : 'गौ सेवा एवं संरक्षण'}
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-[#4D2D0E] tracking-tight">{t.title}</h1>
                <div className="flex gap-2">
                  <div className="w-20 h-1.5 bg-[#FF9933] rounded-full"></div>
                  <div className="w-10 h-1.5 bg-[#2E7D32] rounded-full"></div>
                </div>
                <p className="text-base md:text-lg text-[#5C4632] font-medium leading-relaxed pt-1">
                  {language === 'en'
                    ? 'Support the healthcare, nutrition, and shelter of our sacred gau-matas. Your contribution directly impacts their well-being.'
                    : 'हमारी पवित्र गौ-माताओं की स्वास्थ्य सेवा, पोषण और आश्रय में सहायता करें। आपका योगदान सीधे उनके कल्याण को प्रभावित करता है।'}
                </p>
              </div>

              {/* Service Cost Card */}
              <div className="bg-white p-6 md:p-7 rounded-3xl shadow-xl border border-orange-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-28 h-28 bg-green-50 rounded-full -mr-10 -mt-10 group-hover:scale-125 transition-all duration-700 pointer-events-none"></div>

                <div className="flex flex-wrap justify-between items-start gap-4 relative z-10 mb-5 border-b border-gray-100 pb-5">
                  <div>
                    <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#2E7D32] mb-1">
                      {language === 'en' ? 'Service Cost' : 'सेवा शुल्क'}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl md:text-5xl font-black text-[#FF9933]">₹{price.toLocaleString()}</span>
                      <span className="text-sm font-semibold text-gray-400">
                        {language === 'en' ? 'per cow / year' : 'प्रति गाय / वर्ष'}
                      </span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-[#2E7D32] text-xs font-bold border border-green-100">
                    <ShieldCheck size={14} />
                    {language === 'en' ? '80G Tax Exempt' : '80G कर मुक्त'}
                  </span>
                </div>

                <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      {language === 'en' ? 'Select Quantity' : 'संख्या चुनें'}
                    </div>
                    <div className="bg-[#FAF7F2] p-1 rounded-2xl border border-orange-100 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        aria-label="Decrease quantity"
                        className="w-9 h-9 rounded-xl bg-white border border-orange-100 flex items-center justify-center text-[#8B1E16] hover:bg-[#8B1E16] hover:text-white transition-all shadow-sm active:scale-90 cursor-pointer"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-xl font-black text-[#4D2D0E] min-w-[2rem] text-center">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(q => q + 1)}
                        aria-label="Increase quantity"
                        className="w-9 h-9 rounded-xl bg-white border border-green-100 flex items-center justify-center text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white transition-all shadow-sm active:scale-90 cursor-pointer"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                      {language === 'en' ? 'Subtotal' : 'उप-योग'}
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-[#4D2D0E]">₹{sponsorshipTotal.toLocaleString()}</div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAdoptCow}
                    className="w-full sm:w-auto px-6 py-3.5 bg-[#8B1E16] text-white rounded-2xl font-bold flex items-center justify-center gap-2.5 shadow-lg shadow-[#8B1E16]/25 hover:bg-[#6D1610] active:scale-95 transition-all cursor-pointer"
                  >
                    <Heart size={18} className="fill-white" />
                    {isItemized
                      ? (language === 'en' ? 'Add to Cart' : 'कार्ट में जोड़ें')
                      : (language === 'en' ? 'Sponsor Cow' : 'गौ सहायता करें')}
                  </button>
                </div>

                <p className="mt-5 pt-4 border-t border-gray-50 text-gray-500 relative z-10 text-xs md:text-sm font-medium flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[#2E7D32] flex-shrink-0" />
                  <span>
                    {language === 'en'
                      ? 'Includes high-quality fodder, regular vet checkups, and 24/7 care.'
                      : 'इसमें उच्च गुणवत्ता वाला चारा, नियमित पशु-चिकित्सक जांच और 24/7 देखभाल शामिल है।'}
                  </span>
                </p>
              </div>

              {/* Image Card */}
              <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white relative group">
                <img
                  src="/Images/donate.png"
                  alt="Donate Cow"
                  className="w-full h-60 md:h-72 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent p-5">
                  <p className="text-white text-sm font-semibold">
                    {language === 'en'
                      ? 'Every contribution nurtures a sacred life at our Gaushala.'
                      : 'आपका प्रत्येक योगदान हमारी गौशाला में एक पवित्र जीवन का पोषण करता है।'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Compact Sticky Form Card */}
            <div
              ref={formCardRef}
              className="lg:col-span-6 h-fit lg:sticky lg:top-28 relative overflow-hidden rounded-3xl border border-orange-100 bg-white p-6 md:p-8 shadow-2xl scroll-mt-28"
            >
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#FF9933] via-[#FACC15] to-[#2E7D32]" />

              <div className="space-y-4">
                {/* Header */}
                <div className="pb-3 border-b border-gray-100 flex justify-between items-start gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[#8B1E16] font-extrabold mb-1">
                      {isItemized
                        ? (language === 'en' ? 'Cart Summary' : 'दान की सूची')
                        : (language === 'en' ? 'Cow Sponsorship' : 'गौ सहायता')}
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#1F2937]">
                      {isItemized
                        ? (language === 'en' ? 'Review & Donate' : 'दान की समीक्षा करें')
                        : (language === 'en' ? 'Complete your donation' : 'अपना दान पूरा करें')}
                    </h2>
                  </div>
                  {isItemized && (
                    <button
                      type="button"
                      onClick={() => { setIsItemized(false); setSelectedItems({}); }}
                      className="text-[#8B1E16] text-xs font-bold border-b border-[#8B1E16] pb-0.5 hover:text-red-600 hover:border-red-600 transition-all whitespace-nowrap cursor-pointer"
                    >
                      {language === 'en' ? 'Clear & Go Back' : 'साफ़ करें और वापस जाएं'}
                    </button>
                  )}
                </div>

                <form onSubmit={handlePayment} className="space-y-4">
                  {/* Active Donation Summary */}
                  {!isItemized ? (
                    <div className="bg-[#FAF7F2] px-4 py-3 rounded-2xl border border-orange-100 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img src="/Images/donate.png" alt="Cow Sponsorship" className="w-11 h-11 rounded-xl object-cover border border-orange-100 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-[#4D2D0E] truncate">
                            {language === 'en' ? 'Annual Cow Sponsorship' : 'वार्षिक गौ प्रायोजन'}
                          </p>
                          <p className="text-xs text-gray-500 font-medium">
                            ₹{price.toLocaleString()} × {quantity} {language === 'en' ? (quantity > 1 ? 'cows' : 'cow') : 'गाय'}
                          </p>
                        </div>
                      </div>
                      <span className="text-base font-extrabold text-[#4D2D0E] whitespace-nowrap">
                        ₹{sponsorshipTotal.toLocaleString()}
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-2.5 bg-[#FAF7F2] p-4 rounded-2xl border border-orange-100 max-h-52 overflow-y-auto">
                      {allItemsInCart.length === 0 ? (
                        <div className="text-center py-3 space-y-2">
                          <p className="text-xs text-gray-500 font-medium">
                            {language === 'en' ? 'Your donation cart is empty.' : 'आपकी दान सूची खाली है।'}
                          </p>
                          <button
                            type="button"
                            onClick={() => setIsItemized(false)}
                            className="text-xs font-bold text-[#8B1E16] underline cursor-pointer"
                          >
                            {language === 'en' ? 'Switch to Cow Sponsorship' : 'गौ सहायता पर वापस जाएं'}
                          </button>
                        </div>
                      ) : (
                        allItemsInCart.map((item) => (
                          <div key={item.id} className="flex justify-between items-center text-sm pb-2.5 border-b border-orange-100/60 last:border-0 last:pb-0 gap-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white shadow-sm border border-orange-100 flex-shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="font-bold text-gray-700 leading-tight truncate">
                                  {language === 'en' ? item.name : item.nameHi}
                                </span>
                                <span className="text-[11px] text-gray-400 font-semibold">
                                  ₹{item.price.toLocaleString()} / unit
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-orange-100 shadow-sm flex-shrink-0">
                              <button
                                type="button"
                                onClick={() => updateItemQty(item.id, -1)}
                                className="w-6 h-6 rounded-lg flex items-center justify-center bg-gray-50 text-[#8B1E16] hover:bg-red-50 transition-colors cursor-pointer"
                              >
                                <Minus size={12} strokeWidth={3} />
                              </button>
                              <span className="w-5 text-center text-xs font-black text-[#4D2D0E]">{item.qty}</span>
                              <button
                                type="button"
                                onClick={() => updateItemQty(item.id, 1)}
                                className="w-6 h-6 rounded-lg flex items-center justify-center bg-gray-50 text-[#2E7D32] hover:bg-green-50 transition-colors cursor-pointer"
                              >
                                <Plus size={12} strokeWidth={3} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* Donor Fields - Compact 2x2 Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold mb-1 text-gray-700">
                        {language === 'en' ? 'Donor Name' : 'दाता का नाम'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        placeholder={language === 'en' ? 'Full name' : 'पूरा नाम'}
                        className="input-field py-2.5 px-3 text-sm"
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1 text-gray-700">
                        {language === 'en' ? 'Phone Number' : 'फ़ोन नंबर'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        placeholder={language === 'en' ? '10-digit mobile' : '10 अंकों का नंबर'}
                        className="input-field py-2.5 px-3 text-sm"
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1 text-gray-700">
                        {language === 'en' ? 'WhatsApp Number' : 'व्हाट्सएप नंबर'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="whatsapp"
                        required
                        value={formData.whatsapp}
                        placeholder={language === 'en' ? 'For receipt updates' : 'रसीद के लिए नंबर'}
                        className="input-field py-2.5 px-3 text-sm"
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1 text-gray-700">
                        {language === 'en' ? 'Email Address' : 'ईमेल पता'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        placeholder="you@example.com"
                        className="input-field py-2.5 px-3 text-sm"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <TaxExemptionSection
                    formData={formData}
                    handleInputChange={handleInputChange}
                    setFormData={setFormData}
                  />

                  <div className="pt-4 border-t border-gray-100 space-y-3.5">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-semibold text-gray-500">{t.total}:</span>
                      <span className="text-3xl font-extrabold text-[#FF9933]">
                        ₹{displayTotal.toLocaleString()}
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || (isItemized && allItemsInCart.length === 0)}
                      className="w-full rounded-2xl bg-[#8B1E16] text-white text-lg py-3.5 flex items-center justify-center gap-2.5 shadow-lg shadow-[#8B1E16]/25 hover:bg-[#6D1610] active:scale-[0.99] transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {loading ? <Loader2 className="animate-spin" size={20} /> : (language === 'en' ? 'Donate Now' : 'अभी दान करें')}
                    </button>

                    <p className="text-[11px] text-gray-400 font-medium flex items-center justify-center gap-1.5">
                      <Lock size={12} className="text-[#2E7D32]" />
                      {language === 'en' ? '100% Secure Payment via Razorpay • 80G Tax Benefit' : 'Razorpay द्वारा 100% सुरक्षित भुगतान • 80G कर लाभ'}
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gau Seva Categories Section */}
      <div className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#4D2D0E] mb-3">
            {language === 'en' ? 'Other Gau Seva Categories' : 'अन्य गौ सेवा श्रेणियां'}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#FF9933] to-[#2E7D32] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {sevaCategories.map((cat) => {
            const isFodderCategory = cat.id === 'feed' || cat.id === 'pehli-roti';
            return (
              <div
                key={cat.id}
                className="bg-white rounded-3xl p-5 border border-orange-100 shadow-md flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5"
              >
                <div className="overflow-hidden rounded-2xl mb-4 aspect-[16/10] bg-orange-50">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-xl font-bold text-[#4D2D0E] mb-2">
                  {language === 'en' ? cat.title : cat.titleHi}
                </h3>
                <p className="text-sm text-gray-600 mb-5 flex-grow leading-relaxed">
                  {language === 'en' ? cat.desc : cat.descHi}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    if (isFodderCategory) {
                      setActiveCategory(cat.id);
                      setIsModalOpen(true);
                    } else {
                      scrollToForm();
                    }
                  }}
                  className="w-full bg-[#8B1E16] hover:bg-[#6D1610] text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#8B1E16]/20 active:scale-95 transition-all cursor-pointer"
                >
                  <ShoppingBag size={18} />
                  {isFodderCategory
                    ? (language === 'en' ? 'Add Items to Donate' : 'दान के लिए वस्तुएं चुनें')
                    : (language === 'en' ? 'Contribute Now' : 'अभी योगदान करें')}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feed Cows Item Selection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#4D2D0E]/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#FAF7F2] w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="p-6 md:p-7 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4 bg-white">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-[#4D2D0E]">
                  {activeCategory === 'pehli-roti'
                    ? (language === 'en' ? 'Pehli Roti & Fodder Seva' : 'पहली रोटी एवं चारा सेवा')
                    : (language === 'en' ? 'Feed Cows' : 'गौ ग्रास')}
                </h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-[#8B1E16] text-white px-5 py-2 rounded-2xl font-black text-lg flex items-center gap-2">
                  {language === 'en' ? 'Total :' : 'कुल :'} <span className="text-orange-300">₹{fodderItemsInCart.reduce((acc, i) => acc + (i.price * i.qty), 0).toLocaleString()}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-2.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-2xl transition-all cursor-pointer"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Modal Content - Scrollable Grid */}
            <div className="overflow-y-auto p-6 md:p-7 bg-gray-50/50">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {fodderItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-3xl p-4 border border-orange-100 shadow-sm flex flex-col gap-3">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-50">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] font-bold text-[#4D2D0E] shadow-sm">
                        {item.unit}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-[#4D2D0E] text-base mb-1">
                        {language === 'en' ? item.name : item.nameHi}
                      </h4>
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                        {item.desc}
                      </p>
                    </div>

                    <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
                      <div>
                        <div className="text-lg font-black text-[#4D2D0E]">₹{item.price}/-</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{item.unit}</div>
                      </div>

                      <div className="flex items-center gap-2.5 bg-gray-50 p-1 rounded-xl border border-gray-100">
                        <button
                          type="button"
                          onClick={() => updateItemQty(item.id, -1)}
                          className="w-8 h-8 rounded-lg bg-[#8B1E16] text-white flex items-center justify-center active:scale-90 transition-all cursor-pointer"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-5 text-center font-black text-gray-700">{selectedItems[item.id] || 0}</span>
                        <button
                          type="button"
                          onClick={() => updateItemQty(item.id, 1)}
                          className="w-8 h-8 rounded-lg bg-[#8B1E16] text-white flex items-center justify-center active:scale-90 transition-all cursor-pointer"
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
            <div className="p-6 border-t border-gray-100 bg-white flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 border-2 border-orange-200 text-[#4D2D0E] rounded-2xl font-bold hover:bg-orange-50 active:scale-95 transition-all cursor-pointer"
              >
                {language === 'en' ? 'Back' : 'वापस'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsItemized(true);
                  setIsModalOpen(false);
                  setTimeout(scrollToForm, 100);
                }}
                disabled={fodderItemsInCart.length === 0 || loading}
                className="px-10 py-3 bg-[#8B1E16] text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-[#8B1E16]/20 disabled:opacity-50 disabled:grayscale active:scale-95 transition-all cursor-pointer"
              >
                {loading ? <Loader2 className="animate-spin" /> : (language === 'en' ? 'Proceed' : 'आगे बढ़ें')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CowDonation;
