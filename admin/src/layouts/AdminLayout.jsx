import React, { useState } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Heart, Utensils, GraduationCap, 
  Users, BookOpen, IndianRupee, Settings, LogOut, Menu, X, FileText, CreditCard
} from 'lucide-react';

import { useLanguage } from '../context/LanguageContext';
import { translations } from '../utils/translations';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const t = translations[language];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { name: t.dashboard, icon: LayoutDashboard, path: '/dashboard' },
    { name: t.donations, icon: Heart, path: '/donations' },
    { name: t.cowPricing, icon: IndianRupee, path: '/cow-pricing' },
    { name: t.bhandara, icon: Utensils, path: '/bhandara' },
    { name: t.gurukul, icon: BookOpen, path: '/gurukul' },
    { name: t.karyakarta, icon: Users, path: '/karyakarta' },
    { name: t.students, icon: GraduationCap, path: '/students' },
    { name: t.accounting, icon: FileText, path: '/accounting' },
    { name: t.memberships, icon: Users, path: '/memberships' },
    { name: t.membershipPlans, icon: CreditCard, path: '/membership-plans' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`bg-[#4D2D0E] text-white w-64 fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 z-50 shadow-2xl overflow-hidden`}>
        <div className="p-8 flex justify-between items-center bg-[#3a220a]">
          <span className="text-2xl font-black text-[#FF9933] tracking-tighter uppercase leading-none">Gau Admin</span>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden"><X /></button>
        </div>
        <nav className="p-4 mt-4 space-y-2 overflow-y-auto max-h-[calc(100vh-100px)] scrollbar-hide">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${location.pathname === item.path ? 'bg-[#FF9933] text-white shadow-lg scale-105' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <item.icon size={20} />
              <span className="font-bold">{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <header className="bg-white/80 backdrop-blur-md shadow-sm h-20 flex items-center px-8 sticky top-0 z-40 border-b border-gray-100 gap-6">
          {!sidebarOpen && <button onClick={() => setSidebarOpen(true)} className="mr-2 p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"><Menu size={20}/></button>}
          
          <div className="flex-1 flex items-center gap-4">
            {/* Integrated Language Toggle in Header */}
             <div className="flex bg-gray-100 p-1 rounded-full border border-gray-200">
                <button 
                  onClick={() => toggleLanguage('en')} 
                  className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest transition-all ${language === 'en' ? 'bg-[#FF9933] text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                >EN</button>
                <button 
                  onClick={() => toggleLanguage('hi')} 
                  className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest transition-all ${language === 'hi' ? 'bg-[#FF9933] text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                >हिन्दी</button>
             </div>
             <h2 className="text-xl font-bold text-gray-800 uppercase  hidden md:block">
               {navItems.find(i => i.path === location.pathname)?.name || 'Admin'}
             </h2>
          </div>

          <div className="flex items-center gap-6">
             <div className="flex items-center gap-3 pr-6 border-r border-gray-100">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-bold text-gray-800">Administrator</div>
                  <div className="text-xs text-gray-400">Main Office</div>
                </div>
                <div className="w-10 h-10 bg-[#4D2D0E] rounded-full flex items-center justify-center font-bold text-white shadow-lg border-2 border-white">AD</div>
             </div>
             
             <button 
               onClick={handleLogout}
               className="flex items-center gap-2 px-4 py-2 rounded-xl text-red-500 hover:bg-red-50 transition-all font-bold group"
             >
               <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
               <span className="hidden lg:block text-sm uppercase tracking-wider">{t.logout}</span>
             </button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
