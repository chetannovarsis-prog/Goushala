import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations, getTranslation } from '../utils/translations';

const TaxExemptionSection = ({ formData, handleInputChange, setFormData }) => {
  const { language } = useLanguage();
  const t = getTranslation(language, 'membership.taxExemption');

  return (
    <div className="space-y-4 pt-4 border-t border-gray-100">
      <label className="flex items-center justify-center gap-3 cursor-pointer group">
        <div className="relative">
          <input
            type="checkbox"
            name="require80G"
            checked={formData.require80G}
            onChange={(e) => setFormData({ ...formData, require80G: e.target.checked })}
            className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-[#FF9933]/30 transition-all checked:border-[#FF9933] checked:bg-[#FF9933]"
          />
          <svg
            className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <span className="font-semibold text-gray-700 text-xs group-hover:text-[#FF9933] transition-colors">
          {t.title}
        </span>
      </label>

      {formData.require80G && (
        <div className="bg-orange-50/50 p-6 rounded-2xl border-2 border-orange-100 animate-in fade-in slide-in-from-top-2 duration-300">
          <p className="text-xs text-orange-800 font-semibold mb-4 flex items-center gap-2">
             <span>📋</span> {t.info}
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#4D2D0E]/50 mb-1">
                {t.address} <span className="text-red-500">*</span>
              </label>
              <textarea
                name="address"
                required={formData.require80G}
                value={formData.address || ''}
                onChange={handleInputChange}
                className="input-field min-h-[80px] py-3 text-sm"
                placeholder={t.addressPlaceholder}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#4D2D0E]/50 mb-1">
                {t.pan} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="pan"
                required={formData.require80G}
                value={formData.pan || ''}
                onChange={handleInputChange}
                className="input-field py-3 text-sm"
                placeholder={t.panPlaceholder}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxExemptionSection;
