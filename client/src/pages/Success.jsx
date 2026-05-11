import React, { useState, useRef } from 'react';
import { Download, CheckCircle, Home, Award } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../utils/translations';
import html2canvas from 'html2canvas';

const tierStyles = {
  Standard: { gradient: 'linear-gradient(135deg, #f97316, #ea580c)' },
  Silver: { gradient: 'linear-gradient(135deg, #94a3b8, #475569)' },
  Gold: { gradient: 'linear-gradient(135deg, #facc15, #f59e0b)' },
  Patron: { gradient: 'linear-gradient(135deg, #a855f7, #9333ea)' },
  Guardian: { gradient: 'linear-gradient(135deg, #34d399, #059669)' },
  Legacy: { gradient: 'linear-gradient(135deg, #0ea5e9, #0f172a)' },
};

const Success = () => {
  const location = useLocation();
  const donation = location.state?.donation;
  const membership = location.state?.membership;
  const { language } = useLanguage();
  const t = translations[language]?.success || translations.en.success;
  const cardRef = useRef(null);

  if (!donation && !membership) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold mb-4">{t.noTransaction}</h2>
        <Link to="/" className="btn-primary">{t.goHome}</Link>
      </div>
    );
  }

  const data = donation || membership;
  const isMembership = !!membership;

  const translatePlanName = (name) => {
    if (!name) return name;
    if (language === 'hi') {
      if (name.toLowerCase().includes('standard')) return 'मानक';
      if (name.toLowerCase().includes('silver')) return 'रजत';
      if (name.toLowerCase().includes('gold')) return 'स्वर्ण';
      if (name.toLowerCase().includes('patron')) return 'संरक्षक';
      if (name.toLowerCase().includes('guardian')) return 'अभिभावक';
      if (name.toLowerCase().includes('legacy')) return 'विरासत';
      if (name.toLowerCase().includes('lifetime')) return 'आजीवन';
    }
    return name;
  };

  const rawPlanName = isMembership ? data.planName || data.type : data.type;
  const planName = isMembership ? translatePlanName(rawPlanName) : data.type;
  const formattedAmount = data.amount?.toLocaleString(language === 'hi' ? 'hi-IN' : 'en-IN');

  const handleDownload = () => {
    const type = isMembership ? 'membership' : 'donation';
    const apiBase = String(import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
    const downloadUrl = `${apiBase}/api/certificates/generate/${type}/${data.id}`;
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', `${type}_receipt_${data.id}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadCard = async () => {
    const cardElement = cardRef.current;
    if (!cardElement) return alert('Card not found');

    try {
      const canvas = await html2canvas(cardElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: false,
        ignoreElements: (element) => {
          return element.tagName === 'LINK' || element.tagName === 'STYLE' || element.classList.contains('hidden');
        },
        onclone: (clonedDoc) => {
          // Remove any styles that might contain oklch colors
          const styles = clonedDoc.querySelectorAll('style, link[rel="stylesheet"]');
          styles.forEach(style => style.remove());
        }
      });

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.setAttribute('download', `membership-card-${data.memberId || data.id}.png`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error downloading card:', err);
      alert('Failed to download card. Please try again.');
    }
  };

  const getTierStyle = () => {
    const normalized = (rawPlanName || '').toString().trim();
    const match = Object.keys(tierStyles).find((tier) => normalized.toLowerCase().includes(tier.toLowerCase()));
    return tierStyles[match] || tierStyles.Standard;
  };

  const tierStyle = getTierStyle();
  const validUntil = isMembership
    ? (data.type === 'yearly' ? new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN') : t.lifetimeLabel)
    : null;

  return (
    <>
      <style>{`@keyframes cardBorderShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }`}</style>
      <div className="py-20 bg-[#EDDDC7] min-h-[80vh] flex items-center print:bg-white print:py-0">
        <div className="max-w-4xl mx-auto px-4 w-full">
        {/* Success Card - Hidden on Print */}
        <div className="bg-white p-10 rounded-3xl shadow-2xl text-center space-y-8 print:hidden">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
          </div>
          
          <div>
            <h1 className="text-4xl font-semibold mb-2">
              {isMembership
                ? t.welcomeTitle.replace('{name}', data.name)
                : t.thankYouTitle.replace('{name}', data.name)}
            </h1>
            <p className="text-xl text-gray-600 font-medium">
              {isMembership
                ? t.membershipSubtitle.replace('{planName}', planName)
                : t.donationSubtitle.replace('{amount}', formattedAmount)}
            </p>
          </div>

          {isMembership && (
            <div className="relative mx-auto max-w-[680px] rounded-[32px] p-[3px]" style={{ background: 'linear-gradient(120deg, #f97316, #f59e0b, #10b981, #3b82f6, #a855f7, #f97316)', backgroundSize: '300% 300%', animation: 'cardBorderShift 5s ease infinite' }}>
              <div ref={cardRef} style={{ borderRadius: '28px', overflow: 'hidden', backgroundColor: '#ffffff', boxShadow: '0 30px 80px rgba(0, 0, 0, 0.12)' }}>
                <div style={{ background: tierStyle.gradient, padding: '2.5rem 2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem' }}>
                    <div>
                      <p style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.25em', opacity: 0.85, fontWeight: 700, marginBottom: '0.5rem' }}>{t.membershipCardTitle}</p>
                      <h2 style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1 }}>{planName}</h2>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.25em', opacity: 0.85, fontWeight: 700 }}>{t.validUntilLabel}</p>
                      <p style={{ fontSize: '1.3rem', fontWeight: 700, marginTop: '0.5rem' }}>{validUntil}</p>
                    </div>
                  </div>
                </div>

                <div style={{ padding: '2rem', color: '#1f2937' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div style={{ borderLeft: '4px solid #f97316', paddingLeft: '1rem' }}>
                      <p style={{ color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.25em', fontWeight: 700, marginBottom: '0.6rem' }}>{t.cardMemberId}</p>
                      <p style={{ color: '#ea580c', fontSize: '1.3rem', fontWeight: 900 }}>#{data.memberId || data.id}</p>
                    </div>
                    <div style={{ borderLeft: '4px solid #3b82f6', paddingLeft: '1rem' }}>
                      <p style={{ color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.25em', fontWeight: 700, marginBottom: '0.6rem' }}>{t.cardTier}</p>
                      <p style={{ color: '#2563eb', fontSize: '1.1rem', fontWeight: 900, textTransform: 'capitalize' }}>{planName}</p>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px dashed #d1d5db', paddingTop: '1.75rem', marginTop: '1.75rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                      <div style={{ borderLeft: '4px solid #10b981', paddingLeft: '1rem' }}>
                        <p style={{ color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.25em', fontWeight: 700, marginBottom: '0.6rem' }}>{t.cardMembership}</p>
                        <p style={{ color: '#1f2937', fontSize: '1.1rem', fontWeight: 700 }}>{data.name}</p>
                      </div>
                      <div style={{ borderLeft: '4px solid #a855f7', paddingLeft: '1rem' }}>
                        <p style={{ color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.25em', fontWeight: 700, marginBottom: '0.6rem' }}>{t.cardContact}</p>
                        <p style={{ color: '#1f2937', fontSize: '1.1rem', fontWeight: 700 }}>{data.whatsapp || data.phone || data.email}</p>
                      </div>
                    </div>
                  </div>

                  <div style={{ background: 'linear-gradient(90deg, #fff7ed, #fef3c7)', borderRadius: '1rem', padding: '1.25rem', border: '1px solid #fcd38d', marginTop: '1.75rem' }}>
                    <p style={{ color: '#4b5563', fontSize: '0.95rem', textAlign: 'center', fontWeight: 500 }}>{t.cardMembershipNote}</p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb', marginTop: '1.75rem' }}>
                    <div>
                      <p style={{ color: '#9ca3af', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.2em', marginBottom: '0.35rem' }}>Valid From</p>
                      <p style={{ color: '#1f2937', fontSize: '0.95rem', fontWeight: 700 }}>{new Date().toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN')}</p>
                    </div>
                    <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: 'linear-gradient(135deg, #fb923c, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckCircle style={{ width: '1.6rem', height: '1.6rem', color: 'white' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-orange-50/50 p-6 rounded-[2rem] border-2 border-orange-100/50 text-left relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100/30 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div>
                <div className="text-[10px] uppercase text-gray-400 font-black tracking-widest mb-1">{isMembership ? t.membershipTier : t.donationType}</div>
                <div className="font-bold text-lg capitalize text-[#4D2D0E]">{planName}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase text-gray-400 font-black tracking-widest mb-1">{t.dateLabel}</div>
                <div className="font-bold text-lg text-[#4D2D0E]">{new Date().toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN')}</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-green-50 p-4 rounded-xl text-green-800 font-medium border border-green-100 flex items-center justify-center gap-2">
              <CheckCircle size={18} /> {t.detailsSent.replace('{whatsapp}', data.whatsapp)}
            </div>
            {data.require80G && (
              <div className="bg-blue-50 p-4 rounded-xl text-blue-800 font-medium border border-blue-100 flex items-center justify-center gap-2">
                <Award size={18} /> {t.certificateInfo}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            {isMembership && (
              <button
                type="button"
                onClick={handleDownloadCard}
                className="flex-1 btn-secondary py-5 text-lg flex items-center justify-center gap-3 border-2 border-orange-400 bg-white text-[#4D2D0E] hover:bg-orange-50 font-bold shadow-md transition-all"
              >
                <Download className="w-5 h-5" /> {t.downloadCard || 'Download Card'}
              </button>
            )}
            <button 
              onClick={handleDownload}
              className="flex-1 btn-primary py-5 text-lg flex items-center justify-center gap-3 shadow-orange-500/20 shadow-lg font-bold"
            >
              <Download className="w-6 h-6" /> {isMembership ? t.downloadCertificate : t.downloadReceipt}
            </button>
            <Link 
              to="/" 
              className="flex-1 bg-white border-2 border-orange-100 text-[#4D2D0E] font-bold py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-orange-50 transition-all"
            >
              <Home className="w-5 h-5" /> {t.backHome}
            </Link>
          </div>
          <div className="flex justify-center gap-1 pt-4">
            <div className="w-20 h-1 bg-[#FF9933] rounded-full"></div>
            <div className="w-8 h-1 bg-[#2E7D32] rounded-full"></div>
          </div>
        </div>

      </div>
    </div>
    </>
  );
};

export default Success;
