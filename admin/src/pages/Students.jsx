import React, { useState, useEffect } from 'react';
import { GraduationCap, Calendar, FileText, Search, User } from 'lucide-react';
import api from '../utils/api';

const Students = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    api.get('/admin/students').then(res => setStudents(res.data));
  }, []);

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-4xl font-black text-gray-800 tracking-tighter uppercase">Enrolled Students</h2>
        <p className="text-gray-400 font-medium">Digital records of active Gurukul learners</p>
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 bg-gray-50/20 flex gap-4">
           <div className="relative flex-1">
             <Search className="absolute right-4 top-4 text-gray-300" size={20} />
             <input type="text" placeholder="Search student by name or id..." className="input-field pl-12 py-4" />
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-10 py-6">Learner Identity</th>
                <th className="px-10 py-6">Academic Background</th>
                <th className="px-10 py-6">Registry Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {students.map(s => (
                <tr key={s.id} className="hover:bg-gray-50/30 transition-all duration-300 group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm"><User size={24} /></div>
                      <div>
                        <div className="text-xl font-black text-gray-800 tracking-tight uppercase">{s.name}</div>
                        <div className="text-[10px] font-black text-blue-400 uppercase tracking-[2px] mt-1">ID: #GUR-{s.id.slice(-4).toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="max-w-xs">
                      <p className="text-gray-700 font-bold leading-tight">{s.details}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-400 font-black"><GraduationCap size={14} /> <span className="uppercase tracking-widest">Gurukul Verified</span></div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                     <div className="text-gray-400 text-sm font-bold flex items-center gap-2"><Calendar size={16} className="text-orange-300" /> {new Date(s.admittedAt).toLocaleDateString()}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {students.length === 0 && (
            <div className="text-center py-32 text-gray-300 font-black uppercase tracking-widest border-t-2 border-dashed border-gray-100">
              Zero Academic Records Found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Students;
