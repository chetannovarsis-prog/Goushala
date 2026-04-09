import { useLanguage } from '../context/LanguageContext';
import { translations, getTranslation } from '../utils/translations';
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Home, Heart, Utensils, GraduationCap, Menu, X, ChevronDown, Globe, Star } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { language, toggleLanguage } = useLanguage();
  const t = getTranslation(language, 'nav');
  const logo = getTranslation(language, 'logo');

  const otherLanguages = [
    { code: 'mr', name: 'मराठी' },
    { code: 'gu', name: 'ગુજરાતી' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'kn', name: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'മലയാളം' }
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-t-4 border-t-[#FF9933]">
      <div className="absolute top-0 left-1/2 w-1/3 h-1 bg-[#2E7D32] -translate-x-1/2"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img src={logo} alt="Logo" className="h-28 w-auto object-contain py-2" />
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" className={({ isActive }) => `flex items-center font-bold transition-all ${isActive ? 'text-[#FF9933]' : 'text-gray-700 hover:text-[#FF9933]'}`}>
              <Home className="w-4 h-4 mr-1 text-[#FF9933]" /> {t.home}
            </NavLink>

            {/* <NavLink to="/donate-cow" className={({ isActive }) => `flex items-center font-bold transition-all ${isActive ? 'text-[#FF9933]' : 'text-gray-700 hover:text-[#FF9933]'}`}>
              <Heart className="w-4 h-4 mr-1 text-[#FF9933]" /> {t.donate}
            </NavLink>
            <NavLink to="/bhandara" className={({ isActive }) => `flex items-center font-bold transition-all ${isActive ? 'text-[#FF9933]' : 'text-gray-700 hover:text-[#FF9933]'}`}>
              <Utensils className="w-4 h-4 mr-1 text-[#FF9933]" /> {t.bhandara}
            </NavLink>
            <NavLink to="/gurukul" className={({ isActive }) => `flex items-center font-bold transition-all ${isActive ? 'text-[#2E7D32]' : 'text-gray-700 hover:text-[#2E7D32]'}`}>
              <GraduationCap className="w-4 h-4 mr-1 text-[#2E7D32]" /> {t.gurukul}
            </NavLink>
            <NavLink to="/membership" className={({ isActive }) => `flex items-center font-bold transition-all ${isActive ? 'text-[#FF9933]' : 'text-gray-700 hover:text-[#FF9933]'}`}>
              <Star className="w-4 h-4 mr-1 text-[#FF9933]" /> {t.membership}
            </NavLink> */}
            
            <NavLink to="#" className={`flex items-center font-bold transition-all  'text-[#FF9933]' : 'text-gray-700 hover:text-[#FF9933]'}`}>
              Vision & Mission
            </NavLink>
            <NavLink to="#" className={`flex items-center font-bold transition-all  'text-[#FF9933]' : 'text-gray-700 hover:text-[#FF9933]'}`}>
              Activities
            </NavLink>



            <div className="flex items-center gap-2">
              <div className="flex bg-gray-100 p-1 rounded-xl shadow-sm border border-gray-200">
                <button onClick={() => toggleLanguage('en')} className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${language === 'en' ? 'bg-white shadow-sm text-[#FF9933]' : 'text-gray-400 hover:text-gray-600'}`}>EN</button>
                <button onClick={() => toggleLanguage('hi')} className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${language === 'hi' ? 'bg-white shadow-sm text-[#FF9933]' : 'text-gray-400 hover:text-gray-600'}`}>हिन्दी</button>
              </div>

              {/* More Languages Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-3 py-2.5 rounded-xl text-xs font-bold text-gray-600 transition-all border border-gray-200 uppercase">
                  <Globe className="w-4 h-4" />
                  <span>More</span>
                  <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform" />
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[60] overflow-hidden py-2">
                  <div className="grid grid-cols-1 divide-y divide-gray-50 max-h-[60vh] overflow-y-auto">
                    {otherLanguages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => toggleLanguage(lang.code)}
                        className={`px-4 py-3 text-left text-sm hover:bg-orange-50 transition-colors flex items-center justify-between ${language === lang.code ? 'text-[#FF9933] font-bold bg-orange-50' : 'text-gray-700'}`}
                      >
                        {lang.name}
                        {language === lang.code && <div className="w-1.5 h-1.5 bg-[#FF9933] rounded-full shadow-[0_0_8px_rgba(255,153,51,0.6)]"></div>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Link to="/donate-cow" className="btn-primary">
              {t.donate}
            </Link>
          </div>
          <div className="md:hidden flex items-center gap-4">
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button onClick={() => toggleLanguage(language === 'en' ? 'hi' : 'en')} className="px-3 py-1 text-xs font-black text-gray-600 uppercase">
                {language === 'en' ? 'HI' : 'EN'}
              </button>
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/" className={({ isActive }) => `block px-3 py-2 font-medium ${isActive ? 'text-[#FF9933] bg-orange-50 rounded-lg' : 'text-gray-700 hover:text-[#FF9933]'}`}>{t.home}</NavLink>
            <NavLink to="/donate-cow" className={({ isActive }) => `block px-3 py-2 font-medium ${isActive ? 'text-[#FF9933] bg-orange-50 rounded-lg' : 'text-gray-700 hover:text-[#FF9933]'}`}>{t.donate}</NavLink>
            <NavLink to="/bhandara" className={({ isActive }) => `block px-3 py-2 font-medium ${isActive ? 'text-[#FF9933] bg-orange-50 rounded-lg' : 'text-gray-700 hover:text-[#FF9933]'}`}>{t.bhandara}</NavLink>
            <NavLink to="/gurukul" className={({ isActive }) => `block px-3 py-2 font-medium ${isActive ? 'text-[#2E7D32] bg-green-50 rounded-lg' : 'text-gray-700 hover:text-[#2E7D32]'}`}>{t.gurukul}</NavLink>
            <NavLink to="/membership" className={({ isActive }) => `block px-3 py-2 font-medium ${isActive ? 'text-[#FF9933] bg-orange-50 rounded-lg' : 'text-gray-700 hover:text-[#FF9933]'}`}>{t.membership}</NavLink>
            <div className="mt-8 px-3">
              <p className="text-xs font-bold text-gray-400 mb-3 ml-1">SELECT LANGUAGE</p>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => toggleLanguage('en')} className={`py-2 rounded-lg text-xs font-bold ${language === 'en' ? 'bg-[#FF9933] text-white' : 'bg-gray-100 text-gray-600'}`}>English</button>
                <button onClick={() => toggleLanguage('hi')} className={`py-2 rounded-lg text-xs font-bold ${language === 'hi' ? 'bg-[#FF9933] text-white' : 'bg-gray-100 text-gray-600'}`}>हिन्दी</button>
              </div>
              {/* <div className="grid grid-cols-3 gap-2 mt-2">
                {otherLanguages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => toggleLanguage(lang.code)}
                    className={`py-2 rounded-lg text-[10px] font-bold ${language === lang.code ? 'bg-[#FF9933] text-white' : 'bg-gray-100 text-gray-600'}`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div> */}
              <Link to="/donate-cow" className="w-full btn-primary block text-center mt-6 py-4">{t.donate}</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
