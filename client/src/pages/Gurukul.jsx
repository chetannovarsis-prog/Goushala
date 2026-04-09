import React, { useState } from 'react';
import { BookOpen, GraduationCap, Users, MapPin, Phone, User, Calendar } from 'lucide-react';
import api from '../utils/api';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../utils/translations';

const Gurukul = () => {
  const { language } = useLanguage();
  const t = translations[language].gurukul;
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    age: '',
    parentName: '',
    phone: '',
    address: '',
    education: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};
    if (formData.studentName.trim().length < 3) newErrors.studentName = t.validation.studentName;
    if (!formData.age || formData.age < 5 || formData.age > 25) newErrors.age = t.validation.age;
    if (formData.parentName.trim().length < 3) newErrors.parentName = t.validation.parentName;
    if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = t.validation.phone;
    if (formData.address.trim().length < 10) newErrors.address = t.validation.address;
    if (!formData.education.trim()) newErrors.education = t.validation.education;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await api.post('/gurukul/apply', formData);
      setSubmitted(true);
    } catch (err) {
      alert(language === 'en' ? "Error submitting application" : "आवेदन जमा करने में त्रुटि");
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="py-20 bg-[#EDDDC7] min-h-[80vh] flex items-center">
        <div className="max-w-xl mx-auto px-4 bg-white p-12 rounded-3xl shadow-xl text-center space-y-6">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-900/10">
            <BookOpen className="w-10 h-10 text-[#2E7D32]" />
          </div>
          <h1 className="text-3xl font-bold">{language === 'en' ? 'Application Submitted!' : 'आवेदन जमा हो गया!'}</h1>
          <p className="text-gray-600">
            {language === 'en' 
              ? `Thank you for your interest in our Gurukul. Our management will review the application and contact you soon on `
              : `हमारे गुरुकुल में आपकी रुचि के लिए धन्यवाद। हमारा प्रबंधन आवेदन की समीक्षा करेगा और जल्द ही आपसे संपर्क करेगा: `}
            <strong>{formData.phone}</strong>.
          </p>
          <button onClick={() => setSubmitted(false)} className="btn-secondary w-full py-4 text-xl">
            {language === 'en' ? 'Apply for another student' : 'दूसरे छात्र के लिए आवेदन करें'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#EDDDC7]">
      {/* Banner Section */}
      <section className="relative h-[40vh] md:h-[60vh] overflow-hidden">
        <img 
          src="/Images/gurukul.png" 
          alt="Gurukul Banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-center px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-semibold text-white mb-4 drop-shadow-lg">{t.title}</h1>
            <p className="text-xl md:text-2xl text-green-50 italic drop-shadow-md font-medium">
              {language === 'en' ? '"Preserving Ancient Wisdom, Shaping Future Leaders"' : '"प्राचीन विद्या का संरक्षण, भविष्य के नायकों का निर्माण"'}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Info Side */}
          <div className="space-y-8">
            <div className="card p-8 bg-white/50 backdrop-blur-sm border-2 border-white">
              <h2 className="text-3xl font-semibold mb-6 flex items-center gap-2">
                <GraduationCap className="text-[#2E7D32]" /> 
                {language === 'en' ? 'Why Join Our Gurukul?' : 'हमारे गुरुकुल में क्यों शामिल हों?'}
              </h2>
              <div className="flex gap-2 mb-8">
                <div className="w-20 h-1 bg-[#2E7D32]"></div>
                <div className="w-10 h-1 bg-[#FF9933]"></div>
              </div>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="bg-[#FF9933] text-white p-2 rounded-lg h-fit"><BookOpen size={20} /></div>
                  <div>
                    <h4 className="font-bold text-lg">{language === 'en' ? 'Traditional Vedic Education' : 'पारंपरिक वैदिक शिक्षा'}</h4>
                    <p className="text-gray-600">
                      {language === 'en' ? 'Learning Vedas, Upanishads, and Sanskrit from experienced Acharyas.' : 'अनुभवी आचार्यों से वेदों, उपनिषदों और संस्कृत की शिक्षा।'}
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="bg-[#FF9933] text-white p-2 rounded-lg h-fit"><Users size={20} /></div>
                  <div>
                    <h4 className="font-bold text-lg">{language === 'en' ? 'Character Building' : 'चरित्र निर्माण'}</h4>
                    <p className="text-gray-600">
                      {language === 'en' ? 'Focus on discipline, moral values, and spiritual growth.' : 'अनुशासन, नैतिक मूल्यों और आध्यात्मिक विकास पर ध्यान।'}
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-[#2E7D32] text-white p-8 rounded-[2.5rem] relative overflow-hidden group shadow-2xl shadow-green-900/10">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">{language === 'en' ? 'Admission Process' : 'प्रवेश प्रक्रिया'}</h3>
                <p className="mb-4 text-green-50/80 font-medium">
                   {language === 'en' ? 'Submit the form, attend an interview, and start your journey of wisdom.' : 'फॉर्म जमा करें, साक्षात्कार में शामिल हों और ज्ञान की अपनी यात्रा शुरू करें।'}
                </p>
                <div className="text-sm border-t border-white/20 pt-4 flex items-center gap-2">
                   <div className="w-2 h-2 bg-[#FF9933] rounded-full animate-pulse"></div>
                   <span className="font-semibold opacity-90">{language === 'en' ? 'Call for queries:' : 'पूछताछ के लिए कॉल करें:'} +91 9988776655</span>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-110 transition-transform">
                <GraduationCap size={200} />
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 flex">
                 <div className="bg-[#FF9933] w-2/3 h-full"></div>
                 <div className="bg-white/20 w-1/3 h-full"></div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-white p-10 rounded-3xl shadow-2xl">
            <h2 className="text-3xl font-bold mb-8">{t.formTitle}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1 text-gray-700">{t.studentName}</label>
                  <div className="relative">
                    <User className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
                    <input type="text" name="studentName" className={`input-field pl-10 ${errors.studentName ? 'border-red-500' : ''}`} onChange={handleInputChange} />
                  </div>
                  {errors.studentName && <p className="text-red-500 text-xs mt-1">{errors.studentName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1 text-gray-700">{t.age}</label>
                  <div className="relative">
                    {/* <Calendar className="absolute right-3 top-3 text-gray-400 w-5 h-5" /> */}
                    <input type="number" name="age" className={`input-field pl-10 ${errors.age ? 'border-red-500' : ''}`} onChange={handleInputChange} />
                  </div>
                  {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1 text-gray-700">{t.parentName}</label>
                <input type="text" name="parentName" className={`input-field ${errors.parentName ? 'border-red-500' : ''}`} onChange={handleInputChange} />
                {errors.parentName && <p className="text-red-500 text-xs mt-1">{errors.parentName}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold mb-1 text-gray-700">{t.phone}</label>
                <div className="relative">
                  <Phone className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
                  <input type="tel" name="phone" className={`input-field pl-10 ${errors.phone ? 'border-red-500' : ''}`} onChange={handleInputChange} />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold mb-1 text-gray-700">{t.address}</label>
                <div className="relative">
                  <MapPin className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
                  <textarea name="address" className={`input-field pl-10 h-24 pt-2 ${errors.address ? 'border-red-500' : ''}`} onChange={handleInputChange}></textarea>
                </div>
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold mb-1 text-gray-700">{t.education}</label>
                <input type="text" name="education" className={`input-field ${errors.education ? 'border-red-500' : ''}`} placeholder={language === 'en' ? 'e.g. 5th Standard, School Name' : 'उदा. 5वीं कक्षा, स्कूल का नाम'} onChange={handleInputChange} />
                {errors.education && <p className="text-red-500 text-xs mt-1">{errors.education}</p>}
              </div>

              <button 
                disabled={loading}
                className="w-full btn-primary py-4 text-xl flex items-center justify-center gap-2"
              >
                {loading ? (language === 'en' ? 'Submitting...' : 'जमा हो रहा है...') : t.submit}
              </button>
            </form>
          </div>
        </div>

        {/* Philosophy Section */}
        <div className="mt-24 bg-white/40 backdrop-blur-md rounded-3xl p-8 md:p-16 border-2 border-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
             <div className="order-2 lg:order-1">
                <h2 className="text-4xl font-semibold text-[#4D2D0E] mb-6">{t.philosophyTitle}</h2>
                <div className="flex gap-2 mb-8">
                  <div className="w-20 h-1 bg-[#2E7D32]"></div>
                  <div className="w-10 h-1 bg-[#FF9933]"></div>
                </div>
                <p className="text-xl text-gray-600 leading-relaxed font-medium">
                  {t.philosophyText}
                </p>
                <div className="mt-10 grid grid-cols-2 gap-6">
                   <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                      <div className="text-[#2E7D32] font-bold text-lg mb-1">Sanskara</div>
                      <div className="text-gray-600 text-sm">{language === 'en' ? 'Values & Ethics' : 'मूल्य और नैतिकता'}</div>
                   </div>
                   <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                      <div className="text-[#2E7D32] font-bold text-lg mb-1">Vidya</div>
                      <div className="text-gray-600 text-sm">{language === 'en' ? 'Holistic Knowledge' : 'समग्र ज्ञान'}</div>
                   </div>
                </div>
             </div>
             <div className="order-1 lg:order-2">
                <div className="relative">
                   <img 
                      src="/Images/gurukul2.png" 
                      alt="Gurukul Life" 
                      className="rounded-3xl shadow-2xl w-full h-[400px] object-cover border-8 border-white"
                   />
                   <div className="absolute -bottom-6 -left-6 bg-[#2E7D32] text-white p-6 rounded-2xl shadow-xl hidden md:block border-l-8 border-[#FF9933]">
                      <div className="text-3xl font-bold mb-1">100%</div>
                      <div className="text-sm font-medium opacity-90">{language === 'en' ? 'Traditional Methods' : 'पारंपरिक विधियाँ'}</div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gurukul;
