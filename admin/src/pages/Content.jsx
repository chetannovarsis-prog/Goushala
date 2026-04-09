import React from 'react';
import { Settings, FileEdit, Layout } from 'lucide-react';

const Content = () => {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-4xl font-black text-gray-800 tracking-tighter uppercase">Content Management</h2>
        <p className="text-gray-400 font-medium">Update homepage banners, about text, and images</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
        <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm flex flex-col items-center text-center group hover:shadow-2xl transition-all duration-500">
          <div className="w-24 h-24 bg-orange-50 rounded-[2.5rem] flex items-center justify-center text-[#FF9933] mb-6 group-hover:bg-[#FF9933] group-hover:text-white transition-all duration-500 shadow-lg">
             <Layout size={40} />
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tight text-gray-800 mb-2">Homepage Editor</h3>
          <p className="text-gray-400 font-medium leading-relaxed max-w-xs">Modify hero sections, testimonials and trust indicators live on the site.</p>
          <button className="mt-8 btn-primary px-10 py-4 rounded-2xl opacity-50 cursor-not-allowed">Coming Soon</button>
        </div>

        <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm flex flex-col items-center text-center group hover:shadow-2xl transition-all duration-500">
          <div className="w-24 h-24 bg-blue-50 rounded-[2.5rem] flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-lg">
             <FileEdit size={40} />
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tight text-gray-800 mb-2">Notice Board</h3>
          <p className="text-gray-400 font-medium leading-relaxed max-w-xs">Post new updates, events or announcements for the Gurukul and devotees.</p>
          <button className="mt-8 bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold opacity-50 cursor-not-allowed">Coming Soon</button>
        </div>
      </div>
    </div>
  );
};

export default Content;
