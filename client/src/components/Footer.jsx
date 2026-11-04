import { useLanguage } from '../context/LanguageContext';
import { translations, getTranslation } from '../utils/translations';
import React from 'react';

const Footer = () => {
  const { language } = useLanguage();
  const logo = getTranslation(language, 'logo');
  const donateTitle = language === 'en' ? 'Donate Us' : 'दान करें';
  const bankLabel = language === 'en' ? 'Bank' : 'बैंक';
  const branchLabel = language === 'en' ? 'Branch' : 'शाखा';
  const accountLabel = language === 'en' ? 'Account Number' : 'खाता संख्या';
  const nameLabel = language === 'en' ? 'Account Holder' : 'खाता धारक';
  const ifscLabel = language === 'en' ? 'IFSC Code' : 'आईएफएससी कोड';

  const bankDetails = {
    bank: 'Axis Bank',
    branch: 'Vijay Nagar, Indore',
    accountNumber: '925020019347442',
    accountHolder: 'Jyotishiwala',
    ifsc: 'UTIB0000568',
  };

  const upiId = `${bankDetails.accountNumber}@${bankDetails.ifsc}.ifsc.npci`;
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(bankDetails.accountHolder)}&cu=INR&tn=${encodeURIComponent('Gaushala Donation')}`;
  const dynamicQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=8&data=${encodeURIComponent(upiUrl)}`;

  return (
    <footer className="bg-[#4D2D0E] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-10 items-start">
          <div className="xl:col-span-4 max-w-sm">
            <div className="mb-6">
               <img src={logo} alt="Logo" className="h-44 w-auto object-contain" />
            </div>
            <p className="text-gray-300 text-md leading-9">
              Dedicated to the protection and service of cows. Join us in our mission to bring divine blessings to every home.
            </p>
          </div>
          <div className="xl:col-span-2">
            <h3 className="text-lg font-bold mb-4 text-[#2E7D32]">Quick Links</h3>
            <ul className="space-y-3 text-gray-300 font-medium text-md">
              <li><a href="/donate-cow" className="hover:text-[#FF9933]">Cow Donation</a></li>
              <li><a href="/bhandara" className="hover:text-[#FF9933]">Bhandara</a></li>
              <li><a href="/gurukul" className="hover:text-[#FF9933]">Gurukul Admission</a></li>
            </ul>
          </div>
          <div className="xl:col-span-3 flex flex-col gap-3 text-sm font-medium">
            <h3 className="text-lg font-bold mb-4 text-[#FF9933]">Contact Us</h3>
            <p className="text-gray-300">Email: <a href="mailto:info@gaushala.com" className="hover:text-[#FF9933]">info@gaushala.com</a></p>
            <p className="text-gray-300">Phone: <a href="tel:+917789888000" className="hover:text-[#FF9933]">+91 77898 88000</a></p>
            <p className="text-gray-300">Address: <a href="https://maps.google.com/?q=Near+Akashvani+kendra+Station+Road,+Main+Market,+Najibabad,+UP+246763" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF9933]">Near Akashvani kendra Station Road, Main Market, Najibabad, UP 246763</a></p>
          </div>
          <div className="xl:col-span-3">
            <h3 className="text-2xl font-extrabold mb-5 text-[#FFB02E]">{donateTitle}</h3>
            <div className="inline-block rounded-2xl bg-[#173D34] p-4 shadow-lg shadow-black/20">
              <div className="overflow-hidden rounded-xl border-2 border-white/80 bg-white p-2">
                <a href={upiUrl} title="Scan or click to pay via UPI" className="block group">
                  <img
                    src={dynamicQrUrl}
                    onError={(e) => { e.currentTarget.src = "/Images/qr.png"; }}
                    alt={`Donation QR - ${bankDetails.accountHolder}`}
                    className="w-full max-w-[240px] h-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </a>
                <div className="text-center pt-2 pb-1 border-t border-gray-100 mt-2">
                  <span className="text-[11px] font-bold text-gray-700 tracking-wider uppercase">Scan to Pay via UPI</span>
                </div>
              </div>
            </div>
            <div className="mt-6 space-y-3 text-white text-base leading-relaxed max-w-xs">
              <p><span className="font-semibold">{bankLabel}</span> - {bankDetails.bank}</p>
              <p><span className="font-semibold">{branchLabel}</span> - {bankDetails.branch}</p>
              <p><span className="font-semibold">{accountLabel}</span> - {bankDetails.accountNumber}</p>
              <p><span className="font-semibold">{nameLabel}</span> - {bankDetails.accountHolder}</p>
              <p><span className="font-semibold">{ifscLabel}</span> - {bankDetails.ifsc}</p>
            </div>
          </div>
        </div>
        <p className="text-center text-gray-300 text-sm mt-10 px-4">
          Crafted with ❤️ by  
          <a
            href="https://www.novarsistech.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-yellow-300 hover:text-[#FF9933] ml-1 text-md animate-pulse font-bold transition-colors"
          >
            Novarsis Technologies
          </a>
        </p>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Gaushala Donation Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
